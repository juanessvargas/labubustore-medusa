import { Fredoka, Nunito } from "next/font/google"
import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

const sans = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "600", "700", "800"],
  display: "swap",
})

const display = Fredoka({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "LABUBUSTORE",
    template: "%s | LABUBUSTORE",
  },
  description: "Six personalities. One impossible choice.",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans">
        <main className="relative min-h-screen">{props.children}</main>
      </body>
    </html>
  )
}
