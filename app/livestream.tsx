import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { GlowingButton } from '@/components/GlowingButton';
import { useRouter } from 'expo-router';

export default function LivestreamHomeScreen() {
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, you would clear authentication tokens/state here
    router.replace('/');
  };

  const handleWatchStream = (streamId: string, streamTitle: string) => {
    // Use a simpler approach for navigation
    router.push(`/livestream-detail?id=${streamId}&title=${encodeURIComponent(streamTitle)}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Streams</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.streamCard}>
            <View style={styles.liveIndicator}>
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            <Text style={styles.streamTitle}>Design Workshop</Text>
            <Text style={styles.streamDescription}>
              Join our expert designers for tips and tricks on creating beautiful UI/UX
            </Text>
            <Text style={styles.viewerCount}>1,245 viewers</Text>
            <GlowingButton
              style={styles.watchButton}
              onPress={() => handleWatchStream('design-workshop', 'Design Workshop')}>
              Watch Now
            </GlowingButton>
          </View>

          <View style={styles.streamCard}>
            <View style={styles.liveIndicator}>
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            <Text style={styles.streamTitle}>Mobile Dev Q&A</Text>
            <Text style={styles.streamDescription}>
              Get your toughest React Native questions answered by our development team
            </Text>
            <Text style={styles.viewerCount}>892 viewers</Text>
            <GlowingButton
              style={styles.watchButton}
              onPress={() => handleWatchStream('mobile-dev-qa', 'Mobile Dev Q&A')}>
              Watch Now
            </GlowingButton>
          </View>

          <View style={styles.streamCard}>
            <View style={styles.liveIndicator}>
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            <Text style={styles.streamTitle}>Product Launch</Text>
            <Text style={styles.streamDescription}>
              Be the first to see our latest product reveal and feature walkthrough
            </Text>
            <Text style={styles.viewerCount}>2,530 viewers</Text>
            <GlowingButton
              style={styles.watchButton}
              onPress={() => handleWatchStream('product-launch', 'Product Launch')}>
              Watch Now
            </GlowingButton>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'hsl(221 20% 11%)',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'hsla(0, 0%, 100%, 0.1)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#3d7aed',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  streamCard: {
    backgroundColor: 'hsla(0, 0%, 100%, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'hsla(0, 0%, 100%, 0.1)',
  },
  liveIndicator: {
    backgroundColor: '#f44336',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  liveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  streamTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  streamDescription: {
    fontSize: 16,
    color: 'hsla(0, 0%, 100%, 0.7)',
    marginBottom: 12,
    lineHeight: 22,
  },
  viewerCount: {
    fontSize: 14,
    color: 'hsla(0, 0%, 100%, 0.5)',
    marginBottom: 16,
  },
  watchButton: {
    alignSelf: 'center',
    width: '100%',
  },
});