function buildGCode() {
	var num_droplets = +document.getElementById("droplets_number").value;
	var droplet_e = document.getElementById("droplet_extrusion").value;
	var droplet_r = document.getElementById("droplet_rate").value;
  var height = +document.getElementById("start_height").value;
	var end_height = +document.getElementById("end_height").value;
  
  var height_increment = (end_height - height)/num_droplets;
  console.log(height_increment);
	document.getElementById("time").innerHTML = num_droplets / 60;
	document.getElementById("extrusion").innerHTML = num_droplets * droplet_e;
	
	var fullGCode ="G28 \n";
	
	for(var i = 0; i < num_droplets; i++) {
		
		// Reset extruder value
		fullGCode += "G92 E0 \n";
    height += height_increment;
    fullGCode += "G1 Z"+ Math.round(height*1000)/1000 + " F3000 \n";
		// Add delay
		fullGCode += "G4 S" + droplet_r + " \n";
		// Add droplet extrusion
		fullGCode += "G1 E" + droplet_e + " F120 \n";
		
	}
	return fullGCode;
}

function createFile(){
	var output = getParameters();
	output += buildGCode();
	var GCodeFile = new Blob([output], {type: 'text/plain'});
	saveAs(GCodeFile, "Stalactite" + '.gcode');
}

function getParameters(){
var params = [];
	params += "; GCode generated with Stalactite from www.3digitalcooks.com \n";
	params += "; #pyramid_initial_height: " + document.getElementById("pyramid_initial_height").value + "\n";
	params += "; travel_feedrate: " + document.getElementById("travel_feedrate").value + "\n";
	params += "; travel_z_lift: " + document.getElementById("travel_z_lift").value + "\n"; 
	params += "; dots_per_side: " + document.getElementById("dots_per_side").value + "\n"; 
	params += "; distance_between_dots: " + document.getElementById("distance_between_dots").value + "\n";
  params += "; dot_layer_height: " + document.getElementById("dot_layer_height").value + "\n";
	params += "; dot_printing_initial_height: " + document.getElementById("dot_printing_initial_height").value + "\n";
	params += "; dot_printing_final_height: " + document.getElementById("dot_printing_final_height").value + "\n";  
	params += "; dot_feedrate: " + document.getElementById("dot_feedrate").value + "\n";

return params;
}
