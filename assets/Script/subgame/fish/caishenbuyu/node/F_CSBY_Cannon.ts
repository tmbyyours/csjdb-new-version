import { DataVO } from "../../../../plaza/model/DataVO";
import { V, GLockPaoPaoColor, GRotateAngle, GRotateRadius, GFireRotation, FireSoundInterval } from "../F_CSBY_Config";
import Util from "../../../../extend/Util";
import SoundManager from "../../../../common/managers/SoundManager";
import { subGameMSG } from "../SubGameMSG";
import SystemToast from "../../../../extend/ui/SystemToast";


const { ccclass, property } = cc._decorator;

@ccclass
export default class F_CSBY_Cannon extends cc.Component {
    @property(cc.Node) //玩家座位
    player: cc.Node = null;
    @property(cc.Sprite) //等待文字
    waitting: cc.Sprite = null;
    @property(cc.Sprite)
    board: cc.Sprite = null;
    deco;
    @property(cc.Sprite)
    gun: cc.Sprite = null;                           //炮筒
    @property(cc.Sprite)
    flare: cc.Sprite = null;                           //炮筒火光
    @property(cc.Label)
    mulLabel: cc.Label = null;                     //炮筒倍数

    @property(cc.Label)
    scoreLabel: cc.Label = null;                   //分数精灵
    scoreValue;                      //分数值
    vipIcon;                      //等级图标
    @property(cc.Node)
    scoreBox: cc.Node = null;             //分数框
    @property(cc.Sprite)
    scoreBoxBG: cc.Sprite = null;                  //分数框背景
    chairID;
    cannonConfigIndex;            //大炮配置索引标志
    jettonGroup;                  //金币柱组
    @property(cc.Sprite)
    goldIcon: cc.Sprite = null;                      //金币图标
    @property(cc.Node)
    prize: cc.Node = null;                        //转盘
    @property(cc.Node)
    newprize: cc.Node = null;                        //转盘

    @property(cc.Sprite)
    powerBox: cc.Sprite = null;    //炮威力
    @property(cc.Label)
    powerLabel: cc.Label = null;    //炮威力文本

    @property(cc.Label)
    nicknameLabel: cc.Label = null;                 //妮称
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //魔能炮
    isSuperCannon: boolean = false;              //是否魔能炮
    @property(cc.Sprite)
    superCannonCard: cc.Sprite = null;             //魔能炮 卡片
    superCannonCardPos: cc.Vec2;           //魔能炮卡片位置
    superCannonCardRotaion;       //当前旋转角度
    isStopSwitchCannon: boolean = false;           //是否不让切换炮台
    @property(cc.Label)
    leftTimeLabel: cc.Label = null;                //魔能炮剩余时间
    leftTimeValue;                //魔能炮剩余时间
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //钻头炮
    isBitCannon = 0;              //是否钻头炮
    bitnum = 0;
    @property(cc.Sprite)
    gunbase: cc.Sprite = null;             //炮座
    @property(cc.Sprite)
    gunbasesub: cc.Sprite = null;  //炮

    @property(cc.Node)
    yanHuaGun: cc.Node = null;             //烟花炮
    @property(cc.Node)
    baiHuGun: cc.Node = null;             //白虎炮
    @property(cc.Node)
    qingLongGun: cc.Node = null;             //青龙炮
    @property(cc.Node)
    paoEffect: cc.Node = null
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //机枪炮
    isMiniCannon: boolean = false;
    superBulletNum = 0;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    checkLockNewInterval = 1;        // 打开锁定状态的时候，若没锁定鱼，检测可锁定鱼的时间间隔
    checkLockElapseTime = 0;              // 打开锁定时，检测锁鱼经过的时间

    lockingFish;                  //当前正在锁定的鱼

    //@property(cc.Node)
    //bubbleChain:cc.Node =null;                    //泡泡链
    //@property(cc.Sprite)
    //lockFishBG:cc.Sprite =null;                    //锁鱼背景准星
    @property(cc.Sprite)
    indexFlag: cc.Sprite = null;               //锁鱼的玩家准星
    bubbleSize;                        //泡泡大小
    //锁定鱼的显示
    lockFishSprite;
    lockFishSpriteRotaion;
    lockFishBGPos;                     //锁鱼背景位置
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    markPositionNode;                 //显示自己在哪
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @property(cc.Button)
    addMulBtn: cc.Button = null;               //增加炮的倍数
    @property(cc.Button)
    subMulBtn: cc.Button = null;
    index;

    cannonAtlas: cc.SpriteAtlas;

    size;//炮大小
    paoType: number = 0;
    yanhua: boolean = false;
    baihu: boolean = false;
    qinglong: boolean = false;
    canChangeNewFlag: boolean = true;

    allScore: number = 0


    onLoad() {
        this.index = Number(this.node.name.substring(6))
        this.initEx(this.index);
        //this.markAnimate();
        this.cannonConfigIndex = 0;
        this.setLockFish(null);

        this.addMulBtn.node.on(cc.Node.EventType.TOUCH_END, this.addMul, this);
        this.subMulBtn.node.on(cc.Node.EventType.TOUCH_END, this.subMul, this);
        this.cannonAtlas = DataVO.GD.mainScene.cannonLayer.cannonAtlas;
    }

    playPaoAni(str: string = '') {
        this.paoEffect.active = true
        let ske = this.paoEffect.getComponent(sp.Skeleton)
        ske.setAnimation(0, str, false)
        ske.setCompleteListener(() => {
            ske.setCompleteListener(null)
            this.paoEffect.active = false
        })

    }

    getFirePos() {
        return this.flare.node.position
    }

    onChangeNewFlag(bo: boolean = true) {
        this.canChangeNewFlag = bo
    }

    resetAngle() {
        if (this.index > 2) {
            this.gunbase.node.angle = -180;
            this.gun.node.angle = -180;
            this.yanHuaGun.angle = -180;
            this.baiHuGun.angle = -180;
            this.qingLongGun.angle = -180;
        } else {
            this.gun.node.angle = 0;
            this.gunbase.node.angle = 0;
            this.yanHuaGun.angle = 0;
            this.baiHuGun.angle = 0;
            this.qingLongGun.angle = 0;
        }
    }

