import { V, GNoticeDieOut, GMaxNoticeNum } from "../F_CSBY_Config";
import SoundManager from "../../../../common/managers/SoundManager";
import { FishKind } from "../SubGameMSG";
import F_CSBY_Notice from "../node/F_CSBY_Notice";
import { EventManager } from "../../../../common/managers/EventManager";
import gameCMD from "../../../../extend/GameCMD";
import { resLoader } from "../../../../common/res/ResLoader";
import { DataVO } from "../../../../plaza/model/DataVO";
import SystemToast from "../../../../extend/ui/SystemToast";
import Util from "../../../../extend/Util";
import UserInfo from "../../../../plaza/model/UserInfo";

/**
 * 公告提示层
 */

export let rewardArr = []

const { ccclass, property } = cc._decorator;

@ccclass
export default class F_CSBY_NoticeLayer extends cc.Component {
    //boss警告图片
    @property(cc.Sprite)
    showBossSprite: cc.Sprite = null;
    //Wave警告
    @property(cc.Sprite)
    showWaveSprite: cc.Sprite = null;
    //滚动公告提示
    noticeArray;
    //显示翻倍奖励提示
    @property(cc.Node)
    showReward: cc.Node = null

    @property([cc.Label])
    labals: cc.Label[] = []

    @property(cc.Sprite)
    sp: cc.Sprite = null

    @property(cc.Sprite)
    sp1: cc.Sprite = null

    @property(cc.Node)
    noopreationnd: cc.Node = null

    @property(cc.Label)
    retime: cc.Label = null

    @property(cc.Button)
    noclose: cc.Button = null

    isShowing: boolean = false;

    cannonAtlas: cc.SpriteAtlas;
    fishKindShow: any;

    sch = null

    tname = ['欢乐厅', '财神厅', '富豪厅']
    onLoad() {
        this.noticeArray = [];
    }

    start() {
        this.eventList();
        this.noclose.node.on(cc.Node.EventType.TOUCH_START, this.OnCloseNo, this);
        this.fishKindShow = {
            15: 'GP_Roulette3_15_png',
            16: 'GP_Roulette3_16_png',
            17: 'GP_Roulette3_17_png',
            18: 'GP_Roulette3_18_png',
            19: 'GP_Roulette3_19_png',

            20: 'GP_Broadcast_Symbol19_png',
            21: 'GP_Broadcast_Symbol100_png',

            22: 'GP_Broadcast_Symbol100_png',
            23: 'GP_Broadcast_Symbol101_png',
            24: 'GP_Broadcast_Symbol103_png',
            25: 'GP_Broadcast_Symbol102_png',
        }
        this.cannonAtlas = DataVO.GD.mainScene.cannonLayer.cannonAtlas;
        let roomName = UserInfo.GetInstance().getData().userStatus.roomName
        let ratearr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
        let basearr = [200, 250, 300]//财神
        let basearr1 = [160, 200]//幸运轮盘
        let basearr2 = [150, 160, 170, 180, 190, 200, 250, 300]//财神发发发
        let idx = 0
        let rate = 1
        let base = 200
        let target = Util.randNum(5, 8, true)
        let cur = 0
        this.sch = (dt) => {
            cur += dt
            // cc.log(cur + '       ' + target)
            if (cur >= target) {
                // if (roomName.indexOf('欢乐厅') != -1) {
                //     idx = Util.randNum(1, 10, true)
                // }
                let nameid = Util.randNum(0, 3, true)
                if (nameid == 0) {
                    idx = Util.randNum(1, ratearr.length, true)
                }
                if (nameid == 1) {
                    idx = Util.randNum(1, ratearr.length, true)
                }
                if (nameid == 2) {
                    idx = Util.randNum(10, ratearr.length, true)
                }
                rate = ratearr[idx]
                let rd = Util.randNum(0, 3, true)
                let kind = 23
                if (rd == 0) {
                    base = basearr[Util.randNum(0, 3, true)]
                    kind = 23//财神
                }
                if (rd == 1) {
                    base = basearr1[Util.randNum(0, 2, true)]
                    kind = 25//幸运轮盘
                }
                if (rd == 2) {
                    base = basearr2[Util.randNum(0, basearr2.length, true)]
                    kind = 24//发发发
                }

                target = Util.randNum(5, 8, true)
                cur = 0
                // cc.log(UserInfo.GetInstance().getData())
                let data = {}
                data['data'] = {}
                data['data']['nickname'] = Util.randNum(123000, 1111998, true) + ''
                data['data']['roomName'] = this.tname[nameid]
                data['data']['fishMultiple'] = base + ''
                data['data']['score'] = rate * base + ''
                data['data']['fishKind'] = kind + ''
                rewardArr.push(data)
                this.showRewardF()
            }
        }

        this.schedule(this.sch, 0.1, 1e+9)

    }

