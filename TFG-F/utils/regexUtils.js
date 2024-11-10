
 const regexUtils = {

    // Regular expressionns for geometric figures
    geometricFigureRegex: /\b(dibuj(a|o|ar)?\s*(un|una)?\s*(cuadrado|triangulo|rectangulo|circulo|pentagono|hexagono|rombo|paralelogramo|elipse))\b/i,
    geometric3DFigureRegex: /\b(dibuj(a|o|ar)?\s*(un|una)?\s*(esfera|cubo|cilindro|cono|piramide|prisma hexagonal|prisma rectangular|tetraedro|octaedro))\b/i,
    angleRegex: /\b(?:dibuja\s+)?un\s*angulo\s*de\s*(\d+)\s*grados?\b/i,
    dimensionRegex : /\b(volumen|apotema|lado|altura|base|area|perimetro|distancia focal|eje mayor|eje menor|diagonal mayor|diagonal menor|circunferencia|diametro|radio)\s*igual\s*a\s*(\d+)\b/i,


    // Regular expressions for operations
    operationRegex: /(\d+)\s*(menos|más|\+|\-|\x|por)\s*(\d+(\s*(menos|más|\+|\-|\x|por)\s*\d+)*)/,
    resultMatchRegex: /^\s*([\d\smenos-]+)\s*(?:igual\s*a|=|,|\s)?\s*(\d+)\s*$/i,
    resultMultRegex: /^\s*([\d\s]+)\s*(?:por|x)\s*(\d+)\s*(?:igual\s*a|=|,|\s)?\s*(\d+)?\s*\.?\s*$/i,
    accarreoRegex: /(me llevo|subo) (uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)\.?/i,
    resultAcarreoRegex: /(?:\d+\s*(?:por|x)\s*\d+\s*,?\s*\d+\s*y\s*(?:uno|una|1|2|3|4|5|6|7|8|9)\s*,?\s*(\d+))|(?:\d+\s*(?:por|x)\s*\d+\s*es\s*\d+\s*y\s*(?:uno|una|1|2|3|4|5|6|7|8|9)\s*es\s*(\d+))/i,
  
    // Regular expressions for division
    divisionRegex : /\b(\d{1,3}(?:\.\d{3})*|\d+)\s*(entre|dividido\s+entre)\s*(\d{1,3}(?:\.\d{3})*|\d+)\b/i,
    cogerNumeroRegex: /(coj[oa]s?|cog[oa]s?|cog[oi][ae]?s?|cog[oi][ae]?|coge|cojo)\s*(uno|un|dos|tres|cuatro|cinco|\d+)/i,
    divisionProc1Regex: /^\s*(\d+)\s*(por|x)\s*(\d+)\s*(igual\s*a|es|son)?\s*(\d+)\s*\.\s*$/i,
    divisionProcAcarreoRegex: /^\s*(\d+|cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s*(por|x)\s*(\d+|cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s*,\s*(\d+)\s*(más|y)\s*(uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s*(\d+)\s*$/,
    divisionProc2Regex: /(\d+)\s*(entre|\/|dividido\s*entre)\s*(\d+)\s*(igual\s*a|es|son|,)?\s*(\d+)?/i,
    divisionProc3Regex: /\bpongo\s(un\s)?((\d|cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)(,\s)?)+\b/i,
    procedimientoBajarRegex: /\b(bajo|bajar)\s+(un|el\s+)?(número\s+)?(0|1|2|3|4|5|6|7|8|9|cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)\b/gi,
    procedimientoRestaRegex: /\b(\d+|cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s*(menos|-)\s*(\d+|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s*(igual\s*a|es|son)?\s*,?\s*(\d+|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\b/gi,    
    procedimientoResta2Regex: /^\s*(zero|cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|0|1|2|3|4|5|6|7|8|9)[.,!?]?\s*$/i,
    comaRegex: /\b(?:coma|añado una coma|pongo una coma|añado una coma después del \d+)\b/gi,
    resultRegex: /(\d+\s*(?:más|menos|\+|\-)\s*)+\d+\s*igual\s*a\s*(\d+)/i,

    guardarOperacionRegex: /\b(quiero\s+guardar\s+la\s+operación|guardar\s+la\s+operación|guardar)\b/i,

    matchDimension(text) {
        return match = text.match(this.dimensionRegex);

    },

    matchAngle(text) {
        const match = text.match(this.angleRegex);
        if (match) {
          return match[1];
      }
    },

    matchGeometricFigure(text) {
        return text.match(this.geometricFigureRegex);
    },

    matchGeometric3DFigure(text) {
        return text.match(this.geometric3DFigureRegex);
    },
    
    matchGuardarOperacion(text) {
        return text.match(this.guardarOperacionRegex);
    },
    matchMultipleSum(text){
        return text.match(this.resultRegex);
    },
    // Methods to use the regular expressions
    matchMultipleNumbersAndOperators(text) {
        return text.match(this.operationRegex);
    },
    matchResult(text) {
        return text.match(this.resultMatchRegex);
    },
    matchMultiplicationResult(text) {
        return text.match(this.resultMultRegex);
    },
    matchAcarreo(text) {
        return text.match(this.accarreoRegex);
    },
    matchAcarreoResult(text) {
        return text.match(this.resultAcarreoRegex);
    },
    matchDivision(text) {
        return text.match(this.divisionRegex);
    },
    matchNumber(text) {
        return text.match(this.cogerNumeroRegex);
    },
    matchDivisionProcedure1(text) {
        return text.match(this.divisionProc1Regex);
    },
    matchDivisionProcedureAcarreo(text) {
        return text.match(this.divisionProcAcarreoRegex);
    },
    matchDivisionProcedure2(text) {
        return text.match(this.divisionProc2Regex);
    },
    matchDivisionProcedure3(text) {
        return text.match(this.divisionProc3Regex);
    },
    matchLoweringProcedure(text) {
        return text.match(this.procedimientoBajarRegex);
    },
    matchSubtractionProcedure(text) {
        return text.match(this.procedimientoRestaRegex);
    },
    matchSubtractionProcedure2(text) {
        return text.match(this.procedimientoResta2Regex);
    },
    matchDecimalComma(text) {
        return text.match(this.comaRegex);
    }
};

export default regexUtils;