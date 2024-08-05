import { EventManager } from "../../../../common/managers/EventManager";
import SocketManager from "../../../../common/managers/SocketManager";
import { mpNetEvent } from "../../../../extend/MPDefine";
import SystemToast from "../../../../extend/ui/SystemToast";
import Util from "../../../../extend/Util";
import UserInfo from "../../../../plaza/model/UserInfo";

const { ccclass, property } = cc._decorator;
@ccclass
export default class AchieveGame extends cc.Component {

    // @property({ type: cc.Node })
    gamePannel: cc.Node = null

    // @property({ type: cc.Node })
    gameNode: cc.Node = null

    // @property({ type: cc.Node })
    closeGamePannel: cc.Node = null

    // @property({ type: cc.Node })
    closeliteGame: cc.Node = null

    // @property({ type: cc.ToggleContainer })
    leftNav: cc.ToggleContainer = null

    // @property({ type: cc.Node })
    openGame: cc.Node = null

    // @property({ type: cc.Node })
    infoBtn: cc.Node = null

    // @property({ type: cc.Node })
    closeinfoBtn: cc.Node = null

    // @property({ type: cc.Node })
    rule: cc.Node = null

    // @property({ type: cc.Node })
    infoPannle: cc.Node = null

    // @property({ type: cc.Label })
    usernameLable: cc.Label = null

    // @property({ type: cc.Label })
    timeLable: cc.Label = null

    // @property({ type: cc.Label })
    canUseDiamondLable: cc.Label = null

    // @property({ type: cc.Label })
    expUseDiamondLable: cc.Label = null

    // @property({ type: cc.Label })
    totalCoinLable: cc.Label = null

    // @property({ type: cc.Label })
    usedDiamondLable: cc.Label = null

    // @property({ type: cc.Label })
    lastGameNameLable: cc.Label = null

    // @property({ type: cc.Label })
    lastGameTimeLable: cc.Label = null

    // @property({ type: cc.Label })
    rateLable: cc.Label = null

    // @property({ type: Node })
    items: cc.Node[] = []

    // @property({ type: cc.Node })
    result: cc.Node = null

    // @property({ type: cc.Label })
    mulLable: cc.Label = null

    // @property({ type: cc.Label })
    stoneLable: cc.Label = null

    // @property({ type: cc.ToggleContainer })
    btmNav: cc.ToggleContainer = null

    itemsOrignPos: cc.Vec2[] = []

    armatureNames: string[] = []
    animationNames: string[] = []

    first = 0
    getAchieveMent
    askAchieveMent

    start() {
        this.getAchieveMent = UserInfo.GetInstance().getData().getAchieveMent
        if (Object.keys(this.getAchieveMent).length === 0) {
            return
        }

        this.initNode()
        this.initClickEvent()
        this.initEvent()
    }

    initEvent() {
        EventManager.getInstance().addEventListener(mpNetEvent.AskPlayAchievement, this.msgGetAchievement, this);
    }

