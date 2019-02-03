// miniprogram/pages/userMes/userMes.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mesList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const db = wx.cloud.database()
    // 查询当前用户收到所有的申请消息
    db.collection('message').where({
      createid: app.globalData.openid,
    }).get({
      success: res => {
        console.log(res);
        that.setData({
          mesList: res.data,
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  accept: function () {
    if (app.globalData.openid) {
      var that = this;
      const db = wx.cloud.database()
      this.data.applyidList.push(app.globalData.openid)
      wx.cloud.callFunction({
        name: 'update',
        data: {
          id: this.data.planid,
          applyidList: this.data.applyidList,
          joinidList: this.data.joinidList
        },
        fail: err => {
          console.error('[云函数]调用失败：', err)
        }
      })
    }
    else {
      console.log('222')
      wx.showToast({
        title: '尚未登录',
        icon: 'loading',
        duration: 500,

      });
      setTimeout(function () {
        wx.switchTab({
          url: '../userPage/userPage',
        })
      }, 500);
    }
  },

  joinPlan: function () {
    if (app.globalData.openid) {
      var that = this;
      const db = wx.cloud.database()
      db.collection('message').add({
        data: {
          planid: that.data.planid,
          createid: that.data.plan._openid,
          applyid: app.globalData.openid,
          sceneryname: that.data.plan.sceneryname,
          year: that.data.plan.year,
          month: that.data.plan.month,
          day: that.data.plan.day
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          this.setData({
            counterId: res._id,
          })
          wx.showToast({
            title: '申请发送成功',
            success: function () {
              setTimeout(function () {
                wx.navigateTo({
                  url: '../scenery/scenery?sceneryid=' + that.data.sceneryid,
                })
              }, 2000);
            }
          })
          console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)

        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '申请发送失败'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
      this.data.applyidList.push(app.globalData.openid)
      wx.cloud.callFunction({
        name: 'update',
        data: {
          id: this.data.planid,
          data: this.data.applyidList
        },
        fail: err => {
          console.error('[云函数]调用失败：', err)
        }
      })
    }
    else {
      console.log('222')
      wx.showToast({
        title: '尚未登录',
        icon: 'loading',
        duration: 500,

      });
      setTimeout(function () {
        wx.switchTab({
          url: '../userPage/userPage',
        })
      }, 500);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})