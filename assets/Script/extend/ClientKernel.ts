import Encrypt from "./Encrypt";
import Util from "./Util";
import gameCMD from "./GameCMD";
import gameConst from "./gameConst";
import GameUserManager from "./GameUserManager";
import { EventManager } from "../common/managers/EventManager";
import { DataVO } from "../plaza/model/DataVO";
import io = require('../extend/libs/socket.io.js');
import SystemToast from "./ui/SystemToast";
import { exitEnum } from "./MPDefine";
import MPConfig from "./MPConfig";

//客户端通讯子类
export default class ClientKernel {
    webSocket = null;
    gameEngine = null;
    gameStatus = null;
    myUserItem = null;
    myUserID = null;
    loginSuccess: boolean = false;       //登录是否成功
    uuid = null;
    connected = false;
    transfer = [];
    url = null;
    port = null;
    connectId;
    interval = null;
    gameConfig = null;

    public static GetInstance(): ClientKernel {
        if (ClientKernel._instance == null) {
            ClientKernel._instance = new ClientKernel();
        }
        return ClientKernel._instance;
    }

    private static _instance = null;

    init(userID, uuid) {
        this.myUserID = userID;
        this.uuid = uuid;
        this.connected = false;

        this.transfer = [];
    }

    webSocketSend(data) {
        cc.log(data)
        data && this.transfer.push(data);
        if (data) {
            //cc.log("子连接消息发出：" + data.mainCMD + "," + data.subCMD)
        }
        if (this.webSocket == null || !this.connected) {
            setTimeout(this.webSocketSend.bind(this), 1000);
            return;
        }
        for (var i = 0; i < this.transfer.length; i++) {
            data = Encrypt.packetData(this.transfer[i], this.webSocket);
            this.webSocket.send(data);
        }

        this.transfer.length = 0;
    }

    connect(url, port, path?) {

        // mpApp.showWaitLayer("正在连接服务器...");
        DataVO.GD.disconnected = false

        this.port = port;

        if (MPConfig.sslFlag) {
            url = "wss://" + url + ":" + port;
        } else {
            url = "ws://" + url + ":" + port;
        }
        // url = "ws://" + url + ":" + port;
        cc.log("正在连接中...", url + `/${path}/socket.io`);
        cc.log(GameUserManager.GetInstance().tableUserItem)
        // if(cc.sys.isBrowser){
        // this.webSocket = io.connect(url+'/Client', { path: `/${path}/socket.io` });
        this.webSocket = io.connect(url, { path: `/${path}/socket.io` });
        // }else if(cc.sys.isNative){
        //     this.webSocket = io.connect(url,cc.url.raw("resources/cer/3867974_server.gpaly.cc.pem"));
        // }
        this.webSocket.tag = "GAME_Client";

        this.webSocket.on("connect", () => {
            cc.log("连接成功", url);

            // mpApp.removeWaitLayer();
            this.connected = true;

            this.connectId = this.connectId || Util.generateUUID();
            cc.log("connectIdconnectIdconnectIdconnectId" + this.connectId);
            this.webSocket.emit("handshakeData", JSON.stringify({ id: this.connectId }));

            this.interval && clearInterval(this.interval);

            this.interval = setInterval(() => {
                if (!this.connected)
                    return;
                this.webSocket && this.webSocket.emit("heartbeatData", JSON.stringify({}));
            }, 1000);
            this.onClientReady();
        });

        this.webSocket.on("disconnect", () => {
            this.connected = false;
            this.loginSuccess = false;
            cc.log("断开连接", url);
            // SystemToast.GetInstance().buildToast('服务器已经断开连接');  
            DataVO.GD.disconnected = true
            cc.log(DataVO.GD.exitType + '      ' + (DataVO.GD.exitType != exitEnum.forceExit) + '   ' + (DataVO.GD.exitType != exitEnum.beKicked))
            if (cc.director.getScene().name == "SG_F_CSBY_MainScene" && DataVO.GD.exitType != exitEnum.forceExit && DataVO.GD.exitType != exitEnum.beKicked) {
                this.stopWebSocket()
                // SystemToast.GetInstance().buildPrompt('网络已经断开，请刷新界面', 1, () => {
                //     // cc.director.loadScene('RoomScene');
                //     window.location.href = window.location.href
                // }, null)

                SystemToast.GetInstance().buildPromptNew('发生错误，请重新登入', 9005, 1, () => {
                    // cc.director.loadScene('RoomScene');
                    window.location.href = window.location.href
                }, null)
            }
            //this.onEventDisconnect();
        });

        this.webSocket.on("error", (error) => {
            this.connected = false;
            this.loginSuccess = false;
            cc.log(error.stack);
            //this.onEventDisconnect();
            SystemToast.GetInstance().buildPromptNew('发生错误，请重新登入', 9005, 1, () => {
                // cc.director.loadScene('RoomScene');
                window.location.href = window.location.href
            }, null)
        });

        this.webSocket.on("connect_timeout", (error) => {
            cc.log(error.stack);
            //this.onEventDisconnect();
            SystemToast.GetInstance().buildPromptNew('发生错误，请重新登入', 9005, 1, () => {
                // cc.director.loadScene('RoomScene');
                window.location.href = window.location.href
            }, null)
        });

        this.webSocket.on("message", (data) => {
            // if (cc.sys.isNative)
            //     "undefined" != data && null != data && (data = JSON.parse(data));

            // cc.log("message", JSON.stringify(data, null, 4));
            this.onEventMessage(data);
        });


    }