    msgGetAchievement(name, data) {
        cc.log(data)
        this.askAchieveMent = data
        this.getAchieveMent = data
        this.canUseDiamondLable.string = this.askAchieveMent['margin']
        this.expUseDiamondLable.string = Util.kFormatter(Number(this.askAchieveMent['dueNum']))
        this.timeLable = this.askAchieveMent['dunTime']
        this.totalCoinLable.string = Util.kFormatter(Number(this.askAchieveMent['turnover']))
        this.usedDiamondLable.string = this.askAchieveMent['consumeNum']
        this.lastGameNameLable.string = this.askAchieveMent['lastGameCode']
        this.lastGameTimeLable.string = this.askAchieveMent['lastGameTime']
        this.stoneLable.string = this.askAchieveMent['margin']

        this.clickItem.parent.zIndex = 98
        cc.find('bg/reshield', this.gameNode).active = true
        cc.log('等到结果？？？！！！')
        // this.clickItem.parent.getComponent(dragonBones.ArmatureDisplay).armatureName = this.armatureNames[0]
        let display = this.clickItem.parent.getComponent(dragonBones.ArmatureDisplay)
        display.playAnimation(this.animationNames[3], 1)
        let lab = cc.find('num', this.clickItem.parent)
        lab.active = true
        lab.getComponent(cc.Label).string = this.askAchieveMent['getMult']
        lab.scale = 0
        cc.Tween.stopAllByTarget(lab)
        cc.tween(lab).delay(0.66).to(0.23, { scale: 1.26 }).to(0.07, { scale: 1 }).start()
        display.addEventListener(dragonBones.EventObject.COMPLETE, () => {
            display.removeEventListener(dragonBones.EventObject.COMPLETE)
            display.playAnimation(this.animationNames[0], 1)
            display.addEventListener(dragonBones.EventObject.COMPLETE, () => {
                display.removeEventListener(dragonBones.EventObject.COMPLETE)
                let result = cc.find('bg/result', this.gameNode)
                cc.find('bg/reshield', this.gameNode).zIndex = 99
                result.active = true
                result.zIndex = 99
                let redani = result.getComponent(dragonBones.ArmatureDisplay)
                for (let j = 0; j < 5; j++) {
                    this.items[j].zIndex = 0
                }
                let g = cc.find('ATTACHED_NODE_TREE/ATTACHED_NODE:root/ATTACHED_NODE:All/ATTACHED_NODE:Btn_Area/getReward', result)
                let gcall = () => {
                    g.off(cc.Node.EventType.TOUCH_END, gcall, this)
                    if (!this.canGetReward) { return }
                    this.canGetReward = false
                    let redani = result.getComponent(dragonBones.ArmatureDisplay)
                    redani.playAnimation('out', 1)
                    redani.addEventListener(dragonBones.EventObject.COMPLETE, () => {
                        this.canClickBox = true
                        redani.removeEventListener(dragonBones.EventObject.COMPLETE)
                        cc.log('点击领取？？？？？')
                        cc.find('bg/reshield', this.gameNode).zIndex = 0
                        cc.find('bg/reshield', this.gameNode).active = false
                        for (let i = 0; i < 5; i++) {
                            this.items[i].getComponent(dragonBones.ArmatureDisplay).armatureName = this.armatureNames[0]
                            this.items[i].getComponent(dragonBones.ArmatureDisplay).playAnimation(this.animationNames[1], 0)
                            let lab = cc.find('num', this.items[i])
                            lab.active = false
                        }
                    }, this)
                }
                redani.playAnimation('in', 1)
                redani.addEventListener(dragonBones.EventObject.COMPLETE, () => {
                    redani.removeEventListener(dragonBones.EventObject.COMPLETE)
                    g.on(cc.Node.EventType.TOUCH_END, gcall, this)
                }, this)
                let num = cc.find('ATTACHED_NODE_TREE/ATTACHED_NODE:root/ATTACHED_NODE:All/ATTACHED_NODE:Total_win_NUM/num', result)
                num.getComponent(cc.Label).string = this.askAchieveMent['gold']
                cc.Tween.stopAllByTarget(num)
            }, this)
        }, this)
        let name1 = this.clickItem.parent.name.split('m')
        for (let j = 0; j < 5; j++) {
            if (j + '' != name1[1]) {
                this.items[j].getComponent(dragonBones.ArmatureDisplay).playAnimation(this.animationNames[2], 1)
                this.items[j].zIndex = 0
            }
        }
    }

