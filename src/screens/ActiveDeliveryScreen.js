import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { RiderContext } from '../context/RiderContext';

const ActiveDeliveryScreen = ({ navigation }) => {
  const { currentDelivery, confirmPickup, completeDelivery } = useContext(RiderContext);
  const [rating, setRating] = useState(0);
  const [showRating, setShowRating] = useState(false);

  if (!currentDelivery) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateEmoji}>📦</Text>
          <Text style={styles.emptyStateText}>No active delivery</Text>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate('Jobs')}
          >
            <Text style={styles.continueButtonText}>Find Jobs</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handlePickupConfirm = () => {
    Alert.alert(
      'Confirm Pickup',
      'Have you picked up the order from the vendor?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Yes, Picked Up',
          onPress: () => {
            confirmPickup();
            Alert.alert('Success', 'Heading to customer now!');
          },
        },
      ]
    );
  };

  const handleDeliveryComplete = () => {
    setShowRating(true);
  };

  const handleSubmitRating = () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please rate the order');
      return;
    }
    completeDelivery(rating);
    setShowRating(false);
    setRating(0);
    navigation.navigate('Earnings');
  };

  const getStatusStep = () => {
    const steps = {
      accepted: 0,
      picked_up: 1,
      completed: 2,
    };
    return steps[currentDelivery.status] || 0;
  };

  const statusStep = getStatusStep();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Active Delivery</Text>
          <Text style={styles.orderId}>#{currentDelivery.orderId}</Text>
        </View>

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressSteps}>
            {['Accepted', 'Picked Up', 'Delivered'].map((step, idx) => (
              <View key={idx} style={styles.progressStep}>
                <View
                  style={[
                    styles.progressCircle,
                    idx <= statusStep && styles.progressCircleActive,
                  ]}
                >
                  <Text style={styles.progressIcon}>
                    {idx === 0 && '✓'}
                    {idx === 1 && '📦'}
                    {idx === 2 && '🎉'}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.progressLabel,
                    idx <= statusStep && styles.progressLabelActive,
                  ]}
                >
                  {step}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Vendor Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup From</Text>
          <View style={styles.infoCard}>
            <Text style={styles.cardIcon}>🏪</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{currentDelivery.vendorName}</Text>
              <Text style={styles.cardSubtitle}>
                {currentDelivery.items.length} items • KSh {currentDelivery.totalAmount}
              </Text>
            </View>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deliver To</Text>
          <View style={styles.infoCard}>
            <Text style={styles.cardIcon}>👤</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{currentDelivery.customerName}</Text>
              <Text style={styles.cardSubtitle}>{currentDelivery.customerPhone}</Text>
            </View>
            <TouchableOpacity style={styles.callButton}>
              <Text style={styles.callButtonText}>📞</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          {currentDelivery.items.map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              <Text style={styles.itemText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Earnings */}
        <View style={styles.earningsSection}>
          <Text style={styles.earningsLabel}>You'll Earn</Text>
          <Text style={styles.earningsAmount}>KSh {currentDelivery.earnings}</Text>
          <Text style={styles.earningsNote}>
            {currentDelivery.paymentMethod === 'cash'
              ? 'Collect cash from customer'
              : 'M-Pesa already paid'}
          </Text>
        </View>

        {/* Rating Section */}
        {showRating && (
          <View style={styles.ratingSection}>
            <Text style={styles.ratingTitle}>Rate This Order</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                >
                  <Text
                    style={[
                      styles.star,
                      star <= rating && styles.starActive,
                    ]}
                  >
                    ⭐
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.submitRatingButton}
              onPress={handleSubmitRating}
            >
              <Text style={styles.submitRatingButtonText}>Submit Rating</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        {currentDelivery.status === 'accepted' && (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handlePickupConfirm}
          >
            <Text style={styles.primaryButtonText}>Confirm Pickup</Text>
          </TouchableOpacity>
        )}
        {currentDelivery.status === 'picked_up' && (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleDeliveryComplete}
          >
            <Text style={styles.primaryButtonText}>Complete Delivery</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafaf9',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  orderId: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  progressSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  progressStep: {
    alignItems: 'center',
  },
  progressCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  progressCircleActive: {
    backgroundColor: '#10b981',
  },
  progressIcon: {
    fontSize: 20,
  },
  progressLabel: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
  },
  progressLabelActive: {
    color: '#10b981',
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  callButton: {
    backgroundColor: '#10b981',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callButtonText: {
    fontSize: 18,
  },
  itemRow: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 6,
  },
  itemText: {
    fontSize: 12,
    color: '#1a1a1a',
  },
  earningsSection: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  earningsLabel: {
    fontSize: 12,
    color: '#666',
  },
  earningsAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10b981',
    marginTop: 4,
  },
  earningsNote: {
    fontSize: 11,
    color: '#999',
    marginTop: 6,
  },
  ratingSection: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  ratingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  star: {
    fontSize: 32,
    marginHorizontal: 4,
    opacity: 0.3,
  },
  starActive: {
    opacity: 1,
  },
  submitRatingButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitRatingButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  primaryButton: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
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
  continueButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#10b981',
    borderRadius: 8,
  },
  continueButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ActiveDeliveryScreen;
