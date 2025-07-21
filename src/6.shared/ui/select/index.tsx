import { Select as ChakraSelect, createListCollection } from '@chakra-ui/react'
import { ReactNode } from 'react'

export default function Select({
    placeholder,
    items,
    label,
    ...props
}: {
    label?: ReactNode
    placeholder?: string
    items: { value: string; label: string }[]
} & ChakraSelect.RootProps) {
    const collection = createListCollection({ items })
    return (
        <ChakraSelect.Root collection={collection} variant="subtle" {...props}>
            <ChakraSelect.HiddenSelect />
            {label && <ChakraSelect.Label>{label}</ChakraSelect.Label>}
            <ChakraSelect.Control>
                <ChakraSelect.Trigger>
                    <ChakraSelect.ValueText placeholder={placeholder} />
                </ChakraSelect.Trigger>
                <ChakraSelect.IndicatorGroup>
                    <ChakraSelect.Indicator />
                </ChakraSelect.IndicatorGroup>
            </ChakraSelect.Control>
            <ChakraSelect.Positioner>
                <ChakraSelect.Content>
                    {collection?.items.map(
                        (item: { value: string; label: string }) => (
                            <ChakraSelect.Item item={item} key={item.value}>
                                {item.label}
                                <ChakraSelect.ItemIndicator />
                            </ChakraSelect.Item>
                        )
                    )}
                </ChakraSelect.Content>
            </ChakraSelect.Positioner>
        </ChakraSelect.Root>
    )
}
