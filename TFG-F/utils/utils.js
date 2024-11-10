
import * as Font from 'expo-font';
import { getAllOperationIds } from '../db/database';
import { Svg, Line, Text as SvgText } from 'react-native-svg';

export const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina los caracteres diacríticos
    .trim()
    .replace(/\s+/g, ' ');
};
export const drawAngle = ( degrees ) => {

  const radius = 50; // Radio del círculo
  const angleInRadians = (degrees * Math.PI) / 180; // Convertir grados a radianes

  // Coordenadas del punto final de la línea
  const x = radius + radius * Math.cos(angleInRadians);
  const y = radius - radius * Math.sin(angleInRadians);

  return (
    <Svg height="300" width="300" viewBox="0 0 100 100">
      {/* Línea horizontal */}
      <Line x1={radius} y1={radius} x2={radius * 2} y2={radius} stroke="black" strokeWidth="2" />
      {/* Línea del ángulo */}
      <Line x1={radius} y1={radius} x2={x} y2={y} stroke="black" strokeWidth="2" />
      {/* Texto del ángulo */}
      <SvgText x={radius + 10} y={radius - 10} fontSize="10" fill="black">
  {degrees}°
</SvgText>
    </Svg>
  );
};



export const generateUniqueId = async () => {
  const existingIds = await getAllOperationIds();
  let newId;
  do {
    newId = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  } while (existingIds.includes(newId));
  return newId;
};


export const extractFirstNumber = (text) => {
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1]) : null;
  };

  export const removeDots = (numberStr) => {
    return numberStr.replace(/\./g, '');
  };
  
  export const numeroConMasDigitos = (numeros) => {
    if (!Array.isArray(numeros) || numeros.length === 0) {
      return null; // Manejar caso de array vacío o no válido
    }
  
    let numeroConMasDigitos = numeros[0];
  
    for (let i = 1; i < numeros.length; i++) {
      if (numeros[i].toString().length > numeroConMasDigitos.toString().length) {
        numeroConMasDigitos = numeros[i];
      }
    }
  
    return numeroConMasDigitos;
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
      
      
    
  