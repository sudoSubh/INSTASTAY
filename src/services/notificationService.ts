
import type { Notification, NotificationType, NotificationCategory, NotificationPreferences } from '../types/notification';

export class NotificationService {
  private static readonly STORAGE_KEY = 'oyoNotifications';
  private static readonly PREFERENCES_KEY = 'oyoNotificationPreferences';

  static async sendNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: any,
    actionUrl?: string,
    actionLabel?: string
  ): Promise<Notification> {
    const notification: Notification = {
      id: `NOTIF${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      userId,
      type,
      title,
      message,
      data,
      isRead: false,
      createdAt: new Date().toISOString(),
      priority: this.getPriorityByType(type),
      category: this.getCategoryByType(type),
      actionUrl,
      actionLabel
    };

    // Store notification
    const notifications = this.getNotifications();
    notifications.push(notification);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications));

    // Send push notification if enabled
    await this.sendPushNotification(userId, notification);

    return notification;
  }

  static getNotifications(): Notification[] {
    const notifications = localStorage.getItem(this.STORAGE_KEY);
    return notifications ? JSON.parse(notifications) : [];
  }

  static getUserNotifications(userId: string): Notification[] {
    return this.getNotifications()
      .filter(notification => notification.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static getUnreadCount(userId: string): number {
    return this.getUserNotifications(userId).filter(n => !n.isRead).length;
  }

  static async markAsRead(notificationId: string): Promise<void> {
    const notifications = this.getNotifications();
    const notification = notifications.find(n => n.id === notificationId);
    
    if (notification) {
      notification.isRead = true;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications));
    }
  }

  static async markAllAsRead(userId: string): Promise<void> {
    const notifications = this.getNotifications();
    notifications.forEach(notification => {
      if (notification.userId === userId) {
        notification.isRead = true;
      }
    });
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications));
  }

  static async deleteNotification(notificationId: string): Promise<void> {
    const notifications = this.getNotifications().filter(n => n.id !== notificationId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications));
  }

  static getPreferences(userId: string): NotificationPreferences {
    const preferences = localStorage.getItem(`${this.PREFERENCES_KEY}_${userId}`);
    return preferences ? JSON.parse(preferences) : this.getDefaultPreferences();
  }

  static updatePreferences(userId: string, preferences: NotificationPreferences): void {
    localStorage.setItem(`${this.PREFERENCES_KEY}_${userId}`, JSON.stringify(preferences));
  }

  private static getDefaultPreferences(): NotificationPreferences {
    return {
      email: true,
      sms: true,
      push: true,
      categories: {
        booking: true,
        payment: true,
        promotion: true,
        system: true,
        travel: true,
        loyalty: true,
        emergency: true
      },
      quietHours: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00'
      }
    };
  }

  private static getPriorityByType(type: NotificationType): 'low' | 'medium' | 'high' | 'urgent' {
    const priorityMap: Record<NotificationType, 'low' | 'medium' | 'high' | 'urgent'> = {
      booking_confirmed: 'high',
      booking_cancelled: 'high',
      check_in_reminder: 'medium',
      check_out_reminder: 'medium',
      payment_successful: 'high',
      payment_failed: 'urgent',
      refund_processed: 'medium',
      promotion: 'low',
      loyalty_update: 'low',
      review_request: 'low',
      price_drop: 'medium',
      booking_modification: 'high',
      weather_update: 'low',
      travel_advisory: 'medium',
      maintenance_notice: 'medium',
      emergency_alert: 'urgent'
    };
    return priorityMap[type];
  }

  private static getCategoryByType(type: NotificationType): NotificationCategory {
    const categoryMap: Record<NotificationType, NotificationCategory> = {
      booking_confirmed: 'booking',
      booking_cancelled: 'booking',
      check_in_reminder: 'booking',
      check_out_reminder: 'booking',
      payment_successful: 'payment',
      payment_failed: 'payment',
      refund_processed: 'payment',
      promotion: 'promotion',
      loyalty_update: 'loyalty',
      review_request: 'booking',
      price_drop: 'promotion',
      booking_modification: 'booking',
      weather_update: 'travel',
      travel_advisory: 'travel',
      maintenance_notice: 'system',
      emergency_alert: 'emergency'
    };
    return categoryMap[type];
  }

  private static async sendPushNotification(userId: string, notification: Notification): Promise<void> {
    const preferences = this.getPreferences(userId);
    
    if (!preferences.push || !preferences.categories[notification.category]) {
      return;
    }

    // Check quiet hours
    if (preferences.quietHours.enabled) {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const startTime = this.timeToMinutes(preferences.quietHours.startTime);
      const endTime = this.timeToMinutes(preferences.quietHours.endTime);
      
      if (startTime > endTime) {
        // Quiet hours span midnight
        if (currentTime >= startTime || currentTime <= endTime) {
          return;
        }
      } else if (currentTime >= startTime && currentTime <= endTime) {
        return;
      }
    }

    // Mock push notification using web Notification API
    if ('Notification' in window && window.Notification.permission === 'granted') {
      new window.Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    }
  }

  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Convenience methods for common notifications
  static async notifyBookingConfirmed(userId: string, bookingId: string, hotelName: string): Promise<void> {
    await this.sendNotification(
      userId,
      'booking_confirmed',
      'Booking Confirmed!',
      `Your booking at ${hotelName} has been confirmed. Booking ID: ${bookingId}`,
      { bookingId },
      `/dashboard`,
      'View Booking'
    );
  }

  static async notifyPaymentSuccessful(userId: string, amount: number, bookingId: string): Promise<void> {
    await this.sendNotification(
      userId,
      'payment_successful',
      'Payment Successful',
      `Payment of ₹${amount.toLocaleString()} has been processed successfully.`,
      { amount, bookingId },
      `/dashboard`,
      'View Receipt'
    );
  }

  static async notifyCheckInReminder(userId: string, hotelName: string, checkInDate: string): Promise<void> {
    await this.sendNotification(
      userId,
      'check_in_reminder',
      'Check-in Reminder',
      `Don't forget to check in at ${hotelName} today!`,
      { hotelName, checkInDate },
      `/dashboard`,
      'View Booking'
    );
  }
}
