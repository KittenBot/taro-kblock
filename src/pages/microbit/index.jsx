import Taro from '@tarojs/taro'
import { View, Picker, PickerView, PickerViewColumn, Image } from '@tarojs/components'
import { AtButton, AtGrid, AtInput } from 'taro-ui'
import { connect } from '@tarojs/redux'

import './index.scss'
import { bleScan } from '../../reducers/ble'

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
      led: [
        {
          image:
            'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
        },
        {
          image:
            'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
        },
        {
          image:
            'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
        },
        {
          image:
            'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png',
        },
        {
          image:
            'https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png',
        },
        {
          image:
            'https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png',
        }
      ],
      images: ['hear', 'small-heart']
    }
  }

  handlePickerChange (e) {
    this.setState({
      selectorValue: e.detail.value
    })
  }

  handleChange (value) {
    this.setState({
      value
    })
    this.props.bleScan(!this.props.ble.isScanning);
    // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
    return value
  }

  handleGoBle (){
    Taro.navigateTo({
      url: `/pages/bleconn/index`
    })
  }

  render () {
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
            <AtGrid columnNum={5} data={this.state.led} />
          </View>
        </View>
        <View className='page-title'>显示图案</View>
        <View className='page-item'>
          <Picker mode='selector' range={this.state.images} value={this.state.selectorValue} onChange={this.handlePickerChange.bind(this)}>
            <View className='demo-list-item'>
              <View className='demo-list-item__label'>国家地区</View>
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
            value={this.state.value}
            onChange={this.handleChange.bind(this)}
          >
            <AtButton type='secondary' circle={true} size='normal'>发送</AtButton>
          </AtInput>
        </View>
        <View className='page-title'>读取按键</View>
        <View className='page-title'>读取陀螺仪</View>
        <View className='page-title'>播放音符</View>
        <View className='page-title'>读取陀螺仪</View>

      </View>
    )
  }
}
export default MicroBitPage;