

// place CREAM algorithm pane and analysis pane

CREAM_ANALYSIS_COUNT = 1;	// counter for nodes in analysis
CREAM_ANALYSIS = new creamAnalysis();
CREAM_ANALYSIS.prefix = "";
CREAM_ANALYSIS.index = 0;

navPanel = null;
workPanel = null;
summaryPanel = null;

SELECTED_INDEX = -1;

function workspace_onResize()
{
	var h = window.innerHeight;
	var t = document.getElementById('toolbarBody').clientHeight;
	var np = document.getElementById('navPanel');
	var wp = document.getElementById('workPanel');
	var sp = document.getElementById('summaryPanel');
	np.style.height = h - t;
	wp.style.height = h - t;
	sp.style.height = h - t;
}


function displayWorkspace()
{
	// generate navPanel, workPanel, summaryPanel
	var s = "";
	s += "<table width=100% cellpadding=0 cellspacing=0>";
	s += "<tr><td width=250px><div id='navPanel'></div></td>";
	s += "<td><div id='workPanel'></div></td>";
	s += "<td><div id='summaryPanel'></div></td>";
	s += "</tr></table>";
	var d = element("div");
	d.innerHTML = s;


	var appBody = document.getElementById('appBody');
	
	appBody.innerHTML = "";
	appBody.appendChild(d);

	navPanel = document.getElementById('navPanel');
	workPanel = document.getElementById('workPanel');
	summaryPanel = document.getElementById('summaryPanel');

	workspace_onResize();

	setNavigationPanel(0);
	refreshWorkPanel();
}


function makeVisible(index) {
	var n = document.getElementById("node" + index);
	var p = document.getElementById("workPanel");

	var h = n.clientHeight;

	var t = 0;
	var l = 0;

	if (VIEW_MODE == 'flow') { 
		p = n.parentNode.parentNode;
	} else {	// tree view
		p = n.parentNode;
	}


	while (n != p) {
		console.log("makeVisible: " + n.id)
		t += n.offsetTop;
		l += n.offsetLeft;
		console.log("    " + t + ", " + l);
		n = n.parentNode;
	}

	console.log("t=" + t + ", l=" +l);
	workPanel.scrollTop = t;
	workPanel.scrollLeft = l;
}

function toggleVisible(index) {
	var p = findNodeIndex(index);
	
	p.visible = !p.visible;
	refreshWorkPanel();

}


function setSC(index, title) {
	var n = findNodeIndex(index);
	n.sc = title;
	refreshWorkPanel();

}

function addNode(index, title, prefix) 
{

	var p = findNodeIndex(index);
	var n = addAnalysisNode(p, title);
	n.prefix = prefix;

	if (prefix == "ILSA" || prefix == "DLSA") {
		n.done = true;
	}

	refreshWorkPanel();
	var k = workPanel.innerHTML;

	//setNavigationPanel(index, title);

	//makeVisible(index);

}

function deleteNode(index) {
	var n = findNodeIndex(index);

	var p = n.parent;


	// go through the jumpFrom nodes and clear them
	var j = n.jumpFrom;
	while (j != null) {
		var t = findNodeIndex(j.data.index);
		t.jump = -1;	
		t.done = false;
		j = j.next;
	}


	var jumpTarget = findNodeIndex(n.jump);
	if (jumpTarget != null) {
		var j = jumpTarget.jumpFrom;
		while (j != null) {
			if (j.data.index == index) {
				break;
			}
			j = j.next;
		}
		jumpTarget.jumpFrom = deleteElt(jumpTarget.jumpFrom. j); 
	}



	deleteAnalysisNode(n);




	refreshWorkPanel();

	setNavigationPanel(p.index, p.title);
	

	//makeVisible(p.index);
}

function findNodeIndex(index) { 
	return findNodeIndexHelper(CREAM_ANALYSIS, index);
}

function findNodeIndexHelper(node, index) {

	if (node == null) {
		return null;
	}

	if (node.index == index) {
		return node;
	}

	var n = node.child;
	while (n != null) {
		var c = findNodeIndexHelper(n, index);
		if (c != null) {	
			return c;
		}
		if (n.index == index) {
			return n;
		}		
		n = n.next;
	}
	return null;
}


