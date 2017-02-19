var margin = {top:60,right:150,bottom:90,left:110}
var width = 960 - margin.right - margin.left;
var height = 640 - margin.top - margin.bottom;

var title = d3.select('#title')
              .append('svg')
              .attr('width',width+margin.right+margin.left)
              .attr('height',25);
              
     title.append('text')
              .text('Power Usage Heatmap')
              .attr('x',1/2*(width+margin.right+margin.left))
              .attr('y',18)
              .attr('text-anchor','middle');

var x = d3.time.scale()
          .range([0,width]);

var y = d3.scale.linear()
          .range([height,0]);

var z = d3.scale.linear()
          .range(['rgb(255,230,230)','rgb(255,0,0)'])


var formatDate = d3.time.format('%b');

d3.csv('heatmap.csv',type,function(error,data){

var groupedValue = d3.nest()
  .key(function(d) { return d.zip; })
  .sortKeys(d3.ascending);

  var usageByZip = groupedValue.map(data);
  var zipCode = groupedValue.entries(data)
                  .map(function(o){return o.key});
  var Usage = usageByZip["90077"];
  //console.log(uniqueZip)


  var select = d3.select('#selectbox')
               .append('select')
  	           .attr('class','select')
               .on('change',updateData)

  var option = select.selectAll('option')
                   .data(zipCode)
                   .enter()
                   .append("option")
                   .text(function(d){return d;})
  
  var chart = d3.select('#heatmap')
              .append('svg')
              .attr('width',(width+margin.right+margin.left))
              .attr('height',(height+margin.top+margin.bottom))
              .append('g')
              .attr("transform",'translate('+margin.left+','+(margin.top)+')');  
  
  x.domain(d3.extent(Usage,function(d){return d.month}));
  y.domain(d3.extent(Usage,function(d){return d.year}));

  var xStep = (x(new Date(1900,1,0)) - x(new Date(1900,0,1))); // 30 days
  var yStep = 1;

  var xAxis = d3.svg.axis()
              .scale(x)
              .ticks(d3.time.month)
              .tickFormat(formatDate)
              .orient("bottom");

  var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left")

  chart.append("g")
     .attr("class","x axis")
     .attr("transform","translate(0,"+(height+y(0)-y(0.6))+")")
     .call(xAxis)
     .append("text")
     .attr("class","label")
     .attr("x",width+1.0*(xStep))
     .attr("y",y(0)-y(0.3))
     .attr("text-anchor","end")
     .text("Month")
     ;

  chart.append("g")
     .attr("class","y axis")
     .attr("transform","translate("+(- 0.6*(xStep)+",0)"))
     .call(yAxis)

     .append("text")
     .attr("class","label")
     .attr("x",(-0.5)*(xStep))
     .attr("y",y(0.3)-y(0))
     //.attr("x",width+1.0*(x(new Date(1900,1,0)) - x(new Date(1900,0,1))))
     //.attr("y",y(0)-y(0.3))
     //.attr("text-anchor","end")
     .text("Year")
     ;

    chart.append("text")
      .attr("class", "label")
      .attr("x", width + xStep)
      .attr("y", y(0)-y(0.1))
      .attr("dy", ".35em")
      .text("kWh");

  
  update("90077");

function update(selectValue){

    var Usage = usageByZip[selectValue];

    z.domain(d3.extent(Usage, function(d) { return d.power; }));

//I love this link.. save my life https://bost.ocks.org/mike/join/
//The methods only think about number of items in the data

var tiles =  chart.selectAll('.tile')
              .data([]);
    tiles.exit().remove();

var tiles =  chart.selectAll('.tile')
              .data(Usage);
  
    //tiles.attr("class","tile");  
/*    tiles.append('rect')
         .attr("class","tile")
         .attr('x',function(d){return x(d.month) - 1/2*(xStep);})
         .attr('y',function(d){return y(d.year+0.5);})
         .attr('width',function(d){
             return x(new Date(1900,+d.MonthValue,0)) - x(new Date(1900,+d.MonthValue-1,1));
         })
         .attr('height',y(0)-y(yStep))
         .style('fill',function(d){ return z(d.power)}); */

    tiles.enter().append('rect')
         .attr("class","tile")
         .attr('x',function(d){return x(d.month) - 1/2*(xStep);})
         .attr('y',function(d){return y(d.year+0.5);})
         .attr('width',function(d){
             return x(new Date(1900,+d.MonthValue,0)) - x(new Date(1900,+d.MonthValue-1,1));
         })
         .attr('height',y(0)-y(yStep))
         .style('fill',function(d){ return z(d.power)});
   

// Add Legend

var legends = chart
              .selectAll(".legend")
      .data([]);
    legends.exit().remove();

var legends = chart
              .selectAll(".legend")
      .data(z.ticks(6).slice(0).reverse());

    
var legend = legends.enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + (width+xStep) + "," + ((y(0)-y(0.3)) + i * (y(0)-y(0.4))) + ")"; });

  legend.append("rect")
      .attr("width", 1/3*xStep)
      .attr("height", 1/3*(y(0)-y(1)))
      .style("fill", z);

  legend.append("text")
      .attr("x", 26)
      .attr("y", 10)
      .attr("dy", ".35em")
      .text(String);



}; // end of the update function
  
function updateData() {
	selectValue = d3.select('select').property('value');

	update(selectValue);
  };//end of onchange()
    
});


function type(d){
    return {
        date: new Date(+d.Year,+d.Month-1,1),
        month: new Date(1900,+d.Month-1,1),
        MonthValue: d.Month,
        year: +d.Year,
        power: +d.Power,
        zip: d['Zip Code']
    }

}