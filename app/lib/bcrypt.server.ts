import bcrypt from 'bcrypt'

export const comparePassword = async (password: string, compare: string) => {
  return bcrypt.compare(password, compare)
}

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10)
}
