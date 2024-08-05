import { DataVO } from "../../../../plaza/model/DataVO";

/**
 * 鱼网
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class F_CSBY_FishNet extends cc.Component {

    netKind;
    angle;
    pos;
    poolName
    onLoad() {

    }
    reuse(netKind, angle, pos, chairID, poolName) {
        this.netKind = netKind;
        this.angle = angle;
        this.pos = pos;
        this.node.opacity = 255;
        this.poolName = poolName
        this.initEx();
        if (chairID == DataVO.GD.meChairID) {
            this.node.opacity = 255;
        } else {
            this.node.opacity = 150;
        }
        if (poolName == "FishNet2Pool" || poolName == "FishNet11Pool" || poolName == "FishNet1Pool") {
            this.node.getComponent(cc.Animation).play();
        } else if (poolName == "fishNewY") {

        } else if (poolName == "fishNewH") {

        } else if (poolName == "fishNewL") {

        } else {
            this.node.getComponent(cc.Sprite).spriteFrame = DataVO.GD.mainScene.cannonLayer.cannonAtlas.getSpriteFrame("GP_Hit_0" + this.netKind + "_png");
        }

    }

    initEx() {
        if (this.poolName == "FishNetPool") {
            this.node.setScale(1.2);
            this.node.runAction(cc.sequence(cc.scaleTo(0.07, 1.5), cc.scaleTo(0.07, 0.9), cc.scaleTo(0.07, 1.1), cc.scaleTo(0.07, 1), cc.fadeOut(0.2), cc.callFunc(this.removeSelf.bind(this))));
            //this.node.runAction(cc.sequence(cc.scaleTo(1,1.6),cc.scaleTo(1,1.2),cc.scaleTo(1,1.3),cc.fadeOut(0.1), cc.callFunc(this.removeSelf.bind(this))));
        } else if (this.poolName == "FishNet1Pool") {
            this.node.setScale(2);
        } else if (this.poolName == "FishNet11Pool") {
            this.node.setScale(4);
        } else if (this.poolName == "FishNet2Pool") {
            this.node.setScale(1.3);
        } else {
            cc.tween(this.node).delay(0.5).call(() => {
                this.removeSelf();
            }).start();
        }
        if (this.poolName == "FishNet11Pool" || this.poolName == "FishNet1Pool" || this.poolName == "FishNet2Pool") {
            this.node.angle = this.angle;
        } else {
            this.node.angle = this.angle;
        }
        this.node.setPosition(this.pos);
    }
    removeSelf() {
        this.node.stopAllActions();
        this.node.removeFromParent();
        DataVO.GD.nodePools[this.poolName].freeNode(this.node)
    }
}
