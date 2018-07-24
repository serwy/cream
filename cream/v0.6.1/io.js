function saveCREAM()
{
	// save all the nodes, and the parent index
	// 

	var s = ""; 	
	s += "<CREAM>"
	s += "<c_version>0.6</c_version>";
	s += "<c_cpcs>"
	s += creamCPCSave();
	s += "</c_cpcs>"

	s += creamINFOSave();

	s += "<c_analysis>";
	s += "<c_count>" + CREAM_ANALYSIS_COUNT + "</c_count>";
	s += creamNodeSave(CREAM_ANALYSIS);	
	s += "</c_analysis>";
	s += "</CREAM>";
	return s;

}

function creamINFOSave()
{
	var s = "";
	s += "<c_info>";
	s += "<c_title>" + CREAM_INFORMATION.title + "</c_title>";
	s += "<c_author>" + CREAM_INFORMATION.author + "</c_author>";
	s += "<c_desc>" + CREAM_INFORMATION.description + "</c_desc>";
	s += "<c_dir>" + CREAM_INFORMATION.direction + "</c_dir>";
	s += "</c_info>";
	return s;


}

function creamCPCSave()
{
	var s = "";

	for (var i = 0; i < CPC_LEVEL.length; i++) {
		s += "<c_cpc>";
		s += "<c_level>" + CPC_LEVEL[i] + "</c_level>";
		s += "<c_notes>" + CPC_NOTES[i] + "</c_notes>";
		s += "</c_cpc>";
		
	}
	return s;

}

function creamNodeSave(node)
{
	var ret = "";
	var n = node;
	while (n != null) {
		ret += toText(n);
		
		ret += creamNodeSave(n.child);


		n = n.next;
	}

	return ret;
}

function toText(n)
{
	var s = "";
	s += "<c_node>";
	s += "<c_index>" + n.index + "</c_index>";

	s += "<c_parentindex>" 
	if (n.parent != null) {
		s += n.parent.index;
	} else {
		s += "-1";
	}
	s += "</c_parentindex>";
				
	s += "<c_prefix>" + n.prefix + "</c_prefix>";
	s += "<c_title>" + n.title + "</c_title>";
	s += "<c_sc>" + n.sc + "</c_sc>";
	s += "<c_notes>" + n.notes + "</c_notes>";
	s += "<c_visible>" + n.visible + "</c_visible>";
	s += "<c_done>" + n.done + "</c_done>";

	s += "<c_jump>" + n.jump + "</c_jump>";
	s += "</c_node>";	
	return s;

}


function loadAnalysisData() {
	var data = document.getElementById("loaddata");
	try {
		loadCREAM(data.value);
	} catch(ex) {
		alert("There was an error loading the analysis data. Make sure that you include everything between the <CREAM> and </CREAM> tags");

	}
}


function loadCREAM(txt) {

	var d = document.createElement("div");
	d.innerHTML = txt;  // convert XML string to DOM

		
	var cpc = d.getElementsByTagName("c_cpcs")[0];
	if (cpc != null) {
	var level = cpc.getElementsByTagName("c_cpc");
	for (var i = 0; i < level.length; i++) {
		CPC_LEVEL[i] = fc(level[i], "c_level");
		CPC_NOTES[i] = fc(level[i], "c_notes");
	}
	}


	var info = d.getElementsByTagName("c_info")[0];
	if (info != null) {
	CREAM_INFORMATION = new analysisMetadata();
	CREAM_INFORMATION.title = fc(info, "c_title");
	CREAM_INFORMATION.author = fc(info, "c_author");
	CREAM_INFORMATION.description = fc(info, "c_desc");
	CREAM_INFORMATION.direction = parseInt(fc(info, "c_dir"));
	}




	var a = d.getElementsByTagName("c_analysis")[0];
	
	var count = fc(a, "c_count");

	var node = a.getElementsByTagName("c_node");
	
	CREAM_ANALYSIS_COUNT = 1;	// counter for nodes in analysis
	CREAM_ANALYSIS = new creamAnalysis();
	CREAM_ANALYSIS.prefix = "";
	CREAM_ANALYSIS.index = 0;


	
	for (var i = 1; i < node.length; i++) {
		
		var pIndex = fc(node[i], "c_parentindex");
		var p = findNodeIndex(pIndex);
		var n = addAnalysisNode(p, "");
	
		setNodeData(n, node[i]);
	}

	CREAM_ANALYSIS_COUNT = count;
	
	setNodeData(CREAM_ANALYSIS, node[0]);

}

function setNodeData(n, node) {
		var index = parseInt(fc(node, "c_index"));
		var title = fc(node, "c_title");
		var sc = fc(node, "c_sc");	
		var notes = fc(node, "c_notes");	
		var v = eval(fc(node, "c_visible"));
		var d = eval(fc(node, "c_done"));
		var j = parseInt(fc(node, "c_jump"));
		var p = fc(node, "c_prefix");
						
		n.prefix = p;
		n.index = index;
		n.title = title;
		n.sc = sc;
		n.notes = notes;
		n.visible = v;
		n.done = d;
		n.jump = j;

		setJump(index);
}

