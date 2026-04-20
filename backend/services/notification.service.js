/**
 * Notification Service
 * Handles push notifications via Firebase Cloud Messaging (FCM)
 * and real-time WebSocket notifications
 */

const { getMessaging } = require('../config/firebase');
const User = require('../models/user.model');

class NotificationService {
  constructor() {
    this.notificationTypes = {
      ORDER_CONFIRMED: {
        title: 'Order Confirmed! 🎉',
        icon: '✅',
        sound: 'default'
      },
      ORDER_PREPARING: {
        title: 'Being Prepared 👨‍🍳',
        icon: '👨‍🍳',
        sound: 'default'
      },
      ORDER_READY: {
        title: 'Ready for Pickup 📦',
        icon: '📦',
        sound: 'default'
      },
      OUT_FOR_DELIVERY: {
        title: 'Out for Delivery 🚗',
        icon: '🚗',
        sound: 'default'
      },
      ORDER_DELIVERED: {
        title: 'Order Delivered! 🍽️',
        icon: '🍽️',
        sound: 'celebration'
      },
      DELIVERY_PARTNER_ASSIGNED: {
        title: 'Delivery Partner Assigned 👤',
        icon: '👤',
        sound: 'default'
      },
      PROMOTION: {
        title: 'Special Offer! 🔥',
        icon: '🔥',
        sound: 'default'
      },
      ORDER_CANCELLED: {
        title: 'Order Cancelled ❌',
        icon: '❌',
        sound: 'default'
      },
      PAYMENT_SUCCESS: {
        title: 'Payment Successful 💰',
        icon: '💰',
        sound: 'default'
      },
      CHAT_MESSAGE: {
        title: 'New Message 💬',
        icon: '💬',
        sound: 'default'
      }
    };
  }

