/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node/globals" />

declare module 'fontsource-montserrat' {
  const url: string

  export default url
}

declare module 'copy-dir' {
  export type CopyDirOptions = {
    utimes: boolean
    mode: boolean
    cover: boolean
    filter: boolean
  }

  export const sync: (
    from: string,
    to: string,
    options?: Partial<CopyDirOptions>
  ) => unknown
}

declare module 'woff-tools' {
  export const toSfnt: (input: Buffer) => Buffer
}
