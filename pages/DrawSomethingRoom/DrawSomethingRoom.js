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
            id:'',
            iconUrl:'',
            isOwner:false
        },
        userList:[
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
            }
        ]
    },
    onLoad:function(options){
        var that = this;
        socketOpen = true;
        that.setData({
            myInfo:{
                name:app.globalData.userInfo.nickName,
                id:app.globalData.openID,
                iconUrl:app.globalData.userInfo.avatarUrl,
                isOwner:false
            }
        });
        sendSocketMessage(JSON.stringify({
            reqAction:'GetRoomInfo',
            reqData:wx.getStorageSync('nowRoom')
        }));
        wx.onSocketOpen(function(res) {
            socketOpen = true;
            console.log(socketOpen);
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
                        name:getUserList[i].userName
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
            }else if(rspData.respAction=='JoinRoom'){//有新用户加入
                let getUserList = rspData.resultData.userList;
                let setUserList=[];
                for(var i=0;i<getUserList.length;i++){
                    setUserList[i] = {
                        firstName:getUserList[i].userName.substring(0,1),
                        name:getUserList[i].userName
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
            }else if(rspData.respAction=='Chat'){//有新用户加入
                let chatData = rspData.resultData;
                var messageList = that.data.messageList;
                messageList.push(chatData);
                that.setData({
                    messageList:messageList
                })
            }else if(rspData.respAction=='Start'){//有新用户加入
                let keyWord = rspData.resultData.keyWord;
                wx.redirectTo({
                    url: '../DrawSomething/DrawSomething?keyWord='+keyWord
                });
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
        let reqJson ={
            roomInfo:wx.getStorageSync('nowRoom')
        }
        sendSocketMessage(JSON.stringify({
            reqAction:'Start',
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
        let reqJson ={
            roomInfo:wx.getStorageSync('nowRoom'),
            message:that.data.inputText
        }
        var data = {
                name:that.data.myInfo.name,
                iconUrl:that.data.myInfo.iconUrl,
                message:that.data.inputText,
                isMe:true
            };
        var messageList = that.data.messageList;
        messageList.push(data);
        that.setData({
            messageList:messageList
        })
        sendSocketMessage(JSON.stringify({
            reqAction:'Chat',
            reqData:reqJson
        }));
    }
})