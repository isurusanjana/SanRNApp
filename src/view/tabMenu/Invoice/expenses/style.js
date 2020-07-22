import { StyleSheet, Dimensions, Platform } from 'react-native';
import { Fonts } from '../../../../config/font';

const expenseStyles = StyleSheet.create({
    headerArrowBack: { fontSize: 25, color: '#ffffff', marginLeft: 15, justifyContent: 'center', alignItems: 'flex-start', alignContent: 'flex-start', alignSelf: 'flex-start', },
    reverseHeaderArrowBack: { fontSize: 25, color: '#fff', marginLeft: 15,  alignItems: 'flex-start', alignContent: 'flex-start', alignSelf: 'flex-start', },
    headerTitle : { paddingRight: 15, color: '#ffffff', fontSize: 18, fontFamily: Fonts.MontserratBold, paddingTop:20 },
    reverseHeaderTitle : {  color: '#fff', fontSize: 18, marginTop:4, fontFamily: Fonts.MontserratBold},

    headerBottomLeftArea: {
        width: '45%',
        paddingHorizontal: 10,
        bottom: 0,
    },
    headerBottomRightArea: {
        width: '55%',
        // paddingHorizontal: 10,
        bottom: 0,
    },
    headerBottomImage: {

    },
    headerBottomRight: {
        flex:1, 
        alignItems: 'flex-start' , 
        paddingTop: 15
    },
    headerBottomLeft: {
        paddingHorizontal: 20,
        textAlignVertical: 'bottom',
        bottom: 0,
    },
    totalText: {
        fontFamily: Fonts.MontserratBold,
        fontSize: 13,
        color: '#fff',
    },
    topSymbol: {
        fontFamily: Fonts.MontserratBold,
        fontSize: 28,
        color: '#fff',
    },
    topPrice: {
        fontFamily: Fonts.MontserratBold,
        fontSize: 28,
        color: '#FFFFFF',
        marginLeft:10
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
    expenseBody: {
        flex:1,
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    addExpenseBody: {
        flex:1,
        paddingHorizontal: 20,
        marginTop: 150,
        // backgroundColor: 'red'
    },
    bodyItemArea: {
        flexDirection: 'row',
    },
    heading: { 
        fontSize: 22, 
        color: '#142828', 
        fontFamily: Fonts.MontserratMedium,
        textAlignVertical: 'bottom', 
        textAlign: 'left' 
    },
    headingSub: { 
        color: '#aeb7af', 
        fontSize: 18, 
        textAlignVertical: 'bottom', 
        textAlign: 'left' 
    },
    itemDisplayArea: {
        paddingTop: 20,
    },
    listItemLeft: {
        width: '65%',
    },
    listItemRight: {
        width: '35%',
    },
    clickArea: { height: 'auto' , marginTop: 15 , },
    itemPrice: {
        color: '#414253',
        fontFamily: Fonts.MontserratBold,
        fontSize: 18,
        justifyContent: 'flex-end', textAlign: 'right', textAlignVertical: 'bottom'
    },
    textType: {
       color: '#142828',
       fontFamily: Fonts.MontserratBold,
       fontSize: 13,
       paddingBottom:5,
    },
    textDescription: {
        color: '#a6a9b2',
        fontFamily: Fonts.MontserratMedium,
        fontSize: 12,
        paddingBottom:5,
    },
    textDate: {
        color: '#AAB2BD',
        fontFamily: Fonts.MontserratMedium,
        fontSize: 12,
        justifyContent: 'flex-end', textAlign: 'right'
    },
    hrLine: {
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#f2f3f7',
        paddingVertical: 15
    },
    inputLabel: {
        flex: 1, justifyContent: 'center', paddingTop: 7, 
        fontFamily: Fonts.MontserratMedium,
        fontSize: 12,
        color: '#AAB2BD',
        paddingBottom: 1,
        // paddingLeft:3,
    },
    inputLabelBlack: {
        fontFamily: Fonts.MontserratBold,
        fontSize: 28,
        color: '#414253',
        paddingBottom: 1,
        justifyContent:'flex-start',
        paddingTop:26,
    },
    // input: {
    //     left:0,
    //     // height:50,
    //     color: '#000000',
    //     fontFamily: Fonts.MontserratBold,
    //     fontSize: 15,
    //     borderStyle: 'solid',
    //     borderBottomWidth: 1,
    //     borderBottomColor: '#f2f3f7',
    //     alignItems: 'flex-start',
    //     paddingLeft:3,
    //     justifyContent:'flex-start'
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

    inputExpenseAmount: {
        color: '#414253',
        fontFamily: Fonts.MontserratBold,
        textAlign:'left',
        fontSize: 28,
        marginLeft:2,
        width:100,

    },
    dropDownArea: {
        paddingVertical: 5,
    },
    aliasDropDown: {
      flex: 1,
      flexDirection: 'row',
      paddingBottom: 10,
      paddingLeft: 3,
      paddingTop: 10,
    },
    dropDownValueSection: {
      width: '90%'
    },
    dropDownValueText: {
      fontSize: 15,
      fontFamily: Fonts.MontserratMedium,
      color: '#AAB2BD'
    },
    dropDownSelectedValueText: {
        fontSize: 15,
        fontFamily: Fonts.MontserratMedium,
        color: '#414253' 
    },
    dropDownIconSection: {
      width: '10%'
    },
    dropDownImage: {
      width: 10,
      height: 10,
    },
    overlayChildStyle: {
        width: '100%',
        position: 'absolute',
        bottom: 0, 
        right: 15, 
        left: 20, 
        borderTopLeftRadius: 25, 
        borderTopRightRadius: 25,
    },
    listDropDown: {      
      bottom:0,
      height: (Dimensions.get('window').height * 0.4),
      width: '100%',
      left: 0
    },
    hrLineInput: {
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#f2f3f7',
        marginBottom: 15
    },
    listItem: {
        borderBottomWidth: 0,
        // backgroundColor: '#ffffff',
    },
    listText: {
      fontSize: 20,
      fontFamily: Fonts.MontserratBlack,
      color: '#142828',
      width: '100%'
    },
    selectedListItem: {
        borderBottomWidth: 0,
        // backgroundColor: '#e3f8f2',
    },
    selectedListText: {
      fontSize: 20,
      fontFamily: Fonts.MontserratBlack,
      color: '#2ee5b5',
      width: '100%'
    },
    calendarText: { 
        flex: 1, justifyContent: 'center', color: '#AAB2BD',      
        fontSize: 15,
        fontFamily: Fonts.MontserratMedium,
    },
    calendarSelectedText: { 
        flex: 1, 
        color: '#414253',
        fontSize: 15,
        fontFamily: Fonts.MontserratMedium,
    },
    loginButton: {
        color: '#ffffff',
        fontFamily: Fonts.MontserratBold,
        fontSize: 22,
        overflow: 'hidden',
        textAlign:'center',
    },
    footerContainer: { 
        paddingTop: 20,       
        paddingLeft: 25,
        paddingRight: 25,
        flex: 1,
        paddingBottom: 100,
    },
    loginButtonArea: {
        paddingBottom: 15,
    },
    loginTouchable : {
        width: (Dimensions.get('window').width - 60), 
        height: 56, 
        alignItems: 'center',
        alignSelf: 'center', justifyContent: 'center',
        backgroundColor: '#00D3A1',
        borderRadius: 12,
        color:'#FFF'
      },
    // loginButton: {
    //     color: '#ffffff',
    //     fontFamily: Fonts.MontserratBold,
    //     fontSize: 20,
    //     overflow: 'hidden',
    //     textAlign:'center',
    // },
    imageDisplayContainer: {
        backgroundColor: '#ffffff', 
        justifyContent: 'center' , 
        flexDirection: 'row', 
        alignContent: 'center',
        alignSelf: 'center' , 
        alignItems: 'center',  
        width: (Dimensions.get('window').width)*0.55, 
        height: (Dimensions.get('window').height) * 0.4, 
        marginTop : 20,
        borderRadius: 10,
        elevation: 15,
        shadowColor: 'black',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 5

    },

    // justifyContent: 'center' , 
    // flexDirection: 'row', 
    // alignContent: 'center',
    // alignSelf: 'center' , 
    // alignItems: 'center', 
    // height: (Dimensions.get('window').height) * 0.26, 
    // marginTop: 15, marginLeft: 15, marginRight: 15,
});

export default expenseStyles;