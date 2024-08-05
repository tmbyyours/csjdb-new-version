

const {ccclass, property} = cc._decorator;

@ccclass
export default class F_CSBY_Notice extends cc.Component {

    //背景图片
    @property(cc.Sprite)
    bgSprite: cc.Sprite =null;
    
    constructor(data){
        super();
    }
}