function saveCookie()
{
	// FIXME: not working
	var t = saveCREAM();
	alert(t);
	document.cookie = t;
}

function loadCookie()
{
	// FIXME: not working, only the last few thousand bytes are recovered in the cookie.
	var data = document.getElementById("loaddata");
	var t = document.cookie;
	//data.value = t;
	
	alert(t);

	//loadCREAM(t);
}


function printAnalysis()
{
	w = window.open("about:blank", "CREAM_PRINT");

	var s = "";
	s += "<html>";
	s += "<head>";
	s += "<style type='text/css'>";
	s += "body {";
	s += "	font-family: monospace;"
	s += "}"

	s += "</style>";

	s += "<body onload=''>"

	s += printHeader();
	s += "<br>";
	s += printCPC();
	s += "<br>";
	s += printTreeView(CREAM_ANALYSIS);
	s += "</body></html>";


	w.document.open();
	w.document.write(s);
	w.document.close();
	w.print();

}


function printAnalysisHTML()
{
	w = window.open("about:blank", "CREAM_PRINT");

	var s = "";
	s += "<html>";
	s += "<head>";
	s += "<style type='text/css'>";

	var myXMLHttp = new XMLHttpRequest();
	myXMLHttp = new XMLHttpRequest();
	myXMLHttp.open("GET", "print.css", false); 
	myXMLHttp.send(null);
	s += myXMLHttp.responseText;

	s += "</style>";

	s += "<body onload=''>"

	s += printHeaderHTML();
	s += "<br>";
	s += printCPCHTML();
	s += "<br>";
	s += printTreeViewHTML(CREAM_ANALYSIS);
	s += "</body></html>";


	w.document.open();
	w.document.write(s);
	w.document.close();
	
	w.print();

}


function spaces(n)
{
	var s = "";
	for (var i = 0; i < n; i++) {
		s += "&nbsp;";
	}
	return s;
}

function printHeader()
{
	var s = "";
	s += "<center>";
	s += "<b>Cognitive Reliability Error Analysis Method Report</b>";
	s += "</center>";
	s += "<hr>";


		
	s += "Title:" + spaces(9)  + CREAM_INFORMATION.title + "<br>";
	s += "Author:" + spaces(8) + CREAM_INFORMATION.author + "<br>";
	s += "Description:" + spaces(3) + CREAM_INFORMATION.description + "<br>";
	s += "Direction:" + spaces(5); 
	if (CREAM_INFORMATION.direction == CREAM_RETROSPECTIVE) {
		s += "Retrospective";
	} else {
		s += "Prospective";
	}
	s += "<br>";

	return s;



}




function printCPC()
{

	var s = "";
	
	s += "<center>";
	s += "<b>Common Performance Conditions</b>"
	s += "</center>"
	s += "<hr>";




	var cpc = CPC_HEAD;
	var i = 0;
	while (cpc != null) {
		s += (i+1) + ") "
		var len = cpc.name.length;
				
		s += "<b>" + cpc.name + " </b>";
		s += "<br>" + spaces(3);
		var t = cpc.level;
		for (var tmp = 0; tmp < CPC_LEVEL[i]; tmp++) {
			t = t.next;
		}
		s += "Level: " + t.name;
	
		s += "<br>"; 
		s += spaces(3);
		s += "Notes: " + CPC_NOTES[i];
		s += "<br><br>";
		i++;
		cpc = cpc.next;

	}

	var t = cpcTriplet();
	s += "CPC Triplet:<br><br>";
	
	s += "Improved: " + spaces(8) + t[2] + "<br>";
	s += "Not Significant: " + spaces(1) + t[1] + "<br>";
	s += "Reduced: " + spaces(9) + t[0] + "<br>";
	s += "<br>";
	s += "Operator Control Mode: <b>" + cpcControlMode(t) + "</b><br>";

	s += "<br>";



	return s;


}



function printTreeView(node)
{
	var s = "";
	s += "<center>";
	s += "<b>Analysis</b>";
	s += "</center>";
	s += "<hr>";

	s += printTreeViewHelper(node, 0);

	return s;

}


function printTreeViewHelper(node, level)
{
	
	var s = "";
	s += buildPrintEntry(node, level);

	if (node.visible == true) {
		var c = node.child;
		while (c != null) {
			s += printTreeViewHelper(c, level + 1);
			c = c.next;
		}
	}
	return s;
}


function buildPrintEntry(node, level)
{
	
	var indent = level * 8;

	var s = "";
	s += spaces(indent);

	s += "<u>";

	var nl = nodeLevel(node);

	s += "<b>" + nl + "</b> ";

	if (node == CREAM_ANALYSIS) {
		s += "CREAM START";
	} else {
		s += node.prefix + ": ";
		s += node.title ;

	}
	s += "</u>";

	if (node.done == false) {
		s += spaces(4) + "analysis incomplete";
	}	

	s += "<br>";

	s += spaces(indent);
	s += spaces(nl.length + 1) + "SC: " + spaces(4) + node.sc + "<br>";

	s += spaces(indent);
	s += spaces(nl.length + 1) + "Notes: "  + spaces(1) + node.notes + "<br>";

	if (node.jump > 0) {
		s += spaces(indent + nl.length + 1);
		s += "Analysis jumps to: ";
		s += nodeLevel(findNodeIndex(node.jump));
		s += "<br>";
	}
	s += "<br>";	


	return s;
}