    //重置
    reset() {
        if (this.index > 2) {
            this.gun.node.angle = -180;

        } else {
            this.gun.node.angle = -0;
        }
        this.setScoreValue("0");
        this.mulLabel.string = "0";
        this.isSuperCannon = false;
        this.isMiniCannon = false;
        this.isBitCannon = 0
        this.lockingFish = null;
        this.superBulletNum = 0;
        this.size = 0;
        this.superCannonCard.node.active = false
        if (this.gun.node.getChildByName("miniCannon")) {
            this.gun.node.getChildByName("miniCannon").removeFromParent();
        }
        this.flare.spriteFrame = DataVO.GD.mainScene.animation_1Atlas.getSpriteFrame("GP_Bullet-GP_Fire_" + this.size);
        // this.gunbase.spriteFrame = this.cannonAtlas.getSpriteFrame("GP_GunSeat_png");
        if (this.gun.node.getChildByName("DrillCannon")) {
            this.gun.node.getChildByName("DrillCannon").removeFromParent();
        }
        let dis = -105
        if (this.index > 2) {
            dis = -dis
            this.gunbase.node.angle = -180;
            this.gun.node.angle = -180;
            this.yanHuaGun.angle = -180;
            this.baiHuGun.angle = -180;
            this.qingLongGun.angle = -180;
        } else {
            this.gun.node.angle = 0;
            this.gunbase.node.angle = 0;
            this.yanHuaGun.angle = 0;
            this.baiHuGun.angle = 0;
            this.qingLongGun.angle = 0;
        }
        this.gun.node.getComponent(cc.Sprite).enabled = true;
    }
    //获取锁定的鱼
    getLockFish() {
        return this.lockingFish;
    }
    //不让切换炮台
    stopSwitchCannon() {
        this.isStopSwitchCannon = true;
    }
    /**
     * 解除当前锁定的鱼
     */
    unlockFish() {
        //this.indexFlag.node.active =false;
        //this.lockFishBG.node.active =false;
        //this.bubbleChain.active =false;
        if (this.lockingFish) {
            this.lockingFish = null;
        }
    }
    setLockFish(fish, lockNew?) {
        if (!DataVO.GD.switingScene && fish) {
            this.lockingFish = fish;
            if (DataVO.GD.meChairID == this.chairID) {
                DataVO.GD.showAimAction = true
            }
            //this.bubbleChain.active =true;
            //this.lockFishBG.node.active =true;
            // this.lockFishBG.display("#res/likuipiyu/gui/skill-lock-" + fish.fishKind + ".png");错误未设置
            this.updateCannonAngle();
        } else {
            // this.indexFlag.node.active =false;
            //this.lockFishBG.node.active =false;
            this.lockingFish = null;
            //this.bubbleChain.active =false;
            if (lockNew == true) {
                //DataVO.GD.mainScene.cannonLayer.randomLockFish(this.chairID);
            }
        }
    }
    //显示鱼币不足
    showNoMoney() {
        cc.log("鱼币不足")
        SystemToast.GetInstance().buildToast("金币不足");
        if (DataVO.GD.mainScene.cannonLayer.autoFire) { // 取消锁定
            DataVO.GD.mainScene.cannonLayer.setAuto();
        }
        if (DataVO.GD.mainScene.fishLayer.lockFishStatus) { //取消瞄准
            DataVO.GD.mainScene.cannonLayer.seAim();
        }
        /*!this.noMoneySprite && (this.noMoneySprite = new cc.Sprite("#res/likuipiyu/cannon/noMoney.png").p(0, 120).to(this).hide());

        if (!this.noMoneySprite.isVisible()) {
            this.noMoneySprite.show();
            this.noMoneySprite.stopAllActions();
            this.noMoneySprite.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(1.5), cc.fadeIn(1.5))));
        }*/
    }
    //隐藏鱼币不足
    hideNoMoney() {
        // this.noMoneySprite && this.noMoneySprite.isVisible() && this.noMoneySprite.hide();
    }

    //当激活时
    onActivation(chairID) {
        this.chairID = chairID;
        cc.log('chairID      ' + DataVO.GD.meChairID + '             ' + this.chairID)
        if (this.index > 2) { //矫正炮座
            this.gun.node.angle = -180;
            this.yanHuaGun.angle = -180;
            this.baiHuGun.angle = -180;
            this.qingLongGun.angle = -180;
        } else {
            this.gun.node.angle = 0;
            this.yanHuaGun.angle = 0;
            this.baiHuGun.angle = 0;
            this.qingLongGun.angle = 0;
        }
        if (DataVO.GD.meChairID == this.chairID) {
            var self = this;
            DataVO.GD.meCannon = this;
            if (!this.subMulBtn) {
                this.subMulBtn.node.on(cc.Node.EventType.TOUCH_END, function () {
                    self.requestChangeBullet("-");
                });
            }
            if (!this.addMulBtn) {
                this.addMulBtn.node.on(cc.Node.EventType.TOUCH_END, function () {
                    self.requestChangeBullet("+");
                });
            }
            this.subMulBtn.node.active = true;
            this.addMulBtn.node.active = true;
            this.gunbase.node.opacity = 255;
            this.gun.node.opacity = 255;
            this.scoreBox.opacity = 255;
            this.scoreBoxBG.node.opacity = 255;
            this.superCannonCard.node.opacity = 255;
            //this.scoreBox.x=200;

            /*this.isHereArm.show();错误初始化动画
            this.isHereArm.getAnimation().play("Animation2");
            this.isHereArm.runAction(cc.sequence(
                cc.delayTime(2),
                cc.hide()
            ))

            // this.runAction(cc.sequence(
            //     cc.callFunc(()=>{
            //         this.showLightning()
            //     }),
            //     cc.delayTime(3)
            // ).repeatForever())*/
        } else {
            cc.log("其他用户" + this.chairID + "我的位置" + DataVO.GD.meChairID)
            this.subMulBtn.node.active = false;
            this.addMulBtn.node.active = false;
            // this.gunbase.node.opacity = 150;
            this.gun.node.opacity = 150;
            this.scoreBox.opacity = 150;
            this.scoreBoxBG.node.opacity = 150;
            this.superCannonCard.node.opacity = 150;
            if (this.isMiniBullet()) {
                this.startMiniBullet(this.superBulletNum)
            }
            if (this.isBitCannon == 1) {
                // this.gunbase.spriteFrame = this.cannonAtlas.getSpriteFrame("GP_Gun3_1");
                this.gunbasesub.node.active = true
                this.gunbasesub.node.angle = this.gun.node.angle;
                this.yanHuaGun.angle = this.gun.node.angle;
                this.baiHuGun.angle = this.gun.node.angle;
                this.qingLongGun.angle = this.gun.node.angle;
            } else if (this.isBitCannon == 2) {
                let bullet: cc.Node = DataVO.GD.nodePools.bullet1.getNode();
                bullet.getComponent("F_CSBY_Bullet").enabled = false
                bullet.group = "default"
                bullet.x = 0;
                bullet.y = 0;
                bullet.angle = 0;
                this.yanHuaGun.angle = 0;
                this.baiHuGun.angle = 0;
                this.qingLongGun.angle = 0;
                bullet.opacity = 255;
                bullet.name = "DrillCannon"
                bullet.anchorY = -0.22;
                bullet.getChildByName("SS_Gun3_04").y = 99;
                bullet.getChildByName("SS_Gun3_01").y = 69;
                bullet.getChildByName("SS_Gun3_06").active = false;
                bullet.setParent(this.gun.node)
                // this.gunbase.spriteFrame = this.cannonAtlas.getSpriteFrame("GP_Gun3_1");
                // this.gunbase.node.angle = this.gun.node.angle;
            }
        }
    }
    /**
    * 是否能打最小的一炮
    * @returns {boolean}
    */
    canFireMinCannon() {
        return this.scoreValue >= DataVO.GD.fishConfig.cannonKindConfigArray[0].multiple;
    }
    //更新炮的角度
    updateCannonAngle() {
        if (this.lockingFish && this.lockingFish.getComponent("F_CSBY_Fish").valid) {
            var fishWorldPos = this.lockingFish.parent.convertToWorldSpaceAR((this.lockingFish as cc.Node).getPosition());
            //在屏幕内
            if (fishWorldPos.x < V.w - DataVO.GD.offsetSize && fishWorldPos.x > DataVO.GD.offsetSize && fishWorldPos.y < V.h && fishWorldPos.y > 0) {

                var muzzlePos = this.gun.node.convertToWorldSpaceAR(cc.v2(0, 0));

                var rotation = Util.calcRotation(muzzlePos, fishWorldPos) + 90;

                if ((rotation >= -90 && rotation <= 90 && this.index <= 2) || (rotation <= -90 && rotation >= 90 && this.index > 2)) {
                    this.setFireAngle(rotation);
                    return true;
                }
            }
        }
        return false;
    }

