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
        keyWord:'哈哈',
        myInfo:{
            name:'张海涛',
            id:'',
            iconUrl:'',
            isOwner:false
        },
        userList:[
            {
                firstName:'张',
                name:'张海涛',
                soccer:'0'
            }
        ],
        time:'60'
    },
    onLoad:function(options){
        var that = this;
        keyWord = options.keyWord;
        console.log(keyWord);
        socketOpen = true;
        that.setData({
            myInfo:{
                name:app.globalData.userInfo.nickName,
                id:app.globalData.openID,
                iconUrl:app.globalData.userInfo.avatarUrl,
                isOwner:false,
                isDrawing:true
            },
            keyWord:keyWord
        });

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
                        setUserList[i].name = '我';
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
                console.log('服务器Draw'+drawData);
                draw(JSON.parse(drawData));
            }else if(rspData.respAction=='Answer'){
                var data = rspData.resultData;
                if(data.result){
                    var userList = that.data.userList;
                    for(var i =0;i<userList.length;i++){
                        if(userList[i].name = data.userInfo.userName){
                            userList[i].soccer++;
                        }
                    }
                    that.setData({
                        userList:userList
                    })
                    if(data.isMe){
                        wx.showToast({
                            title: '恭喜，回答正确',
                            icon: 'success',
                            duration: 2000
                        })
                    }else{
                        wx.showToast({
                            title: '恭喜'+data.userInfo.userName+'，回答正确',
                            icon: 'success',
                            duration: 2000
                        })
                    }
                }else{
                    wx.showToast({
                        title: data.userInfo.userName+'回答错误',
                        icon: 'success',
                        duration: 2000
                    })
                }
            }else if(rspData.respAction=='NextPlayer'){
                var resultData = rspData.resultData;
                that.setData({
                    keyWord:resultData.keyWord
                });
                if(resultData.player.userId == that.data.myInfo.id){
                    let info = that.data.myInfo;
                    info.isDrawing = true;
                    that.setData({
                        myInfo:info
                    })
                }else{
                    let info = that.data.myInfo;
                    info.isDrawing = false;
                    that.setData({
                        myInfo:info
                    })
                }
            }else if(rspData.respAction=='UpdateTime'){
                var resultData = rspData.resultData;
                that.setData({
                    time:resultData.time
                })
            }else if(rspData.respAction=='GameOver'){
                var resultData = rspData.resultData;
                that.setData({
                    time:'游戏结束'
                })
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
            drawData:JSON.stringify({ ex: e.touches[0].x, ey: e.touches[0].y })
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