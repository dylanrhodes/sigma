'use strict';

/* Controllers */

var sigmaApp = angular.module('sigmaApp', []);

sigmaApp.controller('EmailListCtrl', function($scope) {
  $scope.emails = [
    {'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 1},
    {'from': 'Gandalf the Grey',
     'subject': 'About this adventure I mentioned...',
 	 'message': 'Dearest Bilbo, I truly think that you should reconsider your decision to pass up on this mission.',
 	 'category': 2},
    {'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 1},
 	{'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 3},
 	{'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 4},
 	{'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 0},
 	{'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 0},
 	{'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 5},
 	{'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 4}
  ];

  $scope.categories = [
  	{'id' : 0,
  	 'name' : 'Uncategorized',
  	 'color' : '#424242',
  	 'class' : 'category-uncategorized'},
  	{'id' : 1,
  	 'name' : 'ASAP',
  	 'color' : '#f57364',
  	 'class' : 'category-asap'},
  	{'id' : 2,
  	 'name' : 'School',
  	 'color' : '#84ccc6',
  	 'class' : 'category-school'},
  	{'id' : 3,
  	 'name' : 'Work',
  	 'color' : '#1a6aa3',
  	 'class' : 'category-work'},
  	{'id' : 4,
  	 'name' : 'Later',
  	 'color' : '#89e994',
  	 'class' : 'category-later'}
  ]
});
