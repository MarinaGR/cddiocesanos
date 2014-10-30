//Global Variables

var extern_siteurl="http://www.cdcolegiosdiocesanos.com";
//var extern_siteurl="http://127.0.0.1/cddiocesanos";

var destination="";
	
//Get current_date
var current_date=new Date();
var current_day_of_month=current_date.getDate();
var current_month=current_date.getMonth();
var current_year=current_date.getFullYear();
//Get the screen and viewport size
var viewport_width=$(window).outerWidth();
var viewport_height=$(window).outerHeight();
var screen_width=screen.width;
var screen_height=screen.height; 


function onBodyLoad(page, callback)
{	
    document.addEventListener("deviceready", onDeviceReady, false);    
    
	document.addEventListener("offline", onOffline, false);
	document.addEventListener("online", onOnline, false); 	

    $("#ov_volver_01").click(function(e){
		onBackKeyDown();						
	});
	$("#ov_menu_01").click(function(e){
		onMenuKeyDown();		
	});	 
    
    $('#ov_curtain').hide();
       
    $('#ov_view_container_01').css("min-height",(viewport_height)+"px");	
    
    callback_load(page);	
}
function callback_load(page)
{ 	
	switch(page)
	{
		case "index":	load_text_xml(page);
						break;
						
		case "menu": 	load_text_xml(page);
						search_random_featured('random_featured');				
						break;
						
		case "restaurante": readXML_restaurant("./resources/xml/restaurantes/"+get_var_url("id")+".xml", "id", get_var_url("id"), "ov_id_restaurant");
							show_geoloc(get_var_url("id"), "restaurants_map_frame");
							break;
		
		case "buscador":load_text_xml(page);
						search_items_xml('0', '2', '0', '', 'form_search_restaurants_01', 'ov_id_restaurants');
						break;
		
		case "mapa": 	load_text_xml(page);
						show_near_geoloc();
						break;
						
		case "carta": 	load_text_xml(page);
						readXML_menu("./resources/xml/cartas/"+get_var_url("id")+".xml", "id_restaurante", get_var_url("id"), "ov_id_menu");
						break;
						
		case "plato": 	load_text_xml(page);
						readXML_plato("./resources/xml/platos/"+get_var_url("id_carta")+".xml", get_var_url("id_carta"), get_var_url("id_plato"), "ov_id_plato");
						break;
						
		case "updates": load_text_xml(page);
						//window.webkitRequestFileSystem(PERSISTENT, 0, onFileSystemSuccess, null);    
						break;
		
		case "reservas": 
		case "cuenta": 						
		case "login": 	
		case "registro":
		case "acerca": 	load_text_xml(page);
						break;
						
		default: break;
	}	
	console.log("cargados!"+page); 
}

function onDeviceReady()
{
	document.addEventListener("backbutton", onBackKeyDown, false);
	document.addEventListener("menubutton", onMenuKeyDown, false);
}    
function onBackKeyDown()
{
	window.history.back();
}
function onMenuKeyDown()
{
	window.location.href='menu.html';
}

/* Lenght Object */
Object.size = function(obj) 
{
	var size = 0, key;
	for(key in obj) 
	{
	    if(obj.hasOwnProperty(key)) 
	    	size++;
	}
	return size;
}
function onOnline()
{
	alert("online"+getVersion());
	
	var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    alert('Conexión: ' + states[networkState]);
    
    /* UPDATES */ 
 	window.webkitRequestFileSystem(PERSISTENT, 0, onFileSystemSuccess, null);    
}

function onFileSystemSuccess(fileSystem) 
{
	//Cargado el sistema de archivos, crear los directorios pertinentes para la descarga de los ficheros.
	
	//window.webkitStorageInfo.queryUsageAndQuota(webkitStorageInfo.unlimitedStorage, console.log.bind(console));

	fs=fileSystem;
	
    //fileSystem.root.getDirectory("com.ovnyline.avilagastronomica",{create:true},gotDir,onError);
    
    fs.root.getDirectory("com.ovnyline.avilagastronomica/",{create:true},null,onError);
}

function onOffline()
{
	alert("offline");
	
	var networkState = navigator.connection.type;
	
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    alert('Sin conexión: ' + states[networkState]);
}


function ov_select_language(select)
{
	var idioma=$(select).val();
	setLanguage(idioma);
	window.location.reload();
}
function ov_select_language_web(select)
{
	var idioma=$(select).val();
	setLanguage(idioma);
	
	var values="lang="+idioma;
	var result=ajax_operation(values,"change_language");
	if(result)
		window.location.reload();
	else
		alert("Error al cambiar de idioma");
}

