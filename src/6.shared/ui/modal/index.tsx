import { CloseButton, Dialog, Portal } from '@chakra-ui/react'
import { ReactNode } from 'react'

export function Modal({
    trigger,
    title,
    body,
    bodyProps,
    footer,
    onClose = () => {},
    ...props
}: {
    trigger: ReactNode
    title?: ReactNode
    body?: ReactNode
    bodyProps?: Dialog.BodyProps
    footer?: ReactNode
    onClose?: () => void
} & Omit<Dialog.RootProps, 'children'>) {
    return (
        <Dialog.Root placement="center" {...props}>
            <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
            <Portal>
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
            </Portal>
        </Dialog.Root>
    )
}
