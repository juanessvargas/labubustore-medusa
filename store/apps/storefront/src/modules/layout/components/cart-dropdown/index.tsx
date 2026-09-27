"use client"

import { Dialog, Transition } from "@headlessui/react"
import { updateLineItem } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { Fragment, useState } from "react"

const CartDrawer = ({ cart }: { cart?: HttpTypes.StoreCart | null }) => {
  const [open, setOpen] = useState(false)
  const totalItems =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
  const subtotal = cart?.subtotal ?? 0

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative min-h-11 font-display uppercase tracking-wide"
        data-testid="nav-cart-link"
        aria-label={`Open bag, ${totalItems} items`}
      >
        Bag
        <span className="ml-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-labubu-ink px-1.5 text-xs text-labubu-cream">
          {totalItems}
        </span>
      </button>

      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-[80]" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-labubu-ink/40" />
          </Transition.Child>
          <div className="fixed inset-0 flex justify-end">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="ease-in duration-200"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="flex h-full w-full max-w-md flex-col bg-white text-labubu-ink">
                <div className="flex items-center justify-between border-b-4 border-labubu-ink px-5 py-4">
                  <Dialog.Title className="font-display text-2xl uppercase">
                    Bag
                  </Dialog.Title>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="min-h-11 min-w-11 rounded-full border-2 border-labubu-ink"
                    aria-label="Close bag"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-5">
                  {cart?.items?.length ? (
                    <ul className="flex flex-col gap-5">
                      {cart.items.map((item) => (
                        <li
                          key={item.id}
                          className="grid grid-cols-[96px_1fr] gap-3"
                        >
                          <LocalizedClientLink
                            href={`/products/${item.product_handle}`}
                          >
                            <Thumbnail
                              thumbnail={item.thumbnail}
                              images={item.variant?.product?.images}
                              size="square"
                              className="!rounded-2xl !shadow-none"
                            />
                          </LocalizedClientLink>
                          <div>
                            <p className="font-display uppercase">{item.title}</p>
                            <LineItemPrice
                              item={item}
                              style="tight"
                              currencyCode={cart.currency_code}
                            />
                            <div className="mt-2 flex items-center gap-2">
                              <button
                                type="button"
                                className="min-h-11 min-w-11 rounded-full border-2 border-labubu-ink"
                                aria-label={`Decrease quantity of ${item.title}`}
                                onClick={() =>
                                  updateLineItem({
                                    lineId: item.id,
                                    quantity: Math.max(1, item.quantity - 1),
                                  })
                                }
                              >
                                −
                              </button>
                              <span className="min-w-6 text-center font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                className="min-h-11 min-w-11 rounded-full border-2 border-labubu-ink"
                                aria-label={`Increase quantity of ${item.title}`}
                                onClick={() =>
                                  updateLineItem({
                                    lineId: item.id,
                                    quantity: item.quantity + 1,
                                  })
                                }
                              >
                                +
                              </button>
                            </div>
                            <DeleteButton id={item.id} className="mt-2">
                              Remove
                            </DeleteButton>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="py-16 text-center font-display uppercase">
                      Your bag is empty.
                    </p>
                  )}
                </div>
                <div className="border-t-4 border-labubu-ink p-5 flex flex-col gap-3">
                  <div className="flex justify-between font-semibold">
                    <span>Subtotal</span>
                    <span>
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cart?.currency_code || "usd",
                      })}
                    </span>
                  </div>
                  <LocalizedClientLink
                    href="/checkout?step=address"
                    className="labubu-btn-primary w-full"
                    onClick={() => setOpen(false)}
                  >
                    Checkout →
                  </LocalizedClientLink>
                  <LocalizedClientLink
                    href="/cart"
                    className="text-center font-display uppercase underline"
                    onClick={() => setOpen(false)}
                  >
                    View bag
                  </LocalizedClientLink>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default CartDrawer
