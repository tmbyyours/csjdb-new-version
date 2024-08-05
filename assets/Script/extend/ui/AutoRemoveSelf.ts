import { DataVO } from "../../plaza/model/DataVO";
import Util from "../Util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AutoRemoveSelf extends cc.Component {
    //node缓存池
    poolName
    removeSelf() {
        if(this.node.name =="shine"){
            this.node.parent.removeFromParent();
            DataVO.GD.nodePools[this.poolName].freeNode(this.node.parent)
        } else {
        /*let cmp = this.node.getComponent(cc.Animation)
        if (cmp)
            this.node.removeComponent(cc.Animation)*/
            this.node.removeFromParent();
            DataVO.GD.nodePools[this.poolName].freeNode(this.node)
            // this.node.parent.destroy()
        }
    }
}
