import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import obj from "./asset/hardcorded";

mapboxgl.accessToken =
  "pk.eyJ1IjoicmFuaml0dHR0dCIsImEiOiJjbHRreDZqNm0xOGc2MnJwYTVxMG5qcTBzIn0.zY3DpiT5B_8bYwGTz7iFIA";

const Marker = ({
  isPropertyClicked,
  setIsPropertyClicked,
  children,
  feature,
}) => {
  const unitType = feature.properties.Amenities || [
    "1 Bedroom",
    "2 Bedroom",
    "3 Bedroom",
    "Penthouse",
  ];
  const [active, setActive] = useState(unitType[0]);

  const _onClick = () => setIsPropertyClicked(feature);
  const amenitiesArray =
    ['Parking', 'Water', 'Hydro', 'Security', "Pool"] ||
    Object.keys(feature.Amenities).map((key) => ({
      name: key,
      value: feature.Amenities[key],
    }));
  const parameters = ["Total Listings: 2", "Avg. Rent: 2000 CAD", "Bedroom: 1", "Hall; 1", "Predicted Price: ___", "Avg. Price Per foot: 2 $", "Area : 780ft.", "Bathroom: 1", "Den: 1"]
  const Listings = [{
    id: 1,
    name: "Kijiji",
    data: '12-10-2023',
    price: '2000$',
    link: 'kijiji.ca'
  }, {
    id: 2,
    name: "Rentola",
    data: '12-13-2023',
    price: '2500$',
    link: 'Rentola.ca'
  }
  ]
  return (
    <>
      {/* {console.log("->", isPropertyClicked)} */}

      {isPropertyClicked &&
        isPropertyClicked.properties.BUILDING_ID ===
        feature.properties.BUILDING_ID && (
          <div className="popup">
            <div className="tile-header">
              <div className="tile-header-item title">
                <header>{"Park Victoria Appartments"}</header>

                <div className="idk">
                  <span>
                    <p>
                      <b>Address:</b> 6421 South park street, HALIFAX{" "}
                    </p>
                    <p>
                      <b>Total properties:</b> 1
                    </p>
                  </span>
                  <span>
                    <p>
                      <b>Total unit:</b> 52
                    </p>
                    <p>
                      <b>Avg. Price per foot:</b> CAD 20
                    </p>
                  </span>
                </div>
              </div>
              <div className="cancel-container">
                <p
                  className="cancel"
                  onClick={() => setIsPropertyClicked(null)}
                >
                  &#10060;
                </p>
              </div>
              {/* <span className="tile-header-item">CAD {feature.properties.BUILDING_ID}</span> */}
            </div>
            <div className="tile-content">
              <nav className="tile-content-nav">
                {unitType.map((unit) => (
                  <span
                    className={
                      active === unit
                        ? "content-nav-tab active"
                        : "content-nav-tab"
                    }
                    onClick={() => setActive(unit)}
                  >
                    {unit}
                  </span>
                ))}
              </nav>
              <div style={{ display: 'flex', padding: '0 10px', fontSize: 10 }}>
                <p>Amenities: </p>
                {amenitiesArray.map((amen) => (
                  <p style={{ padding: '0 5px' }}>{amen}</p>
                ))}</div>

              <span style={{ display: "flex", flexWrap: "wrap", width: "80%", marginLeft: "10%", fontSize: 10 }}>
                {parameters.map(para => {
                  return <p style={{ padding: "2px 10px", minWidth: "50%" }}>{para}</p>
                })}
              </span>
              <div className="abc">
                <div style={{ display: 'flex', justifyContent: 'space-evenly', borderBottom: "1px solid black" }}><span>{"Id"}</span> <span>{"Name"}</span><span>{"Data"}</span><span>{"Price"}</span><span>{"Link"}</span></div>
                {
                  Listings.map(list => <div style={{ display: 'flex', justifyContent: 'space-evenly', borderBottom: "1px solid black" }}><span style={{ width: '10%' }}>{list.id}</span> <span style={{ width: '10%' }}>{list.name}</span><span style={{ width: '15%' }}>{list.data}</span><span style={{ width: '10%' }}>{list.price}</span><span style={{ width: '10%' }}>{list.link}</span></div>)
                }
              </div>
            </div>
          </div>
        )}
      {!(isPropertyClicked != null) && (
        <button
          onClick={_onClick}
          className="marker"
          titlea={feature.properties.BUILDING_ID}
        >
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
  const [zoom, setZoom] = useState(11);
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
