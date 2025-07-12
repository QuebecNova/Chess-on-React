import isEven from 'src/6.shared/lib/helpers/math/even'
import { Fields } from 'src/6.shared/model/constants/board'

function defineColor(index: number, row: number): string {
    if (isEven(index) && isEven(row)) {
        return Fields.BlackField
    } else if (!isEven(index) && isEven(row)) {
        return Fields.WhiteField
    } else if (isEven(index) && !isEven(row)) {
        return Fields.WhiteField
    } else {
        return Fields.BlackField
    }
}

export default defineColor
