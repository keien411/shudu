cc.Class({
    extends: cc.Component,

    properties: {
        effect: cc.Node,
        txt: cc.Label,
        candidates: cc.Node,
        candidatesShown: [],
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
        this.effect.opacity = 255;
        var a = cc.fadeOut(1);
        this.effect.runAction(a);
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