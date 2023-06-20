import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { auth } from '../firebase';

const Settings = () => {
  const [username, setUsername] = useState('');

  // Fetch the current user's email when the component mounts
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUsername(user.email);
    }
  }, []);

  // const handleSave = () => {
  //   // Here you would typically update the username in your database
  //   console.log(`Saved: ${username}`);
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        // onChangeText={setUsername}
      />
      {/* <Button title="Save" onPress={handleSave} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
});

export default Settings;
