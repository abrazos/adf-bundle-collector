/**
 * @author zhengjiachao
 * @since 2017-3-27
 * 可以只发布资源，一般做抽象类以及公共资源发布用途
 */
'use strict';

var BundleHolder = require('./BundleHolder');

class ResourceHolder extends BundleHolder {
    constructor(folder) {
        super(folder);
    }

    //TODO 可以增加自己资源相关的一些逻辑
}

module.exports = ResourceHolder;