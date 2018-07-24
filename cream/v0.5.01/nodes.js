var targetNode = null;	// ptr to node object that is moved, and currently selected

var nodeHead = null;



//
// connect lines from parents to children
//
function line_data(parent, child)
{
	// node references
	this.parent = parent;
	this.child = child;

	this.visible = false;

	this.line1 = document.createElement("div");
	this.line1.setAttribute("style", "position: absolute; left: 0; top: 0; width: 0; height: 0;");
	this.line1.setAttribute("class", "line");


	this.line2 = this.line1.cloneNode(false);
	this.line3 = this.line1.cloneNode(false);


	this.deleteLine = function() {
		this.hide();  // remove lines from doc body

		// remove all connections to parent
		this.parent = null;
		this.child = null;
	}
	
	this.update = function() {
		
		var x1 = parseInt(this.parent.left + this.parent.container.offsetWidth);
		var y1 = parseInt(this.parent.top + this.parent.height / 2);
			
		var x2 = parseInt(this.child.left);
		var y2 = parseInt(this.child.top + this.child.height / 2);

	
		var tmp;

		//what is the box? \ or / ?

		var w = parseInt((x2 - x1) / 2);
		var h = parseInt(y2 - y1);


		// for the \ line
		var l1 = this.line1;
		var l2 = this.line2;
		var l3 = this.line3;

		if (w > 0) {
			l1.style.left = x1;
			l1.style.top = y1;
			l1.style.width = w;
			l1.style.height = 0;

			l3.style.left = x1 + w;
			l3.style.top = y2;
			l3.style.width = w -2;
			l3.style.height = 0;

		} else {
			l1.style.left = x1 + w;
			l1.style.top = y1;
			l1.style.width = -w;
			l1.style.height = 0;

			l3.style.left = x2;
			l3.style.top = y2;
			l3.style.width = -w -2;
			l3.style.height = 0;
		}
	
		if (h > 0) {
			l2.style.left = x1 + w;
			l2.style.top = y1;
			l2.style.width = 0;
			l2.style.height = h;
		} else {
			l2.style.left = x1 + w;
			l2.style.top = y2;
			l2.style.width = 0;
			l2.style.height = -h;
		}

	}

	this.hide = function() {
		if (this.visible == true) {
			document.body.removeChild(this.line1);
			document.body.removeChild(this.line2);
			document.body.removeChild(this.line3);
			this.visible = false;
		}
	}

	this.show = function() {
		if (this.visible == false ) {
			document.body.appendChild(this.line1);
			document.body.appendChild(this.line2);
			document.body.appendChild(this.line3);
			this.visible = true;
		}
	}

	//this.update();
	this.show();

}



// recursive system for tracking
// link structure - each node has 1 primary child and many siblings
//
// lines from child to parent


