function StatsCtrl($scope, $http) {
  $scope.screen_name = null;
  $scope.stats = [];

  $scope.getStats = function() {
    $http({
      method: 'GET',
      url: '/stats/' + $scope.screen_name
    }).
      success(function(data) {
        $scope.stats = data.results;
      }).
      error(function(data) {
        console.error(data);
      });
  };
};
