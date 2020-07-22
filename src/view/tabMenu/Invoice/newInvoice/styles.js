import { StyleSheet, Dimensions, Platform } from 'react-native';
import { Fonts } from '../../../../config/font';

const newinvoicestyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    labelText: {
        fontSize: 13,
        color: '#AAB2BD',
        fontFamily: Fonts.MontserratMedium,
    },
    textInput: {
        left:0,
        height:30,
        // marginBottom: 30,        
        color: '#414253',
        fontFamily: Fonts.MontserratBold,
        fontSize: 15,
        // borderStyle: 'solid',
        // borderBottomWidth:1,
        // borderBottomColor:'#E6E9ED',
        alignItems: 'flex-start',
        justifyContent:'center',
        // paddingBottom:10,
        paddingLeft: 0,
        paddingTop:0
    },
    inputLabelBlack: {
        paddingTop: 11, 
        fontFamily: Fonts.MontserratMedium, 
        fontSize: 18,
        color: '#142828',
        paddingBottom: Platform.OS === 'ios' ? 42 : 38,
        paddingLeft:5,
        justifyContent: 'flex-start',
    },

});


export { newinvoicestyles };
