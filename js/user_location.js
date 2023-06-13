class UserLocation{
    constructor(callback){
        //Se ejecuta cuando llamemos a la clase

        //vemos si navegator existe y si tiene geolocalizacion
        if(navigator.geolocation){
            //Si tiene la API de geolocalizacion
            navigator.geolocation.getCurrentPosition((localizacion) =>{
                 //Localizacion continene la latitud y longitud en la que se encuentra el usuario
                //Esto se ejecuta cuando ya tenemos la geolocalizacion
                this.latitud= localizacion.coords.latitude;
                this.longitud= localizacion.coords.longitude;
                callback()
            })
        }else{
            alert("Tu navegador no soporta las funcionalidades de esta pagina");
        }
    }
}