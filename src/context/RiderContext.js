import React, { createContext, useState, useCallback } from 'react';

export const RiderContext = createContext();

export const RiderProvider = ({ children }) => {
  const [rider, setRider] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [currentDelivery, setCurrentDelivery] = useState(null);
  const [completedDeliveries, setCompletedDeliveries] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const login = useCallback((phoneNumber) => {
    const newRider = {
      id: `RIDER${Date.now()}`,
      phoneNumber,
      name: 'John Mwangi',
      rating: 4.8,
      totalDeliveries: 234,
      loginTime: new Date(),
    };
    setRider(newRider);
    addNotification('Welcome back!', 'info');
    return newRider;
  }, []);

  const logout = useCallback(() => {
    setRider(null);
    setIsOnline(false);
    setCurrentDelivery(null);
  }, []);

  const toggleOnlineStatus = useCallback((status) => {
    setIsOnline(status);
    if (status) {
      addNotification('You are now online', 'success');
    } else {
      addNotification('You are now offline', 'info');
    }
  }, []);

  const acceptJob = useCallback((job) => {
    setCurrentDelivery({
      ...job,
      status: 'accepted',
      acceptedAt: new Date(),
      pickupTime: null,
      deliveryTime: null,
    });
    setAvailableJobs((prev) => prev.filter((j) => j.id !== job.id));
    addNotification(`Job accepted! Pickup from ${job.vendorName}`, 'success');
  }, []);

  const confirmPickup = useCallback(() => {
    if (currentDelivery) {
      setCurrentDelivery((prev) => ({
        ...prev,
        status: 'picked_up',
        pickupTime: new Date(),
      }));
      addNotification('Order picked up! Heading to customer', 'success');
    }
  }, [currentDelivery]);

  const completeDelivery = useCallback((rating = null, review = null) => {
    if (currentDelivery) {
      const completed = {
        ...currentDelivery,
        status: 'completed',
        deliveryTime: new Date(),
        rating,
        review,
      };
      setCompletedDeliveries((prev) => [completed, ...prev]);
      
      // Update earnings
      setEarnings((prev) => ({
        ...prev,
        today: (prev?.today || 0) + currentDelivery.earnings,
        total: (prev?.total || 0) + currentDelivery.earnings,
      }));

      setCurrentDelivery(null);
      addNotification(
        `Delivery completed! You earned KSh ${currentDelivery.earnings}`,
        'success'
      );
    }
  }, [currentDelivery]);

  const addNotification = useCallback((message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date(),
    };

    setNotifications((prev) => [notification, ...prev]);

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((notif) => notif.id !== notification.id)
      );
    }, 5000);

    return notification;
  }, []);

  const requestWithdrawal = useCallback((amount) => {
    if (earnings && earnings.total >= amount) {
      addNotification(`Withdrawal of KSh ${amount} requested`, 'success');
      return true;
    } else {
      addNotification('Insufficient balance', 'error');
      return false;
    }
  }, [earnings]);

  const value = {
    rider,
    isOnline,
    availableJobs,
    currentDelivery,
    completedDeliveries,
    earnings,
    notifications,
    login,
    logout,
    toggleOnlineStatus,
    acceptJob,
    confirmPickup,
    completeDelivery,
    addNotification,
    requestWithdrawal,
    setAvailableJobs,
    setEarnings,
    setCompletedDeliveries,
  };

  return (
    <RiderContext.Provider value={value}>{children}</RiderContext.Provider>
  );
};
