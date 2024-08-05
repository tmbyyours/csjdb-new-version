//游动动画的tag
export const FishAnimationTag = 123;
//行走动画的tag       
export const FishMoveTag = 124;

import Util from "../../../../extend/Util";
import { GOpenShadow, GFishDieAniDT, GFishDieSound, GFishKindAnimationFN, GShadowFac, musicRes } from "../F_CSBY_Config";
import { FishKind, FishTraceType } from "../SubGameMSG";
import { ym, FishBezierBy } from "../common/FishAction";
import { DataVO } from "../../../../plaza/model/DataVO";
import SoundManager from "../../../../common/managers/SoundManager";
import { EventManager } from "../../../../common/managers/EventManager";
import F_CSBY_GameSceneLayer from "../layer/F_CSBY_GameSceneLayer";
import MPConfig from "../../../../extend/MPConfig";

const { ccclass, property } = cc._decorator;
@ccclass
export default class F_CSBY_Fish extends cc.Component {

    //影子精灵
    @property(cc.Sprite)
    shadowSprite: cc.Sprite = null;
    //鱼本身的精灵
    @property(cc.Sprite)
    fishSprite: cc.Sprite = null;

    fishKind;
    fishID;
    fishIndex;
    //鱼类型
    subFishKind;
    //指定的速度， 不按默认的配置来 
    specifiedSpeed;
    //  路径动作
    routeAction;
    fishTraceType;
    fishPath: cc.Vec2[] = [];
    //是否有效
    valid: boolean = true;
    //是否炸弹鱼                                
    isRedFish: boolean = false;
    delayTime = 0;
    prePos: cc.Vec2;
    //缓存的rect 
    cacheRect;
    //最后一次调用 getRect时， 鱼的位置
    lastCallGetRectingPos: cc.Vec2;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //this.node.setCascadeColorEnabled(true);//随父级颜色值变化
        //this.node.setCascadeOpacityEnabled(true);//随父级透明度变化
        //this.fishSprite.node.anchorX=0.5;//锚点在中间
        //this.fishSprite.node.anchorY=0.5;//锚点在中间
        // this.node.ignoreAnchorPointForPosition(false);//忽略锚点对于位置的设定为false

    }

    upFishSpeed() {
        this.node.stopAllActions();
        if (typeof (this.node.getPosition()) != "undefined" && typeof (this.fishPath[0]) != "undefined") {
            this.prePos = this.node.getPosition();
            this.fishPath[0] = this.node.getPosition();
            this.initEx(false);
        }
    }

    start() {

    }

    reuse(fishKind, subFishKind, fishID, fishIndex, fishTraceType, fishPath, delayTime, specifiedSpeed) {
        cc.log('-------激活鱼reuse------' + fishKind);
        cc.log(fishKind);
        this.fishKind = null;
        this.fishID = null;
        this.fishIndex = null;
        this.routeAction = null;                         //  路径动作
        this.fishTraceType = null;
        this.valid = true;                                //是否有效
        this.delayTime = 0;
        this.cacheRect = null;                        //缓存的rect
        this.lastCallGetRectingPos = null;                    //最后一次调用 getRect时， 鱼的位置
        this.isRedFish = false;
        this.specifiedSpeed = null;
        this.fishSprite && (this.fishSprite.node.color = cc.color(255, 255, 255));
        this.subFishKind = subFishKind;
        this.node.opacity = 255;
        this.node.zIndex = 0;
        this.node.angle = -(0);
        this.fishKind = fishKind;
        this.fishID = fishID;
        this.fishIndex = fishIndex;
        this.fishTraceType = fishTraceType;
        this.fishPath = fishPath;
        this.delayTime = delayTime;
        //cc.log(specifiedSpeed)
        //cc.log(DataVO.GD.fishConfig.fishKindConfigArray[this.fishKind].speed)
        this.specifiedSpeed = specifiedSpeed || DataVO.GD.fishConfig.fishKindConfigArray[this.fishKind].speed;
        if (MPConfig.G_OPEN_DOWNWATER_UPSPEED) {
            this.specifiedSpeed = F_CSBY_GameSceneLayer.seaIsCome ? this.specifiedSpeed * 10 : this.specifiedSpeed;
        }
        this.initEx();
        this.prePos = cc.v2(0, 0);
    }

    onHit() {
        if (this.isRedFish) {
            return;
        }
        if (this.fishKind == FishKind.FishKind20) {//金蟾的特殊处理
            this.fishSprite.node.getChildByName("quan").stopAllActions();
            this.fishSprite.node.getChildByName("quan").runAction(
                cc.sequence(
                    cc.tintTo(0.1, 255, 80, 36),
                    cc.delayTime(0.2),
                    cc.tintTo(0.2, 255, 255, 255)
                )
            )
            this.fishSprite.node.getChildByName("body").stopAllActions();
            this.fishSprite.node.getChildByName("body").runAction(
                cc.sequence(
                    cc.tintTo(0.1, 255, 80, 36),
                    cc.delayTime(0.2),
                    cc.tintTo(0.2, 255, 255, 255)
                )
            )
            this.fishSprite.node.getChildByName("eye").stopAllActions();
            this.fishSprite.node.getChildByName("eye").runAction(
                cc.sequence(
                    cc.tintTo(0.1, 255, 80, 36),
                    cc.delayTime(0.2),
                    cc.tintTo(0.2, 255, 255, 255)
                )
            )
        } else if (this.fishKind == FishKind.DrillCannon || this.fishKind == FishKind.OrganCannon) {//机关炮，钻头炮
            this.fishSprite.node.stopAllActions();
            this.fishSprite.node.runAction(
                cc.sequence(
                    cc.tintTo(0.1, 255, 80, 36),
                    cc.delayTime(0.2),
                    cc.tintTo(0.2, 255, 255, 255)
                )
            )
            this.node.getChildByName("light").stopAllActions();
            this.node.getChildByName("light").runAction(
                cc.sequence(
                    cc.tintTo(0.1, 255, 80, 36),
                    cc.delayTime(0.4),
                    cc.tintTo(0.2, 255, 255, 255)
                )
            )
            this.node.getChildByName("icon").stopAllActions();
            this.node.getChildByName("icon").runAction(
                cc.sequence(
                    cc.tintTo(0.1, 255, 80, 36),
                    cc.delayTime(0.4),
                    cc.tintTo(0.2, 255, 255, 255)
                )
            )
        } else if (this.fishKind == FishKind.JuBaoLianLian || this.fishKind == FishKind.FengBaoFuGui || this.fishKind == FishKind.ShanDianFuGui || this.fishKind == FishKind.BaoZhuZhaoFu) {
            let spr = cc.find('fishSprite', this.node)
            spr.runAction(
                cc.sequence(
                    cc.tintTo(0.1, 255, 80, 36),
                    cc.delayTime(0.2),
                    cc.tintTo(0.2, 255, 255, 255)
                )
            )
        } else {
            this.fishSprite.node.stopAllActions();
            this.fishSprite.node.runAction(
                cc.sequence(
                    cc.tintTo(0.1, 255, 80, 36),
                    cc.delayTime(0.2),
                    cc.tintTo(0.2, 255, 255, 255)
                )
            )
        }
        if (this.fishKind <= 18) {
            if (GOpenShadow) {
                let ani1 = (this.shadowSprite.getComponent(cc.Animation) as cc.Animation).defaultClip;
                (this.shadowSprite.getComponent(cc.Animation) as cc.Animation).getAnimationState(ani1.name).speed = 10;
            }
            let ani = (this.fishSprite.getComponent(cc.Animation) as cc.Animation).defaultClip;
            (this.fishSprite.getComponent(cc.Animation) as cc.Animation).getAnimationState(ani.name).speed = 10;

            this.schedule(function () {
                if (GOpenShadow) {
                    let ani1 = (this.shadowSprite.getComponent(cc.Animation) as cc.Animation).defaultClip;
                    (this.shadowSprite.getComponent(cc.Animation) as cc.Animation).getAnimationState(ani1.name).speed = 1;
                }
                let ani = (this.fishSprite.getComponent(cc.Animation) as cc.Animation).defaultClip;
                (this.fishSprite.getComponent(cc.Animation) as cc.Animation).getAnimationState(ani.name).speed = 1;
            }, 0.05, 0);
        }
    }

    update(dt) {
        if (!this.prePos) {
            return
        }
        var newPos = this.node.getPosition();
        if (newPos.x != this.prePos.x || newPos.y != this.prePos.y) {
            var t = Util.calcRotation(this.prePos, newPos);
            if (this.fishSprite instanceof Array) {
                for (var i = 0; i < this.fishSprite.length; ++i) {
                    this.fishSprite[i].angle = -(t);
                    if (GOpenShadow) {
                        this.shadowSprite[i].angle = -(t);
                    }
                }
            }
            else {
                if (this.fishKind != FishKind.OrganCannon && this.fishKind != FishKind.DrillCannon && this.fishKind != FishKind.CenserBead && this.fishKind != FishKind.LuckRun && this.fishKind != FishKind.GodFafa) {
                    //if(this.fishKind== FishKind.GodAdvent||this.fishKind== FishKind.FishKind10||this.fishKind== FishKind.FishKind13||this.fishKind== FishKind.FishKind19||this.fishKind== FishKind.FishKind8||this.fishKind== FishKind.FishKind17||this.fishKind== FishKind.FishKind9||this.fishKind== FishKind.FishKind11||this.fishKind== FishKind.FishKind12){
                    if (!DataVO.GD.isRotation) {
                        if (Math.abs(t) >= 90) {
                            if (this.fishKind == FishKind.GodAdvent || this.fishKind == FishKind.FishKind9 || this.fishKind == FishKind.FishKind17 || this.fishKind == FishKind.FishKind9 || this.fishKind == FishKind.FishKind8 || this.fishKind == FishKind.FishKind11) {
                                t = 180;
                            }

                            this.fishSprite.node.scaleY = -1;
                            if (GOpenShadow) {
                                this.shadowSprite.node.scaleY = -1;
                            }
                        } else {
                            if (this.fishKind == FishKind.GodAdvent || this.fishKind == FishKind.FishKind9 || this.fishKind == FishKind.FishKind17 || this.fishKind == FishKind.FishKind9 || this.fishKind == FishKind.FishKind8 || this.fishKind == FishKind.FishKind11) {
                                t = 0;
                            }
                            this.fishSprite.node.scaleY = 1;
                            if (GOpenShadow) {
                                this.shadowSprite.node.scaleY = 1;
                            }
                        }
                    } else {
                        if (Math.abs(t) >= 90) {
                            if (this.fishKind == FishKind.GodAdvent || this.fishKind == FishKind.FishKind9 || this.fishKind == FishKind.FishKind17 || this.fishKind == FishKind.FishKind9 || this.fishKind == FishKind.FishKind8 || this.fishKind == FishKind.FishKind11) {
                                t = 180;
                            }
                            this.fishSprite.node.scaleY = 1;
                            if (GOpenShadow) {
                                this.shadowSprite.node.scaleY = 1;
                            }
                        } else {
                            if (this.fishKind == FishKind.GodAdvent || this.fishKind == FishKind.FishKind9 || this.fishKind == FishKind.FishKind17 || this.fishKind == FishKind.FishKind9 || this.fishKind == FishKind.FishKind8 || this.fishKind == FishKind.FishKind11) {
                                t = 0;
                            }
                            this.fishSprite.node.scaleY = -1;
                            if (GOpenShadow) {
                                this.shadowSprite.node.scaleY = -1;
                            }
                        }
                    }
                    //}
                    this.fishSprite.node.angle = -(t);
                    if (GOpenShadow) {
                        this.shadowSprite.node.angle = -(t);
                    }
                }
                if (DataVO.GD.isRotation) {
                    //特殊鱼的转向判定
                    // if (this.fishKind == FishKind.OrganCannon || this.fishKind == FishKind.DrillCannon || this.fishKind == FishKind.CenserBead || this.fishKind == FishKind.LuckRun || this.fishKind == FishKind.GodFafa) {
                    if (this.fishKind == FishKind.OrganCannon || this.fishKind == FishKind.DrillCannon || this.fishKind == FishKind.CenserBead || this.fishKind == FishKind.LuckRun || this.fishKind == FishKind.GodFafa || this.fishKind == FishKind.FengBaoFuGui || this.fishKind == FishKind.ShanDianFuGui || this.fishKind == FishKind.JuBaoLianLian || this.fishKind == FishKind.BaoZhuZhaoFu) {
                        t = 180;
                        if (this.fishKind == FishKind.FengBaoFuGui || this.fishKind == FishKind.ShanDianFuGui || this.fishKind == FishKind.JuBaoLianLian || this.fishKind == FishKind.BaoZhuZhaoFu) {
                            cc.find('fishSprite', this.node).angle = -(t);
                            if (GOpenShadow) {
                                cc.find('fishShadow', this.node).angle = -(t);
                            }
                        } else {
                            if (this.fishKind == FishKind.CenserBead || this.fishKind == FishKind.LuckRun || this.fishKind == FishKind.GodFafa) {
                                this.fishSprite.node.angle = -(t);
                                if (GOpenShadow) {
                                    this.shadowSprite.node.angle = -(t);
                                }
                            } else {
                                this.fishSprite.node.angle = -(t);
                                this.node.getChildByName("icon").angle = -(t);
                            }
                        }
                    }
                }
            }
            this.prePos = newPos;
        }
    }

    initEx(bol: boolean = true) {
        if (this.fishKind == FishKind.DrillCannon) {
            if (DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].isBitBullet() || DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].isMiniBullet()) {
                //this.node.getChildByName("fishSprite").active =false;
                this.node.getChildByName("light").color = cc.color(255, 255, 255);
                this.node.getChildByName("icon").color = cc.color(255, 255, 255);
                this.node.getChildByName("light").active = false;
                this.node.getChildByName("icon").active = false;
                this.node.getChildByName("unicon").active = true;
            } else {
                this.node.getChildByName("light").color = cc.color(255, 255, 255);
                this.node.getChildByName("icon").color = cc.color(255, 255, 255);
                this.node.getChildByName("fishSprite").active = true;
                this.node.getChildByName("light").active = true;
                this.node.getChildByName("icon").active = true;
                this.node.getChildByName("unicon").active = false;
            }
        } else if (this.fishKind == FishKind.OrganCannon) {
            if (DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].isBitBullet()) {
                //this.node.getChildByName("fishSprite").active =false;
                this.node.getChildByName("light").color = cc.color(255, 255, 255);
                this.node.getChildByName("icon").color = cc.color(255, 255, 255);
                this.node.getChildByName("light").active = false;
                this.node.getChildByName("icon").active = false;
                this.node.getChildByName("unicon").active = true;
            } else {
                this.node.getChildByName("light").color = cc.color(255, 255, 255);
                this.node.getChildByName("icon").color = cc.color(255, 255, 255);
                this.node.getChildByName("fishSprite").active = true;
                this.node.getChildByName("light").active = true;
                this.node.getChildByName("icon").active = true;
                this.node.getChildByName("unicon").active = false;
            }
        } else if (this.fishKind == FishKind.JuBaoLianLian) {//新增鱼类型 spin控制
            let fishsprite = cc.find('fishSprite', this.node)
            let fishshadow = cc.find('fishShadow', this.node)
            fishsprite.color = cc.color(255, 255, 255);
            // fishsprite.getComponent(sp.Skeleton).setAnimation(0, 'animation', true)
            // fishshadow.getComponent(sp.Skeleton).setAnimation(0, 'animation', true)
        } else if (this.fishKind == FishKind.FengBaoFuGui) {//新增鱼类型 spin控制
            let fishsprite = cc.find('fishSprite', this.node)
            let fishshadow = cc.find('fishShadow', this.node)
            fishsprite.color = cc.color(255, 255, 255);
            // fishsprite.getComponent(sp.Skeleton).setAnimation(0, 'animation', true)
            // fishshadow.getComponent(sp.Skeleton).setAnimation(0, 'animation', true)
        } else if (this.fishKind == FishKind.ShanDianFuGui) {//新增鱼类型 spin控制
            let fishsprite = cc.find('fishSprite', this.node)
            let fishshadow = cc.find('fishShadow', this.node)
            fishsprite.color = cc.color(255, 255, 255);
            // fishsprite.getComponent(sp.Skeleton).setAnimation(0, 'animation', true)
            // fishshadow.getComponent(sp.Skeleton).setAnimation(0, 'animation', true)
        } else if (this.fishKind == FishKind.BaoZhuZhaoFu) {//新增鱼类型 spin控制
            let fishsprite = cc.find('fishSprite', this.node)
            let fishshadow = cc.find('fishShadow', this.node)
            fishsprite.getComponent(sp.Skeleton).timeScale = 1
            fishsprite.getComponent(sp.Skeleton).setAnimation(0, 'Standby', true)
            fishsprite.color = cc.color(255, 255, 255);
            // fishsprite.getComponent(sp.Skeleton).setAnimation(0, 'animation', true)
            // fishshadow.getComponent(sp.Skeleton).setAnimation(0, 'animation', true)
        }
        this.node.width = this.fishSprite.node.width;

        this.node.height = this.fishSprite.node.height;
        this.node.setScale(GFishKindAnimationFN[this.fishKind].scale);
        //this.node.setScale(10);
        let collider = this.fishSprite.node.getComponent(cc.BoxCollider);
        //collider.size = this.fishSprite.node.getContentSize();错误？

        if (!GOpenShadow) {
            this.shadowSprite.node.active = false;
        }
        if (DataVO.GD.isRotation) {
            this.shadowSprite.node.x = -22;
            this.shadowSprite.node.y = 22;
        }
        if (bol)
            this.node.setPosition(cc.v2(-1000, -1000));
        this.runAnimation(null)
        //如果没有指定路径类型， 则不用计算路径了， 外部会调用runMoveAction， 为其指定路径的
        if (this.fishTraceType != null) {
            this.runMoveAction();
            if (this.delayTime < 0) {
                this.setPastTime(-this.delayTime);
            }
        }
        if (DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].paoType == 1) {
            if (this.fishKind < FishKind.FishKind4) {
                this.node.opacity = 128
            }
        }
        if (DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].paoType == 2) {
            if (this.fishKind < FishKind.FishKind7) {
                this.node.opacity = 128
            }
        }
        if (DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].paoType == 3) {
            if (this.fishKind < FishKind.FishKind13) {
                this.node.opacity = 128
            }
        }
    }

    //执行行走动作
    runMoveAction(moveAction?) {
        if (moveAction == null) {
            moveAction = this.createMoveAction();
        }
        moveAction = cc.sequence(cc.place(-1000, -1000), moveAction, cc.callFunc(this.onMoveFinish.bind(this)));
        //moveAction = cc.speed(moveAction,1);错误包装后无法恢复场景
        //moveAction = cc.sequence(cc.place(500, 500),cc.delayTime(300), cc.callFunc(this.onMoveFinish.bind(this)));
        moveAction.setTag(FishMoveTag);
        this.node.stopActionByTag(FishMoveTag);
        this.node.runAction(moveAction);
    }

    //创建行走动作
    createMoveAction() {
        var action = null;
        var self = this;
        var speed = this.specifiedSpeed || DataVO.GD.fishConfig.fishKindConfigArray[this.fishKind].speed;
        if (MPConfig.G_OPEN_DOWNWATER_UPSPEED) {
            speed = F_CSBY_GameSceneLayer.seaIsCome ? this.specifiedSpeed * 10 : this.specifiedSpeed;
        }

        switch (this.fishTraceType) {
            case FishTraceType.Linear:
                var dis = ym.FishMoveTo.calcLength(this.fishPath[0], this.fishPath[1]);
                var dt = dis / speed;


                var fishAction = cc.moveTo(dt, this.fishPath[1]);
                action = cc.sequence(cc.place(this.fishPath[0]), fishAction);

                break;
            case FishTraceType.Bezier:
                var action: any = new FishBezierBy(speed, this.fishPath[0], this.fishPath[3], this.fishPath[1], this.fishPath[2], this.fishKind);

                action = cc.sequence(cc.place(this.fishPath[0]), action);

                break;


            case FishTraceType.CatmullRom:
                var dis = ym.FishCatmullRomTo.calcLength(this.fishPath[0], this.fishPath);
                var dt = dis / speed;
                var action1 = cc.place(this.fishPath[0]);
                var action2 = cc.catmullRomTo(dt, this.fishPath);
                action = cc.sequence(action1, action2);
                break;
            case FishTraceType.MultiLine:
                action = cc.place(this.fishPath[0]);
                var preRotate = 0;
                for (var i = 1; i < this.fishPath.length; ++i) {
                    var rotate = Util.calcRotation(this.fishPath[i - 1], this.fishPath[i]);


                    var dt = cc.v2(this.fishPath[i - 1].x, this.fishPath[i - 1].y).sub(cc.v2(this.fishPath[i].x, this.fishPath[i].y)).mag() / speed;

                    var rotateDt = Math.abs((rotate - preRotate) / 360);
                    action = cc.sequence(action, cc.spawn(cc.delayTime(rotateDt), cc.callFunc(function () {
                        var action = cc.rotateTo(rotateDt, rotate);
                        if (self.fishSprite instanceof Array) {
                            for (var i = 0; i < self.fishSprite.length; ++i) {
                                self.fishSprite[i].runAction(action.clone());
                                if (GOpenShadow) {
                                    self.shadowSprite[i].runAction(action.clone());
                                }
                            }
                        }
                        else {
                            self.fishSprite.node.runAction(action.clone());
                            if (GOpenShadow) {
                                self.shadowSprite.node.runAction(action.clone());
                            }
                        }

                    })), cc.moveTo(dt, this.fishPath[i]).easing(cc.easeSineOut()));
                    preRotate = rotate;
                }
                break;
            default:
                cc.log("default fish ..未标明鱼路径鱼");
                action = cc.delayTime(0);
                break;
        }

        if (this.delayTime > 0) {
            action = cc.sequence(cc.delayTime(this.delayTime), action);
        }
        return action;
    }

    /**
     * 得到的是真实的世界坐标
     * @returns {{lt, rt, lb, rb}|{lt: (*|cc.Point), rt: (*|cc.Point), lb: (*|cc.Point), rb: (*|cc.Point)}}
     */
    getFishRect() {

        //把rect缓存起来， 因为每帧中， 每个子弹都会调用每条鱼的getFishRect进行碰撞检测一次
        var nowPos = this.node.getPosition();
        if (this.cacheRect == null || this.lastCallGetRectingPos == null || this.lastCallGetRectingPos.x != nowPos.x || this.lastCallGetRectingPos.y != nowPos.y) {
            this.lastCallGetRectingPos = nowPos;
            return this.cacheRect = Util.getRect(this.node, 0.7);
        }
        return this.cacheRect;

    }

    //当鱼要删除自身调用此函数
    removeSelf() {
        //通知cannonLyaer, 我死了有锁定我的， 要释放
        //通知buletLayer, 我死了有锁定我的， 要释放
        this.fishSprite.getComponent(cc.BoxCollider).enabled = true;//还原碰撞盒
        this.fishSprite.node.angle = 0;
        this.shadowSprite.node.angle = 0;
        if (this.fishKind == FishKind.DrillCannon || this.fishKind == FishKind.OrganCannon) {
            this.node.getChildByName("icon").angle = 0;
        }
        EventManager.getInstance().raiseEvent("unlockFish", { fish: this.node });
        if (this.fishKind == FishKind.FishKind20) {//金蟾的特殊处理
            this.fishSprite.node.getChildByName("quan").color = cc.color(255, 255, 255);
            this.fishSprite.node.getChildByName("body").color = cc.color(255, 255, 255);
            this.fishSprite.node.getChildByName("eye").color = cc.color(255, 255, 255);
        } else if (this.fishKind == FishKind.DrillCannon || this.fishKind == FishKind.OrganCannon) {
            this.node.getChildByName("light").color = cc.color(255, 255, 255);
            this.node.getChildByName("icon").color = cc.color(255, 255, 255);
            this.fishSprite.node.color = cc.color(255, 255, 255);
        } else {
            this.fishSprite.node.color = cc.color(255, 255, 255);
        }
        switch (this.fishKind) {
            case FishKind.OrganCannon:
                DataVO.GD.nodePools["OrganCannon"].freeNode(this.node);
                break;
            case FishKind.DrillCannon:
                DataVO.GD.nodePools["DrillCannon"].freeNode(this.node);
                break;
            case FishKind.CenserBead:
                DataVO.GD.nodePools["CenserBead"].freeNode(this.node);
                break;
            case FishKind.GodFafa:
                DataVO.GD.nodePools["GodFafa"].freeNode(this.node);
                break;
            case FishKind.LuckRun:
                DataVO.GD.nodePools["LuckRun"].freeNode(this.node);
                break;
            case FishKind.GodAdvent:
                DataVO.GD.nodePools["GodAdvent"].freeNode(this.node);
                let bgm = [musicRes.BGM_1, musicRes.BGM_2, musicRes.BGM_3];
                SoundManager.getInstance().playMusic(bgm[DataVO.GD.bgmIndex], "subgame");
                break;
            case FishKind.JuBaoLianLian:
                DataVO.GD.nodePools["JuBaoLianLian"].freeNode(this.node);
                break;
            case FishKind.FengBaoFuGui:
                DataVO.GD.nodePools["FengBaoFuGui"].freeNode(this.node);
                break;
            case FishKind.ShanDianFuGui:
                DataVO.GD.nodePools["ShanDianFuGui"].freeNode(this.node);
                break;
            case FishKind.BaoZhuZhaoFu:
                DataVO.GD.nodePools["BaoZhuZhaoFu"].freeNode(this.node);
                break;
            default:
                DataVO.GD.nodePools["fish_" + (this.fishKind + 1)].freeNode(this.node);
        }
        if (this.fishKind <= 18 || this.fishKind == FishKind.GodAdvent) {
            if (GOpenShadow) {
                let ani1 = (this.shadowSprite.getComponent(cc.Animation) as cc.Animation).defaultClip;
                (this.shadowSprite.getComponent(cc.Animation) as cc.Animation).getAnimationState(ani1.name).speed = 1;
            }
            let ani = (this.fishSprite.getComponent(cc.Animation) as cc.Animation).defaultClip;
            (this.fishSprite.getComponent(cc.Animation) as cc.Animation).getAnimationState(ani.name).speed = 1;
        }
        this.node.removeFromParent();
    }
    onMoveFinish() {
        this.node.runAction(cc.sequence(cc.fadeOut(0.1), cc.callFunc(this.removeSelf.bind(this))));
    }
    //执行游动动画
    runAnimation(interval) {
        /*(this.fishSprite.getComponent("Animation") as Animation).play();
        if(GOpenShadow){
            this.shadowSprite.getComponent("Animation").play();
        }*/
    }



    /**
    *
    * @param data
    * @param finishCallback 动画播放完后的回调函数
    */
    death(finishCallback, isPlaySound, fishDieAniDt, chairID) {
        finishCallback = finishCallback || function () {
        };
        ///////////////////////////////////////////////////////////////////////////////
        //做死亡标志， 还有死亡动画
        if (this.fishKind != FishKind.GodAdvent) {
            this.valid = false;
            fishDieAniDt = fishDieAniDt || GFishDieAniDT;
            var delayTime = 0.25;
            this.node.stopActionByTag(FishAnimationTag);
        }
        if (this.fishKind <= 18) {
            if (GOpenShadow) {
                let ani1 = (this.shadowSprite.getComponent(cc.Animation) as cc.Animation).defaultClip;
                (this.shadowSprite.getComponent(cc.Animation) as cc.Animation).getAnimationState(ani1.name).speed = 10;
            }
            let ani = (this.fishSprite.getComponent(cc.Animation) as cc.Animation).defaultClip;
            (this.fishSprite.getComponent(cc.Animation) as cc.Animation).getAnimationState(ani.name).speed = 10;
        }
        if (this.fishKind == FishKind.GodAdvent) {
            this.schedule(function () {
                if (GOpenShadow) {
                    let ani1 = (this.shadowSprite.getComponent(cc.Animation) as cc.Animation).defaultClip;
                    (this.shadowSprite.getComponent(cc.Animation) as cc.Animation).getAnimationState(ani1.name).speed = 1;
                }
                let ani = (this.fishSprite.getComponent(cc.Animation) as cc.Animation).defaultClip;
                (this.fishSprite.getComponent(cc.Animation) as cc.Animation).getAnimationState(ani.name).speed = 1;
            }, 1, 0);
            finishCallback();
        } else {
            this.node.stopActionByTag(FishMoveTag);
            this.node.runAction(cc.sequence(
                cc.delayTime(delayTime),
                cc.callFunc(finishCallback),
                cc.fadeOut(0.1),
                cc.callFunc(this.removeSelf.bind(this))
            ));
            // this.setScale(1.2);
            // 取消自身碰撞
            this.fishSprite.getComponent(cc.BoxCollider).enabled = false;
        }
        ////////////////////////////////////////////////////////////////////////////
    }
    /**
     * 设置已经过去的时间
     * @param pastTime
     */
    setPastTime(pastTime) {
        var self = this;
        cc.log(this.node.getActionByTag(FishMoveTag));
        this.node.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(function () {
            var moveAction = self.node.getActionByTag(FishMoveTag);
            if (moveAction) {
                // @ts-ignore
                if (moveAction.setElapsed) {
                    // @ts-ignore
                    moveAction.setElapsed(moveAction.getElapsed() + pastTime + 0.1);
                }
                else {
                    // @ts-ignore
                    moveAction._elapsed += pastTime + 0.1;
                }
            }
            // @ts-ignore
        })));
    }
}