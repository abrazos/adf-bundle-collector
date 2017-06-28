/**
 * @author zhengjiachao
 * @since 2017-3-27
 */
'use strict';
var BundleCollector = require("./bundleCollector.js");
var collector = new BundleCollector();

class ADF{

    constructor(bundles_folder, logger){
        this.bundles_folder = bundles_folder;
        this.logger = logger;
    }

    collect(callback){
        collector.collect(this.bundles_folder, this.logger, callback);
    }

}

module.exports = ADF;