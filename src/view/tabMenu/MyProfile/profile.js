import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Text, Image, 
        TouchableOpacity, BackHandler, SafeAreaView, ScrollView, ImageBackground, AsyncStorage, StatusBar } from 'react-native';
import { Header } from 'native-base';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-picker';
import Actionsheet from 'react-native-enhanced-actionsheet';
import LinearGradient from 'react-native-linear-gradient';
import Spinner from 'react-native-loading-spinner-overlay';

import { profileStyles } from './styles';
import { BasicInfo } from './basicInfo';
import { PersonalInfo } from './personalInfo';
import { LocationInfo } from './locationInfo'

import { Services } from '../../../services/services';
import { ServiceParams } from '../../../services/serviceParams';
import CustomImageTab, { tabHeadingStyles } from '../../../components/CustomTabs/CustomImageTab';
import CustomHeader from '../../../components/customHeader/header';

import { SIGNUP_UPDATE_URL, IMAGE_PATH } from '../../../config/shared';
import DropDownHolder from "../../../components/dropDown/dropDownHolder";

const OPTIONS = [
    { id: 1, label: 'Camera' },
    { id: 2, label: 'Gallery' },
];

export default class Profile extends Component {

  constructor(){
    super()
    this.state = {
        userId: 0,
        selectedIndex: 0,
        sourceWidth: 0,
        sourceHeight: 0,
        imageWidth: 0,
        imageHeight: 0,
        imageUri: '',
        headerImageUri: require('./images/myInfoBack.png'),
        visible: false,
        imageDetails: [],
        profileImage:'',
        profileImagePath: 'uploads/profile/',
        imageExists: false,
        spinner: true,
        defaultProfImage: ''
    };

    this.setServices = new Services();
  }

    componentDidMount = async () => {
        await AsyncStorage.multiGet(["user_id", "profileImage", "defaultProfImage", "basePath"]).then(response => {this.setState({"userId" : response[0][1]});
                                                                                    this.setState({"defaultProfImage" :  response[3][1] + response[2][1]});
                                                                                    this.setState({"basePath" :  response[3][1]});
                                                                                    this.setState({"imageUri" :  response[3][1] + ((response[1][1] == null ||  response[1][1] == 'none' || response[1][1] == "" ) ? response[2][1] : response[1][1])});
                                                                                    });
        this.mounted = true;
        // await this.checkImageExists();

        await this.getResizedImage(); 
        // this.setState({ 'spinner': false });
    }

    checkImageExists = async () => {
        // send http request in a new thread (using native code)
        let accessToken = await AsyncStorage.getItem('accessToken')|| 'none';
        await RNFetchBlob.fetch('GET', this.state.imageUri, {
           'Authorization' : 'Bearer ' + accessToken,
        })
        .then(async (res) => {
          let info = res.info();
          if(info.status == 200) {
            await this.setState({imageExists: true});
          } else {
            // handle other status codes
            await this.setState({imageUri: this.state.defaultProfImage});
            await this.setState({imageExists: false});
          }
        })
        // Something went wrong:
        .catch((errorMessage, statusCode) => {
          // error handling
          this.setState({imageExists: false});
        })
    }

    handleIndexChange = (selectedIndex) => {
      if(selectedIndex == 1) {
        this.setState({ visible: true })
      } else {
        this.setState({selectedIndex: selectedIndex});
      }

    }

    getResizedImage = async () => {
      // if(this.state.imageExists == true ) {
        // await Image.getSize(this.state.imageUri, (width, height) => { this.getScaledHeight(width, height) });
      // }
      this.getScaledHeight(1123, 591) ;
    }

