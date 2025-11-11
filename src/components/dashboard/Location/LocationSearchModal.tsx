import React, { useState, useEffect } from 'react';
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { GOOGLE_MAP_API } from '@service/config';
import { getRecentLocations, addLocationToRecent, clearRecentLocations } from '@service/recentLocationStorage';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (placeId: string | undefined, description: string) => void;
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
  const [recentLocations, setRecentLocations] = useState<string[]>([]);

  const fetchPlaces = async (text: string) => {
    setLoading(true);
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
        params: {
          input: text,
          key: GOOGLE_MAP_API,
          components: 'country:in',
        },
      });
      setPlaces(response.data.predictions || []);
    } catch (err) {
      console.error('Place fetch error', err);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item: { description: string; place_id?: string }) => {
    addLocationToRecent(item.description);
    onSelectLocation(item.place_id, item.description);
    onClose();
  };

  useEffect(() => {
    if (visible) {
      setRecentLocations(getRecentLocations());
    }
  }, [visible]);

  useEffect(() => {
    if (query.length >= 3) {fetchPlaces(query);}
    else {setPlaces([]);}
  }, [query]);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color="#000" />
          </TouchableOpacity>

          <Text style={styles.header}>Change delivery location</Text>

          <View style={styles.searchRow}>
            <Icon name="magnify" size={20} color="#888" />
            <TextInput
              placeholder="Search for a new area, locality..."
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Icon name="close-circle" size={18} color="#888" />
              </TouchableOpacity>
            )}
          </View>

          {query.length < 3 && (
            <>
              <TouchableOpacity style={styles.useLocationBtn} onPress={onUseCurrentLocation}>
                <Icon name="crosshairs-gps" size={18} color="#00BA3C" />
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
                      onPress={() => handleSelect({ description: loc })}
                    >
                      <Icon name="history" size={20} color="#666" />
                      <Text style={styles.itemText}>  {loc}</Text>
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

          {loading ? (
            <ActivityIndicator size="small" color="#00BA3C" style={{ marginTop: 20 }} />
          ) : (
            query.length >= 3 && (
              <FlatList
                data={places}
                keyExtractor={(item, index) => item.place_id + index}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.itemRow} onPress={() => handleSelect(item)}>
                    <Icon name="map-marker-outline" size={24} color="#FF5C5C" />
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
  searchInput: { flex: 1, marginLeft: 8 },
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