    update(dt) {
        //如果是魔能炮
        if (this.isSuperCannon) {
            this.superCannonCardRotaion += GRotateAngle * dt;
            if (this.superCannonCardRotaion > Math.PI * 2) {
                this.superCannonCardRotaion -= Math.PI * 2;
            }
            //设置魔能炮位置
            this.superCannonCard.node.setPosition(GRotateRadius * Math.cos(this.superCannonCardRotaion) + this.superCannonCardPos.x, GRotateRadius * Math.sin(this.superCannonCardRotaion) + this.superCannonCardPos.y);

            this.leftTimeValue -= dt;
            if (this.leftTimeValue < 0) {
                this.leftTimeValue = 0;
            }

            if (Math.ceil(this.leftTimeValue) != Number(this.leftTimeLabel.string)) {
                this.leftTimeLabel.string = String(Math.ceil(this.leftTimeValue));
            }
        }
        //cc.log(this.lockingFish) 错误
        //如果有锁定的鱼
        if (this.lockingFish) {
            if (this.lockingFish == null || !this.lockingFish.getComponent("F_CSBY_Fish")) {
                // cc.error("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
                cc.log(this.lockingFish)
                return
            }
            //cc.log(this.lockingFish)
            if (!this.lockingFish.getComponent("F_CSBY_Fish").valid) {
                //如果鱼死了，就锁定新的鱼
                this.lockingFish = null;
                this.setLockFish(null, true);
            }
            else {
                //武器在 该layer的位置
                var gunPosition = this.gun.node.parent.convertToWorldSpaceAR(this.gun.node.position);
                var fishPosition = this.lockingFish.parent.convertToWorldSpaceAR(this.lockingFish.getPosition());

                var dis = gunPosition.sub(fishPosition).mag();
                var bubbleNum = dis / (this.bubbleSize * 2) - 1;

                //添加到足够多
                /*while (bubbleNum > this.bubbleChain.children.length) {
                    var bubble;
                    if (GLockPaoPaoColor) {
                        // bubble = new cc.Sprite("#res/likuipiyu/cannon/lock_line_" + (this.chairID + 1) + ".png").to(this.bubbleChain);错误泡泡资源
                    } else {
                        // bubble = new cc.Sprite("#res/likuipiyu/cannon/lock_line.png").to(this.bubbleChain);错误泡泡资源
                    }
                }

                var children = this.bubbleChain.children;
                
                var vec2 = fishPosition.sub(gunPosition);
                for (var i = 0; i < children.length; ++i) {
                    if (i < bubbleNum) {
                        var fac = (i + 1) / (bubbleNum + 1);
                        var pos = this.bubbleChain.convertToNodeSpaceAR(cc.v2(gunPosition.x + vec2.x * fac, gunPosition.y + vec2.y * fac));
                        children[i].setPosition(pos);
                    } else {
                        children[i].active =false;
                    }
                }*/
                // this.indexFlag.node.setPosition(this.node.convertToNodeSpaceAR(fishPosition));

                //如果有锁定鱼， 则大炮时时跟鱼转动
                //角度非法， 则 说明鱼的位置不适合锁定了
                if (!this.updateCannonAngle()) {
                    this.setLockFish(null, true);
                }
            }
        }
        if (!DataVO.GD.switingScene && DataVO.GD.mainScene.fishLayer.lockFishStatus && this.chairID == DataVO.GD.meChairID) {
            // cc.log(this.isLockEnable, this.lockingFish);
            if (!this.lockingFish || !this.lockingFish.getComponent("F_CSBY_Fish").valid) {
                // 如果没锁定鱼，则开始检测锁定新的鱼
                this.checkLockElapseTime += dt;
                if (this.checkLockElapseTime > this.checkLockNewInterval) {
                    this.checkLockElapseTime = 0;
                    this.setLockFish(null, true);
                }
            }
        }
    }

    setCannonConfigIndex(cannonConfigIndex) {
        var config = DataVO.GD.fishConfig.cannonKindConfigArray;
        this.cannonConfigIndex = cannonConfigIndex
        //返回游戏分类图标
        if (this.size != Util.clamp(config[this.cannonConfigIndex].size, 1, 3)) {
            this.size = Util.clamp(config[this.cannonConfigIndex].size, 1, 3);
            (this.gun as cc.Sprite).spriteFrame = this.cannonAtlas.getSpriteFrame("GP_Gun_0" + this.size + "_1");
            this.flare.spriteFrame = DataVO.GD.mainScene.animation_1Atlas.getSpriteFrame("GP_Bullet-GP_Fire_" + this.size);
            if (this.chairID == DataVO.GD.meChairID) {
                SoundManager.getInstance().playID(10301, "subgame");
            }
            this.gun.node.runAction(cc.sequence(cc.scaleTo(0.05, 1.2, 1.2), cc.scaleTo(0.05, 1, 1)))
        }
        this.setBulletMul(DataVO.GD.fishConfig.cannonKindConfigArray[this.cannonConfigIndex].multiple);
    }
    //设置昵称
    setNickname(nickname) {
        //cc.log("setNickname"+nickname);
        this.nicknameLabel.string = nickname;
    }
    //显示地区
    setRegion(region) {

    }
    //显示vip等级
    setVIPLevel(level) {

    }
    /**
   * 得到label 的世界坐标位置
   * @returns {*|cc.v2}
   */
    getScoreLabelWorldPos() {
        return this.scoreLabel.node.convertToWorldSpaceAR(cc.v2(0, 0));
    }
    /**
     * 得到label 的世界坐标位置
     * @returns {*|cc.Point}
     */
    getScoreLabelWorldPosIgnoreLayerRotation() {
        let cannonLayerRotation = DataVO.GD.mainScene.cannonLayer.node.angle;
        DataVO.GD.mainScene.cannonLayer.angle = -(0);
        let s = this.goldIcon.node;
        let ans = this.goldIcon.node.convertToWorldSpaceAR(cc.v2(0, 0));
        DataVO.GD.mainScene.cannonLayer.angle = -(cannonLayerRotation);
        return ans;
    }
    /**
    * 得到superCannonCard 的世界坐标位置S
    * @returns {*|cc.Point}
    */
    getSuperCannonCardWorldPosIgnoreLayerRotation() {
        let cannonLayerRotation = DataVO.GD.mainScene.cannonLayer.node.angle;
        DataVO.GD.mainScene.cannonLayer.angle = -(0);
        let s = this.goldIcon.node;
        let ans = this.superCannonCard.node.convertToWorldSpaceAR(cc.v2(-50, 0));
        DataVO.GD.mainScene.cannonLayer.angle = -(cannonLayerRotation);
        return ans;
    }
    //得到炮口世界坐标位置
    getMuzzleWorldPos() {
        return this.gun.node.convertToWorldSpaceAR(cc.v2(this.gun.node.width * 0.5, this.gun.node.height * 0.9));
    }
    getPaoMiddlePos() {
        return this.gun.node.convertToWorldSpaceAR(cc.v2(0, 0));
    }

