OUTPUT_WINDOW = window.open("", "CREAM","width=1000,height=300,scrollbars=yes, status=yes,resizable=yes");
function cDiv(txt)
{
	var d = document.createElement("div");
	d.innerHTML = txt;
	d.setAttribute("style", "padding-left: 20px;");

	return d;
}

function printCream()
{
	OUTPUT_WINDOW.document.body.innerHTML = "";
	// recurse cream tables, show all

	var c = CREAM_HEAD

	var dcream = cDiv("CREAM:");

	while (c != null) {
				
		var dcat = cDiv("CAT: " + c.name);
		dcream.appendChild(dcat);

		var g = c.group;
		while (g != null) {
			var dgrp = cDiv("GRP: " + g.name);
			dcat.appendChild(dgrp);
			var gc = g.gc;
			while (gc != null) {
				var dgc = cDiv("GC: " + gc.name);
				dgrp.appendChild(dgc);
				var ga = gc.ga;
				while (ga != null) {
					var dga = cDiv("GA: " + ga.name);
					dgc.appendChild(dga);
					ga = ga.next;
				}
				var sa = gc.sa;
				while (sa != null) {
					var dsa = cDiv("SA: " + sa.name);
					dgc.appendChild(dsa);
					sa = sa.next;
				}
				var sc = gc.sc;
				while (sc != null) {
					var dsc = cDiv("SC: " + sc.name);
					dgc.appendChild(dsc);
					sc = sc.next;
				}
				
				gc = gc.next;
			}
			

			g = g.next;
		}		
	

		c = c.next;
	}
	OUTPUT_WINDOW.document.body.appendChild(dcream);

}



