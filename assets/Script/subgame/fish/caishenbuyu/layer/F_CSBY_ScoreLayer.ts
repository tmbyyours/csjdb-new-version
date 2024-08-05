import { DataVO } from "../../../../plaza/model/DataVO";
import Util from "../../../../extend/Util";
import F_CSBY_Score from "../node/F_CSBY_Score";

/**
 * 分数Label
 */
const {ccclass, property} = cc._decorator;
/**
 * 分数层
 */
@ccclass
export default class F_CSBY_ScoreLayer extends cc.Component {
    // LIFE-CYCLE CALLBACKS:
    onLoad () {

    }

    //初始化
    initEx () {
        //缓存资源
    }

     /**
     * 激活分数
     */
    activeScore (score, multiple, pos, chairID) {
        let scoreLabel = DataVO.GD.nodePools.ScorePool.getNode();
        let font  = chairID == DataVO.GD.meChairID
        scoreLabel.getComponent("F_CSBY_Score").reuse(font,pos);
        scoreLabel.setParent(this.node)
        let _scale
        if (multiple == 2) {
            _scale = 0.85;
        }
        else if (multiple == 3) {
            _scale = 0.9;
        }
        else if (multiple < 12) {
            _scale = 0.95;
        }
        else {
            _scale = 1;
        }
        scoreLabel.setScale(_scale);
        var rotation = 0;
        var moveByY = 80;
        var moveByY1 = -60;
        var moveByY2 = 10;
        var moveByY3 = -10;
        var moveByY4 = 4;
        var moveByY5 = 70;
        if (DataVO.GD.isRotation) {
            rotation = -180;
            moveByY = -120;
            moveByY1 = -moveByY1;
            moveByY2 = -moveByY2;
            moveByY3 = -moveByY3;
            moveByY4 = -moveByY4;
            moveByY5 = -moveByY5;
        }
        scoreLabel.angle=-rotation;
        scoreLabel.opacity = 0;
        scoreLabel.getComponent(cc.Label).string=Util.formatMoney(score);
        /*var action = cc.sequence(
            cc.fadeIn(0.1),
            cc.moveBy(0.2, 0, moveByY).easing(cc.easeSineOut()),
            //cc.delayTime(0.5),
            cc.spawn(
                cc.moveBy(0.3, 0, -moveByY),//.easing(cc.easeElasticOut()),
                cc.sequence(cc.delayTime(1.3), cc.scaleTo(0.1, 0))
            ),
            cc.callFunc(scoreLabel.getComponent("F_CSBY_Score").removeSelf.bind(scoreLabel))
        );*/
        var action = cc.sequence(
            cc.fadeIn(0.1),
            cc.moveBy(0.15, 0, moveByY).easing(cc.easeSineOut()),
            cc.moveBy(0.13, 0, moveByY1),
            cc.moveBy(0.13, 0, moveByY2),
            cc.moveBy(0.13, 0, moveByY3),
            cc.moveBy(0.13, 0, moveByY4),
            cc.delayTime(0.35),
            cc.spawn(
                cc.moveBy(0.6, 0, moveByY5),//.easing(cc.easeElasticOut()),
                cc.fadeOut(0.6)
                //cc.sequence(cc.delayTime(1.3), cc.scaleTo(0.1, 0))
            ),
            cc.callFunc(scoreLabel.getComponent("F_CSBY_Score").removeSelf.bind(scoreLabel))
        );
        scoreLabel.runAction(action);
    }

    /**
     * 激活机枪子弹数量显示
     */
    activeMiniNum (num, chairID) {
        let numLabel = DataVO.GD.nodePools.bulletNumPool.getNode();
        let pos = DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].getSuperCannonCardWorldPosIgnoreLayerRotation();
        pos = this.node.convertToNodeSpaceAR(pos)
        cc.log(pos)
        numLabel.setParent(this.node)
        var rotation = 0;
        var moveByY = 280;
        if (DataVO.GD.isRotation) {
            rotation = -180;
            moveByY = -moveByY;
            numLabel.getComponent("F_CSBY_BulletNum").reuse(new cc.Vec2(pos.x,pos.y+200));
        } else {
            numLabel.getComponent("F_CSBY_BulletNum").reuse(new cc.Vec2(pos.x,pos.y-200));
        }
        numLabel.angle=-rotation;
        numLabel.opacity = 255;
        numLabel.getComponent(cc.Label).string="+" + Util.formatMoney(num);
        var action = cc.sequence(
            cc.spawn( cc.moveBy(1.5, 0, moveByY).easing(cc.easeSineOut()), cc.sequence(cc.delayTime(1),cc.fadeOut(0.5))),
            //cc.delayTime(0.5),
            cc.callFunc(numLabel.getComponent("F_CSBY_BulletNum").removeSelf.bind(numLabel))
        );
        numLabel.runAction(action);


        let n = DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].superBulletNum + num
        if(n>999){
            n=999
        }
        DataVO.GD.mainScene.cannonLayer.cannonArray[chairID].startMiniBullet(n);
    }
}
