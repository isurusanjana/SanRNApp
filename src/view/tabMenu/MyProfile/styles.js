import { StyleSheet, Dimensions } from 'react-native';
import { Fonts } from '../../../config/font';

const myprofilestyles = StyleSheet.create({
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
        fontFamily: Fonts.RubikBold,
        fontSize: 25,
        alignItems: 'center',
        alignSelf: 'center', justifyContent: 'center',
        paddingTop: 15,
    },
    bodyContainer: {
        paddingTop: 10,
    },
    headArea: {
        flex: 1, 
        // marginHorizontal: 10,
        flexDirection: 'row',
        height: 50,
        marginBottom:25,
        left: 0
    },
    profileName: {
        fontFamily: Fonts.MontserratBold,
        fontSize: 15,
        color: '#414253',
        paddingTop:15
    },
    profilealias: {
        fontFamily: Fonts.MontserratBold,
        fontSize: 10,
        color: '#CCD1D9',
        paddingTop:10
    },
    aliasName: {
        fontFamily: Fonts.RubikLight,
        marginTop: 5,
        fontSize: 12,
        color: '#aeb7af',
    },
    imagePhoto: {
      marginTop: 15,
      flex: 1,
      width: 50,
      height: 50,
      resizeMode: 'contain',
    },
    signUpButton: {
        color: '#2ee5b5',
        fontFamily: Fonts.Rubik,
        fontSize: 22,
        overflow: 'hidden',
        textAlign:'center',
    },
    signUpTouchable : {
        width: (Dimensions.get('window').width - 40), 
        height: 55, 
        backgroundColor: '#ffffff',
        alignItems: 'center',
        alignSelf: 'center', 
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#2ee5b5',
        borderBottomWidth: 0,
        borderRadius: 5,
        shadowColor: '#CEFDF2',
        shadowOpacity: 0.36,
        elevation: 6,
        shadowRadius: 20 ,
        shadowOffset : { width: 0, height: 5},
      },
      signUpButton: {
          color: '#142828',
          fontFamily: Fonts.Rubik,
          fontSize: 22,
          overflow: 'hidden',
          textAlign:'center',
      },
      signUpButtonArea: {
            paddingBottom: 10,
            borderColor: '#F5F7FA',
            borderBottomWidth: 1,

      }

});

