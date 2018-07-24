
// DEBUG window code

DEBUG_WINDOW = null; //window.open("debug.html", "Debug","width=1000,height=300,scrollbars=yes, status=yes,resizable=yes");
DEBUG_WINDOW.innerHTML="";
var d_number = 1;
var d_enable = true;
var DEBUG_LINK_HEAD;
function DEBUG_LINK_LIST() {
	this.data = null;
	this.next = null;
}


function DEBUG(txt) 
{
try {
	if (d_enable == false) { return }
	var div = document.createElement("div");
	var font = document.createElement("font");
	font.setAttribute("color", "#FF5555");
	font.appendChild(document.createTextNode(d_number + ":    "));
	div.appendChild(font);
	div.appendChild(document.createTextNode(txt));
	DEBUG_WINDOW.document.body.appendChild(div);
	d_number++;
} catch(ex) { }
}

function DEBUGON()
{
	d_enable = true;

}

function DEBUGOFF()
{
	d_enable = false;

}

function PUSHDEBUG()
{
	var t = new DEBUG_LINK_LIST();
	t.data = d_enable;
	t.next = DEBUG_LINK_HEAD;	
	DEBUG_LINK_HEAD = t;
	
	d_enable = false;
}

function POPDEBUG()
{
	t = DEBUG_LINK_HEAD.next;
	DEBUG_LINK_HEAD = t;
	if (t != null) {
		d_enable = t.data;
	} else {
		d_enable = true;
	}
}
