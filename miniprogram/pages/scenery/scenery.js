// pages/scenery/scenery.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showView:true,
    openid: "",
    sceneryid:"",
    img_url:"",
    scenery:"",
    description:""
  },

  onQuery: function () {
    const db = wx.cloud.database()
    db.collection('scenery').where({
      _id: this.data.sceneryid
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
    var that = this;
    console.log(options);
    showView:(options.showView=="true"?true:false)
    that.setData({
      sceneryid: options.sceneryid
    })
    that.onQuery()
  },

  onChangeState: function(){
    var that = this;
    that.setData({
      showView:(!that.data.showView)
    })
    console.log(that.data.showView)
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
  planList:function(){
    wx.navigateTo({
      url: '../planList/planList?sceneryid=' + this.data.sceneryid,
    })
  },
  addPlan:function(){
    if (app.globalData.openid) {
      wx.navigateTo({
        url: '../addPlan/addPlan?sceneryid='+this.data.sceneryid,
      })
    }
    else{
      wx.showToast({
        title: '尚未登录',
        icon:'loading',
        duration:500,
      })
    }
  }

})