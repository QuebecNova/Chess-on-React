import { Operators } from 'src/6.shared/model'

interface IPosNumber {
    [key: string]: number
}

interface IPosString {
    [key: number]: string
}

export interface IAlphs {
    posIn: IPosNumber
    posOut: IPosString

    changeAlphPos: (
        field: string,
        letterOperator: Operators,
        num: number,
        numericOperator?: Operators,
        secondNum?: number
    ) => string

    changeNumPos: (field: string, operator: Operators, num: number) => string

    getNum: (field: string) => number
    getAlph: (field: string) => string
}
