var Model_bbu = require('../models/bbu');
var settings = require('../settings');

//列表首页 render使用angularjs 接口提供数据
exports.index = function(req,res){
	req.send("123");
}

//获取BBU
exports.getBBU = function(req,res){

	var renderData = {
		'baseUrl':settings.baseUrl
	}

	res.render('BBU/getBBU.ejs',renderData);
}

//根据bugid获取bug详细
exports.bugDetail = function(req,res){

}

//收集bug信息 存入数据库
exports.bugReceiver = function(req,res){

	if (req.body.username && req.body.bugdetail) {
		var bugData = {
			userName:req.body.username,
			bugDetail:req.body.bugdetail,
			picUrl:"www.baidu.com",
			browserInfo:req.body.browserinfo,
			webUrl:req.body.weburl,
			priority:0//优先级暂时都是0 TODO
		}

		
		res.send(bugData);
	}else{
		res.send("上传失败！");
	}

}