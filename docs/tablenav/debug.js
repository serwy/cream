
// DEBUG window code

DEBUG_WINDOW = null; //window.open("debug.html", "Debug","width=1000,height=300,scrollbars=yes, status=yes,resizable=yes");
DEBUG_WINDOW.innerHTML="";
var d_number = 1;

function DEBUG(txt) 
{
	var div = document.createElement("div");
	var font = document.createElement("font");
	font.setAttribute("color", "#FF5555");
	font.appendChild(document.createTextNode(d_number + ":    "));
	div.appendChild(font);
	div.appendChild(document.createTextNode(txt));
	DEBUG_WINDOW.document.body.appendChild(div);
	d_number++;
}

