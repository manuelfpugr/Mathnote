import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/FontAwesome';
import { captureAndSaveOperation, getAllOperations} from './db/database.js';
import regexUtils from './utils/regexUtils.js';
import styles from './assets/styles/styles.js';
import AppLoading from 'expo-app-loading';
import ViewShot from 'react-native-view-shot';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';

import { numeroConMasDigitos, numberWords , loadFonts, extractFirstNumber, removeDots, normalizeNumber, generateUniqueId} from './utils/utils.js';

const Aritmetica = () => {
  // Captura de pantalla y db
  const route = useRoute();
  const navigation = useNavigation();
  const { operation } = route.params || {};
  const [lastId, setLastId] = useState(0);
  const [operations, setOperations] = useState([]);
  const viewShotRef = useRef(null);
  const [capturedImage, setCapturedImage] = React.useState(null);
  // Mensajes de bienvenida y navegación
  const [bienvenida, setBienvenida] = useState("¡Bienvenido a Aritmética!");
  const [navegacion, setNavegacion] = useState("¿Que operación quiere realizar?");
  const [realizarDiv, setRealizarDiv] = useState("Vamos a realizar la división");
  // Grabación de audio
  const [recording, setRecording] = useState(null);
  const opacity = React.useRef(new Animated.Value(1)).current;
  const [message, setMessage] = useState('');
  // Sumas y Restas
  const [numeros, setNumeros] = useState([]);
  const [sumas, setSumas] = useState([]);
  const [restas, setRestas] = useState([]);
  const [digitoMayor, setDigitoMayor] = useState(null);
  const [accarreo, setAccarreo] = useState([]);
  const [reinicioAcarreo, setreinicioAcarreo] = useState(false);
  const [reinicioAcarreo2, setreinicioAcarreo2] = useState(false);
  const [reinicioAcarreo3, setreinicioAcarreo3] = useState(false);
  // División
  const [accarreoDiv, setAccarreoDiv] = useState([]);
  const [primerDigitoDivisor, setPrimerDigitoDivisor] = useState([]);
  const [division, setDivision] = useState([]);
  const [cociente, setCociente] = useState([]);
  const [contadorCociente, setContadorCociente] = useState([]);
  const [procedimientoDiv, setProcedimientoDiv] = useState([]);
  const [procedimientoDivLinea2, setProcedimientoDivLinea2] = useState([]);
  const [procedimientoDivLinea3, setProcedimientoDivLinea3] = useState([]);
  const [procedimientoDivLinea4, setProcedimientoDivLinea4] = useState([]);
  const [cogerNumero, setcogerNumero] = useState([]);
  const [procedimientoBajar, setProcedimientoBajar] = useState([]);
  const [procedimientoBajar2, setProcedimientoBajar2] = useState([]);
  const [procedimientoBajar3, setProcedimientoBajar3] = useState([]);
  const [procedimientoRestar, setProcedimientoRestar] = useState([]);
  const [procedimientoRestar2, setProcedimientoRestar2] = useState([]);
  const [procedimientoRestar3, setProcedimientoRestar3] = useState([]);
  const [procedimientoRestar4, setProcedimientoRestar4] = useState([]);
  // Multiplicación
  const [operacion, setOperacion] = useState(false);
  const [resultado, setResultado] = useState([]);
  const [resultado2, setResultado2] = useState([]);
  const [resultado3, setResultado3] = useState([]);
  const [resultado4, setResultado4] = useState([]);
  const [operationMult, setOperationMult] = useState(null);
  const [inserciones, setInserciones] = useState({ fila0: 0, fila1: 0, fila2: 0 });
  const [multiplicador, setMultiplicador] = useState([]);
  const [multiplicando, setMultiplicando] = useState([]);
  const [multiplicacion, setMultiplicacion] = useState([]);
  const [filasCompletas, setFilasCompletas] = useState(false);
  const [filaAnterior, setFilaAnterior] = useState(0);
  // Mensajes de bienvenida y navegación
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showBienvenida, setShowBienvenida] = useState(true);
  const [showNavegacion, setShowNavegacion] = useState(false);
  const [hasShownBienvenida, setHasShownBienvenida] = useState(false);
  const [hasShownNavegacion, setHasShownNavegacion] = useState(false);

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
        setMessage('Grabando...');
      } else {
        setMessage('Permission to access microphone is required!');
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    setRecording(undefined);

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
    // Modificar la expresión regular para capturar múltiples números y operadores
    const match = regexUtils.matchMultipleNumbersAndOperators(text);
    const multipleSum = regexUtils.matchMultipleSum(text);
    const resultMatch = regexUtils.matchResult(text);
    const resultMult = regexUtils.matchMultiplicationResult(text);
    const matchAccarreo = regexUtils.matchAcarreo(text);
    const resultAcarreo = regexUtils.matchAcarreoResult(text);
    //Establecer la división
    let div = regexUtils.matchDivision(text);
    const cogerNumeroMatch = regexUtils.matchNumber(text);
    // Procedimientos para realizar la División
    const divisionProc1 = regexUtils.matchDivisionProcedure1(text);
    const divisionProcAcarreo = regexUtils.matchDivisionProcedureAcarreo(text);
    const divisionProc2 = regexUtils.matchDivisionProcedure2(text);
    const divisionProc3 = regexUtils.matchDivisionProcedure3(text);
    // Procedimientos para bajar números de la división
    const procedimientoBajarNum = regexUtils.matchLoweringProcedure(text);    
    // Resta de la división
    const procedimientoResta = regexUtils.matchSubtractionProcedure(text);
    const procedimientoResta2 = regexUtils.matchSubtractionProcedure2(text);    
    // Decimal División
    const coma = regexUtils.matchDecimalComma(text);
    // Captura y guardar operación
    const guardar = regexUtils.matchGuardarOperacion(text);

    if(guardar){
      handleSave();
    }
    else if (match && operacion === false && division.length === 0) {
      // Extraer todos los números y el operador
      const numbers = [match[1]];
      let operator = match[2];
      const rest = match[3];

      setMultiplicacion(match);
  
      // Extraer números adicionales del resto de la cadena
      const additionalMatches = rest.match(/(\d+)/g);
      if (additionalMatches) {
        numbers.push(...additionalMatches);
        setNumeros(numbers);
        let dig = numeroConMasDigitos(numbers);
        if(dig)
        {
          setDigitoMayor(dig);
          
        }
       
      }

      if(match && match[2] === '-' || match[2] === 'menos'){
        setRestas(numbers);
      }
      else if(match && match[2] === '+' || match[2] === 'más' || match[2] === 'mas'){
        setSumas(numbers);
        
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
        case 'x':
          operator = 'x';
          break;

        case 'dividido':
          operator = '/';
          break;

        case 'entre':
          operator = '/';
          break;
      }

      if(operator === 'x' && division.length === 0){
        setMultiplicador(parseInt(numbers[0], 10));
        setMultiplicando(parseInt(numbers[1], 10));
      }
      // setAccarreo(prevAccarreo => [' ', ...prevAccarreo]);
      // Llamar a setOperation con una lista de números y el operador
      setOperationMult({ numbers, operator });
      setOperacion(true);
    }if(cogerNumeroMatch){
    
      if (numberWords.hasOwnProperty(cogerNumeroMatch[2])) {
        let number = numberWords[cogerNumeroMatch[2]];
      
      setcogerNumero(number);
    }
    else{
      setcogerNumero(cogerNumeroMatch[2]);
    }
    
  }
 else if((div || division.length > 0) && ( divisionProc1 || (division.length > 0 && resultAcarreo) || resultMult || divisionProcAcarreo || div || divisionProc2 || divisionProc3 || procedimientoBajarNum || procedimientoResta || procedimientoResta2 || coma) ){

  divisionGeneral(division, div, coma, procedimientoResta, resultMult, procedimientoResta2, procedimientoBajarNum, divisionProc1, divisionProc2, divisionProc3, divisionProcAcarreo, resultAcarreo, primerDigitoDivisor, procedimientoRestar, procedimientoDivLinea3, cociente);
  }else if(filasCompletas && division.length === 0){
      sumaMultiplicacion(text);
    }else if (operacion === true && division.length === 0 && resultMult && !matchAccarreo || (resultAcarreo && division.length === 0)) {
      
     let expectedResult = null;
      if(resultAcarreo){
        expectedResult = resultAcarreo[1] ? parseInt(resultAcarreo[1], 10) : parseInt(resultAcarreo[2], 10);
      }else{
        expectedResult = parseInt(resultMult[3], 10);
      }
      procesarMultiplicacion(expectedResult, multiplicador, multiplicando, inserciones, reinicioAcarreo, reinicioAcarreo2, reinicioAcarreo3, filasCompletas, resultado);
    }
    else if(operacion === true && resultMatch && !matchAccarreo && division.length === 0) {
      const expectedResult = parseInt(resultMatch[2], 10);


      if (expectedResult !== null && expectedResult !== undefined) {
        setResultado(prevResultado => [expectedResult, ...prevResultado]);
      }

    }else if(operacion === true && match && !matchAccarreo && division.length && !guardar) {
      
     adicionSumaResta(match);
  
    }else if (operacion === true && !matchAccarreo && !guardar && multiplicador.length === 0 && multiplicando.length === 0) {

      operacionSumaResta(text);
    }else if(matchAccarreo){
      funcionAcarreo(matchAccarreo, division);

    }
    else{
      setMessage("Disculpa, no te entendí. ¿Puedes repetir?");
    }
  };


  useFocusEffect(
    React.useCallback(() => {
      if (operation) {
        // Prellenar los campos según el tipo de operación
        if (operation.operacion === 'multiplicacion') {
          setMultiplicador(operation.detalles.multiplicador);
          setMultiplicando(operation.detalles.multiplicando);

          handleOperation(`${operation.detalles.multiplicador} x ${operation.detalles.multiplicando}`);
        } else if (operation.operacion === 'suma') {

          setSumas(operation.detalles.sumas);
          handleOperation(operation.detalles.sumas.join(' más '));
        } else if (operation.operacion === 'resta') {
          setRestas(operation.detalles.restas);
          handleOperation(operation.detalles.restas.join(' menos '));
        } else if (operation.operacion === 'division') {
          const { dividendo, divisor } = operation.detalles;
          setDivision({ dividendo, divisor });
          handleOperation(`${dividendo} entre ${divisor}`);
        }
      }
    }, [operation])
  );
  
  React.useEffect(() => {
    const fetchOperations = async () => {
      const ops = await getAllOperations();
      setOperations(ops);

    };

    fetchOperations();
  }, []);

  React.useEffect(() => {
    
    const requestPermissions = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Se requieren permisos para acceder a la biblioteca de medios.');
      }
    };
    requestPermissions();
  }, []);

  

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



  const calculateRightPosition = (resultado) => {
    const partes = String(resultado).split(',').map(part => part.trim());
  
    // Encuentra la longitud máxima de las partes
    const maxLength = Math.max(...partes.map(part => part.length));

    switch(maxLength) {
      case 2:
        return 45;  // Ajuste para resultados de dos cifras
      case 3:
        return 25;  // Ajuste para resultados de tres cifras
      case 4:
        return 10;  // Ajuste para resultados de cuatro cifras
      default:
        return 0;   // Ajuste predeterminado para otros casos
    }
  };

  const getDividendoStyle = (cogerNumero, dividendoLength) => {
    if (cogerNumero && dividendoLength) {
      return `dividendo${dividendoLength}Dig${cogerNumero}`;
    }
    return null;
  };
  // Función para hacer sumas y restas con más de dos números
  function adicionSumaResta(match, multipleSum) {
    const numbers = [match[1]];
    const rest = match[3];

    // Extraer números adicionales del resto de la cadena
    const additionalMatchesSum = rest.match(/(\d+)/g);
    const additionalMatchesRest = rest.match(/(\d-)/g);
    
    if (additionalMatchesSum) {
      numbers.push(...additionalMatchesSum);
    }
    else if(additionalMatchesRest){
      numbers.push(...additionalMatchesRest);
    }
    setNumeros(numbers);

  }
  // Operacion Suma y Resta
  function operacionSumaResta(text) {

    
      // Convertir el texto a minúsculas, eliminar cualquier punto o coma al final y recortar espacios en blanco
      
     
      const lowerText = text.toLowerCase().replace(/[.,]$/, '').trim();
      const regexAcarreo = lowerText.match(/(\d+)\s*más\s*(\d+\s*más\s*)*(\d+)\s*(igual\s*a|es)?\s*(\d+)\s*y\s*(\d+)/);

      const multipleSum = regexUtils.matchMultipleSum(lowerText);
      
      const singleDigitMatch = lowerText.match(/(?<!\b(más|es|igual|y)\s)\b([0-9]|cero|una|zero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)\b(?!\s\b(más|es|igual|y))/);

      if (singleDigitMatch && !multipleSum && !regexAcarreo) {
        const singleDigit = numberWords[singleDigitMatch[0]] !== undefined ? numberWords[singleDigitMatch[0]] : parseInt(singleDigitMatch[0], 10);
        setResultado(prevResultado => [singleDigit, ...prevResultado]);

        return; // Salir de la función si se encuentra un número de un solo dígito o palabra que representa un número
      }
      


      if(regexAcarreo){
        let regxNumber =  Number(regexAcarreo[5])+  Number(regexAcarreo[6]);
 
        {
          if(digitoMayor.length === 4 && resultado.length < 3 && regxNumber > 10){
            regxNumber = regxNumber % 10;
          }else if(digitoMayor.length === 3 && resultado.length < 2 && regxNumber > 10){
            regxNumber = regxNumber% 10;
         }else if(digitoMayor.length === 2 && resultado.length < 1 && regxNumber> 10){
          regxNumber = regxNumber % 10;
         }

          setResultado(prevResultado => [regxNumber, ...prevResultado]);
        }
        return;
      }
      

      if(multipleSum && multipleSum.length > 0)
      {
        if(digitoMayor.length === 4 && resultado.length < 3 && multipleSum[2] > 10){
          multipleSum[2] = multipleSum[2] % 10;
        }else if(digitoMayor.length === 3 && resultado.length < 2 && multipleSum[2] > 10){
        multipleSum[2] = multipleSum[2] % 10;
       }else if(digitoMayor.length === 2 && resultado.length < 1 && multipleSum[2] > 10){
        multipleSum[2] = multipleSum[2] % 10;
       }

        setResultado(prevResultado => [multipleSum[2], ...prevResultado]);
      }
    }
    // Acarreo
  function funcionAcarreo(matchAccarreo, division) {
        const carryNumber = [matchAccarreo[2]];

        const lowerText = matchAccarreo[2].toLowerCase().replace(/[.,]$/, '').trim();
        if (numberWords.hasOwnProperty(lowerText)) {
          const number = numberWords[lowerText];
          
          if(division.length > 0)
          {
            setAccarreoDiv(prevAccarreo => [ number ,...prevAccarreo]);
          }
          setAccarreo(prevAccarreo => [ number ,...prevAccarreo]);
        }
  }
  
  // ---------------------------------------------------------------------------------------------------------------------- //
  // Métodos para la Multiplicación
    // Procesado de las filas
  function procesarFila(fila, numPorFila, expectedResult, filasMultiplicacion, resultado) {

    if (fila === 1 && filaAnterior === 0 && !reinicioAcarreo) {
      setAccarreo([]);
      setreinicioAcarreo(true); // Desactivar la bandera después de reiniciar acarreo
    }else if (fila === 2 && filaAnterior === 1 && !reinicioAcarreo2) {
      setAccarreo([]);
      setreinicioAcarreo2(true); // Desactivar la bandera después de reiniciar acarreo
    }else if (fila === 3 && filaAnterior === 2 && !reinicioAcarreo3) {
      setAccarreo([]);
      setreinicioAcarreo2(true); // Desactivar la bandera después de reiniciar acarreo
    }

    const setResultadoFila = (fila, value) => {
      if (fila === 0) {
        setResultado(prevResultado => [value, ...prevResultado]);
      } else if (fila === 1) {
        setResultado2(prevResultado => [value, ...prevResultado]);
      } else if (fila === 2) {
        setResultado3(prevResultado => [value, ...prevResultado]);
      }
    };

      if (expectedResult >= 10 && inserciones[`fila${fila}`] === numPorFila - 1) {
          setResultadoFila(fila, expectedResult);
          setInserciones(prevInserciones => ({ ...prevInserciones, [`fila${fila}`]: prevInserciones[`fila${fila}`] + 1 }));
      } else if (expectedResult >= 10) {
          let expectedResultMod = expectedResult % 10;
          setResultadoFila(fila, expectedResultMod);
          setInserciones(prevInserciones => ({ ...prevInserciones, [`fila${fila}`]: prevInserciones[`fila${fila}`] + 1 }));
      } else {
          setResultadoFila(fila, expectedResult);
          setInserciones(prevInserciones => ({ ...prevInserciones, [`fila${fila}`]: prevInserciones[`fila${fila}`] + 1 }));
      }
      setFilaAnterior(fila); // Actualizar la fila anterior
  }
  // Procesado del resto de la multiplicación
  function procesarMultiplicacion(expectedResult, multiplicador, multiplicando, inserciones, reinicioAcarreo, reinicioAcarreo2, reinicioAcarreo3, filasCompletas, resultado) {

    let filasMultiplicacion = [];
    let filaActual = 0;  // Variable para rastrear la fila actual, comenzando en 0
    let numActual = 0;  // Variable para rastrear el número actual en la fila

    const numFilas = multiplicando.toString().length;  // Número de filas, máximo 3
    const numPorFila = multiplicador.toString().length;  // Cantidad de números por fila


    if (expectedResult !== null && expectedResult !== undefined) {
        // Aquí asumimos que el usuario inserta el número directamente
        const fila = expectedResult;  // El número que el usuario inserta
        filasMultiplicacion.push(fila);
        const numLength = fila.toString().length;  // Longitud del número actual
        numActual++; // Ajusta numActual según la longitud del número

        // Solo cuando la fila actual esté completa, se moverá al resultado correspondiente
        // Procesado de las filas en la multiplicación
        if (inserciones.fila0 < numPorFila && inserciones.fila1 === 0) {
            procesarFila(0, numPorFila, expectedResult, filasMultiplicacion, resultado);
        } else if (inserciones.fila1 < numPorFila && inserciones.fila2 === 0) {
            procesarFila(1, numPorFila, expectedResult, filasMultiplicacion, resultado);
        } else if (inserciones.fila2 < numPorFila) {
            procesarFila(2, numPorFila, expectedResult, filasMultiplicacion, resultado);
        }

        if (inserciones.fila0 === numPorFila - 1 && !reinicioAcarreo) {
            reinicioAcarreo = true;
        } else if (inserciones.fila1 === numPorFila - 1 && !reinicioAcarreo2) {
            reinicioAcarreo2 = true;
        } else if (inserciones.fila2 === numPorFila - 2 && !reinicioAcarreo3) {
            reinicioAcarreo3 = true;
        }

        if (reinicioAcarreo === true && numFilas === 1) {
            setFilasCompletas(true);
        } else if (reinicioAcarreo2 === true && numFilas === 2) {
            setFilasCompletas(true);
        } else if (reinicioAcarreo3 === true && numFilas === 3) {
            setFilasCompletas(true);
        }
    }
  }
  // Suma de Multiplicación
    function sumaMultiplicacion(text) {
          const lowerText = text.toLowerCase().replace(/[.,]$/, '').trim();
          const regexAcarreo = lowerText.match(/(\d+)\s*(más|y)?\s*(\d+)?/g);
          const regexOperacion = lowerText.match(/^\s*(\d+)\s*(?:\+|mas|más)\s*(\d+)\s*(?:igual\s*a|=|,|\s)?\s*(\d+)?\s*$/i);
          const regexNumerico = lowerText.match(/^(1[0-8]|[0-9])\.?$/);
          const regexPalabras = lowerText.match(/^(cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|trece|catorce|quince|dieciséis|diecisiete|dieciocho)\.?$/i);
        
          if(regexAcarreo){
    
            
            if(regexAcarreo[2] >= 10 && resultado4.length <= 6){
              regexAcarreo[2] = regexAcarreo[2] % 10;
            }
            setResultado4(prevResultado => [regexAcarreo[2], ...prevResultado]);
        }
          if(regexOperacion){
             result = parseInt(regexOperacion[3], 10);

            if(result >= 10 && resultado4.length <= 6){
              result = result % 10;
            }
            setResultado4(prevResultado => [result, ...prevResultado]);
          }
          else if (regexNumerico) {
            setResultado4(prevResultado => [lowerText, ...prevResultado]);
          }
          if (numberWords.hasOwnProperty(lowerText)) {
            let number = numberWords[lowerText];
            if (number > 10) {
              number = number % 10;
            }

            if(number > 10)
            {
              let numberMod = number % 10;
              setResultado4(prevResultado => [numberMod, ...prevResultado]);
            }
            else
            {
              setResultado4(prevResultado => [number, ...prevResultado]);
            }
          }
    }
  // ---------------------------------------------------------------------------------------------------------------------- //
  // Métodos para la división
    // Función para manejar la división
    function establecerDivision(div) {
    
        const divisor = div[3];
        setPrimerDigitoDivisor(divisor.toString()[0]);

        const resultados = div.map(division => {
          const partes = division.match(/\b(\d{1,3}(?:\.\d{3})*|\d+)\s*(entre|dividido\s+entre)\s*(\d{1,3}(?:\.\d{3})*|\d+)\b/i);
          if (partes) {
            return {
              dividendo: removeDots(partes[1]),
              divisor: removeDots(partes[3])
            };
          }
        }).filter(result => result !== null);

        setDivision(resultados);
    
    }

    // Función para manejar la resta de la división
    function handleRestaDivision(procedimientoResta, procedimientoResta2) {

          if (procedimientoResta) {
            // Asegurarse de que procedimientoResta es un array
            if (Array.isArray(procedimientoResta) && procedimientoResta.length > 0) {
              const ultimaCoincidencia = procedimientoResta[procedimientoResta.length - 1];
              const partes = ultimaCoincidencia.match(/\b(\d+|cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\b/gi);
              const ultimoNumero = partes[partes.length - 1];
            
              // Convertirlo a un número entero (opcional)
              const ultimoNumeroInt = parseInt(ultimoNumero, 10);
            if(cociente.length >= 1 && cociente.length < 2){
              setProcedimientoRestar(prevResultado => [ultimoNumeroInt, ...prevResultado]);
            }else if (cociente.length >= 2 && cociente.length < 3)  {
              if(cociente.includes(",")){
                setProcedimientoRestar(prevResultado => [ultimoNumeroInt, ...prevResultado]);
              }else{
              setProcedimientoRestar2(prevResultado => [ultimoNumeroInt, ...prevResultado]);
              }
            }else if (cociente.length >= 3 && cociente.length < 4) {
              if(cociente.includes(",")){
                setProcedimientoRestar2(prevResultado => [ultimoNumeroInt, ...prevResultado]);
              }else{
              setProcedimientoRestar3(prevResultado => [ultimoNumeroInt, ...prevResultado]);
              }
            }else if (cociente.length >= 4 && cociente.length < 5) {
              if(cociente.includes(",")){
                setProcedimientoRestar3(prevResultado => [ultimoNumeroInt, ...prevResultado]);
              }else{
              setProcedimientoRestar4(prevResultado => [ultimoNumeroInt, ...prevResultado]);
              }
            }
            } else {
              console.error("procedimientoResta no es un array o está vacío");
            }
          }else if(procedimientoResta2){
            
              const lowerText = procedimientoResta2[1].toLowerCase().replace(/[.,]$/, '').trim();
              if (numberWords.hasOwnProperty(lowerText)) {
                number = numberWords[lowerText];
              if(procedimientoRestar.length === 0){
                setProcedimientoRestar(prevResultado => [number, ...prevResultado]);
              }else{
                setProcedimientoRestar2(prevResultado => [number, ...prevResultado]);
              }
            }else{
              if(procedimientoRestar.length === 0){
                setProcedimientoRestar(prevResultado => [procedimientoResta2[1], ...prevResultado]);

            }
            else{
              setProcedimientoRestar2(prevResultado => [procedimientoResta2[1], ...prevResultado]);
            }
            }
          }
    }
    // Función para manejar la acción de bajar números en la división
    function bajarNumeroDivision(procedimientoBajarNum) {
      const partes = procedimientoBajarNum[0].match(/\b(bajo|bajar)\s+(el\s+)?(número\s+)?(0|1|2|3|4|5|6|7|8|9|cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)\b/i);
          let number = partes[4];
          if(procedimientoBajar.length === 0){
          if (numberWords.hasOwnProperty(number)) {
            number = numberWords[number];
          }
          setProcedimientoBajar(number);
        }else if(procedimientoBajar2.length === 0){
          if (numberWords.hasOwnProperty(number)) {
            number = numberWords[number];
          }
          setProcedimientoBajar2(number);
        }else if(procedimientoBajar3.length === 0){
          if (numberWords.hasOwnProperty(number)) {
            number = numberWords[number];
          }
          setProcedimientoBajar3(number);
        }
    }

    // Función para eliminar puntos y comas de los números en la división
    function handleComa() {
      setCociente(prevResultado => [...prevResultado, ","]);
      if(cociente.length >= 1 && cociente.length < 2){
      setProcedimientoRestar(prevResultado => [...prevResultado, 0]);
      }else if (cociente.length >= 2 && cociente.length < 3)  {
      setProcedimientoRestar2(prevResultado => [...prevResultado, 0]);
      }else if (cociente.length >= 3 && cociente.length < 4) {
      setProcedimientoRestar3(prevResultado => [...prevResultado, 0]);
      }else if (cociente.length >= 4 && cociente.length < 5) {
        setProcedimientoRestar4(prevResultado => [...prevResultado, 0]);
      }
    }

    function divisionGeneral(division, div, coma, procedimientoResta, resultMult, procedimientoResta2, procedimientoBajar, divisionProc1, divisionProc2, divisionProc3, divisionProcAcarreo, resultAcarreo, primerDigitoDivisor, procedimientoRestar, cociente) {   
      if (division && division.length === 0) {
        let divMod = normalizeNumber(div); 
        
        if(divMod)
          div = divMod;
      
          establecerDivision(div);
      } else if (coma) {
          handleComa();
      } else if (procedimientoResta || procedimientoResta2) {

          handleRestaDivision(procedimientoResta, procedimientoResta2);
      } else if (procedimientoBajar) {
          bajarNumeroDivision(procedimientoBajar);
      } else {
          procesarDivision(resultMult,divisionProc1, divisionProc2, divisionProc3, divisionProcAcarreo, resultAcarreo, primerDigitoDivisor, procedimientoRestar);
      }
    }

    // Función para procesar la división
    function procesarDivision(resultMult, divisionProc1, divisionProc2, divisionProc3, divisionProcAcarreo, resultAcarreo, primerDigitoDivisor, procedimientoRestar) {
      if (divisionProc3) {
        const lowerText = divisionProc3[2].toLowerCase().replace(/[.,]$/, '').trim();
        if(numberWords.hasOwnProperty(lowerText)){
          let number = numberWords[lowerText];
          setCociente(prevResultado => [...prevResultado, number]);
        }else{
          setCociente(prevResultado => [...prevResultado, divisionProc3[2]]);
        }
        
      } else if (divisionProc2) {
      } else if (divisionProcAcarreo || resultAcarreo) {
        let result = 0;

        if (divisionProcAcarreo !== null && divisionProcAcarreo !== undefined && divisionProcAcarreo.length > 0) {
          let divisionProcAcarreoDiv = divisionProcAcarreo[0];
          const results = extractFirstNumber(divisionProcAcarreoDiv);
        } else if (resultAcarreo !== null && resultAcarreo !== undefined && resultAcarreo.length > 0) {
          let resultAcarreoDiv = resultAcarreo[0];
          const results = extractFirstNumber(resultAcarreoDiv);

          if (results !== primerDigitoDivisor) {

            if (resultAcarreo[2] !== undefined) {
              result = resultAcarreo[2] % 10;
            } else if (resultAcarreo[1] !== undefined) {
              result = resultAcarreo[1] % 10;
            }
          }
          if (procedimientoRestar.length === 0) {
            setProcedimientoDiv(prevResultado => [result, ...prevResultado]);
          } else if (procedimientoDivLinea3.length === 0) {
            setProcedimientoDivLinea2(prevResultado => [result, ...prevResultado]);
          }
        }
      } else if (divisionProc1 || resultMult) {

        if ( Number(resultMult[1]) !== Number(primerDigitoDivisor))  {
          resultMult[3] = resultMult[3] % 10;
        }

        if (procedimientoRestar.length === 0) {

          if (cociente.length === 0) {
            setCociente(resultMult[3]);
            setContadorCociente(prevResultado => [resultMult[3], ...prevResultado]);
            setProcedimientoDiv(prevResultado => [resultMult[3], ...prevResultado]);
          } else {
            setProcedimientoDiv(prevResultado => [resultMult[3], ...prevResultado]);
          }
        } else if (cociente.length > 1 && cociente.length < 3) {
    
          if (cociente.includes(',') && cociente.length === 2) {
            setCociente(prevResultado => [...prevResultado, resultMult[3]]);
            setProcedimientoDiv(prevResultado => [resultMult[3], ...prevResultado]);
          }else if (cociente.length === 1 && !cociente.includes(',')) {
            setCociente(prevResultado => [...prevResultado, resultMult[3]]);
            setProcedimientoDivLinea2(prevResultado => [resultMult[3], ...prevResultado]);
          } else {
            setProcedimientoDivLinea2(prevResultado => [resultMult[3], ...prevResultado]);
          }
        }
        else if (cociente.length > 2 && cociente.length < 4) {
          if (cociente.includes(',') && cociente.length === 3) {

            setProcedimientoDivLinea2(prevResultado => [resultMult[3], ...prevResultado]);
          }else if (cociente.length === 1 && !cociente.includes(',')) {
            setCociente(prevResultado => [...prevResultado, resultMult[3]]);
            setProcedimientoDivLinea3(prevResultado => [resultMult[3], ...prevResultado]);
          } else {
            setProcedimientoDivLinea3(prevResultado => [resultMult[3], ...prevResultado]);
          }
        }
        else if (cociente.length > 3 && cociente.length < 5) {
          if (cociente.includes(',') && cociente.length === 4) {
            setProcedimientoDivLinea3(prevResultado => [resultMult[3], ...prevResultado]);
          }else if (cociente.length === 1 && !cociente.includes(',')) {
            setCociente(prevResultado => [...prevResultado, resultMult[3]]);
            setProcedimientoDivLinea4(prevResultado => [resultMult[3], ...prevResultado]);
          } else 
            setProcedimientoDivLinea4(prevResultado => [resultMult[3], ...prevResultado]);
          }
        
      }
    }

    const handleSave = async () => {
    
      try {
        let operationData = null;
        let uri = null;
    
        const newId = await generateUniqueId();
    
        if (division.length > 0) {
          const { dividendo, divisor } = division[0];
      
          operationData = {
            id: newId,
            operacion: 'division',
            detalles: {dividendo, divisor},
          };
        } else if (multiplicador&& multiplicando > 0) {
       
          operationData = {
            id: newId,
            operacion: 'multiplicacion',
            detalles: { multiplicador, multiplicando },
          };
        } else if (restas.length > 0) {

          operationData = {
            id: newId,
            operacion: 'resta',
            detalles: { restas },
          };
        } else if (sumas.length > 0) {
 
          operationData = {
            id: newId,
            operacion: 'suma',
            detalles: { sumas },
          };
        }
    
        // Si se creó operationData, guarda la operación
        if (operationData) {
          // Guardar la operación con la imagen capturada
          await captureAndSaveOperation(viewShotRef, { ...operationData, foto: uri });
          setCapturedImage(uri); // Actualiza el estado de la imagen capturada
        
          const ops = await getAllOperations();
          setOperations(ops);
          navigation.navigate('Home');
        }
      } catch (error) {
        console.error('Error al capturar o guardar la operación:', error);
      }
    }

 

// ---------------------------------------------------------------------------------------------------------------------- //
// Renderizado de la división en pantalla
  const renderDivision = (division) => {
    if (!division) {
      
      return null;
    }
  
    // Verificar si division es un array y acceder al primer elemento
    if (Array.isArray(division)) {
      division = division[0];
    }
  
    // Verificar nuevamente si division es undefined después de acceder al primer elemento del array
    if (!division) {
      
      return null;
    }
    // Proporcionar valores predeterminados para dividendo y divisor
    const { dividendo = '', divisor = '' } = division;
    
    return (
      
      <View style={styles.operationContainer}>
        
      {division && (
        <Animated.Text style={[styles.messageText, { opacity: 0 }]}>
          {realizarDiv}
        </Animated.Text>
      )}

        {dividendo && (
      <View style={styles.dividendoContainer}>
        <Text style={styles.llevadaDiv}>{accarreoDiv.join(' ')}</Text>
        
        {cogerNumero && dividendo.length && (
          
          <View style={styles[getDividendoStyle(cogerNumero, dividendo.length)]} />
        )}
        <Text style={styles.dividendoText}>
          {dividendo}
        </Text>
      </View>
    )}

      {divisor && (
        <View style={styles.dividerDiv} />
      )}
      {divisor && (
        <View style={styles.dividerDiv2} />
      )}
      {divisor && (
        <Text style={styles.divisorText}>
          {divisor}
        </Text>
      )}
      {cociente && (
        <Text style={[styles.cocienteText, cociente.length > 1 && styles.spacing]}>
          {cociente}
        </Text>
      )}

      {procedimientoDiv && (
        <Text style={[
          styles.procedimientoDiv, 
          dividendo.length === 2 && styles.spacingDividendo2, 
          dividendo.length === 3 && styles.spacingDividendo3,
          dividendo.length === 4 && styles.spacingDividendo4,
          dividendo.length === 5 && styles.spacingDividendo5,
        ]}>
          {procedimientoDiv}
        </Text>
      )}

      {procedimientoBajar && (
        <Text
          style={[
            dividendo.length === 2 && styles.procedimientoBajar2Dig,
            dividendo.length === 3 && styles.procedimientoBajar3Dig,
            dividendo.length === 4 && styles.procedimientoBajar4Dig,
            dividendo.length === 5 && styles.procedimientoBajar5Dig,
          ]}
         >
          {procedimientoBajar}
        </Text>
      )}

      {(procedimientoBajar.length > 0 || procedimientoRestar.length > 0) && (
        <View
          style={[
            dividendo.length === 2 && styles.divBarBajar2Dig,
            dividendo.length === 3 && styles.divBarBajar3Dig,
            dividendo.length === 4 && styles.divBarBajar4Dig,
            dividendo.length === 5 && styles.divBarBajar5Dig,
          ]}
        />
      )}
      {procedimientoRestar.length > 0 && (
        <Text style={[
          styles.procedimientoRestar, 
          cociente.includes(',') && styles.spacing, 
          dividendo.length === 3 && styles.procedimientoRestar3Dig,
          dividendo.length === 4 && styles.procedimientoRestar4Dig,
          dividendo.length === 5 && styles.procedimientoRestar5Dig,
        ]}>
          {procedimientoRestar}
        </Text>
      )}
      {procedimientoDivLinea2 && (
        <Text style={[styles.procedimientoDivLinea2, procedimientoDivLinea2.length === 2, 
          dividendo.length == 3 && styles.procedimientoDivLinea2_3Dig,
          dividendo.length == 4 && styles.procedimientoDivLinea2_4Dig,
          dividendo.length == 5 && styles.procedimientoDivLinea2_5Dig,
          ]}>
          {procedimientoDivLinea2}
        </Text>
      )}

      {procedimientoRestar2.length > 0 && (
        <View style={[styles.divBarBajar2, 
          dividendo.length == 3 && styles.divBarBajar2_3Dig,
          dividendo.length == 4 && styles.divBarBajar2_4Dig,
          dividendo.length == 5 && styles.divBarBajar2_5Dig]} />
      )}

      {procedimientoRestar2.length > 0 && (
        <Text style={[styles.procedimientoRestar2,  
        dividendo.length == 3 && styles.procedimientoRestar2_3Dig,
        dividendo.length == 4 && styles.procedimientoRestar2_4Dig,
        dividendo.length == 5 && styles.procedimientoRestar2_5Dig]}>
          {procedimientoRestar2}
        </Text>
      )}

      {procedimientoBajar2 && (
        <Text style={[styles.procedimientoBajar2, 
        dividendo.length == 4 && styles.procedimientoBajar2_4Dig,
        dividendo.length == 5 && styles.procedimientoBajar2_5Dig]}>
          {procedimientoBajar2}
        </Text>
      )}

    {procedimientoDivLinea3 && (
            <Text style={[styles.procedimientoDivLinea3, procedimientoDivLinea3.length === 2, 
              dividendo.length == 3 && styles.procedimientoDivLinea3_3Dig,
              dividendo.length == 4 && styles.procedimientoDivLinea3_4Dig,
              dividendo.length == 5 && styles.procedimientoDivLinea3_5Dig,
              ]}>
              {procedimientoDivLinea3}
            </Text>
          )}

    {procedimientoBajar3 && (
            <Text style={[styles.procedimientoBajar3, 
            dividendo.length == 4 && styles.procedimientoBajar3_4Dig,
            dividendo.length == 5 && styles.procedimientoBajar3_5Dig]}>
              {procedimientoBajar3}
            </Text>
          )}

    {procedimientoRestar3.length > 0 && (
        <View style={[styles.divBarBajar3, 
          dividendo.length == 3 && styles.divBarBajar3_3Dig,
          dividendo.length == 4 && styles.divBarBajar3_4Dig,
          dividendo.length == 5 && styles.divBarBajar3_5Dig]} />
      )}

      {procedimientoRestar3.length > 0 && (
        <Text style={[styles.procedimientoRestar3,  
          dividendo.length == 3 && styles.procedimientoRestar3_3Dig,
          dividendo.length == 4 && styles.procedimientoRestar3_4Dig,
        dividendo.length == 4 && styles.procedimientoRestar3_4Dig,
        dividendo.length == 5 && styles.procedimientoRestar3_5Dig]}>
          {procedimientoRestar3}
        </Text>
      )}


    {procedimientoDivLinea4 && (
            <Text style={[styles.procedimientoDivLinea4, procedimientoDivLinea4.length === 2, 
              dividendo.length == 3 && styles.procedimientoDivLinea4_3Dig,
              dividendo.length == 4 && styles.procedimientoDivLinea4_4Dig,
              dividendo.length == 5 && styles.procedimientoDivLinea4_5Dig,
              ]}>
              {procedimientoDivLinea4}
            </Text>
          )}

      {procedimientoRestar4.length > 0 && (
              <View style={[styles.divBarBajar4, 
                dividendo.length == 5 && styles.divBarBajar4_5Dig]} />
            )}

        {procedimientoRestar4.length > 0 && (
          <Text style={[styles.procedimientoRestar4,  
          dividendo.length == 5 && styles.procedimientoRestar4_5Dig]}>
            {procedimientoRestar4}
          </Text>
        )}

          

      </View>
      
      );
  };
// Renderizado de las operaciones de resta multiplicación y suma
  const renderOperation = (operationMult) => {
    const { numbers, operator } = operationMult;
  
    // Padding para asegurar que los números estén alineados a la derecha
    const maxLength = Math.max(...numbers.map(num => num.length));
    const paddedNumbers = numbers.map(num => num.padStart(maxLength, ' '));
    const rightPosition = calculateRightPosition(numbers);
  
    return (
      
      <View style={styles.operationContainer}>
      <Text style={[
        styles.llevada2, 
        digitoMayor.length === 2 && styles.llevada2,
        digitoMayor.length === 3 && styles.llevada3,
        digitoMayor.length === 3 && resultado.length == 2 && accarreo == 0 && styles.llevada3acarreo,
        digitoMayor.length === 3 && resultado.length >= 3 && accarreo == 0 && styles.llevada3acarreo2,
        digitoMayor.length === 4 && styles.llevada4,
        digitoMayor.length === 4 && resultado.length == 2 && styles.llevada4acarreo1,
        digitoMayor.length === 4 && resultado.length >= 3 && styles.llevada4acarreo2
    ]}>{accarreo.join(' ')}</Text>
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
     

      <Text style={[styles.result, { right: rightPosition  }]}>
        {resultado}
      </Text>
      <Text style={[styles.result2, { right: rightPosition  }]}>
        {resultado2}
      </Text>
      <Text style={[styles.result3, { right: rightPosition  }]}>
        {resultado3}
      </Text>
      {filasCompletas && (
        <View style={styles.container}>
          <View style={styles.dividerMult} />
          <Text style={styles.plusSign}>-</Text>
          <Text style={styles.plusSign2}>-</Text>
          
        </View>
      )}
      <Text style={[styles.result4, { right: rightPosition  }]}>
        {resultado4}
      </Text>
      
    </View>
  );
  };
// ---------------------------------------------------------------------------------------------------------------------- //
  
return (
    <View style={styles.container}>
    <Text style={[styles.text, styles.title]}>Aritmética</Text>
    
    {showBienvenida && !hasShownBienvenida && (
      <Text style={[styles.aritmeticatext]}>
        {bienvenida}
      </Text>
    )}
   
      <TouchableOpacity style={styles.micButton} onPress={recording ? stopRecording : startRecording}>
        <Icon name={recording ? 'stop' : 'microphone'} size={60} color={recording ? 'red' : 'black'} />
      </TouchableOpacity>
      <ViewShot ref={viewShotRef} style={[styles.containerCaptura ]}>
      {operationMult && renderOperation(operationMult)}
      {division && renderDivision(division)}

      </ViewShot>
    </View>
  );
};

export default Aritmetica;
