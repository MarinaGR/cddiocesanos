//Global Variables

var now = new Date().getTime();

var extern_siteurl="http://cdcolegiosdiocesanos.com/kantanna/pages/index.php?app=mobile"; 
var extern_siteurl_op="http://cdcolegiosdiocesanos.com/kantanna/functions/php_ajax_operations.php";

//Get the screen and viewport size
var viewport_width=$(window).outerWidth();
var viewport_height=$(window).outerHeight();
var screen_width=screen.width;
var screen_height=screen.height; 

$(document).ready(function() {
	$("#contenido").height(parseInt($(window).height())-4+"px");
});

function onBodyLoad()
{	
    document.addEventListener("deviceready", onDeviceReady, false); 
	
	var fecha=getLocalStorage("fecha"); 
	if(typeof fecha == "undefined"  || fecha==null)	
	{	
		//var nueva_fecha= new Date(now);
		var nueva_fecha= new Date(2014,9,9).getTime();
		setLocalStorage("fecha", nueva_fecha);
	}
	
	check_internet();			
	
}
function onDeviceReady()
{
	document.addEventListener("offline", onOffline, false);
	document.addEventListener("online", onOnline, false); 	
	
	document.addEventListener("backbutton", onBackKeyDown, false);
	document.addEventListener("menubutton", onMenuKeyDown, false);
}    
function onBackKeyDown()
{
	if($("#contenido").attr("src")=="offline.html") 
	{		
		navigator.app.exitApp();
		return false;
	}
	window.history.back();
}
function onMenuKeyDown()
{
	//window.location.href='index.html';
}
function onOnline()
{
	setTimeout(function(){
		$("#contenido").attr("src",extern_siteurl);
	},500);
	
	/*var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    alert('Conexión: ' + states[networkState]);*/

}
function onOffline()
{
	setTimeout(function(){
		$("#contenido").attr("src","offline.html");
	},500);

}

function check_internet(){

	var isOffline = 'onLine' in navigator && !navigator.onLine;

	if(isOffline) 
	{
		setTimeout(function(){
			$("#contenido").attr("src","offline.html");				
		},500);
	}
	else 
	{
		if(typeof $("#contenido").attr("src") == "undefined")
		{
			/*NOTIFICACIONES*/
			_30_seconds_from_now = new Date(now + 30*1000);
			
			var values="date="+getLocalStorage("fecha");
			var result=ajax_operation_cross(values,"ov_get_notifications");
	
			setTimeout(function(){
				$("#contenido").attr("src",extern_siteurl);	
			},500);
		}		
	}

}
function show_notification(msg)
{
	/*window.plugin.notification.local.add({
		id:         String,  // A unique id of the notifiction
		date:       Date,    // This expects a date object
		message:    String,  // The message that is displayed
		title:      String,  // The title of the message
		repeat:     String,  // Either 'secondly', 'minutely', 'hourly', 'daily', 'weekly', 'monthly' or 'yearly'
		badge:      Number,  // Displays number badge to notification
		sound:      String,  // A sound to be played
		json:       String,  // Data to be passed through the notification
		autoCancel: Boolean, // Setting this flag and the notification is automatically canceled when the user clicks it
		ongoing:    Boolean, // Prevent clearing of notification (Android only)
	});*/
	
	var mensaje='Hay actualizaciones: '; 
	if(msg[0]["ov_news"]>0)
	{
		mensaje+='\r\n'+msg[0]["ov_news"]+' noticias ';
	}
	if(msg[1]["ov_documents"]>0)
	{	
		mensaje+='\r\n'+msg[1]["ov_documents"]+' documentos ';	
	}
	
	if(msg[0]["ov_news"]>0 && msg[1]["ov_documents"]>0)
	{
		mensaje+='\r\nDesde el día: '+new Date(getLocalStorage("fecha")).toDateString()+'.';
		
		window.plugin.notification.local.add({
			id:      1,
			date:    _30_seconds_from_now, //Empieza 30 segundos después de iniciar la aplicación
			title:   'CD Colegios Diocesanos',
			message: mensaje
		});
	}

	setLocalStorage("fecha", now);
	
}

/*************************************************************/
function ajax_operation(values,operation)
{
	var retorno=false;		
	$.ajax({
	  type: 'POST',
	  url: extern_siteurl_op,
	  data: { v: values, o: operation },
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
			//alert(data.error+" - "+data.error_message); // uncomment to trace errors
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
	  url: extern_siteurl_op,
	  data: { v: values, o: operation },
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
        console.log(data);
        retorno=data.result;
    }	
	function h_proccess_p(data){

		//console.log(data);

		if(data.error=="0")
		{			
			if(data.warning!="0")
			{
				alert(data.warning);
			}
			retorno=data.result;
			
			show_notification(retorno);
	
		}
		else
		{
			//alert(data.error+" - "+data.error_message); // uncomment to trace errors
			retorno=false;
		}			
	}	
	return retorno;					
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
/*************************************************************/
function setLocalStorage(keyinput,valinput) 
{
	if(typeof(window.localStorage) != 'undefined') { 
		window.localStorage.setItem(keyinput,valinput); 
	} 
	else { 
		alert("localStorage no definido"); 
	}
}
function getLocalStorage(keyoutput)
{
	if(typeof(window.localStorage) != 'undefined') { 
		return window.localStorage.getItem(keyoutput); 
	} 
	else { 
		alert("localStorage no definido"); 
	}
}