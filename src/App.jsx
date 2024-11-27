import { useEffect, useRef, useState } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

const placesId = JSON.parse(localStorage.getItem("savedPlaces")) || [];
const selectedPlaces = placesId.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id)
);

function App() {
  const modal = useRef();
  const selectedPlace = useRef();
  const [sortedPlaces, setSortedPlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(selectedPlaces);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlacesByLocation = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );
      setSortedPlaces(sortedPlacesByLocation);
    });
  }, []);

  function handleStartRemovePlace(id) {
    modal.current.open();
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    modal.current.close();
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const placesId = JSON.parse(localStorage.getItem("savedPlaces")) || [];

    if (placesId.indexOf(id) === -1) {
      localStorage.setItem("savedPlaces", JSON.stringify([id, ...placesId]));
    }
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    modal.current.close();

    const placesId = JSON.parse(localStorage.getItem("savedPlaces")) || [];
    localStorage.setItem(
      "savedPlaces",
      JSON.stringify(placesId.filter((id) => id !== selectedPlace.current))
    );
  }

  return (
    <>
      <Modal ref={modal}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={sortedPlaces}
          fallbackText={"Sorting the nearest places to your location..."}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
