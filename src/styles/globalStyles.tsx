import { StyleSheet } from 'react-native';


export const hocStyles = StyleSheet.create({

    cartcontainer:{
        width:'100%',
        bottom:0,
        position:'absolute',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
       elevation:10,
       shadowOffset:{width:1,height:1},
       shadowRadius:5,
       shadowOpacity:0.3,
       backgroundColor:'rgba(255, 252, 252, 1)',
       borderRadius:5,
       borderColor:'rgba(17, 17, 17, 0.3)',
       borderWidth:0.5,
    },
});
