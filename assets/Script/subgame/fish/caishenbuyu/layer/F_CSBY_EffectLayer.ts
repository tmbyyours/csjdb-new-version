/**
 * 特效层
 */

import { FishKind, subGameMSG } from "../SubGameMSG";
import { GFishKindAnimationFN, V } from "../F_CSBY_Config";
import { DataVO } from "../../../../plaza/model/DataVO";
import Util from "../../../../extend/Util";
import F_CSBY_Fish from "../node/F_CSBY_Fish";
import DelayedAction from "../common/DelayedAction ";

const { ccclass, property } = cc._decorator;

@ccclass
export default class C_CSBY_EffectLayer extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    pos: cc.Node[] = []
    lvguipos: cc.Node[] = []
    w: number = 0
    h: number = 0
    onLoad() {
        for (let i = 0; i < 11; i++) {
            this.pos[i] = cc.find(`baoJiPos/${i}`, this.node)
        }

        for (let i = 0; i < 6; i++) {
            this.lvguipos[i] = cc.find(`lvGuiPos/${i}`, this.node)
        }

        this.w = cc.winSize.width
        this.h = cc.winSize.height
    }

    baojiPos

    //暴击跳动
    showBaoJi(rateNum: number = 1, baojiscore: number = 1, fishPos, chairID, callbo: boolean = false) {
        cc.log('-------showBaoJi--------');
        let item = DataVO.GD.nodePools['baoJiNode'].getNode();
        let stpos = fishPos

        if (DataVO.GD.isRotation && !callbo) {
            // stpos = Util.nd1tondd2(this.node, fishNode)
            // this.coinLayer.node.setPosition(cc.v2(640, 360));
            // this.fishLayer.node.setPosition(cc.v2(640, 360));
            stpos = Util.getSymmetricPoint(stpos, cc.v2(this.w * 0.5, this.h * 0.5))
        }
        item.position = stpos
        item.parent = this.node
        let rate = cc.find('rate', item)
        let score = cc.find('score', item)
        let rd = Util.randNum(0, 9, true)
        let tpos = DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].getMuzzleWorldPosIgnoreLayerRotation();
        if (chairID == DataVO.GD.meChairID) {
            item.opacity = 255
        } else {
            item.opacity = 128
        }
        this.baojiPos = this.pos[rd].position
        cc.tween(item).to(0.65, { position: this.pos[rd].position, opacity: chairID == DataVO.GD.meChairID ? 255 : 128 }).delay(2.6)
            .to(0.45, { position: tpos, opacity: 128 })
            .call(() => {
                item.removeFromParent();
                DataVO.GD.nodePools['baoJiNode'].freeNode(item);
            })
            .delay(0.5)
            .start();
        // cc.tween(item).bezierTo(0.5, cc.v2(this.pos[rd].position.x, this.pos[rd].position.y), cc.v2(tpos.x, tpos.y), cc.v2(tpos.x, tpos.y))
    }

    aniDelayStrs = ['juBaoLianLian']

    async showJuBaoLianLian(fishNode, chairID, isTrigger, idx, triggerArray, baoji, triggerMul) {//小游戏  自己可见  别人能看见结尾  istriger 有选择元宝   baoji 有暴击

        // cc.log("开始延时...");
        // let t = Date.now()
        // cc.log(t)
        // let delayedAction = DelayedAction.createInstance(5, this.aniDelayStrs[0]); // 创建延时实例
        // await delayedAction.start();
        // cc.log("延时结束，执行后续流程。");
        // let tt = Date.now()
        // cc.log(tt)
        // cc.log(tt - t)

        let juBaoNode = cc.find('juBaoLianLian', this.node);
        let jinBiDiaoluo = cc.find('jinBiDiaoluo', juBaoNode);
        let startNode = cc.find('start', juBaoNode);
        let yuanbao = cc.find('yuanbao', juBaoNode);
        let topKuang = cc.find('topKuang', juBaoNode);
        let jinBiArrs = cc.find('jinBiArrs', juBaoNode);
        let xuanZheYuanbao = cc.find('xuanZheYuanbao', juBaoNode);
        let baFangCiFu = cc.find('baFangCiFu', juBaoNode);
        let beiGuang = cc.find('beiGuang', juBaoNode);
        let gunDong = cc.find('gunDong', juBaoNode);

        juBaoNode.active = true

        startNode.active = false
        yuanbao.active = false
        topKuang.active = false
        xuanZheYuanbao.active = false
        jinBiArrs.active = false
        baFangCiFu.active = false
        beiGuang.active = false
        gunDong.active = false
        jinBiDiaoluo.active = false

        await DelayedAction.createInstance(0.1, this.aniDelayStrs[0]).start()
        //播放开场
        startNode.active = true
        startNode.getComponent(sp.Skeleton).setAnimation(0, 'Treasure', false)
        await DelayedAction.createInstance(5.5, this.aniDelayStrs[0]).start()
        DataVO.GD.mainScene.shakeScreen();
        await DelayedAction.createInstance(1.5, this.aniDelayStrs[0]).start()
        //掉落金币
        jinBiDiaoluo.y = 780
        jinBiDiaoluo.active = true
        jinBiDiaoluo.getComponent(sp.Skeleton).setAnimation(0, 'gold', true)
        cc.tween(jinBiDiaoluo).to(1.2, { y: -1345 }).start()
        await DelayedAction.createInstance(0.4, this.aniDelayStrs[0]).start()
        startNode.active = false;
        //显示元宝
        yuanbao.active = true
        yuanbao.getComponent(sp.Skeleton).setAnimation(0, 'lngots', true)
        //显示标题  创建金币   0.5秒金币飞到标题处 标题播放闪光
        jinBiArrs.active = true
        let chi = jinBiArrs.children
        let orgpos = []
        let pos = [];
        let pos1 = [];
        cc.find('num', topKuang).active = false
        topKuang.getComponent(sp.Skeleton).setAnimation(0, 'Label', false)
        cc.find('num', topKuang).getComponent(cc.Label).string = triggerMul.toFixed(2)
        let scos = Util.splitIntoTwelveRandomDecimals(triggerMul)
        for (let i = 0; i < chi.length; i++) {
            chi[i].active = true
            orgpos[i] = chi[i].position
            if (i < 8) {
                pos[i] = cc.v2(orgpos[i].x - Util.randNum(13, 25), orgpos[i].y + Util.randNum(10, 15))
                pos1[i] = cc.v2(topKuang.position.x + Util.randNum(-169, 0), 208 - Util.randNum(-30, 30))
            } else {
                pos[i] = cc.v2(orgpos[i].x + Util.randNum(13, 25), orgpos[i].y + Util.randNum(10, 15))
                pos1[i] = cc.v2(topKuang.position.x + Util.randNum(0, 169), 208 - Util.randNum(-30, 30))
            }
            cc.find('img', chi[i]).getComponent(sp.Skeleton).setAnimation(0, 'daiji', true)
            cc.find('num', chi[i]).active = false
            cc.find('num', chi[i]).getComponent(cc.Label).string = scos[i].toFixed(2)
            cc.tween(chi[i]).delay(2.5).call(() => {
                cc.find('img', chi[i]).getComponent(sp.Skeleton).setAnimation(0, 'zhuan', false)
            }).delay(0.5).call(() => { cc.find('num', chi[i]).active = true }).delay(1).to(0.25, { position: pos[i] }).to(0.25, { position: pos1[i] }).call(() => {
                chi[i].active = false
                chi[i].position = orgpos[i]
                if (i == chi.length - 1) {
                    cc.find('num', topKuang).active = true
                }
            }).start();
        }
        await DelayedAction.createInstance(1, this.aniDelayStrs[0]).start()
        topKuang.active = true
        await DelayedAction.createInstance(0.5, this.aniDelayStrs[0]).start()
        await DelayedAction.createInstance(3.3, this.aniDelayStrs[0]).start()
        yuanbao.getComponent(sp.Skeleton).setAnimation(0, 'lngots2', false)

        if (isTrigger) {
            // if (1) {
            await DelayedAction.createInstance(1, this.aniDelayStrs[0]).start()
            yuanbao.active = false
            //金币消失  选择元宝状态出现        
            xuanZheYuanbao.active = true
            xuanZheYuanbao.getComponent(sp.Skeleton).setAnimation(0, 'juanzhou', false)
            let sc = cc.find('scale', xuanZheYuanbao)
            sc.active = false;
            await DelayedAction.createInstance(0.2, this.aniDelayStrs[0]).start()
            sc.active = true
            cc.tween(sc).to(0.1, { scale: 1.2 }).to(0.1, { scale: 1 }).start()

            //选择元宝交互
            let items = sc.children
            let clickid = 0
            let pps = [cc.v3(-102.187, 3.396, 0), cc.v3(0, -30.592), cc.v3(110.744, 0)]
            let numNs = []
            for (let i = 0; i < items.length; i++) {
                cc.find('ske', items[i]).getComponent(sp.Skeleton).setAnimation(0, 'Standby', false)
                items[i].position = pps[i]
                items[i].opacity = 255
                let numN = cc.find('num', items[i])
                numNs[i] = numN
                numNs[i].active = false
                items[i].on(cc.Node.EventType.TOUCH_END, async () => {
                    DataVO.GD.mainScene.sendGameData(subGameMSG.SUB_C_SELECT_YUANBAO, {});
                    cc.log('------Standby2-------');
                    clickid = i
                    cc.log(i)
                    cc.find('ske', items[i]).getComponent(sp.Skeleton).setAnimation(0, 'Standby2', false)
                    numNs[i].getComponent(cc.Label).string = triggerArray[idx].toFixed(2)
                    let mpos = cc.find('mpos', xuanZheYuanbao).position
                    items[i].color = cc.color(255, 255, 255)
                    cc.tween(numNs[i]).delay(1).call(() => { numNs[i].active = true }).delay(0.2).call(() => {
                        cc.tween(items[i]).to(1, { position: mpos, opacity: 0 }).call(() => {
                            cc.find('num', topKuang).getComponent(cc.Label).string = (triggerMul + triggerArray[idx]).toFixed(2)
                        }).start()
                    }).start()
                    for (let j = 0; j < items.length; j++) {
                        if (j != clickid) {
                            numNs[j].active = false
                            numNs[j].getComponent(cc.Label).string = triggerArray[j].toFixed(2)
                            items[j].color = cc.color(88, 88, 88)
                            cc.tween(items[j]).delay(1).call(() => {
                                cc.find('ske', items[j]).getComponent(sp.Skeleton).setAnimation(0, 'Standby3', false)
                                cc.tween(numNs[j]).delay(1).call(() => { numNs[j].active = true }).start()
                            }).start()
                        }
                    }
                    await DelayedAction.createInstance(5, this.aniDelayStrs[0]).start()
                    sc.active = false
                    xuanZheYuanbao.getComponent(sp.Skeleton).setAnimation(0, 'jzquit', false)
                    if (baoji.length == 0) {
                        // if (0) {
                        //总结算
                        await DelayedAction.createInstance(2, this.aniDelayStrs[0]).start()
                        DataVO.GD.mainScene.sendGameData(subGameMSG.SUB_C_GET_PLAERS_SCORE);
                        juBaoNode.active = false
                        return
                    }

                    await DelayedAction.createInstance(2.5, this.aniDelayStrs[0]).start()
                    //播放八方赐福
                    baFangCiFu.active = true

                    beiGuang.active = true
                    //滚动倍数
                    await DelayedAction.createInstance(5, this.aniDelayStrs[0]).start()
                    gunDong.active = true
                    gunDong.x = 0
                    let chis = gunDong.children
                    // gunDong.scale = 0.1

                    let p = []
                    for (let i = 0; i < 6 * 3; i++) {
                        p[i] = 777 * i
                    }

                    for (let i = 0; i < 6; i++) {
                        chis[i].x = p[i * 3]
                    }
                    for (let i = 0; i < 6; i++) {
                        chis[i + 6].x = p[i * 3 + 1]
                    }
                    for (let i = 0; i < 6; i++) {
                        chis[i + 12].x = p[i * 3 + 2]
                    }

                    //总共   16 表示3倍  18表示7倍  17表示10倍
                    cc.tween(gunDong).to(1, { x: -777 * 3 }).to(4, { x: -777 * 14 }).to(1, { x: -777 * 17 }).by(0.5, { x: -20 }).by(0.5, { x: 20 }).delay(5).call(() => {
                        DataVO.GD.mainScene.sendGameData(subGameMSG.SUB_C_GET_PLAERS_SCORE);
                        juBaoNode.active = false
                    }).start()
                    //总结算

                    //结束
                }, this)
            }

        } else {
            if (baoji.length == 0) {
                //总结算
                await DelayedAction.createInstance(1.2, this.aniDelayStrs[0]).start()
                juBaoNode.active = false
                return
            }
            await DelayedAction.createInstance(3.3, this.aniDelayStrs[0]).start()
            yuanbao.active = false
            //播放八方赐福
            baFangCiFu.active = true

            beiGuang.active = true
            //滚动倍数
            await DelayedAction.createInstance(2, this.aniDelayStrs[0]).start()
            gunDong.active = true
            gunDong.x = 0
            let chis = gunDong.children
            // gunDong.scale = 0.1

            let p = []
            for (let i = 0; i < 6 * 3; i++) {
                p[i] = 777 * i
            }

            for (let i = 0; i < 6; i++) {
                chis[i].x = p[i * 3]
            }
            for (let i = 0; i < 6; i++) {
                chis[i + 6].x = p[i * 3 + 1]
            }
            for (let i = 0; i < 6; i++) {
                chis[i + 12].x = p[i * 3 + 2]
            }

            //总共   16 表示3倍  18表示7倍  17表示10倍
            cc.tween(gunDong).to(1, { x: -777 * 3 }).to(4, { x: -777 * 14 }).to(1, { x: -777 * 17 }).by(0.5, { x: -20 }).by(0.5, { x: 20 }).delay(5).call(() => {
                DataVO.GD.mainScene.sendGameData(subGameMSG.SUB_C_GET_PLAERS_SCORE);
                juBaoNode.active = false
            }).start()
            //总结算
        }

    }

    async showFengBaoFuGui(fishNode, chairID, catchFishes, baoJi) {//风暴 吸小鱼
        cc.log('========328Baoji=======');
        cc.log(baoJi);
        let stpos = fishNode.position
        if (DataVO.GD.isRotation) {
            stpos = Util.getSymmetricPoint(stpos, cc.v2(this.w * 0.5, this.h * 0.5))
        }
        let item = DataVO.GD.nodePools['lvGuiEffect'].getNode();
        item.position = stpos
        item.parent = this.node
        let chis = item.children
        for (let i = 0; i < chis.length; i++) {
            chis[i].active = false
        }
        let rd = Util.randNum(0, 6, true)
        let idx0 = rd
        let tpos = DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].getMuzzleWorldPosIgnoreLayerRotation();
        // catchFishes = [
        //     { fishKind: 6, score: 1 },
        //     { fishKind: 2, score: 2 },
        //     { fishKind: 3, score: 3 },
        //     { fishKind: 4, score: 4 },
        //     { fishKind: 5, score: 5 },
        //     { fishKind: 6, score: 6 },
        //     { fishKind: 7, score: 7 }
        // ]
        let totcount = catchFishes.length
        let scorenum = catchFishes[0].score
        item.active = true
        chis[2].active = true
        chis[2].getComponent(sp.Skeleton).setAnimation(0, 'wugui', false)//绿龟
        cc.tween(item).to(0.2, { position: this.lvguipos[idx0].position })
            .delay(0.5)
            .call(async () => {

            })
            .delay(5)
            .call(() => {
                item.removeFromParent();
                DataVO.GD.nodePools['lvGuiEffect'].freeNode(item);
            })
            .start()
        await DelayedAction.createInstance(1, this.aniDelayStrs[0]).start()
        cc.find('lvguipao', this.node).active = true//泡
        await DelayedAction.createInstance(0.2, this.aniDelayStrs[0]).start()
        chis[1].active = true//绿光
        chis[1].getComponent(sp.Skeleton).setAnimation(0, 'lvguang', false)
        await DelayedAction.createInstance(0.6, this.aniDelayStrs[0]).start()
        let posarr = Util.getCirclePoints(cc.v2(this.lvguipos[idx0].position.x, this.lvguipos[idx0].position.y), 200, totcount)
        cc.log(posarr);
        let littleFishId = catchFishes[0].fishKind + 1
        for (let i = 0; i < totcount; i++) {
            let lfish = DataVO.GD.nodePools["fish_" + littleFishId].getNode();
            cc.find('fishShadow', lfish).active = false
            lfish.getComponent(F_CSBY_Fish).enabled = false
            lfish.parent = this.node
            lfish.scale = GFishKindAnimationFN[littleFishId].scale * 1
            let x = posarr[i].x + (i % 2 == 1 ? Util.randNum(-90, -20) : Util.randNum(20, 90))
            let y = posarr[i].y + (i % 2 == 0 ? Util.randNum(-90, -20) : Util.randNum(20, 90))
            lfish.setPosition(cc.v2(x, y))
            cc.tween(lfish).parallel(
                cc.tween().by(2, { angle: 360 * 3 }).call(() => {
                    let p = lfish.position
                    let score = DataVO.GD.nodePools['ScorePool'].getNode();
                    score.getComponent(cc.Label).string = scorenum.toFixed(2)
                    score.position = p
                    score.parent = this.node
                    if (baoJi) {
                        if (i == 0) {
                            this.showBaoJi(baoJi[0], catchFishes[0].score * catchFishes.length, this.lvguipos[idx0].position, chairID, true)
                        }
                        cc.tween(score).to(0.2, { scale: 0.8 }).to(0.3, { scale: 1.3 }).delay(0.6).to(0.3, { position: this.baojiPos }).call(() => {
                            score.removeFromParent();
                            DataVO.GD.nodePools['ScorePool'].freeNode(score);
                        }).start()
                    } else {
                        cc.tween(score).to(0.6, { position: tpos }).call(() => {
                            score.removeFromParent();
                            DataVO.GD.nodePools['ScorePool'].freeNode(score);
                        }).start()
                    }
                    lfish.removeFromParent();
                    DataVO.GD.nodePools["fish_" + littleFishId].freeNode(lfish);
                }),
                cc.tween().to(3, { position: this.lvguipos[idx0].position })
            ).start()
        }
        await DelayedAction.createInstance(1.5, this.aniDelayStrs[0]).start()
        chis[1].active = false
        chis[0].active = true//闪光
        let coinEffect = DataVO.GD.nodePools['coinEffect'].getNode();
        coinEffect.parent = this.node
        coinEffect.position = this.lvguipos[idx0].position
        await DelayedAction.createInstance(0.5, this.aniDelayStrs[0]).start()
        chis[0].active = false
        coinEffect.removeFromParent()
        DataVO.GD.nodePools['coinEffect'].freeNode(coinEffect);
        cc.find('lvguipao', this.node).active = false//泡
        DataVO.GD.mainScene.sendGameData(subGameMSG.SUB_C_GET_PLAERS_SCORE);
    }

    showShanDianFuGui(fishNode, chairID, catchFishes) {//闪电 电小鱼
        let stpos = fishNode.position
        if (DataVO.GD.isRotation) {
            stpos = Util.getSymmetricPoint(stpos, cc.v2(this.w * 0.5, this.h * 0.5))
        }
        let item = DataVO.GD.nodePools['sanDianGui'].getNode();
        item.position = stpos
        item.parent = this.node
        let rd = Util.randNum(4, 6, true)
        let idx0 = rd
        let tpos = DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].getMuzzleWorldPosIgnoreLayerRotation();
        // catchFishes = [
        //     { fishKind: 1, score: 1 },
        //     { fishKind: 2, score: 2 },
        //     { fishKind: 3, score: 3 },
        //     { fishKind: 4, score: 4 },
        //     { fishKind: 5, score: 5 },
        //     { fishKind: 6, score: 6 },
        //     { fishKind: 7, score: 7 }
        // ]
        cc.tween(item).to(0.2, { position: this.pos[idx0].position })
            .call(() => {
                let chi = DataVO.GD.mainScene.fishLayer.node.children
                for (let i = 0; i < catchFishes.length; i++) {
                    //打中的地方激活闪电
                    let pos = chi[i].position
                    if (DataVO.GD.isRotation) {
                        pos = Util.getSymmetricPoint(pos, cc.v2(this.w * 0.5, this.h * 0.5))
                    }
                    let lfishid = catchFishes[i].fishKind + 1
                    let sandian = DataVO.GD.nodePools["fish_" + lfishid].getNode();
                    sandian.getComponent(F_CSBY_Fish).prePos = null
                    sandian.position = pos
                    sandian.parent = this.node
                    let sandian0 = DataVO.GD.nodePools["sanDian"].getNode();
                    sandian0.position = pos
                    sandian0.parent = this.node
                    cc.find('2', sandian0).getComponent(sp.Skeleton).setAnimation(0, 'blue', true)
                    let s1 = Util.randNum(3.6, 5.8)
                    let s2 = Util.randNum(1.6, 2.8)
                    let s3 = Util.randNum(0.6, 1.2)
                    let s4 = Util.randNum(1.5, 1.9)
                    let rd = Util.randNum(0, 1)
                    if (rd < 0.5) {
                        cc.find('1', sandian0).active = false
                    } else {
                        cc.find('1', sandian0).active = true
                    }
                    sandian0.scale = 0
                    sandian0.opacity = 255
                    cc.tween(sandian0).delay(i * 0.11).call(() => { sandian0.scale = s1 }).to(0.25, { scale: s2 }).delay(2).call(() => {
                        cc.find('2', sandian0).getComponent(sp.Skeleton).setAnimation(0, 'purple', true)
                    }).to(0.5, { scale: s3 }).delay(1.5 - i * 0.11).to(0.3, { scale: s4, opacity: 0 }).call(() => {
                        sandian0.removeFromParent()
                        DataVO.GD.nodePools["sanDian"].freeNode(sandian0);
                    }).start()
                    cc.tween(sandian).delay(i * 0.11).to(0.5, { scale: 1.5 }).call(() => {
                        //原来的鱼被打中
                        // chi[i].getComponent(F_CSBY_Fish).death()
                    }).delay(3.5 - i * 0.11).call(() => {
                        sandian.removeFromParent()
                        DataVO.GD.nodePools["fish_" + lfishid].freeNode(sandian);
                    }).start();
                }
            })
            .delay(5)
            .call(() => {
                DataVO.GD.mainScene.sendGameData(subGameMSG.SUB_C_GET_PLAERS_SCORE);
                item.removeFromParent();
                DataVO.GD.nodePools['sanDianGui'].freeNode(item);
            })
            .start()
    }

    showBaoZhuZhaoFu(pos, chairID, segmentMul) {//爆竹三连跳
        // segmentMul = [0.5, 1.3, 5.2]
        let stpos = pos
        if (DataVO.GD.isRotation) {
            stpos = Util.getSymmetricPoint(stpos, cc.v2(this.w * 0.5, this.h * 0.5))
        }
        let item = DataVO.GD.nodePools['BaoZhuZhaoFu'].getNode();
        item.position = stpos
        item.parent = this.node
        item.active = true
        let ske = cc.find('fishSprite', item).getComponent(sp.Skeleton)
        let rd = Util.randNum(4, 6, true)
        let rdir = Util.random()
        let idx0 = rd
        let idx1 = rdir < 0.5 ? idx0 - 2 : idx0 + 2
        let idx2 = rdir < 0.5 ? idx1 - 2 : idx1 + 2
        let tpos = DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].getMuzzleWorldPosIgnoreLayerRotation();
        let coinEffect = DataVO.GD.nodePools['coinEffect'].getNode();
        coinEffect.parent = this.node
        coinEffect.active = false
        cc.tween(item)
            .call(() => {
                ske.timeScale = 1
                ske.setAnimation(0, 'hit', true)
            })
            .delay(1)
            .parallel(
                cc.tween().call(() => {
                    ske.timeScale = 0.45
                    ske.setAnimation(0, 'big', true)
                }),
                cc.tween().to(0.8, { position: this.pos[idx0].position })
            )
            .delay(1)
            .call(async () => {
                ske.timeScale = 1
                ske.setAnimation(0, 'hit', true)
                let tmp = DataVO.GD.nodePools['baoZhuEffect'].getNode()
                let score = cc.find('2', tmp).getComponent(cc.Label)
                score.string = segmentMul[0].toFixed(2)
                tmp.parent = this.node
                tmp.active = true
                tmp.position = this.pos[idx0].position
                cc.tween(tmp).delay(1).call(() => {
                    tmp.removeFromParent()
                    DataVO.GD.nodePools['baoZhuEffect'].freeNode(tmp)
                }).start()
                coinEffect.active = true
                coinEffect.position = this.pos[idx0].position
                await DelayedAction.createInstance(0.5, this.aniDelayStrs[0]).start()
                coinEffect.active = false
            })
            .delay(1)
            .parallel(
                cc.tween().to(0.8, { position: this.pos[idx1].position }),
                cc.tween().call(() => {
                    ske.timeScale = 0.45
                    ske.setAnimation(0, 'big', true)
                })
            )

            .delay(1)
            .call(async () => {
                ske.timeScale = 1
                ske.setAnimation(0, 'hit', true)
                let tmp = DataVO.GD.nodePools['baoZhuEffect'].getNode()
                let score = cc.find('2', tmp).getComponent(cc.Label)
                score.string = segmentMul[1].toFixed(2)
                tmp.parent = this.node
                tmp.active = true
                tmp.position = this.pos[idx1].position
                cc.tween(tmp).delay(1).call(() => {
                    tmp.removeFromParent()
                    DataVO.GD.nodePools['baoZhuEffect'].freeNode(tmp)
                }).start()
                coinEffect.active = true
                coinEffect.position = this.pos[idx1].position
                await DelayedAction.createInstance(0.5, this.aniDelayStrs[0]).start()
                coinEffect.active = false
            })
            .delay(1)
            .parallel(
                cc.tween().to(0.8, { position: this.pos[idx2].position }),
                cc.tween().call(() => {
                    ske.timeScale = 0.45
                    ske.setAnimation(0, 'big', true)
                })
            )

            .delay(1)
            .call(async () => {
                ske.timeScale = 1
                ske.setAnimation(0, 'hit', true)
                DataVO.GD.nodePools['coinEffect'].freeNode(coinEffect);
                let tmp = DataVO.GD.nodePools['baoZhuEffect'].getNode()
                let score = cc.find('2', tmp).getComponent(cc.Label)
                score.string = segmentMul[2].toFixed(2)
                tmp.parent = this.node
                tmp.active = true
                tmp.position = this.pos[idx2].position
                cc.tween(tmp).delay(1).call(() => {
                    tmp.removeFromParent()
                    DataVO.GD.nodePools['baoZhuEffect'].freeNode(tmp)
                }).start()
                coinEffect.active = true
                coinEffect.position = this.pos[idx2].position
                await DelayedAction.createInstance(0.5, this.aniDelayStrs[0]).start()
                coinEffect.removeFromParent()
            })
            .delay(0.5)
            .call(() => {
                DataVO.GD.mainScene.sendGameData(subGameMSG.SUB_C_GET_PLAERS_SCORE);
                item.removeFromParent();
                DataVO.GD.nodePools['BaoZhuZhaoFu'].freeNode(item);
            })
            .start()
    }

    showRenWu() {

    }

    //激活一个战斗特效
    activeEffect(fishKind, pos) {
        switch (fishKind) {
        }
    }
    //全屏特效隐藏
    cancelFixScreen() {

    }
    //激活一个金币特效
    activeScoreEffect(fishKind, score, fishMuls) {
    }

    //闪电鱼特效
    activeLightningFish(fish, catchFishes, chairID, score, multiple) {
        var mainFish = this.newCopyFish(fish.fishKind, fish.subFishKind, fish.fishSprite.getRotation());
        mainFish.setParent(this.node);
        mainFish.setPosition(fish.getPosition());
        var mainFishEndPos = cc.v2(chairID % 2 == 0 ? V.w * 0.35 : V.w * 0.65, V.h / 2);
        var copyFishes = [];
        for (let i = 0; i < catchFishes.length; i++) {

            var rot = Math.floor(Math.random() * 180);
            var sin = Math.sin(rot);
            var cos = Math.cos(rot);

            var offset = 250 + Math.random() * 100;

            var st = cc.v2(mainFishEndPos.x + cos * offset, mainFishEndPos.y + sin * offset);
            var ed = cc.v2(mainFishEndPos.x + cos * 50, mainFishEndPos.y + sin * 50);

            var copyCatchFish = this.newCopyFish(fish.fishKind, catchFishes[i], 0);
            copyCatchFish.setParent(this.node);
            copyCatchFish.setPosition(st);
            copyCatchFish.active = false;
            copyFishes.push(copyCatchFish);
            this.runCopyFishAction(copyCatchFish, i, st, ed, mainFishEndPos);
        }

        mainFish.runAction(cc.sequence(
            cc.moveTo(0.5, mainFishEndPos),
            cc.delayTime(0.7 * copyFishes.length + 1),
            cc.callFunc(() => {
                for (var i = 0; i < copyFishes.length; i++) {
                    copyFishes[i].removeFromParent();
                }
                DataVO.GD.mainScene.scoreLayer.activeScore(score, multiple, mainFishEndPos, chairID);

                DataVO.GD.mainScene.coinLayer.activeCoin(mainFishEndPos, chairID, multiple, function () {

                    DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].addScore(score);

                });
            }),
            cc.removeSelf()
        ))

        fish.removeSelf();
    }
    //复制一条鱼
    newCopyFish(fishKind, subFishKind, fishRot): cc.Node {
        /*var copyFish = new Fish();
        copyFish.reuse(fishKind, subFishKind);
        copyFish.stopAllActions();
        copyFish.fishSprite.setRotation(fishRot);

        return copyFish;*/
        return new cc.Node
    }

    runCopyFishAction(node, i, st, ed, mainFishPos) {
        node.runAction(cc.sequence(
            cc.delayTime(i * 0.7 + 1),
            cc.show(),
            cc.moveTo(0.5, ed)
        ))

        /*var lightning = new ccs.Armature("liansuoshandian_buyu").anchor(1,0.5).to(this).p(mainFishPos).hide();
        var scaleX = cc.pDistance(st, mainFishPos) / lightning.cw();
        lightning.setScaleX(scaleX);
        lightning.setRotation(ttutil.calcRotation(st, mainFishPos));

        lightning.runAction(cc.sequence(
            cc.delayTime(i * 0.7 + 1),
            cc.show(),
            cc.scaleTo(0.5,0,1),
            cc.removeSelf()
        ))*/
    }
}
