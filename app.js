
var express = require('express');
var http = require('http');
var path = require('path');
var bbu = require('./controller/bbu');
var app = express();

// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
 

app.use(app.router);



// bug提交链接
app.post('/bugReceiver',bbu.bugReceiver);
// 获取BBU插件
app.get('/getBBU',bbu.getBBU);
// bug列表首页 
app.get('/BBUList',bbu.BBUList);
app.get('/',bbu.BBUList);

//APIS
app.post('/getBugsByPageId',bbu.getBugsByPageId);
app.post('/getBugById',bbu.getBugById);

//404页面 希望能用服务器去解决这件事情 因为这里还把css js等静态文件过滤了一下 不好不好
// app.get('/*',common.pageNotFound);

http.createServer(app).listen(app.get('port'), function(){
  console.log('cpc server listening on port ' + app.get('port'));
});



