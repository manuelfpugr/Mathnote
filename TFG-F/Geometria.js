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

import {drawAngle, normalizeText} from './utils/utils.js'; 



const Geometria = () => {

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
  
    console.log("Dimension: ", dimensionMatch, normalizedText);
    console.log("Figura: ", figure);

    if (dimensionMatch && figure === null) {
      setMessage('Define primero la figura');
    }
    else if (figureRegex) {
      setFigure(figureRegex[4]);
    } else if (figure3DRegex) {
      setFigure(figure3DRegex[4]);
    } else if (angleRegex) {
      setFigure('ángulo');
      setAngleDegrees(angleRegex); // Actualiza el estado del ángulo
    } else if (dimensionMatch && figure ) {
      console.log("Dimension 2 ", dimensionMatch);
      const dimensionType = dimensionMatch[1].toLowerCase();
      const dimensionValue = dimensionMatch[2];

      switch (figure) {
        case 'cuadrado':
          if (dimensionType === 'lado') {
            setLado(dimensionValue);
            console.log("Lado: " + lado);
          } else if (dimensionType === 'area') {
            setArea(dimensionValue);
            console.log("Área: " + area);
          } else if (dimensionType === 'perimetro') {
            setPerimetro(dimensionValue);
            console.log("Perímetro: " + perimetro);
          }
          break; // Asegúrate de agregar un break para evitar que continúe al siguiente caso
  
        case 'triangulo':
          if (dimensionType === 'lado') {
            setLado(dimensionValue);
            console.log("Lado: " + lado);
          }else if (dimensionType === 'base') {
              setBase(dimensionValue);
              console.log("Base: " + base);
          }else if (dimensionType === 'altura') {
              setAltura(dimensionValue);
              console.log("Altura: " + altura);
            }else if (dimensionType === 'area') {
              setArea(dimensionValue);
              console.log("Área: " + area);
            } else if (dimensionType === 'perimetro') {
              setPerimetro(dimensionValue);
              console.log("Perímetro: " + perimetro);
            }
          break;
      
        case 'rectangulo':
          if (dimensionType === 'base') {
            setBase(dimensionValue);
            console.log("Base: " + base);
          } else if (dimensionType === 'altura') {
              setAltura(dimensionValue);
              console.log("Altura: " + altura);
            } else if (dimensionType === 'area') {
              setArea(dimensionValue);
              console.log("Área: " + area);
            } else if (dimensionType === 'perimetro') {
              setPerimetro(dimensionValue);
              console.log("Perímetro: " + perimetro);
            }
          break;

          case 'circulo':
            if (dimensionType === 'radio') {
              setRadio(dimensionValue);
              console.log("Radio: " + radio);
            } else if (dimensionType === 'diametro') {
              setDiametro(dimensionValue);
              console.log("Diámetro: " + diametro);
            } else if (dimensionType === 'circunferencia') {
              setPerimetro(dimensionValue);
              console.log("Circunferencia: " + perimetro);
            } else if (dimensionType === 'area') {
              setArea(dimensionValue);
              console.log("Área: " + area);
            }          
            break;
          

          case 'pentagono':
            if (dimensionType === 'lado') {
              setLado(dimensionValue);
              console.log("Lado: " + lado);
            }
            else if (dimensionType === 'altura') {
              setAltura(dimensionValue);
              console.log("Altura: " + altura);
            } else if (dimensionType === 'perimetro') {
              setPerimetro(dimensionValue);
              console.log("Perímetro: " + perimetro);
            } else if (dimensionType === 'area') {
              setArea(dimensionValue);
              console.log("Área: " + area);
            }
          break;

          case 'hexagono':
            if (dimensionType === 'lado') {
              setLado(dimensionValue);
              console.log("Lado: " + lado);
            }
            else if (dimensionType === 'altura') {
              setAltura(dimensionValue);
              console.log("Altura: " + altura);
            }
            else if (dimensionType === 'perimetro') {
              setPerimetro(dimensionValue);
              console.log("Perímetro: " + perimetro);
            } else if (dimensionType === 'area') {
              setArea(dimensionValue);
              console.log("Área: " + area);
            }
          break;
       
          case 'rombo':
            if (dimensionType === 'lado') {
              setLado(dimensionValue);
              console.log("Lado: " + lado);
            }
            if (dimensionType === 'diagonal mayor') {
              setDiagonalMayor(dimensionValue);
              console.log("Diagonal 1: " + diagonal2);
            }
            else if (dimensionType === 'diagonal menor') {
              setDiagonalMenor(dimensionValue);
              console.log("Diagonal 2: " + diagonal2);
            }
            else if (dimensionType === 'perimetro') {
              setPerimetro(dimensionValue);
              console.log("Perímetro: " + perimetro);
            } else if (dimensionType === 'area') {
              setArea(dimensionValue);
              console.log("Área: " + area);
            }
          break;
            case 'elipse':
              if (dimensionType === 'eje mayor') {
                setEjeMayor(dimensionValue);
                console.log("Eje Mayor: " + ejeMayor);
              }
              else if (dimensionType === 'eje menor') {
                setEjeMenor(dimensionValue);
                console.log("Eje Menor: " + ejeMenor);
              }
              else if (dimensionType === 'distancia focal') {
                setDistFocal(dimensionValue);
                console.log("distFocal: " + distFocal);
              }
              else if (dimensionType === 'radio') {
                setRadio(dimensionValue);
                console.log("Radio: " + radio);
              } else if (dimensionType === 'diametro') {
                setDiametro(dimensionValue);
                console.log("Diámetro: " + diametro);
              }
              break;
          case 'esfera':
            if (dimensionType === 'radio') {
              setRadio(dimensionValue);
              console.log("Radio: " + radio);
            }
            else if (dimensionType === 'diametro') {
              setDiametro(dimensionValue);
              console.log("Diámetro: " + diametro);
            }
            else if (dimensionType === 'area') {
              setArea(dimensionValue);
              console.log("Área: " + area);
            }
            else if (dimensionType === 'volumen') {
              setVolumen(dimensionValue);
              console.log("Volumen: " + volumen);
            }
            else if (dimensionType === 'circunferencia') {
              setCircunferencia(dimensionValue);
              console.log("Circunferencia: " + circunferencia);
            }
            break;
          case 'piramide':
            if (dimensionType === 'lado') {
              setLado(dimensionValue);
              console.log("Lado: " + lado);
            }
            else if (dimensionType === 'altura') {
              setAltura(dimensionValue);
              console.log("Altura: " + altura);
            }
            else if (dimensionType === 'apotema') {
              setApotema(dimensionValue);
              console.log("Apotema: " + apotema);
            }
            else if (dimensionType === 'area') {
              setArea(dimensionValue);
              console.log("Área: " + area);
            }
            else if (dimensionType === 'volumen') {
              setVolumen(dimensionValue);
              console.log("Volumen: " + volumen);
            }
            break;
            case 'cubo':
              if(dimensionType === 'lado') {
                setLado(dimensionValue);
                console.log("Lado: " + lado);
              }
              else if(dimensionType === 'area') {
                setArea(dimensionValue);
                console.log("Area: " + area);
              }
              else if(dimensionType === 'volumen') {
                setVolumen(dimensionValue);
                console.log("Volumen: " + volumen);
              }
              break;
            case 'cilindro':
              if(dimensionType === 'radio') {
                setRadio(dimensionValue);
                console.log("Radio: " + radio);
              }
              else if(dimensionType === 'altura') {
                setAltura(dimensionValue);
                console.log("Altura: " + altura);
              }
              else if(dimensionType === 'diametro') {
                setDiametro(dimensionValue);
                console.log("Diámetro: " + diametro);
              }
              else if(dimensionType === 'area') {
                setArea(dimensionValue);
                console.log("Área: " + area);
              }
              else if(dimensionType === 'volumen') {
                setVolumen(dimensionValue);
                console.log("Volumen: " + volumen);
              }
              else if(dimensionType === 'circunferencia') {
                setCircunferencia(dimensionValue);
                console.log("Circunferencia: " + circunferencia);
              }
              break;
            case 'cono':
              if(dimensionType === 'radio') {
                setRadio(dimensionValue);
                console.log("Radio: " + radio);
              }
              else if(dimensionType === 'altura') {
                setAltura(dimensionValue);
                console.log("Altura: " + altura);
              }
              else if(dimensionType === 'diametro') {
                setDiametro(dimensionValue);
                console.log("Diámetro: " + diametro);
              }
              else if(dimensionType === 'area') {
                setArea(dimensionValue);
                console.log("Área: " + area);
              }
              else if(dimensionType === 'volumen') {
                setVolumen(dimensionValue);
                console.log("Volumen: " + volumen);
              }
              break;
        }
      }
  };
  const renderIcon = () => {
    console.log("Figure: " + figure);
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
            {altura !== null && altura !== 0 && <Text style={styles.piramideText2}>{altura}</Text>}
            {altura !== null && altura !== 0 && <View style={styles.piramideredBar} />}
            {apotema !== null && apotema !== 0 && <Text style={styles.piramideText3}>{apotema}</Text>}
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
        console.log("Ángulo: " + angleDegrees);
        return drawAngle(angleDegrees); // Usa la función drawAngle
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.title]}>Geometría</Text>
      {message && <Text style={styles.messageText}>{message}</Text>}

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
    bottom: 50,
    justifyContent: 'center',
    padding: 10,
    borderRadius: 50,
  
  },
  messageText: {
    paddingBottom: 20,
    textAlign: 'justify',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'massallera',
  },
  dimensionText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    marginBottom: 0,
    fontFamily: 'massallera',
  },

  squareText: {
    bottom: 270,
    left: 145,
    fontSize: 24,
    fontWeight: '600',
    position: 'absolute',
    fontFamily: 'massallera',
    color: 'black',
  },

  cuboText: {
    bottom: 120,
    left: 8,
    fontSize: 24,
    fontWeight: '600',
    position: 'absolute',
    fontFamily: 'massallera',
    color: 'black',
  },

  pentagonText: {
    bottom: 80,
    left: 10,
    fontSize: 24,
    fontWeight: '600',
    position: 'absolute',
    fontFamily: 'massallera',
    color: 'black',
  },
  pentagonText2: {
    bottom: 80,
    left: 120,
    fontSize: 24,
    fontWeight: '600',
    position: 'absolute',
    fontFamily: 'massallera',
    color: 'black',
  },

  pentagonBar: {
    position: 'absolute',
    width: 2,
    height: '30%',
    backgroundColor: 'red',
    top: 153,
    left: '50%',
    transform: [{ translateX: -1 }],
  },
  hexagonBar: {
    position: 'absolute',
    width: 2,
    height: '30%',
    backgroundColor: 'red',
    top: 158,
    left: '50%',
    transform: [{ translateX: -1 }],
  },

  hexagonText: {
    bottom: 130,
    left: 10,
    fontSize: 24,
    fontWeight: '600',
    position: 'absolute',
    fontFamily: 'massallera',
    color: 'black',
  },

  romboText: {
    bottom: 220,
    left: 80,
    fontSize: 24,
    fontWeight: '600',
    position: 'absolute',
    fontFamily: 'massallera',
    color: 'black',
  },

  diagonalMayorText: {
    bottom: 110,
    left: 160,
    fontSize: 20,
    fontWeight: '600',
    position: 'absolute',
    fontFamily: 'massallera',
    color: 'red',
  },
  diagonalMayorBar: {
    position: 'absolute',
    width: 2,
    height: '54%',
    backgroundColor: 'red',
    top: 69,
    left: '50%',
    transform: [{ translateX: -1 }],
  },

  diagonalMenorText: {
    bottom: 160,
    left: 130,
    fontSize: 20,
    fontWeight: '600',
    position: 'absolute',
    fontFamily: 'massallera',
    color: 'blue',
  },
  diagonalMenorBar: {
    position: 'absolute',
    width: '39%',
    height: 2,
    backgroundColor: 'blue',
    top: 150,
    left: 22,
    transform: [{ translateX: 70}],
},

  point: {
    width: 10, // Ancho del punto
    height: 10, // Alto del punto
    borderRadius: 10, // Hace que el punto sea redondo
    backgroundColor: 'black', // Color del punto
    position: 'absolute', // Posicionamiento absoluto
  },
  point1: {
    top: 146, // Posición del primer punto
    left: 80,
  },
  point2: {
    top: 146, // Posición del segundo punto
    left: 210,
  },



