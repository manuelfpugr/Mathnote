import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  containerCaptura: {
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
    color: 'black',
    right: 170,
    bottom: 0,
    fontSize: 30,
    fontFamily: 'massallera',
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
  },
  llevada2: {
    color: 'blue',
    right: 170,
    bottom: 0,
    fontSize: 30,
    fontFamily: 'massallera',
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
  },
  llevada3: {
    color: 'red',
    right: 160,
    bottom: 0,
    fontSize: 30,
    fontFamily: 'massallera',
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
  },
  llevada4: {
    color: 'red',
    right: 150,
    bottom: 0,
    fontSize: 30,
    fontFamily: 'massallera',
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
  },
  llevadaDiv: {
    color: 'red',
    right: 112,
    fontSize: 12,
    fontFamily: 'massallera',
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
    bottom: 10,
    fontWeight: 'bold',
    textAlign: 'right',
    width: 30,
    fontFamily: 'massallera',
  },
  operator: {
    bottom: 30,
    fontFamily: 'massallera',
    fontSize: 30,
    marginRight: 10,
    textAlign: 'left',
    width: 30,
  },
  divisorText: {
    top: 80,
    position: 'absolute',
    left: 190,
    fontFamily: 'massallera',
    fontSize: 30,
  },
  cocienteText: {
    top: 125,
    position: 'absolute',
    left: 185,
    fontFamily: 'massallera',
    fontSize: 30,
  },
  dividendoText: {
    top: 35,
    position: 'absolute',
    right: 40,
    fontWeight: 'bold',
    fontFamily: 'massallera',
    fontSize: 30,
  },
  procedimientoDiv: {
    top: 55,
    right: 108,
    fontFamily: 'massallera',
    fontSize: 30,
  },
  procedimientoDivLinea2: {
    top: 90,
    right: 85,
    fontFamily: 'massallera',
    fontSize: 30,
  },
  procedimientoDivLinea2_3Dig: {
    top: 90,
    right: 82,
    fontFamily: 'massallera',
    fontSize: 30,
  },
  procedimientoDivLinea2_4Dig: {
    top: 90,
    right: 105,
    fontFamily: 'massallera',
    fontSize: 30,
  },
  procedimientoDivLinea2_5Dig: {
    top: 90,
    right: 125,
    fontFamily: 'massallera',
    fontSize: 30,
  },

  procedimientoDivLinea3_3Dig: {
    top: 120,
    right: 82,
    fontFamily: 'massallera',
    fontSize: 30,
  },
  procedimientoDivLinea3_4Dig: {
    top: 120,
    right: 105,
    fontFamily: 'massallera',
    fontSize: 30,
  },
  procedimientoDivLinea3_5Dig: {
    top: 85,
    right: 105,
    fontFamily: 'massallera',
    fontSize: 30,
  },
 
  procedimientoDivLinea4_5Dig: {
    top: 70,
    right: 85,
    fontFamily: 'massallera',
    fontSize: 30,
  },
 
  spacingDividendo2: {
    right: 78,
  },

  spacingDividendo3: {
    right: 90,
  },

  spacingDividendo4: {
    right: 120,
  },

  spacingDividendo5: {
    right: 135,
  },

  spacing2: {
    right: 125,
  },
  procedimientoBajar2Dig: {
    top: 166,
    position: 'absolute',
    left: 110,
    fontFamily: 'massallera',
    fontSize: 30,
  },
  procedimientoBajar3Dig: {
    top: 166,
    position: 'absolute',
    left: 103,
    fontFamily: 'massallera',
    fontSize: 30,
  },
  procedimientoBajar4Dig: {
    top: 166,
    position: 'absolute',
    left: 83,
    fontFamily: 'massallera',
    fontSize: 30,
  },
  procedimientoBajar5Dig: {
    top: 165,
    position: 'absolute',
    left: 63,
    fontFamily: 'massallera',
    fontSize: 30,
  },
  procedimientoBajar2_4Dig: {
    top: 250,
    position: 'absolute',
    left:80,
    fontFamily: 'massallera',
    fontSize: 30,
  },
  procedimientoBajar2_5Dig: {
    top: 251,
    position: 'absolute',
    left: 85,
    fontFamily: 'massallera',
    fontSize: 30,
  },
  procedimientoBajar3_4Dig: {
    top: 250,
    position: 'absolute',
    left:80,
    fontFamily: 'massallera',
    fontSize: 30,
  },
  procedimientoBajar3_5Dig: {
    top: 336,
    position: 'absolute',
    left:110,
    fontFamily: 'massallera',
    fontSize: 30,
  },
  procedimientoRestar: {
    top: 165,
    position: 'absolute',
    left: 40,
    fontFamily: 'massallera',
    fontSize: 30,
  },
  procedimientoRestar3Dig: {
    top: 165,
    position: 'absolute',
    left: 60,
    fontFamily: 'massallera',
    fontSize: 30,
  },
  procedimientoRestar4Dig: {
    top: 165,
    position: 'absolute',
    left: 30,
    fontFamily: 'massallera',
    fontSize: 30,
  },
  procedimientoRestar5Dig: {
    top: 165,
    position: 'absolute',
    left:15,
    fontFamily: 'massallera',
    fontSize: 30,
  },
  procedimientoRestar2: {
    top: 50,
    right: 90,
    fontFamily: 'massallera',
    fontSize: 30,
  },
  procedimientoRestar2_3Dig: {
    top:90,
    right: 60 ,
    fontFamily: 'massallera',
    fontSize: 30,
  },

  procedimientoRestar2_4Dig: {
    top: 91,
    right: 59,
    fontFamily: 'massallera',
    fontSize: 30,
  },
  
  procedimientoRestar2_5Dig: {
    top: 91,
    right: 130,
    fontFamily: 'massallera',
    fontSize: 30,
  },
  procedimientoRestar3: {
    top: 50,
    right: 90,
    fontFamily: 'massallera',
    fontSize: 30,
  },

  procedimientoRestar3_4Dig: {
    top: 91,
    right: 59,
    fontFamily: 'massallera',
    fontSize: 30,
  },
  
  procedimientoRestar3_5Dig: {
    top: 80,
    right: 100,
    fontFamily: 'massallera',
    fontSize: 30,
  },

  procedimientoRestar4_5Dig: {
    top: 80,
    right: 85,
    fontFamily: 'massallera',
    fontSize: 30,
  },

  divBarBajar2Dig: {
    top: 155,
    height: 4,
    position: 'absolute',
    left: 80,
    backgroundColor: 'black',
    width: 50,
  },
  divBarBajar3Dig: {
    top: 155,
    height: 4,
    position: 'absolute',
    left: 60,
    backgroundColor: 'black',
    width: 50,
  },
  divBarBajar4Dig: {
    top: 155,
    height: 4,
    position: 'absolute',
    left: 30,
    backgroundColor: 'black',
    width: 50,
  },
  divBarBajar5Dig: {
    top: 155,
    height: 4,
    position: 'absolute',
    left: 10,
    backgroundColor: 'black',
    width: 70,
  },
  divBarBajar2: {
    top: 40,
    height: 4,
    right: 95,
    backgroundColor: 'black',
    width: 75,
  },
  divBarBajar2_3Dig: {
    top: 85,
    height: 4,
    right:80,
    backgroundColor: 'black',
    width: 75,
  },
  divBarBajar2_4Dig: {
    top: 85,
    height: 4,
    right:110,
    backgroundColor: 'black',
    width: 75,
  },
  divBarBajar2_5Dig: {
    top: 85,
    height: 4,
    right:120,
    backgroundColor: 'black',
    width: 75,
  },

  divBarBajar3_4Dig: {
    top: 75,
    height: 4,
    right:110,
    backgroundColor: 'black',
    width: 75,
  },
  divBarBajar3_5Dig: {
    top: 75,
    height: 4,
    right:100,
    backgroundColor: 'black',
    width: 75,
  },

  divBarBajar4_5Dig: {
    top: 70,
    height: 4,
    right:80,
    backgroundColor: 'black',
    width: 75,
  },

  dividendo2Dig1: {
    top: 30,
    position: 'absolute',
    width: '5%',
    right:70,
    height: 3,
    backgroundColor: 'red',
  },
  dividendo2Dig2: {
    top: 30,
    position: 'absolute',
    width: '10%',
    right: 50,
    height: 3,
    backgroundColor: 'red',
  },
 
  dividendo3Dig1: {
    top: 30,
    position: 'absolute',
    width: '5%',
    right: 130,
    height: 3,
    backgroundColor: 'red',
  },
  dividendo3Dig2: {
    top: 30,
    position: 'absolute',
    width: '10%',
    right: 78,
    height: 3,
    backgroundColor: 'red',
  },
  dividendo3Dig3: {
    top: 30,
    position: 'absolute',
    width: '15%',
    right: 55,
    height: 3,
    backgroundColor: 'red',
  },
  
  dividendo4Dig1: {
    top: 30,
    position: 'absolute',
    width: '5%',
    right: 125,
    height: 3,
    backgroundColor: 'red',
  },
  dividendo4Dig2: {
    top: 30,
    position: 'absolute',
    width: '10%',
    right: 105,
    height: 3,
    backgroundColor: 'red',
  },
  dividendo4Dig3: {
    top: 30,
    position: 'absolute',
    width: '15%',
    right: 80,
    height: 3,
    backgroundColor: 'red',
  },
  dividendo4Dig4: {
    top: 30,
    position: 'absolute',
    width: '24%',
    right: 50,
    height: 3,
    backgroundColor: 'red',
  },
  dividendo5Dig1: {
    top: 30,
    position: 'absolute',
    width: '5%',
    right: 145,
    height: 3,
    backgroundColor: 'red',
  },
  dividendo5Dig2: {
    top: 30,
    position: 'absolute',
    width: '10%',
    right: 120,
    height: 3,
    backgroundColor: 'red',
  },
  dividendo5Dig3: {
    top: 30,
    position: 'absolute',
    width: '15%',
    right: 100,
    height: 3,
    backgroundColor: 'red',
  },
  dividerDiv: {
    top: 107,
    height: 4,
    position: 'absolute',
    left: 178,
    backgroundColor: 'black',
    width: 120,
    marginVertical: 10,
  },
  divider: {
    bottom: 30,
    height: 4,
    paddingLeft: 60,
    backgroundColor: 'black',
    width: 150,
    marginVertical: 10,
  },
  dividerMult: {
    bottom: 60,
    height: 4,
    paddingLeft: 60,
    backgroundColor: 'black',
    width: 150,
    marginVertical: 10,
  },
  dividerDiv2: {
    transform: 'rotate(90deg)',
    position: 'absolute',
    top: 84,
    bottom: 12,
    height: 4,
    left: 152,
    backgroundColor: 'black',
    width: 50,
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
    width: 180,
  },
  result2: {
    height: 60,
    bottom: 40,
    marginRight: 70,
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'massallera',
    textAlign: 'right',
    width: 180,
  },
  result3: {
    height: 60,
    bottom: 50,
    marginRight: 140,
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'massallera',
    textAlign: 'right',
    width: 180,
  },
  result4: {
    height: 60,
    bottom: 60,
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'massallera',
    textAlign: 'right',
    width: 200,
  },
});

export default styles;