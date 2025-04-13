import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Share,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { GradientButton } from '@/components/GradientButton';
import { GlowingButton } from '@/components/GlowingButton';
import { BlurView } from 'expo-blur';

type StreamData = {
  id: string;
  title: string;
  description: string;
  viewerCount: number;
  streamStarted: string;
  hostName: string;
  hostAvatar: string;
};

type ChatMessage = {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  isHost: boolean;
};

// Mock stream details based on stream ID
const getStreamDetails = (id: string): StreamData => {
  const streams: Record<string, StreamData> = {
    'design-workshop': {
      id: 'design-workshop',
      title: 'Design Workshop',
      description: 'Learn how to create beautiful and functional UI/UX designs. Our expert designers will walk you through principles of color theory, typography, layout, and more. Perfect for beginners and intermediate designers looking to level up their skills.',
      viewerCount: 1245,
      streamStarted: '45 minutes ago',
      hostName: 'Sarah Johnson',
      hostAvatar: 'https://i.pravatar.cc/150?img=5',
    },
    'mobile-dev-qa': {
      id: 'mobile-dev-qa',
      title: 'Mobile Dev Q&A',
      description: 'Our team of senior React Native developers is answering all your questions about mobile app development. Topics include performance optimization, cross-platform issues, and the latest updates to React Native.',
      viewerCount: 892,
      streamStarted: '32 minutes ago',
      hostName: 'Mike Chen',
      hostAvatar: 'https://i.pravatar.cc/150?img=12',
    },
    'product-launch': {
      id: 'product-launch',
      title: 'Product Launch',
      description: 'Join us for the exciting reveal of our latest product. We\'ll be showcasing all the new features, improvements, and answering questions from the audience. Don\'t miss this opportunity to be among the first to see what we\'ve been working on!',
      viewerCount: 2530,
      streamStarted: '1 hour ago',
      hostName: 'Alex Rivera',
      hostAvatar: 'https://i.pravatar.cc/150?img=8',
    },
  };

  return streams[id] || {
    id: 'unknown',
    title: 'Unknown Stream',
    description: 'Stream details not available',
    viewerCount: 0,
    streamStarted: 'unknown',
    hostName: 'Unknown Host',
    hostAvatar: 'https://i.pravatar.cc/150?img=0',
  };
};

// Mock chat messages
const getMockChatMessages = (): ChatMessage[] => {
  return [
    { id: '1', username: 'JaneDoe', message: 'This stream is amazing!', timestamp: '2m ago', isHost: false },
    { id: '2', username: 'TechGuru', message: 'Can you explain more about the new features?', timestamp: '3m ago', isHost: false },
    { id: '3', username: 'DesignPro', message: 'Love the UI improvements 👏', timestamp: '4m ago', isHost: false },
    { id: '4', username: 'Newbie123', message: 'How do I implement this in my project?', timestamp: '5m ago', isHost: false },
    { id: '5', username: 'DevFan', message: 'The performance looks much better now', timestamp: '7m ago', isHost: false },
  ];
};

