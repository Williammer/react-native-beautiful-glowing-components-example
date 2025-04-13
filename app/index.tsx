import { FormInput } from '@/components/FormInput';
import { GlaringSegment } from '@/components/GlaringSegment';
import { GlowingButton } from '@/components/GlowingButton';
import { GradientButton } from '@/components/GradientButton';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, Text, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export default function MainScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validate inputs
    let isValid = true;

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    if (!isValid) return;

    // Show loading state
    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      setIsLoading(false);

      // For demo purposes, we'll accept any valid input
      // In a real app, you would verify credentials with a backend service
      router.replace('/livestream');
    }, 1500);
  };

  const handleCreateAccount = () => {
    Alert.alert(
      "Create Account",
      "This would navigate to a signup page in a complete app.",
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <MotiView
        style={styles.logoContainer}
        from={{ translateY: 10, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{
          type: 'timing',
          duration: 1200,
          delay: 400,
        }}>
        <Image
          source={require('@/components/images/logo.png')}
          resizeMode="contain"
          style={styles.logoImage}
        />
      </MotiView>
      <MotiView
        style={styles.formContainer}
        from={{ translateY: 10, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{
          type: 'timing',
          duration: 1200,
          delay: 800,
        }}>
        <GlaringSegment style={styles.segment}>
          <Text style={styles.heading}>Hello</Text>

          <FormInput
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={emailError}
          />

          <FormInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoComplete="password"
            error={passwordError}
          />

          <GlowingButton
            style={styles.button}
            onPress={handleLogin}>
            {isLoading ? <ActivityIndicator color="white" /> : "Log in"}
          </GlowingButton>

          <Text style={styles.text}>Just getting started?</Text>

          <GradientButton
            style={styles.button}
            className="create-account-button"
            onPress={handleCreateAccount}>
            Create an account
          </GradientButton>
        </GlaringSegment>
      </MotiView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'hsl(221 20% 11%)',
    justifyContent: 'center'
  },
  heading: {
    opacity: 0.8,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 24,
  },
  formContainer: {
    flex: 1,
    padding: 12,
  },
  segment: {
    margin: 24
  },
  button: {
    marginVertical: 10,
    minHeight: 48,
  },
  text: {
    marginTop: 16,
    color: 'white',
    textAlign: 'center',
    opacity: 0.6,
  },
  logoContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  logoImage: {
    width: 160,
    height: 160,
  },
});
