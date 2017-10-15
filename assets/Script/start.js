/**
 * Created by c1720 on 2017/10/14.
 */
var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {
        gameContinue:cc.Node,
    },

    // use this for initialization
    onLoad: function () {

        if(!this.InitModel()){
            cc.error("OnInitClientFinish InitModel fail")
            return
        }

        this.LocalDataManager = app.LocalDataManager();
        this.gameContinue.active = false;
        let progressMark = this.LocalDataManager.GetConfigProperty("SysSetting","progressMark");
        if (progressMark){
            this.gameContinue.active = true;
        }
    },

    //初始化模块
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

    easyScene: function() {
        this.ChooseLevel(0);
    },

    mediumScene: function() {
        this.ChooseLevel(1);
    },

    hardScene: function() {
        this.ChooseLevel(2);
    },

    extremeScene: function() {
        this.ChooseLevel(3);
    },

    gameContinueSceneYes:function () {
        cc.director.preloadScene("mainScene", function (assets, error){
            //跳转到游戏界面
            cc.director.loadScene("mainScene");
        });
    },

    gameContinueSceneNo:function () {
        this.gameContinue.active = false;
    },

    ChooseLevel:function (level) {
        cc.director.preloadScene("mainScene", function (assets, error){
            //設置關卡
            app.LocalDataManager().SetConfigProperty("SysSetting", "choeseLevel", level);
            //跳转到游戏界面
            cc.director.loadScene("mainScene");
        });
    },
});