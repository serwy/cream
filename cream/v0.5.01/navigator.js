//
// panels.js
//
// CREAM Table Navigator version 0.5
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
var CREAM_MODE = null;

var PANEL_HEAD = null;	// link-list to the panel div containers
var TR_CONTAINER = null;  // table tag that contains the growing list of recursive tables


// loadCREAM()
//  - place the CREAM engine UI on the web page
function loadCREAM()
{
	loadTables();

	var d = document.createElement("div");
	d.setAttribute("class", "groupPanel");

	CREAM_CONTAINER = d;

	document.body.appendChild(d);

	d.appendChild(buildGroupSelect());


	return;

}

function doCream(event, event_name)
{
	
	return a;

}

function doNothing() 
{
	// intentionally left blank
}


function toggleIt(event, upNav, idHandle)
{
	var d = event.target;
	//var e = d.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("tbody");
	for (var i = 0; i < upNav; i++) {
		d = d.parentNode;
	}
	var e = d.getElementsByTagName("tbody");
	for (var i = 0; i < e.length; i++) {
		if (e[i].id == idHandle) {
			if (e[i].visible != 1) {
				event.target.setAttribute("class", "titleClickDown");
				e[i].setAttribute("style", "display: visible;"); 
				e[i].visible = 1;
			} else {
				event.target.setAttribute("class", "titleClick");
				e[i].setAttribute("style", "display: none;"); 
				e[i].visible = 0;
			}
		}
	}
}


// buildCreamPanel - returns a panel of CREAM progression
function buildCreamPanel(event_name)
{
	var gc = findGC(event_name);
	if (gc == null) { 
		alert("Error: " + event_name);
		return null;
	}

	if (CREAM_MODE == MODE_PROSP) {
		r = getProspective(event_name);
	} else {
		r = getRetrospective(event_name);
	}
	

	var dlsa_array = new Array();
	var ilsa_array = new Array();

	var d = document.createElement("div");

	var s = "";
	s += "<table width=300px rules=rows class='panelNavigate' cellpadding=3>";
	s += "<tr><td colspan=2 class='eTitle'>" + event_name + "</td>";
	s += "<td class='eTitle'><a class='titleClick' href='javascript:doNothing();' onmouseup='toggleIt(event, 4, \"sc\");'>SC: ";
	
	s += lengthOf(gc.sc);

	s += "</a></td></tr>";
	
	s += "<tr><td>Group:</td><td colspan=2><a class='creamClick' href='javascript:doNothing();' onmouseup='popupTable(event, \"" + event_name + "\");'>" + gc.parent.name + "</a></td></tr>";
	s += "<tr><td>Category:</td><td colspan=2>" + gc.parent.parent.name + "</td></tr>";


	// show SC's
	s += "<tbody style='display: none;' ID='sc'>";
	s += "<tr><td class='tTitle'>Specific Consequent</td><td colspan=2 class='tTitle'>Definition</td></tr>";
	var sc = gc.sc;
	while (sc != null) {
		s += "<tr><td>" + sc.name + "</td>";
		s += "<td colspan=2>" + sc.def + "</td></tr>";
		sc = sc.next;
	}
	s += "</tbody>";

	if (CREAM_MODE == MODE_RETRO) {
		s += "<tr><td colspan=2 class='eTitle'>Direct Links: " + r.DL.length + "</td><td class='eTitle'><a class='titleClick' href='javascript:doNothing()' onmouseup='toggleIt(event, 4, \"dlsa\");'>SA: ";


		// build a list of SA
		var sa_count = 0;
		for (var i = 0; i < r.DL.length; i++) {
			var sa = r.DL[i].parent.sa;
			while (sa != null) {
				dlsa_array[sa_count] = sa;
				sa_count++;
				sa = sa.next;
			}
		}
		dlsa_array = removeInnerDuplicates(dlsa_array);
		dlsa_array = removeNoneDefined(dlsa_array);

		s += dlsa_array.length;

		s += "</a></td></tr>";
		// DL specific antecedents
		s += "<tbody style='display: none;' id='dlsa'>";
		s += "<tr><td colspan=3 class='tTitle'>Specific Antecedent</td></tr>";



		// add sa's
		for (var i = 0; i < dlsa_array.length; i++) {
			s += "<tr><td colspan=3>";
			s += dlsa_array[i].name;
			s += "</td></tr>";
		}

	} else {
		s += "<tr><td colspan=3 class='eTitle'>Direct Links: " + r.DL.length + "</td></tr>";

	}

	s += "</tbody>";

	// DL GA	
	if (CREAM_MODE == MODE_RETRO) {
		s += "<tr><td class='tTitle'>General Antecedent</td>";
	} else {
		s += "<tr><td class='tTitle'>General Consequent</td>";
	}
	s += "<td class='tTitle'>Group</td>";
	s += "<td class='tTitle'>Category</td></tr>";
	for (var i = 0; i < r.DL.length; i++) {
		s += "<tr>";
		var t = r.DL[i].name;
		//if (t != "None defined") {	
			s += "<td><a class='creamClick' href='javascript:doNothing();' onmouseup='doCream(event, \"" + r.DL[i].name + "\");'>" + r.DL[i].name + "</a></td>";
			var gc = findGC(t);
			if (gc != null) {
				//s += "<td><a class='creamClick' href='#'>" + gc.parent.name + "</a></td>";
				s += "<td>" + gc.parent.name + "</td>";
				s += "<td>" + gc.parent.parent.name + "</td>";
				s += "</tr>";
			}
		//}
	}

	if (CREAM_MODE == MODE_RETRO) {	
		s += "<tr><td colspan=2 class='eTitle'>Indirect Links: " + r.IL.length + "</td><td class='eTitle'><a class='titleClick' href='javascript:doNothing();' onmouseup='toggleIt(event, 4, \"ilsa\");'>SA: ";

		// build a list of SA
		var sa_count = 0;
		for (var i = 0; i < r.IL.length; i++) {
			var sa = r.IL[i].parent.sa;
			while (sa != null) {
				ilsa_array[sa_count] = sa;
				sa_count++;
				sa = sa.next;
			}
		}

		

		ilsa_array = removeInnerDuplicates(ilsa_array);
		ilsa_array = removeCrossDuplicates(ilsa_array, dlsa_array);
		ilsa_array = removeNoneDefined(ilsa_array);


		s += ilsa_array.length;

		s += "</a></td></tr>";

		// IL SA
		s += "<tbody style='display: none;' id='ilsa'>";
		s += "<tr><td colspan=3 class='tTitle'>Specific Antecedent</td></tr>";


		// add sa's
		for (var i = 0; i < ilsa_array.length; i++) {
			s += "<tr><td colspan=3>";
			s += ilsa_array[i].name;
			s += "</td></tr>";
		}
	} else {
		s += "<tr><td colspan=3 class='eTitle'>Indirect Links: " + r.IL.length + "</td></tr>";

	}

	s += "</tbody>";

	// IL GA

	if (CREAM_MODE == MODE_RETRO) {
		s += "<tr><td class='tTitle'>General Antecedent</td>";
	} else {
		s += "<tr><td class='tTitle'>General Consequent</td>";
	}
	s += "<td class='tTitle'>Group</td>";
	s += "<td class='tTitle'>Category</td></tr>";
	for (var i = 0; i < r.IL.length; i++) {
		s += "<tr>";
		var t = r.IL[i].name;
		//if (t != "None defined") {
		s += "<td><a class='creamClick' href='javascript:doNothing()' onmouseup='doCream(event, \"" + r.IL[i].name + "\");'>" + r.IL[i].name + "</a></td>";
		var gc = findGC(t);
		if (gc != null) {
			//s += "<td><a class='creamClick' href='#'>" + gc.parent.name + "</a></td>";
			s += "<td>" + gc.parent.name + "</td>";
			s += "<td>" + gc.parent.parent.name + "</td>";
			s += "</tr>";
		}
	
		//}
	}
	s += "</table>";




	d.innerHTML = s;
		
	return d;

}