    initNode() {

        this.gamePannel = cc.find('gamepannel', this.node)
        this.closeGamePannel = cc.find('close', this.gamePannel)
        this.leftNav = cc.find('ToggleContainer', this.gamePannel).getComponent(cc.ToggleContainer)
        this.openGame = cc.find('playbtn', this.gamePannel)
        this.infoBtn = cc.find('gamehelpinfo', this.gamePannel)
        this.closeinfoBtn = cc.find('info/close', this.gamePannel)
        this.rule = cc.find('rule', this.gamePannel)
        this.infoPannle = cc.find('info', this.gamePannel)
        this.usernameLable = cc.find('username', this.gamePannel).getComponent(cc.Label)
        this.usernameLable.string = UserInfo.GetInstance().getData().nickname
        this.timeLable = cc.find('time', this.gamePannel).getComponent(cc.Label)
        this.timeLable.string = this.getAchieveMent['dunTime']
        this.canUseDiamondLable = cc.find('diamondcount', this.gamePannel).getComponent(cc.Label)
        // this.canUseDiamondLable.string = Util.kFormatter(Number(this.getAchieveMent['margin']))
        this.canUseDiamondLable.string = this.getAchieveMent['margin']
        this.expUseDiamondLable = cc.find('expiredcount', this.gamePannel).getComponent(cc.Label)
        this.expUseDiamondLable.string = Util.kFormatter(Number(this.getAchieveMent['dueNum']))
        this.totalCoinLable = cc.find('totalbetnum', this.gamePannel).getComponent(cc.Label)
        this.totalCoinLable.string = Util.kFormatter(Number(this.getAchieveMent['turnover']))
        this.usedDiamondLable = cc.find('usedcoinnum', this.gamePannel).getComponent(cc.Label)
        // this.usedDiamondLable.string = Util.kFormatter(Number(this.getAchieveMent['consumeNum']))
        this.usedDiamondLable.string = this.getAchieveMent['consumeNum']
        this.lastGameNameLable = cc.find('gamename', this.gamePannel).getComponent(cc.Label)
        this.lastGameNameLable.string = this.getAchieveMent['lastGameCode']
        this.lastGameTimeLable = cc.find('gametime', this.gamePannel).getComponent(cc.Label)
        this.lastGameTimeLable.string = this.getAchieveMent['lastGameTime']


        this.gameNode = cc.find('game', this.node)
        this.gameNode.active = true
        this.rateLable = cc.find('bg/rewardmultliplier/num', this.gameNode).getComponent(cc.Label)
        this.rateLable.string = this.getAchieveMent['config']['stoneAndMult']['10'] + 'x'
        this.closeliteGame = cc.find('bg/back', this.gameNode)
        this.result = cc.find('bg/result', this.gameNode)
        this.mulLable = cc.find('bg/rewardmultliplier/num', this.gameNode).getComponent(cc.Label)
        this.stoneLable = cc.find('bg/stonenum', this.gameNode).getComponent(cc.Label)
        this.stoneLable.string = this.getAchieveMent['margin']
        for (let i = 0; i < 5; i++) {
            this.items[i] = cc.find('bg/item' + i, this.gameNode)
            this.itemsOrignPos[i] = this.items[i].getPosition()
        }
        this.armatureNames = this.items[0].getComponent(dragonBones.ArmatureDisplay).getArmatureNames()//Click_Obj Total_win Multliplier Click_FX
        this.animationNames = this.items[0].getComponent(dragonBones.ArmatureDisplay).armature().armatureData.animationNames // Choose Idle NoChoose Press
        this.btmNav = cc.find('bg/ToggleContainer', this.gameNode).getComponent(cc.ToggleContainer)
    }

    initClickEvent() {
        this.closeGamePannel.on(cc.Node.EventType.TOUCH_END, this.onCloseGamePannel, this)
        this.openGame.on(cc.Node.EventType.TOUCH_END, this.onOpenGame, this)
        // this.closeliteGame.on(cc.Node.EventType.TOUCH_END, this.onCloseGame, this)
        this.infoBtn.on(cc.Node.EventType.TOUCH_END, this.onOpenInfo, this)
        this.closeinfoBtn.on(cc.Node.EventType.TOUCH_END, this.onCloseInof, this)
        // let btms = this.btmNav.toggleItems
        // btms.forEach(element => {
        //     element.node.on('toggle', (eventHandler, customEventData) => {
        //         for (let j = 0; j < btms.length; j++) {
        //             cc.find('num', btms[j].node).color = cc.color(79, 79, 79)
        //         }
        //         cc.log(eventHandler.target.name)
        //         cc.find('num', eventHandler.target).color = cc.color(255, 255, 255);
        //     });
        // })
        let btms = this.btmNav.node.children
        for (let i = 0; i < btms.length; i++) {
            // btms[i].getComponent(cc.Toggle).node.on('toggle', (eventHandler, customEventData) => {//这里的toggle事件检测机制和需求不匹配   eventHandler回调参数是toggle组件
            // let tmp = this.btmNav.node.children
            btms[i].getComponent(cc.Toggle).node.on(cc.Node.EventType.TOUCH_END, (eventHandler, customEventData) => {
                for (let j = 0; j < btms.length; j++) {
                    cc.find('num', btms[j]).color = cc.color(79, 79, 79)
                }
                cc.log(eventHandler.target.name)
                let sts = [10, 100, 400, 800]
                this.stonecount = sts[Number(eventHandler.target.name.split('e')[1])]
                cc.find('num', eventHandler.target).color = cc.color(255, 255, 255);
                this.rateLable.string = this.getAchieveMent['config']['stoneAndMult'][this.stonecount + ''] + 'x'
            }, this)
        }
        let lefts = this.leftNav.node.children
        for (let i = 0; i < lefts.length; i++) {
            lefts[i].getComponent(cc.Toggle).node.on('toggle', this.onChangeLeftNav, this)
        }
        cc.log(this.closeliteGame)
        if (this.first == 0) {
            cc.log('??????????????')
            for (let j = 0; j < btms.length; j++) {
                // let color = cc.Color.BLACK;
                // color.fromHEX("#4F4F4F");
                cc.find('num', btms[j]).color = cc.color(79, 79, 79)
            }
            //@ts-ignore        
            // let color = cc.Color.BLACK;
            // color.fromHEX("#FFFFFF");
            cc.find('num', btms[0]).color = cc.color(255, 255, 255);
        }

    }

