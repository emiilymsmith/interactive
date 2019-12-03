var datum = [];
{
    var numDatum = 1;
    var curDatum = 0;
    var dropDown1 = d3.select(selectNumber).on('change',function(){updateMonth();});
    var dropDown2 = d3.select(selectNumber2).on('change',function(){updateMonth2();});
    /**
     *  Updates according to first month dropdown.
     */
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

    /**
     *  Updates according to second month dropdown.
     */
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
    /**
     *  Queue's csv data.
     */
    function queueMonth(){
        if(curDatum == 0) {
            document.getElementById("spin").style.visibility = 'visible';
        }
        var select = document.getElementById("selectNumber");
        for(i = 0;i<numDatum;++i){
            var q = d3.queue();
            q.defer(d3.csv, "EMS_by_month/" + select.options[select.selectedIndex + i].value,function(d) {
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
    /**
     *  Updates month range.
     */
    function updateDatum(error,data){
        datum[curDatum] = data;
        ++curDatum;

        if(curDatum == numDatum){
            document.getElementById("spin").style.visibility = 'hidden';
            firstVis();
            getData();
            updateFreqData();
            
        }
    }
}