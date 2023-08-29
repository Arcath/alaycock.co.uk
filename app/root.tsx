import {cssBundleHref} from '@remix-run/css-bundle'
import {type LinksFunction} from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  useLocation,
  useOutlet
} from '@remix-run/react'
import {AnimatePresence, motion} from 'framer-motion'

import stylesheet from '~/styles/index.css'

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{rel: 'stylesheet', href: cssBundleHref}] : []),
  {rel: 'stylesheet', href: stylesheet}
]

export default function App() {
  const {pathname} = useLocation()
  const outlet = useOutlet()
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header className="grid grid-cols-content mt-4">
          <div className="col-start-3 text-center">
            <h1>
              <a href="/" className="!text-white">
                Adam Laycock
              </a>
            </h1>
          </div>
        </header>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            variants={{
              initial: {opacity: 0, y: -1000},
              animate: {opacity: 1, y: 0},
              exit: {opacity: 0, y: -1000}
            }}
            transition={{duration: 1}}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
