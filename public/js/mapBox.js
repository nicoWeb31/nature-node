console.log('hello from clientSide')
//recuperate data info expose in html
const locs = JSON.parse(document.getElementById('map').dataset.locations);
console.log("🚀 ~ file: mapBox.js ~ line 3 ~ location", locs)