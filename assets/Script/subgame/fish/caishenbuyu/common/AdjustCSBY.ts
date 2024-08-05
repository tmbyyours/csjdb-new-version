import MPConfig from "../../../../extend/MPConfig";
import { DataVO } from "../../../../plaza/model/DataVO";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AdjustCSBY extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    ssize
    // onLoad () {}
    start() {
        return
        this.onResize()
        cc.view.setResizeCallback(() => {
            this.onResize()
        });
    }


    onResize(): void {
        DataVO.GD.widthOrHight = 'width'
        DataVO.GD.offsetSize = 0
        DataVO.GD.offsetSizeX = 0
        DataVO.GD.offsetSizeY = 0
        this.ssize = cc.winSize
        cc.error('屏幕大小    宽和高')
        cc.log(this.ssize.width + '          ' + this.ssize.height)
        if (this.ssize.width / this.ssize.height > MPConfig.V.w / MPConfig.V.h + 0.1) {
            DataVO.GD.offsetSize = (this.ssize.width - MPConfig.V.w) * 0.5
            DataVO.GD.offsetSizeX = (this.ssize.width - MPConfig.V.w) * 0.5
            DataVO.GD.offsetSizeY = 0
            // this.node.getComponent(cc.Widget).isAlignLeft = true
            // this.node.getComponent(cc.Widget).left = DataVO.GD.offsetSize
            // this.node.getComponent(cc.Widget).isAlignRight = true
            // this.node.getComponent(cc.Widget).right = DataVO.GD.offsetSize
            DataVO.GD.isbalck = true
        }else{
            DataVO.GD.offsetSize = (this.ssize.height - MPConfig.V.h) * 0.5
            DataVO.GD.offsetSizeX = 0
            DataVO.GD.offsetSizeY = (this.ssize.height - MPConfig.V.h) * 0.5
            // this.node.getComponent(cc.Widget).isAlignLeft = true
            // this.node.getComponent(cc.Widget).left = DataVO.GD.offsetSize
            // this.node.getComponent(cc.Widget).isAlignRight = true
            // this.node.getComponent(cc.Widget).right = DataVO.GD.offsetSize
            DataVO.GD.isbalck = true
        }

        let rect = cc.view.getFrameSize()
        let cvs = this.node.getComponent(cc.Canvas)
        let designw = cvs.designResolution.width
        let designh = cvs.designResolution.height
        if (rect.width / rect.height > designw / designh) {
            cc.log('！！！！！宽宽宽宽宽宽宽度增加太多')
            cvs.fitHeight = true
            cvs.fitWidth = false
            DataVO.GD.widthOrHight = 'width'
        } else {
            cc.log('@@@@@@@@高高高高高高高度增加太多')
            cvs.fitHeight = false
            cvs.fitWidth = true
            DataVO.GD.widthOrHight = 'hight'
        }
    }
    // updat


    // update (dt) {}
}
