var app = getApp();
var ex, ey;
var socketOpen = false;
var socketMsgQueue = [];
var userInfo;
function sendSocketMessage(msg) {
    if (socketOpen) {
        console.log('sendMessage:'+msg);
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
            id:'',
            iconUrl:''
        },
        roomList:[
        ],
        panelLeft:'100%'
    },
    onLoad:function(options){
        var that = this;
        //显示个人信息
        wx.getUserInfo({
            success: function (res) {
                console.log(res.userInfo);
                app.globalData.userInfo = res.userInfo
                that.setData({
                    myInfo:{
                        name:app.globalData.userInfo.nickName,
                        id:app.globalData.openID,
                        iconUrl:app.globalData.userInfo.avatarUrl
                    }
                });
                //登录
                userInfo = {
                    userId:app.globalData.openID,
                    userName:app.globalData.userInfo.nickName,
                    iconUrl:app.globalData.userInfo.avatarUrl
                }
                wx.showLoading({
                    title: '连接中',
                    mask:true
                });
                wx.connectSocket({
                    url: 'ws://koa.ngrok.zht88.top'
                });
            }
        })
        wx.onSocketOpen(function(res) {
            userInfo = {
                userId:app.globalData.openID,
                userName:app.globalData.userInfo.nickName,
                iconUrl:app.globalData.userInfo.avatarUrl
            }
            sendSocketMessage(JSON.stringify({
                reqAction:'Login',
                reqData:userInfo
            }));
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
                    console.log('ownerInfo:'+rspData.resultData.ownerInfo.userId);
                    console.log('myInfo'+that.data.myInfo.id);
                    if(rspData.resultData.ownerInfo.userId == that.data.myInfo.id){
                        //自己是创建者，自动进入房间
                        console.log('自己试创建者，将自动进入房间');
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
                                // that.createRoom();
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                }
            }else if(rspData.respAction=='JoinRoom'){
                if(rspData.respCode=='0000'){
                    wx.navigateTo({
                        url: '../DrawSomethingRoom/DrawSomethingRoom'
                    });
                }else{
                    wx.showModal({
                        title: '提示',
                        content: rspData.respDesc,
                        showCancel:false,
                        confirmText:'确定',
                        success: function(res) {
                            if (res.confirm) {
                                console.log('用户点击确定');
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
        wx.setStorageSync('nowRoom', dataJson);
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
        var that = this;
        console.log('加入房间');
        console.log(e.target.dataset.roomInfo);
        wx.setStorageSync('nowRoom', e.target.dataset.roomInfo);
        sendSocketMessage(JSON.stringify({
            reqAction:'JoinRoom',
            reqData:e.target.dataset.roomInfo
        }));
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