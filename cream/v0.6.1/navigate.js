//
// develop Navigator screen
//


var groupPanel;
var tablePanel;

function navigator_onResize()
{
	var h = window.innerHeight;
	var t = document.getElementById('toolbarBody').clientHeight;
	var c = document.getElementById('groupPanel');
	var d = document.getElementById('tablePanel');
	c.style.height = h - t;
	d.style.height = h - t;

	groupPanel = c;
	tablePanel = d;
}

SHOW_LINKS = false;		// global variable 
SHOW_DESC = false;		// global variable
// TODO: consolidate state information into one global object

NAVIGATOR_GROUP = null;


function displayNavigator()
{
	var s = "";
	s += "<table width=100% cellpadding=0 cellspacing=0>";
	s += "<tr><td width=300px><div id='groupPanel'></div></td>";
	s += "<td><div id='tablePanel'></div></td>";
	s += "</tr></table>";
	var d = element("div");
	d.innerHTML = s;

	var appBody = document.getElementById('appBody');
	
	appBody.innerHTML = "";
	appBody.appendChild(d);

	navigator_onResize();

	NAVIGATOR_GROUP = CREAM_HEAD.group;
	refreshNavigator();
}

function refreshNavigator()
{
	var s = "";

	s += "<div class='panel'>";
	s += "<div class='info'>";
	s += "<div class='title'>";
	s += "CREAM Table Navigator: ";
	s += "</div>";
	s += "<div class='desc'>";
	s += "This allows you to see all the tables CREAM uses for performing an analysis. It is meant to be a reference.";
	
	s += "</div>";
	s += "</div>";

	s += "<div class='divider'>";
	s += "Show: ";
	s += "<a "
	if (SHOW_LINKS == true) {
		s += "class='selectedAnchor'";
	} else {
		s += "class='unselectedAnchor'";
	}


	s += "href='javascript:toggleLinks()'>";
		
	s += "Where Links Are";
	s += "</a>";

	s += "&nbsp;";
	s += "<a "
	if (SHOW_DESC == true) {
		s += "class='selectedAnchor'";
	} else {
		s += "class='unselectedAnchor'";
	}

	s += "href='javascript:toggleDesc()'>";
		
	s += "Descriptions";
	s += "</a>";
	s += "</div>";

	s += "<br>";

	var cat = CREAM_HEAD;
	while (cat != null) {
		s += "<div class='divider'>" + cat.name + "</div>";	
		s += "<div class='grouping'>";
	
		var grp = cat.group;
		while (grp != null) {
			s += "<div class='name'>";
			s += "<a href='javascript:showTable(\""
			s += grp.name + "\");'>";
			s += grp.name;	
			s += "</a>";
			s += "</div>";	

			grp = grp.next;
		}

		s += "</div>";
		cat = cat.next;
	}
	s += "<br>";	
	s += "</div>";

	groupPanel.innerHTML = s;


	generateTable(NAVIGATOR_GROUP);
}

function toggleLinks()
{
	SHOW_LINKS = !SHOW_LINKS;
	refreshNavigator();

}

function toggleDesc()
{
	SHOW_DESC = !SHOW_DESC;
	refreshNavigator();

}



function showTable(name)
{
	var grp = findGroup(name);
	if (grp != null) {
		NAVIGATOR_GROUP = grp;
		generateTable(grp);
	}

}


function generateTable(grp)
{
	// group pointer, navigate and make some HTML

	var s = "";

	// for each GC, do it

	s += "<div class='panel'>";
	s += "<div class='info'>";
	s += "<div class='title'>";
	s += grp.parent.name + " : " + grp.name;
	s += "</div></div>";
	s += "<br>";


	s += "<table class='analysis' valign=top rules=rows width=100%>";
	s += "<tr>";
	s += "<td class='divider' width=25%>General Consequent</td>";
	s += "<td class='divider' width=25%>General Antecedents</td>";
	s += "<td class='divider' width=25%>Specific Anetecedents</td>";
	s += "<td class='divider' width=25%>Specific Consequents</td>";
	s += "</tr>";

	var genElts = function(tmp) {
		var t = "";
		t += "<td>";
		while (tmp != null) {
			t += "<div class='title'>";
			t += tmp.name;
			t += "</div>";

			if (SHOW_DESC == true) {
			t += "<div class='desc'>";
			t += tmp.desc;
			t += "</div>";
			}

			if (SHOW_LINKS == true ) {	
			var lgc = findGC(tmp.name);

			t += "<div class='miniloc'>";
			if (lgc != null) {
				t += "in \"" + lgc.parent.parent.name + "\"";
				t += " under \"" + lgc.parent.name + "\"";
			}	
			t += "</div>";
			}
		
			t += "<br>";


			tmp = tmp.next;
		}
		t += "</td>";

		return t;
	}
	
	var gc = grp.gc;
	while (gc != null) {
		s += "<tr>"
		s += "<td><div class='title'>" + gc.name + "</div>";
		if (SHOW_LINKS == true) {
		// do prospective link finder
		// display all the GA's

		var ga_loc = findGA(gc.name);
		s += "<ul>";
		for(var i = 0; i < ga_loc.length; i++) {
			var g = ga_loc[i].parent;
			s += "<li class='desc'>";	
			s += "to \"" + g.name + "\" in \"" 
			s += g.parent.name + "\" under \"" 
			s += g.parent.parent.name + "\""
			s += "</li>";
		}
		s += "</ul>";
		}



		s += "</td>";
		s += genElts(gc.ga);
		s += genElts(gc.sa);
		s += genElts(gc.sc);
		s += "</tr>";
		gc = gc.next;
	}	
	s += "</table>";
	s += "</div>";
	
	tablePanel.innerHTML = s;
	tablePanel.scrollTop = 0;
}
