//
// panels.js
//
// CREAM Software Workspace version 0.5
//
// Author: Roger D. Serwy
//         roger.serwy@gmail.com
//
// Implementation of Retrospective and Prospective algorithms for
// Erik Hollnagel's CREAM system.
//
// Developed for PSYCH494 - Advanced Research in Psychology
// University of Illinois - Urbana Champaign
// April 2007
//

var CREAM_CONTAINER = null;

var MODE_RETRO = 1;
var MODE_PROSP = 2;
var CREAM_MODE = MODE_PROSP;

var PANEL_HEAD = null;	// link-list to the panel div containers
var TR_CONTAINER = null;  // table tag that contains the growing list of recursive tables


// loadCREAM()
//  - place the CREAM engine UI on the web page
function loadCREAM()
{
	loadTables();
	return;

}

function doCream(event, event_name)
{
	
}

function doNothing() 
{
	// intentionally left blank
}

function showGroup(e, event_name)
{


}

// buildGroupPanel
// - creates the HTML for rendering a Group Table like Hollnagel's book
function panelGroup(group_ptr, withFunction)
{
	gr = group_ptr;

	var d = document.createElement("div");

	var s = "";
	s += "<table width=500px rules=all  class='panelGroup' cellpadding=3>";
	s += "<tr><td colspan=3 class='eTitle'>Group: " + group_ptr.name + "</td></tr>";
	s += "<tr><td class='tTitle'>General Consequent</td>";
	s += "<td class='tTitle'>General Antecedent</td>";
	s += "<td class='tTitle'>Specific Antecedent</td></tr>";
	
	var gc_ptr = gr.gc;

	while (gc_ptr != null) {
		var ga = gc_ptr.ga;
		var sa = gc_ptr.sa;
		var ga_count = lengthOf(ga);
		var sa_count = lengthOf(sa);


		var max = ga_count;
		if (sa_count > max) { max = sa_count; };


		s += "<tr><td rowspan=" + max + ">"

		s += "<button callback='self.parent.workspace.creamEvent(";
		s += "\"" + gc_ptr.name + "\"";
		s += ")'>";
		s += gc_ptr.name + "</button>";

		s += "</td>";

	
		for (var i = 0; i < max; i++) {
			if (i > 0) { 
				s += "<tr>";
			}
			if (ga != null) {
				s += "<td>"
				s += ga.name;
				s += "</td>";
				ga = ga.next;
			} else {
				s += "<td></td>";
			}
	
			if (sa != null) {
				s += "<td>" + sa.name + "</td>";
				sa = sa.next;
			} else {
				s += "<td></td>";
			}

			s += "</tr>";
	
	
		}

		s += "<tr><td colspan=3 class='tTitle'></td></tr>";	

		gc_ptr = gc_ptr.next;
	}
	s += "</table>";

	// do the categories table of gc/sc
	s += "<br>"; // spacer
	s += "<table width=500px rules=all  class='panelGroup' cellpadding=3>";
	s += "<tr><td class='tTitle'>General Consequent</td>";
	s += "<td class='tTitle'>Specific Consequent</td>";
	s += "<td class='tTitle'>Definition</td></tr>";

	var gc_ptr = gr.gc;

	while (gc_ptr != null) {
		// how many sc's?
		var sc_count = lengthOf(gc_ptr.sc);
		s += "<tr><td rowspan=" + sc_count + ">";

	
		s += "<button callback='self.parent.workspace.creamEvent(";
		s += "\"" + gc_ptr.name + "\"";
		s += ")'>";
		s += gc_ptr.name + "</button>";

		s += "</td>";
		// add all the SC's and defs
		var sc_ptr = gc_ptr.sc;
		var i = 0;
		while (sc_ptr != null) {
			if (i > 0) {
				s += "<tr>";
			}
			s += "<td>" + sc_ptr.name + "</td>";
			s += "<td>" + sc_ptr.def + "</td>";
			s += "</tr>";
			i++;

			sc_ptr = sc_ptr.next;
		}
		s += "<tr><td class='tTitle' colspan=3></td></tr>"; // spacer
		gc_ptr = gc_ptr.next;
	}
	s += "</table>";	

	
	


	
	d.innerHTML = s;
		
	return d;

}



