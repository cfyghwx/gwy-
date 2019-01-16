//app.js
// AppSecret:4599dd95b08311aaf8a746b14f707ed6
// access_token:{"access_token":"17_aILiR_lGdBRxr5pFFPZyyoyDrHhjwMW6lLJCBRG1VwhscJXVeWB5rWeqoaJqJGTFSDRV9eGApoX4WXwazoxyzUSYB65MFmDl1JlVXq9dm2trvZsximnNX9qyxyXhc42upFaOQ4-N3jWaAZGZFAMcAEABWI","expires_in":7200}
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {}
    this.globalData.openid = ""
  }
})
