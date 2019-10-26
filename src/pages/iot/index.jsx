import Taro from '@tarojs/taro'
import { View, Text, PickerView, PickerViewColumn, Image } from '@tarojs/components'
import { AtButton, AtList, AtListItem, AtActivityIndicator, AtMessage, AtInput, AtForm } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { bleScan, setDevices, bleConnected, bleCharWrite, bleCharRead } from '../../reducers/ble'
import mqtt from '../../utils/mqtt.js';
import './index.scss'

class IotPage extends Taro.Component {
  config = {
    navigationBarTitleText: 'IoT'
  }


  constructor (){
    super(...arguments)
    this.state = {
      mqttServer: 'wxs://iot.kittenbot.cn/mqtt',
    }

  }

  handleInput (e){

  }

  onConnect (e){
    this.client = mqtt.connect(this.state.mqttServer, {
      port: 8084
    })
    console.log(this.client)
  }

  render (){
    return (
      <View className="page">
        <AtMessage />
        <View className='page-title'>IoT 面板</View>
        <AtForm className='page-item'>
          <AtInput name='mqttServer' title='服务器' type='text' placeholder='服务器地址,需要支持ws' value={this.state.mqttServer} onChange={this.handleInput.bind(this, 'inputValue1')} />
          <AtInput name='mqttUser' title='用户名' type='text' placeholder='话题用户,没设置则空' value={this.state.userName} onChange={this.handleInput.bind(this, 'inputValue1')} />
          <AtInput name='mqttPass' title='密码' type='text' placeholder='话题密码,没设置则空' value={this.state.userPass} onChange={this.handleInput.bind(this, 'inputValue1')} />
          <AtButton type='primary' circle={true} size='normal' onClick={this.onConnect.bind(this)}>连接</AtButton> 
        </AtForm>
      </View>
    )
  }


}
export default IotPage 