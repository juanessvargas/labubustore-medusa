import { filterCatalog } from "@lib/brand"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getProductPrice } from "@lib/util/get-product-price"
import { Blob, Flower, HeartSticker, StarSticker } from "@modules/brand/graphics"
import Marquee from "@modules/brand/marquee"
import MonsterCard from "@modules/brand/monster-card"
import Reveal from "@modules/brand/reveal"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Hero from "@modules/home/components/hero"
import { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: {
    absolute: "LABUBUSTORE",
  },
  description: "Six personalities. One impossible choice.",
}

const PERSONALITIES = [
  { label: "Sweet", match: "pink" },
  { label: "Chaotic", match: "peach" },
  { label: "Bold", match: "sunrise" },
  { label: "Chill", match: "mint" },
  { label: "Dreamy", match: "sky" },
  { label: "Soft", match: "lavender" },
]

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const region = await getRegion(countryCode)
  const { response } = await listProducts({
    countryCode,
    queryParams: { limit: 12 },
  })
  const products = filterCatalog(response.products)
  const featured = products[2] || products[0]
  const featuredPrice = featured
    ? getProductPrice({ product: featured }).cheapestPrice
    : null

  if (!region) {
    return null
  }

  return (
    <>
      <Hero products={products} />

      <section id="choose" className="bg-white py-16 small:py-24">
        <Reveal className="content-container">
          <div className="scallop-frame bg-white px-6 py-12 small:px-12">
            <p className="font-display text-sm uppercase tracking-[0.25em]">
              Choose your monster
            </p>
            <h2 className="headline mt-3 text-[clamp(2.4rem,6vw,5rem)]">
              Six colors.
              <br />
              Six personalities.
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-4 medium:grid-cols-3">
              {products.map((product) => (
                <MonsterCard key={product.id} product={product} region={region} />
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <Marquee />

      <section className="relative overflow-hidden bg-labubu-pink py-16 text-labubu-ink small:py-24">
        <Blob className="absolute -right-20 top-0 w-72 text-white/30" />
        <Reveal className="content-container grid items-center gap-10 small:grid-cols-2">
          <div className="relative min-h-[320px] overflow-hidden rounded-[2.5rem] bg-white/30">
            {products[0]?.thumbnail || products[0]?.images?.[0]?.url ? (
              <Image
                src={(products[0].thumbnail || products[0].images?.[0]?.url)!}
                alt={products[0].title || "Labubu"}
                fill
                className="object-contain p-8"
                sizes="50vw"
              />
            ) : null}
          </div>
          <div>
            <h2 className="headline text-[clamp(2.4rem,6vw,5.5rem)]">
              SMALL MONSTERS.
              <br />
              BIG PERSONALITIES.
            </h2>
            <p className="mt-6 max-w-md text-lg">
              Every Labubu has its own color, mood and little bit of chaos.
              Find the one that feels most like you.
            </p>
            <LocalizedClientLink href="/store" className="labubu-btn-secondary mt-8">
              Meet the collection →
            </LocalizedClientLink>
          </div>
        </Reveal>
      </section>

      <section className="bg-white py-16 small:py-24">
        <Reveal className="content-container">
          <h2 className="headline text-[clamp(2.4rem,6vw,5.5rem)]">
            WHY EVERYONE
            <br />
            WANTS ONE.
          </h2>
          <div className="mt-10 grid gap-6 small:grid-cols-3">
            {[
              {
                title: "Collectible",
                body: "Six personalities to choose from.",
                Icon: StarSticker,
                color: "text-labubu-yellow",
              },
              {
                title: "Full of character",
                body: "Every color has its own attitude.",
                Icon: HeartSticker,
                color: "text-labubu-pink",
              },
              {
                title: "Made to go with you",
                body: "A tiny monster for your everyday.",
                Icon: Flower,
                color: "text-labubu-mint",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[2rem] border-4 border-labubu-ink bg-white p-6"
              >
                <item.Icon className={`mb-4 h-10 w-10 ${item.color}`} />
                <h3 className="font-display text-2xl uppercase">{item.title}</h3>
                <p className="mt-2">{item.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {featured && (
        <section className="bg-labubu-mint py-16 small:py-24">
          <Reveal className="content-container grid items-center gap-10 small:grid-cols-2">
            <div className="relative min-h-[380px] overflow-hidden rounded-[2.5rem] bg-white/40">
              {(featured.thumbnail || featured.images?.[0]?.url) && (
                <Image
                  src={(featured.thumbnail || featured.images?.[0]?.url)!}
                  alt={featured.title || "Featured Labubu"}
                  fill
                  className="object-contain p-6"
                  sizes="50vw"
                />
              )}
            </div>
            <div>
              <p className="font-display uppercase tracking-[0.3em]">Monster of the day</p>
              <h2 className="headline mt-3 text-[clamp(2.6rem,6vw,5.5rem)]">
                {featured.title}
              </h2>
              {featuredPrice && (
                <p className="mt-3 text-xl font-semibold">{featuredPrice.calculated_price}</p>
              )}
              {featured.description && (
                <p className="mt-4 max-w-md text-lg">{featured.description}</p>
              )}
              <LocalizedClientLink
                href={`/products/${featured.handle}`}
                className="labubu-btn-primary mt-8"
              >
                Take me home →
              </LocalizedClientLink>
            </div>
          </Reveal>
        </section>
      )}

      <section id="collection" className="bg-labubu-sky py-16 small:py-24">
        <Reveal className="content-container">
          <h2 className="headline text-[clamp(2.6rem,7vw,6rem)]">
            ALL THE
            <br />
            MONSTERS.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-5 xsmall:grid-cols-2 medium:grid-cols-3">
            {products.map((product) => (
              <MonsterCard key={product.id} product={product} region={region} />
            ))}
          </div>
        </Reveal>
      </section>

      <section className="bg-labubu-yellow py-16 small:py-24">
        <Reveal className="content-container text-center">
          <h2 className="headline text-[clamp(2.6rem,7vw,6rem)]">
            WHICH
            <br />
            LABUBU
            <br />
            ARE YOU?
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {PERSONALITIES.map((item) => {
              const match = products.find((product) =>
                `${product.title} ${product.handle}`.toLowerCase().includes(item.match)
              )
              const href = match ? `/#monster-${match.handle}` : "/#collection"
              return (
                <a
                  key={item.label}
                  href={href}
                  className="min-h-11 rounded-full border-2 border-labubu-ink bg-white px-5 py-2 font-display uppercase"
                >
                  {item.label}
                </a>
              )
            })}
          </div>
        </Reveal>
      </section>

      <section className="bg-labubu-peach py-16 small:py-24">
        <Reveal className="content-container max-w-2xl">
          <h2 className="headline text-[clamp(2.6rem,6vw,5.5rem)]">
            JOIN THE
            <br />
            MONSTER CLUB.
          </h2>
          <p className="mt-4 text-lg">
            New drops, little monsters and colorful chaos.
          </p>
          <div className="mt-8 flex flex-col gap-3 small:flex-row">
            <label className="sr-only" htmlFor="club-email">
              Email
            </label>
            <input
              id="club-email"
              type="email"
              placeholder="you@email.com"
              className="min-h-12 flex-1 rounded-full border-2 border-labubu-ink px-5"
              disabled
            />
            <p className="labubu-btn-primary pointer-events-none opacity-80">
              Coming soon
            </p>
          </div>
        </Reveal>
      </section>
    </>
  )
}
