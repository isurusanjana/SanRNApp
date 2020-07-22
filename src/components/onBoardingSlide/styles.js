import { StyleSheet } from 'react-native';
import { Fonts } from '../../config/font';

const slideStyles = StyleSheet.create({ 
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    textHeader: {
        textAlign: 'center',
        fontSize: 15,
        color: '#142828',
        fontFamily: Fonts.RubikMedium,
    },
    textDescription: {
        textAlign: 'center',
        lineHeight: 22,
        fontSize: 15,
        paddingTop: 10,
        paddingBottom: 5,
        color: '#aeb6b7',
        paddingLeft: 65,
        paddingRight: 65,
        fontFamily: Fonts.Rubik,
    },
    imgView: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',        
    },
    img:{
        flex: 1,        
        marginLeft: '20%',
        resizeMode: 'contain'
    }
});

export default slideStyles;