function setSummary(index)
{
	// generate the summary for this node, from start point to here
	
	var node = new Array();
	var n = findNodeIndex(index);
	var i = 0;
	while (n != null) {
		node[i] = n;
		i++;
		n = n.parent;
	}

	var s = "";

	s += "<div class='panel'>"
	s += "<div class='info'>"
	s += "<div class='title'>"
	s += "Analysis Path Summary:";
	s += "</div>";
	s += "<div class='pathsummary'>";
	s += nodeLevel(node[0]) + " " + node[0].prefix + ": " + node[0].title;
	s += "</div>";
	s += "</div>"


	s += "<div class='panel'>";
	for (var j = i-1; j >=0; j--) {
		// render info to summary screen

		s += "<div class='divider'>"
		
	
		// jump froms
		if (node[j].jumpFrom != null) {
			s += "<div class='jump'>"
			var k = node[j].jumpFrom;
			while (k != null) {
				s += "<a href='javascript:"; 
				s += "makeVisible(" + k.data.index + ");";
				s += "'>";
				s += "Jumps to here: ";
				s += nodeLevel(k.data) + " " + k.data.title;	
				s += ": <span class='sc'>";
				s += k.data.sc; + "</span>";

				s += "</a><br>";
				k = k.next;
			}		
			s += "</div>";

		}
		s += "<a href='javascript:";
		s += "makeVisible(" + node[j].index + ");";
		s += "'>";
		s += nodeLevel(node[j]);
		s += " " + node[j].title + ": ";
		s += "<span class='sc'>" + node[j].sc; + "</span>";
		
		s += "</a>";

		s += "</div>";
		s += "<div class='grouping'>";
		s += "<div class='desc'>";

		s += node[j].notes;
		s += "</div>";
	
		s += "</div>";
	}
	s += "</div>";
	summaryPanel.innerHTML = s;

}



function setNavigationPanel(index)
{
	SELECTED_INDEX = index;

	setSummary(index);

	// generate navigation panel based on the searching parameter
	// and analysis direction

	// depends on analysis direction
	
	// have it create junk nodes, etc

	var s = generateCREAM(index);
	navPanel.innerHTML = s;
	navPanel.scrollTop = 0;


}

function toggleNodeDone(index) {
	var n = findNodeIndex(index);
	n.done = !n.done;
	refreshWorkPanel();	

}

function jumpNode(index) {
	
	var n = findNodeIndex(index);

	if (n.jump == -1) {
		// ask user for reference
		var s = "";
		s += "Which node does the analysis of ";
		s += "\"" + nodeLevel(n) + "\"";
		s += " jump to?";
		var r = prompt(s);
	
		// find the node;
		var j = findNodeLevel(r);	
		
		if (j == null) {
			alert("\"" + r + "\" does not exist");
			
		} else if (j.title != n.title) {
			var s = nodeLevel(n) + n.title;	
			s +=  " is not the same as " + r + j.title;
			alert(s);
			
		} else {
			n.jump = j.index;
		}

	} else {
		n.jump = -1;
	}

	setJump(index);


	refreshWorkPanel();

}

function findNodeLevel(s) {
	// helper function for jumpNode
	var c = CREAM_ANALYSIS;
	
	// parse through the string
	
	s += ".";
	var i = 1;
	var j = 0;
	while (s.length > 0 && i > 0 && j < 100) {
	
		i = s.indexOf(".");
		if (i > 0) {
			c = c.child;	
			var level = parseInt(s.substr(0, i));
			s = s.substr(i+1);
			try {
				for (var a = 1; a < level; a++) {
					c = c.next;
				}
			} catch(ex) {
				return null;
			}
		}	
		j++;
	}
	if (j == 100) {
		return null;
	}
	return c;

}



function setNodeNotes(event, index)
{
	var p = findNodeIndex(index);
	var t = event.target;
	p.notes = t.value


}


VIEW_MODE = 'flow';

function setView(str) {
	VIEW_MODE = str;
	refreshWorkPanel();

}

function toggleAnalysisPath() {

	var t = summaryPanel.style.display;

	if (t == "") {
		t = "none";
	} else {
		t = "";
	}

	summaryPanel.style.display = t;

}




