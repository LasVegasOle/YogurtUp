// This creates an array of positions for all the dots in the pyramid
// each point represents the center base of the dot
function pyramid_dots_array_builder(){
  var dots_per_side = document.getElementById("dots_per_side").value;
  var dots = [];
  var x = 0;
  var y = 0;
  var z = +document.getElementById("pyramid_initial_height").value;
  var pyramid_layer_height = +document.getElementById("pyramid_layer_height").value;
  var pyramid_initial_height = +document.getElementById("pyramid_initial_height").value;
  var distance_btw_dots = +document.getElementById("distance_between_dots").value;
  // Layers
  for(var k=0; 0<dots_per_side--; k++){
    z = k*pyramid_layer_height + pyramid_initial_height;
    // Columns
    for(var j=0; j<=dots_per_side; j++){
      y = j*distance_btw_dots + k*distance_btw_dots/2;
      // Rows
      for(var i=0; i<=dots_per_side; i++){
        x = i*distance_btw_dots + k*distance_btw_dots/2;
        dots.push([x,y,z]);
        console.log(x + "," + y + "," + z);
      }
    }
  }
  return dots;
}

function buildGCode() {
	//var num_droplets = +document.getElementById("droplets_number").value;
	var travel_feedrate = document.getElementById("travel_feedrate").value;
  var dot_printing_initial_height = +document.getElementById("dot_printing_initial_height").value;
  var dot_printing_final_height = +document.getElementById("dot_printing_final_height").value;
  var dot_extrusion = +document.getElementById("dot_extrusion").value;
  var dot_feedrate = document.getElementById("dot_feedrate").value;
  var dot_retraction = +document.getElementById("dot_retraction").value;
  var z_lift = +document.getElementById("travel_z_lift").value;
  
  var e = 0;
  console.log("HOLA");
  
  var dots = pyramid_dots_array_builder();
	// Initial homing position
	var fullGCode ="G28 \n";
  // Reset extruder value
	fullGCode += "G92 E0 \n";

	for(var i = 0; i < dots.length; i++) {

    // Move on top of a dot
      // Z = point z + point height
    var z = dots[i][2] + dot_printing_final_height;
    fullGCode += "G1 X" + dots[i][0] + " Y" + dots[i][1] + " Z" + z + " F" + travel_feedrate + " \n";

    // Go to the startinng print dot height
    z = dots[i][2] + dot_printing_initial_height;
    fullGCode += "G1 Z" + z + " \n";

    // Recover retraction or build up pressure
    e += dot_retraction;
    fullGCode += "G1 E" + e + " F" + dot_feedrate + " \n";
    
    // print until final printing dot height
    z = dots[i][2] + dot_printing_final_height;
    e += dot_extrusion;
    fullGCode += "G1 Z" + z + " E" + e + " \n";

    // Retraction
    e -= dot_retraction;
    fullGCode += "G1 E" + e + " \n";    
    
    // z lift
    z += z_lift;
    fullGCode += "G1 Z" + z + " F" + travel_feedrate + " \n";

	}
  
  //  Home printer
	fullGCode += "G28 \n";
  // Reset extruder value
	fullGCode += "G92 E0 \n";
  // Disable motors
	fullGCode += "M84 \n";  
  
	return fullGCode;
}

function createFile(){
	var output = getParameters();
	output += buildGCode();
	var GCodeFile = new Blob([output], {type: 'text/plain'});
	saveAs(GCodeFile, "dots_pyramid" + '.gcode');
}

function getParameters(){
var params = [];
	params += "; GCode generated with Stalactite from www.3digitalcooks.com \n";
	params += "; pyramid_initial_height: " + document.getElementById("pyramid_initial_height").value + "\n";
  params += "; pyramid_layer_height: " + document.getElementById("pyramid_layer_height").value + "\n";
	params += "; travel_feedrate: " + document.getElementById("travel_feedrate").value + "\n";
	params += "; travel_z_lift: " + document.getElementById("travel_z_lift").value + "\n"; 
	params += "; dots_per_side: " + document.getElementById("dots_per_side").value + "\n"; 
	params += "; distance_between_dots: " + document.getElementById("distance_between_dots").value + "\n";
	params += "; dot_printing_initial_height: " + document.getElementById("dot_printing_initial_height").value + "\n";
	params += "; dot_printing_final_height: " + document.getElementById("dot_printing_final_height").value + "\n";  
	params += "; dot_feedrate: " + document.getElementById("dot_feedrate").value + "\n";

return params;
}
