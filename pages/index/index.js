var app = getApp();
Page({
    data:{
        userInfo:"",
        nickName:"",
        userInfo:"",
        moduleData:[
            {
                title:'哈哈一笑',
                url:'../laugh/laugh',
                iconUrl:'../../img/hhyx.png',
                desc:''
            },{
                title:'你画我猜',
                url:'../canvas/canvas',
                iconUrl:'../../img/nhwc.png',
                desc:''
            },{
                title:'test1',
                url:'../laugh',
                iconUrl:'../../img/icon3.png',
                desc:''
            },{
                title:'哈哈哈哈哈哈哈哈',
                url:'../laugh',
                iconUrl:'../../img/icon4.png',
                desc:''
            },
        ]
    },
    onLoad:function(options){
        var that = this
            //调用应用实例的方法获取全局数据
        app.getUserInfo(function(userInfo){
            //更新数据
            that.setData({
                userInfo:userInfo
            })
        })
        this.setData({
            nickName:that.data.userInfo.nickName
        })
    },
    onShow:function(){
        // 生命周期函数--监听页面显示

    }
})