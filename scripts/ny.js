
var nyMap = function(){
  var margin = {top: 50, left: 50, right: 50, bottom: 50},
    height = 400 - margin.top - margin.bottom,
    width = 550 - margin.left - margin.right;

  var svg = d3.select("#map")
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width",  width + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  
  var selectedList = [];
  var selectedCount = 0;
  updateMonth();
  d3.queue().defer(d3.json, "NewYork.json").await(ready);

  var projection = d3.geo.albers()
    .center([22.1, 40.67])
    .translate([ width/2 , height /2])
    .scale(36500);

  var path = d3.geoPath()
    .projection(projection);

  var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("a simple tooltip");

  /**
   *  Called when a borough is clicked to update list of boroughs.
   *  Updates legend with borough count.
   */
  function updateSelected(that,d){
    if(d3.select(that).classed("selected")){
      d3.select(that).classed("selected", false)
      selectedList = selectedList.filter(function(value, index, arr){return value != d;});
      --selectedCount;
    }
    else{
      d3.select(that).classed("selected", true)
      selectedList[selectedCount] = d;
      ++selectedCount;
    }
    updateLegend();
  }

  /**
   * Collects data to display
   */
  function updateData(){
    count = 0;
    totalResponseTime = [];
    countPerBorough = [];
    numSelections = 0;

    selectedList.forEach(selected => {  
      totalResponseTime[numSelections] = 0;
      countPerBorough[numSelections] = 0;
      var checkName = (selected.properties.NAME).toUpperCase();
      datum.forEach(file => {
        file.forEach(report => {
          if ((report.borough) == checkName || (report.borough) == "RICHMOND / " + checkName){
            ++count;
            totalResponseTime[numSelections] += report.inciResp;
            ++countPerBorough[numSelections];
          }
        })
      })
      ++numSelections;
    });

    var statistics = { totalResponseTime:totalResponseTime, countPerBorough:countPerBorough, numSelections:numSelections, count:count };
    return statistics;
  }

  /**
   * Updates the legend to display the correctly formatted data.
   */
  function updateLegend() {
    var statistics = updateData();
    var avg = 0;
    for(i=0; i<statistics.numSelections; i++){
      avg += statistics.totalResponseTime[i]/statistics.countPerBorough[i];
    }
    avg /= statistics.numSelections;
    if(statistics.numSelections == 0){
      document.getElementById("count").innerText = "Please select a borough.";
      document.getElementById("avgResponseT").innerText = "Please select a borough.";
    } else {
      document.getElementById("count").innerText = statistics.count;
      document.getElementById("avgResponseT").innerText = secToMin((avg).toFixed(2));
    }
  }

  /**
   *  Callback function.
   */
  function ready (error, data) {
    var county = topojson.feature(data, data.objects.tl_2018_36_cousub).features;

    svg.selectAll(".county")
    .data(county)
    .enter().append("path")
    .attr("data-legend", function(d) { return d.properties.NAME})
    .attr("class", "county")
    .attr("d", path)
    .on('mouseover', function(d) {
      tooltip.style("visibility", "visible");
      tooltip.text(d.properties.NAME)
    })
    .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
    .on("click",function(d){
      updateSelected(this,d,datum);
    })
    .on('mouseout', function(d) {
      tooltip.style("visibility", "hidden");
    })
  }
  return updateLegend;
};
var firstVis = nyMap();
function secToMin(sec){
  min = Math.floor(sec/60);
  sec = Math.floor(sec) % 60;
  if(sec < 10){
    sec = '0' + sec;
  }
  return min + " min " + sec + " secs"
}