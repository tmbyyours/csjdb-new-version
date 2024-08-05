/**
 * 
 * Game全局Helper
 * 
 */




/**
 * exports
 */
var helper = module.exports;

/**
 * initHelper
 */
helper.initHelper = function () {

    return helper;
};


helper.onLoadChooseScene = function (cb) {

    if (!cc.sys.isNative) {
        cc.director.loadScene('ChooseGame');
        return;
    }

    var gameName = UpdateHelper.gameType();
    var storagePath = UpdateHelper.genStoragePath(gameName);
    cc.log(storagePath);
    window.require(storagePath + "/src/dating.js");
    return;
}



helper.loadChooseScene = function (cb) {
    cc.director.loadScene('ChooseGame', () => {
        if (cb) cb();
    });
}




helper.loadGameScene = function (cb) {
    // web || package all
    if (!cc.sys.isNative) {

        switch (cc.currentGame) {

            case 'bjl':
                cc.director.loadScene('GameScene_BJL');
                break;
            case 'lkpy':
                cc.director.loadScene('GameScene_LKPY');
                break;
            case 'ddz':
                cc.director.loadScene('GameScene_DDZ');
                break;
            case 'fish':
                cc.director.loadScene('GameScene_FISH');
                break;
            case 'plaza':
                // cc.director.loadScene('GameScene_FISH_CSBY');
                cc.director.loadScene('GameLoading');
                break;

        }
        return;
    }

    // native 
    UpdateHelper.init(cc.currentGame);
    var searchPaths = jsb.fileUtils.getSearchPaths();
    var storagePath = UpdateHelper.storagePath();
    cc.log("storagePath = ", storagePath);
    searchPaths.unshift(storagePath);
    jsb.fileUtils.setSearchPaths(searchPaths);
    helper.resortSearchPaths(cc.currentGame);
    window.require(storagePath + "/src/main.js");
}

helper.resortSearchPaths = function (topGameName) {
    let searchPaths = jsb.fileUtils.getSearchPaths();
    cc.log("[SearchPaths] 处理之前 = ", searchPaths);

    let newSearchPaths = [];

    for (let path of searchPaths) {
        if (path.indexOf(topGameName) > 0) {
            newSearchPaths.push(path);
            break;
        }
    }
    //这边为了解决一个bug , 把大厅的 路径塞进去 searchPaths[searchPaths.length - 3] 最好自己打印一下看看到底是第几个
    // newSearchPaths.push(searchPaths[searchPaths.length - 3]);
    newSearchPaths.push(searchPaths[0]);
    jsb.fileUtils.setSearchPaths(newSearchPaths);

    cc.log("[SearchPaths] 处理之后 = ", newSearchPaths);
}