    eventList(): void {
        EventManager.getInstance().addEventListener(gameCMD.SUB_GF_NOTICE_TIMEOUT.toString(), this.onNoOpreation, this);
        EventManager.getInstance().addEventListener(gameCMD.SUB_GF_KICK_TIMEOUT.toString(), this.onKickTimeOut, this);
    }

    onNoOpreation() {
        this.noopreationnd.active = true;
        let re = 29;
        cc.director.getScheduler().schedule(() => {
            re--;
            if (re > 0) {
                this.retime.string = `${re}s`
            } else {
                cc.director.getScheduler().unscheduleAllForTarget(this.noopreationnd);
            }
        }, this.noopreationnd, 1, 10, 0, false)
    }

    //消息消亡
    noticeDieOut() {
        if (this.noticeArray.length > 0) {
            var noticeNode = this.noticeArray.shift();
            if (noticeNode) {
                noticeNode.runAction(cc.sequence(cc.scaleTo(0.4, 0, 0.5), cc.removeSelf()));
            }
        }
    }
    pushNotice(data) {
        let noticeNode = new F_CSBY_Notice(data.data);
        noticeNode.node.setScale(0, 0.5);
        noticeNode.node.runAction(cc.sequence(cc.scaleTo(0.4, 1, 1)));

        if (this.noticeArray.length > 0) {

            var py = this.noticeArray[this.noticeArray.length - 1].py() + noticeNode.node.height;
            noticeNode.node.setPosition(V.w / 2, Math.floor(py))
            noticeNode.node.setParent(this.node)
            noticeNode.node.runAction(cc.moveBy(0.1, 0, (V.h - 100) - py));
        }
        else {
            noticeNode.node.setPosition(V.w / 2, V.h - 100)
            noticeNode.node.setParent(this.node)
        }

        this.noticeArray.push(noticeNode);
        noticeNode.node.runAction(cc.sequence(cc.delayTime(GNoticeDieOut), cc.callFunc(this.noticeDieOut.bind(this))));
        if (this.noticeArray.length > GMaxNoticeNum) {
            //最老的消亡
            this.noticeDieOut();
        }
        this.adjustView();
    }

    adjustView() {
        for (let i = 0; i < this.noticeArray.length; ++i) {
            var noticeNode = this.noticeArray[i];
            noticeNode.runAction(cc.moveBy(0.5, 0, Math.floor(-noticeNode.ch())));
        }
    }

