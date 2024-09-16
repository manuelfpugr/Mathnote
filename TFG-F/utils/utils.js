
import * as Font from 'expo-font';


export const extractFirstNumber = (text) => {
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1]) : null;
  };

  export const removeDots = (numberStr) => {
    return numberStr.replace(/\./g, '');
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

    const loadFonts = () => {
        return Font.loadAsync({
          'massallera': require('../assets/fonts/massallera.ttf'),
        });
      };
      
      
    
  