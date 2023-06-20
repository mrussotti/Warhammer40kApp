import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import UploadButton from '../components/uploadButton';

const MainMenu = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main Menu</Text>
      <Button title="Army" onPress={() => navigation.navigate('Army')} />
      <Button title="Play" onPress={() => navigation.navigate('Play')} />
      <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
      <UploadButton/>
    </View>
  );
};

export default MainMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
