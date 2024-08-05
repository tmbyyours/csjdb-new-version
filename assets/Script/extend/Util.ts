import MPConfig from "./MPConfig";

//工具类
export default class Util {


    public static clamp = function (value, min, max) {
        return Math.min(Math.max(value, min), max);
    };

    public static uint8ArrayToString = function (buf) {
        return String.fromCharCode.apply(null, buf);
    };

    public static stringToUint8Array = function (str) {
        var buf = new ArrayBuffer(str.length);
        var uint8Array = new Uint8Array(buf);
        for (var i = 0; i < str.length; i++) {
            uint8Array[i] = str.charCodeAt(i);
        }

        return uint8Array;
    };

    public static toHexString = function (data) {
        var hexString = "";

        for (var i = 0; i < data.length; i++) {
            var hex = ("00" + data[i].toString(16)).substr(-2).toUpperCase();
            hexString += hex;
        }

        return hexString;
    };

    public static generateUUID = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    public static encodeURI = function (obj) {
        return Object.keys(obj).map(function (key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
        }).join('&');
    };

    public static getQRCodeUrl = function (url) {


        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "https://" + MPConfig.forwardHost + ":10903/" + url;
        }

        if (cc.sys.os == cc.sys.OS_IOS)
            url = "https://" + MPConfig.forwardHost + ":10903/qrcode?url=" + url;
        else
            url = "http://" + MPConfig.forwardHost + ":10902/qrcode?url=" + url;

