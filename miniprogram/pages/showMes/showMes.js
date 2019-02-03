// miniprogram/pages/showMes/showMes.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    planid:"",
    mesid:"",
    plan:[],
    message:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      planid: options.planid,
      mesid: options.mesid
    })
    console.log(that.data.mesid)
    const db = wx.cloud.database()
    // 查询当前id计划
    db.collection('Cplan').where({
      _id: this.data.planid
    }).get({
      success: res => {
        console.log('计划', res);
        that.setData({
          plan: res.data[0],
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

    db.collection('message').where({
      _id: this.data.mesid
    }).get({
      success: res => {
        console.log('消息', res);
        that.setData({
          message: res.data[0],
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
      for (var index in that.data.plan.applyidList) {
        if (that.data.plan.applyidList[index] == that.data.message.applyid) {
          var config = index;
          break;
        }
      }
      that.data.plan.applyidList.splice(config, 1);
      that.data.plan.joinidList.push(app.globalData.openid)
      wx.cloud.callFunction({
        name: 'update',
        data: {
          id: that.data.planid,
          applyidList: that.data.plan.applyidList,
          joinidList:that.data.plan.joinidList
        },
        fail: err => {
          console.error('[云函数]调用失败：', err)
        }
      })
      db.collection('message').doc(that.data.mesid).remove({
        success: res => {
          wx.showToast({
            title: '确认成功',
            duration: 500,

          });
          setTimeout(function () {
            wx.switchTab({
              url: '../userPage/userPage',
            })
          }, 500);
          console.log('[数据库] [删除记录] 成功')

        },
        fail: err => {
          console.error('[数据库] [删除记录] 失败：', err)
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

  refuse: function () {
    if (app.globalData.openid) {
      var that = this;
      const db = wx.cloud.database()
      for (var index in that.data.plan.applyidList) {
        if (that.data.plan.applyidList[index] == that.data.message.applyid) {
          var config = index;
          break;
        }
      }
      that.data.plan.applyidList.splice(config, 1);
      wx.cloud.callFunction({
        name: 'update',
        data: {
          id: that.data.planid,
          applyidList: that.data.plan.applyidList,
          joinidList:that.data.plan.joinidList
        },
        fail: err => {
          console.error('[云函数]调用失败：', err)
        }
      })
      db.collection('message').doc(that.data.mesid).remove({
        success: res => {
          wx.showToast({
            title: '拒绝成功',
            duration: 500,

          });
          setTimeout(function () {
            wx.switchTab({
              url: '../userPage/userPage',
            })
          }, 500);
          console.log('[数据库] [删除记录] 成功')

        },
        fail: err => {
          console.error('[数据库] [删除记录] 失败：', err)
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