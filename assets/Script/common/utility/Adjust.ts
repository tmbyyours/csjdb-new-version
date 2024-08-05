import MPConfig from "../../extend/MPConfig";
import { DataVO } from "../../plaza/model/DataVO";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Adjust extends cc.Component {

    ssize
    start() {
        DataVO.GD.offsetSize = 0
        this.ssize = cc.winSize
        cc.log('屏幕大小    宽和高')
        cc.log(this.ssize.width + '          ' + this.ssize.height)
        if (this.ssize.width / this.ssize.height > MPConfig.V.w / MPConfig.V.h + 0.1) {
            DataVO.GD.offsetSize = (this.ssize.width - MPConfig.V.w) * 0.5
            // this.node.getComponent(cc.Widget).isAlignLeft = true
            // this.node.getComponent(cc.Widget).left = DataVO.GD.offsetSize
            // this.node.getComponent(cc.Widget).isAlignRight = true
            // this.node.getComponent(cc.Widget).right = DataVO.GD.offsetSize
            DataVO.GD.isbalck = true
        }
    }

    // update (dt) {}
}
