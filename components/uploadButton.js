import React from 'react';
import { Button } from 'react-native';
import uploadFactions from '../uploadFactions'; // adjust the path to match where you saved the file

const UploadButton = () => {
  const handlePress = async () => {
    try {
      await uploadFactions();
      console.log('Factions uploaded successfully');
    } catch (error) {
      console.error('Error uploading factions: ', error);
    }
  };

  return (
    <Button
      title="Upload Factions"
      onPress={handlePress}
    />
  );
};

export default UploadButton;