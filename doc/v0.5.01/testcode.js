function dstru(parent, data) {
	this.parent = null;
	this.child = null;
	this.next = null;
	this.data = data;

	addChild(parent, this);
}

var nodeHead;
function makeNode() {
	
	var a = new dstru(null, "1");
	var b = new dstru(a, "2");
	var c = new dstru(b, "3");
	var d = new dstru(a, "4");
	nodeHead = a;

}

function addChild(parent, child) {
	if (parent != null) { 
		if (parent.child == null) {
			parent.child = child;
		} else {
			tmp = parent.child;
			while (tmp.next != null) {
				tmp = tmp.next;
			}
			tmp.next = child;
		}
	}
}	



