import { DataVO } from "../../../../plaza/model/DataVO";
import { FishKind, subGameMSG } from "../SubGameMSG";
import { GFireRotation } from "../F_CSBY_Config";
import { EventManager } from "../../../../common/managers/EventManager";
import F_CSBY_Cannon from "../node/F_CSBY_Cannon";
import SystemToast from "../../../../extend/ui/SystemToast";
import SoundManager from "../../../../common/managers/SoundManager";
import Util from "../../../../extend/Util";
import F_CSBY_Fish from "../node/F_CSBY_Fish";

const { ccclass, property } = cc._decorator;
/**
 * 大炮层
 */

@ccclass
export default class F_CSBY_CannonLayer extends cc.Component {

    @property(F_CSBY_Cannon)
    cannon1: F_CSBY_Cannon = null;
    @property(F_CSBY_Cannon)
    cannon2: F_CSBY_Cannon = null;
    @property(F_CSBY_Cannon)
    cannon3: F_CSBY_Cannon = null;
    @property(F_CSBY_Cannon)
    cannon4: F_CSBY_Cannon = null;
    @property(cc.Button)
    autobtn: cc.Button = null;
    @property(cc.Button)
    aimbtn: cc.Button = null;
    @property(cc.SpriteAtlas)
    cannonAtlas: cc.SpriteAtlas = null;
    @property(cc.Node)
    yanhuaBtn: cc.Node = null
    @property(cc.Node)
    baihuBtn: cc.Node = null
    @property(cc.Node)
    qinglongBtn: cc.Node = null
    @property(cc.Node)
    jubaolianlianBtn: cc.Node = null

    canClickChangeNewPao: boolean = true
    myYanHuBool: number = 1;
    myBaiHuBool: number = 1;
    myQingLongBool: number = 1;

    @property(cc.Label)
    yanHuaLabel: cc.Label = null;
    @property(cc.Label)
    baiHuLabel: cc.Label = null;
    @property(cc.Label)
    qingLongLabel: cc.Label = null;

    cannonArray;
    cannonPos: cc.Vec2;
    mouseFireDown: false;                    //用户鼠标开火键是否按下
    autoFire: boolean = false;                         //自动开火
    autoFireFlag: boolean = false;                         //自动开火标记

    elapsed = 0.0;                             //累计时间
    lastFireTime = -100.0;                   //最后一次开火时间
    cannonContainer;

    progress: number = 0;


    ////////////////////////////////////////////////////////////////////
    onLoad() {
        this.cannonArray = [];
        this.cannonArray.push(this.cannon1);
        this.cannonArray.push(this.cannon2);
        this.cannonArray.push(this.cannon3);
        this.cannonArray.push(this.cannon4);
        cc.log(cc.winSize.width)
        if (cc.winSize.width < 1280) {
            this.cannon1.node.setScale(1.1)
            this.cannon2.node.setScale(1.1)
            this.cannon3.node.setScale(1.1)
            this.cannon4.node.setScale(1.1)
            this.autobtn.node.setScale(1.1)
            this.aimbtn.node.setScale(1.1)
            cc.log("1.41.41.41.41.41.41.41.41.41.41.41.41.4")
        }
        if (cc.winSize.width < 960) {
            this.cannon1.node.setScale(0.9)
            this.cannon2.node.setScale(0.9)
            this.cannon3.node.setScale(0.9)
            this.cannon4.node.setScale(0.9)
            this.autobtn.node.setScale(0.9)
            this.aimbtn.node.setScale(0.9)
            cc.log("1.21.21.21.21.21.21.21.21.21.21.21.21.2")
        }
        this.initEx();
        this.eventList();
        this.setNewBtnStatus();
        this.autobtn.node.on(cc.Node.EventType.TOUCH_END, this.setAuto, this);
        this.aimbtn.node.on(cc.Node.EventType.TOUCH_END, this.seAim, this);

        this.yanhuaBtn.on(cc.Node.EventType.TOUCH_END, this.onChangeStatus, this)
        this.baihuBtn.on(cc.Node.EventType.TOUCH_END, this.onChangeStatus, this)
        this.qinglongBtn.on(cc.Node.EventType.TOUCH_END, this.onChangeStatus, this)
        this.jubaolianlianBtn.on(cc.Node.EventType.TOUCH_END, this.onClickJuBaoLianLian, this)
    }

