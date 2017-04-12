//app.js
App({
  onLaunch: function () {
    var that = this;
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.globalData.PublicKeyString = this.globalData.PRO_PUBLICKEY;//设置为PRO_PUBLICKEY
    wx.login({
        success: function (res) {
          console.log(res)
          if (res.code) {
            //发起网络请求
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session',
              data: {
                appid: "wx03b289c784f00749",
                secret:"b8c0a7f2dd2ecb84a9fcb0be10fd6d86",
                js_code:res.code,
                grant_type:"authorization_code"
              },
              success:function(res){
                console.log(res)
                that.globalData.openID = res.data.openid;
              },
              fail:function(err){
                console.log(err)
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
  },
  onShow:function(){
      
  },
  globalData:{
    openID:"",
    userInfo:null
  }
})