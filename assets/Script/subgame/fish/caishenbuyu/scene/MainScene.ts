import UserInfo from "../../../../plaza/model/UserInfo";
import ClientKernel from "../../../../extend/ClientKernel";
import Util from "../../../../extend/Util";
import { resLoader } from "../../../../common/res/ResLoader";
import SoundManager from "../../../../common/managers/SoundManager";
import { EventManager } from "../../../../common/managers/EventManager";
import gameCMD from "../../../../extend/GameCMD";
import { ReductionFishWay, subGameMSG, FireFailureReason } from "../SubGameMSG";
import { musicRes, GPlayerNum, GFishKindAnimationFN, V } from "../F_CSBY_Config";
import { DataVO } from "../../../../plaza/model/DataVO";

import F_CSBY_BGLayer from "../layer/F_CSBY_BGlayer";
import F_CSBY_FishLayer from "../layer/F_CSBY_FishLayer";
import F_CSBY_GameSceneLayer from "../layer/F_CSBY_GameSceneLayer";
import F_CSBY_BulletLayer from "../layer/F_CSBY_BulletLayer";
import F_CSBY_FishNetLayer from "../layer/F_CSBY_FishNetLayer";
import F_CSBY_LightingLayer from "../layer/F_CSBY_LightingLayer";
import F_CSBY_FishDieLayer from "../layer/F_CSBY_FishDieLayer";
import F_CSBY_WaterMarkLayer from "../layer/F_CSBY_WaterMarkLayer";
import C_CSBY_EffectLayer from "../layer/F_CSBY_EffectLayer";
import F_CSBY_CannonLayer from "../layer/F_CSBY_CannonLayer";
import F_CSBY_CoinLayer from "../layer/F_CSBY_CoinLayer";
import F_CSBY_ScoreLayer from "../layer/F_CSBY_ScoreLayer";
import F_SCBY_WindowLayer from "../layer/F_CSBY_WindowLayer";
import F_CSBY_NoticeLayer, { rewardArr } from "../layer/F_CSBY_NoticeLayer";
import F_CSBY_CatchFishMulLayer from "../layer/F_CSBY_CatchFishMulLayer";
import SystemToast from "../../../../extend/ui/SystemToast";
import { NodePool } from "../../../../common/res/NodePool";
import F_SCBY_UILayer from "../layer/F_CSBY_UILayer";
import F_CSBY_Fish from "../node/F_CSBY_Fish";
import GameUserManager from "../../../../extend/GameUserManager";
import { exitEnum, mpNetEvent } from "../../../../extend/MPDefine";
import SocketManager from "../../../../common/managers/SocketManager";
import MPConfig from "../../../../extend/MPConfig";

//财神捕鱼大厅场景
const { ccclass, property } = cc._decorator;

const sourceCFG = { sounds: ['subgame/fish/caishenbuyu/sounds'], other: [] };
const path = 'subgame/fish/caishenbuyu/prefabs/';
const prefabsCFG = {
    OrganCannon: { name: 'OrganCannon', count: 1 },
    DrillCannon: { name: 'DrillCannon', count: 1 },
    CenserBead: { name: 'CenserBead', count: 1 },
    GodAdvent: { name: 'GodAdvent', count: 1 },
    GodFafa: { name: 'GodFafa', count: 1 },
    LuckRun: { name: 'LuckRun', count: 1 },
    Roulette: { name: 'Roulette', count: 1 },
    openredbag: { name: 'openredbag', count: 1 },
    minigun: { name: 'minigun', count: 1 },
    bullet1: { name: 'bullet1', count: 4 },
    BulletPool: { name: 'bullet', count: 20 },
    MiniBulletPool: { name: 'minibullet', count: 8 },
    bulletNumPool: { name: 'bulletNum', count: 10 },
    FishNetPool: { name: 'fishNet', count: 12 },
    FishNet1Pool: { name: 'fishNet1', count: 12 },
    FishNet2Pool: { name: 'fishNet2', count: 12 },
    FishNet11Pool: { name: 'fishNet11', count: 12 },
    FireBubblePool: { name: 'SS_Fire_Bubble', count: 12 },
    ScorePool: { name: 'scoreNum', count: 10 },
    CoinPool: { name: 'coinNode', count: 10 },
    CoinBombPool: { name: 'coinbomb', count: 8 },
};


@ccclass
export default class MainScene extends cc.Component {

