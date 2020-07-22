import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, Text, TextInput, Image, 
    TouchableOpacity, BackHandler, SafeAreaView, ScrollView, ImageBackground, AsyncStorage } from 'react-native'
import { Header, Left, Body, Right, Icon, Button, Tabs, Tab, ScrollableTab  } from 'native-base';
import validate from 'validate.js';
import Spinner from 'react-native-loading-spinner-overlay';
import { TextInputMask } from 'react-native-masked-text';

import { profileStyles, myprofilestyles } from './styles';
import CustomHeader from '../../../components/customHeader/header';
import { API_URL, PAYMENT_UPDATE } from '../../../config/shared';
import { ServiceParams } from '../../../services/serviceParams';
import { Services } from '../../../services/services';
import DropDownHolder from "../../../components/dropDown/dropDownHolder";
import {Fonts} from '../../../config/font';


const constraintsPaymentDetails = {

    accountHolderName: {
        presence: {
            allowEmpty: false,
            message: "cannot be blank."
        },
    },
    sortCode: {
        presence: {
            allowEmpty: false,
            message: "cannot be blank."
        },
        numericality: {
            onlyInteger: true,
            notInteger: "must be numbers.",
            greaterThan: 99999,
            notGreaterThan: 'must be 6 number.',
            lessThanOrEqualTo: 999999,
            notLessThanOrEqualTo: "must be 6 number."
        }
    },
    accountNo: {
        presence: {
            allowEmpty: false,
            message: "cannot be blank."
        },
        length: {
            is: 9,
            wrongLength: 'must be 8 number.'
        }
    },
  }

