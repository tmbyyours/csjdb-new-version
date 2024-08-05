import { DataVO } from "../../../../plaza/model/DataVO";
import { FishKind } from "../SubGameMSG";

/**
 * ui层
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class F_SCBY_WindowLayer extends cc.Component {
    //点击瞄准圈
    @property({ type: cc.Sprite })
    clickAim: cc.Sprite = null;
    //鱼身上的瞄准圈
    @property({ type: cc.Sprite })
    fishAim: cc.Sprite = null;
    //显示点击瞄准圈
    showClickAim(pos) {
        if (!DataVO.GD.mainScene.fishLayer.lockFishStatus) {
            let pos1 = cc.v2(pos.x - DataVO.GD.offsetSize, pos.y)
            this.clickAim.node.setPosition(pos1);
            this.clickAim.node.active = true;
            this.clickAim.node.getComponent(cc.Animation).play();
        }
    }

    update(dt) {
        if (DataVO.GD.isReady && DataVO.GD.isAllowFire && DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].lockingFish) {
            let fishSprite = DataVO.GD.mainScene.cannonLayer.cannonArray[DataVO.GD.meChairID].lockingFish.getChildByName("fishSprite")
            let pos = fishSprite.getPosition();
            var fishPosition = (fishSprite.parent as cc.Node).convertToWorldSpaceAR(pos);
            this.fishAim.node.setPosition(this.node.convertToNodeSpaceAR(fishPosition))
            this.fishAim.node.active = true;
            if (DataVO.GD.showAimAction) {
                this.fishAim.node.setScale(2)
                this.fishAim.node.runAction(cc.scaleTo(0.3, 1.3).easing(cc.easeSineIn()))
                DataVO.GD.showAimAction = false;
            }
        } else {
            this.fishAim.node.active = false;
        }
    }
}
