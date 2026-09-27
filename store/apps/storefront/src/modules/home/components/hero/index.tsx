"use client"

import { Blob, Flower, HeartSticker, StarSticker } from "@modules/brand/graphics"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { MouseEvent, useRef } from "react"

const Hero = ({ products }: { products: HttpTypes.StoreProduct[] }) => {
  const ref = useRef<HTMLElement>(null)
  const images = products
    .map((product) => product.thumbnail || product.images?.[0]?.url)
    .filter(Boolean) as string[]

  const onMove = (event: MouseEvent<HTMLElement>) => {
    const node = ref.current
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }
    const rect = node.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    node.style.setProperty("--mx", `${x * 16}px`)
    node.style.setProperty("--my", `${y * 10}px`)
  }

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="relative min-h-[85vh] overflow-hidden bg-labubu-lavender px-6 py-16 small:px-12"
    >
      <Blob className="absolute -left-16 top-10 w-72 text-labubu-sky/80 animate-blob-drift" />
      <Blob className="absolute -right-10 bottom-0 w-80 text-labubu-pink/70 animate-blob-drift" />
      <StarSticker className="absolute left-[12%] top-24 w-10 text-labubu-yellow" />
      <HeartSticker className="absolute right-[18%] top-16 w-9 text-labubu-pink" />
      <Flower className="absolute bottom-16 left-[20%] w-12 text-labubu-mint" />

      <div className="content-container relative z-10 grid items-center gap-10 small:grid-cols-2">
        <div>
          <p className="font-display text-sm uppercase tracking-[0.3em]">LABUBUSTORE</p>
          <h1 className="headline mt-4 text-[clamp(3.2rem,9vw,8rem)]">
            MEET
            <br />
            YOUR NEW
            <br />
            LITTLE MONSTER.
          </h1>
          <p className="mt-6 max-w-md text-lg">
            Six personalities. One impossible choice.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LocalizedClientLink href="/store" className="labubu-btn-primary">
              Shop the monsters →
            </LocalizedClientLink>
            <LocalizedClientLink href="/#choose" className="labubu-btn-secondary">
              Meet them all
            </LocalizedClientLink>
          </div>
        </div>
        <div className="relative mx-auto h-[52vw] max-h-[560px] w-full max-w-xl">
          {images.slice(0, 3).map((src, index) => (
            <div
              key={src}
              className="absolute aspect-square w-[58%] overflow-hidden rounded-[2.5rem] bg-white/40 p-3 animate-floaty"
              style={{
                left: index === 0 ? "8%" : index === 1 ? "38%" : "18%",
                top: index === 0 ? "4%" : index === 1 ? "28%" : "48%",
                zIndex: 3 - index,
                transform: `translate(var(--mx, 0px), var(--my, 0px)) rotate(${
                  index === 1 ? 8 : -6
                }deg)`,
              }}
            >
              <Image
                src={src}
                alt=""
                fill
                priority={index === 0}
                className="object-contain"
                sizes="40vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
