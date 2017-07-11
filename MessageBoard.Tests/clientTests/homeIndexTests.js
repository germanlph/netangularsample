/// <reference path="../scripts/jasmine.js" />
/// <reference path="../../messageboard/scripts/angular.js" />
/// <reference path="../../messageboard/js/home-index.js" />
/// <reference path="../../messageboard/scripts/angular-mocks.js" />
/// <reference path="../../messageboard/scripts/angular-route.js" />

describe("home-index Tests->", function () {

	beforeEach(function () {
		module("homeIndex");
	});

	var $httpBackend;

	beforeEach(inject(function ($injector) {
		$httpBackend = $injector.get('$httpBackend');

		$httpBackend
			.when("GET", "/api/v1/topics?includeReplies=true")
			.respond([{
				title: "test title",
				body: "test body that is a bit longer than the title",
				id: 1,
				created: "2005401"
			}]);
	}));

	afterEach(function () {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	describe("dataService", function () {

		it("can load topics", inject(function (dataService) {

			expect(dataService.topics).toEqual([]);

			$httpBackend.expectGET("/api/v1/topics?includeReplies=true");
			dataService.getTopics();
			$httpBackend.flush();
			expect(dataService.topics.length).toBeGreaterThan(0);
			expect(dataService.topics.length).toEqual(1);

		}));

	});

	describe("topicsController", function () {

		it("loads data", inject(function ($controller, $http, dataService) {

			var theScope = {};

			$httpBackend.expectGET("/api/v1/topics?includeReplies=true");
			
			var ctrl = $controller("topicsController", {
				$scope: theScope,
				$http: $http,
				dataService: dataService
			});

			$httpBackend.flush();

			expect(ctrl).not.toBeNull();
			expect(theScope.data).toBeDefined();

		}));
	});

});