    //得到炮口世界坐标位置, 忽略cannonLayer旋转
    getMuzzleWorldPosIgnoreLayerRotation() {
        var cannonLayerRotation = DataVO.GD.mainScene.cannonLayer.node.angle;

        DataVO.GD.mainScene.cannonLayer.angle = -(0);
        var ans = this.gun.node.convertToWorldSpaceAR(cc.v2(0, 0));

        DataVO.GD.mainScene.cannonLayer.angle = -(cannonLayerRotation);

        return ans;

    }
    //得到炮口世界坐标位置, 忽略cannonLayer旋转
    getCannonWorldPosIgnoreLayerRotation() {

        var cannonLayerRotation = DataVO.GD.mainScene.cannonLayer.node.angle;

        DataVO.GD.mainScene.cannonLayer.angle = -(0);

        //给金币用的
        var ans = this.node.convertToWorldSpaceAR(cc.v2(-50, -50));

        DataVO.GD.mainScene.cannonLayer.angle = -(cannonLayerRotation);
        return ans;
    }
    //获取击杀特效的位置
    getJiShaScorePos() {
        return this.node.convertToWorldSpaceAR(this.prize.getPosition());
    }
    setScoreValue(score) {
        this.scoreValue = score;
        this.scoreLabel.string = Util.formatMoney(score > 0 ? score : 0, ',', true)
    }
    setFireAngle(angle) {
        let _angle;
        if (this.index > 2) {
            _angle = angle + -180;
        } else {
            _angle = angle;
        }
        if (this.isBitCannon != 2) {
            this.gun.node.angle = -_angle;
            this.yanHuaGun.angle = -_angle;
            this.baiHuGun.angle = -_angle;
            this.qingLongGun.angle = -_angle;
            if (this.isBitCannon == 1) {
                // this.gunbase.node.angle = -_angle;
                this.gunbasesub.node.angle = -_angle;
            }
        }
    }
    getFireAngle() {
        return this.gun.node.angle;
    }
    getFireAngleIgnoreLayerRotation() {
        let cannonLayerRotation = DataVO.GD.mainScene.cannonLayer.node.angle;
        return this.gun.node.angle - (cannonLayerRotation)
    }
    //设置炮筒倍数
    setBulletMul(mul) {
        this.mulLabel.string = mul;
    }
    getBulletMul() {
        return this.mulLabel.string;
    }
    //加炮
    addMul() {
        if (this.isBitCannon != 0 || this.isMiniCannon || this.isSuperCannon || this.isStopSwitchCannon || DataVO.GD.cantChangeMul) {
            return;
        }
        if (!DataVO.GD.canChangeCannon) {
            cc.log('加炮后等待服务器返回  ，当前不可切炮 ')
            return
        }
        DataVO.GD.canChangeCannon = false
        // // cc.log('加炮消息')
        // var config = DataVO.GD.fishConfig.cannonKindConfigArray;

        // this.cannonConfigIndex++;
        // if (this.cannonConfigIndex > config.length - 1) {
        //     this.cannonConfigIndex = 0
        // }
        // //this.cannonConfigIndex %= config.length;
        // this.setCannonConfigIndex(this.cannonConfigIndex);
        this.requestChangeBullet("+")
        // if (this.chairID == DataVO.GD.meChairID) {
        //     this.powerBox.node.active = true
        //     this.powerLabel.string = DataVO.GD.fishConfig.cannonKindConfigArray[this.cannonConfigIndex].multiple
        //     this.powerBox.node.stopAllActions();
        //     this.powerBox.node.setScale(0);
        //     this.powerBox.node.runAction(
        //         cc.sequence(
        //             cc.scaleTo(0.13, 1.33),
        //             cc.delayTime(0.94),
        //             cc.scaleTo(0.16, 1.33, 0),
        //             cc.callFunc(() => {
        //                 this.powerBox.node.active = false
        //             }))
        //     )
        // }
        DataVO.GD.cantChangeMul = true
        SoundManager.getInstance().playID(1201, "subgame");
    }
    changeMulSuccess(data) {
        var config = DataVO.GD.fishConfig.cannonKindConfigArray;
        if (this.cannonConfigIndex > config.length - 1) {
            this.cannonConfigIndex = 0
        }
        //this.cannonConfigIndex %= config.length;
        this.setCannonConfigIndex(data.cannonIndex);


        if (this.chairID == DataVO.GD.meChairID) {
            // cc.error(this.powerBox.node.scale);
            this.powerBox.node.active = true
            this.powerLabel.string = DataVO.GD.fishConfig.cannonKindConfigArray[this.cannonConfigIndex].multiple
            this.powerBox.node.stopAllActions();
            if (this.powerBox.node.scale == 1.33) {
            } else {
                this.powerBox.node.setScale(0);
            }
            this.powerBox.node.runAction(
                cc.sequence(
                    cc.scaleTo(0.13, 1.33),
                    cc.delayTime(0.94),
                    cc.scaleTo(0.16, 1.33, 0),
                    cc.callFunc(() => {
                        this.powerBox.node.active = false
                    }))
            )
        }
    }
    //减炮
    subMul() {
        if (this.isBitCannon != 0 || this.isMiniCannon || this.isSuperCannon || this.isStopSwitchCannon || DataVO.GD.cantChangeMul) {

            return;
        }
        if (!DataVO.GD.canChangeCannon) {
            // cc.log('减炮后等待服务器返回  ， 当前不可切炮 ')
            return
        }
        DataVO.GD.canChangeCannon = false
        // cc.log('减炮消息')
        // var config = DataVO.GD.fishConfig.cannonKindConfigArray;

        // this.cannonConfigIndex--;
        // if (this.cannonConfigIndex < 0) {

        //     this.cannonConfigIndex = config.length - 1
        // }
        //this.cannonConfigIndex %= config.length;
        this.requestChangeBullet("-")
        // this.setCannonConfigIndex(this.cannonConfigIndex);
        // if (this.chairID == DataVO.GD.meChairID) {
        //     this.powerBox.node.active = true
        //     this.powerLabel.string = DataVO.GD.fishConfig.cannonKindConfigArray[this.cannonConfigIndex].multiple
        //     this.powerBox.node.stopAllActions();
        //     this.powerBox.node.setScale(0);
        //     this.powerBox.node.runAction(
        //         cc.sequence(
        //             cc.scaleTo(0.13, 1.33),
        //             cc.delayTime(0.94),
        //             cc.scaleTo(0.16, 1.33, 0),
        //             cc.callFunc(() => {
        //                 this.powerBox.node.active = false
        //             }))
        //     )
        // }
        DataVO.GD.cantChangeMul = true
        SoundManager.getInstance().playID(1202, "subgame");
    }
    //发送炮倍数
    requestChangeBullet(changeFlag) {
        let msg = { chairID: DataVO.GD.meChairID, changeFlag: changeFlag, cannonIndex: this.index };
        DataVO.GD.mainScene.sendGameData(subGameMSG.SUB_C_CHANGE_BULLET, msg);
    }

