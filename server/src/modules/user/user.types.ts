export interface PublicUser {
  id: string;
  name: string;
  email: string;
  avatar?: { url: string; publicId: string };
  phone?: string;
  role: 'user' | 'admin';
  provider: 'credentials' | 'google';
  isVerified: boolean;
  createdAt: Date;
}
