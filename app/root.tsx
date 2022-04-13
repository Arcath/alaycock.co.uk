import * as React from 'react'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  Link
} from 'remix'
import type {LinksFunction, LoaderFunction} from 'remix'
import useDarkMode from 'use-dark-mode'
import {motion} from 'framer-motion'

import {getSiteData} from './lib/utils'

import tailwindStyleUrl from './styles/tailwind.css'
import montserrat from './styles/font-montserrat.css'

export let links: LinksFunction = () => {
  return [
    {rel: 'stylesheet', href: tailwindStyleUrl},
    {rel: 'stylesheet', href: montserrat},
    {rel: 'icon', type: 'image/png', href: '/img/512.png'}
  ]
}

export const loader: LoaderFunction = async ({request}) => {
  const {subTitle, title} = getSiteData()

  return {title, subTitle}
}

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  )
}

function Document({
  children,
  title
}: {
  children: React.ReactNode
  title?: string
}) {
  const {value: darkMode} = useDarkMode(false, {classNameDark: 'dark'})

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body
        className={`overflow-x-hidden w-screen ${
          darkMode ? 'bg-gray-900 text-white' : 'bg-white'
        }`}
      >
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}

const NavLink: React.FC<{to: string; children: React.ReactNode}> = ({
  to,
  children
}) => {
  return (
    <li className="px-5 py-2">
      <Link
        to={to}
        className="top-line focus:outline-none block whitespace-nowrap text-lg hover:text-brand-light focus:text-brand-light"
      >
        {children}
      </Link>
    </li>
  )
}

function Layout({children}: React.PropsWithChildren<{}>) {
  const {title, subTitle} = getSiteData()
  const {toggle} = useDarkMode(false, {classNameDark: 'dark'})

  const iconTransformOrigin = {transformOrigin: '50% 50px'}

  return (
    <div>
      <motion.div
        className="w-full h-64 bg-gradient-to-b from-brand-dark to-brand-light global-skew-d shadow-xl z-0"
        animate={{rotate: 5}}
        transition={{duration: 1}}
      />
      <div className="grid grid-cols-layout">
        <header className="col-start-2 z-10 mb-24 text-white">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            <h1 className="text-3xl mt-4">
              <Link to="/">{title}</Link>
            </h1>

            <div className="col-start-2 lg:col-start-4">
              <Link to="/" aria-label="Link to homepage">
                <img
                  src="/img/profile.jpg"
                  className="rounded-full w-10 border-2 border-white float-right mt-6"
                  alt="A picture of me, link to the home page."
                />
              </Link>
              <button
                onClick={() => {
                  toggle()
                }}
                className="float-right"
                aria-label="Toggle Dark Mode"
              >
                <div className="rounded-full border-2 border-white w-10 h-10 mt-6 mr-2 relative overflow-hidden">
                  <span
                    className="absolute inset-0 rotate-90 transform text-black transition duration-1000 motion-reduce:duration-[0s] dark:rotate-0 dark:text-white"
                    style={iconTransformOrigin}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 m-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  </span>
                  <span
                    className="absolute inset-0 rotate-0 transform text-yellow-400 transition duration-1000 motion-reduce:duration-[0s] dark:-rotate-90 dark:text-white"
                    style={iconTransformOrigin}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 m-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </span>
                </div>
              </button>
            </div>
            <nav className="col-span-2 lg:col-start-2 lg:row-start-1">
              <ul className="flex">
                <NavLink to="/about">About</NavLink>
                <NavLink to="/articles">Blog</NavLink>
                <NavLink to="/uses">Uses</NavLink>
                <NavLink to="/contact">Contact</NavLink>
              </ul>
            </nav>
          </div>
        </header>
        <div className="col-start-2">{children}</div>
        <footer className="col-start-2 relative text-white mt-16">
          <motion.div
            className="w-full h-96 bg-gradient-to-b from-brand-dark to-brand-light global-skew-u shadow-xl z-0 absolute top-0 left-0"
            animate={{rotate: 5}}
            transition={{duration: 1}}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 z-10 relative mt-16">
            <div>
              <h1 className="text-3xl">{title}</h1>
              <h2 className="text-xl">{subTitle}</h2>
              <p>
                All content is my own unless otherwise stated. <br />
                My content is licensed under the{' '}
                <a
                  href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                  target="_blank"
                >
                  CC-BY-NC-SA 4.0 license
                </a>
              </p>
            </div>
            <ul className="text-center">
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/articles">Blog</Link>
              </li>
              <li>
                <Link to="/uses">Uses</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </div>
  )
}

export function CatchBoundary() {
  let caught = useCatch()

  let message
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      )
      break
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      )
      break

    default:
      throw new Error(caught.data || caught.statusText)
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  )
}

export function ErrorBoundary({error}: {error: Error}) {
  console.error(error)
  return (
    <Document title="Error!">
      <Layout>
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
          <p>
            Hey, developer, you should replace this with what you want your
            users to see.
          </p>
        </div>
      </Layout>
    </Document>
  )
}
