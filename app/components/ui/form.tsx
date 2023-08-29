import {omit} from '@arcath/utils'

export const forms = {
  form: (
    props: React.DetailedHTMLProps<
      React.FormHTMLAttributes<HTMLFormElement>,
      HTMLFormElement
    >
  ) => {
    return (
      <form {...omit(props, ['className'])} className={`${props.className}`} />
    )
  },
  label: (
    props: React.DetailedHTMLProps<
      React.LabelHTMLAttributes<HTMLLabelElement>,
      HTMLLabelElement
    >
  ) => {
    return (
      <label
        {...omit(props, ['className'])}
        className={`${props.className} grid grid-cols-form mt-2`}
      />
    )
  },
  details: (
    props: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLSpanElement>,
      HTMLSpanElement
    >
  ) => {
    return (
      <span
        {...omit(props, ['className'])}
        className={`${props.className} pt-2`}
      />
    )
  },
  input: (
    props: React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >
  ) => {
    return (
      <input
        {...omit(props, ['className'])}
        className={`${props.className} col-start-2 border-gray-300 border rounded p-2`}
      />
    )
  },
  button: (
    props: React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >
  ) => {
    return (
      <button
        {...omit(props, ['className'])}
        className={`${props.className} col-start-2 border-gray-300 border rounded p-2 bg-green-300`}
      />
    )
  },
  textarea: (
    props: React.DetailedHTMLProps<
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
      HTMLTextAreaElement
    >
  ) => {
    return (
      <textarea
        {...omit(props, ['className'])}
        className={`${props.className} col-start-2 border-gray-300 border rounded p-2`}
      />
    )
  }
}
