var app = getApp();
var that;
let n=1;
Page({
    data:{
        userInfo:"",
        nickName:"",
        userInfo:"",
        isReq:false,
        rtDeg:'0',
        scrollTop:"100",
        animationData: {},
        textModuleData:[
            {
                title:'',
                url:'../laugh',
                iconUrl:'',
                time:'',
                content:'',
                width:'',
                height:''
            }
        ],
        picModuleData:[
            {
                title:'test1',
                url:'../laugh',
                iconUrl:'',
                time:'2016-12-12',
                content:'哈哈哈哈哈哈哈',
                width:'',
                height:''
            }
        ],
        activeId:'0',
        slideIndex:'0',
        // apiIp:'http://v.juhe.cn/joke/randJoke.php',
        apiIp:'http://koa.ngrok.zht88.top/api/Joke',
        key:'8560ad007b5fb4ce2d18f6d912e0a17e'
    },
    onLoad:function(options){
        that = this;
        
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
        wx.request({
            url: that.data.apiIp, //仅为示例，并非真实的接口地址
            data: {
                key: that.data.key,
                // type:"pic"
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                console.log(res.data)
                var data = res.data.result;
                var temData = [];
                for(var i=0;i<data.length;i++){
                    temData[i]={};
                    temData[i].content = data[i].content;
                    temData[i].time = data[i].unixtime;
                    temData[i].iconUrl = data[i].url;
                }
                that.setData({
                    textModuleData: temData
                })
            }
        })
    },
    onShow:function(){
        // 生命周期函数--监听页面显示

    },
    imgSuc:function(e){
        var that = this;
        var temData = this.data.picModuleData;
        temData[e.target.id].height = e.detail.height;
        temData[e.target.id].width = e.detail.width;
        this.setData({
            picModuleData: temData
        })
    },
    changeActive: function(e) {
        var that = this;
        
        if(e.target.id==0){
            wx.request({
                url: that.data.apiIp, //仅为示例，并非真实的接口地址
                data: {
                    key: that.data.key,
                    // type:"pic"
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function(res) {
                    console.log(res.data)
                    var data = res.data.result;
                    var temData = [];
                    for(var i=0;i<data.length;i++){
                        temData[i]={};
                        temData[i].content = data[i].content;
                        temData[i].time = data[i].unixtime;
                        temData[i].iconUrl = data[i].url;
                    }
                    that.setData({
                        textModuleData: temData
                    })
                }
            })
        }else if(e.target.id==1){
            wx.request({
                url: that.data.apiIp, //仅为示例，并非真实的接口地址
                data: {
                    key: that.data.key,
                    type:"pic"
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function(res) {
                    console.log(res.data)
                    var data = res.data.result;
                    var temData = [];
                    for(var i=0;i<data.length;i++){
                        temData[i]={};
                        temData[i].content = data[i].content;
                        temData[i].time = data[i].unixtime;
                        temData[i].iconUrl = data[i].url;
                    }
                    that.setData({
                        picModuleData: temData
                    })
                }
            })
        }
        that.setData({
            activeId:e.target.id,
            slideIndex:e.target.id
        });
    },
    changeSlide:function(e){
        var that = this;
        if(e.detail.current==0){
            wx.request({
                url: that.data.apiIp, //仅为示例，并非真实的接口地址
                data: {
                    key: that.data.key,
                    // type:"pic"
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function(res) {
                    console.log(res.data)
                    var data = res.data.result;
                    var temData = [];
                    for(var i=0;i<data.length;i++){
                        temData[i]={};
                        temData[i].content = data[i].content;
                        temData[i].time = data[i].unixtime;
                        temData[i].iconUrl = data[i].url;
                    }
                    that.setData({
                        textModuleData: temData
                    })
                }
            })
        }else if(e.detail.current==1){
            wx.request({
                url: that.data.apiIp, //仅为示例，并非真实的接口地址
                data: {
                    key: that.data.key,
                    type:"pic"
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function(res) {
                    console.log(res.data)
                    var data = res.data.result;
                    var temData = [];
                    for(var i=0;i<data.length;i++){
                        temData[i]={};
                        temData[i].content = data[i].content;
                        temData[i].time = data[i].unixtime;
                        temData[i].iconUrl = data[i].url;
                    }
                    that.setData({
                        picModuleData: temData
                    })
                }
            })
        }
        that.setData({
            activeId:e.detail.current
        });

    },
    refresh:function(){
        if(!this.data.isReq){//先判断是否正在加载
            //设置正在加载标识
            this.setData({
                isReq:true
            });
            var that = this;
            let index = this.data.activeId;
            //点击后动画效果
            var animation = wx.createAnimation({
                duration: 750
            });
            this.animation = animation;
            animation.rotate(n*180).step();
            n++;
            this.setData({
                animationData:animation.export()
            });

            //动画持续
            var timer = setInterval(function(){
                if(that.data.isReq){
                    rt(n);
                    n++;
                }else{
                    clearInterval(timer);
                }
            }.bind(this), 750)
            function rt(n){
                animation.rotate(n*180).step()
                that.setData({
                    animationData:animation.export()
                })
            }
            //根据当前位置判断刷新文字页还是图片页
            if(index==0){
                wx.request({
                    url: that.data.apiIp, //仅为示例，并非真实的接口地址
                    data: {
                        key: that.data.key,
                        // type:"pic"
                    },
                    header: {
                        'content-type': 'application/json'
                    },
                    success: function(res) {
                        console.log(res.data)
                        var data = res.data.result;
                        var temData = [];
                        for(var i=0;i<data.length;i++){
                            temData[i]={};
                            temData[i].content = data[i].content;
                            temData[i].time = data[i].unixtime;
                            temData[i].iconUrl = data[i].url;
                        }
                        that.setData({
                            textModuleData: temData,
                            isReq:false
                        })
                    }
                })
            }else if(index==1){
                wx.request({
                    url: that.data.apiIp, //仅为示例，并非真实的接口地址
                    data: {
                        key: that.data.key,
                        type:"pic"
                    },
                    header: {
                        'content-type': 'application/json'
                    },
                    success: function(res) {
                        console.log(res.data)
                        var data = res.data.result;
                        var temData = [];
                        for(var i=0;i<data.length;i++){
                            temData[i]={};
                            temData[i].content = data[i].content;
                            temData[i].time = data[i].unixtime;
                            temData[i].iconUrl = data[i].url;
                        }
                        that.setData({
                            picModuleData: temData,
                            isReq:false
                        })
                    }
                })
            }
        }
    }
})