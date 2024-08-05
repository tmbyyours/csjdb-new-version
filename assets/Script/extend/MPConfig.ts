/**
 * 游戏全局基础配置 数据结构
 */

const G_APPLE_EXAMINE = false

const MPConfig =
{
    //服务器列表
    servers: [],
    // forwardHost: "ws://47.56.206.231:10000/Client",
    // forwardHost: "ws://47.56.206.231:10000/Client",
    // forwardHost: "ws://47.52.16.239:10000/Client",
    // forwardHost: "ws://192.168.110.214:10000/Client",
    forwardHost: "ws://xxx.xxx.xxx.xxx:10000/Client",
    // forwardHost: "ws://192.168.110.236:11111",
    // forwardHost: "ws://39.99.37.4:10000/Client",
    // forwardHost: "ws://39.99.52.207:10000/Client",
    // forwardHost: "ws://server.binfoi.cn:10000/Client",
    // forwardHost: "ws://39.99.52.207:10000/Client",//子大厅    
    sslFlag: true,
    getIp: 'http://xxx.xxx.xxx:xxx/services/dg/player/playAddress',//获取客户端ip
    // getIp: 'http://39.99.40.16:30890/services/dg/player/playAddress',//获取客户端ip
    // clientVersion: '1.0.7.8',
    clientVersion: '2.0.1.8',
    path: 'Client',

    //登录模式 0 手机号密码登录,1 手机号短信登录,2 微信公众号
    loginType: "2",

    guestlogin: false,

    first: true,

    //是否开启调试
    G_Debug_Open: true,

    //是否是发布模式
    _MODE: true,
    productName: "",
    CURRENCY: "金币",
    //渠道
    channel: "a",
    //是否为苹果审核版本
    G_APPLE_EXAMINE: false,

    //是否打开转账功能
    G_OPEN_ZHUAN_ZHANG: !G_APPLE_EXAMINE,

    //是否打开苹果支付
    G_OPEN_APPLE_PAY: G_APPLE_EXAMINE,

    //是否打开奖品区
    G_OPEN_PRIZE_AREA: !G_APPLE_EXAMINE,

    //是否打开靓号
    G_OPEN_PRETTYSIGN_AREA: false,

    //是否个人转账支付
    G_OPEN_PERSONAL_PAY: true,

    //是否斗地主内置
    G_OPEN_DOUDIZHU_BUILTIN: false,

    //是否打开批量购买
    G_OPEN_StoreBatchBuy: false,

    //是否打开兑换功能
    G_OPEN_EXCHANGE: false,

    //是否打开兑换功能
    G_OPEN_EXPERIENCE: true,

    //是否打开扫码功能
    G_OPEN_QRCODE_SCANNER: false,

    //是否开启现金红包活动
    G_OpenTakeLuckyRMBActivity: false,

    //是否打开每日签到
    G_OPEN_DAILY_ATTENDANCE: false,

    //是否打开系统公告
    G_OPEN_SYSTEM_NOTICE: true,

    //是否打开摊位功能
    G_OPEN_BOOTH: false,

    //是否打开客服功能
    G_OPEN_CUSTOMER_SERVICE: true,

    //是否打开实名奖励
    G_OPEN_REALNAME_REWARD: false,

    //是否打开奖品订单
    G_OPEN_PRIZE_ORDER: false,

    //是否打开推广红包
    G_OPEN_RED_PACKET: false,

    //是否打开socket日志
    G_OPEN_SOCKET_LOG: false,

    //是否显示touch帮助
    G_SHOW_HELP: false,

    //是否开启地域显示
    G_OPEN_REGION: false,

    //所有房间统一
    G_ALL_ROOM_SAME: false,

    //锁鱼和自动都开启的情况，自动锁鱼
    G_OPEN_AUTO_LOCKFISH: false,

    G_OPEN_AUTO_AIM_FISH: false,

    //渠道排行榜开关
    G_OPEN_CHANNEL_RANK: true,

    //是否开启退潮加速
    G_OPEN_DOWNWATER_UPSPEED: true,

    //竖屏游戏排除
    verticalScreenGameArray: [

    ],
    GoldRatio: 1,    //获取金币比率
    GoldAccuracy: 2, //获取金币精度
    HeartTime: 300000,  //心跳超时
    OpenAcer: false,   //钻石开关
    HeadCount: 10,    //头像个数
    //子游戏的分辨率
    V: {
        w: 1280,
        h: 720,
    }
}
export default MPConfig