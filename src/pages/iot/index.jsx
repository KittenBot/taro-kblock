import Taro from '@tarojs/taro'
import { View, Text, PickerView, PickerViewColumn, Map } from '@tarojs/components'
import { AtButton, AtList, AtListItem, AtActivityIndicator, AtMessage, AtInput, AtForm } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { iotSetClient } from '../../reducers/iot'
import mqtt from '../../utils/mqtt.js';
import locImg from '../../assets/images/ship.png'

import './index.scss'

@connect(({ iot }) => ({
  iot
}), (dispatch) => ({
  iotSetClient (client){
    dispatch(iotSetClient(client))
  }
}))

class IotPage extends Taro.Component {
  config = {
    navigationBarTitleText: 'IoT'
  }


  constructor (){
    super(...arguments)
    this.state = {
      mqttServer: 'wxs://iot.kittenbot.cn/mqtt',
      temp: 27,
      tds: 12,
      dir: 185,
      latitude: 22.5843899390435,
      longitude: 113.865033089561,

    }
    this.handleMove = this.handleMove.bind(this)
  }

  handleInput (e){

  }

  onConnect (e){
    const client = mqtt.connect(this.state.mqttServer, {
      port: 8084
    })
    this.client = client;
    console.log(this.client)
    this.client.on('message', (topic, message) => {
      const msg = message.toString('utf-8');
      console.log(topic, msg);
      // this.mqttTopicData = message.toString('utf-8');
      if (topic === '/meow'){
        const n = msg.split(',').map(m => parseFloat(m.trim()))
        this.setState({
          latitude: n[0],
          longitude: n[1]
        })
      }
    });
    this.client.on('end', () => {
        console.log('mqtt end');
    });
    this.client.on('error', e => {
        console.log('mqtt err', e);
    });
    this.client.on('connect', connack => {
      this.props.iotSetClient(client);
      console.log("mqtt connected", connack);
      this.client.subscribe('/meow', {qos: 1});
      client.retryCnt = 0;
    });
    this.client.on('reconnect', () => {
        client.retryCnt++;
        if (client.retryCnt > 5){
            client.end();
        }
    });
  }

  onMqttTest (){
    console.log("mqtt test")
    this.client.publish('/meow', "hello world", {qos: 1, retain: false});
  }

  onTapMap (e){
    console.log("map tap", e)
  }

  handleMove (dir){
    console.log()
  }

  render (){
    return (
      <View className="page">
        <AtMessage />
        <View className='page-title'>IoT 面板</View>
        {this.props.iot.client ? null: <AtForm className='page-item'>
          <AtInput name='mqttServer' title='服务器' type='text' placeholder='服务器地址,需要支持ws' value={this.state.mqttServer} onChange={this.handleInput.bind(this, 'inputValue1')} />
          <AtButton type='primary' circle={true} size='normal' onClick={this.onConnect.bind(this)}>连接</AtButton> 
        </AtForm>}
        <View className='map-wrap'>
          <Map
            className='map'
            latitude={this.state.latitude}
            longitude={this.state.longitude}
            markers={[{
              id: 1,
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              title: `温度:${this.state.temp}\nTds:${this.state.tds}\n方向:${this.state.dir}`,
              iconPath: locImg,
            }]}
            onClick={this.onTapMap}
            show-location
          />
        </View>
        {this.props.iot.client ? <View className='page-item'>
          <AtButton type='primary' circle={true} size='normal' onClick={this.onMqttTest.bind(this)}>采水样</AtButton>
          <AtButton type='primary' className="ctl-forward" onClick={()=>this.handleMove('forward')}>前进</AtButton>
          <AtButton type='primary' className="ctl-left" onClick={()=>this.handleMove('left')}>左转</AtButton>
          <AtButton type='primary' className="ctl-right" onClick={()=>this.handleMove('right')}>右转</AtButton>
          <AtButton type='primary' className="ctl-back" onClick={()=>this.handleMove('back')}>后退</AtButton>
          <AtButton type='primary' className="ctl-stop" onClick={()=>this.handleMove('stop')}>停船</AtButton>
        </View> : null}
      </View>
    )
  }


}
export default IotPage 