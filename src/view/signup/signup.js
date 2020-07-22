import React, { Component } from "react";
import {
  View, Switch,
  Text, StyleSheet, CheckBox,
  Image, SafeAreaView,
  TextInput, Picker,
  StatusBar,
  Keyboard, TouchableOpacity,
  KeyboardAvoidingView, Dimensions,
  TouchableWithoutFeedback, ScrollView, BackHandler,
  Platform ,
  AsyncStorage
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
// import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import Actionsheet from 'react-native-enhanced-actionsheet'
import { NavigationActions, StackActions } from 'react-navigation';

import { styles, formStyles, loginformStyles } from "../login/styles";
import { signupstyles, pickerSelectStyles } from "./styles";
import ImagePicker from 'react-native-image-picker';
import FormTextInput from "../../components/formTextInput/textinput";
import Swiper from 'react-native-swiper';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import RNPickerSelect from 'react-native-picker-select';
import FBLoginButton from "../../components/fbLogIn/FBLoginButton";

import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import validate from 'validate.js';
import DropdownAlert from 'react-native-dropdownalert';
import ModalDropdown from 'react-native-modal-dropdown';
import CheckboxFormX from 'react-native-checkbox-form';

import { Header, Left, Body, Right, Icon, Button } from 'native-base';
import { GoogleSigninButton } from 'react-native-google-signin';
import { SIGNUP_URL, VALIDATE_EMAIL, LOGIN_URL, IMAGE_EXISTS, BASE_URL } from '../../config//shared';
import { Services } from '../../services/services';
import { ServiceParams } from '../../services/serviceParams';
import Spinner from 'react-native-loading-spinner-overlay';
import DropDownHolder from "../../components/dropDown/dropDownHolder";

import CustomMultiSelectDropDown from '../../components/CustomDropDown/customMultiSelectDropDown';
import { Fonts } from '../../config/font';
import packageJson from '../../../package.json';

const constraintsFirst = {
  userEmail: {
    presence: {
      allowEmpty: false,
      message: "cannot be blank."
    },
    email: {
      message: '^Please enter a valid email address'
    },
    exclusion: {
      within: ["userEmail"],
      message: "^'%{value}' is not allowed"
    }
  },
  password: {
    presence: {
      allowEmpty: false,
      message: "cannot be blank."
    },
  }
  
}

const constraintsSecond = {
  firstName: {
    presence: {
      allowEmpty: false,
      message: "cannot be blank."
    },
  },
  lastName: {
    presence: {
      allowEmpty: false,
      message: "cannot be blank."
    },
  },
  gmcNumber: {
    presence: {
      allowEmpty: false,
      message: "cannot be blank."
    },
  },
  Profession: {
    presence: {
      allowEmpty: false,
      message: "cannot be blank."
    },
  },
  city: {
    presence: {
      allowEmpty: false,
      message: "cannot be blank."
    },
  },
  condition: {
    presence: {
      message: "^Please check Term and conditions"
    },
    inclusion: {
      within: [true],
      message: "^Please check Term and conditions"
    }
  }
}

const FBSDK = require('react-native-fbsdk');
const {
  LoginManager, AccessToken
} = FBSDK;

// import { CheckBox } from 'react-native-elements'


const OPTIONS = [
  { id: 1, label: 'Camera' },
  { id: 2, label: 'Gallery' },
];

const mockData = [
  {
    label: '',
    RNchecked: false
  }
];

export default class SignUp extends Component {
  static navigationOptions = {
    // title: 'Sign Up',
    // headerBackTitle: 'Back',
    headerStyle: {
      backgroundColor: "#dcdde1"
    },
    headerTintColor: "#000",
    headerTitleStyle: {
    }
  };

  constructor(props) {
    super(props);
    this.inputRefs = {};
    this.state = {
      switch1Value: false,
      visible: false,
      selected: 0,
      avatarSource: require("./images/add_photo.png"),
      arrowSource: require("./images/dropdown-arrow.png"),
      errors: {
        first_name: false
      },
      checked: false,
      photoAdded: false,
      canada: '',
      profItems: ['GP', 'ANP', 'Nurse', 'Pharmacist', 'Vet'],
      spinner: false,
      mockData : [
        {
          label: '',
          RNchecked: false
        }
      ],
      profItemsVisible:false,
      profItemsOption: [
              {
                  value: 'GP',
                  id: 1,
                  selected: false,
                  sort: 'data'
              }, {
                  value: 'ANP',
                  id: 2,
                  selected: false,
                  sort: 'data'
              }, {
                  value: 'Nurse',
                  id: 3,
                  selected: false,
                  sort: 'data'
              }, {
                  value: 'Pharmacist',
                  id: 4,
                  selected: false,
                  sort: 'data'
              }, {
                  value: 'Vet',
                  id: 5,
                  selected: false,
                  sort: 'data'
              }, 
          ],
    }
    
    this.setServices = new Services();
    this.handleBackButtonClick = this.handleBackPress.bind(this);
  }


  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }


  forceClose() {
    this.dropdown.close();
  }

  toggleSwitch1 = (value) => {
    this.setState({ switch1Value: value })
    console.log('Switch 1 is: ' + value)
  }

  showActionSheet = () => {
    // this.ActionSheet.show()
    this.setState({ visible: true })
  }

  launchCamera = () => {
    console.log("Launch Camera");
    const options = {
      title: 'Select Avatar',
      customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    // Open Image Library:
    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({ imageDetails: response });
        this.setState({ avatarSource: source });
        this.setState({ photoAdded: true })

        //   this.state.avatarSource = source;
      }
    });
  }

  launchLibrary = () => {

    const options = {
      title: 'Select Avatar',
      customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({ imageDetails: response });
        this.setState({ avatarSource: source });
        this.setState({ photoAdded: true })

        //   this.state.avatarSource = source;
      }
    });
  }

  async textChange(type, text) {
    this.setState({
      [type]: text
    });

    setTimeout(() => {
      console.log("On PressChange");
      var someProperty = this.state.errors;

      this.setState({ someProperty })
      if (this.state[type] == "") {
        someProperty[type] = true;
        this.setState({ someProperty });
      } else {
        someProperty[type] = false;
        this.setState({ someProperty });
      }

      console.log("State :", this.state);
    }, 250);

  }

  onChangeCheck = async () => {
    await this.setState({ checked: !this.state.checked });
    console.log("State :", this.state.checked);
    setTimeout(() => {
      console.log("State :", this.state);
    }, 250);
  }

  handleBackPress = async () => {
    // this.refs.swiper.scrollBy(-1);
    await this.setState({ checked: false });
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    return true;
  }

  firstSlideValidate = async () => {
    // this.setState({ 'spinner': false });  
    // this.refs.swiper.scrollBy(1);
    var isValidFirstSlide = await validate({ userEmail: this.state.email, password: this.state.password },
      constraintsFirst, { format: "detailed" });
    if (isValidFirstSlide != undefined) {
      DropDownHolder.dropDown.alertWithType('error', 'Error', (isValidFirstSlide[0]).error);
      this.setState({ 'spinner': false });
    } else {
      await this.validateEmail(); 
      this.setState({ 'spinner': false });       
    }
  }

  validateEmail = async () => {
    await this.setServices.postService(VALIDATE_EMAIL, ServiceParams.getEmailValidateParams(this.state.email))
      .then((responseJson) => {                 
        this.setState({ 'spinner': false });
        if (responseJson.error == 0) {
            // this.refs.swiper.scrollBy(1);
            this.secondSlideValidate();
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        } else {
          DropDownHolder.dropDown.alertWithType('error', 'Error', responseJson.info);
          return false;
        }
      }, (error) => {
        this.setState({ 'spinner': false });
        DropDownHolder.dropDown.alertWithType('error', 'Error', ' results:' + error);
        return false;
      })
  }

  secondSlideValidate = async () => {
    var isValidSecondSlide = validate({ 
      firstName: this.state.first_name,
      lastName: this.state.last_name,
      gmcNumber: this.state.gmc_number,
      Profession: this.state.Profession,
      city: this.state.city,
      condition: this.state.checked
    },
      constraintsSecond, { format: "detailed" });
    if (isValidSecondSlide != undefined) {
      DropDownHolder.dropDown.alertWithType('error', 'Error', (isValidSecondSlide[0]).error);
    } else {
      this.signUpdHandler();     
    }
  }

  signUpdHandler = () => {
    this.setServices.postService(SIGNUP_URL, ServiceParams.getSignUpParams(this.state.email,
      this.state.password,
      this.state.first_name,
      this.state.last_name,
      this.state.gmc_number,
      this.state.Profession,
      this.state.city,
      this.state.postcode,
      this.state.imageDetails))
      .then((responseJson) => {                 
        this.setState({ 'spinner': false });
        if (responseJson.error == 0) {
          DropDownHolder.dropDown.alertWithType('success', 'Success', responseJson.info);
          this.setServices.postService(LOGIN_URL, ServiceParams.getLoginDataParams(this.state.email, this.state.password))
            .then(async(responseData) => {
                if(responseData.error == 0) {
                await AsyncStorage.clear();
                
                let data = responseData['body'][0]; 
                let accessToken = responseData['token'];
                await AsyncStorage.setItem('accessToken', accessToken);
                let basePath = responseData['base_path'];
                let profImage = data.photo;
                await this.setServices.postService(IMAGE_EXISTS, ServiceParams.checkImageExists(basePath.replace(BASE_URL+"/.", "")+data.photo))
                .then(async(response) => {
                    if(response.error == 0) {
                        await this.setState({imageExists: true});
                    }
                })
                
                let defaultImage = responseData['default_image'];

                await AsyncStorage.multiSet([
                                                ['userEmail', (data.user_email != null ? data.user_email : '')],
                                                ['firstName', data.first_name != null ? data.first_name : ''],
                                                ['lastName', data.last_name != null ? data.last_name : ''],
                                                ['gmcNumber', data.gmc_number != null ? data.gmc_number : ''],
                                                ['address1', data.address1 != null ? data.address1 : ''],
                                                ['address2', data.address2 != null ? data.address2 : ''],
                                                ['postCode', data.postcode != null ? data.postcode : ''],
                                                ['city', data.city != null ? data.city : ''],
                                                ['qualification', data.qualification != null ? data.qualification : ''],
                                                ['language', data.language != null ? data.language : ''],
                                                ['smartCard', data.smart_card != null ? data.smart_card : ''],
                                                ['itSystem', data.it_system != null ? data.it_system : ''],
                                                ['speciality', data.gpwsi != null ? data.gpwsi : ''],
                                                ['basePath', responseData['base_path']],
                                                ['profileImage', (this.state.imageExists == true ? profImage : defaultImage)],
                                                ['user_id', data.user_id != null ? data.user_id : ''],
                                                ['sortCode', data.sort_code != null ? data.sort_code : ''],
                                                ['accountNo', data.account_number != null ? data.account_number : ''],
                                                ['accountHolderName', data.account_holder_name != null ? data.account_holder_name : ''],
                                                ['accessToken', accessToken],
                                                ['defaultProfImage', defaultImage] ,
                                                ['refreshDefault', '1'], 
                                            ], 
                                            (err) => {console.log(err)});
                    setTimeout(() => {                        
                        this.setState({ 'spinner' : false });
                        this.props.navigation.navigate('MainNavigation' , {
                            start : 'login',
                            alertType: 'success',
                            displayMsg: 'Welcome, '+ data.first_name +' '+ data.last_name });
                    }, 1500);
                } else {
                    
                    this.setState({ 'spinner' : false });
                    DropDownHolder.dropDown.alertWithType('error', 'Error', responseData.info);
                }
            }, (error) => {    
                 
                this.setState({ 'spinner' : false });         
                console.log("Error : ", error);    
            })
        } else {
          DropDownHolder.dropDown.alertWithType('error', 'Error1', responseJson.info);
        }
      }, (error) => {
        this.setState({ 'spinner': false });
        DropDownHolder.dropDown.alertWithType('error', 'Error2', ' results:' + error);
      })
  }

  // Somewhere in your code
  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({ userInfo });
    } catch (error) {
      console.log("Error :", error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  userSignIn() {
    GoogleSignin.signIn()
      .then((userInfo) => {
        let userDetails = userInfo.user;
        this.setState({ email: userDetails.email });
        this.setState({ password: '123456' });
        this.setState({ first_name: userDetails.givenName });
        this.setState({ last_name: userDetails.familyName });
        this.setState({ gmc_number: '123' });
        this.setState({ Profession: 'test' });
        this.setState({ city: 'test' });
        this.signUpdHandler();
      }).catch((error) => {
        // console.warn("User Error :", error);
      }).done();
  }

  getFaceBookUserDetails(user_id, access_token) {
    this.setServices.faceBookGraphService("" + user_id + "?fields=email,name,first_name,middle_name,last_name,picture.type(large)&access_token=" + access_token, "")
      .then((responseData) => {

        // console.warn("Data :", responseData);
        this.setState({ email: responseData.email });
        this.setState({ password: '123456' });
        this.setState({ first_name: responseData.first_name });
        this.setState({ last_name: responseData.last_name });
        this.setState({ gmc_number: '123' });
        this.setState({ Profession: 'test' });
        this.setState({ city: 'test' });
        this.signUpdHandler();

      }, (error) => {

        this.setState({ 'spinner': false });
        console.log("Error : ", error);
      })
  }


  render() {

    const { goBack } = this.props.navigation;
    const selectedOption = OPTIONS.find((e) => e.id === this.state.selected);
    const addPhoto = 
      <View style={[signupstyles.addPhoto, { marginTop: 10, marginBottom: 10 }]}>
        <View style={signupstyles.border} >
          <Image style={ signupstyles.imagePhoto } source={require('./images/add_picture.png')}></Image>
        </View>
        <Text style={{ color: '#aab2bd', fontSize: 15, fontFamily: Fonts.MontserratMedium, marginLeft: 15, marginTop: 15 }}>Add picture</Text>
      </View>;

    const addedPhoto = <View><Image resizeMode='cover' borderRadius={6} style={signupstyles.signupImage} source={this.state.avatarSource} /></View>

    const professionPlaceHolder = <Text style={signupstyles.dropDownDefaultText}>
      <Text>Profession </Text>
      {/* <Image resizeMode='stretch' style={signupstyles.dropDownImage} source={this.state.arrowSource} /> */}
    </Text>

    const cityPlaceHolder = <Text style={signupstyles.dropDownDefaultText}>
      <Text>City </Text>
      <Image resizeMode='stretch' style={[signupstyles.dropDownImage, { alignSelf: 'flex-end',}]} source={this.state.arrowSource} />
    </Text>

    return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null}  style={{ flex: 1 }} >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
              <StatusBar
                  backgroundColor="#FFFFFF"
                  barStyle="dark-content"
                />

              <Spinner
                visible={this.state.spinner}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
              />
            <ScrollView>
              <View style={signupstyles.container}>
                  <View style={styles.logoHeader }>
                      <Image source={require('./images/logo.png')} />
                  </View>
                  <View style={styles.headerContainer}>
                      <TouchableOpacity onPress={() => {this.props.navigation.navigate('LoginPage');}} style = {{ paddingTop: 12, width: '10%' }}>
                          <Image source = { require('./images/back_arrow.png') } style = {{ width: 15, height: 15, marginRight: 15 }} />
                      </TouchableOpacity>
                      <View style={styles.leftView}>
                          <TouchableOpacity >
                              <Text style={ loginformStyles.logoHeader }>Sign Up</Text>   
                          </TouchableOpacity>  
                      </View>
                      <View style={styles.rightView} > 
                          <TouchableOpacity onPress={() => {this.props.navigation.navigate('LoginPage');}}>
                              <Text style={loginformStyles.logoHeaderLink}>Login</Text>
                          </TouchableOpacity>                        
                      </View>                    
                  </View>
                <View style={[signupstyles.headArea, { paddingHorizontal: 30 }]}>
                  <View style={{ flex: 2 }}>

                  <View style={[signupstyles.addPhoto, { paddingTop: 10 }]}>
                    <TouchableOpacity onPress={() => this.setState({ visible: true })} >
                      {this.state.photoAdded ? addedPhoto : addPhoto}
                    </TouchableOpacity>
                  </View>

                  </View>
                  
                </View>

                <View style={{ flex: 8 }}>
                      <View style={{paddingTop: (Platform.OS === 'ios' ? 20 : 0)}}>
                        <Actionsheet
                          visible={this.state.visible}
                          onRequestClose={() => { }}
                          data={OPTIONS}
                          title={'Lets get a Picture'}
                          titleStyle={{ fontSize: 15, color: '#9a9a9a' }}
                          optionTextStyle={{ color: '#9a9a9a' }}
                          selected={this.state.selected}
                          onOptionPress={(e) => {
                            this.setState({ visible: false });
                            console.log("ID :", e.id);
                            if (e.id == 1) {
                              this.launchCamera();
                            } else {
                              this.launchLibrary();
                            }
                          }}
                          onCancelPress={() => this.setState({ visible: false })}
                        />
                      </View>

                      
                        <View style={{ flex: 6, marginTop: 40, paddingHorizontal: 30}}>

                          { this.state.email ?
                              <Text style = {{ fontSize: 12, color: '#aab2bd', fontFamily: Fonts.MontserratMedium, paddingBottom: (Platform.OS === 'ios' ? 15 : 0), }}>Email</Text>
                              : <View></View>
                          }
                          <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 30 }}>
                            <View style = {{ width: '10%' , marginBottom: (Platform.OS === 'ios' ? 10 : 0) , marginRight: (Platform.OS === 'ios' ? 10 : 0) }}>
                              { this.state.email ?
                              <Image source = { require('./images/email_icon.png') } style={{ marginTop: (Platform.OS === 'ios' ? 0 : 15), tintColor: '#414253' }}/>
                              : <Image source = { require('./images/email_icon.png') } style={{ marginTop: (Platform.OS === 'ios' ? 0 :15) }}/>
                              }
                            </View>
                            <View style = {{ width: '90%' }}>
                              <TextInput error={this.state.errors.email} labelText='Email' placeholder='Email' placeholderTextColor="#aab2bd" returnKeyType="next" keyboardType='default' secureTextEntry={false}
                                underlineColorAndroid="transparent" style={{ color: "#414253", fontFamily: Fonts.MontserratMedium, fontSize: 15, borderBottomColor:'#f2f3f7' }}
                                onChangeText={(text) => this.textChange('email', text )}
                              />
                            </View>
                          </View>

                          { this.state.password ?
                            <Text style = {{ fontSize: 12, color: '#aab2bd', fontFamily: Fonts.MontserratMedium,  paddingBottom: (Platform.OS === 'ios' ? 15 : 0), }}>Password</Text>
                            : <View></View>
                          }
                          <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 30  }}>
                            <View style = {{ width: '10%' , marginBottom: (Platform.OS === 'ios' ? 10 : 0) , marginRight: (Platform.OS === 'ios' ? 10 : 0) }}>
                              { this.state.password ?
                              <Image source = { require('./images/password.png') } style={{ marginTop: (Platform.OS === 'ios' ? 0 : 15), tintColor: '#414253' }}/>
                              : <Image source = { require('./images/password.png') } style={{ marginTop: (Platform.OS === 'ios' ? 0 : 15) }}/>
                              }
                            </View>
                            <View style = {{ width: '90%' }}>
                              <TextInput error={this.state.errors.password} labelText='Password' placeholder='Password' placeholderTextColor="#aab2bd" returnKeyType="next" keyboardType='default' secureTextEntry={true}
                                underlineColorAndroid="transparent" style={{ color: "#414253", fontFamily: Fonts.MontserratMedium, fontSize: 15, borderBottomColor:'#f2f3f7' }}
                                onChangeText={(text) => this.textChange('password', text )}
                              />
                            </View>
                          </View>

                          { this.state.first_name ?
                            <Text style = {{ fontSize: 12, color: '#aab2bd', fontFamily: Fonts.MontserratMedium,  paddingBottom: (Platform.OS === 'ios' ? 15 : 0), }}>First name</Text>
                            : <View></View>
                          }
                          <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 30  }}>
                            <View style = {{ width: '10%' , marginBottom: (Platform.OS === 'ios' ? 10 : 0) , marginRight: (Platform.OS === 'ios' ? 10 : 0) }}>
                              { this.state.first_name ?
                              <Image source = { require('./images/name.png') } style={{ marginTop: (Platform.OS === 'ios' ? 0 : 15), tintColor: '#414253' }}/>
                              : <Image source = { require('./images/name.png') } style={{ marginTop: (Platform.OS === 'ios' ? 0 : 15) }}/>
                              }
                            </View>
                            <View style = {{ width: '90%' }}>
                              <TextInput error={this.state.errors.first_name} labelText='First Name' placeholder='First name' placeholderTextColor="#aab2bd" returnKeyType="next" keyboardType='default' secureTextEntry={false}
                                underlineColorAndroid="transparent" style={{ color: "#414253", fontFamily: Fonts.MontserratMedium, fontSize: 15, borderBottomColor:'#f2f3f7' }}
                                onChangeText={(text) => this.textChange('first_name', text)} />
                            </View>
                          </View>

                          { this.state.last_name ?
                            <Text style = {{ fontSize: 12, color: '#aab2bd', fontFamily: Fonts.MontserratMedium,  paddingBottom: (Platform.OS === 'ios' ? 15 : 0), }}>Last name</Text>
                            : <View></View>
                          }
                          <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 30  }}>
                            <View style = {{ width: '10%' , marginBottom: (Platform.OS === 'ios' ? 10 : 0) , marginRight: (Platform.OS === 'ios' ? 10 : 0) }}>
                              { this.state.last_name ?
                              <Image source = { require('./images/name.png') } style={{ marginTop: (Platform.OS === 'ios' ? 0 : 15), tintColor: '#414253' }}/>
                              : <Image source = { require('./images/name.png') } style={{ marginTop: (Platform.OS === 'ios' ? 0 : 15) }}/>
                              }
                            </View>
                            <View style = {{ width: '90%' }}>
                              <TextInput error={this.state.errors.last_name} labelText='Surname' placeholder='Last name' placeholderTextColor="#aab2bd" returnKeyType="next" keyboardType='default' secureTextEntry={false}
                                underlineColorAndroid="transparent" style={{ color: "#414253", fontFamily: Fonts.MontserratMedium, fontSize: 15, borderBottomColor:'#f2f3f7' }}
                                onChangeText={(text) => this.textChange('last_name', text)} />
                            </View>
                          </View>

                          { this.state.gmc_number ?
                            <Text style = {{ fontSize: 12, color: '#aab2bd', fontFamily: Fonts.MontserratMedium,  paddingBottom: (Platform.OS === 'ios' ? 15 : 0), }}>GMC number</Text>
                            : <View></View>
                          }
                          <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 30  }}>
                            <View style = {{ width: '10%' , marginBottom: (Platform.OS === 'ios' ? 10 : 0) , marginRight: (Platform.OS === 'ios' ? 10 : 0) }}>
                              { this.state.gmc_number ?
                              <Image source = { require('./images/gms_icon.png') } style={{ marginTop: (Platform.OS === 'ios' ? 0 : 15), tintColor: '#414253' }}/>
                              : <Image source = { require('./images/gms_icon.png') } style={{ marginTop: (Platform.OS === 'ios' ? 0 : 15), justifyContent: 'center', alignItems: 'center' }}/>
                              }
                            </View>
                            <View style = {{ width: '90%' }}>
                              <TextInput error={this.state.errors.gmc_number} labelText='GMC Number' placeholder='GMC number' placeholderTextColor="#aab2bd" returnKeyType="next" keyboardType='default' secureTextEntry={false}
                                underlineColorAndroid="transparent" style={{ color: "#414253", fontFamily: Fonts.MontserratMedium, fontSize: 15, borderBottomColor:'#f2f3f7' }}
                                onChangeText={(text) => this.textChange('gmc_number', text)} />
                            </View>
                          </View>

                          { this.state.Profession ?
                            <Text style = {{ fontSize: 12, color: '#aab2bd', fontFamily: Fonts.MontserratMedium,  paddingBottom: (Platform.OS === 'ios' ? 15 : 0), }}>Profession</Text>
                            : <View></View>
                          }
                          <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 20 }}>
                            <View style = {{ width: '10%' , marginBottom: (Platform.OS === 'ios' ? 10 : 0) , marginRight: (Platform.OS === 'ios' ? 10 : 0) }}>
                              { this.state.Profession ?
                              <Image source = { require('./images/profession.png') } style={{ marginTop: (Platform.OS === 'ios' ? 7 : 15), tintColor: '#414253' }}/>
                              : <Image source = { require('./images/profession.png') } style={{ marginTop: (Platform.OS === 'ios' ? 7 : 15), justifyContent: 'center', alignItems: 'center' }}/>
                              }
                            </View>
                            <View style = {{ width: '82%' }}>
                              <ModalDropdown
                                defaultValue= 'Profession'
                                textStyle={signupstyles.dropDownText}
                                dropdownTextStyle={signupstyles.dropDownText}
                                underlineColorAndroid="transparent" 
                                style={[signupstyles.dropDownButton], { color: "#414253", fontFamily: Fonts.MontserratMedium, fontSize: 15, borderBottomColor:'#f2f3f7', marginTop: 10 }}
                                onSelect={(value) => {
                                  this.setState({
                                    Profession: value,
                                  });
                                }}
                                options={this.state.profItems} 
                              />
                            </View>
                            <View style = {{ width: '8%', marginTop: 10 }}>
                              { this.state.Profession ?
                                <View></View>
                                : <Image source={this.state.arrowSource} style = {{ width: 15, height: 15 }}/>
                              }
                            </View>
                          </View>
                          { this.state.city ?
                          <Text style = {{ fontSize: 12, color: '#aab2bd', fontFamily: Fonts.MontserratMedium,  paddingBottom: (Platform.OS === 'ios' ? 15 : 0), }}>City</Text>
                          : <View></View>
                          }
                          <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 30  }}>
                            <View style = {{ width: '10%' , marginBottom: (Platform.OS === 'ios' ? 10 : 0) , marginRight: (Platform.OS === 'ios' ? 10 : 0) }}>
                              { this.state.city ?
                              <Image source = { require('./images/city.png') } style={{ marginTop: (Platform.OS === 'ios' ? 0 : 15), tintColor: '#414253' }}/>
                              : <Image source = { require('./images/city.png') } style={{ marginTop: (Platform.OS === 'ios' ? 0 : 15) }}/>
                              }
                            </View>
                            <View style = {{ width: '90%' }}>
                              <TextInput error={this.state.errors.city} labelText='City' placeholder='City' placeholderTextColor="#aab2bd" keyboardType='default' returnKeyType="next" secureTextEntry={false}
                                underlineColorAndroid="transparent" style={{ color: "#414253", fontFamily: Fonts.MontserratMedium, fontSize: 15, borderBottomColor:'#f2f3f7' }}
                                onChangeText={(text) => this.textChange('city', text)} />
                            </View>
                          </View>
                          
                          { this.state.postcode ?
                            <Text style = {{ fontSize: 12, color: '#aab2bd', fontFamily: Fonts.MontserratMedium,  paddingBottom: (Platform.OS === 'ios' ? 15 : 0), }}>PostCode</Text>
                            : <View></View>
                          }
                          <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 30  }}>
                            <View style = {{ width: '10%' , marginBottom: (Platform.OS === 'ios' ? 10 : 0) , marginRight: (Platform.OS === 'ios' ? 10 : 0) }}>
                              { this.state.postcode ?
                              <Image source = { require('./images/post_code.png') } style={{ marginTop: (Platform.OS === 'ios' ? 0 : 15), tintColor: '#414253' }}/>
                              : <Image source = { require('./images/post_code.png') } style={{ marginTop: (Platform.OS === 'ios' ? 0 : 15) }}/>
                              }
                            </View>
                            <View style = {{ width: '90%' }}>
                              <TextInput error={this.state.errors.postcode} labelText='PostCode' placeholder='PostCode' placeholderTextColor="#aab2bd" keyboardType='default' returnKeyType="next" secureTextEntry={false}
                                underlineColorAndroid="transparent" style={{ color: "#414253", fontFamily: Fonts.MontserratMedium, fontSize: 15, borderBottomColor:'#f2f3f7' }}
                                onChangeText={(text) => this.textChange('postcode', text)} />
                            </View>
                          </View>
                        </View>

                      <View style={{ flexDirection: 'row' , paddingHorizontal: 30 }}>
                        <View style={{ marginVertical: 0, paddingTop: 15, width: 30 }} >
                          <CheckboxFormX
                            style={signupstyles.checkBox}
                            dataSource={this.state.mockData}
                            itemShowKey="label"
                            itemCheckedKey="RNchecked"
                            iconSize={25}
                            textStyle={{ width: 0 }}
                            iconColor='#2ee5b5'
                            formHorizontal={true}
                            labelHorizontal={false}
                            onChecked={() => this.onChangeCheck()}
                          />
                        </View>

                        <Text style={signupstyles.termsMsg}>By ticking the box you agree to our  
                          <Text style={signupstyles.termsMsgBold}> Terms and Conditions.</Text></Text>
                      </View>

                      {/* <HideWithKeyboard style={{ flex: 2 }}> */}
                        <View style={{ flex: 1, marginBottom: 20 }}>
                          <TouchableOpacity style={signupstyles.signUpBtnArea} onPress={() => {
                            // this.props.navigation.navigate('MainNavigation');
                            if (this.firstSlideValidate()) {
                              // this.setState({ 'spinner': true });
                              BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
                            }
                          }}>
                            <Text style={signupstyles.buttonText}>COMPLETE SIGN UP</Text>
                          </TouchableOpacity>

                        </View>
                      {/* </HideWithKeyboard> */}
                      
                      <View style={{backgroundColor: 'white', paddingTop:20}}><Text style={styles.appVersion}>v.{packageJson.version}</Text></View>    
                    
                  {/* </Swiper> */}
                </View>

              </View>
              </ScrollView>
              {this.state.profItemsVisible == true && 
                  <CustomMultiSelectDropDown 
                  title={'Select Qualification'} 
                  fieldName= 'qualification'  
                  sortOption={this.state.profItemsOption} 
                  visible={this.state.profItemsVisible} 
                  onSelectItem={(value) => {
                              this.setState({
                                Profession: value,
                              });
                            }}
                  // onClose={() => this.onClose('qualification')}
                  selectedValue= {this.state.qualification} /> 
              }
            </SafeAreaView>
      </TouchableWithoutFeedback>
</KeyboardAvoidingView>
    );
  }


}
