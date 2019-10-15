
const BLE_SCAN = 'BLE_SCAN'

const INITIAL_STATE = {
  isScanning: false,
  devices: [
    {
      name: "test",
      uuid: 12345
    }
  ],
  connectedDev: null
}

function counter (state = INITIAL_STATE, action) {
  switch (action.type) {
    case BLE_SCAN:
      return {
        ...state,
        isScanning: action.scanning
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

export {
  counter as default,
  bleScan,
}