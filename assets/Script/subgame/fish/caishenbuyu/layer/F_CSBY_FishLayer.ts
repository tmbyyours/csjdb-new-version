import { V, GFishDieAniDT, GFishKindAnimationFN, musicRes } from "../F_CSBY_Config";
import { DataVO } from "../../../../plaza/model/DataVO";
import { FishKind } from "../SubGameMSG";
import Util from "../../../../extend/Util";
import SoundManager from "../../../../common/managers/SoundManager";
import { ym, FishRotationAt } from "../common/FishAction";
import { EventManager } from "../../../../common/managers/EventManager";
import F_CSBY_Fish, { FishMoveTag } from "../node/F_CSBY_Fish";
import F_CSBY_GameSceneLayer from "./F_CSBY_GameSceneLayer";
import F_CSBY_NewRoulette from "../node/F_CSBY_NewRoulette";

const { ccclass, property } = cc._decorator;
//鱼层
@ccclass
export default class F_CSBY_FishLayer extends cc.Component {
    // 上一次更新时的帧数
    lastUpdateDetectionArrayTotalFrames = 0;
    //下次点击是否锁鱼
    lockFishStatus: boolean = false;

    fishArray;
    check
    elapsed
    touchPos = cc.v2(0, 0)
    onLoad() {
        this.listenEvent();
    }
    // LIFE-CYCLE CALLBACKS:
    listenEvent() {
        //点击屏幕锁鱼或者取消
        this.node.on(cc.Node.EventType.TOUCH_START, this.FishNode_TOUCH_START, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.FishNode_TOUCH_Move, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.FishNode_TOUCH_END, this);
        EventManager.getInstance().addEventListener('chaoshui', this.upFishSpeed, this)
    }

    upFishSpeed() {
        if (this.node != null && typeof (this.node) !== "undefined" && this.node.children !== null) {
            let fishArray1 = this.node.children;
            for (var i = 0; i < fishArray1.length; i++) {
                if (fishArray1[i]) {
                    fishArray1[i].getComponent('F_CSBY_Fish').upFishSpeed();
                }
            }
        }
    }

