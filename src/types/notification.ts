
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: NotificationCategory;
  actionUrl?: string;
  actionLabel?: string;
}

export type NotificationType = 
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'check_in_reminder'
  | 'check_out_reminder'
  | 'payment_successful'
  | 'payment_failed'
  | 'refund_processed'
  | 'promotion'
  | 'loyalty_update'
  | 'review_request'
  | 'price_drop'
  | 'booking_modification'
  | 'weather_update'
  | 'travel_advisory'
  | 'maintenance_notice'
  | 'emergency_alert';

export type NotificationCategory = 
  | 'booking'
  | 'payment'
  | 'promotion'
  | 'system'
  | 'travel'
  | 'loyalty'
  | 'emergency';

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  categories: Record<NotificationCategory, boolean>;
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}
