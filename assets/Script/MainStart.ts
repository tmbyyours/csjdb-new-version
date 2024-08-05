import SocketManager from "./common/managers/SocketManager";
import { UIConf, uiManager } from "./common/managers/UIManager";
import { UIView } from "./common/managers/UIView";
import { resLoader } from "./common/res/ResLoader";
import MPConfig from "./extend/MPConfig";
import LanguagePack from "./extend/LaguagePack";
import GameGlobalData = require('./extend/hotupdate/defines/GlobalGameData.js');
import Util from "./extend/Util";
import { exitEnum } from "./extend/MPDefine";
import { DataVO } from "./plaza/model/DataVO";
import { NodePool } from "./common/res/NodePool";
import SystemToast from "./extend/ui/SystemToast";
import HttpManager from "./common/managers/HttpManager";
import UserInfo from "./plaza/model/UserInfo";


const { ccclass, property } = cc._decorator;

export enum UIID {
    UILoading,
}

export let UICF: { [key: number]: UIConf } = {
    [UIID.UILoading]: { prefab: "plaza/prefab/ui/Loading" },
}

@ccclass
export default class MainStart extends UIView {

    // @property(cc.Node)
    // loading: cc.Node = null
    // @property(cc.ProgressBar)
    // ps: cc.ProgressBar = null   

    @property(cc.Node)
    loading: cc.Node = null

    @property(cc.ProgressBar)
    ps: cc.ProgressBar = null

    @property(cc.Sprite)
    tips: cc.Sprite = null

    @property(cc.SpriteAtlas)
    spa: cc.SpriteAtlas = null;

    start() {
        DataVO.GD.loadCount = 1
        cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE)
        DataVO.GD.nodePools = {};
        DataVO.GD.nodePools['Prompt'] = new NodePool();
        DataVO.GD.nodePools['Toast'] = new NodePool();
        DataVO.GD.nodePools['Prompt'].init('public/Prompt', 1)
        DataVO.GD.nodePools['Toast'].init('public/Toast', 1)
        DataVO.GD.exitType = exitEnum.noexit
        DataVO.GD.gamestatus = 0
        DataVO.GD.preScene = 'ChooseScene'
        cc.log('---------------时间1111111--------------------')
        cc.log(cc.director.getTotalTime())
        // uiManager.initUIConf(UICF);
        //显示loading界面
        // uiManager.open(UIID.UILoading);
        //热更新，h5暂无
        //加载外部配置表，h5暂无
        //预加载美术资源
        //网络连接
        // LanguagePack.getInstance().loadLanguage();
        // SocketManager.getInstance().connect(MPConfig.forwardHost)
        //切换到Login界面
        //切换到Hallscene
        // ApplicationFacade.getInstance().startUp(this.node);
        // SocketManager.getInstance().connect('wss://47.106.168.83:10000/Client')
        // var newClass: any = new (<any>View)["test1Mediator"](this.node);
        // var newClass = new Mediators["testMediator"](this.node);
        // cc.log(newClass)
        // this.loading.active = true;
        this.connectServer();
        // let it = 0;
        // cc.director.getScheduler().schedule(() => {
        //     it += 0.05;
        //     if (it >= 1.0) {
        //         it = 1.0;
        //         cc.director.getScheduler().unscheduleAllForTarget(this.loading);
        //         this.loading.active = false;
        //         // this.connectServer();
        //     }
        //     this.ps.progress = it
        // }, this.loading, 0.01, 1e+9, 0, false);       

        this.scheduleOnce(() => {
            // SystemToast.GetInstance().buildPrompt('网络缓慢，请刷新重载', 1, () => {
            //     window.location.href = window.location.href
            //     // if (cc.sys.isBrowser) {
            //     //     window.location.href = window.location.href
            //     // }
            //     // if (cc.sys.isNative) {
            //     //     cc.director.loadScene('RoomScene')
            //     // }
            // })
            SystemToast.GetInstance().buildPromptNew('发生错误，请重新登入', 9005, 1, () => {
                window.location.href = window.location.href
                // if (cc.sys.isBrowser) {
                //     window.location.href = window.location.href
                // }
                // if (cc.sys.isNative) {
                //     cc.director.loadScene('RoomScene')
                // }
            })
        }, 60)

        // DataVO.GD.tipsrd = Math.floor(Util.randNum(1, 9));
        // cc.log('加载图片为  ' + `GP_Loading_Msg_0${DataVO.GD.tipsrd}_cn_png`);
        // this.tips.spriteFrame = this.spa.getSpriteFrame(`GP_Loading_Msg_0${DataVO.GD.tipsrd}_cn_png`);

