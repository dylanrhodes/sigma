'use strict';

/* Controllers */

var sigmaApp = angular.module('sigmaApp', []);

sigmaApp.controller('EmailListCtrl', function($scope, Emails) {
  $scope.colors = ['#808080', '#1b6aa3', '#84cbc5', '#f8d35e', '#f47264', '#85e491', '#bd80b9', '#f9b588'];
  $scope.categories = [
  	{'id' : 1,
  	 'name' : 'Uncategorized',
  	 'color' : '#808080',
  	 'class' : 'category-uncategorized',
	 'split' : 0,
	 'unread' : 10,
	 'emails' : 3},
  	{'id' : 2,
  	 'name' : 'ASAP',
  	 'color' : '#1b6aa3',
  	 'class' : 'category-asap',
	 'split' : 0,
	 'unread' : 2,
	 'emails' : 10},
  	{'id' : 3,
  	 'name' : 'School',
  	 'color' : '#84cbc5',
  	 'class' : 'category-school',
	 'split' : 1,
	 'unread' : 3,
	 'emails' : 7},
  	{'id' : 4,
  	 'name' : 'Work',
  	 'color' : '#f8d35e',
  	 'class' : 'category-work',
	 'split' : 1,
	 'unread' : 0,
	 'emails' : 7},
  	{'id' : 5,
  	 'name' : 'Later',
  	 'color' : '#f47264',
  	 'class' : 'category-later',
	 'split' : 0,
	 'unread' : 5,
	 'emails' : 4}
  ];
  $scope.emails = new Emails();
  $scope.emails.init();  

  $scope.dummyEmails = [
  		{ subject : "Hey", 
  		read : 0, 
  		date : "2 minutes ago",
  		category : 5,
  		fromEmail : "luke@knepper.com",
  		fromName : "Luke Knepper",
  		snippet : "How's it going?", message : "How's it going?",
  		id : 0 },
  		{ subject : "Hey", 
  		read : 0, 
  		date : "2 minutes ago",
  		category : 2,
  		fromEmail : "luke@knepper.com",
  		fromName : "Luke Knepper",
  		snippet : "How's it going?", message : "How's it going?",
  		id : 1 },
  		{ subject : "Hey", 
  		read : 0, 
  		date : "2 minutes ago",
  		category : 4,
  		fromEmail : "luke@knepper.com",
  		fromName : "Luke Knepper",
  		snippet : "How's it going?", message : "How's it going?",
  		id : 2 },
  		{ subject : "Hey", 
  		read : 1, 
  		date : "2 minutes ago",
  		category : 3,
  		fromEmail : "luke@knepper.com",
  		fromName : "Luke Knepper",
  		snippet : "How's it going?", message : "How's it going?",
  		id : 3 },
  		{ subject : "Hey", 
  		read : 0, 
  		date : "2 minutes ago",
  		category : 2,
  		fromEmail : "luke@knepper.com",
  		fromName : "Luke Knepper",
  		snippet : "How's it going?", message : "How's it going?",
  		id : 4 },
  		{ subject : "Hey", 
  		read : 1, 
  		date : "2 minutes ago",
  		category : 2,
  		fromEmail : "luke@knepper.com",
  		fromName : "Luke Knepper",
  		snippet : "How's it going?", message : "How's it going?",
  		id : 5 },
  		{ subject : "Hey", 
  		read : 0, 
  		date : "2 minutes ago",
  		category : 3,
  		fromEmail : "luke@knepper.com",
  		fromName : "Luke Knepper",
  		snippet : "How's it going?", message : "How's it going?",
  		id : 6 },
  		{ subject : "Hey", 
  		read : 1, 
  		date : "2 minutes ago",
  		category : 2,
  		fromEmail : "luke@knepper.com",
  		fromName : "Luke Knepper",
  		snippet : "How's it going?", message : "How's it going?",
  		id : 7 },
  		{ subject : "Hey", 
  		read : 0, 
  		date : "2 minutes ago",
  		category : 3,
  		fromEmail : "luke@knepper.com",
  		fromName : "Luke Knepper",
  		snippet : "How's it going?", message : "How's it going?",
  		id : 8 },
  		{ subject : "Hey", 
  		read : 0, 
  		date : "2 minutes ago",
  		category : 1,
  		fromEmail : "luke@knepper.com",
  		fromName : "Luke Knepper",
  		snippet : "How's it going?", message : "How's it going?",
  		id : 9 },
  		{ subject : "Hey", 
  		read : 0, 
  		date : "2 minutes ago",
  		category : 4,
  		fromEmail : "luke@knepper.com",
  		fromName : "Luke Knepper",
  		snippet : "How's it going?", message : "How's it going?",
  		id : 10 },
  		{ subject : "Hey", 
  		read : 0, 
  		date : "2 minutes ago",
  		category : 2,
  		fromEmail : "luke@knepper.com",
  		fromName : "Luke Knepper",
  		snippet : "How's it going?", message : "How's it going?",
  		id: 11}]
  
  // ***
  $scope.inboxId = 1;
  $scope.composeId = 2;
  $scope.settingsId = 3;
  $scope.viewingId = 4;
  $scope.showing = $scope.inboxId;
  $scope.viewingEmail = null;

  $scope.focusedCategory = "";
  // $scope.selected = "";
  // $scope.selectedId = -1;
  // $scope.selectedIds = [];
  // $scope.selectedCat = -1;
  $scope.numCat = $scope.categories.length;
  // $scope.oldColor = "";
  $scope.sigma_img_tag = "<img src='images/sigma.png' />";
  // $scope.composingEmail = false;


  $scope.user = { email : "skywalker@sigma.com" }

  $scope.emailsById = {};
  $scope.windowHeight = $(window).height();
  // $scope.boxWidth = null;
  // $scope.catHeaderHeight = function() { return $(".category-header").height() + 11 };
  
  $scope.showingClass = function(showingVar) {
		return showingVar == $scope.showing ? "" : "hidden";
	}

	$scope.settings = function() {
		$scope.showing = $scope.settings;
	}
/*
	$scope.category = function(categoryId) {
		console.log($scope.inboxId);
		$scope.showing = $scope.inboxId;
		console.log($scope.showing);
		$scope.focusedCategory = categoryId;


	}
*/
	$scope.viewing = function(emailId) {
		$scope.showing = $scope.viewingId;
		$scope.viewingEmail = $scope.dummyEmails[emailId];
		console.log($scope.viewingEmail);
	}

	$scope.showingEmail = function(email) {
		var search = $("#search").val();
		var showingSearch = search == "" || email.message.indexOf(search) >= 0 || email.subject.indexOf(search) >= 0
							|| email.fromName.indexOf(search) >= 0 || email.fromEmail.indexOf(search) >= 0;
		var showingCategory = $scope.focusedCategory == "" || $scope.focusedCategory == email.category;
		return showingSearch && showingCategory;
	}

	$scope.init = function() {


		/*
		for (var i = 1; i <= $scope.numCat; i++) {
			$('#cat' + i).attr('class', 'cat-bar');
			$('#num' + i).attr('class', 'num-bar');
			$('#split' + i).attr('class', 'split-check');
			$('#rc' + i).attr('class', 'removecat');
			var color = $('#cat' + i).css('border-color');
			var height = 8 * $('#num' + i).val();
			var split = $('#split' + i).prop("checked");
			if (split) $('#prev' + i).css('width', '35%');
			else $('#prev' + i).css('width', '72%');
			$('#prev' + i).css('height', height + 'px');
			$('#prev' + i).css('border-color', color);
			$('#prev' + i).css('class', 'preview-block');
			$('#prev' + i).attr('class', 'prev');
		}
		for (var i = $scope.numCat + 1; i <= 8; i++) {
			$('#cat' + i).attr('class', 'hidden');
			$('#cat' + i).val("");
			$('#split' + i).attr('class', 'hidden');
			$('#split' + i).prop("checked", false);
			$('#num' + i).attr('class', 'hidden');
			$('#num' + i).val(5);
			$('#prev' + i).attr('class', 'hidden');
			$('#rc' + i).attr('class', 'hidden');
		}
		*/
	}
	
	$scope.AddCat = function() {
		if ($scope.numCat != 8) {
			if ($scope.numCat == 7) $('#addcat').attr('class', 'hidden');
			$scope.numCat++;
			/*
			$('#cat' + $scope.numCat).attr('class', 'cat-bar');
			$('#num' + $scope.numCat).attr('class', 'num-bar');
			$('#split' + $scope.numCat).attr('class', 'split-check');
			$('#rc' + $scope.numCat).attr('class', 'removecat');
			*/
		}
		$scope.init();
	}

	$scope.categoryIsSelected = function(catId) {
		if($scope.viewingEmail && $scope.viewingEmail.category == catId)
			return true;
		var toReturn = false;
		$.map($scope.selectedIds, function(s) {
			$.map($scope.emails.arr, function(e) {
				if(e.id == s && e.category == catId) {
					toReturn = true;
				}
			});
		});
		return toReturn;
	}
	
	$scope.settings = function() {
		$scope.showing = $scope.settingsId;
		/*
		$('.wrapper').attr('class', 'wrapper container-fluid hidden');
		$('.wrapper2').attr('class', 'wrapper2 container-fluid');
		for (var i = 1; i <= $scope.numCat; i++) {
			$('#cat' + i).val($scope.categories[i-1]['name']);
			$('#num' + i).val($scope.categories[i-1]['emails']);
			if ($scope.categories[i-1]['split']) $('#split' + i).prop("checked", true);
			else $('#split' + i).prop("checked", false);
		}
		$scope.init();
		*/
	}

	$scope.compose = function() {
		$scope.showing = $scope.composeId;
		/* $scope.composingEmail = true;
		$scope.viewingEmail = null;
		$scope.	gory = ''; */

		/* can be optionally passed in an email object as the first argument */
		if(arguments.length > 0) {
			// console.log(arguments[0]);
			$("#compose-subject").val("Re: " + arguments[0].subject);
			$("#compose-to").val(arguments[0].from);
			$("#compose-body").val("\n\n---------------------------------\nOn "
				+ arguments[0].true_date + ", " + arguments[0].from
				+ " wrote:\n\n" + arguments[0].message);
		}
	}

	$scope.categoryClick = function(categoryId) {
	  	$scope.initializeFandle();
		$scope.showing = $scope.inboxId;
		$scope.focusedCategory = categoryId;
	}

	$scope.fandleInitialized = false;
	$scope.initializeFandle = function() {
		if($scope.fandleInitialized)
			return;
		$scope.fandleInitialized = true;
		$(".email-fandle").each(
			function() { 
				var emailId = $(this).attr("rel");
				$(this).fandle({ categories : $scope.categories,
					radius : 125,
					innerRadius : 25,
					innerColor : $scope.categories[$scope.dummyEmails[emailId].category - 1].color,
					mode : 'half',
					innerImage : 'sigma-handle.png',
					innerHoverImage : 'sigma-handle-hover.png'
			 	}, (function(tempEmailId) {
			 		return function(selectedId) {
						$scope.dummyEmails[tempEmailId].category = selectedId;
						$scope.$apply();
					}; }) 
			 		(emailId)
				); 
			});
	}

  $scope.focusCategory = function(categoryId) {
  	$scope.viewingEmail = null;
  	$scope.composingEmail = false;
  	if($scope.focusedCategory == categoryId)
  		$scope.focusedCategory = '';
  	else {
	  	$scope.focusedCategory = categoryId;
	  	if(categoryId && categoryId != ''){
	  		$scope.emails.nextByCategory(categoryId);
	  	}
	}
  }
  
  $scope.addMore = function(categoryId) {
	$scope.emails.nextByCategory(categoryId);
  }
  
  $scope.categorize = function(categoryId) {
    if($scope.selectedIds.length == 0) {
    	// nothing selected, categorize current email
    	$scope.viewingEmail.category = categoryId;
    	return;
    }
	if ($scope.selected != "") {
	    //move to next element before categorizing
		var temp = $scope.selected.next();
		while(temp && $scope.selectedIds.indexOf(temp.attr('id')) >= 0)
			temp = temp.next();
		var cl = temp.attr("class");
		
		$.each($scope.selectedIds, function(i, id) {
		  $.map($scope.emails.arr, function(obj, index) {
			if(obj.id == id)
			  obj.category = categoryId;
		  });
		});

		if (typeof cl !== 'undefined' && cl !== false) {
			$scope.selected = temp;
			$scope.selectedIds = [temp.attr('id')];
			var top = temp.position().top - temp.parent().position().top;
			if(top >= temp.parent().height()) {	
				var dif = top - temp.parent().height();
				temp.parent().scrollTop(temp.parent().scrollTop() + temp.height() + dif);
			}
		}		
	}
  }
    
});

