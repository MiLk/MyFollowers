function StatsCtrl($scope, $http) {
  $scope.screen_name = null;
  $scope.stats = [];
  $scope.users = [];
  $scope.display = [];
  $scope.predicate = 'created_at';
  $scope.reverse = true;

  $scope.getStats = function() {
    $http({
      method: 'GET',
      url: '/stats/' + $scope.screen_name
    }).
      success(function(data) {
        $scope.stats = data.results;
        $scope.users = data.users;
      }).
      error(function(data) {
        console.error(data);
      });
  };

  $scope.show = function(arr,idx) {
    if(!$scope.display[arr]) $scope.display[arr] = [];
    $scope.display[arr][idx] = true;
  };

  $scope.hide = function(arr,idx) {
    if(!$scope.display[arr]) $scope.display[arr] = [];
    $scope.display[arr][idx] = false;
  };
};
