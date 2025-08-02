import { Keyable } from 'src/5.entities/model'
import { FieldStates, ValueOf } from 'src/6.shared/model'

export type ActiveFields = Keyable<ValueOf<FieldStates> | null>
