import React, { Component } from 'react';
import {
    View, StyleSheet, Image, Text, TextInput,
    TouchableOpacity, SafeAreaView, StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback,
    Keyboard, AsyncStorage, Platform, ScrollView
} from 'react-native';
import { styles, loginformStyles, footerStyles } from './styles';
import { API_URL, LOGIN_URL, IMAGE_EXISTS, BASE_URL } from '../../config/shared';
import validate from 'validate.js';
import DropdownAlert from 'react-native-dropdownalert';
import { Header, Left, Body, Right, Icon, Button } from 'native-base';
import { Services } from '../../services/services';
import { ServiceParams } from '../../services/serviceParams';
import DropDownHolder from "../../components/dropDown/dropDownHolder";
import packageJson from '../../../package.json';

import Spinner from 'react-native-loading-spinner-overlay';

const constraints = {
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
    },
}

export default class Login extends Component {

    static navigationOptions = ({ navigation }) => ({
        headerBackImage: null,
    })

    constructor(props) {
        super(props);

        this.state = {
            userEmail: '',
            password: '',
            spinner: true,
            imageExists: false
        };

        this.setServices = new Services();
    }

    componentDidMount = async () => {
        await AsyncStorage.setItem('accessToken', '0');
        
        AsyncStorage.multiRemove([
            'userEmail',
            'firstName',
            'lastName',
            'gmcNumber',
            'address',
            'postCode',
            'city',
            'qualification',
            'language',
            'smartCard',
            'itSystem'
        ]);
        await AsyncStorage.multiGet(["currentLatitude","currentLongitude", "postCode"]).then(response => {this.setState({"currentLatitude" : response[0][1],});
                                                                                              this.setState({"currentLongitude" : response[1][1]});
                                                                                              this.setState({"postCode" : response[2][1]});}); 
                                                                                              
        if(this.state.currentLatitude == '' || this.state.currentLongitude == '' ) {
            await navigator.geolocation.getCurrentPosition( 
                async (position) => { 
                    await AsyncStorage.multiSet([
                        ['currentLatitude', JSON.stringify(position.coords.latitude)],
                        ['currentLongitude', JSON.stringify(position.coords.longitude)]
                    ], 
                    (err) => {console.log(err)});
                },
                async (error) => {
                    if(Platform.OS === 'android'){
                        this.requestLocationPermission();
                    }else{
                        this.requestLocationPermission();
                    }
                    console.log('error ', error);
                    await AsyncStorage.multiSet([
                        ['currentLatitude', ''],
                        ['currentLongitude', '']
                    ], 
                    (err) => {console.log(err)});
                },
                {  enableHighAccuracy: false, timeout: 8000, maximumAge: 10000  },
            );
            this.setState({ 'spinner': false });
        }else {
            this.setState({ 'spinner': false });
        }
    }


