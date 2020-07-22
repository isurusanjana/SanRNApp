import { StyleSheet, Dimensions } from 'react-native';
import { Fonts } from '../../config/font';
const win = Dimensions.get('window');
const headerHeight = 100;

const emptyStateStyle = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: win.width,  
        height: '100%', 
        position: 'absolute', 
        top: 123.15 - headerHeight
        
    },
    title: {
        fontSize: 18,
        color: '#142828',
        fontFamily: Fonts.RubikMedium,
        paddingTop: 30,
        paddingBottom: 10,
    },
    message: {
        // width: 290px;
        // height: 72px;
        fontSize: 15,
        lineHeight: 25,
        color: '#aeb6b7',
        fontFamily: Fonts.Rubik,
        textAlign: 'center',
        paddingLeft: 25,
        paddingRight: 25,
    }
});

export default emptyStateStyle;