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
    },

    // use this for initialization
    onLoad: function () {

        if(!this.InitModel()){
            cc.error("OnInitClientFinish InitModel fail");
            return
        }

        this.shuduTool = app.shuduTool();
        let shudu = this.shuduTool.GetShuDuArray();
        cc.log("shu",shudu);

        this.cells = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                let cell = cc.instantiate(this.CellPrefab).getComponent(Cell);
                this.cells.push(cell.node);
                cell.node.on('click', this.onCellTouch, this);
                this.grid.addChild(cell.node);
                cell.node.x = -55 * 4 + 55 * j;
                cell.node.y = 55 * 4 - 55 * i;


                cell.txt.node.active = true;
                cell.txt.string = shudu[i][j];
            }
        }

        for(let a = 0; a < this.numNode.childrenCount; a++){
            let children = this.numNode.children[a];
            children.on('click', this.onNumTouch, this);
        }
    },

    start:function () {

    },


    onCellTouch: function (e) {

        let touchedCellIndex = this.cells.indexOf(e.detail.node);
        if (this.waitingCellIndex != touchedCellIndex) {
            this.onBoardTouch(e);
            this.waitingCellIndex = this.cells.indexOf(e.detail.node);
            this.cells[this.waitingCellIndex].color = cc.Color.YELLOW;

            this.cells[this.waitingCellIndex].getComponent(Cell).txt.node.active = false;
            this.cells[this.waitingCellIndex].getComponent(Cell).candidates.active = true;
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

            // if (this.wrongCells.indexOf(this.waitingCellIndex) >= 0) {
            //     c.txt.node.active = true;
            //     c.candidates.active = false;
            // }
            // else {
            //     c.txt.node.active = false;
            //     c.candidates.active = true;
            // }
            c.node.color = cc.Color.WHITE;

            this.waitingCellIndex = -1;
        }
    },

    clearEditPanel: function () {
        // for (var i = 0; i < this.panel.nums.length; i++) {
        //     this.panel.nums[i].node.getChildByName("txt").getComponent(cc.Label).node.color = cc.Color.WHITE;
        // }
    },

    mapCandidatesToPanel: function () {
        if (this.waitingCellIndex >= 0) {
            var c = this.cells[this.waitingCellIndex].getComponent(Cell);
            for (var i = 0; i < c.candidatesLabels.length; i++) {
                // if (c.candidatesLabels[i].string == this.panel.nums[i].node.getChildByName("txt").getComponent(cc.Label).string) {
                //     this.panel.nums[i].node.getChildByName("txt").getComponent(cc.Label).node.color = cc.Color.YELLOW;
                // }
                // else {
                //     this.panel.nums[i].node.getChildByName("txt").getComponent(cc.Label).node.color = cc.Color.WHITE;
                // }
            }
        }

    },

    onNumTouch: function (e) {

        let num = e.detail.node.name.substr(e.detail.node.name.length-1,e.detail.node.name.length);
        if (this.waitingCellIndex >= 0) {
            var c = this.cells[this.waitingCellIndex].getComponent(Cell);
            c.txt.node.active = true;
            c.txt.string = num;
        }

    },

    InitModel:function(){
        let modelName = "";
        try{
            let NeedCreateList = app.NeedCreateList;
            let count = NeedCreateList.length;
            for(let index=0; index<count; index++){
                modelName = NeedCreateList[index];
                //设置所有单例引用接口到app
                app[modelName] = require(modelName).GetModel;
                cc.log("OnLoad require(%s)", modelName);
            }
        }
        catch(error){
            cc.log("OnLoad require(%s) error:%s", modelName, error.stack);
            return false
        }

        return true;
    },

    // called every framea
    update: function (dt) {

    },
});