function ajax_operation(values,operation)
{
	var retorno=false;		
	$.ajax({
	  type: 'POST',
	  url: extern_siteurl+"/server/functions/ajax_operations.php",
	  data: { v: values, op: operation },
	  success: h_proccess,
	  error:h_error,
	  dataType: "json",
	  async:false
	});			
	function h_proccess(data){
		
		if(data.error=="0")
		{			
			if(data.warning!="0")
			{
				alert(data.warning);
			}
			retorno=data.result;
		}
		else
		{
			alert(data.error+" - "+data.error_message); // uncomment to trace errors
			retorno=false;
		}				
	}
	function h_error(jqXHR, textStatus, errorThrown)
	{
		console.log(errorThrown);
		retorno=false;		
	}					
	return retorno;
}
function ajax_operation_cross(values,operation)
{
	var retorno=false;		
	$.ajax({
	  type: 'POST',
	  url: extern_siteurl+"/server/functions/ajax_operations.php",
	  data: { v: values, op: operation },
	  beforeSend: function( xhr ) {
	    xhr.overrideMimeType("text/javascript");
	  },
	  success: h_proccess_p,
	  error:function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
            console.log(errorThrown);
            alert(jqXHR.responseText+" - "+errorThrown);
            retorno=false;
         },
	  dataType: "jsonp",
      jsonp: 'callback',
      jsonpCallback: 'jsonpCallback',
	  async:false
	});		
	function jsonpCallback(data){
        alert("jsonp");
        console.log(data);
        retorno=data.result;
    }	
	function h_proccess_p(data){

		console.log(data);

		if(data.error=="0")
		{			
			if(data.warning!="0")
			{
				alert(data.warning);
			}
			retorno=data.result;
			
			if(operation=="login_user")
			{
				setUserId(retorno); 
				window.location.href="./micuenta.html?id="+retorno;
			}
		}
		else
		{
			alert(data.error+" - "+data.error_message); // uncomment to trace errors
			retorno=false;
		}			
	}	
	return retorno;					
}

function show_geoloc(dest, container)
{	
	readXML_coordenadas("./resources/xml/restaurantes/"+dest+".xml", myCallback);
}

function draw_geoloc(position)
{
	var latitude = position.coords.latitude;
  	var longitude = position.coords.longitude;
  	var latlong = latitude+","+longitude;
  	var url="https://www.google.com/maps/embed/v1/directions?key=AIzaSyAD0H1_lbHwk3jMUzjVeORmISbIP34XtzU&origin="+latlong+"&destination="+destination+"&avoid=tolls|highways&mode=walking&language=es&zoom=15&center="+latlong;
  		
  	$('#restaurants_map_frame').attr('src',url);

  	//$("#geoloc_map_text").html("Ruta desde tu posición actual hasta "+destination);	
	
}

function show_geoloc_web(dest, container)
{	
	var values="c1="+dest+"&table=h_restaurants_items";
	var result=ajax_operation(values, "get_latlong");	
	if(result)
	{
		//nombre_restaurante=result[0];
		destination=result[1];
		if (navigator.geolocation)
		{		
			navigator.geolocation.getCurrentPosition(draw_geoloc_web,error_geoloc);
		}
		else
		{
			$("#geoloc_map_text").html("Tu dispositivo no permite la geolocalización dinámica.");			
		}
	}
	else
	{
		destination=dest;
		if (navigator.geolocation)
		{		
			navigator.geolocation.getCurrentPosition(draw_geoloc_web,error_geoloc);
		}
		else
		{
			$("#geoloc_map_text").html("Tu dispositivo no permite la geolocalización dinámica.");			
		}
	}
}

function draw_geoloc_web(position)
{
	var latitude = position.coords.latitude;
  	var longitude = position.coords.longitude;
  	var latlong = latitude+","+longitude;
  	var url="https://www.google.com/maps/embed/v1/directions?key=AIzaSyAD0H1_lbHwk3jMUzjVeORmISbIP34XtzU&origin="+latlong+"&destination="+destination+"&avoid=tolls|highways&mode=walking&language=es&zoom=15&center="+latlong;
  	$("#restaurants_map_frame").attr("src",url);
  	$("#restaurant_map").hide();
  	//$("#geoloc_map_text").html("Ruta desde tu posición actual hasta "+destination);	
}

function error_geoloc(error)
{
	$("#geoloc_map_text").html("La geolocalización ha fallado. Error "+error.code+": "+error.message);	
}

function show_near_geoloc()
{
	if (navigator.geolocation)
	{		
		navigator.geolocation.getCurrentPosition(draw_near_geoloc,error_geoloc,{enableHighAccuracy:true, maximumAge:30000, timeout:30000});
		$("#geoloc_map_text").html("Calculando...");	
	}
	else
	{
		$("#geoloc_map_text").html("Tu dispositivo no permite la geolocalización dinámica.");			
	}
}
	   
