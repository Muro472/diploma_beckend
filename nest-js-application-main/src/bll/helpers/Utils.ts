import { compare, hash } from 'bcrypt';

export async function hashPassword(password) {
  const jkey = process.env.HASH_PASSWORD;

  if (!password) {
    return null;
  }
  const passwordHash = await hash(password, jkey);
  if (passwordHash) {
    return passwordHash;
  }
}

export async function isValidPassword(plainPassword: string, hashPass: string) {
  if (!plainPassword) {
    return false;
  }
  const isValid = await compare(plainPassword, hashPass);
  return isValid;
}
