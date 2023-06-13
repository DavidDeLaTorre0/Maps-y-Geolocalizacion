/* EJEMPLOS PARA DAVID Y TEORIA
 */
window.addEventListener("load", () =>{
    //Geolocation => Navigator
    //vemos si navegator existe y si tiene geolocalizacion
    if(navigator.geolocation){
        //Si tiene la API de geolocalizacion
        navigator.geolocation.getCurrentPosition((localizacion)=>{
            //Localizacion continene la latitud y longitud en la que se encuentra el usuario
/*             console.log(localizacion);
            console.log("Latitud :" + localizacion.coords.latitude);
            console.log("Longitud :" + localizacion.coords.longitude); */
        })
    }else{
        alert("Tu navegador no soporta las funcionalidades de esta pagina");
    }
})

///PARA CUANDO LLAMAMOS A LA CLASE USERLOCATION
window.addEventListener("load", () =>{
    //Geolocation => Navigator
   
    const user_location = new UserLocation(()=>{
        console.log("Ya tenemos la localizacion bieeen!");
        console.log(user_location);
    });
})
