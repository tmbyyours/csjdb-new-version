import Util from "../../extend/Util";
import SocketManager from "../../common/managers/SocketManager";
import { mpNetEvent } from "../../extend/MPDefine";
import { EventManager } from "../../common/managers/EventManager";
import GameUserManager from "../../extend/GameUserManager";
import GameGlobalData = require('../../extend/hotupdate/defines/GlobalGameData.js');
import SystemToast from "../../extend/ui/SystemToast";
import MPConfig from "../../extend/MPConfig";
import sha1 from "../../extend/sha1";
import SGRoomScene from "../../extend/ui/SGRoomScene";
import { DataVO } from "./DataVO";


//玩家数据类
export default class UserInfo {
    public static GetInstance(): UserInfo {
        if (UserInfo._instance == null) {
            UserInfo._instance = new UserInfo();
            UserInfo._instance.data = {};
            UserInfo._instance.eventList();
        }
        return UserInfo._instance;
    }
    public data;
    private static _instance = null;

    eventList(): void {
        EventManager.getInstance().addEventListener(mpNetEvent.VerifyUser, this.msgVerifyUser, this);
        EventManager.getInstance().addEventListener(mpNetEvent.KickOut, this.msgKickOut, this);
        EventManager.getInstance().addEventListener(mpNetEvent.GameKind, this.msgGameKind, this);
        EventManager.getInstance().addEventListener(mpNetEvent.GameList, this.msgGameList, this);
        EventManager.getInstance().addEventListener(mpNetEvent.GameRoomList, this.msgGRoomList, this);
        EventManager.getInstance().addEventListener(mpNetEvent.UserInfoUpdate, this.msgUIUpdate, this);
        EventManager.getInstance().addEventListener(mpNetEvent.UsersGameStatus, this.msgUsersGameStatus, this);
        EventManager.getInstance().addEventListener(mpNetEvent.AskPlayAchievement, this.msgAchieveMent, this);
        EventManager.getInstance().addEventListener(mpNetEvent.GetAchievement, this.msgGetAchievement, this);
    }
    public getData(): any {
        return this.data
    }
    public setData(_data: any, child?): any {
        if (child) {
            this.data[child] = Object.assign({}, this.data[child], _data);
        } else {
            this.data = Object.assign({}, this.data, _data);
        }
    }
    //玩家登录
    public toLogin(): void {
        // cc.sys.localStorage.clear();//测试代码        
        let plat = Util.getappVersion();
        if (plat.ios) {
            this.data["os"] = "iOS"
        } else if (plat.Android) {
            this.data["os"] = "Android"
        } else {
            this.data["os"] = "pc"
        }
        this.data["loginWay"] = '0'
        cc.log("玩家登录")
        cc.log(DataVO.GD.rs)
        cc.log(cc.sys.localStorage.getItem("userID"))
        cc.log(cc.sys.localStorage.getItem("loginType"))
        if (cc.sys.localStorage.getItem("userID") !== null && cc.sys.localStorage.getItem("loginType") != null) { // 二次登录
            if (cc.sys.localStorage.getItem("loginType") === "1") {// 账号登录
                this.data["account"] = cc.sys.localStorage.getItem("account");
                this.data["password"] = cc.sys.localStorage.getItem("password");
                SocketManager.getInstance().emit(mpNetEvent.VerifyUser, this.data)
            } else if (cc.sys.localStorage.getItem("loginType") === "2") {// 游客登录
                cc.log('游客登录111')
                cc.log(cc.sys.localStorage.getItem("guestID"))
                // this.data["guestID"] = cc.sys.localStorage.getItem("guestID");
                this.data["guestID"] = cc.sys.localStorage.getItem("guestID");
                this.data["loginType"] = "2"
                SocketManager.getInstance().emit(mpNetEvent.VerifyUser, this.data)
            }
        } else {//首次登录

            // this.data["params"] = {}
            // this.data["params"]["uuid"] = "213e2b0e-da03-4c28-a330-fa1a731a62b6"
            // this.data["params"]["moduleId"] = "12"
            // this.data["params"]["kindId"] = "3"
            // this.data["guestID"] = this.data["params"]["uuid"];
            // // this.setData({ params: params })
            // this.data["loginType"] = "6"
            // SocketManager.getInstance().emit(mpNetEvent.VerifyUser, this.data)
            // return

            let _headurl = '/static/head/head' + Util.randNum(1, 203) + '.jpg'
            this.data["headurl"] = _headurl
            if (MPConfig.loginType == "1") {// 账号登录
                cc.log('账号登录')
                this.data["account"] = Util.getGet()["user"];
                this.data["password"] = sha1.hex_sha1(Util.getGet()["pwd"]);
                this.data["loginType"] = "1"
                cc.sys.localStorage.setItem('account', this.data["account"])
                cc.sys.localStorage.setItem('password', this.data["password"])
                cc.sys.localStorage.setItem('loginType', 1)
                SocketManager.getInstance().emit(mpNetEvent.VerifyUser, this.data)
            } else if (MPConfig.loginType == "6") {// 三方登录
                cc.log('三方登录')
                // let des = decodeURI(Util.getGet()["params"])
                // cc.log(des)
                // // var paramsArray = CryptoJS.enc.Base64.parse(Util.getGet()["params"]);
                // var paramsArray = CryptoJS.enc.Base64.parse(des);
                // var parsedStr = paramsArray.toString(CryptoJS.enc.Utf8);
                // let params = Util.getStrArray(parsedStr)
                // cc.log("parsed:", parsedStr);
                this.data["guestID"] = this.data["params"]["uuid"];
                // this.setData({ params: params })
                this.data["loginType"] = "6"
                SocketManager.getInstance().emit(mpNetEvent.VerifyUser, this.data)
            } else {// 游客登录
                // cc.log('游客登录')
                // this.data["guestID"] = null
                // this.data["loginType"] = "2"
                // cc.sys.localStorage.setItem('loginType', 2)
                // SocketManager.getInstance().emit(mpNetEvent.VerifyUser, this.data)

                if (MPConfig.guestlogin || MPConfig.loginType == "2") {
                    cc.log('游客直接登录')
                    this.data["guestID"] = null
                    this.data["loginType"] = "2"
                    cc.sys.localStorage.setItem('loginType', 2)
                    SocketManager.getInstance().emit(mpNetEvent.VerifyUser, this.data)
                } else {
                    //手动登录
                    cc.log('游客手动登录')
                    SocketManager.getInstance().closeConnect()
                }
            }
        }
    }
    public msgKickOut(name, note) {
        // SystemToast.GetInstance().buildToast(note.msg);
        // SystemToast.GetInstance().buildPrompt(note.msg, 1, () => {
        //     window.location.href = window.location.href
        //     // if (cc.sys.isBrowser) {
        //     //     window.location.href = window.location.href
        //     // }
        //     // if (cc.sys.isNative) {
        //     //     cc.director.loadScene('RoomScene');
        //     // }
        // })
        cc.log(note.msg)
        let str = '您的账户被重复登入，请重新登入，或联系客服'
        if (note.msg.indexOf('维护') != -1) {
            str = '全服维护中，开服时间，请咨询客服!'
        }
        SystemToast.GetInstance().buildPromptNew(str, 102, 1, () => {
            window.location.href = window.location.href
            // if (cc.sys.isBrowser) {
            //     window.location.href = window.location.href
            // }
            // if (cc.sys.isNative) {
            //     cc.director.loadScene('RoomScene');
            // }
        })
        // cc.sys.localStorage.clear();
    }
    public msgVerifyUser(name, note) {
        cc.log(note)
        if (note.errMsg != null) {
            cc.log("登录失败")
            if (note.loginType === "6" || cc.sys.localStorage.getItem("loginType") === "1") {
                cc.sys.localStorage.clear();
                // SystemToast.GetInstance().buildToast(note.errMsg);
                // SystemToast.GetInstance().buildPrompt(note.errMsg, 1, () => {
                //     window.location.href = window.location.href
                //     // if (cc.sys.isBrowser) {
                //     //     window.location.href = window.location.href
                //     // }
                //     // if (cc.sys.isNative) {
                //     //     cc.director.loadScene('RoomScene');
                //     // }
                // })
                SystemToast.GetInstance().buildPromptNew(note.errMsg, 9005, 1, () => {
                    window.location.href = window.location.href
                    // if (cc.sys.isBrowser) {
                    //     window.location.href = window.location.href
                    // }
                    // if (cc.sys.isNative) {
                    //     cc.director.loadScene('RoomScene');
                    // }
                })
            } else if (cc.sys.localStorage.getItem("loginType") === "2" && cc.sys.localStorage.getItem("guestID") !== null) {
                let _headurl = '/static/head/head' + Util.randNum(1, 203) + '.jpg'
                this.data["guestID"] = null
                this.data["loginType"] = "2"
                this.data["headurl"] = _headurl
                SocketManager.getInstance().emit(mpNetEvent.VerifyUser, this.data)
            }
        } else {
            cc.log("登录成功")
            UserInfo.GetInstance().setData(note)
            cc.sys.localStorage.setItem('userID', note.userID)
            cc.log(cc.sys.localStorage.getItem("userID"))
            cc.log(cc.sys.localStorage.getItem("loginType"))
            if (cc.sys.localStorage.getItem("loginType") === "1") { // 账号登录
                cc.sys.localStorage.setItem('loginType', 1)
                cc.sys.localStorage.setItem('account', note.account)
                cc.sys.localStorage.setItem('password', note.password)
            } else if (cc.sys.localStorage.getItem("loginType") === "2") { // 游客登录
                cc.sys.localStorage.setItem('guestID', note.guestID)
            } else if (cc.sys.localStorage.getItem("loginType") === "3") { // qq登录
            } else if (cc.sys.localStorage.getItem("loginType") === "4") { // wx公众号登录
                cc.sys.localStorage.setItem('loginType', 4)
                //util.SAVE_LOCAL('user', 'refreshToken', this.$store.state.connector.servermessage.refreshToken)
            } else if (cc.sys.localStorage.getItem("loginType") === "5") { // wxapp登录
                cc.sys.localStorage.setItem('loginType', 5)
                cc.sys.localStorage.setItem('code', note.wxCode)
            } else if (cc.sys.localStorage.getItem("loginType") === "6") { // 手机登录
                cc.sys.localStorage.setItem('loginType', 6)
                cc.sys.localStorage.setItem('phone', note.phone)
                cc.sys.localStorage.setItem('guestID', note.guestID)
            }
            SocketManager.getInstance().emit(mpNetEvent.GameKind)
        }
    }
    public msgGameKind(name, note) {
        UserInfo.GetInstance().setData({ GameKind: note })
        SocketManager.getInstance().emit(mpNetEvent.GameList)
    }
    public msgGameList(name, note) {
        UserInfo.GetInstance().setData({ GameList: note })
        if (MPConfig.loginType == "6") {
            cc.log(this.data["params"])
            SocketManager.getInstance().emit(mpNetEvent.GameRoomList, { moduleID: this.data["params"]["moduleId"] })
        } else {
            SocketManager.getInstance().emit(mpNetEvent.GameRoomList, { moduleID: 12 })//写死的模块配置
        }
    }