    initGameStatus() {
        this.node.y = 0
        this.node.getComponent(cc.Widget).top = 0
        this.node.getComponent(cc.Widget).bottom = 0
        this.gameNode.active = false
        // this.gameNode.opacity = 0
        this.infoPannle.active = false
        cc.find('bg/reshield', this.gameNode).active = false
        cc.find('shield', this.node).active = false
    }

    onCloseGamePannel() {
        this.node.y = -10000
        this.node.getComponent(cc.Widget).top = 10000
        this.node.getComponent(cc.Widget).bottom = -10000
    }

    stonecount = 10
    clickItem
    canGetReward
    canClickBox

    onOpenGame() {
        this.canGetReward = true
        this.canClickBox = true
        cc.find('shield', this.node).active = true
        if (this.first == 1) {
            let btms = this.btmNav.node.children
            for (let j = 0; j < btms.length; j++) {
                btms[j].getComponent(cc.Toggle).isChecked = false
                cc.find('num', btms[j]).color = cc.color(255, 255, 255)
                cc.log(cc.find('num', btms[j]).color)
                cc.log(22222)
            }
            // let color = cc.Color.BLACK;
            // color.fromHEX("#FFFFFF");
            // cc.find('num', btms[0]).color = color
            btms[0].getComponent(cc.Toggle).isChecked = true
        }

        this.first = 1

        let result = cc.find('bg/result', this.gameNode)
        result.active = false
        this.gameNode.active = true
        // this.gameNode.opacity = 255
        // this.gameNode.scale = 0
        cc.Tween.stopAllByTarget(this.gameNode)
        cc.tween(this.gameNode).to(0.23, { scale: 1.2 }).to(0.17, { scale: 1 }).delay(0.3).call(() => {
            this.closeliteGame.on(cc.Node.EventType.TOUCH_END, this.onCloseGame, this)
        }).start()
        let chooseone = cc.find('bg/chooseone', this.gameNode)
        chooseone.opacity = 0
        cc.Tween.stopAllByTarget(chooseone)
        cc.tween(chooseone).delay(0.4).to(0.27, { opacity: 255 }).start()
        for (let i = 0; i < 5; i++) {
            cc.find('num', this.items[i]).active = false
            this.items[i].zIndex = 0
            this.items[i].setPosition(cc.Vec2.ZERO)
            this.items[i].getComponent(dragonBones.ArmatureDisplay).armatureName = this.armatureNames[0]
            this.items[i].getComponent(dragonBones.ArmatureDisplay).playAnimation(this.animationNames[1], 0)
            cc.Tween.stopAllByTarget(this.items[i])
            this.items[i].scale = 1
            this.items[i].angle = 0
            if (i != 2) {
                cc.tween(this.items[i]).delay(0.23).to(0.13, { scale: 1.3 }).to(0.17, { scale: 1 })
                    .parallel(
                        cc.tween().to(0.13, { x: this.itemsOrignPos[i].x - (i == 0 || i == 1 ? 3 : -3), y: this.itemsOrignPos[i].y - (i == 0 || i == 4 ? 21 : 6) }).to(0.13, { x: this.itemsOrignPos[i].x }),
                        cc.tween().by(0.13, { angle: (i == 0 || i == 4 ? 28 : 15) * (i == 0 || i == 1 ? 1 : -1) })
                    )
                    .delay(0.26)
                    .call(() => {
                        cc.find('ClickBox', this.items[i]).on(cc.Node.EventType.TOUCH_END, () => {
                            if (!this.canClickBox) {
                                return
                            }
                            this.canClickBox = false
                            if (this.stonecount > Number(this.getAchieveMent['margin'])) {
                                SystemToast.GetInstance().buildPromptNew('您的余额不足', 2, 1, () => {
                                    SystemToast.GetInstance().closeBuildPromptNew()
                                    this.canClickBox = true
                                }, null, true)
                                return
                            }
                            this.canGetReward = true
                            let data = { stone: this.stonecount }
                            SocketManager.getInstance().emit(mpNetEvent.AskPlayAchievement, data)
                            //@ts-ignore
                            let nd = arguments[0].currentTarget as cc.Node
                            this.clickItem = nd
                            let display = this.clickItem.parent.getComponent(dragonBones.ArmatureDisplay)
                            display.playAnimation(this.animationNames[3], -1)
                        }, this)
                    }).start()
            } else {
                cc.tween(this.items[i]).delay(0.23).to(0.13, { scale: 1.3 }).to(0.17, { scale: 1 }).call(() => {
                    cc.find('ClickBox', this.items[i]).on(cc.Node.EventType.TOUCH_END, () => {
                        if (!this.canClickBox) {
                            return
                        }
                        this.canClickBox = false
                        if (this.stonecount > Number(this.getAchieveMent['margin'])) {
                            SystemToast.GetInstance().buildPromptNew('您的余额不足', 2, 1, () => {
                                SystemToast.GetInstance().closeBuildPromptNew()
                                this.canClickBox = true
                            }, null, true)
                            return
                        }
                        this.canGetReward = true
                        let data = { stone: this.stonecount }
                        SocketManager.getInstance().emit(mpNetEvent.AskPlayAchievement, data)
                        //@ts-ignore
                        let nd = arguments[0].currentTarget as cc.Node
                        this.clickItem = nd
                        let display = this.clickItem.parent.getComponent(dragonBones.ArmatureDisplay)
                        display.playAnimation(this.animationNames[3], -1)
                    }, this)
                }).start()
            }

            // cc.log(111)
            // cc.log(this.items[0].getComponent(dragonBones.ArmatureDisplay).armature())
            // cc.log(this.items[0].getComponent(dragonBones.ArmatureDisplay).armature().armatureData.bones['Click_Area'])
            // cc.log(this.items[0].getComponent(dragonBones.ArmatureDisplay).armature().armatureData.animationNames)

            // this.items[i].getComponent(dragonBones.ArmatureDisplay).playAnimation(i == 2 ? 'Choose' : 'NoChoose', -1)
            // cc.log('55556666666666')
            // cc.log(this.items[i].getComponent(dragonBones.ArmatureDisplay).armature())
            // cc.log(this.items[i].getComponent(dragonBones.ArmatureDisplay).getArmatureNames())
            // let names = this.items[i].getComponent(dragonBones.ArmatureDisplay).getArmatureNames()
            // this.items[i].getComponent(dragonBones.ArmatureDisplay).armatureName = names[1]
        }
    }

    onChoseItem() {

    }

    onCloseGame() {
        // this.gameNode.active = false
        this.closeliteGame.off(cc.Node.EventType.TOUCH_END, this.onCloseGame, this)
        cc.Tween.stopAllByTarget(this.gameNode)
        cc.tween(this.gameNode).to(0.13, { scale: 1.3 }).to(0.07, { scale: 1.32 }).to(0.23, { scale: 0 }).call(() => {
            cc.find('shield', this.node).active = false
        }).start()
    }

    onOpenInfo() {
        this.infoPannle.active = true
    }

    onCloseInof() {
        this.infoPannle.active = false
    }

    onChangeLeftNav(eventHandler, customEventData) {
        let nd = eventHandler.target
        if (nd.name == 'toggle1') {
            this.rule.active = false
        } else {
            this.rule.active = true
        }
    }

    onChangeBtmNav() {

    }

    onDestroy() {
        EventManager.getInstance().removeEventListener(mpNetEvent.AskPlayAchievement, this.msgGetAchievement, this);

    }

}
