import { Text } from '@chakra-ui/react'

export default function DateTimeDisplay({ value }: { value: number }) {
    return <Text>{(value + 100).toString().substr(1)}</Text>
}
