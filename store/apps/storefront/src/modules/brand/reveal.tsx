"use client"

import { ReactNode, useEffect, useRef } from "react"

const Reveal = ({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.style.opacity = "1"
      return
    }
    node.style.opacity = "0"
    node.style.transform = "translateY(20px)"
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.style.transition = "opacity 0.5s ease, transform 0.5s ease"
          node.style.opacity = "1"
          node.style.transform = "translateY(0)"
          observer.disconnect()
        }
      },
      { threshold: 0.16 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

export default Reveal
