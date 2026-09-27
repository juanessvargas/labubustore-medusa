import { HttpTypes } from "@medusajs/types"
import Image from "next/image"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  if (!images?.length) {
    return <div className="aspect-square rounded-[2rem] bg-white/40" />
  }

  return (
    <div className="flex flex-col gap-4">
      {images.map((image, index) => (
        <div
          key={image.id}
          className="relative aspect-square w-full overflow-hidden rounded-[2rem] bg-white/30 group"
          id={image.id}
        >
          {!!image.url && (
            <Image
              src={image.url}
              priority={index === 0}
              alt={`Product image ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default ImageGallery
