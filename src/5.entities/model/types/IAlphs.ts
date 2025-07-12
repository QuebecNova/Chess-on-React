import { Operators } from 'src/6.shared/model/constants/board'

interface IPosNumber {
    [key: string]: number
}

interface IPosString {
    [key: number]: String
}

export default interface IAlphs {
    posIn: IPosNumber
    posOut: IPosString

    changeAlphPos: (
        field: string,
        letterOperator: Operators,
        num: number,
        numericOperator?: Operators,
        secondNum?: number
    ) => string
}
