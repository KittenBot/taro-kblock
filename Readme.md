# Taro kblock小程序



### 安装方法

1. clone 仓库
2. yarn

### 使用：

taro同时支持h5和各种小程序开发，平时调界面的时候用h5就行了

`yarn dev:h5`

如果使用微信需要下载小程序IDE

之后在工程下面

`yarn dev:weapp`

在小程序IDE中导入工程，工程目录是自动打包后的**dist代码目录**

**如果测试提示无效appid的话需要改 `project.config.json` 的appid为测试appid，之后重新启动dev**

