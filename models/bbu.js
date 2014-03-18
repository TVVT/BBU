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
	this.status = bug.status;
	this.email = bug.email;
	this.screenwidth = bug.screenwidth;
}

module.exports = Bug;

Bug.prototype.create = function(callback){
	ctime = new Date();
	ctime = Math.ceil(ctime.getTime()/1000);
	data = {
		'username' : this.userName,
		'bugdetail' : this.bugDetail,
		'picurl' : this.picUrl,//描述
		'priority' : this.priority,
		'browserinfo' : this.browserInfo,
		'weburl': this.webUrl,
		'status': this.status,
		'email':this.email,
		'screenwidth':this.screenwidth,
		'ctime':ctime
	};
	db.insert_one(data,table_name,function(data){
		return callback(data);
	});
}

Bug.getBugsByPageId = function(pageId,pageSize,callback){
	db.select_with_count(pageId*pageSize,pageSize,table_name,function(data){
		return callback(data);
	});
}

Bug.getBugById = function(bugId,callback){
	db.select_by_id(bugId,table_name,function(data){
		return callback(data);
	})
}

Bug.getBugsByPageIdAndStatusId = function(pageId,pageSize,title,statusId,callback){
	db.select_with_count_by_condition(pageId*pageSize,pageSize,title,statusId,table_name,function(data){
		return callback(data);
	});
}

Bug.changeBugStatus = function(bugId,uid,statusId,callback){
	var query = 'UPDATE '+table_name+' SET status='+statusId+',uid='+uid+' WHERE id='+bugId;
	db.query(query,function(data){
		if (data.affectedRows>0) {
			db.select_by_id(bugId,table_name,function(d){
				return callback(d);
			});
		};
	});
}