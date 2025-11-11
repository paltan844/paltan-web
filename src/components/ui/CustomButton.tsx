import React from 'react';
import { Colors, Fonts } from '@utils/Constants';
import {FC} from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import CustomText from './CustomText';

interface CustomButtonProps {
    onPress:()=> void;
    title: string;
    disable: boolean;
    loading: boolean;
}
const CustomButton:
FC<CustomButtonProps>
= ({
    onPress,
    title,
    disable,
    loading,
})=>{  return(
<TouchableOpacity
onPress={onPress}
disabled={disable}
activeOpacity={0.8}
style={[styles.btn,{
    backgroundColor: disable ? Colors.disabled : Colors.secondary,
}]}
>
    {loading ?
 <ActivityIndicator color="white" size="small"/> :
 <CustomText variant="h6" style={styles.text} fontFamily={Fonts.SemiBold}>
{title}
 </CustomText>
}

</TouchableOpacity>
);
};
const styles = StyleSheet.create({
   btn:{
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    width: '100%',
   },

    text: {
color: '#fff',
    },
    });

export default CustomButton;
