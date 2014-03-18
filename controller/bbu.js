var Model_bbu = require('../models/bbu');
var settings = require('../settings');
var fs = require('fs');
var path = require('path');
var result = {};
var email = require('emailjs');

//列表首页 render使用angularjs 接口提供数据
exports.BBUList = function(req, res) {
	res.redirect('../webAPP/BBU/index.html');
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
	console.log(req.files.bugimg.type);
	if (req.files.bugimg.name) {
		checkDir();
		if (req.files.bugimg.type == "image/jpeg" || req.files.bugimg.type == "image/png" || req.files.bugimg.type == "image/gif" || req.files.bugimg.type == "image/x-png" || req.files.bugimg.type == "image/pjpeg") {
			var tmpPath = req.files.bugimg.path;
			var date = new Date();
			var picRan = date.getTime() + Math.floor(Math.random() * 100000).toString();
			var fileName = picRan + '.' + req.files.bugimg.name.replace(/.+\./, "");
			var picPath = './public/media/bbu/' + date.getFullYear().toString() + '/' + (date.getMonth() + 1).toString() + '/';
			var targetPath = picPath + fileName;

			fs.link(tmpPath, targetPath, function(err) {
				if (err) throw err;
			})

		} else {
			res.send("上传文件格式不正确！");
			return;
		}
	};

	if (req.body.username && req.body.bugdetail) {
		var bugData = {
			userName: req.body.username,
			bugDetail: req.body.bugdetail,
			picUrl: targetPath ? targetPath.replace(/.\/public\//, "") : '',
			browserInfo: req.body.browserinfo,
			webUrl: req.body.weburl,
			email: req.body.email,
			screenwidth: req.body.screenwidth,
			status: 1, //1代表未处理 2代表正在处理 3代表处理完毕
			priority: 0 //优先级暂时都是0 TODO
		}
		var newBug = new Model_bbu(bugData);
		newBug.create(function(data) {
			if (data) {
				res.send("提交成功！");
			};
		});
	} else {
		res.send("昵称和bug信息必填！");
	}

}

//API 返回分页数据
exports.getBugsByPageId = function(req, res) {

	var pageId = req.body.pageId,
		pageSize = req.body.pageSize,
		statusId = Number(req.body.statusId),
		titleName = 'status';
	switch (statusId) {
		case 0: //全部
			Model_bbu.getBugsByPageId(pageId, pageSize, function(data) {
				res.send(data);
			})
			break;
		case 4: //搜索
			break;
		default:
			Model_bbu.getBugsByPageIdAndStatusId(pageId, pageSize, titleName, statusId, function(data) {
				res.send(data);
			})
	}


}
//API 返回bug数据
exports.getBugById = function(req, res) {
	var bugId = req.body.bugId;
	Model_bbu.getBugById(bugId, function(data) {
		res.send(data);
	})
}

//API 更改bug状态 同时写入解决者id
exports.changeBugStatus = function(req, res) {
	var bugId = req.body.bugId;
	var uid = req.body.uid;
	var status = req.body.status;
	if (!req.body.uid) {
		result.res_code = 0;
		result.msg = "请先登录！";
		res.send(result);
	} else {
		Model_bbu.changeBugStatus(bugId, uid, status, function(data) {
			if (data && data.length>0) {
				result.res_code = 1;
				var msg = {
					title: "一号店TVVT"
				}
				switch (status) {
					case 2:
						msg.content = "您提交的bug正在处理中。。。";
						break;
					case 3:
						msg.content = "您提交的bug已处理完毕！";
						break;
					default:
						msg.content = "您提交的bug已处理完毕！";
				}
				var target = data[0].email;
				sendEmail(target,msg);
			} else {
				result.res_code = 0;
			}
			res.send(result);
		})
	}


}

var sendEmail = function(target, msg) {
	var from = {
		username: "TVVT",
		userEmail: "yhdtvvt@163.com",
		password: "tvvtyhd"
	}
	var host = "smtp.163.com";
	var server = email.server.connect({
		user: from.userEmail,
		password: from.password,
		host: host,
		ssl: true
	});
	var message = {
		text: msg.content,
		from: from.username + " <" + from.userEmail + ">",
		to: target,
		subject: msg.title
	}
	server.send(message, function(err, message) {
		if (err) {
			console.log(err);
		} else {
			console.log(message);
		}
	});

}

//检查路径是否存在 不存在的话就新建一个 仅仅适用于本项目～
var checkDir = function() {
	var rootPath = './public/media/bbu',
		date = new Date();
	if (fs.existsSync(rootPath + '/' + date.getFullYear().toString() + '/' + (date.getMonth() + 1).toString())) {
		return;
	} else {
		if (fs.existsSync(rootPath + '/' + date.getFullYear().toString())) {
			fs.mkdirSync(rootPath + '/' + date.getFullYear().toString() + '/' + (date.getMonth() + 1).toString());
		} else {
			fs.mkdirSync(rootPath + '/' + date.getFullYear().toString());
			fs.mkdirSync(rootPath + '/' + date.getFullYear().toString + '/' + (date.getMonth() + 1).toString());
		}
	}
}