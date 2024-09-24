// Division.js

// Importar las funciones necesarias
import { setPrimerDigitoDivisor, setDivision, setCociente, setProcedimientoRestar, setProcedimientoRestar2, setProcedimientoDiv, setProcedimientoDivLinea2, setProcedimientoDivLinea3, setProcedimientoBajar } from './Aritmetica'; // Ajusta la ruta según sea necesario
import { removeDots, extractFirstNumber, numberWords } from './utils'; // Ajusta la ruta según sea necesario

export function processDivision(division, div, coma, procedimientoResta, procedimientoResta2, procedimientoBajar, divisionProc1, divisionProc2, divisionProc3, divisionProcAcarreo, resultAcarreo, procedimientoDivLinea2, procedimientoDivLinea3, primerDigitoDivisor, cociente) {
  if (division && division.length === 0) {
    console.log("División", div);

    const divisor = div[3];
    console.log("Divisor", divisor, divisor.toString()[0]);
    console.log("bb", primerDigitoDivisor);
    setPrimerDigitoDivisor(divisor.toString()[0]);
    console.log("AA");
    // Si hay coincidencias, extraemos los dividendos y divisores
    const resultados = div.map(division => {
      // Usamos un regex adicional para extraer dividendo y divisor
      const partes = division.match(/\b(\d{1,3}(?:\.\d{3})*|\d+)\s*(entre|dividido\s+entre)\s*(\d{1,3}(?:\.\d{3})*|\d+)\b/i);
      if (partes) {
        return {
          dividendo: removeDots(partes[1]),  // Convertir dividendo eliminando puntos
          divisor: removeDots(partes[3])     // Convertir divisor eliminando puntos
        };
      }
    }).filter(result => result !== null); // Filtrar resultados nulos
    setDivision(resultados);
    
    console.log("DIV", division, primerDigitoDivisor);
  } else if (coma) {
    console.log("Coma");
    setCociente(prevResultado => [...prevResultado, ","]);
    setProcedimientoRestar(prevResultado => [...prevResultado, 0]);
  } else if (procedimientoResta || procedimientoResta2) {
    console.log("Resta de la división", procedimientoResta, procedimientoResta2);

    if (procedimientoResta) {
      // Asegurarse de que procedimientoResta es un array
      if (Array.isArray(procedimientoResta) && procedimientoResta.length > 0) {
        const ultimaCoincidencia = procedimientoResta[procedimientoResta.length - 1];
        const partes = ultimaCoincidencia.match(/\b(\d+|cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\b/gi);
        const ultimoNumero = partes[partes.length - 1];
      
        // Convertirlo a un número entero (opcional)
        const ultimoNumeroInt = parseInt(ultimoNumero, 10);
        console.log("Resta de la división", ultimoNumeroInt);
        if (procedimientoDivLinea2.length === 0) {
          setProcedimientoRestar(prevResultado => [ultimoNumeroInt, ...prevResultado]);
        } else {
          setProcedimientoRestar2(prevResultado => [ultimoNumeroInt, ...prevResultado]);
        }
      } else {
        console.error("procedimientoResta no es un array o está vacío");
      }
    } else if (procedimientoResta2) {
      const lowerText = procedimientoResta2[1].toLowerCase().replace(/[.,]$/, '').trim();
      console.log("Resta de la división 2", lowerText);
      if (numberWords.hasOwnProperty(lowerText)) {
        let number = numberWords[lowerText];
        console.log(number);
        if (procedimientoRestar.length === 0) {
          setProcedimientoRestar(prevResultado => [number, ...prevResultado]);
          console.log("Añadido ", procedimientoRestar);
        } else {
          setProcedimientoRestar2(prevResultado => [number, ...prevResultado]);
          console.log("Añadido Línea 2 ", procedimientoRestar2);
        }
      } else {
        if (procedimientoRestar.length === 0) {
          setProcedimientoRestar(prevResultado => [procedimientoResta2[1], ...prevResultado]);
        } else {
          setProcedimientoRestar2(prevResultado => [procedimientoResta2[1], ...prevResultado]);
        }
      }
    }
  } else if (procedimientoBajar) {
    const partes = procedimientoBajar[0].match(/\b(bajo|bajar)\s+(el\s+)?(número\s+)?(0|1|2|3|4|5|6|7|8|9|cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)\b/i);
    let number = partes[4];
    console.log("Activa bajar");
    if (numberWords.hasOwnProperty(number)) {
      number = numberWords[number];
    }
    console.log("Baja el número", number);
    setProcedimientoBajar(number);
  } else {
    console.log("Division Lleno");
    console.log("Procedimiento", divisionProc1, divisionProc2);

    console.log("Primer Dig", primerDigitoDivisor);

    if (divisionProc3) {
      console.log("Cociente numero 3", divisionProc3[2]);
      setCociente(prevResultado => [...prevResultado, divisionProc3[2]]);
    } else if (divisionProc2) {
      console.log("Cociente numero 2", divisionProc2[2]);
    } else if (divisionProcAcarreo || resultAcarreo) {
      let result = 0;
      console.log("ACCAREREO", divisionProcAcarreo, resultAcarreo);

      if (divisionProcAcarreo !== null && divisionProcAcarreo !== undefined && divisionProcAcarreo.length > 0) {
        let divisionProcAcarreoDiv = divisionProcAcarreo[0];
        console.log("Acarreo Div", divisionProcAcarreoDiv);            
        const results = extractFirstNumber(divisionProcAcarreoDiv);
        console.log("Primer digito divisor 0/", results[0], primerDigitoDivisor);
      } else if (resultAcarreo !== null && resultAcarreo !== undefined && resultAcarreo.length > 0) {
        let resultAcarreoDiv = resultAcarreo[0];
        console.log("Acarreo Div", resultAcarreoDiv);            
        const results = extractFirstNumber(resultAcarreoDiv);
        console.log("Primer digito divisor 1/", results[0], primerDigitoDivisor);

        if (results !== primerDigitoDivisor) {
          console.log("Primer digito divisor con acarreo", results, primerDigitoDivisor);

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
    } else if (divisionProc1) {
      if (divisionProc1[1] !== primerDigitoDivisor) {
        console.log("Primer digito divisor", divisionProc1, primerDigitoDivisor);
        divisionProc1[5] = divisionProc1[5] % 10;
      }

      if (procedimientoRestar.length === 0) {
        console.log("Cociente numero Mult", divisionProc1[5]);

        if (cociente.length === 0) {
          setCociente(divisionProc1[3]);
          setProcedimientoDiv(prevResultado => [divisionProc1[5], ...prevResultado]);
        } else {
          setProcedimientoDiv(prevResultado => [divisionProc1[5], ...prevResultado]);
        }
      } else if (procedimientoDivLinea3.length === 0) {
        console.log("ENTRA", cociente.length);
        if (cociente.includes(',') && cociente.length === 2) {
          console.log("Cociente", cociente.length);
          setCociente(prevResultado => [...prevResultado, divisionProc1[3]]);
          console.log("Cociente numero Mult Segunda Linea", divisionProc1[5]);
          setProcedimientoDivLinea2(prevResultado => [divisionProc1[5], ...prevResultado]);
        } else if (cociente.length === 1 && !cociente.includes(',')) {
          console.log("Cociente numero Mult Segunda Linea Pr", divisionProc1[5]);
          setCociente(prevResultado => [...prevResultado, divisionProc1[3]]);
          setProcedimientoDivLinea2(prevResultado => [divisionProc1[5], ...prevResultado]);
        } else {
          setProcedimientoDivLinea2(prevResultado => [divisionProc1[5], ...prevResultado]);
        }
      }
    }
  }
}