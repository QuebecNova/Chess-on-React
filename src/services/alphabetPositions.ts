interface IPosNumber {
    [key: string] : number
}

interface IPosString {
    [key: number] : String
}

interface IAlphs {
    posIn: IPosNumber,
    posOut: IPosString,
    
    changeAlphPos: 
        (
        field : string, 
        operator : string, 
        num : number, secondOperator? : 
        string, secondNum? : number
        ) => string
}

const alphs : IAlphs = {
    posIn: {
        'a': 1,
        'b': 2,
        'c': 3,
        'd': 4,
        'e': 5,
        'f': 6,
        'g': 7,
        'h': 8
    },
    
    posOut: {
        1: 'a',
        2: 'b',
        3: 'c',
        4: 'd',
        5: 'e',
        6: 'f',
        7: 'g',
        8: 'h',
    },

    changeAlphPos(field, operator, num, secondOperator = '', secondNum = 0) {
        //here we taking field like 'e4' and using passed operators 'increment or decrement' first letter (e)
        //yea, letters based notation of board complicated and we can use 0-63 notation, but bad boys don't following easy ways
        if (!field || !operator || !num) throw new Error ('missing argument(s)')

        if (operator === '+' && !secondOperator) {
            return this.posOut[this.posIn[field[0]] + num] + field[1]
        } else if (operator === '-' && !secondOperator) {
            return this.posOut[this.posIn[field[0]] - num] + field[1]
        } else if (operator !== '+' && operator !== '-') {
            throw new Error('not a valid operator')
        }

        if (!secondOperator || !secondNum) return

        if (operator === '+' && secondOperator === '+') {
            return this.posOut[this.posIn[field[0]] + num] + (parseInt(field[1]) + secondNum)
        } else if (operator === '-' && secondOperator === '+') {
            return this.posOut[this.posIn[field[0]] - num] + (parseInt(field[1]) + secondNum)
        } else if (operator === '+' && secondOperator === '-') {
            return this.posOut[this.posIn[field[0]] + num] + (parseInt(field[1]) - secondNum)
        } else if (operator === '-' && secondOperator === '-') {
            return this.posOut[this.posIn[field[0]] - num] + (parseInt(field[1]) - secondNum)
        } else if (secondOperator !== '+' && secondOperator !== '-') {
            throw new Error('not a valid operator')
        }
    }
}


export default alphs;