    requestLocationPermission = async () => {
        try {
            const hasPermission = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
              );

            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                'title': 'Location Permission',
                'message': 'This App needs access to your location ' +
                           'so we can know where you are.'
              }
            );
            
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.log("You can use locations ");
            } else {
              console.log("Location permission denied")
            }
          } catch (err) {
            console.log('error ', err)
          }
    }

    forceClose() {
        this.dropdown.close();
    }


    render() {
        const { goBack } = this.props.navigation;
        return (
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
                <View style={styles.container}>
                    <View style={styles.logoHeader}>
                        <Image  source={require('./images/logo.png')}></Image>
                    </View>
                    <View style={styles.headerContainer}>
                        <View style={styles.leftView}>
                            <TouchableOpacity>
                                <Text style={loginformStyles.logoHeader}>Login</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.rightView} >
                            <TouchableOpacity onPress={() => {this.props.navigation.navigate('SignUpPage');}}>
                                <Text style={loginformStyles.logoHeaderLink}>Sign Up </Text>   
                            </TouchableOpacity>                           
                        </View>            
                        <View style = {{ width: '10%' }}></View> 
                    </View>
                    {/* <KeyboardAvoidingView behavior='padding'  style={{ flex:1}}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
                        <SafeAreaView style={styles.container}>
                            <ScrollView>
                                <View style={loginformStyles.bodyContainer}>  
                                    <View style={loginformStyles.formContainer}>                                        
                                        {/* <View style={[loginformStyles.inputMainContainer]}>
                                            <View style={loginformStyles.inputImageContainer}><Image  source={require('./images/emailIcon.png')}></Image></View>
                                            <View style={loginformStyles.inputFullTextContainer}>
                                                <TextInput
                                                    id='userEmail'
                                                    onChangeText={(userEmail) => this.setState({ userEmail })}
                                                    placeholder='Your e-mail'
                                                    placeholderTextColor='#AAB2BD'
                                                    keyboardType='email-address'
                                                    returnKeyType='next'
                                                    autoCorrect={false}
                                                    style={loginformStyles.input}
                                                    value={this.state.userEmail}
                                                    underlineColorAndroid="transparent" />
                                            </View>
                                        </View> */}

                                        <View style={{ marginTop: 20}}> 
                                            { (this.state.userEmail != null && this.state.userEmail != '') &&
                                                <Text style={ loginformStyles.inputLabel }>Your e-mail</Text>
                                            } 
                                            <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                                <View style = {{ width: '10%', alignContent: 'flex-start', justifyContent:'center', marginBottom: 10 , }}>
                                                    { (this.state.userEmail != null && this.state.userEmail != '')?
                                                    <Image source = { require('./images/mail_sel.png') } style={{ width: 20, height: 20 }}/>
                                                    : <Image source = { require('./images/mail.png') } style={{ width: 20, height: 20}}/>
                                                    }
                                                </View>
                                                <View style = {{ width: '90%', alignContent: 'flex-start' , justifyContent:'center', marginBottom: 10 ,  }}>
                                                    <TextInput
                                                        id='userEmail'
                                                        onChangeText={(userEmail) => this.setState({ userEmail })}
                                                        placeholder='Your e-mail'
                                                        placeholderTextColor='#AAB2BD'
                                                        keyboardType='email-address'
                                                        returnKeyType='next'
                                                        autoCorrect={false}
                                                        style={loginformStyles.input}
                                                        value={this.state.userEmail}
                                                        underlineColorAndroid="transparent" />
                                                </View>
                                            </View> 
                                        </View>  
                
                                        {/* <View style={loginformStyles.inputMainContainer}>
                                            <View style={loginformStyles.inputImageContainer}><Image  source={require('./images/lockIcon.png')}></Image></View>
                                            <View style={loginformStyles.inputHalfTextContainer}>
                                                <TextInput
                                                    id='password'
                                                    onChangeText={(password) => this.setState({ password })}
                                                    placeholder="Password"
                                                    placeholderTextColor='#AAB2BD'
                                                    returnKeyType='go'
                                                    autoCorrect={false}
                                                    secureTextEntry
                                                    style={loginformStyles.input}
                                                    value={this.state.password} />
                                            </View>
                                            <View style={loginformStyles.inputRightContainer}>
                                                <TouchableOpacity style={footerStyles.loginTouchable} onPress={() => {
                                                    this.props.navigation.navigate('ForgotPassword');
                                                }}>
                                                    <Text style={footerStyles.fpwLink}>Forgot Password ?</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>  */}
                                        <View style={{ marginTop: 20}}> 
                                            { (this.state.password != null && this.state.password != '') &&
                                                <Text style={ loginformStyles.inputLabel }>Password</Text>
                                            } 
                                            <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                                <View style = {{ width: '10%', alignContent: 'flex-start', justifyContent:'center', marginBottom: 10 , }}>
                                                    { (this.state.password != null && this.state.password != '')?
                                                    <Image source = { require('./images/password_sel.png') } style={{ width: 20, height: 22 }}/>
                                                    : <Image source = { require('./images/lockIcon.png') } style={{ width: 20, height: 22}}/>
                                                    }
                                                </View>
                                                <View style = {{ width: '35%', alignContent: 'flex-start' , justifyContent:'center', marginBottom: 10 ,  }}>
                                                    <TextInput
                                                        id='password'
                                                        onChangeText={(password) => this.setState({ password })}
                                                        placeholder="Password"
                                                        placeholderTextColor='#AAB2BD'
                                                        returnKeyType='go'
                                                        autoCorrect={false}
                                                        secureTextEntry
                                                        style={loginformStyles.input}
                                                        value={this.state.password} />
                                                </View>
                                                <View style = {{ width: '55%', alignContent: 'flex-start' , justifyContent:'center', marginBottom: 10 , textAlign: "right", }}>
                                                    <TouchableOpacity style={footerStyles.loginTouchable} onPress={() => {
                                                        this.props.navigation.navigate('ForgotPassword');
                                                    }}>
                                                        <Text style={footerStyles.fpwLink}>Forgot Password ?</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View> 
                                        </View> 
                                    </View>   
                                    <View style={footerStyles.footerContainer}>
                                        <View style={{ flex: 1, }}>
                                            <TouchableOpacity style={loginformStyles.loginTouchable} onPress={() => {
                                                this.setState({ 'spinner': true });
                                                this.loginSubmitHandler();
                                            }}>
                                                <Text style={loginformStyles.loginButton}>LOGIN</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={loginformStyles.signUpButtonArea}>
                                            <Text style={loginformStyles.signUpWording}>Don't have an account?</Text>
                                            <TouchableOpacity style={loginformStyles.signUpTouchable} onPress={() => {
                                                this.props.navigation.navigate('SignUpPage');
                                            }}>
                                                <Text style={loginformStyles.signUpButton}>Create an account</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>     
                                    <View style={{backgroundColor: 'white', paddingTop:20}}><Text style={styles.appVersion}>v.{packageJson.version}</Text></View>                              
                                </View>
                            </ScrollView>
                        </SafeAreaView>
                        {/* </TouchableWithoutFeedback>
                    </KeyboardAvoidingView> */}
                </View>
            </SafeAreaView>
        );
    }

    loginSubmitHandler = () => {
        var isValidForm = validate({ userEmail: this.state.userEmail, password: this.state.password }, constraints, { format: "detailed" });

        if (isValidForm != undefined) {
            this.setState({ 'spinner': false });
            DropDownHolder.dropDown.alertWithType('error', 'Error', (isValidForm[0]).error);
            // console.log(isValidForm);
        } else {
            // console.log(isValidForm);
            this.setServices.postService(LOGIN_URL, ServiceParams.getLoginDataParams(this.state.userEmail, this.state.password))
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
        }
    }
}


