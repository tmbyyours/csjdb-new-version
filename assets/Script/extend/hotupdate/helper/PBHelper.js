


/** 
 * Key  / Value , Name / Path
 * Path['Key'] = Value ;
 */
// var prePath = 'hall/prefabs/Dlgs/';
var prePath = 'plaza/prefab/ui/';

var Paths = {
  
    
    DlgSetting: prePath + 'DlgSetting',
    
    DlgGameNeedDownload: prePath + 'DlgGameNeedDownload',
   

};
//游戏引用大厅的资源预加载，creator 2.0 后，子游戏更新引用大厅的资源，如果不进行预加载
//很多时候大厅的资源无法引用
var ComPaths = {
    DlgSetting: prePath + 'DlgSetting'
};

/**
 * initHelper
 */
module.exports.initHelper = function (cb) {
    var loaded = 0;
    _.each(ComPaths, function (value, key) {
        CCLoaderHelper.getRes(value, cc.Prefab, function (err, prefab) {
            cc.log('@ PBHelper: <' + key + '> is loaded');
            loaded++;
            if (loaded >= _.size(ComPaths)) {
                if (cb) cb();
                return;
            }
        });
    });
};

/**
 * addNode
 * 
 * Name , parentNode , cb(node)
 */
let nodeName = '';
let lock = true;
module.exports.addNode = function (name, parent = null, cb = null, zorder = 9999) {
    if (name == nodeName && lock) {
        return;
    };
    lock = true;
    nodeName = name;
    module.exports.getNode(name, (node) => {
        if (parent === null) parent = cc.director.getScene().getChildByName('Canvas');
        if (parent.getChildByName('popup9999')) parent.getChildByName('popup9999').destroy();
        parent.addChild(node, zorder, 'popup9999');
        lock = false;
        if (cb) cb(node);
    })

}

/**
 * getNode
 * 
 * Name , cb(node)
 */
module.exports.getNode = function (name, cb = null, setShowLoading = null) {
    
    let cbDone = cb;
    CCLoaderHelper.getRes(Paths[name], cc.Prefab, function (err, res) {
        let node = cc.instantiate(cc.loader.getRes(Paths[name]));
        if (cbDone) cbDone(node);
        return node;
    });
}

/**
 * releaseNode - 会无脑释放该node引用的所有图片资源，如果有交叉资源的话，会很糟糕
 */
module.exports.releaseNode = function (key = null) {
    let _release = function (key) {
        cc.log('@Release:' + key);
        let deps = cc.loader.getDependsRecursively(Paths[key]);
        cc.loader.release(deps);
    }

    if (key === null) {
        for (let key in Paths) {
            _release(key);
        }
    } else {
        _release(key);
    }
};