import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  manualEntryKey: string;
}

export const generateTwoFactorSecret = (email: string): TwoFactorSetup => {
  const secret = speakeasy.generateSecret({
    name: `ShareWork (${email})`,
    issuer: 'ShareWork',
    length: 32,
  });

  return {
    secret: secret.base32!,
    qrCodeUrl: secret.otpauth_url!,
    manualEntryKey: secret.base32!,
  };
};

export const generateQRCode = async (otpauthUrl: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(otpauthUrl);
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
};

export const verifyTwoFactorToken = (token: string, secret: string): boolean => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2, // Allow 2 time steps before and after for clock drift
  });
};