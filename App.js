import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RiderProvider, RiderContext } from './src/context/RiderContext';
import { initializeNotifications, setupNotificationListeners } from './src/services/notificationService';

// Import screens
import RiderLoginScreen from './src/screens/RiderLoginScreen';
import AvailableJobsScreen from './src/screens/AvailableJobsScreen';
import ActiveDeliveryScreen from './src/screens/ActiveDeliveryScreen';
import EarningsScreen from './src/screens/EarningsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const JobsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: true,
    }}
  >
    <Stack.Screen name="JobsList" component={AvailableJobsScreen} />
    <Stack.Screen
      name="ActiveDelivery"
      component={ActiveDeliveryScreen}
      options={{ animationEnabled: true }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { rider, isOnline, toggleOnlineStatus, logout } = useContext(RiderContext);

  useEffect(() => {
    const setupNotifications = async () => {
      await initializeNotifications();
      const unsubscribe = setupNotificationListeners((notification) => {
        console.log('Notification received:', notification);
      });
      return unsubscribe;
    };

    setupNotifications();
  }, []);

  if (!rider) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={RiderLoginScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#10b981',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Jobs"
        component={JobsStack}
        options={{
          tabBarLabel: 'Jobs',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📦</Text>,
        }}
      />
      <Tab.Screen
        name="Earnings"
        component={EarningsScreen}
        options={{
          tabBarLabel: 'Earnings',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>💰</Text>,
        }}
      />
      <Tab.Screen
        name="Account"
        component={() => <AccountScreen rider={rider} isOnline={isOnline} toggleOnlineStatus={toggleOnlineStatus} logout={logout} />}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

const AccountScreen = ({ rider, isOnline, toggleOnlineStatus, logout }) => {
  const { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Switch } = require('react-native');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.profileCard}>
          <Text style={styles.profileEmoji}>👤</Text>
          <Text style={styles.profileName}>{rider?.name}</Text>
          <Text style={styles.profilePhone}>{rider?.phoneNumber}</Text>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusInfo}>
            <Text style={styles.statusLabel}>Online Status</Text>
            <Text style={styles.statusValue}>{isOnline ? '🟢 Online' : '🔴 Offline'}</Text>
          </View>
          <Switch
            value={isOnline}
            onValueChange={toggleOnlineStatus}
            trackColor={{ false: '#ccc', true: '#10b981' }}
            thumbColor={isOnline ? '#fff' : '#fff'}
          />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Profile Info</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Rating</Text>
            <Text style={styles.infoValue}>⭐ {rider?.rating}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Total Deliveries</Text>
            <Text style={styles.infoValue}>{rider?.totalDeliveries}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = require('react-native').StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafaf9',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  profileCard: {
    backgroundColor: '#fff',
    paddingVertical: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  profileEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  profilePhone: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  statusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 12,
    color: '#999',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 4,
  },
  infoSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

import { Text } from 'react-native';

export default function App() {
  return (
    <RiderProvider>
      <RootNavigator />
    </RiderProvider>
  );
}
