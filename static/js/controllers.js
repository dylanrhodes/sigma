'use strict';

/* Controllers */

var sigmaApp = angular.module('sigmaApp', ['ngAnimate', 'ngSanitize', 'mgcrea.ngStrap']);

sigmaApp.controller('EmailListCtrl', function($scope, $http, Emails) {

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
  $scope.aside = {
	  "title": "Title",
	  "content": "Hello Aside<br />This is a multiline message!"
  };

  $scope.emails = new Emails($scope.categories.length);
  $scope.emails.init();
  $scope.focusedCategory = "";
  $scope.selected = "";
  $scope.selectedId = -1;
  $scope.selectedIds = [];
  $scope.selectedCat = -1;
  $scope.numCat = $scope.categories.length;
  $scope.oldColor = "";
  $scope.sigma_img_tag = "<img src='images/sigma.png' />";
  $scope.composingEmail = false;
  $scope.markUnread = false;

  $scope.user = { email : "skywalker@sigma.com" }
  $scope.cc = false;

  // $scope.viewingId = -1;

  $scope.emailsById = {};
  $scope.windowHeight = $(window).height();
  $scope.boxWidth = null;
  // console.log($scope.emails.unread.length);
  // for (var i = 0; i < $scope.emails.unread.length; i++) {
	// var cat = i + 1;
	// console.log("Category: " + cat + " Unread: " + $scope.emails.unread[i]);
	// $scope.categories[i].unread = $scope.emails.unread[i];
  // }
  // $scope.$apply();
  $scope.catHeaderHeight = function() { return $(".category-header").height() + 11 };
  $scope.retrain = function() {
	console.log("Retraining model");
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

	$scope.init = function() {
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

	$scope.settings = function() {
		$('.wrapper').attr('class', 'wrapper container-fluid hidden');
		$('.wrapper2').attr('class', 'wrapper2 container-fluid');
		for (var i = 1; i <= $scope.numCat; i++) {
			$('#cat' + i).val($scope.categories[i-1]['name']);
			$('#num' + i).val($scope.categories[i-1]['emails']);
			if ($scope.categories[i-1]['split']) $('#split' + i).prop("checked", true);
			else $('#split' + i).prop("checked", false);
		}
		$scope.init();
	}

	$scope.compose = function() {
		$scope.composingEmail = true;
		$scope.viewingEmail = null;
		$scope.focusedCategory = '';

		/* can be optionally passed in an email object as the first argument */
		if(arguments.length > 0) {
			// console.log(arguments[0]);
			$("#compose-subject").val("Re: " + arguments[0].subject);
			$("#compose-to").val(arguments[0].fromEmail);
			$("#compose-body").val("\n\n---------------------------------\nOn "
				+ arguments[0].true_date + ", " + arguments[0].from
				+ " wrote:\n\n" + arguments[0].message);
		}
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
			if(obj.id == id) {
			  var elem = {"id" : id, "category" : categoryId};
			  $http({
					method: 'POST',
					url: '/categorize_email',
					data: elem
				})
				.success(function() {console.log("Successfully pushed category change");})
				.error(function() {console.log("Didn't successfully pushed category change");});
			  obj.category = categoryId;
			 }
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
	$(document).ready(function(){
		$(document.body).on('keyup', '.num-bar', function() {
			if (!isNaN($(this).val())) {
				var num = parseInt($(this).val());
				if (num != 0 && !isNaN(num)) {
					$scope.init();
				}
			}
		});
		$(document.body).on('click', '.split-check' ,function(){
			$scope.init();
		});
	});

	$(document).keydown(function(e){
		if (e.keyCode == 82) {
			$scope.markRead(1);
			$scope.$apply();
		}
		if (e.keyCode == 85) {
			$scope.markRead(0);
			$scope.$apply();
		}
		if (e.keyCode == 9) {
			e.preventDefault();
			if ($scope.viewingEmail == null) {
				if($scope.selected && $scope.selected != "") {
					$.map($scope.emails.arr, function(e) {
						if(e.id == $scope.selected.attr('id')) {
							console.log("1");
							$scope.selectedCat = e.category;
						}
					})
				}
				if(! e.shiftKey) {
					if ($scope.selectedCat == -1 || $scope.selectedCat == $scope.numCat)
					  $scope.selectedCat = 1;
					else
					  $scope.selectedCat ++;
				} else {
					if ($scope.selectedCat == -1 || $scope.selectedCat == 1)
					  $scope.selectedCat = $scope.numCat;
					else
					  $scope.selectedCat --;
				}

				temp = $("#" + $scope.selectedCat).find(".ind-email").first();
				console.log($("#" + $scope.selectedCat).find(".ind-email"));
				$scope.selected = temp;
				$scope.selectedIds = [temp.attr('id')];
				$scope.$apply();
				$("#" + $scope.selectedCat).scrollTop(0);
				var level = $("#" + $scope.selectedCat).offset().top - $('.control-bar').outerHeight(); //subtract header size
				window.scrollTo(0, level);
				$('.category-bar').children().each(function(i) {
					var cat = parseInt($scope.selected.parent().attr('id'));
					$scope.selectedCat = cat;
					// if ((i+1) != cat) $(this).css('opacity', .6);
					// else $(this).css('opacity', 1);
				});
			}
		}
		if (e.keyCode == 38) { //down
			if ($scope.selected != "") {
				e.preventDefault();
				var temp = $scope.selected.prev();
				var cl = temp.attr("class");
				if (typeof cl !== 'undefined' && cl !== false) {
					$scope.selected = temp;

          if(e.shiftKey) {
            $scope.selectedIds.push(temp.attr('id'));
          } else {
            $scope.selectedIds = [temp.attr('id')];
          }

					var top = temp.position().top;
					if(top < 0) {
						temp.parent().scrollTop(temp.parent().scrollTop() + top);
					}
					if ($scope.viewingEmail != null) {
						 var target_id = temp.attr('id');
						  // TODO replace this search with a direct hash look-up
						  $.map($scope.emails.arr, function(obj) {
							if(obj.id == target_id) {
							  $scope.viewingEmail = obj;
							  var elem = {"id" : obj.id};
							  $http({
									method: 'POST',
									url: '/mark_as_read',
									data: elem
								})
								.success(function() {console.log("Successfully pushed email read");})
								.error(function() {console.log("Didn't successfully push email read");});
							  if (obj.read != 1) $scope.emails.unread[obj.category-1]--;
							  obj.read = 1;

							  $('.message-body').html(obj.message);
							}
						  });

						  $scope.selectedIds = [target_id];
						  $scope.selected = temp;
					}
				}
			}
			$scope.$apply();
		}
		if (e.keyCode == 40) { //down
			if ($scope.selected != "") {
				e.preventDefault();
				var temp = $scope.selected.next();
				var cl = temp.attr("class");
				if (typeof cl !== 'undefined' && cl !== false) {
					$scope.selected = temp;

					  if(e.shiftKey) {
						$scope.selectedIds.push(temp.attr('id'));
					  } else {
						$scope.selectedIds = [temp.attr('id')];
					  }

					var top = temp.position().top;
					if(top >= temp.parent().height()) {
						var dif = top - temp.parent().height();
						temp.parent().scrollTop(temp.parent().scrollTop() + temp.height() + dif);
					}
					if ($scope.viewingEmail != null) {
						 var target_id = temp.attr('id');
						  // TODO replace this search with a direct hash look-up
						  $.map($scope.emails.arr, function(obj) {
							if(obj.id == target_id) {
							  $scope.viewingEmail = obj;
							  var elem = {"id" : obj.id};
							  $http({
									method: 'POST',
									url: '/mark_as_read',
									data: elem
								})
								.success(function() {console.log("Successfully pushed email read");})
								.error(function() {console.log("Didn't successfully push email read");});
							  if (obj.read != 1) $scope.emails.unread[obj.category-1]--;
							  obj.read = 1;

							  $('.message-body').html(obj.message);
							}
						  });

						  $scope.selectedIds = [target_id];
						  $scope.selected = temp;
					}
				}
			}
			$scope.$apply();
		}
		if (e.keyCode >= 49 && e.keyCode < 49 + $scope.numCat) {
		   var cat = e.keyCode - 48;
         $scope.categorize(cat);
         $scope.$apply();
		}
	});

	$(document).on("click", ".ind-email", function(e) {
		e.stopPropagation();

		if($scope.selectedIds.indexOf($(this).attr('id')) >= 0 && !e.shiftKey) {
			// They have clicked on a highlighted message (e.g. double-clicked) to open
		  $scope.focusCategory('');
		  var target_id = $(this).attr('id');
		  // TODO replace this search with a direct hash look-up
		  $.map($scope.emails.arr, function(obj) {
			if(obj.id == target_id) {
			  $scope.viewingEmail = obj;
			  var elem = {"id" : obj.id};
			  $http({
					method: 'POST',
					url: '/mark_as_read',
					data: elem
				})
				.success(function() {console.log("Successfully pushed email read");})
				.error(function() {console.log("Didn't successfully push email read");});
			  if (obj.read != 1) $scope.emails.unread[obj.category-1]--;
			  obj.read = 1;
			  $('.message-body').html(obj.message);
			}
		  });

		  $scope.selectedIds = [target_id];
		  $scope.selected = $(this);

		  $scope.$apply();
		  return;
		}


			$scope.selected = $(this);
			if(e.shiftKey) {
			  $scope.selectedIds.push($(this).attr('id'));
			} else {
			  $scope.selectedIds = [$(this).attr('id')];
			}
			if ($scope.viewingEmail != null) {
				 var target_id = $(this).attr('id');
				  // TODO replace this search with a direct hash look-up
				  $.map($scope.emails.arr, function(obj) {
					if(obj.id == target_id) {
					  $scope.viewingEmail = obj;
					  var elem = {"id" : obj.id};
					  $http({
							method: 'POST',
							url: '/mark_as_read',
							data: elem
						})
						.success(function() {console.log("Successfully pushed email read");})
						.error(function() {console.log("Didn't successfully push email read");});
					  if (obj.read != 1) $scope.emails.unread[obj.category-1]--;
					  obj.read = 1;

					  $('.message-body').html(obj.message);
					}
				  });

				  $scope.selectedIds = [target_id];
				  $scope.selected = $(this);
			}
		$scope.$apply();
	});
/*
	$(".category-header").click(function(e) {
		e.stopPropagation();
		console.log("header");
		var id = $(this).parent().attr('id');
		$scope.focusCategory(parseInt(id), 0);
		$scope.$apply();
	})
*/
	$(document).on("click", ".category", function(e) {
		e.stopPropagation();
	});

	$(document).click(function() {
		if ($scope.markUnread == false) {
			$scope.selected = "";
			$scope.selectedIds = [];
			$scope.$apply();
		}
		$scope.markUnread = false;
	});

	$(document).delegate('.one-box', 'click', function (e) {
		e.stopPropagation();
		var offset = $(this).offset();
		if ((e.pageY - offset.top) <= 50) {
			var id = $(this).attr('id');
			$scope.focusCategory(parseInt(id));
			$scope.$apply();
		}
	});

	$(document).delegate('.two-box', 'click', function (e) {
		e.stopPropagation();
		var offset = $(this).offset();
		if($scope.boxWidth == null)
			$scope.boxWidth = $(".one-box").width();
		if ((e.pageY - offset.top) <= 50) {
			var id = $(this).attr('id');
			$scope.focusCategory(parseInt(id));
			$scope.$apply();
		}
	});

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
  });

});

sigmaApp.factory('Emails', function($http) {
  var Emails = function(length) {
    this.arr = [];
	this.unread = [];
    this.busy = false;
    this.after = '';
	this.next = 1;
	this.length = length;
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
    $http.jsonp(url).success(function(data) {
	  console.log("SUCCESS");
	  for (var key in data) {
		if(data.hasOwnProperty(key)) {
			var email = data[key];
			var day = moment(email.date, "ddd, DD MMM YYYY HH:mm:ss ZZ");
			email.true_date = day.format('MMMM Do YYYY, h:mm:ssa');;
			email.date = day.fromNow();
			email.snippet = email.message.substr(0, 200);
			email.id = email.id.toString();
			var from = email.from.replace(/"/g, "");
			var start = from.indexOf("<");
			var end = from.indexOf(">");
			email.fromEmail = from.substring(start + 1, end);
			email.fromName = "";
			if (start != 0) email.fromName = from.substring(0, start-1);
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
			email.message = Autolinker.link(email.message, { truncate: 50 });
			this.arr.unshift(email);
		}
	  }
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
});

.config(function($asideProvider) {
  angular.extend($asideProvider.defaults, {
    container: 'body',
    html: true
  });
})
