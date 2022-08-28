import React from "react";
import GoogleMapReact from "google-map-react";
import pin from "../images/pin.png";
import { Link } from "react-router-dom";

const markerStyle = {
    position: "absolute",
    top: "100%",
    left: "50%",
    transform: "translate(-50%, -100%)"
};

function Map(props) {
    
    return (
        <GoogleMapReact
            bootstrapURLKeys={{
                key: "AIzaSyDRl4Y5B6kBTaxZMz-sUnrbcr5XPNcrS3c"
            }}
            defaultCenter={props.center}
            defaultZoom={props.zoom}
            center={props.center}
        >
            {
                props.locations.map(item => {
                    return (
                        <Link to={item.Region} key={Math.random().toString()} lat={item.Latitude} lng={item.Longitude}>
                            <div className="frequency">{item.Frequency}</div>
                            <img style={markerStyle} src={pin} alt="pin" />
                        </Link>
                    );
                })
            }
        </GoogleMapReact>
    );

}

export default Map;
