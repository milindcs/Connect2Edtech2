import { useEffect, useRef, useState } from 'react'
import { useInView, animate } from 'framer-motion'

// Parses a display string like "13,000+" or "92%" into a numeric target and a
// static suffix, per Section 8.2 step 1.
function parseStat(display) {
  const match = display.match(/^([\d,]+)(.*)$/)
  if (!match) return { numeric: 0, suffix: display }
  const numeric = Number(match[1].replace(/,/g, ''))
  const suffix = match[2] ?? ''
  return { numeric, suffix }
}

// Rolling counter hook used by StatCard (Section 6.1).
// Animates the numeric portion of a stat string from 0 to its target once,
// the first time the element enters the viewport, and never re-triggers.
export default function useCountUp(display) {
  const { numeric, suffix } = parseStat(display)
  const ref = useRef(null)
  const hasAnimated = useRef(false)
  const isInView = useInView(ref, { once: true, amount: 0.4 })
  const [displayValue, setDisplayValue] = useState('0')

  useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true

    const controls = animate(0, numeric, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (value) => {
        setDisplayValue(Math.round(value).toLocaleString('en-US'))
      },
    })

    return () => controls.stop()
  }, [isInView, numeric])

  return { ref, formattedValue: `${displayValue}${suffix}` }
}
