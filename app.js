// 获得 AV 的引用
const AV = require('./libs/av-weapp-min.js');

// App() 函数用来注册一个小程序，用来指定小程序的生命周期。
// App() 必须在本文件当中注册，并且不能注册多个。
// 在 App() 当中的函数直接使用 this 即可获取 app 实例
// 不要在 onLaunch 的时候调用 getCurrentPages()，因为此时 page 还未生成
// 不要随意调用生命周期函数
App({
    // 全局数据（整个应用程序共享）
    globalData: {
        
    },
    onLaunch: function() {
        // 生命周期函数——监听小程序初始化，全局只会触发一次
        // 初始化 LeanCloud
        AV.init({ 
            appId: 'llo9AzvVM6q7SB2hBI7jwNCj-gzGzoHsz', 
            appKey: 'iB0TewhETUBwryTXGjVXuNMB', 
        });
        // 登录
        AV.User.loginWithWeapp().then(user => {
            this.globalData.user = user.toJSON();
        }).catch(console.error);
    },
    onShow: function() {
        // 生命周期函数——监听小程序显示，当小程序启动或者从后台进入前台显示的时候会触发
    },
    onHide: function() {
        // 生命周期函数——监听小程序隐藏，当小程序从前台进入后台的时候会触发
    },
    // 还可以添加其他任意的全局函数和数据
    showError: function(error) {
        wx.showModal({
            title: '错误',
            content: error.message,
            showCancel: false,
        });
    }
})