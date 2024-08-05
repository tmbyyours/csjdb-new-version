const {ccclass, property} = cc._decorator;

@ccclass
export default class AutoStopSelf extends cc.Component {
    stopSelf () {
        this.node.active =false;
        this.node.getComponent(cc.Animation).stop();
    }
}