/* Converts numeric degrees to radians */
Number.prototype.toRad = function() {
   return this*Math.PI/180;
}
function draw_near_geoloc(position)
{	
	//User position
	var lat1 = position.coords.latitude;
  	var lon1 = position.coords.longitude;
  	var latlong = lat1+","+lon1;
  	
  	var radio=0.4;
  	var radioTierra=6371; //km
	
	var data_near_restaurant=new Array();
	
	for(var i=0; i<data_all_restaurants.length; i++)
	{
		var coord=data_all_restaurants[i][2].split(",");
		var lat2=parseFloat(coord[0]);
		var lon2=parseFloat(coord[1]);
		
		var dLat = (lat2-lat1).toRad();
		var dLon = (lon2-lon1).toRad();
		
		var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
				Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
				Math.sin(dLon/2) * Math.sin(dLon/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		var d = radioTierra * c;
		
		if(d<=radio)
			data_near_restaurant.push(data_all_restaurants[i]);
	}
	
	$("#geoloc_map_text").html("Restaurantes cercanos, a menos de "+radio+" km de tu ubicación");
	
	var myLocation=new google.maps.LatLng(lat1, lon1);
	var request={location: myLocation, radius: radio, types: ['restaurants'] };

    map=new google.maps.Map(document.getElementById('ov_nearest_restaurants_map'), {
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		center: myLocation,
		zoom: 16
    }); 	

  	createMarker(myLocation, "Estás aquí", "0");
  	
  	var restaurantes="", enlace_rest="";
	for(var k=0;k<data_near_restaurant.length;k++)
	{		
		enlace_rest="<p><a href='restaurante.html?id="+data_near_restaurant[k][0]+"' >"+data_near_restaurant[k][1]+"</a></p>"+data_near_restaurant[k][3]+"<br/>"+data_near_restaurant[k][4];
		restaurantes+=enlace_rest;
		
		var coord=data_near_restaurant[k][2].split(",");
		var lat=coord[0];
		var lon=coord[1]; 			
		createMarker(new google.maps.LatLng(lat,lon), enlace_rest, "1");	
	}
  	
  	$("#geoloc_map_text").append(restaurantes);  		
 
}
function createMarker(place, title, type) 
{
    //var placeLoc = place.geometry.location;
    var marker=new google.maps.Marker({
		map: map,
		position: place //placeLoc
    }); 
    marker.setTitle(title);
    
    var infowindow=new google.maps.InfoWindow(
    	{ 
    		content: title 
    	});

	google.maps.event.addListener(marker, 'click', function () {
		infowindow.open(map, marker);
	});
	
	switch(type)
    {
    	case "0": infowindow.open(map, marker);
    			  marker.setIcon("./resources/images/general/marker.png");   
    			  break; 
    	case "1": marker.setIcon("./resources/images/general/marker_map.png");   
    			  break;
    	default: 
    			  break; 
    }
}


function show_near_geoloc_web()
{
	if (navigator.geolocation)
	{		
		navigator.geolocation.getCurrentPosition(draw_near_geoloc_web,error_geoloc);
	}
	else
	{
		$("#geoloc_map_text").html("Tu dispositivo no permite la geolocalización dinámica.");			
	}
}
function draw_near_geoloc_web(position)
{
	//User position
	var latitude = position.coords.latitude;
  	var longitude = position.coords.longitude;
  	var latlong = latitude+","+longitude;
  	
  	var radio=0.4;
  	
  	$("#geoloc_map_text").html("Restaurantes cercanos, a menos de "+radio+" km de tu ubicación");
	
	var myLocation=new google.maps.LatLng(latitude, longitude);
	var request={location: myLocation, radius: radio, types: ['restaurants'] };

    map=new google.maps.Map(document.getElementById('ov_api_map'), {
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		center: myLocation,
		zoom: 16
    }); 	

  	createMarker(myLocation, "Estás aquí", "0");	
  	
  	//Near restaurants		
  	var values="radio="+radio+"&lat="+latitude+"&long="+longitude+"&table=h_restaurants_items";
  	var result=ajax_operation(values,"near_locations");
  	if(result)
  	{
  		var restaurantes="";
  		for(k=0;k<result.length;k++)
  		{
  			restaurantes+="<p><a href='restaurante.html?id="+result[k][0]+"' >"+result[k][3]+"</a></p>";
  			
  			var coord=result[k][2].split(",");
  			var lat=coord[0];
  			var lon=coord[1]; 			
  			createMarker(new google.maps.LatLng(lat,lon), result[k][3], "1");	
  		}
	  	
	  	$("#geoloc_map_text").append(restaurantes);  		
	  	
  	}  	
  	else
  	{
  		$("#geoloc_map_text").html("No hay restaurantes a menos de "+radio+" km de tu ubicación");	  		
  	}
}

function get_var_url(variable){

	var tipo=typeof variable;
	var direccion=location.href;
	var posicion=direccion.indexOf("?");
	
	posicion=direccion.indexOf(variable,posicion) + variable.length; 
	
	if (direccion.charAt(posicion)== "=")
	{ 
        var fin=direccion.indexOf("&",posicion); 
        if(fin==-1)
        	fin=direccion.length;
        	
        return direccion.substring(posicion+1, fin); 
    } 
	else
		return false;
	
}
