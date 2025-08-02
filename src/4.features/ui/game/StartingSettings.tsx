'use client'

import { Flex } from '@chakra-ui/react'
import ChooseTimerSettings from '../timer/ChooseTimerSettings'
import DefineSide from './DefineSide'

export default function StartingSettings() {
    return (
        <Flex flexDirection="column" gap="8">
            <ChooseTimerSettings />
            <Flex justifyContent="center">
                <DefineSide />
            </Flex>
        </Flex>
    )
}
