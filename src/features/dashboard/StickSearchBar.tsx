
import { StyleSheet } from 'react-native';
import { FC }  from 'react';
import {  useCollapsibleContext } from '@r0b0t3d/react-native-collapsible';
import { Colors } from '@utils/Constants';
import { interpolate, useAnimatedStyle} from 'react-native-reanimated';



const StickSearchBar:FC = () => {

       const { scrollY } = useCollapsibleContext();

    const opacity = useAnimatedStyle(()=>{
        const opacity = interpolate(scrollY.value,[100, 140],[0,0], 'clamp');
        return {opacity};
    });



        return (
        
    );
};

const styles = StyleSheet.create({
    text:{
        paddingHorizontal:120,
        paddingTop:1,
    },
    texts:{
        flex:0,
        paddingHorizontal:120,
        paddingTop:1,
    },
    shadow:{
    
        zIndex:60,
        width:'100%',
        borderBottomWidth:1,
        borderBlockColor: Colors.border,
    },
});
export default StickSearchBar;
