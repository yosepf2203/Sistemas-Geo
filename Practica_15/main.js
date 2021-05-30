var map;
var markers = [];

function iniciaMapa() {

    var coordenadas = { lat: 21.152639, lng: -101.711598 };

    var propiedades = {
        center: coordenadas,
        zoom: 12
    };

    map = new google.maps.Map(document.getElementById('map'), propiedades);

    muestraLugares();

}

var tipo = document.getElementById('tipo');
var valor;
tipo.addEventListener('change', function () {

    valor = this.options[tipo.selectedIndex].value;
    muestraLugares();
});

function muestraLugares() {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(posicion => {

            var coordenadas = {
                lat: posicion.coords.latitude,
                lng: posicion.coords.longitude
            };
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch({ location: coordenadas, radius: 1000, type: [valor] }, function (results, status, pagination) {
                if (status !== 'OK') return;
                crearMarcadores(results);
            });
        });
    }
}


function crearMarcadores(places) {

    var bounds = new google.maps.LatLngBounds();

    console.log(places);

    borraMarcadores();

    for (var i = 0, place; place = places[i]; i++) {

        var marker = new google.maps.Marker({
            map: map,
            title: '<strong>' + place.name + '</strong>,' + place.vicinity,
            position: place.geometry.location
        });

        markers.push(marker);


        google.maps.event.addListener(marker, 'mouseover', function () {

            var infowindow = new google.maps.InfoWindow({
                content: this.title,
                position: this.position
            });

            infowindow.open(map);

            setTimeout(function () { infowindow.close(); }, 3000);

        });

        var li = document.createElement('li');
        li.textContent = place.name;
        placesList.appendChild(li);

        bounds.extend(place.geometry.location);

    };

    map.fitBounds(bounds);

}

function borraMarcadores() {

    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    };

    while (placesList.hasChildNodes()) {
        placesList.removeChild(placesList.firstChild);
    }

}