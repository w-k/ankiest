import SecurePassword from "secure-password"

export const hash = async (plain: string): Promise<string> => {
  const securePassword = new SecurePassword()
  const hashed = await securePassword.hash(Buffer.from(plain))
  return hashed.toString()
}

export const verify = async (hashedPassword: string, plainCandidate: string): Promise<symbol> => {
  const securePassword = new SecurePassword()
  return await securePassword.verify(
    Buffer.from(plainCandidate),
    Buffer.from(hashedPassword, "base64")
  )
}