function refreshWorkPanel()
{

	// go thru work panel, refresh
	var hscroll = workPanel.scrollLeft;
	var vscroll = workPanel.scrollTop;


	var s = "";
	s += "<div class='panel' style='width: 100%'>";
	s += "<div class='info'>";

	s += "<a ";
	if (VIEW_MODE == 'flow') {
		s += "class='selectedAnchor'";
	}
	s += " href='javascript:setView(\"flow\");'>";
	s += "flow view</a>";

	s += "<a ";
	if (VIEW_MODE == 'tree') {
		s += "class='selectedAnchor'";
	}
	s += " href='javascript:setView(\"tree\");'>";
	s += "tree view</a>";

	s += "<a href='javascript:toggleAnalysisPath();'>";
	s += "analysis path summary</a>";


	s += "</div>";
	s += "</div>";

	//s += "<div style='height: 40px;'></div>";



	switch (VIEW_MODE) {
		case 'tree':
			s += treeView(CREAM_ANALYSIS);
			break;
		case 'flow':
			s += tableView(CREAM_ANALYSIS);
			break;
	}
	workPanel.innerHTML = s;
	
	workPanel.scrollLeft = hscroll;
	workPanel.scrollTop = vscroll;
}	


function element(s) {
	return document.createElement(s);
}


function tableView(node)
{
	var s = "";
	s += "<table class='entry'  rules='rows' frame='void'>"
	s += tableViewHelper(node);
	s += "</table>";
	return s;
}

function tableViewHelper(node)
{
	if (node == null) {
		return "";
	}

	var s = "";
	s += "<td rowspan=";
	if (node.visible == true) {
		s += nodeRowSpan(node.child);
	} else {
		s += "1"
	}
	s += ">";

	s += buildEntry(node, nodeLevel(node));
	//s += node.title;
	s += "</td>";

	if (node.visible == true) {
		s += tableViewHelper(node.child);
	
	// go thru children of the node
	var c = null;
	if (node.child != null) {
		c = node.child.next;
	}

	while (c != null) {
		s += "</tr><tr>";
		s += tableViewHelper(c);
		c = c.next;
	}


	}
	return s;

}

function nodeLevel(node)
{
	return nodeLevelHelper(node, null);
}

function nodeLevelHelper(node, s) {
	// return a string corresponding to the level
	// what is my position in the child link list from the parent;
	if (node == null) {
		alert("nodeLevelHelper: " + s);
		return "";
	}

	if (node.parent == null) {
		if (s == null) {
			return "Start)";
		} else {
			return s;
		}
	}


	var c = node.parent.child;
	var i = 1;
	while (c != node) {
		i++;
		c = c.next;
	}
	// found it
	if (s == null) {
		t = i + ")";
	} else {
		t = i + "." + s;
	}

	return nodeLevelHelper(node.parent, t);

}

function selectNode(index) {
	setNavigationPanel(index);
	refreshWorkPanel();

	var t = document.getElementById("textnode" + index);
	t.focus();

}

function buildEntry(node, nodeLevelText)
{
	
	var s = "";
	s += "<div class='entry'";
	s += " id=\"node" + node.index + "\" ";
	s += ">";
	s += "<a width='100' href='javascript:selectNode(";
	s += node.index + ");'>";
	
	
	if (node.done == true) {
		s += "<span class='preface'>";
	} else {
		s += "<span class='prefaceMore'>";
	}
	s += nodeLevelText + " ";
	s += "</span>";


	if (node == CREAM_ANALYSIS) {
		s += "<span class='title'>";
		s += "CREAM START";
		s += "</span>";
	} else {

		s += "<span class='title'"

		s += ">";
		s += node.prefix + ": ";
		s += node.title ;
		s += ": </span>";
	
	}
	s += "</a>";
	s += "<br>";



	if (node.prefix.indexOf('S') == -1 && node != CREAM_ANALYSIS) {
		s += "<div class='sc'>";
		s += "SC: " + node.sc;
		s += "</div>";
	}
	
	 


	if (node.visible == true) {
		s += "<textarea onblur='setNodeNotes(";
		s += "event, " +  node.index + ");'";

		s += " id='textnode" + node.index + "' ";

		if (SELECTED_INDEX == node.index) {	
			s += " class='notes' "
		} else {
			s += " readonly class='notesDisabled' "
			s += " onclick='javascript:selectNode(";
			s += node.index + ");'";
		}

		s += ">";
		s += node.notes;
		s += "</textarea><br>";
	}
	if (node.jump != -1) {
		s += "<div class='jump'>";
		// FIXME: if jump node is deleted
		s += "Analysis jumps to " + nodeLevel(findNodeIndex(node.jump));
		s += "</div>";
	}

	if (node.jumpFrom != null) {
		var j = node.jumpFrom;
		s += "<div class='jump'>";

		while (j != null) {
			s += "Jumps to here: " + nodeLevel(findNodeIndex(j.data.index)) + "<br>";
			j = j.next;
		}
		s += "</div>";
	}

	if (SELECTED_INDEX == node.index) {
	s += "<span class='toolbar'>"
	s += "<a href=\"javascript:deleteNode(";
	s += node.index;
	s += ")\">";
	s += "delete";
	s += "</a>";
	

	s += "<a href=\"javascript:toggleVisible(";
	s += node.index;
	s += ")\">";
	s += "visible";
	s += "</a>";

	s += "<a href=\"javascript:jumpNode(";
	s += node.index;
	s += ")\">";
	s += "jump";
	s += "</a>";

	s += "<a href=\"javascript:toggleNodeDone(";
	s += node.index;
	s += ")\">";
	s += "done";
	s += "</a>";
	
	s += "</span>";

	}


	s += "<span class='status'>"
	if (node.done == false) {
		s += "analysis incomplete. ";
	}
	if (node.visible == false) {
		s += "There are " + countChildNodes(node.child);
		s += " child nodes invisible";

		// FIXME: check if done
		if (checkForDone(node.child) == false) {
			s += ", some incomplete";
		}
	}

	s += "</span>";



	s += "</div>";
	s += "<br>";
	return s;
}


