import {type LoaderArgs} from '@remix-run/node'

import {logout} from '~/lib/session.server'

export const loader = ({request}: LoaderArgs) => {
  return logout(request)
}
