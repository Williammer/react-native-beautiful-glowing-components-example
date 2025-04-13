import React, {
  PropsWithChildren,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  Text,
  Pressable,
  View,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { InnerReflextionEffect } from './InnerReflectionEffect';
import { OuterGlowEffect } from './OuterGlowEffect';

type ButtonProps = PropsWithChildren<{
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  className?: string;
}>;

export const GlowingButton: React.FC<ButtonProps> = ({ children, style, onPress, className }) => {
  const [pressed, setPressed] = useState<boolean>(false);
  const [buttonWidth, setButtonWidth] = useState<number>(100);
  const [buttonHeight, setButtonHeight] = useState<number>(100);
  const refContainer = useRef<View>(null);

  useLayoutEffect(() => {
    if (refContainer.current) {
      // @ts-ignore
      refContainer.current.measure((_x, _y, width, height) => {
        if (width > 0 && height > 0) {
          setButtonWidth(width);
          setButtonHeight(height);
        }
      });
    }
  }, []);

  const handlePressIn = () => {
    setPressed(true);
  };
  const handlePressOut = () => {
    setPressed(false);
  };

  return (
    <View style={[style, styles.container]}>
      <Pressable
        style={[
          styles.button,
          Platform.OS === 'web' && styles.buttonWeb,
          Platform.OS === 'web' && pressed && styles.buttonWebPressed
        ]}
        className={Platform.OS === 'web' ? `glowing-button ${className || ''}` : undefined}
        ref={refContainer}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}>
        {Platform.OS !== 'web' && (
          <InnerReflextionEffect
            width={buttonWidth}
            height={buttonHeight}
            opacity={0.5}
          />
        )}
        {Platform.OS !== 'web' && (
          <Svg
            style={[styles.buttonSvg, { width: buttonWidth - 2, height: buttonHeight - 2 }]}
            viewBox={`0 0 ${buttonWidth - 2} ${buttonHeight - 2}`}>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop
                  offset="0"
                  stopColor="hsla(0, 0%, 100%, 0.16)"
                  stopOpacity="0.25"
                />
                <Stop
                  offset="1"
                  stopColor="hsla(0, 0%, 100%, 0)"
                  stopOpacity="0.0"
                />
              </LinearGradient>
            </Defs>
            {!pressed && (
              <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
            )}
          </Svg>
        )}
        <Text style={[
          styles.buttonTitle,
          Platform.OS === 'web' && styles.buttonTitleWeb
        ]}>
          {children}
        </Text>
      </Pressable>
      {Platform.OS !== 'web' && (
        <OuterGlowEffect
          width={buttonWidth}
          height={buttonHeight}
          opacity={0.8}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  button: {
    position: 'relative',
    overflow: 'hidden',
    height: 44,
    padding: 0,
    backgroundColor: '#303030',
    borderRadius: 8,
    boxShadow: `
      0 0 0 1px #303030,
      0 1px 2px 0 rgba(0, 0, 0, 0.32),
      0 6px 16px 0 rgba(0, 0, 0, 0.32)
    `,
  },
  buttonWeb: {
    backgroundColor: '#2563eb',
    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
    cursor: 'pointer',
    height: 48,
    // Note: For web transitions, add a separate CSS file with the same class name as this component
    // .GlowingButton { transition: all 0.2s ease-in-out; }
    // .GlowingButton:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(29, 78, 216, 0.25); background-color: #1d4ed8; }
  },
  buttonWebPressed: {
    backgroundColor: '#1e40af',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(1px)',
  },
  buttonTitle: {
    zIndex: 3,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    margin: 8,
    textShadowRadius: 1,
    textShadowOffset: { width: 0, height: -1 },
    textShadowColor: 'hsla(0, 0%, 0%, 0.1)',
  },
  buttonTitleWeb: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontSize: 16,
    fontWeight: '600',
    margin: 12,
  },
  buttonSvg: {
    overflow: 'hidden',
    position: 'absolute',
    backgroundColor: '#303030',
    borderRadius: 7,
    left: 1,
    top: 1,
    zIndex: 2,
  },
});
