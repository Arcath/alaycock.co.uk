import {
  type LoaderArgs,
  json,
  unstable_parseMultipartFormData,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  type ActionArgs
} from '@remix-run/node'
import {useLoaderData, useActionData} from '@remix-run/react'
import {invariant} from '@arcath/utils'
import path from 'path'

import {requireLogin} from '~/lib/session.server'
import {pageTitle} from '~/lib/utils'
import {StatusMessage} from '~/components/blocks/status-message'
import {forms} from '~/components/ui/form'
import {filesInDir} from '~/lib/files.server'

export const loader = async ({request}: LoaderArgs) => {
  await requireLogin(request)

  let files = await filesInDir(path.join('public', 'assets'))

  return json({files})
}

export const action = async ({request}: ActionArgs) => {
  await requireLogin(request)

  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 5_000_000,
      directory: 'public/assets/',
      file: ({filename}) => {
        return filename
      }
    }),
    unstable_createMemoryUploadHandler()
  )

  const formData = await unstable_parseMultipartFormData(request, uploadHandler)

  const fileData = formData.get('file') as any as {filepath: string} | undefined

  invariant(fileData)

  return json({result: true, message: 'File Uploaded'})
}

export const meta = () => {
  return [{title: pageTitle('Assets', 'Admin')}]
}

const AdminAssets = () => {
  const {files} = useLoaderData<typeof loader>()
  const actionData = useActionData()

  return (
    <div className="bg-white shadow-xl rounded-xl my-4 p-2 w-1/2 m-auto">
      <h1 className="text-2xl">Assets</h1>
      {actionData ? (
        <StatusMessage
          messageType={actionData.result ? 'success' : 'error'}
          message={actionData.message}
        />
      ) : (
        ''
      )}
      <table>
        <thead>
          <tr>
            <th>File</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, i) => {
            return (
              <tr key={i}>
                <td>
                  <a href={`/assets/${file}`}>{file}</a>
                </td>
                <td>
                  <a href={`?delete=${i}`}>🗑</a>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <forms.form method="post" encType="multipart/form-data">
        <forms.label>
          <forms.details>File</forms.details>
          <forms.input type="file" name="file" />
        </forms.label>
        <div className="grid grid-cols-2 gap-2">
          <forms.label className="col-span-2">
            <forms.button>Upload Asset</forms.button>
          </forms.label>
        </div>
      </forms.form>
    </div>
  )
}

export default AdminAssets
