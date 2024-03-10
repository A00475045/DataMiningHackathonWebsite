import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from "react-dom";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1IjoicmFuaml0dHR0dCIsImEiOiJjbHRreDZqNm0xOGc2MnJwYTVxMG5qcTBzIn0.zY3DpiT5B_8bYwGTz7iFIA';

const Marker = ({ onClick, children, feature }) => {
  const [mouseOnPoint, setMouseOnPoint] = useState(false);
  const _onClick = () => {
    // onClick(feature);
    setMouseOnPoint(true)
    // console.log(feature.Title);
  };
  const amenitiesArray = Object.keys(feature.Amenities).map(key => (
    { name: key, value: feature.Amenities[key] }
  ));

  return (<>
    {/* onMouseLeave={() => setMouseOnPoint(false) }*/}
    {/* onMouseLeave={() => setTimeout(() => setMouseOnPoint(false), [2000])} */}
    {mouseOnPoint && <div className='cancel-container' onClick={() => setMouseOnPoint(false)}><p className='cancel'>&#10060;</p></div>}
    {mouseOnPoint && <div className='popup'  >
      <div className='tile-header'><span className='tile-header-item title'>{feature.Title}</span>
        <span className='tile-header-item'>CAD {feature.Price}</span>

      </div>
      <div className='tile-content'>
        {/* {console.log(amenitiesArray)} */}

        {/* { */}
        {/* // Object.keys(feature.Amenities).map(key =>  */}
        {/* // return (<div>{amen} {amen ? "&#10004;" : "&#10060;"}</div>))} */}
        {amenitiesArray.map((amen) => (<div className='amenities-tile'><p>{amen.name}</p> <p>{amen.value ? '\u2705' : '\u274C'}</p></div>))}
      </div>

    </div>}
    {!mouseOnPoint && <button onClick={_onClick} className="marker">
      {children}
    </button>}
  </>
  );
};

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-63.6098533);
  const [lat, setLat] = useState(44.6532031);
  const [zoom, setZoom] = useState(14.24);


  const obj = [
    {
      "Title": "2 Bedroom Apartment for Rent - 211, 221 Glenforest Drive",
      "Price": 300,
      "Location": "221 Glenforest Drive, Halifax, NS, B3M 1J3",

      "lat": 44.6537,
      "lon": -63.6096,
      "Amenities": {
        "pool": true,
        "parking": false,
        "utilities-included": true
      }
    }, {
      "Title": "B",
      "Price": 200,
      "Location": "221 Glenforest Drive, Halifax, NS, B3M 1J3",
      "lat": 44.6520,
      "lon": -63.6119,
      "Amenities": {
        "pool": false,
        "parking": false,
        "utilities-included": true
      }
    },
  ]

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });

    map.current.on('move', () => {
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
        <Marker feature={o} >

        </Marker>,
        ref.current
      );


      return (new mapboxgl.Marker(ref.current).setLngLat([o.lon, o.lat]).addTo(map.current))
    }
    )


  });

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
