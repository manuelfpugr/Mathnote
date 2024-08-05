import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

const Stack = createStackNavigator();

const loadFonts = () => {
  return Font.loadAsync({
    'massallera': require('./assets/fonts/massallera.ttf'),
  });
};

const Home = () => {
  const navigation = useNavigation();
  const [bienvenida, setBienvenida] = useState("¡Bienvenido a Mathnote!");
  const [navegacion, setNavegacion] = useState("¿Hacia dónde le gustaría ir?");
  const [opacity] = useState(new Animated.Value(1));
  const [recording, setRecording] = useState(null);
  const [message, setMessage] = useState('');
  const [transcription, setTranscription] = useState('');
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showBienvenida, setShowBienvenida] = useState(true);
  const [showNavegacion, setShowNavegacion] = useState(false);
  const [hasShownBienvenida, setHasShownBienvenida] = useState(false);
  const [hasShownNavegacion, setHasShownNavegacion] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => {
        setShowBienvenida(false);
        const timer2 = setTimeout(() => {
          setShowNavegacion(true);
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
  }, []);

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
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
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
    const validAritmetica = [
      "abrir aritmetica",
      "quiero hacer operaciones",
      "hacer operaciones matematicas",
      "hacer operaciones",
      "ir a aritmetica",
      "quiero entrar a aritmetica",
      "quiero ir a aritmetica",
      "entrar en aritmetica",
      "acceder a la seccion de aritmetica",
      "mostrar aritmetica",
      "ir a la seccion de aritmetica",
      "acceder a aritmetica",
      "ir al apartado de aritmetica",
      "quiero hacer calculos",
      "abrir la seccion de aritmetica",
      "ir a las operaciones matematicas",
      "entrar a operaciones aritmeticas",
      "quiero hacer aritmetica",
      "ir a las operaciones aritmeticas",
      "abrir el apartado de aritmetica",
      "quiero hacer una suma",
      "quiero hacer sumas",
      "ir a sumas",
      "abrir la seccion de sumas",
      "quiero hacer restas",
      "quiero restar",
      "abrir el apartado de restas",
      "ir a las restas",
      "quiero multiplicar",
      "quiero hacer multiplicaciones",
      "quiero hacer una multiplicacion",
      "abrir la seccion de multiplicaciones",
      "ir a multiplicaciones",
      "quiero dividir",
      "abrir el apartado de divisiones",
      "ir a divisiones",
      "hacer calculos con fracciones",
      "quiero operar con fracciones",
      "abrir la seccion de fracciones",
      "ir al apartado de fracciones",
      "quiero calcular algo",
      "voy a hacer una operacion",
      "vamos a sumar",
      "vamos a restar",
      "haz una multiplicacion",
      "necesito dividir",
      "abre la calculadora de aritmetica",
      "calculadora de aritmetica",
      "sumar numeros",
      "multiplicar cifras",
      "quiero resolver una operacion aritmetica",
      "hacer cuentas",
      "voy a hacer matematicas",
      "voy a hacer unas cuentas",
      "necesito hacer una operacion",
      "hacer una operacion matematica",
      "voy a realizar un calculo",
      "resuelve una operacion",
      "necesito resolver una suma",
      "quiero resolver una resta",
      "resolver una multiplicacion",
      "resolver una division",
      "quiero hacer calculos matematicos",
      "quiero resolver operaciones matematicas",
      "quiero hacer cuentas matematicas",
      "quiero resolver problemas aritmeticos",
      "quiero hacer ejercicios de aritmetica",
      "quiero practicar aritmetica",
      "quiero aprender aritmetica",
      "quiero estudiar aritmetica",
      "quiero mejorar en aritmetica",
      "quiero resolver ejercicios de aritmetica",
      "quiero resolver problemas de aritmetica",
      "quiero hacer ejercicios matematicos",
      "quiero resolver problemas matematicos",
      "quiero practicar matematicas",
      "quiero aprender matematicas",
      "quiero estudiar matematicas",
      "quiero mejorar en matematicas",
      "quiero resolver ejercicios matematicos",
      "quiero resolver problemas matematicos"
    ];
    const validGeometria = [
    "Abrir Geometría",
    "Ir a Geometría",
    "Quiero entrar a Geometría",
    "Entrar en Geometría",
    "Acceder a la sección de Geometría",
    "Mostrar Geometría",
    "Ir a la sección de Geometría",
    "Acceder a Geometría",
    "Ir al apartado de Geometría",
    "Quiero hacer dibujos geométricos",
    "Abrir la sección de Geometría",
    "Ir a los elementos geométricos",
    "Entrar a figuras geométricas",
    "Quiero hacer geometría",
    "Ir a las figuras geométricas",
    "Abrir el apartado de Geometría",
    "Dibujar ángulos",
    "Añadir un ángulo",
    "Dibujar un ángulo en una figura",
    "Añadir un radio",
    "Añadir un diámetro",
    "Añadir lados",
    "Añadir un lado",
    "Añadir ángulos",
    "Dibujar un círculo",
    "Dibujar un triángulo",
    "Dibujar un cuadrado",
    "Dibujar un rectángulo",
    "Dibujar polígonos",
    "Quiero trabajar con figuras geométricas",
    "Ir a los polígonos",
    "Abrir la sección de ángulos",
    "Añadir elementos geométricos",
    "Quiero dibujar una figura",
    "Voy a hacer geometría",
    "Voy a dibujar una figura",
    "Necesito dibujar un ángulo",
    "Añadir un radio al círculo",
    "Añadir un diámetro al círculo",
    "Añadir lados a la figura",
    "Dibujar lados en una figura",
    "Añadir un ángulo a la figura",
    "Dibujar un radio",
    "Añadir lados a un polígono",
    "Dibujar ángulos en una figura",
    "Dibujar figuras geométricas",
    "Voy a crear un ángulo",
    "Voy a crear una figura",
    "Dibujar un radio en un círculo",
    "Dibujar un diámetro en un círculo",
    "Hacer una figura geométrica",
    "Hacer geometría"
    ];

    const validActividades = [
  "Abrir Cuaderno de Actividades",
  "Ir al Cuaderno de Actividades",
  "Quiero entrar al Cuaderno de Actividades",
  "Entrar en el Cuaderno de Actividades",
  "Acceder a la sección de Cuaderno de Actividades",
  "Mostrar Cuaderno de Actividades",
  "Ir a la sección de Cuaderno de Actividades",
  "Acceder al Cuaderno de Actividades",
  "Ir al apartado de Cuaderno de Actividades",
  "Quiero ver mis actividades",
  "Abrir la sección de actividades",
  "Ir al cuaderno de operaciones",
  "Entrar al cuaderno de operaciones",
  "Ver mis operaciones guardadas",
  "Ir a las actividades guardadas",
  "Abrir el apartado de actividades",
  "Ver el historial de operaciones",
  "Ver operaciones realizadas",
  "Editar mis operaciones",
  "Ver el cuaderno de actividades",
  "Editar actividades",
  "Ver todas las actividades",
  "Abrir el historial de operaciones",
  "Quiero editar una operación",
  "Ir al historial de operaciones",
  "Acceder al historial de actividades",
  "Ver las operaciones en el cuaderno",
  "Ir al cuaderno de trabajo",
  "Ver actividades anteriores",
  "Revisar actividades guardadas",
  "Modificar actividades",
  "Quiero ver el cuaderno de actividades",
  "Abrir mi cuaderno de actividades",
  "Revisar el cuaderno de operaciones",
  "Ir a mis actividades",
  "Ir a mi cuaderno de actividades",
  "Ver cuaderno de actividades",
  "Abrir mi cuaderno de operaciones",
  "Editar una actividad",
  "Acceder al cuaderno de trabajo",
  "Ver actividades en el cuaderno",
  "Ver cuaderno de operaciones",
  "Revisar cuaderno de actividades",
  "Abrir actividades guardadas"
    ];
    const textoLimpio = limpiarTexto(text);
    console.log("Texto:", textoLimpio);
    if (validAritmetica.includes(textoLimpio.toLowerCase())) {
      navigation.navigate('Aritmetica');
    } else if (validGeometria.includes(textoLimpio.toLowerCase())) {
      navigation.navigate('Geometria');
    } else if (validActividades.includes(textoLimpio.toLowerCase())) {
      navigation.navigate('Actividades');
    } else {
      setMessage("Disculpa, no te entendí. ¿Puedes repetir?");
    }
  };

  function limpiarTexto(texto) {
    return texto
      .toLowerCase() // Convertir a minúsculas
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
      .replace(/[^\w\s]/gi, '') // Eliminar puntuación
      .trim(); // Eliminar espacios en blanco al inicio y al final
  }

  return (
    <View style={styles.container}>
    <Text style={[styles.text, styles.title]}>Mathnote</Text>
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
  
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Aritmética</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Geometría</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Ver Actividades</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.micButton} onPress={recording ? stopRecording : startRecording}>
        <Icon name={recording ? 'stop' : 'microphone'} size={60} color={recording ? 'red' : 'black'} />
      </TouchableOpacity>


     
      
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
    padding: 30,
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
    top: 40,
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default Home;