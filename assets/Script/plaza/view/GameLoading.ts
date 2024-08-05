import { UIConf, uiManager } from "../../common/managers/UIManager";
import LanguagePack from "../../extend/LaguagePack";
import Util from "../../extend/Util";
import GameGlobalData = require('../../extend/hotupdate/defines/GlobalGameData.js');
const { ccclass, property } = cc._decorator;

export enum UIID {
    UILoading,
}

export let UICF: { [key: number]: UIConf } = {
    [UIID.UILoading]: { prefab: "plaza/prefab/ui/Loading" },
}


@ccclass
export default class GameLoading extends cc.Component {

    @property(cc.ProgressBar)
    progressbar: cc.ProgressBar = null;

    @property({ type: cc.Sprite })
    background: cc.Sprite = null;

    @property(cc.Sprite)
    tips: cc.Sprite = null

    @property(cc.SpriteAtlas)
    spa: cc.SpriteAtlas = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        // uiManager.initUIConf(UICF);
        //显示loading界面
        // uiManager.open(UIID.UILoading);
        //热更新，h5暂无
        //加载外部配置表，h5暂无
        //预加载美术资源        
        // resLoader.loadRes("subgame/fish/caishenbuyu/images/GP_Loading_Background_png", cc.SpriteFrame, (error: Error, sp: cc.SpriteFrame) => {
        //     cc.log(error)
        //     this.background.spriteFrame = sp;
        //     //resLoader.releaseAsset(sp);
        // });
        LanguagePack.getInstance().loadLanguage();
        // SocketManager.getInstance().connect(MPConfig.forwardHost);
        //切换到Login界面
        //切换到Hallscene
        // ApplicationFacade.getInstance().startUp(this.node);
        // SocketManager.getInstance().connect('wss://47.106.168.83:10000/Client')
        // var newClass: any = new (<any>View)["test1Mediator"](this.node);
        // var newClass = new Mediators["testMediator"](this.node);
        // cc.log(newClass)
        let rd = Math.floor(Util.randNum(1, 9));
        // resLoader.loadRes(`subgame/fish/caishenbuyu/ui/ui`, cc.SpriteAtlas, (error: Error, sp: cc.SpriteAtlas) => {
        //     cc.log(error)
        //     this.tips.spriteFrame = sp.getSpriteFrame(`GP_Loading_Msg_0${rd}_cn_png`);
        //     //resLoader.releaseAsset(sp);
        // });
        cc.log('加载图片为  ' + `GP_Loading_Msg_0${ rd }_cn_png`);
        this.tips.spriteFrame = this.spa.getSpriteFrame(`GP_Loading_Msg_0${rd}_cn_png`);
        this.changescene();
    }

    async changescene() {
        cc.log("changescenechangescenechangescenechangescene")
        cc.log(GameGlobalData)
        cc.director.preloadScene(GameGlobalData.curGame, (cur, tot) => { this.progressbar.progress = (cur / tot) }, () => {
            cc.director.getScheduler().schedule(
                () => { cc.director.loadScene(GameGlobalData.curGame); }, this, 1, 1, 0.5, false
            );
        })
    }

    // update (dt) {}
}
