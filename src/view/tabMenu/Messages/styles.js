import { StyleSheet, Dimensions } from 'react-native';
import { Fonts } from '../../../config/font';

const messageStyles = StyleSheet.create({
    container: {
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    bodyContainer: {
        alignItems: 'center',
        alignContent: 'center',
        // paddingHorizontal: 5,
    },
    headerContainer: {
        // flex: 1,    
    },
    contentContainer: {
        // flex: 15,    
    },
    headerText: {
        color: '#142828',
        fontFamily: Fonts.RubikMedium,
        fontSize: 25,
        alignItems: 'center',
        alignSelf: 'center', justifyContent: 'center',
        paddingTop: 15,
    },
    messageRow: {
        // paddingHorizontal: 15,
        flexDirection: 'row',
        // width: (Dimensions.get('window').width - 30), 
    },
    photoArea: {
        width: '20%',
        alignContent: 'flex-start'
    },
    messageArea: {
        width: '60%',
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
    },
    dateArea: {
        width: '20%',
        alignContent: 'flex-end',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
    },
    hrLine: {
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#E6E9ED',
        marginTop: 15,
        marginBottom: 10,
    },
    listName: {
        fontFamily: Fonts.MontserratExtraBold,
        color: '#414253',
        fontSize: 13,
        paddingLeft: 10
    },
    listDescription: {
        paddingTop: 5,
        fontFamily: Fonts.MontserratMedium,
        color: '#414253',
        fontSize: 13,
        paddingLeft: 10
    },
    listPractice: {
        paddingTop: 5,
        fontFamily: Fonts.MontserratMedium,
        color: '#AAB2BD',
        fontSize: 12,
        paddingLeft: 10
    },
    listDate: {
        fontFamily: Fonts.MontserratBold,
        color: '#AAB2BD',
        fontSize: 11
    },
    inputMessages: {
        width: '100%',
        height:40,       
        color: '#000000',
        fontFamily: Fonts.MontserratMedium,
        fontStyle: 'italic',
        fontSize: 13,
        alignItems: 'flex-start',
        borderRadius: 10,
    },
    unread:{
        fontFamily: Fonts.MontserratBold,
        fontSize: 13,
        color: '#ffffff',
        marginTop: 5,
        marginBottom: 5,
    }

});


export { messageStyles };