    //收到减炮的消息
    onChangeNewBullet(data) {
        if (data.chairID == DataVO.GD.meChairID) {
            DataVO.GD.cantChangeMul = false
        }
    }

    //收到减炮的消息
    onChangeBullet(data) {
        /*if(this.cannonConfigIndex == data.cannonIndex && data.chairID == DataVO.GD.meChairID){
            SystemToast.GetInstance().buildToast("魔能炮期间无法换炮");
            return;
        }*/
        if (data.chairID == DataVO.GD.meChairID) {
            DataVO.GD.cantChangeMul = false
        }
        this.setCannonConfigIndex(data.cannonIndex);

    }
    //获取大炮当前的配置索引标志
    getCannonIndex() {
        return this.cannonConfigIndex;
    }
    initEx(index) {
        cc.log(index)
        cc.log(this)
        if (this.superCannonCard) {
            this.superCannonCard.node.active = false;
            this.prize.active = false;
            this.newprize.active = false;
            this.flare.node.runAction(cc.toggleVisibility())
        }
        //this.flare.node.active=false;
        //this.indexFlag.node.active=false;
        // cc.log('--------cannoninitEx--------');
        // cc.log(this.yanHuaGun);
        // cc.log(this.baiHuGun);
        // cc.log(this.qingLongGun);
        // cc.log(this.node);
        this.yanHuaGun.active = false;
        this.baiHuGun.active = false;
        this.qingLongGun.active = false;

    }
    //显示闪电
    showLightning() {

    }
    //加入奖励组
    pushJetton(score, multiple) {
        this.jettonGroup.pushJetton(score, multiple);
    }
    //分数是否足够打一炮
    isScoreCanFire(score, rage) {
        if (rage) {
            return (score || this.scoreValue) >= DataVO.GD.fishConfig.cannonKindConfigArray[this.cannonConfigIndex].multiple * GFireRotation.length;
        }
        else {
            return (score || this.scoreValue) >= DataVO.GD.fishConfig.cannonKindConfigArray[this.cannonConfigIndex].multiple;
        }
    }
    addScore(score) {
        // var newScore = this.scoreValue + score;
        var newScore = this.allScore;
        //这里面有强制设定scale, 所以不用考虑下面的scaleBy问题
        this.setScoreValue(newScore);
        if (score > 0) {
            this.goldIcon.node.getChildByName("light").getComponent(cc.Animation).play()
            let coin = DataVO.GD.nodePools["CoinPool"].getNode();
            let pos = this.node.convertToNodeSpaceAR(this.goldIcon.node.convertToWorldSpaceAR(cc.v2(0, 0)))
            coin.setPosition(pos);
            coin.setParent(this.node)
            coin.getComponent("F_CSBY_Coin").reuse2("gold");
        }
    }
    a = 20
    //开火
    fire(fireData) {
        var angle = fireData.angleArray[0];
        var mul = DataVO.GD.fishConfig.cannonKindConfigArray[fireData.cannonIndex].multiple;
        var cannonIndex = fireData.cannonIndex;

        var self = this;
        // this.a --
        // this.startMiniBullet(20)
        // if(this.a<=0)
        // {
        //     this.endMiniBullet()
        // }
        this.setCannonConfigIndex(cannonIndex);
        // this.setFireAngle(angle);
        if (this.superBulletNum == 0 && this.isBitCannon != 1) {
            // var oldScore = this.scoreValue;
            // var newScore = oldScore - mul * fireData.bulletIDArray.length;
            let newScore = this.allScore
            // cc.error(fireData.allScore + '::::::::new' + (typeof (fireData.allScore) == 'undefined'))
            fireData.allScore && this.setScoreValue(newScore);
        }
        if ((Date.now() - DataVO.GD.lastFireTick > FireSoundInterval || DataVO.GD.meChairID == this.chairID)) {
            if (DataVO.GD.meChairID == this.chairID) {
                if (this.superBulletNum > 0) {
                    SoundManager.getInstance().playID(15303, "subgame");
                } else if (this.isBitCannon == 1) {
                    SoundManager.getInstance().playID(10303, "subgame");
                } else {
                    SoundManager.getInstance().playID(10303, "subgame");
                }
            } else {
                this.setFireAngle(angle);
            }
            DataVO.GD.lastFireTick = Date.now();
        }

        var lockFish = this.getLockFish();
        if (fireData.bulletBigKind == 1) {
            fireData.allScore && this.superBulletNum--;
            this.leftTimeLabel.string = this.superBulletNum.toString();
            if (this.superBulletNum == 0) {
                this.endMiniBullet();
            }
        }
        if (this.isBitCannon == 1) {//调整炮台显示
            this.launchBitBullet();
        }
        if (lockFish == null || lockFish.fishID != fireData.lockFishID) {
            if (this.chairID != DataVO.GD.meChairID) {
                if (fireData.lockFishID != null) {
                    //-2按原来的方案锁鱼， -1随机锁鱼， 0不锁鱼
                    switch (fireData.lockFishID) {
                        case -2:
                            if (this.getLockFish()) {
                                fireData.lockFishID = this.getLockFish().fishID;
                                this.updateCannonAngle();
                            }
                            else {
                                fireData.lockFishID = null;
                                this.setLockFish(null);
                            }
                            break;
                        case -1:
                            this.setLockFish(null, true);
                            if (this.getLockFish()) {
                                fireData.lockFishID = this.getLockFish().fishID;
                            }
                            else {
                                fireData.lockFishID = null;
                                this.setLockFish(null);
                            }
                            break;
                        case 0:
                            this.setLockFish(null);
                            fireData.lockFishID = null;
                            break;
                        default:
                            this.setLockFish(DataVO.GD.mainScene.fishLayer.getFishByFishID(fireData.lockFishID));
                    }
                }
                else {
                    this.setLockFish(null);
                }

            }
        }
        if (this.lockingFish && this.lockingFish.getComponent("F_CSBY_Fish").valid) {//开火时立即设置角度
            var fishWorldPos = this.lockingFish.parent.convertToWorldSpaceAR((this.lockingFish as cc.Node).getPosition());
            //在屏幕内
            cc.log('是否在屏幕内');
            if (fishWorldPos.x < V.w - DataVO.GD.offsetSize && fishWorldPos.x > DataVO.GD.offsetSize && fishWorldPos.y < V.h && fishWorldPos.y > 0) {
                var muzzlePos = this.gun.node.convertToWorldSpaceAR(cc.v2(0, 0));
                var rotation = Util.calcRotation(muzzlePos, fishWorldPos) + 90;
                if (this.index > 2) {
                    rotation = rotation + -180;
                } else {
                    rotation = rotation;
                }
                this.setFireAngle(rotation)
            }
        }
        //创建子弹
        DataVO.GD.mainScene.bulletLayer.activeBullet(fireData);

        //播放开火动画
        this.fireAni();
    }
    //开火动画
    fireAni() {
        if (this.superBulletNum > 0) {
            //let n= Util.rand(1,8)
            //this.flare.spriteFrame= DataVO.GD.mainScene.animation_1Atlas.getSpriteFrame("SS_Fire2-SS_Fire2_"+ n);
            this.flare.getComponent(cc.Animation).play();
        }
        if (DataVO.GD.mainScene.cannonLayer.cannonArray[this.chairID].paoType == 1) {
            let ske = cc.find('ske', this.yanHuaGun).getComponent(sp.Skeleton)
            let ske1 = cc.find('bske', this.yanHuaGun).getComponent(sp.Skeleton)
            ske.setAnimation(0, 'fire', false)
            ske.setCompleteListener(() => {
                ske.setCompleteListener(null)
                ske.setAnimation(0, 'idle', true)
            })
        }
        if (DataVO.GD.mainScene.cannonLayer.cannonArray[this.chairID].paoType == 2) {
            let ske = cc.find('ske', this.baiHuGun).getComponent(sp.Skeleton)
            ske.setAnimation(0, 'fire', false)
            ske.setCompleteListener(() => {
                ske.setCompleteListener(null)
                ske.setAnimation(0, 'idle', true)
            })

        }
        if (DataVO.GD.mainScene.cannonLayer.cannonArray[this.chairID].paoType == 3) {
            let ske = cc.find('ske', this.qingLongGun).getComponent(sp.Skeleton)
            ske.setAnimation(0, 'fire', false)
            ske.setCompleteListener(() => {
                ske.setCompleteListener(null)
                ske.setAnimation(0, 'idle', true)
            })

        }
        this.flare.node.runAction(cc.sequence(cc.show(), cc.delayTime(0.1), cc.hide()))
        //this.gun.getComponent(cc.Animation).play("cannon")
        if (!this.isMiniBullet()) {
            //由于Math函数接受的是孤度，所以我们先节节点的旋转转化为弧度
            var angle = -this.gun.node.angle / 180 * Math.PI;
            //var angle = 0 / 180 * Math.PI;
            //合成基于 X正方向的方向向量
            var dir = cc.v2(Math.cos(angle), Math.sin(angle));
            //单位化向量
            dir.normalizeSelf();
            this.gun.node.runAction(cc.sequence(cc.moveBy(0.06, -dir.y * 10, -dir.x * 10), cc.moveBy(0.03, dir.y * 12, dir.x * 12), cc.moveBy(0.03, -dir.y * 2, -dir.x * 2)))
            /*if(this.index>2){
                this.gun.node.runAction(cc.sequence(cc.moveBy(0.06,0,10),cc.moveBy(0.03,0,-12),cc.moveBy(0.03,0,2)))
            } else {
                this.gun.node.runAction(cc.sequence(cc.moveBy(0.06,0,-10),cc.moveBy(0.03,0,12),cc.moveBy(0.03,0,-2)))
            }*/
        }
    }

