import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import * as MdIcons from "react-icons/md";
import * as FaIcons from "react-icons/fa";
import * as PiIcons from "react-icons/pi";
import CustomHeader from '@components/ui/CustomHeader';
import { navigate } from '@utils/NavigationUtils';
import CategoryListSkeleton from './CategoryListSkeleton';
import NoConnectionScreen from '@components/common/NetworkHandler';
import { withNetworkHandlerWithHeader } from '@components/common/withNetworkHandler';
import { useCategoryStore } from '@state/categoryStore';

interface Props {
  isConnected?: boolean;
  onRetry?: () => void;
}

const BATCH_SIZE = 16;

const getWebIcon = (iconName: string, size = 26, color = "#fff") => {
  if (!iconName) return <MdIcons.MdCategory size={size} color={color} />;

  const formattedName =
    "Md" + iconName.charAt(0).toUpperCase() + iconName.slice(1).toLowerCase();

  if ((MdIcons as any)[formattedName]) {
    const IconComponent = (MdIcons as any)[formattedName];
    return <IconComponent size={size} color={color} />;
  }

  const faName =
    "Fa" + iconName.charAt(0).toUpperCase() + iconName.slice(1).toLowerCase();
  if ((FaIcons as any)[faName]) {
    const IconComponent = (FaIcons as any)[faName];
    return <IconComponent size={size} color={color} />;
  }

  const piName =
    "Pi" + iconName.charAt(0).toUpperCase() + iconName.slice(1).toLowerCase();
  if ((PiIcons as any)[piName]) {
    const IconComponent = (PiIcons as any)[piName];
    return <IconComponent size={size} color={color} />;
  }

  return <MdIcons.MdCategory size={size} color={color} />;
};

const CategoryList = ({ isConnected, onRetry }: Props) => {
  const { categories, loading, fetchCategories, reloadCategories } =
    useCategoryStore();

  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [numColumns, setNumColumns] = useState(2);

  // 🔥 Responsive Columns Logic
  useEffect(() => {
    const updateColumns = () => {
      const width = Dimensions.get('window').width;

      if (width >= 1060) setNumColumns(6);
      else if (width >= 890) setNumColumns(5);
      else if (width >= 720) setNumColumns(4);
      else if (width >= 560) setNumColumns(3);
      else setNumColumns(2);
    };

    updateColumns();
    const subscription = Dimensions.addEventListener('change', updateColumns);
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isConnected) fetchCategories();
  }, [isConnected]);

  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [categories]);

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={[styles.cardWrapper, { flex: 1 / numColumns }]}>
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => navigate(`/productcategory/${item.slug}`)}
        >
          {getWebIcon(item.icon, 22, "#fff")}

          <View style={styles.middle}>
            <Text style={styles.text}>{item.name}</Text>
          </View>

          <View style={styles.bottomRightIcon}>
            <MdIcons.MdChevronRight size={18} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <CustomHeader title="Categories" search />
      <View style={styles.container}>
        {!isConnected ? (
          <NoConnectionScreen onRetry={onRetry || reloadCategories} />
        ) : loading ? (
          <CategoryListSkeleton />
        ) : (
          <FlatList
            data={categories.slice(0, visibleCount)}
            numColumns={numColumns}
            key={numColumns} // 🔥 important for rerender
            keyExtractor={(item) => item.id || item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            onEndReached={() => {
              if (visibleCount < categories.length) {
                setVisibleCount(prev => prev + BATCH_SIZE);
              }
            }}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={() => (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>
                No Categories Found
              </Text>
            )}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: 10, flex: 1 },
  listContainer: { paddingHorizontal: 10 },

  cardWrapper: {
    padding: 5,
  },

  card: {
    backgroundColor: 'rgba(29, 29, 78, 0.8)',
    padding: 12,
    borderRadius: 12,
    height: 100,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },

  middle: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  bottomRightIcon: { alignSelf: 'flex-end' },

  text: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 6,
    textAlign: 'center',
  },
});

export default withNetworkHandlerWithHeader(CategoryList);