//
//  gui.js 
//
//  Author: Roger D. Serwy
//
//  a simple gui toolkit for my needs
//
//  note - need for css for button and buttonhover


function guiAddButton(d, type)
{
	
	var grp = d.getElementsByTagName("guigrp");
	if (grp.length == 0) {
		grp = new Array();
		grp[0] = d;
	}

for (var jj = 0; jj < grp.length; jj++) {
	var h = grp[jj].getElementsByTagName("button");

	var count = h.length;

	var guiArray = new Array(count);

	for(var i = 0; i < count; i++) {
		var cb = h[0].getAttribute("callback");
		var tag = h[0].getAttribute("tag");
		var html = h[0].innerHTML;
		var g = guiButton(html, cb, tag, type);
	
		g.guiArray = guiArray;		// each object points to ui array
		g.guiIndex = i;
		guiArray[i] = g;		// ui array points to all objects
				
		h[0].parentNode.insertBefore(g, h[0]);
		h[0].parentNode.removeChild(h[0]);
	}
}
	return guiArray;

}




function guiButton(title, callback, tag, type)
{
	if (type == null) {
		type = "span";	
	}
	//DEBUG("guiButton(" + title + ", " + callback + ", " + tag + ")");
	var d = document.createElement(type);
	d.innerHTML = title;
	d.setAttribute("class", "button");
	d.setAttribute("onmouseover", "javascript:guiButtonMouseOver(event);");
	d.setAttribute("onmouseout", "javascript:guiButtonMouseOut(event);");
	d.setAttribute("onmousedown", "javascript:guiButtonMouseDown(event);");
	d.setAttribute("callback", callback);
	d.setAttribute("btnNormal", "button");
	d.setAttribute("btnHover", "button buttonhover");
	d.setAttribute("tag", tag);
	return d;
}


function guiRadio(event)
{

	var t = event.target;

	var a = t.guiArray;

	for (var i = 0; i < a.length; i++) {
		a[i].setAttribute("btnNormal", "button");
		a[i].setAttribute("class", "button");
	}

	t.setAttribute("btnNormal", "button buttonpress");
	t.setAttribute("class", "button buttonpress");

}

function guiRadioSet(p)
{
	// p - pointer to element to select
	
	var a = p.guiArray;

	for (var i = 0; i < a.length; i++) {
		a[i].setAttribute("btnNormal", "button");
		a[i].setAttribute("class", "button");
	}

	p.setAttribute("btnNormal", "button buttonpress");
	p.setAttribute("class", "button buttonpress");

	

}
function guiSetNormal(b, c)
{
	b.setAttribute("btnNormal", c);
	b.setAttribute("class", c);
}


function showWindow(event)
{
	guiRadio(event)
}


function guiButtonMouseDown(event) {

	eval(event.target.getAttribute("callback"));
}

function guiButtonMouseOver(event) {
	var t = event.target;
	var n = t.getAttribute("btnHover");
	t.setAttribute("class", n);
}

function guiButtonMouseOut(event) {
	var t = event.target;
	var n = t.getAttribute("btnNormal");
	t.setAttribute("class", n);
}



