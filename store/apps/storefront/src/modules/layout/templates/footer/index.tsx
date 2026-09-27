import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function Footer() {
  return (
    <footer className="w-full bg-[#F28C7B] text-labubu-ink">
      <div className="content-container py-16 small:py-24">
        <LocalizedClientLink href="/" className="block">
          <p className="font-display text-[14vw] leading-[0.8] uppercase">
            LABUBU
            <br />
            STORE
          </p>
        </LocalizedClientLink>
        <div className="mt-10 flex flex-wrap gap-6 font-display text-lg uppercase">
          <LocalizedClientLink href="/store">Shop</LocalizedClientLink>
          <LocalizedClientLink href="/about">About</LocalizedClientLink>
          <LocalizedClientLink href="/cart">Cart</LocalizedClientLink>
        </div>
        <div className="mt-12 flex flex-wrap items-end justify-between gap-4 text-sm text-labubu-ink/80">
          <p>ECUADOR / USD</p>
          <p>© {new Date().getFullYear()} LABUBUSTORE</p>
        </div>
      </div>
    </footer>
  )
}