    //背景层
    @property(F_CSBY_BGLayer)
    bgLayer: F_CSBY_BGLayer = null;
    //鱼层
    @property(F_CSBY_FishLayer)
    fishLayer: F_CSBY_FishLayer = null;
    //场景特效层
    @property(F_CSBY_GameSceneLayer)
    gameSceneLayer: F_CSBY_GameSceneLayer = null;
    //子弹层
    @property(F_CSBY_BulletLayer)
    bulletLayer: F_CSBY_BulletLayer = null;
    //渔网层
    @property(F_CSBY_FishNetLayer)
    fishNetLayer: F_CSBY_FishNetLayer = null;
    //闪电层
    @property(F_CSBY_LightingLayer)
    lightingLayer: F_CSBY_LightingLayer = null;
    //鱼死亡层
    @property(F_CSBY_FishDieLayer)
    fishDieLayer: F_CSBY_FishDieLayer = null;
    //水纹层
    @property(F_CSBY_WaterMarkLayer)
    waterMarkLayer: F_CSBY_WaterMarkLayer = null;
    //特效层
    @property(C_CSBY_EffectLayer)
    effectLayer: C_CSBY_EffectLayer = null;
    //炮层
    @property(F_CSBY_CannonLayer)
    cannonLayer: F_CSBY_CannonLayer = null;
    //金币层
    @property(F_CSBY_CoinLayer)
    coinLayer: F_CSBY_CoinLayer = null;
    //金币层
    @property(F_CSBY_ScoreLayer)
    scoreLayer: F_CSBY_ScoreLayer = null;
    //Window层
    @property(F_SCBY_WindowLayer)
    windowsLayer: F_SCBY_WindowLayer = null;
    //公告层
    @property(F_CSBY_NoticeLayer)
    noticeLayer: F_CSBY_NoticeLayer = null;
    //金币数字层
    @property(F_CSBY_CatchFishMulLayer)
    catchFishMulLayer: F_CSBY_CatchFishMulLayer = null;
    //UI层
    @property(F_SCBY_UILayer)
    uiLayer: F_SCBY_UILayer = null;
    //特效图集资源1
    @property(cc.SpriteAtlas)
    animation_1Atlas: cc.SpriteAtlas = null;
    //特效图集资源2
    // @property(cc.SpriteAtlas)
    // animation_2Atlas: cc.SpriteAtlas = null;
    //特效图集资源3
    // @property(cc.SpriteAtlas)
    // animation_3Atlas: cc.SpriteAtlas = null;

    bo = false;
    curcount = 0;
    totcount = 41;
    selectRoomInfo;
    msgnum = 0;
    originPosition = []
    camera;
    // LIFE-CYCLE CALLBACKS:
    async onLoad() {
        // let size = cc.winSize
        // let b = Math.max(size.width,size.height)
        // let s = Math.min(size.width,size.height)
        // let rate = b / s
        // cc.log(b + '   ' + s + '    ' + b / s)

        // if(rate > 2){
        //     this.node.getChildByName('Layers').getComponent(cc.Widget).right = 45
        //     this.node.getChildByName('Layers').getComponent(cc.Widget).left = 45
        // }

        cc.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        cc.log(this)
        DataVO.GD.mainScene = this;
        DataVO.GD.meChairID = null;
        DataVO.GD.isRotation = null;
        DataVO.GD.fishConfig = null;
        DataVO.GD.gameEngine = null;
        DataVO.GD.isAllowFire = null;            //是否允许开火
        DataVO.GD.isAndroidHelp = null;          //是否为机器人帮助者
        DataVO.GD.isReady = null;                 //是否准备
        DataVO.GD.bulletID = 0;                     //子弹ID
        DataVO.GD.nowBulletNum = 0;                    //当前场上自己的子弹数
        DataVO.GD.switingScene = false;              //是否正在切换场景
        DataVO.GD.noActionTime = 0;                 //没动作时间
        ///////////////////////////////////////////////////////////////
        DataVO.GD.catchFishNum = [];                 //以鱼FishKind为下标， 值为捕获数量
        DataVO.GD.payMoney = 0;                      //付出的钱
        DataVO.GD.harvestMoney = 0;                  //收获的钱
        DataVO.GD.matchMode = false;               //是否是比赛模式
        DataVO.GD.lastFireTick = 0;                 //最后一次开炮tick
        //////////////////////////////////////////////////////////////////////////////////////
        DataVO.GD.isRageMode = false;               //是否是 狂暴模式
        DataVO.GD.speedModeMul = 1;                 //极速模式当前倍数
        ////////////////////////////////////////////////////////////////////////////////////
        DataVO.GD.activeExit = false;               //是否是主动退出的
        DataVO.GD.isLookonMode = false;             //是否是旁观模式
        DataVO.GD.bgmIndex = 0;                      //当前背景音乐
        // DataVO.GD.nodePools = {};                   //是否是旁观模式
        DataVO.GD.isactiveFish = true; //是否出鱼
        DataVO.GD.gameback = false;
        DataVO.GD.isShaking = true;
        DataVO.GD.forceExit = true
        DataVO.GD.showAimAction = false; //显示瞄准光圈动画
        DataVO.GD.canChangeCannon = true;//可以切炮
        //需要第二次点击才能触发
        DataVO.GD.effectStop = false //在自动或者长按状态下 打中机关炮 钻头 需要重新点击才能再次开火
        DataVO.GD.bulletMany = false //子弹过多停止发射
        DataVO.GD.cantChangeMul = false//可以切换炮
        DataVO.GD.newPaoSelect = false //默认未选择特殊炮弹
        // await this.loadres();

        // for (let i = 1; i < 21; i++) {
        //     DataVO.GD.nodePools["fish_" + i] = new NodePool();
        //     DataVO.GD.nodePools["fish_" + i].init("subgame/fish/caishenbuyu/prefabs/fish_" + i, 1, (err, url) => {
        //         cc.log(url)
        //         this.curcount++
        //         this.checkRes()
        //     });
        // }

        // for (let item in prefabsCFG) {
        //     DataVO.GD.nodePools[item] = new NodePool();
        //     // cc.log(item)
        //     // cc.log(prefabsCFG[item])
        //     // if(item == 'Prompt' || item == 'Toast'){
        //     //     DataVO.GD.nodePools[item].init('public/' + prefabsCFG[item]['name'], prefabsCFG[item]['count'], () => {
        //     //         this.curcount++
        //     //         this.checkRes()
        //     //     })
        //     // }else{
        //     DataVO.GD.nodePools[item].init(path + prefabsCFG[item]['name'], prefabsCFG[item]['count'], () => {
        //         this.curcount++
        //         this.checkRes()
        //     })
        //     // }            
        // }

        this.eventList();
        this.selectRoomInfo = UserInfo.GetInstance().getData().userStatus.selectRoomInfo;

        cc.director.getCollisionManager().enabled = true;
        //setTimeout(this.sendConnect, 10);
        /*setTimeout(() => {
            this.cannonLayer.cannonArray[DataVO.GD.meChairID].startBitBullet(10)
        }, 1000);*/
        // let oo = 1;
        // cc.director.getScheduler().schedule(() => {
        //     this.switchScene({ bgIndex: oo, bgmIndex: oo });
        //     oo = oo % 2
        //     oo++
        //     // this.cannonLayer.cannonArray[DataVO.GD.meChairID].startBitBullet()
        // }, this, 10, 1e+9, 0, false);


        // cc.director.getScheduler().schedule(() => {
        //     // this.shakeScreen(3, 5);
        //     DataVO.GD.mainScene.shakeScreen();
        // }, this, 6, 1e+9, 0, false);

        // setTimeout(() => {
        //     let fishs = this.fishLayer.node.children
        //     for (let i = 0; i < fishs.length; i++) {
        //         fishs[i].pauseAllActions()
        //     }
        // }, 20000)

        // setTimeout(() => {
        //     let fishs = this.fishLayer.node.children
        //     for (let i = 0; i < fishs.length; i++) {
        //         fishs[i].resumeAllActions()
        //     }
        // }, 30000)

        this.onGameHideOrShow();
        setTimeout(() => {
            this.gameSceneLayer.node.getChildByName('maskNode').setPosition(3000, 0)
            this.gameSceneLayer.node.getChildByName('spNode').setPosition(3000, 0)

        }, 1000)

        let canvas = cc.director.getScene().getChildByName('Canvas');
        this.camera = canvas.getChildByName('Main Camera').getComponent(cc.Camera);
    }

