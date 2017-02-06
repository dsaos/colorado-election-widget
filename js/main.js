
var contestData = [];
var contestTemplate = $("#template1").html();

//template for a row
var choiceTemplate = '<td><strong class="choice-name"></strong></td>                    <td class="choice-value"></td>                    <td>                     <div class="choice-percentage2 hidden-xs" style="float:left;margin-right:5px;color:#000000; width:50px;"></div>                                          <div class="progress">                        <div class="progress-bar neutral choice-percentage" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;">                        </div>                      </div>                    </td>';



$(document).ready(function() {
    //set tracked races based on checked boxes
    $("input[type=checkbox][checked]").each(function() {
      var humanTitleChecker = $(this).parent("label").text();
      if (typeof $(this).attr("contest-title") != "undefined" && $(this).attr("contest-title").length > 0)
        humanTitleChecker = $(this).attr("contest-title");
      contestData.push({
        contestTitle: $(this).attr("contest-name"),
        humanTitle: humanTitleChecker,
        id: $(this).attr("value"),
        cprCoverage: $(this).attr("cpr-coverage"),
        percentReporting: 0,
        totalVotes: 0,
        choices: []
      });
    });

    //do first load
    var xml = $.ajax("http://widgets.cpr.org/2016/election-widget/data/detail_CO.xml").done(function() {
      updateContestData(xml.responseText);
      setupTables(true);
    }).fail(function() {console.log("failed initial load!");});

    //set up recurring load
    setInterval(function() {
      var xml = $.ajax("http://widgets.cpr.org/2016/election-widget/data/detail_CO.xml").done(function() {
        console.log("successfully refreshed detail.xml");
        updateContestData(xml.responseText);
        setupTables(false);
      }).fail(function() {console.log("failed!");});
    }, 1000 * 60);

    //handle race changes
    $("#clearRacesButton").click(function() {
      $("input[type=checkbox]:checked").attr("checked", false);
    });

    //handle race changes
    $("#showRacesButton").click(function() {
      contestData = [];
      $("input[type=checkbox]:checked").each(function() {
        var humanTitleChecker = $(this).parent("label").text();
        if (typeof $(this).attr("contest-title") != "undefined" && $(this).attr("contest-title").length > 0)
          humanTitleChecker = $(this).attr("contest-title");
        contestData.push({
          contestTitle: $(this).attr("contest-name"),
          humanTitle: humanTitleChecker,
          id: $(this).attr("value"),
          cprCoverage: $(this).attr("cpr-coverage"),
          percentReporting: 0,
          totalVotes: 0,
          choices: []
        });
      });
      updateContestData(xml.responseText);
      setupTables(true);
    });

    var panelIsHidden = true;

    $(".panel-heading").click(function() {
      if (panelIsHidden == true) {
        $(this).next("#filterRacesPanel").hide().removeClass("hidden");
        panelIsHidden = false;
        $(".alert").alert("close");
      }
      $(this).next(".panel-body").toggle();
      $(this).find(".glyphicon").toggleClass("glyphicon-chevron-down");
      $(this).find("small").toggle();
      pymChild.sendHeight();
    });

  }); //end $(document).ready()


  //set up pym outside of docready for embedding purposes
  var pymChild = new pym.Child({polling:500});



  function setupTables(doInitialSetup) {
    //this creates all the tables for the checked boxes, now set in contestData array
    //see "updateTables()" for how updates are handled
    if (doInitialSetup == true)
      $("#tableHolder").html("");
    for (i = 0; i < contestData.length; ++i) {
      //create from our template
      if (doInitialSetup == true) {
        $("#tableHolder").append("<div id='contest"+i+"Well' class=''>"+contestTemplate+"</div>");
        $("#contest"+i+"Well .contest-title").html(contestData[i].humanTitle);
        if (typeof contestData[i].cprCoverage != "undefined" && contestData[i].cprCoverage.length > 0)
            $("#contest"+i+"Well .contest-info").append("<a class='btn btn-sm btn-default' href='"+contestData[i].cprCoverage+"' target='_blank'>Read CPR Coverage</a>");
      }
      //change out contest content
      $("#contest"+i+"Well .reporting-percentage").html(parseInt(contestData[i].percentReporting)+"% of precincts<br />completely reported");

      //change out choices table content
      $("#contest"+i+"Well .contest-data").html("");
      for (j = 0; j < contestData[i].choices.length; ++j) {

        //get row syntax from the template
        $("#contest"+i+"Well .contest-data").append('<tr id="contest'+i+'Choice'+j+'Data" class="'+contestData[i].choices[j].color+'">'+choiceTemplate+'</tr>');

        $("#contest"+i+"Choice"+j+"Data .choice-name").text(contestData[i].choices[j].label);
        if (typeof contestData[i].choices[j].party != "undefined" && contestData[i].choices[j].party.length > 1 && contestData[i].choices[j].party.indexOf("/") == -1 ) {
          $("#contest"+i+"Choice"+j+"Data .choice-name").append("<em class='candidate-party'>("+contestData[i].choices[j].party + ")</em>");
          $("#contest"+i+"Well th:eq(0)").text("Candidate");
        }
        $("#contest"+i+"Choice"+j+"Data .choice-value").text(contestData[i].choices[j].value);

        var choicePercentage = contestData[i].choices[j].value / contestData[i].totalVotes * 100 || 0;
        choicePercentage = choicePercentage.toFixed(1);
        $("#contest"+i+"Choice"+j+"Data .choice-percentage").attr("aria-valuenow",choicePercentage);
        $("#contest"+i+"Choice"+j+"Data .choice-percentage2").text(choicePercentage+"%");
        $("#contest"+i+"Choice"+j+"Data .choice-percentage").css("width",choicePercentage+"%");
      }
      sortData();

      //change out main candidates bar to top two scorers
      var candidateSwitcher = 0;
      $("#contest"+i+"Well .contest-data tr:lt(2)").each(function() {
        var candidateName = $(this).find(".choice-name").html();
        var candidateValue = $(this).find(".choice-value").text();

        if (candidateSwitcher == 0) {
          $("#contest"+i+"Well .contest-main-candidates .first-candidate span").html(candidateName+": <em class='fullNumber'>"+candidateValue+"</em>")
        } else {
          $("#contest"+i+"Well .contest-main-candidates .second-candidate span").html(candidateName+": <em class='fullNumber'>"+candidateValue+"</em>")
        }
        candidateSwitcher++;
      });

      //add result message
      if (typeof contestData[i].resultHTML != "undefined" && contestData[i].resultHTML.length > 0) {
        $("#contest"+i+"Well .alert").remove();
        $("#contest"+i+"Well .panel").before("<div class='alert alert-success'>"+contestData[i].resultHTML+"</div>");
      }

      //determine main bar colors
      $("#contest"+i+"Well .contest-main-candidates .progress-bar").each(function() {
        $(this).removeClass("democrat republican libertarian green-party for-initiative against-initiative pull-left pull-right");
        if ($(this).find("span").text().indexOf("(DEM)") != -1)
          $(this).addClass("democrat").addClass("pull-left");
        if ($(this).find("span").text().indexOf("(REP)") != -1)
          $(this).addClass("republican").addClass("pull-right");
        if ($(this).find("span").text().indexOf("(LIB)") != -1)
          $(this).addClass("libertarian").addClass("pull-right");
        if ($(this).find("span").text().indexOf("(GRN)") != -1)
          $(this).addClass("green-party").addClass("pull-left");
        if ($(this).find("span").text().indexOf("Yes/For") != -1)
          $(this).addClass("for-initiative").addClass("pull-left");
        if ($(this).find("span").text().indexOf("No/Against") != -1)
          $(this).addClass("against-initiative").addClass("pull-right");
      });

      //determine main bar percentage width
      var totalCount = 0;
      $("#contest"+i+"Well .contest-main-candidates .fullNumber").each(function() {
        totalCount += Number($(this).text());
      });

      if ($("#contest"+i+"Well .contest-main-candidates .fullNumber:eq(1)").length == 0) {
        demPercent = Number($("#contest"+i+"Well .contest-main-candidates .first-candidate .fullNumber").text()) / totalCount * 100  || 100;
        repPercent = Number($("#contest"+i+"Well .contest-main-candidates .second-candidate .fullNumber").text()) / totalCount * 100 || 100;
        $("#contest"+i+"Well .contest-main-candidates .progress-bar").hide();
        $("#contest"+i+"Well .contest-main-candidates .fullNumber:eq(0)").parent().parent().show();
      } else {
        demPercent = Number($("#contest"+i+"Well .contest-main-candidates .first-candidate .fullNumber").text()) / totalCount * 100  || 50;
        repPercent = Number($("#contest"+i+"Well .contest-main-candidates .second-candidate .fullNumber").text()) / totalCount * 100 || 50;
      }
      $("#contest"+i+"Well .contest-main-candidates .first-candidate").css("width", demPercent + "%");
      $("#contest"+i+"Well .contest-main-candidates .second-candidate").css("width",repPercent + "%");
    } //end whole for loop for each selected contest
  
    //okay, tables should be set up. let's also hide the menu because the user is likely done with it
    if (doInitialSetup == true) {
      $(".panel-body").hide();
      $("#tableHolder .panel-heading").click(function() {
        $(this).next(".panel-body").toggle();
        $(this).find(".glyphicon").toggleClass("glyphicon-chevron-down");
        $(this).find("small").toggle();
      });
    }

    //update date
    var date = new Date();
    var time = date.toLocaleTimeString();
    $(".updated-timestamp").text(time);

    //add commas to prettify numbers
    $(".choice-value").each(function() {
      $(this).text($(this).text().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    });
    $(".fullNumber").each(function() {
      $(this).text($(this).text().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    });

    //if this is embedded via pym, send height
    pymChild.sendHeight();
  }

  function updateContestData(xml) {
    xmlParsed = $.parseXML(xml);
    $xml = $(xmlParsed);

    //loop through different tracked races, setting up each chart
    for (i = 0; i < contestData.length; ++i) {
      //reset variables that need to be clear for subsequent updates
      contestData[i].percentReporting = 0;
      contestData[i].totalVotes = 0;
      contestData[i].choices = [];

      //perform xml searches
      $xml.find("Contest[text*='"+contestData[i].contestTitle+"']").each(function() {
        //in the event of races divided by parties...
        actualContestTitle = $(this).attr("text");

        //figure out the percentage reporting
        contestData[i].percentReporting += Number($(this).attr("precinctsReportingPercent"));
        //pull out all the choices
        $(this).find("Choice").each(function() {
          var choice = {};
          choice.label = $(this).attr("text");
          choice.value = Number($(this).attr("totalVotes"));
          if (actualContestTitle.indexOf("REPUBLICAN") >= 0) {
            choice.party = "REP";
          } else if (actualContestTitle.indexOf("DEMOCRAT")  >= 0) {
            choice.party = "DEM";
          } else {
            choice.party = $(this).attr("party");
          }
          //add totalVotes to get percentages later
          contestData[i].totalVotes += Number(choice.value);
          //set data
          contestData[i].choices.push(choice);
        });
      });
      
      //we added percentages together, now let's divide by the amount
      contestData[i].percentReporting = contestData[i].percentReporting / $xml.find("Contest[text*='"+contestData[i].contestTitle+"']").length;
    } //end for
  } //end updateContestData()

  function sortData() {
    // Read table body node.
    var tableData = document.getElementsByTagName("tbody");
    for (k = 0; k < tableData.length; ++k) {
      // Read table row nodes.
      var rowData = tableData[k].getElementsByTagName("tr"); 

      for(var i = 0; i < rowData.length - 1; i++){
        for(var j = 0; j < rowData.length - (i + 1); j++){
        //Swap row nodes if short condition matches
          if(parseInt(rowData.item(j).getElementsByTagName("td").item(1).innerHTML) < parseInt(rowData.item(j+1).getElementsByTagName("td").item(1).innerHTML)) {
            tableData[k].insertBefore(rowData.item(j+1),rowData.item(j));
          }
        }
      }
    } //end for
  } //end sortData()


