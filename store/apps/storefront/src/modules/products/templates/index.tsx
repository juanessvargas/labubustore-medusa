import React, { Suspense } from "react"

import { getProductTheme } from "@lib/brand"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import RelatedProducts from "@modules/products/components/related-products"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import ProductActionsWrapper from "./product-actions-wrapper"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  const theme = getProductTheme(product)

  return (
    <>
      <div
        className="content-container grid gap-8 py-8 small:grid-cols-[1.2fr_0.8fr] small:items-start"
        data-testid="product-container"
      >
        <div
          className="overflow-hidden rounded-[2.5rem] p-4 small:p-8"
          style={{ background: theme.bg }}
        >
          <ImageGallery images={images} />
        </div>
        <div className="small:sticky small:top-28 flex flex-col gap-6">
          <p className="font-display uppercase tracking-[0.25em] text-sm">
            LABUBUSTORE
          </p>
          <h1
            className="headline text-[clamp(2.4rem,5vw,4.5rem)]"
            data-testid="product-title"
          >
            {product.title}
          </h1>
          {product.description && (
            <p className="text-lg" data-testid="product-description">
              {product.description}
            </p>
          )}
          <Suspense
            fallback={
              <ProductActions disabled={true} product={product} region={region} />
            }
          >
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>
          <section>
            <h2 className="font-display text-2xl uppercase">Why you&apos;ll love it</h2>
            <p className="mt-2 max-w-md">
              A little monster with a lot of personality. Keep it close, take it
              with you, and let it steal the scene.
            </p>
          </section>
          <LocalizedClientLink href="/store" className="font-display uppercase">
            ← All monsters
          </LocalizedClientLink>
        </div>
      </div>
      <div
        className="content-container my-16"
        data-testid="related-products-container"
      >
        <h2 className="headline mb-8 text-4xl">More monsters</h2>
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
