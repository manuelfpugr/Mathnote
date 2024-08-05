import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

const loadFonts = () => {
  return Font.loadAsync({
    'massallera': require('./assets/fonts/massallera.ttf'),
  });
};

const Aritmetica = () => {
  const [bienvenida, setBienvenida] = useState("¡Bienvenido a Aritmética!");
  const [navegacion, setNavegacion] = useState("¿Que operación quiere realizar?");
  const [recording, setRecording] = useState(null);
  const opacity = React.useRef(new Animated.Value(1)).current;
  const [message, setMessage] = useState('');
  const [operation, setOperation] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showBienvenida, setShowBienvenida] = useState(true);
  const [showNavegacion, setShowNavegacion] = useState(false);
  const [hasShownBienvenida, setHasShownBienvenida] = useState(false);
  const [hasShownNavegacion, setHasShownNavegacion] = useState(false);

  React.useEffect(() => {
    if (!hasShownBienvenida && !hasShownNavegacion) {
      const timer1 = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }).start(() => {
          setShowBienvenida(false);
          setHasShownBienvenida(true);
          const timer2 = setTimeout(() => {
            setShowNavegacion(true);
            setHasShownNavegacion(true);
            Animated.timing(opacity, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }).start();
          }, 2000); // Espera 2 segundos antes de mostrar el mensaje de navegación
          return () => clearTimeout(timer2);
        });
      }, 3000);
  
      return () => clearTimeout(timer1);
    }
  }, [hasShownBienvenida, hasShownNavegacion]);

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
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 192000,
          },
          ios: {
            extension: '.wav',
            audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 192000,
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
        handleOperation(data.text);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Failed to upload file');
    }
  };

  const handleOperation = (text) => {
    // Modificar la expresión regular para capturar múltiples números y operadores
    const match = text.match(/(\d+)\s*(menos|más|\+|\-|por|dividido)\s*(\d+(\s*(menos|más|\+|\-|por|dividido)\s*\d+)*)/);
    if (match) {
      // Extraer todos los números y el operador
      const numbers = [match[1]];
      let operator = match[2];
      const rest = match[3];
  
      // Extraer números adicionales del resto de la cadena
      const additionalMatches = rest.match(/(\d+)/g);
      if (additionalMatches) {
        numbers.push(...additionalMatches);
      }
  
      // Convertir el operador a su símbolo correspondiente
      switch (operator) {
        case 'más':
          operator = '+';
          break;
        case 'menos':
          operator = '-';
          break;
        case 'por':
          operator = 'x';
          break;
        case 'dividido':
          operator = '/';
          break;
      }
  
      // Llamar a setOperation con una lista de números y el operador
      setOperation({ numbers, operator });
    } else {
      setMessage("Operación no reconocida, intenta de nuevo.");
    }
  };
  
  const renderOperation = (operation) => {
    const { numbers, operator } = operation;
  
    // Padding para asegurar que los números estén alineados a la derecha
    const maxLength = Math.max(...numbers.map(num => num.length));
    const paddedNumbers = numbers.map(num => num.padStart(maxLength, ' '));
  
    return (
      <View style={styles.operationContainer}>
      {paddedNumbers.map((paddedNum, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.operator}>
            {index === paddedNumbers.length - 1 ? operator : ' '}
          </Text>
          {paddedNum.split('').map((digit, digitIndex) => (
            <Text key={digitIndex} style={styles.number}>{digit}</Text>
          ))}
        </View>
      ))}
      <View style={styles.divider} />
      
    </View>
  );
};

  return (
    <View style={styles.container}>
    <Text style={[styles.text, styles.title]}>Aritmética</Text>
    {showBienvenida && !hasShownBienvenida && (
      <Animated.Text style={[styles.text, { opacity }]} onLayout={() => setHasShownBienvenida(false)}>
        {bienvenida}
      </Animated.Text>
    )}
    {showNavegacion && !hasShownNavegacion && (
      <Animated.Text style={[styles.text, { opacity }]} onLayout={() => setHasShownNavegacion(false)}>
        {navegacion}
      </Animated.Text>
    )}
    {message && <Text style={styles.text}>{message}</Text>}
   
      <TouchableOpacity style={styles.micButton} onPress={recording ? stopRecording : startRecording}>
        <Icon name={recording ? 'stop' : 'microphone'} size={60} color={recording ? 'red' : 'black'} />
      </TouchableOpacity>

      {operation && renderOperation(operation)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {
    paddingtop: 10,
    paddingLeft: 20,
    justifyContent: 'center',
    paddingRight: 20,
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
    top: 400,
    marginTop: 20,
  },
  operationContainer: {
    alignItems: 'center',
   
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    
  },
  number: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'right',
    width:30, // Ajustar según el espacio necesario
    fontFamily: 'massallera',
  },
  operator: {
    fontFamily: 'massallera',
    fontSize: 40,
    textAlign: 'left',
    width: 30, // Ajustar según el espacio necesario

  },
  divider: {
    height: 4,
    paddingleft: 60,
    backgroundColor: 'black',
    width: 120, // Asegurar que la barra ocupe el espacio correcto
    marginVertical: 10,
  },
});

export default Aritmetica;
