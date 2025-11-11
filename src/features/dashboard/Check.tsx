import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '@utils/Constants';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';

const SearchBar: React.FC = () => {
    const navigation = useNavigation();
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8}
    onPress={() => navigation.navigate('SearchScreen', { startSearch: true })}
   >
        <Icon name="search" color={Colors.text} size={RFValue(17)} />
              <View style={styles.divider}/>

              <TouchableOpacity
    onPress={()=>{

      navigation.navigate('SearchScreen', { startMic: true});
    }}
   >
              <Icon name="mic"  color={Colors.text} size={RFValue(17)} />
          </TouchableOpacity>
          </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container:{
    backgroundColor:'#F3F4F7',
    borderColor:Colors.border,
    marginHorizontal:5,
    paddingHorizontal:10,
   flexDirection:'row',
   overflow:'hidden',
    alignItems:'center',
    justifyContent:'space-between',
   borderRadius: 10,
   borderWidth:0.6,
   height:25,
   marginVertical:2,
   marginBottom:6,

  },
  textcontainer: {
    width: 1,
    flex:1,
    height: 25,
    paddingLeft:10,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor:'#ddd',
    marginHorizontal:10,
  },
});
export default SearchBar;