function nodeObject(parent, x, y, w, h, title) {

	// doubly-linked list for nodes
	this.parent = parent;
	this.child = null;

	// singly-linked list structure for chaining multiple children to one parent
	this.next = null;

	// line to parent pointer
	this.lineStru = null;

	this.callback = ""; // callback function to be eval'ed when focused


	// DATA
	this.data_type = "";
	this.data_cons = "";

	this.data_sc = "";
	this.data_text = "";
	this.data_done = 0;

	// DATA



	if (x == null) { x = 0; }
	if (y == null) { y = 0; }
	if (w == null) { w = 100; }
	if (h == null) { h = 100; }
	
	this.top = y;
	this.left = x;
	this.width = w;
	this.height = h;

	this.deleteNode = function() {

		var tmp = this.child;
		while (tmp != null) {
			tmp.deleteNode();
			tmp = tmp.next;
			
		}
		this.child = null;
				
		
		document.body.removeChild(this.container);
		this.lineStru.deleteLine();
		this.lineStru = null;
		
		// need to remove from parent's linked list of child nodes
		var tmp = this.parent.child;
		
		// special case, first node is target
		if (tmp == this) {
			this.parent.child = tmp.next;
		} else {
			while (tmp != null) {
				if (tmp.next = this) {
					var n = tmp.next.next;
					tmp.next = n;
					break;			
				}
				tmp = tmp.next;
			}
		}

		this.parent = null;
		this.child = null;
		
	}


	this.addChild = function(parentNode) {
		if (parentNode.child == null) {
			parentNode.child = this;
		} else {
			// need to append at the end of child list
			var tmp = parentNode.child;
			while (tmp.next != null) {
				tmp = tmp.next;
			}
			tmp.next = this;
		}
	}

	this.updateChild = function(dx, dy) {
		
		// for each child, update
		var tmp = this.child;

		while(tmp != null) {
			tmp.left += dx;
			tmp.top += dy;
			tmp.update.call(tmp);
			tmp.updateChild.call(tmp, dx, dy);
			tmp = tmp.next;

		}
	}

	this.setParent = function(parent) {	// for reloading structure
		this.parent = parent;
		if (parent != null) { 
			this.addChild(this.parent);
			this.lineStru = new line_data(this.parent, this);
			this.lineStru.update.call(this.lineStru);
		}
	}
	this.setParent(parent);

 
	this.container = document.createElement("div");


	this.dragTop = document.createElement("div");
	this.content = document.createElement("div");
	this.dragBottom = document.createElement("div");

	//this.content.innerHTML = "<div class='cTitle'>SC:</div>";

	this.container.appendChild(this.dragTop);
	this.container.appendChild(this.content);
	this.container.appendChild(this.dragBottom);

	this.container.setAttribute("onmousedown", "javascript:moveFocus(event);");


	this.update = function() {
		var s = "";
		s += "position: absolute;";
		s += "left: " + this.left + ";";
		s += "top: " + this.top + ";";
		s += "width: " + this.width + ";";
		s += "height: " + this.height + ";";
		
		this.container.setAttribute("style", s);
	
		var h = this.height - (this.dragTop.offsetHeight + this.dragBottom.offsetHeight);
		this.content.setAttribute("style", "height: " + h + ";");

	}

	this.hideLines = function() {
		if (this.lineStru != null) {	
			this.lineStru.hide.call(this.lineStru);
		}
		var tmp = this.child;
		while(tmp != null) {
			tmp.lineStru.hide.call(tmp.lineStru);
			tmp = tmp.next;
		}
	}

	this.updateLine = function() {
		
		if (this.lineStru != null) {	
			this.lineStru.update.call(this.lineStru);
			this.lineStru.show.call(this.lineStru);

		}

	try {
		// for each child, update
		var tmp = this.child;

		while(tmp != null) {
			tmp.lineStru.update.call(tmp.lineStru);
			tmp.lineStru.show.call(tmp.lineStru);
			tmp.updateLine.call(tmp);
			
			tmp = tmp.next;
		}
	} catch(ex) { alert(ex); }
	
	}

	this.buildUI = function() {
		this.dragTop.setAttribute("class", "dragTop");
		this.dragTop.setAttribute("onmousedown", "drag_init(event, D_MOVE);");
		this.dragTop.setAttribute("onmouseup", "drag_release(event, D_MOVE);");


	
		this.dragBottom.setAttribute("class", "dragBottom");
		this.dragBottom.setAttribute("onmousedown", "drag_init(event, D_RESIZE);");
		this.dragBottom.setAttribute("onmouseup", "drag_release(event, D_RESIZE);");

		this.content.setAttribute("class", "dragContent");


	}

	this.updateResize = function () { 
		this.width = this.container.clientWidth;
		this.height = this.container.clientHeight;
		var h = this.height - (this.dragTop.offsetHeight + this.dragBottom.offsetHeight);
		this.content.setAttribute("style", "height: " + h + ";");
	}


	this.updateDrag = function() {
		

		this.left = this.container.offsetLeft;
		this.top = this.container.offsetTop;

	}

	this.setFocus = function() {
		// blur old focus
		NODE_FOCUS.setBlur();
		NODE_FOCUS = this;

		// make function callback

		this.container.setAttribute("class", "drag dragFocus");
		this.dragTop.setAttribute("class", "dragTop dragFocus");
		this.dragBottom.setAttribute("class", "dragBottom dragFocus");

		DEBUG(this.callback);
		eval(this.callback);
	}

	this.setBlur = function() {

		this.container.setAttribute("class", "drag dragBlur");
		this.dragTop.setAttribute("class", "dragTop dragBlur");
		this.dragBottom.setAttribute("class", "dragBottom dragBlur");

	}

	this.container.nodeObject = this;
	this.container.setAttribute("id", "nodeObject");
	
	this.buildUI();


	document.body.appendChild(this.container);

	this.update();
	this.setBlur();
}

