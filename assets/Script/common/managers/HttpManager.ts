export default class HttpManager {
    constructor() {
    }
    static instance: HttpManager
    static getInstance() {
        if (!HttpManager.instance) {
            HttpManager.instance = new HttpManager()
        }
        return HttpManager.instance
    }

    Get(url1, tiout: number = 5000, callback: Function = null) {      
     
       
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            cc.log("Get: readyState:" + xhr.readyState + " status:" + xhr.status);
            if (xhr.readyState === 4 && xhr.status == 200) {
                let respone = xhr.responseText;
                let rsp = JSON.parse(respone);
                callback(200, rsp);
            } else if (xhr.readyState === 4 && xhr.status == 401) {
                callback(401);
            } else if (xhr.readyState === 4 && xhr.status == 404) {
                callback(404);
            } else {
                // callback(-1);
            }

        };
        xhr.open('GET', url1, true);
        // 这个参数会引起跨域   切记  下面的设置有服务器完成就可以了
        // xhr.withCredentials = true;
        // xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        // xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST');
        // xhr.setRequestHeader('Access-Control-Allow-Headers', 'x-requested-with,content-type,authorization');
        // xhr.setRequestHeader("Content-Type", "application/json");
        xhr.timeout = tiout;
        xhr.ontimeout = function () {
            callback(500);
        }
        xhr.send();
    }

    Post(url, params, callback) {
        // let xhr = cc.loader.getXMLHttpRequest();
        let xhr = new XMLHttpRequest();
        cc.log(url)
        cc.log(params)
        xhr.onreadystatechange = function () {
            cc.log("Post: readyState:" + xhr.readyState + " status:" + xhr.status);
            if (xhr.readyState === 4 && xhr.status == 200) {
                let respone = xhr.responseText;
                let rsp = JSON.parse(respone);
                cc.log(rsp)
                callback(200, rsp);
            } else if (xhr.readyState === 4 && xhr.status == 401) {
                callback(401);
            } else if (xhr.readyState === 4 && xhr.status == 404) {
                callback(404);
            } else if (xhr.readyState == 4 && xhr.status == 0) {
                callback(-1)
            } else {
                // callback(-1);
            }
        };
        xhr.onerror = function (err) {
            console.log("onerror");
            console.log(err);
        }
        xhr.open('POST', url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
        // xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        // xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST');
        // xhr.setRequestHeader('Access-Control-Allow-Headers', 'x-requested-with,content-type');
        // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.timeout = 5000;
        xhr.ontimeout = function () {
            callback(500);
        }
        cc.log(typeof JSON.stringify(params))
        cc.log(JSON.stringify(params))
        xhr.send(JSON.stringify({ a: 1 }));



        // xhr.open('POST', url, true);
        // //设置提交数据的方式，application/json json传输数据用的比较多
        // xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        // if (params) {
        //     for (var key in params) {
        //         xhr.setRequestHeader(key, params[key]);
        //     }
        // }
        // xhr.send(JSON.stringify(params));
    }
}