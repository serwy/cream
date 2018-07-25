//
// develop analysis screen
//


function analysis_onResize()
{
	var h = window.innerHeight;
	var t = document.getElementById('toolbarBody').clientHeight;
	var d = document.getElementById('analysisPanel');
	d.style.height = h - t;
}




function displayAnalysis()
{

	var s = "";

	s += "<div class='panel'>";
	s += "<div class='info'>";
	s += "<div class='title'>";
	s += "Analysis Settings and Options";
	s += "</div></div>"
	s += "<div class='divider'>";
	s += "Analysis Information"
	s += "</div>";
	
	s += "<div class='grouping'><div class='desc'>";
	s += "Enter all the information about the analysis here."
	s += "</div></div>";


	s += "<table class='analysis'>"
	s += "<tr><td class='field'>Analysis Title:</td><td><textarea onblur='javascript:setAnalysisMetadata(event, \"title\");'>";
	s += CREAM_INFORMATION.title;
	s += "</textarea></td></tr>";
	s += "<tr><td class='field'>Author:</td><td><textarea onblur='javascript:setAnalysisMetadata(event, \"author\");'>";
	s += CREAM_INFORMATION.author;
	s += "</textarea></td></tr>";
	s += "<tr><td class='field'>Description:</td><td><textarea onblur='javascript:setAnalysisMetadata(event, \"description\");'>";
	s += CREAM_INFORMATION.description;
	s += "</textarea></td></tr>";
	s += "<tr><td class='field'>Direction:</td><td>";

	s += "<a "
	if (CREAM_INFORMATION.direction == CREAM_RETROSPECTIVE) {
		s += "class='selectedAnchor'";
	} else {
		s += "class='unselectedAnchor'";
	}
	s += " href='javascript:setAnalysisDirection(CREAM_RETROSPECTIVE);'>retrospective - incident analysis</a> ";

	s += "<br>";
	s += "<a ";
	if (CREAM_INFORMATION.direction == CREAM_PROSPECTIVE) {
		s += "class='selectedAnchor'";
	} else {
		s += "class='unselectedAnchor'";
	}
	s += " href='javascript:setAnalysisDirection(CREAM_PROSPECTIVE);'>prospective - predictive analysis</a></td></tr>"
	
	s += "</table>";
	
	s += "<div class='divider'>";
	s += "Load and Save";
	s += "</div>";
	s += "<div class='grouping'>";
	s += "<div class='desc'>";
	s += "Your analysis does not go over the Internet. All the data is processed locally. The 'load' and 'save' text boxes are for copying and pasting your analysis data. <br>";



	s += "To load an analysis, paste the &lt;CREAM&gt; data into the load box and click 'load data'.<br>";
	s += "To save an analysis, copy the &lt;CREAM&gt; data from the save box, paste it into a text editor, and save it there.";
	s += "</div>";
	s += "</div>";


	s += "<table class='analysis'>"
	s += "<tr><td class='field'>";
	s += "Load:"
	s += "</td><td><textarea id='loaddata' style='height: 75px;'></textarea><br>";
	s += "<a href='javascript:loadData();'>load data</a>";

	s += "</td></tr>";
	s += "<tr><td class='field'>";
	s += "Save:";
	s += "</td><td><textarea readonly style='height: 75px;' id='saveData' onfocus='javascript:selectAllUpdate(event)'>";
	s += saveCREAM();
	s += "</textarea><br>"
	s += "<div class='desc'>"
	s += "Copy and paste this contents into a text editor to save";
	s += "</td></tr>";

	s += "</table>";
	
		
	s += "<div class='divider'>";
	s += "Print";
	s += "</div>";
	s += "<div class='grouping'>";
	s += "<div class='desc'>";
	s += "This program will generate a pop-up window containing a generated report. Disable your pop-up blocker to use this feature. "
	s += "</div>";



	s += "<br>";
	s += "<a  href='javascript:printAnalysis();'>Print Analysis as monospace plain text</a> ";
	s += "<br><br>";
	s += "<a  href='javascript:printAnalysisHTML();'>Print Analysis as formatted HTML</a> ";

	s += "</div>";
	s += "<br>";
	s += "<br>";
	s += "</div>";
	
	var d = element("div");
	d.setAttribute("id", "analysisPanel");
	d.innerHTML = s;

	var appBody = document.getElementById('appBody');
	
	appBody.innerHTML = "";
	appBody.appendChild(d);

	analysis_onResize();
}

function selectAllUpdate(event)
{
	var t = event.target;
	t.value = saveCREAM();
	t.focus();
	t.select();
}



function setAnalysisMetadata(event, field) 
{
	var t = event.target;
	var s = "CREAM_INFORMATION." + field + " = t.value";
	eval(s);
	//displayAnalysis();
	
}

function loadData()
{

	loadAnalysisData();
	displayAnalysis();

}
function setAnalysisDirection(s) {
	setDirection(s);
	displayAnalysis();

}

