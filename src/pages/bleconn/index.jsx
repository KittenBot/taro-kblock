import Taro from '@tarojs/taro'
import { View, Text, PickerView, PickerViewColumn, Image } from '@tarojs/components'
import { AtButton, AtList, AtListItem } from 'taro-ui'
import { connect } from '@tarojs/redux'
import './index.scss'

import logoImg from '../../assets/images/kittenbot.png'

@connect(({ ble }) => ({
  ble
}), (dispatch) => ({
  bleScan (state) {
    console.log("ble scan", state)
    dispatch(bleScan(state))
  }
}))

class BleConn extends Taro.Component {
  config = {
    navigationBarTitleText: '蓝牙连接'
  }

  constructor (){
    super(...arguments)
    this.state = {

    }
  }

  render (){
    return (
      <View className="page">
        <View className="page-item">
          <Image src={logoImg} className='logo' mode='widthFix' />
        </View>
        <View className="page-item">
          <View className='page-title'>使用说明：请在kittenblock V1.84以上版本选择Microbit Python>BLE并恢复固件</View>
        </View>
        <View className="page-item">
          <AtButton type='primary' circle={true} size='normal'>开始扫描</AtButton>
        </View>
        <View className="found-txt">已经发现{this.props.ble.devices.length}个设备</View>
        <AtList>
          {
            this.props.ble.devices.map((item, idx) => (
              <AtListItem title={item.name} note={item.uuid} />
            ))
          }
        </AtList>

      </View>
    )
  }
}

export default BleConn