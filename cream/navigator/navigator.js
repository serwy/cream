//
// navigator.js
//
// CREAM Table Navigator version 0.4
//
// Author: Roger D. Serwy
//         roger.serwy@gmail.com
//
// Implementation of Retrospective and Prospective algorithms for
// Erik Hollnagel's CREAM system.
//
// Developed for PSYCH494 - Advanced Research in Psychology
// University of Illinois - Urbana Champaign
// January to March 2007
//


var STACK_CONTAINER = null;
var STACK_HEAD = null; 
var STACK_CLEAR = null; 

var CREAM_CONTAINER = null;

var MODE_RETRO = 1;
var MODE_PROSP = 2;
var CREAM_MODE = null;

var PANEL_HEAD = null;	// link-list to the panel div containers
var TR_CONTAINER = null;  // table tag that contains the growing list of recursive tables


var PANEL_EVENT = 0;
var PANEL_GROUP = 1;
var PANEL_START = 2;
var PANEL_GROUP_DISPLAY = 3;
var PANEL_GROUP_DISPLAY_FUNC = 4;
var PANEL_GROUP_SELECT = 5;

// loadCREAM()
//  - place the CREAM engine UI on the web page
function loadCREAM()
{
	loadTables();

	var t = document.createElement("table");
	TR_CONTAINER = document.createElement("tr");
	t.appendChild(TR_CONTAINER);
	document.body.appendChild(t);

	PANEL_HEAD = new panelNav(null, null, PANEL_START);

	return;

}

function popupTable(event, event_name, withFunction) {
	var tmp = findPanelNav(event);
	tmp.flushChild();
	var gr = findGC(event_name).parent;
	if (withFunction != null) {
		var a = new panelNav(tmp, gr, PANEL_GROUP_DISPLAY_FUNC);
	} else {
		var a = new panelNav(tmp, gr, PANEL_GROUP_DISPLAY);
	}
}




function panelNav(parent, event_name, PANEL_TYPE)
{
	this.parent = parent;
	this.child = null;

	this.event_name = event_name;
	var c = document.createElement("div");
	c.id = "PANELNAV";

	var d = null;

	switch (PANEL_TYPE) {
		case PANEL_EVENT:
			d = buildEventPanel(event_name);
			c.setAttribute("class", "eventPanel");
			break;
		case PANEL_GROUP_SELECT:
			d = buildGroupSelect();
			c.setAttribute("class", "groupPanel");
			break;
		case PANEL_GROUP_DISPLAY:
			d = buildGroupPanel(event_name, false);
			c.setAttribute("class", "groupPanel");
			break;
		case PANEL_GROUP_DISPLAY_FUNC:
			d = buildGroupPanel(event_name, true);
			c.setAttribute("class", "groupPanel");
			break;

			
		case PANEL_START:
			d = buildStartMenu();
			c.setAttribute("class", "groupPanel");
			break;
		default:
			break;
	} 
	
	if (d == null) { 
		return;
	}
	
	if (parent != null) {
		this.parent.child = this;
	}


	c.appendChild(d);

	this.flush = function() {
		if (this.child != null)	{
			this.child.flush();
		}
			
		TR_CONTAINER.removeChild(this.ctd);
			
		this.child = null;
		if (this.parent != null) { 
			this.parent.child = null;
		}
	}

	this.flushChild = function() {
		var tmp = this;
		while(tmp.child != null) {
			tmp = tmp.child;
		}
		smoothScrollPlace(TR_CONTAINER.offsetLeft + tmp.ctd.offsetLeft + tmp.ctd.offsetWidth, 0);

		if (this.child != null) {
			this.child.flush();
		}
		//var a = TR_CONTAINER.offsetLeft;
		//if (a < 0) { a = 0; }
		//smoothScroll(a);
	}
	
	var td = document.createElement("td");
	td.appendChild(c);
	TR_CONTAINER.appendChild(td);

	this.container = c;
	this.ctd = td;

	// scroll over
	this.left = TR_CONTAINER.offsetLeft;
	a = this.left + TR_CONTAINER.offsetWidth - document.width;
	if (a < 0) { a = 0; }
	smoothScroll(a, 0);

}


var SS_STARTX;
var SS_STARTY;
var SS_NUMSTEPS = 5;
var SS_STOPX;
var SS_STOPY;
var SS_TIMER;

var PLACEHOLDER = document.createElement("div");
PLACEHOLDER.innerHTML = ".";
function smoothScrollPlace(x, y)
{
	document.body.appendChild(PLACEHOLDER);

	var s = "";
	s += "position: absolute;";
	s += "left: " + (x) + ";";
	s += "top: " + y + ";";
	PLACEHOLDER.setAttribute("style", s);

}

function smoothScroll(dstX, dstY)
{
	clearTimeout(SS_TIMER);
	SS_STARTX = scrollX;	
	SS_STARTY = scrollY;
	
	SS_STOPX = dstX;
	SS_STOPY = dstY;	


	
	SS_STEP = 0;
	SS_TIMER = setTimeout(smoothScrollCallBack, 100);
}

