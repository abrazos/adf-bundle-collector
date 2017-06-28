/**
 * @author zhengjiachao
 * @since 2017-3-27
 */
'use strict';
var fs = require('fs');
var async = require('async');
var path = require('path');
var ActionHolder = require("./bundleHolder/ActionHolder");
var ControlHolder = require("./bundleHolder/ControlHolder");
var PropertyHolder = require("./bundleHolder/PropertyHolder");
var ResourceHolder = require("./bundleHolder/ResourceHolder");
var ToolHolder = require("./bundleHolder/ToolHolder");

class BundleCollector{

    constructor(){
        this.bundles = [];
    }

    collect(bundles_folder, logger, callback){
        var bundleFolders = path.join(bundles_folder);
        var bundleBinResolverArr = [];
        var bundles = this.bundles;
        var thisObj = this;
        fs.readdir(bundleFolders, (error, pluginFolders) => {
            logger.info('bundleCollectorr collecting bundles');
            for (var i = 0; i < pluginFolders.length; i++) {
                if (pluginFolders[i].startsWith(".")) {
                    continue;
                }
                logger.info('bundleCollector collecting bundle ' + i + ' : ' + pluginFolders[i]);
                bundleBinResolverArr.push(
                    (function(folder) {
                        return function(cb) {
                            var bundleFolderPath = path.join(bundleFolders, folder);
                            var packageJson = require(path.join(bundleFolderPath, 'package.json'));
                            if(packageJson && packageJson["adf"] && packageJson["adf"]['type']){
                                var type = packageJson["adf"]['type'];
                                switch(type){
                                    case "Action" : 
                                        bundles.push(new ActionHolder(bundleFolderPath));
                                        break;
                                    case "Control" : 
                                        bundles.push(new ControlHolder(bundleFolderPath));
                                        break;
                                    case "Property" : 
                                        bundles.push(new PropertyHolder(bundleFolderPath));
                                        break;
                                    case "Resource" : 
                                        bundles.push(new ResourceHolder(bundleFolderPath));
                                        break;
                                    case "Tool" : 
                                        bundles.push(new ToolHolder(bundleFolderPath));
                                        break;
                                    default: 
                                        logger.warn('bundle ' + i + ' : ' + pluginFolders[i] + '  cannot be recognized');
                                }
                            }
                            cb();
                        };
                    })(pluginFolders[i])
                );
            };

            async.parallel(
                bundleBinResolverArr,
                (err) => {
                    if (err) {
                        logger.error('resolver resolve error : ' + error);
                        callback(error);
                    } else {
                        //TODO 把依赖顺序捋出来，然后返回正确依赖顺序的插件列表
                        callback(null, thisObj.getSortedBundleHolders());
                    }
                }
            );
        });
    }

    getSortedBundleHolders(){
        var plugins = [];
        var config = this.bundles;
        config.forEach(function(pluginConfig, index) {
            plugins.push({
                name : pluginConfig.getName(),
                consumes: (pluginConfig.getDependencies() || []).concat(),
                i: index
            });
        });

        var resolved = {
            hub: true
        };
        var changed = true;
        var sorted = [];

        while(plugins.length && changed) {
            changed = false;

            plugins.concat().forEach(function(plugin) {
                var consumes = plugin.consumes.concat();

                var resolvedAll = true;
                for (var i=0; i<consumes.length; i++) {
                    var service = consumes[i];
                    if (!resolved[service]) {
                        resolvedAll = false;
                    } else {
                        plugin.consumes.splice(plugin.consumes.indexOf(service), 1);
                    }
                }

                if (!resolvedAll)
                    return;

                plugins.splice(plugins.indexOf(plugin), 1);
                resolved[plugin.name] = true;
                sorted.push(config[plugin.i]);
                changed = true;
            });
        }
        //TODO 循环依赖等错误处理


        // if (plugins.length) {
        //     var unresolved = {};
        //     plugins.forEach(function(plugin) {
        //         delete plugin.config;
        //         plugin.consumes.forEach(function(name) {
        //             if (unresolved[name] == false)
        //                 return;
        //             if (!unresolved[name])
        //                 unresolved[name] = [];
        //             unresolved[name].push(plugin.packagePath);
        //         });
        //         plugin.provides.forEach(function(name) {
        //             unresolved[name] = false;
        //         });
        //     });

        //     Object.keys(unresolved).forEach(function(name) {
        //         if (unresolved[name] == false)
        //             delete unresolved[name];
        //     });

        //     console.error("Could not resolve dependencies of these plugins:", plugins);
        //     console.error("Resolved services:", Object.keys(resolved));
        //     console.error("Missing services:", unresolved);
        //     throw new Error("Could not resolve dependencies");
        // }
        return sorted;
    }
    
}

module.exports = BundleCollector;