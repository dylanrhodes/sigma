'use strict';

/* Controllers */

var sigmaApp = angular.module('sigmaApp', []);

sigmaApp.controller('EmailListCtrl', function($scope) {
  $scope.emails = [
    {'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!'},
    {'from': 'Gandalf the Grey',
     'subject': 'About this adventure I mentioned...',
 	 'message': 'Dearest Bilbo, I truly think that you should reconsider your decision to pass up on this mission.'},
    {'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!'},
  ];
});
