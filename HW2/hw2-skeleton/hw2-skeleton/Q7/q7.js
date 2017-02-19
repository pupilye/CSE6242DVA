var width = 1100;
var height = 640;
var svg = d3.select("#choropleth").append("svg")
            .attr("width",width)
            .attr("height",height);


var projection = d3.geo.albersUsa();
var path = d3.geo.path()
             .projection(projection);

var earnings = d3.map();
var sats = d3.map();


d3.queue()
  .defer(d3.json,"us.json")
  .defer(d3.csv,"sat_scores.csv",function(d){
      //console.log(d);
      return{
          id : +d.id,
          name: d.name,
          sat_avg: +d.sat_avg,
      };})
  .defer(d3.json,"median_earnings.json") // id,median_earnings
  .await(ready);

function ready(error,us,sat,earn){
    earn.forEach(function(d){
        earnings.set(d.id,d.median_earnings);
    });

var sorted = d3.nest()
    .key(function(d) { return d.id; })
    .sortKeys(d3.ascending)
    .entries(sat);

    sorted.forEach(function(d){
        //console.log(d);
        d.values = d.values.sort(function(x,y){
            return d3.descending(x.sat_avg,y.sat_avg);
        });
        sats.set(d.key,d.values);
        return d;
    });

    var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([160, 80])
                .html(function(d) {
                    var state = d.id;
                    //console.log(state);
                    //Something Wrong here!!Mapping Wrongly!!
                    var univs = sats.get(state);
                    //console.log(univs)
                //return "<strong>Frequency:</strong> <span style='color:red'>" + d.id + "</span>";
                    var string = '<div style="text-align: center;">';
                    univs.forEach(function(d){
                        string +="<span style='color:white'>" + d.name + ": (SAT: " + d.sat_avg+ ")<br/></span>";
                    })
                    return string + '</div>';
                })
    
    svg.call(tip);
    
    var map = svg.selectAll("append")
                 .data(topojson.feature(us,us.objects.states).features)
                 .enter().append("path")
                 .attr("d",path)
                 .on('mouseover',tip.show)
                 .on('mouseout',tip.hide);

    var range = d3.extent(earn,function(d){return d.median_earnings});
    //console.log(range);
    var color = d3.scale.threshold()
                  .range(d3.schemeGreens[7])
                  .domain([15000,18000,21000,24000,27000,30000,33000]);
    

   //console.log(earn.get(3));
    map.attr("fill", function(d){return color(earnings.get(d.id));})
    .attr("stroke","#000");

    var g = svg.append("g")
               .attr("class","key")
               .attr("transform","translate(850,0)");
    var y = d3.scale.linear()
              .domain([15000,33000])
              .rangeRound([240,360]);
           
    var yStep = y(18000)-y(15000);

    var boxW = 20;
    var legend = g.selectAll("g")
     .data(color.domain()).enter();
     
     legend.append("rect")
     .attr("height",boxW)
     .attr("y",function(d){return y(d);})
     .attr("width",boxW)
     .attr("fill",function(d){return color(d)});

    legend.append("text")
     .attr("class","legend")
     .attr("x", boxW+ 10)
     .attr("y",function(d){return y(d)+yStep/2;})
     .text(function(d){return '$'+d;})


     


}