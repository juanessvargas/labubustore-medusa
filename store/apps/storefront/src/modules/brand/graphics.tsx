export const StarSticker = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 48 48"
    className={className}
    aria-hidden="true"
    fill="currentColor"
  >
    <path d="M24 2l6.2 14.4L46 18.2 34.4 28l3.5 16.8L24 36.6 10.1 44.8 13.6 28 2 18.2l15.8-1.8z" />
  </svg>
)

export const HeartSticker = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 48 48"
    className={className}
    aria-hidden="true"
    fill="currentColor"
  >
    <path d="M24 42S4 28.6 4 16.8C4 10.3 9.4 6 15.6 6c4 0 6.9 2 8.4 4.4C25.5 8 28.4 6 32.4 6 38.6 6 44 10.3 44 16.8 44 28.6 24 42 24 42z" />
  </svg>
)

export const Blob = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
    <path
      fill="currentColor"
      d="M47.5,-58.8C60.6,-50.2,69.4,-33.6,73.3,-15.8C77.2,2,76.2,21,67.4,35.7C58.6,50.4,42,60.8,24.4,66.7C6.8,72.6,-11.8,74,-28.6,68.1C-45.4,62.2,-60.4,49,-68.6,32.3C-76.8,15.6,-78.2,-4.6,-71.7,-21.4C-65.2,-38.2,-50.8,-51.6,-35.2,-59.6C-19.6,-67.6,-2.8,-70.2,14.1,-68.7C31,-67.2,34.4,-67.4,47.5,-58.8Z"
      transform="translate(100 100)"
    />
  </svg>
)

export const Flower = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="currentColor">
    <circle cx="24" cy="24" r="6" />
    <circle cx="24" cy="10" r="7" />
    <circle cx="24" cy="38" r="7" />
    <circle cx="10" cy="24" r="7" />
    <circle cx="38" cy="24" r="7" />
  </svg>
)
