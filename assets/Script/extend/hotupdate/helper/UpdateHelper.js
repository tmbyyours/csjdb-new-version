
/**
1 热更新管理器
 负责设置要更新的游戏 
 获取要更新的地址目录 通常为/gameName
 获取更新后本地保存地址 
 设置热更皮肤 
 设置热更地址 
 启动热更UI 
 内存常驻 
**/
var STORAGE_SUB_PATH = 'update';
var PROJECT_CFG_FILE = 'project.manifest';
var VERSION_CFG_FILE = 'version.manifest';
var DOWNLOADED_MARK  = 'downloaded';

module.exports = cc.Class({
	name: 'UpdateHelper',
	statics: {
		_url: '',// 热更地址  通过改变这个能换皮肤 
		_gameType: '',// 需要更新的子游戏 、大厅 
		_skin: '',// 皮肤类型
		_storage_path: '',// 本地缓存路径 
		_root_folder: STORAGE_SUB_PATH, // 本地缓存跟目录
		_proj_cfg_file: PROJECT_CFG_FILE,
		_ver_cfg_file: VERSION_CFG_FILE,

		init: function (gameType, skin) {
			var skilFolderName = skin;
			if (skilFolderName == null) {
				skilFolderName = '';//appBaseData.upDataFolderName; 
			}
			cc.log('game XXXXX skilFolderName = ', skilFolderName);
			if (skilFolderName) {
				this.skin(skilFolderName);
			}

			this.gameType(gameType);

			let url = this.genUrl();
			let path = this.genStoragePath();
			this.url(this.genUrl());
			this.storagePath(this.genStoragePath());
		},

		gameType: function (val) {
			if (val) this._gameType = val;
			return this._gameType;
		},
		url: function (val) {
			if (val) this._url = val;
			return this._url;
		},
		skin: function (val) {
			if (val) this._skin = val;
			return this._skin;
		},
		storagePath: function (val) {
			if (val) this._storage_path = val;
			return this._storage_path;
		},
		rootFolder: function (val) {
			if (val) this._root_folder = val;
			return this._root_folder;
		},
		prjFileName: function (val) {
			if (val) this._proj_cfg_file = val;
			return this._proj_cfg_file;
		},
		verFileName: function (val) {
			if (val) this._ver_cfg_file = val;
			return this._ver_cfg_file;
		},
		genStoragePath: function (gameType) {
			if ( !cc.sys.isNative )  return '';
			gameType = gameType || this.gameType();
			return ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + this.rootFolder() + '/' + gameType);
		},
		genUrl: function (skin, gameType) {
			gameType = gameType || this.gameType();
			
			let url = "http://47.106.140.43:1686/games/"; //子游戏更新地址
			return url + gameType ;
		},
		downloaded: function (gameType) {
			var value =  _.isNull(gameType)  ? this.gameType() : undefined ;
			gameType = gameType || this.gameType();
			var store_key = DOWNLOADED_MARK + gameType;
			cc.sys.localStorage.setItem(store_key, gameType);
		},
		isDownloaded: function (gameType) {
			gameType = gameType || this.gameType();
			var store_key = DOWNLOADED_MARK + gameType;
			// @krisirk temp debug
			// cc.sys.localStorage.removeItem( store_key );
			var store_value = cc.sys.localStorage.getItem(store_key);
			cc.log( 'store:' + store_value );
			return store_value === gameType;
		},
		showUI: function () {
			var isHall = this.gameType() === cc.GAME_TYPES.HALL;
		},
	},
});
