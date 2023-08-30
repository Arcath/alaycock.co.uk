import {useState} from 'react'
import {motion} from 'framer-motion'

export const BlockButton = ({
  delay,
  label,
  target,
  image,
  rel
}: {
  delay: number
  label: string
  target: string
  image: string
  rel?: string
}) => {
  const [open, setOpen] = useState(false)

  const spring = {
    type: 'spring',
    mass: 1
  }

  const variants = {
    initial: {scale: 0.7, transition: {...spring, delay: 0}},
    active: () => {
      return {scale: 1, transition: {...spring, delay: !open ? delay : 0}}
    },
    hovering: {scale: 0.8, transition: {...spring, delay: 0}},
    exit: {opacity: 0}
  }

  return (
    <motion.a
      href={target}
      className="rounded-xl bg-white p-2 text-center shadow-xl relative overflow-hidden hover:text-brand-dark"
      variants={variants}
      initial={'initial'}
      animate={'active'}
      whileHover={'hovering'}
      onAnimationComplete={() => setOpen(true)}
      exit={'exit'}
      rel={rel}
    >
      <img
        src={image}
        className="absolute top-[-3rem] left-[-3rem] w-64 z-0"
        alt=""
      />
      <span className="text-xl z-10 absolute top-[calc(50%-1.125rem)] right-2">
        {label}
      </span>
    </motion.a>
  )
}
