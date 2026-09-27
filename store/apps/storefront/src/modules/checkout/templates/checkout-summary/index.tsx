import { Heading } from "@modules/common/components/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import { HttpTypes } from "@medusajs/types"

const CheckoutSummary = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  return (
    <div className="sticky top-20 flex flex-col gap-y-8 py-0">
      <div className="checkout-card w-full flex flex-col">
        <Heading
          level="h2"
          className="text-[1.75rem] leading-tight font-semibold text-labubu-ink"
        >
          In your Cart
        </Heading>
        <div className="mt-6">
          <ItemsPreviewTemplate cart={cart} />
        </div>
        <div className="h-px w-full bg-[#E7E7E7] my-6" />
        <CartTotals totals={cart} />
        <div className="mt-6 opacity-80">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
