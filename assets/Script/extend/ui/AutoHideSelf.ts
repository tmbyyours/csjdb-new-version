import { DataVO } from "../../plaza/model/DataVO";
import Util from "../Util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AutoHideSelf extends cc.Component {
    hideSelf() {
        cc.log("AutoHideSelf")
        //this.node.active = false;
        if (!DataVO.GD.autoFire) {
            this.node.active = false;
        }
    }
}
