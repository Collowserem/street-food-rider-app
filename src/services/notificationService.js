import * as Notifications from 'expo-notifications';

export const initializeNotifications = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Notification permissions not granted');
      return;
    }

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
};

export const setupNotificationListeners = (callback) => {
  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      callback(response.notification);
    }
  );

  return () => subscription.remove();
};

export const sendJobAvailableNotification = (vendorName, earnings) => {
  Notifications.scheduleNotificationAsync({
    content: {
      title: '🚴 New Delivery Job!',
      body: `${vendorName} - Earn KSh ${earnings}`,
      sound: 'default',
      badge: 1,
    },
    trigger: { seconds: 1 },
  });
};

export const sendJobAcceptedNotification = (vendorName) => {
  Notifications.scheduleNotificationAsync({
    content: {
      title: '✓ Job Accepted',
      body: `Heading to ${vendorName} for pickup`,
      sound: 'default',
    },
    trigger: { seconds: 1 },
  });
};

export const sendPickupConfirmedNotification = (customerName) => {
  Notifications.scheduleNotificationAsync({
    content: {
      title: '📦 Order Picked Up',
      body: `Delivering to ${customerName}`,
      sound: 'default',
    },
    trigger: { seconds: 1 },
  });
};

export const sendDeliveryCompletedNotification = (earnings) => {
  Notifications.scheduleNotificationAsync({
    content: {
      title: '🎉 Delivery Completed!',
      body: `You earned KSh ${earnings}`,
      sound: 'default',
      badge: 1,
    },
    trigger: { seconds: 1 },
  });
};

export const sendEarningsNotification = (totalEarnings) => {
  Notifications.scheduleNotificationAsync({
    content: {
      title: '💰 Earnings Update',
      body: `Total earnings today: KSh ${totalEarnings}`,
      sound: 'default',
    },
    trigger: { seconds: 1 },
  });
};
