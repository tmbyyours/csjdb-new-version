import { FishKind } from "../SubGameMSG";
import { DataVO } from "../../../../plaza/model/DataVO";
import Util from "../../../../extend/Util";
import SoundManager from "../../../../common/managers/SoundManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class F_CSBY_NewRoulette extends cc.Component {
    @property(cc.Node)
    items: cc.Node[] = []
    @property(cc.Sprite) //转盘
    bingoSprite: cc.Sprite = null;

    @property(cc.Sprite) //鱼图标
    fishSprite: cc.Sprite = null;

    @property(cc.Sprite) //金币背景
    moneySprite: cc.Sprite = null;

    @property(cc.Label) //金币文字
    moneyLabel: cc.Label = null;

    actList = []

    onLoad() {
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].active = false;
        }
    }

    // activePrizeNew(fishKind, score) {
    //     this.actList.push({ fishKind: fishKind, score: score })
    //     this.activePrizeR()
    // }

    // activePrizeR() {
    //     let act = null;
    //     if (this.actList.length > 1) {
    //         act = this.actList.shift()
    //     }
    //     act = this.actList.shift()
    //     this.activePrize(act.fishKind, act.score)
    // }

    showRoulette(fishKind, score, chairID) {
        let item = this.items[0]
        if (this.items[0].active == false) {
            this.items[0].active = true
        } else if (this.items[1].active == false) {
            this.items[1].active = true
            item = this.items[1]
        } else {
            this.items[2].active = true
            item = this.items[2]
        }

        this.activePrize(fishKind, score, chairID, item)
    }

    activePrize(fishKind, score, chairID, item) {
        let bingoSprite = cc.find('GP_Roulette1_png', item).getComponent(cc.Sprite)
        let fishSprite = cc.find('fishicon', item).getComponent(cc.Sprite)
        let moneySprite = cc.find('GP_Roulette2_png', item).getComponent(cc.Sprite)
        let moneyLabel = cc.find('RoulletteLabel', moneySprite.node).getComponent(cc.Label)
        if (chairID == DataVO.GD.meChairID) {
            SoundManager.getInstance().playID(1902, "subgame");
        }
        this.node.stopAllActions();
        cc.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!' + fishKind)
        cc.log(!this.node.active)

        if (!this.node.active) {
            this.node.active = true
            this.node.setScale(0);
            this.node.stopAllActions();
            this.node.runAction(cc.sequence(cc.scaleTo(0.2, 1.1, 1.1), cc.scaleTo(0.1, 1, 1)));
        } else {
            this.node.setScale(1);
            this.node.stopAllActions();
        }
        switch (fishKind) {
            case FishKind.FishKind11:
            case FishKind.FishKind12:
            case FishKind.FishKind13:
            case FishKind.FishKind14:
            case FishKind.FishKind15:
                bingoSprite.node.stopAllActions();
                bingoSprite.node.angle = 0;
                moneyLabel.node.stopAllActions();
                moneyLabel.node.active = true;
                item.active = true
                moneyLabel.string = Util.formatMoney(score);
                fishSprite.node.active = false;
                moneySprite.node.y = -5;
                moneySprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette2_png");
                bingoSprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette1_png");
                moneySprite.node.getComponent(cc.Sprite).enabled = true;
                bingoSprite.node.runAction(cc.sequence(cc.rotateTo(2.5, 1800), cc.callFunc(() => { item.active = false })));
                moneyLabel.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.5, 1.3), cc.scaleTo(0.5, 1))));
                break;
            case FishKind.FishKind16:
            case FishKind.FishKind17:
            case FishKind.FishKind18:
            case FishKind.FishKind19:
            case FishKind.FishKind20:
                bingoSprite.node.stopAllActions();
                bingoSprite.node.angle = 0;
                moneyLabel.node.stopAllActions();
                moneyLabel.node.active = true;
                item.active = true
                moneyLabel.string = Util.formatMoney(score);
                fishSprite.node.active = true;
                moneySprite.node.y = -57;
                fishSprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette3_" + fishKind + "_png");
                moneySprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette2_png");
                bingoSprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette1_png");
                moneySprite.node.getComponent(cc.Sprite).enabled = true;
                // bingoSprite.node.runAction(cc.repeatForever(cc.rotateTo(2.5, 1800)));
                bingoSprite.node.runAction(cc.sequence(cc.rotateTo(2.5, 1800), cc.callFunc(() => { item.active = false })));
                moneyLabel.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.5, 1.3), cc.scaleTo(0.5, 1))));
                break;
            case FishKind.OrganCannon:              //机关炮
                break;
            case FishKind.DrillCannon:              //钻头炮
                break;
            case FishKind.CenserBead:               //香炉珠
                bingoSprite.node.stopAllActions();
                bingoSprite.node.angle = 0;
                moneyLabel.node.stopAllActions();
                item.active = true
                moneyLabel.node.active = true;
                moneyLabel.string = Util.formatMoney(score);
                fishSprite.node.active = true;
                moneySprite.node.y = -43.931;
                moneySprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette2_png");
                fishSprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette3_100_png");
                bingoSprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette1_png");
                moneySprite.node.getComponent(cc.Sprite).enabled = true;
                // bingoSprite.node.runAction(cc.repeatForever(cc.rotateTo(2.5, 1800)));
                bingoSprite.node.runAction(cc.sequence(cc.rotateTo(2.5, 1800), cc.callFunc(() => { item.active = false })));
                //bingoSprite.node.runAction(cc.repeatForever(cc.rotateBy(1,-360)));
                moneyLabel.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.5, 1.3), cc.scaleTo(0.5, 1))));
                break;
            case FishKind.GodAdvent:                //财神降临
                bingoSprite.node.stopAllActions();
                bingoSprite.node.angle = 0;
                moneyLabel.node.stopAllActions();
                moneyLabel.node.active = true;
                item.active = true
                moneyLabel.string = Util.formatMoney(score);
                fishSprite.node.active = true;
                moneySprite.node.y = -43.931;
                // moneySprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette2_png");
                // bingoSprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette3_101_png");
                moneySprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette2_png");
                fishSprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette3_101_png");
                bingoSprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette1_png");
                moneySprite.node.getComponent(cc.Sprite).enabled = true;
                // bingoSprite.node.runAction(cc.repeatForever(cc.rotateTo(2.5, 1800)));
                //bingoSprite.node.runAction(cc.repeatForever(cc.rotateBy(1,-360)));
                bingoSprite.node.runAction(cc.sequence(cc.rotateTo(2.5, 1800), cc.callFunc(() => { item.active = false })));
                moneyLabel.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.5, 1.3), cc.scaleTo(0.5, 1))));
                break;
            case FishKind.GodFafa:                  //财神发发发
                bingoSprite.node.stopAllActions();
                bingoSprite.node.angle = 0;
                moneyLabel.node.stopAllActions();

                item.active = true
                moneyLabel.string = Util.formatMoney(score);
                fishSprite.node.active = false;
                moneySprite.node.y = -24.5;
                moneySprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_LD_Prompt_02_png");
                bingoSprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_LD_Prompt_png");
                moneyLabel.node.active = false;
                // schedule(function () {
                //     moneySprite.node.getComponent(cc.Sprite).enabled = false;
                //     moneyLabel.node.active = true;
                //     moneyLabel.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(1,1.3), cc.scaleTo(1, 1))));
                // }, 1, 0);
                moneySprite.node.getComponent(cc.Sprite).enabled = true;
                bingoSprite.node.runAction(cc.sequence(cc.delayTime(3.0), cc.callFunc(() => {
                    moneySprite.node.getComponent(cc.Sprite).enabled = false;
                    moneyLabel.node.active = true;
                    moneyLabel.node.runAction(cc.sequence(cc.scaleTo(0.25, 1.3), cc.scaleTo(0.25, 1)));
                }), cc.delayTime(1), cc.callFunc(() => { item.active = false })));
                //bingoSprite.node.runAction(cc.repeatForever(cc.rotateBy(1,-360)));
                break;
            case FishKind.LuckRun:                   //财运转轮
                bingoSprite.node.stopAllActions();
                bingoSprite.node.angle = 0;
                moneyLabel.node.stopAllActions();

                item.active = true
                moneyLabel.string = Util.formatMoney(score);
                fishSprite.node.active = false;
                moneySprite.node.y = -11.5;
                moneySprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_LD_Prompt_02_png");
                bingoSprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette_Prompt_png");
                moneyLabel.node.active = false;
                // schedule(function () {
                //     moneySprite.node.getComponent(cc.Sprite).enabled = false;
                //     moneyLabel.node.active = true;
                //     moneyLabel.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(1,1.3), cc.scaleTo(1, 1))));
                // }, 1, 0);
                moneySprite.node.getComponent(cc.Sprite).enabled = true;
                bingoSprite.node.runAction(cc.sequence(cc.delayTime(3.0), cc.callFunc(() => {
                    moneySprite.node.getComponent(cc.Sprite).enabled = false;
                    moneyLabel.node.active = true;
                    moneyLabel.node.runAction(cc.sequence(cc.scaleTo(0.25, 1.3), cc.scaleTo(0.25, 1)));
                }), cc.delayTime(1), cc.callFunc(() => { item.active = false })));
                //bingoSprite.node.runAction(cc.repeatForever(cc.rotateBy(1,-360)));
                break;
            default:
            /*node.active = true
            moneyLabel.string = Util.formatMoney(score);
            fishSprite.node.active = false;
            moneySprite.node.y = -5;
            moneySprite.node.getComponent(cc.Sprite).enabled = true;
            moneySprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette2_png");
            bingoSprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette1_png");
            bingoSprite.node.runAction(cc.repeatForever(cc.rotateBy(2.5, 1800)));
            moneyLabel.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.2, 1.8), cc.scaleTo(0.2, 1))));*/
        }
        // let fc = () => { node.active = false; }
        // unscheduleAllCallbacks();
        // schedule(fc, 2.5, 0);   
    }
}
