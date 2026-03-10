/*
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomText from '@components/ui/CustomText';
import { RFValue } from 'react-native-responsive-fontsize';
import { navigate } from '@utils/NavigationUtils';
import { useNavigationState } from '@react-navigation/native';

const tabs = [
  { name: 'Home', icon: 'home-outline', route: 'ProductDashboard' },
  { name: 'Categories', icon: 'grid-outline', route: 'CategoryList' },
  { name: 'Cart', icon: 'cart-outline', route: 'Kart' },
  { name: 'Profile', icon: 'person-outline', route: 'Profile' },
];

const BottomTabs = () => {
  const currentRoute = useNavigationState(state => {
    const route = state.routes[state.index];
    return route.name;
  });

  const selectedTab = (() => {
    const tab = tabs.find(t => t.route === currentRoute);
    return tab ? tab.name : '';
  })();

  return (
    <View style={styles.container}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.name}
          activeOpacity={0.8}
          onPress={() => navigate(tab.route)}
          style={styles.tab}
        >
          <Icon
            name={tab.icon}
            size={22}
            color={selectedTab === tab.name ? 'rgb(239, 217, 18)' : 'white'}
          />
          <CustomText fontSize={RFValue(10)} style={{ color: selectedTab === tab.name ? 'rgb(239, 217, 18)' : 'white' }}>
            {tab.name}
          </CustomText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgb(4, 35, 62)',
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 999,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BottomTabs;
*/


import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomText from '@components/ui/CustomText';
import { RFValue } from 'react-native-responsive-fontsize';
import { navigate } from '@utils/NavigationUtils';
import { useNavigationState } from '@react-navigation/native';

const tabs = [
  { name: 'Home', icon: 'home-outline', route: 'ProductDashboard' },
  { name: 'Categories', icon: 'grid-outline', route: 'CategoryList' },
  { name: 'Cart', icon: 'cart-outline', route: 'Kart' },
  { name: 'Profile', icon: 'person-outline', route: 'Profile' },
];

const BottomTabs = () => {
  const width = Dimensions.get('window').width;
  const isLargeDevice = width >= 768;

  const currentRoute = useNavigationState(state => {
    const route = state.routes[state.index];
    return route.name;
  });

  const selectedTab =
    tabs.find(t => t.route === currentRoute)?.name || '';

  const iconSize = isLargeDevice ? 260 : 220;
  const tabHeight = isLargeDevice ? 7000 : 6000;
  const fontSize = isLargeDevice ? RFValue(102) : RFValue(100);

  return (
    <View style={[styles.container, { height: tabHeight }]}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.name}
          activeOpacity={0.8}
          onPress={() => navigate(tab.route)}
          style={styles.tab}
        >
          <Icon
            name={tab.icon}
            size={iconSize}
            color={
              selectedTab === tab.name
                ? 'rgb(239, 217, 18)'
                : 'white'
            }
          />

          <CustomText
            fontSize={fontSize}
            style={{
              color:
                selectedTab === tab.name
                  ? 'rgb(239, 217, 18)'
                  : 'white',
            }}
          >
            {tab.name}
          </CustomText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgb(4, 35, 62)',
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 999,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BottomTabs;