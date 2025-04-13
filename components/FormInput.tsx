import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View, Text } from 'react-native';

type Props = TextInputProps & {
  error?: string;
};

export const FormInput: React.FC<Props> = ({ error, ...inputProps }) => {
  return (
    <View style={styles.wrapper}>
      <TextInput
        placeholderTextColor="#ffffffa0"
        {...inputProps}
        style={[styles.container, error && styles.inputError]}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,
  },
  container: {
    paddingHorizontal: 10,
    height: 44,
    fontSize: 18,
    color: 'white',
    backgroundColor: '#202020',
    borderWidth: 1,
    borderColor: 'hsla(0, 0%, 100%, 0.2)',
    borderRadius: 8,
    boxShadow: `
      0 1px 2px 0 rgba(0, 0, 0, 0.22),
      0 6px 16px 0 rgba(0, 0, 0, 0.22)
    `,
  },
  inputError: {
    borderColor: '#f44336',
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  }
});