  /**
   * Send push notification to a user
   */
  async sendPushNotification(userId, type, data = {}) {
    try {
      const messaging = getMessaging();
      if (!messaging) {
        console.log('Firebase not initialized. Skipping push notification.');
        return { success: false, error: 'Firebase not initialized' };
      }

      // Get user's FCM token
      const user = await User.findById(userId).select('fcmTokens notifications');
      if (!user || !user.fcmTokens || user.fcmTokens.length === 0) {
        console.log(`No FCM tokens found for user ${userId}`);
        return { success: false, error: 'No FCM tokens' };
      }

      const notificationConfig = this.notificationTypes[type] || this.notificationTypes.ORDER_CONFIRMED;
      
      // Build notification payload
      const payload = {
        notification: {
          title: data.title || notificationConfig.title,
          body: data.body || this.getDefaultBody(type, data),
          icon: data.icon || '/assets/logo-192x192.png',
          badge: '/assets/badge-72x72.png',
          tag: data.tag || type,
          requireInteraction: data.requireInteraction || false,
          actions: data.actions || []
        },
        data: {
          type,
          orderId: data.orderId || '',
          restaurantId: data.restaurantId || '',
          clickAction: data.clickAction || '/pages/order-tracking.html',
          ...data.customData
        },
        android: {
          notification: {
            channelId: 'foodzap_orders',
            priority: 'high',
            sound: notificationConfig.sound
          }
        },
        apns: {
          payload: {
            aps: {
              sound: notificationConfig.sound,
              badge: data.badgeCount || 1
            }
          }
        },
        webpush: {
          notification: {
            vibrate: [200, 100, 200],
            actions: data.actions || []
          }
        }
      };

      // Send to all user's devices
      const results = [];
      for (const token of user.fcmTokens) {
        try {
          const message = {
            ...payload,
            token: token.token
          };
          
          const response = await messaging.send(message);
          results.push({ token: token.token, success: true, messageId: response });
        } catch (error) {
          console.error(`Failed to send to token ${token.token}:`, error.message);
          
          // Remove invalid tokens
          if (error.code === 'messaging/registration-token-not-registered') {
            await this.removeInvalidToken(userId, token.token);
          }
          
          results.push({ token: token.token, success: false, error: error.message });
        }
      }

      // Save notification to user's history
      await this.saveNotification(userId, type, payload.notification, data);

      return {
        success: true,
        sent: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results
      };
    } catch (error) {
      console.error('Push Notification Error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send order status notification
   */
  async sendOrderStatusNotification(userId, orderId, status, data = {}) {
    const statusMap = {
      'confirmed': 'ORDER_CONFIRMED',
      'preparing': 'ORDER_PREPARING',
      'ready': 'ORDER_READY',
      'out_for_delivery': 'OUT_FOR_DELIVERY',
      'delivered': 'ORDER_DELIVERED',
      'cancelled': 'ORDER_CANCELLED'
    };

    const notificationType = statusMap[status];
    if (!notificationType) return { success: false, error: 'Unknown status' };

    return this.sendPushNotification(userId, notificationType, {
      orderId,
      ...data,
      clickAction: `/pages/order-tracking.html?orderId=${orderId}`
    });
  }

  /**
   * Send bulk notification to multiple users
   */
  async sendBulkNotification(userIds, type, data = {}) {
    const results = [];
    
    for (const userId of userIds) {
      const result = await this.sendPushNotification(userId, type, data);
      results.push({ userId, ...result });
    }

    return {
      success: true,
      totalSent: results.filter(r => r.success).length,
      totalFailed: results.filter(r => !r.success).length,
      results
    };
  }

  /**
   * Send notification to topic subscribers
   */
  async sendTopicNotification(topic, type, data = {}) {
    try {
      const messaging = getMessaging();
      if (!messaging) {
        console.log('Firebase not initialized. Skipping topic notification.');
        return { success: false, error: 'Firebase not initialized' };
      }

      const notificationConfig = this.notificationTypes[type];
      
      const message = {
        notification: {
          title: data.title || notificationConfig.title,
          body: data.body || this.getDefaultBody(type, data),
          icon: data.icon || '/assets/logo-192x192.png'
        },
        data: {
          type,
          ...data.customData
        },
        topic: topic
      };

      const response = await messaging.send(message);
      
      return {
        success: true,
        messageId: response
      };
    } catch (error) {
      console.error('Topic Notification Error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Subscribe user to topic
   */
  async subscribeToTopic(userId, topic) {
    try {
      const user = await User.findById(userId).select('fcmTokens');
      if (!user || !user.fcmTokens || user.fcmTokens.length === 0) {
        return { success: false, error: 'No FCM tokens found' };
      }

      const messaging = getMessaging();
      if (!messaging) return { success: false, error: 'Firebase not initialized' };

      const tokens = user.fcmTokens.map(t => t.token);
      
      const response = await messaging.subscribeToTopic(tokens, topic);
      
      // Update user's subscriptions
      await User.findByIdAndUpdate(userId, {
        $addToSet: { 'notificationSubscriptions.topics': topic }
      });

      return {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount
      };
    } catch (error) {
      console.error('Subscribe Topic Error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Unsubscribe user from topic
   */
  async unsubscribeFromTopic(userId, topic) {
    try {
      const user = await User.findById(userId).select('fcmTokens');
      if (!user || !user.fcmTokens) return { success: false, error: 'No tokens found' };

      const messaging = getMessaging();
      if (!messaging) return { success: false, error: 'Firebase not initialized' };

      const tokens = user.fcmTokens.map(t => t.token);
      
      await messaging.unsubscribeFromTopic(tokens, topic);
      
      await User.findByIdAndUpdate(userId, {
        $pull: { 'notificationSubscriptions.topics': topic }
      });

      return { success: true };
    } catch (error) {
      console.error('Unsubscribe Topic Error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Save FCM token for user
   */
  async saveFCMToken(userId, token, deviceInfo = {}) {
    try {
      const user = await User.findById(userId);
      if (!user) return { success: false, error: 'User not found' };

      // Check if token already exists
      const existingToken = user.fcmTokens?.find(t => t.token === token);
      
      if (existingToken) {
        // Update last used
        existingToken.lastUsed = new Date();
        await user.save();
        return { success: true, message: 'Token updated' };
      }

      // Add new token
      await User.findByIdAndUpdate(userId, {
        $push: {
          fcmTokens: {
            token,
            device: deviceInfo.device || 'unknown',
            platform: deviceInfo.platform || 'web',
            addedAt: new Date(),
            lastUsed: new Date()
          }
        }
      });

      // Subscribe to default topics
      await this.subscribeToTopic(userId, 'promotions');
      await this.subscribeToTopic(userId, 'updates');

      return { success: true, message: 'Token saved' };
    } catch (error) {
      console.error('Save FCM Token Error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Remove invalid FCM token
   */
  async removeInvalidToken(userId, token) {
    try {
      await User.findByIdAndUpdate(userId, {
        $pull: { fcmTokens: { token } }
      });
      console.log(`Removed invalid token for user ${userId}`);
    } catch (error) {
      console.error('Remove Token Error:', error);
    }
  }

  /**
   * Save notification to user history
   */
  async saveNotification(userId, type, notification, data) {
    try {
      await User.findByIdAndUpdate(userId, {
        $push: {
          notifications: {
            $each: [{
              type,
              title: notification.title,
              body: notification.body,
              data,
              read: false,
              createdAt: new Date()
            }],
            $position: 0
          }
        }
      });
    } catch (error) {
      console.error('Save Notification Error:', error);
    }
  }

  /**
   * Get user's notification history
   */
  async getNotificationHistory(userId, limit = 50) {
    try {
      const user = await User.findById(userId).select('notifications');
      if (!user || !user.notifications) return [];

      return user.notifications.slice(0, limit);
    } catch (error) {
      console.error('Get Notification History Error:', error);
      return [];
    }
  }

  /**
   * Mark notifications as read
   */
  async markAsRead(userId, notificationIds = null) {
    try {
      if (notificationIds) {
        // Mark specific notifications as read
        await User.findByIdAndUpdate(userId, {
          $set: {
            'notifications.$[elem].read': true
          }
        }, {
          arrayFilters: [{ 'elem._id': { $in: notificationIds } }]
        });
      } else {
        // Mark all as read
        await User.findByIdAndUpdate(userId, {
          $set: { 'notifications.$[].read': true }
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Mark As Read Error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId) {
    try {
      const user = await User.findById(userId).select('notifications');
      if (!user || !user.notifications) return 0;

      return user.notifications.filter(n => !n.read).length;
    } catch (error) {
      console.error('Get Unread Count Error:', error);
      return 0;
    }
  }

  /**
   * Get default notification body based on type
   */
  getDefaultBody(type, data) {
    const bodies = {
      ORDER_CONFIRMED: `Your order #${data.orderId} has been confirmed! We're preparing it now.`,
      ORDER_PREPARING: `Great news! ${data.restaurantName || 'Your restaurant'} is preparing your order.`,
      ORDER_READY: `Your order is ready and waiting for a delivery partner.`,
      OUT_FOR_DELIVERY: `${data.partnerName || 'Your delivery partner'} is on the way with your order!`,
      ORDER_DELIVERED: `Enjoy your meal! Your order has been delivered.`,
      DELIVERY_PARTNER_ASSIGNED: `${data.partnerName || 'A delivery partner'} has been assigned to your order.`,
      ORDER_CANCELLED: `Your order #${data.orderId} has been cancelled. ${data.reason || ''}`,
      PAYMENT_SUCCESS: `Payment of ₹${data.amount} received successfully!`,
      PROMOTION: data.body || 'Check out this amazing offer!',
      CHAT_MESSAGE: `${data.senderName || 'Someone'}: ${data.message || 'New message'}`
    };

    return bodies[type] || 'You have a new notification from FoodZap';
  }

  /**
   * Send notification via WebSocket (for real-time updates when app is open)
   */
  sendWebSocketNotification(io, userId, type, data) {
    try {
      const notificationConfig = this.notificationTypes[type];
      
      io.to(`user-${userId}`).emit('notification', {
        type,
        title: data.title || notificationConfig?.title,
        body: data.body || this.getDefaultBody(type, data),
        icon: notificationConfig?.icon,
        data,
        timestamp: new Date().toISOString()
      });

      return { success: true };
    } catch (error) {
      console.error('WebSocket Notification Error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new NotificationService();
