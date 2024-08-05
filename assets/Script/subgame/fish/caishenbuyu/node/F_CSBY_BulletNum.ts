/**
 * 分数Label
 */

import { DataVO } from "../../../../plaza/model/DataVO";

const {ccclass, property} = cc._decorator;

@ccclass
export default class F_CSBY_BulletNum extends cc.Component {
    constructor(strText, charMapFile?){
        super();
    }
    reuse (pos) {
        this.node.setPosition(pos);
    }
    removeSelf (e) {
        e.stopAllActions();
        e.removeFromParent();
        DataVO.GD.nodePools.bulletNumPool.freeNode(e)
    }
}
