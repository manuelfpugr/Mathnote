import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Font from 'expo-font';
import Home from './Home';
import Aritmetica from './Aritmetica';
import ImageDetail from './ImageDetail';
import Geometria from './Geometria';
import Actividades from './Actividades';
import AppLoading from 'expo-app-loading';
import { name as appName } from './app.json';
import { AppRegistry } from 'react-native';

const Stack = createStackNavigator();

const loadFonts = () => {
  return Font.loadAsync({
    'massallera': require('./assets/fonts/massallera.ttf'),
  });
};

const App = () => {
  const navigation = useNavigation();
  const [recording, setRecording] = useState(null);
  const [message, setMessage] = useState('');
  const [transcription, setTranscription] = useState('');
  const [fontsLoaded, setFontsLoaded] = useState(false);

  if (!fontsLoaded) {
    return (
      <AppLoading
        startAsync={loadFonts}
        onFinish={() => setFontsLoaded(true)}
        onError={console.warn}
      />
    );
  }

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync({
          android: {
            extension: '.wav',
            outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
            audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
            sampleRate: 44100, // Aumenta la tasa de muestreo para mejor calidad
            numberOfChannels: 2, // Usa grabación estéreo
            bitRate: 192000, // Aumenta el bit rate para mejor calidad
          },
          ios: {
            extension: '.wav',
            audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX, // Usa la máxima calidad de audio
            sampleRate: 44100, // Aumenta la tasa de muestreo para mejor calidad
            numberOfChannels: 2, // Usa grabación estéreo
            bitRate: 192000, // Aumenta el bit rate para mejor calidad
          },
        });
        setRecording(recording);
        setMessage('Recording...');
      } else {
        setMessage('Permission to access microphone is required!');
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    setRecording(undefined);
    setMessage('Recording stopped');
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording URI:', uri);

    const formData = new FormData();
    formData.append('file', {
      uri,
      name: 'audio.wav',
      type: 'audio/wav',
    });

    try {
      const response = await fetch('https://absolute-mammoth-directly.ngrok-free.app/transcribe', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setTranscription(data.text);
        validateInput(data.text);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Failed to upload file');
    }
  };

  const validateInput = (text) => {
    const validPhrases = [
      "entrar",
      "iniciar",
      "acceder",
      "comenzar",
      "ingresar",
      "usar",
      "quiero entrar", 
      "quiero iniciar", 
      "quiero acceder",
      "quiero comenzar",
      "quiero empezar",
      "quiero usar",
      "quiero ingresar",
      "quiero entrar a mathnote",
      "quiero iniciar sesión",
      "quiero acceder a mathnote"
    ];
    if (validPhrases.some(phrase => text.toLowerCase().includes(phrase))) {
      setMessage("¡Bienvenido a Mathnote!");
      navigation.navigate('Home'); // Navegar al componente Home
    } else {
      setMessage("Disculpa, no te entendí. ¿Puedes repetir?");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.title]}>Mathnote</Text>
      <Text style={styles.text}>{message}</Text>
      <TouchableOpacity style={styles.micButton} onPress={recording ? stopRecording : startRecording}>
      <Icon name={recording ? 'stop' : 'microphone'} size={60} color={recording ? 'red' : 'black'} />
      </TouchableOpacity>  
      
    </View>
  );
};

const AppContainer = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="App">
        <Stack.Screen name="App" component={App} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Aritmetica" component={Aritmetica} />
        <Stack.Screen name="Geometria" component={Geometria} />
        <Stack.Screen name="Actividades" component={Actividades} />
        <Stack.Screen name="ImageDetail" component={ImageDetail} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {
    padding:30,
    textAlign: 'justify',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'massallera',
  },
  title: {
    top: 20,
    padding: 30,
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 20,
  },
  micButton: {
    top:400,
    marginTop: 20,

  },
});
AppRegistry.registerComponent(appName, () => App);


export default AppContainer;