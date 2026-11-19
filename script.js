const locationButton = document.querySelector("#locationButton");
const statusText = document.querySelector("#status");
const dogResult = document.querySelector("#dogResult");
const luckyDog = document.querySelector("#luckyDog");
const anotherDogButton = document.querySelector("#anotherDogButton");


const targetLatitude = 40.6936875;
const targetLongitude = -73.9856875;

const unlockDistance = 75;

locationButton.addEventListener("click", checkLocation);
anotherDogButton.addEventListener("click", getRandomDog);

function checkLocation() {
  statusText.textContent = "Finding your location...";

  navigator.geolocation.getCurrentPosition(
    locationSuccess,
    locationError
  );
}

function locationSuccess(position) {
  const userLatitude = position.coords.latitude;
  const userLongitude = position.coords.longitude;

  const distance = getDistance(
    userLatitude,
    userLongitude,
    targetLatitude,
    targetLongitude
  );

  if (distance <= unlockDistance) {
    statusText.textContent = "You found the secret location!";
    locationButton.hidden = true;

    getRandomDog();
  } else {
    statusText.textContent =
      `Your lucky dog is ${Math.round(distance)} meters away.`;
  }
}

function locationError(error) {
  console.error(error);

  statusText.textContent =
    "Please allow location access to find your lucky dog.";
}

async function getRandomDog() {
  const url = "https://dog.ceo/api/breeds/image/random";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();

    luckyDog.src = result.message;
    dogResult.hidden = false;
  } catch (error) {
    console.error(error.message);

    statusText.textContent =
      "The lucky dog could not be reached. Try again.";
  }
}

function getDistance(latitude1, longitude1, latitude2, longitude2) {
  const earthRadius = 6371000;

  const latitudeDifference =
    degreesToRadians(latitude2 - latitude1);

  const longitudeDifference =
    degreesToRadians(longitude2 - longitude1);

  const firstLatitude = degreesToRadians(latitude1);
  const secondLatitude = degreesToRadians(latitude2);

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(firstLatitude) *
    Math.cos(secondLatitude) *
    Math.sin(longitudeDifference / 2) ** 2;

  const c = 2 * Math.atan2(
    Math.sqrt(a),
    Math.sqrt(1 - a)
  );

  return earthRadius * c;
}

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}