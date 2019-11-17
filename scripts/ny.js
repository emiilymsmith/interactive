(function() {
  var margin = {top: 50, left: 50, right: 50, bottom: 50},
    height = 400 - margin.top - margin.bottom,
    width = 550 - margin.left - margin.right;

  var dropDown1 = d3.select(selectNumber).on('change',function(){updateMonth();});
  var dropDown2 = d3.select(selectNumber2).on('change',function(){updateMonth2();});
  var svg = d3.select("#map")
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width",  width + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var datum = [];
  var numDatum = 1;
  var curDatum = 0;
  var selectedList = [];
  var selectedCount = 0;
  updateMonth();
  d3.queue().defer(d3.json, "NewYork.json").await(ready);

  var projection = d3.geo.albers()
    .center([22, 40.55])
    .translate([ width/2 , height /2])
    .scale(16000);

  var path = d3.geoPath()
    .projection(projection);

  var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("a simple tooltip");

  function updateMonth(){
    datum = [];
    var select = document.getElementById("selectNumber");
    var selected = select.options[select.selectedIndex].value; 
    var select2 = document.getElementById("selectNumber2");
    var selected2 = select.options[select2.selectedIndex].value; 
    
    if(parseInt(selected.split("-")[0])>parseInt(selected2.split("-")[0])){
      select2.selectedIndex = select.selectedIndex;
      selected2 = select.options[select2.selectedIndex].value;
    }

    numDatum = 1 + (parseInt(selected2.split("-")[0]) - parseInt(selected.split("-")[0]));
    curDatum = 0;
    queueMonth();
  }

  function updateMonth2(){
    datum = [];
    var select = document.getElementById("selectNumber");
    var selected = select.options[select.selectedIndex].value; 
    var select2 = document.getElementById("selectNumber2");
    var selected2 = select.options[select2.selectedIndex].value; 
    
    if(parseInt(selected.split("-")[0])>parseInt(selected2.split("-")[0])){
        select.selectedIndex = select2.selectedIndex;
        selected = select.options[select.selectedIndex].value;
    }

    numDatum = 1 + (parseInt(selected2.split("-")[0]) - parseInt(selected.split("-")[0]));
    curDatum = 0;
    queueMonth();
  }

  function queueMonth(){
    var select = document.getElementById("selectNumber");
    for(i = 0;i<numDatum;++i){
      var q = d3.queue();
      q.defer(d3.csv, "/EMS_by_month/" + select.options[select.selectedIndex + i].value,function(d) {
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
      });
      q.await(updateDatum);
    }
  }

  function updateDatum(error,data){
    datum[curDatum] = data;
    ++curDatum;

    if(curDatum == numDatum)
      updateData();
  }

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
    updateData();
  }

  function updateData(){
    count = 0;
    selectedList.forEach(selected => {  
      var checkName = (selected.properties.NAME).toUpperCase();
      datum.forEach(file => {
        file.forEach(report => {
          if ((report.borough) == checkName || (report.borough) == "RICHMOND / " + checkName){
            ++count;
            //TODO: use this to connect data to map/ maybe generate a chart with data? I dunno
          }
        })
      })
    });
    console.log("number of incidents reported in selected area(s): ",count);
  }

  function legend() {
    legend = svg.append("g")
      .attr("class","legend")
      .attr("transform","translate(50,30)")
      .style("font-size","12px")
      .call(d3.legend);
  }

  //callback function    
  function ready (error, data) {
    console.log('This is data', data);
    //var csv = csv.feature(data,data.)
    var county = topojson.feature(data, data.objects.tl_2018_36_cousub).features;
    console.log('This is county', county);
    //    Object.keys(county).forEach(function (item) {
    //             // console.log(item); // key, this is the number its associated to.
    //             // console.log(county[item]); // value
    //             console.log(county[item].properties.NAME);
    //         }
    //    );
    // uncomment upper block out

    svg.selectAll(".county")
    .data(county)
    .enter().append("path")
    .attr("data-legend", function(d) { return d.properties.NAME})
    .attr("class", "county")
    .attr("d", path)
    .on('mouseover', function(d) {
      tooltip.style("visibility", "visible");
      //console.log(d.properties.NAME)
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

})();