        return url;
    };

    //判断一个点， 是在线的左边， 还是右边
    // 负数左边， 0， 刚好线上， 正数右边
    //x1, y1, x2, y2, 表示线
    //x, y表示点
    public static calcInLineSide = function (x1, y1, x2, y2, x, y) {
        var value = (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1);
        return value
    };

    //dump
    public static dump = function (obj, deep, hash) {

        //发布模式就不要打印了

        if (cc.sys.isNative) {
            var str = JSON.stringify(obj);

            cc.log(str);
            return;
        }
        //var str = JSON.stringify(obj);
        //
        //cc.log(str);
        //return ;


        var tab20 = "";
        for (var i = 0; i < 100; ++i) {
            tab20 += "\t";
        }
        deep = deep || 1;
        if (deep == 1) {
            cc.log("----------------dump--------------------" + tab20);
        }
        var tab = "";
        for (var i = 0; i < deep - 1; ++i) {
            tab += "\t";
        }
        if (typeof (obj) == "object") {

            hash = hash || [];

            for (var index in hash) {
                if (hash[index] == obj) {
                    cc.log(tab + "\t" + "hash printed," + tab20);
                    return;
                }
            }

            hash.push(obj);

            cc.log(tab + "{" + tab20);
            for (var att in obj) {

                var val = obj[att];

                if (typeof (val) == "object") {
                    cc.log(tab + "\t" + att + ":" + tab20);
                    this.dump(val, deep + 1, hash);
                }
                else {
                    cc.log(tab + "\t" + att + ":" + obj[att] + "," + tab20);
                }
            }
            cc.log(tab + "}" + tab20);
        }
        else if (obj != null) {
            cc.log(tab + "\t" + obj + tab20);
        }
        else {
            cc.log(tab + "\t" + "null" + tab20);
        }
        if (deep == 1) {
            cc.log("----------------dump--------------------" + tab20);
        }
    };

    /**
     * 创建一个果冻动画
     *
     */
    public static buildJellyAction = function () {
        return cc.repeat(cc.sequence(cc.scaleTo(0.2, 1.2, 0.8), cc.scaleTo(0.1, 1)), 2);
    };

    //判断一个点是否在封闭的凸多边形里
    //参数起点到终点， 最后两个点是等待检测的点
    public static isRectContainPoint = function (points, x, y) {

        var args = this.clone(points);
        args.length += 1;
        var len = args.length;
        args[len - 1] = args[0];
        var count1 = 0, count2 = 0;
        for (var i = 0; i < len - 1; ++i) {
            var value = this.calcInLineSide(args[i].x, args[i].y, args[i + 1].x, args[i + 1].y, x, y);
            if (value > 0)
                count1++;
            else
                count2++;
        }
        var inside = false;
        if (0 == count1 || 0 == count2) {
            inside = true;
        }
        return inside;

    };

    public static newEaseBezierAction = function (action) {
        //var action = new cc.EaseBezierAction(action);
        action.easing(cc.easeSineInOut());
        //action.setBezierParamer(0.5, 0.5, 1, 1);
        return action;
    };

    /**
     * 得到数字的长度， 负数会算上负号, 小数会算上小数点
     * @param num
     */
    public static getNumLength = function (num) {
        return String(num).length;
    };


    /**
     * 获取两点间距离
     * @param p1
     * @param p2
     * @returns {number}
     */
    public static getDistance = function (p1, p2) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    };

    /**
     * 获取角度
     * @param p1
     * @param p2
     * @returns {number}
     */
    public static getAngle = function (p1, p2) {
        return this.radiansToDegrees(Math.atan2((p2.x - p1.x), (p2.y - p1.y)));
    };

    /**
     * 弧度转角度
     * @param radians
     * @returns {number}
     */
    public static radiansToDegrees = function (radians) {
        return 180 / Math.PI * radians;
    };

    /**
     * 角度转弧度
     * @param degrees
     * @returns {number}
     * @constructor
     */
    public static DegreesToRadians = function (degrees) {
        return Math.PI / 180 * degrees;
    };


    /**
     * 创建一动画动作
     * @param prefix  前缀
     * @param num 数量
     * @param interval 播放间隔时间 默认 1/12;
     * @param extension 后缀 默认 .png
     * @param occupying 占位， 表示需要几位， 如果是零则不处理， 1表示帧标号只有一位， 2表示两位  fish8_07.png 比如像这样的， 前缀一般填 fish8， 1到9就需要补一个0， 10以上就不需要补零
     * @param start 起始位置，默认从1开始。。
     * @returns {cc.Animate}
     */
    public static buildAnimate = function (prefix, num, interval, extension, occupying, start = 1) {

        /*interval = interval || 1 / 12;
        extension = extension || ".png";
        occupying = occupying || 0;
        var animation = new cc.Animation();
    
        var getSpriteFrame = null;
        if (prefix[0] == '#') {
            prefix = prefix.substring(1);
            getSpriteFrame = function (frameName) {
                //cc.log("frameName" + "\t" + frameName);
                return cc.spriteFrameCache.getSpriteFrame(frameName);
            }
        }
        else {
            getSpriteFrame = function (frameName) {
                return new cc.SpriteFrame(frameName);
            }
        }
    
    
        var numLength = String(num).length;
    
        for (var i = 0; i < num; ++i) {
            var index = i + start;
    
            if (occupying != 0) {
                var zeorNum = occupying - String(index).length;
                for (var j = 0; j < zeorNum; ++j) {
                    index = "0" + index;
                }
            }
    
            var frameName = prefix + index + extension;
            var spriteFrame = getSpriteFrame(frameName);
            animation.addSpriteFrame(spriteFrame);
        }
    
        animation.setDelayPerUnit(interval);           //设置两个帧播放时间
        return cc.animate(animation); */
    };

    /**
     * 判断 点是否在矩形内
     * @param rect {{lt: (*|cc.Point), rt: (*|cc.Point), lb: (*|cc.Point), rb: (*|cc.Point)}}
     * @param point cc.Point
     * @returns {boolean}
     */
    public static isPointInRect = function (rect, point) {

        return this.calcInLineSide(rect.lt.x, rect.lt.y, rect.rt.x, rect.rt.y, point.x, point.y)
            *
            this.calcInLineSide(rect.lb.x, rect.lb.y, rect.rb.x, rect.rb.y, point.x, point.y) <= 0
            &&
            this.calcInLineSide(rect.lt.x, rect.lt.y, rect.lb.x, rect.lb.y, point.x, point.y)
            *
            this.calcInLineSide(rect.rt.x, rect.rt.y, rect.rb.x, rect.rb.y, point.x, point.y) <= 0;

    };

    /**
     * 判断两条线段是否相交
     * @param l1p1 线段1点1
     * @param l1p2 线段1点2
     * @param l2p1 线段2点1
     * @param l2p2 线段2点2
     * @returns {boolean}
     */
    public static lineCollisionDetection = function (l1p1, l1p2, l2p1, l2p2) {

        return this.calcInLineSide(l1p1.x, l1p1.y, l1p2.x, l1p2.y, l2p1.x, l2p1.y)
            *
            this.calcInLineSide(l1p1.x, l1p1.y, l1p2.x, l1p2.y, l2p2.x, l2p2.y) <= 0
            &&
            this.calcInLineSide(l2p1.x, l2p1.y, l2p2.x, l2p2.y, l1p1.x, l1p1.y)
            *
            this.calcInLineSide(l2p1.x, l2p1.y, l2p2.x, l2p2.y, l1p2.x, l1p2.y) <= 0;


    };

    /**
     * 判断两个矩形是否碰撞
     * @param rect1 {{lt: (*|cc.Point), rt: (*|cc.Point), lb: (*|cc.Point), rb: (*|cc.Point)}}
     * @param rect2 {{lt: (*|cc.Point), rt: (*|cc.Point), lb: (*|cc.Point), rb: (*|cc.Point)}}
     * @returns {boolean}
     */
    public static rectCollisionDetection = function (rect1, rect2) {

        var ps1 = [rect1.lt, rect1.rt, rect1.rb, rect1.lb, rect1.lt];
        var ps2 = [rect2.lt, rect2.rt, rect2.rb, rect2.lb, rect2.lt];

        //判断是否有一矩形顶点在另一矩形内, 判断一个顶点就好， 主要是防止一个矩形完全在另一个矩形内， 其它相交方式由下面的判断解决（判断矩形边是否跟另一矩形边有相交）


        if (this.isPointInRect(rect1, ps2[0]) || this.isPointInRect(rect2, ps1[0])) {
            return true;
        }

        //for (var i = 0; i < 4; ++i) {
        //    if (public static  isPointInRect(rect1, ps2[i])) {
        //        return true;
        //    }
        //}
        //for (var i = 0; i < 4; ++i) {
        //    if (public static  isPointInRect(rect2, ps1[i])) {
        //        return true;
        //    }
        //}
        //判断矩形边是否跟另一矩形边有相交

        for (var i = 0; i < 4; ++i) {
            for (var j = 0; j < 4; ++j) {
                if (this.lineCollisionDetection(ps1[i], ps1[i + 1], ps2[j], ps2[j + 1])) {
                    return true;
                }
            }
        }

        return false;
    };

    /**
     * 得到结点的矩形， 支持旋转后的
     * @param node
     * @param percent  百分比， 比如需要缩小些， 就填0.8， 就缩小到原来的0.8， 暂时按中心点缩小（后面改成按锚点）， 各连长为原来的0.8
     * @returns {{lt: (*|cc.Point), rt: (*|cc.Point), lb: (*|cc.Point), rb: (*|cc.Point)}}
     */
    public static getRect = function (node: cc.Node, pOrCpp) {
        var lt, rt, lb, rb;

        var xScale, yScale;
        if (pOrCpp == null) {
            xScale = yScale = 1;
        } else if (pOrCpp.x == null) {
            xScale = yScale = pOrCpp;
        } else {
            xScale = pOrCpp.x;
            yScale = pOrCpp.y;
        }

        var facX = (1 - xScale) / 2;
        var facY = (1 - yScale) / 2;

        lt = node.convertToWorldSpaceAR(cc.v2(node.width * facX, node.height * (1 - facY)));
        rt = node.convertToWorldSpaceAR(cc.v2(node.width * (1 - facX), node.height * (1 - facY)));
        lb = node.convertToWorldSpaceAR(cc.v2(node.width * facX, node.height * facY));
        rb = node.convertToWorldSpaceAR(cc.v2(node.width * (1 - facX), node.height * facY));

        return { lt: lt, rt: rt, lb: lb, rb: rb };
    };

    /**
     * 得到结点的矩形， 支持旋转后的, 该方法相对 public static  getRect， 不能处理node的位置不是世界坐标
     * @param node
     * @param percent  百分比， 比如需要缩小些， 就填0.8， 就缩小到原来的0.8， 暂时按中心点缩小（后面改成按锚点）， 各连长为原来的0.8
     * @returns {{lt: (*|cc.Point), rt: (*|cc.Point), lb: (*|cc.Point), rb: (*|cc.Point)}}
     */
    public static getRectFast = function (node, percent) {
        var lt = {}, rt = {}, lb = {}, rb = {};

        var size = node.size();

        size.width = size.width * percent / 2;
        size.height = size.height * percent / 2;
        var angle = node.angle;
        var pos = node.getPosition();
        var sint = Math.sin(angle);
        var cost = Math.cos(angle);
        var hotX1 = -size.width;
        var hotY1 = -size.height;
        var hotX2 = size.width;
        var hotY2 = size.height;

        lt["x"] = hotX1 * cost - hotY1 * sint + pos.x;
        lt["y"] = hotX1 * sint - hotY1 * cost + pos.y;
        rt["x"] = hotX2 * cost - hotY1 * sint + pos.x;
        rt["y"] = hotX2 * sint - hotY1 * cost + pos.y;
        rb["x"] = hotX2 * cost - hotY2 * sint + pos.x;
        rb["y"] = hotX2 * sint - hotY2 * cost + pos.y;
        lb["x"] = hotX1 * cost - hotY2 * sint + pos.x;
        lb["y"] = hotX1 * sint - hotY2 * cost + pos.y;

        return { lt: lt, rt: rt, lb: lb, rb: rb };
    };

    /**
     * 通过帧名称数组创建一动画动作
     * @param framePathArray  帧名称数组
     * @param interval 播放间隔时间 默认 1/12;
     * @param extension 后缀 默认 .png
     * @returns {cc.Animate}
     */
    public static buildAnimateByArray = function (framePathArray, interval, extension) {

        /* interval = interval || 1 / 12;
        extension = extension || ".png";
        var animation = new cc.Animation();
    
        for (var i = 0; i < framePathArray.length; ++i) {
            var frameName = framePathArray[i];
            if (frameName[0] == "#") {
                frameName = frameName.substring(1);
                var spriteFrame = cc.spriteFrameCache.getSpriteFrame(frameName + extension);
                animation.addSpriteFrame(spriteFrame);
            }
            else {
                var spriteFrame = new cc.SpriteFrame(frameName + extension);
                animation.addSpriteFrame(spriteFrame);
            }
        }
        animation.setDelayPerUnit(interval);           //设置两个帧播放时间
        return cc.animate(animation); */
    };

    /**
     * 简单的toast， 淡入后， 停留time时间后 再淡出, 默认添加在场景的最上层，
     * @param str
     * @param time
     */
    public static toast = function (str, time, pos) {

        /* time = time || 3;
    
        var scene = cc.director.getScene();
        if (!scene) {
            return;
        }
    
        var oldToast = scene.getChildByTag(12366687);
        //把旧的toast删除掉
        if (oldToast) {
            oldToast.removeFromParent();
        }
    
        pos = pos || cc.v2(V.w / 2, V.h / 2);
        var toastContainer = new cc.Node().to(scene, 1000000).p(pos);
        toastContainer.setTag(12366687);
    
        var layerGradient = new cc.LayerGradient(cc.color(128, 128, 255, 255), cc.color(128, 128, 255, 255), cc.v2(1, 0)
            ,
            [{p: 0, color: cc.color(128, 128, 255, 0)},
                {p: 0.2, color: cc.color(128, 128, 255, 128)},
                {p: 0.8, color: cc.color(128, 128, 255, 128)},
                {p: 1, color: cc.color(128, 128, 255, 0)}]
        ).to(toastContainer).cc.log(0.5, 0.5);
    
        var text = new cc.LabelTTF(str, GFontDef.fontName,
            30,
            cc.color(255, 0, 255, 255)
        );
    
        var textSize = text.getContentSize();
    
        layerGradient.ignoreAnchorPointForPosition(false);
        layerGradient.setContentSize(textSize.width * 1.2, textSize.height * 1.2);
    
        text.to(toastContainer, 1).p(0, 0);
        var action = cc.sequence(cc.fadeIn(0.5), cc.delayTime(time), cc.fadeOut(0.5), cc.removeSelf());
    
        toastContainer.setCascadeOpacityEnabled(true);
        toastContainer.runAction(action); */
    };


    /**
     * 获取url后的参数
     * @returns {Object}
     */
    public static getArgmuent = function () {

        if (typeof location == "undefined") {
            return [];
        }

        var url = location.search; //获取url中"?"符后的字串
        var theRequest = {};
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0].toLowerCase()] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    };

    /**
     * 初始随机种子
     * @type {number}
     */
    static randseek = (new Date().getTime()) & 0x7fff;

    /**
     * 设置随机种子
     * @param seek
     */
    public static srand = function (seek) {
        this.randseek = seek;
    };

    public static RandMax = 233280;

    /**
     * 产生 0到public static  RandMax的伪随机数， 随机质量不如 js自带， 仅用于， 减少网络io， 服务端下发随机种子， 客户端依此产生随机数控制， 保证各客户端一致
     * @returns {number}
     */
    public static random = function () {
        //randseek = (((randseek * 214013 + 2531011) >> 16) & 0x7fff);
        this.randseek = (this.randseek * 9301 + 49297) % this.RandMax;
        return this.randseek;
    };

    public static calcRotation = function (st, ed) {

        var angle = Math.atan2(ed.y - st.y, ed.x - st.x);
        var rotation = -angle * 180.0 / Math.PI;
        return rotation;
    };

    /**
     * 把角度变换在0到Math.PI*2之间
     * @param angle
     * @returns {*}
     */
    public static angleRange = function (angle) {

        var t = Math.PI * 2;

        while (angle < 0) {
            angle += t;
        }

        while (angle > t) {
            angle -= t;
        }
        return angle;
    };

    /**
     * 通过所在点， 及角度， 计算， 按这个角度出发， 会在哪个点游出屏幕外
     * @param angle
     * @param src
     */
    public static getTargetPoint = function (angle, src) {

        var target = cc.v2();
        angle = this.angleRange(angle);

        var t = 300;

        if (angle == 0 || angle == Math.PI * 2) {
            target.x = -t;
            target.y = src.y;
        }
        else if (angle == Math.PI / 2) {
            target.x = src.x;
            target.y = -t;
        }
        else if (angle == Math.PI) {

            target.x = MPConfig.V.w + t;
            target.y = src.y;
        }
        else if (angle == Math.PI / 2 * 3) {

            target.x = src.x;
            target.y = MPConfig.V.h + t;
        }
        else if (angle > 0 && angle < Math.PI / 2) {
            target.x = -t;
            target.y = src.y - (src.x + t) * Math.tan(angle);
        }
        else if (angle > Math.PI / 2 && angle < Math.PI) {
            target.x = MPConfig.V.w + t;
            target.y = src.y + (MPConfig.V.w - src.x + t) * Math.tan(angle);

        }
        else if (angle > Math.PI && angle < 3 * Math.PI / 2) {

            target.x = MPConfig.V.w + t;
            target.y = src.y + (MPConfig.V.w - src.x + t) * Math.tan(angle);
        }
        else {
            target.x = -t;
            target.y = src.y - (src.x + t) * Math.tan(angle);
        }

        return target;
    };


    public static getShakeAction = function (shakeBaseValue, shakeRandomValue, dt, times) {

        shakeBaseValue = shakeBaseValue == null ? 5 : shakeBaseValue;
        shakeRandomValue = shakeRandomValue == null ? 3 : shakeRandomValue;
        dt = dt == null ? 0.05 : dt;
        times = times == null ? 10 : times;


        //var sumX = 0, sumY = 0;
        var shakeAction = null;
        for (var i = 0; i < times; ++i) {

            var x = Math.random() > 0.5 ? shakeBaseValue + Math.random() * shakeRandomValue : -shakeBaseValue - Math.random() * shakeRandomValue;
            var y = Math.random() > 0.5 ? shakeBaseValue + Math.random() * shakeRandomValue : -shakeBaseValue - Math.random() * shakeRandomValue;

            //sumX += x;
            //sumY += y;
            var action = cc.moveBy(0, x, y);
            //shakeAction = shakeAction ? cc.sequence(action,action.reverse(), shakeAction) : cc.sequence(action, action.reverse());
            shakeAction = shakeAction ? cc.sequence(cc.delayTime(dt), action, shakeAction) : cc.sequence(cc.delayTime(dt), action);
        }
        //
        //shakeAction = cc.sequence(shakeAction, cc.moveBy(dt, -sumX, -sumY));
        //shakeAction.setTag(1234);

        return shakeAction;
    };
    /**
     * 格式化钱数， 支持小数， 三位带一个splitChar
     * @param moneyValue
     * @param splitChar
     * @returns {string}
     */
    public static formatMoney = function (moneyValue, splitChar = ",", isDot = false) {

        var oldMoneyValue = moneyValue;
        moneyValue = moneyValue < 0 ? 0 - moneyValue : moneyValue;
        /*if(typeof moneyValue === 'number') {
            moneyValue = moneyValue.toFixed(ComConfig.GoldAccuracy + 3);
        }*/
        if (moneyValue.toString().split(".")[1] != undefined && moneyValue.toString().split(".")[1].length > MPConfig.GoldAccuracy) {
            let aa = Math.floor(moneyValue * Math.pow(10, MPConfig.GoldAccuracy - 1)).toFixed(0)
            let bb = Math.pow(10, MPConfig.GoldAccuracy - 1)
            var str = String((Number(aa) / bb).toFixed(1));
        } else {
            var str = String(moneyValue);
        }
        let arr = str.toLocaleString().split('.')
        let result = ''
        if (splitChar == ',')
            result = (arr[0] || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        else
            result = (arr[0] || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1');
        if (arr.length == 1 && isDot) {
            result += '.00'
        } else {
            result += (arr.length == 2 ? '.' + arr[1] : '')
            arr[1] && (result += (arr[1].length == 2 ? '' : isDot ? '0' : ''))
        }
        return result

        return

        var oldMoneyValue = moneyValue;
        moneyValue = moneyValue < 0 ? 0 - moneyValue : moneyValue;
        /*if(typeof moneyValue === 'number') {
            moneyValue = moneyValue.toFixed(ComConfig.GoldAccuracy + 3);
        }*/
        // if(moneyValue.toString().split(".")[1]!=undefined&&moneyValue.toString().split(".")[1].length>MPConfig.GoldAccuracy){
        //     let aa = Math.floor(moneyValue * Math.pow(10, MPConfig.GoldAccuracy-1)).toFixed(0)
        //     let bb =Math.pow(10, MPConfig.GoldAccuracy-1)
        //     var str = String((Number(aa)/bb).toFixed(1));
        // }else{
        //     var str = String(moneyValue);
        // }
        // let arr = str.toLocaleString().split('.')
        // let result = ''
        // result = (arr[0] || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') ;
        // result += (arr.length == 2 ? '.'+arr[1] : '')
        // return result
        // //var str = String(parseFloat(moneyValue).toFixed(ComConfig.GoldAccuracy));
        // var result = "";

        // //带小数点
        // if(str.indexOf(".") != -1){
        //     var len = str.length;
        //     for (var i = len - 1; i >= 0; --i) {
        //         result = str[i] + result;
        //         if (str[i] == ".")
        //             // break;
        //             continue
        //     }
        //     str = String(parseInt(moneyValue));
        // }


        // var len = str.length;
        // for (var i = len - 1, count = 0; i >= 0; --i, ++count) {

        //     if (count % 3 == 0 && count != 0 && str[i] != '-' && str[i] != '+') {
        //         result = splitChar + result;
        //     }
        //     result = str[i] + result;
        // }

        // if(oldMoneyValue < 0)
        //     result = "-" + result;
        // return result;
    };

    public static clone = function (obj) {
        // Cloning is better if the new object is having the same prototype chain
        // as the copied obj (or otherwise, the cloned object is certainly going to
        // have a different hidden class). Play with C1/C2 of the
        // PerformanceVirtualMachineTests suite to see how this makes an impact
        // under extreme conditions.
        //
        // Object.create(Object.getPrototypeOf(obj)) doesn't work well because the
        // prototype lacks a link to the constructor (Carakan, V8) so the new
        // object wouldn't have the hidden class that's associated with the
        // constructor (also, for whatever reasons, utilizing
        // Object.create(Object.getPrototypeOf(obj)) + Object.defineProperty is even
        // slower than the original in V8). Therefore, we call the constructor, but
        // there is a big caveat - it is possible that the this.init() in the
        // constructor would throw with no argument. It is also possible that a
        // derived class forgets to set "constructor" on the prototype. We ignore
        // these possibities for and the ultimate solution is a standardized
        // Object.clone(<object>).
        var newObj = (obj.constructor) ? new obj.constructor : {};

        // Assuming that the constuctor above initialized all properies on obj, the
        // following keyed assignments won't turn newObj into dictionary mode
        // becasue they're not *appending new properties* but *assigning existing
        // ones* (note that appending indexed properties is another story). See
        // CCClass.js for a link to the devils when the assumption fails.
        for (var key in obj) {
            var copy = obj[key];
            // Beware that typeof null == "object" !
            if (((typeof copy) === "object") && copy && !(copy instanceof cc.Node)) {
                newObj[key] = this.clone(copy);
            } else {
                newObj[key] = copy;
            }
        }
        return newObj;
    };
    /**
     * 复制
     */
    public static cloneObj = function (oldObj) {
        if (typeof (oldObj) != 'object') return oldObj;
        if (oldObj == null) return oldObj;
        var newObj = {};
        for (var i in oldObj)
            newObj[i] = this.cloneObj(oldObj[i]);
        return newObj;
    };

    /**
     * 扩展对象
     */
    public static extendObj = function () {
        var args = arguments;
        if (args.length < 2) return;
        var temp = this.cloneObj(args[0]);
        for (var n = 1; n < args.length; n++) {
            for (var i in args[n]) {
                temp[i] = args[n][i];
            }
        }
        return temp;
    };

    /**
     * 根据两点确定一条直线 两点的x，y不能相同
     * @param point1
     * @param point2
     * @param x
     * @return y
     */
    public static getPointByLineFunction = function (point1, point2, x) {
        if (point1.x == point2.x || point1.y == point2.y) {
            return 0;
        }
        //斜率
        var k = (point1.y - point2.y) / (point1.x - point2.x);

        //方程式
        var y = k * (x - point1.x) + point1.y;
        return y;
    };
    /**
     * 返回 st到 ed之间的整数， 最小st， 最大ed-1
     * @param st
     * @param ed
     * @returns {number}
     */
    public static rand = function (st, ed) {

        if (ed == null) {
            ed = st;
            st = 0;
        }

        return Math.floor(Math.random() * (ed - st) + st);
    };

    /**
     * 把rect缩小
     * @param rect
     * @param scaleX
     * @param scaleY
     * @returns {*}
     */
    public static scaleBoundingBox = function (rect, scaleX, scaleY) {
        scaleY = scaleY || scaleX;

        var cx = rect.x + rect.width / 2;
        var cy = rect.y + rect.height / 2;

        rect.width = rect.width * scaleX;
        rect.height = rect.height * scaleY;

        rect.x = cx - rect.width / 2;
        rect.y = cy - rect.height / 2;

        return rect;
    };


    /**
     * 深度拷贝属性
     * @param dest
     * @param src
     * @returns {*|{}}
     */
    public static copyAttr = function (dest, src) {


        for (var attr in src) {

            if (src[attr] instanceof Array) {
                dest[attr] = dest[attr] || [];
                this.copyAttr(dest[attr], src[attr]);
            }
            else if (src[attr] === 'object') {
                dest[attr] = dest[attr] || {};
                this.copyAttr(dest[attr], src[attr]);
            }
            else {
                dest[attr] = src[attr];
            }
        }
    };

    public static kFormatter = function (num) {
        return num > 999 ? num % 1000 === 0 ? (num / 1000).toFixed(1) + 'k' : (num / 1000).toFixed(1) + 'k' : num
    }


    /**
     *
     对Date的扩展，将 Date 转化为指定格式的String
     月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
     年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     例子：
     public static  formatDate(new Date(),"yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
     public static  formatDate(new Date(),"yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
     * @param date
     * @param fmt
     */
    public static formatDate = function (date, fmt) {
        fmt = fmt || "yyyy-M-d hh:mm:ss";
        var o = {
            "M+": date.getMonth() + 1,                 //月份
            "d+": date.getDate(),                    //日
            "h+": date.getHours(),                   //小时
            "m+": date.getMinutes(),                 //分
            "s+": date.getSeconds(),                 //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;

    };

    /**
     *判断是否是手机号码
     * @param mobileNum
     * @returns {boolean}
     */
    public static isMobileNum = function (mobileNum) {
        return /^1\d{10}$/.test(mobileNum);
    };

    /**
     * 格式化  妮称， 超过部分用。。。
     */
    public static formatNickname = function (nickname) {
        if (nickname.length > 7) {
            nickname = nickname.slice(0, 5) + "...";
        }
        return nickname;
    };


    /**
     * 返回字符的字节长度（汉字算2个字节）
     * @param {string}
     * @returns {number}
     */
    public static getByteLen = function (val) {
        var len = 0;
        for (var i = 0; i < val.length; i++) {
            if (val[i].match(/[^\x00-\xff]/ig) != null) //全角
                len += 2;
            else
                len += 1;
        }
        return len;
    };

    /**
     * 金额小写转大写
     * @param n
     * @returns {*}
     */
    public static convertMoneyToCapitals = function (n) {
        if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
            return "数据非法";

        if (n > 1000000000000)
            return "数据太大";

        var unit = "万千百拾亿千百拾万千百拾元角分", str = "";
        n += "00";
        var p = n.indexOf('.');
        if (p >= 0)
            n = n.substring(0, p) + n.substr(p + 1, 2);
        unit = unit.substr(unit.length - n.length);
        for (var i = 0; i < n.length; i++)
            str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
        return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
    };


    /**
     * 删除指定的元素, 有删除到， 返回true, 没有返回false
     * @param array
     * @param element
     * @returns {boolean}
     */
    public static arrayRemove = function (array, element) {
        for (var i = 0, len = array.length; i < len; ++i) {
            if (array[i] == element) {
                array.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    /**
     * 随机数组索引
     * @param array
     * @returns {*}
     */
    public static arrayShuffle = function (array) {
        let m = array.length, i;
        while (m) {
            i = (Math.random() * m--) >>> 0;
            [array[m], array[i]] = [array[i], array[m]];
        }
        return array;
    };

    /**
     * 判断数组是否含有某个元素
     * @param array
     * @param obj
     * @returns {number}
     */
    public static arrayContains = function (array, obj) {
        let m = array.length;
        while (m--) {
            if (array[m].toString() === obj.toString()) {
                return m;
            }
        }
        return -1;
    };

    /**
     * 数组去重
     * @param array
     * @returns {Array}
     */
    public static arrayUnique = function (array) {
        let tempArray = [];
        let tempJson = {};
        for (let i = 0; i < array.length; i++) {
            if (!tempJson[array[i]]) {
                tempArray.push(array[i]);
                tempJson[array[i]] = 1;
            }
        }
        return tempArray;
    };

    /**
     * 判断两个数组是否相等
     * @param array1
     * @param array2
     * @returns {boolean}
     */
    public static arrayEquals = function (array1, array2) {
        if (!array1 || !array2) return false;
        if (array1.length !== array2.length) return false;

        for (var i = 0; i < array1.length; i++) {
            if (array1[i] instanceof Array && array2[i] instanceof Array) {
                if (!this(array1[i], array2[i])) {
                    return false;
                }
            } else if (array1[i] !== array2[i]) {
                return false;
            }
        }
        return true;
    };



    /**
     * 创建头像
     * @param faceID
     */
    public static buildHeadIcon = function (faceID) {

        /* switch (platformName){
            case "9918":
                var widget = new FocusWidget().anchor(0.5, 0.5);
                var icon = new cc.Sprite(this.getHeadIconName(faceID)).to(widget, 1).pp(0.5,0.5).qscale(1);
                widget.size(icon.size());
    
                widget.icon = icon;
                widget.setScale(1);
                return widget;
            case "newpifu":
                var widget = new FocusWidget().anchor(0.5, 0.5);
    
                var iconBox = new cc.Sprite("#res/plaza/img_Frame_Head.png").to(widget);
                widget.size(iconBox.size());
                iconBox.pp();
                // var iconBg = new cc.Sprite("#res/common981/gui-main-toux-bj.png").to(iconBox, -1).pp();
                var icon = new cc.Sprite(this.getHeadIconName(faceID)).to(iconBox, 1).pp(0.5,0.53);
    
                widget.icon = icon;
                widget.iconBox = iconBox;
                return widget;
            default:
                var widget = new FocusWidget().anchor(0.5, 0.5);
    
                var iconBox = new cc.Sprite().to(widget);
                widget.size(116,116);
                iconBox.pp();
                // var iconBg = new cc.Sprite("#res/common981/gui-main-toux-bj.png").to(iconBox, -1).pp();
                var icon = new cc.Sprite(this.getHeadIconName(faceID)).to(iconBox, 1).pp(0.5,0.51).qscale(0.6666);
    
                widget.icon = icon;
                widget.iconBox = iconBox;
                widget.setScale(1.1);
                return widget;
        } */
    };

    /**
     * 得到头像资源名字。。
     * @param faceID
     * @returns {string}
     */
    public static getHeadIconName = function (faceID) {
        return "#common/head" + faceID + ".png";
    };

    /**
     * Object对象拼接为string。{key1: value1, key2: value2...} -> "key1:value1,key2:value2..."
     * @param obj
     * @returns {string}
     */
    public static obj2Str = function (obj) {
        // 非空Object才操作
        if (Object.keys(obj).length > 0) {
            var strArr = [];
            for (var key in obj) {
                var str = key + ":" + obj[key];
                strArr.push(str);
            }
            return strArr.toString();
        }

        return "";
    };


    /**
     * 判断是否是个合法的URL， 只是简单判断
     * @param str
     * @returns {boolean}
     */
    public static isUrl = function (str) {
        var reg = /[a-z]+:\/\/[a-z0-9_\-\/.%]+/i;
        return str.match(reg) != null;
    };

    public static loadRemoteImg = function (base64, type, callback) {
        /* type = type || "png";
    
        if (cc.sys.isNative) {
            var sprite = new cc.Sprite();
            sprite.initWithBase64(base64);
    
            callback(sprite);
    
            return;
        }
    
        cc.loader.loadImg("data:image/" + type + ";base64," + base64, {isCrossOrigin: true}, function (err, img) {
            if (err) {
                console.error("验证码加载失败");
                return;
            }
    
            var sprite = new cc.Sprite(img);
    
            callback(sprite);
        }); */
    };

    /**
     * 模拟点击
     * @param touchPos
     * @constructor
     */
    public static analogClick = function (touchPos) {
        /* if (!cc.sys.isNative)
            return;
    
        var id = 0;
        var x = touchPos.x;
        var y = touchPos.y;
        var touch = new cc.Touch();
        touch.setTouchInfo(id, x, y);
        var event1 = new cc.EventTouch();
        event1.setEventCode(cc.EventTouch.EventCode.BEGAN);
        event1.setTouches([touch]);
        cc.eventManager.dispatchEvent(event1);
    
        var event2 = new cc.EventTouch();
        event2.setEventCode(cc.EventTouch.EventCode.ENDED);
        event2.setTouches([touch]);
        cc.eventManager.dispatchEvent(event2); */
    };

    //模拟输入
    public static analogInput = function (keyCode) {
        if (!cc.sys.isNative)
            return;

        /* cc.eventManager.dispatchEvent(new cc.EventKeyboard(keyCode, 1));
        cc.eventManager.dispatchEvent(new cc.EventKeyboard(keyCode, 0)); */
    };

    /**
     * 给节点绑定拖动打印坐标
     * @param touchPos
     * @constructor
     */
    public static adjustNodePos = function (node) {
        node.bindTouch({
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                this.startPos = touch.getLocation();

                return true;
            },

            onTouchMoved: function (touch, event) {
                this.setPosition(touch.getLocation());
            },

            onTouchEnded: function (touch, event) {
                this.endPos = touch.getLocation();
                cc.log("======== new pos " + this.endPos.x + "," + this.endPos.y);
            }
        })
    };

    // 产生指定范围的随机数
    public static randNum = function (min, max, isInt?) {
        var offset = max - min;
        var num = min + Math.random() * offset;

        return isInt ? Math.floor(num) : num;
    };

    //浮点精度
    public static roundFloat = function (x, n = MPConfig.GoldAccuracy) {
        return Math.floor(x * Math.pow(10, n)) / Math.pow(10, n);
    };

    //新建一个
    public static newDelayTimeLayer = function (leftTime) {
        /* var maxS = 2.2;
        var minS = 1.8;
        var time = leftTime;
        // var mask = new cc.LayerColor(cc.color(0,0,0,150)).to(cc.director.getRunningScene(),10000);
        var mask = new cc.Node();
        var num = new cc.LabelBMFont(Math.ceil(time),"res/font/DTime.fnt").to(mask).pp().qscale(maxS);
        var action = [];
    
        while (time > 0){
            let integerTime = Math.floor(time);
            let scaleTime = time - integerTime > 0 ? (time - integerTime) : 1;
            time -= scaleTime;
            time = time < 0 ? 0 : time;
            let timeNum = Math.ceil(time);
            let ac = new cc.Sequence(cc.scaleTo(scaleTime, minS), cc.callFunc(()=>{
                num.setScale(maxS);
                if(timeNum > 0){
                    num.setString(timeNum);
                }
    
            }))
    
            action.push(ac);
        }
    
        action.push(new cc.Sequence(cc.delayTime(0.01), cc.callFunc(()=>{
            mask.hide();
        })))
    
        num.runAction(new cc.Sequence(action));
    
        return mask; */
    };

    public static buildComBg = function (size) {
        /* var bg = new cc.Sprite();
        bg.initWithSpriteFrameName("frame_bg.png");
        bg.setCapInsets(cc.rect(30,30,2,2));
        bg.size(size);
        return bg; */
    }
    /*刷新页面*/
    public static refreshPage(): void {
        // window.location.reload(true);
        window.location.reload();
    }
    /*获取页面get参数*/
    public static getGet(): Object {
        let url: String = window.location.href.toString();
        let u: string[] = url.split("?");
        if (typeof u[1] === 'string') {
            u = u[1].split("&");
            let gets: { [k: string]: any } = {};
            cc.log(u)
            for (var i of u) {
                cc.log(i)
                let j = i.split("=");
                if (j[0] == 'params') {
                    j[1] = j[1].replace(/-_/, '+/')
                }
                // gets[j[0]] = decodeURI(j[1]);
                gets[j[0]] = decodeURIComponent(j[1]);
            }
            return gets;
        }
        return {};
    }
    public static getStrArray(str, f = "&"): Object {
        let arr = str.split(f);
        let gets: { [k: string]: any } = {};
        for (var i of arr) {
            cc.log(i)
            let j = i.split("=");
            gets[j[0]] = decodeURIComponent(j[1]);
        }
        return gets;
    }

    public static create_uuid() {
        var d = Date.now();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    public static log(msg: string | any, ...subst: any[]) {
        //   if(!MPConfig.G_Debug_Open) return;
        //   cc.log(msg, ...subst)
    }

    public static timeEnd(label: string) {
        if (!MPConfig.G_Debug_Open) return;
        console.timeEnd(label)
    }

    public static getappVersion(): any {
        let u = navigator.userAgent
        /* let app = navigator.appVersion
      // 移动终端浏览器版本信息
        let trident = u.indexOf('Trident') > -1// IE内核
        let presto = u.indexOf('Presto') > -1 // opera内核
        let webKit = u.indexOf('AppleWebKit') > -1 // 苹果、谷歌内核
        let gecko = u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1 // 火狐内核
        let iPhone = u.indexOf('iPhone') > -1 // 是否为iPhone或者QQHD浏览器
        let iPad = u.indexOf('iPad') > -1 // 是否iPad
        let webApp = u.indexOf('Safari') === -1 // 是否web应该程序，没有头部与底部
        let language = (navigator.browserLanguage || navigator.language).toLowerCase() */

        let mobile = !!u.match(/AppleWebKit.*Mobile.*/) // 是否为移动终端
        let ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
        let android = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 // android终端或uc浏览器
        let messgae = { mobile: mobile, ios: ios, android: android, pc: false }
        if (mobile) { // 判断是否是移动设备打开
            let ua = navigator.userAgent.toLowerCase() // 获取判断用的对象
            if (ua.indexOf('micromessenger') !== -1) { // 是否在微信打开
                messgae["weixin"] = true
            } else {
                messgae["weixin"] = false
            }
            if (ua.indexOf('mqqbrowser') !== -1 && ua.indexOf(' qq/') === -1 && ua.indexOf(' micromessenger') === -1) { // qq浏览器
                messgae["qqbrowser"] = true
            } else {
                messgae["qqbrowser"] = false
            }
            if (ua.indexOf('huaweibrowser') !== -1 || ua.indexOf('huawei') !== -1) { // 是否在华为浏览器打开 或者华为手机中打开
                messgae["huaweibrowser"] = true
            } else {
                messgae["huaweibrowser"] = false
            }
            if (ua.indexOf('ucbrowser') !== -1) { // 是否在uc浏览器打开
                messgae["ucbrowser"] = true
            } else {
                messgae["ucbrowser"] = false
            }
            if (ua.indexOf(' qq/') !== -1) { // 是否在QQ打开
                messgae["QQ"] = true
            } else {
                messgae["QQ"] = false
            }
        } else { // 否则就是PC浏览器打开
            messgae.pc = true
        }
        return messgae
    }

    public static isFullScreen() {
        if (cc.sys.isMobile === true) {
            const screenRatio = Math.max(cc.winSize.height, cc.winSize.width) / Math.min(cc.winSize.width, cc.winSize.width);
            // 假设 18:9 及更高的比例被视为全面屏
            if (screenRatio >= 2.1) {
                return 'Full-Screen';
            } else if (screenRatio > 2.0) {
                return 's8+';
            } else {
                return 'Non-Full-Screen';
            }
        } else {
            return 'Non-Full-Screen'; // 对于PC来说，不需要判断屏幕类型
        }
    }

    /** 获取把 node移动到 node1位置后的坐标 */
    public static nd1tondd2(node1: cc.Node, node: cc.Node) {
        return node1.parent.convertToNodeSpaceAR(node.parent.convertToWorldSpaceAR(node.position))
    }

    //A点关于B点对称后的点坐标
    public static getSymmetricPoint(pointA: cc.Vec2, pointB: cc.Vec2): cc.Vec2 {
        let symmetricX = 2 * pointB.x - pointA.x;
        let symmetricY = 2 * pointB.y - pointA.y;
        return new cc.Vec2(symmetricX, symmetricY);
    }

    /**
 * 计算圆周上分成 N 个点的坐标
 * @param center 圆心的坐标
 * @param radius 圆的半径
 * @param numPoints 圆周上点的数量
 * @returns 圆周上点的坐标数组
 */
    public static getCirclePoints(center: cc.Vec2, radius: number, numPoints: number): cc.Vec2[] {
        let points: cc.Vec2[] = [];
        let angleStep = 2 * Math.PI / numPoints; // 每个点之间的角度

        for (let i = 0; i < numPoints; i++) {
            let angle = i * angleStep;
            let x = center.x + radius * Math.cos(angle);
            let y = center.y + radius * Math.sin(angle);
            points.push(new cc.Vec2(x, y));
        }

        return points;
    }

    public static splitIntoTwelveRandomDecimals(total: number): number[] {
        // 生成11个随机数，并将它们排序
        const randomPoints: number[] = Array.from({ length: 20 }, () => Math.random()).sort((a, b) => a - b);

        // 将这些随机数转化为比例点
        randomPoints.unshift(0);
        randomPoints.push(1);

        // 根据比例点计算每个部分的值
        const result: number[] = [];
        for (let i = 1; i < randomPoints.length; i++) {
            const partValue = ((randomPoints[i] - randomPoints[i - 1]) * total);
            result.push(partValue);
        }

        // 保留两位小数
        for (let i = 0; i < result.length; i++) {
            result[i] = Math.round(result[i] * 100) / 100;
        }

        // 调整总和使其等于total
        const currentSum = result.reduce((acc, val) => acc + val, 0);
        const diff = Math.round((total - currentSum) * 100) / 100;

        // 将差值加到最后一个数
        result[result.length - 1] += diff;

        return result;
    }
}