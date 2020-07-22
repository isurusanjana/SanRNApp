import { StyleSheet, Dimensions } from 'react-native';
import {Fonts} from '../../../config/font';

const invoicestyles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerContainer: {
        // flex: 1,    
        backgroundColor: 'red'
    },
    contentContainer: {
        // flex: 15,    
        backgroundColor: 'yellow'
    },
    headerText: {
        color: '#142828',
        fontFamily: Fonts.MontserratBold, 
        fontSize: 20,
        alignItems: 'center',
        alignSelf: 'center', 
        justifyContent: 'center',
        alignContent: 'center',
        paddingTop: 15,
    },
    tabBarUnderlineStyle: {
        backgroundColor : '#ffffff',
        borderWidth: 0
    },
    tabActiveTextStyle: {
        color : '#2ee5b5'
    },
    tabTextStyle: {
        color : 'black'
    },
    tabTabStyle: {
        backgroundColor : 'white',
        margin: 0,
        padding: 0,
    },
    tabActiveTabStyle: {
        backgroundColor : 'white'
    },

    reverseHeaderArrowBack: { fontSize: 20, color: '#000000', marginLeft: 15, justifyContent: 'center', alignItems: 'flex-start', alignContent: 'flex-start', alignSelf: 'flex-start', },

    reverseHeaderTitle : {  color: '#414253',
    fontFamily: Fonts.MontserratBold,
    fontSize: 18,
    alignSelf: 'flex-start', 
    justifyContent: 'center',
    paddingTop: 15, },

});


export { invoicestyles };
