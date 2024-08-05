/*
* socket 消息相关;
*/
import { mpNetEvent, socketEvent, exitEnum } from "../../extend/MPDefine";
import Util from "../../extend/Util";
import { EventManager } from "./EventManager";
import Encrypt from "../../extend/Encrypt";
import UserInfo from "../../plaza/model/UserInfo";
import io = require('../../extend/libs/socket.io.js');
import SystemToast from "../../extend/ui/SystemToast";
import { DataVO } from "../../plaza/model/DataVO";
import HttpManager from "./HttpManager";
import MPConfig from "../../extend/MPConfig";
export default class SocketManager {
    public socket: SocketIOClient.Socket;//socket.io.d.ts中定义
    private serverHost: string;
    constructor() {
    }
    static instance: SocketManager
    static getInstance() {
        if (!SocketManager.instance) {
            SocketManager.instance = new SocketManager()
        }
        return SocketManager.instance
    }
    public connectId: string = "0";
    private connectStatus: boolean = false;
    public connect(url): void {
        if (this.isConnect) {
            this.closeConnect();
        }
        this.serverHost = url
        cc.log("开始连接服务器: " + url + `/${MPConfig.path}/socket.io`);
        // cc.log("开始连接服务器: " + 'ws://192.168.110.236:11111/Client' + `/test/socket.io`);
        cc.log(socketEvent.SOCKET_CONNECT);
        let self = this;
        cc.log(cc.sys.isBrowser)
        // if(cc.sys.isBrowser){
        // this.socket = io.connect(url, { path: `/test/socket.io` })
        // this.socket = io.connect('ws://192.168.110.236:11111/Client', { path: `/test/socket.io` })
        this.socket = io.connect(url, { path: `/${MPConfig.path}/socket.io` })
        // this.socket = io.connect('ws://192.168.110.236:10000/test/Client')
        // }else if(cc.sys.isNative){
        //     this.socket = io.connect(url,cc.url.raw("resources/cer/3867974_server.gpaly.cc.pem"))
        // }
        this.socket.on(socketEvent.SOCKET_CONNECT, function () {
            self.onSocketConnect()
        });
        this.socket.on('connect_error', function (data) {
            // SystemToast.GetInstance().buildToast("连接异常，请检查网络")
            SystemToast.GetInstance().buildPromptNew('发生错误，请重新登入', 9005, 1, () => {
                // cc.director.loadScene('RoomScene');
                window.location.href = window.location.href
            }, null)
        });
        this.socket.on('reconnect_error', function (data) {
            // SystemToast.GetInstance().buildToast("重新连接异常，请检查网络")
            SystemToast.GetInstance().buildPromptNew('发生错误，请重新登入', 9005, 1, () => {
                // cc.director.loadScene('RoomScene');
                window.location.href = window.location.href
            }, null)
        });
        this.socket.on(socketEvent.SOCKET_DISCONNECT, function () {
            self.onSocketDisconnect()
        });
        this.socket.on(socketEvent.SOCKET_ERROR, function () {
            self.onConnectError()
        });
        this.socket.on(socketEvent.SOCKET_TIMEOUT, function () {
            self.onConnectTimeout()
        });
    }

    public get isConnect(): boolean {
        if (this.socket != null && this.socket.connected == true) {
            return true;
        }
        else {
            return false;
        }
    }


    public closeConnect(): void {
        if (this.isConnect) {
            this.socket.close()
        }
    }
    // 发送消息
    public emit(event: string, ...args: any[]): void {
        if (this.connectStatus) {
            cc.log("消息发出" + event)
            cc.log(args[0])
            event = Encrypt.packetEvent(event, this.socket)
            let arg = Encrypt.packetData(args[0], this.socket)
            this.socket.emit(event, arg)
        } else {
            cc.log('网络未连接')
        }
    }

