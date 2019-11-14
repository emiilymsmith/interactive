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
    .defer(d3.csv, "/EMS_by_month/1_2013-01-01.csv",function(d) {
        return {
          id : d.CAD_INCIDENT_ID,
          incidentDT : d.INCIDENT_DATETIME,
          initCallType : d.INITIAL_CALL_TYPE,
          initSeverLevel : d.INITIAL_SEVERITY_LEVEL_CODE,
          finalCallType : d.FINAL_CALL_TYPE,
          finalSeverLevel : d.FINAL_SEVERITY_LEVEL_CODE,
          firstAssignDT : d.FIRST_ASSIGNMENT_DATETIME,
          validDisp : d.VALID_DISPATCH_RSPNS_TIME_INDC,
          dispResponse : +d.DISPATCH_RESPONSE_SECONDS_QY,
          firstActiDT : d.FIRST_ACTIVATION_DATETIME,
          firstOnSceneDT : d.FIRST_ON_SCENE_DATETIME,
          validInciRT : d.VALID_INCIDENT_RSPNS_TIME_INDC,
          inciResp : +d.INCIDENT_RESPONSE_SECONDS_QY,
          inciTrav : +d.INCIDENT_TRAVEL_TM_SECONDS_QY,
          firstToHospDT : d.FIRST_TO_HOSP_DATETIME,
          firstHospADT : d.FIRST_HOSP_ARRIVAL_DATETIME,
          inciCloseDT : d.INCIDENT_CLOSE_DATETIME,
          HeldIndi : d.HELD_INDICATOR,
          inciDispoCode : d.INCIDENT_DISPOSITION_CODE,
          borough : d.BOROUGH,
          inciDispArea : d.INCIDENT_DISPATCH_AREA,
          zipcode : d.ZIPCODE,
          policePrecinct : d.POLICEPRECINCT,
          cityCouncilDistrict : d.CITYCOUNCILDISTRICT,
          communityDistrict : d.COMMUNITYDISTRICT,
          schoolDistrict : d.COMMUNITYSCHOOLDISTRICT,
          congressionalDistrict : d.CONGRESSIONALDISTRICT,
          reopenFlag : d.REOPEN_INDICATOR,
          specialEventFlag : d.SPECIAL_EVENT_INDICATOR,
          standbyFlag : d.STANDBY_INDICATOR,
          transferFlag : d.TRANSFER_INDICATOR,
        };
      }
    )
    .await(ready)

var projection = d3.geo.albers()
    .center([21.5, 43])
    .translate([ width/2 , height /2])
    .scale(3750) 

var path = d3.geoPath()
    .projection(projection)

var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
    .style("visibility", "hidden")
    .text("a simple tooltip");
    
function updateSelected(that,d,datum){
    console.log(datum[0].borough);
    console.log(d.properties.NAME);
    count = 0;
    datum.forEach(report => {
        console.log("loop: ",report.borough, " check: ",d.properties.NAME)
        
    });
    console.log(count);
}
//callback function    
function ready (error, data, datum) {
    console.log('this is datum', datum)
    console.log('This is data', data)
   //var csv = csv.feature(data,data.)
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
        //console.log('to bind', item, '+', county[item].properties.NAME);
        }
    );

    svg.selectAll(".county")
    .data(county)
    .enter().append("path")
    .attr("class", "county")
    .attr("d", path)
    .on('mouseover', function(d) {
        tooltip.style("visibility", "visible");
        //console.log(d.properties.NAME)
        tooltip.text(d.properties.NAME)
    })
    .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
    .on("click",function(d){
        if(d3.select(this).classed("selected"))
            d3.select(this).classed("selected", false)
        else
            d3.select(this).classed("selected", true)
        updateSelected(this,d,datum);
    })
    .on('mouseout', function(d) {
      tooltip.style("visibility", "hidden");
    })

    /* csv */
    

}

})();