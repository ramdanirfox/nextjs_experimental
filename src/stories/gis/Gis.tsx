import React, { useState } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { Map, Source, Layer, Popup } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { NavigationControl } from "@vis.gl/react-maplibre";

const containerStyle = {
    width: "100%",
    height: "100vh",
};

const center = {
    lat: -6.31756093677504, // Koordinat Braincode
    lng: 106.81471580649472,
};

const geojson = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [center.lng, center.lat],
            },
        },
    ],
};

const markerStyle = {
    id: "marker",
    type: "circle",
    paint: {
        "circle-radius": 6,
        "circle-color": "#FF0000",
    },
};

// Komponen React Google Maps dengan Marker & InfoWindow
export const GisGoogleMap: React.FC = () => {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string, // Pastikan API key ada di .env.local
    });

    const [infoOpen, setInfoOpen] = useState(false);

    return isLoaded ? (
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
            <Marker position={center} onClick={() => setInfoOpen(true)} />
            {infoOpen && (
                <InfoWindow position={center} onCloseClick={() => setInfoOpen(false)}>
                    <div>
                        <h4>Braincode</h4>
                        <p>Koordinat: {`${center.lat}, ${center.lng}`}</p>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    ) : (
        <p>Loading Google Map...</p>
    );
};

// Komponen MapLibre dengan Marker & Popup
export const GisMaplibre: React.FC = () => {
    const [popupInfo, setPopupInfo] = useState<{ longitude: number; latitude: number } | null>(null);
    const handleZoom = (event) => {
        if (event.viewState.zoom < 4) {
            event.target.setZoom(4); 
        }
    };
    return (
        <Map
            initialViewState={{
                longitude: center.lng,
                latitude: center.lat,
                zoom: 5,
                bounds: [[95, -11], [141, 6]],
                fitBoundsOptions: { padding: 10 }
            }}
            style={containerStyle}
            mapStyle="https://demotiles.maplibre.org/style.json"
            onZoom={handleZoom}
            onClick={(e) => setPopupInfo({ longitude: e.lngLat.lng, latitude: e.lngLat.lat })}
        >
            <Source id="marker-source" type="geojson" data={geojson}>
                <Layer {...markerStyle} />
            {popupInfo && (
                <Popup longitude={popupInfo.longitude} latitude={popupInfo.latitude} closeButton={true} onClose={() => setPopupInfo(null)}>
                    <div>
                        <h4>Braincode</h4>
                        <p>Koordinat: {`${center.lat}, ${center.lng}`}</p>
                    </div>
                </Popup>
            )}
            </Source>

            <NavigationControl position="bottom-right" showCompass={true} />
        </Map>
    );
};
