var box = [];
var elBox = [];
var elText = [];

function Slot(xLoc, yLoc){
  this.picked = false;
  this.colorHex = "THIS SHOULD NOT COME OUT";
  this.changePicked = function(){
  	this.picked = !this.picked;
  };
}

// on load
document.addEventListener('DOMContentLoaded', function () {
	for(i = 0; i < 5; i++){
    	box[i] = new Slot();
    	elBox[i] = document.getElementById("slot" + i);
    	elText[i] = document.getElementById("text" + i);
  	}
});

// Get the array of slots 
var slots = document.getElementsByClassName("box");
// Attach click listener
for(var i = 0; i < slots.length; i++){
	slots[i].addEventListener('click', function(){
		var cur = this.id;
		var curEl = box[cur[cur.length-1]];
		curEl.changePicked();
		update(cur[cur.length-1]);
	});
}


function update(n){
	if(box[n].picked == true){
	  elText[n].style.visibility = "hidden";
	  elBox[n].style.backgroundColor = "rgb(22, 149, 138)";
	  elBox[n].style.boxShadow = "0 0 0 black";
	}
	else if(box[n].picked == false) {
	  elText[n].style.visibility = "visible";
	  elBox[n].style.backgroundColor = "white";
	  elBox[n].style.boxShadow = "inset 0px 0px 10px rgba(0, 0, 0, 0.2)";
	}
}

function clearSlots(){
  for(var n = 0; n < 5; n++){
    box[n].picked = false;
    update(n);
  }
  
}

document.getElementById("clearButton").addEventListener('click', function(){
	clearSlots();
});