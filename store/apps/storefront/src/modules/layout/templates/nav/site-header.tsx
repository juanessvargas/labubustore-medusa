"use client"

import Logo from "@modules/brand/logo"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SideMenu from "@modules/layout/components/side-menu"
import { HttpTypes } from "@medusajs/types"
import { ReactNode, useEffect, useState } from "react"

const SiteHeader = ({
  regions,
  cartSlot,
}: {
  regions: HttpTypes.StoreRegion[] | null
  cartSlot: ReactNode
}) => {
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="sticky top-0 z-50">
      <header
        className={`border-b-4 border-labubu-ink bg-labubu-cream/95 backdrop-blur-md transition-all duration-300 ${
          compact ? "h-16" : "h-20"
        }`}
      >
        <nav className="content-container grid h-full grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex items-center gap-5">
            <SideMenu regions={regions} />
            <div className="hidden items-center gap-5 small:flex">
              <LocalizedClientLink
                href="/store"
                className="font-display text-sm uppercase tracking-wide min-h-11 inline-flex items-center"
              >
                Shop All
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/#choose"
                className="font-display text-sm uppercase tracking-wide min-h-11 inline-flex items-center"
              >
                Meet the Monsters
              </LocalizedClientLink>
            </div>
          </div>

          <Logo compact={compact} />

          <div className="flex items-center justify-end gap-4">
            <LocalizedClientLink
              href="/about"
              className="hidden font-display text-sm uppercase tracking-wide min-h-11 items-center small:inline-flex"
            >
              About
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/account"
              className="hidden font-display text-sm uppercase tracking-wide min-h-11 items-center small:inline-flex"
              data-testid="nav-account-link"
            >
              Account
            </LocalizedClientLink>
            {cartSlot}
          </div>
        </nav>
      </header>
    </div>
  )
}

export default SiteHeader
