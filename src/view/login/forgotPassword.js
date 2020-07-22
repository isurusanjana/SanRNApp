import React, { Component } from 'react';
import {
    View, StyleSheet, Image, Text, TextInput,
    TouchableOpacity, SafeAreaView, StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback,
    Keyboard, ScrollView, Dimensions, Platform, NativeModules
} from 'react-native';
import { styles, loginformStyles, footerStyles } from './styles';
import { FORGET_URL } from '../../config//shared';
import validate from 'validate.js';
import { Header, Left, Body, Right, Icon, Button } from 'native-base';
import { Services } from '../../services/services';
import { ServiceParams } from '../../services/serviceParams';
import Spinner from 'react-native-loading-spinner-overlay';
import DropDownHolder from "../../components/dropDown/dropDownHolder";
import { Fonts } from '../../config/font';

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;
const constraints = {
    email: {
        presence: {
            allowEmpty: false,
            message: "Cannot be blank."
        },
        email: {
            message: '^Please enter a valid email address'
        },
        exclusion: {
            within: ["email"],
            message: "^'%{value}' is not allowed"
        }
    },
}

export default class ForgotPassword extends Component {
    // static navigationOptions = ({navigation}) => ({
    //     title: "Forgot Password",
    //     headerBackImage: null,
    //     headerRight: (
    //       <Text onPress={() => navigation.goBack()} style={{ color: 'green' , marginRight: 5 }}> Cancel </Text>
    //     ),   
    //     headerLeft: null,
    // })


    constructor(props) {
        super(props);

        this.state = {
            email: '',
            spinner: false
        };

        this.setServices = new Services();
    }

    goBackPage() {
        this.props.navigation.goBack()
    }

    forceClose() {
        this.dropdown.close();
    }

    render() {
        const { goBack } = this.props.navigation;
        return (
            <View style={{ flex: 1, marginTop: STATUSBAR_HEIGHT, }}>
                <StatusBar
                    backgroundColor="#FFFFFF"
                    barStyle="dark-content"
                />
                {/* <Header elevation={3} transparent>
                    <StatusBar
                        backgroundColor="#FFFFFF"
                        barStyle="dark-content"
                    />
                    <Left>
                        <Button hasText transparent onPress={() => { goBack() }}>
                            <Icon name='arrow-back' style={{ fontSize: 30, color: 'black' }} />
                            <Text style={{ fontSize: 15, color: 'black' }}>  Back</Text>
                        </Button>

                    </Left>
                    <Body>
                    </Body>
                    <Right>
                    </Right>
                </Header> */}
                <ScrollView  style={{paddingTop: 10, paddingHorizontal: 20,}}>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Loading...'}
                    textStyle={styles.spinnerTextStyle}
                />
                <View style={{  height: (Dimensions.get('window').height) * 0.1,}}>
                    <View style={{ flex: 1, flexDirection: 'row',}}>
                        <View style={{flexDirection: 'row', alignContent: 'flex-start'}}>
                            <TouchableOpacity onPress={() => { goBack(); }}>
                                <Image source = { require('./images/backIcon.png') } style = {{ width: 18, height: 18, marginTop: 3 }}/>
                            </TouchableOpacity>      
                            <Text style={{ fontSize: 18, color: '#414253', fontFamily: Fonts.MontserratBold, paddingLeft: 20 }}>Back</Text>
                        </View>   
                    </View>
                </View>
                {/* <KeyboardAvoidingView behavior='padding' style={styles.keyAvoidContainer}>
                    <TouchableWithoutFeedback
                        onPress={Keyboard.dismiss} > */}
                    
                        <View style={styles.container}>
                            <View style={styles.headerContainer}>
                                <Text style={loginformStyles.logoHeader}>Forgot password</Text>
                            </View>
                            <View style={loginformStyles.forgotFormContainer}>
                                <View style={loginformStyles.container}>
                                    <TextInput
                                        id='email'
                                        onChangeText={(email) => this.setState({ email })}
                                        placeholderTextColor='#c6c6c9'
                                        placeholder='Email'
                                        keyboardType='email-address'
                                        returnKeyType='next'
                                        autoCorrect={false}
                                        style={loginformStyles.inputForgotPassword} />

                                </View>
                            </View>
                            <View style={footerStyles.forgotFooterContainer}>
                                <View style={footerStyles.container}>
                                    <TouchableOpacity style={loginformStyles.loginTouchable} onPress={() => {
                                        this.setState({ 'spinner': true });
                                        this.forgotPasswordHandler();
                                    }}>
                                        <Text style={footerStyles.submitButton}>SUBMIT</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    {/* </TouchableWithoutFeedback>
                </KeyboardAvoidingView> */}

            </View>



        );
    }

    forgotPasswordHandler = () => {
        var isValidEmail = validate({ email: this.state.email }, constraints, { format: "detailed" });

        if (isValidEmail != undefined) {
            this.setState({ 'spinner': false });
            DropDownHolder.dropDown.alertWithType('error', 'Error', (isValidEmail[0]).error);
        } else {
            this.setServices.postService2(FORGET_URL, ServiceParams.getForgetDataParams(this.state.email))
                .then((responseJson) => { 
                    this.setState({ 'spinner': false });
                    if (responseJson.error == 0) {
                        DropDownHolder.dropDown.alertWithType('success', 'Success', responseJson.info);
                    } else {
                        DropDownHolder.dropDown.alertWithType('error', 'Error', responseJson.info);
                    }
                }, (error) => {
                    this.setState({ 'spinner': false });
                    DropDownHolder.dropDown.alertWithType('error', ' results:' + error);
                })
        }



    }
}
