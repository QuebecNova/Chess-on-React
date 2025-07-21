import { Field, Flex, SegmentGroup } from '@chakra-ui/react'

export default function BotDifficulty(props: Field.RootProps) {
    return (
        <Field.Root {...props}>
            <Field.Label w="100%" justifyContent="center">
                Computer difficulty
            </Field.Label>
            <Flex w="100%" justifyContent="center">
                <SegmentGroup.Root justifyContent="center" defaultValue="1">
                    <SegmentGroup.Indicator />
                    <SegmentGroup.Items
                        items={['1', '2', '3', '4', '5', '6', '7', '8']}
                    />
                </SegmentGroup.Root>
            </Flex>
        </Field.Root>
    )
}
