import { FieldStates, ValueOf } from 'src/6.shared/model'

export interface ActiveFields {
    [key: string]: ValueOf<FieldStates> | null
}