const profileStyles = StyleSheet.create({
    container: {
      paddingHorizontal: 20,  
    //   paddingTop: 10,
      marginTop:45,
    },
    containerBody: { height: Dimensions.get('window').height },
    headerLeft: { alignItems: 'flex-start', flex: 1},
    headerBody: { 
      flex: 1,     
      alignItems: 'center', 
    },
    headerBodyText: {
      fontSize: 18, 
      color: '#414253', 
      fontFamily: Fonts.MontserratBold, 
    },
    tabStyle: {borderColor: '#2ee5b5', height: 50} ,
    tabTextStyle: {
      color: '#000',
      fontFamily: Fonts.RubikMedium, 
      fontSize: 15,
    },
    activeTabStyle: {backgroundColor: '#2ee5b5'},
    imageView: { 
      paddingBottom: 80,
      alignItems: 'center',
    },  
    imagePhoto: {
      marginTop: 10,
      flex: 1,
      width: 16,
      height: 16,
      resizeMode: 'contain',
    },  
    linearGradient: {
      flex: 1,
      borderRadius: 5,
      flexDirection: 'row',
      width: 40,
      height: 40,
      borderRadius: 5,
      position: 'absolute', 
      bottom: 50, 
      left: (Dimensions.get('window').width / 2) - 83,

    },
    tabBarUnderlineStyle: {
        backgroundColor : '#ffffff',
        borderWidth: 0
    },
    tabActiveTextStyle: {
        fontFamily: Fonts.RubikMedium,
        color : '#2ee5b5'
    },
    tabTextStyle: {
        fontFamily: Fonts.RubikMedium,
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
    spinnerTextStyle: {
        color: '#FFF'
    },
    headerContainer: {
        paddingHorizontal: 25,
        justifyContent: 'center',
        textAlign: 'left',
        flexGrow: 1,
        textAlignVertical: 'top',
        // backgroundColor: 'blue',
        // paddingTop: 25,
        // height: 50
    },
    inputLabel: {
        fontFamily: Fonts.MontserratMedium,
        fontSize: 12,
        color: '#AAB2BD',
        paddingBottom: 5,
        // paddingLeft:3,
    },
    expireLavel: {
        fontFamily: Fonts.Rubik,
        fontSize: 15,
        color: '#EB5757',
        paddingLeft:3,
        paddingBottom: 10,
    },
    footerContainer: { 
        paddingTop: 20,
        paddingHorizontal: 25,  
        flex: 1,
        paddingBottom: 100,
    },
    loginButtonArea: {
        paddingBottom: 15,
    },
    loginTouchable : {
        width: (Dimensions.get('window').width - 40), 
        height: 56, 
        backgroundColor: '#00D3A1',
        alignItems: 'center',
        alignSelf: 'center', justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#00D3A1',
        borderRadius: 10,
        // shadowColor: "#00D9A6",
        // shadowOffset:{
        // width: 0,
        // height: 5,
        // },
        // shadowOpacity: 0.3,
        // shadowRadius: 4.65,
        // elevation: 8,
      },
      loginButton: {
          color: '#ffffff',
          fontFamily: Fonts.MontserratBold,
          fontSize: 18,
          overflow: 'hidden',
          textAlign:'center',
      },
      scanTouchable : {
        width: (Dimensions.get('window').width - 40), 
        height: 65, 
        backgroundColor: '#00D3A1',
        alignItems: 'center',
        alignSelf: 'center', justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#00D3A1',
        borderRadius: 15,
        // shadowColor: "#00D9A6",
        // shadowOffset:{
        // width: 0,
        // height: 5,
        // },
        // shadowOpacity: 0.3,
        // shadowRadius: 4.65,
        // elevation: 8,
      },
      scanButton: {
          color: '#ffffff',
          fontFamily: Fonts.MontserratBold,
          fontSize: 18,
          overflow: 'hidden',
          textAlign:'center',
      },
      input: {
          left:0,
          height:30,
          marginBottom: 30,        
          color: '#414253',
          fontFamily: Fonts.MontserratBold,
          fontSize: 15,
          borderStyle: 'solid',
          borderBottomWidth:1,
          borderBottomColor:'#E6E9ED',
          alignItems: 'flex-start',
          justifyContent:'center',
        //   backgroundColor: 'red',
        //   padding: 0,
          paddingBottom:10,
          paddingLeft: 0,
          paddingTop:0
      },
      inputLabelHide: {
        left:0,
        height:30,
        // marginBottom: 30,        
        color: '#414253',
        fontFamily: Fonts.MontserratBold,
        fontSize: 15,
        alignItems: 'flex-start',
        justifyContent:'center',
      //   backgroundColor: 'red',
      //   padding: 0,
        paddingBottom:1,
        paddingLeft: 0,
        paddingTop:0
      },
      textDisplay: { 
        fontFamily: Fonts.MontserratBold,
        fontSize: 15,
        textAlign:'center',
        justifyContent: 'center',
        alignItems: 'center',
        color:'#00D3A1',
        alignContent:'center',

      },
      viewDisplayApproved: {
        right:0,
        height:35,
        width:150,
        marginBottom: 0,  
        textAlign:'center',
        justifyContent: 'center',
        backgroundColor:'#00d3a154',
        borderRadius:25,

      },
      viewDisplayNotUploaded: {
        right:0,
        height:35,
        width:150,
        marginBottom: 0,  
        textAlign:'center',
        backgroundColor:'#FFD7D7',
        borderRadius:25,
        justifyContent: 'center'
      },
      textDisplayNotUploaded: {        
        color: '#142828',
        fontFamily: Fonts.MontserratBold,
        fontSize: 15,
        justifyContent: 'center',
        textAlign:'center',
        alignItems: 'center',
        backgroundColor:'#FFD7D7',
        color:'#EB5757',
        alignContent:'center',
      },
      viewDisplayUnderReview: {
        right:0,
        height:35,
        width:150,
        marginBottom: 0,  
        textAlign:'center',
        justifyContent: 'center',
        backgroundColor:'#FFF5F5',
        borderRadius:25,
      },
      textDisplayUnderReview: {       
        fontFamily: Fonts.MontserratBold,
        fontSize: 15,
        textAlign:'center',
        justifyContent: 'center',
        alignItems: 'center',
        color:'#856404',
        alignContent:'center',
      },
      expiredStatus: {
        right:0,
        height:35,
        width:150,
        marginBottom: 0,
        textAlign:'center',
        justifyContent: 'center',
        // alignItems: 'flex-end',
        backgroundColor:'#FFD7D7',
        color:'#EB5757',
        borderRadius:25,
      },
      expiredText: {       
        fontFamily: Fonts.MontserratBold,
        fontSize: 15,
        textAlign:'center',
        justifyContent: 'center',
        alignItems: 'center',
        color:'#EB5757',
        alignContent:'center',
      },
      creditCard: {
        height:50,
        marginBottom: 30,        
        color: '#414253',
        fontFamily: Fonts.MontserratBold,
        fontSize: 15,
        borderStyle: 'solid',
        borderBottomWidth:2,
        borderBottomColor:'#e6e9ed',
        alignItems: 'flex-start',
        letterSpacing:2,
      },
      logoHeader: {
          fontSize: 35,
          fontFamily: Fonts.RubikMedium,
          paddingBottom: 10,
          color: '#142828',
          textAlign: 'left',
      },
      textHeader: {
          fontSize: 28,
          fontFamily: Fonts.RubikMedium,
          paddingTop: 20,
          paddingBottom: 10,
          color: '#142828',
          textAlign: 'left',
          paddingLeft: 2,
      },
      formView: {
          paddingTop: 20,
      },
      pickerStyle: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,        
        bottom:0,
        height: (Dimensions.get('window').height * 0.8)
      },
      itemTextStyle: {
        fontFamily: Fonts.RubikMedium,
      },
      containerStyle: {
        marginBottom: 10,
        zIndex:2,
        width: '100%',
      },
      overlay: {
        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: 0.5,
        backgroundColor: 'black',
      } ,
      dropDownImage: {
        width: 14,
        height: 8,
      },
      aliasDropDown: {
        flex: 1,
        flexDirection: 'row',
        paddingBottom: 10,
      },
      dropDownValueSection: {
        width: '90%'
      },
      dropDownIconSection: {
        width: '10%',
        // backgroundColor: 'yellow',
        justifyContent: 'center',

      },
      dropDownValueText: {
        fontSize: 15,
        fontFamily: Fonts.MontserratBold,
        color: '#414253'
      },
      dropDownValueTextToSelect: {
        fontSize: 15,
        fontFamily: Fonts.MontserratBold,
        color: '#AAB2BD'
      },
      listDropDown: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,        
        bottom:0,
        height: (Dimensions.get('window').height * 0.5),
        width: '100%'
      },
      listItem: {
        fontSize: 20,
        fontFamily: Fonts.RubikMedium,
        color: '#142828',
        width: '100%'
      },
      dropDownArea: {
        borderStyle: 'solid', 
        borderBottomWidth:1, 
        borderBottomColor:'#E6E9ED',
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
    documentItems: {        
        flex: 1, marginLeft: 15, marginRight: 15, flexDirection: 'row',
        // paddingTop: 25,
        height: 50,
        marginBottom:15
    },
    documentHeader: {
        marginBottom: 20
    },
    documentNameArea: {
        width: '70%',
        alignItems: 'flex-start',
    },
    documentButtonArea: {
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        // backgroundColor: '#e3f8f2', 
        height: 30,
    },
    documentApproved: {
        // backgroundColor: '#e3f8f2',    
    },
    documentButton: {
        fontFamily: Fonts.Rubik,
        fontSize: 11,
        marginHorizontal: 5,
        marginVertical: 5,
    }, 
    documentArea: {
        flex: 1, marginLeft: 15, marginRight: 15, flexDirection: 'row',
        height: 50,
    },
    accountImage: {
      alignItems: 'center',
    },
    accountArea: {
        width: '100%', 
        alignItems: 'center',
        paddingTop: '24%',
    },
    cardNumberItem: {
        fontFamily: Fonts.MontserratMedium,
        fontSize: 18,
        color: '#ffffff',
        paddingRight: 15,
    },
    cardNumberLastItem: {
        fontFamily: Fonts.MontserratMedium,
        fontSize: 18,
        color: '#ffffff',
    },
    accountName: {
        flex: 1,
        alignContent: 'flex-start',
    },
    accountNameText: {
        fontFamily: Fonts.MontserratMedium,
        fontSize: 13,
        color: '#ffffff',
    },
    accountCode: {
        flex: 1,
        alignContent: 'flex-end',
        alignContent: 'flex-end',
        alignItems: 'flex-end',
        // paddingRight: 4,
    },
    accountCodeText: {
        fontFamily: Fonts.MontserratMedium,
        fontSize: 13,
        color: '#ffffff',
    },
    accountDetails: {
        width: '100%',
        paddingTop: 40,
        flexDirection: 'row',
        paddingHorizontal: 35,  
    },
    accountUpdateArea: {
        paddingTop: 20
    },
    uploadInstructionSection: {
        alignItems: 'center',
        paddingBottom: 20,
        // paddingBottom: (Dimensions.get('window').height) * 0.15,
    },
    uploadInstructionHeading: {
        fontFamily: Fonts.MontserratBold,
        color: '#00D3A1',
        fontSize: 15,
        textAlign: 'center',
        paddingBottom: 10,
    },
    uploadInstructionText: {
        fontFamily: Fonts.MontserratMedium,
        width: '75%',
        fontSize: 15,
        color: '#AAB2BD',
        textAlign: 'center'
    },
    whiteTouchable : {
        width: (Dimensions.get('window').width - 40), 
        height: 65, 
        backgroundColor: '#ffffff',
        alignItems: 'center',
        alignSelf: 'center', 
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#00D3A1',
        borderRadius: 15,
      },
    whiteButton: {
        color: '#00D3A1',
        fontFamily: Fonts.MontserratBold,
        fontSize: 13,
        overflow: 'hidden',
        textAlign:'center',
    },
    whiteButtonArea: {
        paddingBottom: 15,
        paddingTop: 5
    },
    switchArea: {
        flex: 1, 
        marginLeft: 10, 
        marginRight: 10, 
        flexDirection: 'row',
        height: 50,
        marginBottom:15  ,  
        paddingTop: 20     
    },
    switchTextArea: {
        width: '80%',
        justifyContent: 'flex-start'
    },
    switchText: {
        fontFamily: Fonts.MontserratMedium,
        color: '#414253',
        fontSize: 15,
    },
    switchButtonArea: {
        width: '20%',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
    },
    navigateSection: {
        flex: 1, 
        marginRight: 10, 
        flexDirection: 'row',
        marginVertical: 5
    },
    navigateIconSection: {
        alignItems: 'flex-start',
        width: '10%',
        justifyContent: 'center',
        // alignContent: 'center',
        paddingRight: 10,
    },
    navigateTextSection: {
        alignItems: 'flex-start',
        width: '85%',
        paddingLeft: 10,
        justifyContent: 'center',
    },
    navigateText: {
        fontFamily: Fonts.MontserratMedium,
        fontSize: 16,
        color: '#AAB2BD',
    },
    profileTouchable : {
        // width: (Dimensions.get('window').width - 15), 
        height: 55, 
        backgroundColor: '#ffffff',
        alignItems: 'flex-start',
        alignSelf: 'flex-start', 
        justifyContent: 'center',
    },
    financialContainer: {
       paddingTop: 25,
       paddingHorizontal:20,
    },
    financialTileArea: {
        flex: 1, 
        flexDirection: 'row',
        // paddingBottom:10,
        alignItems: 'center',
    },
    financialLeft: {
        flex: 1, width: '45%', 
        // padding:10,
        paddingBottom: 10,
        paddingTop: 10,
        paddingRight:10,
    },
    financialRight: {
        flex: 1, width: '45%', 
        // padding:10,
        paddingBottom: 10,
        paddingTop: 10,
        paddingLeft:10,
 
    },      
    tileAmount: {
        fontFamily: Fonts.MontserratBold,
        fontSize: 18,
        color: '#F5F7FA'
    },
    paidText: {
        fontFamily: Fonts.MontserratMedium,
        fontSize: 12,
        color: '#FFFFFF',
    },
    financialTile: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        borderRadius:10, 
        height: 110, 
        // backgroundColor: '#ffffff' , 
        // borderColor: '#ffffff',
        elevation : 8, 
        shadowColor: '#aeb7af',
        shadowOpacity: 0.5,
        shadowRadius: 10 ,
        shadowOffset : { width: 0, height: 5},
    },
    financialBottomArea: {
        marginTop: (Dimensions.get('window').height * 0.1),
        paddingBottom: 25,
        paddingHorizontal: 10, 
        width: '100%', 
    },
    pdfButtonArea: {
        paddingVertical:10,
    },
    pdfButton: {
        width: '100%', 
        height: 65, 
        backgroundColor: '#ffffff',
        alignItems: 'center',
        alignSelf: 'center', 
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#8d97b5',
        borderRadius: 10,
    },
    pdfButtonText: {
        color: '#8d97b5',
        fontFamily: Fonts.RubikMedium,
        fontSize: 18,
        overflow: 'hidden',
        textAlign:'center',
    },
    csvButton: {
        width: '100%', 
        height: 65,
        backgroundColor: '#00F0B5',
        alignItems: 'center',
        alignSelf: 'center', justifyContent: 'center',
        // borderWidth: 1,
        // borderColor: '#00F0B5',
        borderRadius: 12,
        // shadowColor: '#00F0B5',
        // shadowOffset: { width: 0, height: 4 },
        // shadowOpacity: 0.8,
        // shadowRadius: 2,
        // elevation: 5,
    },
    csvButtonText: {
        color: '#ffffff',
        fontFamily: Fonts.MontserratBold,
        fontSize: 18,
        // overflow: 'hidden',  
        textAlign:'center',
    },
    financialPaid: {
        flex: 1, 
        flexDirection: 'column',
    },
    financialImage: {
       
    },
    financialDescription: {
        flex: 2,        
    },
    subscriptionImage: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    subscriptionArea: {
        flex: 1,
        alignItems: 'flex-start',
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    subscriptionImageHeading: {
        color: '#ffffff',
        fontFamily: Fonts.Rubik,
        fontSize: 18,
        paddingLeft: 15,
        paddingBottom: 15,
    },
    featureSection: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 15,
    },
    featureText: {
        color: '#ffffff',
        fontFamily: Fonts.Rubik,
        fontSize: 13,
        paddingLeft: 10
    },
    featureGradient: {
        flex: 1,
        borderRadius: 10,
        flexDirection: 'row',
        width: (Dimensions.get('window').width - 50),
        height: (Dimensions.get('window').height * 0.45),
        elevation: 8
    },
    featureIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },  
    middleArea: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom: 20,
        paddingTop: 10,
    },
    middleSection: {
        flex: 1,
        flexDirection: 'row',
    },
    subDays: {
        fontFamily: Fonts.RubikLight,
        fontSize: 20,
        paddingHorizontal: 3,
        color: '#2a3147',
    },
    subFree: {         
        fontFamily: Fonts.RubikBold,
        fontSize: 20,
        paddingHorizontal: 3,
        color: '#2de0b1' 
    },
    subMiddleText: {
        paddingTop: 10,
        paddingBottom: 20,
        color: '#142828',
        fontFamily: Fonts.RubikLight,
        fontSize: 15,
        letterSpacing: 1,
        paddingHorizontal: 25,
        textAlign: 'center'
    },
    subBottomText: {
        color: '#aeb7af',
        fontFamily: Fonts.RubikLight,
        fontSize: 15,
        letterSpacing: 1,
        textAlign: 'justify' ,
        lineHeight: 25
    },
    subscriptionBottom: {
        paddingHorizontal: 15, 
        bottom: 0, 
        alignItems: 'center',
        height: (Dimensions.get('window').height * 0.15),
    },
    bottomArea: {
        flex: 1,
        flexDirection: 'row',
        bottom: 0,         
        width: (Dimensions.get('window').width - 30),
        backgroundColor: '#ff6c4f',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    bottomPlan: {
        alignItems: 'flex-start',
        width: '50%'
    },
    bottomPrice: {
        flex:1,
        flexDirection: 'column',
        alignItems: 'flex-end',
        width: '50%'
    },
    bottomPlanText: {
        color: '#ffffff',
        fontSize: 18,
        fontFamily: Fonts.RubikLight,
    },
    bottomSymbol: {
        color: '#ffffff',
        fontFamily: Fonts.RubikLight,
        fontSize: 20,
        textAlign: 'left',
        textAlignVertical: 'bottom',
    },
    bottomPriceValue: {
        color: '#ffffff',
        fontFamily: Fonts.RubikLight,
        fontSize: 20,
        textAlign: 'left',
        textAlignVertical: 'bottom',
    },
    bottomPriceMonth: {
        fontFamily: Fonts.RubikLight,
        fontSize: 18,
        color: '#ffffff',
        textAlign: 'left',
        textAlignVertical: 'bottom',
    },
    bottomPriceDesc: {
        color: '#ffffff',
        fontFamily: Fonts.RubikLight,
        fontSize: 14,
    },
    featureIconSection: {
        width: '10%'
    },
    featureTextSection: {
        width: '90%',
        padding: 4,
    },
    priceDescArea: {        
        textAlign: 'left',
        paddingRight: 15,
    },
    calendarArea: {
        // paddingHorizontal:10,
        paddingTop:10
    },
    overDatePicker: {
        width: '100%',
        position: 'absolute',
        right: 15, left: 20,
        borderRadius: 15, 
        shadowColor: '#CEFDF2',
        shadowOpacity: 0.36,
        elevation: 10,
        shadowRadius: 20 ,
        shadowOffset : { width: 0, height: 5},
    },
    calendarStyle: {
         height: 350,
    },
    selectedDate: {
        fontFamily: Fonts.MontserratMedium,
        fontSize: 12,
        color: '#AAB2BD',
        marginBottom: 10
    },
    showDateValue: {
        // width: '50%'
        paddingRight: 15,
    },
    showDropDownIcon: {
        // width: '10%'
    },
    showSelectedDate: {
        fontSize: 15,
        fontFamily: Fonts.MontserratBold,
        color: '#414253'
    },
    dateDropDownImage: {
        paddingLeft: 15,
        width: 15.75,
        height: 9,
    },
    formArea: {
        paddingHorizontal: 10,
    },
    mainContainer: {
        
    },
    calendarText: { 
        flex: 1, 
        color: '#AAB2BD',      
        fontSize: 15,
        fontFamily: Fonts.MontserratMedium,
    },
    calendarSelectedText: { 
        flex: 1, 
        color: '#414253',
        fontSize: 15,
        fontFamily: Fonts.MontserratMedium,
    },
    hrLineInput: {
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#2ee5b5',
        marginBottom: 15
    },
    headerArrowBack: { 
        fontSize: 25, 
        color: '#ffffff', 
        marginLeft: 15, 
        justifyContent: 'center', 
        alignItems: 'flex-start', 
        alignContent: 'flex-start', 
        alignSelf: 'flex-start',
     },

    headerTitle : { 
        textAlign: 'center', 
        paddingRight: 15, 
        color: '#ffffff', 
        fontSize: 18, 
        fontFamily: Fonts.MontserratBold
    },
    
    headerArrowBackReverse: { 
        fontSize: 25, 
        color: '#000000', 
        // marginLeft: 15, 
        justifyContent: 'center', 
        alignItems: 'flex-start', 
        alignContent: 'flex-start', 
        alignSelf: 'flex-start', },

    headerTitleReverse : { 
        textAlign: 'center', 
        paddingRight: 15, 
        color: '#000000', 
        fontSize: 18, 
        fontFamily: Fonts.Rubik, },

    certDisplayContainer: {
        backgroundColor: '#ffffff', 
        justifyContent: 'center' , 
        flexDirection: 'row', 
        alignContent: 'center',
        alignSelf: 'center' , 
        alignItems: 'center',  
        width: ((Dimensions.get('window').width) * 0.6), 
        height: (Dimensions.get('window').height + 120) * 0.4, 
        borderRadius: 10,
        elevation: 15,
        marginBottom:10,
        shadowColor: 'black',
                shadowOffset: { width: 5, height: 5 },
                shadowOpacity: 0.4,
                shadowRadius: 5
    },
    revenueContainer: {
        paddingTop: 15
    },
    revenueArea: {
        alignItems: 'flex-start',
        height: (Dimensions.get('window').height * 0.05),
    },
    chartArea: {
        flex:1,
        alignItems: 'flex-start',
        height: (Dimensions.get('window').height * 0.35),
    },
    barArea: {
        flexDirection: 'row',
        paddingHorizontal: 5, 
        paddingTop:5
    },
    bar: {
        textAlign: 'center',
        alignItems: 'center',
        alignContent: 'center',
        paddingBottom: 20,  
        paddingTop: 10,
        textAlignVertical: 'bottom',      
        // position: 'absolute',
        // bottom:0,
    },
    revenueImageHeading: {
        color: '#ffffff',
        fontFamily: Fonts.MontserratBold,
        fontSize: 13,
        paddingLeft: 10,
        paddingVertical: 10,
    },
    revenueImage: {
        flex: 1,
    },
    revenueGradient: {
        flex: 1,
        height: (Dimensions.get('window').height * 0.35),
        elevation: 8,
        paddingHorizontal:15
    },
    revenueBody: {
        flex:1,
        paddingTop: 30,
        paddingHorizontal: 20,
    },
    heading: { 
        fontSize: 15, 
        color: '#142828', 
        fontFamily: Fonts.RubikMedium,
        textAlignVertical: 'bottom', 
        textAlign: 'left',
    },
    subHeading: {
        fontSize: 12, 
        color: '#8d97b5', 
        fontFamily: Fonts.MontserratMedium,
        textAlignVertical: 'bottom', 
        textAlign: 'left',
        paddingBottom:10,
        paddingTop:5
    },
    revenueDisplayArea: {
        paddingTop: 10,
    },
    listItemLeft: {
        width: '65%',
    },
    listItemRight: {
        width: '35%',
    },
    textDate: {
        color: '#AAB2BD',
        fontFamily: Fonts.MontserratMedium,
        fontSize: 15,
        textAlignVertical: 'center'
    },
    itemPrice: {
        color: '#414253',
        fontFamily: Fonts.MontserratBold,
        fontSize: 18,
        justifyContent: 'flex-end', 
        textAlign: 'right', 
        textAlignVertical: 'center'
    },
    hrLineRevenue: {
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#efefef',
        // paddingTop: 10,
        // paddingBottom:10
    },
    profImageArea: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    infoHeaderTitle: {
        color: '#FFFFFF',
        fontFamily: Fonts.MontserratBold,
        fontSize: 18,
    },
    blackHeaderTitle: {
        color: '#000000',
        fontFamily: Fonts.MontserratBold,
        fontSize: 18,
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
    totalText: {
        fontFamily: Fonts.MontserratBold,
        fontSize: 13,
        color: '#fff',
    },
    shareCSVBody: {
        flex:1,
        paddingTop: 30,
        paddingHorizontal: 20,
    },
    
  });


export { myprofilestyles, profileStyles };
