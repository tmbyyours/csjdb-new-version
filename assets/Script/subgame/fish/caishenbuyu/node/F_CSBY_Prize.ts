import { FishKind } from "../SubGameMSG";
import { DataVO } from "../../../../plaza/model/DataVO";
import Util from "../../../../extend/Util";
import SoundManager from "../../../../common/managers/SoundManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class F_CSBY_Prize extends cc.Component {
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

    activePrize(fishKind, score, chairID) {
        if(chairID == DataVO.GD.meChairID){
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
                this.bingoSprite.node.stopAllActions();
                this.bingoSprite.node.angle = 0;
                this.moneyLabel.node.stopAllActions();
                this.moneyLabel.node.active = true;
                this.node.active = true
                this.moneyLabel.string = Util.formatMoney(score);
                this.fishSprite.node.active = false;
                this.moneySprite.node.y = -5;
                this.moneySprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette2_png");
                this.bingoSprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette1_png");
                this.moneySprite.node.getComponent(cc.Sprite).enabled = true;
                this.bingoSprite.node.runAction(cc.sequence(cc.rotateTo(2.5, 1800), cc.callFunc(() => { this.node.active = false })));
                this.moneyLabel.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.5, 1.3), cc.scaleTo(0.5, 1))));
                break;
            case FishKind.FishKind16:
            case FishKind.FishKind17:
            case FishKind.FishKind18:
            case FishKind.FishKind19:
            case FishKind.FishKind20:
                this.bingoSprite.node.stopAllActions();
                this.bingoSprite.node.angle = 0;
                this.moneyLabel.node.stopAllActions();
                this.moneyLabel.node.active = true;
                this.node.active = true
                this.moneyLabel.string = Util.formatMoney(score);
                this.fishSprite.node.active = true;
                this.moneySprite.node.y = -57;
                this.fishSprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette3_" + fishKind + "_png");
                this.moneySprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette2_png");
                this.bingoSprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette1_png");
                this.moneySprite.node.getComponent(cc.Sprite).enabled = true;
                // this.bingoSprite.node.runAction(cc.repeatForever(cc.rotateTo(2.5, 1800)));
                this.bingoSprite.node.runAction(cc.sequence(cc.rotateTo(2.5, 1800), cc.callFunc(() => { this.node.active = false })));
                this.moneyLabel.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.5, 1.3), cc.scaleTo(0.5, 1))));
                break;
            case FishKind.OrganCannon:              //机关炮
                break;
            case FishKind.DrillCannon:              //钻头炮
                break;
            case FishKind.CenserBead:               //香炉珠
                this.bingoSprite.node.stopAllActions();
                this.bingoSprite.node.angle = 0;
                this.moneyLabel.node.stopAllActions();
                this.node.active = true
                this.moneyLabel.node.active = true;
                this.moneyLabel.string = Util.formatMoney(score);
                this.fishSprite.node.active = true;
                this.moneySprite.node.y = -43.931;
                this.moneySprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette2_png");
                this.fishSprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette3_100_png");
                this.bingoSprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette1_png");
                this.moneySprite.node.getComponent(cc.Sprite).enabled = true;
                // this.bingoSprite.node.runAction(cc.repeatForever(cc.rotateTo(2.5, 1800)));
                this.bingoSprite.node.runAction(cc.sequence(cc.rotateTo(2.5, 1800), cc.callFunc(() => { this.node.active = false })));
                //this.bingoSprite.node.runAction(cc.repeatForever(cc.rotateBy(1,-360)));
                this.moneyLabel.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.5, 1.3), cc.scaleTo(0.5, 1))));
                break;
            case FishKind.GodAdvent:                //财神降临
                this.bingoSprite.node.stopAllActions();
                this.bingoSprite.node.angle = 0;
                this.moneyLabel.node.stopAllActions();
                this.moneyLabel.node.active = true;
                this.node.active = true
                this.moneyLabel.string = Util.formatMoney(score);
                this.fishSprite.node.active = true;
                this.moneySprite.node.y = -43.931;
                // this.moneySprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette2_png");
                // this.bingoSprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette3_101_png");
                this.moneySprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette2_png");
                this.fishSprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette3_101_png");
                this.bingoSprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette1_png");
                this.moneySprite.node.getComponent(cc.Sprite).enabled = true;
                // this.bingoSprite.node.runAction(cc.repeatForever(cc.rotateTo(2.5, 1800)));
                //this.bingoSprite.node.runAction(cc.repeatForever(cc.rotateBy(1,-360)));
                this.bingoSprite.node.runAction(cc.sequence(cc.rotateTo(2.5, 1800), cc.callFunc(() => { this.node.active = false })));
                this.moneyLabel.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.5, 1.3), cc.scaleTo(0.5, 1))));
                break;
            case FishKind.GodFafa:                  //财神发发发
                this.bingoSprite.node.stopAllActions();
                this.bingoSprite.node.angle = 0;
                this.moneyLabel.node.stopAllActions();

                this.node.active = true
                this.moneyLabel.string = Util.formatMoney(score);
                this.fishSprite.node.active = false;
                this.moneySprite.node.y = -24.5;
                this.moneySprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_LD_Prompt_02_png");
                this.bingoSprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_LD_Prompt_png");
                this.moneyLabel.node.active = false;
                // this.schedule(function () {
                //     this.moneySprite.node.getComponent(cc.Sprite).enabled = false;
                //     this.moneyLabel.node.active = true;
                //     this.moneyLabel.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(1,1.3), cc.scaleTo(1, 1))));
                // }, 1, 0);
                this.moneySprite.node.getComponent(cc.Sprite).enabled = true;
                this.bingoSprite.node.runAction(cc.sequence(cc.delayTime(3.0), cc.callFunc(() => {
                    this.moneySprite.node.getComponent(cc.Sprite).enabled = false;
                    this.moneyLabel.node.active = true;
                    this.moneyLabel.node.runAction(cc.sequence(cc.scaleTo(0.25, 1.3), cc.scaleTo(0.25, 1)));
                }), cc.delayTime(1), cc.callFunc(() => { this.node.active = false })));
                //this.bingoSprite.node.runAction(cc.repeatForever(cc.rotateBy(1,-360)));
                break;
            case FishKind.LuckRun:                   //财运转轮
                this.bingoSprite.node.stopAllActions();
                this.bingoSprite.node.angle = 0;
                this.moneyLabel.node.stopAllActions();

                this.node.active = true
                this.moneyLabel.string = Util.formatMoney(score);
                this.fishSprite.node.active = false;
                this.moneySprite.node.y = -11.5;
                this.moneySprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_LD_Prompt_02_png");
                this.bingoSprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette_Prompt_png");
                this.moneyLabel.node.active = false;
                // this.schedule(function () {
                //     this.moneySprite.node.getComponent(cc.Sprite).enabled = false;
                //     this.moneyLabel.node.active = true;
                //     this.moneyLabel.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(1,1.3), cc.scaleTo(1, 1))));
                // }, 1, 0);
                this.moneySprite.node.getComponent(cc.Sprite).enabled = true;
                this.bingoSprite.node.runAction(cc.sequence(cc.delayTime(3.0), cc.callFunc(() => {
                    this.moneySprite.node.getComponent(cc.Sprite).enabled = false;
                    this.moneyLabel.node.active = true;
                    this.moneyLabel.node.runAction(cc.sequence(cc.scaleTo(0.25, 1.3), cc.scaleTo(0.25, 1)));
                }), cc.delayTime(1), cc.callFunc(() => { this.node.active = false })));
                //this.bingoSprite.node.runAction(cc.repeatForever(cc.rotateBy(1,-360)));
                break;
            default:
            /*this.node.active = true
            this.moneyLabel.string = Util.formatMoney(score);
            this.fishSprite.node.active = false;
            this.moneySprite.node.y = -5;
            this.moneySprite.node.getComponent(cc.Sprite).enabled = true;
            this.moneySprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette2_png");
            this.bingoSprite.spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Roulette1_png");
            this.bingoSprite.node.runAction(cc.repeatForever(cc.rotateBy(2.5, 1800)));
            this.moneyLabel.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.2, 1.8), cc.scaleTo(0.2, 1))));*/
        }
        // let fc = () => { this.node.active = false; }
        // this.unscheduleAllCallbacks();
        // this.schedule(fc, 2.5, 0);   
    }
}
