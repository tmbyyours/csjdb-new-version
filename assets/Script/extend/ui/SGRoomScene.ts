import { UIView } from "../../common/managers/UIView";
import UserInfo from "../../plaza/model/UserInfo";
import { resLoader } from "../../common/res/ResLoader";
import { EventManager } from "../../common/managers/EventManager";
import { mpCZType, mpNetEvent } from "../MPDefine";
import SocketManager from "../../common/managers/SocketManager";
import SystemToast from "./SystemToast";
import MPConfig from "../MPConfig";
import GameUserManager from "../GameUserManager";
import GameGlobalData = require('../../extend/hotupdate/defines/GlobalGameData.js');
import { UIConf, uiManager } from "../../common/managers/UIManager";
import SoundManager from "../../common/managers/SoundManager";
import ClientKernel from "../ClientKernel";
import Util from "../Util";
import { DataVO } from "../../plaza/model/DataVO";
import { NodePool } from "../../common/res/NodePool";
import AchieveGame from "../../subgame/fish/caishenbuyu/common/AchieveGame";


const { ccclass, property } = cc._decorator;

export enum UIID {
    helpinfo,
}

export let UICF: { [key: number]: UIConf } = {
    [UIID.helpinfo]: { prefab: "plaza/prefab/ui/helpUI" },
}


const sourceCFG = { sounds: ['subgame/fish/caishenbuyu/sounds'], other: [] };
const path = 'subgame/fish/caishenbuyu/prefabs/';
const prefabsCFG = {
    OrganCannon: { name: 'OrganCannon', count: 1 },
    DrillCannon: { name: 'DrillCannon', count: 1 },
    CenserBead: { name: 'CenserBead', count: 1 },
    GodAdvent: { name: 'GodAdvent', count: 1 },
    GodFafa: { name: 'GodFafa', count: 1 },
    LuckRun: { name: 'LuckRun', count: 1 },
    JuBaoLianLian: { name: 'JuBaoLianLian', count: 1 },
    FengBaoFuGui: { name: 'FengBaoFuGui', count: 1 },
    ShanDianFuGui: { name: 'ShanDianFuGui', count: 1 },
    BaoZhuZhaoFu: { name: 'BaoZhuZhaoFu', count: 1 },
    Roulette: { name: 'Roulette', count: 1 },
    openredbag: { name: 'openredbag', count: 1 },
    minigun: { name: 'minigun', count: 1 },
    bullet1: { name: 'bullet1', count: 4 },
    bulletyanhua: { name: 'bulletyanhua', count: 4 },
    bulletbaihu: { name: 'bulletbaihu', count: 4 },
    bulletqinglong: { name: 'bulletqinglong', count: 4 },
    BulletPool: { name: 'bullet', count: 20 },
    MiniBulletPool: { name: 'minibullet', count: 8 },
    bulletNumPool: { name: 'bulletNum', count: 10 },
    FishNetPool: { name: 'fishNet', count: 12 },
    fishNewY: { name: 'fishNewY', count: 12 },
    fishNewH: { name: 'fishNewH', count: 12 },
    fishNewL: { name: 'fishNewL', count: 12 },
    baoJiNode: { name: 'baoJiNode', count: 12 },
    FishNet1Pool: { name: 'fishNet1', count: 12 },
    FishNet2Pool: { name: 'fishNet2', count: 12 },
    FishNet11Pool: { name: 'fishNet11', count: 12 },
    FireBubblePool: { name: 'SS_Fire_Bubble', count: 12 },
    ScorePool: { name: 'scoreNum', count: 10 },
    CoinPool: { name: 'coinNode', count: 10 },
    CoinBombPool: { name: 'coinbomb', count: 8 },

    lvGuiEffect: { name: 'lvGuiEffect', count: 8 },
    baoZhuEffect: { name: 'baoZhuEffect', count: 8 },
    sanDianGui: { name: 'sanDianGui', count: 8 },
    sanDian: { name: 'sanDian', count: 8 },
    coinEffect: { name: 'coinEffect', count: 8 },

};

@ccclass
export default class SGRoomScene extends UIView {

    @property({ type: cc.Sprite })
    background: cc.Sprite = null;

    @property({ type: cc.Button })
    settingBtn: cc.Button = null;

    @property({ type: cc.Button })
    backBtn: cc.Button = null;

    @property({ type: cc.Node })
    settingnode: cc.Node = null;

