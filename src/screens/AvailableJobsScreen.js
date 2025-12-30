import React, { useContext, useEffect } from 'react';
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
import { mockDeliveryJobs } from '../mockData';

const AvailableJobsScreen = ({ navigation }) => {
  const { availableJobs, setAvailableJobs, acceptJob, isOnline } = useContext(RiderContext);

  useEffect(() => {
    setAvailableJobs(mockDeliveryJobs);
  }, []);

  const handleAcceptJob = (job) => {
    if (!isOnline) {
      Alert.alert('Go Online', 'Please go online to accept jobs');
      return;
    }
    acceptJob(job);
    navigation.navigate('ActiveDelivery');
  };

  const renderJobCard = ({ item }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => handleAcceptJob(item)}
    >
      <View style={styles.jobHeader}>
        <View>
          <Text style={styles.vendorName}>{item.vendorName}</Text>
          <Text style={styles.customerName}>📍 {item.customerName}</Text>
        </View>
        <View style={styles.earningsTag}>
          <Text style={styles.earningsText}>KSh {item.earnings}</Text>
        </View>
      </View>

      <View style={styles.jobDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>📦</Text>
          <Text style={styles.detailText}>{item.items.length} items</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>📍</Text>
          <Text style={styles.detailText}>{item.distance} km</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>⏱️</Text>
          <Text style={styles.detailText}>{item.estimatedTime} mins</Text>
        </View>
      </View>

      <View style={styles.jobFooter}>
        <View>
          <Text style={styles.amountLabel}>Order Amount</Text>
          <Text style={styles.amount}>KSh {item.totalAmount}</Text>
        </View>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleAcceptJob(item)}
        >
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (!isOnline) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.offlineState}>
          <Text style={styles.offlineEmoji}>🔴</Text>
          <Text style={styles.offlineText}>You are offline</Text>
          <Text style={styles.offlineSubtext}>Go online to see available jobs</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (availableJobs.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateEmoji}>📭</Text>
          <Text style={styles.emptyStateText}>No jobs available</Text>
          <Text style={styles.emptyStateSubtext}>Check back soon for new orders</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Available Jobs</Text>
          <Text style={styles.jobCount}>{availableJobs.length} jobs</Text>
        </View>

        <View style={styles.jobsContainer}>
          <FlatList
            data={availableJobs}
            renderItem={renderJobCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafaf9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  jobCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  jobsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  customerName: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  earningsTag: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  earningsText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#10b981',
  },
  jobDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 11,
    color: '#999',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 4,
  },
  acceptButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  separator: {
    height: 0,
  },
  offlineState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  offlineText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  offlineSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});

export default AvailableJobsScreen;
