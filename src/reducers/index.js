import { combineReducers } from 'redux'
import ble from './ble'
import iot from './iot'

export default combineReducers({
  ble,
  iot
})
