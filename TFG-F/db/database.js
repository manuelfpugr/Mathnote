import ViewShot from 'react-native-view-shot';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

/**
 * Captura una parte específica de la pantalla y guarda la operación en AsyncStorage.
 * @param {Object} viewShotRef - Referencia al componente ViewShot.
 * @param {Object} operationData - Los datos de la operación (id, tipo, detalles).
 */
export const captureAndSaveOperation = async (viewShotRef, operationData) => {
  console.log("CAPTURANDO Y GUARDANDO OPERACIÓN");
  try {
    // Verificar que viewShotRef.current no sea null
    if (!viewShotRef.current) {
      throw new Error('viewShotRef.current is null');
    }

    // 1. Capturar la parte de la pantalla
    const uri = await viewShotRef.current.capture();
    console.log('Captura de pantalla realizada:', uri);

    // 2. Agregar la URI de la captura a los datos de la operación
    const operation = {
      ...operationData, // Datos pasados como parámetros (id, operación, detalles)
      foto: uri, // Guardar la URI de la captura
    };

    // 3. Guardar en AsyncStorage
    await saveOperation(operation);

  } catch (error) {
    console.error('Error al capturar o guardar la operación:', error);
  }
};

/**
 * Guarda una operación en AsyncStorage.
 * @param {Object} operation - Objeto que contiene los datos de la operación.
 */
const saveOperation = async (operation) => {
  try {
    const jsonValue = JSON.stringify(operation);
    await AsyncStorage.setItem(`@operation_${operation.id}`, jsonValue);
    console.log('Operación guardada en la base de datos');
  } catch (error) {
    console.error('Error al guardar la operación en la base de datos', error);
  }
};
/**
 * Obtiene todas las operaciones almacenadas en AsyncStorage.
 * @returns {Promise<Array>} - Una promesa que resuelve con un array de operaciones.
 */
export const getAllOperations = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const operationKeys = keys.filter(key => key.startsWith('@operation_'));
    const operations = await AsyncStorage.multiGet(operationKeys);
    const parsedOperations = operations.map(operation => JSON.parse(operation[1]));

    // Imprimir las operaciones en la consola en formato de lista
    console.log('Operaciones almacenadas:');
    parsedOperations.forEach((operation, index) => {
      console.log(`\nOperación ${index + 1}:`);
      console.log(`ID: ${operation.id}`);
      console.log(`Tipo: ${operation.operacion}`);
      console.log(`Detalles: ${JSON.stringify(operation.detalles, null, 2)}`);
    });

    return parsedOperations;
  } catch (error) {
    console.error('Error al obtener las operaciones de la base de datos', error);
    return [];
  }
};

/**
 * Obtiene todos los IDs de las operaciones almacenadas en AsyncStorage.
 * @returns {Promise<Array>} - Una promesa que resuelve con un array de IDs.
 */
export const getAllOperationIds = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const operationKeys = keys.filter(key => key.startsWith('@operation_'));
    return operationKeys.map(key => key.replace('@operation_', ''));
  } catch (error) {
    console.error('Error al obtener los IDs de las operaciones de la base de datos', error);
    return [];
  }
};
