import { Box, Slider as ChakraSlider, Editable, HStack } from '@chakra-ui/react'
import { ReactNode, useState } from 'react'

type Props = {
    marks?: ChakraSlider.MarksProps['marks']
    label?: ReactNode
    onValueChange?: (value: number) => void
    onValueChangeEnd?: (value: number) => void
} & ChakraSlider.RootProps

export default function Slider(props: Props) {
    const [value, setValue] = useState([1])

    function onValueChange({ value }: { value: number[] }) {
        setValue(value)
        props.onValueChange && props.onValueChange(value[0])
    }

    return (
        <ChakraSlider.Root
            {...props}
            value={value}
            onValueChange={onValueChange}
            onValueChangeEnd={(e: { value: number[] }) =>
                props.onValueChangeEnd && props.onValueChangeEnd(e.value[0])
            }
        >
            {props.label && (
                <HStack justify="space-between">
                    <ChakraSlider.Label>{props.label}</ChakraSlider.Label>
                    <Box maxW="20">
                        <Editable.Root
                            value={value[0].toString()}
                            onValueChange={(e: { value: string }) => {
                                if (
                                    (props.max &&
                                        parseFloat(e.value) > props.max) ||
                                    (props.min &&
                                        parseFloat(e.value) < props.min)
                                )
                                    return
                                const stepMultiplier =
                                    props.step === 0.5 ? 2 : 1
                                setValue([
                                    Math.round(
                                        parseFloat(e.value) * stepMultiplier
                                    ) / stepMultiplier || props.min,
                                ])
                            }}
                        >
                            <Editable.Preview />
                            <Editable.Input />
                        </Editable.Root>
                    </Box>
                </HStack>
            )}
            <ChakraSlider.Control>
                <ChakraSlider.Track>
                    <ChakraSlider.Range />
                </ChakraSlider.Track>
                <ChakraSlider.Thumbs />
                {props.marks && <ChakraSlider.Marks marks={props.marks} />}
            </ChakraSlider.Control>
        </ChakraSlider.Root>
    )
}
