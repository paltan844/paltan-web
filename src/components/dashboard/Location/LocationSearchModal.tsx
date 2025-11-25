import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { 
  X,
  Search,
  MapPin,
  Clock,
  Crosshair,
} from "lucide-react";   // ✔ ONLY CHANGE

import axios from 'axios';
import { GOOGLE_MAP_API } from '@service/config';
import { getRecentLocations, addLocationToRecent, clearRecentLocations, RecentItem } from '@service/recentLocationStorage';

type Props = {
  visible: boolean;
  onClose: () => void;
  // Now allow optional geo object as third param for web details
  onSelectLocation: (placeId: string | undefined, description: string, geo?: { latitude: number; longitude: number }) => void;
  onUseCurrentLocation: () => void;
};

type PlaceItem = {
  description: string;
  place_id: string;
};

const LocationSearchModal: React.FC<Props> = ({ visible, onClose, onSelectLocation, onUseCurrentLocation }) => {
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState<PlaceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const autocompleteServiceRef = useRef<any>(null);
  const [recentLocations, setRecentLocations] = useState<RecentItem[]>([]);


  useEffect(() => {
    if (visible) {
      setRecentLocations(getRecentLocations());
    }
  }, [visible]);

  // helper: check if Google Maps JS Places is available
  const isMapsJsAvailable = () =>
    typeof window !== 'undefined' && (window as any).google && (window as any).google.maps && (window as any).google.maps.places;

  // fetchPlacePredictions: uses JS API on web; REST (axios) on native
  const fetchPlaces = async (text: string) => {
    if (!text || text.length < 3) {
      setPlaces([]);
      return;
    }

    setLoading(true);
    try {
      if (isMapsJsAvailable()) {
        // Use AutocompleteService (no CORS)
        if (!autocompleteServiceRef.current) {
          autocompleteServiceRef.current = new (window as any).google.maps.places.AutocompleteService();
        }

        autocompleteServiceRef.current.getPlacePredictions(
          { input: text, componentRestrictions: { country: 'in' }, types: ['geocode'] },
          (predictions: any[], status: any) => {
            if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && predictions) {
              const results = predictions.map(p => ({ description: p.description, place_id: p.place_id }));
              setPlaces(results);
            } else {
              setPlaces([]);
            }
            setLoading(false);
          }
        );
      } else {
        // Native / fallback -> REST API (works in RN)
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
          params: {
            input: text,
            key: GOOGLE_MAP_API,
            components: 'country:in',
          },
        });
        setPlaces(response.data.predictions || []);
        setLoading(false);
      }
    } catch (err) {
      console.error('Place fetch error', err);
      setPlaces([]);
      setLoading(false);
    }
  };

  // When user selects a prediction:
  // - On web: fetch place details via PlacesService.getDetails to get lat/lng
  // - On native: just return place_id and description (caller can call place/details REST if needed)
  const handleSelect = async (item: { description: string; place_id?: string }) => {
    addLocationToRecent(item);

    if (isMapsJsAvailable() && item.place_id) {
      // Get details using PlacesService
      try {
        // create an offscreen div for PlacesService
        const div = document.createElement('div');
        const service = new (window as any).google.maps.places.PlacesService(div);

        service.getDetails({ placeId: item.place_id }, (placeResult: any, status: any) => {
          if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && placeResult?.geometry?.location) {
            const lat = placeResult.geometry.location.lat();
            const lng = placeResult.geometry.location.lng();
            onSelectLocation(item.place_id, item.description, { latitude: lat, longitude: lng });
          } else {
            // fallback: no geometry -> return without geo
            onSelectLocation(item.place_id, item.description);
          }
          onClose();
        });
      } catch (e) {
        // something failed with JS PlacesService -> fallback
        console.warn('PlacesService.getDetails failed', e);
        onSelectLocation(item.place_id, item.description);
        onClose();
      }
    } else {
      // native or no JS API available — return place_id & description
      onSelectLocation(item.place_id, item.description);
      onClose();
    }
  };

  useEffect(() => {
    // debounce-like: call fetch when query changes and >=3 chars
    const id = setTimeout(() => {
      if (query.length >= 3) fetchPlaces(query);
      else setPlaces([]);
    }, 250);
    return () => clearTimeout(id);
  }, [query]);



  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#000" />
          </TouchableOpacity>

          <Text style={styles.header}>Change delivery location</Text>

          {/* Search Row */}
          <View style={styles.searchRow}>
            <Search size={20} color="#888" />
            <TextInput
              placeholder="Search for a new area, locality..."
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => { setQuery(''); setPlaces([]); }}>
                <X size={18} color="#888" />
              </TouchableOpacity>
            )}
          </View>

          {/* Use Current Location */}
          {query.length < 3 && (
            <>
              <TouchableOpacity style={styles.useLocationBtn} onPress={onUseCurrentLocation}>
                <Crosshair size={18} color="#00BA3C" />
                <Text style={styles.useLocationText}>  Use current location</Text>
              </TouchableOpacity>

              {recentLocations.length > 0 ? (
                <>
                  <View style={styles.recentHeaderRow}>
                    <Text style={styles.recentHeader}>Recently searched</Text>
                    <TouchableOpacity onPress={() => { clearRecentLocations(); setRecentLocations([]); }}>
                      <Text style={{ color: 'red' }}>Clear All</Text>
                    </TouchableOpacity>
                  </View>

                  {recentLocations.map((loc, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.itemRow}
                      onPress={() => handleSelect(loc)}
                    >
                      <Clock size={20} color="#666" />
                      <Text style={styles.itemText}>  {loc.description}</Text>
                    </TouchableOpacity>
                  ))}
                </>
              ) : (
                <View>
                  <Text style={styles.recentHeader}>Recently searched</Text>
                  <Text style={{ textAlign: 'center', color: '#888', marginTop: 8 }}>No recent searches</Text>
                </View>
              )}
            </>
          )}

          {/* Search Results */}
          {loading ? (
            <ActivityIndicator size="small" color="#00BA3C" style={{ marginTop: 20 }} />
          ) : (
            query.length >= 3 && (
              <FlatList
                data={places}
                keyExtractor={(item, index) => item.place_id + index}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.itemRow} onPress={() => handleSelect(item)}>
                    <MapPin size={24} color="#FF5C5C" />
                    <View style={{ marginLeft: 10 }}>
                      <Text style={styles.itemTitle}>{item.description.split(',')[0]}</Text>
                      <Text style={styles.itemSubtitle}>{item.description}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.noResult}>No locations found</Text>}
              />
            )
          )}

        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 20,
    maxHeight: '80%',
    minHeight: '70%',
  },
  closeButton: {
    position: 'absolute',
    top: -25,
    alignSelf: 'center',
    backgroundColor: 'rgba(225,225,225,1)',
    borderRadius: 20,
    padding: 5,
    elevation: 2,
  },
  header: { fontSize: 16, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  searchInput: {
  flex: 1,
  marginLeft: 8,
  outlineStyle: 'none',
  borderWidth: 0,
  backgroundColor: 'transparent',
},

  useLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7F9EE',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  useLocationText: { color: '#00BA3C', fontWeight: '600' },
  recentHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  recentHeader: { fontWeight: 'bold', marginBottom: 8, fontSize: 14 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  itemText: { fontSize: 14, color: '#333' },
  itemTitle: { fontSize: 15, fontWeight: '600' },
  itemSubtitle: { fontSize: 13, color: '#666' },
  noResult: { textAlign: 'center', marginTop: 20, color: '#888' },
});

export default LocationSearchModal;
