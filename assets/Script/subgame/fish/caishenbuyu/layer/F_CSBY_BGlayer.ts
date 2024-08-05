import { resLoader } from "../../../../common/res/ResLoader";
import Util from "../../../../extend/Util";
import { EventManager } from "../../../../common/managers/EventManager";

const { ccclass, property } = cc._decorator;
//场景背景
@ccclass
export default class F_CSBY_BGLayer extends cc.Component {
    //背景图片
    @property(cc.Sprite)
    bgSprite: cc.Sprite = null;
    //气泡效果
    @property(cc.Node)
    bubbleParticle: cc.Node = null;
    //当前背景层
    bgIndex: Number;
    // LIFE-CYCLE CALLBACKS:

    @property([cc.Node])
    ani: cc.Node[] = []

    onLoad() {
        this.pao()
    }
    setBgIndex(bgIndex) {
        resLoader.loadRes("subgame/fish/caishenbuyu/images/GP_Base_Background_0" + (bgIndex + 1) + ".jpg", cc.SpriteFrame, (error: Error, sp: cc.SpriteFrame) => {
            cc.log(error)
            this.bgSprite.spriteFrame = sp;
            //resLoader.releaseAsset(sp);
            EventManager.getInstance().raiseEvent('reSetDone');
        });
    }

    pao() {
        let paop = [cc.v2(-495, -260), cc.v2(-456, -230), cc.v2(-497 - 210), cc.v2(-452 - 225), cc.v2(-457 - 285), cc.v2(-446 - 250)]
        let createanipao = () => {
            idx++
            if (idx > 12) {
                this.unschedule(createanipao)
            }
            // for (let i = 0; i < 15; i++) {
            let rdp = Math.floor(Util.randNum(0, 3))
            let rddx = Math.floor(Util.randNum(-10, 30))
            let rddy = Math.floor(Util.randNum(-10, 50))
            let littlepao = cc.instantiate(this.ani[0])
            let rr = Math.random() * 0.7 + 0.8
            littlepao.setScale(rr)
            littlepao.setParent(this.ani[1]);
            littlepao.opacity = 0
            let pp = paop[rdp].add(cc.v2(rddx, rddy))
            littlepao.setPosition(pp);
            let t = cc.tween;
            let dur = Math.floor(Util.randNum(2.0, 3.0));
            let ds = Util.randNum(0, 0.9) + 0.3
            let dd = Util.randNum(0, 0.2) + 0.2
            t(littlepao)
                .delay(ds)
                .to(dd, { opacity: 255 })
                .parallel(
                    t().to(dur, { scale: 0 }),
                    t().by(dur, { position: cc.v2(0, 60 + rddy) }, { easing: 'easeIn' }),
                    t().to(dur, { opacity: 0 })
                )
                .call(() => { littlepao.removeFromParent() }).start()
            // }
        }
        let idx = 0
        let paos = () => {
            idx = 0
            this.schedule(createanipao, 0.15, 1e+9)
        }
        this.schedule(paos, 16, 1e+9)
    }
}