    private onSocketConnect(): void {
        cc.log("连接成功！" + this.connectId);
        this.connectStatus = true;
        if (this.connectId === "0") {
            SocketManager.instance.connectId = Util.generateUUID();
            cc.log(this.connectId)
            this.socket.emit('handshakeData', '{"id":"' + this.connectId + '","version":"201805241102"}');
            // 注册事件
            for (let key in mpNetEvent) {
                this.socket.on(Encrypt.packetEvent2(mpNetEvent[key]), function (data) {
                    data = Encrypt.decryptData2(data);
                    cc.log("收到：" + key)
                    cc.log(data)
                    EventManager.getInstance().raiseEvent(mpNetEvent[key], data);
                });
            }
            if (Util.getGet()["params"]) {
                /*HttpManager.getInstance().Get(MPConfig.getIp + '?uuid=' + UserInfo.GetInstance().getData()['params']["uuid"], 5000, (data, rsp?: any) => {
                    cc.log('--------------------')
                    cc.log(data)
                    cc.log(rsp)
                    if (data == -1) {//接口不存在
                        UserInfo.GetInstance().toLogin();
                    }
                    if (data == 200) {
                        DataVO.GD.loginIp = rsp.ip
                        UserInfo.GetInstance().toLogin();
                    }
                    if (data == 404 || data == 500) {//接口失效或者超时，直接发起连接进入游戏，ip置为0.0.0.0
                        DataVO.GD.loginIp = '0.0.0.0'
                        UserInfo.GetInstance().toLogin();
                    }
                })*/
                UserInfo.GetInstance().toLogin();
            }
            else {
                UserInfo.GetInstance().toLogin();
            }

            //用户登录
            // UserInfo.GetInstance().toLogin();
        } else {
            this.socket.emit('handshakeData', '{"id":"' + this.connectId + '","version":"201805241102"}');

        }
    }

    private onSocketDisconnect(): void {
        cc.log("断开连接！");
        this.connectStatus = false;
        this.stopWebSocket()
        DataVO.GD.disconnected = true
        DataVO.GD.exitType = exitEnum.disconnect
        cc.log(DataVO.GD.exitType + '      ' + (DataVO.GD.exitType != exitEnum.forceExit) + '   ' + (DataVO.GD.exitType != exitEnum.beKicked))
        if (cc.director.getScene().name == "SG_F_CSBY_MainScene" && DataVO.GD.exitType != exitEnum.forceExit && DataVO.GD.exitType != exitEnum.beKicked) {
            this.stopWebSocket()
            // SystemToast.GetInstance().buildPrompt('网络已经断开，请刷新界面', 1, () => {
            //     // cc.director.loadScene('RoomScene');
            //     window.location.href = window.location.href
            // }, null)
            // SystemToast.GetInstance().buildPromptNew('您的网络不稳定', 1, 1, () => {
            //     // cc.director.loadScene('RoomScene');
            //     window.location.href = window.location.href
            // }, null)
            SystemToast.GetInstance().buildPromptNew('发生错误，请重新登入', 9005, 1, () => {
                // cc.director.loadScene('RoomScene');
                window.location.href = window.location.href
            }, null)
        }
    }

    private onConnectError(e: Event = null): void {
        // SystemToast.GetInstance().buildToast("连接异常，请检查网络")
        cc.log("连接错误！");
        this.connectStatus = false;
        SystemToast.GetInstance().buildPromptNew('发生错误，请重新登入', 9005, 1, () => {
            // cc.director.loadScene('RoomScene');
            window.location.href = window.location.href
        }, null)
    }

    private onConnectTimeout(e: Event = null): void {
        cc.log("连接超时");
        // SystemToast.GetInstance().buildToast("连接超时，请检查网络")
        this.connectStatus = false;
        SystemToast.GetInstance().buildPromptNew('发生错误，请重新登入', 9005, 1, () => {
            // cc.director.loadScene('RoomScene');
            window.location.href = window.location.href
        }, null)
    }

    /**
     * 停止websocket服务器
     */
    stopWebSocket() {
        cc.log("stopWebSocket")
        this.socket && this.socket.disconnect();
        this.socket = null;
    }
}
