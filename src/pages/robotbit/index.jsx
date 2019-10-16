import Taro from '@tarojs/taro'
import { View, Picker, PickerView, PickerViewColumn, Image } from '@tarojs/components'
import { AtButton, AtSlider, AtInput, AtSwitch, AtMessage } from 'taro-ui'
import { connect } from '@tarojs/redux'

import {str2ab} from '../../utils/util.js';

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
class RobotBitPage extends Taro.Component {
  config = {
    navigationBarTitleText: 'Robot:Bit'
  }

  constructor (){
    super(...arguments)
    this.state = {
      isButtonNotify: false,
      btnValue: 0,
      gesValue: 0,
      touchValue: 0,
      accX: 0,
      accY: 0,
      accZ: 0,
    }
    this.bleWrite = this.bleWrite.bind(this);
    this.send = this.send.bind(this);
    this.onSetMotorSpeed = this.onSetMotorSpeed.bind(this);

    this.lineBuffer = '';
  }


  bleWrite (str){
    console.log("ble write", str);
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
  }

  onSetMotorSpeed (idx, value){
    console.log("motor", idx, value)
  }

  onSetServoDeg (idx, deg){
    console.log("servo", idx, deg)
  }

  render () {
    return (
      <View className='page'>
        <AtMessage />
        <View className='page-item'>
          {this.props.ble.connected ? <View>
            已连接{this.props.ble.connected.name}
          </View> : <View
            className='ble-goto-btn'
            onClick={this.handleGoBle.bind(this)}
          >请先连接蓝牙</View>}
        </View>
        <View className='page-title'>马达控制</View>
        <View className='page-item'>
          <AtSlider min={-255} max={255} step={1} showValue onChange={e => this.onSetMotorSpeed(0, e.value)} />
          <AtSlider min={-255} max={255} step={1} showValue onChange={e => this.onSetMotorSpeed(1, e.value)} />
          <AtSlider min={-255} max={255} step={1} showValue onChange={e => this.onSetMotorSpeed(2, e.value)} />
          <AtSlider min={-255} max={255} step={1} showValue onChange={e => this.onSetMotorSpeed(3, e.value)} />
        </View>
        <View className='page-title'>舵机控制</View>
        <View className='page-item'>
          <AtSlider min={0} max={180} step={1} showValue onChange={e => this.onSetServoDeg(0, e.value)} />
          <AtSlider min={0} max={180} step={1} showValue onChange={e => this.onSetServoDeg(1, e.value)} />
          <AtSlider min={0} max={180} step={1} showValue onChange={e => this.onSetServoDeg(2, e.value)} />
          <AtSlider min={0} max={180} step={1} showValue onChange={e => this.onSetServoDeg(3, e.value)} />
          <AtSlider min={0} max={180} step={1} showValue onChange={e => this.onSetServoDeg(4, e.value)} />
          <AtSlider min={0} max={180} step={1} showValue onChange={e => this.onSetServoDeg(5, e.value)} />
          <AtSlider min={0} max={180} step={1} showValue onChange={e => this.onSetServoDeg(6, e.value)} />
          <AtSlider min={0} max={180} step={1} showValue onChange={e => this.onSetServoDeg(7, e.value)} />
        </View>

      </View>
    )
  }
}
export default RobotBitPage;
