function plotScatter(data,precinct){
  //set dimensions and margins
  var margin = {top: 10, right: 30, bottom: 30, left: 60},
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var Svg = d3.select("#scatter")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  /**
   *  Sorting by precinct
   *  Bronx         40-52
   *  Brooklyn      60-94
   *  Queens        100-115
   *  Staten Island 120-123
   */
  
   {

    // Add X axis
    var x = d3.scaleLinear()
      .domain([0, 25])
      .range([ 0, width ]);
    var xAxis = Svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, 80])
      .range([ height, 0]);
    Svg.append("g")
      .call(d3.axisLeft(y));

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = Svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);

    // Color scale: give me a specie name, I return a color
    
    var color = d3.scaleOrdinal()
      .domain(precinct)
      .range([ "#440154FF", "#3B528BFF" ,"#21908CFF", "#5DC963FF", "#FDE725FF"])

    // Add brushing
    var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
        .extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function

    // Create the scatter variable: where both the circles and the brush take place
    var scatter = Svg.append('g')
      .attr("clip-path", "url(#clip)")

    // Add circles
    scatter
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function (d) { return x(d.Sepal_Length); } )
        .attr("cy", function (d) { return y(d.Petal_Length); } )
        .attr("r", 8)
        .style("fill", function (d) { return color(d.Species) } )
        .style("opacity", 0.5)

    // Add the brushing
    scatter
      .append("g")
        .attr("class", "brush")
        .call(brush);

    // A function that set idleTimeOut to null
    var idleTimeout
    function idled() { idleTimeout = null; }

    // A function that update the chart for given boundaries
    function updateChart() {

      extent = d3.event.selection

      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if(!extent){
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        x.domain([ 4,8])
      }else{
        x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
        scatter.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
      }

      // Update axis and circle position
      xAxis.transition().duration(1000).call(d3.axisBottom(x))
      scatter
        .selectAll("circle")
        .transition().duration(1000)
        .attr("cx", function (d) { return x(d.Sepal_Length); } )
        .attr("cy", function (d) { return y(d.Petal_Length); } )

    } //update chart function

  };
};
tracked = null;
function getData(){
  if(tracked != null){
    piebar = document.getElementById("scatter");
    while (piebar.firstChild) {
      piebar.removeChild(piebar.firstChild);
    }
  }
tracked = "something";
  var data = [];
  i = 0;
  var precinct = [[40,52,"Bronx"], [60,94,"Brooklyn"], [100,115,"Queens"], [120,123,"Staten Island"]];
  precinct.forEach(district => {
    index = -1; // represents 1 day
    idk = []; //rename, keeps track of 4 different numeric values per day
    count = 0;
    
    datum.forEach(file => {
      file.forEach(report => {
        if(index == -1 || getDate(report.incidentDT) != idk[index][0]){
          index++;
          idk[index] = [];
          idk[index][0] = getDate(report.incidentDT); // move it to the day were working on
          idk[index][1] = 0;
          idk[index][2] = 0;
          idk[index][3] = 0;
          idk[index][4] = 0;
          idk[index][5] = district[2];
        }
        if(report.policePrecinct >= district[0] && report.policePrecinct <= district[1]){
          if(report.finalCallType == "ARREST")
            ++idk[index][1];
          if(report.finalCallType == "INJURY")
            ++idk[index][2];
          if(report.finalCallType == "ABDPN")
            ++idk[index][3];
          if(report.finalCallType == "INJMAJ")
            ++idk[index][4];
        }
        

      })
    })
    idk.forEach(day =>{
      data[i] = {Sepal_Length:day[1],Sepal_Width:day[2],Petal_Length:day[3],Petal_Width:day[4],Species:day[5]};
      ++i
    })
    console.log(data);
  });
  names = [];
  {
    i = 0;
    precinct.forEach(area =>{
      names[i++]=area[2];
    })
  }
  plotScatter(data,names);
};
function getDate(date){
  var day = date.split(" ");
  return day[0];
};