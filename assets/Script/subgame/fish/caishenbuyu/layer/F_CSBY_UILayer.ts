import SocketManager from "../../../../common/managers/SocketManager";
import { mpNetEvent, exitEnum } from "../../../../extend/MPDefine";
import ClientKernel from "../../../../extend/ClientKernel";
import SoundManager from "../../../../common/managers/SoundManager";
import { UIConf, uiManager } from "../../../../common/managers/UIManager";
import { DataVO } from "../../../../plaza/model/DataVO";
import { EventManager } from "../../../../common/managers/EventManager";
import Util from "../../../../extend/Util";
import UserInfo from "../../../../plaza/model/UserInfo";


const { ccclass, property } = cc._decorator;

export enum UIID {
    infopannel,
}

export let UICF: { [key: number]: UIConf } = {
    [UIID.infopannel]: { prefab: "plaza/prefab/ui/helpUI" },
}


@ccclass
export default class F_SCBY_UILayer extends cc.Component {

    @property(cc.Node)
    setingNode: cc.Node = null;

    @property(cc.Button)
    showbtn: cc.Button = null;
    // LIFE-CYCLE CALLBACKS:
    @property(cc.Button)
    hidebtn: cc.Button = null;

    @property(cc.Button)
    infobtn: cc.Button = null;

    @property(cc.Button)
    soundbtn: cc.Button = null;

    @property(cc.Button)
    closebtn: cc.Button = null;

    soundSwitch: boolean = true;

    @property(cc.Node)
    circle: cc.Node = null

    @property(cc.Node)
    yoursite: cc.Node = null

    @property(cc.Button)
    closguidebtn: cc.Button = null;

    @property(cc.Node)
    guidenode: cc.Node = null

    @property(cc.Node)
    yournode: cc.Node = null

    @property(cc.Label)
    minBullet: cc.Label = null

    @property(cc.Sprite)
    roomname: cc.Sprite = null

    @property(cc.Label)
    roomminmax: cc.Label = null

    @property(cc.Node)
    lodingnd: cc.Node = null

    @property(cc.Sprite)
    tips: cc.Sprite = null

    @property(cc.SpriteAtlas)
    spa: cc.SpriteAtlas = null;

    @property(cc.ProgressBar)
    ps: cc.ProgressBar = null

    @property(cc.Sprite)
    sor: cc.Sprite = null

    firecb
    isfirecnt = 0;
    isfireing = false;

    isplaygame = false;//是否在小游戏
    step = 1
    loadPersent = 0
    onLoad() {
        this.showbtn.node.on(cc.Node.EventType.TOUCH_END, this.onShowPanel, this);
        this.hidebtn.node.on(cc.Node.EventType.TOUCH_END, this.onHidePanel, this);
        this.infobtn.node.on(cc.Node.EventType.TOUCH_END, this.onShowInfo, this);
        this.soundbtn.node.on(cc.Node.EventType.TOUCH_END, this.onChangeSound, this);
        this.closebtn.node.on(cc.Node.EventType.TOUCH_END, this.onCloseGame);
        EventManager.getInstance().addEventListener('reSetDone', this.hideLoading, this);
        EventManager.getInstance().addEventListener('rePluss', this.updatePersent, this);
        EventManager.getInstance().addEventListener('isFire', this.isFire, this);
    }

