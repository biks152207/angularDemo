(function() {
    'use strict';

    /* Constructor function for controller */

    var Controller = function($mdToast, $scope, Message, httpService) {
        var main = this;
        this.toast = $mdToast;
        main.itemContainer = [];
        main.editRemoveIndex = null;
        main.title = 'Angularjs Device Manger :)';
        main.getData = getData.bind(main);
        /* Initailzation */
        main.getData();

        /* Check duplicate item from the list before we add */
        main.duplicateCheck = function(currentItem){
            var arr = _.filter(main.itemContainer, function(item) {
                return item.title.toLowerCase() == currentItem.toLowerCase();
            });
            if (arr.length != 0) {
                $mdToast.show({
                    template: '<md-toast class="md-toast">' + Message.unique + '</md-toast>',
                    hideDelay: 500,
                    position: 'top right'
                });
                return false;
            }
            return true;
        }

        /* Get data from httpService */

        function getData(){
          httpService.fetchData()
            .then(function(result){
              console.log(result.data);
              main.itemContainer = result.data;
              // console.log(main.con)
            })
        }

        $scope.$watch('main.item', function(newValue, oldValue) {
            if (newValue != oldValue) {
                main.duplicateCheck(newValue);
            }

        });

        main.edit = function(index, newItem){
          main.originalItem = angular.copy(newItem);
          main.editRemoveIndex = index;

        };

        main.save = function(index, newItem){
           main.itemContainer[index] = newItem
           main.editRemoveIndex = null;
        };

        main.remove = function(index){
            main.itemContainer.splice(index,1);
            this.showToast("Successfully removed.");
        };

        main.addToList = function(item) {
            if (item) {
                var isExist = this.checkDuplicate(item);
                if (isExist.length != 0) {
                    this.showToast(Message.unique)
                    return;
                }
                main.itemContainer.push({title: item});

            } else {

                this.showToast(Message.require);
                main.title = null;
            }
        }

    };

    Controller.prototype.showToast = function(msg) {
        this.toast.show({
            template: '<md-toast class="md-toast">' + msg + '</md-toast>',
            hideDelay: 500,
            position: 'top right'
        });
        return;
    }

    Controller.prototype.checkDuplicate = function(currentItem) {
        var arr = _.filter(this.itemContainer, function(item) {
            return item.title.toLowerCase() == currentItem.toLowerCase();
        });
        return arr;
    }

    /* Toast controller contructor */

    var Toast = function() {
        var toast = this;
    };

    angular.module('mainControllerModule', [])
        .controller('MainCtrl', [
            '$mdToast',
            '$scope',
            'Message',
            'httpService',
            Controller
        ])
        .controller('ToastCtrl', [
            Toast
        ])


})();
