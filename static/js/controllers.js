'use strict';

/* Controllers */

var sigmaApp = angular.module('sigmaApp', ['ngSanitize', 'mgcrea.ngStrap']);

sigmaApp.controller('EmailListCtrl', function($scope, $http, Emails, $alert) {

  $scope.colors = ['#808080', '#f47264', '#85e491', '#84cbc5',  '#1b6aa3'  , '#f8d35e', '#f9b588', '#bd80b9'];
  var url = "/get_categories?callback=JSON_CALLBACK";
  if (window.location.search != "?home") {
	  $http.jsonp(url).success(function(data) {
		$scope.categories = data;
		console.log("Loaded categories");
		console.log(data);
		for (var i = 0; i < $scope.categories.length; i++) $scope.categories[i]["color"] = $scope.colors[i];
		$scope.emails = new Emails(data);
		$scope.emails.init();
	  })
	  .error(function() {console.log("Didn't load categories");});
	  $http({
			method: 'POST',
			url: '/get_new_mail',
		})
		.success(function() {console.log("Successfully loaded new mail");})
		.error(function() {console.log("Didn't successfully load new email");});
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
  
  $scope.tooltip = {
	  "title": "Check this for categories you won't regularly check and you will get a shorter digest version of unread emails!",
	  "checked": false
	};

  //$scope.emails = new Emails($scope.categories.length);
  $scope.focusedCategory = "";
  $scope.selected = "";
  $scope.selectedId = -1;
  $scope.selectedIds = [];
  $scope.selectedCat = -1;
  $scope.addCat = 0;
  $scope.oldColor = "";
  $scope.sigma_img_tag = "<img src='images/sigma.png' />";
  $scope.composingEmail = false;
  $scope.markUnread = false;
  
  $scope.cc = false;

  // $scope.viewingId = -1;

  $scope.emailsById = {};
  $scope.windowHeight = $(window).height();
  $scope.boxWidth = null;
  $scope.catHeaderHeight = function() { return $(".category-header").height() + 11 };

  $scope.retrain = function() {
	if (window.location.search != "?home") {
		$http({
			method: 'POST',
			url: '/train_models',
		})
		.success(function() {console.log("Successfully trained models");})
		.error(function() {console.log("Didn't successfully train models");});
	}
  }
  
  $scope.digest = function() {
		for (var k in $scope.emails.digest) {
			if ($scope.emails.digest.hasOwnProperty(k)) {
				$.map($scope.emails.arr, function(obj, index) {
					if(obj.id == k && obj.read == 0) {
						if (window.location.search != "?home") {
						  var elem = {"id" : k};
						  $http({
								method: 'POST',
								url: '/mark_as_read',
								data: elem
							})
							.success(function() {console.log("Successfully pushed read change");})
							.error(function() {console.log("Didn't successfully push read change");});
						}
						obj.read = 1;
						$scope.emails.unread[obj.category]--;
					}
				});
			}
		}
		$scope.emails.digest = [];
		$scope.$apply();
  }

  $scope.logout = function() {
	console.log("Logging out");
  }
  $scope.addCc = function() {
	if (!$scope.cc) {
		$('.cc-button').attr('class', 'hidden');
		$('#compose-cc-area').attr('class', 'compose-cc');
		$('#compose-bcc-area').attr('class', 'compose-bcc');
		$(".compose-bcc-area").show();
		$(".compose-cc-area").show();
		var height = $('#compose-body').height() - 40;
		$('#compose-body').css('height', height + 'px');
		$scope.cc = true;
	}
  };

	$scope.init = function() {
		for (var i = 1; i <= ($scope.categories.length + $scope.addCat); i++) {
			$('#cat' + i).attr('class', 'cat-bar');
			$('#num' + i).attr('class', 'num-bar');
			$('#split' + i).attr('class', 'split-check');
			$('#digest' + i).attr('class', 'digest-check');
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
		for (var i = $scope.categories.length + $scope.addCat + 1; i <= 8; i++) {
			$('#cat' + i).attr('class', 'hidden');
			$('#cat' + i).val("");
			$('#split' + i).attr('class', 'hidden');
			$('#split' + i).prop("checked", false);
			$('#digest' + i).attr('class', 'hidden');
			$('#digest' + i).prop("checked", false);
			$('#num' + i).attr('class', 'hidden');
			$('#num' + i).val(5);
			$('#prev' + i).attr('class', 'hidden');
			$('#rc' + i).attr('class', 'hidden');
		}
	}

	$scope.AddCat = function() {
		if (($scope.addCat + $scope.categories.length) != 8) {
			if (($scope.addCat + $scope.categories.length) == 7) $('#addcat').attr('class', 'hidden');
			$scope.addCat++;
			var numCat = $scope.addCat + $scope.categories.length;
			var prevCat = numCat - 1;
			var id = parseInt($('#id' + prevCat).val()) + 1;
			$('#id' + numCat).val(id);
			console.log("Added cat with id" + id);
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
		var id = parseInt($('#id' + num).val());
		var index = -1;
		for (var i = 0; i < $scope.categories.length; i++) {
			if($scope.categories[i]['id'] == id) index = i;
		}
		if (index != -1) {
			$scope.categories.splice(index, 1);
			var elem = {"category" : id};
			if (window.location.search != "?home") {
			  $http({
					method: 'POST',
					url: '/delete_category',
					data: elem
				})
				.success(function() {console.log("Successfully deleted category " + id);})
				.error(function() {console.log("Didn't successfully delete category " + id);});
			}
			$scope.settings();
			$scope.init();
			$scope.emails = new Emails($scope.categories.length);
			$scope.emails.init();
		}
		else console.log("Couldn't remove cateogry");
	}
	
	$scope.archive = function(email) {
		var next = $("#" + email.id).next();
		$scope.selected = next;
		$scope.selectedIds = [next.attr('id')];
		console.log($scope.selected.attr('id'));
		console.log($scope.selectedIds);
		var id = next.attr('id');
		$.map($scope.emails.arr, function(obj, index) {
			if(obj.id == id) {
			  $scope.viewingEmail = obj;
			 }
		  });
		var elem = {"id" : email.id};
		if (window.location.search != "?home") {
			$http({
				method: 'POST',
				url: '/mark_as_archived',
				data: elem
			})
			.success(function() {console.log("Successfully archived email");})
			.error(function() {console.log("Didn't successfully archive email");});
		}
		email.archived = 1;
	}

	$scope.tblContactsToContacts = function(val, i) {
		if($scope.emails.contacts[val])
			return $scope.emails.contacts[val][4];
		return val;
	}

	$scope.send = function() {
		var subject = $("#compose-subject").val();
		var body = $("#compose-body").val();
		var to = $.map($("#compose-to").val().split(','), $scope.tblContactsToContacts).join(',');
		var cc = $.map($("#compose-cc").val().split(','), $scope.tblContactsToContacts).join(',');;
		var bcc = $.map($("#compose-bcc").val().split(','), $scope.tblContactsToContacts).join(',');;
		var data = {'body': body, 'subject': subject, 'to': to, 'cc' : cc, 'bcc' : bcc};
		if (window.location.search != "?home") {
			$http({
				method: 'POST',
				url: '/send_email',
				data: data
			})
			.success(function() {console.log("Successfully sent email");location.reload();})
			.error(function() {console.log("Didn't successfully send email");});
		}
	}

	$scope.save = function() {
		var num = $scope.addCat + $scope.categories.length;
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
				var digest = 0;
				if ($('#digest' + i).prop("checked")) {
					digest = 1;
				}
				var unread = Math.floor(Math.random() * 11);
				var temp = {};
				temp['id'] = parseInt($('#id' + i).val());
				temp['name'] = name;
				temp['color'] = $scope.colors[i-1];
				temp['class'] = 'category-' + name;
				temp['split'] = split;
				temp['digest'] = digest;
				temp['unread'] = unread;
				temp['emails'] = emails;
				names.push(name);
				$scope.categories.push(temp);
			}
		}
		if (window.location.search != "?home") {
			$http({
				method: 'POST',
				url: '/add_categories',
				data: $scope.categories
			})
			.success(function() {console.log("Successfully added categories");})
			.error(function() {console.log("Didn't successfully add categories");});
		}
		//need a way to change move items in a deleted category to uncategorized
		var percentage = 92.5/$scope.categories.length;
		$scope.$apply();
		$('.category').css('width', percentage + '%');
		$('.wrapper-sigma').attr('class', 'wrapper-sigma container-fluid');
		$('.wrapper-sigma-2').attr('class', 'wrapper-sigma-2 container-fluid hidden');

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
		$scope.addCat = 0;
		$('.wrapper-sigma').attr('class', 'wrapper-sigma container-fluid hidden');
		$('.wrapper-sigma-2').attr('class', 'wrapper-sigma-2 container-fluid');
		for (var i = 1; i <= $scope.categories.length; i++) {
			$('#cat' + i).val($scope.categories[i-1]['name']);
			$('#id' + i).val($scope.categories[i-1]['id']);
			$('#num' + i).val($scope.categories[i-1]['emails']);
			if ($scope.categories[i-1]['split']) $('#split' + i).prop("checked", true);
			else $('#split' + i).prop("checked", false);
			if ($scope.categories[i-1]['digest']) $('#digest' + i).prop("checked", true);
		}
		$scope.init();
	}

	$scope.tbl_values = function() {
		if($scope.emails && $scope.emails.contacts) {
			$scope.compose_tbl.plugins['autocomplete'].setValues($scope.emails.contacts);
			$scope.compose_tbl_cc.plugins['autocomplete'].setValues($scope.emails.contacts);
			$scope.compose_tbl_bcc.plugins['autocomplete'].setValues($scope.emails.contacts);
		}
		$(".textboxlist-autocomplete-placeholder").hide();
		$(".textboxlist-autocomplete-results").hide();
		setTimeout('$(".textboxlist-autocomplete").width($(".textboxlist").width());', 150);
	}

	$scope.initializedTBL = false
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
				+ " wrote:\n\n" + arguments[0].noHtml);
		}

		if(!$scope.initializedTBL) {
			$scope.compose_tbl = new $.TextboxList("#compose-to", {unique: true, placeholder : "To", plugins: {autocomplete: {}}});
			$scope.compose_tbl_cc = new $.TextboxList("#compose-cc", {unique: true, placeholder : "CC", plugins: {autocomplete: {}}});
			$scope.compose_tbl_bcc = new $.TextboxList("#compose-bcc", {unique: true, placeholder : "BCC", plugins: {autocomplete: {}}});
			$scope.initializedTBL = true;
		}
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

  $scope.categorize = function(categoryId) {
	console.log(categoryId);
    if($scope.selectedIds.length == 0) {
    	// nothing selected, categorize current email
    	$scope.viewingEmail.category = categoryId;
    	return;
    }
	if ($scope.selected != "") {
		if ($scope.selectedIds.indexOf($scope.selected.attr('id')) < 0) $scope.selected = $("#" + $scope.selectedIds[0]);
	    //move to next element before categorizing
		var temp = $scope.selected.next();
		while(temp && $scope.selectedIds.indexOf(temp.attr('id')) >= 0)
			temp = temp.next();
		var cl = temp.attr("class");

		$.each($scope.selectedIds, function(i, id) {
		  $.map($scope.emails.arr, function(obj, index) {
			if(obj.id == id) {
			  var elem = {"id" : id, "category" : categoryId};
			  if (window.location.search != "?home") {
				  $http({
						method: 'POST',
						url: '/categorize_email',
						data: elem
					})
					.success(function() {console.log("Successfully pushed category change");})
					.error(function() {console.log("Didn't successfully pushed category change");});
				}
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
				  if (obj.read == 0) {
					  var elem = {"id" : id};
					  if (window.location.search != "?home") {
						  $http({
								method: 'POST',
								url: '/mark_as_read',
								data: elem
							})
							.success(function() {console.log("Successfully pushed read change");})
							.error(function() {console.log("Didn't successfully push read change");});
					  }
					  $scope.emails.unread[obj.category]--;
					  obj.read = 1;
					  $scope.$apply();
				  }
			  }
			  else {
				if (obj.read == 1) {
					var elem = {"id" : id};
					  if (window.location.search != "?home") {
						  $http({
								method: 'POST',
								url: '/mark_as_unread',
								data: elem
							})
							.success(function() {console.log("Successfully pushed read change");})
							.error(function() {console.log("Didn't successfully push read change");});
					  }
					  $scope.emails.unread[obj.category]++;
					  obj.read = 0;
					  $scope.$apply();
				}
			  }
			 }
		  });
		});
	}
  }


  jQuery(function($) {
	$(window).load(function() {
		$(".loader").fadeOut("slow");
	});
	
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
		function loadNewEmails() {
			console.log("Loading new emails");
			var url = "/get_recent_email?callback=JSON_CALLBACK";
			$http.jsonp(url).success(function(data) {
				console.log("Got new email data:");
				console.log(data);
				var contactsCount = 0;
				for (var key in data) {
					if(data.hasOwnProperty(key)) {
						var email = data[key];
						if (isNaN(+email.date[0])) {
							var day = moment(email.date, "ddd, DD MMM YYYY HH:mm:ss ZZ");
							email.true_date = day.format('MMMM Do YYYY, h:mm:ssa');;
							email.date = day.fromNow();
						}
						else {
							var day = moment(email.date, "DD MMM YYYY HH:mm:ss ZZ");
							email.true_date = day.format('MMMM Do YYYY, h:mm:ssa');;
							email.date = day.fromNow();
						}
						if(!email.archived)
							email.archived = false;
						
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
						if(! $scope.emails.contacts[email.fromEmail] && contactsCount < 1000) {
							$scope.emails.contacts[email.fromEmail.toLowerCase()] = [$scope.emails.contacts.length, 
													email.fromName + " " + email.fromEmail, 
													email.fromName != "" ? email.fromName : email.fromEmail,
													email.fromName + " <em>" + email.fromEmail + "</em>",
													email.fromEmail];
							contactsCount ++;
						}
						var to = email.to.replace(/"/g, "");
						var start = to.indexOf("<");
						var end = to.indexOf(">");
						if (start >= 0) {
							email.toEmail = to.substring(start + 1, end);
							email.toName = "";
							if (start != 0) email.toName = to.substring(0, start-1);
						}
						else {
							email.toName = "";
							email.toEmail = from;
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
						$scope.emails.unread[email.category]++;
						$scope.emails.arr.unshift(email);
						if(!$scope.$$phase) $scope.$apply();
					}
				}
			});
			console.log("Done loading new emails");
		}
		
		setTimeout(loadNewEmails, 30000);
		setTimeout(loadNewEmails, 120000);
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
							$scope.selectedCat = e.category;
						}
					})
				}
				if(! e.shiftKey) {
					if ($scope.selectedCat == -1 || $scope.selectedCat == $scope.categories.length)
					  $scope.selectedCat = 1;
					else
					  $scope.selectedCat ++;
				} else {
					if ($scope.selectedCat == -1 || $scope.selectedCat == 1)
					  $scope.selectedCat = $scope.categories.length;
					else
					  $scope.selectedCat --;
				}
				var cId = $scope.categories[$scope.selectedCat-1]['id'];
				temp = $("#category" + cId).find(".ind-email").first();
				while (!temp.length) {
					if ($scope.selectedCat == -1 || $scope.selectedCat == $scope.categories.length)
					  $scope.selectedCat = 1;
					else
					  $scope.selectedCat++;
					cId = $scope.categories[$scope.selectedCat-1]['id'];
					temp = $("#category" + cId).find(".ind-email").first();
				}
				$scope.selected = temp;
				$scope.selectedIds = [temp.attr('id')];
				$scope.$apply();
				$("#inner" + cId).scrollTop(0);
				var level = $("#category" + cId).offset().top - $('.control-bar').outerHeight(); //subtract header size
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
						temp.parent().scrollTop(temp.parent().scrollTop() + top - 21);
					}
					if ($scope.viewingEmail != null) {
						 var target_id = temp.attr('id');
						  // TODO replace this search with a direct hash look-up
						  $.map($scope.emails.arr, function(obj) {
							if(obj.id == target_id) {
							  $scope.viewingEmail = obj;
							  $scope.$apply();
							  if (obj.read == 0) {
								  var elem = {"id" : obj.id};
								  if (window.location.search != "?home") {
									  $http({
											method: 'POST',
											url: '/mark_as_read',
											data: elem
										})
										.success(function() {console.log("Successfully pushed email read");})
										.error(function() {console.log("Didn't successfully push email read");});
								  }
								  $scope.emails.unread[obj.category]--;
								  obj.read = 1;
								  $scope.$apply();
							  }
							  if (!obj.html) {
								$('.message-body').css('white-space', 'pre-line');
								$('.message-body').css('padding', '0 40px');
								$('.message-view').css('overflow', 'auto');
								$('.message-body').html(obj.message);
							  }
							  else {
								$('.message-body').html("<iframe class='email-frame' height='100%' width='100%' frameBorder='0' src='/get_email?id=" + obj.id + "' ></iframe>");
								$('.message-body').css('white-space', 'normal');
								$('.message-body').css('padding', '0');
								$('.message-view').css('overflow', 'hidden');
								var size = $('.message-view').outerHeight() - ($('.message-header').outerHeight() + $('.message-header-2').outerHeight());
								$('.email-frame').css('height', size+'px');
							  }
							  
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
						temp.parent().scrollTop(temp.parent().scrollTop() + temp.height() + dif - 21);
					}
					if ($scope.viewingEmail != null) {
						 var target_id = temp.attr('id');
						  // TODO replace this search with a direct hash look-up
						  $.map($scope.emails.arr, function(obj) {
							if(obj.id == target_id) {
							  $scope.viewingEmail = obj;
							  $scope.$apply();
							  if (obj.read == 0) {
								  var elem = {"id" : obj.id};
								  if (window.location.search != "?home") {
									  $http({
											method: 'POST',
											url: '/mark_as_read',
											data: elem
										})
										.success(function() {console.log("Successfully pushed email read");})
										.error(function() {console.log("Didn't successfully push email read");});
								  }
								  $scope.emails.unread[obj.category]--;
								  obj.read = 1;
								  $scope.$apply();
							  }
							  if (!obj.html) {
								$('.message-body').css('white-space', 'pre-line');
								$('.message-body').css('padding', '0 40px');
								$('.message-view').css('overflow', 'auto');
								$('.message-body').html(obj.message);
							  }
							  else {
								$('.message-body').html("<iframe class='email-frame' height='100%' width='100%' frameBorder='0' src='/get_email?id=" + obj.id + "' ></iframe>");
								$('.message-body').css('white-space', 'normal');
								$('.message-body').css('padding', '0');
								$('.message-view').css('overflow', 'hidden');
								var size = $('.message-view').outerHeight() - ($('.message-header').outerHeight() + $('.message-header-2').outerHeight());
								$('.email-frame').css('height', size+'px');
							  }
							}
						  });

						  $scope.selectedIds = [target_id];
						  $scope.selected = temp;
					}
				}
			}
			$scope.$apply();
		}
		if (e.keyCode >= 49 && e.keyCode < 49 + $scope.categories.length) {
		 var num = e.keyCode - 48;
		 var cat = $scope.categories[num-1]["id"];
         $scope.categorize(cat);
         $scope.$apply();
		}
	});
	
	$(document).on("click", ".btn-default", function(e) {
		$scope.emails.aside = {
			"title": "Digest Already Read",
			"content": "<div class='summary'>Refresh to Update Digest</div>"
		};
	});
	
	$(document).on("click", "#archive-button", function(e) {
		e.stopPropagation();
	});
	
	$(document).on("click", ".close", function(e) {
		$scope.emails.aside = {
			"title": "Digest Already Read",
			"content": "<div class='summary'>Refresh to Update Digest</div>"
		};
	});

	$(document).on("click", ".keep-unread", function(e) {
		var myAlert = $alert({title: 'Marked Unread!', placement: 'top-left', type: 'info', duration: 2, show: true});
		var id = parseInt($(this).attr('title'));
		var elem = {"id" : id};
		$.map($scope.emails.arr, function(obj, index) {
			if(obj.id == id && obj.read == 1) {
				if (window.location.search != "?home") {
					$http({
						method: 'POST',
						url: '/mark_as_unread',
						data: elem
					})
					.success(function() {console.log("Successfully pushed read change");})
					.error(function() {console.log("Didn't successfully push read change");});
				}
				obj.read = 0;
				$scope.emails.unread[obj.category]++;
			}
		  });
		  $scope.$apply();
	});
	
	$(document).on("click", ".ind-email", function(e) {
		e.stopPropagation();
		var percentage = 92.5/$scope.categories.length;
		$('.category').css('width', percentage + '%');
		if($scope.selectedIds.indexOf($(this).attr('id')) >= 0 && !e.shiftKey) {
			// They have clicked on a highlighted message (e.g. double-clicked) to open
		  $scope.focusCategory('');
		  var target_id = $(this).attr('id');
		  // TODO replace this search with a direct hash look-up
		  $.map($scope.emails.arr, function(obj) {
			if(obj.id == target_id) {
			  $scope.viewingEmail = obj;
			  $scope.$apply();
			  if (obj.read == 0) {
				  var elem = {"id" : obj.id};
				  if (window.location.search != "?home") {
					  $http({
							method: 'POST',
							url: '/mark_as_read',
							data: elem
						})
						.success(function() {console.log("Successfully pushed email read");})
						.error(function() {console.log("Didn't successfully push email read");});
				  }
				  $scope.emails.unread[obj.category]--;
				  obj.read = 1;
				  $scope.$apply();
			  }
			  if (!obj.html) {
				$('.message-body').css('white-space', 'pre-line');
				$('.message-body').css('padding', '0 40px');
				$('.message-view').css('overflow', 'auto');
				$('.message-body').html(obj.message);
			  }
			  else {
				$('.message-body').html("<iframe class='email-frame' height='100%' width='100%' frameBorder='0' src='/get_email?id=" + obj.id + "' ></iframe>");
				$('.message-body').css('white-space', 'normal');
				$('.message-body').css('padding', '0');
				$('.message-view').css('overflow', 'hidden');
				var size = $('.message-view').outerHeight() - ($('.message-header').outerHeight() + $('.message-header-2').outerHeight());
				$('.email-frame').css('height', size+'px');
			  }
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
					  $scope.$apply();
					  if (obj.read == 0) {
						  var elem = {"id" : obj.id};
						  if (window.location.search != "?home") {
							  $http({
									method: 'POST',
									url: '/mark_as_read',
									data: elem
								})
								.success(function() {console.log("Successfully pushed email read");})
								.error(function() {console.log("Didn't successfully push email read");});
						  }
						  $scope.emails.unread[obj.category]--;
						  obj.read = 1;
						  $scope.$apply();
					  }
					  if (!obj.html) {
						$('.message-body').css('white-space', 'pre-line');
						$('.message-body').css('padding', '0 40px');
						$('.message-view').css('overflow', 'auto');
						$('.message-body').html(obj.message);
					  }
					  else {
						$('.message-body').html("<iframe class='email-frame' height='100%' width='100%' frameBorder='0' src='/get_email?id=" + obj.id + "' ></iframe>");
						$('.message-body').css('white-space', 'normal');
						$('.message-body').css('padding', '0');
						$('.message-view').css('overflow', 'hidden');
						var size = $('.message-view').outerHeight() - ($('.message-header').outerHeight() + $('.message-header-2').outerHeight());
						$('.email-frame').css('height', size+'px');
					  }
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
			id = id.substring(8);
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
			id = id.substring(8);
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

sigmaApp.factory('Emails', function($http, $alert) {
  var Emails = function(categories) {
    this.arr = [];
	this.unread = [];
	this.digest = [];
	this.contacts = {};
	
    this.busy = false;
    this.after = '';
	this.next = 1;
	this.categories = categories;
	this.length = categories.length;
	this.aside = [];
  };

  Emails.prototype.init = function() {
	if (window.location.search == "?home") {
		for (var i = 1; i <=this.length; i++) this.unread[i] = 0;
		var dummies = [
			{'from' : 'Gandalf <gandie@thewhite.com>',
			 'subject' : 'Missing: Ring',
			 'message' : 'Has anyone seen a ring lying around? I seem to have misplaced mine which is quite unfortunate.'},
			{'from' : 'Pippin Took <pippin@theshire.com>',
			 'subject' : 'New brews at the Green Dragon',
			 'message' : 'Hop-goblin 120: This fresh IPA will have you beggin for more. Grab a pint soon!'},
			 {'from' : 'Gothmog <goth@mtdoom.com>',
			 'subject' : 'Ashdautas Vrasubatlat',
			 'message' : 'Nar Udautas Nar Mat Kordh-Ishi Ang Gijak-Ishi Lul Gijak-Ishi Amal shufar, at rrug Snaga nar baj lufut Ambor mabas lufut'},
			 {'from' : 'Legolas <legomyeggo@gmail.com>',
			 'subject' : '434,324!',
			 'message' : 'Let\'s see Gimli top that!'},
			 {'from' : 'Gimli <gimli@earthlink.net>',
			 'subject' : '434,323!',
			 'message' : 'Unbeatable!'}
		  ];
		  var num = 0;
		for (var i = 1; i <= 5; i++) {
			for (var j = 0; j < 20; j++) {
				var rando = Math.floor(Math.random()*5);
				var email = [];
				email.from = dummies[rando].from;
				email.subject = dummies[rando].subject;
				email.message = dummies[rando].message;
				email.date = "1 hour ago";
				email.snippet = email.message.substr(0, 200);
				email.id = num.toString();
				email.read = Math.round(Math.random());
				var from = email.from.replace(/"/g, "");
				var start = from.indexOf("<");
				var end = from.indexOf(">");
				email.fromEmail = from.substring(start + 1, end);
				email.fromName = "";
				if (start != 0) email.fromName = from.substring(0, start-1);
				num++;
				email.category = i;
				if (email.read == 0) this.unread[i]++;
				this.arr.unshift(email);
			}
		}
		console.log("DUMMY DATA!");
	}
	else {
		var dCats = [];
		for (var i = 0; i < this.length; i++) {
			var cat = this.categories[i]['id'];
			if (this.categories[i]['digest']) dCats.push(cat);
			var call = "/get_category_unread?callback=JSON_CALLBACK&category=" + cat;
			$http.jsonp(call).success(function(data) {
				var category = data['category'];
				var num = data['unread'];
				this.unread[category] = num;
			}.bind(this))
			.error(function() {console.log("Couldn't get unread for " + cat);});
		}
		console.log(dCats);
		if (this.busy) return;
		this.busy = true;
		var url = "/get_emails?callback=JSON_CALLBACK";
		$http.jsonp(url)
		.error(function() {var welcome = $alert({title: 'Welcome to Sigma!', content: "Thanks for signing up! We are currently attempting to download your emails from gmail. It may take a minute or to. Please go here: https://security.google.com/settings/security/activity and make sure we are authorized to access your account! Feel free to set up your email categories by clicking the gear", placement: 'top', type: 'info', show: true});})
		.success(function(data) {
			var contactsCount = 0;
		  for (var key in data) {
			if(data.hasOwnProperty(key)) {
				var email = data[key];
				if (isNaN(+email.date[0])) {
					var day = moment(email.date, "ddd, DD MMM YYYY HH:mm:ss ZZ");
					email.true_date = day.format('MMMM Do YYYY, h:mm:ssa');;
					email.date = day.fromNow();
				}
				else {
					var day = moment(email.date, "DD MMM YYYY HH:mm:ss ZZ");
					email.true_date = day.format('MMMM Do YYYY, h:mm:ssa');;
					email.date = day.fromNow();
				}
				if(!email.archived)
					email.archived = false;
				
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
				if(! this.contacts[email.fromEmail] && contactsCount < 1000) {
					this.contacts[email.fromEmail.toLowerCase()] = [this.contacts.length, 
											email.fromName + " " + email.fromEmail, 
											email.fromName != "" ? email.fromName : email.fromEmail,
											email.fromName + " <em>" + email.fromEmail + "</em>",
											email.fromEmail];
					contactsCount ++;
				}
				var to = email.to.replace(/"/g, "");
				var start = to.indexOf("<");
				var end = to.indexOf(">");
				if (start >= 0) {
					email.toEmail = to.substring(start + 1, end);
					email.toName = "";
					if (start != 0) email.toName = to.substring(0, start-1);
				}
				else {
					email.toName = "";
					email.toEmail = from;
				}
				if (email.subject.indexOf("=?utf-8?Q?") > -1 || email.subject.indexOf("=?UTF-8?Q?") > -1) {
					email.subject = email.subject.substring(10).replace(/=/g,'%');
					if (email.subject.indexOf("?") > -1) email.subject = email.subject.substring(0, email.subject.indexOf("?"));
					email.subject = decodeURIComponent(email.subject);
				}
				if (email.subject.indexOf("=?utf-8?B?") > -1 || email.subject.indexOf("=?UTF-8?B?") > -1) {
					email.subject = email.subject.substring(10);
					if (email.subject.indexOf("?") > -1) email.subject = email.subject.substring(0, email.subject.indexOf("?"));
					email.subject = decodeURIComponent(escape(window.atob(email.subject)))
				}
				if (email.fromName.indexOf("=?utf-8?Q?") > -1 || email.fromName.indexOf("=?UTF-8?Q?") > -1) {
					email.fromName = email.fromName.substring(10).replace(/=/g,'%');
					if (email.fromName.indexOf("?") > -1) email.fromName = email.fromName.substring(0, email.fromName.indexOf("?"));
					email.fromName = decodeURIComponent(email.fromName);
				}
				if (email.fromName.indexOf("=?utf-8?B?") > -1 || email.fromName.indexOf("=?UTF-8?B?") > -1) {
					email.fromName = email.fromName.substring(10);
					if (email.fromName.indexOf("?") > -1) email.fromName = email.fromName.substring(0, email.fromName.indexOf("?"));
					email.fromName = decodeURIComponent(escape(window.atob(email.fromName)))
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
				// if (dCats.indexOf(email.category) >= 0 && email.read == 0) this.digest.unshift(email);
				this.arr.unshift(email);
			}
		  }
			var content = "";
		    for (var i = 0; i < dCats.length; i++) {
				var call = "/get_category_summary?callback=JSON_CALLBACK&category=" + dCats[i];
				$http.jsonp(call).success(function(data) {
					var cat = parseInt(data["category"]);
					var name = "";
					for (var i = 0; i < this.length; i++) {
						if (this.categories[i]['id'] == cat) {
							name = this.categories[i]['name'];
						}
					}
					content += "<h3 class='digest-category'>" + name + "</h3>";
					var arr = data["emails"]
					var dEmails = false;
					for (var k in arr) {
						dEmails = true;
						if (arr.hasOwnProperty(k)) {
						  this.digest[k] = arr[k];
						  content += "<div class='row digest-row'>"
						  content += "<div class='col-xs-10 summary'>"
						  content += arr[k]['summary'];
						  content += "</div>";
						  content += "<a class='col-xs-2 keep-unread' title='" + k + "'>Keep Unread</a>"
						  content += "</div>";
						  content += "<div class='row digest-sub-row'>"
						  var from = arr[k]['from'];
						  from = from.replace(/"/g, "");
						  var start = from.indexOf("<");
						  var dFrom = "";
						  if (start < 0) {
							  dFrom = from;
						  }
						  else {
							  var end = from.indexOf(">");
							  var fromEmail = from.substring(start + 1, end);
							  var fromName = "";
							  if (start != 0) fromName = from.substring(0, start-1);
							  if (fromName == "") dFrom = fromEmail;
							  else dFrom = fromName;
						  }
						  content += "<div class='col-xs-3 summary'>from: " + dFrom + "</div>"
						  content += "<div class='col-xs-7 summary' style='padding-left:0;'>subject: "
						  content += arr[k]['subject'];
						  content += "</div>"
						  content += "</div>"
						}
					}
					if (dEmails) {
						this.aside = {
							"title": "Category Digest",
							"content": content
						};
					}
					else {
						this.aside = {
							"title": "No Unread Emails in Digest",
							"content": "<div class='summary'>Refresh to Update Digest</div>"
						};
					}
				}.bind(this))
				.error(function() {console.log("Couldn't get digest for " + dCats[i]);});
			}
		  var c = [];
		  $.each(this.contacts, function(i,v) {
		  	v[0] = c.length;
		  	c.push(v);
		  });
		  this.contacts = c;
		  this.busy = false;
		  if (this.arr.length == 0) {
			$(document.body).css('padding-top' , '0');
			var welcome = $alert({title: 'Welcome to Sigma!', content: "Thanks for signing up! We are currently attempting to download your emails from gmail. It may take a minute or to. Please go here: https://security.google.com/settings/security/activity and make sure we are authorized to access your account! Feel free to set up your email categories by clicking the gear", placement: 'top', type: 'info', show: true});
			$(document.body).css('padding-top' , '58px !important');
		  }
		}.bind(this));
	}
  };

  return Emails;
})

.config(function($tooltipProvider) {
  angular.extend($tooltipProvider.defaults, {
    html: false,
	placement: 'right'
  });
})

.config(function($alertProvider) {
  angular.extend($alertProvider.defaults, {
    animation: 'am-fade-and-slide-top',
    placement: 'top'
  });
})

.config(function($asideProvider) {
  angular.extend($asideProvider.defaults, {
    container: 'body',
    html: true
  });
});
