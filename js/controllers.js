'use strict';

/* Controllers */

var sigmaApp = angular.module('sigmaApp', []);

sigmaApp.controller('EmailListCtrl', function($scope, Reddit) {
  $scope.categories = [
  	{'id' : 1,
  	 'name' : 'Uncategorized',
  	 'color' : '#808080',
  	 'class' : 'category-uncategorized',
	 'split' : 1,
	 'unread' : 10},
  	{'id' : 2,
  	 'name' : 'ASAP',
  	 'color' : '#1b6aa3;',
  	 'class' : 'category-asap',
	 'split' : 1,
	 'unread' : 2},
  	{'id' : 3,
  	 'name' : 'School',
  	 'color' : '#84cbc5;',
  	 'class' : 'category-school',
	 'split' : 0,
	 'unread' : 3},
  	{'id' : 4,
  	 'name' : 'Work',
  	 'color' : '#f8d35e',
  	 'class' : 'category-work',
	 'split' : 0,
	 'unread' : 0},
  	{'id' : 5,
  	 'name' : 'Later',
  	 'color' : '#f47264',
  	 'class' : 'category-later',
	 'split' : 0,
	 'unread' : 5}
  ];
  $scope.reddit = new Reddit();
  $scope.reddit.nextPage();
  $scope.focusedCategory = "";
  $scope.focusedSize = -1;
  $scope.oldWidth = 0;
  $scope.selected = "";
  $scope.selectedId = -1;
  $scope.selectedIds = [];
  $scope.selectedCat = -1;
  $scope.numCat = $scope.categories.length;
  $scope.oldColor = "";
  $scope.sigma_img_tag = "<img src='images/sigma.png' />";

  $scope.focusCategory = function(categoryId, size) {
	if ($scope.focusedCategory != "" || $scope.focusedCategory == categoryId) {
		$('#' + $scope.focusedCategory).height(210);
		if ($scope.focusedSize == 1) $('#' + $scope.focusedCategory).width($scope.oldWidth);
		$scope.focusedCategory = "";
		$scope.focusedSize = -1;
	}
	else {
		$scope.reddit.nextSmallPage(categoryId);
		$scope.$apply();
		var newHeight = $( window ).height() - 100;
		$('#' + categoryId).height(newHeight);
		if (size == 1) {
			$scope.oldWidth = $('#' + categoryId).width();
			$('#' + categoryId).width($('.one-box').width());
		}
		console.log($scope.focusedCategory, categoryId);
		$scope.focusedCategory = categoryId;
		$scope.focusedSize = size;
	}
  }
  
  $scope.addMore = function(categoryId) {
	$scope.reddit.nextSmallPage(categoryId);
  }
  
  $scope.categorize = function(categoryId, emailIds) {
    //move to next element before categorizing
	var temp = $scope.selected.next();
	var cl = temp.attr("class");
	if (typeof cl !== 'undefined' && cl !== false) {
		$scope.selected = temp;
		$scope.selectedIds = [temp.attr('id')];
		var top = temp.position().top - temp.parent().position().top;
		if(top >= temp.parent().height()) {	
			var dif = top - temp.parent().height();
			temp.parent().scrollTop(temp.parent().scrollTop() + temp.height() + dif);
		}
	}

    $.each(emailIds, function(i, id) {
      $.map($scope.reddit.items, function(obj, index) {
        if(obj.id == id)
          obj.category = categoryId;
      });
    });

    
    $scope.$apply();
  }
  
  
  jQuery(function($) {
	$(document).keydown(function(e){
		if (e.keyCode == 9 && $scope.selectedCat != -1) {
			e.preventDefault();
			if ($scope.selectedCat == $scope.numCat) $scope.selectedCat = 1;
			else $scope.selectedCat++;
			temp = $("#" + $scope.selectedCat).children(".ind-email").first();
			$scope.selectedIds = [temp.attr('id')];
			$scope.$apply();
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

					var top = temp.position().top - temp.parent().position().top;
					if(top < 0) {
						temp.parent().scrollTop(temp.parent().scrollTop() + top);
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

					var top = temp.position().top - temp.parent().position().top;
					if(top >= temp.parent().height()) {	
						var dif = top - temp.parent().height();
						temp.parent().scrollTop(temp.parent().scrollTop() + temp.height() + dif);
					}
				}
			}
      $scope.$apply();
		}
		if (e.keyCode >= 49 && e.keyCode < 49 + $scope.numCat) {
		   var cat = e.keyCode - 48;
         $scope.categorize(cat, $scope.selectedIds);
		}
	});
	$(document).on("click", ".ind-email", function(e) {
		e.stopPropagation();
		
		$scope.selected = $(this);
    if(e.shiftKey) {
      $scope.selectedIds.push($(this).attr('id'));
    } else {
      $scope.selectedIds = [$(this).attr('id')];
    }

		$('.category-bar').children().each(function(i) {
			var cat = parseInt($scope.selected.parent().attr('id'));
			$scope.selectedCat = cat;
			if ((i+1) != cat) $(this).css('opacity', .6);
			else $(this).css('opacity', 1);
		});
    $scope.$apply();
	});
	
	$(document).on("click", ".category", function(e) {
		e.stopPropagation();
	});
	$(document).click(function() {
		$scope.selected = "";
		$scope.selectedIds = [];
		$('.category-bar').children().each(function(i) {
			$(this).css('opacity', .8);
		});

    $scope.$apply();
	});
	$(document).delegate('.one-box', 'click', function (e) {
		var offset = $(this).offset();
		if ((e.pageX - offset.left) <= 7) {
			var id = $(this).attr('id');
			$scope.focusCategory(parseInt(id), 0);
			$scope.$apply();
		}
	});
	$(document).delegate('.two-box', 'click', function (e) {
		var offset = $(this).offset();
		if ((e.pageX - offset.left) <= 5) {
			var id = $(this).attr('id');
			$scope.focusCategory(parseInt(id), 1);
			$scope.$apply();
		}
	});
	$('.one-box').bind('scroll', function() {
		  var newTop = $(this).scrollTop() + 5;
		  $(this).children(".unread").css({top: newTop, position:'absolute'});
	  });
	  $('.two-box').bind('scroll', function() {
		  var newTop = $(this).scrollTop() + 5;
		  $(this).children(".unread").css({top: newTop, position:'absolute'});
	  });
  });
   
});

