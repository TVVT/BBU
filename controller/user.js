var Model_user = require('../models/user');
var settings = require('../settings');


exports.logIn = function(req, res) {
	var renderData = {
		'baseUrl': settings.baseUrl
	}
	res.render('BBU/login.ejs', renderData);
}

exports.reg = function(req, res) {
	var renderData = {
		'baseUrl': settings.baseUrl
	}
	res.render('BBU/reg.ejs', renderData);
}

//API 登录
exports.getLogin = function(req, res) {
	var useremail = req.body.useremail;
	var password = req.body.password;
	Model_user.user_login(useremail, password, function(data) {
		if (!data.length) {
			userData.res_code = 0;
		} else {
			userData = {
				'res_code':1,
				'id': data[0].id,
				'username': data[0].username,
				'useremail': data[0].useremail,
				'type': data[0].type
			};
		}
		res.send(userData);
	})

}

//API 注册
exports.getReg = function(req, res) {
	var username = req.body.username;
	var useremail = req.body.useremail;
	var password = req.body.password;
	var repassword = req.body.repassword;
	var auth = req.body.auth;
	var userData = {
		res_code:0
	};

	if (auth != "ued") {
		userData.msg = "邀请码不正确！";
		res.send(userData);
		return false;
	};

	if (password != repassword) {
		userData.msg = "两次密码输入不一致！";
		res.send(userData);
		return false;
	};

	if (username && useremail && password && auth) {
		var user = {
			username:username,
			useremail:useremail,
			password:password,
			type:1
		}
		var newUser = new Model_user(user);
		newUser.create(function(data){
			if (data.res_code) {
				userData.res_code = 1;
				userData.msg = '注册成功！';
			}else{
				userData.res_code = 0;
				userData.msg = '注册失败，邮箱已存在！';
			}
			res.send(userData);
		})
	}else{
		userData.msg = "信息不完整！";
		res.send(userData);
		return false;
	}

}