function printTreeViewHTML(node)
{
	var s = "";
	s += "<div class='printEntry'>";
	s += "<div class='subtitle'>";
	s += "Analysis";
	s += "</div>";
	s += "</div>";

	s += printTreeViewHelperHTML(node, 0);

	return s;

}




function printHeaderHTML()
{
	var s = "";
	s += "<div class='printEntry'>";

	s += "<div class='appTitle'>";
	s += "Cognitive Reliability Error Analysis Method Report";
	s += "</div>";
	s += "<div class='info'>";

	s += "<table border=0 cellspace=7 style='font-size: inherit;'>";
	s += "<tr>";
	s += "<td class='label'>Title:</td>";
	s += "<td>"  + CREAM_INFORMATION.title + "</td>";
	s += "</tr>";
	s += "<tr>";
	s += "<td class='label'>Author:</td>";
	s += "<td>"  + CREAM_INFORMATION.author + "</td>";
	s += "</tr>";
	s += "<tr>";
	s += "<td class='label'>Description:</td>";
	s += "<td>"  + CREAM_INFORMATION.description + "</td>";
	s += "</tr>";

	s += "<tr>";
	s += "<td class='label'>Direction:</td>";
	s += "<td>";
	if (CREAM_INFORMATION.direction == CREAM_RETROSPECTIVE) {
		s += "retrospective";
	} else {
		s += "prospective";
	}
	s += "</td>";
	s += "</tr>";


	s += "</table>";
	s += "</div>";

	s += "</div>";
	return s;



}

function printCPCHTML()
{

	var s = "";
	s += "<div class='printEntry'>";
	s += "<div class='subtitle'>"
	s += "Common Performance Conditions"
	s += "</div>"


	s += "<table border=0 cellspace=7 style='font-size: inherit;'>";

	var cpc = CPC_HEAD;
	var i = 0;
	while (cpc != null) {
		s += "<tr>";
		s += "<td class='labelleft'>";

		s += (i+1) + ") "
		s += "<b>" + cpc.name + "</b>";
		s += ":</td>";	
		s += "<td rowspan=2 valign=top>";
		s += CPC_NOTES[i];
		s += "</td></tr>";
		s += "<tr><td class='labelleft' style='padding-left: 15pt;'>";

		var t = cpc.level;
		for (var tmp = 0; tmp < CPC_LEVEL[i]; tmp++) {
			t = t.next;
		}
		s += t.name;
		s += "</td></tr>";

		i++;
		cpc = cpc.next;

	}
	s += "</table>";
	s += "<br>";
	var t = cpcTriplet();
	s += "CPC Triplet:";
	s += "<ul><li class='cpcGREEN'>Improved: " + t[2] + "</li>";
	s += "<li>Not Signification: " + t[1] + "</li>";
	s += "<li class='cpcRED'>Reduced: " + t[0] + "</li>";
	s += "</ul>";
	s += "Operator Control Mode: <b>" + cpcControlMode(t) + "</b><br>";

	s += "<br>";



	s += "</div>";
	s += "<br>";
	return s;


}




function buildPrintEntryHTML(node, nodeLevelText)
{
	
	var s = "";
	s += "<div class='printEntry'>";

	s += "<span class='title'>";
	s += "<b>" + nodeLevelText + "</b> ";

	if (node == CREAM_ANALYSIS) {
		s += "CREAM START";
	} else {
		s += node.prefix + ": ";
		s += node.title ;

	}

	s += "</span>";

	if (node.done == false) {
		s += "<span class='incomplete'>";
		s += "analysis incomplete";
		s += "</span>";
	}	



	s += "<table border=0 cellspace=7 style='font-size: inherit;'>";

	
	if (node.prefix.indexOf('S') == -1 && node != CREAM_ANALYSIS) {
		
		s += "<tr><td class='labelleft'>";
		s += "SC: ";
		s += "</td><td>";
		s += node.sc;
		s += "</td></tr>";
	}
	

	s += "<tr><td class='labelleft'>Notes:</td>";
	s += "<td>" + node.notes + "</td></tr>";

	if (node.jump > 0) {
		s += "<tr><td class='labelleft'>";
		s += "Jumps to:</td><td>";
		s += nodeLevel(findNodeIndex(node.jump));
		s += "</td></tr>";
	}
	
	s += "</table>";

	s += "</div>";

	s += "<br>";
	return s;
}







function printTreeViewHelperHTML(node, level)
{
	
	var s = "";
	s = "<div style='padding-left: ";
	s += (level) * 40;
	s += "'>";
	s += buildPrintEntry(node, nodeLevel(node));
	s += "</div>";

	if (node.visible == true) {
		var c = node.child;
		while (c != null) {
			s += printTreeViewHelperHTML(c, level + 1);
			c = c.next;
		}
	}
	return s;
}


