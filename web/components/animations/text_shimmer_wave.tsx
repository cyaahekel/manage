'use client'

import { useEffect, useState, type JSX } from 'react'
import { motion, type Transition }        from 'motion/react'
import { cn }                             from '@/lib/utils'

// - TYPES - \\
type TextShimmerWaveProps = {
  children  : string
  as?       : React.ElementType
  className?: string
  duration? : number
  zDistance?: number
  xDistance?: number
  yDistance?: number
  spread?   : number
  scaleDistance?  : number
  rotateYDistance?: number
  transition?     : Transition
}

/**
 * @description Animated wave shimmer effect per-character using motion/react.
 * Each character ripples with 3D transforms and color transitions in sequence.
 * @param children      - Text to animate (string)
 * @param duration      - Duration of one wave cycle per character (seconds)
 * @param spread        - Controls delay spread across characters
 * @param zDistance     - Z-axis translation depth
 * @param scaleDistance - Scale peak at the wave crest
 * @param rotateYDistance - Y-axis rotation at wave crest (degrees)
 * @returns Animated text element
 */
export function TextShimmerWave({
  children,
  as: Component      = 'p',
  className,
  duration           = 1,
  zDistance          = 10,
  xDistance          = 2,
  yDistance          = -2,
  spread             = 1,
  scaleDistance      = 1.1,
  rotateYDistance    = 10,
  transition,
}: TextShimmerWaveProps) {
  const MotionComponent = motion.create(Component as keyof JSX.IntrinsicElements)

  const [is_dark, set_is_dark] = useState(false)

  useEffect(() => {
    set_is_dark(document.documentElement.classList.contains('dark'))
    const observer = new MutationObserver(() => {
      set_is_dark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const base_color     = is_dark ? '#71717a' : '#a1a1aa'
  const gradient_color = is_dark ? '#ffffff' : '#000000'

  return (
    <MotionComponent
      className={cn('relative inline-block [perspective:500px]', className)}
      style={{ color: base_color }}
    >
      {children.split('').map((char, i) => {
        const delay = (i * duration * (1 / spread)) / children.length
        return (
          <motion.span
            key={`${char}-${i}-${is_dark}`}
            className="inline-block whitespace-pre [transform-style:preserve-3d]"
            initial={{ translateZ: 0, scale: 1, rotateY: 0, color: base_color }}
            animate={{
              translateZ : [0, zDistance, 0],
              translateX : [0, xDistance, 0],
              translateY : [0, yDistance, 0],
              scale      : [1, scaleDistance, 1],
              rotateY    : [0, rotateYDistance, 0],
              color      : [base_color, gradient_color, base_color],
            }}
            transition={{
              duration,
              repeat      : Infinity,
              repeatDelay : (children.length * 0.05) / spread,
              delay,
              ease        : 'easeInOut',
              ...transition,
            }}
          >
            {char}
          </motion.span>
        )
      })}
    </MotionComponent>
  )
}
