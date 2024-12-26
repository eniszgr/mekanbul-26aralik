import InputWithLabel from "./InputWithLabel";
import VenueList from "./VenueList";
import Header from "./Header";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import VenueDataService from "../services/VenueDataService";
const Home = () => {
  const [coordinate, setCoordinate] = React.useState({
    lat: 1,
    long: 1,
  });

  const dispatch = useDispatch();
  const venues = useSelector((state) => state.data);
  const isError = useSelector((state) => state.isError);
  const isLoading = useSelector((state) => state.isLoading);
  const isSuccess = useSelector((state) => state.isSuccess);

  React.useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setCoordinate({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      });
    }
  });
  React.useEffect(() => {
    dispatch({ type: "FETCH_INIT" });
    VenueDataService.nearbyVenues(coordinate.lat, coordinate.long)
      .then((response) => {
        dispatch({ type: "FETCH_SUCCESS", payload: response.data });
      })
      .catch(() => {
        dispatch({ type: "FETCH_FAILURE" });
      });
  }, [coordinate.lat, coordinate.long]);

  return (
    <div>
      <Header
        headerText="Mekanbul"
        motto="Civarınızdaki Mekanlarınızı Keşfedin!"
      />
      <InputWithLabel
        id="arama"
        label="Mekan Ara:"
        type="text"
        isFocused
        onInputChange={() => null}
        value={" "}
      />
      <hr />
      <div className="row">
        <div className="row">
          {isError ? (
            <p>
              <strong>Hata var!</strong>
            </p>
          ) : isLoading ? (
            <p>
              <strong>Mekanlar Yükleniyor ...</strong>
            </p>
          ) : (
            isSuccess && (
              <div className="row">
                <VenueList venues={venues} />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;