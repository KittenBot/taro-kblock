import Taro from '@tarojs/taro'
import { View, Picker, PickerView, PickerViewColumn, Image } from '@tarojs/components'
import { AtButton, AtGrid, AtInput } from 'taro-ui'
import { connect } from '@tarojs/redux'

import './index.scss'
import { bleScan } from '../../reducers/ble'

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


function matStr2ary (mat){
  return mat.trim().replace(/\n/g, '').replace(/ /g, '').replace(/#/g, '1');
}

@connect(({ ble }) => ({
  ble
}), (dispatch) => ({
  bleScan (state) {
    console.log("ble scan", state)
    dispatch(bleScan(state))
  }
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
      matText: ''
    }
  }

  handlePickerChange (e) {
    this.setState({
      selectorValue: e.detail.value
    })
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
  }

  onPickLedImg (e){
    const idx = e.detail.value;
    const img = pixelImage[this.state.images[idx]];
    this.setState({
      matrix: matStr2ary(img).split(''),
    })

  }

  onSendText (){
    console.log("send text", this.state.matText)
  }

  render () {
    // map matrix str to at grid info
    let gridInfo = [];
    for (let m of this.state.matrix){
      gridInfo.push(m == '1' ? {image: ledon} : {image: ledoff});
    }
    

    return (
      <View className='page'>
        <View className='page-item'>
          {this.props.ble.connected ? <View>
            已连接{this.props.ble.connected.name}
          </View> : <View
            className='ble-goto-btn'
            onClick={this.handleGoBle.bind(this)}
          >请先连接蓝牙</View>}
        </View>
        <View className='page-title'>矩阵屏幕:{this.props.ble.isScanning}</View>
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
        <View className='page-item'>
          <AtInput
            clear
            title='文字'
            type='text'
            maxLength='10'
            placeholder='abcd'
            value={this.state.matText}
            onChange={this.onChangeMatText.bind(this)}
          >
            <AtButton type='secondary' circle={true} size='normal' onClick={this.onSendText.bind(this)}>发送</AtButton>
          </AtInput>
        </View>
        <View className='page-title'>读取按键</View>
        <View className='page-title'>读取陀螺仪</View>
        <View className='page-title'>播放音符</View>
      </View>
    )
  }
}
export default MicroBitPage;