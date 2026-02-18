import { useEffect, useRef, useState } from "react";
import "./MapModal.css";
import closeIcon from "../../assets/close.svg"

const MapModal = ({ onClose, onSelectLocation }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markerRef = useRef(null);
    const placesRef = useRef(null);
    const geocoderRef = useRef(null);

    const [keyword, setKeyword] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");

    useEffect(() => {
        if (!window.kakao || !window.kakao.maps) return;

        window.kakao.maps.load(() => {
            const kakao = window.kakao;

            const container = mapRef.current;
            const options = {
                center: new kakao.maps.LatLng(36.0190, 129.3435),
                level: 3,
            };

            const map = new kakao.maps.Map(container, options);
            mapInstance.current = map;

            const marker = new kakao.maps.Marker({ map });
            markerRef.current = marker;

            const places = new kakao.maps.services.Places();
            placesRef.current = places;

            const geocoder = new kakao.maps.services.Geocoder();
            geocoderRef.current = geocoder;

            kakao.maps.event.addListener(map, "click", function (mouseEvent) {
                const latlng = mouseEvent.latLng;

                marker.setPosition(latlng);

                geocoder.coord2Address(
                    latlng.getLng(),
                    latlng.getLat(),
                    function (result, status) {
                        if (status === kakao.maps.services.Status.OK) {
                            const address =
                                result[0].road_address?.address_name ||
                                result[0].address.address_name;

                            setSelectedAddress(address);
                        }
                    }
                );
            });
        });
    }, []);

    const handleSearch = () => {
        if (!keyword.trim()) return;

        placesRef.current.keywordSearch(keyword, (data, status) => {
            if (status !== window.kakao.maps.services.Status.OK) return;
            setSearchResults(data);
        });
    };

    const moveToPlace = (place) => {
        const kakao = window.kakao;

        const latlng = new kakao.maps.LatLng(place.y, place.x);

        mapInstance.current.setCenter(latlng);
        markerRef.current.setPosition(latlng);

        setSelectedAddress(place.road_address_name || place.address_name);
    };

    return (
        <div className="map-modal-backdrop" onClick={onClose}>
            <div className="map-modal" onClick={(e) => e.stopPropagation()}>

                <div className="map-modal-header">
                    <span>위치 선택</span>
                    <img src={closeIcon} onClick={onClose}/>
                </div>

                <div className="map-search">
                    <input
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="장소 검색 (체육관, 학교 등)"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch();
                        }}
                    />
                    <button onClick={handleSearch}>검색</button>
                </div>

                {searchResults.length > 0 && (
                    <ul className="map-search-result">
                        {searchResults.map((item) => (
                            <li
                                key={item.id}
                                onClick={() => moveToPlace(item)}
                            >
                                <div className="place-name">{item.place_name}</div>
                                <div className="place-address">
                                    {item.road_address_name || item.address_name}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <div ref={mapRef} className="map-container" />

                <div className="map-footer">
                    <span>{selectedAddress || "지도를 클릭하거나 검색하여 위치를 선택하세요."}</span>
                    <button
                        disabled={!selectedAddress}
                        onClick={() => {
                            onSelectLocation(selectedAddress);
                            onClose();
                        }}
                    >
                        선택
                    </button>
                </div>

            </div>
        </div>
    );
};

export default MapModal;
