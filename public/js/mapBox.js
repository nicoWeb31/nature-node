console.log("hello from clientSide");
//recuperate data info expose in html
const locs = JSON.parse(document.getElementById("map").dataset.locations);
console.log("🚀 ~ file: mapBox.js ~ line 3 ~ location", locs);

mapboxgl.accessToken =
    "pk.eyJ1IjoicmlvdG5pY29sYXMiLCJhIjoiY2todzkxY3hjMXU2dDJ4a3pucXZmeW5iMiJ9.DHV1ypXc77BeGv3XVOCJjQ";

const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    // center:[-188.113456,34.3456322],
    // zoom: 10,
    // interactive: false
});

const bounds = new mapboxgl.LngLatBounds();
locs.forEach((loc) => {
    //create marker
    const el = document.createElement("div");
    el.className = "marker";

    //add marker
    new mapboxgl.Marker({
        element: el,
        anchor: "bottom",
    })
        .setLngLat(loc.coordinates)
        .addTo(map);

    //add popup
    new mapboxgl.Popup({
        offset:40
    })
        .setLngLat(loc.coordinates)
        .setHTML(`<p> ${loc.day}: ${loc.description} </p>`)
        .addTo(map);

    //extend map bounds to include current location
    bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom: 150,
        left: 100,
        rigth: 100,
    },
});
