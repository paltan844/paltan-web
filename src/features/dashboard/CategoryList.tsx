import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
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

/* ✅ Universal Icon Resolver — auto-detects from react-icons */
const getWebIcon = (iconName: string, size = 26, color = "#fff") => {
  if (!iconName) return <MdIcons.MdCategory size={size} color={color} />;

  const formattedName =
    "Md" + iconName.charAt(0).toUpperCase() + iconName.slice(1).toLowerCase();

  // Try Material Icons
  if ((MdIcons as any)[formattedName]) {
    const IconComponent = (MdIcons as any)[formattedName];
    return <IconComponent size={size} color={color} />;
  }

  // Try FontAwesome Icons
  const faName =
    "Fa" + iconName.charAt(0).toUpperCase() + iconName.slice(1).toLowerCase();
  if ((FaIcons as any)[faName]) {
    const IconComponent = (FaIcons as any)[faName];
    return <IconComponent size={size} color={color} />;
  }

  // Try Phosphor Icons (Pi)
  const piName =
    "Pi" + iconName.charAt(0).toUpperCase() + iconName.slice(1).toLowerCase();
  if ((PiIcons as any)[piName]) {
    const IconComponent = (PiIcons as any)[piName];
    return <IconComponent size={size} color={color} />;
  }

  // Default fallback
  return <MdIcons.MdCategory size={size} color={color} />;
};

const CategoryList = ({ isConnected, onRetry }: Props) => {
  const { categories, loading, fetchCategories, reloadCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories(); // Run once
  }, []);

  useEffect(() => {
    if (isConnected) fetchCategories();
  }, [isConnected]);

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isLastOddItem = categories.length % 2 !== 0 && index === categories.length - 1;
    return (
      <View style={[styles.cardWrapper, isLastOddItem && { flex: 0.487 }]}>
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
onPress={() => {
  console.log("Navigating category:", item);
  navigate(`/productcategory/${item.id}`);
}}

        >
          {/* ✅ Auto icon */}
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
            data={categories}
            numColumns={2}
            key={'2-cols'}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>No Categories Found</Text>
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
  cardWrapper: { flex: 0.487, marginBottom: 10 },
  card: {
    backgroundColor: 'rgba(29, 29, 78, 0.8)',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 90,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  middle: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bottomRightIcon: { alignSelf: 'flex-end', marginTop: 'auto' },
  text: { color: '#fff', fontSize: 13, fontWeight: '500', marginTop: 6, textAlign: 'center' },
});

export default withNetworkHandlerWithHeader(CategoryList);



{/*
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
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

/* ✅ Universal Icon Resolver — auto-detects from react-icons /
const getWebIcon = (iconName: string, size = 26, color = "#fff") => {
  if (!iconName) return <MdIcons.MdCategory size={size} color={color} />;

  const formattedName =
    "Md" + iconName.charAt(0).toUpperCase() + iconName.slice(1).toLowerCase();

  // Try Material Icons
  if ((MdIcons as any)[formattedName]) {
    const IconComponent = (MdIcons as any)[formattedName];
    return <IconComponent size={size} color={color} />;
  }

  // Try FontAwesome Icons
  const faName =
    "Fa" + iconName.charAt(0).toUpperCase() + iconName.slice(1).toLowerCase();
  if ((FaIcons as any)[faName]) {
    const IconComponent = (FaIcons as any)[faName];
    return <IconComponent size={size} color={color} />;
  }

  // Try Phosphor Icons (Pi)
  const piName =
    "Pi" + iconName.charAt(0).toUpperCase() + iconName.slice(1).toLowerCase();
  if ((PiIcons as any)[piName]) {
    const IconComponent = (PiIcons as any)[piName];
    return <IconComponent size={size} color={color} />;
  }

  // Default fallback
  return <MdIcons.MdCategory size={size} color={color} />;
};

const CategoryList = ({ isConnected, onRetry }: Props) => {
  const { categories, loading, fetchCategories, reloadCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories(); // Run once
  }, []);

  useEffect(() => {
    if (isConnected) fetchCategories();
  }, [isConnected]);

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isLastOddItem = categories.length % 2 !== 0 && index === categories.length - 1;
    return (
      <View style={[styles.cardWrapper, isLastOddItem && { flex: 0.487 }]}>
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => {
            navigate('/productcategory', { category: item });
          }}
        >
          {/* ✅ Auto icon /}
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
            data={categories}
            numColumns={2}
            key={'2-cols'}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>No Categories Found</Text>
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
  cardWrapper: { flex: 0.487, marginBottom: 10 },
  card: {
    backgroundColor: 'rgba(29, 29, 78, 0.8)',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 90,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  middle: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bottomRightIcon: { alignSelf: 'flex-end', marginTop: 'auto' },
  text: { color: '#fff', fontSize: 13, fontWeight: '500', marginTop: 6, textAlign: 'center' },
});

export default withNetworkHandlerWithHeader(CategoryList);  */}
