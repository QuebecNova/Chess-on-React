export function touch2Mouse(e: any): undefined {
    const theTouch = e.changedTouches[0]
    let mouseEv: string

    switch (e.type) {
        case 'touchstart':
            mouseEv = 'mousedown'
            break
        case 'touchend':
            mouseEv = 'mouseup'
            break
        case 'touchmove':
            mouseEv = 'mousemove'
            break
        default:
            return
    }

    const mouseEvent = document.createEvent('MouseEvent')
    mouseEvent.initMouseEvent(
        mouseEv,
        true,
        true,
        window,
        1,
        theTouch.screenX,
        theTouch.screenY,
        theTouch.clientX,
        theTouch.clientY,
        false,
        false,
        false,
        false,
        0,
        null
    )
    theTouch.target.dispatchEvent(mouseEvent)
}
