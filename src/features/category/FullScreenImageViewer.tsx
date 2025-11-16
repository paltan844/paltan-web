/*
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Modal,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

interface FullScreenImageViewerProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

const FullScreenImageViewer: React.FC<FullScreenImageViewerProps> = ({
  images,
  initialIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = useRef<FlatList>(null);
  const imageSliderRef = useRef<FlatList>(null);

  useEffect(() => {
    scrollToIndexSafe(currentIndex);
  }, [currentIndex]);

  const scrollToIndexSafe = (index: number) => {
    try {
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
      imageSliderRef.current?.scrollToIndex({
        index,
        animated: true,
      });
    } catch (err) {
      console.warn('scrollToIndex failed', err);
    }
  };

  const getItemLayout = (_: any, index: number) => ({
    length: width,
    offset: width * index,
    index,
  });

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <Pressable style={styles.closeBtn} onPress={onClose}>
          <Icon name="close" size={30} color="#fff" />
        </Pressable>

        <FlatList
          ref={imageSliderRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => `full-image-${index}`}
          initialScrollIndex={initialIndex}
          getItemLayout={getItemLayout}
          onScrollToIndexFailed={({ index }) => {
            setTimeout(() => {
              scrollToIndexSafe(index);
            }, 500);
          }}
          onViewableItemsChanged={onViewableItemsChanged.current}
          viewabilityConfig={viewConfigRef.current}
          renderItem={({ item }) => (
            <View style={styles.fullImageWrapper}>
              <Image source={{ uri: item }} style={styles.fullImage} />
            </View>
          )}
        />

        <View style={styles.thumbnailContainer}>
          <FlatList
            ref={flatListRef}
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => `thumb-${index}`}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            renderItem={({ item, index }) => {
              const isActive = index === currentIndex;
              return (
                <TouchableOpacity onPress={() => setCurrentIndex(index)} activeOpacity={0.8}>
                  <Image
                    source={{ uri: item }}
                    style={[
                      styles.thumbnailImage,
                      isActive && styles.activeThumbnail,
                    ]}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(52, 50, 50, 0.99)',
    justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  fullImageWrapper: {
    width: width,
    height: height * 0.75,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(54, 51, 51, 0.65)',
  },
  fullImage: {
    width: width * 0.96,
    height: height * 0.9,
    resizeMode: 'contain',
  },
  thumbnailContainer: {
    position: 'absolute',
    bottom: 40,
  },
  thumbnailImage: {
    width: 100,
    height: 100,
    marginHorizontal: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeThumbnail: {
    borderColor: 'red',
    borderWidth: 3,
  },
});

export default FullScreenImageViewer;  */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Modal,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Pressable,
} from 'react-native';

import { X } from "lucide-react";   // <-- NEW ICON

const { width, height } = Dimensions.get('window');

interface FullScreenImageViewerProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

const FullScreenImageViewer: React.FC<FullScreenImageViewerProps> = ({
  images,
  initialIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = useRef<FlatList>(null);
  const imageSliderRef = useRef<FlatList>(null);

  useEffect(() => {
    scrollToIndexSafe(currentIndex);
  }, [currentIndex]);

  const scrollToIndexSafe = (index: number) => {
    try {
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
      imageSliderRef.current?.scrollToIndex({
        index,
        animated: true,
      });
    } catch (err) {
      console.warn('scrollToIndex failed', err);
    }
  };

  const getItemLayout = (_: any, index: number) => ({
    length: width,
    offset: width * index,
    index,
  });

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        
        {/* CLOSE BUTTON TOP RIGHT */}
        <Pressable style={styles.closeBtn} onPress={onClose}>
          <X size={24} color="#fff" strokeWidth={2.5} />
        </Pressable>

        {/* MAIN FULLSCREEN SLIDER */}
        <FlatList
          ref={imageSliderRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => `full-image-${index}`}
          initialScrollIndex={initialIndex}
          getItemLayout={getItemLayout}
          onScrollToIndexFailed={({ index }) => {
            setTimeout(() => {
              scrollToIndexSafe(index);
            }, 500);
          }}
          onViewableItemsChanged={onViewableItemsChanged.current}
          viewabilityConfig={viewConfigRef.current}
          renderItem={({ item }) => (
            <View style={styles.fullImageWrapper}>
              <Image source={{ uri: item }} style={styles.fullImage} />
            </View>
          )}
        />

        {/* THUMBNAILS BELOW */}
        <View style={styles.thumbnailContainer}>
          <FlatList
            ref={flatListRef}
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => `thumb-${index}`}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            renderItem={({ item, index }) => {
              const isActive = index === currentIndex;
              return (
                <TouchableOpacity onPress={() => setCurrentIndex(index)} activeOpacity={0.8}>
                  <Image
                    source={{ uri: item }}
                    style={[
                      styles.thumbnailImage,
                      isActive && styles.activeThumbnail,
                    ]}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
   backgroundColor: 'rgba(52, 50, 50, 0.99)',
    justifyContent: 'center',
  },

  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 20,
    padding: 10,
  },

  fullImageWrapper: {
    width: width,
    height: height * 0.75,
    justifyContent: 'center',
    alignItems: 'center',
  },

  fullImage: {
    width: width * 0.96,
    height: height * 0.9,
    resizeMode: 'contain',
  },

  thumbnailContainer: {
    position: 'absolute',
    bottom: 40,
  },

  thumbnailImage: {
    width: 95,
    height: 95,
    marginHorizontal: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  activeThumbnail: {
    borderColor: '#ff4444',
    borderWidth: 3,
  },
});

export default FullScreenImageViewer;

