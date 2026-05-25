import crypto from "crypto";

export function generateRandomPassword(length: number = 8): string {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";

  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    const randomIndex = randomValues[i]! % charset.length;
    password += charset[randomIndex];
  }

  return password;
}

export function maskEmail(email: string) {
  const [localPart, domain] = email.split("@");

  if (localPart!.length <= 2) {
    const masked = "*".repeat(localPart?.length || 1);
    return masked + "@" + domain;
  }

  const visiblePart = localPart?.slice(0, 2);

  const hiddenLength = localPart!.length - 2;
  const maskedPart = "*".repeat(hiddenLength);

  return visiblePart + maskedPart + "@" + domain;
}
