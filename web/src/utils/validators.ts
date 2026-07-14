const NEPAL_MOBILE_REGEX = /^(97|98)\d{8}$/;

export const normalizePhoneInput = (raw: string): string => raw.replace(/[^\d]/g, '').replace(/^977/, '');

export const isValidNepalPhone = (raw: string): boolean => {
  const digits = normalizePhoneInput(raw);
  return NEPAL_MOBILE_REGEX.test(digits);
};

export const isValidOtpCode = (code: string): boolean => /^\d{4}$/.test(code);

export const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isNonEmpty = (value: string | undefined | null): boolean => !!value && value.trim().length > 0;
