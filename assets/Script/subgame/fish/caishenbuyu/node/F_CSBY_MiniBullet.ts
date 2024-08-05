import { GCoinConfig } from "../F_CSBY_Config";
import { DataVO } from "../../../../plaza/model/DataVO";
import Util from "../../../../extend/Util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class F_CSBY_MiniBullet extends cc.Component {

    coinKind;
    targetPos;
    callback;
    delayTime;
    coinArm;
    pos;

    reuse1 (coinKind, targetPos, pos,beginpos, delayTime, callback) {
        cc.log("reuse1reuse1reuse1reuse1reuse1reuse1")
        this.node.setScale(1.2)
        this.coinKind = coinKind;
        this.targetPos = targetPos;
        this.callback = callback;
        this.delayTime = delayTime || 0;
        this.pos=pos
        this.initEx1();
        this.node.setPosition(beginpos);
    }

    fly1 () {
        let action = null;

        let dis1 = this.node.getPosition().sub(this.pos).mag();
        let dt1 = dis1 / GCoinConfig.flySpeed;

        let dis = this.pos.sub(this.targetPos).mag();
        let dt = dis / GCoinConfig.flySpeed;

        action = cc.sequence(
            cc.moveTo(dt1, this.pos).easing(cc.easeSineIn()),
            cc.delayTime(1),
            cc.moveTo(dt, this.targetPos).easing(cc.easeSineIn()),
            cc.callFunc(this.onFinish.bind(this))
        );

        this.node.runAction(action);
        //this.node.runAction(cc.scaleTo(dt1, 0.8));
    }

    initEx1 () {
        if(this.coinArm){
            this.coinArm.removeFromParent();
        }

        this.node.stopAllActions();

        this.node.runAction(cc.sequence(
            cc.delayTime(this.delayTime),
            /*cc.callFunc(()=>{
                this.coinArm.getAnimation().play("Animation_" + this.coinKind + "_" + 1);
            }),*/
            //cc.delayTime(1),
            /*cc.callFunc(()=>{
                this.coinArm.getAnimation().play("Animation_" + this.coinKind + "_" + 2);
            }),*/
            cc.delayTime(0.2),
            cc.callFunc(this.fly1.bind(this))
        ))
    }

     //当完成时
     onFinish () {
        this.callback();
        this.removeSelf();
    }

    removeSelf () {
        DataVO.GD.nodePools.MiniBulletPool.freeNode(this.node)
        this.node.removeFromParent();
    }
}
