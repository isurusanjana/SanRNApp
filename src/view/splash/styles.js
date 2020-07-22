import { Platform, StyleSheet, NativeModules } from 'react-native';
const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;
import { Fonts } from '../../config/font';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#4496E4'
    },
    img: {
        flex: 1,
        alignSelf: 'stretch',        
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    details: {
        fontSize: 26,       
        fontFamily: Fonts.MontserratBold,
        position: 'absolute',
        top: 170 - STATUSBAR_HEIGHT,
        left: 57,
        width: 267,
        height: 142,
        color: 'white'
    },
    appVersion: {
        color: 'white', 
        bottom: 20,
        textAlign: 'center',
        fontSize: 13
    }
});


export default styles;