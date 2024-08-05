/**
 * 
 * A、新版本需要强制清除热更新缓存目录。
 * jsb.fileUtils.removeDirectory(jsb.fileUtils.getWritablePath());
 * 
 * 直接挂在初始LoadScene上，官方组件修改过来
 */
cc.Class({
    extends: cc.Component,

    properties: {

        lbTitle : cc.Label ,
        lbInfo  : cc.Label ,


        ndCheckingError  : cc.Node ,

        ndBtnSure  :  cc.Node ,
        ndBtnRetry :  cc.Node ,
        ndBar      :  cc.Node ,
        pBar       :  cc.ProgressBar ,
        lbPer      :  cc.Label ,

        manifest: {
            type: cc.Asset,
            default: null,
        },

        _updating: false,
        _canRetry: false,
        _storagePath: '' ,

        _retryTime : 10,
        _needUpdate : false,
        _faildRes : '',
    },

    onLoad: function () {
        this.loadingScene = this.node.getComponent('LoadingScene');
        this.manifestUrl  = this.manifest.nativeUrl;

        this.ndBar.active          = false ;
        cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE)
    },

    onDestroy: function () {
        if (this._updateListener) {
            this._assetsMgr.setEventCallback(null);
            this._updateListener = null;
        }
        if (this._assetsMgr && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
        }
    },

    // check
    check : function(){   
        //debug
        // this.next(); return ;
        
        // Hot update is only available in Native build
       if ( !cc.sys.isNative){
            this.next();
            return;
       }

        // Storage path
        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + "update/hall" );
        cc.log('@Storage path for remote asset : ' + this._storagePath );
        cc.log('@Project url:' + this.manifestUrl ) ;

        // AssetsManager
        this._assetsMgr = new jsb.AssetsManager( this.manifestUrl , this._storagePath , this._versionCompare.bind(this) );
        if (!cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            //this._assetsMgr.retain();
        }
        this._assetsMgr.setVerifyCallback( this._cbVerify );

        // AssetsManager - Android Task Max - Some Android device may slow down the download process when concurrent tasks is too much.
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            this._assetsMgr.setMaxConcurrentTask( 5);
        }

        // UI
        this._showRetry( false );

        // Check
        this.checkUpdate();
        
    },

    /**
     * next
     */
    next : function(){
        this.loadingScene.loadGame() ;
    },

    /**
     * checkUpdate
     */
    checkUpdate: function () {
        if (this._updating) {
            this.lbInfo.string = '检查更新中...';
            return;
        }
        if (this._assetsMgr.getState() === jsb.AssetsManager.State.UNINITED) {

            if (cc.loader.md5Pipe) {
                this.manifestUrl = cc.loader.md5Pipe.transformURL(this.manifestUrl);
            }

            this._assetsMgr.loadLocalManifest(this.manifestUrl);
        }
        // 更换 manifest 路径以后这里会报错
        if (!this._assetsMgr.getLocalManifest() || !this._assetsMgr.getLocalManifest().isLoaded()) {
            this.lbInfo.string = '导入文件失败，建议重启游戏或重新下载最新版本';
            return;
        }
      
        this._assetsMgr.setEventCallback(this._cbCheckUpdate.bind(this));

        this._assetsMgr.checkUpdate();
        this._updating = true;
    },

    /**
     * hotUpdate
     */
    hotUpdate: function () {
        if (this._assetsMgr && !this._updating) {
            this.ndBar.active = true ;

          
            this._assetsMgr.setEventCallback(this._cbUpdate.bind(this));

            if (this._assetsMgr.getState() === jsb.AssetsManager.State.UNINITED) {

                if (cc.loader.md5Pipe) {
                    this.manifestUrl = cc.loader.md5Pipe.transformURL(this.manifestUrl);
                }
                this._assetsMgr.loadLocalManifest(this.manifestUrl);
            }

            this._failCount = 0;
            this._assetsMgr.update();
            this._updating = true;

        }
    },

    /**
     * retry
     */
    retry: function () {
       
        //如果一个资源下载失败超过了两次，就清除之前的下载
        if(gLocalData.userInfo.hotFailRes == this._faildRes && gLocalData.userInfo.hotFaildNum >=2){
            gLocalData.userInfo.hotFailRes = '';
            gLocalData.userInfo.hotFaildNum = 0;
            DataHelper.saveAllData();
            jsb.fileUtils.removeDirectory(jsb.fileUtils.getWritablePath());
        }else{
            gLocalData.userInfo.hotFailRes = this._faildRes;
            gLocalData.userInfo.hotFaildNum ++;
            DataHelper.saveAllData();
        }
       
        cc.game.restart();
    },

    _showRetry : function( show = true ){
    },

    _showRetryPanel : function(show = true){
    },

    /**
     * _cbCheckUpdate
     * 
     * ios10中，在弹出是否允许联网之前，会报：
     * AssetsManagerEx : Fail to download version file, step skipped Code: 1
     */
    _cbCheckUpdate : function (event) {
        cc.log('Code: ' + event.getEventCode());
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.lbInfo.string = "已经是最新版";
                this.next();
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
               
                // ui - bar
                this._showRetry( false );
                this.pBar.progress = 0 ;
                this._needUpdate = true;
                break;
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.lbInfo.string = "下载失败，请检查网络";

                this._showRetryPanel( true );
                break;
            default:
                return;
        }
        this._assetsMgr.setEventCallback(null);
        this._checkListener = null;
        this._updating = false;
        this.hotUpdate();
    },


    /**
     * _cbUpdate - 更新的回调
     */
    _cbUpdate: function (event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                this.pBar.progress = event.getPercent();
                // this.lbPer.string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();
                //let per = (event.getPercent() * 100).toFixed(2)  ;
                //this.lbPer.string  = per + '%';
                //this.lbInfo.string = '已下载文件: ' + event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                this.loadingScene.lbPer.string = '资源加载中,精彩即将开启···';
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                this.lbInfo.string = '更新完成：' + event.getMessage();
                needRestart = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.lbInfo.string = '已经是最新版';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.lbInfo.string = '更新失败： ' + event.getMessage();
                this._updating = false;
                this._canRetry = true;
                failed = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                this._faildRes = event.getAssetId();
                this.lbInfo.string = 'Asset update error: ' + event.getAssetId() + ', ' + event.getMessage();
                failed = true;
                break;
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                this.lbInfo.string = '下载失败，请检查网络';
                failed = true;
                break;
        }

        if (failed) {
           this._assetsMgr.setEventCallback(null);

            this._updateListener = null;
            this._updating = false;
            this.retry();
        }

        if (needRestart) {
           this._assetsMgr.setEventCallback(null);

            this._updateListener = null;

            gLocalData.userInfo.hotFailRes = '';
            gLocalData.userInfo.hotFaildNum = 0;
            DataHelper.saveAllData();

            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._assetsMgr.getLocalManifest().getSearchPaths();
            cc.log(JSON.stringify(newPaths));
            Array.prototype.unshift(searchPaths, newPaths);

            cc.sys.localStorage.setItem('downloadedhall', 'hall');
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            cc.audioEngine.stopAll();
            cc.game.restart();
        }
    },


    /**
     * _cbVerify
     * 
     * 由于下载过程中仍然有小概率可能由于网络原因或其他网络库的问题导致下载的文件内容有问题，所以我们提供了用户文件校验接口，在文件下载完成后热更新管理器会调用这个接口（用户实现的情况下），如果返回 true 表示文件正常，返回 false 表示文件有问题
     * 
     */
    _cbVerify : function(path, asset) {
        // Setup the verification callback, but we don't have md5 check function yet, so only print some message
        // Return true if the verification passed, otherwise return false
        // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
        var compressed = asset.compressed;
        // Retrieve the correct md5 value.
        var expectedMD5 = asset.md5;
        // asset.path is relative path and path is absolute.
        var relativePath = asset.path;
        // The size of asset file, but this value could be absent.
        var size = asset.size;
        if (compressed) {
            cc.log(("Verification passed : " + relativePath));
            return true;
        }
        else {
            cc.log(("Verification passed : " + relativePath + ' (' + expectedMD5 + ')'));
            return true;
            // var data = jsb.fileUtils.getDataFromFile(path);
            // var curMD5 = md5(data);
            // if(curMD5 == asset.md5){
            //     cc.info('MD5 verify success!');
            //     return true;
            // }
            // else{
            //     cc.info('MD5 verify fail,path a:' + path + ',path b:' + asset.path + ',md5 a:' + curMD5 + ',md5 b:' + asset.md5);
            //     return false;
            // }

            // var md5 = calculateMD5(filePath);
            // if (md5 === asset.md5)
            //     return true;
            // else 
            //     return false;
            
        }

    },

    /**
     * _versionCompare
     */
    _versionCompare : function ( versionA , versionB ) {
        cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
        var vA = versionA.split('.');
        var vB = versionB.split('.');
        this._currentVersion = versionA ;
        this._newestVersion  = versionB ;
        for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || 0);
            if (a === b) { continue;  }
            else { return a - b; }
        }
        if (vB.length > vA.length) {  return -1; }
        else {  return 0;  }
    },





});

