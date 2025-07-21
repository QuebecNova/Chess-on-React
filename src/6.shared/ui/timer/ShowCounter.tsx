import { Flex, Text } from '@chakra-ui/react'
import { useEffect } from 'react'
import { getParsedTime } from 'src/6.shared/lib/helpers'
import { sounds } from 'src/6.shared/model'
import DateTimeDisplay from './DateTimeDisplay'

type CounterProps = {
    timer: number
}

export default function ShowCounter({ timer }: CounterProps) {
    const [hours, minutes, seconds] = getParsedTime(timer)

    const secondsLow = timer / 1000 < 30

    useEffect(() => {
        if (secondsLow) sounds.timeExpiring.play()
    }, [secondsLow])

    if (hours > 0)
        return (
            <Flex>
                <DateTimeDisplay value={hours} />
                <Text>:</Text>
                <DateTimeDisplay value={minutes} />
                <Text>:</Text>
                <DateTimeDisplay value={seconds} />
            </Flex>
        )

    const timeExpired = timer <= 0

    if (!timeExpired)
        return (
            <Flex>
                <DateTimeDisplay value={minutes} />
                <Text>:</Text>
                <DateTimeDisplay value={seconds} />
            </Flex>
        )

    if (timeExpired)
        return (
            <Flex>
                <DateTimeDisplay value={0} />
                <Text>:</Text>
                <DateTimeDisplay value={0} />
            </Flex>
        )
}
