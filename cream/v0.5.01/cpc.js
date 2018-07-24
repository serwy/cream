// 
//  cpc.js
//
//  Common Performance Conditions Engine
//
//  Author: Roger D. Serwy
//  Date:   April 2007
//


// setCPC
//	- fixme
function setCPC(cpcIndex, level)
{
	CPC_LEVEL[cpcIndex] = level;
}


function printCPC()
{
	// iterate through CPC's
	var tmp = CPC_HEAD;
	
	while(tmp != null) {
		print(" * " + tmp.name);
		//print("     " + tmp.desc);
		var l = tmp.level;
		var s = "";
		while(l != null) {
			s += l.name + " / ";
			l = l.next;
		}		
		tmp = tmp.next;
		print("     " + s);
	} 
}

// cpcMTO
//	returns strengths for MTO, given CPC's

function cpcMTO(CPC_def)
{
	if (CPC_def == null) {
		CPC_def = CPC_LEVEL;
	}

	var MTO = new Array(0, 0, 0);

	for (var i = 0; i < CPC_def.length; i++) {
		var p = CPC_def[i].perf;
		if (p.toUpperCase() == "REDUCED") {
			// add tick marks to the MTO totals
			MTO[0] += parseInt(CPC_def[i].parent.man);		
			MTO[1] += parseInt(CPC_def[i].parent.tech);
			MTO[2] += parseInt(CPC_def[i].parent.org);
		}
	
	}

	return MTO;
}


// cpcTriplet
//	computes the CPC triplet for reduced, not sig, and improved values
function cpcTriplet(CPC_def)
{
	if (CPC_def == null) {
		CPC_def = CPC_LEVEL;
	}

	// compute CPC triplet from CPC_LEVEL's
	// compute triplet sum
	var triplet = new Array(3);
	for (var i = 0; i < triplet.length; i++) {
		triplet[i] = 0;
	}
	for (var i = 0; i < CPC_def.length; i++) {
		switch (CPC_LEVEL[i].perf.toUpperCase()) {
			case "IMPROVED":
				triplet[2]++;
				break;
			case "NOT SIGNIFICANT":
				triplet[1]++;
				break;
			case "REDUCED":
				triplet[0]++;
				break;
			default:
				break;
		}

	}

	return triplet;
}

// cpcControlMode
//	returns control mode of given triplet
function cpcControlMode(triplet)
{
	// map using hollnagel's chapter 9

	// 1 - strategic
	// 2 - tactical
	// 3 - oportunistic
	// 4 - scrambled

	var d = new Array(7);
	d[7] = new Array(1, 1, 1, 0, 0, 0, 0, 0, 0, 0);
	d[6] = new Array(1, 1, 1, 2, 0, 0, 0, 0, 0, 0);
	d[5] = new Array(1, 1, 2, 2, 2, 0, 0, 0, 0, 0);
	d[4] = new Array(1, 2, 2, 2, 2, 2, 0, 0, 0, 0);
	d[3] = new Array(2, 2, 2, 2, 2, 3, 3, 0, 0, 0);
	d[2] = new Array(2, 2, 2, 2, 3, 3, 3, 3, 0, 0);
	d[1] = new Array(2, 2, 2, 3, 3, 3, 3, 3, 3, 0);
	d[0] = new Array(2, 2, 2, 3, 3, 3, 4, 4, 4, 4);
	
	var cmval = d[triplet[2]][triplet[0]];
	var cm;
	switch (cmval) {
		case 1: 
			cm = "Strategic";
			break;
		case 2:
			cm = "Tactical";
			break;
		case 3:
			cm = "Opportunistic";
			break;
		case 4: 
			cm = "Scrambled";
			break;
		default:
			cm = "UNDEFINED";
			break;
	}

	return cm;


}

// cpcLevelIndex - returns the index of level
function cpcLevelIndex(level)
{
	var p = level.parent;
	p = p.level;
	var c = 0;
	while (p != level) {
		p = p.next;
		c++;
	}

	return c;
}

var CPC_HEAD = null;
var CPC_LEVEL = null;

function loadCPC(filename)
{
	if (filename == null) {
		filename = "cpc1.xml";
	}

	var myXMLHttp = new XMLHttpRequest();
	myXMLHttp = new XMLHttpRequest();
	myXMLHttp.open("GET", filename, false); 
	myXMLHttp.send(null);
	r = myXMLHttp.responseXML;
	var cream = r.getElementsByTagName("cream")[0];

	// pull in CPC data structure

	var cpc = cream.getElementsByTagName("cpc");

	for (var i = 0; i < cpc.length; i++) {
		var name = cpc[i].getElementsByTagName("name")[0].firstChild.nodeValue;
		var desc = cpc[i].getElementsByTagName("description")[0].firstChild.nodeValue;
		
		var man = cpc[i].getElementsByTagName("man")[0].firstChild.nodeValue;
		var tech = cpc[i].getElementsByTagName("tech")[0].firstChild.nodeValue;
		var org = cpc[i].getElementsByTagName("org")[0].firstChild.nodeValue;


		var myCPC = addCPC(name, desc, man, tech, org);

		// add levels to CPC
		var level = cpc[i].getElementsByTagName("level");
		for (var j = 0; j < level.length; j++) {
			var n = level[j].getElementsByTagName("name")[0].firstChild.nodeValue;
			var p = level[j].getElementsByTagName("perf")[0].firstChild.nodeValue;

			addLevel(myCPC, n, p);
		}

	}


	// Initialize the CPC level 

	CPC_LEVEL = new Array(lengthOf(CPC_HEAD));  // pointers into CPC data stru
	// initialize to the first for each category
	var tmp = CPC_HEAD;
	for (var i = 0; i < CPC_LEVEL.length; i++) {
		CPC_LEVEL[i] = tmp.level;
		tmp = tmp.next;
	}
}





// addCPC
// 	adds a CPC to the CPC data structure
function addCPC(name, desc, man, tech, org)
{
	var tmp = new cpc_data;
	tmp.name = name;
	tmp.desc = desc;
	tmp.man = man;
	tmp.tech = tech;
	tmp.org = org;
	
	if (CPC_HEAD == null) {
		CPC_HEAD = tmp;
	} else {
		findEnd(CPC_HEAD).next = tmp;
	}
	return tmp;

}

// addLevel
//	adds a level and performance rating to a particulare CPC
function addLevel(cpc, level, perf)
{
	var tmp = new cpc_level();
	tmp.name = level;
	tmp.perf = perf;
	tmp.parent = cpc;	
	if (cpc.level == null) {
		cpc.level = tmp;
	} else {
		findEnd(cpc.level).next = tmp;
	}
}


// CPC data structures

function cpc_data() {
	this.type = "cpc";
	this.name = "";
	this.desc = "";
	this.level = null; 	// pointer to cpc_level

	this.man = 0;
	this.tech = 0;
	this.org = 0;

	this.next = null;


}

function cpc_level() {
	this.type = "cpc_level";
	this.parent = null;
	this.name = "";
	this.perf = "";
	this.next = null;
}



