interface Ieven {
    isEven: (num : number) => boolean,
    defineColor: (index : number, row : number) => string
}

const even : Ieven = {

    isEven(num) {
        return num % 2 === 0
    },
    
    defineColor(index, row) {
        if (even.isEven(index) && even.isEven(row)) {
            return 'blackField'
        } else if (!even.isEven(index) && even.isEven(row)) {
            return 'whiteField'
        } else if (even.isEven(index) && !even.isEven(row)) {
            return 'whiteField'
        } else {
            return 'blackField'
        }
    }
}


export default even