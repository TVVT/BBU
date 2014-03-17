var db = require('./db');
var table_name = "users",
	data = {},
	ctime,
	conn;

function User(user) {
	this.username = user.username;
	this.useremail = user.useremail;
	this.password = user.password;
	this.type = user.type;
}

module.exports = User;

//注册 暂时不支持自动登录
User.prototype.create = function(callback) {
	ctime = new Date();
	ctime = Math.ceil(ctime.getTime() / 1000);
	data = {
		'username': this.username,
		'useremail': this.useremail,
		'password': this.password,
		'type': this.type,
		'ctime': ctime
	}

	check_useremail(data.useremail, function(d) {
		if (d[0]['COUNT(*)'] != 0) {
			data.res_code = 0;
			return callback(data);
		} else {
			db.insert_one(data, table_name, function(d) {
				data.res_code = 1;
				return callback(data);
			});
		}
	})

}

User.user_login = function(useremail, password, callback) {
	var query = 'SELECT * FROM ' + table_name + ' WHERE useremail="' + useremail + '" AND password=' + '"' + password + '"';
	db.query(query, function(data) {
		return callback(data);
	});
}

//API 检查用户注册的时候 email是否已经存在
User.check_useremail = function(useremail, callback) {
	db.query('SELECT COUNT(*) FROM ' + table_name + ' WHERE useremail=' + useremail);
}

function check_useremail(useremail, callback) {
	var query = 'SELECT COUNT(*) FROM ' + table_name + ' WHERE useremail="' + useremail + '"';
	db.query(query, function(data) {
		return callback(data);
	});
}