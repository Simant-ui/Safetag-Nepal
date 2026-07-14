export interface RegisterBusinessInput {
  name: string;
  category: string;
  description?: string;
  phone?: string;
  website?: string;
  location?: string;
  socialLinks?: { platform: string; url: string }[];
  services?: string[];
}
