import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Text, Image, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback,Keyboard,   
  TouchableOpacity, BackHandler, SafeAreaView, ScrollView, ImageBackground, AsyncStorage,  NativeModules, Platform, StatusBar  } from 'react-native'
import { Header, Left, Body, Right, Icon, Button, Tabs, Tab, ScrollableTab  } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import validate from 'validate.js';

import { messageStyles } from './styles';
import CustomHeader from '../../../components/customHeader/header';
import DropDownHolder from "../../../components/dropDown/dropDownHolder";
import { GET_MESSAGE, SEND_MESSAGE, CHECK_DOCUMENTS, READ_MESSAGE, BASE_URL} from '../../../config/shared';
import { Services } from '../../../services/services';
import { ServiceParams } from '../../../services/serviceParams';
import { Fonts } from '../../../config/font';


const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 10 : StatusBarManager.HEIGHT;
const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[{ backgroundColor, height: STATUSBAR_HEIGHT }]}>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
);

const constraintsExpense = {
  messageField: {
      presence: {
          allowEmpty: false,
          message: "cannot be blank."
      },
  },
 
}

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

class DetailMessages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: 0,
            imageExists: null,
            spinner: true,
            messageData: [],
            objectLength: 0,
            imageWidth: 60,
            imageHeight: 60,
            sendTo: null,
            msgName: '',
            profileImage: '',
            expectedRows: 8,
            startRow: 0,
            today: moment().format('DD-MM-YYYY'),
            yesterday: moment().subtract(1, 'day').format('DD-MM-YYYY'),
            messageField: '',
            previousDate: null,
            defaultProfImage: '',
            practiceName: null,
            lastCreatedDate: null,
            practiceId: 0
        };
        this.setServices = new Services();
    }

    componentDidMount = async () => {
        await AsyncStorage.multiGet(["user_id", "defaultProfImage", "basePath"]).then(response => {this.setState({"userId" : response[0][1]});this.setState({"defaultProfImage" :  response[2][1] + response[1][1]});});
        await this.checkDocument();
        await this.setState({ practiceId: this.props.navigation.getParam('practiceId') });
        await this.setState({ sendTo: this.props.navigation.getParam('sendTo') });
        await this.setState({ msgName: this.props.navigation.getParam('msgName') });
        await this.setState({ profileImage: this.props.navigation.getParam('profileImage') });
        await this.setState({ lastCreatedDate: this.props.navigation.getParam('lastCreatedDate') });
        await this.setState({ practiceName: this.props.navigation.getParam('practiceName') });
        await this.readMessages();
        await this.getMessageDetails();        
    }

    readMessages = async () => {
      this.setServices.getService(READ_MESSAGE + this.state.userId + "/" + this.state.practiceId + "/read", "")
        .then(async (responseData) => { 
        }, (error) => {
           
        })
    }

    getMessageDetails = async () => {
        this.setServices.getService(GET_MESSAGE + this.state.userId + "/" + this.state.sendTo + "/" + this.state.expectedRows + "/" + this.state.startRow, "")
        .then(async (responseData) => { 
            this.setState({objectLength : Object.keys(responseData.info).length});
            await this.setState({messageData: Object.assign(responseData.info)});
            await this.setState({defaultProfImage: BASE_URL+'/public/v2/assets/img/default_profile.png'});
            // this.setState({ 'spinner': false });
        }, (error) => {
            this.setState({ 'spinner': false });
        })
    }

    sendMessage = async () => {
      var isValidInfo= validate({ messageField: this.state.messageField,},constraintsExpense, { format: "detailed" });

      if (isValidInfo != undefined) {
        this.setState({ 'spinner': false });
        DropDownHolder.dropDown.alertWithType('error', 'Error', (isValidInfo[0]).error);
        return false;
      } else {
        this.setServices.postService(SEND_MESSAGE + this.state.userId, ServiceParams.setSendMessageParam(this.state))
        .then(async (responseData) => { 
            if(responseData.error == 0) {
              this.setState({'messageField': null});
              DropDownHolder.dropDown.alertWithType('success', 'Success', 'Message send successfully');
              await this.getMessageDetails();
            } else {
              DropDownHolder.dropDown.alertWithType('error', 'Error', responseJson.info);
            }
              
            this.setState({ 'spinner': false });
        }, (error) => {
            this.setState({ 'spinner': false });
        })
      }


    }

    checkDocument = async () => {
      this.setServices.getService(CHECK_DOCUMENTS + this.state.userId, "")
        .then(async (responseData) => {
          if(responseData.info.is_uploaded == 0) {
            DropDownHolder.dropDown.alertWithType('error', 'Error', 'You have to upload necessary documents');
            this.props.navigation.goBack();
          }
        }, (error) => {
            
        })
    }