    checkRes() {
        // cc.log('=================>>>>');
        cc.log('已载入资源  ' + this.curcount + "    资源总数    " + this.totcount);
        cc.log(this.curcount == this.totcount)
        EventManager.getInstance().raiseEvent('rePluss');
        if (this.curcount == this.totcount) {
            // this.sendConnect();
            // SocketManager.getInstance().emit(mpNetEvent.EnterGame, { GamesRoomID: UserInfo.GetInstance().getData().userStatus.selectRoomInfo.roomID, Action: 1 });//玩家坐下
        }
    }

    initLayerPosition() {
        let layers = [this.bgLayer, this.bulletLayer, this.cannonLayer, this.coinLayer, this.fishLayer, this.waterMarkLayer, this.fishNetLayer, this.scoreLayer, this.effectLayer, this.fishDieLayer, this.lightingLayer, this.catchFishMulLayer];
        for (let i = 0; i < layers.length; i++) {
            this.originPosition[i] = layers[i].node.position
        }
    }

    start() {
        V.w = cc.winSize.width
        V.h = cc.winSize.height
        this.fishLayer.node.setContentSize(cc.size(V.w, V.h))
        this.cannonLayer.node.setContentSize(cc.size(V.w, V.h))
        this.initLayerPosition()
        SocketManager.getInstance().emit(mpNetEvent.EnterGame, { GamesRoomID: UserInfo.GetInstance().getData().userStatus.selectRoomInfo.roomID, Action: 1 });//玩家坐下

    }

    sendConnect() {
        cc.log("声音加载完毕");
        cc.log(DataVO.GD.nodePools)
        let selectRoomInfo = UserInfo.GetInstance().getData().userStatus.selectRoomInfo;
        cc.log(selectRoomInfo);
        ClientKernel.GetInstance().init(UserInfo.GetInstance().getData().userID, Util.generateUUID())
        ClientKernel.GetInstance().connect(selectRoomInfo.host, selectRoomInfo.port, selectRoomInfo.path);
    }

    async loadres() {
        for (let item in sourceCFG) {
            if (sourceCFG[item].length != 0) {
                switch (item) {
                    case 'sounds':
                        for (let i = 0; i < sourceCFG[item].length; i++) {
                            let clips = await resLoader.load_res_dir(sourceCFG[item][i], cc.AudioClip, this.node)
                            for (let i = 0; i < clips.length; i++) {
                                await SoundManager.getInstance().addSound(clips[i].name, "subgame", clips[i]);
                                cc.log("加载顺序   " + i + "    " + clips[i].name);
                            }
                        }
                        break;
                    case 'other':
                        break
                }
            }
        }
    }

