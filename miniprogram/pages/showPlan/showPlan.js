// miniprogram/pages/showPlan/showPlan.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid:0,
    showView: true,
    planid:"",
    sceneryid:"",
    plan:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this;
    console.log(options);
    if (app.globalData.openid) {
      that.setData({
        userid: app.globalData.openid
      })
    }
    console.log(this.data.userid)
    that.setData({
      planid: options.planid
    })
    const db = wx.cloud.database()
    // 查询当前id计划
    db.collection('Cplan').where({
      _id: this.data.planid
    }).get({
      success: res => {
        console.log('计划',res);
        that.setData({
          sceneryid: res.data[0].sceneryid,
          plan:res.data[0],
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
    if (this.data.plan._openid == getApp().globalData.openid){
      that.setData({
        showView: false
      })
    }
    console.log(this.data.showView)
  },

  joinPlan: function () {
    if (app.globalData.openid) {
      var that = this;
      const db = wx.cloud.database()
      db.collection('message').add({
        data: {
          planid:that.data.planid,
          createid:that.data.plan._openid,
          applyid: app.globalData.openid
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
                  url: '../scenery/scenery?sceneryid='+that.data.sceneryid,
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
      console.log(this.data.planid)
      const _ = db.command
      db.collection('Cplan').doc('XD3ZAsDR1TiNkVIQ').update({
        data: {
          applyidList: _.push(app.globalData.openid)
        },
        success: res => {
          console.log('[数据库] [更新记录] 成功，记录 _id: ', res.data)

        },
        fail: err => {
          console.error('[数据库] 更新记录] 失败：', err)
        }
      })
    }
    else {
      console.log('222')
      wx.showToast({
        title: '尚未登录',
        icon: 'loading',
        duration:500,
        
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