import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import { GOOGLE_MAP_API } from "@service/config";

type LatLng = { latitude: number; longitude: number };

const quadraticBezierCurve = (p1: number[], p2: number[], controlPoint: number[], numPoints = 100) => {
  const points: { lat: number; lng: number }[] = [];
  const step = 1 / (numPoints - 1);
  for (let i = 0; i < numPoints; i++) {
    const t = i * step;
    const x = (1 - t) ** 2 * p1[0] + 2 * (1 - t) * t * controlPoint[0] + t ** 2 * p2[0];
    const y = (1 - t) ** 2 * p1[1] + 2 * (1 - t) * t * controlPoint[1] + t ** 2 * p2[1];
    points.push({ lat: x, lng: y });
  }
  return points;
};

const calculateControlPoint = (p1: number[], p2: number[]) => {
  const d = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
  if (d === 0) return [p1[0], p1[1]];
  const scale = 0.7; // tune curvature
  const x_m = (p1[0] + p2[0]) / 2;
  const y_m = (p1[1] + p2[1]) / 2;
  // perpendicular vector
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const nx = -dy / d;
  const ny = dx / d;
  // control point offset
  const offset = d * scale * 0.3;
  return [x_m + nx * offset, y_m + ny * offset];
};

const getBezierPointsFromPlaces = (places: LatLng[]) => {
  if (!Array.isArray(places) || places.length < 2) return [];
  const p1 = [places[0].latitude, places[0].longitude];
  const p2 = [places[1].latitude, places[1].longitude];
  const controlPoint = calculateControlPoint(p1, p2);
  return quadraticBezierCurve(p1, p2, controlPoint, 120);
};

const toGoogleLatLng = (p: { lat: number; lng: number }) => new google.maps.LatLng(p.lat, p.lng);

