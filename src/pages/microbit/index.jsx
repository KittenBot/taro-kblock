import Taro from '@tarojs/taro'
import { View, Picker, PickerView, PickerViewColumn, Image } from '@tarojs/components'
import { AtButton, AtGrid, AtInput, AtSwitch, AtMessage } from 'taro-ui'
import { connect } from '@tarojs/redux'

import {str2ab} from '../../utils/util.js';

import './index.scss'
import { bleScan, bleConnected } from '../../reducers/ble'

import ledon from '../../assets/images/ledon.png'
import ledoff from '../../assets/images/ledoff.png'


const pixelImage = {
  HEART: `
. # . # .
# # # # #
# # # # #
. # # # .
. . # . .`,

  HEART_SMALL: `
. . . . .
. # . # .
. # # # .
. . # . .
. . . . .`,
  // FACES
  HAPPY: `
. . . . .
. # . # .
. . . . .
# . . . #
. # # # .`,
  SAD: `
. . . . .
. # . # .
. . . . .
. # # # .
# . . . #`,
  CONFUSED: `
. . . . .
. # . # .
. . . . .
. # . # .
# . # . #`,
  ANGRY: `
# . . . #
. # . # .
. . . . .
# # # # #
# . # . #`,
  ASLEEP: `
. . . . .
# # . # #
. . . . .
. # # # .
. . . . .`,
  SURPRISED: `
. # . # .
. . . . .
. . # . .
. # . # .
. . # . .`,
  SILLY: `
# . . . #
. . . . .
# # # # #
. . . # #
. . . # #`,
  FABULOUS: `
# # # # #
# # . # #
. . . . .
. # . # .
. # # # .`,
  MEH: `
# # . # #
. . . . .
. . . # .
. . # . .
. # . . .`,
  YES: `
. . . . .
. . . . #
. . . # .
# . # . .
. # . . .`,
  NO: `
# . . . #
. # . # .
. . # . .
. # . # .
# . . . #`,
  TRIANGLE: `
. . . . .
. . # . .
. # . # .
# # # # #
. . . . .`,
  LEFTTRIANGLE: `
# . . . .
# # . . .
# . # . .
# . . # .
# # # # #`,
  CHESSBOARD: `
. # . # .
# . # . #
. # . # .
# . # . #
. # . # .`,
  DIAMOND: `
. . # . .
. # . # .
# . . . #
. # . # .
. . # . .`,
  DIAMOND_SMALL: `
. . . . .
. . # . .
. # . # .
. . # . .
. . . . .`,
  SQUARE: `
# # # # #
# . . . #
# . . . #
# . . . #
# # # # #`,
  SQUARE_SMALL: `
. . . . .
. # # # .
. # . # .
. # # # .
. . . . .`,

  SCISSORS: `
# # . . #
# # . # .
. . # . .
# # . # .
# # . . #`,
  // THE FOLLOWING IMAGES WERE DESIGNED BY ABBIE BROOKS.
  TSHIRT: `
# # . # #
# # # # #
. # # # .
. # # # .
. # # # .`,
  ROLLERSKATE: `
. . . # #
. . . # #
# # # # #
# # # # #
. # . # .`,
  DUCK: `
. # # . .
# # # . .
. # # # #
. # # # .
. . . . .`,
  HOUSE: `
. . # . .
. # # # .
# # # # #
. # # # .
. # . # .`,
  TORTOISE: `
. . . . .
. # # # .
# # # # #
. # . # .
. . . . .`,
  BUTTERFLY: `
# # . # #
# # # # #
. . # . .
# # # # #
# # . # #`,
  STICKFIGURE: `
. . # . .
# # # # #
. . # . .
. # . # .
# . . . #`,
  GHOST: `
. # # # .
# . # . #
# # # # #
# # # # #
# . # . #`,
  SWORD: `
. . # . .
. . # . .
. . # . .
. # # # .
. . # . .`,
  GIRAFFE: `
# # . . .
. # . . .
. # . . .
. # # # .
. # . # .`,
  SKULL: `
. # # # .
# . # . #
# # # # #
. # # # .
. # # # .`,
  UMBRELLA: `
. # # # .
# # # # #
. . # . .
# . # . .
# # # . .`,
  SNAKE: `
# # . . .
# # . # #
. # . # .
. # # # .
. . . . .`,
  // ANIMALS
  RABBIT: `
# . # . .
# . # . .
# # # # .
# # . # .
# # # # .`,
  COW: `
# . . . #
# . . . #
# # # # #
. # # # .
. . # . .`,
  // MUSICAL NOTES
  QUARTERNOTE: `
. . # . .
. . # . .
. . # . .
# # # . .
# # # . .`,
  EIGHTNOTE: `
. . # . .
. . # # .
. . # . #
# # # . .
# # # . .`,
  // OTHER ICONS
  PITCHFORK: `
# . # . #
# . # . #
# # # # #
. . # . .
. . # . .`,
  TARGET: `
. . # . .
. # # # .
# # . # #
. # # # .
. . # . .`,
  DEFAULT: `
. . . . .
. . . . .
. . . . .
. . . . .
. . . . .
`
};