    @property({ type: cc.Node })
    settingbg: cc.Node = null

    @property({ type: cc.Label })
    userID: cc.Label = null;

    @property({ type: cc.Label })
    userScore: cc.Label = null

    @property({ type: cc.Layout })
    roomLayout: cc.Layout = null

    @property({ type: cc.Node })
    soundcover: cc.Node = null

    @property([cc.Node])
    ani: cc.Node[] = []

    @property(cc.Sprite)
    sor: cc.Sprite = null

    @property(cc.Node)
    loading: cc.Node = null
    @property(cc.Node)
    loading0: cc.Node = null
    @property(cc.ProgressBar)
    ps: cc.ProgressBar = null
    @property(cc.ProgressBar)
    ps0: cc.ProgressBar = null

    @property(cc.Node)
    jid: cc.Node = null

    @property({ type: cc.Label })
    ver: cc.Label = null;

    @property(cc.Sprite)
    tips: cc.Sprite = null

    @property(cc.SpriteAtlas)
    spa: cc.SpriteAtlas = null;

    @property({ type: cc.Node })
    playBtn: cc.Node = null

    @property({ type: cc.Node })
    achieveGame: cc.Node = null

    @property({ type: cc.Node })
    achieveGameCover: cc.Node = null


    showSetting: boolean;

    soundswitch: boolean = true;

    //房间数据
    roomdatas: any = false;
    room: any = null

    itemindex: number = 0;
    loadnum = 0;
    loadmax = 2;
    selectRoom = null;

