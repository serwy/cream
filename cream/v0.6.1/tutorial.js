//
// develop Navigator screen
//


var tutorialTOC;
var tutorialText;

function tutorial_onResize()
{
	var h = window.innerHeight;
	var t = document.getElementById('toolbarBody').clientHeight;
	var c = document.getElementById('tutorialTOC');
	var d = document.getElementById('tutorialText');
	c.style.height = h - t;
	d.style.height = h - t;

	tutorialTOC = c;
	tutorialText = d;
}


function displayTutorial()
{
	var s = "";
	s += "<table width=100% cellpadding=0 cellspacing=0>";
	s += "<tr><td width=300px><div id='tutorialTOC'></div></td>";
	s += "<td><div id='tutorialText'></div></td>";
	s += "</tr></table>";
	var d = element("div");
	d.innerHTML = s;

	var appBody = document.getElementById('appBody');
	
	appBody.innerHTML = "";
	appBody.appendChild(d);

	tutorial_onResize();

	refreshTutorial();
}

function refreshTutorial()
{
	var s = "";
	s += "<div class='panel'>";
	s += "<div class='info'>";
	s += "<div class='title'>";
	s += "CREAM Tutorial:";
	s += "</div></div>"

	s += "<br>";
	s += "<div class='grouping'>";

	s += "<a href='javascript:setTutorial(\"overview.dat\");'>";
	s += "Overview";
	s += "</a><br>";


	s += "<a href='javascript:setTutorial(\"navigator.dat\");'>";
	s += "The Navigator";
	s += "</a><br>";

	s += "<a href='javascript:setTutorial(\"workspace.dat\");'>";
	s += "The Workspace";
	s += "</a><br>";

	s += "<a href='javascript:setTutorial(\"howto.dat\");'>";
	s += "How to do CREAM";
	s += "</a><br>";

	s += "<br>";
	s += "<a href='javascript:setTutorial(\"about.dat\");'>";
	s += "About";
	s += "</a><br>";

	s += "<a href='javascript:setTutorial(\"download.dat\");'>";
	s += "Download";
	s += "</a><br>";




	s += "</div>";

	s += "</div>";
	

	tutorialTOC.innerHTML = s;

	setTutorial("about.dat");
}

function setTutorial(txt)
{
	var myXMLHttp = new XMLHttpRequest();
	myXMLHttp = new XMLHttpRequest();
	myXMLHttp.open("GET", txt, false); 
	myXMLHttp.send(null);

	var r = myXMLHttp.responseText;

	var s = "";

	s += "<div class='tutorial'>";
	s += r;
	s += "</div>";
	tutorialText.innerHTML = s;
}
