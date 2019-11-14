import Taro from '@tarojs/taro'
import { View, Text, PickerView, PickerViewColumn, Map } from '@tarojs/components'
import { AtButton, AtList, AtListItem, AtActivityIndicator, AtMessage, AtInput, AtForm } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { iotSetClient } from '../../reducers/iot'
// import mqtt from '../../utils/mqtt.js';
import mqtt from '../../utils/mqtt.min.js';

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
      mqttUser: null,
      mqttPass: null,
      topicName: '/temp',
      topicContent: 'Hello world',
      topicData: [],
      temp: 27,
      tds: 12,
      dir: 185,
      latitude: 22.5843899390435,
      longitude: 113.865033089561,
    }
    this.handleMove = this.handleMove.bind(this)
  }

  handleInput (e, type){
    this.setState({
      [e]:type
    })
  }

  onConnect (e){
    const client = mqtt.connect(this.state.mqttServer, {
      // port: 8084,
      keepalive: 60, //60s
      clean: true, //cleanSession不保持持久会话
    })
    this.client = client;
    client.retryCnt = 0;
    console.log(this.client)
    this.client.on('message', (topic, message) => {
      const msg = message.toString('utf-8');
      console.log(topic, msg);
      Taro.atMessage({
        'message': `话题：${topic} 消息：${msg}`,
        'type': 'info'
      })
      this.setState({
        topicData: [{topic, msg}, ...this.state.topicData]
      })
    });
    this.client.on('end', () => {
        console.log('mqtt end');
    });
    this.client.on('error', e => {
        console.log('mqtt err', e);
    });
    this.client.on('connect', connack => {
      this.props.iotSetClient(client);
      client.retryCnt = 0;
    });
    this.client.on('reconnect', () => {
        client.retryCnt++;
        if (client.retryCnt > 4){
            client.end();
        }
    });
  }

  handleTest (){
    Taro.connectSocket({
      url: 'wss://iot.kittenbot.cn/ws',
      success: function () {
        console.log('connect success')
      }
    }).then(task => {
      task.onOpen(function () {
        console.log('onOpen')
        task.send({ data: 'xxx' })
      })
      task.onMessage(function (msg) {
        console.log('onMessage: ', msg)
        task.close()
      })
      task.onError(function () {
        console.log('onError')
      })
      task.onClose(function (e) {
        console.log('onClose: ', e)
      })
    })
  }

  onMqttTest (){
    console.log("mqtt test")
    this.client.publish('/meow', "hello world", {qos: 1, retain: false});
  }

  onTapMap (e){
    console.log("map tap", e)
  }

  handleMove (dir){
    this.client.publish('/oceanShip', `${dir}`, {qos: 1, retain: false});
  }

  onSubmit (){
    this.client.subscribe(this.state.topicName, {qos: 1});
  }

  onPublish (){
    this.client.publish(this.state.topicName, this.state.topicContent, {qos: 1, retain: false});
  }


  render (){
    return (
      <View className="page">
        <AtMessage />
        <View className='page-title'>IoT 面板</View>
        {this.props.iot.client ? null: <AtForm className='page-item'>
          <AtInput name='mqttServer' title='服务器' type='text' placeholder='服务器地址,需要支持ws' value={this.state.mqttServer} onChange={this.handleInput.bind(this, 'mqttServer')} />
          <AtInput name='mqttUser' title='用户名' type='text' placeholder='用户名,话题没设置则留空' value={this.state.mqttUser} onChange={this.handleInput.bind(this, 'mqttUser')} />
          <AtInput name='mqttPass' title='密码' type='text' placeholder='话题密码,话题没设置则留空' value={this.state.mqttPass} onChange={this.handleInput.bind(this, 'mqttPass')} />
          <AtButton type='primary' circle={true} size='normal' onClick={this.onConnect.bind(this)}>连接</AtButton>
          <AtButton type='primary' circle={true} size='normal' onClick={this.handleTest.bind(this)}>test aliyun</AtButton>
        </AtForm>}
        
        {this.props.iot.client ? <View className='page-item'>
          <AtInput name='topic' title='话题' type='text' value={this.state.topicName} onChange={this.handleInput.bind(this, 'topicName')} >
            <AtButton type='primary' size='small' onClick={this.onSubmit.bind(this)}>订阅</AtButton>
          </AtInput>
          <AtInput name='topic' title='话题内容' type='text' value={this.state.topicContent} onChange={this.handleInput.bind(this, 'topicContent')} >
            <AtButton type='primary' size='small' onClick={this.onPublish.bind(this)}>发送</AtButton>
          </AtInput>
          <AtList>
            {
              this.state.topicData.map(n => {
                return <AtListItem title={n.topic} note={n.msg} />
              })
            }
          </AtList>
        </View> : null}
      </View>
    )
  }


}
export default IotPage 