_onError = () => { this.setState({profileImage: this.state.defaultProfImage}); }

  render() {
    const { goBack } = this.props.navigation;
    let previousDate = null;
    let ranRef = Math.random();
    return (
      <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : ""}
      style={{ flex: 1, }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, }}>
      {
          Platform.OS === 'ios' ? <MyStatusBar backgroundColor="#ffffff" barStyle="dark-content" /> : <StatusBar backgroundColor="#ffffff" barStyle="dark-content"  />
      }
        <Spinner
              visible={this.state.spinner}
              textContent={'Loading...'}
              textStyle={messageStyles.spinnerTextStyle}
        /> 

        <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingTop: 50, }}>  
          <View style={{ flex: 1, flexDirection: 'row',}}>
            <View style={{flexDirection: 'row', alignContent: 'flex-start'}}>
              <TouchableOpacity onPress={() => { goBack(); }} style={{justifyContent: 'center'}}>
                  <Image source = { require('./images/backIcon.png') } style = {{ width: 16, height: 16, marginRight: 10 }}/>
              </TouchableOpacity>     
              <Image ref={ranRef}  source={{uri: this.state.profileImage}} 
                style={{width: 65, height: 65, 
                        borderRadius: (65/2), 
                        alignItems: 'flex-end', 
                        alignContent: 'flex-end', 
                        alignSelf: 'flex-end', 
                        justifyContent: 'center' }}
                onLoad={() => {
                  this.refs[ranRef].setNativeProps({source: [{uri: this.state.profileImage}]}); 
                  setTimeout(function(){
                    this.setState({spinner: false});
                  }.bind(this), 5000);
                }}
                onError={() => {this.refs[ranRef].setNativeProps({source: [{uri: this.state.defaultProfImage}]});
                setTimeout(function(){
                  this.setState({spinner: false});
                }.bind(this), 5000);
                }}
                />
              <View style={{flexDirection: 'column', alignContent: 'flex-start', justifyContent: 'center'}}>
                <Text style={{ fontSize: 13, color: '#414253', fontFamily: Fonts.MontserratBold, paddingLeft: 20, paddingBottom: 10 }}>{this.state.msgName}</Text>
                <Text style={{ fontSize: 12, color: '#AAB2BD', fontFamily: Fonts.MontserratMedium, paddingLeft: 20 }}>{this.state.practiceName}   {moment(this.state.lastCreatedDate).format('DD MMM YYYY')}</Text>
              </View>                     
            </View>   
          </View>                
        </View>
          
        <ScrollView  style={{paddingTop: 10, paddingHorizontal: 10, height: (Dimensions.get('window').height) * 0.70} }>          
          <View style={messageStyles.bodyContainer}>
            {
                this.state.messageData.map((item, key) => { 
                  var showDate = false;
                  var sideView = 'flex-start';
                  var createdDate = moment(item.created_by).format('DD-MM-YYYY');
                  var backColor = '#1F89E4';
                  var bottomLeft = 0;
                  var bottomRight = 15;
                  var textColor = '#ffffff';
                  if(item.send_to != this.state.userId) {
                    sideView = 'flex-end';
                    backColor = '#E6E9ED';
                    bottomLeft = 15;
                    bottomRight = 0;
                    textColor = '#656D78';
                  }
                  var displayDate = null;
                  if(createdDate == this.state.today) {
                    displayDate = 'Today';
                  } else {
                    if(createdDate == this.state.yesterday) {
                      displayDate = 'Yesterday';
                    } else {
                      displayDate = moment(item.created_by).format('MMMM DD, YYYY');
                    }
                  }

                  if(previousDate == null || createdDate != previousDate) {
                    showDate = true;
                    previousDate = createdDate;
                  }

                  return <View key={key}  style={{width: '100%', paddingBottom: 15 }}>
                            { showDate == true &&
                            <View style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center', paddingBottom: 10}}>
                              <Text style={messageStyles.listDate}>{displayDate}</Text>
                            </View>
                            }
                            <View style={{flexDirection: 'row',}}>
                              
                              <View style={{width: (Dimensions.get('window').width) * 0.06, padding: 0,  justifyContent: 'flex-start', alignContent: 'flex-end',alignItems:'flex-end', }}>
                                { item.send_to == this.state.userId &&
                                  <Image source = { require('./images/messageCornerBlue.png') } style = {{ width: 16, height: 22}}/>
                                } 
                              </View> 
                              <View style={{ width: (Dimensions.get('window').width) * 0.8, paddingLeft: (item.send_to == this.state.userId ? 0 : (Dimensions.get('window').width) * 0.08),paddingRight: (item.send_to != this.state.userId ? 0 : (Dimensions.get('window').width) * 0.08),}}>
                                <View style={{ backgroundColor: backColor,  
                                                alignContent: sideView, 
                                                width: '100%',
                                                alignItems: sideView, 
                                                alignSelf: sideView, 
                                                borderTopLeftRadius: bottomLeft,
                                                borderTopRightRadius: bottomRight, 
                                                paddingTop:7,                                            
                                                paddingHorizontal: 10,
                                                paddingBottom:5,
                                                borderBottomLeftRadius: 15,
                                                borderBottomRightRadius: 15 }}>
                                  <Text style={{color: textColor, fontFamily: Fonts.MontserratMedium, fontSize: 12 }}>{item.message}</Text>
                                  <Text style={[messageStyles.listDate, {alignSelf: 'flex-end', paddingTop: 5}]}>{moment(item.created_by).format('HH:mm')}</Text>
                                </View>
                              </View>                             
                                                            
                              <View  style={{width: (Dimensions.get('window').width) * 0.06, padding: 0,  justifyContent: 'flex-start',alignContent: 'flex-start',alignItems:'flex-start',  }}>
                                { item.send_to != this.state.userId &&
                                  <Image source = { require('./images/messageCornerGray.png') } style = {{ width: 15, height: 22 }}/>
                                } 
                              </View>
                                                           
                            </View>
                          </View> 
                })
            }
          </View>
        </ScrollView>
        <View style={{ paddingHorizontal: 20}}>
          <View style={ messageStyles.hrLine } />
        </View>
        
        <View style={{ paddingTop: 5, paddingHorizontal: 20, flexDirection: 'row', paddingBottom:10, }}>
          <View  style={{ width: '85%', alignContent: 'flex-start', alignItems: 'flex-start', alignSelf: 'flex-start', justifyContent: 'center', }}>            
                  
                  <TextInput
                    id='amount'
                    onChangeText={(messageField) => this.setState({ messageField })}
                    placeholder=' Write a message ...'
                    placeholderTextColor='#CCD1D9'
                    returnKeyType='next'
                    style={messageStyles.inputMessages}
                    autoCorrect={false}
                    value={this.state.messageField} />
          </View>
          <View style={{ width: '15%', alignContent: 'flex-end', alignItems: 'flex-end', alignSelf: 'flex-end', justifyContent: 'flex-start', paddingBottom:10,}}>
            <TouchableOpacity 
                  onPress={() => {
                  this.setState({ 'spinner': true });
                  this.sendMessage();
              }}>
                  <Image source={require('./images/send.png')} style={{ width: 25, height: 25, }} />
              </TouchableOpacity>
          </View>
        </View>
      </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    );
  }
}

export default DetailMessages;


const statusBarStyles = StyleSheet.create({
  statusBar: {
      height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
  },
});
