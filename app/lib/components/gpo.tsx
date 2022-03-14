import {useState} from 'react'

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

const ExpandableTab: React.FC<{label: string; initialState?: boolean}> = ({
  label,
  initialState,
  children
}) => {
  const [open, setOpen] = useState(!!initialState)

  if (!open) {
    return (
      <div onClick={() => setOpen(true)} className="font-headings">
        {ICONS[label] !== undefined ? ICONS[label] : '📁'}{' '}
        {LABELS[label] !== undefined ? LABELS[label] : label}
      </div>
    )
  }

  return (
    <div>
      <div
        onClick={() => {
          setOpen(false)
        }}
        className="font-headings"
      >
        {ICONS[label] !== undefined ? ICONS[label] : '📂'}{' '}
        {LABELS[label] !== undefined ? LABELS[label] : label}
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
}> = ({subTree, dataKey, label, depth}) => {
  if (subTree[dataKey] === undefined) {
    return <></>
  }

  if (
    subTree[dataKey].hasOwnProperty('value') &&
    subTree[dataKey].hasOwnProperty('about')
  ) {
    return (
      <div className="grid grid-cols-4 mb-2 mt-2 gap-2">
        <div className="row-span-2 text-lg">{label}</div>
        <pre className="col-span-3 mb-2 mt-0">{subTree[dataKey].value}</pre>
        <div className="col-span-3">{subTree[dataKey].about}</div>
      </div>
    )
  }

  return (
    <ExpandableTab label={label} initialState={depth < 3}>
      {Object.keys(subTree[dataKey]).map(k => {
        return (
          <TreeEntry
            subTree={subTree[dataKey]}
            dataKey={k}
            label={k}
            depth={depth + 1}
            key={`${dataKey}-${k}`}
          />
        )
      })}
    </ExpandableTab>
  )
}

export const GPO: React.FC<{data: any}> = ({data}) => {
  return (
    <div className="col-start-2 col-span-3">
      <TreeEntry
        subTree={data}
        label="Computer Configuration"
        dataKey="computer"
        depth={0}
      />
    </div>
  )
}
