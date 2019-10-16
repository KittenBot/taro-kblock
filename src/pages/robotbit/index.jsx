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
      speed: [0,0,0,0],
      degree: [90,90,90,90,90,90,90,90]
    }
    this.bleWrite = this.bleWrite.bind(this);
    this.send = this.send.bind(this);
    this.onSetMotorSpeed = this.onSetMotorSpeed.bind(this);

    this.lineBuffer = '';
  }

  componentDidMount () { 
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
    this.send(`M21 ${idx+1} ${value} 3000\n`);
    const speed = this.state.speed;
    speed[idx] = value;
    this.setState({speed})
  }

  onSetServoDeg (idx, deg){
    console.log("servo", idx, deg)
    this.send(`M24 ${idx} ${deg} 0\n`);
    const degree = this.state.degree;
    degree[idx] = deg;
    this.setState({degree})
  }

  render () {
    const speed=this.state.speed;
    const degree=this.state.degree;

    return (
      <View className='page'>
        <AtMessage />
        <View className='page-item'>
          <View
            className='ble-goto-btn'
            onClick={this.handleGoBle.bind(this)}
          >{this.props.ble.connected ? `已连接${this.props.ble.connected.name}` : "请先连接蓝牙"}</View>
        </View>
        <View className='page-title'>马达控制</View>
        <View className='page-item'>
          <AtSlider min={-255} max={255} step={1} value={speed[0]} showValue onChange={e => this.onSetMotorSpeed(0, e.value)} />
          <AtSlider min={-255} max={255} step={1} value={speed[1]} showValue onChange={e => this.onSetMotorSpeed(1, e.value)} />
          <AtSlider min={-255} max={255} step={1} value={speed[2]} showValue onChange={e => this.onSetMotorSpeed(2, e.value)} />
          <AtSlider min={-255} max={255} step={1} value={speed[3]} showValue onChange={e => this.onSetMotorSpeed(3, e.value)} />
        </View>
        <View className='page-title'>舵机控制</View>
        <View className='page-item'>
          <AtSlider min={0} max={180} step={1} value={degree[0]} showValue onChange={e => this.onSetServoDeg(0, e.value)} />
          <AtSlider min={0} max={180} step={1} value={degree[1]} showValue onChange={e => this.onSetServoDeg(1, e.value)} />
          <AtSlider min={0} max={180} step={1} value={degree[2]} showValue onChange={e => this.onSetServoDeg(2, e.value)} />
          <AtSlider min={0} max={180} step={1} value={degree[3]} showValue onChange={e => this.onSetServoDeg(3, e.value)} />
          <AtSlider min={0} max={180} step={1} value={degree[4]} showValue onChange={e => this.onSetServoDeg(4, e.value)} />
          <AtSlider min={0} max={180} step={1} value={degree[5]} showValue onChange={e => this.onSetServoDeg(5, e.value)} />
          <AtSlider min={0} max={180} step={1} value={degree[6]} showValue onChange={e => this.onSetServoDeg(6, e.value)} />
          <AtSlider min={0} max={180} step={1} value={degree[7]} showValue onChange={e => this.onSetServoDeg(7, e.value)} />
        </View>

      </View>
    )
  }
}
export default RobotBitPage;
