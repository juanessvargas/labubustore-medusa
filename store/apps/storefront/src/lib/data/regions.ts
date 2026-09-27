"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const listRegions = async (cache: RequestCache = "force-cache") => {
  const next = {
    ...(await getCacheOptions("regions")),
  }

  return await sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      next,
      cache,
    })
    .then(({ regions }) => regions)
}

export const retrieveRegion = async (id: string) => {
  const next = {
    ...(await getCacheOptions(["regions", id].join("-"))),
  }

  return await sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ region }) => region)
}

const regionMap = new Map<string, HttpTypes.StoreRegion>()

const hydrateRegionMap = (regions?: HttpTypes.StoreRegion[] | null) => {
  regions?.forEach((region) => {
    region.countries?.forEach((c) => {
      const iso = c?.iso_2?.toLowerCase()
      if (iso) {
        regionMap.set(iso, region)
      }
    })
  })
}

export const getRegion = async (countryCode: string) => {
  const code = countryCode?.toLowerCase()

  if (code && regionMap.has(code)) {
    return regionMap.get(code)
  }

  hydrateRegionMap(await listRegions())

  if (code && regionMap.has(code)) {
    return regionMap.get(code)
  }

  // Cached /store/regions can omit newly created countries (e.g. Ecuador).
  hydrateRegionMap(await listRegions("no-store"))

  return code ? regionMap.get(code) : regionMap.get("us")
}
