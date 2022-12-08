import {React, Node, useState} from 'react';
import {
  SafeAreaView,
  Button,
  View,
  Image,
  StyleSheet,
  Text,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';

const App: () => Node = () => {
  const [photoUri, setPhotoUri] = useState(null);
  const [resizeUri, setResizeUri] = useState(null);

  const handleChoosePhoto = () => {
    const options = {
      title: 'Select Photo',
    };
    launchImageLibrary(options, response => {
      if (response) {
        const source = {response}?.response?.assets[0];
        console.log(source);
        setPhotoUri(source);
      }
    });
  };
  const SavePhoto = () => {
    try {
      ImageResizer.createResizedImage(photoUri.uri, 1200, 1200, 'JPEG', 100)
        .then(response => {
          setResizeUri(response);
        })
        .catch(err => {
          console.log(err);
        });
    } catch (e) {}
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={{
            uri: photoUri?.uri,
          }}
          style={styles.imageContainer}
        />
        <Image
          source={{
            uri: resizeUri?.uri,
          }}
          style={styles.imageContainer}
        />
        <View style={styles.textContainer}>
          <View style={styles.textView}>
            <Text>Genişlik = {photoUri?.width}</Text>
            <Text>Yükselik = {photoUri?.height}</Text>
            <Text>Boyut = {photoUri?.fileSize}</Text>
          </View>
          <View style={styles.textView}>
            <Text>Genişlik = {resizeUri?.width}</Text>
            <Text>Yükselik = {resizeUri?.height}</Text>
            <Text>Boyut = {resizeUri?.size}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button onPress={handleChoosePhoto} title="Upload Image" />
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={SavePhoto} title="Save Photo" />
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
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    width: '100%',
    height: '100%',
  },

  textContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    margin: 10,
  },
  textView: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
});

export default App;
