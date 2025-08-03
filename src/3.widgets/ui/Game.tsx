import { Grid, GridItem } from '@chakra-ui/react'
import { Board } from 'src/4.features/ui'
import { SideMenu } from './SideMenu'

export default function Game({ disabled }: { disabled: boolean }) {
    return (
        <Grid templateColumns="repeat(3, 1fr)">
            <GridItem />
            <GridItem>
                <Board disabled={disabled} />
            </GridItem>
            <GridItem>
                <SideMenu />
            </GridItem>
        </Grid>
    )
}
