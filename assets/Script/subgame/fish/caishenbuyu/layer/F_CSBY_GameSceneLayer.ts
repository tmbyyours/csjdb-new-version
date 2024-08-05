/**
 * 场景切换
 */

import SoundManager from "../../../../common/managers/SoundManager";
import { DataVO } from "../../../../plaza/model/DataVO";
import { musicRes } from "../F_CSBY_Config";
import { resLoader } from "../../../../common/res/ResLoader";
import Util from "../../../../extend/Util";
import { EventManager } from "../../../../common/managers/EventManager";
import MPConfig from "../../../../extend/MPConfig";


const { ccclass, property } = cc._decorator;

@ccclass
export default class F_CSBY_GameSceneLayer extends cc.Component {
    // LIFE-CYCLE CALLBACKS
    //海浪
    @property(cc.Node)
    sprayNode: cc.Node = null;
    //mask
    @property(cc.Node)
    maskNode: cc.Node = null;
    //背景
    @property(cc.Sprite)
    bgSprite: cc.Sprite = null;
    @property(cc.Node)
    bgNode: cc.Node = null;
    backgroundMusicID;

    bgIndex
    bgmIndex

    public static seaIsCome = false;

    onLoad() {
        this.initEx();
    }

    start() {
        let si = cc.winSize
        this.maskNode.width = si.width
        this.maskNode.height = si.height
        this.maskNode.x = si.width
    }

    //初始化
    initEx() {

    }
    //当切换场景
    onSwitchScene(data, callback) {
        this.bgIndex = data.bgIndex;
        this.bgmIndex = data.bgmIndex;
        this.sprayNode.active = true;
        this.maskNode.active = true;
        this.bgNode.active = true;
        if (DataVO.GD.isRotation) {
            //this.bgSprite.node.angle = -180
        }
        let imgid = this.bgIndex + 1
        resLoader.loadRes("subgame/fish/caishenbuyu/images/GP_Base_Background_0" + imgid + ".jpg", cc.SpriteFrame, (error: Error, sp: cc.SpriteFrame) => {
            cc.log(error)
            this.bgSprite.spriteFrame = sp;
            //resLoader.releaseAsset(sp);            
        });
        (this.sprayNode.getChildByName("wave1").getComponent(cc.Animation) as cc.Animation).play();
        (this.sprayNode.getChildByName("wave2").getComponent(cc.Animation) as cc.Animation).play();
        (this.sprayNode.getChildByName("wave3").getComponent(cc.Animation) as cc.Animation).play();
        (this.sprayNode.getChildByName("wave4").getComponent(cc.Animation) as cc.Animation).play();
        let si = cc.winSize
        // this.sprayNode.x = si.width - 150
        this.bgSprite.node.setContentSize(si)
        cc.log(this.bgSprite.node.getContentSize())
        this.maskNode.active = true
        this.maskNode.width = si.width
        this.maskNode.height = si.height
        this.maskNode.x = si.width
        this.bgNode.width = si.width + 200
        this.bgNode.height = si.height
        this.bgNode.x = si.width
        // cc.log('@@@@@@@@@@@@@@@@@@');
        // this.sprayNode.runAction(cc.sequence(cc.moveTo(5,-573,0),cc.callFunc(this.hidespray.bind(this))));
        this.maskNode.stopAllActions();
        this.bgNode.stopAllActions();
        SoundManager.getInstance().stopMusic()
        this.maskNode.runAction(cc.sequence(cc.moveTo(2.5, 0, 0), cc.delayTime(1.3), cc.callFunc(this.hidemask.bind(this))));
        this.bgNode.runAction(cc.sequence(cc.moveTo(2.5, 0, -42), cc.moveTo(2.5, -si.width, -42), cc.callFunc(this.hidespray.bind(this))));
        //播放海浪的声音
        SoundManager.getInstance().playID(1901, "subgame");
        cc.director.getCollisionManager().enabled = false;//关闭碰撞检测
        setTimeout(() => {
            let chi = this.node.parent.getChildByName('coinLayer').children
            /*for (let key in chi) {
                cc.error(chi[key].name)
                chi[key].destroy()
            }*/
            let tps = this.node.parent.getChildByName('fishNetLayer').children
            for (let key in tps) {
                if(chi[key]!= null )
                    chi[key].destroy()
            }
        }, 1000)
        if(MPConfig.G_OPEN_DOWNWATER_UPSPEED)
        {
            F_CSBY_GameSceneLayer.seaIsCome = true;
            EventManager.getInstance().raiseEvent('chaoshui');
        }
    }
    hidespray() {
        (this.sprayNode.getChildByName("wave1").getComponent(cc.Animation) as cc.Animation).stop();
        (this.sprayNode.getChildByName("wave2").getComponent(cc.Animation) as cc.Animation).stop();
        (this.sprayNode.getChildByName("wave3").getComponent(cc.Animation) as cc.Animation).stop();
        (this.sprayNode.getChildByName("wave4").getComponent(cc.Animation) as cc.Animation).stop();
        this.sprayNode.active = false;
        this.bgNode.active = false;
    }
    hidemask() {
        F_CSBY_GameSceneLayer.seaIsCome = false;
        this.maskNode.active = false
        cc.director.getCollisionManager().enabled = true;//打开碰撞检测
        DataVO.GD.mainScene.bgLayer.setBgIndex(this.bgIndex);
        var bgm = [musicRes.BGM_1, musicRes.BGM_2, musicRes.BGM_3];
        SoundManager.getInstance().playID(bgm[this.bgmIndex], "subgame");

        DataVO.GD.mainScene.fishLayer.clearAllFish();
        //DataVO.GD.isAllowFire = true;
        DataVO.GD.switingScene = false;
    }
}