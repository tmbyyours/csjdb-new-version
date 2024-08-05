//子游戏更新逻辑

cc.Class({
    extends: cc.Component,

    properties: {
        gameType: '',

        _update: null,
        _updateState: 0,
        _checked: false,
        _clicked: false,
        _isDownloading: false,
    },

    onLoad() {
        // ui
        this._ui = this.node.addComponent('ComChooseGameState');

        // update
        cc.log('检查全局状态：', $G.gCData.gameChecked);


        // start
        this._ui.showCouldDownload(!this._checkDownloaded());
        this._ui.showDownloading(false);

    },

    /**
     * onButtonClicked
     */
    onButtonClicked: function (event, customEventData) {
        cc.log('GameDown clicked:' + customEventData);

        this._clicked = true;
        cc.currentGame = customEventData;
        
        // web || package all
        if (!cc.sys.isNative) {
            this.enterGame();
        } else {
            this._checkGameState(false, false);
            this._checked = true;
        }
    },




    /**
     * enterGame
     */
    enterGame: function () {


        this.reSetGameDownloading();
        GameHelper.loadGameScene();

    },

    reSetGameDownloading() {

        for (let key in $G.gCData.gIsGameDownloading) {
            if ($G.gCData.gIsGameDownloading[key]) {
                $G.gCData.gIsGameDownloading[key] = false;
            }
        }
    },

    /**
     * 检查是否有游戏正在更新中
     */
    _checkIsGameDown() {
        let isDownload = false;
        for (let key in $G.gCData.gIsGameDownloading) {
            if ($G.gCData.gIsGameDownloading[key]) {
                isDownload = true;
            }
        }
        return isDownload;
    },
    /**
     * 检查子游戏是否有更新
     */
    _checkDownloaded: function () {
        if (!cc.sys.isNative) {
            return true;
        } else {
            return UpdateHelper.isDownloaded(this.gameType);
        }
    },

    _checkGameState: function (showDlg = true, onlyCheckDownload = false) {
        // 如果子游戏更新过一次就不再更新了
        if ($G.gCData.gameChecked[this.gameType]) {
            cc.log('游戏已经更新过')
            // this.enterGame();


            $G.gCData.gIsGameDownloading[this.gameType] = false;
            $G.gCData.gameChecked[this.gameType] = true;
            this.enterGame();
            return;
        }

        // 如果检查过一次状态，就不再检查
        if (this._updateState != 0) {
            cc.log('游戏已经check过' + this._updateState);
            this.checkUpDateHandler(this._updateState, true);
            return;
        }

        // 正常检查流程
        if (!cc.sys.isNative) {
            this.alreadyGameView();
        } else {
            if (!$G.gCData.gameChecked[this.gameType]) {
                this._update = this.node.addComponent('UpdateComponent');
                this._update.initUI(this);
                this._update.initCheckUpDate(this.checkUpDateHandler.bind(this), this.gameType);
            }
            if (this._update) {
                cc.log('进入native判断流程')
                var isLoadedFlag = UpdateHelper.isDownloaded(this.gameType);
                if (!isLoadedFlag) {
                    cc.log('还未下过', this.gameType);
                    if (this._checked) this.needDownLoadView(showDlg);
                } else {
                    this.alreadyGameView();
                }
            }
            if (!this._checked) {
                cc.log('开始第一次check')
                this._update.checkVersionUpdate();
            }
        }
    },





    /**
     * 游戏下载过
     */
    alreadyGameView: function (isHotBack) {
        cc.log('游戏已经下载过');
        this._ui.showCouldDownload(false);
        this._ui.showDownloading(false);
        $G.gCData.gIsGameDownloading[this.gameType] = false;
        $G.gCData.gameChecked[this.gameType] = true;
        if (isHotBack) {
            cc.log('热更新完成回调,目前不进入hallscene');
        } else {
            if (this._checked && this._clicked) {
                this.enterGame();
            }
        }

    },

    /**
     * 需要下载的界面
     */
    needDownLoadView: function (showDlg = true) {
        this._ui.showCouldDownload(true);
        this._ui.showDownloading(false);
        if (showDlg) {
            let self = this;
            PBHelper.addNode('DlgGameNeedDownload', null, (node) => {
                node.getComponent('DlgGameNeedDownload').initCb(() => {
                    $G.gCData.gIsGameDownloading[self.gameType] = true;
                    self._update.startVerionUpdate();
                    self.downloadingView(2);
                });
            });
        }

    },

    /**
     * 下载中的界面
     */
    downloadingView: function (per = 0) {
        cc.log('游戏下载中');
        this._ui.showCouldDownload(false);
        this._ui.showDownloading(true, per);
    },

    /**
     * 检测更新回调
     * @updateState  更新状态 1需要下载 2需要更新  3 已经下载没有需要更新的文件  4下载失败
     */
    checkUpDateHandler: function (updateState, isHotBack) {
        this._updateState = updateState;

        if (updateState == 1) {
            this.needDownLoadView();//需要弹出下载弹窗提示
        }
        else if (updateState == 2) {
            this.downloadingView();//游戏下载中
        }
        else if (updateState == 3) {
            this.alreadyGameView(isHotBack);

        } else if (updateState == 4) {
            //下载失败
            var isLoadedFlag = UpdateHelper.isDownloaded(this.gameType);
            if (isLoadedFlag) {
                this.alreadyGameView();
                return;
            }
            cc.log('下载失败', this.gameType);
            this.needDownLoadView();
        }
    },



});
