import { DataVO } from "../../../../plaza/model/DataVO";
import SoundManager from "../../../../common/managers/SoundManager";
import F_CSBY_FishNet from "../node/F_CSBY_FishNet";
import Util from "../../../../extend/Util";

let FishNetAnimationTag = 110;

// 总时间。
let NET_TIME = 0.7;


// 绽放时间比。
let CENT_ZOOM = 0.15;
// 消隐时间比。
let CENT_FADE = 0.8;

// 振幅。
let AMPLITUDE = 4.0;
// 粒子比例。
let PARTICLE_MAX = 1.65;

const { ccclass, property } = cc._decorator;
/**
 * 鱼网层
 */
@ccclass
export default class F_CSBY_FishNetLayer extends cc.Component {
    onLoad() {
        this.initEx();
    }

    initEx() {
        for (let i = 0; i < 128; ++i) {
            var net = new F_CSBY_FishNet();
        }
    }

    /**
    * 激活鱼网
    */
    activeFishNet(data) {
        let fishNet;
        let fireBubble;
        let poolName
        fireBubble = DataVO.GD.nodePools.FireBubblePool.getNode();
        fireBubble.getComponent("AutoRemoveSelf").poolName = "FireBubblePool";
        if (data.bulletBigKind == 1) {
            fishNet = DataVO.GD.nodePools.FishNet2Pool.getNode();
            poolName = "FishNet2Pool"
        } else if (data.bulletBigKind == 2) {
            if (data.drillBulletNum > 1) {
                fishNet = DataVO.GD.nodePools.FishNet1Pool.getNode();
                poolName = "FishNet1Pool";
            } else {
                cc.log(DataVO.GD.nodePools.FishNet11Pool)
                fishNet = DataVO.GD.nodePools.FishNet11Pool.getNode();
                poolName = "FishNet11Pool";
            }
            SoundManager.getInstance().playID(16312, "sbugame")
        } else {
            if (DataVO.GD.mainScene.cannonLayer.cannonArray[data.chairID].paoType == 0) {
                fishNet = DataVO.GD.nodePools.FishNetPool.getNode();
                poolName = "FishNetPool"
            } else if (DataVO.GD.mainScene.cannonLayer.cannonArray[data.chairID].paoType == 1) {//烟花网
                fishNet = DataVO.GD.nodePools.fishNewY.getNode();
                poolName = "fishNewY"
            } else if (DataVO.GD.mainScene.cannonLayer.cannonArray[data.chairID].paoType == 2) {//白虎网
                fishNet = DataVO.GD.nodePools.fishNewH.getNode();
                poolName = "fishNewH"
            } else if (DataVO.GD.mainScene.cannonLayer.cannonArray[data.chairID].paoType == 3) {//青龙网
                fishNet = DataVO.GD.nodePools.fishNewL.getNode();
                poolName = "fishNewL"
            }
        }
        let pos = data.pos
        if (data.bulletBigKind == 1 || data.bulletBigKind == 2) {
            if (data.drillBulletNum > 1) {
                pos = new cc.Vec2(data.pos.x + Util.rand(-13, 14), data.pos.y + Util.rand(-20, 21));
            }
            fishNet.getComponent("F_CSBY_FishNet").reuse(data.netKind, data.angle, pos, data.chairID, poolName);
            fireBubble.setPosition(pos)
        } else {
            data.angle = Util.rand(0, 361);
            pos = new cc.Vec2(data.pos.x + Util.rand(-13, 14), data.pos.y + Util.rand(-13, 14));
            fishNet.getComponent("F_CSBY_FishNet").reuse(data.netKind, data.angle, pos, data.chairID, poolName);
            fireBubble.setPosition(pos)
        }
        if (data.chairID == DataVO.GD.meChairID) {
            fireBubble.opacity = 255;
        } else {
            fireBubble.opacity = 150;
        }
        fireBubble.setScale(1.3)
        fireBubble.setParent(this.node);
        (fireBubble.getComponent(cc.Animation) as cc.Animation).play();
        fishNet.setParent(this.node);
        if (data.chairID == DataVO.GD.meChairID) {
            /*if (data.netKind == "ion") {
                SoundManager.getInstance().playFx("net2");
            }
            else if (data.netKind == "2") {
                SoundManager.getInstance().playFx("net1");
            }*/
        }
    }
}