//
function nodeRowSpan(node) {
	// helper function to tableView()


	// count number of leaves
	var leaves = 0;
	var c = node;
	while (c != null) {
		if (c.child == null || c.visible == false) {
			leaves++;
		} else {
			leaves += nodeRowSpan(c.child);
		}
		c = c.next;
	}

	if (leaves == 0) {
		leaves = 1;
	}
	return leaves;
}


// data structure for managing cream analysis

function creamAnalysis()
{
	this.type = "node";

	this.prefix = "";
	this.title = "";
	this.sc = "";
	this.notes = "";
	this.parent = null;
	this.child = null;
	this.next = null;
	this.index = null;
	this.done = false;
	this.visible = true;
	this.jump = -1;
	this.jumpFrom = null;	// TODO: jump handlers for adding / deleting
	this.DOM = null;	// temp variable, used for tracking

}

function addAnalysisNode(parent, title)
{
	var ret = new creamAnalysis()
	ret.title = title;
	ret.parent = parent;
	ret.index = CREAM_ANALYSIS_COUNT;
	CREAM_ANALYSIS_COUNT++;

	// add to the end of the parent's child linked list

	if (parent.child == null) {
		parent.child = ret;
	} else {
		var e = findEnd(parent.child);
		e.next = ret;
	}

	return ret;	

}


function deleteAnalysisNode(node)
{
	// remove node from the child link list
	var p = node.parent;
	var h = deleteElt(p.child, node);
	p.child = h;
}



function treeView(node)
{
	return treeViewHelper(node, 0);

}

function treeViewHelper(node, level)
{
	
	var s = "";
	s = "<div style='padding-left: ";
	s += (level) * 50;
	s += "'>";
	s += buildEntry(node, nodeLevel(node));
	s += "</div>";

	if (node.visible == true) {
		var c = node.child;
		while (c != null) {
			s += treeViewHelper(c, level + 1);
			c = c.next;
		}
	}
	return s;
}



function countChildNodes(node)
{
	var count = 0;
	var n = node;
	while (n != null) {
		var c = n.child;
		while (c != null) {
			count += countChildNodes(c);
			c = c.next;
		}
		n = n.next;
		count++;
	}
	return count;
}

function checkForDone(node) {
	// check all child nodes, and return true iff all are done
	var n = node;
	while (n != null) {
		if (n.done == false) {
			return false;
		}
		var c = n.child;
		while (c != null) {
			return checkForDone(c);
			c = c.next;
		}
		n = n.next;
	}
	return true;
}


function setJump(index)
{
	var n = findNodeIndex(index);

	// add the jump to the target's jumpfrom link list

	if (n.jump > 0) {
		var t = findNodeIndex(n.jump);
		// add to the beginning of the linked list		
		var h = new singly_link_list();
		h.data = n;
		h.next = t.jumpFrom;
		t.jumpFrom = h;

	}


	// FIXME: remove jumps on DELETES


}
