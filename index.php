<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>2016 Colorado Elections - Live Results</title>
    
    <!--we embed this onto other pages, so pym is useful for responsive embeds: http://blog.apps.npr.org/pym.js/ -->
    <script type="text/javascript" src="https://pym.nprapps.org/pym.v1.min.js"></script>

    <!--typekit is important to load first to prevent font "flashing" -->
    <script>try{Typekit.load();}catch(e){}</script>

    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/main.css" rel="stylesheet">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
    <style type="text/css">
    .progress-lg {
      <?php if ($_GET['fullResults'] != null) echo ' height:70px;'; ?>
    }
    .progress-lg .half-bar {
      <?php if ($_GET['fullResults'] != null) echo ' height:80px;'; ?>
    }
    .progress-lg span {
      <?php if ($_GET['fullResults'] != null) echo ' margin-top:23px;'; ?>
    }
    </style>
  </head>
  <body>
    <div class="container-fluid">
      <nav class="panel panel-success <?php if ($_GET['showrace'] != null) echo 'hidden';?>">
        <div class="panel-heading clearfix">
          <a class="pull-right expand-button" href="#" style="margin-left:10px;"><span class="glyphicon glyphicon-chevron-up"></span></a>
          <p class="pull-right">Updates automatically. Last updated on <span class="updated-timestamp"></span></p>
          <h2 class="panel-title"><strong>2016 Colorado Elections: Live Results</strong></h2>
          <div class="alert alert-warning alert-dismissible" style="margin-top:15px;" role="alert">
            <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
            <em>Click here to adjust what races are shown below.</em>
          </div>
        </div>
        <div id="filterRacesPanel" class="panel-body clearfix hidden">
        <!--This is where you edit races in the XML. Each contest container has a name, which is mapped via the contest-name attribute for each checkbox. You can also add a cpr-coverage variable with a URL that will be linked to-->
          <h4><strong>Show races:</strong></h4>

          <hr />
          <label class="checkbox-inline">
            <input type="checkbox" value="president" checked="true"  contest-name="Presidential Electors"> President of the United States
          </label>

          <hr />
          <label class="checkbox-inline">
            <input type="checkbox" value="senator" contest-name="United States Senator" checked="true"> U.S. Senate Seat
          </label>

          <hr />
          <h5 class="underline" style="display:inline-block;margin-right:10px;"><strong>U.S. House of Representatives:</strong></h5>
          <label class="checkbox-inline">
            <input type="checkbox" value="usrep1" contest-name="Representative to the 115th United States Congress - District 1"> District 1
          </label>
          <label class="checkbox-inline">
            <input type="checkbox" value="usrep2" contest-name="Representative to the 115th United States Congress - District 2"> District 2
          </label>
          <label class="checkbox-inline">
            <input type="checkbox" value="usrep3" contest-name="Representative to the 115th United States Congress - District 3"> District 3
          </label>
          <label class="checkbox-inline">
            <input type="checkbox" value="usrep4" contest-name="Representative to the 115th United States Congress - District 4"> District 4
          </label>
          <label class="checkbox-inline">
            <input type="checkbox" value="usrep5" contest-name="Representative to the 115th United States Congress - District 5"> District 5
          </label>
          <label class="checkbox-inline">
            <input type="checkbox" value="usrep6" contest-name="Representative to the 115th United States Congress - District 6"> District 6
          </label>
          <label class="checkbox-inline">
            <input type="checkbox" value="usrep7" contest-name="Representative to the 115th United States Congress - District 7"> District 7
          </label>

          <hr />
          <h5 class="underline" style="display:inline-block;margin-right:10px;"><strong>Ballot Initiatives:</strong></h5>
          <label class="checkbox-inline">
            <input type="checkbox" value="a69" checked="true" contest-name="Amendment 69 (CONSTITUTIONAL)"> Amendment 69 (ColoradoCare)
          </label>
          <label class="checkbox-inline">
            <input type="checkbox" value="a70" checked="true" contest-name="Amendment 70 (CONSTITUTIONAL)"> Amendment 70 (State Minimum Wage)
          </label>
          <label class="checkbox-inline">
            <input type="checkbox" value="a71" checked="true" contest-name="Amendment 71 (CONSTITUTIONAL)"> Amendment 71 (Requirements For Constitutional Amendments)
          </label> 
          <label class="checkbox-inline">
            <input type="checkbox" value="a72" checked="true" contest-name="Amendment 72 (CONSTITUTIONAL)"> Amendment 72 (Tobacco Taxes)
          </label>
          <label class="checkbox-inline">
            <input type="checkbox" value="at" checked="true" contest-name="Amendment T (CONSTITUTIONAL)"> Amendment T (No Exception To Involuntary Servitude Prohibition)
          </label>
          <label class="checkbox-inline">
            <input type="checkbox" value="au" checked="true" contest-name="Amendment 72 (CONSTITUTIONAL)"> Amendment U (Exempt Certain Possessory Interests From Property Taxes)
          </label>
          <label class="checkbox-inline">
            <input type="checkbox" value="b4b" checked="true" contest-name="Denver Metropolitan Scientific and Cultural Facilities District Ballot Issue 4B"> Ballot Issue 4B (SCFD)
          </label>
          <label class="checkbox-inline">
            <input type="checkbox" value="p106" checked="true" contest-name="Proposition 106 (STATUTORY)"> Proposition 106 (Access To Medical Aid-In-Dying Medication)
          </label>
          <label class="checkbox-inline">
            <input type="checkbox" value="p107" checked="true" contest-name="Proposition 107 (STATUTORY)"> Proposition 107 (Presidential Primary Elections)
          </label>
          <label class="checkbox-inline">
            <input type="checkbox" value="p108" checked="true" contest-name="Proposition 108 (STATUTORY)"> Proposition 108 (Unaffiliated Voter Participation In Primary Elections)
          </label>

          <hr />
          <button type="button" class="btn btn-success pull-right btn-lg" id="showRacesButton">Show Selected Races</button>
          <button type="button" class="btn btn-default  btn-sm" id="clearRacesButton">Clear Selected</button>
        </div>
      </nav>
        
      <?php if ($_GET['showrace'] == null) echo '<hr />';?>

      <!--#tableHolder will be populated via JS-->
      <section id="tableHolder"></section>

      <footer class="footer <?php if ($_GET['fullResults'] != null || $_GET['showrace'] != null) echo ' hidden'; ?>">
        <p class="text-right small">Election data provided by the <a target="_blank" href="http://results.enr.clarityelections.com/CO/51557/138497/en/summary.html">Colorado Secretary of State</a>. Viewer provided by <a href="http://www.cpr.org/" target="_blank">Colorado Public Radio</a>.</p>
      </footer>
    </div>

    <!--template for displaying races, called upon by JS and populated into #tableHolder-->
    <div class="hidden" id="template1">
        <div class="row">
          <div class="col-xs-12 col-sm-3 contest-info text-center">
            <h3 class="contest-title"></h3>
            <p class="" ><span class="reporting-percentage badge"></span></p>
          </div>
          <div class="col-xs-12 col-sm-9">
            <div class="progress progress-lg contest-main-candidates">
              <div class="half-bar">&nbsp;</div>
              <div class="progress-bar first-candidate " >
                <span></span>
              </div>
              <div class="progress-bar second-candidate " >
                <span ></span>
              </div>
            </div>
          </div>
        </div>

        <div class="row <?php if ($_GET['fullResults'] != null) echo 'hidden'; ?>">
          <div class="col-xs-12 col-sm-12">
            <div class="panel panel-default">
              <div class="panel-heading"><a class="pull-right expand-button" href="#"><span class="glyphicon glyphicon-chevron-up"></span></a><strong>Full Results</strong> <small>(click to expand)</small></div>
              <div class="panel-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th width="35%">Option</th>
                      <th width="20%">Votes</th>
                      <th width="65%">Total % of Popular Vote</th>
                    </tr>
                  </thead>
                  <tbody class="contest-data">
                  <!--this is populated via main.js as a late addition-->
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
      <!--end #template1-->
            



  <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
  <script src="js/bootstrap.min.js"></script>
  <script src="js/main.js"></script>
  <script>
    //PHP specific code, rest is handled through external JS file
    $(document).ready(function() {
      <?php if ($_GET['showrace'] != null) {
        echo "$('input[type=checkbox]:checked').attr('checked', false);";
        echo "$('input[value=\"".$_GET['showrace']."\"]').attr('checked', 'true');";
      } ?>
    });
  </script>
  </body>
</html>