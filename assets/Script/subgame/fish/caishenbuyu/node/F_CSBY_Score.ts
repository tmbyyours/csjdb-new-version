/**
 * 分数Label
 */

import { DataVO } from "../../../../plaza/model/DataVO";

const {ccclass, property} = cc._decorator;

@ccclass
export default class F_CSBY_Score extends cc.Component {

    //影子精灵
    @property(cc.Font)
    font1:cc.Font =null;
    //影子精灵
    @property(cc.Font)
    font2:cc.Font =null;

    constructor(strText, charMapFile?){
        super();
    }
    reuse (font,pos) {
        this.node.setScale(1);
        if(font){
            this.node.getComponent(cc.Label).font =this.font1;
        } else {
            this.node.getComponent(cc.Label).font =this.font2;
        }
        this.node.setPosition(pos);
    }
    removeSelf (e) {
        e.stopAllActions();
        e.removeFromParent();
        DataVO.GD.nodePools.ScorePool.freeNode(e)
    }
}