    start() {
        DataVO.GD.uiLayer = this
        // let rd = Math.floor(Util.randNum(1, 9));
        // cc.log('加载图片为  ' + `GP_Loading_Msg_0${rd}_cn_png`);
        this.tips.node.active = true
        this.tips.spriteFrame = this.spa.getSpriteFrame(`GP_Loading_Msg_0${DataVO.GD.tips3}_cn_png`);
        this.lodingnd.active = true; //放在前一个页面处理
        this.ps.progress = 1.0
        // this.lodingnd.active = false;
        this.circle.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.4, 1.2, 1.2), cc.scaleTo(0.4, 1, 1))))
        this.yoursite.runAction(cc.repeatForever(cc.sequence(cc.moveBy(0.4, cc.v2(0, 30)), cc.moveBy(0.4, cc.v2(0, -30)))))
        this.closguidebtn.node.on(cc.Node.EventType.TOUCH_START, this.onCloseGuide, this)
        EventManager.getInstance().addEventListener("onUserEnter", this.showMe, this);

        // cc.log('=================>>>>>>>>>>>>>>>>>>>>>>>')
        let userinfo = UserInfo.GetInstance().getData().userStatus.selectRoomInfo
        // cc.log(userinfo)
        this.roomminmax.string = userinfo.minBullet + '-' + userinfo.maxBullet
        this.minBullet.string = userinfo.minBullet

        let id = userinfo.sortID + 1
        this.roomname.spriteFrame = this.spa.getSpriteFrame('UI_Room_Msg' + id + '_cn_png');

        let it = 0;
        cc.director.getScheduler().schedule(() => {
            it += 0.005;
            if (it >= 1.0) {
                it = 1.0;
                SocketManager.getInstance().emit(mpNetEvent.EnterGame, { GamesRoomID: UserInfo.GetInstance().getData().userStatus.selectRoomInfo.roomID, Action: 1 });//玩家坐下
                cc.director.getScheduler().unscheduleAllForTarget(this.lodingnd);
                // this.lodingnd.active = false;

            }
            if (it < this.loadPersent / 41) {
                this.ps.progress = it
            }
            else {
                it -= 0.005
            }
        }, this.lodingnd, 0.001, 1e+9, 0, false);

        let si = cc.winSize
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            let pp = cc.v2(event.getLocation().x - si.width * 0.5, event.getLocation().y - si.height * 0.5);
            // cc.log(pp.x + '     ' + pp.y);
            this.sor.node.setPosition(pp)
        }, this);

        this.firecb = () => {
            if (this.isfireing) {
                this.isfirecnt++;
                if (this.isfirecnt > 60) {
                    this.showbtn.node.active = true;
                }
            } else {
                this.isfireing = false;
            }

        }
        this.schedule(this.firecb, 0.01, 1e+9)
        this.soundSwitch = SoundManager.getInstance().getEnable();
        this.soundbtn.node.getChildByName('Background').active = this.soundSwitch;

    }


    updatePersent() {
        this.loadPersent += this.step
    }

    isFire(name, data) {
        this.isfireing = true
        this.isfirecnt = 0
        this.showbtn.node.active = false;
    }

    hideLoading() {
        setTimeout(() => { this.lodingnd.active = false; }, 500);
        EventManager.getInstance().removeEventListener('reSetDone', this.hideLoading, this);
    }

    showMe(name, userItem) {
        cc.log('我的位置    ' + DataVO.GD.meChairID)
        cc.log(cc.winSize.width)

        if ((userItem.getChairID() == DataVO.GD.meChairID)) {

            setTimeout(() => {
                if (DataVO.GD.meChairID == 1 || DataVO.GD.meChairID == 3) {
                    this.yournode.getComponent(cc.Widget).isAlignLeft = false;
                    this.yournode.getComponent(cc.Widget).isAlignRight = true;
                    this.yournode.getComponent(cc.Widget).right = 385
                    if (cc.winSize.width < 1280 && cc.winSize.width > 960) {
                        this.yournode.getComponent(cc.Widget).right = 385 * 0.8 - 6
                        this.yournode.setScale(0.78)
                        this.yournode.y -= 11
                    }
                    if (cc.winSize.width <= 960) {
                        this.yournode.getComponent(cc.Widget).right = 383 * 0.65
                        this.yournode.setScale(0.7)
                        this.yournode.y -= 11

                    }
                }
                else {
                    this.yournode.getComponent(cc.Widget).isAlignLeft = true;
                    this.yournode.getComponent(cc.Widget).isAlignRight = false;
                    this.yournode.getComponent(cc.Widget).left = 405
                    if (cc.winSize.width < 1280 && cc.winSize.width > 960) {
                        this.yournode.getComponent(cc.Widget).left = 405 * 0.8 - 6
                        this.yournode.setScale(0.78)
                        this.yournode.y -= 11

                    }
                    if (cc.winSize.width < 960) {
                        this.yournode.getComponent(cc.Widget).left = 405 * 0.65
                        this.yournode.setScale(0.7)
                        this.yournode.y -= 11

                    }
                }
                this.yournode.active = true;
            }, 200)
        }
    }

    onShowPanel(e): void {
        SoundManager.getInstance().playID(201, "subgame");
        this.showbtn.node.active = false
        this.showbtn.interactable = false
        this.setingNode.active = true;
        this.isfireing = false;
        this.setingNode.runAction(cc.sequence(cc.moveBy(0.2, cc.v2(120, 0)), cc.callFunc(() => { this.hidebtn.interactable = true; })));
    }

    //点击退出游戏
    onCloseGame(e): void {
        DataVO.GD.exitType = exitEnum.forceExit
        SoundManager.getInstance().playID(201, "subgame");
        ClientKernel.GetInstance().stopWebSocket();
        SocketManager.getInstance().emit(mpNetEvent.UserRoomOut, {});// 退出房间
        cc.director.loadScene("RoomScene");
        DataVO.GD.preScene = 'SG_F_CSBY_MainScene'
    }
    //激活轮盘
    activeRoulette(triggerArray, Mul, postion) {
        //this.isplaygame = true
        let Roulette = DataVO.GD.nodePools["Roulette"].getNode();
        (Roulette as cc.Node).getComponent("F_CSBY_Roulette").activeRoulette(triggerArray, Mul, postion);
        (Roulette as cc.Node).setParent(this.node)
    }
    //激活红包
    activeRedBag(triggerArray, score, Mul, postion) {
        //this.isplaygame = true
        let openredbag = DataVO.GD.nodePools["openredbag"].getNode();
        (openredbag as cc.Node).getComponent("F_CSBY_Bag").activeBag(triggerArray, score, Mul, postion);
        (openredbag as cc.Node).setParent(this.node)
    }

    onHidePanel(): void {
        SoundManager.getInstance().playID(202, "subgame");
        this.hidebtn.interactable = false
        this.setingNode.runAction(cc.sequence(cc.moveBy(0.2, cc.v2(-120, 0)), cc.callFunc(() => {
            this.setingNode.active = false;
            this.showbtn.node.active = true;
            this.showbtn.interactable = true;
        })));
    }

    onShowInfo(e): void {
        SoundManager.getInstance().playID(201, "subgame");
        cc.log('打开一个界面');
        uiManager.initUIConf(UICF);
        uiManager.open(UIID.infopannel);
        this.onHidePanel();
    }

    onChangeSound(e): void {
        this.soundSwitch = !this.soundSwitch
        this.soundbtn.node.getChildByName('Background').active = this.soundSwitch;
        SoundManager.getInstance().setEnabled(this.soundSwitch);
    }

    onCloseGuide() {
        this.guidenode.removeFromParent();
    }

    onChangePage(cur: number) {

    }
    onChangeInnerPage() { }

    // update (dt) {}
    onDestroy() {
        EventManager.getInstance().removeEventListener("onUserEnter", this.showMe, this);
        EventManager.getInstance().removeEventListener('isFire', this.isFire, this);
        EventManager.getInstance().removeEventListener('reSetDone', this.hideLoading, this);
        EventManager.getInstance().removeEventListener('rePluss', this.updatePersent, this);

    }
}
