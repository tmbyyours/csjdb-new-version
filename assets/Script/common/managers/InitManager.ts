import SocketManager from "./SocketManager";

export default class InitManager {
    constructor() {
    }
    static instance: InitManager
    static getInstance() {
        if (!InitManager.instance) {
            InitManager.instance = new InitManager()
        }
        return InitManager.instance
    }
    /**
     * 步骤总数
     */
    public static readonly maxStep:number = 4;

    /**
     * 加载语言包 第一步
     */
    public static readonly LANGUAGE:string = "Step_1";

    /**
     * 加载客户端配置 第二步
     */
    public static readonly INITCONFIG:string = "Step_2";

    /**
     * 加载美术资源 第三步
     */
    public static readonly INITSOURCE:string = "Step_3";
    /**
     * 登录 第四步
     */
    public static readonly LOGIN:string = "Step_6";

    /**
     * 初始化开始
     *
     */
    public start():void{
        //第一步 加载语言包
    }
    /**
     * 转向下一步
     *
     */
    public  nextStep(type:string,arg:object=null):void {
        switch (type) {
            case InitManager.INITCONFIG:
                break;
            case InitManager.INITSOURCE:
                break;
            case InitManager.LOGIN:
                break;
        }
    }
}