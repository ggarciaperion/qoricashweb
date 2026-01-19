/**
 * Generate a unique referral code
 * Format: 6 alphanumeric characters (uppercase letters and numbers)
 * Example: QRC7K9, A3B8M2, etc.
 */
export function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding similar looking chars (I, O, 0, 1)
  let code = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }

  return code;
}

/**
 * Validate referral code format
 */
export function isValidReferralCodeFormat(code: string): boolean {
  // Must be 6 characters, alphanumeric, uppercase
  const regex = /^[A-Z0-9]{6}$/;
  return regex.test(code);
}
