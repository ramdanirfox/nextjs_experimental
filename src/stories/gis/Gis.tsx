import React, { useRef, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { Map, Source, Layer, Popup } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { NavigationControl } from "@vis.gl/react-maplibre";
import { locations } from "./data";

const legendItems = [
    { name: "Executive", icon: "/icons/EXECUTIVE.png" },
    { name: "Premium", icon: "/icons/PREMIUM.png" },
    { name: "Basic", icon: "/icons/BASIC.png" },
    { name: "Regular", icon: "/icons/REGULAR.png" },
    { name: "Economy", icon: "/icons/ECONOMY.png" },
];

//FUNGSI MENGHITUNG JUMLAH CLASS
const getCategoryCounts = () => {
    return locations.reduce((acc, loc) => {
        acc[loc.class] = (acc[loc.class] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
};

const categoryCounts = getCategoryCounts();

export const Legend: React.FC<{ onToggle: (category: string) => void, visibleCategories: string[] }> = ({ onToggle, visibleCategories }) => {
    return (
        <div style={styles.container}>
            <h4 style={styles.title}>Legend</h4>
            {legendItems.map((item) => {
                const isActive = visibleCategories.includes(item.name.toUpperCase());

                return (
                    <div
                        key={item.name}
                        style={{
                            ...styles.item,
                            opacity: isActive ? 1 : 0.5,
                            textDecoration: isActive ? "none" : "line-through",
                            cursor: "pointer"
                        }}
                        onClick={() => onToggle(item.name.toUpperCase())}
                    >
                        <img src={item.icon} alt={item.name} style={styles.icon} />
                        <span style={styles.text}>
                            {item.name} ({categoryCounts[item.name.toUpperCase()] || 0})
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

const styles = {
    container: {
        position: "absolute",
        bottom: "20px",
        left: "20px",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: "10px",
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "flex-start",
        gap: "5px",
        width: "160px",
    },
    title: {
        fontSize: "15px",
        textAlign: "center" as const,
        width: "100%",
        borderBottom: "1px solid black",
        paddingBottom: "5px",
        marginBottom: "5px",
    },
    item: {
        display: "flex",
        alignItems: "center",
        gap: "20px", 
        padding: "5px",
        width: "100%",
    },
    icon: {
        width: "24px",
        height: "24px",
    },
    text: {
        fontSize: "14px",
    },
};


const containerStyle = {
    width: "100%",
    height: "100vh",
};

// const center = {
//     lat: -6.31756093677504, // Koordinat Braincode
//     lng: 106.81471580649472,
// };

const getLabel = (className: string): string => {
    switch (className.toUpperCase()) {
        case "EXECUTIVE": return "E";
        case "PREMIUM": return "P";
        case "BASIC": return "B";
        case "REGULAR": return "R";
        case "ECONOMY": return "EC";
        default: return "?";
    }
};
const geojson = {
    type: "FeatureCollection",
    features: locations.map((loc) => ({
        type: "Feature",
        properties: {
            name: loc.name,
            class: loc.class,
            label: getLabel(loc.class),
        },
        geometry: {
            type: "Point",
            coordinates: [loc.longitude, loc.latitude],
        },
    })),
};

const loadMapIcons = (map) => {
    legendItems.forEach(item => {
      const img = new Image();
      img.src = item.icon;
      img.onload = () => {
        map.addImage(item.name.toUpperCase(), img);
      };
    });
  };

  const markerStyle = {
    id: "marker",
    type: "symbol",
    layout: {
        "icon-image": ["get", "class"],
        "icon-size": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0, 0.26,
            22, 0.26
        ],
        "icon-allow-overlap": true,
        // Mengubah anchor point ke center agar posisi lebih presisi
        "icon-anchor": "center",
        "icon-pitch-alignment": "viewport",
        "icon-rotation-alignment": "viewport",
        "icon-ignore-placement": true,
        // Menambahkan text-field untuk menampilkan koordinat
        "text-field": [
            "concat",
            ["to-string", ["get", "label"]],
            "\n",
            ["number-format", ["get", "latitude"], { "maximumFractionDigits": 6 }],
            ", ",
            ["number-format", ["get", "longitude"], { "maximumFractionDigits": 6 }]
        ],
        "text-anchor": "top",
        "text-offset": [0, 1], // Menggeser text ke bawah icon
        "text-size": 12,
        "text-allow-overlap": true
    },
    paint: {
        "text-color": "#000000",
        "text-halo-color": "#ffffff",
        "text-halo-width": 2
    }
};


const labelStyle = {
    id: "marker-label",
    type: "symbol",
    layout: {
        "text-field": ["get", "label"], // Ambil label dari properti geojson
        "text-size": 12,
        "text-offset": [0, 0.6], // Geser sedikit ke atas
        "text-anchor": "top",
    },
    paint: {
        "text-color": "#000000",
        "text-halo-color": "#ffffff",
        "text-halo-width": 2,
    },
};

// Komponen React Google Maps dengan Marker & InfoWindow
export const GisGoogleMap: React.FC = () => {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    });

    const mapRef = useRef<google.maps.Map | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<typeof locations[0] | null>(null);
    const [visibleCategories, setVisibleCategories] = useState<string[]>([
        "EXECUTIVE", "PREMIUM", "REGULAR", "BASIC", "ECONOMY"
    ]);

    // Fungsi untuk mendapatkan URL icon berdasarkan class
    const getIconUrl = (className: string): string => {
        const icon = legendItems.find(item => item.name.toUpperCase() === className.toUpperCase());
        return icon ? icon.icon : '';
    };

    const customMarkerOptions = (location: typeof locations[0]): google.maps.MarkerOptions => {
        return {
            position: { lat: location.latitude, lng: location.longitude },
            icon: {
                url: getIconUrl(location.class),
                scaledSize: new google.maps.Size(20, 20), // Ukuran icon
                anchor: new google.maps.Point(12, 12), // Titik tengah icon
            },
            title: location.name // Akan muncul saat hover
        };
    };

    const toggleCategory = (category: string) => {
        setVisibleCategories(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
    };

    const onLoad = (map: google.maps.Map) => {
        mapRef.current = map;

        const bounds = new google.maps.LatLngBounds();
        bounds.extend({ lat: 6.5, lng: 95.0 });
        bounds.extend({ lat: -11.0, lng: 141.0 });
        map.fitBounds(bounds);
    };

    return isLoaded ? (
        <div style={{ position: "relative" }}>
            <GoogleMap 
                mapContainerStyle={containerStyle} 
                onLoad={onLoad}
                options={{
                    styles: [
                        {
                            featureType: "poi",
                            elementType: "labels",
                            stylers: [{ visibility: "off" }]
                        }
                    ]
                }}
            >
                {locations
                    .filter(loc => visibleCategories.includes(loc.class))
                    .map((location, index) => (
                        <Marker
                            key={index}
                            {...customMarkerOptions(location)}
                            onClick={() => setSelectedLocation(location)}
                        />
                    ))}
                
                {selectedLocation && (
                    <InfoWindow
                        position={{
                            lat: selectedLocation.latitude,
                            lng: selectedLocation.longitude
                        }}
                        onCloseClick={() => setSelectedLocation(null)}
                    >
                        <div>
                            <h4>{selectedLocation.name}</h4>
                            <p>Class: {selectedLocation.class}</p>
                            <p>Koordinat: {selectedLocation.latitude}, {selectedLocation.longitude}</p>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
            <Legend onToggle={toggleCategory} visibleCategories={visibleCategories} />
        </div>
    ) : (
        <p>Loading Google Map...</p>
    );
};

// Komponen MapLibre dengan Marker & Popup
export const GisMaplibre: React.FC = () => {
    const [visibleCategories, setVisibleCategories] = useState<string[]>(legendItems.map((item) => item.name.toUpperCase()));

    const toggleCategory = (category: string) => {
        setVisibleCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };
    const visibleLocations = locations.filter(loc => 
        visibleCategories.includes(loc.class)
    );

    const filteredGeojson = {
        ...geojson,
        features: geojson.features.filter((feature) =>
            visibleCategories.includes(feature.properties.class.toUpperCase())
        ),
    };
    const handleMapLoad = (event) => {
        loadMapIcons(event.target);
    };

    return (
        <Map
            minZoom={4} 
            onLoad={handleMapLoad}
            initialViewState={{
                // longitude: center.lng,
                // latitude: center.lat,
                zoom: 5,
                bounds: [[95, -11], [141, 6]],
                fitBoundsOptions: { padding: 10 }
            }}
            style={containerStyle}
            mapStyle="https://demotiles.maplibre.org/style.json"
        >
            <Source id="marker-source" type="geojson" data={filteredGeojson}>
                <Layer {...markerStyle} />
                {/* <Layer {...labelStyle} /> */}
            </Source>

            <NavigationControl position="bottom-right" showCompass={true} />
            <Legend onToggle={toggleCategory} visibleCategories={visibleCategories} />
        </Map>
    );
};