ejeMayorText: {
  bottom: 100,
  left: 160,
  fontSize: 20,
  fontWeight: '600',
  position: 'absolute',
  fontFamily: 'massallera',
  color: 'red',
},
ejeMayorBar: {
  position: 'absolute',
  width: '67%',
  height: 2,
  backgroundColor: 'red',
  top: 150,
  left: '17%',
  transform: [{ translateX: -1 }],
},
ejeMenorText: {
  bottom: 170,
  left: 160,
  fontSize: 20,
  fontWeight: '600',
  position: 'absolute',
  fontFamily: 'massallera',
  color: 'blue',
},
ejeMenorBar: {
  position: 'absolute',
  width: 2,
  height: '52%',
  backgroundColor: 'blue',
  top: 70,
  left: '50%',
  transform: [{ translateX: -1 }],
},
distFocalText: {
  bottom: 100,
  left: 100,
  fontSize: 20,
  fontWeight: '600',
  position: 'absolute',
  fontFamily: 'massallera',
  color: 'green',
},
distFocalBar: {
  position: 'absolute',
  width: '43%',
  height: 3,
  backgroundColor: 'green',
  top: 150,
  left: '30%',
  transform: [{ translateX: -1 }],
},
  circleText: {
    bottom: 100,
    left: 135,
    fontSize: 24,
    fontWeight: '600',
    position: 'absolute',
    fontFamily: 'massallera',
    color: 'black',
  },

  circleText2: {
    bottom: 180,
    left: 190,
    fontSize: 24,
    fontWeight: '600',
    position: 'absolute',
    fontFamily: 'massallera',
    color: 'black',
  },

  esferaText: {
    bottom: 125,
    left: 100,
    fontSize: 15,
    fontWeight: '600',
    position: 'absolute',
    fontFamily: 'massallera',
    color: 'blue',
  },

  esferaBar: {
    position: 'absolute',
    width: '35%',
    height: 2,
    backgroundColor: 'blue',
    top: 150,
    left: '16%',
  },

  esferaBar2: {
    position: 'absolute',
    width: 2,
    height: '17%',
    backgroundColor: 'red',
    top: 124,
    left: '50%',
  },

  
  esferaText2: {
    bottom: 150,
    left: 160,
    fontSize: 15,
    fontWeight: '600',
    position: 'absolute',
    fontFamily: 'massallera',
    color: 'red',
  },

  cilindroText: {
    bottom: 70,
    left: 120,
    fontSize: 15,
    fontWeight: '600',
    position: 'absolute',
    fontFamily: 'massallera',
    color: 'blue',
  },

  
  cilindroText2: {
    bottom: 220,
    left: 120,
    fontSize: 15,
    fontWeight: '600',
    position: 'absolute',
    fontFamily: 'massallera',
    color: 'green',
  },

  cilindroText3: {
    bottom: 130,
    left: 160,
    fontSize: 15,
    fontWeight: '600',
    position: 'absolute',
    fontFamily: 'massallera',
    color: 'red',
  },


  cilindroBar: {
    position: 'absolute',
    width: '30%',
    height: 2,
    backgroundColor: 'blue',
    top: 225,
    left: '20%',
  },

  cilindroBar2: {
    position: 'absolute',
    width: '58%',
    height: 2,
    backgroundColor: 'green',
    top: 75,
    left: '21%',
  },

  cilindroBar3: {
    position: 'absolute',
    width: 2,
    height: '50%',
    backgroundColor: 'red',
    top: 77,
    left: '50%',
  },

  conoText: {
    bottom: 70,
    left: 120,
    fontSize: 15,
    fontWeight: '600',
    position: 'absolute',
    fontFamily: 'massallera',
    color: 'blue',
  },

  
  conoText2: {
    bottom: 47,
    left: 160,
    fontSize: 15,
    fontWeight: '600',
    position: 'absolute',
    fontFamily: 'massallera',
    color: 'green',
  },

  conoText3: {
    bottom: 130,
    left: 160,
    fontSize: 15,
    fontWeight: '600',
    position: 'absolute',
    fontFamily: 'massallera',
    color: 'red',
  },


  conoBar: {
    position: 'absolute',
    width: '67%',
    height: 2,
    backgroundColor: 'blue',
    top: 225,
    left: '16%',
  },

  conoBar2: {
    position: 'absolute',
    width: 2,
    height: '9%',
    backgroundColor: 'green',
    top: 225,
    left: '50%',
  },

  conoBar3: {
    position: 'absolute',
    width: 2,
    height: '55%',
    backgroundColor: 'red',
    top: 62,
    left: '50%',
  },



  rectangleText: {
    bottom: 220,
    left: 165,
    fontSize: 24,
    fontWeight: '600',
    position: 'absolute',
    fontFamily: 'massallera',
    color: 'black',
  },

  rectangleText2: {
    bottom: 100,
    left:10,
    fontSize: 24,
    fontWeight: '600',
    position: 'absolute',
    fontFamily: 'massallera',
    color: 'black',
  },
  squareText2: {
    top: 135,
    fontSize: 24,
    fontWeight: '600',
    position: 'absolute',
    fontFamily: 'massallera',
    color: 'black',
  },

  circleBar: {
    position: 'absolute',
    height: 2,
    width: '28%',
    backgroundColor: 'blue',
    top: '50%',
    left: 47,
    transform: [{ translateX: 32 }, { translateY: -1 }],
  },

  circleBar2: {
    position: 'absolute',
    height: '67%',
    width: 2,
    backgroundColor: 'red',
    top: 50,
    left: '50%',
},

  triangleContainer: {
    position: 'relative',
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rectangleContainer: {
    position: 'relative',
    width: 360,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },

  circleContainer: {
    position: 'relative',
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },

  redBar: {
    position: 'absolute',
    width: 2,
    height: '65%',
    backgroundColor: 'red',
    top: 58,
    left: '50%',
    transform: [{ translateX: -1 }],
  },
  triangleText: {
    fontFamily: 'Massallera',
    position: 'absolute',
    top: '40%',
    left: '30%',
    transform: [{ translateX: -50 }],
    fontSize: 24,
    color: 'black',
  },
  triangleBaseText: {
    fontFamily: 'Massallera',
    position: 'absolute',
    top: '95%',
    left: '65%',
    transform: [{ translateX: -50 }],
    fontSize: 24,
    color: 'black',
  },
  triangleAlturaText: {
    fontFamily: 'Massallera',
    position: 'absolute',
    top: '50%',
    left: '70%',
    transform: [{ translateX: -50 }],
    fontSize: 24,
    color: 'black',
  },

  piramideText: {
    bottom: 10,
    left: 50,
    fontSize: 24,
    fontWeight: '600',
    position: 'absolute',
    fontFamily: 'massallera',
    color: 'black',
  },
  piramideredBar: {
    position: 'absolute',
    width: 2,
    height: '55%',
    backgroundColor: 'red',
    top: 50,
    left: '50%',
    transform: [{ translateX: -1 }],
  },
  piramideText2: {
    bottom: 160,
    left: 220,
    fontSize: 24,
    fontWeight: '600',
    position: 'absolute',
    fontFamily: 'massallera',
    color: 'blue',
  },
  piramideredBar2: {
    position: 'absolute',
    width: 2,
    height: '35%',
    backgroundColor: 'blue',
    top: 80,
    left: '60.5%',
    transform: [{ translateX: -1 }, { rotate: '-20deg' }],
},

  piramideText3: {
    bottom: 55,
    left: 120,
    fontSize: 24,
    fontWeight: '600',
    position: 'absolute',
    fontFamily: 'massallera',
    color: 'red',
  },



  title: {
    top: 20,
    paddingTop: 30,
    paddingBottom: 10,
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