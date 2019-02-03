// miniprogram/pages/homePage/homePage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sceneryid:'',
    navList: [
      {
        name: "栖霞山",
        icon: "qixiashan.jpg",
        page: "../scenery/scenery?sceneryid=XDKvQsDR1TiNYQGI"
      },
      {
        name: "鸡鸣寺",
        icon: "jimingsi.jpg",
        page: "../scenery/scenery?sceneryid=XD7Ls-SiwXKAQn0g"
      },
      {
        name: "秦淮河",
        icon: "qinhuaihe.jpg",
        page: "../scenery/scenery?sceneryid=XD7MhHkPDdDCJ3ax"
      },
      {
        name: "紫金山",
        icon: "zijinshan.jpg",
        page: "../scenery/scenery?sceneryid=XD7NmonnuWjcivVd"
      }
    ]
  },

  search:function(e){
    let sceneryname = e.detail.value
    const db = wx.cloud.database()
    console.log(sceneryname)
    db.collection('scenery').where({
      sceneryname:sceneryname
    }).get({
      success: res => {
        console.log(res)
        this.setData({
          sceneryid: res.data[0]._id
        })
        console.log('[数据库] [查询记录] 成功: ', res.data)
        wx.navigateTo({
          url: '../scenery/scenery?sceneryid='+this.data.sceneryid,
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '搜索失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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