import isEven from "src/6.shared/lib/helpers/math/even"

function defineColor
    (index: number, row: number): string {
        if (isEven(index) && isEven(row)) {
            return 'blackField'
        } else if (!isEven(index) && isEven(row)) {
            return 'whiteField'
        } else if (isEven(index) && !isEven(row)) {
            return 'whiteField'
        } else {
            return 'blackField'
        }
    }

export default defineColor