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
            {
                name:'测试房间',
                id:'000001',
                userCount:1
            },
            {
                name:'测试房间',
                id:'000002',
                userCount:2
            }
        ],
        panelLeft:'100%'
    },
    onLoad:function(options){
        wx.connectSocket({
            url: 'ws://koa.ngrok.zht88.top'
        })
        wx.onSocketOpen(function(res) {
            socketOpen = true;
            for (var i = 0; i < socketMsgQueue.length; i++){
                sendSocketMessage(socketMsgQueue[i]);
            }
            socketMsgQueue = [];
        })
        wx.onSocketMessage(function(res) {
            console.log('收到服务器内容：' + res.data);
            if(res.data == '答对了！！'){
                wx.closeSocket();
            }else{
                draw(JSON.parse(res.data));
            }
            
        })
        wx.onSocketClose(function(res) {
            console.log('WebSocket 已关闭！');
        })
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
        wx.navigateTo({
            url: '../DrawSomethingRoom/DrawSomethingRoom',
            success:function(){
                that.setData({
                    panelLeft:'100%'
                });
            }
        });
        
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
    }
})