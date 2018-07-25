//
// develop CPC screen
//

function cpcwindow_onResize()
{
	var h = window.innerHeight;
	var t = document.getElementById('toolbarBody').clientHeight;
	var c = document.getElementById('cpcPanel');
	var d = document.getElementById('cpcMapPanel');
	c.style.height = h - t;
	d.style.height = h - t;
}



cpcPanel = null;
cpcMapPanel = null;

function displayCPC()
{
	var s = "";
	s += "<table width=100% cellpadding=0 cellspacing=0>";
	s += "<tr><td width=300px><div id='cpcPanel'></div></td>";
	s += "<td><div id='cpcMapPanel'></div></td>";
	s += "</tr></table>";
	var d = element("div");
	d.innerHTML = s;

	var appBody = document.getElementById('appBody');
	
	appBody.innerHTML = "";
	appBody.appendChild(d);

	cpcPanel = document.getElementById('cpcPanel');
	cpcMapPanel = document.getElementById('cpcMapPanel');
	cpcwindow_onResize();


	refreshCPC();
}

function refreshCPC() {

	var s = "";

	s += "<div class='panel'>";

	s += "<div class='info'>";
	s += "<div class='title'>";
	s += "Define Common Performance Conditions (CPC's)";
	s += "</div><div class='desc'>";
	s += "Rate all the CPC's. This will help identify likely paths for";
	s += " analysis. When finished, go to the 'Workspace'. The likelihood"
	s += " of a particular path will be reflected with a '*' symbol in"
	s += " 'Workspace'";
	s += "</div>";
	s += "</div>"

	// go through all cpc's, generate HTML
	var cpc = CPC_HEAD;
	var i = 0;
	while (cpc != null) {
		s += "<div class='divider'>" + (i+1) + ") " + cpc.name + "</div>";	
		s += "<div class='grouping'>";
		s += "<div class='desc'>" + cpc.desc + "</div>";	
		s += "<div class='miniloc'></div>";
		s += "<div class='name'>";
		// display options
		var level = cpc.level;
		var j = 0;
		while (level != null) {
			s += "<a ";
			if (CPC_LEVEL[i] == j) {
				s += "class='selectedAnchor'";
			} else {
				s += "class='unselectedAnchor'";
			} 
			s += " href='javascript:setCPCLevel(" + i + ", " + j + ");";
			s += "'>"
			s += level.name;
			s += "</a><br>";
			j++;
			level = level.next;
		}
		s += "</div>";
		
		s += "<textarea class='notes' onblur='";
		s += "javascript:setCPCNotes(event, " + i + ");'>";
		if (CPC_NOTES[i] == "") {
			s += "[Your analysis here]";
	
		} else {
			s += CPC_NOTES[i];
		}
		s += "</textarea><br>";

		s += "</div>";
		i++;
		cpc = cpc.next;
	}

	s += "<br>";
	
	s += "</div>";

	cpcPanel.innerHTML = s;

	cpcMap();

}

function setCPCNotes(event, i)
{
	var t = event.target;
	CPC_NOTES[i] = t.value;

}


function cpcMap()
{

	var s = "";
	s += "<div class='panel'>";
	s += "<div class='info'>";
	s += "<div class='title'>";
	s += "Mapping to the Man-Technology-Organisation (MTO) Triad";
	s += "</div></div>";


	s += "<table class='analysis' cellspacing=0>"
	s += "<tr><td class='divider'>CPC</td>";
	s += "<td class='divider'>Level</td>";
	s += "<td class='divider'>Effect on<br>Performance</td>";
	s += "<td class='divider'>Man</td>";
	s += "<td class='divider'>Technology</td>";
	s += "<td class='divider'>Organization</td></tr>";
	cpc = CPC_HEAD;
	var i = 0;
	while (cpc != null) {
		s += "<tr>"
		
		var level = cpc.level;
		for (tmp = 0; tmp < CPC_LEVEL[i]; tmp++) {
			level = level.next;
		}


		switch (level.perf.toUpperCase()) {

			case "REDUCED":
				s += "<td class='cpcRED'>";
				break;
			case "IMPROVED":
				s += "<td class='cpcGREEN'>";
				break;
			default:
				s += "<td>";
		}

		s += (i+1) + ") " + cpc.name + "</td>";
		s += "<td>" + level.name + "</td>";
		s += "<td>" + level.perf + "</td>";
		s += "<td>" + cpc.man + "</td>";
		s += "<td>" + cpc.tech + "</td>";
		s += "<td>" + cpc.org + "</td>";
		s += "</tr>";

		i++;
		cpc = cpc.next;
		
	}
	s +="</table>";


	var t = cpcTriplet();
	s += "<br>";
	s += "<div class='divider'>";
	s += "CPC Triplet:";
	s += "</div>";
	s += "<div class='grouping'>";
	s += "<ul><li class='cpcGREEN'>Improved: " + t[2] + "</li>";
	s += "<li>Not Significant: " + t[1] + "</li>";
	s += "<li class='cpcRED'>Reduced: " + t[0] + "</li>";
	s += "</ul>";
	s += "Operator Control Mode: <b>" + cpcControlMode(t) + "</b><br>";

	s += "<br>";

	s += "</div>";


	s += "<div class='divider'>Likely Paths for Analysis:</div>";
	s += "<div class='grouping'>";
	s += "<div class='desc'>";
	s += "Sum of reduced performances, capped at 3: ";
	s += "(higher numbers means a more likely path)<br> ";
	s += "</div>";
	var a = cpcMTO();
	s += "<ul>";
	s += "<li>Man: " + a[0] + "</li>";
	s += "<li>Technology: " + a[1] + "</li>";
	s += "<li>Organization: " + a[2] + "</li>";
	s += "</ul>"
	s += "</div>";

	CPC_MTO = a;
	
	cpcMapPanel.innerHTML = s;
}








function setCPCLevel(cpcIndex, levelIndex) {
	CPC_LEVEL[cpcIndex] = levelIndex;
	refreshCPC();
}


function starCPC(MTO) {
	//CPC_MTO;
	var ret = "";
	s = 0;
	switch (MTO.toUpperCase()) {
		case 'MAN':
			s = CPC_MTO[0];
			break;
		case 'TECHNOLOGY':
			s = CPC_MTO[1];
			break;
		case 'ORGANISATION':
			s = CPC_MTO[2];
			break;
	}	

	for (var a = 0; a < s; a++) {
		ret += "*";
	}
	
	return ret;
}
