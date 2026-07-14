/**
 * Produces a display-only hint like "98••••••23" — never enough digits to dial or identify.
 * The real number never travels to a scanner; this is only used on the owner's own screens
 * as a reminder of which number is on file.
 */
export const maskPhone = (digits: string): string => {
  if (digits.length < 6) return '••••••';
  const prefix = digits.slice(0, 2);
  const suffix = digits.slice(-2);
  return `${prefix}${'•'.repeat(digits.length - 4)}${suffix}`;
};
