// runProspectiveCheck()
// - verifies consistency for Prospective Analysis

function runProspectiveCheck()
{
var errors = new Array();
var errorCount = 0;

var cat = CREAM_HEAD;
while(cat != null) {
	//print("Category: " + cat.name, "#000000");
	var group = cat.group;
	while (group != null) {
		//print("  Group: " + group.name, "#000000");
		var gc = group.gc;
		while (gc != null) {
			var f = findGA(gc.name);
			if (f.length == 0 && gc.name != "Phenotypes") {
				errors[errorCount] = gc;
				errorCount++;
			//	print("    GC: " + gc.name + ", not found", "#FFFFFF", "#000000");
			} else { 
			//	print("    GC: " + gc.name + ", " + f.length);
			}
			gc = gc.next;
		}
		group = group.next;
	}
	cat = cat.next;
}

// relay errors
print(" ");
print("There are " + errorCount + " inconsistencies found.");
print(" ");
if (errorCount > 0) {
	print("There are inconsistencies with these General Consequents, as");
	print("they are not found as a General Antecedent. This breaks the");
	print("prospective analysis algorithm.");
	print("------------------------------------------------------------");

	for(var i = 0; i < errorCount; i++) {
		var cat = errors[i].parent.parent.name;
		var grp = errors[i].parent.name;
		var gc = errors[i].name;
		print((i + 1) + ") " + cat + " >> " + grp + " >> " + gc);
	}
}

}


function runRetrospectiveCheck()
{

var errors = new Array();
var errorCount = 0;

var cat = CREAM_HEAD;
while(cat != null) {
	//print("Category: " + cat.name, "#000000");
	var group = cat.group;
	while (group != null) {
		//print("  Group: " + group.name, "#000000");
		var gc = group.gc;
		while (gc != null) {
			//print("    GC: " + gc.name, "#000000");
			var ga = gc.ga;
			while(ga != null) {
		
				var f = findGC(ga.name);
				if (f == null && ga.name != "None defined") {
					//print("      GA: " + ga.name, "#FFFFFF", "#000000");
					errors[errorCount] = ga;
					errorCount++;

				} else {
					//print("      GA: " + ga.name, "#000000");

				}

				ga = ga.next;
			}

			gc = gc.next;
		}
		group = group.next;
	}
	cat = cat.next;
}

// relay errors
print(" ");
print("The are " + errorCount + " inconsistencies found.");
print(" ");

if (errorCount > 0) {
	print("There are inconsistencies with these General Antedents, as");
	print("they are not found as a General Consequent. This breaks the");
	print("retrospective analysis algorithm.");
	print("------------------------------------------------------------");

	for(var i = 0; i < errorCount; i++) {
		var cat = errors[i].parent.parent.parent.name;
		var grp = errors[i].parent.parent.name;
		var gc = errors[i].parent.name;
		var ga = errors[i].name;
		print((i+1) + ") " + cat + " >> " + grp + " >> " + gc + " >> " + ga);
	}
}



}

// CREAM function namespace
cream = {};
cream.runProspectiveCheck = runProspectiveCheck;
cream.runRetrospectiveCheck = runRetrospectiveCheck;

