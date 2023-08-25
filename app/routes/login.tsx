import {
  type V2_MetaFunction,
  type ActionArgs,
  json,
  redirect
} from '@remix-run/node'
import {useActionData} from '@remix-run/react'

import {forms} from '~/components/ui/form'
import {pageTitle} from '~/lib/utils'
import {getConfigValue} from '~/lib/config.server'
import {comparePassword} from '~/lib/bcrypt.server'
import {createUserSession} from '~/lib/session.server'

export const meta: V2_MetaFunction = () => {
  return [{title: pageTitle('Login')}]
}

export const action = async ({request}: ActionArgs) => {
  const adminPassword = await getConfigValue('adminpassword')

  const formData = await request.formData()

  const password = formData.get('password') as string | undefined

  if (password === undefined) {
    return json({result: 'No password supplied.'})
  }

  const result = await comparePassword(password, adminPassword)

  if (result) {
    return createUserSession({request})
  }

  return json({result: 'Incorrect password.'})
}

const AdminLogin = () => {
  const data = useActionData<typeof action>()

  return (
    <div className="mt-64">
      <div className="m-auto w-96 bg-white shadow-xl rounded-xl p-2">
        <h1>Login</h1>
        {data && data.result !== undefined ? (
          <p className="bg-red-300 border-red-400 p-1 rounded">{data.result}</p>
        ) : (
          ''
        )}
        <forms.form method="POST">
          <forms.label>
            <forms.details>Password</forms.details>
            <forms.input type="password" name="password" />
          </forms.label>
          <forms.label>
            <forms.button>Login</forms.button>
          </forms.label>
        </forms.form>
      </div>
      <div className="text-center mt-2">
        <a href="/">Go back</a>
      </div>
    </div>
  )
}

export default AdminLogin
