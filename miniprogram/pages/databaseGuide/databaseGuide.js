// pages/databaseGuide/databaseGuide.js

const app = getApp()

Page({

  data: {
    step: 1,
    counterId: '',
    openid: '',
    count: null,
    queryResult: '',
  },

  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
  },

  onAdd: function () {
    const db = wx.cloud.database()
    db.collection('scenery').add({
      data: {
        sceneryid: 1,
        sceneryname:"栖霞山",
        img:"../../images/1.jpg",
        description: "栖霞山位于南京市栖霞区，古称摄山，被誉为“金陵第一明秀山”，南朝时山中建有“栖霞精舍”，因此得名，是国家AAAA级旅游景区、中国四大赏枫胜地之一。历史上曾有五王十四帝登临栖霞山，其中乾隆六下江南，五次驻跸栖霞山。 栖霞山素有“六朝胜迹”之称，在明代被列为“金陵四十八景”之一，有“一座栖霞山，半部金陵史”的美誉。历史古迹遗址80多处，荟萃了宗教文化、帝王文化、绿色文化、民俗文化、地质文化、石刻文化、茶文化。千年古刹、佛学“三论宗”祖庭、佛教“四大丛林”之一的古栖霞寺就座落在栖霞山西麓。 自明代以来就有“春牛首、秋栖霞”之说，“栖霞丹枫”为新金陵四十景之一，山西侧的枫岭有成片的枫树，是栖霞山吸引游人的主要景致，为中国四大赏枫胜地之一。栖霞红叶种类很多，尤以枫香为主，包括红枫、鸡爪槭、三角枫、羽毛枫、榉树、黄连木等，每到深秋，山中漫山红遍，犹如晚霞栖落，蔚为壮观。"
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
          count: 1
        })
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  // onAdd: function () {
  //   const db = wx.cloud.database()
  //   db.collection('counters').add({
  //     data: {
  //       count: 1
  //     },
  //     success: res => {
  //       // 在返回结果中会包含新创建的记录的 _id
  //       this.setData({
  //         counterId: res._id,
  //         count: 1
  //       })
  //       wx.showToast({
  //         title: '新增记录成功',
  //       })
  //       console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
  //     },
  //     fail: err => {
  //       wx.showToast({
  //         icon: 'none',
  //         title: '新增记录失败'
  //       })
  //       console.error('[数据库] [新增记录] 失败：', err)
  //     }
  //   })
  // },



  onQuery: function() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('counters').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        this.setData({
          queryResult: JSON.stringify(res.data, null, 2)
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

  onCounterInc: function() {
    const db = wx.cloud.database()
    const newCount = this.data.count + 1
    db.collection('counters').doc(this.data.counterId).update({
      data: {
        count: newCount
      },
      success: res => {
        this.setData({
          count: newCount
        })
      },
      fail: err => {
        icon: 'none',
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },

  onCounterDec: function() {
    const db = wx.cloud.database()
    const newCount = this.data.count - 1
    db.collection('counters').doc(this.data.counterId).update({
      data: {
        count: newCount
      },
      success: res => {
        this.setData({
          count: newCount
        })
      },
      fail: err => {
        icon: 'none',
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },

  onRemove: function() {
    if (this.data.counterId) {
      const db = wx.cloud.database()
      db.collection('counters').doc(this.data.counterId).remove({
        success: res => {
          wx.showToast({
            title: '删除成功',
          })
          this.setData({
            counterId: '',
            count: null,
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '删除失败',
          })
          console.error('[数据库] [删除记录] 失败：', err)
        }
      })
    } else {
      wx.showToast({
        title: '无记录可删，请见创建一个记录',
      })
    }
  },

  nextStep: function () {
    // 在第一步，需检查是否有 openid，如无需获取
    if (this.data.step === 1 && !this.data.openid) {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          app.globalData.openid = res.result.openid
          this.setData({
            step: 2,
            openid: res.result.openid
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '获取 openid 失败，请检查是否有部署 login 云函数',
          })
          console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
        }
      })
    } else {
      const callback = this.data.step !== 6 ? function() {} : function() {
        console.group('数据库文档')
        console.log('https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database.html')
        console.groupEnd()
      }

      this.setData({
        step: this.data.step + 1
      }, callback)
    }
  },

  prevStep: function () {
    this.setData({
      step: this.data.step - 1
    })
  },

  goHome: function() {
    const pages = getCurrentPages()
    if (pages.length === 2) {
      wx.navigateBack()
    } else if (pages.length === 1) {
      wx.redirectTo({
        url: '../index/index',
      })
    } else {
      wx.reLaunch({
        url: '../index/index',
      })
    }
  }

})