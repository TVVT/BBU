var db = require('./db');
var table_name = "users",
	data = {},
	ctime,
	conn;

function User(user){
	this.username = user.username;
	this.useremail = user.useremail;
	this.password = user.password;
	this.type = user.type;
}

module.exports = User;

User.prototype.create = function(callback){
	ctime = new Date();
	ctime = Math.ceil(ctime.getTime()/1000);
	data = {
		'username':this.username,
		'useremail':this.useremail,
		'password':this.password,
		'type':this.type,
		'ctime':ctime
	}
	db.insert_one(data,table_name,function(data){
		return callback(data);
	});
}

User.user_login = function(useremail,password,callback){
	var query = 'SELECT * FROM '+table_name+' WHERE useremail="'+useremail+'" AND password='+'"'+password+'"';
	db.query(query,function(data){
		return callback(data);
	});
}

//API 检查用户注册的时候 email是否已经存在
User.check_useremail = function(useremail,callback){
	db.query('SELECT COUNT(*) FROM '+table_name+' WHERE useremail='+useremail);
}