import Taro from '@tarojs/taro'
import { View, Text, PickerView, PickerViewColumn, Image } from '@tarojs/components'
import { AtButton, AtList, AtListItem, AtActivityIndicator } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { bleScan, setDevices, bleConnected, bleCharWrite, bleCharRead } from '../../reducers/ble'
import './index.scss'

import logoImg from '../../assets/images/kittenbot.png'

function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }
  return -1;
}

@connect(({ ble }) => ({
  ble
}), (dispatch) => ({
  bleScan (state) {
    console.log("ble scan", state)
    dispatch(bleScan(state))
  },
  setDevices (devices){
    dispatch(setDevices(devices))
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
    this.onBluetoothDeviceFound = this.onBluetoothDeviceFound.bind(this);
    this.onConnectBle = this.onConnectBle.bind(this);
    this.getBLEDeviceServices = this.getBLEDeviceServices.bind(this);
  }

  onStartScan (){
    Taro.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: true,
      success: (res) => {
        this.props.bleScan(true);
        console.log('startBluetoothDevicesDiscovery success', res)
        this.onBluetoothDeviceFound()
      },
    });
  }

  onBluetoothDeviceFound (){
    Taro.onBluetoothDeviceFound((res) => {
      res.devices.forEach(device => {
        if (!device.name && !device.localName) {
          return
        }
        const foundDevices = this.props.ble.devices
        const idx = inArray(foundDevices, 'deviceId', device.deviceId)
        const data = {}
        if (idx === -1) {
          data[`devices[${foundDevices.length}]`] = device
        } else {
          data[`devices[${idx}]`] = device
        }
        this.props.setDevices(data)
      })
    })
  }

  stopBluetoothDevicesDiscovery() {
    Taro.stopBluetoothDevicesDiscovery()
  }

  onConnectBle (dev){
    console.log("ble conn", dev )
    const deviceId = dev.deviceId

    Taro.createBLEConnection({
      deviceId,
      success: (res) => {
        this.props.bleConnected(dev);
        this.getBLEDeviceServices(deviceId)
      }
    })
    this.stopBluetoothDevicesDiscovery()
  }

  getBLEDeviceServices(deviceId) {
    Taro.getBLEDeviceServices({
      deviceId,
      success: (res) => {
        console.log('getBLEDeviceServices success', res.services)
        for (let i = 0; i < res.services.length; i++) {
          if (res.services[i].isPrimary) {
            this.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid)
            return
          }
        }
      }
    })
  }

  getBLEDeviceCharacteristics(deviceId, serviceId) {
    Taro.getBLEDeviceCharacteristics({
      deviceId,
      serviceId,
      success: (res) => {
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
          }
        }
      },
      fail(res) {
        console.error('getBLEDeviceCharacteristics', res)
      }
    })
    
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
          {this.props.ble.isScanning ? <AtActivityIndicator content='扫描中...'/> : 
          <AtButton type='primary' circle={true} size='normal' onClick={this.onStartScan.bind(this)}>扫描</AtButton>}
        </View>
        <View className="found-txt">
          已经发现{this.props.ble.devices.length}个设备
        </View>
        <AtList>
          {
            this.props.ble.devices.map((item, idx) => (
              <AtListItem title={item.name} note={item.uuid} onClick={
                () => this.onConnectBle(item)
              } />
            ))
          }
        </AtList>

      </View>
    )
  }
}

export default BleConn