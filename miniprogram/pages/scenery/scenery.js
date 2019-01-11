// pages/scenery/scenery.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: "",
    scenery_id:"",
    img_url:"",
    scenery:"",
    description:""
  },

  onQuery: function () {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('scenery').where({
      sceneryid: this.data.scenery_id
    }).get({
      success: res => {

        this.setData({
          img_url:res.data[0].img,
          scenery:res.data[0].sceneryname,
          description:res.data[0].description,
        })
        console.log('[数据库] [查询记录] 成功: ', this.data)
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
    // this.data.scenery_id = options
    this.data.scenery_id =1
    // this.data.scenery_id=''

    this.onQuery()
    console.log('111',this.data)
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

  },
  click:function(){
    wx.navigateTo({
      url: '../index/index?id='+this.data.scenery_id,
    })
  }

})