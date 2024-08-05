import { DataVO } from "../../../../plaza/model/DataVO";

const {ccclass, property} = cc._decorator;

//分数组件
export class F_CSBY_CatchFishMul extends cc.Component {

}

/**
 * 分数层
 * @type {void|*|Object|Function}
 */
@ccclass
export default class F_CSBY_CatchFishMulLayer extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initEx();
    }

     //初始化
     initEx () {
        /*var sprite = new cc.Sprite(res.fishMulLab);错误创建
        var contentSize = sprite.getContentSize();

        for (var i = 0; i < 128; ++i) {
            ClassPool.putInPool(CatchFishMul, new CatchFishMul("/0123456789", res.fishMulLab, contentSize.width / 11, contentSize.height, "/"));
        }*/
    }
     /**
     * 激活分数
     */
    activeCatchFishMul (multiple, pos) {

        /*pos.y += 30;
        var catchFishMul = ClassPool.getFromPool(CatchFishMul);
        if (!catchFishMul) {
            catchFishMul = new CatchFishMul("/0123456789", res.fishMulLab);
            catchFishMul.to(this.catchFishMulContainer).anchor(0.5, 0.5).p(pos);
        }
        else {
            catchFishMul.to(this.catchFishMulContainer).anchor(0.5, 0.5).p(pos);
            catchFishMul.release();
        }

        catchFishMul.setScale(1.5 + Math.min(0.5, multiple / 10));


        //score.rotation = angle;

        catchFishMul.setString("/" + multiple);

        var rotation = 0;
        var moveByY = 50;
        if (DataVO.GD.isRotation) {
            rotation = 180;
            moveByY = -50;
        }
        catchFishMul.setRotation(rotation);
        catchFishMul.setOpacity(0);
        var action = cc.sequence(
            cc.fadeIn(0.1),
            cc.moveBy(0.2, 0, moveByY).easing(cc.easeSineOut()),
            //cc.delayTime(0.5),
            cc.spawn(
                cc.moveBy(0.3, 0, moveByY),//.easing(cc.easeElasticOut()),
                cc.sequence(cc.delayTime(1), cc.fadeOut(1))
            ),

            cc.callFunc(catchFishMul.removeSelf.bind(catchFishMul))
        );

        catchFishMul.runAction(action);*/
    }
}
