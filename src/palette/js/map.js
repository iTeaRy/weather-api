
import {API_KEY_MAP} from './constans';
import mapboxgl from 'mapbox-gl';
export function setMap (latitude, longitude) {
    mapboxgl.accessToken = API_KEY_MAP;
    let map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/outdoors-v11',
        center: [longitude, latitude], // starting position
        zoom: 9 // starting zoom
    });

// Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());
}
