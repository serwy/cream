//    CREAM software navigator - core engine functionality
//    Copyright (C) 2006-2007 Roger D. Serwy
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
//
// engine.js
//
// Author: Roger D. Serwy
//         roger.serwy@gmail.com
//
//
// Part of the CREAM. All parsing of the CREAM data structures
// from the cream.xml file
//
// CREAM Table Navigator
//
// Implementation of Retrospective and Prospective algorithms for
// Erik Hollnagel's CREAM system.
//
// Developed for PSYCH494 - Advanced Research in Psychology
// University of Illinois - Urbana Champaign
// February 2007 - September 2007
//


var CREAM_HEAD = null;		// c_data
var CREAM_INFORMATION = null;	// analysisMetadata;
var CREAM_RETROSPECTIVE = 0;
var CREAM_PROSPECTIVE = 1;

function analysisMetadata() {
	this.RETROSPECTIVE = 0;
	this.PROSPECTIVE = 1;
	this.direction = 0;
	this.title = "";
	this.author = "";
	this.description = "";
}

function setDirection(s) {
	s = parseInt(s);
	CREAM_INFORMATION.direction = s;	
}


function deleteGroup(grp)
{
	// given the pointer to grp, remove it
	var p = grp.parent;
	var h = deleteElt(p, grp);
	p.group = h;

}

function deleteGC(gc)
{
	var p = gc.parent;
	var h = deleteElt(p, gc);
	p.gc = h;
}

function deleteGA(ga)
{
	var p = ga.parent;
	var h = deleteElt(p, ga);
	p.ga = h;
}

function deleteSA(sa)
{
	var p = sa.parent;
	var h = deleteElt(p, sa);
	p.sa = h;
}

function deleteSC(sc)
{
	var p = sc.parent;
	var h = deleteElt(p, sc);
	p.sc = h;
}

// deleteElt
//
// 	helper function for deleting portions of the CREAM data structure

function deleteElt(headPtr, delPtr)
{
	if (headPtr == delPtr) {
		var n = headPtr.next;
		headPtr.next = null;
		if (n != null) {
			n.prev = null;
		}
		return n;
	}
	
	var currPtr = headPtr.next;
	prevPtr = headPtr;
	while (currPtr != null) {
		if (currPtr == delPtr) {
			if (prevPtr != null) {
				prevPtr.next = currPtr.next;
			}
			delete currPtr;
		        break;
		}
		prevPtr = currPtr;
		currPtr = currPtr.next;
	}

	return headPtr;
}



// findGA
// returns an array of GA entries that match the "event_name"
function findGA(event_name)
{
	// navigate through tables to find instances of event name as a GA
	var ga_list = null;
	
	var cat_ptr = CREAM_HEAD;

	while(cat_ptr != null) {
		var grp_ptr = cat_ptr.group;

		while(grp_ptr != null) {
			var gc_ptr = grp_ptr.gc;

			while(gc_ptr != null) {
				var ga_ptr = gc_ptr.ga;

				while (ga_ptr != null) {
					if (ga_ptr.name.toUpperCase() == event_name.toUpperCase()) {
						var tmp = new singly_link_list();
						tmp.data = ga_ptr;
						tmp.next = ga_list;
						ga_list = tmp;
					
					}

					ga_ptr = ga_ptr.next;
				}
				gc_ptr = gc_ptr.next;
			}
			grp_ptr = grp_ptr.next;
		}
		cat_ptr = cat_ptr.next;
	}

	return toArray(ga_list);
}

// findGroup
// returns a pointer to a string group
function findGroup(group) {

	var cat_ptr = CREAM_HEAD;
	while (cat_ptr != null) 
	{
		var grp_ptr = cat_ptr.group;
		while (grp_ptr != null) {
			if (grp_ptr.name == group) {
				return grp_ptr;
			}
			grp_ptr = grp_ptr.next;
		}
		cat_ptr = cat_ptr.next;
	}
	return null;
}

// findGC
// returns a pointer to the GC 
function findGC(event_name)
{
	var gc_obj = null;

	var cat_ptr = CREAM_HEAD;
	while (cat_ptr != null) 
	{
		var grp_ptr = cat_ptr.group;
		while (grp_ptr != null) 
		{
			var gc_ptr = grp_ptr.gc;
			while (gc_ptr != null) 
			{
				if (gc_ptr.name.toUpperCase() == event_name.toUpperCase()) 
				{
					gc_obj = gc_ptr;
					break;  // FIXME: break from all while loops
				}
				gc_ptr = gc_ptr.next;
			}
			grp_ptr = grp_ptr.next;
		}
		cat_ptr = cat_ptr.next;
	}	
	return gc_obj;
}


