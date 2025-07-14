export function scrollToBottom(element: HTMLDivElement | null): void {
    if (!element) return
    element.scrollIntoView(false)
}
