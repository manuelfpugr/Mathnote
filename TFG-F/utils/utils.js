
import * as Font from 'expo-font';


export const extractFirstNumber = (text) => {
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1]) : null;
  };

  export const removeDots = (numberStr) => {
    return numberStr.replace(/\./g, '');
  };

  // Función para normalizar números de 5 cifras
  export const normalizeNumber = (divisionArray) => {
  // El primer número mantiene los puntos
  let num1 = divisionArray[1];
      
  // Procesar el segundo número, quitando solo los puntos de los miles
  let num2 = divisionArray[3].replace(/\./g, '');
  
  // Si el número NO es múltiplo de 1000, lo dejamos tal cual (ej: 20 se queda como 20)
  // Si es múltiplo de 1000 y mayor que 1000, lo dividimos por 1000
  if (parseInt(num2) >= 1000 && parseInt(num2) % 1000 === 0) {
      num2 = (parseInt(num2) / 1000).toString();
  }
  
  // Formar la cadena con los números procesados
  let operacionProcesada = `${num1} ${divisionArray[2]} ${num2}`;
  
  // Devolver un nuevo array con la cadena procesada y los números originales
  return [operacionProcesada, num1, divisionArray[2], num2];
  };
  export const numberWords = {
    'cero': 0,
    'una': 1,
    'zero': 0,
    'un': 1,
    'uno': 1,
    'dos': 2,
    'tres': 3,
    'cuatro': 4,
    'cinco': 5,
    'seis': 6,
    'siete': 7,
    'ocho': 8,
    'nueve': 9,
    'diez': 10,
    'once': 11,
    'doce': 12,
    'trece': 13,
    'catorce': 14,
    'quince': 15,
    'dieciséis': 16,
    'diecisiete': 17,
    'dieciocho': 18,
    'diecinueve': 19,
    'veinte': 20,
    'veintiuno': 21,
    'veintidós': 22,
    'veintitrés': 23,
    'veinticuatro': 24,
    'veinticinco': 25,
    'veintiséis': 26,
    'veintisiete': 27,
  
  };

   export const loadFonts = () => {
        return Font.loadAsync({
          'massallera': require('../assets/fonts/massallera.ttf'),
        });
      };
      
      
    
  