// buildCreamPanel - returns a panel of CREAM progression
function panelCREAM(event_name)
{
	var gc = findGC(event_name);
	if (gc == null) { 
		//alert("Error: " + event_name);
		return null;
	}

	if (CREAM_MODE == MODE_PROSP) {
		r = getProspective(event_name);
	} else {
		r = getRetrospective(event_name);
	}
	
	var d = document.createElement("div");

	var s = "";
	s += "<table width=100% rules=all cellpadding=3  class='panelGroup' frame=all>";
	
	//
	// title
	s += "<tr><td colspan=2 class='eTitle'>" + event_name + "</td></tr>";
	s += "<tr><td colspan=2>";
	s += "Category: " + gc.parent.parent.name; 		// cat
	s += "<br>";
	s += "Group: " + gc.parent.name;
	s += "</td></tr>";

	s += "<tr><td colspan=3 class='tTitle'></td></tr>"; // spacer

	//
	// SC's
	s += "<tr>";
	s += "<td rowspan='" + lengthOf(gc.sc) + "'>";
	s += "Specific Consequents</td>";

	var sc = gc.sc;
	var i = 0;
	while (sc != null) {
		if (i > 0) { s += "<tr>"; }
		i++;

		s += "<td><button callback='self.parent.workspace.creamEvent(";
		s += "\"" + sc.name + "\", \"sc\"";
		s += ");'>" + sc.name + "</button>";
		s += sc.def + "</td></tr>";
		sc = sc.next;
	}
	s += "<tr><td colspan=2 class='tTitle'></td></tr>"; // spacer


	//
	// Direct Links - SA
if (CREAM_MODE == MODE_RETRO) {
	// build a list of DLSA
	var sa = gc.sa;
	var dlsa = new Array(lengthOf(sa));
	var i = 0;
	while (sa != null) {
		dlsa[i] = sa.name;
		i++;
		sa = sa.next;
	}	
	s += "<tr>";
	s += "<td rowspan='" + dlsa.length + "'>";
	s += "Direct Links: <br><br> Specfic Antecedents</td>";
	
	for(var i = 0; i < dlsa.length; i++) {
		if (i > 0) { s += "<tr>"; }
		s += "<td><button callback='self.parent.workspace.creamEvent(";
		s += "\"" + dlsa[i] + "\", \"dlsa\"";
		s += ");'";
		s += ">" + dlsa[i] + "</button></td></tr>";
	}
	s += "<tr><td colspan=2 class='tTitle'></td></tr>"; // spacer
}

	//
	// Direct Links - GA
	s += "<tr>";
	s += "<td rowspan='" + r.DL.length + "'>";
	s += "Direct Links: <br><br> General ";


	if (CREAM_MODE == MODE_RETRO) {
		s += "Antecedents";
	} else {
		s += "Consequents";
	}


	s += "</td>";
	


	for (var i = 0; i < r.DL.length; i++) {
		if (i > 0) { s += "<tr>"; }
		var t = r.DL[i].name;
		s += "<td><button callback='self.parent.workspace.creamEvent(";
		s += "\"" + t + "\", \"dlg\"";
		s += ");'>" + t + "</button>";
		var gc = findGC(t);
		s += "Category: " + gc.parent.parent.name + "<br>";
		s += "Group: " + gc.parent.name;
		s += "</td></tr>";
	}
	s += "<tr><td colspan=2 class='tTitle'></td></tr>"; // spacer

if (CREAM_MODE == MODE_RETRO) {
	//
	// Indirect Links - SA
	var ilsa = new Array();
	var i = 0;
	if (r.IL.length > 0) { 
		var sap = r.IL[0].parent;
		while(sap != null) {
			var sa = sap.sa;
			while (sa != null) {
				ilsa[i] = sa.name;
				i++;
				sa = sa.next;
			}
			sap = sap.next;
		}
		//ilsa = removeCrossDuplicates(dlsa, ilsa);
		s += "<tr>";
		s += "<td rowspan='" + ilsa.length + "'>";
		s += "Indirect Links:<br><br> Specfic Antecedents</td>";
		for(var i = 0; i < ilsa.length; i++) {
			if (i > 0) { s += "<tr>"; }
				s += "<td><button callback='self.parent.workspace.creamEvent(";
				s += "\"" + ilsa[i] + "\", \"ilsa\"";
				s += ");'>" + ilsa[i] + "</button></td></tr>";
		}
		s += "<tr><td colspan=3 class='tTitle'></td></tr>"; // spacer

	}
}
	//
	// Indirect Links - GA
	s += "<tr>";
	s += "<td rowspan='" + r.IL.length + "'>";

	s += "Indirect Links:<br><br> General ";

	if (CREAM_MODE == MODE_RETRO) {
		s += "Antecedents";
	} else {
		s += "Consequents";
	}

	s += "</td>";

	for (var i = 0; i < r.IL.length; i++) {
		if (i > 0) { s += "<tr>"; }
		var t = r.IL[i].name;
		s += "<td><button callback='self.parent.workspace.creamEvent(";
		s += "\"" + t + "\", \"ilg\"";
		s += ");'>" + t + "</button>";
	
		var gc = findGC(t);
		s += "Category: " + gc.parent.parent.name + "<br>";
		s += "Group: " + gc.parent.name;
		s += "</td></tr>";
	}
	s += "<tr><td colspan=2 class='tTitle'></td></tr>"; // spacer

	
	s += "</table>";

	d.innerHTML = s;
		
	return d;

}





