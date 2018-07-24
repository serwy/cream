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
// February 2007
//

var CREAM_HEAD = null;		// c_data

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
// returns a pointer to a group
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
	CREAM_HEAD = null;
	var myXMLHttp = new XMLHttpRequest();

	//create a DOM structure
	var r; 
	
	if (filename == null) {
		filename = "cream1.xml";
	}
	
	myXMLHttp = new XMLHttpRequest();
	myXMLHttp.open("GET", filename, false); 
	myXMLHttp.send(null);
	r = myXMLHttp.responseXML;
	var cream = r.getElementsByTagName("cream")[0];


	// pull into data structures
	// get all groups
	var categories =  cream.getElementsByTagName("category");

	for(var i = 0; i < categories.length; i++) {
		var n = categories[i].getElementsByTagName("name")[0].firstChild.nodeValue;
		var cat = addCategory(n);
		// get groups
		var groups = categories[i].getElementsByTagName("group");
		for(var j = 0; j < groups.length; j++) {
			var n = groups[j].getElementsByTagName("name")[0].firstChild.nodeValue;
			var tbl = addGroup(cat, n);
			// get GC's
			var gcs = groups[j].getElementsByTagName("gc");
			for(var k = 0; k < gcs.length; k++) {
				var n = gcs[k].getElementsByTagName("name")[0].firstChild.nodeValue;	
				var gc = addGC(tbl, n);
				// get GA's
				var gas = gcs[k].getElementsByTagName("ga");
				for(var l = 0; l < gas.length; l++) {
					var n = gas[l].firstChild.nodeValue;	
					addGA(gc, n);
				}
				// get SA's
				var sas = gcs[k].getElementsByTagName("sa");
				for(var l = 0; l < sas.length; l++) {
					var n = sas[l].firstChild.nodeValue;	
					addSA(gc, n);
				}
				// get SC's
				var scs = gcs[k].getElementsByTagName("sc");
				for(var l = 0; l < scs.length; l++) {
					var n = scs[l].getElementsByTagName("name")[0].firstChild.nodeValue;	
					var d = scs[l].getElementsByTagName("def")[0].firstChild.nodeValue;	
					addSC(gc, n, d);
				}
			}
		}
	}

}


/////////////////////////////////////
// add code - used in loadTables

function addCategory(name)
{
	var retval = new c_data();
	if (CREAM_HEAD == null) {
		CREAM_HEAD = retval;
	} else {
		findEnd(CREAM_HEAD).next = retval;
	}
	retval.name = name;

	return retval;
}

function addGroup(category, name)
{
	var retval = new g_data();
	if (category.group == null) {
		category.group = retval;
	} else {
		findEnd(category.group).next = retval;
	}
	retval.name = name;
	retval.parent = category;

	return retval;
}


function addGC(group, name) // adds GC to the group
{
	var retval = new gc_data();
	if (group.gc == null) {
		group.gc = retval;
	} else {
		findEnd(group.gc).next = retval;
	}
	retval.name = name;
	retval.parent = group;

	return retval;
}

function addGA(gc, name) // adds GA to the GC, as in holnagel book
{
	var retval = new ga_data();
	if (gc.ga == null) {
		gc.ga = retval;
	} else {
		findEnd(gc.ga).next = retval;
	}
	retval.name = name;
	retval.parent = gc;

	return retval;
}

function addSA(gc, name) // adds SA to the GC
{
	var retval = new sa_data();
	if (gc.sa == null) {
		gc.sa = retval;
	} else {
		findEnd(gc.sa).next = retval;
	}
	retval.name = name;
	retval.parent = gc;

	return retval;
}

function addSC(gc, name, def)
{
	var retval = new sc_data();
	if (gc.sc == null) {
		gc.sc = retval;
	} else {
		findEnd(gc.sc).next = retval;
	}
	retval.name = name;
	retval.def = def;
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
function c_data() {		// category structure
	this.type = "category";
	this.name = null;	// str
	this.group = null;	// g_data
	this.next = null;	// c_data
}
function g_data() {		// group structure
	this.type = "group";
	this.name = null;	// str
	this.gc = null;		// gc_data
	this.parent = null;	// c_data
	this.next = null;	// g_data
}
function gc_data() {		// general consequent structure
	this.type = "gc";
	this.name = null;	// str
	this.ga = null;		// ga_data
	this.sa = null;		// sa_data
	this.sc = null;		// sc_data
	this.parent = null;	// g_data
	this.next = null;	// gc_data
}
function ga_data() {		// general antecedent structure
	this.type = "ga";
	this.name = null;	// str
	this.parent = null;	// gc_data
	this.next = null;	// ga_data
}

function sa_data() {		// specific antecedent structure
	this.type = "sa";
	this.name = null;	// str
	this.parent = null;	// gc_data
	this.next = null;	// ga_data
}

function sc_data() {		// special consequent structure
	this.type = "sc";
	this.name = null;	// str
	this.def = null;		// str
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

