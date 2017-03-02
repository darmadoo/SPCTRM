(function(){
	'use strict';
	var box = [];
	// Get the array of slots
	var slots = document.getElementsByClassName("box");
  	var covers = document.getElementsByClassName("cover");
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
					update(i, color);
			  	}
	  		}
	  	});
	});

	document.getElementById("clearButton").addEventListener('click', function(){
		for(var n = 0; n < 5; n++){
				box[n].picked = false;
				update(n, covers[n], 'white');
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
			getColor(this, index);
			// Toggle the status of the slot
			box[index].changePicked();	
		});
	}

	function getColor(cur, index){
		chrome.tabs.getSelected(null, function(ret){
			console.log(ret);
			initElements(ret, cur, index);
		});
	}

	function initElements(tab, curSlot, index){
		var canPick = true;

		if(tab.url.indexOf('chrome') == 0){
			canPick = true;
		}
		else if(tab.url.indexOf('https://chrome.google.com/webstore')){
			canPick = true;
		}
		else if(tab.url.indexOf('file') == 0){
			canPick = true;
		}

		if(canPick){
			chrome.tabs.captureVisibleTab(null, {
					format: 'png'
				},
				function(res){
					var myWindow = window.open("", "_self", "width=1000, height=750");
					var c;
					myWindow.document.write("<div class='container' style:'width:100vw; height:100vh;'>" +
								"<div id ='boxColor'"+
										"style='"+
										"width: 80;" +
										"height: 80;" +
										"position: fixed;" +
										"box-shadow: inset 0 0 0 4px rgba(0, 0, 0, 0.3), 0 0 5px rgba(0, 0, 0, 0.49);"+
										"right: 2vw;"+
										"bottom: 2vh;"+
							"'></div>"+

							"<canvas style="+
									"'border: solid 1px black;"+
									" margin-left:auto;"+
									" margin-right:auto;'"+
							" id='c'></canvas>" +
					"</div>"
					);

					var cnvs = myWindow.document.getElementById("c");

					if(cnvs.getContext) { // Check for canvas support
					// DRAW FUN STUFF!
		  			 	c = cnvs.getContext('2d');
		   				var color = myWindow.document.getElementById("boxColor");

					    var images = new Image();
					    var changedColor;

					    images.onload = function() {
					        cnvs.width = images.width; 
					        cnvs.height = images.height; // resize to fit image
					        c.drawImage(images, 0, 0 );
					    }
					    images.src = res;

					    var pixel = function(e) {
					        // find the element's position
					        var x = 0;
					        var y = 0;
					        var o = cnvs;
					        do {
					            x += o.offsetLeft;
					            y += o.offsetTop;
					        } while (o = o.offsetParent);

					        x = e.pageX - x; 
					        y = e.pageY - y; 
					        var imagesdata = c.getImageData( x, y, 1, 1 );
					        var new_color = [ imagesdata.data[0], imagesdata.data[1], imagesdata.data[2] ];
					        color.style.backgroundColor = "rgb("+new_color+")";
					        changedColor = new_color;
					    }
						
					    cnvs.onmouseover = function(e) {
					    	e.preventDefault();
					        cnvs.onmousemove = pixel; // fire pixel() while user is dragging
					    }

					    cnvs.onclick = function(e){
					    	e.preventDefault();			
					    
					    	chrome.storage.sync.get('slot', function(result){
							  var temper = result.slot;
							  temper[index] = "rgb("+changedColor+")"
							  chrome.storage.sync.set({'slot' : temper});
						    });	

					    	window.open("popup.html", "_self");
					    }
					}
				});
		}
		else{
			// CANNOT FIND
		}
	}
	// Attach click listener to each cover
	for(var i = 0; i < covers.length; i++){
		covers[i].addEventListener('click', function(){
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
			update(index, color);
		});
	}

	// Function to update the color of the slot
	// takes in the index of the slot and the HTML of the selected slot
	function update(index, color){
		var curSlot = covers[index];
		// curSlot.children[0] is the plus sign
		if(box[index].picked){
		  // shift down

			// curSlot.style.transform = "translateY(-100%)";
      // curSlot.style.opacity = "1";
			posChange(true,curSlot); /////////!!! STILL IN PROGRESS !!!
			opacityChange(true,curSlot); /////////!!! STILL IN PROGRESS !!!
		}
		else{
			//shift up

			// curSlot.style.opacity = "0";
		  // curSlot.style.transform = "translateY(-300%)";
			opacityChange(false,curSlot); /////////!!! STILL IN PROGRESS !!!
			posChange(false,curSlot); /////////!!! STILL IN PROGRESS !!!

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

	function opacityChange(on, curSlot){ /////////!!! STILL IN PROGRESS !!!
		var val = "0";
		if(on){val = "1";}
		curSlot.style.opacity = val;
	}
	function posChange(on, curSlot){ /////////!!! STILL IN PROGRESS !!!
		var val = "translateY(-300%)";
		if(on){val = "translateY(-100%)";}
		curSlot.style.transform = val;
	}

}());
