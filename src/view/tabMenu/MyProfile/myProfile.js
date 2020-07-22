import React, { Component } from 'react';
import { View, Text, Image, ScrollView, ImageBackground, AsyncStorage, TouchableOpacity, Linking, Dimensions, StatusBar } from 'react-native';
import { Header, Left, Body, Right } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Spinner from 'react-native-loading-spinner-overlay';

import { myprofilestyles, profileStyles } from './styles';
import { IMAGE_PATH } from '../../../config/shared';
import { Profile } from './profile';
import { Fonts } from '../../../config/font';

class MyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUri: null,
      profileName: '',
      imagePassport: '',
      defaultProfImage: null,
      spinner: true,
      profileImage: ''
    };
  }

  componentDidMount = async () => {
    
    await AsyncStorage.multiGet(["firstName", "lastName", "profileImage", "defaultProfImage", "basePath"]).then(response => {
                                                                                this.setState({"profileName" : response[0][1] +' '+response[1][1]});
                                                                                this.setState({"defaultProfImage" :  response[4][1] + response[3][1]});
                                                                                this.setState({"basePath" :  response[4][1]});
                                                                                this.setState({"profileImage" : response[4][1] + response[2][1]});

                                                                                this.setState({"imageUri" :  response[4][1] + ((response[2][1] == null ||  response[2][1] == 'none' || response[2][1] == "" ) ? response[3][1] : response[2][1])});
                                                                              });
  
    await this.getResizedImage(); 
  }
    getResizedImage = async () => {
      // if(this.state.imageExists == true ) {
        await Image.getSize(this.state.imageUri, (width, height) => { this.getScaledHeight(width, height) });
      // }
    }

    getScaledHeight = async (sourceWidth,sourceHeight) => {  
      if(sourceWidth == 0 && sourceHeight == 0) {
        if(this.state.imageUri != this.state.defaultProfImage) {
          this.setState({imageUri : this.state.defaultProfImage});
        }

      } else {
        let width = Dimensions.get('window').width - 30;
        let ratio = width / sourceWidth;

      }
        
    }

  signOut = async () => {
    await AsyncStorage.clear();
    await AsyncStorage.setItem('user_id', '');
    await AsyncStorage.setItem('accessToken', '0');
        
    await AsyncStorage.multiRemove([
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
    await AsyncStorage.setItem('accessToken', '0');

    this.props.navigation.navigate('LoginPage');
  }

  render() {
    let ranRef = Math.random();
    const win = Dimensions.get('window');
    return (
    <View style={myprofilestyles.container}>

      <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={{color: '#FFF'}}
      />
      <ScrollView  style={{backgroundColor: '#F5F5F5', paddingTop: 10}}>
        <View style={{backgroundColor: '#ffffff', paddingHorizontal:10}}>
          <Header elevation={3} transparent >
            <StatusBar
              backgroundColor="#FFFFFF"
              barStyle="dark-content"
            /> 

            <View style={{ flexDirection: 'row', height: (Dimensions.get('window').height) * 0.1, paddingTop: 5,paddingHorizontal: 10 }}> 
              <View style={{ width: '67%', }}>
                <Text style={ profileStyles.headerBodyText }>My Profile</Text>
              </View>

              <View style={{ width: '33%', alignItems: 'flex-end', }}>
                <TouchableOpacity onPress={() => { this.props.navigation.navigate('ProfilePage'); }}>
                  <Image source={require('./images/edit.png')} style={{ width: 24, height: 24, }} />
                </TouchableOpacity>
              </View>
            </View>
          </Header>
          <View style={{ flex: 1 , }}>
            <View style={profileStyles.profImageArea}>
              <View style={myprofilestyles.addPhoto}>
                <Image ref={ranRef} source={{ uri:this.state.profileImage}} style={{ width: 120, height: 120, borderRadius: 120/ 2 }} 
                onLoad={() => {
                  // console.warn(this.state.defaultProfImage);
                  if(this.state.profileImage != null) {
                    setTimeout(function(){
                      if(this.refs[ranRef] != undefined) {
                        this.refs[ranRef].setNativeProps({source: [{uri: this.state.profileImage}]})
                        this.setState({spinner: false});                        
                      }
                    }.bind(this), 3000);
                  }
                  }}
                  onError={() => {
                    setTimeout(function(){
                      this.setState({spinner: false});
                    }.bind(this), 5000);
                  }}
                />
              </View>
              <View style={{flexDirection: 'column',justifyContent: 'center', alignContent:'center', alignItems:'center'}}>
                  <Text style={myprofilestyles.profileName}>{ this.state.profileName }</Text>
                  <Text style={myprofilestyles.profilealias}>Doctor</Text> 
              </View>
            </View>
            </View>
            <View>
              <LinearGradient colors={['#ffffff', '#ffffff']} >
                <View style={{paddingVertical: 15, paddingHorizontal: 25}}>
                  <View style={myprofilestyles.signUpButtonArea}>
                      <TouchableOpacity style={profileStyles.profileTouchable} onPress={() => {
                          this.props.navigation.navigate('DocumentPage');
                      }}>
                        <View style={ profileStyles.navigateSection }>
                          <View style={ profileStyles.navigateIconSection }>
                            <Image source={require('./images/digital-passport.png')} style={{ width: 18.01, height: 23 }}></Image>  
                          </View>
                          <View style={ profileStyles.navigateTextSection }>
                            <Text style={ profileStyles.navigateText}>Documents</Text>
                          </View>
                        </View>                    
                      </TouchableOpacity>
                  </View>
                  <View style={myprofilestyles.signUpButtonArea}>
                      <TouchableOpacity style={profileStyles.profileTouchable} onPress={() => {
                          this.props.navigation.navigate('PaymentDetailsPage');
                      }}>
                        <View style={ profileStyles.navigateSection }>
                          <View style={ profileStyles.navigateIconSection }>
                            <Image source={require('./images/payment-details.png')} style={{ width: 18.15, height: 23 }}></Image>  
                          </View>
                          <View style={ profileStyles.navigateTextSection }>
                            <Text style={ profileStyles.navigateText}>Payment details</Text>
                          </View>
                        </View>  
                      </TouchableOpacity>
                  </View>
                  <View style={myprofilestyles.signUpButtonArea}>
                      <TouchableOpacity style={profileStyles.profileTouchable} onPress={() => {
                          this.props.navigation.navigate('FinancialReportPage');
                      }}>
                        <View style={ profileStyles.navigateSection }>
                          <View style={ profileStyles.navigateIconSection }>
                            <Image source={require('./images/financial-report.png')} style={{ width: 18.41, height: 25 }}></Image>  
                          </View>
                          <View style={ profileStyles.navigateTextSection }>
                            <Text style={ profileStyles.navigateText}>Financial reports</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                  </View>
                  <View style={myprofilestyles.signUpButtonArea}>
                      <TouchableOpacity style={profileStyles.profileTouchable} onPress={() => {
                          this.props.navigation.navigate('ExpenseListPage');
                      }}>
                        <View style={ profileStyles.navigateSection }>
                          <View style={ profileStyles.navigateIconSection }>
                            <Image source={require('./images/expense.png')} style={{ width: 25, height: 18.74 }}></Image>  
                          </View>
                          <View style={ profileStyles.navigateTextSection }>
                            <Text style={ profileStyles.navigateText}>Expenses</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                  </View>
                  <View style={myprofilestyles.signUpButtonArea}>
                      <TouchableOpacity style={profileStyles.profileTouchable} onPress={() => {
                          this.props.navigation.navigate('myPracticesPage');
                      }}>
                        <View style={ profileStyles.navigateSection }>
                          <View style={ profileStyles.navigateIconSection }>
                            <Image source={require('./images/practice.png')} style={{ width: 22.55, height: 20.5 }}></Image>  
                          </View>
                          <View style={ profileStyles.navigateTextSection }>
                            <Text style={ profileStyles.navigateText}>Healthcare organisations</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                  </View>
                  <View style={myprofilestyles.signUpButtonArea}>
                      <TouchableOpacity style={profileStyles.profileTouchable}  onPress={() => Linking.openURL('mailto:hello@sanrnapp.co.uk') }>
                        <View style={ profileStyles.navigateSection }>
                          <View style={ profileStyles.navigateIconSection }>
                            <Image source={require('./images/help-feedback.png')} style={{ width: 22.97, height: 24 }}></Image>  
                          </View>
                          <View style={ profileStyles.navigateTextSection }>
                            <Text style={ profileStyles.navigateText}>Help & feedback</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                  </View>
                  <View style={myprofilestyles.signUpButtonArea}>
                      <TouchableOpacity style={{height: 35, alignItems: 'center', alignSelf: 'center',justifyContent: 'center',}}  onPress={() => this.signOut() }>
                        <Text style={{fontFamily: Fonts.RubikLight,fontSize: 15, color: '#4a78e2',textDecorationLine: 'underline'}}>Sign out</Text>
                        {/* <View style={ profileStyles.navigateSection }>
                          <View style={ profileStyles.navigateIconSection }>
                            <FontAwesome name='sign-out' size={30} color='#4a78e2'></FontAwesome>
                          </View>
                          <View style={ profileStyles.navigateTextSection}>                        
                            <Text style={ profileStyles.navigateText}>Sign out</Text>
                          </View>
                        </View> */}
                      </TouchableOpacity>
                  </View>
                </View>      
              </LinearGradient>   
          </View>
        </View>
      </ScrollView>
    </View>
    );
  }
}

export default MyProfile;
