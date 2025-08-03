'use client'

import { Flex } from '@chakra-ui/react'
import { OnSettingsChange } from 'src/4.features/model'
import ChooseTimerSettings from '../timer/ChooseTimerSettings'
import DefineSide from './DefineSide'

export default function StartingSettings({
    onSettingsChange,
}: {
    onSettingsChange: OnSettingsChange
}) {
    return (
        <Flex flexDirection="column" gap="8">
            <ChooseTimerSettings onSettingsChange={onSettingsChange} />
            <Flex justifyContent="center">
                <DefineSide onSettingsChange={onSettingsChange} />
            </Flex>
        </Flex>
    )
}