// getProspective()
// move forward, DL/IL for a given event_name
function getProspective(event_name)
{
	DL = getProspectiveLinks(event_name);
	DL = removeInnerDuplicates(DL);


	// let's get the IL's
	IL = new Array();

	var t = findGC(event_name);
	t = t.parent.gc;

	while( t != null) {
		IL = IL.concat(getProspectiveLinks(t.name));
		t = t.next;
	}

	IL = removeInnerDuplicates(IL);
	IL = removeCrossDuplicates(IL, DL);


	retval = {};
	retval.DL = DL;
	retval.IL = IL;

	return retval;
}

// getProspectiveLinks - helper function
function getProspectiveLinks(event_name) {
	g = findGA(event_name);

	// list all the GC's for each GA

	var LINKS = new Array();
	var index = 0;

	for (var i = 0; i < g.length; i++) {
		var ga = g[i];
		var gc = ga.parent.parent.gc;

		while (gc != null) {
			LINKS[index++] = gc;
			gc = gc.next;
		}
	}

	LINKS = removeInnerDuplicates(LINKS);

	return LINKS;
}

// getRetrospectiveSA()
// returns DLSA/ILSA for a given event_name
function getRetrospectiveSA(event_name) {
	g = findGC(event_name);

	var IL = new Array();
	var p = g.parent.gc


	// add all the GA's to the Indirect list
	var t = 0;
	while (p != null) {
		var tsa = p.sa;
		while(tsa != null) {
			IL[t++] = tsa;
			tsa = tsa.next;
		}
		p = p.next;
	}

	// create a DL list of GA's
	var DL = new Array();
	var p = g.sa;
	var t = 0;
	while (p != null) {
		DL[t++] = p;
		p = p.next;
	}

	DL = removeNoneDefined(DL);
	IL = removeNoneDefined(IL);

	IL = removeInnerDuplicates(IL);
	IL = removeCrossDuplicates(IL, DL);



	retval = {}
	retval.IL = IL;
	retval.DL = DL;

	return retval;
}



// getRetrospective()
// returns DL/IL for a given event_name
function getRetrospective(event_name) {
	g = findGC(event_name);

	var IL = new Array();
	var p = g.parent.gc


	// add all the GA's to the Indirect list
	var t = 0;
	while (p != null) {
		var tga = p.ga;
		while(tga != null) {
			IL[t++] = tga;
			tga = tga.next;
		}
		p = p.next;
	}

	// create a DL list of GA's
	var DL = new Array();
	var p = g.ga;
	var t = 0;
	while (p != null) {
		DL[t++] = p;
		p = p.next;
	}

	DL = removeNoneDefined(DL);
	IL = removeNoneDefined(IL);

	IL = removeInnerDuplicates(IL);
	IL = removeCrossDuplicates(IL, DL);



	retval = {}
	retval.IL = IL;
	retval.DL = DL;

	return retval;
}


// removeNoneDefined
// - removes instances of "None Defined"
function removeNoneDefined(a)
{
	var a_len = a.length;
	for (var i = 0; i < a_len; i++) {
		if (a[i].name.toUpperCase() == "NONE DEFINED") {
			a[i] = null;
		}
	}
	
	a = compressArray(a);

	return a;
}



// removeInnerDuplicates
// removes duplicate entries within an array
function removeInnerDuplicates(a)
{
	// remove inner duplicates
	var a_len = a.length;
	for (var i = 0; i < a_len; i++) {
		for (var j = i + 1; j < a_len; j++) {
			if (a[i].name.toUpperCase() == a[j].name.toUpperCase()) {
				a[i] = null;
				break;
			}
		}
	}

	a = compressArray(a);
	return a;
}



// removeCrossDuplicates
// remove duplicates between a and b from a
// return a
function removeCrossDuplicates(a, b) 
{
	var a_new = new Array()
	var index = 0;

	for (var i = 0; i < a.length; i++) {
		var add = true;
		for (var j = 0; j < b.length; j++) {
			if (a[i] == b[j]) {
				add = false;
			}
			if (a[i].name == b[j].name) {
				add = false;
			}
		}
		if (add == true) {
			a_new[index++] = a[i];
		}
	}
	return a_new;
}

// lengthOf()
// returns the length of a linked list
function lengthOf(ptr)
{
	var count = 0;
	while (ptr != null) {
		count++;
		ptr = ptr.next;
	}
	return count;
}


// toArray()
// returns an array containing the data of a linked list
function toArray(ptr)
{
	var i = 0;
	var a = new Array(lengthOf(ptr));

	while (ptr != null) {
		a[i] = ptr.data;
		i++;
		ptr = ptr.next;
	}
	return a;
}




