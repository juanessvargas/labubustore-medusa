import { listProducts } from "@lib/data/products"
import { filterCatalog } from "@lib/brand"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import MonsterCard from "@modules/brand/monster-card"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const products = await listProducts({
    queryParams: { limit: 12 },
    countryCode,
  }).then(({ response }) =>
    filterCatalog(response.products).filter(
      (responseProduct) => responseProduct.id !== product.id
    )
  )

  if (!products.length) {
    return null
  }

  return (
    <ul className="grid grid-cols-1 xsmall:grid-cols-2 medium:grid-cols-3 gap-5">
      {products.map((related) => (
        <li key={related.id}>
          <MonsterCard region={region} product={related} />
        </li>
      ))}
    </ul>
  )
}
