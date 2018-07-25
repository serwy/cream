
// data structure for managing cream analysis

// node
//	prefix (GA/GC/SC)
// 	GA/GC/SC   (title)
//	SC         (sc)
//	NOTES      (notes)
//	PARENT     node
//	CHILD      node
//	NEXT       node
//	PREVIOUS   node
// 	INDEX	   count

CREAM_ANALYSIS_COUNT = 0;	// counter for nodes in analysis
CREAM_ANALYSIS = new creamAnalysis();
CREAM_ANALYSIS.prefix = "START";


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
	this.index = 0;
	this.done = false;
	this.visible = true;
	this.pseudoChild = null;

	this.DOM = null;	// temp variable, used for tracking

}

function addAnalysisNode(parent, title)
{
	var ret = new creamAnalysis()
	ret.title = title;
	ret.parent = parent;

	// add to the end of the parent's child linked list

	if (parent.child == null) {
		parent.child = ret;
	} else {
		var e = findEnd(parent.child);
		e.next = ret;
	}

	// add to the DOM


	return ret;	

}

function deleteAnalysisNode(node)
{
	// remove node from the child link list
	var p = node.parent;
	var h = deleteElt(p, node);
	p.child = h;
}



function linkPseudoChild(pParent, pChild)
{

}



function recurseAnalysis(node, level, depth, parentIndex)
{

	var index;
	if (parentIndex > 0) {
		index = parentIndex + "." + depth;
	} else {
	 	index = depth;
	}
	// create the node
	var s = "";

	s += "<div class='entry' ";
	s += " onmouseover='javascript:linkMouseOver(event)'";
	s += " onmouseout='javascript:linkMouseOut(event)'";
	s += " onmousedown='javascript:linkMouseDown(event)'";


	s += " style='padding-left: ";
	s += ((level + 1) * 50); // indent level
	s += ";' ";
	s += " id='container'>";

	s += "<span class='preface'>";
	s += index + ") ";
	s += "</span>";
	s += "<span class='title'>";
	s += node.title ;
	s += ": </span>";
	s += "<span class='sc'>";
	s += node.sc;
	s += "</span>";
//	s += "<span class='done'>done</span>";
	s += "<textarea class='notes'>";
	s += node.notes;
	s += "</textarea>";
	s += "</div>";

	var c = node.child;
	while (c != null) {
		s += recurseAnalysis(c, level + 1, depth, index);
		c = c.next;
		depth++;
	}

	return s;
}

function setBack(event)
{
	var t = event.target;
	t.parent.parent.style.background = "#F7F7F7";


}

hoverTarget = null;
selectTarget = null;


function linkMouseOver(event)
{
	var t = event.target;
	
	if (t.id != 'container') {
		return;
	}


	if (t != hoverTarget) {
		if (hoverTarget != null && hoverTarget != selectTarget) {
			hoverTarget.setAttribute("class", "entry");
		}
	}

	hoverTarget = t;

	if (t == selectTarget) {
		return;
	}



	t.setAttribute("class", "entry entryhover");
}


function linkMouseDown(event)
{
	var t = event.target;
	
	if (t.id != 'container') {
		return;
	}


	if (selectTarget != null && t != selectTarget) {
		selectTarget.setAttribute("class", "entry");
	}
	selectTarget = t;

	t.setAttribute("class", "entryselect");


}
function linkMouseOut(event)
{
	

	return;
}

