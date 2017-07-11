//home-index.js
angular.module('homeIndex', ['ngRoute'])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('');
        $routeProvider.when("/", {
            controller: "topicsController",
            templateUrl: "/templates/topicsView.html"
        });

        $routeProvider.when("/newmessage", {
            controller: "newTopicController",
            templateUrl: "/templates/newTopicView.html"
        })

        $routeProvider.when("/message/:id", {
            controller: "singleTopicController",
            templateUrl: "/templates/singleTopicView.html"
        })

        $routeProvider.otherwise({ redirectTo: "/" });
    }])
    .factory('dataService', ['$http', '$q', function ($http, $q) {

        var _topics = [];

        var _isInit = false;

        var _isReady = function () {
            return _isInit;
        }

        var _getTopics = function () {

            var deferred = $q.defer();

            $http.get('/api/v1/topics?includeReplies=true')
                .then(function (result) {
                    angular.copy(result.data, _topics);
                    _isInit = true;
                    deferred.resolve();
                })
                .catch(function (error) {
                    console.log(error);
                    deferred.reject(error);
                })

            return deferred.promise;
        };

        var _addTopic = function (newTopic) {

            var deferred = $q.defer();

            $http.post('/api/v1/topics', newTopic)
                .then(function (response) {
                    var createdTopic = response.data;

                    _topics.splice(0, 0, createdTopic);
                    return deferred.resolve(createdTopic);
                })
                .catch(function (error) {
                    console.log(error);
                    return deferred.reject(error);
                })

            return deferred.promise;
        }

        var _getTopicById = function (id) {

            var deferred = $q.defer();

            if (_isReady()) {
                var topic = _findTopic(id);
                if (topic) {
                    deferred.resolve(topic);
                } else {
                    deferred.reject();
                }
            } else {
                _getTopics().then(function () {
                    var topic = _findTopic(id);
                    if (topic) {
                        deferred.resolve(topic);
                    } else {
                        deferred.reject();
                    }
                }).catch(function () {
                    deferred.reject();
                })
            }

            return deferred.promise;
        }

        function _findTopic(id) {
            var topic = null;

            for (var i = _topics.length - 1; i >= 0; i--) {

                if (_topics[i].id == id) {
                    topic = _topics[i];
                    break;
                }
            }

            return topic;
        }

        var _saveReply = function (topic, newReply) {

            var deferred = $q.defer();

            $http.post('/api/v1/topics/' + topic.id + '/replies', newReply)
                .then(function (result) {

                    if (topic.replies == null) {
                        topic.replies = [];
                    }

                    topic.replies.push(result.data);
                    deferred.resolve(result.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        return {
            topics: _topics,
            getTopics: _getTopics,
            addTopic: _addTopic,
            isReady: _isReady,
            getTopicById: _getTopicById,
            saveReply: _saveReply
        };
    }])
    .controller('topicsController', ['$scope', '$http', 'dataService', function ($scope, $http, dataService) {

        $scope.data = dataService;

        if (!dataService.isReady()) {
            $scope.isBusy = true;
            dataService.getTopics()
                .then(function () { })
                .catch(function (error) {
                    console.log(error);
                    alert("Something went wrong");
                })
                .finally(function () {
                    $scope.isBusy = false;
                })
        }

    }])
    .controller('newTopicController', ['$scope', '$http', '$window', 'dataService', function ($scope, $http, $window, dataService) {

        $scope.newTopoic = {};

        $scope.save = function () {

            dataService.addTopic($scope.newTopic)
                .then(function (response) {
                    $window.location = '#/';
                }).catch(function (error) {
                    console.log(error);
                    alert("Something went wrong saving the topic");
                }).finally(function () { })

        };

    }])
    .controller('singleTopicController', ['$scope', 'dataService', '$window', '$routeParams', function ($scope, dataService, $window, $routeParams) {

        $scope.topic = null;
        $scope.newReply = {};

        dataService.getTopicById($routeParams.id)
            .then(function (topic) {
                $scope.topic = topic;
            })
            .catch(function (error) {
                $window.location = "#/";
            })

        $scope.addReply = function () {
            dataService.saveReply($scope.topic, $scope.newReply)
                .then(function () {
                    $scope.newReply.body = '';
                })
                .catch(function (error) {
                    console.log(error);
                    alert("Something went wrong");
                })
        };

    }])