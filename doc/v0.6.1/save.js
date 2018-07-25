function saveTables()
{
	// create an XML file of the CREAM table information

	// create XML
	var s = "\n\n";
	s += "<cream>\n";
	s += tabIndent(1) + "<information>\n";
  	s += tabIndent(2) + "<name>" + CREAM_INFORMATION.name + "</name>\n";
	s += tabIndent(2) + "<desc>" + CREAM_INFORMATION.desc + "</desc>\n";
	s += tabIndent(1) + "</information>\n\n";

	var cat = CREAM_HEAD;
	while (cat != null) {
		s += tabIndent(1) + "<category>\n";
		s += tabIndent(2) + "<name>" + cat.name + "</name>\n";
		s += tabIndent(2) + "<desc>" + cat.desc + "</name>\n";

		var grp = cat.group;
		while (grp != null) {
			s += "\n";
			s += tabIndent(2) + "<group>\n";
			s += tabIndent(3) + "<name>" + grp.name + "</name>\n";
			s += tabIndent(3) + "<desc>" + grp.desc + "</name>\n";
			var gc = grp.gc;
			while (gc != null) {
				s += "\n";
				s += tabIndent(3) + "<gc>\n";
				s += tabIndent(4) + "<name>" + gc.name + "</name>\n";
				s += tabIndent(4) + "<desc>" + gc.desc + "</name>\n";


				var ga = gc.ga;
				while (ga != null) {
					s += "\n";
					s += tabIndent(4) + "<ga>\n";
					s += tabIndent(5) + "<name>" + ga.name + "</name>\n";
					s += tabIndent(5) + "<desc>" + ga.desc + "</desc>\n";
					s += tabIndent(4) + "</ga>\n";
					ga = ga.next;
				}

				var sa = gc.sa;
				while (sa != null) {
					s += "\n";
					s += tabIndent(4) + "<sa>\n";
					s += tabIndent(5) + "<name>" + sa.name + "</name>\n";
					s += tabIndent(5) + "<desc>" + sa.desc + "</desc>\n";
					s += tabIndent(4) + "</sa>\n";
					sa = sa.next;
				}

				var sc = gc.sc;
				while (sc != null) {
					s += "\n";
					s += tabIndent(4) + "<sc>\n";
					s += tabIndent(5) + "<name>" + sc.name + "</name>\n";
					s += tabIndent(5) + "<desc>" + sc.desc + "</desc>\n";
					s += tabIndent(4) + "</sc>\n";
					sc = sc.next;
				}


				s += tabIndent(3) + "</gc>\n";
				gc = gc.next;

			}
			s += tabIndent(2) + "</group>\n\n";		
			grp = grp.next;
		}

		s += tabIndent(1) + "</category>\n\n";		

		cat = cat.next;
	}
	

	return s;

}

function tabIndent(level) 
{
	var s = "";
	for (var i = 0; i < level; i++) {
		s += "\t";
	}

	return s;

}
