// miniprogram/pages/addPlan/addPlan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sceneryid:"",
    sceneryname:"",
    region: ['江苏省', '南京市', '鼓楼区'],
    dateIndex:[0,0,0],
    dateArray:[],
    year: "",
    month: "",
    day: "",
    time: '12:00',
    planMessage:""
  },
  
  // 点击地区组件确定事件
  bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  //月份计算
  surplusMonth: function (year) {
    var date = new Date();
    var year2 = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var monthDatas = [];
    if (year == year2) {
      var surplusMonth = 12 - month;
      monthDatas.push(month + "月")
      for (var i = month; i < 12; i++) {
        monthDatas.push(i + 1 + "月")
      }
    } else {
      for (var i = 0; i < 12; i++) {
        monthDatas.push(i + 1 + "月")
      }
    }
    return monthDatas;
  },
  //天数计算
  surplusDay: function (year, month, day) {
    var days = 31;
    var dayDatas = [];
    var date = new Date();
    var year2 = date.getFullYear()
    var month2 = date.getMonth() + 1
    switch (parseInt(month)) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        days = 31;
        break;

      //对于2月份需要判断是否为闰年
      case 2:
        if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
          days = 29;
          break;
        } else {
          days = 28;
          break;
        }
      case 4:
      case 6:
      case 9:
      case 11:
        days = 30;
        break;
    }
    if (year == year2 && month == month2) {
      dayDatas.push(day + "日")
      for (var i = day; i < days; i++) {
        dayDatas.push(i + 1 + "日")
      }
    } else {
      console.log(month + "月" + days + "天")
      for (var i = 0; i < days; i++) {
        dayDatas.push(i + 1 + "日")
      }
    }
    console.log(dayDatas)
    return dayDatas;
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
    // 查询当前用户所有的 counters
    db.collection('scenery').where({
      _id: this.data.sceneryid
    }).get({
      success: res => {
        console.log(res);
        that.setData({
          sceneryname: res.data[0].sceneryname
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
    var date = new Date();
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var surplusMonth = this.surplusMonth(year);
    console.log(surplusMonth)
    var surplusDay = this.surplusDay(year, month, day);
    console.log(surplusDay)
    this.setData({
      dateArray: [[year + '年', (year + 1) + '年', (year + 2) + '年'],
        surplusMonth,
        surplusDay],
      year:year,
      month:month,
      day:day,
    })
  },

  //日期某一列的值改变时触发
  dateColumnChange: function (e) {
    var date = new Date();
    var year1 = date.getFullYear()
    var month1 = date.getMonth() + 1
    var day1 = date.getDate()
    console.log("当前年份" + this.data.year + '修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      dateArray: this.data.dateArray,
      dateIndex: this.data.dateIndex,
      year: this.data.year,
      month: this.data.month,
      day: this.data.day,
    };
    data.dateIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        var yearStr = data.dateArray[e.detail.column][e.detail.value];
        var year = yearStr.substring(0, yearStr.length - 1)
        data.year = parseInt(year);
        var surplusMonth = this.surplusMonth(year);
        data.dateArray[1] = surplusMonth;
        if (data.year == year1) {
          data.month = month1;
        } else {
          data.month = 1;
        }
        if (data.year == year1 && month1 == data.month) {
          data.day = day1;
        } else {
          data.day = 1;
        }
        var surplusDay = this.surplusDay(data.year, data.month, data.day);
        data.dateArray[2] = surplusDay;
        data.dateIndex[1] = 0;
        data.dateIndex[2] = 0;
        break;
      case 1:
        console.log('选择月份' + data.dateArray[e.detail.column][e.detail.value]);
        var monthStr = data.dateArray[e.detail.column][e.detail.value];
        var month = monthStr.substring(0, monthStr.length - 1);
        data.month = month;
        data.day = 1;
        if (data.year == year1 && month1 == data.month) {
          data.day = day1;
        } else {
          data.day = 1;
        }
        var surplusDay = this.surplusDay(data.year, data.month, data.day);
        data.dateArray[2] = surplusDay;
        data.dateIndex[2] = 0;
        break;
      case 2:
        console.log('选择日' + data.dateArray[e.detail.column][e.detail.value]);
        var dayStr = data.dateArray[e.detail.column][e.detail.value];
        var day = dayStr.substring(0, dayStr.length - 1);
        data.day = day;
        break;
    }
    this.setData(data)
  },

  //日期value 改变时触发 change 事件
  dateChange: function (e) {
    var dateStr =
      this.data.dateArray[0][this.data.dateIndex[0]] +
      this.data.dateArray[1][this.data.dateIndex[1]] +
      this.data.dateArray[2][this.data.dateIndex[2]];
    console.log('picker发送选择改变，携带值为', dateStr)
    this.setData({
      orderData: dateStr
    })
  },

  //  点击时间组件确定事件  
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },

  //textarea组件输入内容修改触发事件
  bindTextAreaInput(e) {
    console.log(e.detail.value)
    this.setData({
      planMessage:e.detail.value
    })
  },

  /**
   * 旅游计划创建函数——监听旅游计划创建
   */
  onCreatePlan: function () {
    var that = this;
    const db = wx.cloud.database()
    db.collection('Cplan').add({
      data: {
        sceneryid:that.data.sceneryid,
        sceneryname:that.data.sceneryname,
        region: that.data.region,
        year: that.data.year,
        month: that.data.month,
        day: that.data.day,
        time: that.data.time,
        planMessage: that.data.planMessage,
        applyidList:[],
        joinidList:[],
        status:'0'
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
        })
        wx.showToast({
          title: '计划创建成功',
          success:function(){
            setTimeout(function(){
              wx.navigateBack({
                
              })
            },2000);
          }
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '计划创建失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  /**
   * 旅游计划发布函数——监听旅游计划发布
   */
  onReleasePlan: function () {
    var that = this;
    const db = wx.cloud.database()
    db.collection('Cplan').add({
      data: {
        sceneryid: that.data.sceneryid,
        sceneryname: that.data.sceneryname,
        region: that.data.region,
        year: that.data.year,
        month: that.data.month,
        day: that.data.day,
        time: that.data.time,
        planMessage: that.data.planMessage,
        applyidList: [],
        joinidList: [],
        status: '1'
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
        })
        wx.showToast({
          title: '计划发布成功',
          success: function () {
            setTimeout(function () {
              wx.navigateBack({

              })
            }, 2000);
          }
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '计划发布失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
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