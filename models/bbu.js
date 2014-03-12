var db = require('./db');
var table_name = "bugs",
	data = {},
	ctime,
	conn;


function Bug(bug){
	this.userName = bug.userName;
	this.bugDetail = bug.bugDetail;
	this.picUrl = bug.picUrl;
	this.priority = bug.priority;
	this.browserInfo = bug.browserInfo;
	this.webUrl = bug.webUrl;
}

module.exports = Bug;

Bug.prototype.create = function(callback){
	conn = db.mysql.createConnection(db.dbConnInfo);
	ctime = new Date();
	ctime = Math.ceil(ctime.getTime()/1000);
	data = {
		'username' : this.userName,
		'bugdetail' : this.bugDetail,
		'picurl' : this.picUrl,//描述
		'priority' : this.priority,
		'browserinfo' : this.browserInfo,
		'weburl': this.webUrl,
		'ctime':ctime
	};
	db.insert_one(data,table_name,function(data){
		return callback(data);
	});
}

Bug.getBugsByPageId = function(pageId,pageSize,callback){
	conn = db.mysql.createConnection(db.dbConnInfo);
	db.select_with_count(pageId*pageSize,pageSize,table_name,function(data){
		return callback(data);
	});
}