    roomListOk = false
    achevementOk = false

    public checkEnter() {
        // if (this.roomListOk && this.achevementOk) {
        if (this.roomListOk) {
            GameGlobalData.curGame = 'RoomScene'
            cc.director.loadScene('RoomScene');
        }
    }

    public msgGRoomList(name, note) {
        UserInfo.GetInstance().setData({ GameRoomList: note })
        cc.log("大厅消息全部都来了1")
        cc.log(this.data)
        cc.log(MPConfig.loginType)
        if (note.room.length == 0) {
            SystemToast.GetInstance().buildToast("暂无开启房间");
        } else {
            if (MPConfig.loginType == "6") { //三方登录直接进入游戏
                // uiManager.close();
                //DataVO.GD.rs = new SGRoomScene();
                this.data.errorRoomId = false;
                /*rs.roomdatas = UserInfo.GetInstance().getData().GameRoomList.roomlist;
                rs.room = UserInfo.GetInstance().getData().GameRoomList.room;
                rs.eventList();*/
            }
            // GameGlobalData.curGame = 'RoomScene'
            // cc.director.loadScene('RoomScene');
            this.roomListOk = true
            this.checkEnter()
        }

    }

    msgAchieveMent(name, note) {
        cc.log(note)
        UserInfo.GetInstance().setData({ askAchieveMent: note })
    }