const btnEnum = ['None', 'A', 'B', 'A+B']
const gesMenu = ['up', 'down', 'left', 'right', 'face up', 'face down', 'freefall', '3g', '6g', '8g', 'shake'];
const noteFreq = ['261','294','327','348','392','436','490','523'];

function matStr2ary (mat){
  return mat.trim().replace(/\n/g, '').replace(/ /g, '').replace(/#/g, '1');
}

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
class MicroBitPage extends Taro.Component {
  config = {
    navigationBarTitleText: 'Micro:Bit'
  }

  constructor (){
    super(...arguments)
    this.state = {
      matrix: matStr2ary(pixelImage.HEART).split(''),
      images: Object.keys(pixelImage),
      matText: '',
      isButtonNotify: true,
      btnValue: 0,
      gesValue: 0,
      touchValue: 0,
      accX: 0,
      accY: 0,
      accZ: 0,
    }
    this.onSendNote = this.onSendNote.bind(this);
    this.bleWrite = this.bleWrite.bind(this);
    this.send = this.send.bind(this);

    this.lineBuffer = '';
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

  onChangeMatText (value) {
    this.setState({
      matText: value
    })
    // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
    return value
  }

  handleGoBle (){
    Taro.navigateTo({
      url: `/pages/bleconn/index`
    })
  }

  onLedToggle (e, idx){
    const mat = this.state.matrix;
    if (mat[idx] === '1'){
      mat[idx] = '0';
    } else {
      mat[idx] = '1'
    }
    this.setState({matrix: mat})
    this.send(`M2 ${mat.join('')}\n`);
  }

  onPickLedImg (e){
    const idx = e.detail.value;
    const img = pixelImage[this.state.images[idx]];
    const mat = matStr2ary(img).split('');
    this.setState({
      matrix: mat,
    })
    this.send(`M2 ${mat.join('')}\n`);
  }

  onSendText (){
    this.send(`M1 ${this.state.matText}\n`);
  }

  onToggleButtonNotify (){
    this.setState({
      isButtonNotify: !this.state.isButtonNotify
    })
  }

  onSendNote (note){
    const freq = noteFreq[note]
    this.send(`M11 ${freq} 500\n`);
  }

  render () {
    // map matrix str to at grid info
    let gridInfo = [];
    for (let m of this.state.matrix){
      gridInfo.push(m == '1' ? {image: ledon} : {image: ledoff});
    }
    

    return (
      <View className='page'>
        <AtMessage />
        <View className='page-item'>
          <View
            className='ble-goto-btn'
            onClick={this.handleGoBle.bind(this)}
          >{this.props.ble.connected ? `已连接${this.props.ble.connected.name}` : "请先连接蓝牙"}</View>
        </View>
        <View className='page-title'>矩阵屏幕</View>
        <View className='page-item'>
          <View className='led-wrap'>
            <AtGrid columnNum={5} data={gridInfo} onClick={this.onLedToggle.bind(this)} />
          </View>
        </View>
        <View className='page-title'>显示图案</View>
        <View className='page-item'>
          <Picker mode='selector' range={this.state.images} onChange={this.onPickLedImg.bind(this)}>
            <View className='demo-list-item'>
              <View className='demo-list-item__label'>点我打开图案列表</View>
            </View>
          </Picker>
        </View>
        <View className='page-title'>显示文字</View>
        <AtInput
          clear
          className='page-item'
          title='文字'
          type='text'
          maxLength='10'
          placeholder='abcd'
          value={this.state.matText}
          onChange={this.onChangeMatText.bind(this)}
        >
          <AtButton type='secondary' circle={true} size='normal' onClick={this.onSendText.bind(this)}>发送</AtButton>
        </AtInput>
        <View className='page-title'>读取按键</View>
        <AtSwitch className='page-item' title='打开按键提示' checked={this.state.isButtonNotify} onChange={this.onToggleButtonNotify.bind(this)} />
        <View className='page-title'>播放音符</View>
        <View className='note-btns'>
          <AtButton size='small' circle onClick={()=>this.onSendNote(0)}>Do</AtButton>
          <AtButton size='small' circle onClick={()=>this.onSendNote(1)}>Re</AtButton>
          <AtButton size='small' circle onClick={()=>this.onSendNote(2)}>Mi</AtButton>
          <AtButton size='small' circle onClick={()=>this.onSendNote(3)}>Fa</AtButton>
          <AtButton size='small' circle onClick={()=>this.onSendNote(4)}>So</AtButton>
          <AtButton size='small' circle onClick={()=>this.onSendNote(5)}>Ra</AtButton>
          <AtButton size='small' circle onClick={()=>this.onSendNote(6)}>Xi</AtButton>
        </View>
        <View className='page-title'>读取陀螺仪</View>
        <View className='page-item'>
          <View className='imu-txt'>{`姿态: ${gesMenu[this.state.gesValue - 1]}`}</View>
          <View className='imu-txt'>{`X:${this.state.accX} Y:${this.state.accY} Z:${this.state.accZ}`}</View>
        </View>
        
      </View>
    )
  }
}
export default MicroBitPage;