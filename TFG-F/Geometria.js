import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import regexUtils from './utils/regexUtils.js';

import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';

import {drawAngle} from './utils/utils.js'; 



const Geometria = () => {

  const [opacity] = useState(new Animated.Value(1));
  const [recording, setRecording] = useState(null);
  const [message, setMessage] = useState('');
  const [lado, setLado] = useState(0);
  const [base, setBase] = useState(0);
  const [altura, setAltura] = useState(0);
  const [area, setArea] = useState(0);
  const [perimetro, setPerimetro] = useState(0);
  const [figure, setFigure] = useState(null);
  const [angleDegrees, setAngleDegrees] = useState(0);
  
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
      })
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

    
    const figureRegex = regexUtils.matchGeometricFigure(text);
    const figure3DRegex = regexUtils.matchGeometric3DFigure(text);
    const angleRegex = regexUtils.matchAngle(text);

    console.log("Text: " + text, "Figure: " + figureRegex, "Figure 3D: " + figure3DRegex, "Angle: " + angleRegex);

    if (figureRegex) {
      setFigure(figureRegex[4]);
    } else if (figure3DRegex) {
      setFigure(figure3DRegex[4]);
    } else if (angleRegex) {
      setFigure('ángulo');
      setAngleDegrees(angle); // Actualiza el estado del ángulo
    } else {
      setFigure(null);
    }
  };

  const renderIcon = () => {
    console.log("Figure: " + figure);
    switch (figure) {
      case 'cuadrado':
        return <Ionicons name="square-outline" size={300} color="black" />;
      case 'triángulo':
        return <Ionicons name="triangle-outline" size={300} color="black" />;
      case 'rectángulo':
        return <MaterialCommunityIcons name="rectangle-outline" size={300} color="black" />;
      case 'círculo':
        return <MaterialCommunityIcons name="circle-outline" size={300} color="black" />;
      case 'pentágono':
        return <MaterialCommunityIcons name="pentagon-outline" size={300} color="black" />;
      case 'hexágono':
        return <MaterialCommunityIcons name="hexagon-outline" size={300} color="black" />;
      case 'octágono':
        return <MaterialCommunityIcons name="octagon-outline" size={300} color="black" />;
      case 'rombo':
        return <MaterialCommunityIcons name="rhombus-outline" size={300} color="black" />;
      case 'elipse':
        return <MaterialCommunityIcons name="ellipse-outline" size={300} color="black" />;
      case 'esfera':
        return <MaterialCommunityIcons name="sphere" size={300} color="black" />;
      case 'cubo':
        return <Ionicons name="cube-outline" size={300} color="black" />;
      case 'cilindro':
        return <MaterialCommunityIcons name="cylinder" size={300} color="black" />;
      case 'cono':
        return <MaterialCommunityIcons name="cone" size={300} color="black" />;
      case 'ángulo':
        console.log("Ángulo: " + angleDegrees);
        return drawAngle(angleDegrees); // Usa la función drawAngle
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.title]}>Geometría</Text>

      <TouchableOpacity style={styles.micButton} onPress={recording ? stopRecording : startRecording}>
        <Icon name={recording ? 'stop' : 'microphone'} size={60} color={recording ? 'red' : 'black'} />
      </TouchableOpacity>

      {figure && (
        <View style={styles.iconContainer}>
          {renderIcon()}
        </View>
      )}

    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute',
    bottom: 80,
    justifyContent: 'center',
    padding: 10,
    borderRadius: 50,
  
  },

  title: {
    top: 20,
    padding: 30,
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 20,
  },
  text: {
    padding: 30,
    textAlign: 'justify',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'massallera',
  },
  micButton: {
    top: 0,
    bottom: 0,
    marginTop: 10,
  },
});

export default Geometria;