

const {ccclass, property} = cc._decorator;

@ccclass
export default class AutoStopSelf1 extends cc.Component {
    stopSelf () {
        this.node.getComponent(cc.Animation).stop();
    }
}
