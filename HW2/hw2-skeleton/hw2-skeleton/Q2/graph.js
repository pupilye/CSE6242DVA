var nodes = {};

// Compute the distinct nodes from the links.
links.forEach(function(link) {
    link.source = nodes[link.source] ||
        (nodes[link.source] = {name: link.source});
    link.target = nodes[link.target] ||
        (nodes[link.target] = {name: link.target});
});

var width = 960,
    height = 800,
    color = d3.scale.category20c();


var force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([width, height])
    .linkDistance(60)
    .charge(-250)
    .on("tick", tick)
    .start();

// Set the range
var  v = d3.scale.linear().range([0, 100]);

// Scale the range of the data
v.domain([0, d3.max(links, function(d) { return d.value; })]);


var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// build the arrow.
svg.append("svg:defs").selectAll("marker")
    .data(["end"])      // Different link/path types can be defined here
  .enter().append("svg:marker")    // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

// add the links and the arrows
var path = svg.append("svg:g").selectAll("path")
    .data(force.links())
  .enter().append("svg:path")
    .attr("class", function(d) { return "link " + d.type; })
    .attr("style", function(d){
       var color = ['blue', 'green', 'red'];
       if (d.value<1.0){
          return "stroke:" + color[0];
       } else if (d.value>=1.0 && d.value<=2.0){
          return "stroke:" + color[1];
       } else {
          return "stroke:" + color[2];
       }
    })
    ;

// the double click event is 'ondblclick'

// define the nodes
var node = svg.selectAll(".node")
    .data(force.nodes())
  .enter().append("g")
    .attr("class", "node")
    .call(force.drag);

// add the nodes
// the degree is already been calculated and store in the weight
// deside a scale for the radius of the nodes

degreeMax = d3.max(d3.values(nodes).map(function(d){
   return d.weight;
}));
/* sqrt scale
rScale = d3.scale.pow().exponent(.5)
           .range([0,10])
           .domain([0, degreeMax]);
*/

// linear scale
rScale = d3.scale.linear()
           .range([0,20])
           .domain([0,degreeMax]);

node.append("circle")
    .attr("r", function(d){
       return rScale(d.weight);   
       } )
    .on('dblclick',function(d){
       d.fixed = !d.fixed;
       d3.select(this)
         .classed("fixed",d.fixed);
    });


// add the nodes labels
node.append("text")
    .text(function(d){return d.name;});

// add the curvy lines
function tick() {
    path.attr("d", function(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" +
            d.source.x + "," +
            d.source.y + "A" +
            dr + "," + dr + " 0 0,1 " +
            d.target.x + "," +
            d.target.y;
    });

    node
        .attr("transform", function(d) {
		    return "translate(" + d.x + "," + d.y + ")"; });
};

