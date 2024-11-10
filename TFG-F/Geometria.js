import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import regexUtils from './utils/regexUtils.js';
import ViewShot from 'react-native-view-shot';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import styles from './assets/styles/styles.js';
import {useRoute} from '@react-navigation/native';
import { captureAndSaveOperation, getAllOperations} from './db/database.js';

import {drawAngle, normalizeText, generateUniqueId} from './utils/utils.js'; 



const Geometria = () => {
  const [bienvenida, setBienvenida] = useState("¡Bienvenido a Geometría!");
  const [showBienvenida, setShowBienvenida] = useState(true);
  const [hasShownBienvenida, setHasShownBienvenida] = useState(false);
  //Guardado
  const route = useRoute();
  const navigation = useNavigation();
  const { operation } = route.params || {};
  const [lastId, setLastId] = useState(0);
  const [operations, setOperations] = useState([]);
  const viewShotRef = useRef(null);
  const [capturedImage, setCapturedImage] = React.useState(null);
  //Elementos de la geometría
  const [opacity] = useState(new Animated.Value(1));
  const [recording, setRecording] = useState(null);
  const [message, setMessage] = useState('');
  const [lado, setLado] = useState(0);
  const [base, setBase] = useState(0);
  const [altura, setAltura] = useState(0);
  const [area, setArea] = useState(0);
  const [radio, setRadio] = useState(0);
  const [diametro, setDiametro] = useState(0);
  const [perimetro, setPerimetro] = useState(0);
  const [figure, setFigure] = useState(null);
  const [diagonalMayor, setDiagonalMayor] = useState(0);
  const [diagonalMenor, setDiagonalMenor] = useState(0);
  const [ejeMayor, setEjeMayor] = useState(0);
  const [ejeMenor, setEjeMenor] = useState(0);
  const [distFocal, setDistFocal] = useState(0);
  const [circunferencia, setCircunferencia] = useState(0);
  const [volumen, setVolumen] = useState(0);
  const [apotema, setApotema] = useState(0);
  const [angleDegrees, setAngleDegrees] = useState(0);

  React.useEffect(() => {
    if (!hasShownBienvenida) {
      const timer1 = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }).start(() => {
          setShowBienvenida(false);
          setHasShownBienvenida(true);
          const timer2 = setTimeout(() => {
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
  }, [hasShownBienvenida]);
  
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
    const normalizedText = normalizeText(text);
    const figureRegex = regexUtils.matchGeometricFigure(normalizedText);
    const figure3DRegex = regexUtils.matchGeometric3DFigure(normalizedText);
    const angleRegex = regexUtils.matchAngle(normalizedText);
    const dimensionMatch = regexUtils.matchDimension(normalizedText); // Captura la dimensión
    const guardar = regexUtils.matchGuardarOperacion(text); //Guardado
  

    if(guardar){

      handleSave();
    }

    else if (dimensionMatch && figure === null) {
      setMessage('Define primero la figura');
    }
    else if (figureRegex) {
      setFigure(figureRegex[4]);
    } else if (figure3DRegex) {
      setFigure(figure3DRegex[4]);
    } else if (angleRegex) {
      setFigure('angulo');
      setAngleDegrees(angleRegex); // Actualiza el estado del ángulo
    } else if (dimensionMatch && figure ) {
      const dimensionType = dimensionMatch[1].toLowerCase();
      const dimensionValue = dimensionMatch[2];

      switch (figure) {
        case 'cuadrado':
          if (dimensionType === 'lado') {
            setLado(dimensionValue);
           
          } else if (dimensionType === 'area') {
            setArea(dimensionValue);
      
          } else if (dimensionType === 'perimetro') {
            setPerimetro(dimensionValue);
        
          }
          break; // Asegúrate de agregar un break para evitar que continúe al siguiente caso
  
        case 'triangulo':
          if (dimensionType === 'lado') {
            setLado(dimensionValue);
            
          }else if (dimensionType === 'base') {
              setBase(dimensionValue);
             
          }else if (dimensionType === 'altura') {
              setAltura(dimensionValue);
              
            }else if (dimensionType === 'area') {
              setArea(dimensionValue);
          
            } else if (dimensionType === 'perimetro') {
              setPerimetro(dimensionValue);
             
            }
          break;
      
        case 'rectangulo':
          if (dimensionType === 'base') {
            setBase(dimensionValue);
           
          } else if (dimensionType === 'altura') {
              setAltura(dimensionValue);
             
            } else if (dimensionType === 'area') {
              setArea(dimensionValue);
              
            } else if (dimensionType === 'perimetro') {
              setPerimetro(dimensionValue);
             
            }
          break;

          case 'circulo':
            if (dimensionType === 'radio') {
              setRadio(dimensionValue);
             
            } else if (dimensionType === 'diametro') {
              setDiametro(dimensionValue);
   
            } else if (dimensionType === 'circunferencia') {
              setPerimetro(dimensionValue);
            
            } else if (dimensionType === 'area') {
              setArea(dimensionValue);
         
            }          
            break;
          

          case 'pentagono':
            if (dimensionType === 'lado') {
              setLado(dimensionValue);
     
            }
            else if (dimensionType === 'altura') {
              setAltura(dimensionValue);
     
            } else if (dimensionType === 'perimetro') {
              setPerimetro(dimensionValue);
      
            } else if (dimensionType === 'area') {
              setArea(dimensionValue);
    
            }
          break;

          case 'hexagono':
            if (dimensionType === 'lado') {
              setLado(dimensionValue);
       
            }
            else if (dimensionType === 'altura') {
              setAltura(dimensionValue);
    
            }
            else if (dimensionType === 'perimetro') {
              setPerimetro(dimensionValue);
    
            } else if (dimensionType === 'area') {
              setArea(dimensionValue);
       
            }
          break;
       
          case 'rombo':
            if (dimensionType === 'lado') {
              setLado(dimensionValue);
      
            }
            if (dimensionType === 'diagonal mayor') {
              setDiagonalMayor(dimensionValue);
     
            }
            else if (dimensionType === 'diagonal menor') {
              setDiagonalMenor(dimensionValue);
          
            }
            else if (dimensionType === 'perimetro') {
              setPerimetro(dimensionValue);
      
            } else if (dimensionType === 'area') {
              setArea(dimensionValue);
    
            }
          break;
            case 'elipse':
              if (dimensionType === 'eje mayor') {
                setEjeMayor(dimensionValue);
        
              }
              else if (dimensionType === 'eje menor') {
                setEjeMenor(dimensionValue);
   
              }
              else if (dimensionType === 'distancia focal') {
                setDistFocal(dimensionValue);

              }
              else if (dimensionType === 'area') {
                setArea(dimensionValue);
             
              }
              else if (dimensionType === 'radio') {
                setRadio(dimensionValue);
         
              } else if (dimensionType === 'diametro') {
                setDiametro(dimensionValue);
               
              }
              break;
          case 'esfera':
            if (dimensionType === 'radio') {
              setRadio(dimensionValue);
          
            }
            else if (dimensionType === 'diametro') {
              setDiametro(dimensionValue);
           
            }
            else if (dimensionType === 'area') {
              setArea(dimensionValue);
        
            }
            else if (dimensionType === 'volumen') {
              setVolumen(dimensionValue);
       
            }
            else if (dimensionType === 'circunferencia') {
              setCircunferencia(dimensionValue);
      
            }
            break;
          case 'piramide':
            if (dimensionType === 'lado') {
              setLado(dimensionValue);
          
            }
            else if (dimensionType === 'altura') {
              setAltura(dimensionValue);
      
            }
            else if (dimensionType === 'apotema') {
              setApotema(dimensionValue);
           
            }
            else if (dimensionType === 'area') {
              setArea(dimensionValue);
           
            }
            else if (dimensionType === 'volumen') {
              setVolumen(dimensionValue);
         
            }
            break;
            case 'cubo':
              if(dimensionType === 'lado') {
                setLado(dimensionValue);
              
              }
              else if(dimensionType === 'area') {
                setArea(dimensionValue);
            
              }
              else if(dimensionType === 'volumen') {
                setVolumen(dimensionValue);
       
              }
              break;
            case 'cilindro':
              if(dimensionType === 'radio') {
                setRadio(dimensionValue);
         
              }
              else if(dimensionType === 'altura') {
                setAltura(dimensionValue);
         
              }
              else if(dimensionType === 'diametro') {
                setDiametro(dimensionValue);
         
              }
              else if(dimensionType === 'area') {
                setArea(dimensionValue);
            
              }
              else if(dimensionType === 'volumen') {
                setVolumen(dimensionValue);
         
              }
              break;
            case 'cono':
              if(dimensionType === 'radio') {
                setRadio(dimensionValue);
             
              }
              else if(dimensionType === 'altura') {
                setAltura(dimensionValue);
         
              }
              else if(dimensionType === 'diametro') {
                setDiametro(dimensionValue);
         
              }
              else if(dimensionType === 'area') {
                setArea(dimensionValue);
         
              }
              else if(dimensionType === 'volumen') {
                setVolumen(dimensionValue);
          
              }
              break;
        }
      }
  };

  useFocusEffect(
    useCallback(() => {
      if (operation) {
        // Prellenar los campos según el tipo de operación
        switch (operation.operacion) {
          case 'cuadrado':
            setFigure('cuadrado');
            setLado(operation.detalles.lado);
            setArea(operation.detalles.area);
            setPerimetro(operation.detalles.perimetro);
            handleOperation(`dibuja un ${operation.tipo}`);
            break;
          case 'triangulo':
            setFigure('triangulo');
            setAltura(operation.detalles.altura);
            setBase(operation.detalles.base);
            setArea(operation.detalles.area);
            setLado(operation.detalles.lado);
            setPerimetro(operation.detalles.perimetro);
            handleOperation(`dibuja un ${operation.tipo}`);
            break;
          case 'rectangulo':
            setFigure('rectangulo');
            setBase(operation.detalles.base);
            setAltura(operation.detalles.altura);
            setPerimetro(operation.detalles.perimetro);
            setArea(operation.detalles.area);
            handleOperation(`dibuja un ${operation.tipo}`);
            break;
          case 'circulo':
            setFigure('circulo');
            setRadio(operation.detalles.radio);
            setDiametro(operation.detalles.diametro);
            setCircunferencia(operation.detalles.circunferencia);
            setArea(operation.detalles.area);
            handleOperation(`dibuja un ${operation.tipo}`);
            break;
          case 'pentagono':
            setFigure('pentagono');
            setLado(operation.detalles.lado);
            setArea(operation.detalles.area);
            setPerimetro(operation.detalles.perimetro);
            setAltura(operation.detalles.altura);
            handleOperation(`dibuja un ${operation.tipo}`);
            break;
          case 'hexagono':
            setFigure('hexagono');
            setLado(operation.detalles.lado);
            setArea(operation.detalles.area);
            setPerimetro(operation.detalles.perimetro);
            setAltura(operation.detalles.altura);
            handleOperation(`dibuja un ${operation.tipo}`);
            break;
          case 'rombo':
            setFigure('rombo');
            setLado(operation.detalles.lado);
            setDiagonalMayor(operation.detalles.diagonalMayor);
            setDiagonalMenor(operation.detalles.diagonalMenor);
            setArea(operation.detalles.area);
            setPerimetro(operation.detalles.perimetro);
            handleOperation(`dibuja un ${operation.tipo}`);
            break;
          case 'elipse':
            setFigure('elipse');
            setEjeMayor(operation.detalles.ejeMayor);
            setEjeMenor(operation.detalles.ejeMenor);
            setDistFocal(operation.detalles.distFocal);
            setArea(operation.detalles.area);
            setRadio(operation.detalles.radio);
            setDiametro(operation.detalles.diametro);

            handleOperation(`dibuja un ${operation.tipo}`);
            break;
          case 'esfera':
            setFigure('esfera');
            setRadio(operation.detalles.radio);
            setDiametro(operation.detalles.diametro);
            setArea(operation.detalles.area);
            setVolumen(operation.detalles.volumen);
            setCircunferencia(operation.detalles.circunferencia);
            handleOperation(`dibuja un ${operation.tipo}`);
            break;
          case 'piramide':
            setFigure('piramide');
            setLado(operation.detalles.lado);
            setAltura(operation.detalles.altura);
            setApotema(operation.detalles.apotema);
            setArea(operation.detalles.area);
            setVolumen(operation.detalles.volumen);
            handleOperation(`dibuja un ${operation.tipo}`);
            break;
          case 'cubo':
            setFigure('cubo');
            setLado(operation.detalles.lado);
            setArea(operation.detalles.area);
            setVolumen(operation.detalles.volumen);
            handleOperation(`dibuja un ${operation.tipo}`);
            break;
          case 'cilindro':
            setFigure('cilindro');
            handleOperation(`dibuja un ${operation.tipo}`);
            setRadio(operation.detalles.radio);
            setDiametro(operation.detalles.diametro);
            setArea(operation.detalles.area);
            setAltura(operation.detalles.altura);
            setVolumen(operation.detalles.volumen);
            break;
          case 'cono':
            setFigure('cono');
            setRadio(operation.detalles.radio);
            setArea(operation.detalles.area);
            setVolumen(operation.detalles.volumen);
            setDiametro(operation.detalles.diametro);
            setAltura(operation.detalles.altura);
            handleOperation(`dibuja un ${operation.tipo}`);
            break;
          case 'angulo':
            setFigure('angulo');
            setAngleDegrees(operation.detalles.angleDegrees);
            handleOperation(`dibuja un ${operation.tipo}`);
            break;
          default:
            console.error('Operación no reconocida:', operation.operacion);
        }
      }
    }, [operation])
  );

  useEffect(() => {
    const fetchOperations = async () => {
      const ops = await getAllOperations();
      setOperations(ops);
    };

    fetchOperations();
  }, []);

  const handleSave = async () => {
  
    try {
      let elementData = null;
      let uri = null;
  
      const newId = await generateUniqueId();
  
      // Verifica el valor de figure
  
      switch (figure.trim().toLowerCase()) {
        case 'cuadrado':
          elementData = {
            id: newId,
            operacion: 'cuadrado',
            detalles: { lado, area, perimetro },
          };
          break;
  
        case 'triangulo':
          elementData = {
            id: newId,
            operacion: 'triangulo',
            detalles: { lado, base, altura, area, perimetro },
          };
          break;
  
        case 'rectangulo':
          elementData = {
            id: newId,
            operacion: 'rectangulo',
            detalles: { base, altura, area, perimetro },
          };
          break;
  
        case 'circulo':
          elementData = {
            id: newId,
            operacion: 'circulo',
            detalles: { radio, diametro, circunferencia, area },
          };
          break;
  
        case 'pentagono':
          elementData = {
            id: newId,
            operacion: 'pentagono',
            detalles: { lado, altura, area, perimetro },
          };
          break;
  
        case 'hexagono':
          elementData = {
            id: newId,
            operacion: 'hexagono',
            detalles: { lado, altura, area, perimetro },
          };
          break;
  
        case 'rombo':
          elementData = {
            id: newId,
            operacion: 'rombo',
            detalles: { lado, diagonalMayor, diagonalMenor, area, perimetro },
          };
          break;
  
        case 'elipse':
          elementData = {
            id: newId,
            operacion: 'elipse',
            detalles: { ejeMayor, ejeMenor, distFocal, radio, diametro },
          };
          break;
  
        case 'esfera':
          elementData = {
            id: newId,
            operacion: 'esfera',
            detalles: { radio, diametro, area, volumen, circunferencia },
          };
          break;
  
        case 'piramide':
          elementData = {
            id: newId,
            operacion: 'piramide',
            detalles: { lado, altura, apotema, area, volumen },
          };
          break;
  
        case 'cubo':
          elementData = {
            id: newId,
            operacion: 'cubo',
            detalles: { lado, area, volumen },
          };
          break;
  
        case 'cilindro':
          elementData = {
            id: newId,
            operacion: 'cilindro',
            detalles: { radio, altura, diametro, area, volumen, circunferencia },
          };
          break;
  
        case 'cono':
          elementData = {
            id: newId,
            operacion: 'cono',
            detalles: { radio, altura, diametro, area, volumen },
          };
          break;

        case 'angulo':
          elementData = {
            id: newId,
            operacion: 'angulo',
            detalles: { angleDegrees },
          };
          break;

  
        default:
          console.error('Figura geométrica no reconocida:', figure);
          return;
      }
  
      // Verifica el valor de elementData
      // Si se creó elementData, guarda la figura geométrica
      if (elementData) {
        // Guardar la figura geométrica con la imagen capturada
        await captureAndSaveOperation(viewShotRef, { ...elementData, foto: uri });
        setCapturedImage(uri); // Actualiza el estado de la imagen capturada
  
        const elements = await getAllOperations();
        setOperations(elements);
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Error al capturar o guardar la figura geométrica:', error);
    }
  };


  const renderIcon = () => {
    switch (figure) {
      case 'cuadrado':
        return (
          <View style={styles.figureContainer}>
            {lado !== null && lado !== 0 && <Text style={styles.dimensionText}>Lado: {lado}</Text>}
            {area !== null && area !== 0 && <Text style={styles.dimensionText}>Área: {area}</Text>}
            {perimetro !== null && perimetro !== 0 && <Text style={styles.dimensionText}>Perímetro: {perimetro}</Text>}
            <View style={styles.squareContainer}>
              <Ionicons name="square-outline" size={300} color="black" />
              {lado !== null && lado !== 0 && <Text style={styles.squareText}>{lado}</Text>}
              {lado !== null&& lado !== 0 && <Text style={styles.squareText2}>{lado}</Text>}
            </View>
          </View>
        );
      case 'triangulo':
        return (
          <View style={styles.figureContainer}>
            {lado !== null && lado !== 0 && <Text style={styles.dimensionText}>Lado: {lado}</Text>}
            {base !== null && base !== 0 && <Text style={styles.dimensionText}>Base: {base}</Text>}
            {altura!== null && altura !== 0 && <Text style={styles.dimensionText}>Altura: {altura}</Text>}
            {area !== null && area !== 0 && <Text style={styles.dimensionText}>Área: {area}</Text>}
            {perimetro !== null && perimetro !== 0 && <Text style={styles.dimensionText}>Perímetro: {perimetro}</Text>}
              <View style={styles.triangleContainer}>
                <Ionicons name="triangle-outline" size={300} color="black" />
                  {lado !== null && lado !== 0 && <Text style={styles.triangleText}>{lado}</Text>}
                  {base !== null && base !== 0 && <Text style={styles.triangleBaseText}>{base}</Text>}
                  {altura !== null && altura !== 0 && <View style={styles.redBar} />}
                  {altura !== null && altura !== 0 && <Text style={styles.triangleAlturaText}>{altura}</Text>}
              </View>
          </View>
        );
      case 'rectangulo':
        return (
          <View style={styles.figureContainer}>
                {base !== null && base !== 0 && <Text style={styles.dimensionText}>Base: {base}</Text>}
                {altura !== null && altura !== 0 && <Text style={styles.dimensionText}>Altura: {altura}</Text>}
            {area !== null && area !== 0 && <Text style={styles.dimensionText}>Área: {area}</Text>}
            {perimetro !== null && perimetro !== 0 && <Text style={styles.dimensionText}>Perímetro: {perimetro}</Text>}
              <View style={styles.rectangleContainer}>
                <MaterialCommunityIcons name="rectangle-outline" size={360} color="black" />
                {base !== null && base !== 0 && <Text style={styles.rectangleText}>{base}</Text>}
                {altura !== null&& altura !== 0 && <Text style={styles.rectangleText2}>{altura}</Text>}
              </View>
          </View>
        );
      case 'circulo':
        return (
          <View style={styles.figureContainer}>
                {radio !== null && radio !== 0 && <Text style={styles.dimensionText}>Radio: {radio}</Text>}
                {diametro !== null && diametro !== 0 && <Text style={styles.dimensionText}>Diametro: {diametro}</Text>}
            {area !== null && area !== 0 && <Text style={styles.dimensionText}>Área: {area}</Text>}
            {perimetro !== null && perimetro !== 0 && <Text style={styles.dimensionText}>Perímetro: {perimetro}</Text>}
              <View style={styles.rectangleContainer}>
                <MaterialCommunityIcons name="circle-outline" size={300} color="black" />
                {radio !== null && radio !== 0 && <Text style={styles.circleBar}>{radio}</Text>}
                {radio !== null && radio !== 0 && <Text style={styles.circleText}>{radio}</Text>}
                {diametro !== null && diametro !== 0 && <Text style={styles.circleBar2}>{diametro}</Text>}
                {diametro !== null && diametro !== 0 && <Text style={styles.circleText2}>{diametro}</Text>}
              </View>
          </View>
        );
      case 'pentagono':
          return (
            <View style={styles.figureContainer}>
              {lado !== null && lado !== 0 && <Text style={styles.dimensionText}>Lado: {lado}</Text>}
              {altura !== null && altura !== 0 && <Text style={styles.dimensionText}>Altura: {altura}</Text>}
              {area !== null && area !== 0 && <Text style={styles.dimensionText}>Área: {area}</Text>}
              {perimetro !== null && perimetro !== 0 && <Text style={styles.dimensionText}>Perímetro: {perimetro}</Text>}
              <View style={styles.squareContainer}>
                <MaterialCommunityIcons name="pentagon-outline" size={300} color="black" />
                {lado !== null && lado !== 0 && <Text style={styles.pentagonText}>{lado}</Text>}
                {altura !== null&& altura !== 0 && <Text style={styles.pentagonText2}>{altura}</Text>}
                {altura !== null && altura !== 0 && <View style={styles.pentagonBar} />}
              </View>
            </View>
          );
      case 'hexagono':
        return (
          <View style={styles.figureContainer}>
            {lado !== null && lado !== 0 && <Text style={styles.dimensionText}>Lado: {lado}</Text>}
            {altura !== null && altura !== 0 && <Text style={styles.dimensionText}>Altura: {altura}</Text>}
            {area !== null && area !== 0 && <Text style={styles.dimensionText}>Área: {area}</Text>}
            {perimetro !== null && perimetro !== 0 && <Text style={styles.dimensionText}>Perímetro: {perimetro}</Text>}
            <View style={styles.squareContainer}>
              <MaterialCommunityIcons name="hexagon-outline" size={300} color="black" />
              {lado !== null && lado !== 0 && <Text style={styles.hexagonText}>{lado}</Text>}
              {altura !== null&& altura !== 0 && <Text style={styles.pentagonText2}>{altura}</Text>}
              {altura !== null && altura !== 0 && <View style={styles.hexagonBar} />}
            </View>
          </View>
        );
      case 'rombo':
        return (
          <View style={styles.figureContainer}>
            {lado !== null && lado !== 0 && <Text style={styles.dimensionText}>Lado: {lado}</Text>}
            {diagonalMayor !== null && diagonalMayor !== 0 && <Text style={styles.dimensionText}>Diagonal Mayor: {diagonalMayor}</Text>}
            {diagonalMenor !== null && diagonalMenor !== 0 && <Text style={styles.dimensionText}>Diagonal Menor: {diagonalMenor}</Text>}
            {area !== null && area !== 0 && <Text style={styles.dimensionText}>Área: {area}</Text>}
            {perimetro !== null && perimetro !== 0 && <Text style={styles.dimensionText}>Perímetro: {perimetro}</Text>}
            <View style={styles.squareContainer}>
            <MaterialCommunityIcons name="cards-diamond-outline" size={300} color="black" />
            {lado !== null && lado !== 0 && <Text style={styles.romboText}>{lado}</Text>}
              {diagonalMayor !== null && diagonalMayor !== 0 && <Text style={styles.diagonalMayorText}>{diagonalMayor}</Text>}
              {diagonalMayor !== null && diagonalMayor !== 0 && <View style={styles.diagonalMayorBar} />}
              {diagonalMenor !== null && diagonalMenor !== 0 && <Text style={styles.diagonalMenorText}>{diagonalMenor}</Text>}
              {diagonalMenor !== null && diagonalMenor !== 0 && <View style={styles.diagonalMenorBar} />}
            </View>
          </View>
        );
      case 'elipse':
        return (
          <View style={styles.figureContainer}>
             {radio !== null && radio !== 0 && <Text style={styles.dimensionText}>Radio: {radio}</Text>}
             {diametro !== null && diametro !== 0 && <Text style={styles.dimensionText}>Diametro: {diametro}</Text>}
            {ejeMayor !== null && ejeMayor !== 0 && <Text style={styles.dimensionText}>Eje Mayor: {ejeMayor}</Text>}
            {ejeMenor !== null && ejeMenor !== 0 && <Text style={styles.dimensionText}>Eje Menor: {ejeMenor}</Text>}
            {distFocal !== null && distFocal !== 0 && <Text style={styles.dimensionText}>Distancia Focal: {distFocal}</Text>}
            {area !== null && area !== 0 && <Text style={styles.dimensionText}>Área: {area}</Text>}
            {perimetro !== null && perimetro !== 0 && <Text style={styles.dimensionText}>Perímetro: {perimetro}</Text>}
            <View style={styles.squareContainer}>
            <MaterialCommunityIcons name="ellipse-outline" size={300} color="black" />
              {ejeMayor !== null && ejeMayor !== 0 && <Text style={styles.ejeMayorText}>{ejeMayor}</Text>}
              {ejeMayor !== null && ejeMayor !== 0 && <View style={styles.ejeMayorBar} />}
              {ejeMenor !== null && ejeMenor !== 0 && <Text style={styles.ejeMenorText}>{ejeMenor}</Text>}
              {ejeMenor !== null && ejeMenor !== 0 && <View style={styles.ejeMenorBar} />}
              {distFocal !== null && distFocal !== 0 && <Text style={styles.distFocalText}>{distFocal}</Text>}
              {distFocal !== null && distFocal !== 0 && <Text style={styles.distFocalBar}></Text>}
              <View style={[styles.point, styles.point1]} />
              <View style={[styles.point, styles.point2]} />
            </View>
          </View>
        );
       
      case 'esfera':
        return (
        <View style={styles.figureContainer}>
            {radio !== null && radio !== 0 && <Text style={styles.dimensionText}>Radio: {radio}</Text>}
            {diametro !== null && diametro !== 0 && <Text style={styles.dimensionText}>Diametro: {diametro}</Text>}
            {area !== null && area !== 0 && <Text style={styles.dimensionText}>Área: {area}</Text>}
            {volumen !== null && volumen !== 0 && <Text style={styles.dimensionText}>Volumen: {volumen}</Text>}
            {circunferencia !== null && circunferencia !== 0 && <Text style={styles.dimensionText}>Circunferencia: {circunferencia}</Text>}
            <View style={styles.squareContainer}>
            <MaterialCommunityIcons name="sphere" size={300} color="black" />
              {radio !== null && radio !== 0 && <Text style={styles.esferaBar}></Text>}
              {radio !== null && radio !== 0 && <Text style={styles.esferaText}>{radio}</Text>}
              {diametro !== null && diametro !== 0 && <Text style={styles.esferaBar2}></Text>}
              {diametro !== null && diametro !== 0 && <Text style={styles.esferaText2}>{diametro}</Text>}
    
            </View>
          </View>
        );
      case 'piramide':
        return (
          <View style={styles.figureContainer}>
            {lado !== null && lado !== 0 && <Text style={styles.dimensionText}>Lado: {lado}</Text>}
            {altura !== null && altura !== 0 && <Text style={styles.dimensionText}>Altura: {altura}</Text>}
            {apotema !== null && apotema !== 0 && <Text style={styles.dimensionText}>Apotema: {apotema}</Text>}
            {area !== null && area !== 0 && <Text style={styles.dimensionText}>Área: {area}</Text>}
            {volumen !== null && volumen !== 0 && <Text style={styles.dimensionText}>Volumen: {volumen}</Text>}
            <View style={styles.squareContainer}>
            <MaterialCommunityIcons name="pyramid" size={300} color="black" />
            {lado !== null && lado !== 0 && <Text style={styles.piramideText}>{lado}</Text>}
            {altura !== null && altura !== 0 && <Text style={styles.piramideText3}>{altura}</Text>}
            {altura !== null && altura !== 0 && <View style={styles.piramideredBar} />}
            {apotema !== null && apotema !== 0 && <Text style={styles.piramideText2}>{apotema}</Text>}
            {apotema !== null && apotema !== 0 && <View style={styles.piramideredBar2} />}
            </View>
          </View>
        );
      case 'cubo':
        return (
          <View style={styles.figureContainer}>
            {lado !== null && lado !== 0 && <Text style={styles.dimensionText}>Lado: {lado}</Text>}
            {area !== null && area !== 0 && <Text style={styles.dimensionText}>Área: {area}</Text>}
            {volumen !== null && volumen !== 0 && <Text style={styles.dimensionText}>Volumen: {volumen}</Text>}
            <View style={styles.squareContainer}>
              <Ionicons name="cube-outline" size={300} color="black" />
              {lado !== null && lado !== 0 && <Text style={styles.cuboText}>{lado}</Text>}
              
            </View>
          </View>
        );
        
      case 'cilindro':
        return (
          <View style={styles.figureContainer}>
              {radio !== null && radio !== 0 && <Text style={styles.dimensionText}>Radio: {radio}</Text>}
              {diametro !== null && diametro !== 0 && <Text style={styles.dimensionText}>Diametro: {diametro}</Text>}
              {altura !== null && altura!== 0 && <Text style={styles.dimensionText}>Altura: {altura}</Text>}
              {area !== null && area !== 0 && <Text style={styles.dimensionText}>Área: {area}</Text>}
              {volumen !== null && volumen !== 0 && <Text style={styles.dimensionText}>Volumen: {volumen}</Text>}
              <View style={styles.squareContainer}>
              <MaterialCommunityIcons name="cylinder" size={300} color="black" />
                {radio !== null && radio !== 0 && <Text style={styles.cilindroBar}></Text>}
                {radio !== null && radio !== 0 && <Text style={styles.cilindroText}>{radio}</Text>}
                {diametro !== null && diametro !== 0 && <Text style={styles.cilindroBar2}></Text>}
                {diametro !== null && diametro !== 0 && <Text style={styles.cilindroText2}>{diametro}</Text>}
                {altura !== null && altura !== 0 && <Text style={styles.cilindroText3}>{altura}</Text>}
                {altura !== null && altura !== 0 && <View style={styles.cilindroBar3} />}
              </View>
            </View>
          );
      case 'cono':
        return (
          <View style={styles.figureContainer}>
              {radio !== null && radio !== 0 && <Text style={styles.dimensionText}>Radio: {radio}</Text>}
              {diametro !== null && diametro !== 0 && <Text style={styles.dimensionText}>Diametro: {diametro}</Text>}
              {altura !== null && altura!== 0 && <Text style={styles.dimensionText}>Altura: {altura}</Text>}
              {area !== null && area !== 0 && <Text style={styles.dimensionText}>Área: {area}</Text>}
              {volumen !== null && volumen !== 0 && <Text style={styles.dimensionText}>Volumen: {volumen}</Text>}
              <View style={styles.squareContainer}>
               <MaterialCommunityIcons name="cone" size={300} color="black" />
                {radio !== null && radio !== 0 && <Text style={styles.conoBar2}></Text>}
                {radio !== null && radio !== 0 && <Text style={styles.conoText2}>{radio}</Text>}
                {diametro !== null && diametro !== 0 && <Text style={styles.conoBar}></Text>}
                {diametro !== null && diametro !== 0 && <Text style={styles.conoText}>{diametro}</Text>}
                {altura !== null && altura !== 0 && <Text style={styles.conoText3}>{altura}</Text>}
                {altura !== null && altura !== 0 && <View style={styles.conoBar3} />}
              </View>
            </View>
          );
      case 'angulo':
 
        return drawAngle(angleDegrees); // Usa la función drawAngle
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.title]}>Geometría</Text>
         
    {showBienvenida && !hasShownBienvenida && (
      <Text style={[styles.aritmeticatext]}>
        {bienvenida}
      </Text>
    )}

      {message && <Text style={styles.messageText}>{message}</Text>}

      <TouchableOpacity style={styles.micButton} onPress={recording ? stopRecording : startRecording}>
        <Icon name={recording ? 'stop' : 'microphone'} size={60} color={recording ? 'red' : 'black'} />
      </TouchableOpacity>
      <ViewShot ref={viewShotRef} style={[styles.viewShot ]}>
      {figure && (
        <View style={styles.iconContainer}>
          {renderIcon()}
        </View>
      )}
      </ViewShot>
    </View>

  );
};


export default Geometria;