import Taro from '@tarojs/taro'
import { View, Text, PickerView, PickerViewColumn, Image } from '@tarojs/components'
import { AtButton, AtList, AtListItem, AtActivityIndicator, AtMessage, AtInput, AtForm } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { bleScan, setDevices, bleConnected, bleCharWrite, bleCharRead } from '../../reducers/ble'
import './index.scss'

class IotPage extends Taro.Component {
  config = {
    navigationBarTitleText: 'IoT'
  }


  constructor (){
    super(...arguments)
    this.state = {

    }

  }

  handleInput (e){

  }

  render (){
    return (
      <View className="page">
        <AtMessage />
        <View className='page-title'>IoT 面板</View>
        <AtForm className='page-item'>
          <AtInput name='mqttServer' title='服务器' type='text' placeholder='标准五个字' value={this.state.inputValue1} onChange={this.handleInput.bind(this, 'inputValue1')} />
          <AtInput name='mqttPort' title='端口' type='text' placeholder='标准五个字' value={this.state.inputValue1} onChange={this.handleInput.bind(this, 'inputValue1')} />
          <AtInput name='mqttUser' title='用户名' type='text' placeholder='标准五个字' value={this.state.inputValue1} onChange={this.handleInput.bind(this, 'inputValue1')} />
          <AtInput name='mqttPass' title='密码' type='text' placeholder='标准五个字' value={this.state.inputValue1} onChange={this.handleInput.bind(this, 'inputValue1')} />
          <AtButton type='primary' circle={true} size='normal' >连接</AtButton> 
        </AtForm>


      </View>
    )
  }


}
export default IotPage 