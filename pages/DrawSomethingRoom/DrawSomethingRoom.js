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
        canvasLeft:'100%',
        myInfo:{
            name:'张海涛',
            iconUrl:'',
            isOwner:true
        },
        userList:[
            {
                firstName:'张',
                name:'张海涛',
                soccer:'1'
            },
            {
                firstName:'张',
                name:'张海涛',
                soccer:'1'
            },
            {
                firstName:'张',
                name:'张海涛',
                soccer:'1'
            },
            {
                firstName:'张',
                name:'张海涛',
                soccer:'1'
            },
            {
                firstName:'张',
                name:'张海涛',
                soccer:'1'
            },
            {
                firstName:'张',
                name:'张海涛',
                soccer:'1'
            }
        ],
        messageList:[
            {
                name:'哈哈',
                iconUrl:'',
                message:'哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
                isMe:true
            },{
                name:'test',
                iconUrl:'',
                message:'哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
                isMe:false
            },{
                name:'哈哈',
                iconUrl:'',
                message:'哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
                isMe:true
            },{
                name:'test',
                iconUrl:'',
                message:'哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
                isMe:false
            }
        ]
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
    start:function(e){
        console.log(e);
        console.log('开始游戏');
        wx.redirectTo({
            url: '../DrawSomething/DrawSomething'
        });
    },
    writeContent:function(e){
        var that = this;
        // console.log(e.detail.value);
        this.setData({
            inputText:e.detail.value
        })
    },
    sendAnswer:function(){
        var that = this;
        sendSocketMessage(that.data.inputText);
    }
})