    startConnect(url, port) {
        var index = url.lastIndexOf(":");
        this.url = parseInt(url.substring(index + 1));
        this.port = parseInt(url.substring(index + 1));


        this.connect(url, this.port);
    }
    /**
     * 停止websocket服务器
     */
    stopWebSocket() {
        cc.log("stopWebSocket")
        this.webSocket && this.webSocket.disconnect();
        this.webSocket = null;
    }

    onEventDisconnect() {
        this.webSocket = null;
        this.connected = false;
        // SystemToast.GetInstance().buildToast("正在尝试重新连接服务器...");
        //等待2秒刷新可用服务器
        setTimeout(() => {
            this.connect(this.url, this.port);
        }, 2000);
    }

    /**
     * 消息事件
     * @param data
     * @returns {boolean}
     */
    onEventMessage(data) {
        //cc.log("子游戏连接消息返回：" + data["mainCMD"] + "," + data["subCMD"] + "   " + data['msgTime'])
        switch (data["mainCMD"]) {
            case gameCMD.MDM_GR_LOGON:
                this.onSocketMainLogon(data["subCMD"], data["data"]);
                return true;
            case gameCMD.MDM_GR_USER:
                this.onSocketMainUser(data["subCMD"], data["data"]);
                return true;
            case gameCMD.MDM_GF_GAME:
                EventManager.getInstance().raiseEvent(data["mainCMD"], data);
                return true;
            case gameCMD.MDM_GF_FRAME:
                this.onSocketMainFrame(data["subCMD"], data);
                return true;
        }
    }

    /**
     * 登录处理函数
     * @param subCMD
     * @param data
     * @returns {boolean}
     */
    onSocketMainLogon(subCMD, data) {
        switch (subCMD) {
            //登录成功
            case gameCMD.SUB_GR_LOGON_SUCCESS:
                cc.log("登录成功")
                DataVO.GD.isLookonMode = data.wantLookon; // 是旁观者
                if (data.wantLookon) {
                    this.myUserItem = GameUserManager.GetInstance().getTableUserItem(data.chairID);
                    this.myUserID = this.myUserItem.userID;
                    this.gameConfig = data["gameConfig"];

                } else {
                    //登录成功就获取自己
                    this.myUserID = data["userID"];
                    this.gameConfig = data["gameConfig"];
                    this.myUserItem = GameUserManager.GetInstance().getUserByUserID(this.myUserID);
                }
                this.loginSuccess = true;
                this.onReady();
                return true;
                break;
            case gameCMD.SUB_GR_LOGON_FAILURE:
                cc.log("登录失败")
                cc.log(data)
                break;
            default:
                return true;
        }
    }
    //登录消息
    onClientReady() {
        cc.log("onClientReadyonClientReadyonClientReadyonClientReadyonClientReadyonClientReady")
        this.webSocketSend({
            mainCMD: gameCMD.MDM_GR_LOGON,
            subCMD: gameCMD.SUB_GR_LOGON_ACCOUNTS,
            data: { userID: this.myUserID, uuid: this.uuid }
        });
    }

    onReady() {
        cc.log("onReadyonReadyonReadyonReady")
        cc.log(this.myUserItem)
        this.onEventSelfEnter(this.myUserItem);
        //获取场景游戏信息
        this.webSocketSend({ mainCMD: gameCMD.MDM_GF_FRAME, subCMD: gameCMD.SUB_GF_GAME_OPTION });

        //自己先进
        this.onUserItemActive(this.myUserItem);
        //其他玩家进入
        for (var i = 0; i < GameUserManager.GetInstance().tableUserItem.length; ++i) {
            var userItem = GameUserManager.GetInstance().tableUserItem[i];
            if (!userItem || userItem == this.myUserItem) continue;
            this.onUserItemActive(userItem);
        }
    }