    onClickJuBaoLianLian() {
        if (this.progress >= 1) {
            DataVO.GD.mainScene.sendGameData(subGameMSG.SUB_C_FINISH_LIANLIAN, {});
        }
        // let rd = Util.randNum(0, 1)
        // this.updateTaskPro(rd > 0.8 ? 1 : rd)
        // this.updateTaskPro(1)
    }

    ohterChooseYuanBao(data) {

    }

    openC

    eventList(): void {
        EventManager.getInstance().addEventListener("unlockFish", this.unlockFish, this);
        EventManager.getInstance().addEventListener("onUserEnter", this.onUserEnter, this);
        EventManager.getInstance().addEventListener("onUserLeave", this.onUserLeave, this);
    }

    setNewPaoValue(data) {
        let mul = data.cannonIndex + 1
        cc.log('----setNewPaoValue------');
        cc.log(mul);
        this.yanHuaLabel.string = `${(mul * 0.03).toFixed(2)}`
        this.baiHuLabel.string = `${(mul * 0.06).toFixed(2)}`
        this.qingLongLabel.string = `${(mul * 0.15).toFixed(2)}`
    }

    setNewBtnStatus() {
        cc.log('---------setNewBtnStatus----------');
        if (this.canClickChangeNewPao == false) {
            return
        }
        this.canClickChangeNewPao = false
        cc.log(DataVO.GD.selectRoom);
        this.myYanHuBool = 1;
        this.myBaiHuBool = 1;
        this.myQingLongBool = 1;
        if (DataVO.GD.selectRoom.roomType == 1) {//烟花炮
            this.yanhuaBtn.active = true
            this.baihuBtn.active = true
            this.qinglongBtn.active = false
        } else {//白虎炮 青龙炮
            this.yanhuaBtn.active = false
            this.baihuBtn.active = true
            this.baihuBtn.position = this.yanhuaBtn.position
            this.qinglongBtn.active = true
        }
    }

    onClickNewBtn() {
        this.onClickYanHuaBtn()
        this.onClickBaiHuBtn()
        this.onClickQiongLongBtn()
    }

    setGrayStatus() {
        this.myYanHuBool = 0
        this.myBaiHuBool = 0
        this.myQingLongBool = 0
        this.onClickNewBtn()
    }

    setIdelStatus() {
        this.myYanHuBool = 1
        this.myBaiHuBool = 1
        this.myQingLongBool = 1
        this.onClickNewBtn()
    }

