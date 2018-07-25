//
// engine.js
//
// Author: Roger D. Serwy
//         roger.serwy@gmail.com
//
// Table-specific generating code for displaying tables
//
// Implementation of Retrospective and Prospective algorithms for
// Erik Hollnagel's CREAM system.
//
// Developed for PSYCH494 - Advanced Research in Psychology
// University of Illinois - Urbana Champaign
// February 2007
//

function buildCompleteTable(group_ptr)
{

	g_ptr = group_ptr;
	
	var d = document.createElement("div");
	// build a dom table
	//d.setAttribute("style", "font-family: sans-serif;");
	d.setAttribute("class", "creamTableContainer");
	var s = "";
	s += "<table rules=all frame=void cellpadding=4 width=100%>";
	s += "<tr>";
	s += "<td>Specific Antecedent</td>";
	s += "<td>General Antecedent</td>";
	s += "<td>General Consequent</td>";
	s += "<td>Specific Consequent</td>";
	s += "<td>Definition</td>";
	s += "</tr>";

	var gc = g_ptr.gc;

	while(gc != null) {
		s += "<tr>";
		var rowspan = lengthOf(gc.sc);
		// add all the SA's
		s += "<td rowspan='" + rowspan + "' valign=top>"; 
		var sa = gc.sa;
		while(sa != null) {
			s += "<div>";
			s += sa.name;
			s += "</div>";
			//s += "<br>";
			sa = sa.next;
		}
		s += "</td>";
		s += "<td rowspan='" + rowspan + "' valign=top>";
		var ga = gc.ga;
		while(ga != null) {
			s += "<div>";
			s += "<a class='creamLink' href='javascript:processCream(\"" + ga.name + "\");'>";
			s += ga.name;
			s += "</a>";
			s += "</div>";
			//s += "<br>";
			ga = ga.next;
		}
		s += "</td>";
		s += "<td rowspan='" + rowspan + "' valign=top>";
		s += "<div>";
		s += "<a class='creamLink' href='javascript:processCream(\"" + gc.name + "\");'>";
		s += gc.name;
		s += "</a>";
		s += "</div>";	
		s += "</td>";


		// add the first sc
		var sc = gc.sc;
		if (sc != null) {
			s += "<td valign=top>" + sc.name + "</td>";
			s += "<td valign=top>" + sc.def + "</td>";
			s += "</tr>";
			sc = sc.next;
			while(sc != null) {
				s += "<tr><td valign=top>";
				s += sc.name;
				s += "</td>";
				s += "<td valign=top>";
				s += sc.def;
				s += "</td></tr>";
				sc = sc.next;
			}
		} else {
			s += "<td></td><td></td></tr>";
		}
			gc = gc.next;
	}
	//s += "<tr>";
	//s += "<td>Specific Antecedent</td>";
	//s += "<td>General Antecedent</td>";
	//s += "<td>General Consequent</td>";
	//s += "<td>Specific Consequent</td>";
	//s += "<td>Definition</td>";
	//s += "</tr>";


	d.innerHTML = s;

	return d;
}


function buildRetrospectiveTable(event_name) {
	r = getRetrospective(event_name);

	var d = document.createElement("div");
	
        d.setAttribute("class", "creamTableContainer");	
	var s = "";
	//s += "<div style='";
	//s += "padding: 2pt;";
	//s += "background: #AAAAFF;";
	//s += "'>";

	s += "<div class='creamTable'>";
	s += r.DL[0].parent.name;
	s += ": (part of the \"";
	s += "<a class='groupLink' href='javascript:showGroup(\"";
	s += r.DL[0].parent.parent.name;
	s += "\")'>";
	s += r.DL[0].parent.parent.name;
	s += "</a>";
	s += "\" group)";
	s += "</div>";

	s += "<table width=100% border=1 rules=rows frame=void>";

	s += "<tr><td></td><td>General Antecedents</td><td>Specific Antecedents</td>";
        s += "<tr><td valign=top>";
	s += "Direct Links: </td>";
	s += "<td valign=top>";
	// list Direct links GA's
	for (var i = 0; i < r.DL.length; i++) {
		var t = r.DL[i].name;
		s += "<a class='creamLink' href='javascript:processCream(\"" + t + "\")'>";
		s += r.DL[i].name;
		s += "</a>";
		//s += "<br>";
	}
	
	s += "<td valign=top>";
	// list Direct links SA's
	var sa = r.DL[0].parent.sa;
	while(sa != null) {
		s += "<a class='creamLink' href='#'>";
		s += sa.name;
		s += "</a>";
		//s += "<br>";
		sa = sa.next;
	}
	s += "</td>";

        s += "</tr>";
	
	s += "<tr><td valign=top>Indirect Links: </td>";
	s += "<td valign=top>";
	// list indirect links
	for (var i = 0; i < r.IL.length; i++) {
		var t = r.IL[i].name;
		s += "<a class='creamLink' href='javascript:processCream(\"" + t + "\")'>";
		s += t;
		s += "</a>";
		//s += "<br>";
	}
	s += "</td>";
	s += "<td valign=top>";
	
	// list Direct links SA's
	if (r.IL.length > 0) {
		var sa = r.IL[0].parent.sa;
		while(sa != null) {
			s += "<a class='creamLink' href='#'>";
			s += sa.name;
			s += "</a>";
			//s += "<br>";
			sa = sa.next;
		}
	}
		s += "</td>";
	

        s += "</tr>";

	var gc = findGC(event_name);
	var rowspan = lengthOf(gc.sc);
	s += "<tr><td></td><td>Specific Consequents</td><td>Definition</td>";
	s += "<tr>";
	s += "<td rowspan=" + rowspan + ">";
	s += "</td>";
	// add the first sc
	var sc = gc.sc;
	if (sc != null) {
		s += "<td valign=top>" + sc.name + "</td>";
		s += "<td valign=top>" + sc.def + "</td>";
		s += "</tr>";
		sc = sc.next;
		while(sc != null) {
			s += "<tr><td valign=top>";
			s += sc.name;
			s += "</td>";
			s += "<td valign=top>";
			s += sc.def;
			s += "</td></tr>";
			sc = sc.next;
		}
	} else {
		s += "<td></td><td></td></tr>";
	}
	
	s += "</table>";


	d.innerHTML = s;
	return d;

}


