;
(function(window) {

	//初始化应用
	var BBU = angular.module("BBU", []);
	var pageSize = 10;

	//数据的单例 以后会放到service目录里 类似于model的作用
	BBU.service('bugService', ['$http',  function($http) {
		var service = {
			bugs: [],
			addBug: function(bug) {
				service.bugs.push(bug);
			},
			removeBugById: function(bug) {

			},
			initBugs: function(data) {
				service.bugs = data;
			},
			getBugsFromRemote: function(pageId) {
				$http({
					method: 'POST',
					url: '/getBugsByPageId',
					data:{
						pageId:pageId-1,
						pageSize:pageSize
						}
				}).success(function(data, status, headers, config) {
					service.bugs = data;
					return service.bugs;
				}).error(function(data, status, headers, config) {
					throw "访问数据错误！";
				});
			},
			getBugs:function(){
				return service.bugs;
			}
		};
		return service;
	}]);

	//bugs list controller
	BBU.controller('ListCtrl', ['$scope','bugService',
		function ListCtrl($scope,bugService) {
			$scope.bugService = bugService;
			$scope.getBugsFromRemote = function(pageId) {
				return bugService.getBugsFromRemote(pageId);
			};
			//初始化BBU list 访问API
			$scope.getBugs = function() {
				return bugService.getBugs();
			}
			//初始化数据
			$scope.getBugsFromRemote(1);
		}
	])


})(window);