    bo = false;
    curcount = 0;
    totcount = 56;
    onLoad() {
        //切换屏幕
        //加载音乐
        let m = Util.formatMoney(189.9938989899999999999999999)
        cc.log('555555555555555555555555')
        cc.log(m)
        if (DataVO.GD.preScene == 'ChooseScene') {
            this.tips.node.active = true
            // cc.log('加载图片为444444444444444  ' + `GP_Loading_Msg_0${DataVO.GD.tipsrd}_cn_png`);
            // // DataVO.GD.loadDone = (typeof DataVO.GD.loadDone == 'undefined') ? false : true
            // this.tips.spriteFrame = this.spa.getSpriteFrame(`GP_Loading_Msg_0${DataVO.GD.tipsrd}_cn_png`);
        }

        this.eventList()
        this.roomdatas = UserInfo.GetInstance().getData().GameRoomList.roomlist;
        this.room = UserInfo.GetInstance().getData().GameRoomList.room;
        SoundManager.getInstance().loadSoundConifg("subgame/fish/caishenbuyu/sounds/Music")
        // cc.log("onLoadonLoadonLoadonLoadonLoadonLoad" + MPConfig.loginType + "" + UserInfo.GetInstance().getData().errorRoomid)
        // if (MPConfig.loginType == "6" && !UserInfo.GetInstance().getData().errorRoomid) { //三方登录直接进入游戏
        //     this.loadmax = 1
        //     SoundManager.getInstance().loadSoundConifg("subgame/fish/caishenbuyu/sounds/Music")
        //     return
        // }

        if (cc.sys.isMobile) {
            if (Util.isFullScreen() == 'Full-Screen') {
                cc.find('newjiazai/ani', this.loading).scale = 0.6
                cc.find('newjiazai/bgd', this.loading).setScale(1.8, 2)
                cc.find('newjiazai/bgd', this.loading).y = -90
            } else {
                cc.find('newjiazai/ani', this.loading).scale = 0.7
                cc.find('newjiazai/bgd', this.loading).setScale(1.8, 2.2)
                cc.find('newjiazai/bgd', this.loading).y = -100
            }
        }

        if (DataVO.GD.loadCount == 1) {
            this.loading.active = false
            this.loading0.active = true
            cc.find('newjiazai', this.loading).active = true
        } else {
            this.loading.active = true
            this.loading.active = false
            cc.find('newjiazai', this.loading).active = false
        }
        let ext = cc.find('ndBar/loading/ext', this.loading0)
        if (DataVO.GD.gamestatus == 0) {
            DataVO.GD.gamestatus = 1
            this.loading.active = true;
            this.ps.progress = 0
            let it = 0;
            cc.director.getScheduler().schedule(() => {
                it += 0.03;
                if (it >= 1.0) {
                    it = 1.0;
                    this.jid.width = 246
                    this.loading.active = false;
                    ext.x = 500
                    cc.director.getScheduler().unscheduleAllForTarget(this.loading);
                    if (this.loadmusicflag) {
                        SoundManager.getInstance().playMusic(1, "subgame");
                    }
                }
                this.ps.progress = it
                this.ps0.progress = it
                ext.x = 535 * it > -18 ? 535 * it - 30 : -18
                this.jid.width = 246 * it;
            }, this.loading, 0.01, 1e+9, 0, false);
        }
        // SoundManager.getInstance().playMusic(1, "subgame");
        // 初始化数据
        this.userID.string = UserInfo.GetInstance().getData().nickname;
        cc.log(UserInfo.GetInstance().getData().GameList);
        // this.ver.string = 'ver.' + UserInfo.GetInstance().getData().GameList[0].version
        // this.ver.string = 'V ' + UserInfo.GetInstance().getData().GameList[0].version
        this.ver.string = 'ver.c3929b9'
        this.userScore.string = Util.formatMoney(UserInfo.GetInstance().getData().score > 0 ? UserInfo.GetInstance().getData().score : 0, ',', true);
        resLoader.loadRes("subgame/fish/caishenbuyu/images/GP_Loading_Background_png", cc.SpriteFrame, (error: Error, sp: cc.SpriteFrame) => {
            cc.log(error)
            this.background.spriteFrame = sp;
            EventManager.getInstance().raiseEvent("loadover")
            //resLoader.releaseAsset(sp);
        });

        this.roomdatas.sort((a, b) => { return a.sortID - b.sortID })
        cc.log(this.roomdatas);
        this.loadItem();

        // this.settingBtn.node.on(cc.Node.EventType.TOUCH_START, this.onSetting, this);
        this.settingBtn.node.on('click', this.onSetting, this);
        // this.backBtn.node.on(cc.Node.EventType.TOUCH_START, this.onBack, this);
        let chi = this.settingnode.children
        cc.log(chi);
        for (let i = 0; i < chi.length; i++) {
            chi[i].on(cc.Node.EventType.TOUCH_START, this.onSetingCallBack, this)
        }
        this.paoAndFish()
        let si = cc.winSize
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            let pp = cc.v2(event.getLocation().x - si.width * 0.5, event.getLocation().y - si.height * 0.5);
            // cc.log(pp.x + '     ' + pp.y);
            this.sor.node.setPosition(pp)
        }, this);

        this.soundswitch = SoundManager.getInstance().getEnable()
        this.soundcover.active = this.soundswitch;

        // let rd = Math.floor(Util.randNum(1, 9));
        // cc.log('加载图片为  ' + `GP_Loading_Msg_0${DataVO.GD.tipsrd}_cn_png`);
        // this.tips.spriteFrame = this.spa.getSpriteFrame(`GP_Loading_Msg_0${DataVO.GD.tipsrd}_cn_png`);

        window.onresize = function () {
            if (DataVO.GD.mainScene) {
                if (DataVO.GD.isRotation) {
                    //旋转视图
                    DataVO.GD.mainScene.rotationView();
                } else {

                    DataVO.GD.mainScene.initLayerPosition()
                    DataVO.GD.isShaking = false
                }
            }
            // cc.log(DataVO.GD.mainScene.fishLayer.node.position);
        }

        if (cc.winSize.width < 1280 && cc.winSize.width > 960) {
            this.roomLayout.node.setScale(0.8)
        }
        if (cc.winSize.width <= 960) {
            this.roomLayout.node.setScale(0.7)
        }

        let GetAchievement = UserInfo.GetInstance().getData().getAchieveMent
        cc.log('9999999999')
        cc.log(GetAchievement)
        if (GetAchievement) {
            if (Object.keys(GetAchievement).length === 0) {
                this.achieveGameCover.active = false
                this.playBtn.active = false
            } else {
                this.achieveGameCover.active = true
                this.playBtn.active = true
                cc.find('str', this.playBtn).getComponent(cc.Label).string = Util.kFormatter(Number(GetAchievement['turnover']))
                // cc.find('str', this.playBtn).getComponent(cc.Label).string = Util.kFormatter(3000)
                this.playBtn.on(cc.Node.EventType.TOUCH_END, this.onPlayAchieveGame, this)
                this.achieveGameCover.on(cc.Node.EventType.TOUCH_END, () => { this.achieveGameCover.active = false }, this)
            }
        }

        if (DataVO.GD.showCover == undefined) {
            DataVO.GD.showCover = true
        } else {
            cc.find('Layers/cover', this.node).active = false
        }

        // SystemToast.GetInstance().buildToast('您的账号已经被管理员禁用，如有疑问，请联系客服')

        // SystemToast.GetInstance().buildPromptNew('尊贵的玩家:您已闲置游戏过久，我们将关闭游戏，并自动', 100, 2, 2, () => {
        //     window.location.href = window.location.href
        //     // if (cc.sys.isBrowser) {
        //     //     window.location.href = window.location.href
        //     // }
        //     // if (cc.sys.isNative) {
        //     //     cc.director.loadScene('RoomScene')
        //     // }
        // })

        // SystemToast.GetInstance().buildPromptNew('发生错误，请重新登入', 9005, 1, () => {
        //     window.location.href = window.location.href
        //     // if (cc.sys.isBrowser) {
        //     //     window.location.href = window.location.href
        //     // }
        //     // if (cc.sys.isNative) {
        //     //     cc.director.loadScene('RoomScene')
        //     // }
        // })

        // SystemToast.GetInstance().buildPromptNew('您的网络不稳定', 1, 1, () => {
        //     // cc.director.loadScene('RoomScene');
        //     window.location.href = window.location.href
        // }, null)

        // SystemToast.GetInstance().buildPromptNew('您的账户被重复登入，请重新登入，或联系客服', 102, 1, () => {
        //     window.location.href = window.location.href
        //     // if (cc.sys.isBrowser) {
        //     //     window.location.href = window.location.href
        //     // }
        //     // if (cc.sys.isNative) {
        //     //     cc.director.loadScene('RoomScene');
        //     // }
        // })

        // SystemToast.GetInstance().buildPromptNew('登录失败', 9005, 1, () => {
        //     window.location.href = window.location.href
        //     // if (cc.sys.isBrowser) {
        //     //     window.location.href = window.location.href
        //     // }
        //     // if (cc.sys.isNative) {
        //     //     cc.director.loadScene('RoomScene');
        //     // }
        // })

        // SystemToast.GetInstance().buildPromptNew('进入失败', 1, 1, () => {
        //     window.location.href = window.location.href
        //     // if (cc.sys.isBrowser) {
        //     //     window.location.href = window.location.href
        //     // }
        //     // if (cc.sys.isNative) {
        //     //     cc.director.loadScene('RoomScene')
        //     // }
        // })

        // SystemToast.GetInstance().buildPromptNew('尊贵的玩家:您已闲置游戏过久，我们将关闭游戏，并自动', 100, 2, () => {
        //     window.location.href = window.location.href
        //     // if (cc.sys.isBrowser) {
        //     //     window.location.href = window.location.href
        //     // }
        //     // if (cc.sys.isNative) {
        //     //     cc.director.loadScene('RoomScene');
        //     // }
        // }, () => {
        //     window.location.href = window.location.href

        // })
    }

    onPlayAchieveGame() {
        this.achieveGame.getComponent(AchieveGame).initGameStatus()
    }

    loadItem() {
        // cc.log(this.roomdatas);
        resLoader.loadRes("subgame/fish/caishenbuyu/db/roomicon" + this.roomdatas[this.itemindex].sortID, cc.Prefab, (error: Error, pf: cc.Prefab) => {
            var roomicon = cc.instantiate(pf);
            let sprite = this.roomLayout;
            sprite.node.addChild(roomicon);
            sprite.node.width = 360;
            sprite.node.height = 320;
            sprite.node.name = "room" + this.itemindex;
            let tt = this.itemindex;
            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = 'SGRoomScene';
            clickEventHandler.handler = 'onEnterGameRoom';
            // clickEventHandler.customEventData = tt.toString();
            clickEventHandler.customEventData = this.roomdatas[this.itemindex].groupID.toString()
            let btn = roomicon.addComponent(cc.Button);
            btn.clickEvents.push(clickEventHandler);
            let lab = cc.find('buttonbg/label', roomicon).getComponent(cc.Label)
            lab.string = this.roomdatas[this.itemindex].minBullet + '-' + this.roomdatas[this.itemindex].maxBullet
            if (this.itemindex < this.roomdatas.length - 1) {
                this.itemindex++
                this.loadItem();
            } else {
                EventManager.getInstance().raiseEvent("loadover")
            }

            // cc.log('============<><><><><>');
            // cc.log(this.itemindex +'              '+ this.roomdatas.length);
            // if(this.itemindex == this.roomdatas.length)
            // {
            //     this.loading.active = false;
            // }
        });

        cc.find('ani', this.jid.parent.parent).getComponent(sp.Skeleton).setAnimation(0, 'animation', false)
    }
    //点击进入房间
    onEnterGameRoom(event, customEventData): void {
        DataVO.GD.loadCount = 2
        cc.find('newjiazai', this.loading).active = false
        //过滤
        cc.log("onEnterGameRoom");
        // cc.log(e);
        if (this.selectRoom) {//防止网络卡的时候重复点击
            return
        }
        if (this.ps) {
            this.ps.progress = 0;
        }

        // let roomdatas = UserInfo.GetInstance().getData().GameRoomList.room;
        // this.selectRoom = roomdatas[customEventData];
        for (let i = 0; i < this.room.length; i++) {
            if (customEventData == this.room[i].groupID && this.room[i].tableCount * this.room[i].chairCount > this.room[i].userCount) {
                this.selectRoom = this.room[i];
                break
            }
        }
        cc.log(customEventData);
        cc.log(this.selectRoom);
        cc.log(this.room);
        DataVO.GD.selectRoom = this.selectRoom
        if (this.selectRoom == null) {
            SystemToast.GetInstance().buildToast('房间已满，请稍后再试')
            return
        }
        if (UserInfo.GetInstance().getData().score < this.selectRoom.minScore) {
            cc.log("进入此游戏房间需要" + this.selectRoom.minScore + MPConfig.CURRENCY + "！")
            SystemToast.GetInstance().buildToast("进入此游戏房间需要" + this.selectRoom.minScore + MPConfig.CURRENCY + "！");
            this.selectRoom = null
            return;
        }

        this.loading.active = true;
        this.tips.node.active = true
        DataVO.GD.tips3 = Math.floor(Util.randNum(2, 9));
        this.tips.spriteFrame = this.spa.getSpriteFrame(`GP_Loading_Msg_0${DataVO.GD.tips3}_cn_png`);
        this.ps.getComponent(cc.ProgressBar).progress = 0
        this.scheduleOnce(() => {
            SystemToast.GetInstance().buildPromptNew('发生错误，请重新登入', 9005, 1, () => {
                window.location.href = window.location.href
                // if (cc.sys.isBrowser) {
                //     window.location.href = window.location.href
                // }
                // if (cc.sys.isNative) {
                //     cc.director.loadScene('RoomScene')
                // }
            })
        }, 60)
        // this.selectRoom = this.room[customEventData];
        // cc.log(e.target.name)
        cc.log(GameGlobalData.curGame);
        if (!cc.sys.isNative) {
            // this.enterGame();
        } else {
            // this._checkGameState(false, false);
            // this._checked = true;
            cc.log(GameGlobalData.curGame);
        }
        UserInfo.GetInstance().setData({ selectRoomInfo: this.selectRoom }, "userStatus");
        // if (UserInfo.GetInstance().getData().score < this.selectRoom.minScore) {
        //     SystemToast.GetInstance().buildToast("进入此游戏房间需要" + this.selectRoom.minScore + MPConfig.CURRENCY + "！");
        //     return;
        // }

        UserInfo.GetInstance().setData({ roomID: this.selectRoom.roomID }, "userStatus");
        UserInfo.GetInstance().setData({ roomName: this.selectRoom.roomName }, "userStatus");

        //如果是防作弊
        if (this.selectRoom.cheatProof) {
            //请求玩游戏
            // mpApp.showWaitLayer("连接房间,请求进入游戏...");
            SocketManager.getInstance().emit(mpNetEvent.EnterRoom, { GamesRoomID: this.selectRoom.roomID });//先进入房间
            // SocketManager.getInstance().emit(mpNetEvent.EnterGame, { GamesRoomID: this.selectRoom.roomID, Action: 1 });//玩家坐下
            UserInfo.GetInstance().setData({ cheatProof: true }, "userStatus");
        }
        else {
            // mpApp.showWaitLayer("连接房间中");
            UserInfo.GetInstance().setData({ cheatProof: false }, "userStatus");
            //请求进入房间， 再请求坐下
            SocketManager.getInstance().emit(mpNetEvent.EnterRoom, { GamesRoomID: this.selectRoom.roomID });//先进入房间
            // SocketManager.getInstance().emit(mpNetEvent.EnterGame, { GamesRoomID: this.selectRoom.roomID, Action: 1 });//玩家坐下
        }

    }
    //获得进入房间消息
    eventList(): void {
        // EventManager.getInstance().addEventListener(mpNetEvent.EnterGame, this.msgEnterGame, this);
        EventManager.getInstance().addEventListener(mpNetEvent.EnterRoom, this.msgEnterRoom, this)
        EventManager.getInstance().addEventListener("loadover", this.LoadOver, this);
        EventManager.getInstance().addEventListener("loadMusicConfigOver", this.loadMusicConifgOver, this);
        EventManager.getInstance().addEventListener(mpNetEvent.UserInfoUpdate, this.msgUserInfoUpdate, this);
    }
    loadmusicflag: boolean = false;
    loadMusicConifgOver(name, note) {
        this.loadmusicflag = true
        cc.director.preloadScene('SG_F_CSBY_MainScene', function () {
            cc.log('SG_F_CSBY_MainScene preloaded');
        });
    }
    LoadOver(name, note) {
        this.loadnum++;
        cc.log(this.loadnum + '    ===========     ' + this.loadmax)
        if (this.loadnum == this.loadmax) {
            cc.log("onLoadonLoadonLoadonLoadonLoadonLoad" + MPConfig.loginType + "" + UserInfo.GetInstance().getData().errorRoomid)
            this.loadmax = 1
            if (MPConfig.loginType == "6" && !UserInfo.GetInstance().getData().errorRoomid) { //三方登录直接进入游戏
                let _selectRoom;
                for (let i = 0; i < this.room.length; i++) {
                    if (UserInfo.GetInstance().getData()["params"]["roomid"] == this.room[i].groupID && this.room[i].tableCount * this.room[i].chairCount > this.room[i].userCount) {
                        _selectRoom = this.room[i];
                        break
                    }
                }
                if (_selectRoom) {
                    this.onEnterGameRoom(null, UserInfo.GetInstance().getData()["params"]["roomid"])
                } else {
                    UserInfo.GetInstance().getData().errorRoomid = true
                    this.ps.progress = 1
                    //之前再这里隐藏加载动画界面
                    // this.loading.active = false;
                    //GameGlobalData.curGame = 'RoomScene'
                    //cc.director.loadScene('RoomScene');
                }

            } else {
                this.ps.progress = 1
                this.loading.active = false;
            }
            this.loadNodepoolRes();
            cc.log('---------------时间2222222--------------------')
            cc.log(cc.director.getTotalTime())
        }
    }

    loadNodepoolRes() {
        if (DataVO.GD.loadDone) {
            this.curcount = this.totcount;
            return
        }
        //加载游戏所需预制
        for (let item in prefabsCFG) {
            DataVO.GD.nodePools[item] = new NodePool();
            DataVO.GD.nodePools[item].init(path + prefabsCFG[item]['name'], prefabsCFG[item]['count'], () => {
                this.curcount++
                this.checkRes()
            })
        }

        //载入鱼资源
        let idx = 1
        let loadfish = () => {
            cc.log('1111111111111')
            cc.log(idx)

            DataVO.GD.nodePools["fish_" + idx] = new NodePool();
            DataVO.GD.nodePools["fish_" + idx].init("subgame/fish/caishenbuyu/prefabs/fish_" + idx, 1, (err, url) => {
                cc.log(url)
                this.curcount++
                this.checkRes()
                idx++
                if (idx < 21) {
                    loadfish()
                }
            });
        }
        loadfish()
    }

    checkRes() {
        // cc.log('=================>>>>');
        cc.log('已载入资源  ' + this.curcount + "    资源总数    " + this.totcount);
        cc.log(this.curcount == this.totcount)
        // EventManager.getInstance().raiseEvent('rePluss');
        if (this.curcount == this.totcount) {
            DataVO.GD.loadDone = true
            // this.sendConnect();
            // SocketManager.getInstance().emit(mpNetEvent.EnterGame, { GamesRoomID: UserInfo.GetInstance().getData().userStatus.selectRoomInfo.roomID, Action: 1 });//玩家坐下
        }
    }

    //进入游戏
    msgEnterGame(name, note) {
        if (!note.errMsg) {
            if (UserInfo.GetInstance().getData().userStatus.cheatProof) {
                //切换场景
                cc.log("进入游戏场景")
                cc.log(note)
                // cc.director.loadScene("SG_F_CSBY_MainScene");
                GameGlobalData.curGame = 'SG_F_CSBY_MainScene'
                // cc.director.loadScene('GameLoading');
                cc.director.loadScene('SG_F_CSBY_MainScene');
                if (MPConfig.loginType == "6") { //三方登录直接进入游戏,不会自动调用onDestroy
                    // DataVO.GD.rs.onDestroy()
                }
            } else {
                cc.log("进入游戏场景失败2")
                cc.log(UserInfo.GetInstance().getData().userStatus.cheatProof)
            }
        } else {
            cc.log("进入游戏场景失败")
            cc.log(note.errMsg)
            SystemToast.GetInstance().buildPrompt(note.errMsg, 1, () => {
                window.location.href = window.location.href
                // if (cc.sys.isBrowser) {
                //     window.location.href = window.location.href
                // }
                // if (cc.sys.isNative) {
                //     cc.director.loadScene('RoomScene')
                // }
            })
        }
    }

    //进入房间列表
    msgEnterRoom(name, note) {
        cc.log('00000000000000000')
        cc.log(note)
        //切换屏幕
        //切换场景
        // SocketManager.getInstance().emit(mpNetEvent.EnterGame, { GamesRoomID: UserInfo.GetInstance().getData().userStatus.selectRoomInfo.roomID, Action: 1 });//玩家坐下
        if (note.errMsg) {
            SystemToast.GetInstance().buildPrompt(note.errMsg, 1, () => {
                window.location.href = window.location.href
                // if (cc.sys.isBrowser) {
                //     window.location.href = window.location.href
                // }
                // if (cc.sys.isNative) {
                //     cc.director.loadScene('RoomScene')
                // }
            })
            return
        }
        // SocketManager.getInstance().emit(mpNetEvent.EnterGame, { GamesRoomID: this.selectRoom.roomID, Action: 1 });//玩家坐下
        if (MPConfig.loginType == "6") { //三方登录直接进入游戏,不会自动调用onDestroy
            // DataVO.GD.rs.onDestroy()
        }
        if (DataVO.GD.loadDone) {
            this.loading.active = true;
            this.ps.progress = 1.0
            setTimeout(() => {
                cc.director.loadScene('SG_F_CSBY_MainScene');
                MPConfig.first = false;
            }, 600)
        } else {
            this.loading.active = true;
            this.tips.node.active = true
            let it = 0;
            // DataVO.GD.tips3 = Math.floor(Util.randNum(1, 9));
            // this.tips.spriteFrame = this.spa.getSpriteFrame(`GP_Loading_Msg_0${DataVO.GD.tips3}_cn_png`);
            cc.director.getScheduler().schedule(() => {
                // it += 0.05;
                it = this.curcount / this.totcount
                cc.log('638-------' + it);
                if (it >= 1.0) {
                    it = 1.0;
                    this.ps.progress = it
                    //this.loading.active = false;
                    cc.director.getScheduler().unscheduleAllForTarget(this.loading);
                    cc.director.loadScene('SG_F_CSBY_MainScene');
                }
                this.ps.progress = it
            }, this.loading, 0.01, 1e+9, 0, false);
        }
    }

    onSetting() {
        this.showSetting = !this.showSetting;
        this.settingBtn.interactable = false;
        let bo = (this.showSetting ? true : false)
        if (bo) {
            SoundManager.getInstance().playID(201, "subgame");
        } else {
            SoundManager.getInstance().playID(202, "subgame");
        }
        let dis = 335 * (bo ? 1 : -1);
        cc.Tween.stopAllByTarget(this.settingBtn.node)
        cc.tween(this.settingBtn.node).to(0.2, { scaleX: 1.1, scaleY: 0.9 }).to(0.14, { scaleX: 1.15, scaleY: 1.15 }).to(0.16, { scale: 1 }).call(() => {
            this.settingBtn.interactable = true
        }).start();
        // this.settingbg.active = bo;
        let chi = this.settingnode.children
        chi[2].scale = 0
        chi[1].scale = 0
        this.settingbg.scale = 0
        if (this.showSetting) {
            cc.tween(chi[2]).delay(0.16).to(0.15, { scale: 1.15 }).start();
            cc.tween(chi[1]).delay(0.26).to(0.15, { scale: 1.15 }).start();
            cc.tween(this.settingbg).delay(0.26).to(0.15, { scale: 1 }).start()
        } else {

        }
        // this.settingnode.runAction(cc.sequence(cc.moveBy(0.2, cc.v2(0, dis)), cc.callFunc(() => { this.settingBtn.interactable = true })))
        // this.settingbg.runAction(cc.sequence(cc.callFunc(() => { this.settingbg.setPosition(cc.v2(-13, -23)); this.settingbg.setScale(cc.v2(1, 0.2)) }), cc.scaleTo(0.2, 1, (bo ? 1 : 0)), cc.callFunc(() => { this.settingBtn.interactable = true })))
    }

    onSetingCallBack(event, customEventData) {
        SoundManager.getInstance().playID(201, "subgame");
        switch (event.target.name) {
            case 'mainbtn':
                break;
            case 'soundbtn':
                this.soundswitch = !this.soundswitch
                this.soundcover.active = this.soundswitch;
                SoundManager.getInstance().setEnabled(this.soundswitch);
                break;
            case 'fishbtn':
                uiManager.initUIConf(UICF);
                uiManager.open(UIID.helpinfo);
                this.onSetting()
                break
        }
    }

    onBack() {
        ClientKernel.GetInstance().stopWebSocket();
        cc.director.loadScene('ChooseGame');
    }

    //退出时清理消息事件
    onDestroy() {
        // EventManager.getInstance().removeEventListener(mpNetEvent.EnterGame, this.msgEnterGame);
        EventManager.getInstance().removeEventListener(mpNetEvent.EnterRoom, this.msgEnterRoom);
        EventManager.getInstance().removeEventListener("loadover", this.LoadOver, this);
        EventManager.getInstance().removeEventListener("loadMusicConfigOver", this.loadMusicConifgOver, this);
        EventManager.getInstance().removeEventListener(mpNetEvent.UserInfoUpdate, this.msgUserInfoUpdate, this);
    }

    msgUserInfoUpdate(name, note) {
        this.userScore.string = Util.formatMoney(note.score > 0 ? note.score : 0, ',', true);
    }


    paoAndFish() {
        let paop = [cc.v2(-470, -340), cc.v2(40, -320), cc.v2(530, -240)]
        let fishp = [cc.v2(-800, -230), cc.v2(-960, -350), cc.v2(900, -330), cc.v2(980, -200)]
        let createanipao = () => {
            for (let i = 0; i < 3; i++) {
                let rdp = Math.floor(Util.randNum(0, 3))
                let rddx = Math.floor(Util.randNum(-50, 150))
                let rddy = Math.floor(Util.randNum(-50, 50))
                let littlepao = cc.instantiate(this.ani[0])
                littlepao.setParent(this.ani[6]);
                let pp = paop[rdp].add(cc.v2(rddx, rddy))
                littlepao.setPosition(pp);
                let t = cc.tween;
                let dur = Math.floor(Util.randNum(2, 4));
                let dd = Util.randNum(0, 1.5)
                t(littlepao).parallel(
                    t().to(dur, { scale: 2 }),
                    t().by(dur, { position: cc.v2(0, 150 + rddy) }),
                    t().to(dur, { opacity: 0 })
                ).call(() => { littlepao.removeFromParent() }).start()
            }
        }
        this.schedule(createanipao, 1, 1e+9)
        let createanifish = () => {
            for (let i = 0; i < 4; i++) {
                let rdp = Math.floor(Util.randNum(0, 4))
                let rddx = Math.floor(Util.randNum(-50, 150))
                let rddy = Math.floor(Util.randNum(-50, -10))
                let rdk = Math.floor(Util.randNum(1, 6))
                let leftorright = fishp[rdp].x > 0 ? -1 : 1
                let littlefish = cc.instantiate(this.ani[rdk])
                littlefish.setParent(this.ani[6]);
                let pp = fishp[rdp].add(cc.v2(rddx, rddy))
                littlefish.setPosition(pp);
                littlefish.setScale(cc.v2(-leftorright * 1.5, 1.5));
                let t = cc.tween;
                cc.tween(littlefish).
                    to(25, { position: cc.v2(800 * leftorright, pp.y) })
                    .call(() => { littlefish.removeFromParent() }).start()
            }
        }
        createanifish()
        this.schedule(createanifish, 10, 1e+9)

    }
}
