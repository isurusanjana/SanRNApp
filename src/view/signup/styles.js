import { StyleSheet, Dimensions } from 'react-native';
import { Fonts } from '../../config/font';
import { Right } from 'native-base';

const signupstyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20
  },
  headArea: {
    flex: 1, marginRight: 15, flexDirection: 'row',
    // paddingTop: 25,
    height: 50,
  },
  profileImage: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: 100,
    height: 100
  },
  signupImage: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: 50,
    height: 50
  },
  topic: {
    fontSize: 33,
    color: '#000',
    fontFamily: Fonts.RubikMedium,
    paddingLeft: 3,
  },
  addPhoto: {
    flexDirection: 'row'
  },
  circle: {
    flexDirection: 'row',
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: '#f8fafc',
  },
  imagePhoto: {
    flex: 1,
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  textMsg: {
    marginTop: 10,
    color: '#142828',
    fontSize: 10,
    fontFamily: Fonts.Rubik,
    marginLeft: 5
  },
  fbBtn: {
    // marginLeft: 15, 
    width: 90,
    height: 45,
    backgroundColor: '#35599e',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  googleBtn: {
    marginLeft: 15,
    width: 90,
    height: 45,
    backgroundColor: '#ff6c4f',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 8
  },
  termsMsg: {
    color: '#aeb6b7',
    alignSelf: 'center',
    justifyContent: 'center',
    fontFamily: Fonts.MontserratMedium,
    fontSize: 11
  },
  termsMsgBold: {
    fontFamily: Fonts.MontserratBold,
    fontSize: 11
  },
  havingTrouble: {
    color: '#aeb6b7',
    fontFamily: Fonts.Rubik,
    fontSize: 15,
    marginLeft: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontFamily: Fonts.MontserratBold,
    fontSize: 18
  },
  signUpBtnArea: {
    width: (Dimensions.get('window').width - 60),
    height: 56,
    backgroundColor: '#00D3A1',
    borderColor: '#00D3A1',
    alignItems: 'center',
    alignSelf: 'center', justifyContent: 'center',
    borderWidth: 1,
    // paddingBottom: 10,
    // paddingTop: 10,
    borderRadius: 10,
    // shadowColor: '#00d9a6',
    // shadowOpacity: 0.4,
    // elevation: 8,
    // shadowRadius: 8,
    // shadowOffset: { width: 0, height: 5 },
  },
  input: {
    height: 50,
    marginBottom: 20,
    color: '#142828',
    fontFamily: Fonts.Rubik,
    fontSize: 17,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#f2f3f7',
  },
  socialMedia: {
    fontFamily: Fonts.RubikMedium,
    fontSize: 18,
    color: '#fff',
  },
  checkBox: {

  },
  dropDownDefaultText: {
    color: "#aab2bd",
    fontFamily: Fonts.MontserratMedium,
    fontSize: 15,
  },
  dropDownImage: {
    width: 15,
    height: 15,
  },
  dropDownText: {
    color: "#414253",
    fontFamily: Fonts.MontserratMedium,
    fontSize: 15,
    marginLeft: 5,
    borderBottomColor: '#f2f3f7',
    width: (Dimensions.get('window').width - 40)
  },
  dropDownButton: {
    borderBottomWidth: 1,
    borderBottomColor: '#f2f3f7',
    marginTop: 15,
  },
  cityDropDownButton: {
    borderBottomWidth: 1,
    borderBottomColor: '#f2f3f7',
    marginTop: 25,
  },
  dropDownArea: {
    paddingVertical: 5,
  //   paddingLeft: 3,
  },
  aliasDropDown: {
    flex: 1,
    flexDirection: 'row',
    paddingBottom: 10,
  },
  dropDownValueSection: {
    width: '90%'
  },
  dropDownValueText: {
    fontSize: 20,
    fontFamily: Fonts.RubikMedium,
    color: '#142828'
  },
  dropDownIconSection: {
    width: '10%'
  },
  border: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#e6e9ed',
    borderStyle: 'dashed',
    borderRadius: 6,
    justifyContent: 'center', 
    alignItems: 'center',
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    paddingBottom: 15,
  },
  inputAndroid: {
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f3f7',
  },
});

export { signupstyles, pickerSelectStyles };