declare module '*.module.css'

declare module '*.svg' {
    const content: SVGElement
    export default content
}

declare module '*.wav' {
    const content: string
    export default content
}
