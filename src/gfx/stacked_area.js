uv.StackedAreaGraph = function (graphdef, config) {
	var self = this;
	uv.Graph.call(self, graphdef).setDefaults(graphdef, config).init(graphdef, config);

	var stacklayout = d3.layout.stack().offset(self.config.area.offset)(self.categories.map(function (d) {
			return graphdef.dataset[d].map(function (d) { return {x: d.name, y: +d.value}; });
	}));

	self.axes[self.config.graph.orientation === 'Horizontal' ? 'ver' : 'hor'].scale.domain(self.labels.map(function (d) { return d; }));
	self.areagroup = self.panel.append('g').selectAll('g')
											.data(stacklayout).enter().append('g').attr('class', function (d, i) { return 'cge_' + uv.util.formatClassName(self.categories[i]); });
	self['draw' + self.config.graph.orientation + 'Area']();

	self.finalize();
};

uv.StackedAreaGraph.prototype = uv.util.extend(uv.Graph);

uv.StackedAreaGraph.prototype.setDefaults = function (graphdef, config) {
	graphdef.stepup = true;
	return this;
};

uv.StackedAreaGraph.prototype.drawHorizontalArea = function () {
	var self = this, axes = self.axes,
		categories = self.categories,
		config = self.config;
	
	axes.ver.scale.rangePoints([0, self.height()]);

	for(var i = 0; i < categories.length; i = i + 1){
		uv.effects.area.mouseover(self, i);
		uv.effects.area.mouseout(self, i);
	}

	self.areagroup.append('path')
			.attr('class', function (d, i) { return 'area_' + uv.util.formatClassName(categories[i]); })
			.style('fill', function (d, i) { return uv.util.getColorBand(config, i); })
			.attr('d', d3.svg.area()
				.y(function (d) { return axes.ver.scale(d.x) + axes.ver.scale.rangeBand() / 2; })
				.x0(function (d) { return axes.hor.scale(d.y0); })
				.x1(function (d) { return axes.hor.scale(d.y0 + d.y); })
				.interpolate(self.config.area.interpolation)
			)
		.on('mouseover', function (d,i){ self.effects[categories[i]].mouseover(); })
		.on('mouseout',  function (d,i) { self.effects[categories[i]].mouseout(); });

	self.areagroup.append('path')
		.attr('class', function (d, i) { return 'line_' + uv.util.formatClassName(categories[i]); })
		.style('stroke', 'white')
		.style('fill', 'none')
		.style('stroke-width', 2)
		.attr('d', d3.svg.line()
			.y(function (d) { return axes.ver.scale(d.x) + axes.ver.scale.rangeBand() / 2; })
			.x(function (d) { return axes.hor.scale(d.y0 + d.y); })
			.interpolate(self.config.area.interpolation)
		);

	return self;
};

uv.StackedAreaGraph.prototype.drawVerticalArea = function () {
	var self = this, axes = self.axes,
		categories = self.categories,
		config = self.config;
	
	axes.hor.scale.rangePoints([0, self.width()]);

	self.areagroup.append('path')
			.attr('class', 'r3_area');

	for(var i = 0; i < categories.length; i = i + 1){
		uv.effects.area.mouseover(self, i);
		uv.effects.area.mouseout(self,i);
	}

	self.areagroup.append('path')
			.attr('class', function (d, i) { return 'area_' + uv.util.formatClassName(categories[i]); })
			.style('fill', function (d, i) { return uv.util.getColorBand(config, i); })
			.attr('d', d3.svg.area()
				.x(function (d) { return axes.hor.scale(d.x) + axes.hor.scale.rangeBand() / 2; })
				.y0(function (d) { return axes.ver.scale(d.y0); })
				.y1(function (d) { return axes.ver.scale(d.y0 + d.y); })
				.interpolate(self.config.area.interpolation)
			)
		.on('mouseover', function (d,i){ self.effects[categories[i]].mouseover(); })
		.on('mouseout',  function (d,i) { self.effects[categories[i]].mouseout(); });


	self.areagroup.append('path')
			.attr('class', function (d, i) { return 'line_' + uv.util.formatClassName(categories[i]); })
			.style('stroke', 'white')
			.style('fill', 'none')
			.style('stroke-width', 2)
			.attr('d', d3.svg.line()
				.x(function (d) { return axes.hor.scale(d.x) + axes.hor.scale.rangeBand() / 2; })
				.y(function (d) { return axes.ver.scale(d.y0 + d.y); })
				.interpolate(self.config.area.interpolation)
			);

	return self;
};