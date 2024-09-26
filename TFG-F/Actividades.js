import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getAllOperations } from './db/database'; // Asegúrate de que la ruta sea correcta

const Actividades = () => {
  const [recording, setRecording] = useState(false);
  const [operations, setOperations] = useState([]);
  const [message, setMessage] = useState('');
  const navigation = useNavigation();

  const fetchOperations = async () => {
    const ops = await getAllOperations();
    setOperations(ops);
    console.log('Operaciones almacenadas:', ops);
  };

  useEffect(() => {
    fetchOperations();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchOperations();
    }, [])
  );

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
    // Lógica para detener la grabación y obtener la URI del archivo grabado
    const uri = 'path/to/recorded/file.wav'; // Reemplaza esto con la URI real
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
    } finally {
      setRecording(false);
    }
  };

  const handleOperation = (text) => {
    // Lógica para manejar la operación transcrita
    console.log('Transcribed text:', text);
  };

  const renderOperation = ({ item }) => (
    <View style={styles.gridItem}>
      {item.foto && (
        <TouchableOpacity onPress={() => navigation.navigate('ImageDetail', { operation: item })}>
          <Image source={{ uri: item.foto }} style={styles.image} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.title]}>Actividades</Text>
      <TouchableOpacity style={styles.micButton} onPress={recording ? stopRecording : startRecording}>
        <Icon name={recording ? 'stop' : 'microphone'} size={60} color={recording ? 'red' : 'black'} />
      </TouchableOpacity>
      {message && <Text style={styles.text}>{message}</Text>}
      <FlatList
        data={operations}
        renderItem={renderOperation}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    fontFamily: 'massallera',
    color: '#333',
  },
  title: {
    top: 5,
    alignSelf: 'center',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 20,
  },
  micButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  grid: {
    justifyContent: 'space-between',
  },
  gridItem: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    alignItems: 'center',
    borderColor: '#000', // Borde negro
    borderWidth: 1, // Ancho del borde
  },
  image: {
    width: 100,
    height: 70,
    marginTop: 0,
    marginBottom: 30, // Más espacio en la parte inferior
  },
});

export default Actividades;