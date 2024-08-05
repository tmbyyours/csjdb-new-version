import { DataVO } from "../../../../plaza/model/DataVO";
import SoundManager from "../../../../common/managers/SoundManager";
import { musicRes } from "../F_CSBY_Config";
import Util from "../../../../extend/Util";
import { subGameMSG, BonusType } from "../SubGameMSG";

const {ccclass, property} = cc._decorator;

@ccclass
export default class F_CSBY_Bag extends cc.Component {
    @property(cc.Node)
    background: cc.Node = null;
    @property(cc.Animation)
    effect:cc.Animation=null;
    @property(cc.Animation)
    effect1:cc.Animation=null;
    @property(cc.Sprite)
    bag1:cc.Sprite=null;
    @property(cc.Sprite)
    bag2:cc.Sprite=null;
    @property(cc.Sprite)
    bag3:cc.Sprite=null;
    @property(cc.Sprite)
    bag4:cc.Sprite=null;
    @property(cc.Sprite)
    bag5:cc.Sprite=null;
    @property(cc.Label)
    titleLabel:cc.Label=null;
    @property(cc.Node)
    getSprite:cc.Node=null;
    @property(cc.Node)
    door:cc.Node=null;
    @property(cc.Sprite)
    title:cc.Sprite=null;
    @property(cc.Sprite)
    light:cc.Sprite=null;
    @property(cc.Sprite)
    title1:cc.Sprite=null;
    bagArray;
    openbag;


    Mul;
    pos;
    triggerArray;
    gold;
    score;

    /*Mul =1;
    pos =0;
    triggerArray =[21,22,23,24,25];
    gold =21;*/

