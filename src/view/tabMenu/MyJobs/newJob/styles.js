import { StyleSheet, Dimensions } from 'react-native';
import { Fonts } from '../../../../config/font';

const newjobstyles = StyleSheet.create({
    rateBtnUnSelect: { backgroundColor: '#ffffff' , borderRadius: 5, height: 30, width: 60 , justifyContent: 'center', borderColor: '#999999', borderWidth: 1, },
    rateBtnUnSelectText : { color: '#999999' ,fontSize: 13, fontFamily: Fonts.GilroyLight, textAlign: 'center' },
    rateBtnSelected: { backgroundColor: '#2ee5b5', borderRadius: 5, height: 30, width: 60, justifyContent: 'center', },
    rateBtnSelectedText: { color: '#ffffff', fontSize: 13, fontFamily: Fonts.GilroyLight, textAlign: 'center' },
    labelText: {
        fontSize: 12,
        color: '#AAB2BD',
        fontFamily: Fonts.MontserratMedium,
    },
    detailText: {
        flex: 8, 
        fontFamily: Fonts.MontserratBold,
        marginBottom: 10, 
        marginTop: 5, 
        color: '#414253',  
        fontSize: 15,
    },
    viewArea: {
        // flex: 1, 
        width: '30%',
        alignItems: 'flex-start', 
        alignContent: 'flex-start', 
        alignSelf: 'flex-start',
        marginRight: 10,
    },
    viewAreaWide: {
      // flex: 1, 
      width: '35%',
      alignItems: 'flex-start', 
      alignContent: 'flex-start', 
      alignSelf: 'flex-start',
      marginRight: 10,
  },
    viewArea2: {
        flex: 2, 
        alignItems: 'flex-start', 
        alignContent: 'flex-start', 
        alignSelf: 'flex-start',
        marginRight: 10,
    },
    viewSubArea: {
        width: (Dimensions.get('window').width  * 0.25),
        borderBottomColor: '#E6E9ED',
        borderBottomWidth: 1, 
        paddingRight: 10
    },
    viewSubArea2: {
        width: (Dimensions.get('window').width  * 0.32),
        borderBottomColor: '#E6E9ED',
        borderBottomWidth: 1, 
        paddingRight: 10,
        // backgroundColor: 'yellow'
    },
    totalLabel: {
        fontSize: 18,
        color: '#414253',
        fontFamily: Fonts.MontserratMedium,
    },
    totalValue: {
        fontSize: 18,
        color: '#414253',
        fontFamily: Fonts.MontserratBold,
    },
    buttonText: {
        color: '#fff', 
        fontFamily: Fonts.MontserratBold, 
        fontSize: 18,
        justifyContent: 'center',
    },
    buttonSmallText: {
        color: '#fff', 
        fontFamily: Fonts.MontserratMedium, 
        fontSize: 12,
    },
    signUpBtnArea: {
        width: (Dimensions.get('window').width - 45),
        height: 56,
        backgroundColor: '#00D9A6',
        borderColor: '#00D9A6',
        alignItems: 'center',
        alignSelf: 'center', 
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 10,
      },
      shortBtnArea: {
        width: (Dimensions.get('window').width * 0.65),
        height: 56,
        backgroundColor: '#00D9A6',
        borderColor: '#00D9A6',
        alignItems: 'center',
        alignSelf: 'center', justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 10,
      },
      overlayHeading: {
        color: '#414253', 
        fontFamily: Fonts.MontserratBold, 
        fontSize: 18,
      },
      practiceOptionLabel: {
        color: '#414253', 
        fontFamily: Fonts.MontserratBold, 
        fontSize: 13,
        paddingLeft: 5
      },
      practiceOptionHead: {
        color: '#AAB2BD', 
        fontFamily: Fonts.MontserratMedium, 
        fontSize: 12,
        paddingLeft: 5
      },
      overlayBtnArea: {
        width: (Dimensions.get('window').width - 70),
        height: 56,
        backgroundColor: '#00D9A6',
        borderColor: '#00D9A6',
        alignItems: 'center',
        alignSelf: 'center', justifyContent: 'center',
        borderWidth: 1,
        // paddingBottom: 10,
        // paddingTop: 10,
        borderRadius: 10,
        // shadowColor: '#CEFDF2',
        // shadowOpacity: 0.3,
        // elevation: 8,
        // shadowRadius: 20,
        // shadowOffset: { width: 0, height: 5 },
      },
      postedByName: {
        alignItems: 'flex-start', 
        alignContent: 'flex-start', 
        alignSelf: 'flex-start', 
        justifyContent: 'flex-start', 
        color: '#414253', 
        fontFamily: Fonts.MontserratBold, 
        fontSize: 15, 
        // paddingTop: 15, 
        paddingLeft: 8
      },
      postedByEmail: {
        alignItems: 'flex-start', 
        alignContent: 'flex-start', 
        alignSelf: 'flex-start', 
        justifyContent: 'center', 
        color: '#AAB2BD', 
        fontFamily: Fonts.MontserratMedium, 
        fontSize: 15, 
        paddingVertical: 10, 
        paddingLeft: 8
      },
      postedByCount: {
        alignItems: 'flex-start', 
        alignContent: 'flex-start', 
        alignSelf: 'flex-start', 
        justifyContent: 'center', 
        color: '#1F89E4', 
        fontFamily: Fonts.MontserratMedium, 
        fontSize: 13, 
        paddingHorizontal: 20,
        paddingVertical: 5,
        backgroundColor: '#D6ECFF',
        borderRadius: 20
      },
      postedByBtnArea: {
        width: ((Dimensions.get('window').width * 0.5) - 50),
        height: 50,
        backgroundColor: '#fff',
        borderColor: '#00D3A1',
        alignItems: 'center',
        alignSelf: 'center', justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 10,
        borderRadius: 12
      },
      postedByButtonText: {
        color: '#00D3A1', 
        fontFamily: Fonts.MontserratBold, 
        fontSize: 13,
        justifyContent: 'center',
    },
    optionOverlayText: {
      color: '#AAB2BD', 
      fontSize: 18, 
      fontFamily: Fonts.MontserratBold, 
      marginLeft: 20, 
      marginTop: 6
    },
    optionOverlayRow: {
      flexDirection: 'row', 
      width: '100%', 
      paddingTop: 15,
      paddingBottom:10, 
      marginTop:10, 
      borderBottomWidth:1, 
      borderBottomColor:'#F5F7FA'
    },
    calendarText: { 
        flex: 1, 
        justifyContent: 'center', 
        color: '#AAB2BD',      
        fontSize: 15,
        fontFamily: Fonts.MontserratMedium,
        paddingTop: 7
    },
    calendarSelectedText: { 
        flex: 1, 
        color: '#414253',
        fontSize: 15,
        fontFamily: Fonts.MontserratMedium,
        paddingTop: 7
    },
});


export { newjobstyles };
