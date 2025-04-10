/* Vienna Sightseeing Beispiel */

// Stephansdom Objekt
let stephansdom = {
    lat: 48.208493,
    lng: 16.373118,
    zoom: 12,
    title: "Domkirche St. Stephan",
};

// Karte initialisieren
let map = L.map("map", {
    maxZoom: 19
},
).setView([stephansdom.lat, stephansdom.lng], stephansdom.zoom);

// Overlays definieren
let overlays = {
    sights: L.featureGroup().addTo(map),
    lines: L.featureGroup().addTo(map),
    stops: L.featureGroup().addTo(map),
    zones: L.featureGroup().addTo(map),
    hotels: L.markerClusterGroup({ disableClusteringAtZoom: 15 }).addTo(map),
};

// Layercontrol
L.control.layers({
    "BasemapAT": L.tileLayer.provider('BasemapAT.basemap'),
    "BasemapAT grau": L.tileLayer.provider('BasemapAT.grau').addTo(map),
    "BasemapAT Overlay": L.tileLayer.provider('BasemapAT.overlay'),
    "BasemapAT HighDPI": L.tileLayer.provider('BasemapAT.highdpi'),
    "BasemapAT Orthofoto": L.tileLayer.provider('BasemapAT.orthofoto'),
    "BasemapAT Relief": L.tileLayer.provider('BasemapAT.terrain'),
    "BasemapAT Oberfläche": L.tileLayer.provider('BasemapAT.surface'),
}, {
    "Sehenswürdigkeiten": overlays.sights,
    "Vienna sightseeing Linien": overlays.lines,
    "Vienna sightseeing Haltestellen": overlays.stops,
    "Fußgängerzonen": overlays.zones,
    "Hotels und Unterkünfte": overlays.hotels,

}).addTo(map);


// Maßstab
L.control.scale({ imperial: false }).addTo(map);


// Sehenswürdigkeiten
async function loadSights(url) {
    //console.log(url)
    let response = await fetch(url);
    let jsondata = await response.json();
    //console.log(jsondata)
    L.geoJSON(jsondata, {
        attribution: 'Datenquelle: <a href= "https://data.wien.gv.at"> Stadt Wien </a>',
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng,
                {
                    icon: L.icon({
                        iconUrl: 'icons/photo.png',
                        iconAnchor: [16, 37],
                        popupAnchor: [0, -37],
                    })
                }
            );
        },
        onEachFeature: function (feature, layer) {
            console.log(feature.properties);
            layer.bindPopup(`
                <img src="${feature.properties.THUMBNAIL}" alt= "*">
                <h4>${feature.properties.NAME}</h4>
                <adress>${feature.properties.ADRESSE}</adress>
                <a href="${feature.properties.WEITERE_INF}" target= "wien">Website</a>
                `);
        }
    }).addTo(overlays.sights);
}

// Touristische Kraftfahrtlinien
async function loadLines(url) {
    //console.log(url)
    let response = await fetch(url);
    let jsondata = await response.json();
    //console.log(jsondata)
    L.geoJSON(jsondata, {
        attribution: 'Datenquelle: <a href= "https://data.wien.gv.at"> Stadt Wien </a>',
        style: function (feature) {
            console.log(feature.properties);
            let lineColor = "";
            if (feature.properties.LINE_NAME == "Yellow Line") { lineColor = "#FFDC00"; }
            else if (feature.properties.LINE_NAME == "Blue Line") { lineColor = "#0074D9"; }
            else if (feature.properties.LINE_NAME == "Red Line") { lineColor = "#FF4136"; }
            else if (feature.properties.LINE_NAME == "Green Line") { lineColor = "#2ECC40"; }
            else if (feature.properties.LINE_NAME == "Grey Line") { lineColor = "#AAAAAA"; }
            else if (feature.properties.LINE_NAME == "Orange Line") { lineColor = "#FF851B"; }
            else { lineColor = "000000"; }
            return {
                color: lineColor, // color in rgb format
                weight: 3, // line dicke
                opacity: 0.7, // line opacity
                fillOpacity: 0.7, // fill opacity
            }
        }
    }).addTo(overlays.lines);
}

// Touristische Kraftfahrtlinien Haltestellen
async function loadStops(url) {
    //console.log(url)
    let response = await fetch(url);
    let jsondata = await response.json();
    //console.log(jsondata)
    L.geoJSON(jsondata, {
        attribution: 'Datenquelle: <a href= "https://data.wien.gv.at"> Stadt Wien </a>',
        pointToLayer: function (feature, latlng) {
            line_id = feature.properties.LINE_ID;
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: `icons/bus_${line_id}.png`,
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37],
                })
            })
        }
    }).addTo(overlays.stops);
}

// Fußgängerzonen
async function loadZones(url) {
    //console.log(url)
    let response = await fetch(url);
    let jsondata = await response.json();
    //console.log(jsondata)
    L.geoJSON(jsondata, {
        attribution: 'Datenquelle: <a href= "https://data.wien.gv.at"> Stadt Wien </a>',
        style: function (feature) {
            console.log(feature)
            return {
                color: "#F012BE", // pink in rgb format
                weight: 1,
                opacity: 0.4,
                fillOpacity: 0.1,
            }
        }
    }).addTo(overlays.zones);
}

// Hotels und Unterkünfte

async function loadHotels(url) {
    //console.log(url)
    let response = await fetch(url);
    let jsondata = await response.json();
    //console.log(jsondata)
    L.geoJSON(jsondata, {
        attribution: 'Datenquelle: <a href= "https://data.wien.gv.at"> Stadt Wien </a>',
        pointToLayer: function (feature, latlng) {
            console.log(feature.properties);
            let iconName;
            if (feature.properties.KATEGORIE_TXT == '5*') { iconName = 'hotel_5stars.png'; }
            else if (feature.properties.KATEGORIE_TXT == '4*') { iconName = 'hotel_4stars.png'; }
            else if (feature.properties.KATEGORIE_TXT == '3*') { iconName = 'hotel_3stars.png'; }
            else if (feature.properties.KATEGORIE_TXT == '2*') { iconName = 'hotel_2stars.png'; }
            else if (feature.properties.KATEGORIE_TXT == '1*') { iconName = 'hotel_1star.png'; }
            else { iconName = 'hotel_0star.png'; }
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: `icons/${iconName}`,
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37],
                })
            });

        }

    }).addTo(overlays.hotels);
}



loadSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json")
loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json")
loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json")
loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json")
loadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json")
