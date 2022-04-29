/* eslint @typescript-eslint/no-explicit-any: off */

import React from 'react'
import {Link} from '@remix-run/react'

export const buttonClassNames =
  'bg-fixed bg-gradient-to-b from-brand-dark to-brand-light p-2 text-white shadow'

export const Button: React.FC<React.HTMLProps<HTMLButtonElement>> = props => (
  <button
    {...(props as any)}
    className={`${props.className} ${buttonClassNames}`}
  />
)
export const ButtonA: React.FC<React.HTMLProps<HTMLAnchorElement>> = props => (
  // eslint-disable-next-line
  <a {...(props as any)} className={`${props.className} ${buttonClassNames}`} />
)
export const ButtonLink: React.FC<{
  className?: string
  to: string
  children: React.ReactNode
}> = props => (
  // eslint-disable-next-line
  <Link
    {...(props as any)}
    className={`${props.className} ${buttonClassNames}`}
  />
)
