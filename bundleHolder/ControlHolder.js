/**
 * @author zhengjiachao
 * @since 2017-3-27
 */
'use strict';

var BundleHolder = require('./BundleHolder');

class ControlHolder extends BundleHolder {
    constructor(folder) {
        super(folder);
    }

    //TODO 可以增加自己资源相关的一些逻辑
}

module.exports = ControlHolder;