    //结束钻头炮
    endBitBullet() {
        DataVO.GD.mainScene.cannonLayer.setIdelStatus()
        DataVO.GD.effectStop = true
        cc.log("endBitBulletendBitBulletendBitBulletendBitBulletendBitBullet" + this.index)
        this.isBitCannon = 0;//是否钻头炮
        this.isStopSwitchCannon = false;
        //换炮座
        // this.gunbase.spriteFrame = this.cannonAtlas.getSpriteFrame("GP_GunSeat_png");
        // this.gun.node.getComponent(cc.Sprite).enabled = true
        let dis = -200
        // if (this.index > 2) {
        //     dis = -dis
        //     this.gunbase.node.angle = -180;
        //     this.gun.node.angle = -180;
        // } else {
        //     this.gun.node.angle = 0;
        //     this.gunbase.node.angle = 0;
        // }
        if (this.index > 2) {
            dis = -dis
            this.gunbasesub.node.angle = -180;
            this.gunbase.node.angle = -180
            this.gun.node.angle = -180;
        } else {
            this.gun.node.angle = 0;
            this.gunbasesub.node.angle = 0;
            this.gunbase.node.angle = 0
        }
        if (this.gun.node.getChildByName("DrillCannon")) {
            this.gun.node.getChildByName("DrillCannon").removeFromParent();
        }

        this.gun.node.y = this.gun.node.y + dis
        // this.gun.node.runAction(cc.sequence(cc.moveBy(0.4, 0, -dis), cc.callFunc(() => {
        //     if (DataVO.GD.meChairID == this.chairID) {
        //         DataVO.GD.isAllowFire = true
        //         DataVO.GD.mainScene.fishLayer.cancelFrozenFish(2);
        //     }
        //     DataVO.GD.effectStop = true
        // })));
        let orgpos = this.gunbasesub.node.position
        this.gunbasesub.node.runAction(cc.sequence(cc.delayTime(0.5), cc.moveBy(0.2, 0, dis), cc.delayTime(0.2), cc.callFunc(() => {
            this.gunbasesub.node.active = false
            this.gunbasesub.node.position = orgpos
            this.gun.node.getComponent(cc.Sprite).enabled = true
            if (this.gun.node.getChildByName("DrillCannon")) {
                this.gun.node.getChildByName("DrillCannon").removeFromParent();
            }
            this.gun.node.stopAllActions()
            this.gun.node.runAction(cc.sequence(cc.moveBy(0.4, 0, -dis), cc.callFunc(() => {
                if (DataVO.GD.meChairID == this.chairID) {
                    DataVO.GD.isAllowFire = true
                    DataVO.GD.mainScene.fishLayer.cancelFrozenFish(2);
                }
                DataVO.GD.effectStop = false
            })));
        })))
    }
    isBitBullet() {
        if (this.isBitCannon > 0) {
            return true;
        } else {
            return false;
        }

    }
    //发射钻头炮
    launchBitBullet() {
        cc.log("launchBitBulletlaunchBitBulletlaunchBitBullet" + this.index)
        this.isBitCannon = 2;//发射钻头炮状态
        this.bitnum = 0;
        if (this.gun.node.getChildByName("DrillCannon")) {
            this.gun.node.getChildByName("DrillCannon").removeFromParent();
        }
        if (DataVO.GD.meChairID == this.chairID) {
            DataVO.GD.isAllowFire = false
        }
        this.gunbasesub.node.active = true
        cc.log('角度   ' + this.gun.node.angle)
        this.gunbasesub.node.angle = this.gun.node.angle;
    }
    BitBulletState(num) {
        this.setLockFish(null);
        this.bitnum = num;//钻头炮碰撞次数
        if (DataVO.GD.meChairID == this.chairID) {
            DataVO.GD.isAllowFire = true
        }
        this.gun.node.getComponent(cc.Sprite).enabled = false
        if (num < 50 && num > 0) {
            //this.isBitCannon = 1;//是否钻头炮,因为无子弹无法恢复，所以取消
            //this.gunbase.spriteFrame=this.cannonAtlas.getSpriteFrame("GP_Gun3_1");
        } else if (num == 50) {
            this.isBitCannon = 1;//是否钻头炮
            let bullet: cc.Node = DataVO.GD.nodePools.bullet1.getNode();
            bullet.getComponent("F_CSBY_Bullet").enabled = false
            bullet.group = "default"
            bullet.x = 0;
            bullet.y = 0;
            bullet.angle = 0;
            bullet.opacity = 255;
            bullet.name = "DrillCannon"
            bullet.anchorY = -0.22;
            bullet.getChildByName("SS_Gun3_04").y = 99;
            bullet.getChildByName("SS_Gun3_01").y = 69;
            bullet.getChildByName("SS_Gun3_06").active = false;
            bullet.setParent(this.gun.node)
            // this.gunbase.spriteFrame = this.cannonAtlas.getSpriteFrame("GP_Gun3_1");
            // this.gunbase.node.angle = this.gun.node.angle;
        }
    }
    //开始钻头炮
    startBitBullet(num) {
        cc.log("startBitBulletstartBitBulletstartBitBulletstartBitBulletstartBitBullet" + num + "|||" + this.index)
        //钻头炮
        this.setLockFish(null);
        this.isBitCannon = 1;//是否钻头炮
        this.bitnum = num;//钻头炮碰撞次数
        if (DataVO.GD.meChairID == this.chairID) {
            DataVO.GD.isAllowFire = false
            DataVO.GD.effectStop = true
            SoundManager.getInstance().playID(16301, "subgame")
        }
        //换炮座
        let dis = -200
        let dis1 = 40
        if (this.index > 2) {
            dis = -dis
            dis1 = -dis1
            this.gun.node.angle = -180;
        } else {
            this.gun.node.angle = 0;
        }
        this.gun.node.runAction(cc.sequence(cc.moveBy(0.1, 0, dis1), cc.moveBy(0.4, 0, dis), cc.callFunc(() => {
            this.gun.node.y = this.gun.node.y - dis - dis1
            this.gun.node.getComponent(cc.Sprite).enabled = false
            //上子弹
            if (this.isBitCannon == 1) {
                let bullet: cc.Node = DataVO.GD.nodePools.bullet1.getNode();
                bullet.getComponent("F_CSBY_Bullet").enabled = false
                bullet.group = "default"
                bullet.x = 0;
                bullet.y = 0;
                bullet.angle = 0;
                bullet.opacity = 255;
                bullet.name = "DrillCannon"
                bullet.anchorY = -0.22;
                bullet.getChildByName("SS_Gun3_04").y = 99;
                bullet.getChildByName("SS_Gun3_01").y = 69;
                bullet.getChildByName("SS_Gun3_06").active = false;
                bullet.setParent(this.gun.node)
                let bullet1 = cc.instantiate(bullet)
                bullet1.setParent(this.gun.node)
                bullet1.opacity = 100;
                bullet1.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.3, 1.6), cc.fadeOut(0.3)), cc.removeSelf()));

                // this.gunbase.spriteFrame = this.cannonAtlas.getSpriteFrame("GP_Gun3_1");
                // this.gunbase.node.angle = this.gun.node.angle;
                this.gunbasesub.node.active = true
                this.gunbasesub.node.angle = this.gun.node.angle;
            }
            if (DataVO.GD.meChairID == this.chairID) {
                SoundManager.getInstance().playID(16302, "subgame")
                DataVO.GD.isAllowFire = true
            }
        })));

    }

    //结束机枪炮
    endMiniBullet() {
        DataVO.GD.mainScene.cannonLayer.setIdelStatus()
        DataVO.GD.effectStop = true
        this.setLockFish(null);
        DataVO.GD.autoFireFlag = false
        DataVO.GD.mainScene.cannonLayer.autoFireFlag = false
        this.isMiniCannon = false;//是否机枪炮
        this.isStopSwitchCannon = false;
        this.superCannonCard.node.active = false;
        if (DataVO.GD.meChairID == this.chairID) {
            DataVO.GD.isAllowFire = false;
        }
        this.flare.node.y = this.flare.node.y - 6;
        this.gun.node.getComponent(cc.Sprite).enabled = true;
        let dis = -200
        let dis1 = 40
        cc.log('1111111               ' + this.index)
        if (this.index > 2) {
            dis = -dis
            this.gun.node.angle = -180;
        } else {
            this.gun.node.angle = 0;
        }
        // this.gun.node.y = this.gun.node.y + dis
        //DataVO.GD.nodePools.minigun.freeNode(this.gun.node.getChildByName("miniCannon"));不缓存
        this.gun.node.runAction(cc.sequence(cc.moveBy(0.1, 0, dis1), cc.moveBy(0.2, 0, dis), cc.delayTime(0.2), cc.callFunc(() => {
            this.gun.node.getComponent(cc.Sprite).enabled = true;
            this.gun.node.y = this.gun.node.y - dis1
            if (this.gun.node.getChildByName("miniCannon"))
                this.gun.node.getChildByName("miniCannon").removeFromParent();
            this.flare.spriteFrame = DataVO.GD.mainScene.animation_1Atlas.getSpriteFrame("GP_Bullet-GP_Fire_" + this.size);
            this.gun.node.stopAllActions()
            this.gun.node.runAction(cc.sequence(cc.moveBy(0.4, 0, -dis), cc.callFunc(() => {
                if (DataVO.GD.meChairID == this.chairID) {
                    DataVO.GD.isAllowFire = true
                    DataVO.GD.mainScene.fishLayer.cancelFrozenFish(1);
                }
                DataVO.GD.effectStop = false
            })));
        })))
        // if (this.gun.node.getChildByName("miniCannon"))
        //     this.gun.node.getChildByName("miniCannon").removeFromParent();
        // this.flare.spriteFrame = DataVO.GD.mainScene.animation_1Atlas.getSpriteFrame("GP_Bullet-GP_Fire_" + this.size);
        // this.gun.node.runAction(cc.sequence(cc.moveBy(0.4, 0, -dis), cc.callFunc(() => {
        //     if (DataVO.GD.meChairID == this.chairID) {
        //         DataVO.GD.isAllowFire = true
        //         DataVO.GD.mainScene.fishLayer.cancelFrozenFish(1);
        //     }
        // })));
    }
    isMiniBullet() {
        return this.isMiniCannon;
    }
    //设置机枪炮状态
    MiniBulletState(num) {
        cc.log("MiniBulletStateMiniBulletStateMiniBulletStateMiniBulletStateMiniBulletState" + num + "|||" + this.index)
        this.setLockFish(null);
        this.superBulletNum = num;
        this.isMiniCannon = true;//是否机枪炮
        this.leftTimeLabel.string = this.superBulletNum.toString()
        this.superCannonCard.node.active = true;
        if (DataVO.GD.meChairID == this.chairID) {
            DataVO.GD.isAllowFire = false;
            SoundManager.getInstance().playID(15301, "subgame")
        }
        this.flare.node.y = this.flare.node.y + 6;
        let dis = -200
        if (this.index > 2) {
            dis = -dis
            this.gun.node.angle = -180;
        } else {
            this.gun.node.angle = 0;
        }
        this.gun.node.runAction(cc.sequence(cc.moveBy(0, 0, dis), cc.callFunc(() => {
            //换炮台
            this.gun.node.getComponent(cc.Sprite).enabled = false
            this.gun.node.y = this.gun.node.y - dis
            let minigun: cc.Node = DataVO.GD.nodePools.minigun.getNode();
            minigun.name = "miniCannon"
            minigun.setParent(this.gun.node)
            minigun.getChildByName("Barrel").active = false;
            minigun.getChildByName("effect").active = false;
            minigun.getChildByName("body").getComponent(cc.Animation).play();
            this.schedule(function () {
                minigun.getChildByName("Barrel").active = true;
                minigun.getChildByName("effect").active = true;
                minigun.getChildByName("Barrel").y = -4;
                minigun.getChildByName("Barrel").runAction(cc.moveTo(0.3, 0, 45));
                if (DataVO.GD.meChairID == this.chairID) {
                    DataVO.GD.isAllowFire = true
                    SoundManager.getInstance().playID(15302, "subgame")
                }
            }, 0.1, 0);
        })));
    }
    //开始机枪炮
    startMiniBullet(num) {
        cc.log("startMiniBulletstartMiniBulletstartMiniBulletstartMiniBulletstartMiniBullet" + num + "|||" + this.index)
        this.setLockFish(null);
        //机枪炮
        if (this.superBulletNum == 0) {
            this.superBulletNum = num;
            this.isMiniCannon = true;//是否机枪炮
            cc.log("aaaaa" + this.superBulletNum.toString())
            cc.log("aaaaa" + this.superBulletNum)
            this.leftTimeLabel.string = this.superBulletNum.toString()
            this.superCannonCard.node.active = true;
            if (DataVO.GD.meChairID == this.chairID) {
                DataVO.GD.isAllowFire = false;
                DataVO.GD.effectStop = true
                SoundManager.getInstance().playID(15301, "subgame")
            }
            this.flare.node.y = this.flare.node.y + 6;

            let dis = -200
            let dis1 = 40
            if (this.index > 2) {
                dis = -dis
                dis1 = -dis1
                this.gun.node.angle = -180;
            } else {
                this.gun.node.angle = 0;
            }
            this.gun.node.runAction(cc.sequence(cc.moveBy(0.1, 0, dis1), cc.moveBy(0.4, 0, dis), cc.callFunc(() => {
                //换炮台
                this.gun.node.getComponent(cc.Sprite).enabled = false
                this.gun.node.y = this.gun.node.y - dis - dis1
                let minigun: cc.Node = DataVO.GD.nodePools.minigun.getNode();
                minigun.name = "miniCannon"
                minigun.setParent(this.gun.node)
                minigun.getChildByName("Barrel").active = false;
                minigun.getChildByName("effect").active = false;
                minigun.getChildByName("body").getComponent(cc.Animation).play();
                this.schedule(function () {
                    minigun.getChildByName("Barrel").active = true;
                    minigun.getChildByName("effect").active = true;
                    minigun.getChildByName("Barrel").y = -4;
                    minigun.getChildByName("Barrel").runAction(cc.moveTo(0.3, 0, 45));
                    if (DataVO.GD.meChairID == this.chairID) {
                        DataVO.GD.isAllowFire = true
                        SoundManager.getInstance().playID(15302, "subgame")
                    }
                }, 0.2, 0);
            })));
        } else {
            this.superBulletNum = num;
            this.leftTimeLabel.string = this.superBulletNum.toString();
        }
    }

    //结束魔能炮
    endSuperBullet() {
        this.isSuperCannon = false;//是否魔能炮
        this.isStopSwitchCannon = false;
        this.superCannonCard.node.active = false;

        this.subMulBtn.node.active = true;
        this.addMulBtn.node.active = true;
    }
    isSuperBullet() {
        return this.isSuperCannon;
    }

    //开始魔能炮
    startSuperBullet() {
        //魔能炮
        this.isSuperCannon = true;//是否魔能炮
        this.superCannonCard.node.active = true;

        this.leftTimeValue = DataVO.GD.fishConfig.elaspedBulletIon - 3;            //因为有魔能炮从卡片移动过来的， 做动画时间， 所以要扣除一下
        this.leftTimeLabel.string = this.leftTimeValue

        // this.gun.display("#res/likuipiyu/cannon/gun2_" + GD.fishConfig.cannonKindConfigArray[this.cannonConfigIndex].size + ".png");

        this.subMulBtn.node.active = false;
        this.addMulBtn.node.active = false;
    }


    //键盘左移炮筒
    leftMoveCannon() {
        let rotation;
        this.gun.node.getRotation(rotation);
        rotation -= 2;
        rotation = Math.max(rotation, -90);
        this.gun.node.angle = -(rotation);
    }

    //键盘右移炮筒
    rightMoveCannon() {
        let rotation;
        this.gun.node.getRotation(rotation);
        rotation += 2;
        rotation = Math.min(rotation, 90);
        this.gun.node.angle = -(rotation);
    }
}