    /**
     * 用户命令函数
     * @param subCMD
     * @param data
     * @returns {boolean}
     */
    onSocketMainUser(subCMD, data) {
        switch (subCMD) {
            case gameCMD.SUB_GR_USER_ENTER:
                this.onUserEnter(data);
                return true;
            case gameCMD.SUB_GR_USER_STATUS:
                this.onSubUserStatus(data);
                return true;
            case gameCMD.SUB_GR_USER_SCORE:
                this.onSubUserScore(data);
            default:
                return true;
        }
    }

    /**
     * 框架命令函数
     * @param subCMD
     * @param data
     * @returns {boolean}
     */
    onSocketMainFrame(subCMD, data) {
        switch (subCMD) {
            case gameCMD.SUB_GF_GAME_SCENE:
                cc.log("场景消息")
                //this.gameEngine.onEventSceneMessage(this.gameStatus, data);
                EventManager.getInstance().raiseEvent(gameCMD.SUB_GF_GAME_SCENE.toString(), data);
                return true;
            case gameCMD.SUB_GF_RECONNECT:
                cc.log("gameCMD.SUB_GF_RECONNECTgameCMD.SUB_GF_RECONNECTgameCMD.SUB_GF_RECONNECT");
                data.userItems && this.onReconnect(data.userItems);
                this.gameStatus = typeof (data["gameStatus"]) != "undefined" ? data["gameStatus"] : this.gameStatus;
                //this.gameEngine.onEventReconnectScene && this.gameEngine.onEventReconnectScenta),,,,
                SystemToast.GetInstance().buildToast('重连成功')
                return true;
            case gameCMD.SUB_GF_GAME_STATUS:
                this.gameStatus = data["gameStatus"];
                return true;
            case gameCMD.SUB_GF_FISH_NOTICE:
                cc.log('这个是主命令来的消息 44444444 ' + data['mainCMD'] + '子命令   ' + data['subCMD']);
                EventManager.getInstance().raiseEvent(gameCMD.SUB_GF_GAME_SCENE.toString(), data);
                return true;
            default:
                cc.log('踢出消息走的这里~~~~~~')
                cc.log(data["mainCMD"])
                cc.log(data)
                EventManager.getInstance().raiseEvent(data["mainCMD"], data);
                return true;
        }
    }

    /**
     * 发送消息
     * @param mainCMD
     * @param subCMD
     * @param data
     */
    sendSocketData(mainCMD, subCMD, data) {
        var o = {};
        o["mainCMD"] = mainCMD;
        o["subCMD"] = subCMD;
        o["data"] = data;
        this.webSocketSend(o);
    }

    /**
     * 用户状态
     * @param data 数据
     * @returns {boolean}
     */
    onSubUserStatus(data) {
        var userID = data["userID"];
        var tableID = data["tableID"];
        var chairID = data["chairID"];
        var userStatus = data["userStatus"];

        var userItem = GameUserManager.GetInstance().getUserByUserID(userID);
        if (userItem == null) return true;

        if (userStatus <= gameConst.US_FREE) {
            GameUserManager.GetInstance().deleteUserItem(userItem);
        } else {
            GameUserManager.GetInstance().updateUserItemStatus(userItem, {
                tableID: tableID,
                chairID: chairID,
                userStatus: userStatus
            });
        }

        return true;
    }
    /**
     * 用户分数变更
     * @param data
     */
    onSubUserScore(data) {
        var userID = data["userID"];
        var score = data["score"];

        var userItem = GameUserManager.GetInstance().getUserByUserID(userID);
        if (userItem == null) return true;

        GameUserManager.GetInstance().updateUserItemScore(userItem, score);
    }

    /**
     * 用户进入
     * @param data
     * @returns {boolean}
     */
    onUserEnter(data) {
        var infoArray = data;
        cc.log("用户进入用户进入用户进入用户进入")
        cc.log(infoArray)
        cc.log(GameUserManager.GetInstance().tableUserItem)
        for (var i = 0; i < infoArray.length; ++i) {
            //创建玩家
            GameUserManager.GetInstance().createNewUserItem(infoArray[i]);
        }
    }

    /**
     * 重新连接
     */

