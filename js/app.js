(function(){
	'use strict';
	var box = [];
	// Get the array of slots
	var slots = document.getElementsByClassName("box");
	var initSlot = ['white', 'white', 'white', 'white', 'white'];

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
	  		console.log(result);
	  		if(!result.slot){
	  			chrome.storage.sync.set({'slot' : initSlot});
	  		}
	  		else{
				var arr = result.slot;
	  			// Initalize the slots
				for(i = 0; i < slots.length; i++){
			    	var color = arr[i];
			    	if(color != "white"){
						box[i] = new Slot(true);
					}
					else{
						box[i] = new Slot(false);
					}
					update(i, slots[i], color);
			  	}
	  		}
	  	});
	});

	document.getElementById("clearButton").addEventListener('click', function(){
		for(var n = 0; n < 5; n++){
				box[n].picked = false;
				update(n, slots[n], 'white');
		}
		//update local storage
		chrome.storage.sync.get('slot', function(result){
		  chrome.storage.sync.set({'slot' : initSlot}, function(){});
	  });
		//
	});

	// Attach click listener to each slot
	for(var i = 0; i < slots.length; i++){
		slots[i].addEventListener('click', function(){
			var cur = this.id;
			var index = cur[cur.length-1];
			// Toggle the status of the slot
			box[index].changePicked();
			// Update the color
			if(box[index].picked){
				var color = "rgb(22, 149, 138)";
			}
			else{
				var color = "white";
			}
			update(index, this, color);
		});
	}

	// Function to update the color of the slot
	// takes in the index of the slot and the HTML of the selected slot
	function update(index, curSlot, color){
		// curSlot.children[0] is the plus sign
		if(box[index].picked){
			//hide "+"
		  curSlot.children[0].style.visibility = "hidden";
		  // remove inset border
			curSlot.style.boxShadow = "0 0 0 black";
		}
		else{
		  //show "+"
		  curSlot.children[0].style.visibility = "visible";
			//remove inset border
		  curSlot.style.boxShadow = "inset 0px 0px 0px 4px rgb(209, 209, 209)";
		}
	  curSlot.style.backgroundColor = color;


		//local storage update
	  chrome.storage.sync.get('slot', function(result){
		  var temper = result.slot;
		  temper[index] = color;
		  chrome.storage.sync.set({'slot' : temper}, function(){
			});
	  });
	}
}());
