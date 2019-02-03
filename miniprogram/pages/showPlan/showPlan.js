// miniprogram/pages/showPlan/showPlan.js
const app = getApp()
var util = require('../../util/util.js');  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tag:'',
    userid:0,
    showView: true,
    planid:"",
    sceneryid:"",
    applyidList:[],
    plan:[],
    time:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var time = util.formatTime(new Date());
    that.setData({
      time: time
    }); 
    console.log(options);
    if (app.globalData.openid) {
      that.setData({
        userid: app.globalData.openid
      })
    }
    console.log(this.data.userid)
    that.setData({
      planid: options.planid,
      tag:options.tag
    })
    console.log(this.data.tag)
    const db = wx.cloud.database()
    // 查询当前id计划
    db.collection('Cplan').where({
      _id: this.data.planid
    }).get({
      success: res => {
        console.log('计划',res);
        that.setData({
          sceneryid: res.data[0].sceneryid,
          applyidList: res.data[0].applyidList,
          plan:res.data[0],
        })
        console.log('[数据库] [查询记录] 成功: ', res)
        for (var index in that.data.plan.applyidList) {
          if (that.data.plan.applyidList[index] == this.data.userid) {
            that.setData({
              showView: false
            })
            console.log('123')
            break;
          }
        }
        for (var index in that.data.plan.joinidList) {
          if (that.data.plan.joinidList[index] == this.data.userid) {
            that.setData({
              showView: false
            })
            break;
          }
        }
        console.log(this.data.showView)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
    console.log(this.data.sceneryid)
    
  },

  joinPlan: function () {
    if (app.globalData.openid) {
      var that = this;
      const db = wx.cloud.database()
      db.collection('message').add({
        data: {
          planid:that.data.planid,
          createid:that.data.plan._openid,
          applyid: app.globalData.openid,
          applytime:that.data.time,
          sceneryname:that.data.plan.sceneryname,
          year:that.data.plan.year,
          month:that.data.plan.month,
          day:that.data.plan.day
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
                wx.redirectTo({
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
      this.data.applyidList.push(app.globalData.openid)
      wx.cloud.callFunction({
        name: 'update',
        data: {
          id: this.data.planid,
          applyidList: this.data.applyidList,
          joinidList:this.data.joinidList
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
        duration:500,
        
      });
      setTimeout(function () {
        wx.switchTab({
          url: '../userPage/userPage',
        })
      }, 500);
    }
  },

  releasePlan:function(){
    var that = this;
    const db = wx.cloud.database()
    db.collection('Cplan').doc(that.data.planid).update({
      data: {
        status: '1',
      },
      success: res => {
        wx.showToast({
          title: '计划发布成功',
          duration: 500,

        });
        setTimeout(function () {
          wx.switchTab({
            url: '../userPage/userPage',
          })
        }, 500);
      }
    })
  },

  surePlan: function () {
    var that = this;
    const db = wx.cloud.database()
    db.collection('Cplan').doc(that.data.planid).update({
      data: {
        status: '2',
      },
      success: res => {
        wx.showToast({
          title: '计划确认成功',
          duration: 500,

        });
        setTimeout(function () {
          wx.switchTab({
            url: '../userPage/userPage',
          })
        }, 500);
      }
    })
  },

  deletePlan:function(){
    var that = this;
    const db = wx.cloud.database()
    wx.cloud.callFunction({
      name: 'delete',
      data: {
        planid: that.data.planid,
      },
      fail: err => {
        console.error('[云函数]调用失败：', err)
      }
    })
    db.collection('Cplan').doc(that.data.planid).remove({
      success: res => {
        wx.showToast({
          title: '计划删除成功',
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
        wx.showToast({
          icon: 'none',
          title: '计划删除失败'
        })
        console.error('[数据库] [删除记录] 失败：', err)
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