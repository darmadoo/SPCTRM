(function(){
	'use strict';
	var box = [];
	// Get the array of slots 
	var slots = document.getElementsByClassName("box");

	// Slot object
	function Slot(){
	  // If color is picked for that slot
	  this.picked = false;
	  // Should record the color that is picked
	  this.colorHex = "THIS SHOULD NOT COME OUT";
	  // Function to toggle the picked value
	  this.changePicked = function(){
	  	this.picked = !this.picked;
	  };
	}

	// on load DOM
	document.addEventListener('DOMContentLoaded', function () {
		// Initalize the slots 
		for(i = 0; i < slots.length; i++){
	    	box[i] = new Slot();
	  	}

	  	chrome.storage.sync.get('slot', function(result){
	  		console.log(result);
	  	});
	});

	document.getElementById("clearButton").addEventListener('click', function(){
		clearSlots();
	});

	// Attach click listener to each slot
	for(var i = 0; i < slots.length; i++){
		slots[i].addEventListener('click', function(){
			var cur = this.id;
			var index = cur[cur.length-1];
			// Toggle the status of the slot
			box[index].changePicked();
			// Update the color
			update(index, this);
		});
	}

	// Function to update the color of the slot
	// takes in the index of the slot and the HTML of the selected slot
	function update(index, curSlot){
		// curSlot.children[0] is the plus sign
		if(box[index].picked){
		  curSlot.children[0].style.visibility = "hidden";
		  curSlot.style.backgroundColor = "rgb(22, 149, 138)";
		  curSlot.style.boxShadow = "0 0 0 black";
		  chrome.storage.sync.get('slot', function(result){

		  	if(result.length != 0){
		  		console.log("JSD");
		  	}
		  });
		  chrome.storage.sync.set({'slot' : [index, "rgb(22, 149, 138)"]});
		}
		else{
		  curSlot.children[0].style.visibility = "visible";
		  curSlot.style.backgroundColor = "white";
		  curSlot.style.boxShadow = "inset 0px 0px 10px rgba(0, 0, 0, 0.2)";
		  chrome.storage.sync.set({'slot' : [index, "white"]});		}
	}

	// Function to reset the color palette
	function clearSlots(){
	  // Loop through the array of slots and set the pick to false and update
	  for(var n in box){
	    box[n].picked = false;
	    update(n, document.getElementById("slot" + n));
	  }
	  
	}

	

}());