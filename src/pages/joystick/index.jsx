import Taro from '@tarojs/taro'
import { View, Picker, PickerView, PickerViewColumn, Image,WebView } from '@tarojs/components'
import { AtButton, AtGrid, AtInput, AtSwitch, AtMessage } from 'taro-ui'
import { connect } from '@tarojs/redux'

import './index.scss'
import { bleScan, bleConnected } from '../../reducers/ble'


@connect(({ ble }) => ({
  ble
}), (dispatch) => ({
  bleScan (state) {
    console.log("ble scan", state)
    dispatch(bleScan(state))
  },
  bleConnected (dev){
    dispatch(bleConnected(dev))
  },
}))
class JoystickPage extends Taro.Component {
  config = {
    navigationBarTitleText: 'Joystick'
  }

  constructor (){
    super(...arguments)
    this.state = {

    }

  }

  componentDidMount () { 
    Taro.onBLECharacteristicValueChange((characteristic) => {
      // const v = new Uint8Array(characteristic.value);
      const v = new Uint8Array(characteristic.value);
      const dataStr = String.fromCharCode.apply(null, v);
      this.lineBuffer += dataStr;
      if (this.lineBuffer.indexOf('\n') !== -1){
        const lines = this.lineBuffer.split('\n')
        this.lineBuffer = lines.pop();
        for (const l of lines){
          // console.log(">>", l);
          if (l.startsWith('@')){
            let tmp = l.trim().split(' ')
            tmp = tmp.filter(n => n !== '');
            const btnValue = parseInt(tmp[1], 10);

            if (btnValue !== 0 && btnValue !== this.state.btnValue && this.state.isButtonNotify){
              Taro.atMessage({
                'message': `按键 ${btnEnum[btnValue]}按下`,
                'type': 'info',
              })
            }

            this.setState({
              btnValue: btnValue,
              gesValue: parseInt(tmp[2], 10),
              touchValue: parseInt(tmp[3], 10),
              accX: parseInt(tmp[4], 10),
              accY: parseInt(tmp[5], 10),
              accZ: parseInt(tmp[6], 10),
            })
          }
        }
      }
    })

    Taro.onBLEConnectionStateChange(res => {
      // 该方法回调中可以用于处理连接意外断开等异常情况
      // console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
      if (this.props.ble.connected && this.props.ble.connected.deviceId == res.deviceId && !res.connected){
        Taro.atMessage({
          'message': '蓝牙连接断开',
          'type': 'warning',
        })
        this.props.bleConnected(null);
      }
    })
  }

  componentWillUnmount () { 
    // if (this.props.ble.connected){
    //   console.log("close ble", this.props.ble.connected.deviceId);
    //   Taro.closeBLEConnection({
    //     deviceId: this.props.ble.connected.deviceId
    //   }).then(ret => {
    //     this.props.bleConnected(null);
    //     Taro.closeBluetoothAdapter()
    //   })
    // }
  }

  bleWrite (str){
    // console.log("ble write", str);
    const data = str2ab(str);
    const wc = this.props.ble.charWrite;
    if (wc){
      Taro.writeBLECharacteristicValue({
        deviceId: wc.deviceId,
        serviceId: wc.serviceId,
        characteristicId: wc.characteristicId,
        value: data
      })
    } else {
      Taro.atMessage({
        'message': '请先连接Microbit蓝牙',
        'type': 'error',
      })
    }
  }

  send (data){
    data.match(/(.|[\r\n]){1,20}/g).map(c => this.bleWrite(c));
  }

  handleGoBle (){
    Taro.navigateTo({
      url: `/pages/bleconn/index`
    })
  }

  render () {
    return (
      <View className='page'>
        <AtMessage />
        <View className='page-item'>
          <View
            className='ble-goto-btn'
            onClick={this.handleGoBle.bind(this)}
          >{this.props.ble.connected ? `已连接${this.props.ble.connected.name}` : "请先连接蓝牙"}</View>
        </View>
        <AtButton type='primary'>position: absolute;
        transform: rotate(90deg);</AtButton>
        
        
      </View>
    )
  }
}
export default JoystickPage;