// buildGroupPanel
// - creates the HTML for rendering a Group Table like Hollnagel's book
function buildGroupPanel(group_ptr, withFunction)
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

		if (withFunction == true) {
			s += "<a href='javascript:doNothing();' class='creamClick' onmouseup='doCream(event, \"" + gc_ptr.name + "\");'>";
			s += gc_ptr.name;
			s += "</a>";
		} else {
			s += gc_ptr.name;
		}

		s += "</td>";

	
		for (var i = 0; i < max; i++) {
			if (i > 0) { 
				s += "<tr>";
			}
			if (ga != null) {
				s += "<td>"

			//	if (withFunction == true) {
			//		s += "<a href='javascript:doNothing();' class='creamClick' onmouseup='doCream(event, \"" + ga.name + "\");'>";
			//		s += ga.name;
			//		s += "</a>";
			//	} else {
					s += ga.name;
			//	}

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

		if (withFunction == true) {
			s += "<a href='javascript:doNothing();' class='creamClick' onmouseup='doCream(event, \"" + gc_ptr.name + "\");'>";
			s += gc_ptr.name;
			s += "</a>";
		} else {
			s += gc_ptr.name;
		}

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

// buildGroupSelect()
function buildGroupSelect()
{
	var d = document.createElement("div");
	
	var s = "";

	s += "<table width=300px rules=all class='panelGroup' cellpadding=3>";
	s += "<tr><td colspan=2 class='eTitle'>Choose Group:</td></tr>";
	s += "<tr><td class='tTitle'>Category</td>";
	s += "<td class='tTitle'>Group</td>";
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
			//s += "<a href='javascript:doNothing();' onmouseup='popupTable(event, \"
			s += "<a class='creamClick' href='javascript:doNothing();' ";
			s += " onmouseup='popupTable(event, \"" + gr.gc.name + "\", true);'>" + gr.name + "</a>";
			s += "</td>";
			s += "</tr>";

			i++;
			gr = gr.next;
		}		
		s += "<tr><td colspan=2 class='tTitle'></td></tr>"; // spacer
		cat = cat.next;
	}

	d.innerHTML = s;

	return d;
}


