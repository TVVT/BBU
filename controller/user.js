var Model_user = require('../models/user');
var settings = require('../settings');

exports.logIn = function(req,res){
	var renderData = {
		'baseUrl':settings.baseUrl
	}
	res.render('BBU/login.ejs',renderData);
}

exports.reg = function(req,res){
	var renderData = {
		'baseUrl':settings.baseUrl
	}
	res.render('BBU/reg.ejs',renderData);
}

//API 登录
exports.getLogin = function(req,res){
	var useremail = req.body.useremail;
	var password = req.body.password;
	Model_user.user_login(useremail,password,function(data){
		var userData = {
			'id':data[0].id,
			'username':data[0].username,
			'useremail':data[0].useremail,
			'type':data[0].type
		};
		res.send(userData);
	})

}

//API 注册
exports.getReg = function(req,res){

}