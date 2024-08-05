import { DataVO } from "../../../../plaza/model/DataVO";
import SoundManager from "../../../../common/managers/SoundManager";
import { musicRes } from "../F_CSBY_Config";
import Util from "../../../../extend/Util";
import { BonusType, subGameMSG } from "../SubGameMSG";


const {ccclass, property} = cc._decorator;

@ccclass
export default class F_CSBY_Roulette extends cc.Component {

    @property(cc.Node)
    background: cc.Node = null;

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Label)
    numlabel: cc.Label = null;

    @property(cc.Sprite)
    pointer: cc.Sprite = null;

    @property(cc.Sprite)
    PointerFX_01: cc.Sprite = null;
    @property(cc.Sprite)
    PointerFX_02: cc.Sprite = null;

    @property(cc.Sprite)
    Board_01_1: cc.Sprite = null;
    @property(cc.Sprite)
    Board_01_2: cc.Sprite = null;
    @property(cc.Sprite)
    Board_01_3: cc.Sprite = null;

    @property(cc.Sprite)
    Board_02_1: cc.Sprite = null;
    @property(cc.Sprite)
    Board_02_2: cc.Sprite = null;
    @property(cc.Sprite)
    Board_02_3: cc.Sprite = null;
    @property(cc.Sprite)
    Board_02_4: cc.Sprite = null;

    @property(cc.Sprite)
    BG_02: cc.Sprite = null;

    @property(cc.Sprite)
    Roulette_BGFX1: cc.Sprite = null;
    @property(cc.Sprite)
    Roulette_BGFX2: cc.Sprite = null;

    @property(cc.Node)
    getSprite:cc.Node=null;

    @property(cc.Sprite)
    Roulette_Msg:cc.Sprite=null;select

    @property(cc.Sprite)
    GP_Roulette_BG:cc.Sprite=null;

    @property(cc.SpriteAtlas)
    cannonAtlas: cc.SpriteAtlas = null;

    @property(cc.Sprite)
    title: cc.Sprite = null;

    @property(cc.Node)
    db: cc.Node = null;
    
    triggerMul = 1;
    //pos=3;
    //triggerArray=[40,80,120,160,200,40,80,120,160,200];

    pos;
    triggerArray;

    _pos;


    rotationAngle;
    selectNo;
    Mul;
    
    initAngel;
    timeoutNum;
    

    posArray=[new cc.Vec2(-140.048,15.763),new cc.Vec2(0,62),new cc.Vec2(140.048,15.763)];
    angleArray=[37.42,0,-37.42];
    posArray1=[new cc.Vec2(-95.385,-43.508),new cc.Vec2(0,-8),new cc.Vec2(95.385,-43.508)];
    posArray2=[new cc.Vec2(-121.647,-3.981),new cc.Vec2(0,35.757),new cc.Vec2(124.89,-3.981)];
    angleArray1=[37.42,0,-37.42];
    onLoad () {
        cc.log("onLoadonLoadonLoadonLoadonLoad")
        //DataVO.GD.isAllowFire=false;
        DataVO.GD.mainScene.cannonLayer.autoFireFlag = false;//取消自动
        DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].unlockFish(); //取消瞄准
        this.background.on(cc.Node.EventType.TOUCH_START, (e) => {
            e.stopPropagation()
        })
        /*this.Board_01_1.node.on(cc.Node.EventType.MOUSE_ENTER,this.enterPos,this);
        this.Board_01_2.node.on(cc.Node.EventType.MOUSE_ENTER,this.enterPos,this);
        this.Board_01_3.node.on(cc.Node.EventType.MOUSE_ENTER,this.enterPos,this);*/

        this.Board_01_1.node.on(cc.Node.EventType.TOUCH_END,this.selectPos,this);
        this.Board_01_2.node.on(cc.Node.EventType.TOUCH_END,this.selectPos,this);
        this.Board_01_3.node.on(cc.Node.EventType.TOUCH_END,this.selectPos,this);
        this.db.active=true;
        this.bg.active=false;
        this.title.node.opacity=0;
        this.schedule(function() {
            this.db.active=false;
            this.bg.active=true;
            this.Roulette_BGFX1.node.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(1),cc.fadeIn(1))));
            this.Roulette_BGFX2.node.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(1),cc.fadeIn(1))));
            this.title.node.runAction(cc.fadeIn(0.5))
        }, 1.12, 0);
        this._pos =1;
        this.enterPos();
        this.schedule(function() {
            this._pos++
            if (this._pos>3){
                this._pos =1
            }
            this.enterPos();
        }, 1);
        this.GP_Roulette_BG.node.active = false
        this.PointerFX_02.node.active = false
        this.getSprite.active=false
        SoundManager.getInstance().playID(5901,"subgame");
        SoundManager.getInstance().playMusic(5907,"subgame");
        this.BG_02.node.angle = 0
    }
    activeRoulette (triggerArray,Mul,postion) {
        this.Mul = Mul
        this.pos = postion
        this.triggerArray = triggerArray
        this.numlabel.string =Util.formatMoney(this.Mul.toString());
        let altas=DataVO.GD.mainScene.cannonLayer.cannonAtlas;
        //let altas=this.cannonAtlas;
        for(let i=0;i<this.triggerArray.length;i++){
            let n
            switch(this.triggerArray[i]){
                case 40:
                    n=1;
                    break;
                case 80:
                    n=2;
                    break;
                case 120:
                    n=3;
                    break;
                case 160:
                    n=4;
                    break;
                case 200:
                    n=5;
                    break;
            }
            this.BG_02.node.getChildByName("numtitle"+i).getComponent(cc.Sprite).spriteFrame=altas.getSpriteFrame("GP_Roulette_Muti_0"+n+"_png");
        }
    }
    enterPos(){
        //let _pos=Number(e.target.name.substr(9,e.target.name.length-9));
        this.PointerFX_01.node.setPosition(this.posArray[this._pos-1]);
        this.PointerFX_01.node.angle= this.angleArray[this._pos-1]
        this.PointerFX_02.node.setPosition(this.posArray2[this._pos-1]);
        this.PointerFX_02.node.angle= this.angleArray[this._pos-1]
        this.pointer.node.setPosition(this.posArray1[this._pos-1]);
        this.pointer.node.angle= this.angleArray1[this._pos-1]
    }
    selectPos(e){
        this.beginTrun();
        this.Board_01_1.node.off(cc.Node.EventType.TOUCH_END,this.selectPos,this);
        this.Board_01_2.node.off(cc.Node.EventType.TOUCH_END,this.selectPos,this);
        this.Board_01_3.node.off(cc.Node.EventType.TOUCH_END,this.selectPos,this);
        this.unscheduleAllCallbacks();
        this.title.node.runAction(cc.fadeOut(1))
        SoundManager.getInstance().playID(5905,"subgame");
        this.selectNo=Number(e.target.name.substr(9,e.target.name.length-9));
        this._pos = this.selectNo;
        this.enterPos()
        //算出旋转角度
        let angle = this.pos*36.1;
        if(this.selectNo==1){
            angle+=36.1;
            this.GP_Roulette_BG.node.angle = 36.1;
            this.PointerFX_02.node.angle = 36.1;
        } else if(this.selectNo==3){
            angle-=36.1;
            this.GP_Roulette_BG.node.angle = -36.1;
            this.PointerFX_02.node.angle = -36.1;
        } else {
            this.GP_Roulette_BG.node.angle = 0;
            this.PointerFX_02.node.angle = 0;
        }
        angle+=-720;
        //动画
        this.schedule(function() {
            SoundManager.getInstance().playID(5906,"subgame");
            (this.Board_01_1.node.getComponent(cc.Animation) as cc.Animation).play();
            (this.Board_01_2.node.getComponent(cc.Animation) as cc.Animation).play();
            (this.Board_01_3.node.getComponent(cc.Animation) as cc.Animation).play();

            (this.Board_02_1.node.getComponent(cc.Animation) as cc.Animation).play();
            (this.Board_02_2.node.getComponent(cc.Animation) as cc.Animation).play();
            (this.Board_02_3.node.getComponent(cc.Animation) as cc.Animation).play();
            (this.Board_02_4.node.getComponent(cc.Animation) as cc.Animation).play();

        }, 0.2, 0);
        this.schedule(function() {
                //转动
                // this.BG_02.node.runAction(cc.sequence(cc.rotateBy(8,angle).easing(cc.easeSineInOut()),cc.callFunc(this.playsound.bind(this)),cc.delayTime(2),cc.callFunc(this.showGet.bind(this))));
                
                let t = cc.tween
                t(this.BG_02.node).sequence(
                    t().by(8, { angle: angle},{ easing: 'sineInOut' }),
                    t().call(() => {
                        this.playsound()
                    }),
                    t().delay(2),
                    t().call(() => {
                        this.showGet()
                    })
                ).start()

                // cc.tween(this.BG_02.node)
                // .by(8, { angle: angle, easing: 'easeSineInOut' })
                // .call(() => {
                //     this.playsound.bind(this)
                // })
                // // .delay(2)
                // .call(() => {
                //     this.showGet.bind(this)
                // })
                // .start()
        }, 0.4, 0);
    }
    playsound(){
        this.GP_Roulette_BG.node.active = true
        this.PointerFX_02.node.active = true
        this.PointerFX_02.node.opacity=0;
        this.PointerFX_02.node.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(0.2,100),cc.fadeTo(0.2,0))))
        SoundManager.getInstance().playID(5902,"subgame");
        SoundManager.getInstance().playID(5903,"subgame");

    }
    showGet(){
        SoundManager.getInstance().stopMusic();
        this.PointerFX_02.node.opacity=0;
        this.PointerFX_02.node.stopAllActions();
        SoundManager.getInstance().playID(5904,"subgame");
        this.bg.active=false;
        DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].addScore(this.Mul*this.triggerArray[this.pos]);
        this.getSprite.getChildByName("effect").getComponent(cc.Animation).play();
        this.getSprite.getChildByName("numLabel").getComponent(cc.Label).string =Util.formatMoney((this.Mul*this.triggerArray[this.pos]).toString(),"");
        //this.getSprite.getChildByName("numLabel").getComponent(cc.Label).string ="160";
        this.getSprite.active=true
        this.getSprite.setScale(0)
        this.getSprite.runAction(cc.sequence(cc.scaleTo(0.2,1.2),cc.scaleTo(0.1,0.94),cc.scaleTo(0.1,1)));
        this.getSprite.runAction(cc.sequence(cc.delayTime(2),cc.scaleTo(0.2,0,0),cc.callFunc(this.removeself.bind(this))));
        DataVO.GD.mainScene.uiLayer.isplaygame=false;

        clearInterval(this.timeoutNum);
        let msg: { [k: string]: any } = {};
        msg.type = BonusType.roulette;
        DataVO.GD.mainScene.sendGameData(subGameMSG.SUB_C_GET_BONUS, msg);
    }
    removeself(){
        DataVO.GD.mainScene.sendGameData(subGameMSG.SUB_C_GET_PLAERS_SCORE);
        //DataVO.GD.isAllowFire=true;
        this.node.removeFromParent();
        DataVO.GD.mainScene.fishLayer.playmusic();
    }

    beginTrun()
    {

        this.initAngel = this.BG_02.node.angle;
        this.timeoutNum = setInterval(() => {
            if( Math.abs(this.initAngel - this.BG_02.node.angle) >= 36 )
            {
                this.initAngel = this.BG_02.node.angle;
                SoundManager.getInstance().playID(5902,"subgame");
                // cc.error('播放一次声音')
            }
        }, 10);
    }
}
