   var margin = {top:20, right:30, bottom:30, left:40};
   var width = 600 -margin.left - margin.right;
   var height = 400 - margin.top - margin.bottom;

   var legendWidth = 130;
   var legendHeight = 70;

   var linearChart = d3.select('#linearChart')
                      .style("width",width+margin.left+margin.right+legendWidth+'px')
                      .style("height",height+margin.top+margin.bottom+'px');

   var logChart = d3.select('#logChart')
                      .style("width",width+margin.left+margin.right+legendWidth+'px')
                      .style("height",height+margin.top+margin.bottom+'px');
   plotChart(linearChart,'linear');
   plotChart(logChart,'log');

   function plotChart(Chart,Scale){
   
   Chart.select('#headline')
        .append('svg')
        .attr('width',width)
        .attr('height',15)
        .append("text")
        .attr("x",width/2+15)
        .attr("y", 13)
        .text(title(Scale))
        .attr("text-anchor","middle")
        .style("font-size",'16px')
        //.style("text-decoration","underline");
   
   function title(type){
     if(type=='log'){
       return "Distribution vs BodyMass (Log Scaled Axis)";
     } else{ return "Distribution vs BodyMass";};
   };

   var chart = Chart.select('#chart')
                 .style("width", width+margin.left+margin.right+'px')
                 .style("height",height+margin.top+margin.bottom+'px')
                 .append('svg')
                 .attr("width", width+margin.left+margin.right)
                 .attr("height",height+margin.top+margin.bottom)
                 .append("g")
                 .attr("transform","translate("+ margin.left+","+margin.top+")");
   
   

   var legend = Chart.select('#legend').append('svg')
                 .attr("width", legendWidth)
                 .attr("height",legendHeight)
                 .append("g");


   var xScale = d3.scale['linear']()
                  .range([0,width]);

   var yScale = d3.scale['linear']()
                  .range([height,0]);
                 
   
d3.tsv("data.tsv",type,function(error,data){
   console.log(data[0]);
   if(Scale=='log'){
       data.forEach(function(d,i){
           d.Distribution = Math.log(d.Distribution);
           d.BodyMass = Math.log(d.BodyMass);
       });
   } else{;};
   var labels = d3.set(data.map(function(d) {
            return d.Species;
        })).values();
   console.log(labels);

   var ymax = d3.max(
       data.map(function(d){return d.Distribution;})
    );
   console.log(ymax);
   var ymin = d3.min(
       data.map(function(d){return d.Distribution;})
    );
   console.log(ymin);
   yScale.domain([ymin,ymax]);

   // there are some problems with the linear xScale
   var xmax = d3.max(
       data.map(function(d){return d.BodyMass;})
   );
   console.log(xmax);
   var xmin = d3.min(
       data.map(function(d){return d.BodyMass;})
   );
   console.log(xmin);
   xScale.domain([xmin,xmax]);

   var xAxis = d3.svg.axis()
                 .scale(xScale)
                 .innerTickSize(-height)
                 .outerTickSize(3)
                 .orient("bottom");

   var yAxis = d3.svg.axis()
                 .scale(yScale)
                 .innerTickSize(-width)
                 .outerTickSize(3)
                 .orient("left");


   var xAxisDraw = chart.append("g")
        .attr("class","x axis") //what is the difference between it and 'classed'?
        .attr("transform","translate(0,"+height+")")
        .call(xAxis)
        //.attr("class","x axis label")

   
   var yAxisDraw = chart.append("g")
        .attr("class","y axis")
        .call(yAxis)

    
   /* ignore this first

   var shape = {"Lagomorpha":"circle",
   "Didelphimorphia":"square",
   "Dasyuromorphia":"triangle-up"};

   chart.append("svg:defs").selectAll("symbol")
    .data(["Lagomorpha","Didelphimorphia","Dasyuromorphia"])      // Different types can be defined here
    .enter().append("svg:symbol")
    .attr("id", String)
    .append("g")
    .each(function(d,i){
        var g = d3.select(this);
        g.append(shape[d]);
    })
    ;
    */

    //Type Generator

    var symbolTypes = {
    "Lagomorpha": d3.svg.symbol().type("circle"),
    "Didelphimorphia": d3.svg.symbol().type("square"),
    "Dasyuromorphia": d3.svg.symbol().type("triangle-up"),
        };

    
    chart.selectAll("path")
		    .data(data)
		    .enter().append("path")
		    .attr("class", function(d){
		        return 'dot '+d.Species;
		    })
            .attr("transform", function(d) { return "translate(" + xScale(d.BodyMass)  + "," +  yScale(d.Distribution) + ")"; })
        .attr("d", function(d){
            return symbolTypes[d.Species]();
        })
        ;
    
    // Add legend
    legend.append("rect")
          .attr("x",0)
          .attr("y",0)
          .attr("width",legendWidth)
          .attr("height",legendHeight)
          .style("stroke",'black')
          .style("fill","none")
    
     var labels = d3.set(data.map(function(d) {
            return d.Species;
        })).values();
     console.log(labels);

     labels.forEach(function(d,i){
         var x = 15;
         var y = 15 + 20 * i;

         var symbolTypes = {
         "Lagomorpha": d3.svg.symbol().type("circle"),
         "Didelphimorphia": d3.svg.symbol().type("square"),
         "Dasyuromorphia": d3.svg.symbol().type("triangle-up"),
         };

         legend.append('path')
               .attr("class", "dot "+d)
               .attr("d",symbolTypes[d]())
               .attr("transform","translate("+x+","+y+")");

         legend.append("text")
               .text(d)
               .attr("x",x+10)
               .attr("y",y)
               .attr('dominant-baseline', 'central');
               
               
     });

    yAxisDraw
  .append("text")
  .attr("class","y axis label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text(axisLabel("Distribution",Scale));

    xAxisDraw
  .append("text")
  .attr("class","x axis label")
    .attr("x", 500)
    .attr("dy", "-.5em")
    .style("text-anchor", "end")
    .text(axisLabel("BodyMass",Scale));

    function axisLabel(name,type){
       if(type=='log'){
       return name + "(log)";
       } else{ return name;};
    };
                 

    });

// not quite understand how this works..
function type(d) {
  d.Distribution = +d.Distribution;
  d.BodyMass = +d.BodyMass; 
  return d;
};
};