// compressArray
// takes an array and removes the null elements
// and returns the resulting smaller array
function compressArray(a) 
{
	var a_new = new Array();
	var t = 0;
	var len = a.length;
	for (var i = 0; i < len; i++) {
		if (a[i] != null) {
			a_new[t++] = a[i];
		}
	}
	return a_new;
}


// findHead()
// returns the head pointer of a linked list
function findHead(ptr)
{
	if (ptr == null) {
		return null;
	}
	while (ptr.prev != null) {
		ptr = ptr.prev;
	}
	return ptr;
}

////////////////////////////////////////////////////////////////////////////////
// loadTables() 
//
function loadTables(filename)
{
	CREAM_INFORMATION = new analysisMetadata();
	CREAM_HEAD = null;
	var myXMLHttp = new XMLHttpRequest();

	//create a DOM structure
	var r; 
	
	if (filename == null) {
		filename = "creamtable.xml";
	}
	
	myXMLHttp = new XMLHttpRequest();
	myXMLHttp.open("GET", filename, false); 
	myXMLHttp.send(null);
	r = myXMLHttp.responseXML;
	var cream = r.getElementsByTagName("cream")[0];


	

	var information = cream.getElementsByTagName("information")[0];
	
	// save this information
//	CREAM_INFORMATION = new analysisMetadata();
//	CREAM_INFORMATION.title = fc(information, "name");
//	CREAM_INFORMATION.description = fc(information, "desc");
				




	// pull into data structures
	// get all groups
	var categories =  cream.getElementsByTagName("category");

	for(var i = 0; i < categories.length; i++) {
		var n = fc(categories[i], "name");
		var d = fc(categories[i], "desc");

		var cat = addCategory(n, d);
		// get groups
		var groups = categories[i].getElementsByTagName("group");
		for(var j = 0; j < groups.length; j++) {
			var n = fc(groups[j], "name");
			var d = fc(groups[j], "desc");
			var tbl = addGroup(cat, n, d);
			// get GC's
			var gcs = groups[j].getElementsByTagName("gc");
			for(var k = 0; k < gcs.length; k++) {
				var n = fc(gcs[k], "name");
				var d = fc(gcs[k], "desc");
				
				var gc = addGC(tbl, n, d);
				// get GA's
				var gas = gcs[k].getElementsByTagName("ga");
				for(var l = 0; l < gas.length; l++) {
					var n = fc(gas[l], "name");
					var d = fc(gas[l], "desc");						
					addGA(gc, n, d);
				}
				// get SA's
				var sas = gcs[k].getElementsByTagName("sa");
				for(var l = 0; l < sas.length; l++) {
					var n = fc(sas[l], "name");
					var d = fc(sas[l], "desc");
					addSA(gc, n, d);
				}
				// get SC's
				var scs = gcs[k].getElementsByTagName("sc");
				for(var l = 0; l < scs.length; l++) {
					var n = fc(scs[l], "name");
					var d = fc(scs[l], "desc");
					addSC(gc, n, d);
				}
			}
		}
	}

}


function saveTables() {

	// go thru all, t +=



	var t = "\n\n";

	t += "<cream>\n";
	t += tabIndent(1) + "<information>\n";
  	t += tabIndent(2) + "<name>" + CREAM_INFORMATION.name + "</name>\n";
	t += tabIndent(2) + "<desc>" + CREAM_INFORMATION.desc + "</desc>\n";
	t += tabIndent(1) + "</information>\n\n";

	var c = CREAM_HEAD;

	while (c != null) {
		t += "\t<category>";
		t += "\t\t<name>" + c.name + "</name>";
		t += "\t\t<desc>" + c.desc + "</desc>";
	

		var g = c.group;
		while (g != null) {
			t += "";
			t += "\t\t<group>";
			t += "\t\t\t<name>" + g.name + "</name>";
			t += "\t\t\t<desc>" + g.desc + "</desc>";

			var gc = g.gc;
			while (gc != null) {
				t += "";
				t += "\t\t\t\t<gc>";
				t += "\t\t\t\t\t<name>" + gc.name + "</name>";
				t += "\t\t\t\t\t<desc>" + gc.desc + "</desc>";
				var ga = gc.ga;
				while (ga != null) {
					t += "";
					t += "\t\t\t\t\t\t<ga>";
					t += "\t\t\t\t\t\t\t<name>" + ga.name + "</name>";
					t += "\t\t\t\t\t\t\t<desc>" + ga.desc + "</desc>";
					ga = ga.next;
					t += "\t\t\t\t\t\t</ga>";
				}

				var sa = gc.sa;
				while (sa != null) {
					t += "";
					t += "\t\t\t\t\t\t<sa>";
					t += "\t\t\t\t\t\t\t<name>" + sa.name + "</name>";
					t += "\t\t\t\t\t\t\t<desc>" + sa.desc + "</desc>";
					sa = sa.next;
					t += "\t\t\t\t\t\t</sa>";

				}

				var sc = gc.sc;
				while (sc != null) {
					t += "";
					t += "\t\t\t\t\t\t<sc>";
					t += "\t\t\t\t\t\t\t<name>" + sc.name + "</name>";
					t += "\t\t\t\t\t\t\t<desc>" + sc.desc + "</desc>";
					sc = sc.next;
					t += "\t\t\t\t\t\t</sc>";

				}


				
				gc = gc.next;
				t += "\t\t\t\t</gc>";
			}
			g = g.next;
			t += "\t\t</group>";
		}



		c = c.next;
		t += "\t</category>";
	}


	t += "</cream>";

	return t; 

}