    //点击屏幕
    FishNode_TOUCH_START(e) {
        this.check = true
        this.elapsed = 0
        cc.log('点击屏幕点击屏幕点击屏幕点击屏幕点击屏幕')
        //测试代码
        // cc.tween(this.node).delay(0.01).call(() => {
        //     DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].subMul()
        // }).start()
        DataVO.GD.effectStop = false
        this.touchPos = e.getLocation()
        if (this.lockFishStatus) {
            if (DataVO.GD.meChairID != null) {
                var fishArray = this.node.children;
                var fish
                var clickfishArray = []
                for (var i = fishArray.length - 1; i >= 0; --i) {
                    if (DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].isMiniBullet() && fishArray[i].getComponent("F_CSBY_Fish").fishKind == FishKind.DrillCannon) {
                        continue
                    }
                    var fishWorldPos = fishArray[i].parent.convertToWorldSpaceAR((fishArray[i] as cc.Node).getPosition());
                    //在屏幕内
                    if (fishWorldPos.x < V.w - DataVO.GD.offsetSize && fishWorldPos.x > 0 && fishWorldPos.y < V.h && fishWorldPos.y > DataVO.GD.offsetSize) {
                        let collider = fishArray[i].getComponent("F_CSBY_Fish").fishSprite.node.getComponent(cc.BoxCollider);
                        if (collider.world) {
                            if (cc.Intersection.pointInPolygon(e.getLocation(), collider.world.points)) {
                                if (fishArray[i].opacity > 150) {//特殊炮弹  透明鱼处理
                                    clickfishArray.push(fishArray[i])
                                }
                            }
                        }
                    }
                    /*if(fishArray[i].getBoundingBoxToWorld().contains(e.getLocation())){
                        clickfishArray.push(fishArray[i])
                    }*/
                }

                for (var i = clickfishArray.length - 1; i >= 0; --i) {
                    if (fish == undefined || fish.getComponent("F_CSBY_Fish").fishKind < clickfishArray[i].getComponent("F_CSBY_Fish").fishKind) {
                        fish = clickfishArray[i]
                    }
                }
                if (fish != undefined) {
                    DataVO.GD.mainScene.cannonLayer.setLockFish(DataVO.GD.meChairID, fish);
                    if (DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].paoType != 0) {
                        DataVO.GD.newPaoSelect = true
                    }
                }
            }
        } else {
            DataVO.GD.mainScene.cannonLayer.mouseFireDown = true;
            DataVO.GD.mainScene.cannonLayer.autoFireFlag = DataVO.GD.mainScene.cannonLayer.autoFire
            // if (DataVO.GD.mainScene.cannonLayer.autoFire) {
            //     DataVO.GD.mainScene.cannonLayer.autoFireFlag = true
            // }
        }
        this.onMouseMove(e);
        if (DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].paoType == 0) {
            DataVO.GD.mainScene.windowsLayer.showClickAim(e.getLocation());
        }

    }

    FishNode_TOUCH_Move(e) {
        if (DataVO.GD.effectStop) {
            return
        }
        this.onMouseMove1(e)
    }

    FishNode_TOUCH_END(e) {
        this.check = false
        this.elapsed = 0
        if (!this.lockFishStatus) {
            DataVO.GD.mainScene.cannonLayer.mouseFireDown = false;
        }
        DataVO.GD.mainScene.windowsLayer.node.getChildByName("SS_Touch").active = false;
    }

    onMouseMove1(event) {
        // cc.log('111111111111111111111         ' + this.elapsed)
        if (DataVO.GD.effectStop) {
            return
        }
        var mousePos = event.getLocation();
        this.touchPos = mousePos
        mousePos = cc.v2(mousePos.x - DataVO.GD.offsetSize, mousePos.y)
        DataVO.GD.mainScene.windowsLayer.node.getChildByName("SS_Touch").setPosition(mousePos)
        // var muzzlePos = DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].gun.node.convertToWorldSpaceAR(cc.v2(0, 0));
        // var rotation = Util.calcRotation(muzzlePos, mousePos) + 90;
        // // cc.log("onMouseMoveonMouseMoveonMouseMoveonMouseMove")
        // // cc.log(rotation)
        // if (rotation < -90 || rotation > 180) {
        //     rotation = -90
        // } else if (rotation > 90 && rotation <= 180) {
        //     rotation = 90
        // }
        // if (this.elapsed < 0.15) {
        //     return
        // }
        // this.elapsed = 0
        if (!this.lockFishStatus) {
            DataVO.GD.mainScene.windowsLayer.node.getChildByName("SS_Touch").active = true;
        } else {
            DataVO.GD.mainScene.windowsLayer.node.getChildByName("SS_Touch").active = false;
        }
        // DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].setFireAngle(rotation);
    }

    //调整射击角度
    onMouseMove(event) {
        cc.log('0000000000000' + DataVO.GD.effectStop)

        if (DataVO.GD.effectStop || DataVO.GD.bulletMany) {
            return
        }
        if (DataVO.GD.meChairID != null) {
            //锁定鱼的情况下， 不能 用鼠标操纵，炮口会跟着鱼走
            if (DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].getLockFish() == null && DataVO.GD.isAllowFire && !this.lockFishStatus) {
                var mousePos = event.getLocation();
                var muzzlePos = DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].gun.node.convertToWorldSpaceAR(cc.v2(0, 0));
                var rotation = Util.calcRotation(muzzlePos, mousePos) + 90;
                cc.log("onMouseMoveonMouseMoveonMouseMoveonMouseMove")
                cc.log(rotation)
                if (rotation < -90 || rotation > 180) {
                    rotation = -90
                } else if (rotation > 90 && rotation <= 180) {
                    rotation = 90
                }
                DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].setFireAngle(rotation);
            }
        }
        return false;
    }

    accelerateAllFish() {

        var children = this.node.children;
        for (var i = children.length - 1; i >= 0; --i) {
            let fish = children[i];
            //fish.specifiedSpeed= fish.specifiedSpeed*2;
            var moveAction = fish.getActionByTag(FishMoveTag);
            /*cc.log(moveAction)
            fish.stopActionByTag(FishMoveTag);
            // @ts-ignore
            var newAction = cc.speed(moveAction,10)
            // @ts-ignore
            cc.log(newAction)
            // @ts-ignore
            cc.log(moveAction._elapsed)
            // @ts-ignore
            //newAction._elapsed =moveAction._elapsed
            newAction.setTag(FishMoveTag);
            fish.runAction(newAction);*/
            if (moveAction) {
                // @ts-ignore
                moveAction._speed = 10;
            }
        }
    }
    //清除所有鱼
    clearAllFish() {
        var children = this.node.children;
        var len = children.length;
        while (len--) {
            if ((children[len].getComponent("F_CSBY_Fish") as F_CSBY_Fish).valid) {
                (children[len].getComponent("F_CSBY_Fish") as F_CSBY_Fish).removeSelf();
            } else {
                // cc.error("有死亡的鱼")
            }
        }
    }

    /**
     * 激活鱼
     */
    activeFish(data, moveAction?) {
        if (data.fishPath) {
            for (let i = 0; i < data.fishPath.length; ++i) {
                let fishPath = data.fishPath[i];
                fishPath.x *= V.w;
                fishPath.y *= V.h;
            }
        }
        //cc.log("activeFishactiveFishactiveFishactiveFishactiveFish")
        //cc.log(DataVO.GD.nodePools)
        //cc.log(data.fishKind)
        //cc.log(DataVO.GD.nodePools["fish_"+(data.fishKind+1)])
        //cc.log(data.subFishKind)
        //只要有刷鱼，就不加速了        
        F_CSBY_GameSceneLayer.seaIsCome = false;
        let fish: cc.Node;
        switch (data.fishKind) {
            case FishKind.OrganCannon:
                fish = DataVO.GD.nodePools["OrganCannon"].getNode();
                break;
            case FishKind.DrillCannon:
                fish = DataVO.GD.nodePools["DrillCannon"].getNode();
                break;
            case FishKind.CenserBead:
                fish = DataVO.GD.nodePools["CenserBead"].getNode();
                break;
            case FishKind.GodFafa:
                fish = DataVO.GD.nodePools["GodFafa"].getNode();
                break;
            case FishKind.LuckRun:
                fish = DataVO.GD.nodePools["LuckRun"].getNode();
                break;
            case FishKind.GodAdvent:
                fish = DataVO.GD.nodePools["GodAdvent"].getNode();
                //SoundManager.getInstance().playMusic(4001, "subgame");移动到警报时
                break;
            case FishKind.JuBaoLianLian:
                fish = DataVO.GD.nodePools["JuBaoLianLian"].getNode();
                break;
            case FishKind.FengBaoFuGui:
                fish = DataVO.GD.nodePools["FengBaoFuGui"].getNode();
                break;
            case FishKind.ShanDianFuGui:
                fish = DataVO.GD.nodePools["ShanDianFuGui"].getNode();
                break;
            case FishKind.BaoZhuZhaoFu:
                fish = DataVO.GD.nodePools["BaoZhuZhaoFu"].getNode();
                break;
            default:
                fish = DataVO.GD.nodePools["fish_" + (data.fishKind + 1)].getNode();
        }
        fish.getComponent("F_CSBY_Fish").enabled = true
        fish.getComponent("F_CSBY_Fish").reuse(data.fishKind, data.subFishKind, data.fishID, data.fishIndex, data.fishTraceType, data.fishPath, data.delayTime, data.speed);
        fish.setParent(this.node)
        if (data.fishKind == FishKind.GodAdvent) {
            fish.zIndex = 1;
        }

        /*if (this.node.children.length > 0) {
            if (this.node.children[this.node.children.length - 1].getComponent("F_CSBY_Fish").fishKind == FishKind.GodAdvent) {
                fish.setParent(this.node)
                fish.zIndex = this.node.children.length -1;
            } else {
                fish.setParent(this.node)
                //fish.zIndex = this.node.children.length;
            }
        } else {
            fish.setParent(this.node)
            //fish.zIndex = 0
        }*/
        if (moveAction) {
            fish.getComponent("F_CSBY_Fish").runMoveAction(moveAction);
        }


        return fish;
    }


    /**
    * 当捕获到鱼
    * @param data
    */
    onCatchFish(data) {
        var fishID = data.fishID;
        cc.log("onCatchFishonCatchFishonCatchFishonCatchFishonCatchFish")
        cc.log(data)
        var fish = this.getFishByFishID(fishID);
        if (!fish) {
            // cc.error("鱼为空");
            return;
        }
        var multiple = data.multiple;
        var paolevel = data.paolevel;
        var pos = fish.getPosition();
        var score = Number(data.fishScore);
        var chairID = data.chairID;
        let baoJi = data.baoJi
        let segmentMul = data.segmentMul
        let catchFish = data.catchFish

        DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].allScore = data.allScore
        //统计
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (data.chairID == DataVO.GD.meChairID) {
            DataVO.GD.harvestMoney += Number(data.fishScore);
            //cc.log(fish.fishKind);
            DataVO.GD.catchFishNum[fish.getComponent("F_CSBY_Fish").fishKind] = (DataVO.GD.catchFishNum[fish.getComponent("F_CSBY_Fish").fishKind] || 0) + 1;
            DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].autoLockingFish = false;
        }

        //更改  多发子弹发出后，命中的子弹需要及时修改炮值  2021年1月11日10:40:02
        cc.log('paolevel   ' + paolevel)
        DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].setBulletMul(paolevel)
        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        //死亡动画播放完后
        var dieAniPlayedCallback = function () {
            if (score > 0) {
                cc.log('----dieAniPlayedCallback-----');
                cc.log(baoJi);
                if (baoJi.length > 0 && fish.getComponent("F_CSBY_Fish").fishKind < FishKind.JuBaoLianLian) {
                    DataVO.GD.mainScene.effectLayer.showBaoJi(baoJi[0], score, fish.position, chairID)
                }
            }
            if (score > 0 && (!data.triggerInfo || chairID != DataVO.GD.meChairID)) {
                if (data.triggerInfo && chairID != DataVO.GD.meChairID) {
                    let kind = data.triggerInfo.triggerKind
                    let _score = data.triggerInfo.bulletMultiple * data.triggerInfo.triggerMul
                    // DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].prize.getComponent("F_CSBY_Prize").activePrize(kind, _score, chairID);
                    DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].newprize.getComponent(F_CSBY_NewRoulette).showRoulette(kind, _score, chairID);
                }
                else if (fish.getComponent("F_CSBY_Fish").fishKind >= FishKind.FishKind11) {
                    // DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].prize.getComponent("F_CSBY_Prize").activePrize(fish.getComponent("F_CSBY_Fish").fishKind, score, chairID);
                    DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].newprize.getComponent(F_CSBY_NewRoulette).showRoulette(fish.getComponent("F_CSBY_Fish").fishKind, score, chairID);
                }
                if (fish.getComponent("F_CSBY_Fish").fishKind != FishKind.GodFafa && fish.getComponent("F_CSBY_Fish").fishKind != FishKind.LuckRun) {
                    DataVO.GD.mainScene.scoreLayer.activeScore(score, multiple, pos, chairID);
                }
                DataVO.GD.mainScene.coinLayer.activeCoin(fish, chairID, multiple, function () {
                    // DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].addScore(score);
                    DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].addScore(data.allScore);
                });
            } else if (score > 0 && data.triggerInfo && chairID == DataVO.GD.meChairID) {
                if (DataVO.GD.mainScene.uiLayer.isplaygame == false) {
                    if (data.triggerInfo.triggerKind == 25) {
                        //轮盘
                        DataVO.GD.mainScene.uiLayer.activeRoulette(data.triggerInfo.triggerArray, data.triggerInfo.bulletMultiple, data.triggerInfo.postion);
                    } else if (data.triggerInfo.triggerKind == 24) {
                        //红包
                        let _score = data.triggerInfo.bulletMultiple * data.triggerInfo.triggerMul
                        console.log("红包红包红包红包红包红包红包红包红包红包红包红包红包")
                        console.log(data)
                        console.log(_score)

                        if (score > _score) {
                            // DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].addScore(score - _score);
                            DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].addScore(data.allScore);
                        }
                        DataVO.GD.mainScene.uiLayer.activeRedBag(data.triggerInfo.triggerArray, data.fishScore, data.triggerInfo.bulletMultiple, data.triggerInfo.postion);
                    }
                } else {
                    // DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].addScore(score);
                    DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].addScore(data.allScore);
                }
            }
            if (data.superBullet) {
                DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].startSuperBullet(chairID);
            }
        };
        if (fish.getComponent("F_CSBY_Fish").fishKind != FishKind.OrganCannon && fish.getComponent("F_CSBY_Fish").fishKind != FishKind.DrillCannon) {
            if (fish.getComponent("F_CSBY_Fish").fishKind == FishKind.BaoZhuZhaoFu) {
                if (segmentMul.length == 3) {
                    let p = fish.position
                    fish.getComponent("F_CSBY_Fish").death();
                    DataVO.GD.mainScene.effectLayer.showBaoZhuZhaoFu(p, chairID, segmentMul)
                }
            } else if (fish.getComponent("F_CSBY_Fish").fishKind == FishKind.FengBaoFuGui) {
                let f = fish
                fish.getComponent("F_CSBY_Fish").death();
                DataVO.GD.mainScene.effectLayer.showFengBaoFuGui(f, chairID, catchFish, baoJi)
            } else if (fish.getComponent("F_CSBY_Fish").fishKind == FishKind.ShanDianFuGui) {
                let f = fish
                fish.getComponent("F_CSBY_Fish").death();
                DataVO.GD.mainScene.effectLayer.showShanDianFuGui(f, chairID, catchFish)
            } else if (fish.getComponent("F_CSBY_Fish").fishKind == FishKind.JuBaoLianLian) {
                let f = fish
                // fish.getComponent("F_CSBY_Fish").death();
                DataVO.GD.mainScene.effectLayer.showJuBaoLianLian(f, chairID, data.triggerInfo.isTrigger, data.triggerInfo.postion, data.triggerInfo.triggerArray, baoJi, data.triggerInfo.triggerMul)
            } else {
                fish.getComponent("F_CSBY_Fish").death(dieAniPlayedCallback);
            }
        } else {
            DataVO.GD.mainScene.scoreLayer.activeScore(score, multiple, pos, chairID);
            DataVO.GD.mainScene.coinLayer.activeCoin(fish, chairID, multiple, function () {
                // DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].addScore(score);
                DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].addScore(data.allScore);
            });
            // DataVO.GD.mainScene.cannonLayer.autoFireFlag = false;//取消自动
            // DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].unlockFish(); //取消瞄准
        }

        //音效播放
        let ids
        let n
        if (fish.getComponent("F_CSBY_Fish").fishKind == FishKind.LuckRun) {
            ids = [21994861]
        } else if (fish.getComponent("F_CSBY_Fish").fishKind == FishKind.GodFafa) {
            ids = [21993871]
        } else if (fish.getComponent("F_CSBY_Fish").fishKind == FishKind.GodAdvent) {
            ids = [21994881, 21994882, 21994883, 21994884, 21994885, 21994886]
        } else if (multiple >= 8 && multiple <= 23) {
            ids = [42990815, 42990814, 42990813, 42990812, 42990811, 41990814, 41990813, 41990812, 41990811]
        } else if (multiple >= 24 && multiple <= 50) {
            ids = [22990826, 22990825, 22990824, 22990823, 22990822, 22990821, 21990824, 21990823, 21990822, 21990821]
        } else if (multiple >= 51 && multiple <= 150) {
            ids = [21990831, 22990831, 21990832]
        }
        if (ids && fish.getComponent("F_CSBY_Fish").fishKind != FishKind.DrillCannon && fish.getComponent("F_CSBY_Fish").fishKind != FishKind.OrganCannon) {
            n = Util.rand(0, ids.length)
            if (n >= ids.length) {
                n = ids.length - 1;
            }
            if (data.chairID == DataVO.GD.meChairID || fish.getComponent("F_CSBY_Fish").fishKind == FishKind.GodAdvent) {
                SoundManager.getInstance().playID(ids[n], "subgame")
            }
        }



        if (data.drillBulletNum == 50) { //获得钻头炮
            if (data.chairID == DataVO.GD.meChairID) {
                DataVO.GD.mainScene.cannonLayer.setGrayStatus()
                if (DataVO.GD.mainScene.fishLayer.lockFishStatus) { //取消瞄准
                    DataVO.GD.mainScene.cannonLayer.seAim();
                }
                if (DataVO.GD.mainScene.cannonLayer.autoFire) { // 取消自动
                    DataVO.GD.mainScene.cannonLayer.setAuto();
                }
                //修改自己看到的20，21鱼状态
                this.onFrozenFish(2);
                EventManager.getInstance().raiseEvent("unlockFish", { fish: fish, chairID: data.chairID });
            }
            DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].startBitBullet(data.drillBulletNum);
        }


        if (data.superBulletNum > 0 && fish.getComponent("F_CSBY_Fish").fishKind == FishKind.OrganCannon) {//获得机关炮
            DataVO.GD.mainScene.cannonLayer.setGrayStatus()
            let num = data.addSuperBulletNum;
            if (num > 0) {
                DataVO.GD.mainScene.coinLayer.activeCoin1(fish, chairID, num, function () {
                    DataVO.GD.mainScene.scoreLayer.activeMiniNum(num, chairID);
                });
            }
            if (DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].superBulletNum == 0) {
                DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].startMiniBullet(data.superBulletNum);
            }
            if (data.chairID == DataVO.GD.meChairID) {
                DataVO.GD.autoFireFlag = false
                DataVO.GD.mainScene.cannonLayer.autoFireFlag = false;//取消自动
                DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].unlockFish(); //取消瞄准
                /*if (DataVO.GD.mainScene.fishLayer.lockFishStatus) { //取消瞄准
                    DataVO.GD.mainScene.cannonLayer.seAim();
                }
                if (DataVO.GD.mainScene.cannonLayer.autoFire) { //取消自动
                    DataVO.GD.mainScene.cannonLayer.setAuto();
                }*/
                this.onFrozenFish(1);
            }
        }

        //if (multiple > DataVO.GD.fishConfig.prizeMUL ) {
        //    Util.srand(fishID);          //保证各客户端一致

        //}
    }

    getFishByFishID(fishID): cc.Node {

        var fishArray = this.node.children;

        for (var i = 0; i < fishArray.length; ++i) {
            var fish = fishArray[i];
            if (fish.getComponent("F_CSBY_Fish").fishID == fishID) {
                return fish;
            }
        }
        return null;
    }

    /**
     * 随机锁鱼
     */
    getRandomLockFish(chairID, oldLockFish) {
        var fishArray = this.node.children;
        var ex = 0.05;
        if (oldLockFish) {
            var canChoice = false;
            for (var i = 0; i < fishArray.length; ++i) {
                var fish = fishArray[i];
                if (DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].isMiniBullet() && fish.getComponent("F_CSBY_Fish").fishKind == FishKind.DrillCannon) {
                    continue;
                }
                var pos = fish.getPosition();
                if (canChoice) {
                    // if ((fish.isRedFish || fish.fishKind >= FishKind.FishKind14) && pos.x > V.w * ex && pos.x < V.w * (1 - ex) && pos.y > V.h * ex && pos.y < V.h * (1 - ex)) {
                    if (pos.x > V.w * ex && pos.x < V.w * (1 - ex) && pos.y > V.h * ex && pos.y < V.h * (1 - ex)) {
                        return fish;
                    }
                }
                if (fish == oldLockFish) {
                    canChoice = true;
                }
            }
        }

        let tempBigFishArr = [], tempFishArr = [];
        for (var i = 0; i < fishArray.length; ++i) {
            var fish = fishArray[i];
            if (DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].isMiniBullet() && fish.getComponent("F_CSBY_Fish").fishKind == FishKind.DrillCannon) {
                continue;
            }
            var pos = fish.getPosition();
            // if ((fish.isRedFish || fish.fishKind >= FishKind.FishKind14) && pos.x > V.w * ex && pos.x < V.w * (1 - ex) && pos.y > V.h * ex && pos.y < V.h * (1 - ex)) {
            if (pos.x > V.w * ex && pos.x < V.w * (1 - ex) && pos.y > V.h * ex && pos.y < V.h * (1 - ex)) {
                if (fish.getComponent("F_CSBY_Fish").isRedFish || fish.getComponent("F_CSBY_Fish").fishKind >= FishKind.FishKind14) {
                    tempBigFishArr.push(fish);
                } else {
                    tempFishArr.push(fish);
                }
            }
        }
        if (tempBigFishArr.length > 0) {
            return tempBigFishArr[Math.floor((tempBigFishArr.length - 1) / (chairID + 1))];
        } else if (tempFishArr.length > 0) {
            return tempFishArr[Math.floor((tempFishArr.length - 1) / (chairID + 1))];
        } else {
            return null;
        }
    }
    //取消冻结20，21
    cancelFrozenFish(type) {
        var fishArray = this.node.children;
        var len = fishArray.length;
        for (var i = 0; i < len; ++i) {
            var fish = fishArray[i];
            if (fish.getComponent("F_CSBY_Fish").valid && fish.getComponent("F_CSBY_Fish").fishKind == FishKind.OrganCannon && type == 2) {
                fish.getChildByName("fishSprite").active = true;
                fish.getChildByName("light").active = true;
                fish.getChildByName("icon").active = true;
                fish.getChildByName("SS_Symbol_Freeze").active = true;
                (fish.getChildByName("SS_Symbol_Freeze").getComponent(cc.Animation) as cc.Animation).play("SS_Symbol_Freeze", 0.11)
                fish.getChildByName("unicon").active = false;
            }
            if (fish.getComponent("F_CSBY_Fish").valid && fish.getComponent("F_CSBY_Fish").fishKind == FishKind.DrillCannon) {
                fish.getChildByName("fishSprite").active = true;
                fish.getChildByName("light").active = true;
                fish.getChildByName("icon").active = true;
                fish.getChildByName("SS_Symbol_Freeze").active = true;
                (fish.getChildByName("SS_Symbol_Freeze").getComponent(cc.Animation) as cc.Animation).play("SS_Symbol_Freeze", 0.11)
                fish.getChildByName("unicon").active = false;
            }
        }
    }
    //冻结20，21
    onFrozenFish(type) {
        var fishArray = this.node.children;
        var len = fishArray.length;
        for (var i = 0; i < len; ++i) {
            var fish = fishArray[i];
            if (fish.getComponent("F_CSBY_Fish").valid && fish.getComponent("F_CSBY_Fish").fishKind == FishKind.OrganCannon && type == 2) {
                //fish.getChildByName("fishSprite").active = false;
                fish.getChildByName("light").color = cc.color(255, 255, 255);
                fish.getChildByName("icon").color = cc.color(255, 255, 255);
                fish.getChildByName("light").active = false;
                fish.getChildByName("icon").active = false;
                fish.getChildByName("SS_Symbol_Freeze").active = true;
                (fish.getChildByName("SS_Symbol_Freeze").getComponent(cc.Animation) as cc.Animation).play("SS_Symbol_Freeze", 0)
                fish.getChildByName("unicon").active = true;
            }
            if (fish.getComponent("F_CSBY_Fish").valid && fish.getComponent("F_CSBY_Fish").fishKind == FishKind.DrillCannon) {
                //fish.getChildByName("fishSprite").active = false;
                fish.getChildByName("light").color = cc.color(255, 255, 255);
                fish.getChildByName("icon").color = cc.color(255, 255, 255);
                fish.getChildByName("light").active = false;
                fish.getChildByName("icon").active = false;
                fish.getChildByName("SS_Symbol_Freeze").active = true;
                (fish.getChildByName("SS_Symbol_Freeze").getComponent(cc.Animation) as cc.Animation).play("SS_Symbol_Freeze", 0)
                fish.getChildByName("unicon").active = true;
            }
        }
    }
    //定屏
    onFixScreen() {
        var fishArray = this.node.children;

        var len = fishArray.length;
        for (var i = 0; i < len; ++i) {
            var fish = fishArray[i];
            /*var moveAction = fish.getActionByTag(FishMoveTag);错误动画的暂停
            if (moveAction) {
                moveAction.pause();
            }*/
            fish.stopAllActions();
        }
        //SoundManager.getInstance().playFx("zhongyitang");
    }
    //取消定屏
    cancelFixScreen() {
        var fishArray = this.node.children;

        var len = fishArray.length;
        for (var i = 0; i < len; ++i) {
            var fish = fishArray[i];
            var moveAction = fish.getActionByTag(FishMoveTag);
            if (moveAction) {
                fish.runAction(moveAction);
            }
        }
        DataVO.GD.mainScene.effectLayer.cancelFixScreen()
    }
    /**
     * 开始鱼阵
     * @param data
     */
    startFishArray(data) {
        console.log("startFishArraystartFishArraystartFishArraystartFishArray")
        console.log(data)
        var fishArrayKind = data.fishArrayKind;
        var randseek = data.randseek;
        var fishData = data.fishData;

        //为null， 可能是走普通渠道发鱼下来
        if (fishData != null) {
            Util.srand(randseek);         //设置随机种子
            var funcName = "loadFishArray" + (fishArrayKind);
            if (typeof this[funcName] == "function") {
                this[funcName](fishData);
            }
        }
    }
    /**
    * 载入鱼阵2-
    * @param data
    */
    loadFishArray2(fishDataArray) {
        var len = fishDataArray.length;
        //len = 1;

        for (let i = 0; i < len; ++i) {

            var fishData = fishDataArray[i];

            if (fishData.invalid) {
                continue;
            }
            let fish: cc.Node = this.activeFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex
            });


            //前两百条是小鱼， 100条从上方游进来， 100条从下方游进来， 在界面中停留一下， 再游出去
            if (i < 80) {
                var x, ys, yd, ye;      //x轴点， 起点， 停留点， 终点
                x = (i % 40) / 40 * V.w + 10;
                var rnd = (Util.random() / Util.RandMax) * 50;

                //
                if (i < 40) {
                    ys = -65 - rnd;
                    yd = 174 + (Util.random() / Util.RandMax) * 30 - 15;
                    ye = V.h + 65;
                }
                else {
                    ys = V.h + 65 + rnd;
                    yd = 584 + (Util.random() / Util.RandMax) * 30 - 15;
                    ye = -65;
                }

                var speed = ((Util.random() / Util.RandMax) * 2.0 + 2.0) * 30;         //速度在鱼阵中是另外算的
                var dt1 = Math.abs((yd - ys) / speed);
                var dt2 = 1050 / 30;
                var dt3 = Math.abs((ye - yd) / speed);


                var action = cc.sequence(cc.place(x, ys), cc.moveTo(dt1, x, yd), cc.delayTime(dt2), cc.moveTo(dt3, x, ye));
                fish.getComponent("F_CSBY_Fish").runMoveAction(action);

            }
            else {
                var st = cc.v2(), ed = cc.v2();
                if (i % 2) {
                    st.x = -250;
                    ed.x = V.w + 250;
                    st.y = ed.y = 484;
                }
                else {
                    st.x = V.w + 250;
                    ed.x = -250;
                    st.y = ed.y = 284;
                }
                var speed = 3 * 30;         //速度在鱼阵中是另外算的
                var delayTime = (((i - 80) / 2) * 150 + 100) / 30;
                var dt = Math.abs((ed.x - st.x) / speed);
                var action = cc.sequence(cc.delayTime(delayTime), cc.place(st), cc.moveTo(dt, ed));
                fish.getComponent("F_CSBY_Fish").runMoveAction(action);
            }

            if (fishData.delayTime < 0) {
                fish.getComponent("F_CSBY_Fish").setPastTime(-fishData.delayTime);
            }
        }
    }

    /**
     * 载入鱼阵3
     * @param data
     */
    loadFishArray3(fishDataArray) {

        var len = fishDataArray.length;
        //len = 1;

        var direction = Util.random() % 2 != 0;
        for (var i = 0; i < len; ++i) {

            var fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
            }
            var fish = this.activeFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex
            });

            var st = cc.v2(), ed = cc.v2();
            if (i < 12) {
                st.y = V.h / 2;
                ed.y = Util.random() % (V.h);

                if (direction) {
                    st.x = V.w + 280;
                    ed.x = -280;
                }
                else {
                    st.x = -280;
                    ed.x = V.w + 280;
                }

                var speed = 3 * 30;         //速度在鱼阵中是另外算的
                var delayTime = (i * 50) / 25;

                var dt = st.sub(ed).mag() / speed;
                var action = cc.sequence(cc.delayTime(delayTime), cc.place(st), cc.moveTo(dt, ed));
                fish.getComponent("F_CSBY_Fish").runMoveAction(action);
            }
            else {
                st.x = ed.x = Util.random() % V.w;

                if (i - 12 < 100) {
                    st.y = -65;
                    ed.y = V.h + 65;
                }
                else {
                    st.y = V.h + 65;
                    ed.y = -65;
                }

                var speed = 3 * 30;         //速度在鱼阵中是另外算的
                var delayTime = (Util.random() % 1300) / 40;
                var dt = st.sub(ed).mag() / speed;
                var action = cc.sequence(cc.delayTime(delayTime), cc.place(st), cc.moveTo(dt, ed));
                fish.getComponent("F_CSBY_Fish").runMoveAction(action);
            }
            if (fishData.delayTime < 0) {
                fish.getComponent("F_CSBY_Fish").setPastTime(-fishData.delayTime);
            }
        }
    }
    /**
    * 载入鱼阵4
    * @param data
    */
    loadFishArray4(fishDataArray) {

        var len = fishDataArray.length;

        var radius = (V.h - 180) / 2;
        var speed = 1.5 * 30;//速度在鱼阵中是另外算的

        var center = cc.v2(V.w + radius, radius + 80);

        var actions = [];

        //{x: x + radius * Math.sin(i * cellRadian), y: y + radius * Math.cos(i * cellRadian)}
        var st = cc.v2(), ed = cc.v2();
        var cellRadian = Math.PI * 2 / 39;
        center.x = -radius;
        for (var i = 0; i < 39; ++i) {

            st.x = Math.sin(i * cellRadian) * radius + center.x;
            st.y = Math.cos(i * cellRadian) * radius + center.y;

            ed.x = V.w + 2 * radius;
            ed.y = st.y;

            var dt = st.sub(ed).mag() / speed;
            var action = cc.sequence(cc.place(st), cc.moveTo(dt, ed));
            actions.push(action);
        }

        cellRadian = Math.PI * 2 / 19;
        for (var i = 0; i < 19; ++i) {

            st.x = Math.sin(i * cellRadian) * radius * 0.75 + center.x;
            st.y = Math.cos(i * cellRadian) * radius * 0.75 + center.y;

            ed.x = V.w + 2 * radius;
            ed.y = st.y;

            var dt = st.sub(ed).mag() / speed;
            var action = cc.sequence(cc.place(st), cc.moveTo(dt, ed));
            actions.push(action);
        }

        center.x = V.w + radius;
        cellRadian = Math.PI * 2 / 39;
        for (var i = 0; i < 39; ++i) {

            st.x = Math.sin(i * cellRadian) * radius + center.x;
            st.y = Math.cos(i * cellRadian) * radius + center.y;

            ed.x = -2 * radius;
            ed.y = st.y;

            var dt = st.sub(ed).mag() / speed;
            var action = cc.sequence(cc.place(st), cc.moveTo(dt, ed));
            actions.push(action);
        }


        cellRadian = Math.PI * 2 / 19;
        for (var i = 0; i < 19; ++i) {

            st.x = Math.sin(i * cellRadian) * radius * 0.75 + center.x;
            st.y = Math.cos(i * cellRadian) * radius * 0.75 + center.y;

            ed.x = -2 * radius;
            ed.y = st.y;

            var dt = st.sub(ed).mag() / speed;
            var action = cc.sequence(cc.place(st), cc.moveTo(dt, ed));
            actions.push(action);
        }

        //中心的大鱼

        st.x = -radius;
        st.y = center.y;
        ed.x = V.w + 2 * radius;
        ed.y = st.y;
        var dt = st.sub(ed).mag() / speed;
        var action = cc.sequence(cc.place(st), cc.moveTo(dt, ed));
        actions.push(action);

        st.x = center.x;
        st.y = center.y;
        ed.x = -2 * radius;
        ed.y = st.y;
        var dt = st.sub(ed).mag() / speed;
        var action = cc.sequence(cc.place(st), cc.moveTo(dt, ed));
        actions.push(action);

        /////////////////////////////////////////////////////////////////////////////////
        for (let i = 0; i < len; ++i) {
            var fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
            }
            let fish = this.activeFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex
            });
            fish.getComponent("F_CSBY_Fish").runMoveAction(actions[i]);
            if (fishData.delayTime < 0) {
                fish.getComponent("F_CSBY_Fish").setPastTime(-fishData.delayTime);
            }
        }
    }
    /**
     * 载入鱼阵5
     * @param data
     */
    loadFishArray5(fishDataArray) {

        var len = fishDataArray.length;


        var speed = 3 * 30;//速度在鱼阵中是另外算的
        var st = cc.v2(), ed = cc.v2();

        for (let i = 0; i < len; ++i) {
            var fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
            }
            let fish = this.activeFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex
            });


            if (i < 100 + 98 + 99) {

                var x, y;
                while (true) {
                    x = (Util.random() / Util.RandMax) * 2 - 1;
                    y = (Util.random() / Util.RandMax) * 2 - 1;
                    if (x * x + y * y <= 1) {
                        break;
                    }
                }
                var radius = 230, r = 2;
                x = radius * x * r;
                y = radius * y;

                var extraX = radius * r + 50;
                st.x = x - extraX;
                ed.x = x + V.w + extraX;
                st.y = ed.y = y + 384;
                if (i >= 100) {
                    st.x -= 950;
                    if (i >= 100 + 98) {
                        st.x -= 950;
                    }
                }
            }
            else {
                st.x = -3400;
                ed.x = V.w + 250;
                st.y = ed.y = 384;
            }

            var dt = st.sub(ed).mag() / speed;

            var action = cc.sequence(cc.place(st), cc.moveTo(dt, ed));

            fish.getComponent("F_CSBY_Fish").runMoveAction(action);
            if (fishData.delayTime < 0) {
                fish.getComponent("F_CSBY_Fish").setPastTime(-fishData.delayTime);
            }
        }

    }
    /**
    * 载入鱼阵6
    * @param data
    */
    loadFishArray6(fishDataArray) {

        var len = fishDataArray.length;

        var a0 = 900, b0 = 300;
        var a1 = 500, b1 = 130;
        var kk = 1;
        var speed = 1.6 * 30;

        ////////////////////////////////////////////////////////////////////
        var st = cc.v2(), ed = cc.v2();

        var bigArray = [cc.v2(-400 + 100, 0), cc.v2(-200 + 100, -120), cc.v2(-200 + 100, 120), cc.v2(0 + 100, -240), cc.v2(100, 240), cc.v2(300, 0)];

        for (let i = 0; i < len; ++i) {
            var fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
            }
            var fish = this.activeFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex
            });

            var x, y;
            if (i < 135) {
                while (true) {
                    x = Util.random() / Util.RandMax * a0;
                    y = Util.random() / Util.RandMax * b0 * 2 - b0;
                    if (x * x / (a0 * a0) + y * y / (b0 * b0) < 1 && x * x / (a1 * a1) + y * y / (b1 * b1) > 1 && y < kk * x && y > -kk * x)
                        break;
                }
            }
            else {

                x = bigArray[i - 135].x;
                y = bigArray[i - 135].y;
            }

            st.x = x + 1900;
            ed.x = x - 1000;
            st.y = ed.y = y + 384;


            var dt = st.sub(ed).mag() / speed;
            var action = cc.sequence(cc.place(st), cc.moveTo(dt, ed));
            cc.log(fish)
            fish.getComponent("F_CSBY_Fish").runMoveAction(action);
            if (fishData.delayTime < 0) {
                fish.getComponent("F_CSBY_Fish").setPastTime(-fishData.delayTime);
            }
        }
    }
    /**
    * 载入鱼阵7-
    * @param data
    */
    loadFishArray7(fishDataArray) {
        cc.log("loadFishArray7loadFishArray7loadFishArray7")
        cc.log(fishDataArray)
        cc.log(fishDataArray.length)
        var len = fishDataArray.length;

        var startAngle = 135;

        var center = cc.v2(V.w / 2, V.h / 2);
        var actions = [];
        var oneRingTime = 10;           //转一圈所需要的时间
        var circleNum = 1;
        var lineSpeed = 80;

        var split = [60, 60, 34, 23];
        //var radius = [350, 290, 230, 170];
        var radius = [0, 0, 0, 0];
        var delayAngle = 0;                        //

        for (var i = 0; i < split.length; ++i) {

            delayAngle += 90;
            for (var j = 0; j < split[i]; ++j) {
                var action = cc.sequence(cc.hide(), cc.delayTime(oneRingTime / split[i] * (j)), cc.show(),
                    cc.repeat(new FishRotationAt(oneRingTime, center, radius[i], startAngle, true, 360), circleNum),
                    new FishRotationAt(oneRingTime * (1 - (j) / split[i]) + (delayAngle / 360) * oneRingTime, center, radius[i], startAngle, true, delayAngle + 360 * (1 - (j) / split[i]))
                    //cc.delayTime(100)
                );

                //计算最终旋转完后 停下的位置
                var angle = (startAngle + 360 * (1 - (j) / split[i])) + delayAngle;
                var radian = angle / 180 * Math.PI;//转换成弧度

                var stopPos = cc.v2(radius[i] * Math.sin(radian) + center.x, radius[i] * Math.cos(radian) + center.y);

                var outScreenPos = Util.getTargetPoint(Math.PI * 3 - radian, stopPos);

                var dt = stopPos.sub(outScreenPos).mag() / lineSpeed + 0.01;
                //cc.log(dt + "\t" + JSON.stringify(outScreenPos))
                action = cc.sequence(action, cc.moveTo(dt, outScreenPos));

                actions.push(action);
            }
        }


        //// 金海豚。
        {
            var action = cc.sequence(cc.place(center), cc.rotateTo(0, startAngle - 135), cc.repeat(cc.rotateBy(oneRingTime * 2, 360 * 2), circleNum));


            var radian = (startAngle - 135 - 90) / 180 * Math.PI;//转换成弧度
            var outScreenPos = Util.getTargetPoint(Math.PI * 3 - radian, stopPos);

            var dt = stopPos.sub(outScreenPos).mag() / lineSpeed;
            action = cc.sequence(action, cc.moveTo(dt, outScreenPos));
            actions.push(action);
        }


        for (var i = 0; i < len; ++i) {
            var fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
                //cc.pool.
            }
            var fish = this.activeFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex
            });
            fish.getComponent("F_CSBY_Fish").runMoveAction(actions[i]);


            if (fishData.delayTime < 0) {
                fish.getComponent("F_CSBY_Fish").setPastTime(-fishData.delayTime);
            }
        }
    }
    /**
    * 载入鱼阵8
    * @param data
    */
    loadFishArray8(fishDataArray) {

        var len = fishDataArray.length;

        var actions = [];

        var sectionNum = 6;

        var split = [6, 90, 114, 90];

        var tAngle = Math.PI / 3;//60度
        var center = cc.v2(V.w / 2, V.h / 2);
        var speed = 120;
        var delayTime = 5;
        var st = cc.v2(V.w / 2, V.h / 2), ed;
        for (let i = 0; i < split.length; ++i) {
            var tt = split[i] / sectionNum;
            for (var j = 0; j < split[i]; ++j) {


                var k = Math.floor(j / tt % sectionNum);
                ed = Util.getTargetPoint(tAngle * k + Util.random() / Util.RandMax * Math.PI / 6, center);

                var dt = st.sub(ed).mag() / speed;

                var action = cc.sequence(cc.hide(), cc.delayTime(delayTime * i + Util.random() / Util.RandMax * Math.min(2.5, split[i] / sectionNum)), cc.place(st), cc.show(), cc.moveTo(dt, ed));

                actions.push(action);
            }
        }


        for (var i = 0; i < len; ++i) {
            var fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
            }
            var fish = this.activeFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex
            });

            fish.getComponent("F_CSBY_Fish").runMoveAction(actions[i]);


            if (fishData.delayTime < 0) {
                fish.getComponent("F_CSBY_Fish").setPastTime(-fishData.delayTime);
            }
        }
    }
    /**
     * 载入鱼阵9
     * @param data
     */
    loadFishArray9(fishDataArray) {

        var len = fishDataArray.length;

        var actions = [];


        var split = [27, 8, 64, 1];
        var fishInitPos = [];

        var speed = 90;


        //蓝斑鱼的起始位置
        fishInitPos[0] = [
            cc.v2(100, V.h / 2 - 130),
            cc.v2(100, V.h / 2 - 50),
            cc.v2(100, V.h / 2 + 50),
            cc.v2(100, V.h / 2 + 130),
            cc.v2(1130, V.h / 2 + 100),
            cc.v2(1130, V.h / 2),
            cc.v2(1130, V.h / 2 - 100),
        ];
        for (let i = 0; i < 10; ++i) {
            fishInitPos[0].push(cc.v2(180 + i * 105, V.h / 2 - 200));
            fishInitPos[0].push(cc.v2(180 + i * 105, V.h / 2 + 200));
        }
        ///////////////////////////////////////////////////////////////////////
        //蓝蝴蝶
        fishInitPos[1] = [
            cc.v2(225, V.h / 2),
            cc.v2(375, V.h / 2),
            cc.v2(300, V.h / 2 - 50),
            cc.v2(300, V.h / 2 + 50),
        ];
        for (var i = 0; i < 4; ++i) {
            fishInitPos[1][i + 4] = cc.v2(fishInitPos[1][i].x + 600, fishInitPos[1][i].y);
        }
        ///////////////////////////////////////////////////////////////
        //粉红色小鱼

        fishInitPos[2] = [];
        for (var i = 0; i < 16; ++i) {
            fishInitPos[2].push(cc.v2(200 + i * 55, V.h / 2 - 250));
            fishInitPos[2].push(cc.v2(200 + i * 55, V.h / 2 - 150));
            fishInitPos[2].push(cc.v2(200 + i * 55, V.h / 2 + 250));
            fishInitPos[2].push(cc.v2(200 + i * 55, V.h / 2 + 150));
        }
        //////////////////////////////////////////////////////////////////////////
        //金莎
        fishInitPos[3] = [cc.v2(V.w / 2 - 90, V.h / 2)];
        //////////////////////////////////////////////////////////////////////////


        var dir = Util.random() % 2 * 2 - 1;
        for (var i = 0; i < split.length; ++i) {
            for (var j = 0; j < split[i]; ++j) {
                var dis = V.w * 2 * dir;
                var dt = Math.abs(dis / speed);
                //cc.log(fishInitPos[i][j].x + "\t" + fishInitPos[i][j].y);
                actions.push(cc.sequence(cc.place(fishInitPos[i][j].x + V.w * dir, fishInitPos[i][j].y), cc.moveBy(dt, cc.v2(-dis, 0))));
            }
        }


        for (var i = 0; i < len; ++i) {
            var fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
            }
            var fish = this.activeFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex
            });

            fish.getComponent("F_CSBY_Fish").runMoveAction(actions[i]);


            if (fishData.delayTime < 0) {
                fish.getComponent("F_CSBY_Fish").setPastTime(-fishData.delayTime);
            }
        }
    }
    /**
    * 载入鱼阵10
    * @param data
    */
    loadFishArray10(fishDataArray) {

        var len = fishDataArray.length;

        var actions = [];


        var split = [2, 5, 50, 2, 2, 1, 40, 3];
        var fishInitPos = [];

        var speed = 90;

        //宝箱
        fishInitPos.push(cc.v2(50, V.h / 2 - 50));
        fishInitPos.push(cc.v2(150, V.h / 2 - 50));


        //黄鱼
        for (let i = 0; i < 5; ++i) {
            fishInitPos.push(cc.v2(270, V.h / 2 + 120 + 30 * i));
        }

        //粉鱼
        for (let i = 0; i < 20; ++i) {
            fishInitPos.push(cc.v2(220 + 45 * i, V.h / 2 - 110));
        }
        for (let i = 0; i < 5; ++i) {
            fishInitPos.push(cc.v2(220, V.h / 2 - 70 + 40 * i));
            fishInitPos.push(cc.v2(1075, V.h / 2 - 70 + 40 * i));
        }
        for (let i = 0; i < 3; ++i) {
            fishInitPos.push(cc.v2(270 + 50 * i, V.h / 2 + 90));
            fishInitPos.push(cc.v2(1025 - 50 * i, V.h / 2 + 90));
        }

        //斜着
        for (let i = 0; i < 3; ++i) {
            fishInitPos.push(cc.v2(420 + 20 * i, V.h / 2 + 90 + 30 * i));
            fishInitPos.push(cc.v2(875 - 20 * i, V.h / 2 + 90 + 30 * i));
        }
        for (let i = 0; i < 8; ++i) {
            fishInitPos.push(cc.v2(480 + 45 * i, V.h / 2 + 180));
        }
        //////////////////////////////////////////////////////////////////////
        //乌龟
        fishInitPos.push(cc.v2(V.w / 2 - 300, V.h / 2));
        fishInitPos.push(cc.v2(V.w / 2 + 250, V.h / 2));
        //////////////////////////////////////////////////////////////////////////
        //灯笼
        fishInitPos.push(cc.v2(V.w - 180, V.h / 2 - 50));
        fishInitPos.push(cc.v2(V.w - 180, V.h / 2 + 50));
        //金沙
        fishInitPos.push(cc.v2(V.w / 2 - 50, V.h / 2));

        //绿小鱼
        for (var i = 0; i < 20; ++i) {
            fishInitPos.push(cc.v2(V.w / 2 - 320 + (Util.random() / Util.RandMax) * 100 - 50, V.h / 2 - 200 + (Util.random() / Util.RandMax) * 100 - 50));
            fishInitPos.push(cc.v2(V.w / 2 + 200 + (Util.random() / Util.RandMax) * 100 - 50, V.h / 2 - 200 + (Util.random() / Util.RandMax) * 100 - 50));
        }

        //海马
        for (var i = 0; i < 3; ++i) {
            fishInitPos.push(cc.v2(V.w / 2 - 160 + 125 * i, V.h / 2 + 100));
        }
        //////////////////////////////////////////////////////////////////////////
        //var dir = ttutil.random() % 2 * 2 - 1;
        var dir = 1;//前后没有对称， 不能直接这样子， 所以， 先算了
        for (var i = 0; i < len; ++i) {

            fishInitPos[i].x -= V.w * dir;
            var dis = V.w * 2 * dir;
            var action = cc.place(fishInitPos[i]);

            actions.push(cc.sequence(action, cc.moveBy(Math.abs(dis / speed), cc.v2(dis, 0))));
        }


        for (var i = 0; i < len; ++i) {
            var fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
            }
            var fish = this.activeFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex,
                fishInChest: fishData.fishInChest,
            });


            fish.getComponent("F_CSBY_Fish").runMoveAction(actions[i]);


            if (fishData.delayTime < 0) {
                fish.getComponent("F_CSBY_Fish").setPastTime(-fishData.delayTime);
            }
        }
    }

    /**
     * 载入鱼阵11
     * @param data
     */
    loadFishArray11(fishDataArray) {

        var len = fishDataArray.length;

        var actions = [];

        var fishInitPos = [];

        var speed = 90;


        var radius = V.h / 2;
        //绿色小鱼
        for (var i = 0; i < 3; ++i) {
            for (var j = 0; j < 20; ++j) {

                fishInitPos.push(cc.v2(Math.sin((35 + j * 5.5) / 180 * Math.PI) * radius + V.w / 2 + 55 * i + 30, Math.cos((35 + j * 5.5) / 180 * Math.PI) * radius + V.h / 2));

                fishInitPos.push(cc.v2(Math.sin((35 + 180 + j * 5.5) / 180 * Math.PI) * radius + V.w / 2 - 55 * i - 30, Math.cos((35 + 180 + j * 5.5) / 180 * Math.PI) * radius + V.h / 2));
            }
        }

        //粉色小鱼, 黄色小鱼
        var offset = 22;
        var dy = 55;
        var dx = 65;
        var allOffsetX = -20;
        for (var k = 0; k < 2; ++k) {
            for (var i = 0; i < 2; ++i) {
                fishInitPos.push(cc.v2(V.w / 2 + offset * k + allOffsetX, V.h / 2 + dy * 5 * (1 - i * 2) - offset * k));
            }
            for (var i = 0; i < 7; ++i) {
                fishInitPos.push(cc.v2(V.w / 2 - 150 + dx * i + offset * k + allOffsetX, V.h / 2 + dy * 4 - offset * k));
                fishInitPos.push(cc.v2(V.w / 2 - 150 + dx * i + offset * k + allOffsetX, V.h / 2 - dy * 4 - offset * k));
            }

            for (var i = 0; i < 9; ++i) {
                fishInitPos.push(cc.v2(V.w / 2 - 200 + dx * i + offset * k + allOffsetX, V.h / 2 + dy * 3 - offset * k));
                fishInitPos.push(cc.v2(V.w / 2 - 200 + dx * i + offset * k + allOffsetX, V.h / 2 - dy * 3 - offset * k));
            }
            for (var i = 0; i < 9; ++i) {
                if (i == 4)
                    continue;
                fishInitPos.push(cc.v2(V.w / 2 - 200 + dx * i + offset * k + allOffsetX, V.h / 2 + dy * 2 - offset * k));
                fishInitPos.push(cc.v2(V.w / 2 - 200 + dx * i + offset * k + allOffsetX, V.h / 2 - dy * 2 - offset * k));
            }
            for (var i = 0; i < 9; ++i) {
                if (i == 4 || i == 3 || i == 5)
                    continue;
                fishInitPos.push(cc.v2(V.w / 2 - 200 + dx * i + offset * k + allOffsetX, V.h / 2 + dy - offset * k));
                fishInitPos.push(cc.v2(V.w / 2 - 200 + dx * i + offset * k + allOffsetX, V.h / 2 - dy - offset * k));
            }
            for (var i = 0; i < 11; ++i) {
                if (i >= 3 && i <= 7) {
                    continue;
                }
                fishInitPos.push(cc.v2(V.w / 2 - 300 + dx * i + offset * k + allOffsetX, V.h / 2 - offset * k));
            }
        }
        ///////////////
        //乌龟王子， 灯笼皇后
        fishInitPos.push(cc.v2(V.w / 2 + 25, V.h / 2 + 50));
        fishInitPos.push(cc.v2(V.w / 2 + 25, V.h / 2 - 50));


        //////////////////////////////////////////////////////////////////////////

        var dir = Util.random() % 2 * 2 - 1;

        for (var i = 0; i < len; ++i) {

            fishInitPos[i].x += V.w * dir;
            var dis = -V.w * 2 * dir;
            var action = cc.place(fishInitPos[i]);

            actions.push(cc.sequence(action, cc.moveBy(Math.abs(dis / speed), cc.v2(dis, 0))));
        }


        for (var i = 0; i < len; ++i) {
            var fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
            }
            var fish = this.activeFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex,
            });


            fish.getComponent("F_CSBY_Fish").runMoveAction(actions[i]);


            if (fishData.delayTime < 0) {
                fish.getComponent("F_CSBY_Fish").setPastTime(-fishData.delayTime);
            }
        }
    }
    /**
     * 载入鱼阵12
     * @param data
     */
    loadFishArray12(fishDataArray) {

        var len = fishDataArray.length;

        var radius = (V.h - 240) / 2;
        var speed = 45;
        var center = cc.v2(V.w + radius, radius + 120);
        var actions = [];

        var tlen = 100;
        var st = cc.v2(), ed = cc.v2();
        var dt;
        for (var i = 0; i < tlen; ++i) {

            st.x = radius * Math.cos(i / tlen * Math.PI * 2) + center.x;
            st.y = radius * Math.sin(i / tlen * Math.PI * 2) + center.y;
            ed.x = -2 * radius;
            ed.y = st.y;

            dt = st.sub(ed).mag() / speed;
            actions.push(cc.sequence(cc.place(st), cc.moveTo(dt, ed)));
        }

        var rotateRadian1 = 45 * Math.PI / 180;
        var rotateRadian2 = 135 * Math.PI / 180;
        var radiusSmall = radius;
        var radiusSmall1 = radius / 3;

        var centerSmall = [cc.v2(), cc.v2(), cc.v2(), cc.v2()];

        centerSmall[0].x = center.x + radiusSmall * Math.cos(-rotateRadian2);
        centerSmall[0].y = center.y + radiusSmall * Math.sin(-rotateRadian2);
        centerSmall[1].x = center.x + radiusSmall * Math.cos(-rotateRadian1);
        centerSmall[1].y = center.y + radiusSmall * Math.sin(-rotateRadian1);
        centerSmall[2].x = center.x + radiusSmall * Math.cos(rotateRadian2);
        centerSmall[2].y = center.y + radiusSmall * Math.sin(rotateRadian2);
        centerSmall[3].x = center.x + radiusSmall * Math.cos(rotateRadian1);
        centerSmall[3].y = center.y + radiusSmall * Math.sin(rotateRadian1);


        var ttlen = [17, 17, 30, 30];
        for (var k = 0; k < centerSmall.length; ++k) {
            tlen = ttlen[k];
            for (var i = 0; i < tlen; ++i) {
                st.x = radiusSmall1 * Math.cos(i / tlen * Math.PI * 2) + centerSmall[k].x;
                st.y = radiusSmall1 * Math.sin(i / tlen * Math.PI * 2) + centerSmall[k].y;
                ed.x = -2 * radius;
                ed.y = st.y;
                dt = st.sub(ed).mag() / speed;
                actions.push(cc.sequence(cc.place(st), cc.moveTo(dt, ed)));
            }
        }

        tlen = 15;
        for (var i = 0; i < tlen; ++i) {
            st.x = radiusSmall / 2 * Math.cos(i / tlen * Math.PI * 2) + center.x;
            st.y = radiusSmall / 2 * Math.sin(i / tlen * Math.PI * 2) + center.y;
            ed.x = -2 * radius;
            ed.y = st.y;
            dt = st.sub(ed).mag() / speed;
            actions.push(cc.sequence(cc.place(st), cc.moveTo(dt, ed)));
        }

        for (var i = 0; i < 4; ++i) {
            st.x = centerSmall[i].x;
            st.y = centerSmall[i].y;
            ed.x = -2 * radius;
            ed.y = st.y;

            dt = st.sub(ed).mag() / speed;
            actions.push(cc.sequence(cc.place(st), cc.moveTo(dt, ed)));
        }

        st.x = center.x;
        st.y = center.y;
        ed.x = -2 * radius;
        ed.y = st.y;

        dt = st.sub(ed).mag() / speed;
        actions.push(cc.sequence(cc.place(st), cc.moveTo(dt, ed)));

        for (var i = 0; i < len; ++i) {
            var fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
            }
            let fish = this.activeFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex,
            });
            cc.log(fish);
            fish.getComponent("F_CSBY_Fish").runMoveAction(actions[i]);
            if (fishData.delayTime < 0) {
                fish.getComponent("F_CSBY_Fish").setPastTime(-fishData.delayTime);
            }
        }
    }
    /**
   * 载入鱼阵13
   * @param data
   */
    loadFishArray13(fishDataArray) {

        var len = fishDataArray.length;

        var radius = (V.h - 240) / 2;
        var speed = 45;
        var center = cc.v2(V.w + radius, V.h / 2);
        var actions = [];


        var st = cc.v2(), ed = cc.v2();


        var centerXArray = [-radius, V.w + radius];
        var edXArray = [V.w + 2 * radius, -2 * radius];
        for (var kk = 0; kk < 2; ++kk) {

            //方向
            var dir = kk * 2 - 1;

            center.x = centerXArray[kk];

            var split = [50, 40, 30];
            var radiuses = [radius, radius * 40 / 50, radius * 30 / 50];
            var centers = [center, cc.v2(center.x + dir * radius / 5, center.y), cc.v2(center.x + dir * radius * 2 / 5, center.y)];
            for (var i = 0; i < split.length; ++i) {

                var tlen = split[i];
                for (var j = 0; j < tlen; ++j) {
                    st.x = radiuses[i] * Math.cos(j / tlen * Math.PI * 2) + centers[i].x;
                    st.y = radiuses[i] * Math.sin(j / tlen * Math.PI * 2) + centers[i].y;

                    ed.x = edXArray[kk];
                    ed.y = st.y;

                    actions.push(cc.sequence(cc.place(st), cc.moveTo(st.sub(ed).mag() / speed, ed)));
                }
            }

            var stY = [center.y - radius, center.y + radius, center.y];
            for (var i = 0; i < 3; ++i) {
                st.x = center.x;
                if (i == 2) {
                    st.x += dir * radius * 2 / 5;
                }
                st.y = stY[i];
                ed.x = edXArray[kk];
                ed.y = st.y;
                actions.push(cc.sequence(cc.place(st), cc.moveTo(st.sub(ed).mag() / speed, ed)));
            }
        }

        for (var i = 0; i < len; ++i) {
            var fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
            }
            var fish = this.activeFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex,
            });

            fish.getComponent("F_CSBY_Fish").runMoveAction(actions[i]);


            if (fishData.delayTime < 0) {
                fish.getComponent("F_CSBY_Fish").setPastTime(-fishData.delayTime);
            }
        }
    }

    /**
     * 载入鱼阵14
     * @param data
     */
    loadFishArray14(fishDataArray) {

        var len = fishDataArray.length;

        var speed = 90;

        var centers = [cc.v2(V.w / 3, V.h / 3), cc.v2(V.w / 3 * 2, V.h / 3 * 2), cc.v2(V.w / 3, V.h / 3 * 2), cc.v2(V.w / 3 * 2, V.h / 3)];

        var actions = [];
        var st = cc.v2(), ed = cc.v2();

        var delayTime = 3.5;
        for (var i = 0; i < 20; ++i) {


            for (var j = 0; j < 15; ++j) {
                st.x = centers[i % 4].x;
                st.y = centers[i % 4].y;

                ed = Util.getTargetPoint(j / 15 * Math.PI * 2, st);

                actions.push(cc.sequence(cc.delayTime(Math.floor(i / 2) * 3.5), cc.place(st), cc.moveTo(st.sub(ed).mag() / speed, ed)));


            }

        }


        for (var i = 0; i < len; ++i) {
            var fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
            }
            var fish = this.activeFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex,
            });

            fish.getComponent("F_CSBY_Fish").runMoveAction(actions[i]);


            if (fishData.delayTime < 0) {
                fish.getComponent("F_CSBY_Fish").setPastTime(-fishData.delayTime);
            }
        }
    }

    /**
     * 载入鱼阵15
     * @param data
     */
    loadFishArray15(fishDataArray) {

        var len = fishDataArray.length;

        var radius = (V.h - 200) / 2;
        var rotateSpeed = 1.5 * Math.PI / 180;
        var speed = 150;
        var actions = [];

        var center = [cc.v2(), cc.v2()];

        center[0].x = V.w - V.w / 4;
        center[0].y = radius + 100;
        center[1].x = V.w / 4;
        center[1].y = radius + 100;

        var radiusArray = [radius, radius - 34.5, radius - 34.5 - 58, radius - 34.5 - 58 - 68, 1];
        var split = [40, 40, 24, 13, 1];

        var oneRingTime = 10;
        var dt = 2;
        var ringNum = 2;
        var type = Util.random() % 2;
        for (var i = 0; i < radiusArray.length; ++i) {

            for (var k = 0; k < 2; ++k) {
                var tlen = split[i];
                for (var j = 0; j < tlen; ++j) {
                    /************************************************************************/
                    /* 时间， 圆心， 半径， 起始角度， 顺或逆， 旋转角度， 360度， 则为一个圆，                 */
                    //如果起始角度为0， 则起点在圆心的正上方，
                    /************************************************************************/
                    //static FishRotationAt* create(float duration, const cocos2d::Vec2& center, float radius, float startAngle, bool clockwise = true, float deltaAngle = 360);

                    var fishRotationAt = new FishRotationAt(oneRingTime * (ringNum + i * 0.2), center[k], radiusArray[i], j / tlen * 360, (k + i) % 2 == 0, 360 * (ringNum + i * 0.2));


                    var radian = (j / tlen + i * 0.2) * 2 * Math.PI + (k + i) % 2 * (Math.PI / 2);
                    var st = cc.v2();
                    if ((k + i) % 2 == 0) {
                        st.x = radiusArray[i] * Math.sin(radian) + center[k].x;
                        st.y = radiusArray[i] * Math.cos(radian) + center[k].y;
                    }
                    else {
                        st.x = radiusArray[i] * Math.cos(radian) + center[k].x;
                        st.y = radiusArray[i] * Math.sin(radian) + center[k].y;
                    }

                    if ((k + i) % 2 == 0) {
                        radian = (1 - (j / tlen + i * 0.2 + 0.5)) * 2 * Math.PI;
                        if (type == 1) {
                            radian = Math.PI;
                        }
                        //
                    }
                    else {
                        radian = (j / tlen + i * 0.2) * 2 * Math.PI;
                        if (type == 1) {
                            radian = 0;
                        }
                        //radian = 0;
                    }

                    var ed = Util.getTargetPoint(radian, st);

                    var moveto = cc.moveTo(st.sub(ed).mag() / speed, ed);
                    actions.push(cc.sequence(fishRotationAt, moveto));


                }
            }


        }

        for (var i = 0; i < len; ++i) {
            var fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
            }
            var fish = this.activeFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex,
            });

            fish.getComponent("F_CSBY_Fish").runMoveAction(actions[i]);


            if (fishData.delayTime < 0) {
                fish.getComponent("F_CSBY_Fish").setPastTime(-fishData.delayTime);
            }
        }
    }

    /**
    * 载入鱼阵16
    * @param data
    */
    loadFishArray17(fishDataArray) {
        console.log("loadFishArray17loadFishArray17loadFishArray17loadFishArray17loadFishArray17loadFishArray17")
        console.log('我的位置    ' + DataVO.GD.meChairID + " |||||| " + DataVO.GD.offsetSize)

        var len = fishDataArray.length;
        var x0 = DataVO.GD.offsetSize - DataVO.GD.offsetSize;
        var xm = V.w - DataVO.GD.offsetSize - DataVO.GD.offsetSize;
        if (DataVO.GD.isRotation) {
            x0 = DataVO.GD.offsetSize;
            xm = V.w - DataVO.GD.offsetSize;
        }
        var w = V.w - DataVO.GD.offsetSize * 2;
        let pos = [[cc.v2(x0 - 100, V.h + 100), cc.v2(w * 0.195 + x0 + 1, V.h * 0.78), cc.v2(w * 0.195 + x0, V.h * 0.22), cc.v2(x0 - 100, -100)],
        [cc.v2(w * 0.30 + x0, V.h + 150), cc.v2(w * 0.70 + x0, -150)],
        [cc.v2(w * 0.70 + x0, V.h + 150), cc.v2(w * 0.30 + x0, -150)],
        [cc.v2(xm + 100, V.h + 100), cc.v2(w * 0.805 + x0 + 1, V.h * 0.78), cc.v2(w * 0.805 + x0, V.h * 0.22), cc.v2(xm + 100, -100)]]
        let delayTime = 0;
        let speed = 60;
        //for (let i = 0; i < 24; i++) {
        for (let i = 0; i < fishDataArray.length; i++) {
            var fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
            }
            var _delayTime = -2
            if (fishData.delayTime) {
                _delayTime = fishData.delayTime
            }
            let fish: cc.Node = this.activeFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex,
                delayTime: _delayTime,
                fishTraceType: 5
            });
            var action;
            var path = i % 4;
            let fishPath = pos[path];
            if (i < fishDataArray.length - 4) {
                if (path == 0 || path == 3) {
                    var dis = ym.FishCatmullRomTo.calcLength(fishPath[0], fishPath);
                    var dt = dis / speed;
                    var action1 = cc.place(fishPath[0]);
                    var action2 = cc.catmullRomTo(dt, fishPath);
                    action = cc.sequence(action1, action2);
                    /*action = cc.place(fishPath[0]);
                    var preRotate = 0;
                    for (var j = 1; j < fishPath.length; ++j) {
                        var rotate = Util.calcRotation(fishPath[j - 1], fishPath[j]);
                        var dt =  cc.v2(fishPath[j - 1].x,fishPath[j - 1].y).sub(cc.v2(fishPath[j].x,fishPath[j].y)).mag() / speed;
                        var rotateDt = Math.abs((rotate - preRotate) / 360);
                        action = cc.sequence(action, cc.spawn(cc.delayTime(rotateDt), cc.callFunc(function () {
                            var action = cc.rotateTo(rotateDt, rotate);
                            //self.fishSprite.node.runAction(action.clone());
                            //if (GOpenShadow) {
                            //        self.shadowSprite.node.runAction(action.clone());
                            //}
    
                        })), cc.moveTo(dt, fishPath[j]).easing(cc.easeSineOut()));
                        preRotate = rotate;
                    }*/
                    /*action = cc.sequence(cc.place(pos[path][0]),
                     cc.moveTo(pos[path][0].sub(pos[path][1]).mag()/speed, pos[path][1]),
                     cc.moveTo(pos[path][1].sub(pos[path][2]).mag()/speed, pos[path][2]),
                     cc.moveTo(pos[path][2].sub(pos[path][3]).mag()/speed, pos[path][3])
                     );*/
                } else if (path == 1 || path == 2) {
                    action = cc.sequence(cc.place(pos[path][0]),
                        cc.moveTo(pos[path][0].sub(pos[path][1]).mag() / speed, pos[path][1])
                    );
                }
                if (path == 0 && i != 0) {
                    if (i < 24) {
                        delayTime += 1;
                    }
                    if (i == 24) {
                        delayTime += 4;
                    }
                    if (i > 24 && i < 44) {
                        delayTime += 1.7;
                    }
                    if (i == 44) {
                        delayTime += 3;
                    }
                    if (i > 44 && i < 60) {
                        delayTime += 1.5;
                    }
                    if (i == 60) {
                        delayTime += 5;
                    }
                    if (i > 60 && i < 76) {
                        delayTime += 2.5;
                    }
                    if (i == 76) {
                        delayTime += 5;
                    }
                    if (i > 76) {
                        delayTime += 4.5;
                    }
                }
                if (delayTime > 0) {
                    action = cc.sequence(cc.delayTime(delayTime), action);
                }
                fish.getComponent("F_CSBY_Fish").runMoveAction(action);
            } else {
                //新加闪电鱼 
                let delaynew = 2
                let y = V.h * 0.5 + ((i <= 89) ? 120 : -120)
                let x0 = -V.w * 0.5 + ((i == 88 || i == 90) ? -200 : -1200)
                let x1 = V.w + ((i == 88 || i == 90) ? 200 : 1200)
                let v0 = cc.v2(x0, y)
                let v1 = cc.v2(x1, y)
                cc.log('------171717171717-------    ' + i);
                cc.log(v0);
                cc.log(v1);
                action = cc.sequence(cc.place(v0), cc.moveTo(v0.sub(v1).mag() / speed, v1))
                if (delaynew > 0) {
                    action = cc.sequence(cc.delayTime(delaynew), action);
                }
                fish.getComponent("F_CSBY_Fish").runMoveAction(action);
            }
        }
    }

    /**
    * 载入鱼阵18  
    * @param data
    */
    loadFishArray18(fishDataArray) {
        console.log("loadFishArray18loadFishArray18loadFishArray18loadFishArray18loadFishArray18")
        console.log('我的位置    ' + DataVO.GD.meChairID + " |||||| " + DataVO.GD.offsetSize)

        var len = fishDataArray.length;
        var x0 = DataVO.GD.offsetSize - DataVO.GD.offsetSize;
        var xm = V.w - DataVO.GD.offsetSize - DataVO.GD.offsetSize;
        if (DataVO.GD.isRotation) {
            x0 = DataVO.GD.offsetSize;
            xm = V.w - DataVO.GD.offsetSize;
        }
        var w = V.w - DataVO.GD.offsetSize * 2;
        console.log(cc.v2(w * 0.22 + x0 + 1, V.h * 0.62))
        let pos = [[cc.v2(x0 - 100, V.h + 100), cc.v2(w * 0.22 + x0, V.h * 0.66), cc.v2(w * 0.78 + x0, V.h * 0.66), cc.v2(xm + 100, V.h + 100)],
        [cc.v2(xm + 100, V.h + 100), cc.v2(w * 0.78 + x0, V.h * 0.66), cc.v2(w * 0.22 + x0, V.h * 0.66), cc.v2(x0 - 100, V.h + 100)],
        [cc.v2(x0 - 100, -100), cc.v2(w * 0.22 + x0, V.h * 0.34), cc.v2(w * 0.78 + x0, V.h * 0.34), cc.v2(xm + 100, -100)],
        [cc.v2(xm + 100, -100), cc.v2(w * 0.78 + x0, V.h * 0.34), cc.v2(w * 0.22 + x0, V.h * 0.34), cc.v2(x0 - 100, -100)]]
        let delayTime = 0;
        let speed = 60;
        for (let i = 0; i < fishDataArray.length; i++) {
            var fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
            }
            var _delayTime = -2
            if (fishData.delayTime) {
                _delayTime = fishData.delayTime
            }
            let fish: cc.Node = this.activeFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex,
                delayTime: _delayTime,
                fishTraceType: 5
            });
            var action;
            var path = i % 4;
            let fishPath = pos[path];
            if (i < fishDataArray.length - 4) {

                var dis = ym.FishCatmullRomTo.calcLength(fishPath[0], fishPath);
                var dt = dis / speed;
                var action1 = cc.place(fishPath[0]);
                var action2 = cc.catmullRomTo(dt, fishPath);
                action = cc.sequence(action1, action2);

                if (path == 0 && i != 0) {
                    if (i < 24) {
                        delayTime += 0.7;
                    }
                    if (i == 24) {
                        delayTime += 4;
                    }
                    if (i > 24 && i < 44) {
                        delayTime += 2;
                    }
                    if (i == 44) {
                        delayTime += 3;
                    }
                    if (i > 44 && i < 60) {
                        delayTime += 1.5;
                    }
                    if (i == 60) {
                        delayTime += 5;
                    }
                    if (i > 60 && i < 76) {
                        delayTime += 1.5;
                    }
                    if (i == 76) {
                        delayTime += 5;
                    }
                    if (i > 76) {
                        delayTime += 4;
                    }
                }
                if (delayTime > 0) {
                    action = cc.sequence(cc.delayTime(delayTime), action);
                }
                fish.getComponent("F_CSBY_Fish").runMoveAction(action);
            } else {
                //新加闪电鱼 
                let delaynew = 2
                let y = V.h * 0.5 + ((i <= 89) ? 120 : -120)
                let x0 = -V.w * 0.5 + ((i == 88 || i == 90) ? -200 : -1200)
                let x1 = V.w + ((i == 88 || i == 90) ? 200 : 1200)
                let v0 = cc.v2(x0, y)
                let v1 = cc.v2(x1, y)
                cc.log('------18181818181818-------    ' + i);
                cc.log(v0);
                cc.log(v1);
                action = cc.sequence(cc.place(v0), cc.moveTo(v0.sub(v1).mag() / speed, v1))
                if (delaynew > 0) {
                    action = cc.sequence(cc.delayTime(delaynew), action);
                }
                fish.getComponent("F_CSBY_Fish").runMoveAction(action);
            }
        }

    }

    /**
     * 载入鱼阵19 新鱼阵
     * @param data
     */
    loadFishArray19(fishDataArray) {
        console.log("loadFishArray19loadFishArray19loadFishArray19loadFishArray19loadFishArray19loadFishArray19")
        console.log('我的位置    ' + DataVO.GD.meChairID + " |||||| " + DataVO.GD.offsetSize)

        var len = fishDataArray.length;
        var x0 = DataVO.GD.offsetSize - DataVO.GD.offsetSize;
        var xm = V.w - DataVO.GD.offsetSize - DataVO.GD.offsetSize;
        if (DataVO.GD.isRotation) {
            x0 = DataVO.GD.offsetSize;
            xm = V.w - DataVO.GD.offsetSize;
        }
        var w = V.w - DataVO.GD.offsetSize * 2;
        let pos = [[cc.v2(x0 - 100, V.h + 100), cc.v2(xm + 100, -100)],
        [cc.v2(w * 0.25 + x0, V.h + 200), cc.v2(w * 0.75 + x0, -200)],
        [cc.v2(w * 0.75 + x0, V.h + 200), cc.v2(w * 0.25 + x0, -200)],
        [cc.v2(xm + 100, V.h + 100), cc.v2(x0 - 100, -100)]]
        let delayTime = 0;
        let speed = 60;
        for (let i = 0; i < fishDataArray.length; i++) {
            var fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
            }
            var _delayTime = -2
            if (fishData.delayTime) {
                _delayTime = fishData.delayTime
            }
            let fish: cc.Node = this.activeFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex,
                delayTime: _delayTime,
                fishTraceType: 5
            });
            var action;
            var path = i % 4;
            let fishPath = pos[path];

            if (i < fishDataArray.length - 4) {

                action = cc.sequence(cc.place(pos[path][0]),
                    cc.moveTo(pos[path][0].sub(pos[path][1]).mag() / speed, pos[path][1])
                );

                if (path == 0 && i != 0) {
                    if (i < 20) {
                        delayTime += 1.2;
                    }
                    if (i == 20) {
                        delayTime += 4;
                    }
                    if (i > 20 && i < 36) {
                        delayTime += 2;
                    }
                    if (i == 36) {
                        delayTime += 3;
                    }
                    if (i > 36 && i < 52) {
                        delayTime += 2.5;
                    }
                    if (i == 52) {
                        delayTime += 3;
                    }
                    if (i > 52 && i < 68) {
                        delayTime += 3;
                    }
                    if (i == 68) {
                        delayTime += 8;
                    }
                    if (i > 68) {
                        delayTime += 4.5;
                    }
                }
                if (delayTime > 0) {
                    action = cc.sequence(cc.delayTime(delayTime), action);
                }
                fish.getComponent("F_CSBY_Fish").runMoveAction(action);
            } else {
                //新加闪电鱼 
                //新加闪电鱼 
                let delaynew = 1
                let y = V.h * 0.5 + ((i <= 74) ? 120 : -120)
                let x0 = -V.w * 0.5 + ((i == 73 || i == 75) ? 0 : -1000)
                let x1 = V.w + ((i == 73 || i == 75) ? 0 : 1000)
                let v0 = cc.v2(x0, y)
                let v1 = cc.v2(x1, y)
                cc.log('------19191919191919-------    ' + i);
                cc.log(v0);
                cc.log(v1);
                action = cc.sequence(cc.place(v0), cc.moveTo(v0.sub(v1).mag() / speed, v1))
                if (delaynew > 0) {
                    action = cc.sequence(cc.delayTime(delaynew), action);
                }
                fish.getComponent("F_CSBY_Fish").runMoveAction(action);
            }
        }
    }

    /**
     * 载入鱼阵20   新鱼阵
     * @param data
     */
    loadFishArray20(fishDataArray) {
        console.log("loadFishArray20loadFishArray20loadFishArray20loadFishArray20loadFishArray20")
        console.log('我的位置    ' + DataVO.GD.meChairID + " |||||| " + DataVO.GD.offsetSize)

        var len = fishDataArray.length;
        var x0 = DataVO.GD.offsetSize - DataVO.GD.offsetSize;
        var xm = V.w - DataVO.GD.offsetSize - DataVO.GD.offsetSize;
        if (DataVO.GD.isRotation) {
            x0 = DataVO.GD.offsetSize;
            xm = V.w - DataVO.GD.offsetSize;
        }
        var w = V.w - DataVO.GD.offsetSize * 2;
        let pos = [[cc.v2(x0 - 250, V.h + 250), cc.v2(xm + 250, -250)],
        [cc.v2(xm + 250, V.h * 0.25), cc.v2(x0 - 250, V.h * 0.75)],
        [cc.v2(xm + 250, V.h * 0.75), cc.v2(x0 - 250, V.h * 0.25)],
        [cc.v2(x0 - 250, -250), cc.v2(xm + 250, V.h + 250)]]

        let delayTime = 0;
        let speed = 60;
        for (let i = 0; i < fishDataArray.length; i++) {
            console.log(fishData)
            var fishData = fishDataArray[i];
            if (fishData.invalid) {
                continue;
            }
            var _delayTime = -2.8
            if (fishData.delayTime) {
                _delayTime = fishData.delayTime
            }
            let fish: cc.Node = this.activeFish({
                fishKind: fishData.fishKind,
                fishID: fishData.fishID,
                fishIndex: fishData.fishIndex,
                delayTime: _delayTime,
                fishTraceType: 5
            });

            var action;
            var path = i % 4;
            let fishPath = pos[path];
            if (i < fishDataArray.length - 4) {
                action = cc.sequence(cc.place(pos[path][0]),
                    cc.moveTo(pos[path][0].sub(pos[path][1]).mag() / speed, pos[path][1])
                );

                if (path == 0 && i != 0) {
                    if (i < 20) {
                        delayTime += 1.8;
                    }
                    if (i == 20) {
                        delayTime += 3;
                    }
                    if (i > 20 && i < 40) {
                        delayTime += 2;
                    }
                    if (i == 40) {
                        delayTime += 3;
                    }
                    if (i > 40 && i < 60) {
                        delayTime += 1.7;
                    }
                    if (i == 60) {
                        delayTime += 5;
                    }
                    if (i > 60 && i < 80) {
                        delayTime += 1.5;
                    }
                    if (i == 80) {
                        delayTime += 8;
                    }
                    if (i > 80) {
                        delayTime += 4.5;
                    }
                }
                if (delayTime > 0) {
                    action = cc.sequence(cc.delayTime(delayTime), action);
                }
                fish.getComponent("F_CSBY_Fish").runMoveAction(action);
            } else {
                //新加闪电鱼 
                let delaynew = 2
                let y = V.h * 0.5
                let x0 = -V.w * 0.5 - ((i - 84) * 560)
                let x1 = V.w + ((i - 84) * 560)
                let v0 = cc.v2(x0, y)
                let v1 = cc.v2(x1, y)
                cc.log('------181818181818-------    ' + i);
                cc.log(v0);
                cc.log(v1);
                action = cc.sequence(cc.place(v0), cc.moveTo(v0.sub(v1).mag() / speed, v1))
                if (delaynew > 0) {
                    action = cc.sequence(cc.delayTime(delaynew), action);
                }
                fish.getComponent("F_CSBY_Fish").runMoveAction(action);
            }
        }
    }
    /**
    * 处理自增长的鱼
    * @param data
    * @returns {null}
    */
    autoIncrementFish(data) {

        //cc.log(JSON.stringify(data))
        var fishArray = this.node.children;

        for (var i = 0; i < data.length; ++i) {
            var autoInc = data[i];
            for (var j = 0; j < fishArray.length; ++j) {
                var fish = fishArray[j];
                if (fish.getComponent("F_CSBY_Fish").fishID == autoInc.fishID) {
                    // fish.getComponent("F_CSBY_Fish").setMultipleValue(autoInc.multiple);
                    break;
                }
            }
        }

        return null;
    }
    //播放哪个音乐
    playmusic() {
        var fishArray = this.node.children;
        var len = fishArray.length;
        let haveGodAdvent = false;
        for (var i = 0; i < len; ++i) {
            var fish = fishArray[i];
            if (fish.getComponent("F_CSBY_Fish").fishKind == FishKind.GodAdvent) {
                haveGodAdvent = true
                break;
            }
        }
        if (haveGodAdvent) {
            SoundManager.getInstance().playMusic(4001, "subgame");
        } else {
            var bgm = [musicRes.BGM_1, musicRes.BGM_2, musicRes.BGM_3];
            SoundManager.getInstance().playMusic(bgm[DataVO.GD.bgmIndex], "subgame");
        }
    }

    update(dt) {
        if (this.check && !DataVO.GD.bulletMany) {
            this.elapsed += dt
            if (this.elapsed < 0.15 || this.lockFishStatus || DataVO.GD.effectStop) {
                return
            }
            this.elapsed = 0
            var muzzlePos = DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].gun.node.convertToWorldSpaceAR(cc.v2(0, 0));
            var rotation = Util.calcRotation(muzzlePos, this.touchPos) + 90;
            // cc.log("onMouseMoveonMouseMoveonMouseMoveonMouseMove")
            // cc.log(rotation)
            if (rotation < -90 || rotation > 180) {
                rotation = -90
            } else if (rotation > 90 && rotation <= 180) {
                rotation = 90
            }
            DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].setFireAngle(rotation);
        }
    }
}