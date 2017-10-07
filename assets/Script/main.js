/**
 * Created by c1720 on 2017/10/7.
 */
const Cell = require("Cell");

cc.Class({
    extends: cc.Component,

    properties: {
        grid: cc.Node,
        CellPrefab: {default: null, type: cc.Prefab},
    },

    // use this for initialization
    onLoad: function () {
        this.cells = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                let cell = cc.instantiate(this.CellPrefab).getComponent(Cell);
                this.cells.push(cell.node);
                cell.node.on('click', this.onCellTouch, this);
                this.grid.addChild(cell.node);
                cell.node.x = -55 * 4 + 55 * j;
                cell.node.y = 55 * 4 - 55 * i;
            }
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

    // called every framea
    update: function (dt) {

    },
});

