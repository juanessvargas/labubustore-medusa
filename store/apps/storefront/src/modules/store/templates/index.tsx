import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "./paginated-products"
import { OptionValueIds } from "@lib/util/product-option-filters"
import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  optionValueIds,
  countLabel,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
  countLabel?: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="bg-white" data-testid="category-container">
      <section className="bg-labubu-sky px-6 py-14 small:px-12">
        <div className="content-container">
          <h1 className="headline text-[clamp(3rem,8vw,7rem)]" data-testid="store-page-title">
            SHOP
            <br />
            ALL MONSTERS.
          </h1>
          <p className="mt-4 text-lg">Find the one that looks most like you.</p>
          {countLabel && (
            <p className="mt-4 font-display text-xl uppercase">{countLabel}</p>
          )}
        </div>
      </section>
      <div className="content-container py-12">
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            optionValueIds={optionValueIds}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
