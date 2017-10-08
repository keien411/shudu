cc.Class({
    extends: cc.Component,

    properties: {
        txt: cc.Label,
        candidates: cc.Node,
        candidatesShown: [],
        isChange: false,
        isLight: false,
        candidatesLabels: [cc.Label]
    },

    syncCandidates: function () {

        let len = this.candidatesShown.length;//a
        for (let b = 0; b < this.candidatesLabels.length; b++) {
            this.candidatesLabels[b].string = " ";
        }

        for (let i = 0; i < len; i++){
            let num = this.candidatesShown[i];
            this.candidatesLabels[num - 1].string = num;
        }


    },

    showUpdateEffect: function () {
        let action = cc.sequence(cc.fadeOut(0.1),cc.tintTo(0.1, 255, 0, 0),cc.fadeIn(0.1));
        this.node.runAction(cc.repeat(action,2));
    },

    // use this for initialization
    onLoad: function () {

    },

    clean:function () {
        this.candidatesShown = [];
        for (var i = 0; i < this.candidatesLabels.length; i++) {
            this.candidatesLabels[i].string = " ";
        }
        this.txt.string = "";
    }


});