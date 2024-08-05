//热更新组件
var RETRY_INTERVAL = 2; // 重试间隔

/** TODO
    重试超过次数 提示
**/

cc.GAME_TYPES               = {}        ;
cc.GAME_TYPES.LAUNCHER      = "hall"    ;
cc.GAME_TYPES.DZ            = "dz"      ;
cc.GAME_TYPES.NN            = "nn"      ;

cc.Class({
    extends: cc.Component,

    properties: {
        //panel: UpdatePanel, 
        // manifestUrl: cc.RawAsset,
        manifestUrl: {
            type: cc.Asset,
            default: null,
        },

        _storageManifestUrl: "",
        _customManifestStr: '',
        _updating: false,
        _checkedUpd: false,
        _canRetry: false,
        _storagePath: '',
        _gameType: "",
        _retryTimer: null,
        _downOverFun: null,
        m_downLoadFlag: false,    //下载
        m_retryCount: 0,         //重试次数
        m_verUrlPath: "",
    },

    onDestroy: function () {
        if (this._updateListener) {
            //cc.eventManager.removeListener(this._updateListener);
            this._am.setEventCallback(null);

            this._updateListener = null;
        }
        if (this._am && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            //this._am.release();
        }
    },

    initUI : function( ui ){
        this._comUI = ui ;
    },

    /**
     * 初始化函数
     */
    initCheckUpDate: function ( fun , gameType ) {
        this._downOverFun   = fun;
        this._gameType      = gameType;
        this._initUpdData();
        this._newAssetMgr();
        this.m_downLoadFlag = true;
    },

    /**
     * checkVersionUpdate
     */
    checkVersionUpdate: function () {
        if (this._updating) {
            cc.log('Checking or updating ...');
            return;
        }
        cc.log("地址：", UpdateHelper.genUrl("", this._gameType))
        // cc.log(UpdateHelper.projFileName());
        cc.log( this._customManifestStr );


        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            cc.log('AAAAAA Failed to load local manifest ...')
            var manifest = new jsb.Manifest(this._customManifestStr, this._storagePath);
            this._am.loadLocalManifest(manifest, this._storagePath);
        }
    
        this._am.setEventCallback(this._checkCb.bind(this));


        this._am.checkUpdate();
        this._updating = true;
    },


    /**
     * startVerionUpdate
     */
    startVerionUpdate: function () {
        cc.log('startVerionUpdate');
        if (this._am && !this._updating) {
        
            this._am.setEventCallback(this._updateCb.bind(this));

            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                this._am.loadLocalManifest(this._storagePath);
            }
            this._am.update();
            this._updating = true;
        }
    },


    _initUpdData: function () {
        var updUrl      = UpdateHelper.genUrl("", this._gameType);
        var prjCfgFile  = UpdateHelper.prjFileName();
        var verCfgFile  = UpdateHelper.verFileName();

        this.m_verUrlPath = updUrl + "/" + verCfgFile;

        this._storagePath = UpdateHelper.genStoragePath(this._gameType);

        this._storageManifestUrl = this._storagePath + "/" + prjCfgFile;
        cc.log("storageManifestUrl XX ", this._storageManifestUrl);
        cc.log("下载URL", this.m_verUrlPath);

        this._customManifestStr = JSON.stringify({
            "packageUrl": updUrl,
            "remoteManifestUrl": updUrl + "/" + prjCfgFile,
            "remoteVersionUrl": updUrl + "/" + verCfgFile,
            "version": "0.0.1",
            "assets": {},
            "searchPaths": []
        });
    },

    _checkCb: function (event) {
        var newVerThere = false;
        var alreadyUpFlag = false;
        var isDownloadFail = false;

        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.log("No local manifest file found, hot update skipped.");
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                cc.log("Fail to download manifest file, hot update skipped.");
                alreadyUpFlag = true; //使用当前版本
                isDownloadFail = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                alreadyUpFlag = true;
                cc.log("Already up to date with the latest remote version.");
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                newVerThere = true;
                break;
            default:
                return;
        }

        //cc.eventManager.removeListener(this._checkListener);
        this._am.setEventCallback(null);

        this._checkListener     = null;
        this._updating          = false;

        cc.log("check = ", this._gameType);
        if (alreadyUpFlag) {
            cc.log("更新下载过");
            if (this._gameType == cc.GAME_TYPES.LAUNCHER) {
                cc.log("切大厅");
                this._downOverFun();
            } else {
                cc.log("切入游戏 =", this._gameType);
                
                if (isDownloadFail == true) {
                    this._downOverFun(4);
                    return;
                }
                if (this.m_downLoadFlag) {
                    this._downOverFun(3);
                    return;
                }
            }
        }

        if (newVerThere) {
            if (this.m_downLoadFlag) {
                this._downOverFun(1);
                return;
            }
            if (this._gameType == cc.GAME_TYPES.LAUNCHER) {
                var remoteVersionUrl = UpdateHelper.genUrl("", this._gameType) + "/" + UpdateHelper.projFileName();
                var localVersionUrl = this._storageManifestUrl;
            }
            else {
                this.startVerionUpdate();
            }
        }
    },

    _updateCb: function (event) {
        var needRestart = false;
        var failed = false;
        var updateMsg = "";

        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                updateMsg   = 'No local manifest file found, hot update skipped.';
                failed      = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
               
                if( this._comUI ){
                    let per = event.getPercent();
                    this._comUI.downloadingView( per );
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:

                updateMsg = 'Fail to download manifest file, hot update skipped.';
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:

                updateMsg = 'Already up to date with the latest remote version.';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                updateMsg = 'Update finished. ' + event.getMessage();
                cc.log(updateMsg);
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                updateMsg = 'Update failed. ' + event.getMessage();
                cc.log(updateMsg);
                this._updating = false;
                this._canRetry = true;
                this._retry();
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                updateMsg = 'Asset update error: ' + event.getAssetId() + ', ' + event.getMessage();
                cc.log(updateMsg);
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                updateMsg = event.getMessage();
                cc.log(updateMsg);
                break;
            default:
                break;
        }

        if (failed) {
            this._am.setEventCallback(null);

            this._updateListener = null;
            this._updating = false;
            $G.gCData.gIsGameDownloading[this._gameType] = false;
        }

        if (needRestart) {

            UpdateHelper.downloaded(this._gameType);

            this._am.setEventCallback(null);

            this._updateListener = null;

            //非大厅的进入游戏
            if (this.m_downLoadFlag) {
                this._downOverFun(3 , true);
            }
        }
    },
    
    
    _retry: function () {
        if (!this._updating && this._canRetry && this.m_retryCount < 3) {
            this._canRetry = false;
            this._am.downloadFailedAssets();
            this.m_retryCount = this.m_retryCount + 1;
            return;
        }
        if (this.m_retryCount >= 3) {
            MsgHelper.pushToast('您当前网络不稳定');
        }
    },

    /**
     * _newAssetMgr 初始化
     * versionA : 当前版本
     * versionB ：最新版本
     */
    _newAssetMgr: function () {
        var versionCompareHandle = function (versionA, versionB) {
            cc.log("versionCompareHandle");
            cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            //判断是否是大版本更新，如果是就移除之前的更新内容 例如 1.0.1 到 2.1.1此时就是大版本更新 
            let first = parseInt(vB[0]) - parseInt(vA[0]);

            if(first >= 1 ){
                jsb.fileUtils.removeDirectory(this._storagePath);
            }
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                }
                else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            }
            else {
                return 0;
            }
        };

        //this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + '_update');
        cc.log('Storage path for remote asset : ' + this._storagePath);

        if ( !cc.sys.isNative )  return '';
        this._am = new jsb.AssetsManager('', this._storagePath, versionCompareHandle);

        if (!cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            //this._am.retain();
        }

        this._am.setVerifyCallback(function (path, asset) {
            cc.log("setVerifyCallback");
            var compressed = asset.compressed;
            var expectedMD5 = asset.md5;
            var relativePath = asset.path;
            var size = asset.size;

            if (compressed) {
                cc.log("Verification passed : %s ", relativePath);
                return true;
            }
            else {
                cc.log("Verification passed : " + relativePath + ' (' + expectedMD5 + ')');
                return true;
            }
        });

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            this._am.setMaxConcurrentTask(2);
        }

    },





    gotoGame: function () {
        //cc.gameSwitcher.start(this._gameType);
        cc.log("gotoGame=");
        if (this._gameType == cc.GAME_TYPES.LAUNCHER) {
            cc.log("gotoGame= Loading");
            replaceScene("Loading", function () {
            });
        } else {
            cc.log("this._gameType");
            cc.log(this._gameType);
            //cc.gameSwitcher.start(this._gameType);
            if (this.m_downLoadFlag) {
                this._downOverFun(2);
            } else {
                require(this._storagePath + "/src/main.js");
            }
        }
    },

    


    

});
