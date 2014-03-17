var mysql = require('mysql')
	,dbConnInfo = {
		'host': '127.0.0.1',
		'database': 'bbu',
		'port': '3306',
		'user': 'root',
		'password': ''
	};
var conn;

exports.mysql = mysql;
exports.dbConnInfo = dbConnInfo;

//插入单条数据 insert_data：数据json对象 
exports.insert_one = function(insert_data,table_name,callback){
	conn = mysql.createConnection(dbConnInfo);
	var cmd = "INSERT INTO "+table_name+" SET";
	for(var key in insert_data){
		cmd+=(" "+key+"='"+insert_data[key]+"',");
	}
	cmd = cmd.substring(0,cmd.length-1)
	// cmd += " SELECT LAST_INSERT_ID()";
	conn.query(cmd,function(err,rs,fields){
		conn.end();
		if (err) {
			console.log(err);
			return false;
		};
		return callback(rs);
	})
}

//删除一条或多条数据 ids：number or string 如果是number那么 删除单条数据  如果是string那么 删除多条数据
exports.delete_by_id = function(ids,table_name){
	conn = mysql.createConnection(dbConnInfo);
	var cmd = "";
	if (typeof(ids) == Number) {
		cmd = "DELETE  FROM " + table_name + " WHERE " + "id=" + ids; 
	}else if(typeof(ids) == String){
		cmd = 'DELETE  FROM ' + TEST_TABLE + ' WHERE ' + 'id' + ' IN' + '(' + ids + ')';
	}else{
		return "input type error..."
	}
	conn.query(cmd,function(err,rs,fields){
		conn.end();
		if (err) {
			return false;
		};
		return rs;
	})
}

//更新一条数据
exports.update_by_id = function(update_data,id,table_name){
	conn = mysql.createConnection(dbConnInfo);
	var cmd = "UPDATE " + table_name+" set";
	for(var key in update_data){
		cmd+=(" "+key+"='"+update_data[key]+"',");
	}
	cmd = cmd.substring(0,cmd.length-1)
	cmd+=" WHERE id= "+id;

	conn.query(cmd,function(err,rs,fields){
		conn.end()
		if (err) {
			return false;
		};
		return rs;
	})
}

//根据id查询数据
exports.select_by_id = function(id,table_name,callback){
	conn = mysql.createConnection(dbConnInfo);
	var cmd = "SELECT * FROM " + table_name + " WHERE id= " + "'" + id + "'";
	conn.query(cmd,function(err,rs,fields){
		conn.end();
		if (err) {
			console.log(err);
			return false;
		};
		return callback(rs);
	})
}

//根据title查询数据
exports.select_by_title = function(title,info,table_name,callback){
	conn = mysql.createConnection(dbConnInfo);
	var cmd = "SELECT * FROM " + table_name + " WHERE "+title+"='" + info +"'";
	conn.query(cmd,function(err,rs,fields){
		if (err) {
			console.log(err);
			return false;
		};
		return callback(rs);
		conn.end();
	})
}

//查询数据段 begin 开始id length 长度
exports.select_with_count = function(begin,length,table_name,callback){
	conn = mysql.createConnection(dbConnInfo);
	var cmd = "SELECT * FROM " + table_name + " ORDER BY id DESC LIMIT " + begin +","+length;
	console.log(cmd);
	conn.query(cmd,function(err,rs,fields){
		conn.end();
		if (err) {
			console.log(err);
			return false;
		};
		return callback(rs);
	})
}

//查询数据段 begin 开始id length 长度 title 限制
exports.select_with_count_by_condition = function(begin,length,title,value,table_name,callback){
	conn = mysql.createConnection(dbConnInfo);
	var cmd = "SELECT * FROM " + table_name + " WHERE "+title+"="+value+" ORDER BY id DESC LIMIT " + begin +","+length;
	console.log(cmd);
	conn.query(cmd,function(err,rs,fields){
		conn.end();
		if (err) {
			console.log(err);
			return false;
		};
		return callback(rs);
	})
}

//自由query 给用户自己写query的东东 query是查询字符串
exports.query = function(query,callback){
	conn = mysql.createConnection(dbConnInfo);
	conn.query(query,function(err,rs,fields){
		conn.end();
		if (err) {
			console.log("error:"+err)
			return false;
		};
		return callback(rs);
	})
}

exports.get_count = function(table_name,callback){
	conn = mysql.createConnection(dbConnInfo);
	var cmd = "SELECT COUNT(0) FROM "+ table_name;
	conn.query(query,function(err,rs,fields){
		conn.end();
		if (err) {
			return false;
		};
		return callback(rs);
	})
}

exports.select_all = function(table_name,callback){
	conn = mysql.createConnection(dbConnInfo);
	var cmd = "SELECT * FROM " + table_name;
	conn.query(cmd,function(err,rs,fields){
		conn.end();
		if (err) {
			console.log(err);
			return false;
		};
		return callback(rs);
	})
}