function fc(ptr, tag) {
	var r = ptr.getElementsByTagName(tag)[0];
	if (r == null) {
		return "";
	}
	var f = r.firstChild;
	if (f != undefined) {
		var n = f.nodeValue;
		if (n != undefined) {
			return n;
		} else {
			return "";
		}
	} else {
		return ""
	}	


}


/////////////////////////////////////
// add code - used in loadTables

function addCategory(name, desc)
{
	var retval = new cat_data();
	if (CREAM_HEAD == null) {
		CREAM_HEAD = retval;
	} else {
		findEnd(CREAM_HEAD).next = retval;
	}
	retval.name = name;
	retval.desc = desc;

	return retval;
}

function addGroup(category, name, desc)
{
	var retval = new g_data();
	if (category.group == null) {
		category.group = retval;
	} else {
		findEnd(category.group).next = retval;
	}
	retval.name = name;
	retval.desc = desc;
	retval.parent = category;

	return retval;
}


function addGC(group, name, desc) // adds GC to the group
{
	var retval = new gc_data();
	if (group.gc == null) {
		group.gc = retval;
	} else {
		findEnd(group.gc).next = retval;
	}
	retval.name = name;
	retval.desc = desc;
	retval.parent = group;

	return retval;
}

function addGA(gc, name, desc) // adds GA to the GC, as in holnagel book
{
	var retval = new ga_data();
	if (gc.ga == null) {
		gc.ga = retval;
	} else {
		findEnd(gc.ga).next = retval;
	}
	retval.name = name;
	retval.desc = desc;
	retval.parent = gc;

	return retval;
}

function addSA(gc, name, desc) // adds SA to the GC
{
	var retval = new sa_data();
	if (gc.sa == null) {
		gc.sa = retval;
	} else {
		findEnd(gc.sa).next = retval;
	}
	retval.name = name;
	retval.desc = desc;
	retval.parent = gc;

	return retval;
}

function addSC(gc, name, desc)
{
	var retval = new sc_data();
	if (gc.sc == null) {
		gc.sc = retval;
	} else {
		findEnd(gc.sc).next = retval;
	}
	retval.name = name;
	retval.desc = desc;
	retval.parent = gc;

	return retval;
}


function findEnd(stru)
{
	var ptr = stru;
	while (ptr.next != null) {
		ptr = ptr.next;
	}
	return ptr;

}


////////////////////////////////
// data structures
function cat_data() {		// category structure
	this.type = "category";
	this.name = null;	// str
	this.desc = null;	// str
	this.group = null;	// g_data
	this.next = null;	// c_data
}

function g_data() {		// group structure
	this.type = "group";
	this.name = null;	// str
	this.desc = null;	// str
	this.gc = null;		// gc_data
	this.parent = null;	// c_data
	this.next = null;	// g_data
}

function gc_data() {		// general consequent structure
	this.type = "gc";
	this.name = null;	// str
	this.desc = null;
	this.ga = null;		// ga_data
	this.sa = null;		// sa_data
	this.sc = null;		// sc_data
	this.parent = null;	// g_data
	this.next = null;	// gc_data
}

function ga_data() {		// general antecedent structure
	this.type = "ga";
	this.name = null;	// str
	this.desc = null;	// str
	this.parent = null;	// gc_data
	this.next = null;	// ga_data
}

function sa_data() {		// specific antecedent structure
	this.type = "sa";
	this.name = null;	// str
	this.desc = null;	// str
	this.parent = null;	// gc_data
	this.next = null;	// ga_data
}

function sc_data() {		// special consequent structure
	this.type = "sc";
	this.name = null;	// str
	this.desc = null;	// str
	this.parent = null;	// gc_data
	this.next = null;	// sc_data
}

function doubly_link_list() {
	this.type = "doubly_link";
	this.data = null;		// pointer to ga
	this.next = null;	// next for linked list
	this.prev = null;	// doubly-linked list
}

function singly_link_list() 
{
	this.type="singly_link"
	this.data = null;
	this.next = null;	// generic linked-list datatype
}

