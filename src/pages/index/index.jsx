import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'

import './index.scss'

class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  constructor () {
    super(...arguments)
    this.state = {
      pages: [
        {
          id: 'microbit',
          title: 'Micro:bit',
          content: 'Microbit 控制',
        },
        {
          id: 'robotbit',
          title: 'Robot:Bit',
          content: 'Robotbit 遥控',
        },
        // {
        //   id: 'iot',
        //   title: 'Iot',
        //   content: 'Iot 面板',
        // },
      ],
      imgUrls: [
        'https://img10.360buyimg.com/babel/s700x360_jfs/t25855/203/725883724/96703/5a598a0f/5b7a22e1Nfd6ba344.jpg!q90!cc_350x180',
        'https://img11.360buyimg.com/babel/s700x360_jfs/t1/4776/39/2280/143162/5b9642a5E83bcda10/d93064343eb12276.jpg!q90!cc_350x180',
        'https://img14.360buyimg.com/babel/s700x360_jfs/t1/4099/12/2578/101668/5b971b4bE65ae279d/89dd1764797acfd9.jpg!q90!cc_350x180'
      ],
    }
  }
  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  gotoPanel = e => {
    const { id } = e.currentTarget.dataset
    Taro.navigateTo({
      // url: `/pages/panel/index?id=${id.toLowerCase()}`
      url: `/pages/${id.toLowerCase()}/index`
    })
  }

  render () {
    return (
      <View className='page page-index'>
        {/*<View className='caro'>
          <Swiper
            indicatorColor='#999'
            indicatorActiveColor='#333'
            current={1}
            duration={500}
            interval={5000}
            circular
            autoplay
            indicatorDots
            preMargin='20'
          >
            {
              this.state.imgUrls.map((item, idx) => (
                <SwiperItem key={idx}>
                  <Image mode='widthFix' src={item} className='slide-image' width='355' height='150' />
                </SwiperItem>
              ))
            }
          </Swiper>
          </View>*/}
        <View className='module-list'>
          {this.state.pages.map((item, index) => (
            <View
              className='module-list__item'
              key={index}
              data-id={item.id}
              data-name={item.title}
              data-list={item.subpages}
              onClick={this.gotoPanel}
            >
              <View className='module-list__item-title'>{item.title}</View>
              <View className='module-list__item-content'>{item.content}</View>
            </View>
          ))}
        </View>
      </View>
    )
  }
}
export default Index
