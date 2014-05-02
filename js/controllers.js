'use strict';

/* Controllers */

var sigmaApp = angular.module('sigmaApp', ['infinite-scroll']);

sigmaApp.controller('EmailListCtrl', function($scope) {
  $scope.focusedCategory = "";

  $scope.focusCategory = function(categoryId) {
  	console.log($scope.focusedCategory, categoryId);
  	$scope.focusedCategory = $scope.focusedCategory != categoryId ? categoryId : "";
  }

  $scope.emails = [
    {'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 1,
	 'read': 'read',
	 'sigma': ''},
    {'from': 'Gandalf the Grey',
     'subject': 'About this adventure I mentioned...',
 	 'message': 'Dearest Bilbo, I truly think that you should reconsider your decision to pass up on this mission.',
 	 'category': 2,
	 'read': '',
	 'sigma': 'images/sigma.png'},
    {'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 1,
	 'read': 'read',
	 'sigma': 'images/sigma.png'},
	 {'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 1,
	 'read': 'read',
	 'sigma': 'images/sigma.png'},
	 {'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 1,
	 'read': 'read',
	 'sigma': 'images/sigma.png'},
	 {'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 1,
	 'read': 'read',
	 'sigma': 'images/sigma.png'},
	 {'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 1,
	 'read': 'read',
	 'sigma': 'images/sigma.png'},
	 {'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 1,
	 'read': 'read',
	 'sigma': 'images/sigma.png'},
	 {'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 1,
	 'read': 'read',
	 'sigma': 'images/sigma.png'},
	 {'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 1,
	 'read': 'read',
	 'sigma': 'images/sigma.png'},
 	{'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 3,
	 'read': '',
	 'sigma': ''},
 	{'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 4,
	 'read': 'read',
	 'sigma': ''},
 	{'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 6,
	 'read': 'read',
	 'sigma': ''},
 	{'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 6,
	 'read': 'read',
	 'sigma': 'images/sigma.png'},
 	{'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 5,
	 'read': 'read',
	 'sigma': 'images/sigma.png'},
 	{'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 4,
	 'read': 'read',
	 'sigma': ''}
  ];

  $scope.categories = [
  	{'id' : 1,
  	 'name' : 'Uncategorized',
  	 'color' : '#808080',
  	 'class' : 'category-uncategorized'},
  	{'id' : 2,
  	 'name' : 'ASAP',
  	 'color' : '#1b6aa3;',
  	 'class' : 'category-asap'},
  	{'id' : 3,
  	 'name' : 'School',
  	 'color' : '#84cbc5;',
  	 'class' : 'category-school'},
  	{'id' : 4,
  	 'name' : 'Work',
  	 'color' : '#f8d35e',
  	 'class' : 'category-work'},
  	{'id' : 5,
  	 'name' : 'Later',
  	 'color' : '#f47264',
  	 'class' : 'category-later'}
  ]
});