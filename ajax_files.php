<?php
$CHARACTERS_DIR = "images/character";
$BACKGROUNDS_DIR = "images/background";
$TEMPLATES_DIR = "templates";

function getFiles($directory) {
	$tmp_files = scandir($directory);
	$files = array();

	for ($i=0; $i < sizeOf($tmp_files); $i++) {
		if ($tmp_files[$i] != "." && $tmp_files[$i] != "..") {
			$imageFileType = pathinfo($tmp_files[$i],PATHINFO_EXTENSION);
			if($imageFileType == "jpg" || $imageFileType == "png" || $imageFileType == "jpeg" || $imageFileType == "gif" || $imageFileType == "svg") {
				$files[] = $tmp_files[$i]; 
			}
		}
	}
	echo json_encode($files);
}

function setFile($directory, $input) {
	$base_name = basename($_FILES[$input]["name"]);
	$target_file = $directory.DIRECTORY_SEPARATOR.$base_name;
	$source_file = $_FILES[$input]["tmp_name"];
	$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
	$check = getimagesize($source_file);
	if ($check !== false) {
		$sizeinpixels = false;
		if ($input === "back") {
			if ($check[0] <= 1250 && $check[1] <= 975) {
				$sizeinpixels = true;
			}
		}
		else if ($input === "charac") {
			if ($check[0] <= 60 && $check[1] <= 92) {
				$sizeinpixels = true;
			}
		}
		if (!$sizeinpixels) {
			header('HTTP/1.1 500 Internal Server Error');
        	header('Content-Type: application/json; charset=UTF-8');
        	die(json_encode(array('message' => 'El tamaño de la imagen debe ser 1250x975 para fondos y 90x62 para personajes como máximos')));
		}
		else {
			if($imageFileType == "jpg" || $imageFileType == "png" || $imageFileType == "jpeg" || $imageFileType == "gif" ) {
				if ($_FILES[$input]["size"] <= 6000000) {
					$j = 0;
					while (file_exists($target_file)) {
						$file_arr = explode(".",$base_name);
						$base_name = $file_arr[0]."-".$j.".".$file_arr[1];
						$target_file = $directory.DIRECTORY_SEPARATOR.$base_name;
						$j++;
					}
					if (move_uploaded_file($source_file ,$target_file)) {
						header('Content-Type: application/json');
       			 		print json_encode(array('message' => $base_name));
       			 	}
       			 	else {
       			 		header('HTTP/1.1 500 Internal Server Error');
        				header('Content-Type: application/json; charset=UTF-8');
        				die('Error copiando el archivo en el servidor');
       			 	}
				}
				else {
					header('HTTP/1.1 500 Internal Server Error');
        			header('Content-Type: application/json; charset=UTF-8');
        			die('El tamaño del archivo debe ser menor a 6 mb');
				}
			}
			else {
				header('HTTP/1.1 500 Internal Server Error');
        		header('Content-Type: application/json; charset=UTF-8');
        		die('Las extensiones admitidas son jpg, png, jpeg y gif');
			}
		}
	}
	else {
		header('HTTP/1.1 500 Internal Server Error');
        header('Content-Type: application/json; charset=UTF-8');
        die('El archivo no es del tipo imagen');
	}
}

function saveTemplate($svg, $name, $directory) {
	str_replace('&quot;', '\'', $svg);   
	$exists = false;
	if (file_exists($directory.DIRECTORY_SEPARATOR.$name.'.svg')) {
		unlink($directory.DIRECTORY_SEPARATOR.$name.'.svg');
		$exists = true;
	}
    if (file_put_contents($directory.DIRECTORY_SEPARATOR.$name.'.svg', $svg)) {
    	header('Content-Type: application/json');
       	if (!$exists) {
       		print json_encode(array('message' => $name.'.svg'));
       	}
       	else {
       		print json_encode(array('message' => ''));
       	}
    }
    else {
    	header('HTTP/1.1 500 Internal Server Error');
        header('Content-Type: application/json; charset=UTF-8');
        die('La plantilla no se ha podido salvar');
    }
}

if ($_POST['id'] == "CHARACTER") {
	getFiles($CHARACTERS_DIR);
}
else if ($_POST['id'] == "BACKGROUND") {
	getFiles($BACKGROUNDS_DIR);
}
else if ($_POST['id'] == "GETTEMPLATE") {
	getFiles($TEMPLATES_DIR);
}
else if ($_POST['id'] == "SAVEBACKGROUND") {
	setFile($BACKGROUNDS_DIR,"back");
}
else if ($_POST['id'] == "SAVECHARACTER") {
	setFile($CHARACTERS_DIR,"charac");
}
else if ($_POST['id'] == "SAVETEMPLATE") {
	saveTemplate($_POST['svg'],$_POST['name'],$TEMPLATES_DIR);
}
?>