function moveFocus(event)
{
	var t = event.target;
	while (t.id != "nodeObject") {
		t = t.parentNode;
	}

	var n = t.nodeObject;


	n.setFocus();

}



//
// nodeData(n) 
//	- generate HTML for displaying CREAM data in node
function nodeData(n)
{

	var t = n.data_type;
	var cons = n.data_cons;
	var sc = n.data_sc;
	var text = n.data_text;
	var done = n.data_done;

	var s = "";
	s += "<div class='nodeData'>";
	if (t == "dlg") {
		s += "DL: ";
	} 
	if (t == "ilg") {
		s += "IL: ";
	}
	if (t == "dlsa") {
		s += "DLSA: ";
	}
	if (t == "ilsa" ) {
		s += "ILSA: ";
	}
	s += cons + "<br>";
	if (t != "dlsa" && t != "ilsa") {
		s += "SC: " + sc + "<br>";
	}
	s += "</div>";
	s += text + "<br>";
	//s += done;
	
	n.content.innerHTML = s;

}



// snapGrid
// 	- fancy snap to grid subroutine ;)
function snapGrid(num) {
	num = parseInt(num / 10) * 10;
	return num;
}


var D_MOVE = 1;
var D_RESIZE = 2;

var drag_X;
var drag_Y;
var drag_target = null;
var drag_mode = 0;

var drag_startX = 0;
var drag_startY = 0;


function drag_init(event, mode)
{


	drag_mode = mode;
	var e = event.target.parentNode;
	drag_target = event.target;

	e.style.zIndex = "20";
	drag_target.onmousemove = drag_move;

	var n = drag_target.parentNode.nodeObject;
	n.hideLines.call(n);

	if (drag_mode == D_MOVE) {
		drag_X = parseInt(event.clientX) - parseInt(e.style.left);
		drag_Y = parseInt(event.clientY) - parseInt(e.style.top);

		drag_startX = parseInt(e.style.left);
		drag_startY = parseInt(e.style.top);


	} else {
		drag_X = parseInt(event.clientX) - parseInt(e.style.width);
		drag_Y = parseInt(event.clientY) - parseInt(e.style.height);

		drag_startX = parseInt(e.style.width);
		drag_startY = parseInt(e.style.height);

	}

	//DEBUG("drag_start (" + drag_startX + ", " + drag_startY + ")");
		
}


function drag_move(event)
{
	if (drag_target == null) {
		return;
	}

	var e = drag_target.parentNode;
	
	if (drag_mode == D_MOVE) {
		e.style.left = snapGrid((parseInt(event.clientX) - parseInt(drag_X)));
		e.style.top = snapGrid((parseInt(event.clientY) - parseInt(drag_Y)));

		e.nodeObject.updateDrag.call(e.nodeObject);
	} else {
		e.style.width = snapGrid(parseInt(event.clientX) - parseInt(drag_X));
		e.style.height = snapGrid(parseInt(event.clientY) - parseInt(drag_Y));
		
		// move the resizer box
		
		e.nodeObject.updateResize.call(e.nodeObject);
	}

}

function drag_release(event)
{
	var e = event.target;
	e.onmousemove = null;
	drag_target.parentNode.style.zIndex="19";

	var dx;
	var dy;

	if (drag_mode == D_MOVE) {
		dx = parseInt(drag_target.parentNode.nodeObject.left) - drag_startX;
		dy = parseInt(drag_target.parentNode.nodeObject.top) - drag_startY;

		drag_target.parentNode.nodeObject.updateChild.call(drag_target.parentNode.nodeObject, dx, dy);

	} else {
		dx = parseInt(drag_target.parentNode.nodeObject.width) - drag_startX;
		dy = parseInt(drag_target.parentNode.nodeObject.height) - drag_startY;

		drag_target.parentNode.nodeObject.updateChild.call(drag_target.parentNode.nodeObject, dx, 0);

	}

//	drag_target.parentNode.nodeObject.updateLine.call(drag_target.parentNode.nodeObject);

	drag_target.parentNode.nodeObject.updateLine();

	var n = drag_target.parentNode.nodeObject;


	drag_target.parentNode.onmousemove = null;
	drag_target = null;
	
	
}




function onMouseMove(event)
{
	if (drag_target != null) {
		drag_move(event);
	}
}

function onMouseUp(event) {
	if (drag_target != null) {
		//DEBUG("releasing");
		drag_release(event);
		drag_target = null;
	}
}