function buildProspectiveTable(event_name) {
	r = getProspective(event_name);

	var d = document.createElement("div");
	//st += "border: 1px solid #000000;";
        d.setAttribute("class", "creamTableContainer");	
	var s = "";

	s += "<div class='creamTable'>";
	s += event_name;
	s += ": (general consequent in the \"";
	s += "<a class='groupLink' href='javascript:showGroup(\"";
	s += r.DL[0].parent.name;
	s += "\")'>";
	s += r.DL[0].parent.name;
	s += "</a>";
	s += "\" group)";
	
	//s += event_name;
	//s += ""
	s += "</div>";

	s += "<table width=100% border=1 rules=rows frame=void>";
	s += "<tr><td></td><td>General Consequents</td>";
	s += "<td>Group</td><td>Category</td></tr>";
        s += "<tr><td valign=top>";
	s += "Direct Links: </td>";
	s += "<td valign=top>";
	// list Direct links GC's
	for (var i = 0; i < r.DL.length; i++) {
		var t = r.DL[i].name;	
		s += "<a class='creamLink' href='javascript:processCream(\"" + t + "\")'>";
		s += t;
		s += "</a>";
		//s += "<br>";
	}
	s += "</td>";

	s += "<td valign=top>";
	// list groups
	for (var i = 0; i < r.DL.length; i++) {
		var t = r.DL[i].parent.name;
		s += "<a class='creamLink' href='javascript:showGroup(\"" + t + "\")'>";
		s += t;
		s += "</a>";
		//s += "<br>";
	}
	s += "</td>";
		
	s += "<td valign=top>";
	// list categories
	for (var i = 0; i < r.DL.length; i++) {
		var t = r.DL[i].parent.parent.name;
		s += "<div>";
		s += t;
		s += "</div>";
		//s += "<br>";
	}
	s += "</td>";
	
	s += "</tr>";
	
	s += "<tr><td valign=top>Indirect Links: </td>";
	s += "<td valign=top>";
	// list indirect links
	for (var i = 0; i < r.IL.length; i++) {
		var t = r.IL[i].name;
		s += "<a class='creamLink' href='javascript:processCream(\"" + t + "\")'>";
		s += t;
		s += "</a>";
		//s += "<br>";
	}
	s += "</td>";

	s += "<td valign=top>";
	// list groups
	for (var i = 0; i < r.IL.length; i++) {
		var t = r.IL[i].parent.name;
		s += "<a class='creamLink' href='javascript:showGroup(\"" + t + "\")'>";
		s += t;
		s += "</a>";
		//s += "<br>";
	}
	s += "</td>";
	
	s += "<td valign=top>";
	// list groups
	for (var i = 0; i < r.IL.length; i++) {
		var t = r.IL[i].parent.parent.name;
		s += "<a class='creamLink' href='javascript:showGroup(\"" + t + "\")'>";
		s += t;
		s += "</a>";
		//s += "<br>";
	}
	s += "</td>";
	

        s += "</tr>";
	s += "</table>";


	d.innerHTML = s;
	return d;

}

function buildTableNav()
{
	// build tables for categories
	
	var c = document.createElement("div");
	var cat = CREAM_HEAD;
	while( cat != null) {
		var grp = cat.group;
		var container = document.createElement("div");
		while (grp != null) {
			var title = "Group: " + grp.name;
			var table = buildCompleteTable(grp);
			table.style.display = "none";
			//table.style.padding = "5pt";
			table.style.margin = "5pt";
			var t = toggleDisplay(title, table);
			container.appendChild(t);
			grp = grp.next;
		}

		var title = "Category: " + cat.name;
		container.setAttribute("class", "toggleContainer");
		var t = toggleDisplay(title, container);
		c.appendChild(t);
		cat = cat.next;
	}
	return c;
}

function _tm_over(event) {
	event.target.setAttribute("class", "toggleDisplayHover");
}

function _tm_out(event) {
	event.target.setAttribute("class", "toggleDisplayNormal");
}

function toggleDisplay(titleHTML, contents) {
	var container = document.createElement("div");
	container.setAttribute("class", "toggleDisplayContainer");
	var title = document.createElement("div");
	title.setAttribute("onmouseover", "_tm_over(event);");
	title.setAttribute("onmouseout", "_tm_out(event);");
	title.setAttribute("class", "toggleDisplayNormal");
	title.innerHTML = "&nbsp;" + titleHTML;
	title.setAttribute("onclick", "toggleTable(event)");
	container.appendChild(title);
	
	container.appendChild(contents);

	// add arrow 
	var a = document.createElement("img");
	a.setAttribute("src", "aleft.png");
	a.setAttribute("height", "10");
	a.setAttribute("class", "");
	a.setAttribute("style", "display: inline; padding: 0px; margin: 0px;");

	title.insertBefore(a, title.firstChild);

	return container;
}




function toggleTable(event)
{
	var s = event.target.nextSibling.style; // go from title div to elt div
	if (s.display == 'block') {
		event.target.firstChild.src = "aleft.png";
		s.display = 'none';
	} else {
		event.target.firstChild.src = "adown.png";
		s.display = 'block';
	}
}


