var app = getApp();
var ex, ey;
var socketOpen = false;
var socketMsgQueue = [];
function sendSocketMessage(msg) {
    if (socketOpen) {
        wx.sendSocketMessage({
            data:msg
        })
    } else {
        socketMsgQueue.push(msg);
    }
}
Page({
    data:{
        inputText:'',
        myInfo:{
            name:'张海涛',
            iconUrl:''
        },
        roomList:[
        ],
        panelLeft:'100%'
    },
    onLoad:function(options){
        var that = this;
        //显示个人信息
        this.setData({
            myInfo:{
                name:app.globalData.userInfo.nickName,
                iconUrl:app.globalData.userInfo.avatarUrl
            }
        });
        wx.showLoading({
            title: '连接中',
            mask:true
        });
        wx.connectSocket({
            url: 'ws://koa.ngrok.zht88.top'
        });
        wx.onSocketOpen(function(res) {
            wx.hideLoading();
            socketOpen = true;

            for (var i = 0; i < socketMsgQueue.length; i++){
                sendSocketMessage(socketMsgQueue[i]);
            }

            socketMsgQueue = [];
        });
        wx.onSocketMessage(function(res) {
            console.log('收到服务器内容：' + res.data);
            if(res.data == '答对了！！'){
                wx.closeSocket();
            }
            let rspData = JSON.parse(res.data);
            if(rspData.respAction=='Login'){
                //登录成功，收到广播列表
                that.setData({
                    roomList:rspData.resultData.roomList
                });
                if(rspData.resultData.roomList == ''){
                    wx.showModal({
                        title: '提示',
                        content: '暂时没有房间！',
                        cancelText:'知道了',
                        confirmText:'新建房间',
                        success: function(res) {
                            if (res.confirm) {
                                console.log('用户点击确定');
                                that.createRoom();
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                }
            }else if(rspData.respAction=='CreateRoom'){
                if(rspData.respCode=='0000'){
                    that.setData({
                        roomList:rspData.resultData.roomList
                    });
                    if(rspData.resultData.ownerInfo.userName == that.data.myInfo.name){
                        //自己试创建者，自动进入房间
                        wx.navigateTo({
                            url: '../DrawSomethingRoom/DrawSomethingRoom',
                            success:function(){
                                that.setData({
                                    panelLeft:'100%'
                                });
                            }
                        });
                    }
                }else{
                    wx.showModal({
                        title: '提示',
                        content: rspData.respDesc,
                        showCancel:false,
                        confirmText:'确定',
                        success: function(res) {
                            if (res.confirm) {
                                console.log('用户点击确定');
                                that.createRoom();
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                }
            }
        });
        wx.onSocketError(function(res){
            console.log('WebSocket连接打开失败，请检查！')
        });
        wx.onSocketClose(function(res) {
            console.log('WebSocket 已关闭！');
        });
        //登录
        let userInfo = {
            userId:app.globalData.openID,
            userName:app.globalData.userInfo.nickName,
            iconUrl:app.globalData.userInfo.avatarUrl
        }
        sendSocketMessage(JSON.stringify({
            reqAction:'Login',
            reqData:userInfo
        }));
    },
    onShow:function(){
        // 生命周期函数--监听页面显示

    },
    onUnload:function(){
        console.log('页面卸载了111');
    },
    createRoom:function(e){
        console.log(e);
        console.log('新建房间');
        this.setData({
            panelLeft:0,
        });
    },
    commit:function(){
        var that = this;
        var dataJson = {
            roomName:that.data.inputText
        }
        console.log(dataJson);
        sendSocketMessage(JSON.stringify({
            reqAction:'CreateRoom',
            reqData:dataJson
        }));
    },
    cancel:function(){
        this.setData({
            panelLeft:'100%'
        });
    },
    joinRoom:function(e){
        console.log('加入房间');
        console.log(e);
        wx.navigateTo({
            url: '../DrawSomethingRoom/DrawSomethingRoom'
        });
    },
    sendAnswer:function(){
        var that = this;
        sendSocketMessage(that.data.inputText);
    },
    writeContent:function(e){
        var that = this;
        // console.log(e.detail.value);
        this.setData({
            inputText:e.detail.value
        })
    },
})