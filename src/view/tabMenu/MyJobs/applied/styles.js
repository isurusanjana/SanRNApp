import { StyleSheet, Dimensions } from 'react-native';
import { Fonts } from '../../../../config/font';

const appliedJobStyles = StyleSheet.create({

    titleText: {
        fontSize: 18, 
        fontFamily: Fonts.Rubik, 
        textAlignVertical: 'bottom', 
        color: '#142828',  
        textAlign: 'left'
    },
});


export { appliedJobStyles };