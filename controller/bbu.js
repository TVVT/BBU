var Model_bbu = require('../models/bbu');
var settings = require('../settings');
var fs = require('fs');
var path = require('path');

//列表首页 render使用angularjs 接口提供数据
exports.index = function(req, res) {
	req.send("123");
}

//获取BBU
exports.getBBU = function(req, res) {

	var renderData = {
		'baseUrl': settings.baseUrl
	}

	res.render('BBU/getBBU.ejs', renderData);
}

//根据bugid获取bug详细
exports.bugDetail = function(req, res) {

}

//收集bug信息 存入数据库
exports.bugReceiver = function(req, res) {

	if (req.files.bugimg.name) {
		checkDir();
		if (req.files.bugimg.type == "image/jpeg" || req.files.bugimg.type == "image/png" || req.files.bugimg.type == "image/gif") {
			var tmpPath = req.files.bugimg.path;
			var date = new Date();
			var picRan = date.getTime() + Math.floor(Math.random() * 100000).toString();
			var fileName = picRan + '.' + req.files.bugimg.name.replace(/.+\./, "");
			var picPath = './public/media/bbu/' + date.getFullYear().toString() + '/' + (date.getMonth() + 1).toString() + '/';
			var targetPath = picPath + fileName;

			fs.link(tmpPath,targetPath,function(err){
				if (err) throw err;
			})

		}else{
			res.send("上传文件格式不正确！");
			return;
		}
	};

	if (req.body.username && req.body.bugdetail) {
		var bugData = {
			userName:req.body.username,
			bugDetail:req.body.bugdetail,
			picUrl:targetPath,
			browserInfo:req.body.browserinfo,
			webUrl:req.body.weburl,
			priority:0//优先级暂时都是0 TODO
		}
		var newBug = new Model_bbu(bugData);
		newBug.create(function(data){
			if (data) {
				res.send("提交成功！");
			};
		});
	}else{
		res.send("上传失败！");
	}

}

//检查路径是否存在 不存在的话就新建一个 仅仅适用于本项目～
var checkDir = function(){
	var rootPath = './public/media/bbu/',
		date = new Date();
	if (fs.existsSync(rootPath + '/' + date.getFullYear().toString() + '/' + (date.getMonth() + 1).toString())) {
		return;
	}else{
		if (fs.existsSync(rootPath + '/' + date.getFullYear().toString())) {
			fs.mkdirSync(rootPath + '/' + date.getFullYear().toString() + '/' + (date.getMonth() + 1).toString());
		}else{
			fs.mkdirSync(rootPath + '/' + date.getFullYear().toString());
			fs.mkdirSync(rootPath + '/' + date.getFullYear().toString + '/' + (date.getMonth() + 1).toString());
		}
	}
}