    // ---------------------------------------- 消息事件-----------------------------------------------------
    //侦听房间消息
    eventList(): void {
        EventManager.getInstance().addEventListener(gameCMD.SUB_GF_GAME_SCENE.toString(), this.onEventFrameMessage, this);
        EventManager.getInstance().addEventListener(gameCMD.MDM_GF_GAME.toString(), this.onEventGameMessage, this);
        EventManager.getInstance().addEventListener(gameCMD.MDM_GF_FRAME.toString(), this.onEventFrameMessage, this);
        EventManager.getInstance().addEventListener(mpNetEvent.EnterGame, this.msgEnterGame, this);

    }

    //进入游戏
    msgEnterGame(name, note) {
        if (!note.errMsg) {
            if (UserInfo.GetInstance().getData().userStatus.cheatProof) {
                //切换场景
                cc.log("玩家坐下成功")
                cc.log(note)
                this.sendConnect();
            } else {
                cc.log("进入游戏场景失败2")
                cc.log(UserInfo.GetInstance().getData().userStatus.cheatProof)
            }
        } else {
            cc.log("进入游戏场景失败")
            cc.log(note.errMsg)
            // SystemToast.GetInstance().buildPrompt(note.errMsg, 1, () => {
            //     window.location.href = window.location.href
            //     // if (cc.sys.isBrowser) {
            //     //     window.location.href = window.location.href
            //     // }
            //     // if (cc.sys.isNative) {
            //     //     cc.director.loadScene('RoomScene')
            //     // }
            // })
            SystemToast.GetInstance().buildPromptNew(note.errMsg, 1, 1, () => {
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
    //发送游戏子命令
    sendGameData(subCMD, data) {
        cc.log("sendGameData")
        if (!DataVO.GD.isLookonMode)
            ClientKernel.GetInstance().sendSocketData(gameCMD.MDM_GF_GAME, subCMD, data);
    }
    // 游戏消息处理
    onEventGameMessage(name, note): void {
        let ti = Number(note['msgTime'])
        DataVO.GD.msgTime = ti
        switch (note["subCMD"]) {
            case subGameMSG.SUB_S_BIGFISH_TIP://警报
                this.noticeLayer.showWarn(note.data.fishKind);
                break;
            case subGameMSG.SUB_S_FISH_TRACE://鱼
                if (!DataVO.GD.isactiveFish) {
                    return;
                }
                if (DataVO.GD.gameback) {
                    DataVO.GD.msgbackindex++
                    // cc.log('==============================');
                    // cc.log(ti + '       ' + DataVO.GD.msgflitter + '          ' + (ti < DataVO.GD.msgflitter));
                    if (ti < DataVO.GD.msgflitter) {
                        if (DataVO.GD.msgbackindex % 3 != 0) {
                            note.data.length = 0;
                            return;
                        }
                        DataVO.GD.msgbackindex = 0

                    } else {
                        DataVO.GD.gameback = false;
                    }
                }
                if (DataVO.GD.fishConfig) {
                    for (let i = 0; i < note.data.length; ++i) {
                        this.fishLayer.activeFish(note.data[i]);
                    }
                } else {
                    cc.log("无鱼配置")
                }
                break;
            case subGameMSG.SUB_S_GAME_CONFIG:                      //配置
                // cc.error("收到配置消息~~~~~~~~~~~~~~~~~~~~~~~"+note.data.jgqfireInterval);
                cc.log("收到配置消息~~~~~~~~~~~~~~~~~~~~~~~");
                cc.log(note.data);
                this.fillGameConfig(note.data);
                break;
            case subGameMSG.SUB_S_END_FISH_ARRAY:
                this.onFishArrayEnd(note.data);
                break;
            case subGameMSG.SUB_S_AUTO_INCREMENT:
                this.fishLayer.autoIncrementFish(note.data);
                break;
            case subGameMSG.SUB_S_USER_FIRE:                    //用户开火
                if (DataVO.GD.fishConfig) {
                    DataVO.GD.allScore = note.data.allScore
                    this.cannonLayer.onUserFire(note.data);
                    cc.log('用户开火用户开火用户开火')
                    cc.log(note.data)
                } else {
                    cc.log("无鱼配置")
                }
                break;
            case subGameMSG.SUB_S_CATCH_FISH:                   //用户捕获到鱼
                //cc.log("收到打中鱼消息");
                this.msgnum += note.data.fishScore
                cc.log("总消息数" + this.msgnum)
                if (DataVO.GD.fishConfig) {
                    DataVO.GD.allScore = note.data.allScore
                    cc.log('捕获到鱼')
                    cc.log(note.data)
                    this.fishLayer.onCatchFish(note.data);
                } else {
                    cc.log("无鱼配置")
                }
                break;
            case subGameMSG.SUB_S_SWITCH_SCENE:                 //切换场景
                this.noticeLayer.hideWarn();
                this.switchScene(note.data);
                if (DataVO.GD.isactiveFish) {
                    DataVO.GD.isactiveFish = false;
                }
                break;
            case subGameMSG.SUB_S_START_FISH_ARRAY:           //开始鱼阵
                if (!DataVO.GD.isactiveFish) {
                    DataVO.GD.isactiveFish = true;
                }
                this.startFishArray(note.data);
                break;
            case subGameMSG.SUB_S_SPECIFY_ANDROID_HELP_CHAIR:   //指定机器人协助者（帮机器人发送子弹碰撞到鱼的消息）
                DataVO.GD.isAndroidHelp = true;
                break;

            case subGameMSG.SUB_S_SYSTEM_TIP:                   //系统提示
                SystemToast.GetInstance().buildToast(note.data);
                break;
            case subGameMSG.SUB_S_LOCK_TIMEOUT:
                this.fishLayer.cancelFixScreen();
                break;
            case subGameMSG.SUB_S_FIRE_FAILURE:                 //开火失败
                this.fireFailure(note.data);
                break;
            case subGameMSG.SUB_S_BULLET_ION_TIMEOUT:           //魔能炮结束
                this.endSuperBullet(note.data);
                break;
            case subGameMSG.SUB_S_CHANGE_XINPAO://切换特殊大炮
                this.cannonLayer.onGameEventChangeNewBullet(note.data);
                break;
            case subGameMSG.SUB_S_LIANLIAN_PROGRESS://任务经验推送  ·       
                this.cannonLayer.updateJuBaoTask(note.data);
                break;
            case subGameMSG.SUB_S_SELECT_YUANBAO://任务经验推送  ·       
                this.cannonLayer.ohterChooseYuanBao(note.data);
                break;
            case subGameMSG.SUB_S_RESPONSE_LIANLIAN://八方来福 小游戏完成 ·  
                DataVO.GD.mainScene.effectLayer.showJuBaoLianLian(note.data)
                break;
            case subGameMSG.SUB_C_CHANGE_BULLET:         //有切换炮
                this.cannonLayer.onGameEventChangeBullet(note.data);
                break;
            case subGameMSG.SUB_C_GET_PLAERS_SCORE://开红包  更新分数
                DataVO.GD.mainScene.cannonLayer.updataAllScore(note.data)
                break;
        }
    }
    // 游戏框架消息处理
    onEventFrameMessage(name, note): void {
        cc.log("onEventFrameMessage")
        let data = note.data
        switch (note["subCMD"]) {
            case gameCMD.SUB_GF_GAME_SCENE:// 场景信息
                this.onEventSceneMessage(data);
                break;
            case gameCMD.SUB_GF_ROOM_INFO:// 房间信息
                var gameName = data["gameName"];
                var roomName = data["roomName"];
                var tableID = data["tableID"] + 1;
                var tableName = data["tableName"];
                var roomStr = gameName + "->" + roomName + "->" + tableName;
                // this.uiLayer && this.uiLayer.setRoomInfo(roomStr);
                break;
            case gameCMD.SUB_GF_REQUEST_FAILURE://请求失败,踢人消息
                this.onRequestFailure(data);
                break;
            case gameCMD.SUB_GF_FORCE_CLOSE://强制关闭客户端
                this.closeSubGame();
                break;
            case gameCMD.SUB_GF_TOAST_MSG://tips消息
                SystemToast.GetInstance().buildToast(data.message);
                break;
            case gameCMD.SUB_GF_FISH_NOTICE://捕鱼公告
                cc.log('收到捕鱼奖励奖励奖励');
                rewardArr.push(data);
                this.noticeLayer.showRewardF();
                break;
            case gameCMD.SUB_GF_NOTICE_TIMEOUT://长时间未操作提示
                cc.log("====== time out");
                DataVO.GD.noticeFalg = true;
                DataVO.GD.noActionTime = 0;
                break;
            case gameCMD.SUB_GF_KICK_TIMEOUT://长时间未操作踢出
                cc.log("====== kick out");
                DataVO.GD.exitType = exitEnum.beKicked
                // app.closeSubGame();  
                // let self = this;   
                // self.closeSubGame();
                this.onKickOut()
                break;
        }
    }

    onKickOut() {
        ClientKernel.GetInstance().stopWebSocket()
        DataVO.GD.noticeFalg = false;
        setTimeout(function () {
            // SystemToast.GetInstance().buildToast("长时间未操作，被踢出房间");
            // SystemToast.GetInstance().buildPrompt('尊敬的玩家，您已闲置太久，我们将关闭游戏，并自动结算结果', 1, () => {
            //     window.location.href = window.location.href
            //     // if (cc.sys.isBrowser) {
            //     //     window.location.href = window.location.href
            //     // }
            //     // if (cc.sys.isNative) {
            //     //     cc.director.loadScene('RoomScene');
            //     // }
            // }, null)
            SystemToast.GetInstance().buildPromptNew('尊贵的玩家:您已闲置游戏过久，我们将关闭游戏，并自动', 100, 2, () => {
                window.location.href = window.location.href
                // if (cc.sys.isBrowser) {
                //     window.location.href = window.location.href
                // }
                // if (cc.sys.isNative) {
                //     cc.director.loadScene('RoomScene');
                // }
            }, () => {
                window.location.href = window.location.href
            })
        }, 1)
    }
    //关闭子游戏
    closeSubGame() {
        cc.director.loadScene("RoomScene");
    }
    /**
     * 错误返回请求失败的弹出框， 如果是KICK_TYPE类型 （即分数不够服务端踢人的消息），则需要自行在游戏结束处理完后调用，this.onRequestFailure(this.kickData) 来弹出消息
     * @param data
     */
    onRequestFailure(data) {
        if (data == null) return;
        SystemToast.GetInstance().buildToast(data.message);
    }
    // 游戏场景消息处理
    onEventSceneMessage(note): void {
        cc.log("onEventSceneMessageonEventSceneMessageonEventSceneMessageonEventSceneMessage")
        cc.log(note)
        let bgIndex = note.bgIndex;
        let fishes = note.fishes;
        let bgmIndex = note.bgmIndex;
        let playerScoreInfo = note.playerScoreInfo;
        let reductionFishWay = note.reductionFishWay;

        this.bgLayer.setBgIndex(bgIndex);

        let bgm = [musicRes.BGM_1, musicRes.BGM_2, musicRes.BGM_3];
        SoundManager.getInstance().playMusic(bgm[bgmIndex], "subgame");
        //恢复场面鱼的方式有两种，
        if (reductionFishWay == ReductionFishWay.NormalWay) {
            this.fishLayer.clearAllFish();
            for (let i = 0; i < fishes.length; ++i) {
                let fishData = fishes[i];
                this.fishLayer.activeFish(fishData);
            }
        }
        else if (reductionFishWay == ReductionFishWay.FishArrayWay) {
            let fishArrayKind = note.fishArrayKind;             //鱼阵ID
            let randseek = note.randseek;                        //随机数种子
            this.fishLayer.clearAllFish();
            this.startFishArray({ fishArrayKind: fishArrayKind, randseek: randseek, fishData: fishes });
        }

        //更新分数
        for (let i = 0; i < playerScoreInfo.length; ++i) {
            let scoreInfo = playerScoreInfo[i];
            (this.cannonLayer.cannonArray[scoreInfo.chairID].node as cc.Node).active = true
            this.cannonLayer.cannonArray[scoreInfo.chairID].setScoreValue(scoreInfo.score);
            if (scoreInfo.superBulletNum > 0) {
                this.cannonLayer.cannonArray[scoreInfo.chairID].MiniBulletState(scoreInfo.superBulletNum);
            }
            if (scoreInfo.drillBulletNum > 0) {
                this.cannonLayer.cannonArray[scoreInfo.chairID].BitBulletState(scoreInfo.drillBulletNum);
            }
        }

        if (note.isAndroidHelp != null) {
            DataVO.GD.isAndroidHelp = note.isAndroidHelp;
        }
        this.fishLayer.autoIncrementFish(note.autoIncrementFishInfo);
        // EventManager.getInstance().raiseEvent('reSetDone');
    }
    // ---------------------------------------- 消息事件-----------------------------------------------------

    //旋转视图
    rotationView() {
        //this.bgLayer.node.angle = -(180);错误场景没翻转
        //this.bulletLayer.node.angle=-(180);
        let w = cc.winSize.width
        let h = cc.winSize.height

        // this.coinLayer.node.setPosition(cc.v2(640, 360));
        // this.fishLayer.node.setPosition(cc.v2(640, 360));
        this.coinLayer.node.setPosition(cc.v2(w * 0.5, h * 0.5));
        this.coinLayer.node.angle = -(180);
        this.fishLayer.node.setPosition(cc.v2(w * 0.5, h * 0.5));
        this.fishLayer.node.angle = -(180);
        //this.fishNetLayer.node.angle=-(180);
        //this.fishNetLayer.node.setPosition(cc.v2(640,360));
        //this.gameSceneLayer.node.angle=-(180);

        // this.scoreLayer.node.setPosition(cc.v2(640, 360));
        this.scoreLayer.node.setPosition(cc.v2(w * 0.5, h * 0.5));
        this.scoreLayer.node.angle = -(180);

        this.waterMarkLayer.node.angle = -(180);
        //this.effectLayer.node.angle=-(180);

        this.cannonLayer.rotationView();
        this.fishDieLayer.node.angle = -(180);
        //this.lightingLayer.node.angle=-(180);
        //this.catchFishMulLayer.node.angle=-(180);
        this.initLayerPosition()
        DataVO.GD.isShaking = false
    }

    //当鱼阵结束时
    onFishArrayEnd(data) {

        var bgmIndex = data.bgmIndex;
        var bgm = [musicRes.BGM_1, musicRes.BGM_2, musicRes.BGM_3];
        SoundManager.getInstance().playMusic(bgm[bgmIndex], "subgame");
    }



    /**
    * 晃动屏幕
    */
    shakeScreen(baseValue, randomValue) {
        //屏蔽连续震屏
        if (DataVO.GD.isShaking) {
            return
        }

        DataVO.GD.isShaking = true
        let self = this;
        let shakeBaseValue = baseValue || 3;
        let shakeRandomValue = randomValue || 5;
        let dt = 0.05;
        let times = 5;

        let shakeAction = null;
        for (let i = 0; i < times; ++i) {
            let action = cc.moveBy(0.001, Math.random() > 0.5 ? shakeBaseValue + Math.random() * shakeRandomValue : -shakeBaseValue - Math.random() * shakeRandomValue, Math.random() > 0.5 ? shakeBaseValue + Math.random() * shakeRandomValue : -shakeBaseValue - Math.random() * shakeRandomValue);
            shakeAction = shakeAction ? cc.sequence(cc.delayTime(dt), action, shakeAction) : cc.sequence(cc.delayTime(dt), action);
        }

        this.camera.node.stopAllActions();
        this.camera.node.runAction(cc.sequence(shakeAction, cc.callFunc(() => { this.camera.node.x = 0; this.camera.node.y = 0; DataVO.GD.isShaking = false; })));
        //cc.log('抖动！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！');
        //cc.vie
        // let layers = [this.bgLayer, this.bulletLayer, this.cannonLayer, this.coinLayer, this.fishLayer, this.waterMarkLayer, this.fishNetLayer, this.scoreLayer, this.gameSceneLayer, this.effectLayer, this.fishDieLayer, this.lightingLayer, this.catchFishMulLayer];
        // let origin = []
        // for (let i = 0; i < layers.length; ++i) {
        //     this.originPosition[i] = layers[i].node.position
        // }
        //连续震屏 层的位置 的初始位置变化，导致震屏出黑边情况



        // this.bgLayer.node.stopAllActions()
        // this.bulletLayer.node.stopAllActions()
        // this.cannonLayer.node.stopAllActions()
        // this.coinLayer.node.stopAllActions()
        // this.fishLayer.node.stopAllActions()
        // this.waterMarkLayer.node.stopAllActions()
        // this.fishNetLayer.node.stopAllActions()
        // // this.gameSceneLayer.node.stopAllActions()
        // this.effectLayer.node.stopAllActions()
        // this.fishDieLayer.node.stopAllActions()
        // this.lightingLayer.node.stopAllActions()
        // this.catchFishMulLayer.node.stopAllActions()

        // this.bgLayer.node.runAction(cc.sequence(shakeAction.clone(), cc.callFunc(() => { this.bgLayer.node.setPosition(this.originPosition[0]) })));
        // this.bulletLayer.node.runAction(cc.sequence(shakeAction.clone(), cc.callFunc(() => { this.bulletLayer.node.setPosition(this.originPosition[1])  ,this.bulletLayer.text()})));
        // this.cannonLayer.node.runAction(cc.sequence(shakeAction.clone(), cc.callFunc(() => { this.cannonLayer.node.setPosition(this.originPosition[2]) })));
        // this.coinLayer.node.runAction(cc.sequence(shakeAction.clone(), cc.callFunc(() => { this.coinLayer.node.setPosition(this.originPosition[3]) })));
        // this.fishLayer.node.runAction(cc.sequence(shakeAction.clone(), cc.callFunc(() => { this.fishLayer.node.setPosition(this.originPosition[4]) })));
        // this.waterMarkLayer.node.runAction(cc.sequence(shakeAction.clone(), cc.callFunc(() => { this.waterMarkLayer.node.setPosition(this.originPosition[5]) })));
        // this.fishNetLayer.node.runAction(cc.sequence(shakeAction.clone(), cc.callFunc(() => { this.fishNetLayer.node.setPosition(this.originPosition[6]) })));
        // // this.gameSceneLayer.node.runAction(cc.sequence(shakeAction.clone(), cc.callFunc(() => { this.gameSceneLayer.node.setPosition(this.originPosition[7]) })));
        // this.effectLayer.node.runAction(cc.sequence(shakeAction.clone(), cc.callFunc(() => { this.effectLayer.node.setPosition(this.originPosition[8]) })));
        // this.fishDieLayer.node.runAction(cc.sequence(shakeAction.clone(), cc.callFunc(() => { this.fishDieLayer.node.setPosition(this.originPosition[9]) })));
        // this.lightingLayer.node.runAction(cc.sequence(shakeAction.clone(), cc.callFunc(() => { this.lightingLayer.node.setPosition(this.originPosition[10]) })));
        // this.catchFishMulLayer.node.runAction(cc.sequence(shakeAction.clone(), cc.callFunc(() => { this.catchFishMulLayer.node.setPosition(this.originPosition[11]); DataVO.GD.isShaking = false })));

        // for (let i = 0; i < layers.length; ++i) {
        //     let it = i;
        //     if (!layers[i].node.getActionByTag(1234)) {
        //         origin[i] = layers[i].node.position
        //         layers[i].node.runAction(cc.sequence(shakeAction.clone(), cc.callFunc(() => {
        //             layers[i].node.setPosition(origin[it])
        //             DataVO.GD.isShaking = false
        //         })));
        //     }

        // }
    }

    //切换场景
    switchScene(data) {
        this.fishLayer.accelerateAllFish();
        var self = this;
        this.gameSceneLayer.onSwitchScene(data, function () {
            if (DataVO.GD.switingScene) {
                self.fishLayer.clearAllFish();
            }
        });


        this.noticeLayer.showWave();
        DataVO.GD.bgmIndex = data.bgmIndex
        //DataVO.GD.isAllowFire = false;
        DataVO.GD.switingScene = true;
        this.cannonLayer.allUnlockFish();
        this.bulletLayer.allUnlockFish();
    }

    /**
    * 创建新的对话框
    * @param message 对话框内容
    * @param type 类型
    * @param cb 回调函数
    */
    showMessageBox(message, type, cb) {
        cc.log("创建新的对话框");
    }
    /**
    * 开始鱼阵
    * @param data
    */
    startFishArray(data) {
        DataVO.GD.switingScene = false;
        if (this.cannonLayer.cannonArray[DataVO.GD.meChairID].isBitCannon != 2) { //发射钻头炮状态
            DataVO.GD.isAllowFire = true;
        }
        this.fishLayer.clearAllFish();
        this.cannonLayer.allUnlockFish();
        this.bulletLayer.allUnlockFish();
        this.fishLayer.startFishArray(data);
        //鱼震来了就不用加速了
        F_CSBY_GameSceneLayer.seaIsCome = false;
    }
    //结束魔能炮
    endSuperBullet(data) {
        this.cannonLayer.endSuperBullet(data.chairID);
    }
    //填充配置
    fillGameConfig(fishConfig) {
        cc.log(this)
        DataVO.GD.fishConfig = fishConfig;
        //房间配置模式

        //配置游戏 人数
        DataVO.GD.GPlayerNum = fishConfig.chairCount;
        //把玩家的大炮倍数设置成默认的
        for (let i = 0; i < this.cannonLayer.cannonArray.length; ++i) {
            this.cannonLayer.cannonArray[i].setCannonConfigIndex(fishConfig.defCannonIndex);
        }

        //填充完配置才允许开火
        DataVO.GD.isAllowFire = true;
        DataVO.GD.isReady = true;
        this.cannonLayer.updateTaskPro(fishConfig.progress)

    }
    //开火失败
    fireFailure(data) {
        // cc.error("fireFailurefireFailurefireFailurefireFailurefireFailurefireFailure")
        cc.log(data)
        var reason = data.reason;
        var bulletIDArray = data.bulletIDArray;
        var score = data.score;
        var allScore = data.allScore;
        switch (reason) {
            case FireFailureReason.LessMoney:
                SystemToast.GetInstance().buildToast("金币不足");
                break;
            case FireFailureReason.TooManyBullets:
                // SystemToast.GetInstance().buildToast("对不起， 您子弹发射过多， 请稍候");
                break;
            case FireFailureReason.BulletKindError:
                cc.log("子弹类型错误")
                //SystemToast.GetInstance().buildToast("子弹类型错误");
                break;
            case FireFailureReason.DrillBullet:
                SystemToast.GetInstance().buildToast("钻头炮期间 不能开火");
                break;
            default:
                SystemToast.GetInstance().buildToast("对不起， 发射失败， 请稍候");
                break;
        }

        //把子弹收回来， 并把钱加回去
        for (var i = 0; i < bulletIDArray.length; ++i) {
            let _bullet = this.bulletLayer.getBullet(bulletIDArray[i], DataVO.GD.meChairID)
            if (_bullet && _bullet.drillBulletNum > 0) {
                this.cannonLayer.cannonArray[DataVO.GD.meChairID].BitBulletState(50);
            }
            this.cannonLayer.cannonArray[DataVO.GD.meChairID].addScore(score);
            this.bulletLayer.removeBullet(bulletIDArray[i], DataVO.GD.meChairID);
        }
    }

    onDestroy() {
        ClientKernel.GetInstance().connectId = undefined;
        EventManager.getInstance().removeEventListener(gameCMD.SUB_GF_GAME_SCENE.toString(), this.onEventFrameMessage, this);
        EventManager.getInstance().removeEventListener(gameCMD.MDM_GF_GAME.toString(), this.onEventGameMessage, this);
        EventManager.getInstance().removeEventListener(gameCMD.MDM_GF_FRAME.toString(), this.onEventFrameMessage, this);
        EventManager.getInstance().removeEventListener(mpNetEvent.EnterGame, this.msgEnterGame, this);
        // this.destroyPrefabs()
        GameUserManager.GetInstance().tableUserItem = []
    }

    destroyPrefabs() {
        for (let i = 1; i < 21; i++) {
            DataVO.GD.nodePools["fish_" + i].destory()
        }

        for (let item in prefabsCFG) {
            DataVO.GD.nodePools[item].destory()
        }
    }

    onGameHideOrShow() {
        cc.game.on(cc.game.EVENT_SHOW, event => {
            // return cc.log('emit cc.game.EVENT_SHOW!');
            // SUB_S_FISH_TRACE
            cc.log('emit cc.game.EVENT_SHOW!');
            cc.log(cc.director.getTotalTime())
            DataVO.GD.gameback = true;
            let eps = Math.floor(cc.director.getTotalTime() - DataVO.GD.gameeplase)
            DataVO.GD.msgflitter = DataVO.GD.msgTime + eps - 5000
            DataVO.GD.msgbackindex = 0

            // let chi = DataVO.GD.mainScene.fishLayer.node.children
            // let si = cc.winSize;
            // for (let i = 0; i < chi.length; i++) {
            //     if (chi[i].x < 0 || chi[i].x > si.width || chi[i].y < 0 || chi[i].y > si.height) {
            //         (chi[i].getComponent("F_CSBY_Fish") as F_CSBY_Fish).removeSelf();
            //     }
            // }

            // DataVO.GD.backtime = DataVO.GD.msgTime
            // cc.log('###########################');
            // cc.log(`eps     ${eps}         ${DataVO.GD.backtime}                ${DataVO.GD.backtime - DataVO.GD.hidebacktime}`);

        });

        cc.game.on(cc.game.EVENT_HIDE, event => {
            // return cc.log('emit cc.game.EVENT_HIDE!');
            cc.log('emit cc.game.EVENT_HIDE!');
            cc.log(cc.director.getTotalTime());
            DataVO.GD.gameeplase = cc.director.getTotalTime()

            // DataVO.GD.hidebacktime = DataVO.GD.msgTime
            // cc.log('@@@@@@@@@@@@@@@@@@');
            // cc.log(DataVO.GD.hidebacktime)
        });
    }
}
