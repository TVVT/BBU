;
(function(window) {

	//初始化应用
	var BBU = angular.module("BBU", []);
	var pageSize = 10;

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
			$scope.getBugsFromRemote = function(pageId,sid) {
				$http({
					method: 'POST',
					url: '/getBugsByPageId',
					data: {
						pageId: pageId - 1,
						pageSize: pageSize,
						statusId: sid
					}
				}).success(function(data, status, headers, config) {
					for(var i = 0;i<data.length;i++){
						data[i].ctime = new Date(parseInt(data[i].ctime) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
						switch(data[i].status){
							case 1:data[i].status = "未处理";break;
							case 2:data[i].status = "正在处理";break;
							case 3:data[i].status = "已处理";break;
							default:data[i].status = "未处理";break;
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
			$scope.nextPage = 's'+$scope.statusId+'/p'+(parseInt($scope.pageId)+1);
			$scope.prevPage = 's'+$scope.statusId+'/p'+(parseInt($scope.pageId)-1);
			//初始化数据
			$scope.getBugsFromRemote($scope.pageId,$scope.statusId);
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
					data[0].ctime = new Date(parseInt(data[0].ctime) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
					switch(data[0].status){
							case 1:data[0].status = "未处理";break;
							case 2:data[0].status = "正在处理";break;
							case 3:data[0].status = "已处理";break;
							default:data[0].status = "未处理";break;
						}
					bugService.bug = data[0];
				}).error(function(data, status, headers, config) {
					throw "访问数据错误！";
				});
			}
			$scope.$watch('bugService.getBug()', function(newData,oldData) {
				if (oldData !== newData) {
					$scope.bug = newData;
				};
			});
			$scope.getBugById(bugId);
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
				.when('/s:sid/p:pid',{
					templateUrl: '../BBU/bugList.html',
					controller: 'ListCtrl'
				})
				.otherwise({
					redirectTo: '/s1/p1'
				});
		}
	])
	// $locationProvider.htm

})(window);