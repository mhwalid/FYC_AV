let cachedApiKey: CryptoKey | null = null;

export async function getKey(): Promise<CryptoKey> {
  if (!cachedApiKey) {
    cachedApiKey = await crypto.subtle.generateKey(
      { name: "HMAC", hash: "SHA-512" },
      true,
      ["sign", "verify"],
    );
  }
  return cachedApiKey;
}
