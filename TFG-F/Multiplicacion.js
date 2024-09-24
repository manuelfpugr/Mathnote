

export const handleMultiplicacion = (
    resultAcarreo,
    resultMult,
    multiplicador,
    multiplicando,
    division,
    reinicioAcarreo,
    reinicioAcarreo2,
    reinicioAcarreo3,
    setAccarreo,
    setreinicioAcarreo,
    setreinicioAcarreo2,
    setreinicioAcarreo3,
    setFilasCompletas,
    inserciones,
    setInserciones,
    setResultado,
    setResultado2,
    setResultado3,
    filasCompletas
  ) => {
    let expectedResult = null;
    // Si las filas están completas y no hay división, procesamos la suma de multiplicación
    if(filasCompletas && division.length === 0){ {
        console.log("Suma de multiplicación");
        // Procesamos el texto de entrada para extraer la operación
        const lowerText = text.toLowerCase().replace(/[.,]$/, '').trim();
        console.log('Texto procesado:', lowerText);
        const regexOperacion = lowerText.match(/^\s*(\d+)\s*(?:\+|mas|más)\s*(\d+)\s*(?:igual\s*a|=|,|\s)?\s*(\d+)?\s*$/i);
        const regexNumerico = lowerText.match(/^(1[0-8]|[0-9])\.?$/);
        const regexPalabras = lowerText.match(/^(cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|trece|catorce|quince|dieciséis|diecisiete|dieciocho)\.?$/i);
         // Si se encuentra una operación de suma, extraemos el resultado
        if(regexOperacion){
          const result = parseInt(regexOperacion[3], 10);
        // Actualizamos el resultado en la variable expectedResult
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
        
    }
    // Si hay un resultado de acarreo, lo usamos para calcular el resultado esperado
    if (resultAcarreo) {
      console.log("Acarreo", resultAcarreo, division.length);
      expectedResult = resultAcarreo[1] ? parseInt(resultAcarreo[1], 10) : parseInt(resultAcarreo[2], 10);
    } else {
        // De lo contrario, usamos el resultado de la multiplicación
      expectedResult = parseInt(resultMult[3], 10);
    }
    console.log('Expresión Mult:', expectedResult, multiplicacion[3], multiplicador, multiplicando);
  
    let filasMultiplicacion = [];
    let filaActual = 0;  // Variable para rastrear la fila actual, comenzando en 0
    let numActual = 0;  // Variable para rastrear el número actual en la fila
  
    // Calculamos el número de filas y números por fila
    const numFilas = multiplicando.toString().length;  // Número de filas, máximo 3
    const numPorFila = multiplicador.toString().length;  // Cantidad de números por fila
  
    console.log("Multiplicador", multiplicador, "Multiplicando", multiplicando, "numFilas", numFilas, "numPorFilas", numPorFila);
    // Si hay un resultado esperado válido
    if (expectedResult !== null && expectedResult !== undefined) {
      // Aquí asumimos que el usuario inserta el número directamente
      const fila = expectedResult;  // El número que el usuario inserta
      filasMultiplicacion.push(fila);
      const numLength = fila.toString().length;  // Longitud del número actual
      numActual++; // Ajusta numActual según la longitud del número
  
      console.log("Num a insertar", expectedResult, numPorFila - 1, inserciones);
  
      // Solo cuando la fila actual esté completa, se moverá al resultado correspondiente
      if (inserciones.fila0 < numPorFila && inserciones.fila1 === 0) {
        if (expectedResult >= 10 && inserciones.fila0 === numPorFila - 1) {
          setResultado(prevResultado => [expectedResult, ...prevResultado]);
          setInserciones(prevInserciones => ({ ...prevInserciones, fila0: prevInserciones.fila0 + 1 }));
          console.log("Fila 0 Mod Final", filasMultiplicacion, resultado);
        } else if (expectedResult >= 10) {
          let expectedResultMod = expectedResult % 10;
          setResultado(prevResultado => [expectedResultMod, ...prevResultado]);
          setInserciones(prevInserciones => ({ ...prevInserciones, fila0: prevInserciones.fila0 + 1 }));
          console.log("Fila 0 Mod", filasMultiplicacion, resultado);
        } else {
          setResultado(prevResultado => [expectedResult, ...prevResultado]);
          setInserciones(prevInserciones => ({ ...prevInserciones, fila0: prevInserciones.fila0 + 1 }));
          console.log("Fila 0", filasMultiplicacion, resultado);
        }
        // Movemos al resultado correspondiente cuando una fila está completa
      } else if (inserciones.fila1 < numPorFila && inserciones.fila2 === 0) {
        if (expectedResult >= 10 && inserciones.fila1 === numPorFila - 1) {
          setResultado2(prevResultado => [expectedResult, ...prevResultado]);
          setInserciones(prevInserciones => ({ ...prevInserciones, fila1: prevInserciones.fila1 + 1 }));
          console.log("Fila 1 Mod Final", filasMultiplicacion, resultado);
        } else if (expectedResult >= 10 && inserciones.fila1 < numPorFila) {
          let expectedResultMod = expectedResult % 10;
          setResultado2(prevResultado => [expectedResultMod, ...prevResultado]);
          setInserciones(prevInserciones => ({ ...prevInserciones, fila1: prevInserciones.fila1 + 1 }));
          console.log("Fila 1 Mod", filasMultiplicacion, resultado);
        } else {
          setResultado2(prevResultado => [expectedResult, ...prevResultado]);
          setInserciones(prevInserciones => ({ ...prevInserciones, fila1: prevInserciones.fila1 + 1 }));
          console.log("Fila 1", filasMultiplicacion, resultado);
        }
        // Movemos al resultado correspondiente cuando una fila está completa
      } else if (inserciones.fila2 < numPorFila) {
        if (expectedResult >= 10 && inserciones.fila2 === numPorFila - 1) {
          setResultado3(prevResultado => [expectedResult, ...prevResultado]);
          setInserciones(prevInserciones => ({ ...prevInserciones, fila2: prevInserciones.fila2 + 1 }));
          console.log("Fila 2 Mod Final", filasMultiplicacion, resultado);
        } else if (expectedResult >= 10 && inserciones.fila2 < numPorFila) {
          let expectedResultMod = expectedResult % 10;
          setResultado3(prevResultado => [expectedResultMod, ...prevResultado]);
          setInserciones(prevInserciones => ({ ...prevInserciones, fila2: prevInserciones.fila2 + 1 }));
          console.log("Fila 2 Mod", filasMultiplicacion, resultado);
        } else {
          setResultado3(prevResultado => [expectedResult, ...prevResultado]);
          setInserciones(prevInserciones => ({ ...prevInserciones, fila2: prevInserciones.fila2 + 1 }));
          console.log("Fila 2", filasMultiplicacion, resultado);
        }
  
      }
  
      console.log("Inserciones", inserciones);
    // Reiniciamos las variables de acarreo y de control de filas cuando se completan
      if (inserciones.fila0 === numPorFila - 1 && !reinicioAcarreo) {
        setAccarreo([]);
        setreinicioAcarreo(true);
      } else if (inserciones.fila1 === numPorFila - 1 && !reinicioAcarreo2) {
        setAccarreo([]);
        setreinicioAcarreo2(true);
      } else if (inserciones.fila2 === numPorFila - 2 && !reinicioAcarreo3) {
        setAccarreo([]);
        setreinicioAcarreo3(true);
      }
      // Marcamos las filas como completas cuando se completan todas las filas de la multiplicación
      if (reinicioAcarreo === true && reinicioAcarreo2 === true) {
        setFilasCompletas(true);
      }
      console.log("Reinicios", reinicioAcarreo, reinicioAcarreo2, reinicioAcarreo3, filasCompletas);
    }
  }
}