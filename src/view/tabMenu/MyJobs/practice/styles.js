import { StyleSheet, Dimensions, Platform } from 'react-native';
import { Fonts } from '../../../../config/font';

const practiceStyles = StyleSheet.create({
    headerArrowBack: { fontSize: 30, color: '#ffffff', justifyContent: 'center', alignItems: 'flex-start', alignContent: 'flex-start', alignSelf: 'flex-start', },
    reverseHeaderArrowBack: { fontSize: 30, color: '#000000', marginLeft: 15, justifyContent: 'center', alignItems: 'flex-start', alignContent: 'flex-start', alignSelf: 'flex-start', },
    headerTitle : { alignContent: 'flex-start', alignItems: 'flex-start', paddingRight: 15, color: '#ffffff', fontSize: 18, fontFamily: Fonts.MontserratBold},
    reverseHeaderTitle : { textAlign: 'center', color: '#000000', fontSize: 18, fontFamily: Fonts.MontserratBold , justifyContent: 'center', alignItems: 'flex-start', alignContent: 'flex-start', alignSelf: 'flex-start', },
    // input: {
    //     left:0,
    //     // height:25,        
    //     color: '#142828',
    //     fontFamily: Fonts.Rubik,
    //     fontSize: 12,
    //     borderStyle: 'solid',
    //     borderBottomWidth:1,
    //     borderBottomColor:'#f2f3f7',
    //     alignItems: 'flex-start',
    //     width: '90%'
    // },
    // input: {
    //     left:0,
    //     // height:30,
    //     marginBottom: 15, 
    //     // paddingTop: 5,       
    //     color: '#142828',
    //     fontFamily: Fonts.RubikMedium,
    //     fontSize: 22,
    //     // borderStyle: 'solid',
    //     // borderBottomWidth:1,
    //     // borderBottomColor:'#f2f3f7',
    //     alignItems: 'flex-start',
    //     width: '90%'
    // },

    input: {
        left:0,
        height:30,
        // marginBottom: 30,        
        color: '#414253',
        fontFamily: Fonts.MontserratMedium,
        fontSize: 15,
        borderStyle: 'solid',
        // borderBottomWidth:1,
        borderBottomColor:'#E6E9ED',
        alignItems: 'flex-start',
        justifyContent:'center',
      //   backgroundColor: 'red',
      //   padding: 0,
        paddingBottom:1,
        paddingLeft: 0,
        paddingTop:0
    },
    
    imageDisplayContainer: {
        // backgroundColor: '#ffffff', 
        // justifyContent: 'center' , 
        // flexDirection: 'row', 
        // alignContent: 'center',
        // alignSelf: 'center' , 
        // alignItems: 'center',  
        // width: (Dimensions.get('window').width) * 0.9, 
        // height: 70, 
        // position: 'absolute',
        // borderRadius: 30,
        // marginTop: 60,
        elevation: 20,
        shadowColor: 'black',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 5
    },
    practiceBody: {
        backgroundColor : 'yellow'
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
      
    practiceBottom: {
        paddingTop: (Dimensions.get('window').height) * 0.7,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    }, 
    textHeader: {
        fontSize: 22,
        fontFamily: Fonts.Rubik,
        paddingTop: 20,
        paddingBottom: 30,
        color: '#142828',
        textAlign: 'left',
    },
    inputLabel: {
        fontFamily: Fonts.MontserratMedium,
        fontSize: 12,
        color: '#AAB2BD',
        paddingBottom: 5,
    },
    inputLabelBlack: {
        paddingTop: 11, 
        fontFamily: Fonts.MontserratMedium, 
        fontSize: 18,
        color: '#142828',
        paddingBottom: Platform.OS === 'ios' ? 15 : 15,
        paddingLeft:5,
        justifyContent: 'flex-start',
    },
    loginTouchable : {
        width: (Dimensions.get('window').width * 0.85), 
        height: 65, 
        backgroundColor: '#00F0B5',
        alignItems: 'center',
        alignSelf: 'center', justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#00F0B5',
        borderRadius: 10,
    },
    loginButton: {
          color: '#ffffff',
          fontFamily: Fonts.MontserratBold,
          fontSize: 18,
          overflow: 'hidden',
          textAlign:'center',
    },
    loginButtonArea: {
        paddingVertical: 30,
    },
    dropDownArea: {
        paddingVertical: 5,
    },
    aliasDropDown: {
        flex: 1,
        flexDirection: 'row',
        paddingBottom: 10,
    },
    dropDownValueSection: {
        width: '95%'
    },
    dropDownValueText: {
        fontSize: 15,
        fontFamily: Fonts.MontserratMedium,
        color: '#142828'
    },
    dropDownIconSection: {
        width: '5%',
        textAlignVertical: 'bottom',
        paddingTop: 10
    },
    dropDownImage: {
        width: 10,
        height: 10,
    },
    hrLine: {
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#f2f3f7',
        marginBottom: 15
    },
    overlayChildStyle: {
        width: '100%',
        position: 'absolute',
        bottom: 0, right: 15, left: 20, borderTopLeftRadius: 25, borderTopRightRadius: 25,
    },
    listDropDown: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,        
        bottom:0,
        height: (Dimensions.get('window').height * 0.35),
        width: '100%'
    },
    listItem: {
        fontSize: 20,
        fontFamily: Fonts.RubikMedium,
        color: '#142828',
        width: '100%'
    },
});

export default practiceStyles;