// panelSelectGroup()
function panelSelectConsequent()
{
	var d = document.createElement("div");
	
	var s = "";

	s += "<table width=100% rules=all class='panelGroup' cellpadding=3>";
	s += "<tr><td colspan=2 class='eTitle'>Choose Starting Consequent:</td></tr>";
	s += "<tr><td class='tTitle'>Category</td>";
	s += "<td class='tTitle'>Consequents</td>";
	s += "</tr>";	
	var cat = CREAM_HEAD;
	while (cat != null) {
		// add all the group tables 
		s += "<tr>";
		s += "<td rowspan=" + lengthOf(cat.group) + ">";
		s += cat.name;
		s += "</td>";

		var gr = cat.group;
		var i = 0;
		while (gr != null) {
			if (i > 0) {
				s += "<tr>";
			}
			s += "<td>";
	
			s += "<div>"		
			s += gr.name + ":";
			s += "</div>";
			
			// loop through gc's
			var gc = gr.gc;
			while (gc != null) {
				s += "<button callback='";
				s += "self.parent.workspace.creamEvent(";
				s += "\"" + gc.name + "\", \"dlg\"";
				s += ");";
				s += "'>";
				s += gc.name;
				s += "</button>";
				gc = gc.next;

			}

			s += "</td>";
			s += "</tr>";

			i++;
			gr = gr.next;
		}		
		s += "<tr><td colspan=2 class='tTitle'></td></tr>"; // spacer
		cat = cat.next;
	}

	s += "</table>";
	d.innerHTML = s;

	return d;
}






// panelEditNode()
function panelEditNode(n)
{
	DEBUG("panelEditNode()");
	//n.content.innerHTML = "HAHA";

	


	var d = document.createElement("div");
	
	var s = "";

	s += "<table width=100% rules=all class='panelGroup' cellpadding=3>";
	s += "<tr><td colspan=2 class='eTitle'>Edit Node: ";
	s += n.data_cons;
	s += "</td></tr>";
	s += "<tr>";
	s += "<textarea style='width: 100%; height: 50pt;'";
	s += " onkeypress='self.parent.workspace.setNodeText(event);'"
	s += " onkeydown='self.parent.workspace.setNodeText(event);'"
	s += " onkeyup='self.parent.workspace.setNodeText(event);'"

	s += ">";
	s += n.data_text;	
	s += "</textarea><br>";
	s += "</td></tr>";
	//s += "<tr><td><button callback='self.parent.workspace.setDone(event);'";
	//s += ">Done analysing this link</button></td></tr>";
				

	s += "<tr><td colspan=2 class='tTitle'></td></tr>"; // spacer
	s += "<tr><td><button callback='self.parent.workspace.deleteNode();'";
	s += ">Delete Node</button></td></tr>";


	s += "</table>";
	d.innerHTML = s;

	return d;
}



