let manifest;
const solInput = document.querySelector("input");
const cameraSelect = document.querySelector("select");
const form = document.querySelector("form");
const slidesContainer = document.querySelector(".container");

makeRequest('GET', `https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity?api_key=${API_KEY}`, res => manifest = res);

solInput.onchange = e => {
  const day = Number(e.target.value);
  if(!manifest.photo_manifest.photos[day] || !manifest.photo_manifest.photos[day].total_photos){
    alert("No photos available for the selected Martian Sol.");
  } else {
    cameraSelect.innerHTML = "";
    manifest.photo_manifest.photos[day].cameras.forEach(cam => cameraSelect.innerHTML += `<option value="${cam}">${cam}</option>`);
  }
}

form.onsubmit = e => {
  slidesContainer.innerHTML = "";
  console.log(e);
  e.preventDefault();
  makeRequest('GET',`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${solInput.value}&camera=${cameraSelect.value}&api_key=${API_KEY}`, res => res.photos.forEach(el => console.log(el.img_src)));
}