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
  const [realizar, setRealizar] = useState("Vamos a realizar la operación");
  const [recording, setRecording] = useState(null);
  const opacity = React.useRef(new Animated.Value(1)).current;
  const [message, setMessage] = useState('');
  const [accarreo, setAccarreo] = useState([]);
  const [reinicioAcarreo, setreinicioAcarreo] = useState(false);
  const [reinicioAcarreo2, setreinicioAcarreo2] = useState(false);
  const [reinicioAcarreo3, setreinicioAcarreo3] = useState(false);
  const [operacion, setOperacion] = useState(false);
  const [resultado, setResultado] = useState([]);
  const [resultado2, setResultado2] = useState([]);
  const [resultado3, setResultado3] = useState([]);
  const [resultado4, setResultado4] = useState([]);
  const [operation, setOperation] = useState(null);
  const [inserciones, setInserciones] = useState({ fila0: 0, fila1: 0, fila2: 0 });
  const [multiplicador, setMultiplicador] = useState([]);
  const [multiplicando, setMultiplicando] = useState([]);
  const [multiplicacion, setMultiplicacion] = useState([]);
  const [filasCompletas, setFilasCompletas] = useState(false);
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
    const match = text.match(/(\d+)\s*(menos|más|\+|\-|\x|por|dividido)\s*(\d+(\s*(menos|más|\+|\-|por|dividido)\s*\d+)*)/);
    const resultMatch = text.match(/^\s*([\d\smenos-]+)\s*(?:igual\s*a|=|,|\s)?\s*(\d+)\s*$/i);
    const resultMult = text.match(/^\s*([\d\s]+)\s*(?:por|x)\s*(\d+)\s*(?:igual\s*a|=|,|\s)?\s*(\d+)?\s*\.?\s*$/i);
    const matchAccarreo = text.match(/(me llevo|subo) (uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)\.?/i);
    const resultAcarreo = text.match(/(?:\d+\s*(?:por|x)\s*\d+\s*,?\s*\d+\s*y\s*(?:uno|una|1|2|3|4|5|6|7|8|9)\s*,?\s*(\d+))|(?:\d+\s*(?:por|x)\s*\d+\s*es\s*\d+\s*y\s*(?:uno|una|1|2|3|4|5|6|7|8|9)\s*es\s*(\d+))/i);

  
    console.log('Texto:',text,'Mult:', resultMult, 'Match:', match,'resultado', resultMatch, 'Match Accarreo:', matchAccarreo);
    if (match && operacion === false) {
      // Extraer todos los números y el operador
      const numbers = [match[1]];
      let operator = match[2];
      const rest = match[3];

      setMultiplicacion(match)
  
      // Extraer números adicionales del resto de la cadena
      const additionalMatches = rest.match(/(\d+)/g);
      if (additionalMatches) {
        numbers.push(...additionalMatches);
      }
      
      console.log('Numbers:', numbers);
  
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
      }

      if(operator === 'x'){
        setMultiplicador(parseInt(numbers[0], 10));
        setMultiplicando(parseInt(numbers[1], 10));
      }
      // setAccarreo(prevAccarreo => [' ', ...prevAccarreo]);
      // Llamar a setOperation con una lista de números y el operador
      setOperation({ numbers, operator });
      setOperacion(true);
    }if(filasCompletas){
      console.log("Suma de multiplicación");
      const lowerText = text.toLowerCase().replace(/[.,]$/, '').trim();
      console.log('Texto procesado:', lowerText);
      const regexOperacion = lowerText.match(/^\s*(\d+)\s*(?:\+|mas|más)\s*(\d+)\s*(?:igual\s*a|=|,|\s)?\s*(\d+)?\s*$/i);
      const regexNumerico = lowerText.match(/^(1[0-8]|[0-9])\.?$/);
      const regexPalabras = lowerText.match(/^(cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|trece|catorce|quince|dieciséis|diecisiete|dieciocho)\.?$/i);

      const numberWords = {
        'cero': 0,
        'zero': 0,
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
      };

      if(regexOperacion){
        const result = parseInt(regexOperacion[3], 10);

        console.log('Expresión:', result);
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
        console.log('Número encontrado:', number);
        // setResultado4(prevResultado => [number, ...prevResultado]);
      

        if(number > 10)
        {
          let numberMod = number % 10;
          console.log("Resultado 4 Mod", resultado4)
          setResultado4(prevResultado => [numberMod, ...prevResultado]);
        }
        else
        {
          console.log("Resultado 4", resultado4)
          setResultado4(prevResultado => [number, ...prevResultado]);
        }
      }
      

    

    }else if (operacion === true && resultMult && !matchAccarreo || resultAcarreo) {
     let expectedResult = null;
      if(resultAcarreo){
        console.log("Acarreo", resultAcarreo);
        expectedResult = resultAcarreo[1] ? parseInt(resultAcarreo[1], 10) : parseInt(resultAcarreo[2], 10);
      }else{
        expectedResult = parseInt(resultMult[3], 10);
      }
      console.log('Expresión Mult:', expectedResult, multiplicacion[3], multiplicador, multiplicando);

      let filasMultiplicacion = [];
      let filaActual = 0;  // Variable para rastrear la fila actual, comenzando en 0
      let numActual = 0;  // Variable para rastrear el número actual en la fila

      const numFilas = multiplicando.toString().length;  // Número de filas, máximo 3
      const numPorFila = multiplicador.toString().length;  // Cantidad de números por fila

      console.log("Multiplicador", multiplicador, "Multiplicando", multiplicando, "numFilas", numFilas, "numPorFilas", numPorFila);

      if (expectedResult !== null && expectedResult !== undefined) {
          // Aquí asumimos que el usuario inserta el número directamente
          const fila = expectedResult;  // El número que el usuario inserta
          filasMultiplicacion.push(fila);
          const numLength = fila.toString().length;  // Longitud del número actual
          numActual ++; // Ajusta numActual según la longitud del número

          console.log("Num a insertar", expectedResult, numPorFila-1, inserciones);

          // Solo cuando la fila actual esté completa, se moverá al resultado correspondiente
            let rowCompleted = false;
            if (inserciones.fila0 < numPorFila && inserciones.fila1 === 0) {
              if(expectedResult >= 10 && inserciones.fila0 === numPorFila-1)
                {
                  setResultado(prevResultado => [expectedResult, ...prevResultado]);
                  setInserciones(prevInserciones => ({ ...prevInserciones, fila0: prevInserciones.fila0 + 1 }));
                  console.log("Fila 0 Mod Final", filasMultiplicacion, resultado);
                }
              else if(expectedResult >= 10){
                let expectedResultMod = expectedResult % 10;
                setResultado(prevResultado => [expectedResultMod, ...prevResultado]);
                setInserciones(prevInserciones => ({ ...prevInserciones, fila0: prevInserciones.fila0 + 1 }));
                console.log("Fila 0 Mod", filasMultiplicacion, resultado);
              }
              else 
              {
                setResultado(prevResultado => [expectedResult, ...prevResultado]);
                setInserciones(prevInserciones => ({ ...prevInserciones, fila0: prevInserciones.fila0 + 1 }));
                console.log("Fila 0", filasMultiplicacion, resultado);
              }
              
            } else if (inserciones.fila1 < numPorFila && inserciones.fila2 === 0) {
              if(expectedResult >= 10 && inserciones.fila1 === numPorFila-1)
                {
                  setResultado2(prevResultado => [expectedResult, ...prevResultado]);
                  setInserciones(prevInserciones => ({ ...prevInserciones, fila1: prevInserciones.fila1 + 1 }));
                  console.log("Fila 1 Mod Final", filasMultiplicacion, resultado);
                }
              else if(expectedResult >= 10 && inserciones.fila1 < numPorFila){
                let expectedResultMod = expectedResult % 10;
                setResultado2(prevResultado => [expectedResultMod, ...prevResultado]);
                setInserciones(prevInserciones => ({ ...prevInserciones, fila1: prevInserciones.fila1 + 1 }));
                console.log("Fila 1 Mod", filasMultiplicacion, resultado);
              }
              else
              {
                setResultado2(prevResultado => [expectedResult, ...prevResultado]);
                setInserciones(prevInserciones => ({ ...prevInserciones, fila1: prevInserciones.fila1 + 1 }));
                console.log("Fila 1", filasMultiplicacion, resultado);
              }
              
            } else if ( inserciones.fila2 < numPorFila) {
              if(expectedResult >= 10 && inserciones.fila2 === numPorFila-1)
                {
                  setResultado3(prevResultado => [expectedResult, ...prevResultado]);
                  setInserciones(prevInserciones => ({ ...prevInserciones, fila2: prevInserciones.fila2 + 1 }));
                  console.log("Fila 2 Mod Final", filasMultiplicacion, resultado);
                }
              else if(expectedResult >= 10 && inserciones.fila2 < numPorFila){
                let expectedResultMod = expectedResult % 10;
                setResultado3(prevResultado => [expectedResultMod, ...prevResultado]);
                setInserciones(prevInserciones => ({ ...prevInserciones, fila2: prevInserciones.fila2 + 1 }));
                console.log("Fila 2 Mod", filasMultiplicacion, resultado);
              }
              else
              {
                setResultado3(prevResultado => [expectedResult, ...prevResultado]);
                setInserciones(prevInserciones => ({ ...prevInserciones, fila2: prevInserciones.fila2 + 1 }));
                console.log("Fila 2", filasMultiplicacion, resultado);
              }
              
            }

            console.log("Inserciones", inserciones);
           

            if(inserciones.fila0 === numPorFila-1 && !reinicioAcarreo){
              setAccarreo([]);
              setreinicioAcarreo(true);
            }else if(inserciones.fila1 === numPorFila-1 && !reinicioAcarreo2){
              setAccarreo([]);
              setreinicioAcarreo2(true);
            }
            else if(inserciones.fila2 === numPorFila-2 && !reinicioAcarreo3){
              setAccarreo([]);
              setreinicioAcarreo3(true);
            }
            if(reinicioAcarreo === true && reinicioAcarreo2 === true ){
              setFilasCompletas(true);
            }
            console.log("Reinicios", reinicioAcarreo, reinicioAcarreo2, reinicioAcarreo3, filasCompletas);
      }
    }
    else if(operacion === true && resultMatch && !matchAccarreo) {
      const expression = resultMatch[1].replace(/\s*menos\s*/g, '-');  // Reemplaza 'menos' por '-'
      const expectedResult = parseInt(resultMatch[2], 10);

      console.log('Expresión:',expectedResult);

      if (expectedResult !== null && expectedResult !== undefined) {
        setResultado(prevResultado => [expectedResult, ...prevResultado]);
      }

    }else if(operacion === true && match && !matchAccarreo) {
      
      const numbers = [match[1]];
      let operator = match[2];
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

      console.log('Numbers:', numbers);
  
    }else if (operacion === true && !matchAccarreo) {
      const numberWords = {
        'cero': 0,
        'zero': 0,
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
      // setAccarreo(prevAccarreo => [' ', ...prevAccarreo]);
     
      // Convertir el texto a minúsculas, eliminar cualquier punto o coma al final y recortar espacios en blanco
      const lowerText = text.toLowerCase().replace(/[.,]$/, '').trim();
      console.log('Texto procesado:', lowerText);
    
      // Verificar si el texto es una palabra que representa un número
      if (numberWords.hasOwnProperty(lowerText)) {
        let number = numberWords[lowerText];
        if (number > 10) {
          number = number % 10;
        }
        console.log('Número encontrado:', number);
        setResultado(prevResultado => [number, ...prevResultado]);
      } else if (!isNaN(lowerText)) {
        let number = parseInt(lowerText, 10);
        if (number > 10) {
          number = number % 10;
        }
        console.log('Número encontrado:', number);
        setResultado(prevResultado => [number, ...prevResultado]);
      } else {
        console.log('Texto no reconocido:', lowerText);
        setMessage("Operación no reconocida, intenta de nuevo.");
      }
    }else if(matchAccarreo){
      console.log('Texto procesado:', matchAccarreo);
      const carryNumber = [matchAccarreo[2]];
      console.log('Número de acarreo:', carryNumber);

      const numberWords = {
        'cero': 0,
        'uno': 1,
        'una': 1,
        'dos': 2,
        'tres': 3,
        'cuatro': 4,
        'cinco': 5,
        'seis': 6,
        'siete': 7,
        'ocho': 8,
        'nueve': 9,
      };

      const lowerText = matchAccarreo[2].toLowerCase().replace(/[.,]$/, '').trim();
      console.log('Texto procesado:', lowerText);
      if (numberWords.hasOwnProperty(lowerText)) {
        const number = numberWords[lowerText];
        
        console.log('Número encontrado:', number);
        setAccarreo(prevAccarreo => [ number ,...prevAccarreo]);
        console.log('Acarreo:', accarreo);
      }

      
    } else {
      setMessage("Operación no reconocida, inténtalo de nuevo.");
    }
  };

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
  
  const renderOperation = (operation) => {
    const { numbers, operator } = operation;
  
    // Padding para asegurar que los números estén alineados a la derecha
    const maxLength = Math.max(...numbers.map(num => num.length));
    const paddedNumbers = numbers.map(num => num.padStart(maxLength, ' '));
    const rightPosition = calculateRightPosition(numbers);
  
    return (
      
      <View style={styles.operationContainer}>
      {operacion && (
        <Animated.Text style={[styles.messageText, { opacity }]}>
          {realizar}
        </Animated.Text>
      )}
      <Text style={styles.llevada}>{accarreo.join(' ')}</Text>
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
            <View style={styles.dividerMult} />
        )}
      <Text style={[styles.result4, { right: rightPosition  }]}>
        {resultado4}
      </Text>
      
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
  messageText: {
    bottom: 80,
    paddingBottom: 20,
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'massallera',
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
  llevada: {
    color: 'red',
    // position: 'absolute', // Eliminado para que los elementos se alineen naturalmente
    right: 170,           // Eliminado para evitar posición fija
    bottom: 0,
    fontSize: 30,
    fontFamily: 'massallera',
    flexDirection: 'row-reverse', // Para que los elementos se añadan a la izquierda
    alignSelf: 'flex-end',        // Para alinearlo a la derecha del contenedor
  },
  title: {
    top: 5,
    padding: 20,
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 20,
  },
  micButton: {
    top: 30,
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
    bottom:10,
    fontWeight: 'bold',
    textAlign: 'right',
    width:30, // Ajustar según el espacio necesario
    fontFamily: 'massallera',
  },
  operator: {
    bottom: 30,
    fontFamily: 'massallera',
    fontSize: 0,
    marginRight: 10,
    fontSize: 30,
    textAlign: 'left',
    width: 30, // Ajustar según el espacio necesario

  },
  divider: {
    bottom: 30,
    height: 4,
    paddingleft: 60,
    backgroundColor: 'black',
    width: 150, // Asegurar que la barra ocupe el espacio correcto
    marginVertical: 10,
  },
  dividerMult: {
    bottom: 60,
    height: 4,
    paddingleft: 60,
    backgroundColor: 'black',
    width: 150, // Asegurar que la barra ocupe el espacio correcto
    marginVertical: 10,
  },
  result: {
    height: 60,
    bottom: 30,
    right: 10,
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'massallera',
    textAlign: 'right',
    width: 180, // Asegurar que el resultado ocupe el espacio correcto
  },
  result2: {
    height: 60,
    bottom: 40,
    marginRight: 70,
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'massallera',
    textAlign: 'right',
    width: 180, // Asegurar que el resultado ocupe el espacio correcto
  }, 
  result3: {
    height: 60,
    bottom: 50,
    marginRight: 120,
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'massallera',
    textAlign: 'right',
    width: 180, // Asegurar que el resultado ocupe el espacio correcto
  },
  result4: {
    height: 60,
    bottom: 60,
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'massallera',
    textAlign: 'right',
    width: 200, // Asegurar que el resultado ocupe el espacio correcto
  },
});

export default Aritmetica;
