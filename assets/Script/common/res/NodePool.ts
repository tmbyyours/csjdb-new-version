import { resLoader } from "./ResLoader";
import Util from "../../extend/Util";

/**
 * Prefab的实例对象管理，目标为减少instantiate的次数，复用Node
 * 
 */

export type NodePoolCallback = (error: Error, nodePool: NodePool) => void;

export class NodePool {
    private _isReady: boolean = false;
    private _createCount: number = 0;
    private _warterMark: number = 10;
    private _useKey: string = "@NodePool";
    private _res: cc.Prefab = null;
    private _nodes: Array<cc.Node> = new Array<cc.Node>();
    private _url:string

    public isReady() { return this._isReady; }

    /**
     * 初始化NodePool，可以传入使用resloader加载的prefab，或者传入url异步加载
     * 如果使用url来初始化，需要检查isReady，否则获取node会返回null
     * @param prefab 
     * @param url
     */
    public init(prefab: cc.Prefab)
    public init(url: string, finishCallback: NodePoolCallback)
    public init() {
        let urlOrPrefab = arguments[0];
        this.setWaterMark(arguments[1]);
        var finishCallback = null;
        if (arguments.length == 3 && typeof arguments[2] == "function") {
            finishCallback = arguments[2];
        }

        if (urlOrPrefab instanceof cc.Prefab) {
            this._res = urlOrPrefab;
            let url = resLoader.getUrlByAsset(this._res);
            if (url) {
                if (resLoader.addUse(url, this._useKey)) {
                    this._isReady = true;
                    if (finishCallback) {
                        finishCallback(null, this);
                    }
                    return;
                }
            }
        } else if (typeof arguments[0] == "string") {
            this._url = arguments[0]
            resLoader.loadRes(arguments[0], cc.Prefab, (error: Error, prefab: cc.Prefab) => {
                if (!error) {
                    this._res = prefab;
                    this._isReady = true;
                }
                if (finishCallback) {
                    finishCallback(error, this._url);
                }
            }, this._useKey);
            return;
        }
        console.error(`NodePool init error ${arguments[0]}`);
    }

    /**
     * 获取或创建一个Prefab实例Node
     */
    public getNode(): cc.Node {
        if (!this.isReady) {
            return null;
        }

        if (this._nodes.length > 0) {
            return this._nodes.pop();
        } else {
            this._createCount++;
            return cc.instantiate(this._res);
        }
    }

    /**
     * 回收Node实例
     * @param node 要回收的Prefab实例
     */
    public freeNode(node: cc.Node) {
        if (!(node && cc.isValid(node))) {
            cc.log(this)
            cc.error('[ERROR] PrefabPool: freePrefab: isValid node:');
            this._createCount--;
            return;
        }
        if (this._warterMark < this._nodes.length) {
            this._createCount--;
            node.destroy();
        } else {
            node.removeFromParent(true);
            node.cleanup();
            this._nodes.push(node);
        }
    }

    /**
     * 设置回收水位
     * @param waterMakr 水位
     */
    public setWaterMark(waterMakr: number) {
        this._warterMark = waterMakr;
    }

    /**
     * 池子里的prefab是否都没有使用
     */
    public isUnuse() {
        if (this._nodes.length > this._createCount) {
            cc.error('PrefabPool: _nodes.length > _createCount');
        }
        return this._nodes.length == this._createCount;
    }

    /**
     * 清空prefab
     */
    public destory() {
        // 清空节点、回收资源
        for (let node of this._nodes) {
            node.destroy();
        }
        this._createCount -= this._nodes.length;
        this._nodes.length = 0;
        resLoader.releaseAsset(this._res, this._useKey);
    }
}