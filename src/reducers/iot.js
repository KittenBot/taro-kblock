
const IOT_SET_CLIENT = 'IOT_SET_CLIENT'

const INITIAL_STATE = {
  client: null
}

function reducer (state = INITIAL_STATE, action){
  switch (action.type) {
    case IOT_SET_CLIENT:
      return {
        ...state,
        client: action.client
      }
    default:
      return state
  }
}

const iotSetClient = (client) => {
  return {
    type: IOT_SET_CLIENT,
    client
  }
}

export {
  reducer as default,
  iotSetClient

}