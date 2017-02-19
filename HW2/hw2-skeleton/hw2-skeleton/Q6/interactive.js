var margin = {top:60,right:450,bottom:90,left:110}
var width = 1160 - margin.right - margin.left;
var height = 640 - margin.top - margin.bottom;

var data = [{product:'Product A',freq:{Q1:576, Q2:1176, Q3:1009, Q4:494}},
{product:'Product B',freq:{Q1:959, Q2:1653, Q3:1999, Q4:697}},
{product:'Product C',freq:{Q1:3210, Q2:4220, Q3:1648, Q4:919}},
{product:'Product D',freq:{Q1:589, Q2:2043, Q3:1153, Q4:911}},
{product:'Product E',freq:{Q1:2599, Q2:1333, Q3:818, Q4:1713}},
{product:'Product F',freq:{Q1:431, Q2:324, Q3:715, Q4:421}},
{product:'Product G',freq:{Q1:1457, Q2:2557, Q3:2245, Q4:762}},
{product:'Product H',freq:{Q1:2573, Q2:3357, Q3:1598, Q4:1287}}];

data.forEach(function(d){
    d.totalFreq = d.freq.Q1+ d.freq.Q2 + d.freq.Q3 + d.freq.Q4;
})

var chart = d3.select("#chart")
var svg = chart.select("#mainchart")
            .style("width",width+margin.left+margin.right+'px')
            .style("height",height+margin.top+margin.bottom+'px')
            .append("svg")
            .attr('width',width+margin.left+margin.right)
            .attr('height',(height+margin.top+margin.bottom))
            .append('g')
            .attr("transform",'translate('+margin.left+','+(margin.top)+')');  

var x = d3.scale.linear()
          .range([0,width])
          .domain([0,d3.max(data.map(function(d){return d.totalFreq;}))]);

var y = d3.scale.ordinal()
          .rangeBands([0,height])
          .domain(data.map(function(d){return d.product;}))

var yStep = y(data[1].product)-y(data[0].product);
var gap = 0.3;

var subWidth = margin.right - margin.left - 10;
var subHeight = 3* yStep;
/*
var subsvg = chart.select("#subchart")
                     .append("svg")
                     .attr('width',subWidth + subMarginLeft)
                     .attr('height',subHeight)
                     .append('g')
                     .attr("transform",'translate('+subMarginLeft+',0)')
*/
    
var bar = svg.selectAll(".bar")
   .data(data);

   bar.enter().append("rect")
      .attr("class","bar")
      .attr("x",20)
      .attr("y",function(d,i){
          return y(d.product);
      })
      .attr("width",function(d){
          return x(d.totalFreq);
      })
      .attr("height",(1-gap) * yStep)
      .style("fill","grey")
      .on('mouseover',over)
      .on('mouseout',out);

//text alignment
//https://bl.ocks.org/emmasaunders/0016ee0a2cab25a643ee9bd4855d3464
   bar.enter().append("text")
      .attr("class","number")
      .attr("x",40)
      .attr("y",function(d,i){
          return y(d.product) +(1-gap) * yStep/2;
      })
      .text(function(d){return "$"+d.totalFreq;});

   bar.enter().append("text")
      .attr("class","product name")
      .attr("x",-70)
      .attr("y",function(d,i){
          return y(d.product) +(1-gap) * yStep/2;
      })
      .text(function(d){return d.product;})

function over(d){
    d3.select(this).style('fill', 'rgb(50,150,200)');
    interact(d);
};

function out(d){
    d3.select(this).style('fill','grey');
    interact(0);
};

function interact(curState){
    if(curState){
        var subData = [];
        Object.keys(curState.freq).forEach(function(d){
            subData.push({'Quarter':d, 'Freq':curState.freq[d]});
        })
    } else {
        subData = [];
    }
            console.log(subData.length);
   
    
    var subChart = svg.selectAll('g')
                         .data(subData);
    
    if(subData.length == 0){
    subChart.exit().remove();

    }else{
   

    var subX = d3.scale.linear()
          .range([0,subWidth])
          .domain([0,d3.max(subData.map(function(d){return d.Freq;}))]);

    var subY = d3.scale.ordinal()
          .rangeBands([0,subHeight])
          .domain(subData.map(function(d){return d.Quarter;}))

    var subYStep = subY(subData[1].Quarter)-subY(subData[0].Quarter);

    var drawing = subChart.enter().append('g');
    drawing
            .append('rect')
            .attr("class","subBar")
            .attr("x",width+margin.left)
            .attr("y",function(d,i){
                return subY(d.Quarter);
            })
            .attr("width",function(d){
                return subX(d.Freq);
            })
            .attr("height",(1-gap) * subYStep)
            .style("fill",'rgb(50,150,200)')

    drawing.append("text")
      .attr("class","quarter name")
      .attr("x",width+margin.left-30)
      .attr("y",function(d,i){
          return subY(d.Quarter) +(1-gap) * subYStep/2;
      })
      .text(function(d){return d.Quarter;})

    drawing.append("text")
      .attr("class","sub number")
      .attr("x",width+margin.left+10)
      .attr("y",function(d,i){
          return subY(d.Quarter) +(1-gap) * subYStep/2;
      })
      .text(function(d){return "$"+d.Freq;});

    
     


    }; // end of else
};




