(function(){
	'use strict';
	var box = [];
	// Get the array of slots
	var slots = document.getElementsByClassName("box");

	// Slot object
	function Slot(picked){
	  // If color is picked for that slot
	  this.picked = picked;
	  // Should record the color that is picked
	  this.colorHex = "THIS SHOULD NOT COME OUT";
	  // Function to toggle the picked value
	  this.changePicked = function(){
	  	this.picked = !this.picked;
	  };
	}

	// on load DOM
	document.addEventListener('DOMContentLoaded', function () {
	  	// chrome.storage.sync.clear();
	  	chrome.storage.sync.get('slot', function(result){
	  		if(!result.slot){
	  			chrome.storage.sync.set({'slot': ['white', 'white', 'white', 'white', 'white']});
	  		}
	  		else{
				var arr = result.slot;
	  			// Initalize the slots
				for(i = 0; i < slots.length; i++){
			    	var color = arr[i];
			    	if(color != "white"){
						box[i] = new Slot(true);
						update(i, slots[i], color);
					}
					else{
						box[i] = new Slot(false);
						update(i, slots[i], color);
					}
			  	}
	  		}
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
			update(index, this, "rgb(22, 149, 138)");
		});
	}

	// Function to update the color of the slot
	// takes in the index of the slot and the HTML of the selected slot
	function update(index, curSlot, color){
		console.log(box[index] + " " + index);
		// curSlot.children[0] is the plus sign
		if(box[index].picked){
		  curSlot.children[0].style.visibility = "hidden";
		  curSlot.style.backgroundColor = color;
		  curSlot.style.boxShadow = "0 0 0 black";
		  chrome.storage.sync.get('slot', function(result){
		  	// console.log(result.slot[index]);
		  	var temp = result.slot;
		  	temp[index] = color;
			chrome.storage.sync.set({'slot' : temp});
		  });
		}
		else{
		  console.log("I AM " + index + " AND I AM IN");
		  curSlot.children[0].style.visibility = "visible";
		  curSlot.style.backgroundColor = "white";
		  curSlot.style.boxShadow = "inset 0px 0px 0px 4px rgb(209, 209, 209)";
		  chrome.storage.sync.get('slot', function(result){
		  	// console.log(result.slot[index]);
		  	var temp = result.slot;
		  	temp[index] = "white";
			chrome.storage.sync.set({'slot' : temp});
		  });
		}
	}

	// Function to reset the color palette
	function clearSlots(){
	  // Loop through the array of slots and set the pick to false and update
	  for(var n in box){
	    box[n].picked = false;
	    update(n, document.getElementById("slot" + n), "white");
	  }

	}
}());
