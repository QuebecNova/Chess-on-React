import { CloseButton, Dialog, Portal, Show } from '@chakra-ui/react'
import { ReactNode } from 'react'

export function Modal({
    trigger,
    title,
    body,
    bodyProps,
    footer,
    onClose = () => {},
    onSubmit = () => {},
    ...props
}: {
    trigger?: ReactNode
    title?: ReactNode
    body?: ReactNode
    bodyProps?: Dialog.BodyProps
    footer?: ReactNode
    onClose?: () => void
    onSubmit?: () => void
} & Omit<Dialog.RootProps, 'children'>) {
    return (
        <Dialog.Root
            placement="center"
            onInteractOutside={onClose}
            onEscapeKeyDown={onClose}
            {...props}
        >
            <Show when={trigger}>
                <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
            </Show>
            <Portal>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        onSubmit()
                    }}
                >
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>{title}</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body {...bodyProps}>{body}</Dialog.Body>
                            <Dialog.Footer>{footer}</Dialog.Footer>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" onClick={onClose} />
                            </Dialog.CloseTrigger>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </form>
            </Portal>
        </Dialog.Root>
    )
}
