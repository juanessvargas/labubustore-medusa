import { Metadata } from "next"

import { filterCatalog } from "@lib/brand"
import { listProducts } from "@lib/data/products"
import { parseOptionValueIds } from "@lib/util/product-option-filters"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Shop all monsters",
  description: "Find the Labubu that looks most like you.",
}

type StorePageSearchParams = Record<string, string | string[] | undefined> & {
  sortBy?: SortOptions
  page?: string
  optionValueIds?: string | string[]
}

type Params = {
  searchParams: Promise<StorePageSearchParams>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page } = searchParams
  const optionValueIds = parseOptionValueIds(searchParams)
  const { response } = await listProducts({
    countryCode: params.countryCode,
    queryParams: { limit: 100 },
  })
  const count = filterCatalog(response.products).length

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      optionValueIds={optionValueIds}
      countLabel={`${count} MONSTER${count === 1 ? "" : "S"}`}
    />
  )
}