        this.loading.active = true;
        // let it = 0;
        // cc.director.getScheduler().schedule(() => {
        //     it += 0.08;
        //     if (it >= 1.0) {
        //         it = 1.0;
        //         //this.loading.active = false;
        //         cc.director.getScheduler().unscheduleAllForTarget(this.loading);
        //     }
        //     this.ps.progress = it
        // }, this.loading, 0.005, 1e+9, 0, false);    
        MPConfig.first = true

        if (cc.sys.isMobile) {
            if (Util.isFullScreen() == 'Full-Screen') {
                cc.find('newjiazai/ani', this.loading).scale = 0.6
                cc.find('newjiazai/bgd', this.loading).setScale(1.8, 2)
                cc.find('newjiazai/bgd', this.loading).y = -90
            } else {
                cc.find('newjiazai/ani', this.loading).scale = 0.7
                cc.find('newjiazai/bgd', this.loading).setScale(1.8, 2.2)
                cc.find('newjiazai/bgd', this.loading).y = -100
            }
        }
    }

    connectServer() {
        cc.log('########################')
        // let ob = Util.getGet()
        // var rawStr = "a2luZElkPTMmbW9kdWxlSWQ9MTImcm9vbWlkPTE2OSZ1dWlkPTY1MjViZGQ4LWFmYjgtMTFlYS1iODZlLTAwMTYzZTAwNWQ1ZSZmb3J3YXJkSG9zdD13czovLzM5Ljk5LjM5LjI1NDoxMDAwMC9DbGllbnQmZ2V0SXA9aHR0cDovLzM5Ljk5LjQwLjE2OjMwODkwL3NlcnZpY2VzL2RnL3BsYXllci9wbGF5QWRkcmVzcw%3D%3D"; 

        // var cryptoInfo = CryptoJS.AES.encrypt(JSON.stringify({ rawStr }), 'secret').toString();
        // var info2 = CryptoJS.AES.decrypt(cryptoInfo, 'secret').toString(CryptoJS.enc.Utf8);
        // cc.log('encrypted:', info2);

        // var rawStr = "params=a2luZElkPTMmbW9kdWxlSWQ9MTImcm9vbWlkPTE0. 2OSZ1dWlkPTY0YmRkMjA2LThmOTUtMTFlYS04NDg1LTAwMTYzZTA2NTYxNQ%3D%3D";  
        // var cryptoInfo = CryptoJS.AES.encrypt(JSON.stringify({ rawStr }), 'secret').toString();
        // var info2 = CryptoJS.AES.decrypt(cryptoInfo, 'secret').toString(CryptoJS.enc.Utf8);
        // cc.log('encrypted:', info2);

        //decrypt      
        /*var rawStr = "kindId=2&moduleId=12&roomid=3&uuid=c815653a-8610-11ea-8485-00163e065615";
        var wordArray = CryptoJS.enc.Utf8.parse(rawStr);
        var base64 = CryptoJS.enc.Base64.stringify(wordArray);
        cc.log('encrypted:', base64);

        //decrypt
        var parsedWordArray = CryptoJS.enc.Base64.parse(base64);
        var parsedStr = parsedWordArray.toString(CryptoJS.enc.Utf8);
        cc.log("parsed:",parsedStr);*/


        //CryptoJS.enc.Base64.parse("a2luZElkPTMmbW9kdWxlSWQ9MSZyb29taWQ9MTcmdXVpZD04NzM5ZjVlMjg0NmQxMWVhYjQyNWE4NWU0NWEwYzk3MQ")


        cc.log(window.location.href);
        let url = MPConfig.forwardHost
        // //本地测试
        // cc.log(Util.getGet());

        // if (Util.getGet()["ip"]) {
        //     url = `wss://${Util.getGet()["ip"]}:10000/Client`
        // }
        // if (Util.getGet()["logintype"]) {
        //     MPConfig.loginType = Util.getGet()["logintype"]
        // }
        // if (Util.getGet()["params"]) {
        //     cc.sys.localStorage.clear();
        //     MPConfig.loginType = "6"
        // }
        // cc.log('==================   ')
        // cc.log(Util.getGet()["params"])
        // SocketManager.getInstance().connect(url)

        // return

        //本地测试

        //网络连接

        //先检测params中的参数
        // SocketManager.getInstance().connect('ws://192.168.110.236:11111/Client')
        // return 

        if (Util.getGet()["params"]) {
            let des = decodeURI(Util.getGet()["params"])
            cc.log(des)
            // var paramsArray = CryptoJS.enc.Base64.parse(Util.getGet()["params"]);
            var paramsArray = CryptoJS.enc.Base64.parse(des);
            var parsedStr = paramsArray.toString(CryptoJS.enc.Utf8);
            let params = Util.getStrArray(parsedStr)
            cc.log("parsed:", params);
            // this.data["guestID"] = params["uuid"];
            UserInfo.GetInstance().setData({ params: params })
            cc.sys.localStorage.clear();
            MPConfig.loginType = "6"
            MPConfig.forwardHost = UserInfo.GetInstance().getData()['params']['forwardHost']
            url = MPConfig.forwardHost
            MPConfig.sslFlag = UserInfo.GetInstance().getData()['params']['forwardHost'].split(':')[0] == 'wss' ? true : false
            MPConfig.getIp = UserInfo.GetInstance().getData()['params']['getIp']
            MPConfig.path = UserInfo.GetInstance().getData()['params']['path']
            SocketManager.getInstance().connect(url)
        } else {
            //如果没有   则检测  MPconfig.js配置
            let cfgurl = window.location.href.toString().split('?')[0] + '/web/MPconfig.json'
            // LanguagePack.getInstance().loadLanguage();
            HttpManager.getInstance().Get(cfgurl, 5000, (data, rsp?: any) => {

                cc.log(data)
                cc.log('||||||||||||||||||')

                if (data == 200) {
                    for (let key in rsp['MPConfig']) {
                        cc.log(key)
                        MPConfig[key] = rsp['MPConfig'][key]
                    }
                    url = MPConfig.forwardHost
                    // if (!MPConfig.sslFlag) {
                    //     url = url.replace('wss', 'ws')
                    // }
                    MPConfig.sslFlag = url.split(':')[0] == 'wss' ? true : false

                    cc.log(Util.getGet());

                    if (Util.getGet()["ip"]) {
                        if (MPConfig.sslFlag) {
                            url = `wss://${Util.getGet()["ip"]}:10000/Client`
                        } else {
                            url = `ws://${Util.getGet()["ip"]}:10000/Client`
                        }
                    }
                    if (Util.getGet()["logintype"]) {
                        MPConfig.loginType = Util.getGet()["logintype"]
                    }
                    cc.log('==================   ')
                    cc.log(data)
                    SocketManager.getInstance().connect(url)

                }
                if (data == 500 || data == 404) { //都没有 直接读取配置ts文件
                    url = MPConfig.forwardHost
                    if (Util.getGet()["ip"]) {
                        url = `ws://${Util.getGet()["ip"]}:10000/Client`
                    }
                    if (Util.getGet()["logintype"]) {
                        MPConfig.loginType = Util.getGet()["logintype"]
                    }
                    if (Util.getGet()["params"]) {
                        cc.sys.localStorage.clear();
                        MPConfig.loginType = "6"
                    }
                    MPConfig.sslFlag = url.split(':')[0] == 'wss' ? true : false
                    cc.log('==================   ')
                    cc.log(data)
                    SocketManager.getInstance().connect(url)
                }
            })
        }

        // SocketManager.getInstance().connect(url)

        // let cfgurl = window.location.href.toString().split('?')[0] + 'MPconfig.json'
        // // LanguagePack.getInstance().loadLanguage();
        // HttpManager.getInstance().Get(cfgurl, (data, rsp?: any) => {

        //     cc.log(data)
        //     cc.log('||||||||||||||||||')

        //     if (data == 200) {
        //         for (let key in rsp['MPConfig']) {
        //             cc.log(key)
        //             MPConfig[key] = rsp['MPConfig'][key]
        //         }
        //         url = MPConfig.forwardHost
        //         if (!MPConfig.sslFlag) {
        //             url = url.replace('wss', 'ws')
        //         }

        //         cc.log(Util.getGet());

        //         if (Util.getGet()["ip"]) {
        //             if (MPConfig.sslFlag) {
        //                 url = `wss://${Util.getGet()["ip"]}:10000/Client`
        //             } else {
        //                 url = `ws://${Util.getGet()["ip"]}:10000/Client`
        //             }
        //         }
        //         if (Util.getGet()["logintype"]) {
        //             MPConfig.loginType = Util.getGet()["logintype"]
        //         }
        //         if (Util.getGet()["params"]) {
        //             cc.sys.localStorage.clear();
        //             MPConfig.loginType = "6"
        //         }
        //         cc.log('==================   ')
        //         cc.log(data)
        //         cc.log(Util.getGet()["params"])
        //         SocketManager.getInstance().connect(url)
        //     }
        //     if (data == 500 || data == 404) {
        //         url = MPConfig.forwardHost
        //         if (Util.getGet()["ip"]) {
        //             url = `ws://${Util.getGet()["ip"]}:10000/Client`
        //         }
        //         if (Util.getGet()["logintype"]) {
        //             MPConfig.loginType = Util.getGet()["logintype"]
        //         }
        //         if (Util.getGet()["params"]) {
        //             cc.sys.localStorage.clear();
        //             MPConfig.loginType = "6"
        //         }
        //         cc.log('==================   ')
        //         cc.log(data)
        //         cc.log(Util.getGet()["params"])
        //         SocketManager.getInstance().connect(url)
        //     }
        // })





        // SocketManager.getInstance().connect(MPConfig.forwardHost)
        // SocketManager.getInstance().connect(url)
    }
}
