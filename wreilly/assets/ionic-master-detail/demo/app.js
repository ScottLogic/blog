var app = angular.module('masterDetailDemo', ['ionic']);

app.directive('masterDetail', function () {
    return {
        restrict: 'E',
        template: '<div ng-transclude />',
        transclude: true,
        controller: [function () {
        }]
    };
});

app.directive('masterView', function () {
    return {
        restrict: 'E',
        require: '^masterDetail',
        template: '<div class="master" ui-view="{{name}}" />',
        scope: {
            name: '@'
        }
    }
});

app.directive('detailView', function () {
    var elements = [];
    var idCounter = 0;

    function updateDetail(id) {
        var elem = $(elements[id]);

        setTimeout(function () {
            if (elem.find('.detail:not(.ng-leave) .dummy').length) {
                elem.addClass('hide-detail');
            } else {
                elem.removeClass('hide-detail');
            }
            elem.find('.detail').each(function (view) {
                view = $(view);
                if (view.find('.dummy').length) {
                    view.addClass('dummy-detail');
                }
            })
        });
    }

    return {
        restrict: 'E',
        require: '^masterDetail',
        template: '<div class="detail" ui-view="{{name}}" />',
        scope: {
            name: '@',
            id: '&' // TODO: This should be private
        },
        link: function (scope, element) {
            scope.id = idCounter++;
            elements[scope.id] = element;
            element.addClass('detail-container');
            updateDetail(scope.id);
        },
        controller: ['$rootScope', '$scope', function ($rootScope, $scope) {
            $rootScope.$on('$stateChangeSuccess', function () {
                updateDetail($scope.id);
            });
        }]
    }
});

app.provider('masterDetailState', ['$stateProvider', function ($stateProvider) {
    this.masterState = function (name, options) {
        var views = {};
        views[options.view] = { templateUrl: 'master-detail-default.html' };
        views['master@' + name] = { templateUrl: options.templateUrl, controller: options.controller };
        views['detail@' + name] = { templateUrl: 'detail-dummy.html' };
        $stateProvider.state(name, {
            url: options.url,
            views: views,
            data: options.data
        });
        return this;
    };

    this.detailState = function (name, options) {
        $stateProvider.state(name, {
            url: options.url,
            views: {
                'detail': {
                    templateUrl: options.templateUrl,
                    controller: options.controller
                }
            },
            data: options.data
        });
        return this;
    }

    this.$get = function () {
        var callbacks = [];
        var wasSplitView = null;

        function isSplitView() {
            return $(window).width() >= 600;
        }

        function registerCallback(callback) {
            if (callbacks.length === 0) {
                setupResizeHandler();
            }
            callbacks.push(callback);
        }

        function setupResizeHandler() {
            $(window).resize(onResize);
        }

        function onResize() {
            var newValue = isSplitView();
            if (newValue !== wasSplitView) {
                angular.forEach(callbacks, function (callback) {
                    callback(newValue);
                });
            }
            wasSplitView = newValue;
        }

        return {
            isSplitView: isSplitView,
            onIsSplitViewChanged: registerCallback
        }
    }
}]);

app.controller('MasterCtrl', ['$rootScope', '$state', '$scope', 'masterDetailState', function ($rootScope, $state, $scope, masterDetailState) {
    this.setupMasterDetail = function (config) {
        config.getId = config.getId || function (item) { return item.id; }

        $scope.doRefresh = refresh;

        $rootScope.$on('$stateChangeSuccess', update);
        masterDetailState.onIsSplitViewChanged(update);
        loadData();

        function goToDefaultDetail() {
            var details = config.details.filter(function (detail) { return detail.array().length; });
            if (details.length) {
                // TODO: Can get Stuck
                console.log("go to default", details);
                $state.go(details[0].name, { id: config.getId(details[0].array()[0]) });
            }
            return !!details.length;
        }

        function updateSelection(id) {
            id = parseInt(id, 10);
            config.details.forEach(function (detail) {
                detail.array().forEach(function (item) {
                    item.selected = id !== null && config.getId(item) == id;
                })
            });
        }

        function update() {
            var isSplit = masterDetailState.isSplitView();
            var isMaster = $state.is(config.master);
            if (isSplit && isMaster) {
                var redirected = goToDefaultDetail();
                if (redirected) return;
            }
            showHideBackButton(isSplit, isMaster);

            var isDetail = config.details.reduce(function (acc, detail) { return acc || $state.is(detail.name); }, false);
            var selectedItem = updateSelection(isDetail ? $state.params.id : null);
        }

        function loadData(noCache) {
            return config.loadData().then(update);
        }

        function refresh() {
            loadData(true).then(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        function showHideBackButton(isSplit, isMaster) {
            var back = $('.back-button');
            if (isSplit || isMaster) {
                back.hide();
            } else {
                back.show();
            }
        }
    };
}]);


// TODO: $stateProvider not needed?
app.config(function (masterDetailStateProvider, $urlRouterProvider, $stateProvider) {
    masterDetailStateProvider
        .masterState('demo', {
            url: '/',
            view: 'test',
            templateUrl: 'master-template.html',
            controller: 'mastercontroller'
        })
        .detailState('demo.detail', {
            url: ':id',
            templateUrl: 'detail-template.html',
            controller: 'detailcontroller'
        });
    $urlRouterProvider
        .otherwise(function () {
            return "/";
        });
});

app.service('demoItemsService', function ($q) {
    var items = [
        { id: 0, title: 'Item 1', description: 'This is Item 1 description' },
        { id: 1, title: 'Item 2', description: 'This is Item 2 description' },
        { id: 2, title: 'Item 3', description: 'This is Item 3 description' },
        { id: 3, title: 'Item 4', description: 'This is Item 4 description' },
    ];

    this.getItems = function () {
        return $q.when(items);
    };

    this.getItem = function (id) {
        var item = null;
        for (var i = 0; i < items.length; i++) {
            if (items[i].id === id) {
                item = items[i];
                break;
            }
        }
        return $q.when(item);
    }
});

app.controller('mastercontroller', function ($scope, demoItemsService, $controller) {
    $scope.items = [];

    $controller('MasterCtrl', { $scope: $scope }).setupMasterDetail({
        master: 'demo',
        details: [
            { name: 'demo.detail', array: function () { return $scope.items; } }
        ],
        loadData: loadData
    });

    function loadData(refresh) {
        return demoItemsService.getItems().then(function (results) {
            $scope.items = results;
        })
    }
});

app.controller('detailcontroller', function ($stateParams, demoItemsService, $scope) {
    var id = parseInt($stateParams.id, 10);

    $scope.item = null;

    loadData();

    function loadData() {
        demoItemsService.getItem(id).then(function (results) {
            $scope.item = results;
        });
    }
});
