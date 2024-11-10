import React from 'react';
import { View, Text, Image, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { deleteOperation } from './db/database'; // Asegúrate de que la ruta sea correcta

const ImageDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { operation } = route.params;

  const handleDelete = async () => {
    await deleteOperation(operation.id);
    navigation.navigate('Actividades');
  };

  const handleModify = () => {
  
    // Lista de figuras geométricas
    const geometricFigures = [
      'angulo', 'cono', 'cuadrado', 'triangulo', 'rectangulo', 'circulo', 'pentagono', 
      'hexagono', 'rombo', 'elipse', 'esfera', 'piramide', 'cubo', 'cilindro'
    ];
    // Verificar si la operación es una figura geométrica
    if (geometricFigures.includes(operation.operacion)) {
      navigation.navigate('Geometria', { operation });
    } else {
      navigation.navigate('Aritmetica', { operation });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.title]}>Operacion</Text>
      <Image source={{ uri: operation.foto }} style={styles.image} resizeMode="cover" />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleModify}>
          <Text style={styles.buttonText}>Modificar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleDelete}>
          <Text style={styles.buttonText}>Borrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  title: {
    top: 5,
    padding: 20,
    fontSize: 30,
    fontWeight: '800',
    fontFamily: 'massallera',
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  image: {
    
    width: '100%',
    height: '80%',
    
    marginBottom: 0,
    borderRadius: 8,
    overflow: 'hidden', // Evita que el borde se vea en la parte inferior del recuadro
    transform: [{ translateY: 0 }],
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    bottom: 40,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: 'black',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'massallera',
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ImageDetail;