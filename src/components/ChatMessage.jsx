// ChatMessage.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useContext } from 'react';
import AuthContext from '../components/AuthContext';

const ChatMessage = ({ data }) => {
  const { authState } = useContext(AuthContext);
  return (
    <View style={[styles.messageContainer, data.senderId==authState.id ? styles.currentUserMessage : styles.otherUserMessage]}>
      <Text style={styles.messageText}>{data.message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  otherUserMessage: {
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 16,
  },
});

export default ChatMessage;
