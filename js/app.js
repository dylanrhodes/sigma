var selected = "";
var oldColor = "";
$(document).ready(
  function() {  
	$(".one-box").niceScroll({cursorcolor:"#8c8c8e", cursoropacitymin: .5});
	$(".two-box-1").niceScroll({cursorcolor:"#8c8c8e", cursoropacitymin: .5});
	$(".two-box-2").niceScroll({cursorcolor:"#8c8c8e", cursoropacitymin: .5});
	
  }
);
$(document).on("click", ".ind-email", function() {
	if (selected != "") {
		selected.css("background-color", oldColor);
	}
	oldColor = $(this).css("background-color");
	$(this).css("background-color", "#e9fcfb");
	selected = $(this);
});
$(document).on("click", ".ind-emailread", function() {
	if (selected != "") {
		selected.css("background-color", oldColor);
	}
	oldColor = $(this).css("background-color");
	$(this).css("background-color", "#e9fcfb");
	selected = $(this);
});