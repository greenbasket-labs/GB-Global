import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes,
} from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY_BYTES = 32;

function getKey(): Buffer {
  const raw = process.env.CAC_IDENTITY_KEY;

  if (!raw) {
    throw new Error("CAC_IDENTITY_KEY is required");
  }

  const key = Buffer.from(raw, "base64");

  if (key.length !== KEY_BYTES) {
    throw new Error("CAC_IDENTITY_KEY must be a base64-encoded 32-byte key");
  }

  return key;
}

export function normalizeCacNumber(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}

export function hashCacNumber(value: string): string {
  return createHmac("sha256", getKey())
    .update(normalizeCacNumber(value))
    .digest("hex");
}

export function encryptCacNumber(value: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(normalizeCacNumber(value), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return [
    iv.toString("base64url"),
    tag.toString("base64url"),
    encrypted.toString("base64url"),
  ].join(".");
}

export function decryptCacNumber(value: string): string {
  const [ivEncoded, tagEncoded, encryptedEncoded] = value.split(".");

  if (!ivEncoded || !tagEncoded || !encryptedEncoded) {
    throw new Error("Invalid encrypted CAC value");
  }

  const decipher = createDecipheriv(
    ALGORITHM,
    getKey(),
    Buffer.from(ivEncoded, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(tagEncoded, "base64url"));

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedEncoded, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}
