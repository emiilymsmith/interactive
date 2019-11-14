(function() {
    var margin = {top: 50, left: 50, right: 50, bottom: 50},
        height = 400 - margin.top - margin.bottom,
        width = 800 - margin.left - margin.right;
    
    var svg = d3.select("#map")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width",  width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.queue()
    .defer(d3.json, "NewYork.json")
    // .defer(d3.csv, "1_2013-01-01.csv")
    .await(ready)

var projection = d3.geo.albers()
    .center([22, 40.55])
    .translate([ width/2 , height /2])
    .scale(16000) 

var path = d3.geoPath()
    .projection(projection)

var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
    .style("visibility", "hidden")
    .text("a simple tooltip");
    
//callback function    
function ready (error, data) {
    console.log('This is data', data)

   var county = topojson.feature(data, data.objects.tl_2018_36_cousub).features

   console.log('This is county', county)
//    Object.keys(county).forEach(function (item) {
//             // console.log(item); // key, this is the number its associated to.
//             // console.log(county[item]); // value
//             console.log(county[item].properties.NAME);
//         }
//    );
// uncomment upper block out

   Object.keys(county).forEach(function (item) {
        console.log('to bind', item, '+', county[item].properties.NAME);
        }
    );

    svg.selectAll(".county")
    .data(county)
    .enter().append("path")
    .attr("class", "county")
    .attr("d", path)
    .on('mouseover', function(d) {
        tooltip.style("visibility", "visible");
        console.log(d.properties.NAME)
        tooltip.text(d.properties.NAME)
    })
    .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
    .on("click",function(d){
      if(d3.select(this).classed("selected"))
          d3.select(this).classed("selected", false)
      else
          d3.select(this).classed("selected", true)
    })
    .on('mouseout', function(d) {
      tooltip.style("visibility", "hidden");
    })

    /* csv */
    

}

})();