import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "About",
  description: "The colorful little world of LABUBUSTORE.",
}

export default function AboutPage() {
  return (
    <section className="bg-labubu-lavender min-h-[70vh] py-16 small:py-24">
      <div className="content-container max-w-3xl">
        <p className="font-display uppercase tracking-[0.3em]">About</p>
        <h1 className="headline mt-4 text-[clamp(3rem,8vw,6.5rem)]">
          SMALL MONSTERS.
          <br />
          BIG FEELINGS.
        </h1>
        <p className="mt-6 text-lg max-w-xl">
          LABUBUSTORE is a colorful shop for little monsters with oversized
          personalities. Six colors. Six moods. One very hard choice.
        </p>
        <p className="mt-4 text-lg max-w-xl">
          We keep the chaos cute, the checkout simple, and the bag ready for
          whoever you take home.
        </p>
        <LocalizedClientLink href="/store" className="labubu-btn-primary mt-10">
          Shop the monsters →
        </LocalizedClientLink>
      </div>
    </section>
  )
}
