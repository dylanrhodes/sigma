'use strict';

/* Controllers */

var sigmaApp = angular.module('sigmaApp', ['infinite-scroll']);

sigmaApp.controller('EmailListCtrl', function($scope, Reddit) {
  $scope.reddit = new Reddit();
  $scope.reddit.nextPage(0);
  $scope.focusedCategory = "";
  $scope.sigma_img_tag = "<img src='images/sigma.png' />";

  $scope.focusCategory = function(categoryId) {
  	console.log($scope.focusedCategory, categoryId);
  	$scope.focusedCategory = $scope.focusedCategory != categoryId ? categoryId : "";
  }

  $scope.emails = [
    {'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 1,
	 'read': 1,
	 'sigma': 0},
    {'from': 'Gandalf the Grey',
     'subject': 'About this adventure I mentioned...',
 	 'message': 'Dearest Bilbo, I truly think that you should reconsider your decision to pass up on this mission.',
 	 'category': 2,
	 'read': 0,
	 'sigma': 1},
    {'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 1,
	 'read': 1,
	 'sigma': 1},
	 {'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 1,
	 'read': 1,
	 'sigma': 1},
	 {'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 1,
	 'read': 1,
	 'sigma': 1},
	 {'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 1,
	 'read': 1,
	 'sigma': 1},
	 {'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 1,
	 'read': 1,
	 'sigma': 1},
	 {'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 1,
	 'read': 1,
	 'sigma': 1},
	 {'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 1,
	 'read': 1,
	 'sigma': 1},
	 {'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 1,
	 'read': 1,
	 'sigma': 1},
 	{'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 3,
	 'read': 0,
	 'sigma': 0},
 	{'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 4,
	 'read': 1,
	 'sigma': 0},
 	{'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 6,
	 'read': 1,
	 'sigma': 0},
 	{'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 6,
	 'read': 1,
	 'sigma': 1},
 	{'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 5,
	 'read': 1,
	 'sigma': 1},
 	{'from': 'Pippen Took',
     'subject': 'New brews at the Green Dragon',
 	 'message': 'Hop-goblin 120: This fresh IPA will have you beggin\' for more. Grab a pint soon!',
 	 'category': 4,
	 'read': 1,
	 'sigma': 0}
  ];

  $scope.categories = [
  	{'id' : 1,
  	 'name' : 'Uncategorized',
  	 'color' : '#808080',
  	 'class' : 'category-uncategorized',
	 'split' : 1},
  	{'id' : 2,
  	 'name' : 'ASAP',
  	 'color' : '#1b6aa3;',
  	 'class' : 'category-asap',
	 'split' : 1},
  	{'id' : 3,
  	 'name' : 'School',
  	 'color' : '#84cbc5;',
  	 'class' : 'category-school',
	 'split' : 0},
  	{'id' : 4,
  	 'name' : 'Work',
  	 'color' : '#f8d35e',
  	 'class' : 'category-work',
	 'split' : 0},
  	{'id' : 5,
  	 'name' : 'Later',
  	 'color' : '#f47264',
  	 'class' : 'category-later',
	 'split' : 0}
  ]
});

sigmaApp.factory('Reddit', function($http) {
  var Reddit = function() {
    this.items = [];
    this.busy = false;
    this.after = '';
  };

  Reddit.prototype.nextPage = function(category) {
    if (this.busy) return;
    this.busy = true;

    var url = "http://api.reddit.com/hot?after=" + this.after + "&jsonp=JSON_CALLBACK";
    $http.jsonp(url).success(function(data) {
      var items = data.data.children;
      for (var i = 0; i < items.length; i++) {
		items[i].data.from = items[i].data.author;
		items[i].data.subject = items[i].data.title;
		items[i].data.message = items[i].data.url;
		if (category == 0) items[i].data.category = Math.floor(Math.random() * 6) + 1;
		else items[i].data.category = category;
		items[i].data.read = Math.round(Math.random());
		items[i].data.sigma = Math.round(Math.random());
        this.items.push(items[i].data);
      }
      this.after = "t3_" + this.items[this.items.length - 1].id;
      this.busy = false;
    }.bind(this));
  };

  return Reddit;
});
