import Util from "../../../../extend/Util";

/**
 * 闪电层
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class F_CSBY_LightingLayer extends cc.Component {

    reuse (lightningKind, dt, st, ed) {

        var aniFrameNum = [4, 4, 5];

        var ani = Util.buildAnimate("#res/likuipiyu/lightning/lightning" + (lightningKind + 1) + "_", aniFrameNum[lightningKind], 1 / 10, ".png", 2);

        // this.node.display("#res/likuipiyu/lightning/lightning" + (lightningKind + 1) + "_01.png");
        this.node.anchorY=0.5;
        this.node.setPosition(st);


        this.getComponent("Sprite").setOpacity(255);
        this.node.setScale(0);
        this.node.angle=-(Util.calcRotation(st, ed));
        var scaleX = st.sub(ed).mag() / this.node.width;
        // this.node.runAction(cc.repeatForever(ani));
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.1, scaleX, 0.5),
            cc.delayTime(dt),
            cc.spawn(cc.scaleTo(0.1, 0), cc.fadeOut(0.1)),
            cc.callFunc(this.removeSelf.bind(this))
        ));

    }
    unuse () {
    }

    removeSelf () {
        // ClassPool.putInPool(this);
        this.node.removeFromParent();
    }
}
