import Taro from '@tarojs/taro'
import { View, Text, PickerView, PickerViewColumn, Image } from '@tarojs/components'
import { AtButton, AtList, AtListItem, AtActivityIndicator, AtMessage } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { bleScan, setDevices, bleConnected, bleCharWrite, bleCharRead } from '../../reducers/ble'
import './index.scss'

import logoImg from '../../assets/images/kittenbot.png'


@connect(({ ble }) => ({
  ble
}), (dispatch) => ({
  bleScan (state) {
    dispatch(bleScan(state))
  },
  setDevices (devices){
    dispatch(setDevices(devices))
  },
  bleConnected (dev){
    dispatch(bleConnected(dev))
  },
  bleCharWrite (char){
    dispatch(bleCharWrite(char))
  },
  bleCharRead (char){
    dispatch(bleCharRead(char))
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

    this.onConnectBle = this.onConnectBle.bind(this);
    this.getBLEDeviceServices = this.getBLEDeviceServices.bind(this);
    this.startBluetoothDevicesDiscovery = this.startBluetoothDevicesDiscovery.bind(this);
  }

  componentWillUnmount (){
    this.stopBluetoothDevicesDiscovery();
  }

  startBluetoothDevicesDiscovery (){
    Taro.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: true,
    }).then(ret => {
      this.props.bleScan(true);
      console.log('startBluetoothDevicesDiscovery success', res)
    })
    Taro.onBluetoothDeviceFound((res) => {
      console.log("onBluetoothDeviceFound", res);
      const devices = this.props.ble.devices
      res.devices.forEach(dev => {
        if (!dev.name && !dev.localName) {
          return
        }
        devices[dev.deviceId] = dev;
      })
      this.props.setDevices(devices)
    })
  }

  onStartScan (){
    Taro.openBluetoothAdapter().then(ret => {
      console.log('openBluetoothAdapter success', ret)
      this.startBluetoothDevicesDiscovery()
      
    }).catch(err => {
      console.log("openBluetoothAdapter err", err)
    })
    
  }

  onDisconnect (){
    if (this.props.ble.charRead){
      const char = this.props.ble.charRead;
      Taro.notifyBLECharacteristicValueChange({
        deviceId: char.deviceId,
        serviceId: char.serviceId,
        characteristicId: char.characteristicId,
        state: false,
      }).then(ret => {
        Taro.closeBLEConnection({
          deviceId: this.props.ble.connected.deviceId
        }).then(ret => {
          this.props.bleConnected(null)
        })
      })
    } else {
      Taro.closeBLEConnection({
        deviceId: this.props.ble.connected.deviceId
      }).then(ret => {
        this.props.bleConnected(null)
      })
    }

  }

  stopBluetoothDevicesDiscovery() {
    Taro.stopBluetoothDevicesDiscovery()
    this.props.bleScan(false);
  }

  onConnectBle (dev){
    console.log("ble conn", dev )
    const deviceId = dev.deviceId

    Taro.createBLEConnection({
      deviceId
    }).then(ret => {
      this.props.bleConnected(dev);
      this.getBLEDeviceServices(deviceId)
    })
    this.stopBluetoothDevicesDiscovery()
  }

  getBLEDeviceServices(deviceId) {
    Taro.getBLEDeviceServices({
      deviceId
    }).then(res => {
      console.log('getBLEDeviceServices success', res.services)
      for (let i = 0; i < res.services.length; i++) {
        if (res.services[i].isPrimary) {
          this.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid)
          return
        }
      }
    })
  }

  getBLEDeviceCharacteristics(deviceId, serviceId) {
    Taro.getBLEDeviceCharacteristics({
      deviceId,
      serviceId
    }).then(res => {
      console.log('getBLEDeviceCharacteristics success', res.characteristics)
      for (let i = 0; i < res.characteristics.length; i++) {
        let item = res.characteristics[i]
        if (item.properties.read) {
          Taro.readBLECharacteristicValue({
            deviceId,
            serviceId,
            characteristicId: item.uuid,
          })
        }
        if (item.properties.write) {
          this.props.bleCharWrite({
            deviceId,
            serviceId,
            characteristicId: item.uuid
          });
        }
        if (item.properties.notify || item.properties.indicate) {
          Taro.notifyBLECharacteristicValueChange({
            deviceId,
            serviceId,
            characteristicId: item.uuid,
            state: true,
          })
          this.props.bleCharRead({
            deviceId,
            serviceId,
            characteristicId: item.uuid
          });
        }
      }
      Taro.atMessage({
        'message': '蓝牙连接成功',
        'type': 'success',
      })
    }).catch(err => {
      console.error('getBLEDeviceCharacteristics', res)
    })
    
  }

  render (){
    const devices = this.props.ble.devices;
    return (
      <View className="page">
        <AtMessage />
        <View className="page-item">
          <Image src={logoImg} className='logo' mode='widthFix' />
        </View>
        <View className="page-item">
          <View className='page-title'>使用说明：请在kittenblock V1.84以上版本选择Microbit Python>BLE并恢复固件</View>
        </View>
        <View className="page-item">
          {this.props.ble.connected ?  
          <AtButton className="btn-disconn" type='primary' circle={true} size='normal' onClick={this.onDisconnect.bind(this)}>断开连接</AtButton> :
          <AtButton type='primary' circle={true} size='normal' loading={this.props.ble.isScanning } onClick={this.onStartScan.bind(this)}>扫描</AtButton> 
          }
        </View>
        <View className="found-txt">
          已经发现{Object.keys(devices).length}个设备
        </View>
        <AtList>
          {
            Object.keys(devices).map((item, idx) => (
              <AtListItem title={devices[item].name} note={devices[item].deviceId} onClick={
                () => this.onConnectBle(devices[item])
              } extraText={devices[item].RSSI}/>
            ))
          }
        </AtList>

      </View>
    )
  }
}

export default BleConn