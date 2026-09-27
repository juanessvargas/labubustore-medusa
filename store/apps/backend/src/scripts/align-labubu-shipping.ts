import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  createServiceZonesWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateProductsWorkflow,
  updateShippingOptionsWorkflow,
} from "@medusajs/medusa/core-flows"

const COUNTRY_CODE = "ec"
const SHIPPING_OPTION_NAME = "Standard"
const SHIPPING_PRICE = 10
const CURRENCY_CODE = "usd"

export default async function alignLabubuShipping({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: allShippingOptions } = await query.graph({
    entity: "shipping_option",
    fields: [
      "id",
      "name",
      "shipping_profile_id",
      "shipping_profile.id",
      "shipping_profile.name",
      "provider_id",
      "service_zone.id",
      "service_zone.name",
      "service_zone.geo_zones.country_code",
    ],
  })

  logger.info(
    `ALL shipping options: ${JSON.stringify(
      allShippingOptions.map((option) => ({
        id: option.id,
        name: option.name,
        profile: option.shipping_profile?.name ?? option.shipping_profile_id,
        zone: option.service_zone?.name,
        countries: option.service_zone?.geo_zones?.map((z) => z.country_code),
      })),
      null,
      2
    )}`
  )

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id", "name", "type"],
  })

  logger.info(
    `Shipping profiles: ${JSON.stringify(
      shippingProfiles.map((profile) => ({
        id: profile.id,
        name: profile.name,
        type: profile.type,
      })),
      null,
      2
    )}`
  )

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "handle", "shipping_profile.id", "shipping_profile.name"],
  })

  const labubuProducts = products.filter((product) =>
    /labubu/i.test(`${product.title ?? ""} ${product.handle ?? ""}`)
  )

  logger.info(
    `LABUBU products and profiles: ${JSON.stringify(
      labubuProducts.map((product) => ({
        id: product.id,
        title: product.title,
        handle: product.handle,
        shipping_profile_id: product.shipping_profile?.id ?? null,
        shipping_profile_name: product.shipping_profile?.name ?? null,
      })),
      null,
      2
    )}`
  )

  logger.info(
    `ALL products and profiles: ${JSON.stringify(
      products.map((product) => ({
        title: product.title,
        handle: product.handle,
        shipping_profile_id: product.shipping_profile?.id ?? null,
        shipping_profile_name: product.shipping_profile?.name ?? null,
      })),
      null,
      2
    )}`
  )

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })
  const defaultSalesChannel =
    salesChannels.find((channel) => channel.name === "Default Sales Channel") ??
    salesChannels[0]
  if (!defaultSalesChannel) {
    throw new Error("Default Sales Channel was not found.")
  }

  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code", "countries.iso_2"],
  })
  const ecuadorRegion = regions.find((region) =>
    region.countries?.some(
      (country) => country?.iso_2?.toLowerCase() === COUNTRY_CODE
    )
  )
  if (!ecuadorRegion) {
    throw new Error("Ecuador region was not found.")
  }

  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: [
      "id",
      "name",
      "sales_channels.id",
      "sales_channels.name",
      "fulfillment_providers.id",
      "fulfillment_sets.id",
      "fulfillment_sets.name",
      "fulfillment_sets.type",
      "fulfillment_sets.service_zones.id",
      "fulfillment_sets.service_zones.name",
      "fulfillment_sets.service_zones.geo_zones.country_code",
      "fulfillment_sets.service_zones.shipping_options.id",
      "fulfillment_sets.service_zones.shipping_options.name",
      "fulfillment_sets.service_zones.shipping_options.shipping_profile_id",
      "fulfillment_sets.service_zones.shipping_options.shipping_profile.id",
      "fulfillment_sets.service_zones.shipping_options.shipping_profile.name",
      "fulfillment_sets.service_zones.shipping_options.provider_id",
      "fulfillment_sets.service_zones.shipping_options.prices.currency_code",
      "fulfillment_sets.service_zones.shipping_options.prices.amount",
      "fulfillment_sets.service_zones.shipping_options.prices.price_rules.value",
    ],
  })

  const stockLocation = stockLocations[0]
  if (!stockLocation) {
    throw new Error("No stock location was found.")
  }

  logger.info(
    `Stock location ${stockLocation.name} (${stockLocation.id}) sales channels=${JSON.stringify(
      stockLocation.sales_channels
    )} providers=${JSON.stringify(stockLocation.fulfillment_providers)}`
  )

  const linkedToSalesChannel = stockLocation.sales_channels?.some(
    (channel) => channel?.id === defaultSalesChannel.id
  )
  if (!linkedToSalesChannel) {
    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: {
        id: stockLocation.id,
        add: [defaultSalesChannel.id],
      },
    })
    logger.info("Linked Default Sales Channel to stock location.")
  }

  const hasManualProvider = stockLocation.fulfillment_providers?.some(
    (provider) => provider?.id === "manual_manual"
  )
  if (!hasManualProvider) {
    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: "manual_manual",
      },
    })
    logger.info("Linked manual fulfillment provider to stock location.")
  }

  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
  let fulfillmentSet = stockLocation.fulfillment_sets?.[0]
  if (!fulfillmentSet) {
    fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name: "Store delivery",
      type: "shipping",
    })
    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: fulfillmentSet.id,
      },
    })
    logger.info(`Created fulfillment set ${fulfillmentSet.name}.`)
  }

  const existingZones =
    stockLocation.fulfillment_sets?.flatMap((set) => set.service_zones ?? []) ??
    []

  let ecuadorZone = existingZones.find((zone) =>
    zone.geo_zones?.some(
      (geoZone) => geoZone?.country_code?.toLowerCase() === COUNTRY_CODE
    )
  )

  if (!ecuadorZone) {
    const { result } = await createServiceZonesWorkflow(container).run({
      input: {
        data: [
          {
            name: "Ecuador",
            fulfillment_set_id: fulfillmentSet.id,
            geo_zones: [
              {
                type: "country",
                country_code: COUNTRY_CODE,
              },
            ],
          },
        ],
      },
    })
    ecuadorZone = result[0]
    logger.info(`Created Ecuador service zone ${ecuadorZone.id}.`)
  }

  logger.info(
    `Service zone ${ecuadorZone.name} (${ecuadorZone.id}) geo=${JSON.stringify(
      ecuadorZone.geo_zones
    )}`
  )

  const standardOption = ecuadorZone.shipping_options?.find(
    (option) => option.name === SHIPPING_OPTION_NAME
  )

  logger.info(
    `Standard shipping option: ${JSON.stringify(
      {
        id: standardOption?.id ?? null,
        name: standardOption?.name ?? null,
        shipping_profile_id:
          standardOption?.shipping_profile_id ??
          standardOption?.shipping_profile?.id ??
          null,
        shipping_profile_name: standardOption?.shipping_profile?.name ?? null,
        provider_id: standardOption?.provider_id ?? null,
        prices: standardOption?.prices ?? null,
      },
      null,
      2
    )}`
  )

  let targetProfile =
    shippingProfiles.find((profile) =>
      /default/i.test(`${profile.name ?? ""} ${profile.type ?? ""}`)
    ) ??
    labubuProducts.find((product) => product.shipping_profile?.id)
      ?.shipping_profile ??
    shippingProfiles[0]

  if (!targetProfile) {
    const { result } = await createShippingProfilesWorkflow(container).run({
      input: {
        data: [
          {
            name: "Default Shipping Profile",
            type: "default",
          },
        ],
      },
    })
    targetProfile = result[0]
    logger.info(`Created shipping profile ${targetProfile.name}.`)
  }

  logger.info(
    `Using shipping profile ${targetProfile.name} (${targetProfile.id}).`
  )

  for (const product of labubuProducts) {
    if (product.shipping_profile?.id === targetProfile.id) {
      continue
    }
    await updateProductsWorkflow(container).run({
      input: {
        selector: { id: product.id },
        update: {
          shipping_profile_id: targetProfile.id,
        },
      },
    })
    logger.info(
      `Assigned ${product.title} to shipping profile ${targetProfile.name}.`
    )
  }

  if (!standardOption) {
    const { result } = await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: SHIPPING_OPTION_NAME,
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: ecuadorZone.id,
          shipping_profile_id: targetProfile.id,
          type: {
            label: "Standard",
            description: "Ship in 2-3 days.",
            code: "standard",
          },
          prices: [
            {
              currency_code: CURRENCY_CODE,
              amount: SHIPPING_PRICE,
            },
            {
              region_id: ecuadorRegion.id,
              amount: SHIPPING_PRICE,
            },
          ],
          rules: [
            {
              attribute: "enabled_in_store",
              value: "true",
              operator: "eq",
            },
            {
              attribute: "is_return",
              value: "false",
              operator: "eq",
            },
          ],
        },
      ],
    })
    logger.info(`Created Standard shipping option ${result[0].id}.`)
  } else if (
    standardOption.shipping_profile_id !== targetProfile.id &&
    standardOption.shipping_profile?.id !== targetProfile.id
  ) {
    await updateShippingOptionsWorkflow(container).run({
      input: [
        {
          id: standardOption.id,
          shipping_profile_id: targetProfile.id,
        },
      ],
    })
    logger.info(
      `Updated Standard shipping option to profile ${targetProfile.name}.`
    )
  } else {
    logger.info("Standard shipping option already uses the target profile.")
  }

  const mismatchedOptions = allShippingOptions.filter(
    (option) =>
      (option.shipping_profile_id ?? option.shipping_profile?.id) !==
      targetProfile.id
  )
  for (const option of mismatchedOptions) {
    await updateShippingOptionsWorkflow(container).run({
      input: [
        {
          id: option.id,
          shipping_profile_id: targetProfile.id,
        },
      ],
    })
    logger.info(
      `Updated shipping option ${option.name} (${option.id}) to ${targetProfile.name}.`
    )
  }

  const { data: verifiedProducts } = await query.graph({
    entity: "product",
    fields: ["id", "title", "shipping_profile.id", "shipping_profile.name"],
    filters: {
      id: labubuProducts.map((product) => product.id),
    },
  })

  const { data: verifiedLocations } = await query.graph({
    entity: "stock_location",
    fields: [
      "id",
      "name",
      "sales_channels.name",
      "fulfillment_providers.id",
      "fulfillment_sets.service_zones.id",
      "fulfillment_sets.service_zones.name",
      "fulfillment_sets.service_zones.geo_zones.country_code",
      "fulfillment_sets.service_zones.shipping_options.id",
      "fulfillment_sets.service_zones.shipping_options.name",
      "fulfillment_sets.service_zones.shipping_options.shipping_profile.id",
      "fulfillment_sets.service_zones.shipping_options.shipping_profile.name",
    ],
    filters: { id: stockLocation.id },
  })

  const verifiedZone = verifiedLocations[0]?.fulfillment_sets
    ?.flatMap((set) => set.service_zones ?? [])
    ?.find((zone) =>
      zone.geo_zones?.some(
        (geoZone) => geoZone?.country_code?.toLowerCase() === COUNTRY_CODE
      )
    )
  const verifiedOption = verifiedZone?.shipping_options?.find(
    (option) => option.name === SHIPPING_OPTION_NAME
  )

  logger.info(
    `VERIFY products: ${JSON.stringify(
      verifiedProducts.map((product) => ({
        title: product.title,
        profile: product.shipping_profile?.name,
        profile_id: product.shipping_profile?.id,
      }))
    )}`
  )
  logger.info(
    `VERIFY Standard option profile=${verifiedOption?.shipping_profile?.name} (${verifiedOption?.shipping_profile?.id})`
  )
  logger.info(
    `VERIFY stock_location=${verifiedLocations[0]?.name} (${verifiedLocations[0]?.id}) zone=${verifiedZone?.name} (${verifiedZone?.id})`
  )
}
