// 获取全局应用程序实例对象
const app = getApp();
// 获得 AV 的引用
const AV = require('../../libs/av-weapp-min.js');

// 创建页面实例对象
Page({
  // 页面名称
  name: "invitation",
  // 页面的初始数据
  data: {
    invitations: [],
  },

  // 生命周期函数--监听页面初次渲染完成
  onReady () {
    var that = this;
    var userid = app.globalData.user.objectId;
    var params = {
      'userid': userid,
    }
    AV.Cloud.run('checkShouldFullInfo', params).then(result => {
      if (result == null) {
        // 需要，则跳转至报名界面
        wx.showModal({
          title: '报名',
          content: '我们需要您完善个人信息才能完成报名，是否前往完善信息？',
          success: function(res) {
            if (res.confirm) {
              var objectId = that.data.objectId;
              console.log(objectId);
              // 跳转到报名页面
              wx.redirectTo({ url: '../enroll/enroll?objectId=' + objectId });
            }
          }
        });
      } else {
        var newparams = {
            'guestId': result.objectId,
        };
        AV.Cloud.run('getInvitations', newparams).then(invitations => {
            that.setData({ invitations });
        }).catch(error => {
            app.showError(error);
        });
      }
    });
  },
})

