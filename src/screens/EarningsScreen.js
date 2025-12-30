import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { RiderContext } from '../context/RiderContext';
import { mockEarningsData, mockCompletedDeliveries, mockWithdrawalHistory } from '../mockData';

const EarningsScreen = () => {
  const { earnings, setEarnings, completedDeliveries } = useContext(RiderContext);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');

  useEffect(() => {
    if (!earnings) {
      setEarnings(mockEarningsData);
    }
  }, []);

  const handleWithdrawal = () => {
    const amount = parseInt(withdrawalAmount);
    if (!amount || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }
    if (amount > (earnings?.total || 0)) {
      Alert.alert('Insufficient Balance', 'You don\'t have enough balance');
      return;
    }
    Alert.alert('Success', `Withdrawal of KSh ${amount} requested. You'll receive it within 24 hours.`);
    setWithdrawalAmount('');
  };

  const renderDeliveryItem = ({ item }) => (
    <View style={styles.deliveryItem}>
      <View style={styles.deliveryInfo}>
        <Text style={styles.deliveryVendor}>{item.vendorName}</Text>
        <Text style={styles.deliveryCustomer}>{item.customerName}</Text>
        <Text style={styles.deliveryDate}>
          {item.completedAt.toLocaleDateString()} {item.completedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      <View style={styles.deliveryEarnings}>
        <Text style={styles.earningsAmount}>+KSh {item.earnings}</Text>
        <Text style={styles.rating}>⭐ {item.rating}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Earnings</Text>
        </View>

        {/* Earnings Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Today</Text>
            <Text style={styles.summaryAmount}>KSh {earnings?.today || 0}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>This Week</Text>
            <Text style={styles.summaryAmount}>KSh {earnings?.thisWeek || 0}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>This Month</Text>
            <Text style={styles.summaryAmount}>KSh {earnings?.thisMonth || 0}</Text>
          </View>
        </View>

        {/* Total Balance */}
        <View style={styles.balanceCard}>
          <View>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>KSh {earnings?.total || 0}</Text>
          </View>
          <View style={styles.balanceIcon}>
            <Text style={styles.balanceIconText}>💰</Text>
          </View>
        </View>

        {/* Withdrawal Section */}
        <View style={styles.withdrawalSection}>
          <Text style={styles.sectionTitle}>Request Withdrawal</Text>
          <View style={styles.withdrawalForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount (KSh)</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.currencySymbol}>KSh</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter amount"
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                  value={withdrawalAmount}
                  onChangeText={setWithdrawalAmount}
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.withdrawButton}
              onPress={handleWithdrawal}
            >
              <Text style={styles.withdrawButtonText}>Request Withdrawal</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Deliveries */}
        <View style={styles.deliveriesSection}>
          <Text style={styles.sectionTitle}>Recent Deliveries</Text>
          {completedDeliveries.length > 0 ? (
            <FlatList
              data={completedDeliveries}
              renderItem={renderDeliveryItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No completed deliveries yet</Text>
            </View>
          )}
        </View>

        {/* Withdrawal History */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Withdrawal History</Text>
          {mockWithdrawalHistory.map((withdrawal) => (
            <View key={withdrawal.id} style={styles.historyItem}>
              <View style={styles.historyInfo}>
                <Text style={styles.historyAmount}>KSh {withdrawal.amount}</Text>
                <Text style={styles.historyDate}>
                  {withdrawal.date.toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.historyStatus}>
                <Text style={styles.statusBadge}>✓ {withdrawal.status}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

import { TextInput } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafaf9',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  summarySection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 6,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
  },
  balanceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  balanceLabel: {
    fontSize: 12,
    color: '#666',
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10b981',
    marginTop: 6,
  },
  balanceIcon: {
    fontSize: 40,
  },
  balanceIconText: {
    fontSize: 40,
  },
  withdrawalSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  withdrawalForm: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
  },
  currencySymbol: {
    paddingLeft: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1a1a1a',
  },
  withdrawButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  withdrawButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  deliveriesSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  deliveryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryVendor: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  deliveryCustomer: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  deliveryDate: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  deliveryEarnings: {
    alignItems: 'flex-end',
  },
  earningsAmount: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#10b981',
  },
  rating: {
    fontSize: 11,
    color: '#f59e0b',
    marginTop: 2,
  },
  separator: {
    height: 0,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyStateText: {
    fontSize: 12,
    color: '#999',
  },
  historySection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  historyInfo: {
    flex: 1,
  },
  historyAmount: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  historyDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  historyStatus: {
    marginLeft: 12,
  },
  statusBadge: {
    fontSize: 11,
    color: '#10b981',
    fontWeight: '600',
  },
});

export default EarningsScreen;
