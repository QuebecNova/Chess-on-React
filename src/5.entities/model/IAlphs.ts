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
        operator: string,
        num: number,
        secondOperator?: string,
        secondNum?: number
    ) => string
}
