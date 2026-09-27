import { getProductTheme } from "@lib/brand"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const MonsterCard = ({
  product,
  region,
  cta = "Take me home",
}: {
  product: HttpTypes.StoreProduct
  region?: HttpTypes.StoreRegion
  cta?: string
}) => {
  const theme = getProductTheme(product)
  const { cheapestPrice } = getProductPrice({ product })
  const image = product.thumbnail || product.images?.[0]?.url

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block h-full"
      id={`monster-${product.handle}`}
    >
      <article
        className="h-full rounded-[2rem] p-4 small:p-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-1 group-active:scale-[0.98]"
        style={{ background: theme.bg }}
      >
        <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-white/40">
          {image ? (
            <Image
              src={image}
              alt={product.title || "Labubu"}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center font-display">
              ?
            </div>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-1">
          <h3 className="font-display text-xl uppercase leading-none text-labubu-ink">
            {product.title}
          </h3>
          {cheapestPrice && (
            <p className="text-base font-semibold text-labubu-ink">
              {cheapestPrice.calculated_price}
            </p>
          )}
          <span className="mt-2 inline-flex items-center gap-2 font-display text-sm uppercase tracking-wide">
            {cta}
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
        {region ? <span className="sr-only">{region.name}</span> : null}
      </article>
    </LocalizedClientLink>
  )
}

export default MonsterCard
