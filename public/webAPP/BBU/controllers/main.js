;
(function(window) {

	//初始化应用
	var BBU = angular.module("BBU", []);
	var pageSize = 10;
	var isLogin = false;
	//由于后台要求高端浏览器 因此这里用localStorage 并且安全性暂时不考虑
	if (localStorage) {
		if (localStorage.username && localStorage.length > 0) { //表示已经登录
			isLogin = true;
		} else { //未登录
			isLogin = false;
		}
	}

	//数据的单例 以后会放到service目录里 类似于model的作用
	BBU.service('bugService', ['$http',
		function($http) {
			var service = {
				bugs: [],
				bug: {},
				callback: {},
				addBug: function(bug) {
					service.bugs.push(bug);
				},
				removeBugById: function(bug) {

				},
				getBugs: function() {
					return service.bugs;
				},
				getBug: function() {
					return service.bug;
				}
			};
			return service;
		}
	]);

	//bugs list controller
	BBU.controller('ListCtrl', ['$scope', 'bugService', '$routeParams', '$http',
		function ListCtrl($scope, bugService, $routeParams, $http) {
			$scope.pageId = $routeParams.pid;
			$scope.statusId = $routeParams.sid;
			$scope.statusId = 1;//设置所有都指向未处理的bugs 其他状态的bug不再出现
			$scope.getBugsFromRemote = function(pageId, sid) {
				$http({
					method: 'POST',
					url: '/getBugsByPageId',
					data: {
						pageId: pageId - 1,
						pageSize: pageSize,
						statusId: sid
					}
				}).success(function(data, status, headers, config) {
					for (var i = 0; i < data.length; i++) {
						data[i].ctime = new Date(parseInt(data[i].ctime) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
						switch (data[i].status) {
							case 1:
								data[i].status = "未处理";
								// data[i].todoText = "开始处理";
								data[i].todoText = "删除";//这里改为删除
								break;
							case 2:
								data[i].status = "正在处理";
								data[i].todoText = "结束处理";
								break;
							case 3:
								data[i].status = "已处理";
								data[i].todoText = "重新开始处理";
								break;
							default:
								data[i].status = "未处理";
								data[i].todoText = "开始处理";
								break;
						}
					}
					bugService.bugs = data;
				}).error(function(data, status, headers, config) {
					throw "访问数据错误！";
				});
			};
			$scope.getBugs = function() {
				return bugService.getBugs();
			}

			$scope.fixBug = function(index) {
				var index = index;
				var bug = bugService.bugs[index],
					statusId;
				switch (bug.todoText) {
					case '开始处理':
						statusId = 2;
						break;
					case '结束处理':
						statusId = 3;
						break;
					case '重新开始处理':
						statusId = 2;
						break;
					case '删除':
						statusId = 3;
						break;
				}
				$http({
					method: 'POST',
					url: '/changeBugStatus',
					data: {
						bugId: bug.id,
						uid: localStorage.getItem('id'),
						status: statusId
					}
				}).success(function(data, status, headers, config) {
					if (data.res_code) {
						// switch (statusId) {
						// 	case 2:
						// 		bugService.bugs[index].todoText = "结束处理";
						// 		bugService.bugs[index].status = "正在处理";
						// 		break;
						// 	case 3:
						// 		bugService.bugs[index].todoText = "重新开始处理";
						// 		bugService.bugs[index].status = "已处理";
						// 		break;
						// }

						//假设操作成功！那么删除这一条信息 其实后台并未删除 哈哈哈哈
						bugService.bugs.splice(index,1);
					} else {
						alert(data.msg);
					}
				}).error(function(data, status, headers, config) {
					throw "访问数据错误！";
				});
			}

			$scope.isLogin = isLogin;

			$scope.nextPage = 's' + $scope.statusId + '/p' + (parseInt($scope.pageId) + 1);
			$scope.prevPage = 's' + $scope.statusId + '/p' + (parseInt($scope.pageId) - 1);
			//初始化数据
			$scope.getBugsFromRemote($scope.pageId, $scope.statusId);
		}
	])

	// bugs detail controller
	BBU.controller('BugDetail', ['$scope', 'bugService', '$routeParams', '$http',
		function BugDetail($scope, bugService, $routeParams, $http) {
			var bugId = $routeParams.id;
			$scope.bugService = bugService;
			$scope.bug = bugService.getBug();
			$scope.getBugById = function(bugId) {
				// for (var i = 0; i < bugService.bugs.length; i++) {
				// 	if (bugService.bugs[i].id == bugId) {
				// 		bugService.bug = bugService.bugs[i];
				// 		console.log(bugService.bug);
				// 		return;
				// 	};
				// }
				$http({
					method: 'POST',
					url: '/getBugById',
					data: {
						bugId: bugId
					}
				}).success(function(data, status, headers, config) {
					data[0].ctime = new Date(parseInt(data[0].ctime) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
					switch (data[0].status) {
						case 1:
							data[0].status = "未处理";
							data[0].todoText = "开始处理";
							break;
						case 2:
							data[0].status = "正在处理";
							data[0].todoText = "结束处理";
							break;
						case 3:
							data[0].status = "已处理";
							data[0].todoText = "重新开始处理";
							break;
						default:
							data[0].status = "未处理";
							data[0].todoText = "开始处理";
							break;
					}
					bugService.bug = data[0];
					bugService.bug.hasImg = bugService.bug.picurl === ''?false:true;
				}).error(function(data, status, headers, config) {
					throw "访问数据错误！";
				});
			}
			$scope.$watch('bugService.getBug()', function(newData, oldData) {
				if (oldData !== newData) {
					$scope.bug = newData;
				};
			});
			$scope.getBugById(bugId);
		}
	])

	BBU.controller('HeaderCtrl', ['$scope', '$http',
		function HeaderCtrl($scope, $http) {

			$scope.loginShow = false;
			$scope.regShow = false;

			$scope.btnCtrl1 = function() {
				if (isLogin) {
					return localStorage.getItem('username');
				} else {
					return "登录";
				}
			}

			$scope.btnCtrl2 = function() {
				if (isLogin) {
					return "退出";
				} else {
					return "注册";
				}
			}

			$scope.btn1 = function() {
				if (isLogin) {

				} else {
					if ($scope.loginShow) {
						$scope.loginShow = false;
					} else {
						$scope.loginShow = true;
					}
				}
			}

			$scope.btn2 = function() {
				if (isLogin) {
					//这里执行退出
					localStorage.removeItem('username');
					localStorage.removeItem('useremail');
					localStorage.removeItem('type');
					localStorage.removeItem('id');
					isLogin = false;
				} else {
					window.location.href = "http://192.168.112.94:4000/reg";
				}
			}

			$scope.doLogin = function() {
				var useremail = document.getElementById("useremail");
				var password = document.getElementById("password");
				$http({
					method: 'POST',
					url: '/getLogin',
					data: {
						useremail: useremail.value,
						password: password.value
					}
				}).success(function(data, status, headers, config) {
					if (data.res_code) {
						alert("登录成功！");
						localStorage.setItem('username', data.username);
						localStorage.setItem('useremail', data.useremail);
						localStorage.setItem('type', data.type);
						localStorage.setItem('id', data.id);
						isLogin = true;
						$scope.loginShow = false;
					} else {
						alert("用户名或者密码不正确！");
					}
				}).error(function(data, status, headers, config) {
					throw "访问数据错误！";
				});
			}

		}
	])

	// 配置路由
	BBU.config(['$routeProvider', '$locationProvider',
		function($routeProvider, $locationProvider) {
			$routeProvider
				.when('/b:id', {
					templateUrl: '../BBU/bugDetail.html',
					controller: 'BugDetail'
				})
				.when('/s:sid/p:pid', {
					templateUrl: '../BBU/bugList.html',
					controller: 'ListCtrl'
				})
				.otherwise({
					redirectTo: '/s1/p1'
				});
		}
	])

})(window);