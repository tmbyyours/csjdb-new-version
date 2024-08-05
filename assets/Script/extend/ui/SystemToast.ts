import { resLoader } from "../../common/res/ResLoader";
import { DataVO } from "../../plaza/model/DataVO";
import Util from "../Util";

/**
 * 系统提示类
 */
export default class SystemToast {
    idx = 1;
    public static GetInstance(): SystemToast {
        if (SystemToast._instance == null) {
            SystemToast._instance = new SystemToast();
        }
        return SystemToast._instance;
    }

    private static _instance = null;


    buildToast(str: string, bo: boolean = true) {
        return
        // cc.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");
        //cc.log(str);
        if (DataVO.GD.disconnected) {
            let _scene = cc.director.getScene();
            let nd = _scene.getChildByName('Toast')
            if (nd)
                _scene.removeChild(toast);
            return
        }
        if (str.indexOf('子弹') != -1) {
            this.idx = 2
        }
        if (str.indexOf('金币不足') != -1) {
            this.idx = 3
        }
        if (str.indexOf('长时间') != -1) {
            this.idx = 4
        }
        let _scene = cc.director.getScene();
        let nd = _scene.getChildByName('Toast')
        if (nd)
            return
        var toast = DataVO.GD.nodePools['Toast'].getNode();
        (toast.getChildByName("text").getComponent(cc.Label)).string = str;
        let chi = toast.children
        for (let i = 2; i <= 4; i++) {
            chi[i].active = false;
        }
        chi[this.idx].active = true;
        setTimeout(function () {
            let _scene = cc.director.getScene();
            let nd = _scene.getChildByName('Toast')
            if (nd && bo)
                _scene.removeChild(toast);
        }, 2000)
        _scene.addChild(toast);
        // resLoader.loadRes("public/Toast", cc.Prefab, (error: Error, p: cc.Prefab) => {
        //     var toast = cc.instantiate(p);
        //     (toast.getChildByName("text").getComponent(cc.Label)).string = str;
        //     let chi = toast.children
        //     for (let i = 2; i <= 4; i++) {
        //         chi[i].active = false;
        //     }
        //     chi[this.idx].active = true;
        //     setTimeout(function () {
        //         let _scene = cc.director.getScene();
        //         let nd = _scene.getChildByName('Toast')
        //         if (nd && bo)
        //             _scene.removeChild(toast);
        //     }, 2000)
        //     _scene.addChild(toast);
        // }
        // );
    }

    buildPrompt(str: string, kind: number = 2, sureCallBack = null, cancelCallBack = null) {
        let _scene = cc.director.getScene();
        let nd = _scene.getChildByName('Prompt')
        if (nd)
            return
        var prmpt = DataVO.GD.nodePools['Prompt'].getNode();
        if (str.indexOf('禁用') != -1) {
            str = '网络不稳定'
        }
        (prmpt.getChildByName("msg").getComponent(cc.Label)).string = str;
        let chi = prmpt.children
        let sureBtn = prmpt.getChildByName("sureBtn")
        let cancelBtn = prmpt.getChildByName("cancelBtn")
        if (kind == 1) {
            cancelBtn.active = false
            sureBtn.active = true
            sureBtn.setPosition(cc.v2(0, -45))
        } else {
            cancelBtn.active = true
            sureBtn.active = true
            cancelBtn.setPosition(cc.v2(-120, -45))
            sureBtn.setPosition(cc.v2(120, -45))
        }
        if (typeof sureCallBack === 'function') {
            sureBtn.getComponent(cc.Button).node.on(cc.Node.EventType.TOUCH_START, sureCallBack, sureBtn)
        }
        if (typeof cancelCallBack === 'function') {
            cancelBtn.getComponent(cc.Button).node.on(cc.Node.EventType.TOUCH_START, cancelCallBack, cancelBtn)
        }
        _scene.addChild(prmpt);
    }

    buildPromptNew(str: string, errcode = 1, kind: number = 2, sureCallBack = null, cancelCallBack = null, ani: boolean = false) {
        let _scene = cc.director.getScene();
        let nd = _scene.getChildByName('Prompt')
        if (nd)
            return
        var prmpt = DataVO.GD.nodePools['Prompt'].getNode();
        if (str.indexOf('禁用') != -1) {
            str = '网络不稳定'
        }
        (prmpt.getChildByName("msg").getComponent(cc.Label)).string = str;
        (prmpt.getChildByName("code").getComponent(cc.Label)).string = '错误代码:' + errcode;
        (prmpt.getChildByName("tips").getComponent(cc.Label)).string = Date.now() + '@' + Util.generateUUID();
        let chi = prmpt.children
        let sureBtn = prmpt.getChildByName("sureBtn")
        let cancelBtn = prmpt.getChildByName("cancelBtn")
        if (kind == 1) {
            prmpt.getChildByName("msg").y = 16
            prmpt.getChildByName("msg0").active = false
            prmpt.getChildByName("line").y = -5
            prmpt.getChildByName("tips").y = -22
            cancelBtn.active = false
            sureBtn.active = true
            sureBtn.setPosition(cc.v2(0, -65))
            sureBtn.getChildByName('str').getComponent(cc.Label).string = '确认'
        } else {
            prmpt.getChildByName("bg").width += 40
            prmpt.getChildByName("msg").y = 22
            prmpt.getChildByName("msg0").active = true
            prmpt.getChildByName("line").y = -16
            prmpt.getChildByName("line").width += 40
            prmpt.getChildByName("tips").y = -32
            cancelBtn.active = true
            sureBtn.active = true
            cancelBtn.setPosition(cc.v2(-40, -65))
            sureBtn.setPosition(cc.v2(40, -65))
            sureBtn.getChildByName('str').getComponent(cc.Label).string = '重读'
            cancelBtn.getChildByName('str').getComponent(cc.Label).string = '返回'
        }
        if (typeof sureCallBack === 'function') {
            sureBtn.getComponent(cc.Button).node.on(cc.Node.EventType.TOUCH_START, sureCallBack, sureBtn)
        }
        if (typeof cancelCallBack === 'function') {
            cancelBtn.getComponent(cc.Button).node.on(cc.Node.EventType.TOUCH_START, cancelCallBack, cancelBtn)
        }
        _scene.addChild(prmpt);
        cc.log(ani)
        if (ani) {
            cc.log('aniiiiiiii')
            prmpt.opacity = 0
            cc.Tween.stopAllByTarget(prmpt)
            cc.tween(prmpt).to(0.8, { opacity: 255 }).start()
        }
    }

    closeBuildPromptNew() {
        let _scene = cc.director.getScene();
        let nd = _scene.getChildByName('Prompt')
        if (nd) {
            cc.Tween.stopAllByTarget(nd)
            cc.tween(nd).to(0.8, { opacity: 0 }).call(() => {
                cc.log('aniiiiiiiicccccccc')
                nd.removeFromParent()
                nd.destroy()
            }).start()
        }

    }
}