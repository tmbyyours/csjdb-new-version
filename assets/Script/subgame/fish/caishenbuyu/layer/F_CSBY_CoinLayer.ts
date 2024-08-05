import { DataVO } from "../../../../plaza/model/DataVO";
import SoundManager from "../../../../common/managers/SoundManager";
import { FishKind } from "../SubGameMSG";
import Util from "../../../../extend/Util";
import UserInfo from "../../../../plaza/model/UserInfo";

/**
 * 金币层
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class F_CSBY_CoinLayer extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.initEx();
    }

    initEx() {
        //缓存图集
    }
    /**
    *
    * @param pos       鱼的位置
    * @param score     打中的分数
    * @param chairID   椅子letID
    */
    activeCoin(fish, chairID, multiple, callback, isPlaySound) {
        isPlaySound = isPlaySound == null ? true : isPlaySound;
        //let targetPos = DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].getScoreLabelWorldPosIgnoreLayerRotation();       //金币框
        let targetPos = DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].getMuzzleWorldPosIgnoreLayerRotation();            //炮台
        if (fish.getComponent("F_CSBY_Fish").fishKind == FishKind.GodAdvent) {
            this.buildCoin1(fish.getPosition(), targetPos, chairID, multiple, callback, isPlaySound);
            if (chairID == DataVO.GD.meChairID) {
                DataVO.GD.mainScene.shakeScreen();
            }
        } else if (fish.getComponent("F_CSBY_Fish").fishKind == FishKind.OrganCannon) {
            this.buildCoin(fish.getPosition(), targetPos, chairID, 10, callback, isPlaySound);//飘金币固定10倍
        } else {
            this.buildCoin(fish.getPosition(), targetPos, chairID, multiple, callback, isPlaySound);
        }
        if (multiple >= 2 && multiple <= 12) {
            //SoundManager.getInstance().playID(1401,"subgame");
        } else {
            //SoundManager.getInstance().playID(1402,"subgame");
        }
        switch (fish.getComponent("F_CSBY_Fish").fishKind) {//爆金币
            case FishKind.FishKind16:
            case FishKind.FishKind17:
            case FishKind.FishKind18:
            case FishKind.FishKind19:
            case FishKind.FishKind20:
            case FishKind.CenserBead:
                let coinbomb = DataVO.GD.nodePools["CoinBombPool"].getNode();
                let _s = 2 + ((fish.getComponent("F_CSBY_Fish").fishKind - 10) / 10);
                (coinbomb as cc.Node).setScale(_s);
                coinbomb.setPosition(fish.getPosition());
                coinbomb.getChildByName("shine").getComponent("AutoRemoveSelf").poolName = "CoinBombPool";
                coinbomb.setParent(this.node)
                if (chairID == DataVO.GD.meChairID) {
                    coinbomb.opacity = 255
                } else {
                    coinbomb.opacity = 150
                }
                if (chairID == DataVO.GD.meChairID) {
                    this.schedule(function () {
                        DataVO.GD.mainScene.shakeScreen();
                    }, 0.22, 0);
                }
                // this.schedule(function () {
                //     DataVO.GD.mainScene.shakeScreen();
                // }, 0.22, 0);
                //最大2倍
                break;
            default:
            /* let coinbomb1 = DataVO.GD.nodePools["CoinBombPool"].getNode();
            (coinbomb1 as cc.Node).setScale(3);
            coinbomb1.setPosition(fish.getPosition());
            coinbomb1.getComponent("AutoRemoveSelf").poolName="CoinBombPool";
            coinbomb1.setParent(this.node)
            SoundManager.getInstance().playID(1401,"subgame");
            DataVO.GD.mainScene.shakeScreen();*/
        }
    }


    activeCoin1(fish, chairID, multiple, callback, isPlaySound) {
        isPlaySound = isPlaySound == null ? true : isPlaySound;
        let targetPos = DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].getSuperCannonCardWorldPosIgnoreLayerRotation();
        if (DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].isMiniBullet()) {
            this.buildCoin2(fish.getPosition(), targetPos, chairID, multiple, callback, isPlaySound);
        }
    }

    buildCoin2(pos, cannonPos, chairID, multiple, callback, isPlaySound) {
        var sum = Math.ceil(multiple / 10);
        var nowCount = 0;
        var _callback = function () {
            nowCount++;
            if (nowCount == sum) {
                if (callback) {
                    callback();
                }
            }
        };

        for (var i = 0; i < sum; ++i) {
            var st = cc.v2(), ed = cc.v2();
            let _x = Util.rand(-180, 180)
            let _y = Util.rand(-180, 180)
            st.x = pos.x + _x;
            st.y = pos.y + _y;

            ed = this.node.convertToNodeSpaceAR(cannonPos);
            var coinKind;
            let coin = DataVO.GD.nodePools["MiniBulletPool"].getNode();
            if (chairID == DataVO.GD.meChairID) {
                coin.opacity = 255
            } else {
                coin.opacity = 150
            }
            coin.getComponent("F_CSBY_MiniBullet").reuse1(coinKind, ed, st, pos, i * 0.01, _callback);
            coin.setParent(this.node)
        }
    }

    buildCoin1(pos, cannonPos, chairID, multiple, callback, isPlaySound) {
        //是否为金币
        let isGold = chairID == DataVO.GD.meChairID ? true : false;
        var count = 20;
        // 100:10 150:12 200:14 250:16 300：18
        let minx = 300;
        switch (multiple) {
            case 100:
                count = 20;
                minx = 300;
                break;
            case 150:
                count = 25;
                minx = 350;
                break;
            case 200:
                count = 30;
                minx = 400;
                break;
            case 250:
                count = 40;
                minx = 450;
                break;
            case 300:
                count = 50;
                minx = 500;
                break;
        }

        var sum = Math.ceil(count);
        var nowCount = 0;
        var _callback = function () {
            nowCount++;
            if (nowCount == sum) {
                if (callback) {
                    callback();
                }
            }
        };

        for (var i = 0; i < count; ++i) {
            var st = cc.v2(), ed = cc.v2();
            let _x = Util.rand(-minx, minx)
            let _y = Util.rand(-180, 180)
            st.x = pos.x + _x;
            st.y = pos.y + _y;

            ed = this.node.convertToNodeSpaceAR(cannonPos);
            var coinKind;
            let coin = DataVO.GD.nodePools["CoinPool"].getNode();
            if (isGold) {
                coinKind = "gold";
                (coin as cc.Node).opacity = 255;
            }
            else {
                coinKind = "silver";
                (coin as cc.Node).opacity = 150;
            }
            coin.getComponent("F_CSBY_Coin").reuse1(coinKind, ed, st, pos, i * 0.01, _callback);
            coin.setParent(this.node)
        }

        if (isPlaySound) {
            if (isGold) {
                SoundManager.getInstance().playID(1404, "subgame");
            }
            else {
                //SoundManager.getInstance().playID(1404,"subgame");
            }
        }
    }

    buildCoin(pos, cannonPos, chairID, multiple, callback, isPlaySound) {
        //是否为金币
        let isGold = chairID == DataVO.GD.meChairID ? true : false;
        var count = 2;
        //
        if (multiple == 2) {
            count = 2;
        }
        else if (multiple == 3) {
            count = 3;
        }
        else if (multiple < 12) {
            count = 4;
        }
        else {
            count = 8;
        }

        var sum = Math.ceil(count);
        var nowCount = 0;
        var _callback = function () {

            nowCount++;

            if (nowCount == sum) {
                if (callback) {
                    callback();
                }
            }
        };

        for (var i = 0; i < count; ++i) {
            var st = cc.v2(), ed = cc.v2();

            // st.x = pos.x + (i - count / 2) * 60;
            // if (i < 4) {
            //     st.y = pos.y;
            //     st.x = pos.x + (i - count / 2) * 60;
            // } else {
            //     st.x = pos.x + (i - 4 - count / 2) * 60;
            //     st.y = pos.y + 50;
            // }

            if (i < 4) {
                st.y = pos.y;
                // st.x = pos.x + (i - (count == 2 ? 2 : 4) / 2) * 40;
                st.x = pos.x + (i - 1) * 60 - (count == 2 ? -30 : (count % 2 == 0 ? 30 : 0))

            } else {
                // st.x = pos.x + (i - 4 - (count == 2 ? 2 : 4) / 2) * 40;
                st.x = pos.x + (i - 5) * 60 - (count == 2 ? -30 : (count % 2 == 0 ? 30 : 0))
                // st.x = pos.x;
                st.y = pos.y + 50;
            }



            ed = this.node.convertToNodeSpaceAR(cannonPos);
            var coinKind;

            let coin = DataVO.GD.nodePools["CoinPool"].getNode();
            if (isGold) {
                coinKind = "gold";
                (coin as cc.Node).opacity = 255;
            }
            else {
                coinKind = "silver";
                (coin as cc.Node).opacity = 150;
            }
            coin.getComponent("F_CSBY_Coin").reuse(coinKind, ed, st, i * 0.1, _callback);
            coin.setParent(this.node)
        }

        if (isPlaySound) {
            if (isGold) {
                SoundManager.getInstance().playID(1404, "subgame");
            }
            else {
                //SoundManager.getInstance().playID(1404,"subgame");
            }
        }


    }
}
