// 获取全局应用程序实例对象
const app = getApp();
// 获得 AV 的引用
const AV = require('../../libs/av-weapp-min.js');

// 创建页面实例对象
Page({
  // 页面名称
  name: "enroll",
  // 页面的初始数据
  data: {
    objectId: '',
    name: '',
    nickname: '',
    company: '',
    github: '',
    phone: '',
    email: '',
    intro: '',
  },

  // 生命周期函数--监听页面加载
  onLoad: function(option) {
    this.setData({ 
      objectId: option.objectId
    });
    wx.setNavigationBarTitle({
      title: '完善信息',
    });
  },

  //以下为自定义点击事件
  toggleEnroll: function(e) {
    // 检查不为空
    var name = this.data.name;
    var nickname = this.data.nickname;
    var company = this.data.company;
    var github = this.data.github;
    var phone = this.data.phone;
    var email = this.data.email;
    var intro = this.data.intro;
    var avatar = app.globalData.user.avatarUrl;
    var userid = app.globalData.user.objectId;
    var that = this;

    if (name.replace(/[ ]/g,"").length == 0) {
      app.showError('「姓名」字段不能为空');
      return;
    }
    if (phone.replace(/[ ]/g,"").length == 0) {
      app.showError('「联系电话」字段不能为空');
      return;
    }
    if (email.replace(/[ ]/g,"").length == 0) {
      app.showError('「联系邮箱」字段不能为空');
      return;
    }
    if (avatar.length == 0 || userid.length == 0) {
      app.showError('当前用户信息加载失败，请尝试刷新本页面或重新加载小程序');
      return;
    }
    wx.showModal({
      title: '报名',
      content: '是否确认报名？确认后暂不支持主动取消，如果需要取消报名请联系沙龙主办方',
      success: function(res) {
        wx.showToast({
          title: '报名信息提交中...',
          icon: 'loading',
          duration: 10000
        });
        if (res.confirm) {
          // 开始完善信息
          var params = {
            'guest_name': name,
            'guest_nickname': nickname,
            'guest_company': company,
            'guest_url': github,
            'guest_phone': phone,
            'guest_email': email,
            'guest_intro': intro,
            'guest_avatar': avatar,
            'guest_user': {"__type":"Pointer","className":"_User","objectId":userid},
          };
          AV.Cloud.run('guestFullInfo', params).then(result => {
            if (result) {
              // 调用报名接口
              var enrollParams = {
                'salon_id': that.data.objectId,
                'guest_id': result.objectId,
              };
              AV.Cloud.run('enrollSalon', enrollParams).then(result => {
                wx.hideToast();
                if (result) {
                  // 报名成功，跳转报名成功页面
                  wx.navigateTo({ url: '../success/success' });
                } else {
                  console.log('error');
                }
              }).catch(error => {
                wx.hideToast();
                app.showError(error);
              });
            } else {
              wx.hideToast();
              console.error('write error');
            }
          }).catch(error => {
            wx.hideToast();
            app.showError(error);
          });
        }
      }
    });
  },
  bindKeyInput1: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindKeyInput2: function(e) {
    this.setData({
      nickname: e.detail.value
    })
  },
  bindKeyInput3: function(e) {
    this.setData({
      company: e.detail.value
    })
  },
  bindKeyInput4: function(e) {
    this.setData({
      github: e.detail.value
    })
  },
  bindKeyInput5: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindKeyInput6: function(e) {
    this.setData({
      email: e.detail.value
    })
  },
  bindKeyInput7: function(e) {
    this.setData({
      intro: e.detail.value
    })
  },
})

