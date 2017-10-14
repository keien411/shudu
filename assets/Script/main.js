/**
 * Created by c1720 on 2017/10/7.
 */
const Cell = require("Cell");
var app = require("app");

cc.Class({
    extends: cc.Component,

    properties: {
        grid: cc.Node,
        CellPrefab: {default: null, type: cc.Prefab},
        numNode:cc.Node,
        editButton:cc.Node,
        winNode:cc.Node,
        levelLabel:cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        this.isJiaZai = false;
        this.time = 0;
        this.shuduTool = app.shuduTool();
        this.LocalDataManager = app.LocalDataManager();
        let level = this.LocalDataManager.GetConfigProperty("SysSetting","choeseLevel");
        this.firstNum = 0;
        this.secendNum = 0;
        switch (level){
            case 0:
                this.firstNum = 4;
                this.secendNum = 6;
                this.levelLabel.string = "EASY";
                break
            case 1:
                this.firstNum = 5;
                this.secendNum = 6;
                this.levelLabel.string = "MEDIUM";
                break
            case 2:
                this.firstNum = 6;
                this.secendNum = 7;
                this.levelLabel.string = "HARD";
                break
            case 3:
                this.firstNum = 6;
                this.secendNum = 8;
                this.levelLabel.string = "EXTREME";
                break
            default:
                this.firstNum = 4;
                this.secendNum = 6;
                this.levelLabel.string = "EASY";
                break
        }
        this.shudu = this.shuduTool.GetShuDuArray();//获得答案
        cc.log("shu",this.shudu);
        if (!this.jiaZaiShuJu()){
            this.shuduTool.InitConfig();
        }


        for(let a = 0; a < this.numNode.childrenCount; a++){
            let children = this.numNode.children[a];
            children.on('click', this.onNumTouch, this);
        }
    },

    start:function () {

    },

    jiaZaiShuJu:function () {
        if (this.shudu.length > 0){
            this.isJiaZai = true;
            this.cells = [];

            for (let i = 0; i < 9; i++) {
                let initHideArray = [1,2,3,4,5,6,7,8,0];
                //let ciIndex = parseInt(Math.random()*2 + 4, 10); // 4---6
                let ciIndex = this.TakeRandomNumber(this.firstNum,this.secendNum);
                // cc.log("ciIndex",ciIndex);
                for (let index = 0 ; index < ciIndex; index++){
                    let index2 = parseInt(Math.random()*(initHideArray.length), 10);
                    initHideArray.splice(index2,1);
                }

                for (let j = 0; j < 9; j++) {//初始化数据
                    let cell = cc.instantiate(this.CellPrefab).getComponent(Cell);
                    this.cells.push(cell.node);
                    cell.node.on('click', this.onCellTouch, this);
                    this.grid.addChild(cell.node);
                    cell.node.x = -55 * 4 + 55 * j;
                    cell.node.y = 55 * 4 - 55 * i;

                    if (initHideArray.indexOf(j) >= 0){
                        cell.txt.node.active = true;
                        cell.txt.string = this.shudu[i][j];
                        cell.candidatesShown.push(this.shudu[i][j]);
                        cell.syncCandidates();

                        cell.node.color = cc.color(230, 212, 167);
                        cell.txt.node.color = cc.Color.BLACK;
                        cell.isChange = true;
                        // cell.getComponent(cc.Button).interactable = false;
                    }
                    else {
                        cell.txt.node.active = true;
                        cell.txt.string = "";
                    }

                }
            }
            return true;
        }
        else {
            return false;
        }
    },


    onCellTouch: function (e) {

        let touchedCellIndex = this.cells.indexOf(e.detail.node);
        if (this.waitingCellIndex != touchedCellIndex) {
            this.onBoardTouch(e);
            this.waitingCellIndex = this.cells.indexOf(e.detail.node);
            let cell = this.cells[this.waitingCellIndex].getComponent(Cell);
            this.checkNum(cell.candidatesShown);
            if (cell.isChange){
                this.cells[this.waitingCellIndex].color = cc.Color.GRAY;
                return;
            }
            this.cells[this.waitingCellIndex].color = cc.Color.YELLOW;
            if (cell.candidates.active || cell.candidatesShown.length > 1){
                this.editButton.children[0].color = cc.Color.YELLOW;
            }
            else {
                this.editButton.children[0].color = cc.Color.WHITE;
            }
            this.mapCandidatesToPanel();

        } else {
            this.onBoardTouch(e);
        }
    },

    onBoardTouch: function (e) {
        this.clearWaitingCellHighlight();
        this.clearEditPanel();
    },

    clearWaitingCellHighlight: function () {
        if (this.waitingCellIndex >= 0) {
            var c = this.cells[this.waitingCellIndex].getComponent(Cell);
            if (c.isChange){
                c.node.color = cc.color(230, 212, 167);
            }
            else {
                c.node.color = cc.Color.WHITE;
            }
            this.waitingCellIndex = -1;
        }
    },

    clearEditPanel: function () {
        for(let a = 0; a < this.numNode.childrenCount; a++){
            let children = this.numNode.children[a];
            children.children[0].color = cc.Color.WHITE;
        }
    },

    mapCandidatesToPanel: function () {
        if (this.waitingCellIndex >= 0) {
            var c = this.cells[this.waitingCellIndex].getComponent(Cell);
            for (let b = 0; b < c.candidatesShown.length; b++){
                let num = c.candidatesShown[b];
                for(let a = 0; a < this.numNode.childrenCount; a++){
                    let children = this.numNode.children[a];
                    let num2 = children.name.substr(children.name.length-1,children.name.length);
                    if (num2 == num){
                        children.children[0].color = cc.Color.YELLOW;
                    }

                }

            }
        }

    },

    onNumTouch: function (e) {

        let num = e.detail.node.name.substr(e.detail.node.name.length-1,e.detail.node.name.length);
        num = parseInt(num);
        if (this.waitingCellIndex >= 0) {
            let c = this.cells[this.waitingCellIndex].getComponent(Cell);
            if (c.isChange){
                return
            }
            if(c.candidatesShown.indexOf(num) < 0){
                c.candidatesShown.push(num);
                c.syncCandidates();
                e.detail.node.children[0].color = cc.Color.YELLOW;
            }
            else {
                c.candidatesShown.splice(c.candidatesShown.indexOf(num),1);
                c.syncCandidates();
                e.detail.node.children[0].color = cc.Color.WHITE;
            }


            if (c.candidatesShown.length > 1){
                c.txt.node.active = false;
                c.txt.string = c.candidatesShown[c.candidatesShown.length-1];
                c.candidates.active = true;
                this.editButton.children[0].color = cc.Color.YELLOW;
            }
            else if (c.candidatesShown.length < 2 && c.candidatesShown.length > 0){
                c.txt.node.active = true;
                c.candidates.active = false;
                c.txt.string = c.candidatesShown[0];
                this.editButton.children[0].color = cc.Color.WHITE;
            }
            else {
                c.txt.node.active = true;
                c.candidates.active = false;
                c.txt.string = "";

            }

            this.checkNum(c.candidatesShown);
            this.cells[this.waitingCellIndex].color = cc.Color.YELLOW;
            this.checkNumIsTrue(this.waitingCellIndex,c.candidatesShown[c.candidatesShown.length-1]);
            let isWin = this.shuduTool.CheckWin(this.cells);
            if (isWin){
                this.winNode.active = true;
                let winChild = this.winNode.children[0];
                let action = cc.sequence(cc.scaleTo (0.1,0,0),cc.scaleTo(0.4, 1, 1));
                winChild.runAction(action);
            }
        }

    },

    click_editButton:function () {

        if (this.waitingCellIndex >= 0){
            let c = this.cells[this.waitingCellIndex].getComponent(Cell);
            if (c.candidatesShown.length > 1){
                return;
            }
            else if (c.candidatesShown.length = 1){
                if (c.candidates.active){
                    c.candidates.active = false;
                    c.txt.node.active = true;
                    this.editButton.children[0].color = cc.Color.WHITE;
                }
                else {
                    c.txt.node.active = false;
                    c.candidates.active = true;
                    this.editButton.children[0].color = cc.Color.YELLOW;
                }

            }
        }

    },

    click_clean:function () {
        if (this.waitingCellIndex >= 0){
            let c = this.cells[this.waitingCellIndex].getComponent(Cell);
            if (c.isChange){
                return;
            }
            this.clearEditPanel();
            this.editButton.children[0].color = cc.Color.WHITE;
            c.clean();
            this.checkNum(c.candidatesShown);
            this.cells[this.waitingCellIndex].color = cc.Color.YELLOW;
        }
    },

    click_closeWin:function () {
        if (this.winNode.active){
            this.winNode.active = false;
            let winChild = this.winNode.children[0];
            winChild.scaleX = 0;
            winChild.scaleY = 0;
        }
    },

    checkNum:function (celNumArray) {

        for (let index = 0; index < celNumArray.length; index++){
            for(let i = 0; i < this.cells.length; i++){
                let c = this.cells[i].getComponent(Cell);
                let num = c.txt.string;
                if (!num){
                    continue;
                }

                let candNum = celNumArray[index];

                if (c.candidatesShown.indexOf(candNum) >= 0){
                    c.node.color = cc.color(125, 194, 62);
                    c.isLight = true;

                }
                else {
                    if (c.isLight){
                        continue;
                    }
                    if (c.isChange){
                        c.node.color = cc.color(230, 212, 167);
                    }
                    else {
                        c.node.color = cc.Color.WHITE;
                    }
                }

            }
        }

        for (let i = 0; i < this.cells.length; i++){
            let c = this.cells[i].getComponent(Cell);
            c.isLight = false;
            if (celNumArray.length < 1){
                if (c.isChange){
                    c.node.color = cc.color(230, 212, 167);
                }
                else {
                    c.node.color = cc.Color.WHITE;
                }
            }

        }

    },

    checkNumIsTrue:function (cellIndex,num) {
        let checkArray = this.shuduTool.GetCheckIsTrueArray(cellIndex);
        checkArray.splice(checkArray.indexOf(cellIndex),1);//弃掉自己
        //cc.log("checkArray",checkArray);
        for (let a = 0; a < checkArray.length; a++){
            let index = checkArray[a];
            let c = this.cells[index].getComponent(Cell);
            if (c.candidatesShown.indexOf(num) >= 0){
                c.showUpdateEffect();
            }
        }

    },

    TakeRandomNumber:function (firstNum,SecendNum) {
        let ciIndex = parseInt(Math.random()*(SecendNum - firstNum) + firstNum, 10); // 4---6
        return ciIndex;
    },

    // called every framea
    update: function (dt) {

        this.time += dt;
        if (!this.isJiaZai && this.time > 1){
            this.time = 0;
            this.shudu = this.shuduTool.GetShuDuArray();//获得答案
            cc.log("this.shudu222222222222222222222222222222222",this.shudu);
            this.jiaZaiShuJu();
        }
    },

});

