import { StyleSheet , Dimensions } from 'react-native';
import { Fonts } from '../../config/font';

const styles = StyleSheet.create({    
    safeAreaContainer: {
        flex:1,
    },
    keyAvoidContainer: {
        flex:1,
    },
    container: {
        flex:1,
        // backgroundColor:'yellow'
        // position : 'absolute',
        // width: '100%',
        // height: '100%',
        // top: 0,
        // marginTop: 0,
        // paddingTop: 0
    },
    logoContainer: {
        paddingTop: 25,
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1
    },
    headerContainer: {
        // flex: 1,
        paddingTop: 25,
        paddingHorizontal: 30,
        justifyContent: 'center',
        textAlign: 'left',
        textAlignVertical: 'top',
        flexDirection: 'row',
        paddingBottom: 15,
        // backgroundColor: 'blue'
        // height: 50
    },
    logo: {
      width:250,
      height:50
    },
    logoText: {
        color: '#23232a',
        width: '70%',
        fontSize: 20,
        textAlign: 'center'
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
    logoHeader: {
        paddingTop: 40,
        paddingHorizontal: 30,
        justifyContent: 'center',
        textAlign: 'left',
        textAlignVertical: 'top',
    },
    leftView: {
        alignItems: "baseline",
        alignSelf: "baseline",
        width: '50%',
        flexDirection: 'row'
    },
    rightView: {        
        alignItems: "baseline",
        alignSelf: "baseline",
        width: '40%',
    },
    appVersion: {
        color: '#AAB2BD', 
        bottom: 20,
        textAlign: 'center',
        fontSize: 13
    }
});

const loginformStyles = StyleSheet.create({
    formContainer: {
        // flex:1,
        paddingHorizontal: 30,
        // paddingBottom: 60,
        // backgroundColor: 'red'
        // minHeight: 180,
        // minHeight: (Dimensions.get('window').height * 0.15),
    },
    forgotFormContainer: {
        // paddingHorizontal: 25,
    },
    container: {
        // flex:1,
    },
    bodyContainer: {
        flex: 1,
        // backgroundColor: 'red'
    },
    inputLabel: {
        fontFamily: Fonts.MontserratMedium,
        fontSize: 12,
        color: '#AAB2BD',
        paddingBottom: 5,
    },
    input: {
        height:50,
        // marginBottom: 30,        
        color: '#414253',
        fontFamily: Fonts.MontserratMedium,
        fontSize: 16,
    },

    loginTouchable : {
        width: (Dimensions.get('window').width - 60), 
        height: 56, 
        backgroundColor: '#00D3A1',
        alignItems: 'center',
        alignSelf: 'center', justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#00D3A1',
        borderRadius: 10,
        // shadowColor: '#CEFDF2',
        // shadowOpacity: 0.36,
        // elevation: 8,
        // shadowRadius: 20 ,
        // shadowOffset : { width: 0, height: 5},
      },
    loginButton: {
        color: '#ffffff',
        fontFamily: Fonts.MontserratBold,
        fontSize: 20,
        // overflow: 'hidden',
        // textAlign:'center',
        // justifyContent: 'center',
        // height:55
    },

    signUpTouchable : {
        // width: (Dimensions.get('window').width - 40), 
        // height: 65, 
        // backgroundColor: '#ffffff',
        // alignItems: 'center',
        // alignSelf: 'center', 
        // justifyContent: 'center',
        // borderWidth: 1,
        // borderColor: '#2ee5b5',
        // borderRadius: 10,
        // shadowColor: '#CEFDF2',
        // shadowOpacity: 0.36,
        // elevation: 8,
        // shadowRadius: 20 ,
        // shadowOffset : { width: 0, height: 5},
        width: (Dimensions.get('window').width - 60), 
        height: 25, 
        alignItems: 'center',
        alignSelf: 'center', justifyContent: 'center',
        // borderWidth: 2,
        // borderColor: '#00D3A1',
        borderRadius: 10,
        color:'#00D3A1'
      },
      signUpWording: {
        color: '#414253',
        fontFamily: Fonts.MontserratMedium,
        fontSize: 16,
        overflow: 'hidden',
        textAlign:'center',
        paddingBottom: 8
    },
    signUpButton: {
        color: '#00D3A1',
        fontFamily: Fonts.MontserratMedium,
        fontSize: 16,
        // overflow: 'hidden',
        textAlign:'center',
    },
    loginButtonArea: {
        paddingBottom: 15,
        // flex:1,
        // backgroundColor: 'blue'
    },
    signUpButtonArea: {
        flex:1,
        paddingTop: 10,
        paddingBottom: 10,
        // backgroundColor: 'red'
    },

    labelText: {
        color: '#acacac',
        fontSize:20,
        paddingBottom: 5,
    },
    logoHeader: {
        fontSize: 28,
        fontFamily: Fonts.MontserratBold,
        color: '#414253',
        textAlign: 'left',
    },
    logoHeaderLink: {
        fontSize: 18,
        fontFamily: Fonts.MontserratBold,
        color: '#00D3A1',
        textAlign: 'left',
        textDecorationLine: 'underline',
        paddingBottom:3
    },
    inputForgotPassword: {
        borderBottomWidth: 1,
        borderBottomColor: '#f2f3f7',
        fontFamily: Fonts.Rubik,
        height:50,
        marginBottom: 20,
        color: '#000000',
        fontSize: 20
    },
    inputContainer: {
        // flex: 1,
        // flexDirection: 'row',
    },

    inputMainContainer: {
        flexDirection: 'row',
        borderStyle: 'solid',
        borderBottomWidth:2,
        borderBottomColor:'#E6E9ED',
        minHeight:80,
        paddingTop: 30,
    },
    inputImageContainer: {
        paddingTop: 15,
        width: '10%',
    },
    inputHalfTextContainer: {
        width: '45%',
    },
    inputRightContainer: {
        width: '45%',
        textAlign: "right",
        paddingTop: 15,
    },
    inputFullTextContainer: {
        width: '90%',
    },
});

const footerStyles = StyleSheet.create({
    footerContainer: { 
        paddingHorizontal: 30,
        flex: 1,
        paddingTop: 40,
        // backgroundColor: 'green'
    },
    forgotFooterContainer: {
        paddingTop: 170,
        // paddingLeft: 25,
        // paddingRight: 25,
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        padding: 25,
    },
    footerLinksContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 25,
    },
    footerLinks: {
        color: '#757575',
    },
    linkTouchable: {
        flex: 1,
    },
    signUpLink: {
        fontSize:18,
        color: '#757575',
        textAlign: 'left'
    },
    fpwLink: {
        fontFamily: Fonts.MontserratMedium,
        fontSize:15,
        color: '#00D3A1',
        textAlign: 'right',
    },
    submitButton: {
        color: '#ffffff',
        fontFamily: Fonts.Rubik,
        fontSize: 20,
        overflow: 'hidden',
        textAlign:'center',  
    },

});


export { styles, loginformStyles, footerStyles }