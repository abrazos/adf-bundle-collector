# adf-bundle-collector

adf框架的插件收集器，负责收集并排序插件，最终导出资源排序后的数组

一个收集所有插件的js和css列表的应用如下

```
var log4js = require('log4js');
var ADF = require("adf-bundle-collector");

var logger = log4js.getLogger();
var bundlesRoot = path.join(__dirname, "src"); //插件的根目录
var adf = new ADF(bundlesRoot, logger);

var jsresourceFileList = [];
var cssresourceFileList = [];
module.exports = function(callback){
	adf.collect(function(error, bundleHolders){
        //bundleHolders 是所有插件的解析后对象
		bundleHolders.forEach(function(element) {
            //获取插件声明的js文件
			var resourceFiles = element.getAllResourceFiles();
			if(resourceFiles){
				resourceFiles.forEach(function(file) {
					jsresourceFileList.push(path.join(element.getName(), file));
				}, this);
			}
            //获取插件声明的css文件
			var css_files = element.getCss();
			if(css_files){
				css_files.forEach(function(file) {
					cssresourceFileList.push(path.join(element.getName(), file));
				}, this);
			}
		}, this);
	});
}

```