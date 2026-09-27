import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import { Suspense } from "react"
import CartButton from "@modules/layout/components/cart-button"
import SiteHeader from "./site-header"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Nav() {
  const regions = await listRegions().then((value: StoreRegion[]) => value)

  return (
    <SiteHeader
      regions={regions}
      cartSlot={
        <Suspense
          fallback={
            <LocalizedClientLink
              href="/cart"
              className="font-display uppercase"
              data-testid="nav-cart-link"
            >
              Bag 0
            </LocalizedClientLink>
          }
        >
          <CartButton />
        </Suspense>
      }
    />
  )
}
