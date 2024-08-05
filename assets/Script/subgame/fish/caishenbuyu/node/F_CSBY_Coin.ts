import { GCoinConfig } from "../F_CSBY_Config";
import { DataVO } from "../../../../plaza/model/DataVO";
import Util from "../../../../extend/Util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class F_CSBY_Coin extends cc.Component {

    coinKind;
    targetPos;
    callback;
    delayTime;
    coinArm;
    pos;

    reuse(coinKind, targetPos, pos, delayTime, callback) {
        this.coinKind = coinKind;
        this.targetPos = targetPos;
        this.callback = callback;
        this.delayTime = delayTime || 0;

        this.initEx();
        this.node.setPosition(pos);
    }

    reuse1(coinKind, targetPos, pos, beginpos, delayTime, callback) {
        cc.log("reuse1reuse1reuse1reuse1reuse1reuse1")
        // cc.log(beginpos)
        // cc.log(this.node)
        this.node.setScale(1.2)
        this.coinKind = coinKind;
        this.targetPos = targetPos;
        this.callback = callback;
        this.delayTime = delayTime || 0;
        this.pos = pos
        this.initEx1();
        this.node.setPosition(beginpos);
        this.node.active = true
    }

    reuse2(coinKind, delayTime) {
        cc.log("reuse2reuse2reuse2reuse2reuse2")
        this.node.setScale(0.7)
        this.coinKind = coinKind;
        this.delayTime = delayTime || 0;
        this.initEx2();
    }

    fly() {
        let action = null;
        let dis = this.node.getPosition().sub(this.targetPos).mag();
        let dt = dis / GCoinConfig.flySpeed;
        this.node.setScale(1.4)
        if (DataVO.GD.isRotation) {
            action = cc.sequence(
                cc.moveBy(0.3, 0, -80),
                cc.moveBy(0.4, 0, 100),
                cc.moveBy(0.1, 0, -20),
                cc.delayTime(0.3),
                cc.moveTo(dt, this.targetPos).easing(cc.easeSineIn()),
                cc.callFunc(this.onFinish.bind(this))
            );
            this.node.runAction(action);
            //this.node.runAction(cc.scaleTo(dt, 1));
        } else {
            action = cc.sequence(
                cc.moveBy(0.3, 0, 80),
                cc.moveBy(0.4, 0, -100),
                cc.moveBy(0.1, 0, 20),
                cc.delayTime(0.3),
                cc.moveTo(dt, this.targetPos).easing(cc.easeSineIn()),
                cc.callFunc(this.onFinish.bind(this))
            );
            this.node.runAction(action);
            //this.node.runAction(cc.scaleTo(dt, 1));
        }
    }

    fly1() {
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

    initEx() {

        if (this.coinArm) {
            this.coinArm.removeFromParent();
        }

        if (!this.coinKind) {//别人的打的半透明
            //this.node.opacity=120;
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
            //cc.delayTime(0.3),
            cc.callFunc(this.fly.bind(this))
        ))
    }

    initEx1() {
        if (this.coinArm) {
            this.coinArm.removeFromParent();
        }

        if (!this.coinKind) {//别人的打的半透明
            this.node.opacity = 120;
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
            cc.delayTime(0.3),
            cc.callFunc(this.fly1.bind(this)),
            // cc.callFunc(this.onFinish.bind(this))
        ))
    }

    initEx2() {
        if (this.coinArm) {
            this.coinArm.removeFromParent();
        }
        this.node.stopAllActions();
        let moveByY = 50;
        this.node.runAction(cc.sequence(
            cc.delayTime(this.delayTime),
            cc.moveBy(0.2, 0, moveByY).easing(cc.easeSineOut()),
            cc.moveBy(0.2, 0, -moveByY).easing(cc.easeSineOut()),
            cc.callFunc(this.onFinish.bind(this))
        ))
    }

    //当完成时
    onFinish() {
        if (this.callback) {
            this.callback();
        }
        this.removeSelf();
    }

    removeSelf() {
        DataVO.GD.nodePools.CoinPool.freeNode(this.node)
        this.node.removeFromParent();
    }
}
