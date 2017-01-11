(function() {
    'use strict';
    angular.module("narrowItDownApp", [])
        .controller("narrowItDownController", narrowItDownController)
        .service("menuSearchService", menuSearchService)
        .directive("foundItemsDirective", foundItemsDirective);

    narrowItDownController.$inject = ['menuSearchService'];
    menuSearchService.$inject = ['$http'];

    function foundItemsDirective() {
        var ddo = {
            template: '<div ng-if="list.menuItems.length != 0">' +
                            '<table>'+
                                '<tr>'+
                                    '<td>Item Name</td>'+
                                    '<td>Item ShortName</td>'+
                                    '<td>Item Description</td>'+
                                '</tr>'+
                                '<tr ng-repeat="item in list.menuItems">'+
                                    '<td>{{item.name}}</td>'+
                                    '<td>{{item.short_name}}</td>'+
                                    '<td>{{item.description}}</td>'+
                                    '<td><button ng-click="list.onRemove({index:$index})">'+ 'Dont want this one!</button>'+
                                '</tr>'+
                            '</table>'+
                        '</div>',
            restrict: "E",
            scope: {
                list: '=foundItems',
                onRemove: '&'
            }
        };
        return ddo;
    };

    function narrowItDownController(menuSearchService) {
        var list = this;
        list.menuItems = [];
        list.search = function(searchItem) {
            list.menuItems = [];
            if (searchItem == undefined || searchItem == "") {
                list.isEmpty = true;
                list.msg = "Please Enter Value first!!";
            } else {
                list.isEmpty = false;
                var promise = menuSearchService.getMatchedMenuItems(searchItem);
                promise.then(function success(response) {
                    var allMenuItems = response.data.menu_items;
                    var filterItems = [];
                    for (var i = 0; i < allMenuItems.length; i++) {
                        var item = allMenuItems[i].name.toLowerCase();
                        if (item.indexOf(searchItem.toLowerCase()) != -1) {
                            filterItems.push(allMenuItems[i]);
                        }
                    }
                    list.menuItems = filterItems;
                    if (list.menuItems.length == 0) {
                        list.isEmpty = true;
                        list.msg = "Nothing Found!";
                    }
                });
            }

        };
        list.onRemove = function(index) {
            list.menuItems.splice(index, 1);
        };

    };

    function menuSearchService($http) {
        var service = this;
        service.getMatchedMenuItems = function(searchItem) {
            var menu_items = $http({
                method: 'GET',
                url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
            });
            return menu_items;
        };
    };

})();