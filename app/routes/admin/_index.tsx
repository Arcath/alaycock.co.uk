import {
  type LoaderArgs,
  json,
  type ActionArgs,
  type V2_MetaArgs
} from '@remix-run/node'
import {useLoaderData, useActionData, useMatch, Outlet} from '@remix-run/react'
import {invariant} from '@arcath/utils'

import {requireLogin} from '~/lib/session.server'
import {
  getConfigValue,
  ConfigDefaults,
  setConfigValue
} from '~/lib/config.server'
import {hashPassword} from '~/lib/bcrypt.server'
import {pageTitle} from '~/lib/utils'

import {forms} from '~/components/ui/form'

export const loader = async ({request}: LoaderArgs) => {
  await requireLogin(request)

  const adminPassword = await getConfigValue('adminpassword')

  const requirePasswordChange =
    adminPassword === ConfigDefaults.adminpassword.value

  return json({requirePasswordChange})
}

export const action = async ({request}: ActionArgs) => {
  await requireLogin(request)

  const formData = await request.formData()

  const password = formData.get('password') as string | undefined
  const confirmPassword = formData.get('confirmPassword') as string | undefined

  invariant(password)
  invariant(confirmPassword)

  if (password !== confirmPassword) {
    return json({
      result: false,
      message: 'Password and confirm password did not match.'
    })
  }

  const newPassword = await hashPassword(password)

  await setConfigValue('adminpassword', newPassword)

  return json({result: true, message: 'Password changed!'})
}

export const meta = ({}: V2_MetaArgs) => {
  return [{title: pageTitle('Admin')}]
}

const AdminIndex = () => {
  const {requirePasswordChange} = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const match = useMatch('/admin')

  if (match === null) {
    return <Outlet />
  }

  const PasswordMessage = () => {
    if (actionData) {
      const colors = actionData.result
        ? 'bg-green-300 border-green-400'
        : 'bg-red-300 border-red-400'

      return (
        <p className={`border p-1 rounded ${colors}`}>{actionData.message}</p>
      )
    }

    if (requirePasswordChange) {
      return (
        <p className="bg-red-300 border-red-400 border p-1 rounded">
          You are still using the default password, you should probabbly change
          it.
        </p>
      )
    }

    return <></>
  }

  return (
    <div className="w-1/2 grid grid-cols-3 gap-4 m-auto mt-4">
      <div className="bg-white rounded-xl shadow-xl p-4 row-span-2">
        <h1 className="text-xl">Admin</h1>
        <p>Manage content and assets from here.</p>
      </div>
      <div className="bg-white rounded-xl shadow-xl p-4">
        <h2 className="text-lg">Posts</h2>
        <p>
          <a href="/admin/posts">All Posts</a>
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-xl p-4">
        <h2 className="text-lg">Tags</h2>
        <p>
          <a href="/admin/tags">All Tags</a>
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-xl p-4">
        <h2 className="text-lg">Assets</h2>
        <p>
          <a href="/admin/assets">All Assets</a>
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-xl p-4">
        <h2 className="text-lg">Pages</h2>
        <p>
          <a href="/admin/pages">All Pages</a>
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-xl p-4 col-span-2">
        <h2 className="text-lg">Set Admin Password</h2>
        <PasswordMessage />
        <forms.form method="post">
          <forms.label>
            <forms.details>New Password</forms.details>
            <forms.input name="password" type="password" />
          </forms.label>
          <forms.label>
            <forms.details>Confirm Password</forms.details>
            <forms.input name="confirmPassword" type="password" />
          </forms.label>
          <forms.label>
            <forms.button>Change Password</forms.button>
          </forms.label>
        </forms.form>
      </div>
      <div className="bg-white rounded-xl shadow-xl p-4">
        <a href="/logout">Logout</a>
      </div>
    </div>
  )
}

export default AdminIndex
