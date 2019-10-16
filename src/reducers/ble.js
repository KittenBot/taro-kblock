const BLE_SET_DEVS = 'BLE_SET_DEVS'
const BLE_SCAN = 'BLE_SCAN'
const BLE_CONNECTED = 'BLE_CONNECTED'
const BLE_DISCONNECT = 'BLE_DISCONNECT'
const BLE_CHAR_WRITE = 'BLE_CHAR_WRITE'
const BLE_CHAR_READ = 'BLE_CHAR_READ'

const INITIAL_STATE = {
  isScanning: false,
  devices: {
  },
  connected: null,
  charWrite: null,
  charRead: null
}

function counter (state = INITIAL_STATE, action) {
  switch (action.type) {
    case BLE_SCAN:
      return {
        ...state,
        isScanning: action.scanning
      }
    case BLE_SET_DEVS:
      return {
        ...state,
        devices: action.devices
      }
    case BLE_CONNECTED:
      return {
        ...state,
        connected: action.dev
      }
    case BLE_DISCONNECT:
        return {
          ...state,
          connected: null,
          charWrite: null,
          charRead: null
        }
    case BLE_CHAR_WRITE:
      return {
        ...state,
        charWrite: action.char
      }
    case BLE_CHAR_READ:
      return {
        ...state,
        charRead: action.char
      }
    default:
      return state
  }
}


const bleScan = (state) => {
  return {
    type: BLE_SCAN,
    scanning: state
  }
}

const setDevices = (devices) => {
  return {
    type: BLE_SET_DEVS,
    devices: devices
  }
}

const bleConnected = (dev) => {
  if (!dev){
    return {type: BLE_DISCONNECT}
  }
  return {
    type: BLE_CONNECTED,
    dev: dev
  }
}

const bleCharWrite = (char) => {
  return {
    type: BLE_CHAR_WRITE,
    char
  }
}

const bleCharRead= (char) => {
  return {
    type: BLE_CHAR_READ,
    char
  }
}


export {
  counter as default,
  bleScan,
  setDevices,
  bleConnected,
  bleCharWrite,
  bleCharRead
}