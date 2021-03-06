/* eslint @typescript-eslint/no-unsafe-assignment: off */
/* eslint @typescript-eslint/no-unsafe-member-access: off */
/* eslint @typescript-eslint/no-unsafe-call: off */
/* eslint @typescript-eslint/no-unsafe-argument: off */
/* eslint @typescript-eslint/no-explicit-any: off */
/* eslint @typescript-eslint/no-unnecessary-condition: off */
/* eslint jsx-a11y/click-events-have-key-events: off */

import {useState} from 'react'
import {addressObject} from '@arcath/utils'

const ADDRESS_SEPERATOR = '|'

const LABELS: {[key: string]: string} = {
  policies: 'Policies',
  administrativeTemplates: 'Administrative Templates'
}

const ICONS: {[key: string]: string} = {
  'Computer Configuration': '🖥️',
  'User Configuration': '👤',
  policies: '📜',
  administrativeTemplates: '📏'
}

const ExpandableTab: React.FC<{
  label: string
  initialState?: boolean
  setOpenPath: (newPath: string) => void
  path: string
  icon?: string
  children: React.ReactNode
}> = ({label, initialState, children, setOpenPath, path, icon}) => {
  const [open, setOpen] = useState(!!initialState)

  const closedIcon = icon ? icon : '📁'
  const openIcon = icon ? icon : '📂'

  if (!open) {
    return (
      <div
        onClick={() => {
          setOpen(true)
          setOpenPath(path)
        }}
        className="font-headings cursor-pointer"
      >
        {ICONS[label] === undefined ? closedIcon : ICONS[label]}{' '}
        {LABELS[label] === undefined ? label : LABELS[label]}
      </div>
    )
  }

  return (
    <div>
      <div
        onClick={() => {
          setOpen(false)
          setOpenPath('')
        }}
        className="font-headings cursor-pointer"
      >
        {ICONS[label] === undefined ? openIcon : ICONS[label]}{' '}
        {LABELS[label] === undefined ? label : LABELS[label]}
      </div>
      <div className="pl-4">{children}</div>
    </div>
  )
}

export const TreeEntry: React.FC<{
  subTree: any
  dataKey: string
  label: string
  depth: number
  path: string
  setOpenPath: (newPath: string) => void
}> = ({subTree, dataKey, label, depth, path, setOpenPath}) => {
  if (subTree[dataKey] === undefined) {
    return null
  }

  if (dataKey === 'icon') {
    return null
  }

  if (
    subTree[dataKey].hasOwnProperty('value') &&
    subTree[dataKey].hasOwnProperty('about')
  ) {
    return null
  }

  return (
    <ExpandableTab
      label={label}
      initialState={depth < 3}
      setOpenPath={setOpenPath}
      path={path}
      icon={subTree[dataKey].icon}
    >
      {Object.keys(subTree[dataKey]).map(k => {
        return (
          <TreeEntry
            subTree={subTree[dataKey]}
            dataKey={k}
            label={k}
            depth={depth + 1}
            key={`${dataKey}-${k}`}
            path={[path, k].join(ADDRESS_SEPERATOR)}
            setOpenPath={setOpenPath}
          />
        )
      })}
    </ExpandableTab>
  )
}

export const GPO: React.FC<{data: any}> = ({data}) => {
  const [openPath, setOpenPath] = useState('')

  const displayData = addressObject(data, openPath, {
    seperator: ADDRESS_SEPERATOR
  })

  const entries = Object.keys(
    displayData === undefined ? {} : displayData
  ).reduce<{[key: string]: {value: string; about: string}}>((object, key) => {
    if (
      displayData?.[key].hasOwnProperty('value') &&
      displayData?.[key].hasOwnProperty('about')
    ) {
      object[key] = displayData[key]
    }

    return object
  }, {})

  return (
    <div className="col-start-2 col-span-3 grid grid-cols-3 bg-gray-900 dark:bg-gray-700 rounded text-gray-200">
      <div className="bg-gray-800 rounded-l">
        <TreeEntry
          subTree={data}
          label="Computer Configuration"
          dataKey="computer"
          depth={0}
          path="computer"
          setOpenPath={setOpenPath}
        />
      </div>
      <div className="col-span-2 px-2">
        <div className="text-xl mb-2">
          {openPath.split(ADDRESS_SEPERATOR).pop()}
        </div>
        {Object.keys(entries).map(key => {
          const entry = entries[key]

          return (
            <div key={key} className="grid grid-cols-3 gap-2">
              <div className="row-span-2">{key}</div>
              <div className="col-span-2">
                <pre>{entry.value}</pre>
              </div>
              <div className="col-span-2">{entry.about}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
