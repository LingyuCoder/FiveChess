五子棋游戏
===

##简介
一个五子棋游戏，能够人机对战和双人联机对战

##启动
运行如下命令：
```
$ git clone git@github.com:LingyuCoder/FiveChess.git
$ cd FiveChess
$ npm install
$ npm start
```

然后咋浏览器中输入`http://localhost:2999#yourname`就可以以名称`yourname`进入游戏了。如果没有指定名称，将自动生成一个随机字符串作为名称

##人机对战
进入页面后默认就是人机对战，点击开始即可。

##玩家对战
进入页面后，点击右下角的玩家对战进入玩家对战模式。若对方也在玩家对战模式，点击连接并输入对方的名称，如果连接成功将显示开始按钮，点击后即可对战

**PS：如果不在一台机子上的话，记得修改index.html的head中的WEBSOCKETADDR地址为启动服务的地址**

##依赖和兼容性
玩家对战模式依赖[peertc](https://github.com/LingyuCoder/peertc)，其优先使用WebRTC DataChannel，不支持时使用WebSocket，请保证浏览器至少能够支持WebSocket

##License
MIT
