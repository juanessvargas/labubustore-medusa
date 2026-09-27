import { HttpTypes } from "@medusajs/types"

export const PALETTE = {
  pink: "#FF6F9F",
  peach: "#FFC6A5",
  yellow: "#FFD84D",
  mint: "#9BE8D0",
  sky: "#9DDDF7",
  lavender: "#C7B5F7",
  cream: "#FFF8EA",
  ink: "#18203A",
  white: "#FFFFFF",
} as const

export type ProductTheme = {
  key: string
  bg: string
  accent: string
  ink: string
}

const THEMES: { keys: string[]; theme: ProductTheme }[] = [
  {
    keys: ["pink"],
    theme: { key: "pink", bg: PALETTE.pink, accent: PALETTE.peach, ink: PALETTE.ink },
  },
  {
    keys: ["peach"],
    theme: { key: "peach", bg: PALETTE.peach, accent: PALETTE.pink, ink: PALETTE.ink },
  },
  {
    keys: ["sunrise", "yellow", "gold"],
    theme: { key: "yellow", bg: PALETTE.yellow, accent: PALETTE.peach, ink: PALETTE.ink },
  },
  {
    keys: ["mint"],
    theme: { key: "mint", bg: PALETTE.mint, accent: PALETTE.sky, ink: PALETTE.ink },
  },
  {
    keys: ["sky", "blue"],
    theme: { key: "sky", bg: PALETTE.sky, accent: PALETTE.lavender, ink: PALETTE.ink },
  },
  {
    keys: ["lavender", "purple"],
    theme: {
      key: "lavender",
      bg: PALETTE.lavender,
      accent: PALETTE.pink,
      ink: PALETTE.ink,
    },
  },
]

export function isLabubuProduct(product: {
  title?: string | null
  handle?: string | null
}) {
  return /labubu/i.test(`${product.title ?? ""} ${product.handle ?? ""}`)
}

export function getProductTheme(product: {
  title?: string | null
  handle?: string | null
}): ProductTheme {
  const haystack = `${product.title ?? ""} ${product.handle ?? ""}`.toLowerCase()
  const match = THEMES.find(({ keys }) =>
    keys.some((key) => haystack.includes(key))
  )
  return (
    match?.theme ?? {
      key: "cream",
      bg: PALETTE.cream,
      accent: PALETTE.lavender,
      ink: PALETTE.ink,
    }
  )
}

export function filterCatalog(products: HttpTypes.StoreProduct[]) {
  const labubu = products.filter(isLabubuProduct)
  return labubu.length ? labubu : products
}