const DeliveryTrackingMap = ({
  pickupLocation,
  deliveryLocation,
  deliveryPersonLocation,
  deliveryIconUrl = "/assets/icons/delivery.png",
  pickupIconUrl = "/assets/icons/store.png",
  dropIconUrl = "/assets/icons/my_pin.png",
}: {
  pickupLocation?: LatLng;
  deliveryLocation?: LatLng;
  deliveryPersonLocation?: LatLng;
  deliveryIconUrl?: string;
  pickupIconUrl?: string;
  dropIconUrl?: string;
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const markersRef = useRef<{ pickup?: google.maps.Marker; drop?: google.maps.Marker; rider?: google.maps.Marker }>({});
  const polylinesRef = useRef<{ directions?: google.maps.Polyline; bezier?: google.maps.Polyline }>({});
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  // animate state
  const animationRef = useRef<number | null>(null);
  const prevRiderPosRef = useRef<google.maps.LatLng | null>(null);

  const [mapReady, setMapReady] = useState(false);
  const [isRouting, setIsRouting] = useState(false);

  // initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!window.google || !google.maps) {
      console.error("Google Maps JS API not loaded.");
      return;
    }

    const centerLat = deliveryLocation?.latitude ?? pickupLocation?.latitude ?? 28.6139;
    const centerLng = deliveryLocation?.longitude ?? pickupLocation?.longitude ?? 77.2090;

    const map = new google.maps.Map(mapContainerRef.current, {
      center: { lat: centerLat, lng: centerLng },
      zoom: 14,
      clickableIcons: false,
      disableDefaultUI: false,
    });

    mapRef.current = map;
    setMapReady(true);

    return () => {
      // cleanup if needed
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      mapRef.current = null;
    };
    // run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // create/update markers
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    // pickup marker
    if (pickupLocation?.latitude && pickupLocation?.longitude) {
      if (!markersRef.current.pickup) {
        markersRef.current.pickup = new google.maps.Marker({
          position: { lat: pickupLocation.latitude, lng: pickupLocation.longitude },
          map: mapRef.current,
          icon: { url: pickupIconUrl, scaledSize: new google.maps.Size(44, 44) },
          title: "Pickup",
        });
      } else {
        markersRef.current.pickup.setPosition({ lat: pickupLocation.latitude, lng: pickupLocation.longitude });
      }
    } else {
      markersRef.current.pickup?.setMap(null);
      markersRef.current.pickup = undefined;
    }

    // drop marker
    if (deliveryLocation?.latitude && deliveryLocation?.longitude) {
      if (!markersRef.current.drop) {
        markersRef.current.drop = new google.maps.Marker({
          position: { lat: deliveryLocation.latitude, lng: deliveryLocation.longitude },
          map: mapRef.current,
          icon: { url: dropIconUrl, scaledSize: new google.maps.Size(44, 44) },
          title: "Delivery",
        });
      } else {
        markersRef.current.drop.setPosition({ lat: deliveryLocation.latitude, lng: deliveryLocation.longitude });
      }
    } else {
      markersRef.current.drop?.setMap(null);
      markersRef.current.drop = undefined;
    }

    // rider marker (create if not)
    if (deliveryPersonLocation?.latitude && deliveryPersonLocation?.longitude) {
      if (!markersRef.current.rider) {
        markersRef.current.rider = new google.maps.Marker({
          position: { lat: deliveryPersonLocation.latitude, lng: deliveryPersonLocation.longitude },
          map: mapRef.current,
          icon: { url: deliveryIconUrl, scaledSize: new google.maps.Size(48, 48) },
          title: "Delivery Person",
          optimized: false,
        });
        prevRiderPosRef.current = markersRef.current.rider.getPosition()!;
      } else {
        // animate to new position
        animateMarkerSmooth(markersRef.current.rider, deliveryPersonLocation);
      }
    } else {
      markersRef.current.rider?.setMap(null);
      markersRef.current.rider = undefined;
    }

    // If both pickup & delivery exist, draw route + bezier
    if (pickupLocation && deliveryLocation) {
      drawDirectionsAndBezier(pickupLocation, deliveryLocation);
    } else {
      // clear polylines if missing
      polylinesRef.current.directions?.setMap(null);
      polylinesRef.current.bezier?.setMap(null);
      polylinesRef.current = {};
    }

    // fit bounds to show all markers
    fitToBounds();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, pickupLocation?.latitude, pickupLocation?.longitude, deliveryLocation?.latitude, deliveryLocation?.longitude, deliveryPersonLocation?.latitude, deliveryPersonLocation?.longitude]);

  // Animate marker smoothly between current marker position and new coords
  const animateMarkerSmooth = (marker: google.maps.Marker | undefined, to: LatLng) => {
    if (!marker) return;
    const fromLatLng = marker.getPosition();
    if (!fromLatLng) {
      marker.setPosition({ lat: to.latitude, lng: to.longitude });
      return;
    }
    const toLatLng = new google.maps.LatLng(to.latitude, to.longitude);
    const duration = 900; // ms
    const start = performance.now();
    const startLat = fromLatLng.lat();
    const startLng = fromLatLng.lng();
    const deltaLat = to.latitude - startLat;
    const deltaLng = to.longitude - startLng;

    const step = (now: number) => {
      const elapsed = Math.min(1, (now - start) / duration);
      const ease = easeInOutCubic(elapsed);
      const curLat = startLat + deltaLat * ease;
      const curLng = startLng + deltaLng * ease;
      marker.setPosition({ lat: curLat, lng: curLng });
      if (elapsed < 1) {
        animationRef.current = requestAnimationFrame(step);
      } else {
        marker.setPosition(toLatLng);
        animationRef.current = null;
      }
    };

    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(step);
  };

  const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  // Fit map to markers and polylines (like fitToCoordinates)
  const fitToBounds = () => {
    if (!mapRef.current) return;
    const bounds = new google.maps.LatLngBounds();
    let any = false;

    [markersRef.current.pickup, markersRef.current.drop, markersRef.current.rider].forEach((m) => {
      if (m && m.getPosition()) {
        bounds.extend(m.getPosition()!);
        any = true;
      }
    });

    if (polylinesRef.current.directions && polylinesRef.current.directions.getPath()?.getLength()) {
      polylinesRef.current.directions.getPath().forEach((p: any) => bounds.extend(p));
      any = true;
    }

    if (any) {
      mapRef.current.fitBounds(bounds, 100);
    }
  };

  // Draw driving route via DirectionsService AND bezier dotted polyline
  const drawDirectionsAndBezier = async (pickup: LatLng, delivery: LatLng) => {
    if (!mapRef.current) return;
    setIsRouting(true);

    // 1) DirectionsService -> polyline path
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: { lat: pickup.latitude, lng: pickup.longitude },
        destination: { lat: delivery.latitude, lng: delivery.longitude },
        travelMode: google.maps.TravelMode.DRIVING,
        drivingOptions: { departureTime: new Date() },
      },
      (response, status) => {
        setIsRouting(false);
        if (status === "OK" && response) {
          // clear old directions polyline
          polylinesRef.current.directions?.setMap(null);

          const routePath: google.maps.LatLngLiteral[] = [];
          const legs = response.routes[0].overview_path || [];
          legs.forEach((pt: any) => routePath.push({ lat: pt.lat(), lng: pt.lng() }));

          const directionsPolyline = new google.maps.Polyline({
            path: routePath,
            strokeColor: "#2871F2",
            strokeOpacity: 1.0,
            strokeWeight: 5,
            map: mapRef.current,
            zIndex: 5,
          });

          polylinesRef.current.directions = directionsPolyline;

          // Fit bounds to route
          const bounds = new google.maps.LatLngBounds();
          routePath.forEach((p) => bounds.extend(p));
          if (markersRef.current.pickup?.getPosition()) bounds.extend(markersRef.current.pickup!.getPosition()!);
          if (markersRef.current.drop?.getPosition()) bounds.extend(markersRef.current.drop!.getPosition()!);
          mapRef.current!.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
        } else {
          console.warn("Directions request failed:", status);
        }
      }
    );

    // 2) Draw a red dotted bezier curve between pickup & delivery (visual flair)
    polylinesRef.current.bezier?.setMap(null);
    const bezierPoints = getBezierPointsFromPlaces([pickup, delivery]).map((p) => ({ lat: p.lat, lng: p.lng }));
    const bezierPolyline = new google.maps.Polyline({
      path: bezierPoints,
      strokeColor: "#FF3B30",
      strokeOpacity: 0.9,
      strokeWeight: 3,
      map: mapRef.current,
      zIndex: 3,
      icons: [
        {
          icon: {
            path: "M 0,-1 0,1",
            strokeOpacity: 1,
            scale: 4,
          },
          offset: "0",
          repeat: "12px",
        },
      ],
    });
    polylinesRef.current.bezier = bezierPolyline;
  };

  // reverse geocode helper (optional)
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: { latlng: `${lat},${lng}`, key: GOOGLE_MAP_API },
      });
      const r = res.data.results?.[0];
      return r?.formatted_address || "";
    } catch (e) {
      return "";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Live Delivery Tracking</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              // center to all points
              fitToBounds();
            }}
          >
            <Text style={styles.btnText}>Fit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <div ref={(el) => (mapContainerRef.current = el)} id="delivery-map" style={styles.mapDiv as any} />

      <View style={styles.bottomInfo}>
        <Text style={{ fontWeight: "600" }}>
          {deliveryPersonLocation ? "Rider live location" : "Waiting for rider..."}
        </Text>
        <Text style={{ color: "#444" }}>
          Pickup: {pickupLocation ? `${pickupLocation.latitude.toFixed(5)}, ${pickupLocation.longitude.toFixed(5)}` : "—"}
        </Text>
        <Text style={{ color: "#444" }}>
          Drop: {deliveryLocation ? `${deliveryLocation.latitude.toFixed(5)}, ${deliveryLocation.longitude.toFixed(5)}` : "—"}
        </Text>
      </View>
    </View>
  );
};

const styles: { [k: string]: any } = StyleSheet.create({
  container: { width: "100%", height: "100%", flex: 1, backgroundColor: "#fff" },
  headerRow: { padding: 12, borderBottomWidth: 1, borderColor: "#eee", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 16, fontWeight: "700" },
  btn: { backgroundColor: "#0078AA", padding: 8, borderRadius: 6 },
  btnText: { color: "#fff", fontWeight: "700" },
  mapDiv: { width: "100%", height: "72vh", backgroundColor: "#ddd" },
  bottomInfo: { padding: 12, borderTopWidth: 1, borderColor: "#eee" },
});

export default DeliveryTrackingMap;