function smoothScrollCallBack()
{
	var dx = (SS_STOPX - SS_STARTX) / SS_NUMSTEPS;
	var dy = (SS_STOPY - SS_STARTY) / SS_NUMSTEPS;

	var x = parseInt(SS_STARTX + SS_STEP * dx);
	var y = parseInt(SS_STARTY + SS_STEP * dy);
	
	scroll(x, y);
		
	SS_STEP += 1;
	if (SS_STEP <= SS_NUMSTEPS) {
		SS_TIMER = setTimeout(smoothScrollCallBack, 100);
	}
}


// findPanelNav()
// - returns pointer to the panel nav object
function findPanelNav(event)
{

	// find parent
	var t = event.target;
	while (t.id != "PANELNAV") {
		t = t.parentNode;
	}

	// find the panel in the panelhead list
	var tmp = PANEL_HEAD;
	while (tmp != null) {
		if (tmp.container == t) {
			// found it
			//alert("found it");
			return tmp;
		}
		tmp = tmp.child;

	}


}


function doCream(event, event_name)
{
	var tmp = findPanelNav(event);

	tmp.flushChild();
	var a = new panelNav(tmp, event_name, PANEL_EVENT);
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

function buildEventPanel(event_name)
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
	s += "<td class='eTitle'><a class='titleClick' href='javascript:doNothing();' onmouseup='toggleIt(event, 4, \"sc\");'>SC</a></td></tr>";
	
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
		s += "<tr><td colspan=2 class='eTitle'>Direct Links: " + r.DL.length + "</td><td class='eTitle'><a class='titleClick' href='javascript:doNothing()' onmouseup='toggleIt(event, 4, \"dlsa\");'>SA</a></td></tr>";
		// DL specific antecedents
		s += "<tbody style='display: none;' id='dlsa'>";
		s += "<tr><td colspan=3 class='tTitle'>Specific Antecedent</td></tr>";


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
		s += "<tr><td colspan=2 class='eTitle'>Indirect Links: " + r.IL.length + "</td><td class='eTitle'><a class='titleClick' href='javascript:doNothing();' onmouseup='toggleIt(event, 4, \"ilsa\");'>SA</a></td></tr>";

		// IL SA
		s += "<tbody style='display: none;' id='ilsa'>";
		s += "<tr><td colspan=3 class='tTitle'>Specific Antecedent</td></tr>";


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


// buildStartMenu()
function buildStartMenu()
{
	var d = document.createElement("div");
	
	var s = "";

	s += "<table width=200px rules=all class='panelGroup' cellpadding=3 id='AD'>";
	s += "<tr><td colspan=2 class='eTitle'>Start Menu:</td></tr>";
	s += "<tr><td rowspan=2>Analysis Direction:</td>";
	s += "<td><a href='javascript:doNothing();' class='creamClick' onmouseup='setAnalysisMode(event, \"RETRO\");'>Retrospective<br>(accident analysis)</a></td></tr>";
	s += "<tr><td><a href='javascript:doNothing();' class='creamClick' onmouseup='setAnalysisMode(event, \"PROSP\");'>Prospective<br>(error prediction)</a></td>";
	s += "</tr>";
	s += "<tr><td class='tTitle' colspan=2></td></tr>";
	s += "<tr><td rowspan=2>Common Performance Conditions:</td><td>Define</td></tr>";
	s += "<tr><td>Map to MTO</td>";
	s += "</tr>";
	s += "<tr><td class='tTitle' colspan=2></td></tr>";
	s += "<tr><td></td><td><a href='javascript:doNothing();' class='creamClick' onmouseup='beginAnalysis(event);'>Begin Analysis</a></td></tr>";

	s += "</table>";



	d.innerHTML = s;

	return d;
}

function setAnalysisMode(event, type)
{
	var tmp = findPanelNav(event);
	tmp.flushChild();

	var t = event.target;
	while (t.id != "AD") {
		t = t.parentNode;
	}

	var a = t.firstChild.firstChild.nextSibling.firstChild;


	if (type == "RETRO") {
		CREAM_MODE = MODE_RETRO;
		a.innerHTML = "Analysis Direction: <br><b>Retrospective</b>";

	} else {
		CREAM_MODE = MODE_PROSP;
		a.innerHTML = "Analysis Direction: <br><b>Prospective</b>";
	}


}

// beginAnalysis()
function beginAnalysis(event)
{
	var tmp = findPanelNav(event);
	tmp.flushChild();
	var a = new panelNav(tmp, null, PANEL_GROUP_SELECT);
}


//
// chooseStart()
// add the navigator table to the cream_container
function chooseStart()
{
	var a = buildTableNav();
	CREAM_CONTAINER.innerHTML = "";
	CREAM_CONTAINER.appendChild(a);
}

//
// processCream()
// callback function for button clicks for CREAM table navigation
function processCream(event) {
	if (event.toUpperCase() == "NONE DEFINED") { 
		return;
	}

	if (STACK_HEAD != STACK_CLEAR) {
		STACK_HEAD = STACK_CLEAR; // clear stack if clicked earlier in stack
	}

	var res = setTable(event);

	if (res == 0) {
		var a = new stackList();
		a.event = event;
		a.next = STACK_HEAD;
		STACK_HEAD = a;
		STACK_CLEAR = STACK_HEAD;
		rebuildStack();

	}

}

