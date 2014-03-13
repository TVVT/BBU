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
			$scope.pageId = $routeParams.id
			$scope.getBugsFromRemote = function(pageId) {
				$http({
					method: 'POST',
					url: '/getBugsByPageId',
					data: {
						pageId: pageId - 1,
						pageSize: pageSize
					}
				}).success(function(data, status, headers, config) {
					bugService.bugs = data;
				}).error(function(data, status, headers, config) {
					throw "访问数据错误！";
				});
			};
			$scope.getBugs = function() {
				return bugService.getBugs();
			}
			$scope.nextPage = parseInt($scope.pageId)+1;
			$scope.prevPage = parseInt($scope.pageId)-1;
			//初始化数据
			$scope.getBugsFromRemote($scope.pageId);
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
				.when('/p:id', {
					templateUrl: '../BBU/bugList.html',
					controller: 'ListCtrl'
				})
				.otherwise({
					redirectTo: '/p1'
				});
		}
	])
	// $locationProvider.htm

})(window);