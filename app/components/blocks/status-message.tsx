type MessageType = 'success' | 'info' | 'warning' | 'error'

export const StatusMessage = ({
  message,
  messageType
}: {
  messageType: MessageType
  message: string
}) => {
  let colors: string

  switch (messageType) {
    case 'success':
      colors = 'bg-green-300 border-green-400'
      break
    case 'error':
      colors = 'bg-red-300 border-red-400'
      break
    case 'warning':
      colors = 'bg-yellow-300 border-yellow-400'
      break
    case 'info':
    default:
      colors = 'bg-blue-300 border-blue-400'
  }

  return <p className={`border p-1 rounded ${colors}`}>{message}</p>
}