    onLoad () {
        /*if (DataVO.GD.mainScene.fishLayer.lockFishStatus) { //取消瞄准
            DataVO.GD.mainScene.cannonLayer.seAim();
        }
        if (DataVO.GD.mainScene.cannonLayer.autoFire) { // 取消锁定
            DataVO.GD.mainScene.cannonLayer.setAuto();
        }*/
        DataVO.GD.mainScene.cannonLayer.autoFireFlag = false;//取消自动
        DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].unlockFish(); //取消瞄准
        this.openbag = -1;
        this.titleLabel.string="1";
        this.bag1.node.on(cc.Node.EventType.TOUCH_END,this.openBag,this);
        this.bag2.node.on(cc.Node.EventType.TOUCH_END,this.openBag,this);
        this.bag3.node.on(cc.Node.EventType.TOUCH_END,this.openBag,this);
        this.bag4.node.on(cc.Node.EventType.TOUCH_END,this.openBag,this);
        this.bag5.node.on(cc.Node.EventType.TOUCH_END,this.openBag,this);
        this.bagArray=[];
        this.bagArray.push(this.bag1);
        this.bagArray.push(this.bag2);
        this.bagArray.push(this.bag3);
        this.bagArray.push(this.bag4);
        this.bagArray.push(this.bag5);
        this.door.active=true
        this.title1.node.setScale(0)
        this.title.node.opacity =0;
        this.light.node.opacity =0;
        this.schedule(function() {
            (this.effect1 as cc.Animation).play();
            this.effect1.node.runAction(cc.sequence(cc.scaleTo(0.01,20),cc.scaleTo(0.95,10)))
            this.title.node.runAction(cc.fadeIn(0.6));
            this.light.node.runAction(cc.sequence(cc.fadeIn(0.6),cc.fadeOut(1)));
        }, 0.5, 0);
        this.schedule(function() {
           (this.bag1.node as cc.Node).active =true;
           (this.bag2.node as cc.Node).active =true;
           (this.bag3.node as cc.Node).active =true;
           (this.bag4.node as cc.Node).active =true;
           (this.bag5.node as cc.Node).active =true;
           (this.effect as cc.Animation).play();
           this.effect1.node.active =false;
           for(let i=0;i<this.bagArray.length;i++){
            (this.bagArray[i].node as cc.Node).getChildByName("bag").active = true; 
            (this.bagArray[i].node as cc.Node).opacity = 255;
            (this.bagArray[i].node as cc.Node).getChildByName("bag").getComponent(cc.Animation).play("baglight",0);
            this.title1.node.runAction(cc.sequence(cc.scaleTo(0.37,1.5),cc.scaleTo(0.2,1.33)));
        }
        }, 1.8, 0);
        //DataVO.GD.isAllowFire=false;
        this.getSprite.active=false;
        SoundManager.getInstance().playID(3901,"subgame");
        SoundManager.getInstance().playMusic(3001,"subgame");
        this.background.on(cc.Node.EventType.TOUCH_START, (e) => {
            e.stopPropagation()
        })
    }

    activeBag (triggerArray,score,Mul,postion) {
        cc.log("activeBagactiveBagactiveBagactiveBagactiveBagactiveBag")
        cc.log(triggerArray)
        this.Mul = Mul
        this.pos = postion
        this.triggerArray = triggerArray
        this.score =score
        this.gold = this.Mul*this.triggerArray[this.pos]
    }
    openBag(e){
        if(this.openbag!=-1){
            return
        }
        SoundManager.getInstance().playID(3903,"subgame");
        this.titleLabel.string="0";
       this.openbag = Number(e.target.name.substr(3,e.target.name.length-3));//开的是哪个包
       (this.bagArray[this.openbag-1].node as cc.Node).getComponent(cc.Animation).play("bag",0);
       (this.bagArray[this.openbag-1].node as cc.Node).getChildByName("numLabel").getComponent(cc.Label).string =Util.formatMoney(this.gold.toString());
       (this.bagArray[this.openbag-1].node as cc.Node).getChildByName("bag").active = false; 
       (this.bagArray[this.openbag-1].node as cc.Node).getChildByName("numLabel").runAction(cc.fadeIn(1));
       this.schedule(function() {
           this.openOtherBag()
        }, 2, 0);
        let msg: { [k: string]: any } = {};
        msg.type = BonusType.redbg;
        DataVO.GD.mainScene.sendGameData(subGameMSG.SUB_C_GET_BONUS, msg);
    }
    openOtherBag(){
        this.triggerArray.splice(this.pos,1)
        let n =0
        for(let i=0;i<this.bagArray.length;i++){
            if(i!=(this.openbag-1)){
                (this.bagArray[i].node as cc.Node).getComponent(cc.Animation).play("bag",0.15);
                (this.bagArray[i].node as cc.Node).getChildByName("numLabel").getComponent(cc.Label).string =Util.formatMoney((this.Mul*this.triggerArray[n]).toString());
                (this.bagArray[i].node as cc.Node).getChildByName("bag").active = false;
                (this.bagArray[i].node as cc.Node).opacity = 150;
                (this.bagArray[i].node as cc.Node).getChildByName("numLabel").runAction(cc.fadeIn(1))
                n++;
            }
        }
        this.node.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(this.showGet.bind(this))));
    }
    showGet(){
        SoundManager.getInstance().stopMusic();
        //this.door.active=false
        (this.bag1.node as cc.Node).active =false;
        (this.bag2.node as cc.Node).active =false;
        (this.bag3.node as cc.Node).active =false;
        (this.bag4.node as cc.Node).active =false;
        (this.bag5.node as cc.Node).active =false;
        DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].addScore(this.gold);
        this.getSprite.getChildByName("effect").getComponent(cc.Animation).play();
        this.getSprite.getChildByName("numLabel").getComponent(cc.Label).string =Util.formatMoney(this.gold.toString(),"");
        this.getSprite.active=true
        this.getSprite.setScale(0)
        this.getSprite.runAction(cc.sequence(cc.scaleTo(0.2,1.5),cc.scaleTo(0.1,1.24),cc.scaleTo(0.1,1.3)));
        this.getSprite.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(this.removeself.bind(this))));
        DataVO.GD.mainScene.uiLayer.isplaygame=false;
        SoundManager.getInstance().playID(3902,"subgame");
    }
    removeself(){
        DataVO.GD.mainScene.sendGameData(subGameMSG.SUB_C_GET_PLAERS_SCORE);
        //DataVO.GD.isAllowFire=true;
        this.node.runAction(cc.sequence(cc.scaleTo(0.2,1.2),cc.scaleTo(0.1,0),cc.removeSelf()));
        //this.node.removeFromParent();
        DataVO.GD.mainScene.fishLayer.playmusic();
    }
}
