// 获取全局应用程序实例对象
const app = getApp();
// 获得 AV 的引用
const AV = require('../../libs/av-weapp-min.js');

// 创建页面实例对象
Page({
  // 页面名称
  name: "users",
  // 页面的初始数据
  data: {
    objectId: '',
    guests: [],
  },

  // 生命周期函数--监听页面加载
  onLoad: function(option) {
    this.setData({ 
      objectId: option.objectId,
    });
  },
  // 生命周期函数--监听页面初次渲染完成
  onReady () {
    var params = {
      'objectId': this.data.objectId,
    }
    AV.Cloud.run('getGuestsOfSalon', params).then(guests => {
      this.setData({ guests: guests });
    }).catch(error => {
      app.showError(error);
    });
  },
})

