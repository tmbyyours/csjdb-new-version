import { UIView } from "../../../../common/managers/UIView";
import { uiManager } from "../../../../common/managers/UIManager";
import SoundManager from "../../../../common/managers/SoundManager";
import MPConfig from "../../../../extend/MPConfig";

const { ccclass, property } = cc._decorator;

interface Helpeui {
    totPage: number,
    curPage: number,
    innerPage: number,
    innercurPage: number
}

@ccclass
export default class HelpView extends UIView {

    @property([cc.Node])
    page: cc.Node[] = []

    @property(cc.ToggleContainer)
    togglec: cc.ToggleContainer = null
    // LIFE-CYCLE CALLBACKS:
    @property(cc.Label)
    label: cc.Label = null
    // onLoad () {}

    @property(cc.Button)
    prebtn: cc.Button = null

    @property(cc.Button)
    nextbtn: cc.Button = null

    @property(cc.Button)
    closebtn: cc.Button = null

    @property(cc.Node)
    showVersion: cc.Node = null

    @property(cc.Label)
    versionLabel: cc.Label = null

    hp: Helpeui = { totPage: 4, curPage: 0, innerPage: 8, innercurPage: 1 }
    clickcount = 0
    start() {
        // cc.log(this.togglec.toggleItems)
        this.versionLabel.node.active = false
        for (let i = 0; i < this.togglec.toggleItems.length; i++) {
            this.togglec.toggleItems[i].node.on('toggle', this.onChangePage, this);
        }
        this.prebtn.node.active = false;
        this.prebtn.node.on(cc.Node.EventType.TOUCH_START, this.onChangeContent, this);
        this.nextbtn.node.on(cc.Node.EventType.TOUCH_START, this.onChangeContent, this);
        this.closebtn.node.on(cc.Node.EventType.TOUCH_START, this.onClose, this);
        this.showVersion.on(cc.Node.EventType.TOUCH_START, this.showVersionF, this)
    }

    showVersionF() {
        this.clickcount++
        if (this.clickcount > 5) {
            this.versionLabel.node.active = true
            this.versionLabel.string = MPConfig.clientVersion
        }
        if (this.clickcount > 20) {
            this.versionLabel.string = '926484'
        }
    }

    checkpage() {
        // cc.log(`${this.hp.innercurPage}         ${this.hp.innerPage}`);
        this.prebtn.node.active = true;
        this.nextbtn.node.active = true;
        if (this.hp.innerPage == 1) {
            this.prebtn.node.active = false;
            this.nextbtn.node.active = false;
        } else {
            if (this.hp.innercurPage <= 1) {
                this.prebtn.node.active = false;
                this.nextbtn.node.active = true;
            }
            if (this.hp.innercurPage > 1 && this.hp.innercurPage <= this.hp.innerPage) {
                this.prebtn.node.active = true;
                this.nextbtn.node.active = true;
            }
            if (this.hp.innercurPage >= this.hp.innerPage) {
                this.prebtn.node.active = true;
                this.nextbtn.node.active = false;
            }
        }
        this.label.string = `${this.hp.innercurPage} / ${this.hp.innerPage}`;

    }

    onChangePage(event, customEventData) {
        SoundManager.getInstance().playID(201, "subgame");
        switch (event.node.name) {
            case 'toggle1':
                this.hp.curPage = 0;
                this.hp.innerPage = 8;
                this.hp.innercurPage = 1;
                break
            case 'toggle2':
                this.hp.curPage = 1;
                this.hp.innerPage = 15;
                this.hp.innercurPage = 1;
                break
            case 'toggle3':
                this.hp.curPage = 2;
                this.hp.innerPage = 2;
                this.hp.innercurPage = 1;
                break
            case 'toggle4':
                this.hp.curPage = 3;
                this.hp.innerPage = 1;
                this.hp.innercurPage = 1;
                break
        }
        this.checkpage();
        for (let i = 0; i < this.hp.totPage; i++) {
            this.page[i].active = false;
        }
        let curallpage = cc.find(`helpcontent/page${this.hp.curPage + 1}`, this.node).children;
        for (let i = 0; i < this.hp.innerPage; i++) {
            curallpage[i].active = false;
        }
        curallpage[0].active = true;
        this.page[this.hp.curPage].active = true;
    }

    onChangeContent(event, customEventData) {
        // cc.log(event.target.name)
        SoundManager.getInstance().playID(201, "subgame");
        let curallpage = cc.find(`helpcontent/page${this.hp.curPage + 1}`, this.node).children;
        for (let i = 0; i < this.hp.innerPage; i++) {
            curallpage[i].active = false;
        }
        switch (event.target.name) {
            case 'prebtn':
                this.hp.innercurPage--;
                break;
            case 'nextbtn':
                this.hp.innercurPage++;
                break;
        }
        if (this.hp.innercurPage < 1) {
            this.hp.innercurPage = 1;
        }
        if (this.hp.innercurPage > this.hp.innerPage) {
            this.hp.innercurPage = this.hp.innerPage;
        }
        this.checkpage();
        curallpage[this.hp.innercurPage - 1].active = true;

    }

    onClose() {
        this.clickcount = 0
        this.versionLabel.node.active = false
        SoundManager.getInstance().playID(201, "subgame");
        uiManager.close();
    }

    // update (dt) {}
}
