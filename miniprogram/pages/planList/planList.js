// miniprogram/pages/planList/planList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sceneryid: "",
    sceneryname: "",
    planList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    that.setData({
      sceneryid: options.sceneryid
    })
    const db = wx.cloud.database()
    // 查询当前id景点
    db.collection('scenery').where({
      _id: this.data.sceneryid
    }).get({
      success: res => {
        console.log(res);
        that.setData({
          sceneryname: res.data[0].sceneryname,
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
    // 查询当前景点所有计划
    db.collection('Cplan').where({
      sceneryid: this.data.sceneryid,
      status:'1'
    }).get({
      success: res => {
        console.log(res);
        that.setData({
          planList: res.data,
        })
        console.log(this.data.planList)
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