import { Field, Flex, SegmentGroup } from '@chakra-ui/react'
import { StockfishDifficultyLevels } from 'src/5.entities/lib'

export default function BotDifficulty({
    fieldProps,
    ...props
}: { fieldProps?: Field.RootProps } & SegmentGroup.RootProps) {
    return (
        <Field.Root {...fieldProps}>
            <Field.Label w="100%" justifyContent="center">
                Computer difficulty
            </Field.Label>
            <Flex w="100%" justifyContent="center">
                <SegmentGroup.Root
                    {...props}
                    justifyContent="center"
                    defaultValue="1"
                >
                    <SegmentGroup.Indicator />
                    <SegmentGroup.Items
                        items={Object.keys(StockfishDifficultyLevels)}
                    />
                </SegmentGroup.Root>
            </Flex>
        </Field.Root>
    )
}
