angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  }
})

.controller ('GroupsCtrl', function($scope, $http, Groups, Debug) {

  $http({

        method: "GET",
        url: Debug.getURL("/groups"),
        responseType: "json"
      }).then(function successCallback(response) {

        console.log(Debug.getURL("/groups"));
        console.log(response);
        groups = response.data;
        console.log(groups);

        Groups.set(groups);
        $scope.groups = groups;
    
      }, function errorCallback(response) {

        console.log(Debug.getURL("/groups"));
        console.log(response);

        alert("Failed to load groups, please try again.");

        return null;

      });


  $scope.groups = Groups.all();
})

.controller('AddGroupCtrl', function($scope, $state, $http, Debug) {
    $scope.search = '';
    $scope.orderByAttribute = '';
    $scope.members = [
    {"_username":"henrysdev","_email":"henrysdev@gmail.com","done":false,"remove":false}
    ];
    $scope.addMember = function()
    {
      console.log("Clicked");
      console.log("username: ", this._username, "email: ", this._email);
      if(this._username !=' ' && this._email !=' ')
      {
        $scope.members.push({'_username':this._username,'_email':this._email,'done':false, 'remove':false});
        this._username = ' ';
        this._email = ' ';
      }
    }
    
    $scope.removeItem = function(index)
    {
      $scope.members.splice(index,1);
      console.log("delete member");
      $scope.members = $scope.members.filter(function(item)
      {
        return !item.done;
      })
    }
    

  $scope.addGroup = function() {

    var group = {
      groupName: $scope.groupName,
      description: $scope.groupDesc
    }

    $http({
      method:"POST",
      url: Debug.getURL("/groups"),
      data: group
    }).then(function successCallback(response) {
      $state.go("groups");
    }, function errorCallback(response) {
      alert.log("Failed to add group");
    });
  }
  

});
