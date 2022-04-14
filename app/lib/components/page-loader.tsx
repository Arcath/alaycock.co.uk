import {useEffect, useState} from 'react'
import {useTransition} from '@remix-run/react'
import {motion, AnimatePresence} from 'framer-motion'

/** We don't want to show the loader on first render */
let firstRender = true

export const PageLoader: React.FC = () => {
  const transition = useTransition()
  const [pendingPath, setPendingPath] = useState('')

  const showLoader = transition.state !== 'idle'

  useEffect(() => {
    if (firstRender) return
    if (transition.state === 'idle') return

    setPendingPath(transition.location.pathname)
  }, [transition])

  useEffect(() => {
    firstRender = false
  })

  return (
    <AnimatePresence>
      {showLoader ? (
        <motion.div
          className="fixed bottom-4 right-4"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
        >
          <div className="bg-fixed bg-gradient-to-b from-brand-dark to-brand-light z-0 relative rotate-2-5 p-2">
            <div className="bg-white dark:bg-black w-full h-full p-2">
              <div className="rotate--2-5">
                Loading Next Page
                <br />
                {pendingPath}
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
