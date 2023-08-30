import fs from 'fs'
import path from 'path'
import {mkdirp} from 'mkdirp'

const {readdir, readFile} = fs.promises

const AssetsDir = process.env.ASSETS_DIR!

export const getAssetsDir = () => {
  return AssetsDir
}

export const getAssets = async () => {
  await mkdirp(AssetsDir)

  return readdir(AssetsDir)
}

export const getAssetBuffer = async (asset: string) => {
  await mkdirp(AssetsDir)

  return readFile(path.join(AssetsDir, asset))
}
