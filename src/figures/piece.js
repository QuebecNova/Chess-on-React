export default class Piece {
    constructor(color, img, type) {
        this.color = color
        this.img = img
        this.type = type
    }

    canMove() {
        throw new Error('no avialibale moves')
    }
}