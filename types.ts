export enum PlatformName {
  TRAVELOKA = 'Traveloka',
  TRIP_COM = 'Trip.com',
  AGODA = 'Agoda',
  BOOKING_COM = 'Booking.com',
  AIRASIA = 'AirAsia'
}

export enum ActionType {
  LOGIN_TIME = 'LOGIN_TIME', // e.g., Login after 12:00
  SPECIFIC_DATE = 'SPECIFIC_DATE', // e.g., 12 Dec
  APP_ONLY = 'APP_ONLY',
  COUPON_CODE = 'COUPON_CODE',
  NONE = 'NONE'
}

export interface PromotionAction {
  type: ActionType;
  description: string;
  targetTime?: string; // ISO string or simple time string like "12:00"
  isCompleted?: boolean;
}

export interface Promotion {
  id: string;
  platform: PlatformName;
  title: string;
  description: string;
  discount: string; // e.g. "50% OFF"
  period: string;
  actions: PromotionAction[];
  link?: string;
  tags: string[]; // e.g., ["Hotel", "Flight", "Flash Sale"]
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface PromoDataState {
  promotions: Promotion[];
  sources: GroundingSource[];
  lastUpdated: Date | null;
}