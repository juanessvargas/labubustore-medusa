import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"

type LogoProps = {
  stacked?: boolean
  className?: string
  compact?: boolean
}

const Logo = ({ stacked = true, className, compact }: LogoProps) => {
  return (
    <LocalizedClientLink
      href="/"
      className={clx(
        "font-display uppercase leading-none text-labubu-ink tracking-tight transition-transform duration-300",
        compact ? "scale-90" : "scale-100",
        className
      )}
      data-testid="nav-store-link"
      aria-label="LABUBUSTORE home"
    >
      {stacked ? (
        <span className="flex flex-col items-center">
          <span className="text-[1.35rem] small:text-2xl">LABUBU</span>
          <span className="text-[0.7rem] small:text-sm tracking-[0.35em]">STORE</span>
        </span>
      ) : (
        <span className="text-xl small:text-2xl">LABUBUSTORE</span>
      )}
    </LocalizedClientLink>
  )
}

export default Logo
