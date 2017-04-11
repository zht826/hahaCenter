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
        }
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
    drawBegin:function(e){
        console.log(e);
        draw({ sx: e.touches[0].x, sy: e.touches[0].y });
        sendSocketMessage(JSON.stringify({ sx: e.touches[0].x, sy: e.touches[0].y }));
    },
    drawMove:function(e){
        draw({ ex: e.touches[0].x, ey: e.touches[0].y });
        sendSocketMessage(JSON.stringify({ ex: e.touches[0].x, ey: e.touches[0].y }));
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