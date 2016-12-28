// 获取全局应用程序实例对象
const app = getApp();
// 获得 AV 的引用
const AV = require('../../libs/av-weapp-min.js');

// 创建页面实例对象
Page({
  // 页面名称
  name: "index",
  // 页面的初始数据
  data: {
    salons: [],
  },

  // 生命周期函数--监听页面加载
  onLoad () {

  },
  // 生命周期函数--监听页面初次渲染完成
  onReady () {
    AV.Cloud.run('getSalonList').then(salons => {
      this.setData({ salons });
    }).catch(error => {
      app.showError(error);
    });
  },
  // 生命周期函数--监听页面显示
  onShow () {

  },
  // 生命周期函数--监听页面隐藏
  onHide () {

  },
  // 生命周期函数--监听页面卸载
  onUnload () {

  },

  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh () {
    
  },

  // 自定义事件
  toggleDetail: function(e) {
    var id = e.currentTarget.dataset.id, salon = this.data.salons[id], objectId = salon.salon_object_id;
    console.log(objectId);
    // 跳转到详情页面
    wx.navigateTo({
      url: '../detail/detail?objectId=' + objectId,
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  }
})

