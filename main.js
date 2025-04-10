/* Vienna Sightseeing Beispiel */

// Stephansdom Objekt
let stephansdom = {
    lat: 48.208493,
    lng: 16.373118,
    zoom: 12,
    title: "Domkirche St. Stephan",
};

// Karte initialisieren
let map = L.map("map").setView([stephansdom.lat, stephansdom.lng], stephansdom.zoom);

// Hintergrundkarte definieren
L.tileLayer('https://mapsneu.wien.gv.at/basemap/bmapgrau/normal/google3857/{z}/{y}/{x}.png', {
    maxZoom: 19,
    attribution: 'Hintergrundkarte: <a href="https://www.basemap.at">basemap.at</a>'
}).addTo(map);

// Overlays definieren
let overlays = {
    sights: L.featureGroup().addTo(map),
    lines: L.featureGroup().addTo(map),
    stops: L.featureGroup().addTo(map),
    zones: L.featureGroup().addTo(map),
}

// Layercontrol
L.control.layers({
    "BasemapAT": L.tileLayer.provider('BasemapAt.basemap'),
    "BasemapAT grau": L.tileLayer.provider('BasemapAt.grau').addTo(map),
    "BasemapAT Overlay": L.tileLayer.provider('BasemapAT.overlay'),
    "BasemapAT HighDPI": L.tileLayer.provider('BasemapAt.highdpi'),
    "BasemapAT Orthofoto": L.tileLayer.provider('BasemapAt.orthofoto'),
    "BasemapAT Relief": L.tileLayer.provider('BasemapAt.terrain'),
    "BasemapAT Oberfläche": L.tileLayer.provider('BasemapAt.surface'),
}, {
    "Sehenswürdigkeiten": overlays.sights,
    "Vienna sightseeing Linien": overlays.lines,
    "Vienna sightseeing Haltestellen": overlays.stops,
    "Fußgängerzonen": overlays.zones,

}).addTo(map);


// Maßstab
L.control.scale({ metric: true, imperial: false }).addTo(map);


// Sehenswürdigkeiten
async function loadSights(url) {
    //console.log(url)
    let response = await fetch(url);
    let jsondata = await response.json();
    //console.log(jsondata)
    L.geoJSON(jsondata, {
        attribution: 'Datenquelle: <a href= "https://data.wien.gv.at"> Stadt Wien </a>'
    }).addTo(overlays.sights);
}

// Touristische Kraftfahrtlinien
async function loadLines(url) {
    console.log(url)
    let response = await fetch(url);
    let jsondata = await response.json();
    console.log(jsondata)
    L.geoJSON(jsondata, {
        attribution: 'Datenquelle: <a href= "https://data.wien.gv.at"> Stadt Wien </a>'
    }).addTo(overlays.lines);
}

// Touristische Kraftfahrtlinien Haltestellen
async function loadStops(url) {
    //console.log(url)
    let response = await fetch(url);
    let jsondata = await response.json();
    //console.log(jsondata)
    L.geoJSON(jsondata, {
        attribution: 'Datenquelle: <a href= "https://data.wien.gv.at"> Stadt Wien </a>'
    }).addTo(overlays.stops);
}

// Fußgängerzonen
async function loadZones(url) {
    //console.log(url)
    let response = await fetch(url);
    let jsondata = await response.json();
    //console.log(jsondata)
    L.geoJSON(jsondata, {
        attribution: 'Datenquelle: <a href= "https://data.wien.gv.at"> Stadt Wien </a>'
    }).addTo(overlays.zones);
}



loadSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json")
loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json")
loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json")
loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json")
