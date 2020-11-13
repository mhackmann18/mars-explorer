let manifest;
const parser = new DOMParser();
const solInput = document.querySelector("input");
const cameraSelect = document.querySelector("#camera-select");
const roverSelect = document.getElementById("rover-select");
const form = document.querySelector("#controls");
const slidesContainer = document.querySelector(".container");
const button = document.querySelector("button");
let exists = false;
const spinner = document.querySelector("#spinner");
const spinner1 = document.getElementById("spinner1");
spinner.style.display = "none";
const photosDiv = document.getElementById("photos");

makeRequest('GET', `https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity?api_key=${API_KEY}`, res => manifest = JSON.parse(res));

makeRequest('GET', "https://www.professorwergeles.com/webService.php?content=data&format=xml", res => {
    displayRoverData(parser.parseFromString(res, "text/xml"));
    spinner1.style.display = "none";
  }
);

solInput.onchange = e => {
  const day = Number(e.target.value);
  exists = false;
  manifest.photo_manifest.photos.forEach(el => {
    if(el.sol === day){
      exists = true;
      document.getElementById("no-photos-msg").style.display = "none";
      cameraSelect.innerHTML = "";
      el.cameras.forEach(cam => cameraSelect.innerHTML += `<option value="${cam}">${cam}</option>`);
      return;
    } else if(el.sol > day){
      return;
    }
  });
  
  if(!exists) {
    cameraSelect.innerHTML = "";
    document.getElementById("no-photos-msg").style.display = "block";
  }
}

solInput.onkeyup = e => {
  const day = Number(e.target.value);
  exists = false;
  manifest.photo_manifest.photos.forEach(el => {
    if(el.sol === day){
      exists = true;
      document.getElementById("no-photos-msg").style.display = "none";
      cameraSelect.innerHTML = "";
      el.cameras.forEach(cam => cameraSelect.innerHTML += `<option value="${cam}">${cam}</option>`);
      return;
    } else if(el.sol > day){
      return;
    }
  });
  
  if(!exists) {
    cameraSelect.innerHTML = "";
    document.getElementById("no-photos-msg").style.display = "block";
  }
}

form.onsubmit = e => {
  e.preventDefault();
  submitForm();
}

button.onclick = e => {
  e.preventDefault();
  submitForm();
}

function submitForm(){
  if(exists && solInput.value !== ""){
    photosDiv.innerHTML = "";
    photosDiv.style.display = "none";
    spinner.style.display = "block";
    makeRequest(
      'GET',
      `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${solInput.value}&camera=${cameraSelect.value}&api_key=${API_KEY}`, 
      res => {
        res = JSON.parse(res);
        if(res.photos.length){
        photoGallery(res.photos);
        } else {
          alert("No photos for this cam. Please pick a different cam.")
        }
        spinner.style.display = "none";
      }
    );
  }
}

function photoGallery(photos){
  let current = 0;
  photosDiv.style.display = "block";
  changePhoto(photos[current].img_src);

  const oldLeftBtn = document.querySelector(".chevron-left");
  const oldRightBtn = document.querySelector(".chevron-right");
  
  const leftBtn = oldLeftBtn.cloneNode(true);
  oldLeftBtn.parentNode.replaceChild(leftBtn, oldLeftBtn);
  const rightBtn = oldRightBtn.cloneNode(true);
  oldRightBtn.parentNode.replaceChild(rightBtn, oldRightBtn);

  rightBtn.addEventListener("click", next);
  leftBtn.addEventListener("click", prev);

  function next(){
    if(photos[current + 1]){
      current++;
    } else {
      current = 0;
    }
    changePhoto(photos[current].img_src);
  }

  function prev(){
    if(photos[current - 1]){
      current--;
    } else {
      current = photos.length - 1;
    }
    changePhoto(photos[current].img_src);
  }

  function changePhoto(img){
    photosDiv.innerHTML = `<img id="mars-photo" src="${img}" alt="mars-pic">`;
  }
}

function displayRoverData(xml){
  const nameNodes = xml.querySelectorAll("name");
  const launchDateNodes = xml.querySelectorAll("launch_date");
  const descriptionNodes = xml.querySelectorAll("description");

  let rovers = [];

  for(let i = 0; i < nameNodes.length; ++i){
    roverSelect.innerHTML += `<option value="${nameNodes[i].innerHTML}">${nameNodes[i].innerHTML}</option>`;
    rovers.push({
      name: nameNodes[i].innerHTML,
      launchDate: launchDateNodes[i].innerHTML,
      description: descriptionNodes[i].innerHTML
    });
  }

  document.getElementById("launch-date").innerHTML = `Launch Date: ${rovers[0].launchDate}`;
  document.getElementById("rover-description").innerHTML = rovers[0].description;

  roverSelect.onchange = e => {
    for(rover of rovers){
      if(rover.name === e.target.value){
        document.getElementById("launch-date").innerHTML = `Launch Date: ${rover.launchDate}`;
        document.getElementById("rover-description").innerHTML = rover.description;
        return;
      }
    }
  }
}