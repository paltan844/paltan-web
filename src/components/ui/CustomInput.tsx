import { Colors, Fonts } from '@utils/Constants';
import {FC} from 'react';
import { StyleSheet,TextInput, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import  Icon  from 'react-native-vector-icons/Ionicons';
import React from 'react';

interface InputProps{
    left: React.ReactNode;
    onClear?: () => void;
    right?: boolean;

}
const CustomInput:
FC<InputProps & React.ComponentProps<typeof TextInput>>
= ({
    onClear,
    left,
    right = true,
    ...props
})=>{
return (
<View style={styles.flexRow}>
{left}
<TextInput
{...props}
autoCorrect={false}
spellCheck={false}
style={styles.inputContainer}
 placeholderTextColor="#ccc"
  />
  <View style={styles.icon}>
    {props.value?.length !== 0 && right &&
    <TouchableOpacity onPress={onClear}>
        <Icon name="close-circle-sharp" size={RFValue(20)} color="#ccc" />
    </TouchableOpacity>
    }

  </View>
</View>

);
};
const styles = StyleSheet.create({
    text: {
        width: '10%',
        marginLeft:10,

    },
    flexRow:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        borderRadius: 7,
        borderWidth: 1.1,
        width: '100%',
        marginVertical:10,
        shadowOffset:{width:1,height:1},
        shadowOpacity:0.6,
        shadowRadius:2,
        shadowColor: Colors.border,
        borderColor: 'red',
    },
    inputContainer:{
        color:'white',
        width: '70%',
        alignSelf:'center',
        alignItems:'center',
        justifyContent:'center',
        fontFamily: Fonts.SemiBold,
        fontSize: RFValue(13),
        bottom: -2,
    },
    icon: {
        width: 55,
        alignItems:'center',
        justifyContent:'center',
    },
});

export default CustomInput;
