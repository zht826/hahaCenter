var app = getApp();
var ex, ey;
var socketOpen = true;
var socketMsgQueue = [];
var keyWord;
function draw(data) {
    var ctx = wx.createCanvasContext('ws');
    var  e = data;
    ctx.setFillStyle('grey');
    ctx.setStrokeStyle("black");
    ctx.setLineCap('round');
    ctx.setLineJoin('round');
    ctx.setLineWidth(5);
    console.log(JSON.stringify(data));
    if (e.sx && e.sy) {
        ex = e.sx;
        ey = e.sy;
        console.log('开始画了'+JSON.stringify(e));
        console.log(ex+','+ey);
        ctx.beginPath();
        ctx.moveTo(ex, ey);
    }
    if (e.ex && e.ey) {
        console.log('移动了:'+ex+','+ey);
        ctx.moveTo(ex, ey);
        ctx.lineTo(e.ex, e.ey);
        ctx.stroke();
        ctx.draw(true);
        ex = e.ex;
        ey = e.ey;
    }
};
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
        ]
    },
    onLoad:function(options){
        var that = this;
        keyWord = options.keyWord;
        console.log(keyWord);
        sendSocketMessage(JSON.stringify({
            reqAction:'GetRoomInfo',
            reqData:wx.getStorageSync('nowRoom')
        }));
        wx.onSocketOpen(function(res) {
            socketOpen = true;
            for (var i = 0; i < socketMsgQueue.length; i++){
                sendSocketMessage(socketMsgQueue[i]);
            }
            socketMsgQueue = [];
        })
        wx.onSocketMessage(function(res) {
            console.log('收到服务器内容：' + res.data);
            let rspData = JSON.parse(res.data);
            if(rspData.respAction=='GetRoomInfo'){
                let getUserList = rspData.resultData.userList;
                let setUserList=[];
                for(var i=0;i<getUserList.length;i++){
                    setUserList[i] = {
                        firstName:getUserList[i].userName.substring(0,1),
                        name:getUserList[i].userName,
                        soccer:0
                    }
                    if(getUserList[i].userId == that.data.myInfo.id){
                        let info = that.data.myInfo;
                        info.isOwner = getUserList[i].roomInfo.isOwner;
                        that.setData({
                            myInfo:info
                        })
                    }
                }
                that.setData({
                    userList:setUserList
                })
            }else if(rspData.respAction=='Draw'){
                var drawData = rspData.resultData.drawData;
                draw(JSON.parse(drawData));
            }else if(rspData.respAction=='Answer'){
                var result = rspData.resultData.result;
                if(result){
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

        let reqJson ={
            roomInfo:wx.getStorageSync('nowRoom'),
            drawData:JSON.stringify({ sx: e.touches[0].x, sy: e.touches[0].y })
        }
        sendSocketMessage(JSON.stringify({
            reqAction:'Draw',
            reqData:reqJson
        }));
    },
    drawMove:function(e){
        draw({ ex: e.touches[0].x, ey: e.touches[0].y });
        
        let reqJson ={
            roomInfo:wx.getStorageSync('nowRoom'),
            drawData:JSON.stringify({ sx: e.touches[0].x, sy: e.touches[0].y })
        }
        sendSocketMessage(JSON.stringify({
            reqAction:'Draw',
            reqData:reqJson
        }));
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
        // sendSocketMessage(that.data.inputText);
        let reqJson ={
            roomInfo:wx.getStorageSync('nowRoom'),
            answer:that.data.inputText
        }
        sendSocketMessage(JSON.stringify({
            reqAction:'Answer',
            reqData:reqJson
        }));
    }
})