    msgGetAchievement(name, note) {
        cc.log('getgetget')
        cc.log(note)
        UserInfo.GetInstance().setData({ getAchieveMent: note })
        this.achevementOk = true
        this.checkEnter()
    }

    //玩家状态更新
    msgUsersGameStatus(name, note) {
        if (!note.errMsg) {
            GameUserManager.GetInstance().updateUserItem(note)
        } else {
            cc.log(note.errMsg)
        }
    }

    msgUIUpdate(name, note) {
        this.setData(note)
    }

    onDestroy() {
        EventManager.getInstance().removeEventListener(mpNetEvent.VerifyUser, this.msgVerifyUser);
        EventManager.getInstance().removeEventListener(mpNetEvent.GameKind, this.msgGameKind);
        EventManager.getInstance().removeEventListener(mpNetEvent.GameList, this.msgGameList);
        EventManager.getInstance().removeEventListener(mpNetEvent.GameRoomList, this.msgGRoomList);
        EventManager.getInstance().removeEventListener(mpNetEvent.AskPlayAchievement, this.msgAchieveMent, this);
        EventManager.getInstance().removeEventListener(mpNetEvent.GetAchievement, this.msgGetAchievement, this);
        EventManager.getInstance().removeEventListener(mpNetEvent.UsersGameStatus, this.msgUsersGameStatus, this);
        EventManager.getInstance().removeEventListener(mpNetEvent.UserInfoUpdate, this.msgUIUpdate, this);
    }

}