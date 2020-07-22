import { StyleSheet, Dimensions } from 'react-native';
import { Fonts } from '../../../config/font';

const myjobstyles = StyleSheet.create({
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
        color: '#414253',
        fontFamily: Fonts.MontserratBold,
        fontSize: 18,
        alignSelf: 'flex-start', 
        justifyContent: 'center',
        paddingTop: 15,
    }

});


export { myjobstyles };