sigmaApp.factory('Reddit', function($http) {
  var Reddit = function() {
    this.items = [];
    this.busy = false;
    this.after = '';
	this.next = 1;
  };

  Reddit.prototype.nextPage = function() {
    if (this.busy) return;
    this.busy = true;
    var url = "http://api.reddit.com/hot?after=" + this.after + "&limit=50&jsonp=JSON_CALLBACK";
    $http.jsonp(url).success(function(data) {
      var items = data.data.children;
      for (var i = 0; i < items.length; i++) {
		items[i].data.from = items[i].data.author;
		items[i].data.subject = items[i].data.title;
		items[i].data.message = items[i].data.url;
		var utcSeconds = items[i].data.created_utc;
		var day = moment.unix(utcSeconds);
		items[i].data.date = day.fromNow();
		items[i].data.category = this.next;
		if (this.next == 5) this.next = 1;
		else this.next++;
		items[i].data.read = Math.round(Math.random());
		items[i].data.sigma = Math.round(Math.random());
        this.items.push(items[i].data);
      }
      this.after = "t3_" + this.items[this.items.length - 1].id;
      this.busy = false;
    }.bind(this));
  };
  
  Reddit.prototype.nextSmallPage = function(category) {
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
        this.items.push(items[i].data);
      }
      this.after = "t3_" + this.items[this.items.length - 1].id;
      this.busy = false;
    }.bind(this));
  };

  return Reddit;
});
