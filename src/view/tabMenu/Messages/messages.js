import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Text, Image, 
  TouchableOpacity, BackHandler, SafeAreaView, ScrollView, ImageBackground, AsyncStorage, NativeModules, Platform, StatusBar } from 'react-native'
import { Header, Left, Body, Right, Icon, Button, Tabs, Tab, ScrollableTab  } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import RNFetchBlob from 'rn-fetch-blob';
import moment from 'moment';
import DropDownHolder from "../../../components/dropDown/dropDownHolder";

import { messageStyles } from './styles';
import CustomHeader from '../../../components/customHeader/header';
import { GET_ALL_MESSAGES, CHECK_DOCUMENTS, BASE_URL } from '../../../config/shared';
import { Services } from '../../../services/services';
import { Fonts } from '../../../config/font';

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 10 : StatusBarManager.HEIGHT;
const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[{ backgroundColor, height: STATUSBAR_HEIGHT }]}>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
);

class Messages extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userId: 0,
      imageExists: null,
      spinner: true,
      defaultImage: '',
      messageData: [],
      objectLength: 0,
      imageWidth: 65,
      imageHeight: 65,
      fromJob: true,
      basePath: '',
      defaultProfImage: ''
    };
    this.setServices = new Services();
  }

  componentDidMount = async () => {
    await AsyncStorage.multiGet(["user_id", "defaultProfImage", "basePath"]).then(response => {
                                                                  this.setState({"userId" : response[0][1]});
                                                                  this.setState({"defaultProfImage" :  response[2][1] + response[1][1]});
                                                                  });
    await this.checkDocument();
    // await this.getMessages();
    
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction()
    });
    
  }

  onFocusFunction = async () => {
    this.setState({ 'spinner': true });
    await this.checkDocument();
    
  }
  

  componentWillUnmount () {
    this.focusListener.remove()
  }

  getMessages = async () => { 
    this.setServices.getService(GET_ALL_MESSAGES + this.state.userId, "")
    .then(async (responseData) => { 
      this.setState({objectLength : Object.keys(responseData.user_info).length});
      await this.setState({messageData: responseData.user_info});
      await this.setState({basePath: responseData['base_path']});
      await this.setState({defaultProfImage: BASE_URL+'/public/v2/assets/img/default_profile.png'});
      this.setState({ 'spinner': false });
    }, (error) => {
        this.setState({ 'spinner': false });
    })
  } 

  textTruncate = (str, length, ending) => {
      if (length == null) {
          length = 100;
        }
        if (ending == null) {
          ending = ' ...';
        }
        if (str.length > length) {
          return str.substring(0, length - ending.length) + ending;
        } else {
          return str;
        }
  }

  checkDocument = async () => {
    this.setServices.getService(CHECK_DOCUMENTS + this.state.userId, "")
      .then(async (responseData) => {
        if(responseData.info.is_uploaded == 0) {
          DropDownHolder.dropDown.alertWithType('error', 'Error', 'You have to upload necessary documents');
          this.props.navigation.goBack();
        } else {
          await this.getMessages();
        }
      }, (error) => {
          
      })
  }

  _onError = () => { this.setState({imageUri: this.state.defaultProfImage}); }

  render() {
    let ranRef = Math.random();
    const { goBack } = this.props.navigation;
    return (
      <View style={{ flex: 1, }}>
        {
            Platform.OS === 'ios' ? <MyStatusBar backgroundColor="#ffffff" barStyle="dark-content" /> : <StatusBar backgroundColor="#ffffff" barStyle="dark-content"  />
        }
        <ScrollView  style={ messageStyles.container}>  
          <View  style={{ paddingBottom: (Dimensions.get('window').height) * 0.2, }}>        
            <Spinner
                visible={this.state.spinner}
                textContent={'Loading...'}
                textStyle={messageStyles.spinnerTextStyle}
            /> 
            
            <View style={{  height: (Dimensions.get('window').height) * 0.1,}}>
              <View style={{ flex: 1, }}>
                  {/* <View style={{flexDirection: 'row', alignContent: 'flex-start'}}>
                      <TouchableOpacity onPress={() => { goBack(); }}>
                          <Image source = { require('./images/backIcon.png') } style = {{ width: 18, height: 18, marginTop: 3 }}/>
                      </TouchableOpacity>      
                      <Text style={{ fontSize: 18, color: '#414253', fontFamily: Fonts.MontserratBold, paddingLeft: 20 }}>Messages</Text>
                  </View>  */}
                  <View style={{ width: '90%',}}>
                      <TouchableOpacity onPress={() => { goBack() }} style={{ flexDirection: 'row', }}>
                          <View style={{justifyContent: 'center', paddingRight: 10}}>
                              <Image source={require('./images/backIcon.png')} style={{ width: 16, height:16 }}></Image>  
                          </View>
                          <View  style={{justifyContent: 'center', paddingRight: 10}}>
                              <Text style={{color: '#000000',fontFamily: Fonts.MontserratBold,fontSize: 18,}}>Messages</Text>
                          </View>                    
                      </TouchableOpacity>
                  </View>  
              </View>
            </View>
            <View style={messageStyles.bodyContainer}>
              <View>
              {
                this.state.messageData != [] && 
                  this.state.messageData.map((item, key) => {
                    var fullName = (item.first_name != null ? item.first_name : '')+' '+(item.last_name != null ? item.last_name : '');
                    
                    var profileImage = this.state.basePath + item.photo;
                    if(item.photo == null || item.photo == '' || item.photo == 'default.jpeg') {
                      profileImage = this.state.defaultProfImage;
                    } 

                    var sendTo = item.send_to;
                    if(item.send_to == this.state.userId) {
                      sendTo = item.send_by;
                    }


                    return <TouchableOpacity key={key}  onPress={() => {
                                  this.props.navigation.navigate('DetailMessagesPage', {
                                                                    sendTo: sendTo,
                                                                    msgName: fullName,
                                                                    profileImage: profileImage,
                                                                    lastCreatedDate: item.created_by,
                                                                    practiceName: item.practice_name,
                                                                    practiceId: item.practice_id
                                                                });
                              }}>
                              <View style={messageStyles.messageRow}>
                                <View style={messageStyles.photoArea}>
                                  {/* <Image ref={key}  source={{uri: profileImage}} 
                                          style={{width: this.state.imageWidth, height: this.state.imageHeight, borderRadius: 5 }} 
                                          onError={(e) => this.refs[key].setNativeProps({source: [{uri: this.state.defaultProfImage}]})}/> */}
                                  <Image ref={ranRef}  source={{uri: profileImage}} 
                                      style={{width: this.state.imageWidth, 
                                              height: this.state.imageHeight, 
                                              borderRadius: (this.state.imageWidth / 2), }}
                                      onLoad={() => {this.refs[ranRef].setNativeProps({source: [{uri: profileImage}]}); this.setState({spinner: false});}}
                                      onError={() => this.refs[ranRef].setNativeProps({source: [{uri: this.state.defaultProfImage}]})}
                                      />
                                </View>
                                <View style={messageStyles.messageArea}>
                                  <Text style={[messageStyles.listName,{fontFamily:(item.unread_count != 0 ? Fonts.MontserratExtraBold : Fonts.MontserratMedium)}]}>{fullName}</Text>
                                  <Text style={[messageStyles.listPractice,{fontFamily:(item.unread_count != 0 ? Fonts.MontserratExtraBold : Fonts.MontserratMedium)}]}>{item.practice_name}   {moment(item.created_by).format('DD MMM YYYY')}</Text>
                                  <Text style={[messageStyles.listDescription,{fontFamily:(item.unread_count != 0 ? Fonts.MontserratExtraBold : Fonts.MontserratMedium)}]}>{this.textTruncate(item.message,30)}</Text>
                                </View>
                                <View style={messageStyles.dateArea}>
                                  <Text style={messageStyles.listDate}>{moment(item.created_by).format('HH:mm')}</Text>
                                  <Text></Text>
                                  {item.unread_count != 0 && 
                                  <View style={{backgroundColor: '#1F89E4', borderRadius: 50}}>
                                    <Text style={[messageStyles.unread,{marginLeft: (item.unread_count == 1 ? 12 : 10), marginRight: (item.unread_count == 1 ? 12 : 10)}]}>{item.unread_count}</Text>
                                  </View>
                                  }
                                </View>
                              </View> 
                              <View style={ messageStyles.hrLine } />
                          </TouchableOpacity> 
                  })
              }
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Messages;
