import {createCookieSessionStorage, redirect} from '@remix-run/node'

import {CONSTANTS} from './constants'

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET!],
    secure: process.env.NODE_ENV === 'production'
  }
})

async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie')
  return sessionStorage.getSession(cookie)
}

export const logout = async (request: Request) => {
  const session = await getSession(request)
  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session)
    }
  })
}

export async function createUserSession({request}: {request: Request}) {
  const session = await getSession(request)
  session.set(CONSTANTS.userSessionKey, 'true')
  return redirect('/admin', {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 7 // 7 days,
      })
    }
  })
}

export const requireLogin = async (request: Request) => {
  const session = await getSession(request)

  if (session.get(CONSTANTS.userSessionKey) !== 'true') {
    throw redirect('/login')
  }
}
