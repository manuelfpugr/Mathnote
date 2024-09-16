
 const regexUtils = {
    // Regular expressions for operations
    operationRegex: /(\d+)\s*(menos|más|\+|\-|\x|por)\s*(\d+(\s*(menos|más|\+|\-|\x|por)\s*\d+)*)/,
    resultMatchRegex: /^\s*([\d\smenos-]+)\s*(?:igual\s*a|=|,|\s)?\s*(\d+)\s*$/i,
    resultMultRegex: /^\s*([\d\s]+)\s*(?:por|x)\s*(\d+)\s*(?:igual\s*a|=|,|\s)?\s*(\d+)?\s*\.?\s*$/i,
    accarreoRegex: /(me llevo|subo) (uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)\.?/i,
    resultAcarreoRegex: /(?:\d+\s*(?:por|x)\s*\d+\s*,?\s*\d+\s*y\s*(?:uno|una|1|2|3|4|5|6|7|8|9)\s*,?\s*(\d+))|(?:\d+\s*(?:por|x)\s*\d+\s*es\s*\d+\s*y\s*(?:uno|una|1|2|3|4|5|6|7|8|9)\s*es\s*(\d+))/i,
  
    // Regular expressions for division
    divisionRegex: /\b(\d{1,3}(?:\.\d{3})*|\d+)\s*(entre|dividido\s+entre)\s*(\d{1,3}(?:\.\d{3})*|\d+)\b/i,
    cogerNumeroRegex: /(coj[oa]s?|cog[oa]s?|cog[oi][ae]?s?|cog[oi][ae]?|coge|cojo)\s*(uno|un|dos|tres|\d+)/i,
    divisionProc1Regex: /^\s*(\d+)\s*(por|x)\s*(\d+)\s*(igual\s*a|es|son)?\s*(\d+)\s*\.\s*$/i,
    divisionProcAcarreoRegex: /^\s*(\d+|cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s*(por|x|más|menos|dividido|entre)\s*(\d+|cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s*(es|son)?\s*(\d+)\s*(más|y)?\s*(uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)?\s*(es|son)?\s*(\d+)?\s*$/i,
    divisionProc2Regex: /(\d+)\s*(entre|\/|dividido\s*entre)\s*(\d+)\s*(igual\s*a|es|son|,)?\s*(\d+)?/i,
    divisionProc3Regex: /\bpongo\s(un\s)?((\d|cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)(,\s)?)+\b/i,
    procedimientoBajarRegex: /\b(bajo|bajar)\s+(un|el\s+)?(número\s+)?(0|1|2|3|4|5|6|7|8|9|cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)\b/gi,
    procedimientoRestaRegex: /\b(\d+|cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s*(menos|-)\s*(\d+|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s*(igual\s*a|es|son)?\s*(\d+|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)?\b/gi,
    procedimientoResta2Regex: /^\s*(zero|cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|0|1|2|3|4|5|6|7|8|9)[.,!?]?\s*$/i,
    comaRegex: /\b(?:coma|añado una coma|pongo una coma|añado una coma después del \d+)\b/gi,

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