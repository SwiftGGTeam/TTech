// 获取全局应用程序实例对象
const app = getApp();
// 获得 AV 的引用
const AV = require('../../libs/av-weapp-min.js');

// 创建页面实例对象
Page({
  // 页面名称
  name: "detail",
  // 页面的初始数据
  data: {
    objectId: '',
    salon: { },
    orators: [],
  },

  // 生命周期函数--监听页面加载
  onLoad: function(option) {
    this.setData({ 
      objectId: option.objectId
    });
    wx.setNavigationBarTitle({
      title: '<T> 沙龙详情',
    });
  },
  // 生命周期函数--监听页面初次渲染完成
  onReady () {
    var params = {
      'objectId': this.data.objectId,
    }
    var that = this;
    AV.Cloud.run('getSalonWithObjectId', params).then(salon => {
      var speeches = salon.salon_speeches;
      this.setData({ orators: [] });
      speeches.forEach(function (speech, i, a) {
        var id = speech.speech_orator_id;
        var query = new AV.Query('TGuest');
        query.get(id).then(function (orator) {
          console.log(orator);
          var newOrators = that.data.orators;
          newOrators.push(orator);
          that.setData({ orators: newOrators });
        }).catch(console.error);
      })
      this.setData({ salon: salon });
    }).catch(error => {
      app.showError(error);
    });
  },

  // 自定义事件
  toggleEnroll: function(e) {
    // 首先检查是否需要完善信息
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
        // 不需要，则直接调用报名接口
        wx.showModal({
          title: '报名',
          content: '是否确认报名？确认后暂不支持主动取消，如果需要取消报名请联系沙龙主办方',
          success: function(res) {
            if (res.confirm) {
              var enrollParams = {
                'salon_id': that.data.objectId,
                'guest_id': result.objectId,
              };
              AV.Cloud.run('enrollSalon', enrollParams).then(result => {
                console.log(result);
                if (result) {
                  // 报名成功，跳转报名成功页面
                  wx.navigateTo({ url: '../success/success' });
                } else {
                  var error = '报名失败！';
                  app.showError(error);
                }
              }).catch(error => {
                app.showError(error);
              });
            }
          }
        });
      }
    }).catch(error => {
      app.showError(error);
    });
  },
  onShareAppMessage: function() {
    var title = this.data.salon.salon_title;
    return {
      title: title,
      desc: title + '<T> 沙龙即将召开，感兴趣的朋友快来报名参加吧~',
      path: '/page/detail/detail',
    };
  },

  toggleGuests: function(e) {
    var objectId = this.data.objectId;
    // 跳转到用户详情页面
    wx.navigateTo({ url: '../users/users?objectId=' + objectId });
  },
})

