export type QRType = 'url' | 'wifi';

export type WifiEncryption = 'WPA' | 'WEP' | 'nopass';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface WifiConfig {
  ssid: string;
  password: string;
  encryption: WifiEncryption;
  hidden: boolean;
}

export interface QRStyleConfig {
  fgColor: string;
  bgColor: string;
  margin: number;
  errorCorrectionLevel: ErrorCorrectionLevel;
  centerIcon: 'none' | 'link' | 'wifi';
  width: number;
}

export interface QRHistoryItem {
  id: string;
  type: QRType;
  title: string;
  payload: string;
  createdAt: number;
  fgColor: string;
  bgColor: string;
  wifiDetails?: {
    ssid: string;
    encryption: WifiEncryption;
  };
}
