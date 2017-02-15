var shnApp = angular.module('shnApp',['ui.router']);

shnApp.config(['$urlRouterProvider', '$locationProvider', function($urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
}]);