    onReconnect(userItems) {
        cc.log("onReconnectonReconnectonReconnectonReconnect");
        var getUerItemByChairID = function (chairID) {
            var userItem = null;
            for (var z = 0; z < userItems.length; z++) {
                if (userItems[z].chairID == chairID) {
                    userItem = userItems[z];
                    break;
                }
            }
            return userItem;
        };
        for (var i = 0; i < gameConst.GAME_PLAYER_NUM; i++) {
            var userItem = getUerItemByChairID(i);
            var oldUserItem = GameUserManager.GetInstance().getTableUserItem(i);

            if (!userItem) {
                GameUserManager.GetInstance().deleteUserItem(oldUserItem);
            } else if (oldUserItem && userItem.userID == oldUserItem.userID) {
                var statusInfo = {
                    "tableID": userItem.tableID,
                    "chairID": userItem.chairID,
                    "userStatus": userItem.userStatus
                };
                GameUserManager.GetInstance().updateUserItemScore(oldUserItem, userItem.score);
                GameUserManager.GetInstance().updateUserItemStatus(oldUserItem, statusInfo);
            } else if (oldUserItem && userItem.userID != oldUserItem.userID) {
                GameUserManager.GetInstance().deleteUserItem(oldUserItem);
                GameUserManager.GetInstance().createNewUserItem(userItem);
            } else if (!oldUserItem) {
                GameUserManager.GetInstance().createNewUserItem(userItem);
            }
        }
    }

    /**
     * 切换视图椅子
     * @param chairID
     */
    switchViewChairID(chairID) {
        var chairCount = gameConst.GAME_PLAYER_NUM;
        var viewChairID = Math.floor((chairID + chairCount * 3 / 2 - this.myUserItem.getChairID()) % chairCount);
        return viewChairID;
    }


    /**
     * 获取自己椅子ID
     * @returns {*}
     */
    getMeChairID() {
        return this.myUserItem.getChairID();
    }

    /**
     * 获取自己
     * @returns {null}
     */
    getMeUserItem() {
        return this.myUserItem;
    }

    /**
     * 获取座位玩家
     * @param chairID
     * @returns {*}
     */
    getTableUserItem(chairID) {
        return GameUserManager.GetInstance().getTableUserItem(chairID);
    }
    /**
     * 通过UserID获取用户
     * @param userID
     * @returns {*}
     */
    getUserByUserID(userID) {
        return GameUserManager.GetInstance().getUserByUserID(userID);
    }

    /**
     * 通过游戏ID获取用户
     */
    getUserByGameID(gameID) {
        return GameUserManager.GetInstance().getUserByGameID(gameID);
    }

    /**
     * 发送准备
     * @returns {boolean}
     */
    sendUserReady() {
        this.webSocketSend({ mainCMD: gameCMD.MDM_GF_FRAME, subCMD: gameCMD.SUB_GF_USER_READY });
        return true;
    }

    /**
     *用户信息变化处理
     */
    /**
     * 玩家激活
     * @param userItem
     * @returns {boolean}
     */
    onUserItemActive(userItem) {
        cc.log("onUserItemActiveonUserItemActiveonUserItemActiveonUserItemActive")
        cc.log(userItem)
        cc.log(this.loginSuccess)
        if (!userItem || !this.loginSuccess) {
            return false;
        }
        EventManager.getInstance().raiseEvent("onUserEnter", userItem)
    }

    /**
     * 玩家删除
     * @param userItem
     * @returns {boolean}
     */
    onUserItemDelete(userItem) {
        if (userItem == null) {
            return false;
        }
        cc.log("onUserItem Delete");
        EventManager.getInstance().raiseEvent("onUserLeave", userItem)
    }

    /**
     * 分数更新
     * @param userItem
     * @param scoreInfo
     * @returns {boolean}
     */
    onUserItemUpdateScore(userItem, scoreInfo) {
        if (userItem == null) {
            return false;
        }
        //this.gameEngine.onEventUserScore(userItem);
    }

    /**
     * 状态更新
     * @param userItem
     * @param statusInfo
     * @returns {boolean}
     */
    onUserItemUpdateStatus(userItem, statusInfo) {
        //this.gameEngine.onEventUserStatus(userItem);
    }

    /**
     * 自己进入
     * @param userItem
     * @returns {boolean}
     */
    onEventSelfEnter(userItem) {
        cc.log("自己进入自己进入")
        //旋转视图的处理
        DataVO.GD.meChairID = userItem.getChairID();
        DataVO.GD.GPlayerNum = 4;
        DataVO.GD.isRotation = DataVO.GD.meChairID >= DataVO.GD.GPlayerNum / 2;
        if (DataVO.GD.isRotation) {
            //旋转视图
            DataVO.GD.mainScene.rotationView();
        } else {
            DataVO.GD.mainScene.initLayerPosition()
            DataVO.GD.isShaking = false
        }
    }

    /**
     * 获取游戏配置
     * @returns {null}
     */
    getGameConfig() {
        return this.gameConfig;
    }
}