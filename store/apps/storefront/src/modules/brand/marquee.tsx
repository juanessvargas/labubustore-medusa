const PHRASES = [
  "BIG PERSONALITY",
  "TINY MONSTER",
  "CHOOSE YOUR FAVORITE",
  "LABUBUSTORE",
]

const Marquee = ({
  background = "#FFD84D",
  color = "#18203A",
}: {
  background?: string
  color?: string
}) => {
  const loop = [...PHRASES, ...PHRASES, ...PHRASES, ...PHRASES]

  return (
    <div
      className="overflow-hidden py-4 border-y-4 border-labubu-ink"
      style={{ background, color }}
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee whitespace-nowrap font-display text-2xl small:text-4xl uppercase tracking-tight">
        {loop.map((phrase, index) => (
          <span key={`${phrase}-${index}`} className="px-6">
            {phrase} ✦
          </span>
        ))}
      </div>
    </div>
  )
}

export default Marquee
