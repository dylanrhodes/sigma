$.fn.fandle = function(options, selectFn) {
	var defaultOpts = { categories : [
				/* {
					'id' : 1,
  	 				'name' : 'Uncategorized',
  	 				'color' : '#808080'
  	 			}, */ {
  					'id' : 2,
				  	'name' : 'ASAP',
				  	'color' : '#1b6aa3',
  	 			}, {
  	 				'id' : 3,
					'name' : 'School',
					'color' : '#84cbc5'
				}, {
					'id' : 4,
				  	'name' : 'Work',
				  	'color' : '#f8d35e'
				}, {
				  	 'id' : 5,
				  	 'name' : 'Later',
				  	 'color' : '#f47264',
				}
			],
			radius : 125,
			innerRadius : 25,
			innerColor : "#424242",
			mode : 'full'
		};

	var opts = $.extend( {}, defaultOpts, options );

	var selectedId = null;

	$(this).addClass("fandle").css("cursor", "pointer");
	var fandle = $(this);
	var originalMarginTop = parseFloat(fandle.css("margin-top"));
	var originalZindex = fandle.css("z-index");
	
	var width = opts.mode == 'half' ? opts.radius : opts.radius * 2;
	var smallWidth = opts.mode == 'half' ? opts.innerRadius : opts.innerRadius * 2;
	var height = opts.radius * 2;
	var smallHeight = opts.innerRadius * 2;
	var numCategories = opts.categories.length;

	var categories = opts.categories.slice();
	if(opts.mode == 'half')
		categories.unshift({dummy : true});

	var innerArc = d3.svg.arc()
						.outerRadius(opts.selectRadius)
						.innerRadius(0);
	
	var outerArc = d3.svg.arc()
	    .outerRadius(opts.radius)
	    .innerRadius(opts.innerRadius);

	var pie = d3.layout.pie()
	    .sort(null)
	    .value(function(d) { return d.dummy ? numCategories : 1; });

	var trueSvg = d3.select(this[0])
		.append("svg")
		.on("touchend", function() {
			fandle.find(".arc").hide();
			fandle.find(".fandle-inner-image").css("opacity", "1");
			fandle.find(".fandle-inner-image-hover").css("opacity", "0");
			trueSvg.attr("width", smallWidth);
			trueSvg.attr("height", smallHeight);
			svg.attr("transform", "translate(" + smallWidth / (opts.mode == 'half' ? 1 : 2) + "," + smallHeight / 2 + ")");
			fandle.css("margin-top", originalMarginTop + "px");
			if(selectedId != null)
				selectFn(selectedId);
			fandle.css("z-index", originalZindex);
		})
	    .attr("width", smallWidth)
	    .attr("height", smallHeight);
	var svg = trueSvg
	  	.append("g")
			.attr("transform", "translate(" + smallWidth / (opts.mode == 'half' ? 1 : 2) + "," + smallHeight / 2 + ")");

	var arcs = [];
	var g = svg.selectAll(".arc")
	  	.data(pie(categories))
		.enter().append("g")
	  	.attr("class", function(d) {
	  		arcs.push([d.startAngle, d.endAngle, d.data]);
	  		return "arc arc-" + d.data.id;
	  	})
	  	.style("display", "none")
	  	.style("opacity", "0.75");

	g.append("path")
	  .attr("d", outerArc)
	  .style("fill", function(d) { return d.data.color; });

	var inner = svg.append("circle")
					.attr("cx", 0)
					.attr("cy", 0)
					.attr("r", opts.innerRadius + 1)
					.attr("fill", opts.innerColor)
					.attr("class", "fandle-inner")
					;

	if(opts.innerImage) {
		svg.append("svg:image")
			.attr("xlink:href", opts.innerImage)
			.attr("x", -1 * opts.innerRadius - 3)
			.attr("y", -1 * opts.innerRadius - 2)
			.attr("width", opts.innerRadius * (opts.mode == 'half' ? 1 : 2) + 4)
			.attr("height", opts.innerRadius * 2 + 4)
			.attr("class", "fandle-inner fandle-inner-image");
	}
	
	if(opts.innerHoverImage) {
		svg.append("svg:image")
			.attr("xlink:href", opts.innerHoverImage)
			.attr("x", -1 * opts.innerRadius - 3)
			.attr("y", -1 * opts.innerRadius - 2)
			.attr("width", opts.innerRadius * (opts.mode == 'half' ? 1 : 2) + 4)
			.attr("height", opts.innerRadius * 2 + 4)
			.attr("class", "fandle-inner fandle-inner-image-hover")
			.style("opacity", "0");	
	}

	fandle.find(".fandle-inner").bind("touchstart", function(e) {
		e.preventDefault();
		fandle.find(".arc").show();
		trueSvg.attr("width", width);
		trueSvg.attr("height", height);
		fandle.css("margin-top", (-1 * (opts.radius - opts.innerRadius) + originalMarginTop) + "px");
		svg.attr("transform", "translate(" + width / (opts.mode == 'half' ? 1 : 2) + "," + height / 2 + ")");
		if(opts.innerHoverImage) {
			fandle.find(".fandle-inner-image").css("opacity", "0");
			fandle.find(".fandle-inner-image-hover").css("opacity", "1");
		}
		originalZindex = fandle.css("z-index");
		fandle.css("z-index", "9999");
	});

	fandle.find(".fandle-inner").bind("touchmove", function(e) {
		e.preventDefault();
		var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
		var elm = $(this).offset();
		var x = touch.pageX - elm.left - opts.innerRadius;
		var y = touch.pageY - elm.top - opts.innerRadius;
		fandle.find(".arc").css("opacity", "0.75");
		
		if(x * x + y * y > opts.innerRadius) {
			// touch has moved outside, need to find which element it is over
			if(x == 0) x = 0.000001;
			var radians = (Math.atan2(y, x) + 3.14159 * 5 / 2) % (3.14159 * 2);
			$.each(arcs, function(i, v) {
				if(radians > v[0] && radians < v[1]) {
					fandle.find(".arc-" + v[2].id).css("opacity", "1.0");
					fandle.find(".fandle-inner").attr("fill", v[2].color);
					selectedId = v[2].id;
				}
			});
		}
	});

	g.append("text")
		.attr("x", 0)
		.attr("y", 0)
		.attr("transform", function(d) {
			var radians = (d.startAngle * 1.5 + d.endAngle) / 2.5 % 3.141519 - 3.14159 / 2;
			return "rotate(" + (radians * 180 / 3.14159) + ")" 
		})
		.style("text-anchor", "middle")
		.style("font-family", "Helvetica Neue")
		.style("font-weight", "bold")
		.attr("fill", "white")
		.text(function(d) {
			if(d.data.name && d.data.name.length > 8)
				return d.data.name.substr(0, 6) + "...";
			return d.data.name;
		})
		.attr("dx", function(d) { return ((d.startAngle + d.endAngle) / 2 < 3.14159 ? 1 : -1) * (opts.radius + opts.innerRadius) / 2 })
		.attr("dy", function(d) { return (d.startAngle + d.endAngle) / 2 < 3.14159 ? 10 : 0; })
		;

	return;
}