export default class PaymentDetails extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerBackImage: null,
    })
    constructor(){
        super()
        this.state = {
            sortCode: null,
            accountNo: '000000000000000',
            accountHolderName: null,
            imageWidth: null,
            imageHeight: null,
            spinner: true,
            userId: null,
            displayAccount: null,
        };
        this.setServices = new Services();
    }

    componentDidMount = async () => {
        this.getScaledHeight();
        await AsyncStorage.multiGet(["sortCode", "accountNo", "accountHolderName", "user_id"]).then(response => { this.setState({"sortCode" : response[0][1]});
                                                                                    this.setState({"accountNo" : (response[1][1] != '' ? response[1][1] : '')});
                                                                                    this.setState({"accountHolderName" : response[2][1]});
                                                                                    this.setState({"userId" : response[3][1]});
                                                                                    this.setState({ displayAccount: this.addDisplayAccount()});
                                                                                });                       
        this.setState({ 'spinner': false });    
    }

    addDisplayAccount = (AccountNumber) => {
        if(AccountNumber != undefined) {
            var accountNoArray = AccountNumber.split(' ');
        }
        else {
            var accountNoArray = this.state.accountNo.split(' ');
        }
        let noArraySize = accountNoArray.length - 1 ;

        let items = accountNoArray.map((item, key) => {
            return <Text key={key} style={ (key == noArraySize ? profileStyles.cardNumberLastItem : profileStyles.cardNumberItem) }>  {item} </Text>
        });
        return items;
    }

    getScaledHeight = () => {   
        let width = Dimensions.get('window').width - 30;
        let ratio = width / 169;
        this.setState({
                imageWidth: 169 * ratio,
                imageHeight: 92 * ratio
        });
    }

    paymentDetailsHandler = async () => {

        var isValidInfo= validate({ sortCode: this.state.sortCode, 
                                    accountNo: this.state.accountNo,
                                    accountHolderName: this.state.accountHolderName
                                    },
            constraintsPaymentDetails, { format: "detailed" });

        if (isValidInfo != undefined) {
            this.setState({ 'spinner': false });
            DropDownHolder.dropDown.alertWithType('error', 'Error', (isValidInfo[0]).error);
            return false;
        } else {
            this.setServices.postService(PAYMENT_UPDATE+this.state.userId, ServiceParams.getPaymentDetails(this.state.sortCode,
                this.state.accountNo,
                this.state.accountHolderName))
            .then(async (responseJson) => {      
                if (responseJson.error == 0) {
                    DropDownHolder.dropDown.alertWithType('success', 'Success', responseJson.info);

                    await AsyncStorage.multiSet([
                                                ['sortCode', (this.state.sortCode != null ? this.state.sortCode : '')],
                                                ['accountNo', this.state.accountNo != null ? this.state.accountNo : ''],
                                                ['accountHolderName', this.state.accountHolderName!= null ? this.state.accountHolderName : ''],
                                                ], 
                    (err) => {console.log(err)});  
                    this.setState({ displayAccount: this.addDisplayAccount()});
                } else {
                    DropDownHolder.dropDown.alertWithType('error', 'Error', responseJson.info);
                }

                this.setState({ 'spinner': false });
            }, (error) => { 
                this.setState({ 'spinner': false });
                DropDownHolder.dropDown.alertWithType('error', 'Error', ' results:' + error);
            })
        }

        

    }

  render() {
    const { goBack } = this.props.navigation;
    return (
      <View>            
        <ScrollView  style={ profileStyles.container}>
            <Spinner
                visible={this.state.spinner}
                textContent={'Loading...'}
                textStyle={profileStyles.spinnerTextStyle}
            />
            {/* <CustomHeader
                goBack={goBack.bind(this)}
                headerTitle={'Payment Details'}
                titleFontSize={15}
            /> */}
            <View style={{  height: (Dimensions.get('window').height) * 0.07}}>
                {/* <View style={{ flex: 1, flexDirection: 'row', marginTop:5,  }}>
                    <TouchableOpacity onPress={() => { goBack(); }}>
                        <Image source = { require('./images/backIcon.png') } style = {{ width: 16, height: 16, }}/>
                    </TouchableOpacity>      
                    <Text style={{ fontSize: 18, color: '#414253', fontFamily: Fonts.MontserratBold, paddingLeft: 10 }}>Payment Details</Text>                                      
                </View> */}
                <View style={{ width: '90%',marginTop:5, }}>
                    <TouchableOpacity onPress={() => { goBack() }} style={{ flexDirection: 'row',  }}>
                        <View style={{justifyContent: 'center', paddingRight: 10}}>
                        <Image source = { require('./images/backIcon.png') } style = {{ width: 16, height: 16, }}/>
                        </View>
                        <View  style={{justifyContent: 'center', paddingRight: 10}}>
                            <Text style={profileStyles.blackHeaderTitle}>Payment Details</Text>
                        </View>                    
                    </TouchableOpacity>
                </View>
            </View>

            <View style={ profileStyles.accountImage }> 
                <ImageBackground
                borderRadius={10}
                source={require('./images/visa-card.png')}
                style={{
                    height: this.state.imageHeight,
                    width: this.state.imageWidth,
                }}
                >
                    <View style={ profileStyles.accountArea }>
                        <View style={{ flexDirection: 'row',width: '100%',paddingHorizontal: 25 }}>{  this.state.displayAccount }</View>
                        <View style={ profileStyles.accountDetails }>
                            <View style={ profileStyles.accountName }>
                                { this.state.accountHolderName ?
                                    <Text style={ profileStyles.accountNameText }>{ this.state.accountHolderName.toUpperCase() }</Text>
                                    : <Text style={ profileStyles.accountNameText }>{ this.state.accountHolderName }</Text>
                                }
                                
                            </View>
                            <View style={ profileStyles.accountCode }>
                                <Text style={ profileStyles.accountCodeText }>{ this.state.sortCode }</Text>
                            </View>
                        </View>
                    </View>

                </ImageBackground>
            </View>
            <View style={ [profileStyles.accountUpdateArea, { paddingHorizontal: 5 }] }>
                <View style={{ marginTop: 20}}>
                    <Text style={ profileStyles.inputLabel }>Account name</Text>
                    <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                        <View style = {{ width: '100%', alignContent: 'flex-start' , justifyContent:'center',  }}>
                            <TextInput
                                id='accountHolderName'
                                onChangeText={(accountHolderName) => this.setState({ accountHolderName })}
                                placeholder=''
                                placeholderTextColor='#c6c6c9'
                                returnKeyType='next'
                                autoCorrect={false}
                                style={{color: "#414253",height:30,justifyContent:'center',paddingBottom:1, fontFamily: Fonts.MontserratMedium, fontSize: 15, paddingTop:0,  paddingLeft: 0,}}
                                value={this.state.accountHolderName} />
                        </View>
                    </View>
                </View>

                <View style={{ marginTop: 20}}>
                    <Text style={ profileStyles.inputLabel }>Sort code</Text>
                    <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                        <View style = {{ width: '100%', alignContent: 'flex-start' , justifyContent:'center',  }}>
                            <TextInput
                                id='sortCode'
                                onChangeText={(sortCode) => this.setState({ sortCode })}
                                placeholder=""
                                placeholderTextColor='#c6c6c9'
                                returnKeyType='next'
                                keyboardType={'numeric'}
                                autoCorrect={false}
                                style={{color: "#414253",height:30,justifyContent:'center',paddingBottom:1, fontFamily: Fonts.MontserratMedium, fontSize: 15, paddingTop:0,  paddingLeft: 0,}}
                                value={this.state.sortCode} />
                        </View>
                    </View>
                </View>
                
                <View style={{ marginTop: 20}}>
                    <Text style={ profileStyles.inputLabel }>Account number</Text>
                {/* <TextInput
                    id='accountNo'
                    keyboardType={"numeric"}
                    onChangeText={(accountNo) => this.setState({ accountNo })}
                    placeholder="Account Number"
                    placeholderTextColor='#c6c6c9'
                    returnKeyType='next'
                    autoCorrect={false}
                    style={profileStyles.input}
                    value={this.state.accountNo} /> */}
                    <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                        <View style = {{ width: '100%', alignContent: 'flex-start' , justifyContent:'center', marginBottom: 10 ,  }}>
                            <TextInputMask
                                onChangeText={(accountNo) => [this.setState({accountNo}), this.setState({ displayAccount: this.addDisplayAccount(accountNo)})]}
                                type={'credit-card'}
                                style={{color: "#414253",height:30,justifyContent:'center',paddingBottom:1, fontFamily: Fonts.MontserratMedium, fontSize: 15, paddingTop:0,  paddingLeft: 0,}}
                                options={{
                                    format: '9999  9999   9999   9999'
                                }}
                                value={this.state.accountNo}
                            />
                        </View>
                    </View>
                </View>
                    
            </View>
            <View style={profileStyles.footerContainer}>
                <View style={profileStyles.loginButtonArea}>
                    <TouchableOpacity style={profileStyles.loginTouchable} onPress={() => {                        
                        this.setState({ 'spinner': true });
                        this.paymentDetailsHandler();
                    }}>
                        <Text style={profileStyles.loginButton}>SAVE</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
      </View>
    )
  }
}