import * as React from 'react'
import type {LinksFunction, LoaderFunction} from '@remix-run/node'

import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch
} from '@remix-run/react'

import useDarkMode from 'use-dark-mode'
import {motion} from 'framer-motion'

import {getSiteData} from './lib/utils'
import {PolyworkIcon} from './lib/components/polywork-icon'

import tailwindStyleUrl from './styles/tailwind.css'
import montserrat from './styles/font-montserrat.css'

export let links: LinksFunction = () => {
  return [
    {rel: 'stylesheet', href: tailwindStyleUrl},
    {rel: 'stylesheet', href: montserrat},
    {rel: 'icon', type: 'image/png', href: '/img/512.png'},
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      title: 'RSS Feed',
      href: '/articles/feed.rss.xml'
    }
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
  const {title, subTitle, social} = getSiteData()
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
            <ul>
              <li className="mb-4">
                <a
                  href={social.twitter.url}
                  className="fill-current text-white hover:text-brands-twitter"
                >
                  <svg
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-16 m-auto"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
              </li>
              <li className="mb-4">
                <a
                  href={social.github.url}
                  className="fill-current text-white hover:text-black transition-colors"
                >
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-16 m-auto"
                  >
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </a>
              </li>
              <li>
                <PolyworkIcon />
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