    getScaledHeight = async (sourceWidth,sourceHeight) => {  
      // if(sourceWidth == 0 && sourceHeight == 0) {
      //   if(this.state.imageUri != this.state.defaultProfImage) {
      //     this.setState({imageUri : this.state.defaultProfImage});
      //   }
      //   await this.setState({
      //           imageWidth: 300,
      //           imageHeight: 300
      //   });
      // } else {
        let width = Dimensions.get('window').width;
        let height = Dimensions.get('window').height * 0.30;
        let ratio = height / sourceHeight;
        await this.setState({
                imageWidth: sourceWidth * ratio,
                imageHeight: sourceHeight * ratio
        });
      // }
        
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
          this.signUpUpdatedHandler();
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
          this.signUpUpdatedHandler();
          //   this.state.avatarSource = source;
      }
      });
  }

  signUpUpdatedHandler = async() => {
    
    this.setServices.postService(SIGNUP_UPDATE_URL+'/'+this.state.userId, ServiceParams.getProfileImageDataParams(this.state.imageDetails))
      .then(async(responseJson) => { 
        this.setState({ 'spinner': false });
        if (responseJson.error == 0) {
            await this.setState({"imageUri" : this.state.basePath + responseJson.upload_data.file_name});
            await AsyncStorage.setItem('profileImage', responseJson.upload_data.file_name);
          DropDownHolder.dropDown.alertWithType('success', 'Success', responseJson.info);
        } else {
          DropDownHolder.dropDown.alertWithType('error', 'Error', responseJson.info);
        }
      }, (error) => {
        this.setState({ 'spinner': false });
        DropDownHolder.dropDown.alertWithType('error', 'Error', ' results:' + error);
      })
  }


  render() {
    const { goBack } = this.props.navigation;
    let ranRef = Math.random();
    const addPhoto = <ImageBackground
                        imageRef={ranRef}
                        source={this.state.headerImageUri}
                        style={{
                            height: Dimensions.get('window').height * 0.25,
                            width: Dimensions.get('window').width,
                        }}
                        >
                        <Header elevation={1} transparent >
                          <StatusBar
                              backgroundColor="#00D3A1"
                              barStyle="light-content"
                          />

                          <View style={{ flexDirection: 'row', height: (Dimensions.get('window').height) * 0.1, paddingTop: 5,paddingHorizontal: 10 }}> 
                              <View style={{ width: '67%',}}>
                                  <TouchableOpacity onPress={() => { goBack() }} style={{ flexDirection: 'row', marginTop: 20 }}>
                                      <View style={{justifyContent: 'center', paddingRight: 10}}>
                                          <Image source={require('./images/whiteBackIcon.png')} style={{ width: 16, height:16 }}></Image>  
                                      </View>
                                      <View  style={{justifyContent: 'center', paddingRight: 10}}>
                                          <Text style={profileStyles.infoHeaderTitle}>My Info</Text>
                                      </View>                    
                                  </TouchableOpacity>
                              </View>
                              <View style={{ width: '33%', alignItems: 'flex-end', }}></View>
                          </View>
                        </Header>
                        <View style={profileStyles.linearGradient}>
                          <Image ref={ranRef} source={{ uri: this.state.imageUri }} style={{ width: 150, height: 150, borderRadius:150 /2, borderColor: '#fff', borderWidth: 4 }} onLoad={() => {
                            if(this.state.imageUri != null) {
                              setTimeout(function(){
                                if(this.refs[ranRef] != undefined) {
                                  this.refs[ranRef].setNativeProps({source: [{uri: this.state.imageUri}]})
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
                            {/* <Image style={profileStyles.imagePhoto} source={require('./images/ion-android-camera.png')}></Image> */}
                        </View>
                      </ImageBackground>;
    const newPhoto = <Image style={{width: 120, height: 120}} source={{ uri:this.state.defaultProfImage}}></Image>;
    
    return (
    <View>
        {/* <CustomHeader
          goBack={goBack.bind(this)}
          headerTitle={'My info'}
          headerStyle = {profileStyles.infoHeaderTitle}
        /> */}

        
      <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={{color: '#FFF'}}
      />
        
        <ScrollView>
          <View style={ profileStyles.imageView }>                   
              { addPhoto }
          </View>

          <CustomImageTab callBack={this.handleIndexChange.bind(this)} tabType='menu'>
          {/* First tab */}
          <View displayImage='personal' selectedImage='personal-white' style={tabHeadingStyles.content}>
              <BasicInfo />
          </View>
          {/* Second tab */}
          <View displayImage='camera' selectedImage='camera' style={tabHeadingStyles.content}>
            
          </View>
          {/* Third tab */}
          <View displayImage='location' selectedImage='location-white' style={tabHeadingStyles.content}>
            <LocationInfo />
          </View>
          {/* Fourth tab */}
          <View displayImage='professional' selectedImage='professional-white' style={tabHeadingStyles.content}>
              <PersonalInfo />
          </View>
          </CustomImageTab>  
        </ScrollView>  
        
        <View >
          <Actionsheet
              visible={this.state.visible}
              onRequestClose={() => this.setState({ visible: false })}
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
    </View>
    );
  }
}
