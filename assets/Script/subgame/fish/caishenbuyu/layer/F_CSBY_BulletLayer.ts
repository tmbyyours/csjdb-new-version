import { DataVO } from "../../../../plaza/model/DataVO";
import { EventManager } from "../../../../common/managers/EventManager";
import F_CSBY_Bullet from "../node/F_CSBY_Bullet";

const { ccclass, property } = cc._decorator;

@ccclass
export default class F_CSBY_BulletLayer extends cc.Component {

    onLoad() {
        this.eventList();
    }
    eventList(): void {
        EventManager.getInstance().addEventListener("unlockFish", this.unlockFish, this);
    }
    onLowNumOfFrames() {

        var children = this.node.children;
        var len = children.length;
        for (var i = 0; i < len; ++i) {
            var bullet = children[i];
            if (bullet.getComponent("F_CSBY_Bullet").chairID != DataVO.GD.meChairID) {
                bullet.runAction(cc.callFunc((bullet.getComponent("F_CSBY_Bullet") as F_CSBY_Bullet).removeSelf.bind(bullet)));
            }
        }
    }

    allUnlockFish() {
        var bulletArray = this.node.children;
        for (var i = 0; i < bulletArray.length; ++i) {
            bulletArray[i].getComponent("F_CSBY_Bullet").unlockFish();
        }
    }
    getBullet(bulletID, chairID) {
        var bulletArray = this.node.children;
        let _bullet
        for (var i = 0; i < bulletArray.length; ++i) {
            if (bulletArray[i].getComponent("F_CSBY_Bullet").bulletID == bulletID && bulletArray[i].getComponent("F_CSBY_Bullet").chairID == chairID) {
                _bullet = bulletArray[i].getComponent("F_CSBY_Bullet")
                break;
            }
        }
        return _bullet
    }
    removeBullet(bulletID, chairID) {
        var bulletArray = this.node.children;
        for (var i = 0; i < bulletArray.length; ++i) {
            if (bulletArray[i].getComponent("F_CSBY_Bullet").bulletID == bulletID && bulletArray[i].getComponent("F_CSBY_Bullet").chairID == chairID) {
                bulletArray[i].getComponent("F_CSBY_Bullet").removeSelf();
                break;
            }
        }
    }
    unlockFish(name, data) {
        var bulletArray = this.node.children;
        for (var i = 0; i < bulletArray.length; ++i) {
            if (bulletArray[i].getComponent("F_CSBY_Bullet").getLockFish() == data["fish"]) {
                if (data["chairID"] && data["chairID"] == bulletArray[i].getComponent("F_CSBY_Bullet").chairID) {
                    bulletArray[i].getComponent("F_CSBY_Bullet").unlockFish();
                } else {
                    bulletArray[i].getComponent("F_CSBY_Bullet").unlockFish();
                }
            }
        }
    }

    /**
    * 激活子弹
    */
    activeBullet(data) {
        var lockFish = null;
        if (data.lockFishID != null) {
            lockFish = DataVO.GD.mainScene.fishLayer.getFishByFishID(data.lockFishID);
            //cc.log("lockFish\t" + lockFish);
        }

        cc.log('------activeBullet------');
        cc.log(data);
        cc.log(DataVO.GD.nodePools.bulletbaihu);

        for (var i = 0; i < data.bulletIDArray.length; ++i) {
            let bullet
            if (data.paoType == 0) {
                if (data.drillBulletNum > 0) {
                    bullet = DataVO.GD.nodePools.bullet1.getNode();
                    bullet.getComponent("F_CSBY_Bullet").poolName = "bullet1"
                    bullet.anchorY = 0.5;
                } else {
                    bullet = DataVO.GD.nodePools.BulletPool.getNode();
                    bullet.getComponent("F_CSBY_Bullet").poolName = "BulletPool"
                }
            } else if (data.paoType == 1) {//烟花
                bullet = DataVO.GD.nodePools.bulletyanhua.getNode();
                bullet.getComponent("F_CSBY_Bullet").poolName = "bulletyanhua"
            } else if (data.paoType == 2) {//白虎
                bullet = DataVO.GD.nodePools.bulletbaihu.getNode();
                bullet.getComponent("F_CSBY_Bullet").poolName = "bulletbaihu"
            } else {//青龙
                bullet = DataVO.GD.nodePools.bulletqinglong.getNode();
                bullet.getComponent("F_CSBY_Bullet").poolName = "bulletqinglong"
            }
            bullet.getComponent("F_CSBY_Bullet").reuse(data.cannonIndex, data.bulletIDArray[i], data.chairID, data.isAndroid, data.bulletBigKind, data.drillBulletNum, data.isSuperBullet, i == 0 ? lockFish : null, data.angleArray[i], data.paoType);
            (bullet as cc.Node).setParent(this.node);
        }
    }

    onDestroy() {
        EventManager.getInstance().removeEventListener("unlockFish", this.unlockFish, this);
    }
}
