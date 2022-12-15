import {React, Node, useState} from 'react';
import {
  SafeAreaView,
  Button,
  View,
  Image,
  StyleSheet,
  PermissionsAndroid,
  Alert,
  TextInput,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

const App: () => Node = () => {
  const [photoUri, setPhotoUri] = useState(null);
  const [inputWidth, setInputWidth] = useState(null);
  const [inputHeight, setInputHeight] = useState(null);

  const getPermissionAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Image Download Permission',
          message: 'Your permission is required to save images to your device',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
      Alert.alert(
        '',
        'Your permission is required to save images to your device',
        [{text: 'OK', onPress: () => {}}],
        {cancelable: false},
      );
    } catch (err) {
      // handle error as you please
      console.log('err', err);
    }
  };

  const handleChoosePhoto = () => {
    const options = {
      title: 'Select Photo',
    };
    launchImageLibrary(options, response => {
      if (response) {
        const source = {response}?.response?.assets[0];
        setPhotoUri(source);
      } else {
        return;
      }
    });
  };

  const SavePhoto = async () => {
    if (inputHeight !== null && inputWidth !== null && photoUri !== null) {
      try {
        ImageResizer.createResizedImage(
          photoUri.uri,
          Number(inputWidth),
          Number(inputHeight),
          'JPEG',
          100,
        )
          .then(response => {
            getPermissionAndroid();
            CameraRoll.save(response.uri);
            Alert.alert('Bilgilendirme', 'Düzenleme Tamam', [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ]);
          })
          .catch(err => {
            console.log(err);
          });
      } catch (e) {}
    } else {
      return;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            width={'100%'}
            height={'100%'}
            resizeMode={'center'}
            source={{
              uri: photoUri?.uri,
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={setInputWidth}
            value={inputWidth}
            placeholder="Width"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            onChangeText={setInputHeight}
            value={inputHeight}
            placeholder="Height"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.buttonContainerView}>
          <View style={styles.buttonContainer}>
            <Button onPress={handleChoosePhoto} title="Upload Image" />
          </View>
          <View style={styles.buttonContainer}>
            <Button onPress={SavePhoto} title="Save Photo" color="red" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  buttonContainerView: {
    margin: 10,
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    flex: 1,
    margin: 10,
    padding: 5,
    backgroundColor: 'transparent',
  },

  imageContainer: {
    flex: 1,
    margin: 10,
    backgroundColor: 'transparent',
    padding: 10,
  },

  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    margin: 10,
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
});

export default App;
