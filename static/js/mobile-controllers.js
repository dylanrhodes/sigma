'use strict';

/* Controllers */

var sigmaApp = angular.module('sigmaApp', ['ngSanitize', 'mgcrea.ngStrap', 'ngTouch']);

sigmaApp.controller('EmailListCtrl', function($scope, $http, Emails) {

  $scope.colors = ['#808080', '#1b6aa3', '#84cbc5', '#f8d35e', '#f47264', '#85e491', '#bd80b9', '#f9b588'];
  var url = "/get_categories?callback=JSON_CALLBACK";
  if (window.location.search != "?home") {
	  $http.jsonp(url).success(function(data) {
		$scope.categories = data;
		console.log("Loaded categories");
		console.log(data);
		for (var i = 0; i < $scope.categories.length; i++) $scope.categories[i]["color"] = $scope.colors[i];
		$scope.emails = new Emails(data);
		$scope.emails.init();
  		$scope.numCat = $scope.categories.length;

  		// console.log($(".menu").height());
  		$(".top-padding").css("padding-top", (($(".menu").height() - 50) / 2) + "px");
  		$(".top-padding").css("padding-bottom", (($(".menu").height() - 50) / 2) + "px");
	  })
	  .error(function() {console.log("Didn't load categories");});
  }
  else {
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
	  $scope.emails = new Emails($scope.categories);
	  $scope.emails.init();
  }

  var content = "";
  for (var i = 0; i < 100; i++) {
	content += "Email<br>";
  }
  
  $scope.aside = {
	  "title": "Category Digest",
	  "content": content
  };

  // $scope.emails = new Emails($scope.categories.length);
  // $scope.emails.init();
  $scope.focusedCategory = "";
  $scope.selected = "";
  $scope.selectedId = -1;
  $scope.selectedIds = [];
  $scope.selectedCat = -1;
  $scope.oldColor = "";
  $scope.sigma_img_tag = "<img src='images/sigma.png' />";
  $scope.composingEmail = false;
  $scope.markUnread = false;

  $scope.inboxId = 1;
  $scope.viewingId = 2;
  $scope.settingsId = 3;
  $scope.composeId = 4;
  $scope.showing = $scope.inboxId;

  $scope.user = { email : "skywalker@sigma.com" }
  $scope.cc = false;

  // $scope.viewingId = -1;

  $scope.emailsById = {};
  $scope.windowHeight = $(window).height();
  $scope.boxWidth = null;

  $scope.showingMenu = true;
  $scope.toggleMenu = function() {
  	$scope.showingMenu = ! $scope.showingMenu;
  }
  // console.log($scope.emails.unread.length);
  // for (var i = 0; i < $scope.emails.unread.length; i++) {
	// var cat = i + 1;
	// console.log("Category: " + cat + " Unread: " + $scope.emails.unread[i]);
	// $scope.categories[i].unread = $scope.emails.unread[i];
  // }
  // $scope.$apply();
  $scope.catHeaderHeight = function() { return $(".category-header").height() + 11 };
  
  $scope.retrain = function() {
	$http({
		method: 'POST',
		url: '/train_models',
	})
	.success(function() {console.log("Successfully trained models");})
	.error(function() {console.log("Didn't successfully train models");});
  }
  
  $scope.logout = function() {
	console.log("Logging out");
  }
  $scope.addCc = function() {
	if (!$scope.cc) {
		$('.cc-button').attr('class', 'hidden');
		$('#compose-cc').attr('class', 'compose-cc');
		$('#compose-bcc').attr('class', 'compose-bcc');
		var height = $('#compose-body').height() - 40;
		$('#compose-body').css('height', height + 'px');
		$scope.cc = true;
	}
  };

  $scope.showingClass = function(showingVar) {
		return showingVar == $scope.showing ? "" : "hidden";
	}

	$scope.read = function(emailId, read) {
		$scope.emails.byId[emailId].read = read;
		$("#" + emailId).find(".fandle-inner-image").attr("href", "/static/images/sigma-handle"+(read == 1 ? "-read" : "" ) +".png");
	}

  $scope.viewing = function(emailId) {
		$scope.showing = $scope.viewingId;
		$scope.viewingEmail = $scope.emails.byId[emailId];
		$scope.read(emailId, 1);

		var elem = {"id" : emailId};
	  $http({
			method: 'POST',
			url: '/mark_as_read',
			data: elem
		})
		.success(function() {console.log("Successfully pushed read change");})
		.error(function() {console.log("Didn't successfully push read change");});

		if (!$scope.viewingEmail.html) {
			$('.viewing-message').html("<div class='no-html-email-view'>" + $scope.viewingEmail.message + "</div>");
		  }
		  else {
			$('.viewing-message').html("<iframe class='email-frame' height='100%' width='100%' frameBorder='0' src='/get_email?id=" + $scope.viewingEmail.id + "' ></iframe>");
			console.log($(".viewing").height());
			console.log($(".viewing-message-top").height());
			//($(".viewing").height() - $(".viewing-message-top").height())
			$('.email-frame').css('height', 300+'px');
		  }
	}

	$scope.showingEmail = function(email) {
		var search = $("#search").val();
		var showingSearch = search == "" || email.message.indexOf(search) >= 0 || email.subject.indexOf(search) >= 0
							|| email.fromName.indexOf(search) >= 0 || email.fromEmail.indexOf(search) >= 0;
		var showingCategory = $scope.focusedCategory == "" || $scope.focusedCategory == email.category;
		return showingSearch && showingCategory;
	}

	$scope.initializedTBLvalues = false;
	$scope.tbl_values = function() {
		return;
		if(!$scope.initializedTBL) {
			$scope.compose_tbl = new $.TextboxList("#compose-to", {unique: true, placeholder : "To", plugins: {autocomplete: {}}});
			$scope.initializedTBL = true;
		}
		if($scope.emails && $scope.emails.contacts && $scope.emails.contacts.length > 0 && !$scope.initializedTBLvalues) {
			// alert($scope.emails.contacts.length);
			$scope.compose_tbl.plugins['autocomplete'].setValues($scope.emails.contacts);
			$scope.initializedTBLvalues = true;
		}
		$(".textboxlist-autocomplete-placeholder").hide();
		$(".textboxlist-autocomplete-results").hide();
		setTimeout('$(".textboxlist-autocomplete").width($(".textboxlist").width());', 150);
	}

	$scope.init = function() {
		console.log("init");



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
	}

	$scope.AddCat = function() {
		if ($scope.numCat != 8) {
			if ($scope.numCat == 7) $('#addcat').attr('class', 'hidden');
			$scope.numCat++;
			$('#cat' + $scope.numCat).attr('class', 'cat-bar');
			$('#num' + $scope.numCat).attr('class', 'num-bar');
			$('#split' + $scope.numCat).attr('class', 'split-check');
			$('#rc' + $scope.numCat).attr('class', 'removecat');
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

	$scope.RemoveCat = function(num) {
		var temp = [];
		for (var j = 0; j < num-1; j++) {
			temp[j] = $scope.categories[j];
		}
		for (var i = num; i < $scope.numCat; i++) {
			temp[i-1] = $scope.categories[i]
		}
		$scope.categories = temp;
		$scope.numCat--;
		$scope.settings();
		$scope.init();
	}

	$scope.save = function() {
		var num = $scope.numCat;
		var copy = $scope.categories;
		var names = [];
		$scope.categories = [];
		for (var i = 1; i <= num; i++) {
			var name = $('#cat' + i).val();
			if (name != "") {
				var emails = $('#num' + i).val();
				var split = 0;
				if ($('#split' + i).prop("checked")) {
					split = 1;
				}
				var unread = Math.floor(Math.random() * 11);
				var temp = {};
				temp['id'] = i;
				temp['name'] = name;
				temp['color'] = $scope.colors[i-1];
				temp['class'] = 'category-' + name;
				temp['split'] = split;
				temp['unread'] = unread;
				temp['emails'] = emails;
				names.push(name);
				$scope.categories.push(temp);
			}
		}
		//need a way to change move items in a deleted category to uncategorized
		$scope.numCat = $scope.categories.length;
		var percentage = 92.5/$scope.numCat;
		$scope.$apply();
		$('.category').css('width', percentage + '%');
		$('.wrapper').attr('class', 'wrapper container-fluid');
		$('.wrapper2').attr('class', 'wrapper2 container-fluid hidden');

		$('.emails-area').on('scroll', function() {
		  var newTop = $(this).scrollTop() + 5;
		  $(this).children(".unread").css({top: newTop, position:'absolute'});
		});
		  /*
		$('.two-box').on('scroll', function() {
			  var newTop = $(this).scrollTop() + 5;
			  $(this).children(".unread").css({top: newTop, position:'absolute'});
		});
*/
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
		//$scope.init();
	}

	$scope.initializedTBL = false
	$scope.compose = function() {
		$scope.showing = $scope.composeId;

		$scope.composingEmail = true;
		$scope.viewingEmail = null;
		$scope.focusedCategory = '';

		/* can be optionally passed in an email object as the first argument */
		if(arguments.length > 0) {
			$("#compose-subject").val("Re: " + arguments[0].subject);
			$("#compose-to").val(arguments[0].fromEmail);
			$("#compose-body").val("\n\n---------------------------------\nOn "
				+ arguments[0].true_date + ", " + arguments[0].from
				+ " wrote:\n\n" + arguments[0].message);
		}

		$scope.tbl_values();
	}

	$scope.categoryClick = function(categoryId) {
	  	$scope.initializeFandle();
		$scope.showing = $scope.inboxId;
		$scope.focusedCategory = categoryId;
	}

	$scope.fandleInitialized = false;
	$scope.initializeFandle = function() {
		$scope.fandleInitialized = true;
		var fanCats = Array();
		$.each($scope.categories, function(i,v) {
			if(v.name != "Uncategorized")
				fanCats.unshift(v);
		});
		$(".email-fandle").each(
			function() { 
				if($(this).hasClass("fandle"))
					return;
				var emailId = $(this).attr("rel");
				
				$(this).fandle({ categories : fanCats,
					radius : 160,
					innerRadius : 25,
					innerColor : ($scope.categories[$scope.emails.byId[emailId].category - 1] ? 
						$scope.categories[$scope.emails.byId[emailId].category - 1].color : $scope.categories[0].color),
					mode : 'half',
					innerImage : ($scope.emails.byId[emailId].read == 1 ? '/static/images/sigma-handle-read.png' : '/static/images/sigma-handle.png'),
					innerHoverImage : '/static/images/sigma-handle-hover.png'
			 	}, (function(tempEmailId) {
			 		return function(selectedId) {
			 			$scope.categorize(tempEmailId, selectedId);
						// $scope.emails.byId[tempEmailId].category = selectedId;
						$scope.$apply();
					}; }) 
			 		(emailId)
				); 
			});
		$scope.tbl_values();

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

  $scope.categorize = function(emailId, categoryId) {
	  var elem = {"id" : emailId, "category" : categoryId};
	  $http({
			method: 'POST',
			url: '/categorize_email',
			data: elem
		})
		.success(function() {console.log("Successfully pushed category change");})
		.error(function() {console.log("Didn't successfully pushed category change");});
	  $scope.emails.byId[emailId].category = categoryId;
  }

  $scope.markRead = function(ru) {
	$scope.markUnread = true;
	if ($scope.selected != "") {
	    //move to next element before categorizing
		var temp = $scope.selected.next();
		while(temp && $scope.selectedIds.indexOf(temp.attr('id')) >= 0)
			temp = temp.next();

		$.each($scope.selectedIds, function(i, id) {
		  $.map($scope.emails.arr, function(obj, index) {
			if(obj.id == id) {
			  if(ru == 1) {
				  var elem = {"id" : id};
				  $http({
						method: 'POST',
						url: '/mark_as_read',
						data: elem
					})
					.success(function() {console.log("Successfully pushed read change");})
					.error(function() {console.log("Didn't successfully push read change");});
				  if (obj.read != 1) $scope.emails.unread[obj.category-1]--;
				  obj.read = 1;

			  }
			  else {
				var elem = {"id" : id};
				  $http({
						method: 'POST',
						url: '/mark_as_unread',
						data: elem
					})
					.success(function() {console.log("Successfully pushed read change");})
					.error(function() {console.log("Didn't successfully push read change");});
				  if (obj.read != 0) $scope.emails.unread[obj.category-1]++;
				  obj.read = 0;
			  }
			 }
		  });
		});
	}
  }


  jQuery(function($) {
	
  });

});

sigmaApp.factory('Emails', function($http) {
  var Emails = function(length) {
    this.arr = [];
    this.byId = {};
	this.unread = [];
    this.busy = false;
    this.after = '';
	this.next = 1;
	this.length = length;
	this.contacts = {};
  };

  Emails.prototype.init = function() {
	for (var i = 0; i < this.length; i++) {
		var cat = i+1;
		var call = "http://sigma.jmvldz.com/get_category_unread?callback=JSON_CALLBACK&category=" + cat;
		$http.jsonp(call).success(function(data) {
            var category = data['category'];
			var num = data['unread'];
			this.unread[category-1] = num;
			console.log("jsonp call returned: " + num);
		}.bind(this))
		.error(function() {console.log("Couldn't get unread for " + cat);});
	}
    if (this.busy) return;
    this.busy = true;
    var url = "http://sigma.jmvldz.com/get_emails?callback=JSON_CALLBACK";
    var contactsCount = 0;
    $http.jsonp(url).success(function(data) {
	  console.log("SUCCESS");
	  for (var key in data) {
		if(data.hasOwnProperty(key)) {
			var email = data[key];
			email.millis = (new Date(email.date)).getTime();
			var day = moment(email.date, "ddd, DD MMM YYYY HH:mm:ss ZZ");
			email.true_date = day.format('MMMM DD YYYY, h:mm:ssa');
			
			email.date = day.fromNow();
			email.snippet = email.message.substr(0, 200);			
			
			email.id = email.id.toString();
			var from = email.from.replace(/"/g, "");
			var start = from.indexOf("<");
			var end = from.indexOf(">");
			if (start >= 0) {
				email.fromEmail = from.substring(start + 1, end);
				email.fromName = "";
				if (start != 0) email.fromName = from.substring(0, start-1);
			}
			else {
				email.fromName = "";
				email.fromEmail = from;
			}
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
			if (email.message.toLowerCase().indexOf("<style") >= 0) {
				email.noHtml = email.message.substring(0, email.message.toLowerCase().indexOf("<style")) + email.message.substring(email.message.toLowerCase().indexOf("/style>") + 7);
				email.noHtml = email.noHtml.replace(/<(?:.|\n)*?>/gm, '');
			}
			else {
				email.noHtml = email.message.replace(/<(?:.|\n)*?>/gm, '');
			}
			if (email.message == email.noHtml) email.html = false;
			else {
				email.html = true;
				email.noHtml = email.noHtml.replace(/(\r\n|\n|\r)/gm,"");
				email.noHtml = email.noHtml.replace(/<(?:.|\n)*?>/gm, '');
				email.snippet = email.noHtml.substr(0, 200);
			}
			if (!email.html) email.message = Autolinker.link(email.message, { truncate: 50 });
			if (email.html) email.message = email.message.replace("* {", "message-body {");
			
			if(! this.contacts[email.fromEmail] && contactsCount < 20) {
				this.contacts[email.fromEmail] = [this.contacts.length, 
										email.fromName + " " + email.fromEmail]; /*, 
										email.fromName != "" ? email.fromName : email.fromEmail,
										email.fromName + " <em>" + email.fromEmail + "</em>"]; */
				contactsCount ++;
			}
			var to = email.to.replace(/"/g, "");
			var start = to.indexOf("<");
			var end = to.indexOf(">");
			email.toEmail = to.substring(start + 1, end);
			email.toName = "";
			if (start != 0) email.toName = to.substring(0, start-1);
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
			var noHtml = email.message.replace(/<(?:.|\n)*?>/gm, '');
			if (email.message == noHtml) email.html = false;
			else email.html = true;
			if (!email.html) email.message = Autolinker.link(email.message, { truncate: 50 });
			this.arr.unshift(email);
			this.byId[email.id] = email;
		}
	  }
	  var c = [];
	  $.each(this.contacts, function(i,v) {
	  	v[0] = c.length;
	  	c.push(v);
	  });
	  console.log(c);
	  this.contacts = c;
      this.busy = false;
    }.bind(this));
  };

  Emails.prototype.nextByCategory = function(category) {
	console.log("10 emails supposed to be added");
    /* if (this.busy) return;
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
    }.bind(this)); */
  };

  return Emails;
})

.config(function($asideProvider) {
  angular.extend($asideProvider.defaults, {
    container: 'body',
    html: true
  });
});
