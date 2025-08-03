import { Operators } from 'src/6.shared/model'
import { IAlphs } from '../model'

export const alphs: IAlphs = {
    posIn: {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5,
        f: 6,
        g: 7,
        h: 8,
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

    changeAlphPos(
        field,
        letterOperator,
        num,
        numericOperator = '',
        secondNum = 0
    ) {
        //here we taking field like 'e4' and using passed operators 'increment or decrement' to first letter (e) and second number (4)
        //yea, letters based notation of board complicated and we can use 0-63 notation, but bad boys ain't going the easy ways
        if (!field || !letterOperator || !num)
            throw new Error('missing argument(s)')

        let modifiedField: string

        if (letterOperator === Operators.Forward && !numericOperator) {
            modifiedField = this.posOut[this.posIn[field[0]] + num] + field[1]
        } else if (letterOperator === Operators.Backward && !numericOperator) {
            modifiedField = this.posOut[this.posIn[field[0]] - num] + field[1]
        } else if (
            letterOperator !== Operators.Forward &&
            letterOperator !== Operators.Backward
        ) {
            throw new Error('not a valid letter operator')
        }

        if (!numericOperator || !secondNum) return modifiedField

        if (
            letterOperator === Operators.Forward &&
            numericOperator === Operators.Forward
        ) {
            modifiedField =
                this.posOut[this.posIn[field[0]] + num] +
                (parseInt(field[1]) + secondNum)
        } else if (
            letterOperator === Operators.Backward &&
            numericOperator === Operators.Forward
        ) {
            modifiedField =
                this.posOut[this.posIn[field[0]] - num] +
                (parseInt(field[1]) + secondNum)
        } else if (
            letterOperator === Operators.Forward &&
            numericOperator === Operators.Backward
        ) {
            modifiedField =
                this.posOut[this.posIn[field[0]] + num] +
                (parseInt(field[1]) - secondNum)
        } else if (
            letterOperator === Operators.Backward &&
            numericOperator === Operators.Backward
        ) {
            modifiedField =
                this.posOut[this.posIn[field[0]] - num] +
                (parseInt(field[1]) - secondNum)
        } else if (
            numericOperator !== Operators.Forward &&
            numericOperator !== Operators.Backward
        ) {
            throw new Error('not a valid numberic operator')
        }

        return modifiedField ? modifiedField : ''
    },

    changeNumPos(field: string, operator: Operators, num: number): string {
        if (operator === Operators.Forward) {
            return field[0] + (parseInt(field[1]) + num)
        }
        if (operator === Operators.Backward) {
            return field[0] + (parseInt(field[1]) - num)
        }
    },

    getNum(field: string) {
        return parseInt(field.at(-1))
    },

    getAlph(field: string) {
        return field[0]
    },
} as const
