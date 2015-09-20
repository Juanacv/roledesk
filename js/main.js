function createSelect(id, tipo) {
	var sele = document.createElement('select');
	sele.name = 'As'+ id;
	for (i=0; i<10; i++) {
		opt = document.createElement('option');
		opt.value = i;
		if (tipo !== undefined) {
			if (tipo[i] !== undefined) {
				opt.text = tipo[i];
			}
		}
		sele.appendChild(opt);
	}
	return sele;
}
function getSelectFormValues() {
	$.ajax({
		url: "ajax_files.php",
		method:"POST",
		data: {id:"CHARACTER" },
		dataType:"json"
	})
	.done(function(files) {
		files.sort();
		$.each(files, function (i, file) {
    		$('#sel_character').append($('<option>', { 
        		value: file,
        		text : file 
   		 	}));
		});
	});
	$.ajax({
		url: "ajax_files.php",
		method:"POST",
		data: {id:"BACKGROUND" },
		dataType:"json"
	})
	.done(function(files) {
		files.sort();
		$.each(files, function (i, file) {
    		$('#sel_background').append($('<option>', { 
        		value: file,
        		text : file 
   		 	}));
		});
	});
	$.ajax({
		url: "ajax_files.php",
		method:"POST",
		data: {id:"GETTEMPLATE" },
		dataType:"json"
	})
	.done(function(files) {
		files.sort();
		$.each(files, function (i, file) {
    		$('#sel_plantilla').append($('<option>', { 
        		value: file,
        		text : file 
   		 	}));
		});
	});
}
$(document).ready(function() {
	var states1 = ['...','Bien', 'Herido', 'Herido Grave', 'Herido de Muerte','Aturdido','Envenedado','Paralizado','Pánico','Hechizado','Muerto'];
	var states2 = ['...','Puño', 'Espada corta', 'Espada larga', 'Mandoble', 'Arco','Flecha','Hechizo','Daga','Honda','Patada'];
	var states3 = ['...','Sin Defensa','Escudo','Armadura','Esquivar','Hechizo','Clemencia','Contrataque','Desaparecer'];
	
	var selectA = createSelect(csele++, states2.sort()); 
	var selectB = createSelect(csele++, states3.sort()); 
	var selectC = createSelect(csele++, states1.sort());
	var cline = 0;
	var abox = 0;
	var imagen = 0;
	var svgCnv;
	var csele = 0;
	
	getSelectFormValues();
	
	svgCnv = new SVGCanvas(window.interact, 1250, 975,'A','C','B','svg-edit','marco',selectA,selectB,selectC)
	$('#svg-edit').css('background-image','url(images/background/default.jpg)');

	$("#background").on("submit", function(e) {
		e.preventDefault();
		var params = new FormData(this);
		params.append("id","SAVEBACKGROUND");
		$.ajax({
			url: "ajax_files.php",
			method:"POST",
			data: params,
			contentType: false,      
			cache: false,             
			processData:false,  
			dataType:"json"
		})
		.done(function(file) {
    		$('#sel_background').append($('<option>', { 
        		value: file.message,
        		text : file.message 
   		 	}));
		})
		.fail(function(msg) {
			alert(msg.responseText);
		});
	});
	
	$("#character").on("submit", function(e) {
		e.preventDefault();
		var params = new FormData(this);
		params.append("id","SAVECHARACTER");
		$.ajax({
			url: "ajax_files.php",
			method:"POST",
			data: params,
			contentType: false,      
			cache: false,             
			processData:false,  
			dataType:"json"
		})
		.done(function(file) {
    		$('#sel_character').append($('<option>', { 
        		value: file.message,
        		text : file.message 
   		 	}));
		})
		.fail(function(msg) {
			alert(msg.responseText);
		});
	});
	
	$("#sel_background").on("change", function() {
		var backimage = $(this).val();
		if (backimage !== ".." && backimage != "") {
			$('#svg-edit').css('background-image','url(images/background/'+backimage+')');
		}
	});
	
	$("#back").on("change",function(e) {
		var file = this.files[0];
		var imageType = file.type;
		var match= ["image/jpeg","image/png","image/jpg","image/gif"];
		if (imageType == match[0] || imageType == match[1] || imageType == match[2] || imageType == match[3]) {
			var reader = new FileReader();
			reader.onload = function(e) {
				$('#svg-edit').css('background-image','url('+e.target.result+')');
			};
			reader.readAsDataURL(file);
		}
		else {
			alert("Tipo de archivo no válido");
		}
	});
	
	$("#save-template").on("click", function() {
		var name = $("#name_template").val();
		if (name !== "" && name !== undefined) {
	 		$("g").each(function (index) {	
            	if($(this).attr('data-signal') !== undefined && $(this).attr('data-signal') === "0") {                       
                    var group = $(this)[0];
                    if (group.id.indexOf('A') != -1) {
                        svgCnv.removeNodes(group.firstChild.points.numberOfItems, group.firstChild.id);
                        svgCnv.removeChild(group);
                    }
                    else {
                        svgCnv.removeChild(group);
                    }
                }
            });
			var svg = svgCnv.toPrint();
			$.ajax({
				url: "ajax_files.php",
				method:"POST",
				data: {id:"SAVETEMPLATE", svg: svg, name: name },
				dataType:"json"
			})
			.done(function(file) {
				if (file.message !== "") {
			    	$('#sel_plantilla').append($('<option>', { 
        				value: file.message,
        				text : file.message 
   		 			}));
   		 		}
			})
			.fail(function(msg) {
				alert(msg.responseText);
			});
		}
		else {
			alert("Debes introducir un nombre de plantilla");
		}
	});
	
	$('#sel_plantilla').on("change", function() {
		var template_name = $(this).val();
		var date = new Date();
		$.get('templates/' + template_name+'?'+date.getTime(), function(data) {
        	$('#marco').html('');
        	document.getElementById('marco').appendChild(data.firstChild);
        	if (svgCnv !== undefined) {
        		svgCnv.refresh();
        	}
        	var template_arr = template_name.split(".");
        	$('#name_template').val(template_arr[0]);
        	var groups = $('g');
        	$.each(groups, function(i, group) {
        		if (group.id.startsWith('A')) {
        			cline+=1;
        		}
        		else if (group.id.startsWith('B')) {
        			imagen+=1; 
        		}
        		else if (group.id.startsWith('C')) {
        			abox+=1;
        		}
        	});
        });
	});
	
	$("#add-line").on("click", function() { 
		cline+=1; 	
		svgCnv.flexyLine(cline, "#29e",'#00ff00'); 
	});
	
	$("#add-rectangle").on("click",function() { 
		abox+=1; 
		svgCnv.analogBox(abox); 
	});
	
	$("#add-image").on("click", function() { 
		imagen+=1; 
		var selectedImage = $("#sel_character").val();
		if (selectedImage !== null && selectedImage !== undefined && selectedImage !== "" && selectedImage !== "..") {
			svgCnv.imageEle(imagen, false, 'images/character/'+selectedImage, 'images/character/'+selectedImage, 20, 20, 60, 92); 
		}
	});	

});