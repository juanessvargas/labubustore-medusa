import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  createRegionsWorkflow,
  createServiceZonesWorkflow,
  createShippingOptionsWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateRegionsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

const COUNTRY_CODE = "ec"
const REGION_NAME = "Ecuador"
const CURRENCY_CODE = "usd"
const SHIPPING_OPTION_NAME = "Standard"
const SHIPPING_PRICE = 10

type Summary = {
  region: { id: string; created: boolean }
  countryAssociated: { created: boolean }
  taxRegion: { id: string; created: boolean }
  storeCurrencies: { usdDefault: boolean; eurAvailable: boolean }
  stockLocation: { id: string; name: string; created: boolean }
  serviceZone: { id: string; name: string; created: boolean }
  shippingOption: { id: string; name: string; created: boolean }
  salesChannel: { id: string; name: string }
}

export default async function addEcRegion({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const summary: Summary = {
    region: { id: "", created: false },
    countryAssociated: { created: false },
    taxRegion: { id: "", created: false },
    storeCurrencies: { usdDefault: false, eurAvailable: false },
    stockLocation: { id: "", name: "", created: false },
    serviceZone: { id: "", name: "", created: false },
    shippingOption: { id: "", name: "", created: false },
    salesChannel: { id: "", name: "" },
  }

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })
  const defaultSalesChannel =
    salesChannels.find((sc) => sc.name === "Default Sales Channel") ??
    salesChannels[0]

  if (!defaultSalesChannel) {
    throw new Error("Default Sales Channel was not found.")
  }
  summary.salesChannel = {
    id: defaultSalesChannel.id,
    name: defaultSalesChannel.name,
  }

  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code", "countries.iso_2"],
  })

  const regionWithEc = regions.find((region) =>
    region.countries?.some(
      (country) => country?.iso_2?.toLowerCase() === COUNTRY_CODE
    )
  )
  let ecuadorRegion =
    regionWithEc ??
    regions.find((region) => region.name.toLowerCase() === REGION_NAME.toLowerCase())

  if (!ecuadorRegion) {
    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: REGION_NAME,
            currency_code: CURRENCY_CODE,
            countries: [COUNTRY_CODE],
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    })
    ecuadorRegion = result[0]
    summary.region = { id: ecuadorRegion.id, created: true }
    summary.countryAssociated = { created: true }
    logger.info(`Created region ${REGION_NAME} (${ecuadorRegion.id}).`)
  } else {
    summary.region = { id: ecuadorRegion.id, created: false }
    const hasEc = ecuadorRegion.countries?.some(
      (country) => country?.iso_2?.toLowerCase() === COUNTRY_CODE
    )
    if (!hasEc) {
      const countryCodes = [
        ...(ecuadorRegion.countries ?? [])
          .map((country) => country?.iso_2?.toLowerCase())
          .filter((code): code is string => Boolean(code)),
        COUNTRY_CODE,
      ]
      await updateRegionsWorkflow(container).run({
        input: {
          selector: { id: ecuadorRegion.id },
          update: { countries: countryCodes },
        },
      })
      summary.countryAssociated = { created: true }
      logger.info(`Associated country ${COUNTRY_CODE} with region ${ecuadorRegion.id}.`)
    } else {
      logger.info(
        `Region ${ecuadorRegion.name} already includes ${COUNTRY_CODE}; skipping.`
      )
    }
  }

  const { data: taxRegions } = await query.graph({
    entity: "tax_region",
    fields: ["id", "country_code", "province_code"],
  })
  const existingTaxRegion = taxRegions.find(
    (taxRegion) =>
      taxRegion.country_code?.toLowerCase() === COUNTRY_CODE &&
      !taxRegion.province_code
  )

  if (!existingTaxRegion) {
    const { result } = await createTaxRegionsWorkflow(container).run({
      input: [
        {
          country_code: COUNTRY_CODE,
          provider_id: "tp_system",
        },
      ],
    })
    summary.taxRegion = { id: result[0].id, created: true }
    logger.info(`Created tax region for ${COUNTRY_CODE}.`)
  } else {
    summary.taxRegion = { id: existingTaxRegion.id, created: false }
    logger.info(`Tax region for ${COUNTRY_CODE} already exists; skipping.`)
  }

  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id", "supported_currencies.*"],
  })
  const store = stores[0]
  if (!store) {
    throw new Error("Store was not found.")
  }

  const existingCurrencies = (store.supported_currencies ?? []).map(
    (currency) => currency.currency_code.toLowerCase()
  )
  const currencyCodes = new Set(["usd", "eur", ...existingCurrencies])

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: Array.from(currencyCodes).map((code) => ({
          currency_code: code,
          is_default: code === CURRENCY_CODE,
        })),
      },
    },
  })
  summary.storeCurrencies = { usdDefault: true, eurAvailable: true }
  logger.info("Set USD as default store currency; EUR remains available.")

  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: [
      "id",
      "name",
      "sales_channels.id",
      "fulfillment_providers.id",
      "fulfillment_sets.id",
      "fulfillment_sets.name",
      "fulfillment_sets.service_zones.id",
      "fulfillment_sets.service_zones.name",
      "fulfillment_sets.service_zones.geo_zones.country_code",
      "fulfillment_sets.service_zones.shipping_options.id",
      "fulfillment_sets.service_zones.shipping_options.name",
    ],
  })

  let stockLocation = stockLocations[0]
  if (!stockLocation) {
    const { result } = await createStockLocationsWorkflow(container).run({
      input: {
        locations: [
          {
            name: "Quito Warehouse",
            address: {
              city: "Quito",
              country_code: "EC",
              address_1: "",
            },
          },
        ],
      },
    })
    stockLocation = result[0]
    summary.stockLocation = {
      id: stockLocation.id,
      name: stockLocation.name,
      created: true,
    }
    logger.info(`Created stock location ${stockLocation.name}.`)
  } else {
    summary.stockLocation = {
      id: stockLocation.id,
      name: stockLocation.name,
      created: false,
    }
    logger.info(`Reusing stock location ${stockLocation.name} (${stockLocation.id}).`)
  }

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

  const { data: refreshedLocations } = await query.graph({
    entity: "stock_location",
    fields: [
      "id",
      "fulfillment_sets.id",
      "fulfillment_sets.name",
      "fulfillment_sets.service_zones.id",
      "fulfillment_sets.service_zones.name",
      "fulfillment_sets.service_zones.geo_zones.country_code",
      "fulfillment_sets.service_zones.shipping_options.id",
      "fulfillment_sets.service_zones.shipping_options.name",
    ],
    filters: { id: stockLocation.id },
  })
  const location = refreshedLocations[0]
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)

  let fulfillmentSet = location?.fulfillment_sets?.[0]
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
    location?.fulfillment_sets?.flatMap((set) => set.service_zones ?? []) ??
    fulfillmentSet.service_zones ??
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
            name: REGION_NAME,
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
    summary.serviceZone = {
      id: ecuadorZone.id,
      name: ecuadorZone.name,
      created: true,
    }
    logger.info(`Created service zone ${ecuadorZone.name}.`)
  } else {
    summary.serviceZone = {
      id: ecuadorZone.id,
      name: ecuadorZone.name,
      created: false,
    }
    logger.info(
      `Service zone ${ecuadorZone.name} already includes ${COUNTRY_CODE}; skipping.`
    )
  }

  const existingShippingOption = ecuadorZone.shipping_options?.find(
    (option) => option.name === SHIPPING_OPTION_NAME
  )

  if (!existingShippingOption) {
    const { data: shippingProfiles } = await query.graph({
      entity: "shipping_profile",
      fields: ["id"],
    })
    const shippingProfile = shippingProfiles[0]
    if (!shippingProfile) {
      throw new Error("Shipping profile was not found.")
    }

    const { result } = await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: SHIPPING_OPTION_NAME,
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: ecuadorZone.id,
          shipping_profile_id: shippingProfile.id,
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
    summary.shippingOption = {
      id: result[0].id,
      name: result[0].name,
      created: true,
    }
    logger.info(`Created shipping option ${SHIPPING_OPTION_NAME} at ${SHIPPING_PRICE} USD.`)
  } else {
    summary.shippingOption = {
      id: existingShippingOption.id,
      name: existingShippingOption.name,
      created: false,
    }
    logger.info(`Shipping option ${SHIPPING_OPTION_NAME} already exists; skipping.`)
  }

  logger.info(`EC region script summary: ${JSON.stringify(summary, null, 2)}`)
}
