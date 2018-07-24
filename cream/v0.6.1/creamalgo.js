function generateCREAM(index)
{
	if (index == 0) {
		return generateStartPanel(index);
	} else {
		return generateAnalysisPanel(index);
	}
}

function generateStartPanel(index)
{

	// go through the categories and groups

	var s = "";
	s += "<div class='panel'>"


	s += "<div class='info'>"
	
	s += "<div class='title'>"
	s += "Start of CREAM";
	s += "</div>";
	s += "<div class='desc'>";

	if (CREAM_INFORMATION.direction == CREAM_RETROSPECTIVE) {
		s += "Since you are performing a retrospective analysis,";
		s += " start by choosing from the error modes category, since that is ";
		s += " the physical manifestation of the error.";
	} 

	if (CREAM_INFORMATION.direction == CREAM_PROSPECTIVE) {
		s += "Since you are performing a prospective analysis,";
		s += " you are introducing an antecedent and projecting ";
		s += " its effects. Start by choosing from ";
		s += " the MTO categories.";
	} 


	s += "</div>"

	s += "</div>"



	var cat = CREAM_HEAD;
	while (cat != null) {
		var grp = cat.group;
		while (grp != null) {
			s += "<div class='divider'>"
			s += cat.name + ": " + grp.name;
			s += "</div>";
			s += "<div class='grouping'>";

	
			var gc = grp.gc;
			while (gc != null) {
				s += "<div class='name'>";
				s += "<div style='float:right;'>";
				s += starCPC(cat.name);
				s += "</div>";


				s += "<a href='javascript:addNode(0, \"";
				s += gc.name + "\", \"";
				if (CREAM_INFORMATION.direction == CREAM_RETROSPECTIVE) {
					s += "DLGA";
				} else {
					s += "DLGC";
				}
				s += "\");'>";
				s += gc.name + "</a>"
				s += "</div>";
	

				s += "<div class='desc'>" + gc.desc + "</div>";	

	
				s += "<div class='miniloc'>"
				s += "</div>";
				gc = gc.next;
			}
			s += "</div>";
			grp = grp.next;	
		}
		cat = cat.next;
	}

	return s;



}

function generateSA(node)
{

	var s = "";
	s += "<div class='panel'>"
	s += "<div class='info'>"
	s += "<div class='title'>"
	s += nodeLevel(node) + " ";
	s += node.prefix + ": " + node.title + "</div>";
	s += "</div>"

	s += "<br>"
	s += "<div class='grouping'>";
	s += "Analysis for this node is complete because it is a Specific Antecedent.";
	s += "</div>";

	return s;

}


function generateAnalysisPanel(index)
{
	var n = findNodeIndex(index);
	var title = n.title;


	var gc = findGC(title);	
	if (gc == null) {
		var s= "";
		// unable to find GC... 
		if (n.prefix == "DLSA" || n.prefix == "ILSA") {
			s += generateSA(n);
		}
		return s;	

	}


	// TODO: make the title a link to "makeVisible"


	var genGroup = function(ptr, prefix) {
		var t = "";

		for (var i=0; i < ptr.length; i++) {

			var lgc = findGC(ptr[i].name);

		
			t += "<div class='name'>";
			
			t += "<div style='float:right;'>";
			t += starCPC(lgc.parent.parent.name);
			t += "</div>";

			t += "<a href='javascript:addNode(";
			t += index + ", \"" + ptr[i].name + "\"";
			t += ", \"" + prefix + "\");'>";
			t += ptr[i].name + "</a>"

			
			t += "</div>";
	

			t += "<div class='desc'>" + ptr[i].desc + "</div>";	

	
			t += "<div class='miniloc'>in \"" + lgc.parent.parent.name + "\"";
			t += " under \"" + lgc.parent.name + "\"";
			t += "</div>";

		}	
		return t;
	}

	var genGroupSA = function(ptr, prefix) {
		var t = "";

		for (var i=0; i < ptr.length; i++) {

			//var lgc = findGC(ptr[i].name);

		
			t += "<div class='name'>";
			t += "<a href='javascript:addNode(";
			t += index + ", \"" + ptr[i].name + "\"";
			t += ", \"" + prefix + "\");'>";
			t += ptr[i].name + "</a>"
			t += "</div>";
	

			t += "<div class='desc'>" + ptr[i].desc + "</div>";	
			t += "<div class='miniloc'></div>";

		}	
		return t;
	}






	var s = "";
	s += "<div class='panel'>"


	s += "<div class='info'>"



	s += "<div class='title'>"
	s += nodeLevel(n) + " ";
	s += n.prefix + ": " + title + "</div>";
	s += "<div class='location'>in \"" + gc.parent.parent.name + "\" under \"" + gc.parent.name + "\"</div>";

	s += "</div>"



	s += "<div class='divider'>Specific Consequents (SC)</div>";
	s += "<div class='grouping'>";
	var sc = gc.sc;
	while (sc != null) {
		s += "<div class='name'>"
		s += "<a href='javascript:setSC(";
		s += index + ", \"" + sc.name + "\");'>";
		s += sc.name + "</a>"
		s += "</div>";
		s += "<div class='desc'>" + sc.desc + "</div>";	
		s += "<div class='miniloc'></div>";
		sc = sc.next;
	}

	s += "</div>"; // end grouping



	if (CREAM_INFORMATION.direction == CREAM_RETROSPECTIVE) {
	
		var cream = getRetrospective(title);
		var creamSA = getRetrospectiveSA(title);

		s += "<div class='divider'>Direct Links: Specific Antecedents (DLSA)</div>";
		s += "<div class='grouping'>";
		s += genGroupSA(creamSA.DL, "DLSA");
		s += "</div>"; // end grouping

		s += "<div class='divider'>Direct Links: General Antecedents (DLGA)</div>";
		s += "<div class='grouping'>";
		s += genGroup(cream.DL, "DLGA");
		s += "</div>"; // end grouping
	
		s += "<div class='divider'>Indirect Links: Specific Antecedents (ILSA)</div>";
		s += "<div class='grouping'>";
		s += genGroupSA(creamSA.IL, "ILSA");
		s += "</div>"; // end grouping

		s += "<div class='divider'>Indirect Links: General Antecedents (ILGA)</div>";
		s += "<div class='grouping'>";
		s += genGroup(cream.IL, "ILGA");
		s += "</div>"; // end grouping
	} else {
		var cream = getProspective(title);
		s += "<div class='divider'>Direct Links: General Consequents (DLGC)</div>";
		s += "<div class='grouping'>";
		s += genGroup(cream.DL, "DLGC");
		s += "</div>"; // end grouping
	
		s += "<div class='divider'>Indirect Links: General Consequents (ILGC)</div>";
		s += "<div class='grouping'>";
		s += genGroup(cream.IL, "ILGC");
		s += "</div>"; // end grouping



	}
		

	s += "</div>";	// end panel

	return s;





}