export default function LivestreamDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const streamId = params.id as string;

  const [stream, setStream] = useState<StreamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const scrollViewRef = useRef<ScrollView>(null);
  const videoTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Simulate loading stream data
    const timer = setTimeout(() => {
      setStream(getStreamDetails(streamId));
      setChatMessages(getMockChatMessages());
      setLikeCount(Math.floor(Math.random() * 1000) + 500);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [streamId]);

  useEffect(() => {
    // Simulate video progress
    if (isPlaying) {
      videoTimeout.current = setInterval(() => {
        setVideoProgress(prev => {
          const newProgress = prev + 0.001;
          return newProgress > 1 ? 1 : newProgress;
        });
      }, 100);
    } else if (videoTimeout.current) {
      clearInterval(videoTimeout.current);
    }

    return () => {
      if (videoTimeout.current) clearInterval(videoTimeout.current);
    };
  }, [isPlaying]);

  const handleBack = () => {
    router.back();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(Math.max(0, Math.min(100, newVolume)));
  };

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      username: 'You',
      message: chatInput.trim(),
      timestamp: 'just now',
      isHost: false,
    };

    setChatMessages(prev => [...prev, newMessage]);
    setChatInput('');

    // Scroll to bottom of chat
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this amazing livestream: ${stream?.title}`,
        url: `https://example.com/livestream/${streamId}`,
        title: stream?.title,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Shared via ${result.activityType}`);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not share this stream');
    }
  };

  const toggleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3d7aed" />
        <Text style={styles.loadingText}>Loading stream...</Text>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{stream?.title || 'Stream'}</Text>
          <TouchableOpacity onPress={toggleLike} style={styles.likeButton}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={isLiked ? "#f44336" : "white"}
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.videoContainer, isFullscreen && styles.fullscreenVideo]}>
          <View style={styles.videoPlaceholder}>
            {isPlaying ? (
              <BlurView intensity={70} style={styles.blurBackground}>
                <Text style={styles.videoPlaceholderText}>STREAMING LIVE</Text>
              </BlurView>
            ) : (
              <Text style={styles.videoPlaceholderText}>LIVE STREAM</Text>
            )}

            <View style={styles.videoControls}>
              <TouchableOpacity
                style={styles.playPauseButton}
                onPress={togglePlayPause}
              >
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={28}
                  color="white"
                />
              </TouchableOpacity>

              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${videoProgress * 100}%` }]} />
                <View style={styles.progressBarBackground} />
              </View>

              <View style={styles.volumeContainer}>
                <TouchableOpacity onPress={() => handleVolumeChange(volume - 10)}>
                  <Ionicons name="volume-low-outline" size={20} color="white" />
                </TouchableOpacity>
                <View style={styles.volumeBar}>
                  <View style={[styles.volumeFill, { width: `${volume}%` }]} />
                </View>
                <TouchableOpacity onPress={() => handleVolumeChange(volume + 10)}>
                  <Ionicons name="volume-high-outline" size={20} color="white" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.fullscreenButton}
                onPress={toggleFullscreen}
              >
                <Ionicons
                  name={isFullscreen ? "contract" : "expand"}
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {!isFullscreen && (
          <View style={styles.contentContainer}>
            <View style={styles.detailsContainer}>
              <View style={styles.infoHeader}>
                <View>
                  <Text style={styles.streamTitle}>{stream?.title}</Text>
                  <Text style={styles.viewerCount}>
                    {stream?.viewerCount.toLocaleString()} viewers • Started {stream?.streamStarted} • {likeCount.toLocaleString()} likes
                  </Text>
                </View>
                <View style={styles.liveIndicator}>
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              </View>

              <View style={styles.hostInfoContainer}>
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitial}>{stream?.hostName[0]}</Text>
                </View>
                <View style={styles.hostInfo}>
                  <Text style={styles.hostName}>{stream?.hostName}</Text>
                  <Text style={styles.hostStatus}>Host • Streaming now</Text>
                </View>
                <GlowingButton style={styles.followButton}>
                  Follow
                </GlowingButton>
              </View>

              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionTitle}>About this stream</Text>
                <Text style={styles.descriptionText}>{stream?.description}</Text>
              </View>

              <View style={styles.actions}>
                <GradientButton
                  style={[styles.actionButton, isChatVisible && styles.actionButtonActive]}
                  onPress={toggleChat}
                >
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={18}
                    color={isChatVisible ? "#fff" : "#3d7aed"}
                    style={styles.actionIcon}
                  />
                  {isChatVisible ? "Hide Chat" : "Show Chat"}
                </GradientButton>
                <GradientButton
                  style={styles.actionButton}
                  onPress={handleShare}
                >
                  <Ionicons
                    name="share-social-outline"
                    size={18}
                    color="#3d7aed"
                    style={styles.actionIcon}
                  />
                  Share
                </GradientButton>
              </View>
            </View>

            {isChatVisible && (
              <View style={styles.chatContainer}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatTitle}>Live Chat</Text>
                  <Text style={styles.chatViewers}>{Math.round(stream?.viewerCount || 0 * 0.7)} chatting</Text>
                </View>

                <ScrollView
                  style={styles.chatMessages}
                  ref={scrollViewRef}
                >
                  {chatMessages.map((msg) => (
                    <View key={msg.id} style={styles.chatMessage}>
                      <Text style={styles.chatUsername}>
                        {msg.username}
                        {msg.isHost && <Text style={styles.hostBadge}> (Host)</Text>}
                      </Text>
                      <Text style={styles.chatText}>{msg.message}</Text>
                      <Text style={styles.chatTimestamp}>{msg.timestamp}</Text>
                    </View>
                  ))}
                </ScrollView>

                <View style={styles.chatInputContainer}>
                  <TextInput
                    style={styles.chatInputField}
                    placeholder="Type a message..."
                    placeholderTextColor="#999"
                    value={chatInput}
                    onChangeText={setChatInput}
                    returnKeyType="send"
                    onSubmitEditing={sendChatMessage}
                  />
                  <TouchableOpacity
                    style={styles.sendButton}
                    onPress={sendChatMessage}
                    disabled={!chatInput.trim()}
                  >
                    <Ionicons
                      name="send"
                      size={20}
                      color={chatInput.trim() ? "#3d7aed" : "#999"}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'hsl(221 20% 11%)',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'hsl(221 20% 11%)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'hsla(0, 0%, 100%, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
  likeButton: {
    padding: 8,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16/9,
    backgroundColor: '#000',
  },
  fullscreenVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    aspectRatio: undefined,
    width,
    height,
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  blurBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholderText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  videoControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  playPauseButton: {
    marginRight: 10,
  },
  progressBarContainer: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3d7aed',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  progressBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  volumeBar: {
    width: 50,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 5,
    borderRadius: 2,
    overflow: 'hidden',
  },
  volumeFill: {
    height: '100%',
    backgroundColor: 'white',
  },
  fullscreenButton: {
    padding: 5,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  detailsContainer: {
    flex: 1,
    padding: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  streamTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  viewerCount: {
    fontSize: 14,
    color: 'hsla(0, 0%, 100%, 0.6)',
  },
  liveIndicator: {
    backgroundColor: '#f44336',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  hostInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    padding: 12,
    backgroundColor: 'hsla(0, 0%, 100%, 0.03)',
    borderRadius: 8,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3d7aed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarInitial: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  hostInfo: {
    flex: 1,
  },
  hostName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  hostStatus: {
    color: 'hsla(0, 0%, 100%, 0.6)',
    fontSize: 12,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 0,
  },
  descriptionContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'hsla(0, 0%, 100%, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'hsla(0, 0%, 100%, 0.1)',
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: 'hsla(0, 0%, 100%, 0.7)',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  actionButtonActive: {
    backgroundColor: '#3d7aed',
  },
  actionIcon: {
    marginRight: 8,
  },
  chatContainer: {
    width: '35%',
    borderLeftWidth: 1,
    borderLeftColor: 'hsla(0, 0%, 100%, 0.1)',
    backgroundColor: 'hsla(0, 0%, 0%, 0.3)',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'hsla(0, 0%, 100%, 0.1)',
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  chatViewers: {
    fontSize: 12,
    color: 'hsla(0, 0%, 100%, 0.6)',
  },
  chatMessages: {
    flex: 1,
    padding: 16,
  },
  chatMessage: {
    marginBottom: 16,
  },
  chatUsername: {
    color: '#3d7aed',
    fontWeight: 'bold',
    fontSize: 14,
  },
  hostBadge: {
    color: '#f44336',
  },
  chatText: {
    color: 'white',
    fontSize: 14,
    marginTop: 4,
  },
  chatTimestamp: {
    color: 'hsla(0, 0%, 100%, 0.4)',
    fontSize: 10,
    marginTop: 4,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'hsla(0, 0%, 100%, 0.1)',
  },
  chatInputField: {
    flex: 1,
    backgroundColor: 'hsla(0, 0%, 100%, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: 'white',
    fontSize: 14,
  },
  sendButton: {
    marginLeft: 8,
    padding: 8,
  },
});