    showRewardF() {
        if (!this.isShowing && rewardArr.length != 0) {
            cc.log(rewardArr);
            this.isShowing = true;
            this.showReward.active = true;
            let data = rewardArr.shift()['data'];
            let mp = cc.find('cover/movetips', this.showReward)
            let mp1 = cc.find('cover/movetips1', this.showReward)
            if (data.fishMultiple < 500) {
                mp.active = true
                mp1.active = false
            } else {
                mp.active = false
                mp1.active = true
            }
            cc.log(data);
            // this.labals[0].string = '****' + (data.nickname.length > 3 ? data.nickname.substr(data.nickname.length - 3) : data.nickname);
            this.labals[0].string = (data.nickname.length > 3 ? data.nickname.substr(data.nickname.length - 3) : data.nickname);
            let name = '财神厅'
            name = data.roomName.indexOf('欢乐厅') ? this.tname[0] : this.tname[1]
            name = data.roomName.indexOf('财神厅') ? this.tname[1] : this.tname[1]
            name = data.roomName.indexOf('富豪厅') ? this.tname[2] : this.tname[1]
            this.labals[1].string = name;
            this.labals[2].string = data.fishMultiple;
            this.labals[3].string = Math.floor(data.score).toString();
            if (data.fishKind <= FishKind.LuckRun) {
                this.sp.spriteFrame = this.cannonAtlas.getSpriteFrame(this.fishKindShow[data.fishKind]);
            } else {
                // this.sp1.spriteFrame = this.cannonAtlas.getSpriteFrame(this.fishKindShow[data.fishKind]);
            }
            this.showReward.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(() => { this.showReward.active = false; this.isShowing = false; this.showRewardF() })));
        }

    }

    //显示boss警告
    showWarn(type?) {
        //cc.error('财神来了，换音乐')
        this.showBossSprite.node.active = true;
        this.showBossSprite.node.x = 1092
        this.showBossSprite.node.runAction(cc.sequence(cc.moveTo(0.5, 0, 50), cc.delayTime(3), cc.moveTo(0.5, -1292, 50), cc.callFunc(this.hideWarn.bind(this))))
        SoundManager.getInstance().stopMusic();
        SoundManager.getInstance().playMusic(4001, "subgame");
        //SoundManager.getInstance().playFx("warn");
    }
    //隐藏boss警告
    hideWarn() {
        this.showBossSprite.node.active = false;
        cc.director.getScheduler().unscheduleAllForTarget(this.noopreationnd);
    }

    onKickTimeOut() {
        // cc.director.loadScene('RoomScene');
        DataVO.GD.forceExit = true
        // SystemToast.GetInstance().buildPrompt('尊敬的玩家，您已闲置太久，我们将关闭游戏，并自动结算结果', 1, () => {
        //     window.location.href = window.location.href
        //     // cc.director.loadScene('RoomScene');          
        // }, null)
        SystemToast.GetInstance().buildPromptNew('尊贵的玩家:您已闲置游戏过久，我们将关闭游戏，并自动', 100, 2, () => {
            window.location.href = window.location.href
            // cc.director.loadScene('RoomScene');          
        }, () => {
            window.location.href = window.location.href
        })
    }

    OnCloseNo() {
        this.noopreationnd.active = false;
    }

    onDestroy() {
        EventManager.getInstance().removeEventListener(gameCMD.SUB_GF_NOTICE_TIMEOUT.toString(), this.onNoOpreation, this);
        EventManager.getInstance().removeEventListener(gameCMD.SUB_GF_KICK_TIMEOUT.toString(), this.onKickTimeOut, this);
        this.unschedule(this.sch)
    }
    //显示冲浪警告
    showWave() {
        this.showWaveSprite.node.active = true;
        (this.showWaveSprite.getComponent(cc.Animation) as cc.Animation).play();
        // this.showWaveSprite.node.x = 1092
        // this.showWaveSprite.node.runAction(cc.sequence(cc.moveTo(0.5, 0, 0), cc.delayTime(1), cc.moveTo(0.5, -1092, 0), cc.callFunc(this.hideWarn.bind(this))))
        // this.showWaveSprite.node.runAction(cc.scaleTo(1,1).easing(cc.easeElasticOut))
        //SoundManager.getInstance().playFx("warn");
    }
    //隐藏冲浪警告
    hideWave() {
        this.showWaveSprite.node.active = false;
    }
}
