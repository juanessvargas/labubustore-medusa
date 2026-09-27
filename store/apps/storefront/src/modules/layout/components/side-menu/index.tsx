"use client"

import { Dialog, Transition } from "@headlessui/react"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import useToggleState from "@lib/hooks/use-toggle-state"
import { Fragment, useState } from "react"

const LINKS = [
  { label: "Shop All", href: "/store" },
  { label: "Meet the Monsters", href: "/#choose" },
  { label: "About", href: "/about" },
  { label: "Account", href: "/account" },
  { label: "Bag", href: "/cart" },
]

const SideMenu = ({ regions }: { regions: HttpTypes.StoreRegion[] | null }) => {
  const [open, setOpen] = useState(false)
  const countryToggleState = useToggleState()

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-h-11 min-w-11 items-center justify-center"
        aria-label="Open menu"
        data-testid="nav-menu-button"
      >
        <span className="flex flex-col gap-1.5" aria-hidden="true">
          <span className="block h-0.5 w-6 bg-labubu-ink" />
          <span className="block h-0.5 w-6 bg-labubu-ink" />
          <span className="block h-0.5 w-4 bg-labubu-ink" />
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
          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="ease-in duration-200"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="flex h-full w-full max-w-sm flex-col bg-labubu-yellow p-6 text-labubu-ink">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="min-h-11 min-w-11 self-end rounded-full border-2 border-labubu-ink"
                  aria-label="Close menu"
                >
                  ✕
                </button>
                <nav className="mt-8 flex flex-col gap-5">
                  {LINKS.map((link) => (
                    <LocalizedClientLink
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="font-display text-4xl uppercase leading-none"
                    >
                      {link.label}
                    </LocalizedClientLink>
                  ))}
                </nav>
                <div className="mt-auto">
                  {regions && (
                    <CountrySelect
                      toggleState={countryToggleState}
                      regions={regions}
                    />
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default SideMenu
