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
  // 生命周期函数--监听页面加载
  onLoad () {
    wx.setNavigationBarTitle({
      title: '我的活动邀请卡',
    });
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
          title: '暂无活动邀请',
          showCancel: false,
        });
      } else {
        var newparams = {
            'guestId': result.objectId,
        };
        AV.Cloud.run('getInvitations', newparams).then(invitations => {
            that.setData({ invitations });
            if (invitations === null || invitations === undefined) {
              return;
            }
            var invitationMarkers = [];
            invitations.forEach(function(invitation, i, a) {
              var markers = invitation.salon_markers;
              if (markers.length > 0) {
                var marker = markers[0];
                invitationMarkers.push(marker);
              }
            });
            that.setData({ markers: invitationMarkers });
        }).catch(error => {
            app.showError(error);
        });
      }
    });
  },

  openWechatMap: function(e) {
    var markerId = e.markerId; 
    var marker = this.data.markers[markerId];
    wx.getLocation({
      type: 'gcj02',
      fail: function(e) {
        app.showError('获取当前定位失败！' + e);
      },
      complete: function() {
        wx.openLocation({
          latitude: marker.latitude, // 纬度
          longitude: marker.longitude, // 经度
          scale: 16, // 缩放比例
          name: marker.title, // 位置名
          address: marker.desc, // 地址的详细说明
        });
      }
    })
  },
})