    requestChangeXinPao(num: number = 0) {
        let fishes = DataVO.GD.mainScene.fishLayer.node.children
        if (num != 0) {
            let fkind = FishKind.FishKind1
            if (num == 1) {
                fkind = FishKind.FishKind4
            }
            if (num == 2) {
                fkind = FishKind.FishKind7
            }
            if (num == 3) {
                fkind = FishKind.FishKind13
            }
            for (let i = 0; i < fishes.length; i++) {
                if (fishes[i].getComponent(F_CSBY_Fish).fishKind < fkind) {
                    fishes[i].opacity = 128
                }
            }
            this.cannonArray[DataVO.GD.meChairID].resetAngle();
            //自动不可选
            cc.find('BackgroundGray', this.autobtn.node).active = true
            DataVO.GD.mainScene.fishLayer.lockFishStatus = true
            //取消锁定鱼
            DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].unlockFish()
        } else {
            for (let i = 0; i < fishes.length; i++) {
                fishes[i].opacity = 255
            }
            //自动可选
            cc.find('BackgroundGray', this.autobtn.node).active = false
            DataVO.GD.mainScene.fishLayer.lockFishStatus = false
        }
        let msg = { chairID: DataVO.GD.meChairID, paoType: num };
        DataVO.GD.mainScene.sendGameData(subGameMSG.SUB_C_CHANGE_XINPAO, msg);
    }

    onChangeStatus(event, customEventData) {
        cc.log(event.target.name);
        let str = event.target.name
        if (str == 'yanhua') {
            if (this.myYanHuBool == 1) {
                this.myYanHuBool = 2
                this.myBaiHuBool = 1
                this.myQingLongBool = 1
                this.requestChangeXinPao(1)
            } else if (this.myYanHuBool == 2) {
                this.myYanHuBool = 1
                this.myBaiHuBool = 1
                this.myQingLongBool = 1
                this.requestChangeXinPao(0)
            }
        } else if (str == 'baihu') {
            if (this.myBaiHuBool == 1) {
                this.myYanHuBool = 1
                this.myBaiHuBool = 2
                this.myQingLongBool = 1
                this.requestChangeXinPao(2)
                DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].playPaoAni('hu')
            } else if (this.myBaiHuBool == 2) {
                this.myYanHuBool = 1
                this.myBaiHuBool = 1
                this.myQingLongBool = 1
                this.requestChangeXinPao(0)
            }
        } else if (str == 'qionglong') {
            if (this.myQingLongBool == 1) {
                this.myYanHuBool = 1
                this.myBaiHuBool = 1
                this.myQingLongBool = 2
                this.requestChangeXinPao(3)
                DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].playPaoAni('long')
            } else if (this.myQingLongBool == 2) {
                this.myYanHuBool = 1
                this.myBaiHuBool = 1
                this.myQingLongBool = 1
                this.requestChangeXinPao(0)
            }
        }
        cc.log('-----onChangeStatus------');
        cc.error(this.myYanHuBool + '      ' + this.myBaiHuBool + '      ' + this.myQingLongBool);
        this.onClickNewBtn()
    }

    onClickYanHuaBtn() {// 0 全灰色 3 全idle  1 idle  2 选中       
        let ske = cc.find('spske', this.yanhuaBtn)
        if (this.myYanHuBool == 0) {
            ske.getComponent(sp.Skeleton).setAnimation(0, 'bianpaoh', true)
        }
        if (this.myYanHuBool == 1) {
            ske.getComponent(sp.Skeleton).setAnimation(0, 'bianpaojingtai', true)
        }
        if (this.myYanHuBool == 2) {
            ske.getComponent(sp.Skeleton).setAnimation(0, 'bianpao', true)
        }
    }

    onClickBaiHuBtn() {
        let ske = cc.find('spske', this.baihuBtn)
        if (this.myBaiHuBool == 0) {
            ske.getComponent(sp.Skeleton).setAnimation(0, 'huh', true)
        }
        if (this.myBaiHuBool == 1) {
            ske.getComponent(sp.Skeleton).setAnimation(0, 'hujingtai', true)
        }
        if (this.myBaiHuBool == 2) {
            ske.getComponent(sp.Skeleton).setAnimation(0, 'hu', true)
        }
    }

    onClickQiongLongBtn() {
        let ske = cc.find('spske', this.qinglongBtn)
        if (this.myQingLongBool == 0) {
            ske.getComponent(sp.Skeleton).setAnimation(0, 'longh', true)
        }
        if (this.myQingLongBool == 1) {
            ske.getComponent(sp.Skeleton).setAnimation(0, 'longjingtai', true)
        }
        if (this.myQingLongBool == 2) {
            ske.getComponent(sp.Skeleton).setAnimation(0, 'long', true)
        }
    }

    updateJuBaoTask(data) {
        cc.log('--------updateJuBaoTask-------');
        cc.log(data);
        if (data.fishID == -1) {
            this.updateTaskPro(data.progress)
            return
        }
        let coin = cc.find('specialCoin', this.node)
        coin.active = true
        let fish = DataVO.GD.mainScene.fishLayer.getFishByFishID(data.fishID)
        let p0 = Util.nd1tondd2(this.node, fish)
        let p1 = cc.v2(250, -85);
        let p2 = cc.v2(400, 32);
        let p3 = cc.v2(580, -100);
        coin.position = p0
        cc.Tween.stopAllByTarget(coin)
        cc.tween(coin).to(0.5, { position: p1 }).to(0.9, { position: p2 }).to(0.5, { position: p3 })
            .call(() => {
                coin.active = false
                this.updateTaskPro(data.progress)
            })
            .start();
    }

    updateTaskPro(progress: number = 0) {
        this.progress = progress
        let ske = cc.find('spske', this.jubaolianlianBtn).getComponent(sp.Skeleton);
        if (progress == 1) {
            ske.setAnimation(0, 'pink2', false)
            ske.setCompleteListener(() => {
                ske.setCompleteListener(null)
                ske.setAnimation(0, 'pink3', true)
            })
        } else {
            ske.setAnimation(0, 'blue', true)
            let proNode = cc.find('pro', this.jubaolianlianBtn)
            proNode.height = progress * 55
        }
    }

    //设置自动
    setAuto() {
        if (!this.cannonArray[DataVO.GD.meChairID].isScoreCanFire(null, DataVO.GD.isRageMode) && !this.autoFire) {//分数是否足够打一炮
            //GD.uiLayer.showTooManyBullet();                          
            this.cannonArray[DataVO.GD.meChairID].showNoMoney();
            return;
        }
        if (DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].isBitBullet() && !DataVO.GD.mainScene.fishLayer.lockFishStatus) {
            return;
        }
        if (DataVO.GD.mainScene.fishLayer.lockFishStatus) {
            this.seAim();
        }
        this.autoFire = !this.autoFire
        if (!this.autoFire) {
            this.autoFireFlag = false
            DataVO.GD.autoFireFlag = false
        }
        DataVO.GD.autoFire = this.autoFire
        DataVO.GD.autoFireFlag = this.autoFire
        cc.log(this.autobtn.node.getChildByName("Select"))
        cc.log(this.autoFire)
        if (this.autoFire) {
            SoundManager.getInstance().playID(1203, "subgame");
            this.autobtn.node.getChildByName("Select").active = true;
            this.autobtn.node.getChildByName("effect").active = true;
        } else {
            SoundManager.getInstance().playID(1204, "subgame");
            this.autobtn.node.getChildByName("Select").active = false;
            this.autobtn.node.getChildByName("effect").active = false;
            DataVO.GD.mainScene.windowsLayer.node.getChildByName("SS_Touch").active = false;

        }
    }

    //设置瞄准
    seAim() {
        cc.log(DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].isBitBullet())
        cc.log(!DataVO.GD.mainScene.fishLayer.lockFishStatus)
        if (!this.cannonArray[DataVO.GD.meChairID].isScoreCanFire(null, DataVO.GD.isRageMode) && !DataVO.GD.mainScene.fishLayer.lockFishStatus) {//分数是否足够打一炮
            //GD.uiLayer.showTooManyBullet();                          
            this.cannonArray[DataVO.GD.meChairID].showNoMoney();
            return;
        }
        if (DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].isBitBullet() && !DataVO.GD.mainScene.fishLayer.lockFishStatus) {
            return;
        }
        if (this.autoFire) {
            this.setAuto();
        }
        DataVO.GD.mainScene.fishLayer.lockFishStatus = !DataVO.GD.mainScene.fishLayer.lockFishStatus
        if (DataVO.GD.mainScene.fishLayer.lockFishStatus) {
            SoundManager.getInstance().playID(1203, "subgame");
            this.aimbtn.node.getChildByName("Select").active = true;
            this.aimbtn.node.getChildByName("effect").active = true;
        } else {
            SoundManager.getInstance().playID(1204, "subgame");
            DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].unlockFish();
            this.aimbtn.node.getChildByName("Select").active = false;
            this.aimbtn.node.getChildByName("effect").active = false;
        }
    }

    cleanup() {
        // 清除点击事件
    }

    initEx() {
        for (var i = 0; i < 4; ++i) {
            (this.cannonArray[i].player as cc.Node).active = false;
        }
    }
    //当用户进入
    onUserEnter(name, userItem) {
        cc.log("onUserEnteronUserEnteronUserEnteronUserEnter!!!!!" + DataVO.GD.isRotation)
        cc.log(userItem)
        var chairID = userItem.getChairID();
        var money = userItem.getUserScore();
        this.cannonArray[chairID].setScoreValue(money);
        if (DataVO.GD.fishConfig) {
            this.cannonArray[chairID].setCannonConfigIndex(DataVO.GD.fishConfig.defCannonIndex);
        }
        this.cannonArray[chairID].onActivation(chairID);
        this.cannonArray[chairID].setLockFish(null);
        this.cannonArray[chairID].setNickname(userItem.getNickname());
        this.cannonArray[chairID].setVIPLevel(userItem.getMemberOrder());
        this.cannonArray[chairID].setRegion(userItem.getRegion());
        this.cannonArray[chairID].player.active = true;
        this.cannonArray[chairID].waitting.node.active = false;
    }
    //当用户离开
    onUserLeave(name, userItem) {
        var chairID = userItem.getChairID();
        this.cannonArray[chairID].reset();
        this.cannonArray[chairID].player.active = false;
        this.cannonArray[chairID].waitting.node.active = true;
    }
    //调整视图
    rotationView() {
        this.cannonArray = [];
        this.cannonArray.push(this.cannon3);
        this.cannonArray.push(this.cannon4);
        this.cannonArray.push(this.cannon1);
        this.cannonArray.push(this.cannon2);
    }
    //随机锁鱼
    randomLockFish(chairID) {
        if (DataVO.GD.switingScene) {
            return;
        }
        var oldLockFish = this.cannonArray[chairID].getLockFish();
        var newLockFish = DataVO.GD.mainScene.fishLayer.getRandomLockFish(chairID, oldLockFish);
        if (newLockFish) {
            this.cannonArray[chairID].setLockFish(newLockFish);
        }
    }
    //结束魔能炮
    endSuperBullet(chairID) {
        this.cannonArray[chairID].endSuperBullet();
    }
    //开始魔能炮
    startSuperBullet(chairID) {
        //调用触发魔能炮
        this.cannonArray[chairID].startSuperBullet();
    }
    /**
     * 停止切换大炮
     * @param chairID
     */
    stopSwitchCannon(chairID) {
        //调用触发魔能炮
        this.cannonArray[chairID].stopSwitchCannon();
    }



    //有用户换特殊大炮
    onGameEventChangeNewBullet(data) {
        if (data.chairID == DataVO.GD.meChairID) {
            this.canClickChangeNewPao = true
        }
        this.cannonArray[data.chairID].paoType = data.paoType
        this.cannonArray[data.chairID].onChangeNewFlag(true);
        if (data.paoType == 0) {//切换为普通炮
            this.cannonArray[data.chairID].yanHuaGun.active = false
            this.cannonArray[data.chairID].baiHuGun.active = false
            this.cannonArray[data.chairID].qingLongGun.active = false
        }
        if (data.paoType == 1) {//切换为烟花
            this.cannonArray[data.chairID].yanHuaGun.active = true
            this.cannonArray[data.chairID].baiHuGun.active = false
            this.cannonArray[data.chairID].qingLongGun.active = false
        }
        if (data.paoType == 2) {//切换为白虎
            this.cannonArray[data.chairID].yanHuaGun.active = false
            this.cannonArray[data.chairID].baiHuGun.active = true
            this.cannonArray[data.chairID].qingLongGun.active = false
        }
        if (data.paoType == 3) {//切换为青龙
            this.cannonArray[data.chairID].yanHuaGun.active = false
            this.cannonArray[data.chairID].baiHuGun.active = false
            this.cannonArray[data.chairID].qingLongGun.active = true
        }
    }

    //有用户换炮
    onGameEventChangeBullet(data) {
        if (data.chairID == DataVO.GD.meChairID) {
            DataVO.GD.canChangeCannon = true
            // cc.log('切炮服务器已经返回，可以切炮')
            this.setNewPaoValue(data)
        }
        this.cannonArray[data.chairID].changeMulSuccess(data)
        this.cannonArray[data.chairID].onChangeBullet(data);
    }
    //当用户开火
    onUserFire(fireData) {
        //客户端自己发的，可能失败被收回
        if (fireData.clientData) {
            // this.cannonArray[fireData.chairID].fire(fireData);
            EventManager.getInstance().raiseEvent('isFire', true);
        }
        //服务端下发的
        else {
            this.cannonArray[fireData.chairID].allScore = fireData.allScore
            this.cannonArray[fireData.chairID].fire(fireData);
            //服务端下发的需要过渡掉自己的， 因为自己的已经开过炮了, 旁观则都要接收
            if (fireData.chairID != DataVO.GD.meChairID || DataVO.GD.isLookonMode) {
                // this.cannonArray[fireData.chairID].fire(fireData);
            }
            else {
                DataVO.GD.nowBulletNum = fireData.nowBulletNum
                DataVO.GD.noticeFalg = false;
                for (let i = 0; i < fireData.bulletIDArray.length; ++i) {
                    DataVO.GD.payMoney += Number(DataVO.GD.fishConfig.cannonKindConfigArray[fireData.cannonIndex].multiple);
                }
                EventManager.getInstance().raiseEvent('isFire', true);

            }
        }
    }
    //全部不锁鱼了， 鱼阵来时调用
    allUnlockFish() {
        for (let i = 0; i < this.cannonArray.length; ++i) {
            this.unlockFish("", null);
        }
    }
    unlockFish(name, data) {
        for (let i = 0; i < this.cannonArray.length; ++i) {
            if (data == null || data["fish"] == this.cannonArray[i].getLockFish()) {
                //一条鱼可以会被多个玩家锁定， 不要break
                this.cannonArray[i].unlockFish();
            }
        }
    }
    setLockFish(chairID, fish) {
        this.cannonArray[chairID].setLockFish(fish);
    }
    update(dt) {
        //开启自动就一直打，不能瞄准，只调整方向
        //开启瞄准判断能否点到鱼 点到鱼 锁定鱼 没点到 有锁定就解锁
        //未开启瞄准发炮
        //修正炮位
        if (DataVO.GD.meChairID != null && DataVO.GD.fishConfig) {
            this.elapsed += dt;

            // if (!this.cannonArray[DataVO.GD.meChairID].isScoreCanFire(null, DataVO.GD.isRageMode)) {
            //     this.cannonArray[DataVO.GD.meChairID].showNoMoney();
            // }
            // else {
            this.cannonArray[DataVO.GD.meChairID].hideNoMoney();
            if (DataVO.GD.effectStop) {//在自动或者长按状态下 打中机关炮 钻头 需要重新点击才能再次开火
                return
            }
            // cc.log('-------cannonlayer update-------');
            // cc.log(this.mouseFireDown + '          ' + this.autoFireFlag + '       ' + DataVO.GD.newPaoSelect);
            // if (this.mouseFireDown || this.autoFireFlag || this.cannonArray[DataVO.GD.meChairID].lockingFish) {
            if (this.mouseFireDown || this.autoFireFlag || (this.cannonArray[DataVO.GD.meChairID].lockingFish && this.cannonArray[DataVO.GD.meChairID].paoType == 0) || (DataVO.GD.newPaoSelect == true && this.cannonArray[DataVO.GD.meChairID].lockingFish)) {
                if (!this.mouseFireDown && this.cannonArray[DataVO.GD.meChairID].isBitCannon == 1) {
                    return;
                }
                if (DataVO.GD.newPaoSelect == true && this.aimbtn.node.getChildByName("Select").active == false) {//如果没有选择瞄准，并且选中了特殊得新炮，则每发射一炮现需要再次点击才能发射炮弹
                    DataVO.GD.newPaoSelect = false
                }
                var fireInterval = this.cannonArray[DataVO.GD.meChairID].isMiniBullet() ? DataVO.GD.fishConfig.jgqfireInterval / DataVO.GD.speedModeMul : DataVO.GD.fishConfig.fireInterval / DataVO.GD.speedModeMul;
                //isAllowFire 允许开火
                if (DataVO.GD.isReady && DataVO.GD.isAllowFire && this.elapsed >= this.lastFireTime + fireInterval) {
                    var fireBulletNum = 1;
                    if (DataVO.GD.isRageMode) {// 是否狂暴模式
                        fireBulletNum = GFireRotation.length;
                    }
                    if (this.cannonArray[DataVO.GD.meChairID].superBulletNum == 0 && !this.cannonArray[DataVO.GD.meChairID].isScoreCanFire(null, DataVO.GD.isRageMode)) {//分数是否足够打一炮
                        //GD.uiLayer.showTooManyBullet();           
                        this.cannonArray[DataVO.GD.meChairID].showNoMoney();
                        return;
                    }
                    if (DataVO.GD.fishConfig.maxBulletNum < DataVO.GD.nowBulletNum + fireBulletNum) {
                        // SystemToast.GetInstance().buildToast("111您发射的子弹过多， 请稍候");
                        DataVO.GD.bulletMany = true
                        //DataVO.GD.mainScene.uiLayer.showTooManyBullet();
                        return;
                    }
                    DataVO.GD.bulletMany = false
                    var oldRotation = -this.cannonArray[DataVO.GD.meChairID].gun.node.angle;//炮的原始坐标

                    DataVO.GD.noActionTime = 0;        //重置 没动作时间

                    //请求开火数据包
                    var requestFireData: { [k: string]: any } = {};
                    requestFireData.isRageMode = DataVO.GD.isRageMode;
                    if (DataVO.GD.isRageMode) {
                        requestFireData.angleArray = [];
                        requestFireData.bulletIDArray = [];
                        for (var i = 0; i < GFireRotation.length; ++i) {
                            requestFireData.angleArray.push(oldRotation + GFireRotation[i]);
                            requestFireData.bulletIDArray.push(DataVO.GD.bulletID++);
                        }
                    }
                    else {
                        requestFireData.angleArray = [oldRotation];
                        requestFireData.bulletIDArray = [DataVO.GD.bulletID++];
                    }
                    requestFireData.cannonIndex = this.cannonArray[DataVO.GD.meChairID].getCannonIndex();


                    requestFireData.isSuperBullet = this.cannonArray[DataVO.GD.meChairID].isSuperBullet();
                    requestFireData.drillBulletNum = this.cannonArray[DataVO.GD.meChairID].bitnum;
                    requestFireData.superBulletNum = this.cannonArray[DataVO.GD.meChairID].superBulletNum;
                    if (this.cannonArray[DataVO.GD.meChairID].bitnum == 50) {
                        requestFireData.bulletBigKind = 2
                    } else if (this.cannonArray[DataVO.GD.meChairID].superBulletNum > 0) {
                        requestFireData.bulletBigKind = 1
                    } else {
                        requestFireData.bulletBigKind = 0
                    }
                    // if (this.cannonArray[DataVO.GD.meChairID].lockingFish && this.cannonArray[DataVO.GD.meChairID].superBulletNum <= 0) {
                    if (this.cannonArray[DataVO.GD.meChairID].lockingFish && this.cannonArray[DataVO.GD.meChairID].bitnum <= 0) {
                        requestFireData.lockFishID = this.cannonArray[DataVO.GD.meChairID].lockingFish.getComponent("F_CSBY_Fish").fishID;
                    }

                    //发送开火请求给服务端

                    DataVO.GD.mainScene.sendGameData(subGameMSG.SUB_C_USER_FIRE, requestFireData);
                    // for(let i=0;i<30;i++){
                    //     DataVO.GD.mainScene.sendGameData(subGameMSG.SUB_C_USER_FIRE, requestFireData);
                    // }

                    this.lastFireTime = this.elapsed;

                    ////////////////////////////////////////////////////////////////////////

                    var fireData: { [k: string]: any } = {};

                    fireData.cannonIndex = requestFireData.cannonIndex;
                    fireData.angleArray = requestFireData.angleArray;
                    fireData.bulletIDArray = requestFireData.bulletIDArray;
                    //空就不传了,浪费流量
                    fireData.clientData = true;
                    fireData.chairID = DataVO.GD.meChairID;
                    fireData.isSuperBullet = requestFireData.isSuperBullet;
                    fireData.bulletBigKind = requestFireData.bulletBigKind;
                    fireData.drillBulletNum = requestFireData.drillBulletNum;
                    fireData.superBulletNum = requestFireData.superBulletNum;
                    if (this.cannonArray[DataVO.GD.meChairID].lockingFish && fireData.drillBulletNum <= 0) {
                        fireData.lockFishID = this.cannonArray[DataVO.GD.meChairID].lockingFish.getComponent("F_CSBY_Fish").fishID;
                    }

                    this.onUserFire(fireData);
                    DataVO.GD.nowBulletNum += fireBulletNum;
                    if (this.elapsed > 0.3 && !DataVO.GD.mainScene.fishLayer.lockFishStatus) {
                        DataVO.GD.mainScene.windowsLayer.node.getChildByName("SS_Touch").active = true;
                    }

                }
            }
            // }
        }
    }
    updataAllScore(data) {
        cc.log(data);
        for (let i = 0; i < data.length; i++) {
            this.cannonArray[data[i].chairID].setScoreValue(data[i].fishScore);
        }
    }

    onDestroy() {
        EventManager.getInstance().removeEventListener("unlockFish", this.unlockFish, this);
        EventManager.getInstance().removeEventListener("onUserEnter", this.onUserEnter, this);
        EventManager.getInstance().removeEventListener("onUserLeave", this.onUserLeave, this);
    }
}
