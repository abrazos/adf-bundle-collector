/**
 * @author zhengjiachao
 * @since 2017-3-27
 */
"use strict";
var path = require("path");

class BundleHolder{

    constructor(folder){
        var json = this.json = require(path.join(folder, "package.json"));
        this.type = json['adf']['type'];
        this.name = json['name'];
        this.folder = folder;
        this.resFils = json['adf']['resources'];
        this.descriptors = json['adf']['descriptors'];
        this.dependencies = json['adf']['dependencies'];
        this.css = json['adf']['css'];
        //TODO 文件目录的名称也要对应起来
    }

    getType(){
        return this.type;
    }

    getFolderPath(){
        return this.folder;
    }

    getName(){
        return this.name;
    }

    getResourceFiles(){
        return this.resFils;
    }

    getAllResourceFiles(){
        if(this.getDescriptors()){
            return (this.getResourceFiles() || []).concat(this.getDescriptors());
        }else{
            return this.getResourceFiles();
        }
    }

    getDescriptors(){
        return this.descriptors ? [].concat(this.descriptors) : undefined;
    }

    getDependencies(){
        return this.dependencies;
    }

    getCss(){
        return this.css;
    }

}

module.exports = BundleHolder;