import { DataVO } from "../../../../plaza/model/DataVO";
import { BulletKind, FishKind, subGameMSG } from "../SubGameMSG";
import { GCDFrameInterval, V } from "../F_CSBY_Config";
import Util from "../../../../extend/Util";
import F_CSBY_Fish from "./F_CSBY_Fish";
import SoundManager from "../../../../common/managers/SoundManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class F_CSBY_Bullet extends cc.Component {


    bulletKind;                  //子弹类型
    bulletID;                    //子弹ID
    bulletMultiple;            //子弹倍数
    chairID;                      //子弹所有者ID


    speedValue;                   //总速度值
    speedVec;                      //速度分量
    isAndroid;
    cannonIndex;                   //子弹index

    angle;                    //初始角度
    lockingFish;
    isSuperBullet;

    cacheRect;                        //缓存的rect
    lastCallGetRectingPos;                    //最后一次调用 getRect时， 子弹的位置

    bulletBigKind;
    drillBulletNum;
    //是否有效
    valid: boolean = true;

    beginpos;

    poolName

    paoType: number = 0

    // onLoad () {}

    start() {

    }


    reuse(cannonIndex, bulletID, chairID, isAndroid, bulletBigKind, drillBulletNum, isSuperBullet, lockFish, angle, paotype: number = 0) {
        cc.log('-----reuse------');
        cc.log(paotype);
        this.paoType = paotype
        this.speedValue = null;                   //总速度值
        this.speedVec = null;                      //速度分量


        this.cacheRect = null;                        //缓存的rect
        this.lastCallGetRectingPos = null;                    //最后一次调用 getRect时， 子弹的位置


        this.cannonIndex = cannonIndex;//子弹index


        this.bulletKind = DataVO.GD.fishConfig.cannonKindConfigArray[cannonIndex].size;//子弹类型

        this.bulletMultiple = DataVO.GD.fishConfig.cannonKindConfigArray[cannonIndex].multiple;//子弹倍数
        this.bulletID = bulletID; //子弹ID
        this.chairID = chairID;//子弹所有者椅子ID
        this.isAndroid = isAndroid;

        this.lockingFish = lockFish;
        if (this.drillBulletNum > 0 && lockFish) {
            // cc.error("钻头炮有锁鱼")
            // cc.log(this)
            this.lockingFish = null
        }
        this.isSuperBullet = isSuperBullet;
        this.bulletBigKind = bulletBigKind;
        this.drillBulletNum = drillBulletNum;
        this.angle = angle;
        this.valid = true;
        this.initEx();
        if (chairID == DataVO.GD.meChairID) {
            this.node.opacity = 255;
        } else {
            this.node.opacity = 150;
        }
    }

    initEx() {
        if (this.isSuperBullet) {
            this.speedValue = DataVO.GD.fishConfig.bulletKindConfigArray[BulletKind.BulletKind_ION_1].speed;
        } else if (this.bulletBigKind == 1) {
            this.speedValue = DataVO.GD.fishConfig.bulletKindConfigArray[BulletKind.BulletKind_ION_2].speed;
        } else if (this.drillBulletNum > 0) {
            this.speedValue = DataVO.GD.fishConfig.bulletKindConfigArray[BulletKind.BulletKind_ION_3].speed;
        } else {
            // this.speedValue = DataVO.GD.fishConfig.bulletKindConfigArray[this.bulletKind].speed;
            this.speedValue = 5000;
        }
        if (this.bulletBigKind == 1) {
            let n = Util.rand(1, 4)
            this.node.setScale(1.3)
            this.getComponent(cc.Sprite).spriteFrame = DataVO.GD.mainScene.animation_1Atlas.getSpriteFrame("SS_Bullet2-SS_Bullet2_" + n);
        } else if (this.drillBulletNum > 0) {
            this.node.setScale(1.4)
        } else {
            if (this.paoType == 0) {
                this.node.setScale(1.3)
                this.getComponent(cc.Sprite).spriteFrame = DataVO.GD.mainScene.animation_1Atlas.getSpriteFrame("GP_Bullet-GP_Bullet_" + this.bulletKind);
            } else if (this.paoType == 1) {

            } else if (this.paoType == 2) {

            } else if (this.paoType == 3) {

            }
        }
        var cannon = DataVO.GD.mainScene.cannonLayer.cannonArray[this.chairID];

        var bulletRotation = this.angle;

        //因为子弹层有被翻转180度
        if (cannon.index > 2) {
            bulletRotation += -180;
        }

        let collider = this.node.getComponent(cc.BoxCollider);
        collider.size = this.node.getContentSize();
        collider.enabled = false;
        var angle = bulletRotation * Math.PI / 180;
        this.speedVec = cc.v2(Math.sin(angle) * this.speedValue, Math.cos(angle) * this.speedValue);
        this.node.angle = -bulletRotation;
        // this.beginpos =cannon.getMuzzleWorldPosIgnoreLayerRotation();
        this.beginpos = cannon.flare.node.parent.convertToWorldSpaceAR(cannon.getFirePos());
        cc.log(cannon.flare.node.parent.name)
        this.beginpos = cc.v2(this.beginpos.x - DataVO.GD.offsetSize, this.beginpos.y)
        this.node.setPosition(this.beginpos);
        this.node.active = false;
        this.schedule(function () {
            collider.enabled = true;
            this.node.active = true;
            // }, 0.05, 0);
        }, 0.01, 0);
    }

    unlockFish() {
        this.lockingFish = null;
    }

    getLockFish() {
        return this.lockingFish;
    }
    update(dt) {
        var oldPos = this.node.getPosition();

        //如果在切换鱼阵时， 则把  所有锁鱼xx掉
        if (DataVO.GD.switingScene) {
            this.unlockFish();
        }
        //如果有锁鱼， 是速度变量要时时变更
        if (this.lockingFish) {
            //如果鱼死了
            if (!this.lockingFish.getComponent("F_CSBY_Fish").valid) {
                this.unlockFish();
            }
            else {
                //cc.log("有锁鱼");
                //ttutil.dump(this.speedVec);


                var fishWorldPos = this.lockingFish.parent.convertToWorldSpaceAR((this.lockingFish as cc.Node).getPosition());

                //在屏幕内
                if (fishWorldPos.x < V.w - DataVO.GD.offsetSize && fishWorldPos.x > 0 && fishWorldPos.y < V.h && fishWorldPos.y > DataVO.GD.offsetSize) {
                    var lockFishWorldPos = this.lockingFish.parent.convertToWorldSpaceAR(this.lockingFish.getPosition());
                    var bulletWorldPos = this.node.parent.convertToWorldSpaceAR(this.node.position);

                    var dis = lockFishWorldPos.sub(bulletWorldPos).mag();
                    var vec2 = lockFishWorldPos.sub(bulletWorldPos);
                    var fac = this.speedValue / dis;

                    this.speedVec = cc.v2(vec2.x * fac, vec2.y * fac);
                }
            }

            //ttutil.dump(this.speedVec);
        }
        var newPos = cc.v2(oldPos.x + this.speedVec.x * dt, oldPos.y + this.speedVec.y * dt);


        this.node.setPosition(newPos);

        //cc.log("dt\t" + dt);
        //如果碰墙了
        ///////////////////////////////////////////////////////////
        if (newPos.x <= 0 || newPos.x >= V.w - DataVO.GD.offsetSize * 2) {
            this.speedVec.x = -this.speedVec.x;

            if (newPos.x <= 0) {
                this.node.x = 0;
            }
            if (newPos.x >= V.w - DataVO.GD.offsetSize * 2) {
                this.node.x = V.w - DataVO.GD.offsetSize * 2;
            }


            //要超出界外了， 就不让他锁鱼了
            if (this.lockingFish) {
                this.unlockFish();
            }
            if (this.drillBulletNum > 0 && this.chairID == DataVO.GD.meChairID) { //钻头炮弹跳
                SoundManager.getInstance().playID(16314, "subgame")
            }
        }
        if (newPos.y >= V.h || newPos.y <= 0) {
            this.speedVec.y = -this.speedVec.y;

            if (newPos.y <= 0) {
                this.node.y = 0;
            }
            if (newPos.y >= V.h) {
                this.node.y = V.h;
            }

            //要超出界外了， 就不让他锁鱼了
            if (this.lockingFish) {
                this.unlockFish();
            }
            if (this.drillBulletNum > 0 && this.chairID == DataVO.GD.meChairID) { //钻头炮弹跳
                SoundManager.getInstance().playID(16314, "subgame")
            }
        }
        ///////////////////////////////////////////////////////////
        //调整角度
        this.node.angle = -(Util.calcRotation(oldPos, newPos) + 90);
        /////////////////////////////////////////////////////////////////////////////////////////////////////

        //cc.log('子弹位置：'+newPos.x+':'+newPos.y)
    }
    //碰撞检测
    onCollisionEnter(other: cc.BoxCollider, self) {
        // 矩形碰撞组件顶点坐标，左上，左下，右下，右上
        // let posNet = (self.node as cc.Node).getBoundingBox().origin;
        /*let bulletWorldPos = this.node.parent.convertToWorldSpaceAR(this.node.position);
        if(bulletWorldPos.sub(this.beginpos).mag()<20){
            return;
        }*/
        if (!this.valid) {
            return;
        }
        let _fish = other.node.parent.getComponent("F_CSBY_Fish");

        //测试暴击效果
        // DataVO.GD.mainScene.effectLayer.showBaoJi(1, 1, other.node.parent.position, this.chairID)
        //测试爆竹招福
        // DataVO.GD.mainScene.effectLayer.showBaoZhuZhaoFu(other.node.parent, this.chairID)
        // DataVO.GD.mainScene.effectLayer.showFengBaoFuGui(other.node.parent, this.chairID, [], [3])
        // DataVO.GD.mainScene.effectLayer.showShanDianFuGui(other.node.parent, this.chairID)
        // DataVO.GD.mainScene.effectLayer.showJuBaoLianLian()
        //有任务的积累数据
        // DataVO.GD.mainScene.cannonLayer.updateJuBaoTask(other.node.parent)

        if (this.drillBulletNum > 0 && (_fish.fishKind == FishKind.DrillCannon || _fish.fishKind == FishKind.OrganCannon)) { //钻头炮
            return;
        }
        if (this.bulletBigKind == 1 && _fish.fishKind == FishKind.DrillCannon) { //机枪炮
            return;
        }
        let posNet = (self.node as cc.Node).getPosition();
        // posNet = cc.v2(posNet.x + this.speedVec.x * 0.05, posNet.y + this.speedVec.y * 0.05);

        //有锁鱼的话， 则要打到指this.lockFish定鱼才能中,,
        if (this.lockingFish != other.node.parent && this.lockingFish != null) {
            return;
        }
        DataVO.GD.mainScene.fishNetLayer.activeFishNet({
            netKind: this.bulletKind,
            angle: this.node.angle,
            pos: posNet,
            chairID: this.chairID,
            bulletBigKind: this.bulletBigKind,
            drillBulletNum: this.drillBulletNum,
        });
        if (this.chairID == DataVO.GD.meChairID) {
            _fish.onHit();
        }
        if ((this.chairID == DataVO.GD.meChairID) || (this.isAndroid && DataVO.GD.isAndroidHelp)) {
            let msg: { [k: string]: any } = {};
            msg.bulletID = this.bulletID;
            msg.fishID = _fish.fishID;
            msg.fishIndex = _fish.fishIndex;
            msg.chairID = this.chairID;
            //如果打中的是炸弹
            /*if (_fish.fishKind == FishKind.LocalBomb || _fish.fishKind == FishKind.SuperBomb || _fish.fishKind == FishKind.OneKindBomb || _fish.fishKind == FishKind.FiveKindBomb) {

                msg.rangeFish = DataVO.GD.mainScene.fishLayer.findRangeFishes(_fish);

            }*/
            if (this.drillBulletNum > 0) {
                console.log("钻头炮次数" + this.drillBulletNum)
            }
            msg.fishKind = _fish.fishKind;
            msg.paoType = this.paoType
            DataVO.GD.mainScene.sendGameData(subGameMSG.SUB_C_CATCH_FISH, msg);
        }
        if (this.drillBulletNum > 0) { //钻头炮
            if (_fish.fishKind != FishKind.DrillCannon && _fish.fishKind != FishKind.OrganCannon) {
                this.drillBulletNum--;
                cc.log('钻头炮数   ' + this.drillBulletNum)
            }
            // this.removeSelf();//测试代码

            if (this.drillBulletNum <= 0) {
                if (this.chairID == DataVO.GD.meChairID) {
                    SoundManager.getInstance().playID(16313, "subgame")
                }
                DataVO.GD.mainScene.cannonLayer.cannonArray[this.chairID].endBitBullet();
                if ((this.chairID == DataVO.GD.meChairID) || (this.isAndroid && DataVO.GD.isAndroidHelp)) {
                    let msg: { [k: string]: any } = {};
                    msg.bulletID = this.bulletID;
                    msg.chairID = this.chairID;
                    DataVO.GD.mainScene.sendGameData(subGameMSG.SUB_C_CLEAR_DRILLBULLET, msg);
                }
                this.removeSelf();
            }
        } else {
            this.removeSelf();
        }
    }

    /**
    * 得到的是真实的世界坐标
    * @returns {{lt, rt, lb, rb}|{lt: (*|cc.Point), rt: (*|cc.Point), lb: (*|cc.Point), rb: (*|cc.Point)}}
    */
    getBulletRect() {
        //把rect缓存起来， 因为每帧中， 每个子弹都会调用每条鱼的getFishRect进行碰撞检测一次
        var nowPos = this.node.getPosition();
        if (this.cacheRect == null || this.lastCallGetRectingPos == null || this.lastCallGetRectingPos.x != nowPos.x || this.lastCallGetRectingPos.y != nowPos.y) {
            this.lastCallGetRectingPos = nowPos;
            return this.cacheRect = Util.getRect(this.node, 0.8);
        }
        return this.cacheRect;

    }

    removeSelf() {
        this.valid = false
        if (this.chairID == DataVO.GD.meChairID) {
            DataVO.GD.nowBulletNum--;
        }
        this.node.setScale(1)
        DataVO.GD.nodePools[this.poolName].freeNode(this.node)
        this.node.removeFromParent();

    }
}
