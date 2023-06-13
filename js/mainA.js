
//mostramos un mapa, ya no utilizamos el window load ya que se me puede haber cargado la pagina pero no el mapa
//google maps tiene sus propios eventos
//Esto dice que el objeto window se encargue de escuchar que la libreria de GM ya ha cargado
google.maps.event.addDomListener(window,"load", ()=>{
    const user_location = new UserLocation(()=>{
        //Aqui ya se ha cargado los mapa y ademas cargamos localizacion

        var travelMode = document.getElementById('travel-mode').value;

        //Si el usuario no le ha dado tiempo a elegir que modo escoge, que esto espere con un evento a que el usuario elija
        //Este evento se dispara cuando una persona cambia el valor del select(driving,bicicleta...)
        if(travelMode == "0"){
                                                                            //recibimos el eevento
            document.getElementById('travel-mode').addEventListener("change",(ev)=>{
            //cuando cambie
            //ocultamos la seleccion de transporte y la pantalla
            document.getElementById("travel-screen").style.display="none";
            travelMode = ev.target.value;
            })
        }else{
            //en caso de haber escogido
            document.getElementById("travel-screen").style.display="none";
        }


        //definimos unas opciones que e mapa tiene que tener
        const mapOptions = {
            //zoom cuanto zoom va ahacer nuestro mapa
            zoom: 14,
            //center, donde lo vamos a centrar
            center: {
                lat:user_location.latitud,
                lng:user_location.longitud
            }
        };
        //recogemos el id donde vamos a poner el mapa
        const mapa_element = document.getElementById('map');
        //le pasamos en que elemento html vamos a mostrar el mapa para que GM lo sepa 
        //y como segundo parametro la configuracion
        const map = new google.maps.Map(mapa_element,mapOptions);

        //Gracias a la libreria places, podemos autocompletar segun el lugar
        const search_input =document.getElementById('search-place');
        const autocomplete = new google.maps.places.Autocomplete(search_input);

        //Colocamos un marcador en el lugar seleccionado
        const marker = new google.maps.Marker({
            //map que muestre la variable map
            map: map
        });

        //OJO EN LA API DE GOOGLE MAPS HAY QUE HABILITAR PLACES API
        //Lo tenenmos que enlazar con el mapa
        autocomplete.bindTo("bounds",map);


        //place_changed es un evento que se ejecuta cuando seleccionamos uno de esos lugares
        google.maps.event.addListener(autocomplete,"place_changed",()=>{

            const place = autocomplete.getPlace();
            //geometry es un objeto que tienen informacion respecto de ese lugar en terminos geometricos como latitud, long....
            //viewport nos da la informacion que el mapa necesita para poder centrarse
            if(place.geometry.viewport){
                //para que se centre el mapa, y modifica el zoom para que s pueda ver el lugar(mas bajo si selecionamos un pais, mas alto si es una ciudad)
                map.fitBounds(place.geometry.viewport);
            }else{
                //setCenter espera una lat y una long que ya contiene location
                map.setCenter(place.geometry.location);
                map.setZoom(15);
            }

            //centramos el marcador con el nuevo lugar que acabamos de encontrar
            marker.setPlace({
                placeId: place.place_id,
                location: place.geometry.location
            });

            marker.setVisible(true);

            //CALCULAR LAS DISTANCIAS
            calculatDistance(place,user_location,travelMode);
        });
    });
});
   
//OJO PARA ESTO NECESITAMOS HABILIATAR EN GOOGLE CLOUD DISTANCE MATRIX API
function calculatDistance(place,origen,travelMode){
    //LatLng crea un objeto como el location del marker y lo crea a partir de la latitud y longitud del usuario
    var origin = new google.maps.LatLng(origen.latitud,origen.longitud)

    //Es el objeto que nos va a ayudar a calcular la distancia a la que estamos de la que acabamos de buscar
    var service = new google.maps.DistanceMatrixService();

    //Pasamos como parametro un objetos de configuracion y segundo una funcion de respuesta
    //el primero permite defirnir hacia donde queremos calcular o de donde a donde queremos calcular 
    //y el segundo nos va atraer la respuesta y el estatus en el que se realizo la ejecucion
    service.getDistanceMatrix({
        //DE DONDE
        origins:[origin],
        //HACIA DONDE
        //SE LE PUEDE METER MAS DESTINOS Y LOS COMPARARÁ CON EL MISMO ORIGEN
        destinations: [place.geometry.location],
        //MODO DE VIAJE(DRIVING, BICICLING,...)
        /* travelMode: google.maps.TravelMode.DRIVING */
        //TravelMode["DRIVING"] es lo mismo que TravelMode.DRIVING
        travelMode: google.maps.TravelMode[travelMode]
    },(respuesta,status)=>{
        //un origen y un destino
        //Si quisiera la distancia entre el origen y el degundo lugar seria elements[1],lo mismo con vario origenes
        const info = respuesta.rows[0].elements[0];


        //esto es para sacar la distancia en texto del json
        const distancia = info.distance.text;

        const duracion = info.duration.text;

        document.getElementById("info").innerHTML=`
            Estas a ${distancia} y ${duracion} de dicho destino
        `;
    })
}