sigmaApp.factory('Emails', function($http) {
  var Emails = function() {
    this.arr = [];
    this.busy = false;
    this.after = '';
	this.next = 1;
  };

  Emails.prototype.init = function() {
  
    if (this.busy) return;
    this.busy = true;
    var url = "http://sigma.jmvldz.com/get_emails?callback=JSON_CALLBACK";
    $http.jsonp(url).success(function(data) {
	  console.log("SUCCESS");
	  for (var key in data) {
		if(data.hasOwnProperty(key)) {
			var email = data[key];
			var day = moment(email.date, "ddd, DD MMM YYYY HH:mm:ss ZZ");
			email.date = day.fromNow();
			email.snippet = email.message.substr(0, 200);
			email.id = email.id.toString();
			email.read = 1;
			var from = email.from.replace(/"/g, "");
			var start = from.indexOf("<");
			var end = from.indexOf(">");
			email.fromEmail = from.substring(start + 1, end);
			email.fromName = "";
			if (start != 0) email.fromName = from.substring(0, start-1);
			if (email.subject.indexOf("=?utf-8?Q?") > -1) {
				email.subject = email.subject.substring(10).replace(/=/g,'%');
				if (email.subject.indexOf("?") > -1) email.subject = email.subject.substring(0, email.subject.indexOf("?"));
				email.subject = decodeURIComponent(email.subject);
			}
			if (email.fromName.indexOf("=?utf-8?Q?") > -1) {
				email.fromName = email.fromName.substring(10).replace(/=/g,'%');
				if (email.fromName.indexOf("?") > -1) email.fromName = email.fromName.substring(0, email.fromName.indexOf("?"));
				email.fromName = decodeURIComponent(email.fromName);
			}
			this.arr.unshift(email);
		}
	  }

      this.busy = false;      
    }.bind(this));
  };

  Emails.prototype.nextByCategory = function(category) {
    if (this.busy) return;
    this.busy = true;
    var url = "http://api.reddit.com/hot?after=" + this.after + "&limit=10&jsonp=JSON_CALLBACK";
    $http.jsonp(url).success(function(data) {
      var items = data.data.children;
      for (var i = 0; i < items.length; i++) {
		items[i].data.from = items[i].data.author;
		items[i].data.subject = items[i].data.title;
		items[i].data.message = items[i].data.url;
		var utcSeconds = items[i].data.created_utc;
		var day = moment.unix(utcSeconds);
		items[i].data.date = day.fromNow();
		if (category == 0) items[i].data.category = Math.floor(Math.random() * 6) + 1;
		else items[i].data.category = category;
		items[i].data.read = Math.round(Math.random());
		items[i].data.sigma = Math.round(Math.random());
        this.arr.push(items[i].data);
      }
      this.after = "t3_" + this.arr[this.arr.length - 1].id;
      this.busy = false;
    }.bind(this));
  };

  return Emails;
});
