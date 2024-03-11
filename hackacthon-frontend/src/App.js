import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import obj from './asset/hardcorded';

mapboxgl.accessToken =
  "pk.eyJ1IjoicmFuaml0dHR0dCIsImEiOiJjbHRreDZqNm0xOGc2MnJwYTVxMG5qcTBzIn0.zY3DpiT5B_8bYwGTz7iFIA";

const Marker = ({
  isPropertyClicked,
  setIsPropertyClicked,
  children,
  feature,
}) => {
  const _onClick = () => setIsPropertyClicked(feature);
  const amenitiesArray = [] || Object.keys(feature.Amenities).map((key) => ({
    name: key,
    value: feature.Amenities[key],
  }));

  return (
    <>
      {console.log("->", isPropertyClicked)}
      {isPropertyClicked && (isPropertyClicked.properties.BUILDING_ID === feature.properties.BUILDING_ID) && (
        <div
          className="cancel-container"
          onClick={() => setIsPropertyClicked(null)}
        >
          <p className="cancel">&#10060;</p>
        </div>
      )}
      {isPropertyClicked && isPropertyClicked.properties.BUILDING_ID === feature.properties.BUILDING_ID && (
        <div className="popup" >
          <div className="tile-header">
            <span className="tile-header-item title">{feature.properties.BUILDING_ID}</span>
            <span className="tile-header-item">CAD {feature.properties.BUILDING_ID}</span>
          </div>
          <div className="tile-content">

            {/*amenitiesArray.map((amen) => (
              <div className="amenities-tile">
                <p>{amen.name}</p> <p>{amen.value ? "\u2705" : "\u274C"}</p>
              </div>
            ))*/}
          </div>
        </div>
      )}
      {!(isPropertyClicked != null) && (
        <button onClick={_onClick} className="marker" titlea={feature.properties.BUILDING_ID}>
          {children}
        </button>
      )}
    </>
  );
};

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-63.6098533);
  const [lat, setLat] = useState(44.6532031);
  const [zoom, setZoom] = useState(14.24);
  const [isPropertyClicked, setIsPropertyClicked] = useState(null);



  useEffect(() => {
    // if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    obj.map((o) => {
      const ref = React.createRef();
      // Create a new DOM node and save it to the React ref
      ref.current = document.createElement("div");
      // Render a Marker Component on our new DOM node
      ReactDOM.render(
        <Marker
          feature={o}
          isPropertyClicked={isPropertyClicked}
          setIsPropertyClicked={setIsPropertyClicked}
        ></Marker>,
        ref.current,
      );

      // .setLngLat([-63.6098533, 44.6532031])
      return new mapboxgl.Marker(ref.current)
        .setLngLat([o.properties.LON, o.properties.LAT])
        .addTo(map.current);
    });
  }, [isPropertyClicked]);

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
