// 获取全局应用程序实例对象
const app = getApp();

// 创建页面实例对象
Page({
  // 页面名称
  name: "success",

  // 生命周期函数--监听页面加载
  onLoad () {
    wx.setNavigationBarTitle({
      title: '报名成功',
    });
  },
  //以下为自定义点击事件
  toggleIndex: function(e) {
    wx.redirectTo({
      url: '../index/index'
    });
  },
})

