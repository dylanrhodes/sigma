var selected = "";
var oldColor = "";
$(document).ready(
  function() {  
	$(".one-box").niceScroll({cursorcolor:"#8c8c8e", cursoropacitymin: .5, cursorwidth: 8, enablekeyboard: false});
	$(".two-box").niceScroll({cursorcolor:"#8c8c8e", cursoropacitymin: .5, cursorwidth: 8, enablekeyboard: false});
  }
);
$(document).keydown(function(e){
    if (e.keyCode == 37) { 
       alert( "left pressed" );
       return false;
    }
	if (e.keyCode == 38) { 
	   e.preventDefault(); //up
	   return false;
    }
	if (e.keyCode == 40) { //down
	   e.preventDefault();
    }
});
$(document).on("click", ".ind-email", function(e) {
	e.stopPropagation();
	if (selected != "") {
		selected.css("background-color", oldColor);
	}
	oldColor = $(this).css("background-color");
	$(this).css("background-color", "#e9fcfb");
	selected = $(this);
});
$(document).click(function() {
	if (selected != "") {
		selected.css("background-color", oldColor);
	}
	selected = "";
});