import React, { Component } from 'react'
import { View, Dimensions, Text, Image,  StatusBar, 
    TouchableOpacity, ScrollView, ImageBackground, AsyncStorage, Switch } from 'react-native';
import { Icon } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-picker';
import ToggleSwitch from 'toggle-switch-react-native';
import Overlay from 'react-native-modal-overlay';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';

import { profileStyles } from './styles';
import { UPLOAD_CERTIFICATES } from '../../../config/shared';
import { Services } from '../../../services/services';
import { ServiceParams } from '../../../services/serviceParams';
import CustomHeader from '../../../components/customHeader/header';
import { Fonts } from '../../../config/font';
import DropDownHolder from "../../../components/dropDown/dropDownHolder";
import DocumentPicker from 'react-native-document-picker';

export default class UploadDocument extends Component {
    constructor(){
        super()
        this.state = {
            spinner: false,
            imageDetails: null,
            showCalendar: false,
            currentDate: new Date(),
            date: new Date(),
            addExpiryDate: false,
            calenderChanged: false,
            showExpireDate: false,
            certificate: null,
            certType: null,
            toggleOn: false,
            singleFileOBJ: '',
        };
        this.setServices = new Services();
    }
    componentDidMount = async () => {
        console.log('hello1');
        await AsyncStorage.multiGet(["user_id"]).then(response => { this.setState({userId : response[0][1]}); });
        this.setState({ certificate: this.props.navigation.getParam('certName') });
        this.setState({ certType: this.props.navigation.getParam('certType') });
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
            this.setState({ 'spinner': true });
            const source = { uri: response.uri };
            this.setState({ imageDetails: response });
            this.replaceDocument('gallery');
        }
        });
      }
      
      async uploadfromdriver() {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            const source = { uri: res.uri };
            this.setState({avatarSource: source, imageDetails: res, 
                 singleFileOBJ: res,  spinner: true });
            this.replaceDocument('drive');
        } catch (err) {
            // DropDownHolder.dropDown.alertWithType('error', 'Error', JSON.stringify(err));
            // if (DocumentPicker.isCancel(err)) {
            //     alert(JSON.stringify(err));
            //     DropDownHolder.dropDown.alertWithType('error', 'Error', JSON.stringify(err));
            // } else {
            //     alert('Unknown Error: ' + JSON.stringify(err));
            //     throw err;
            // }
        }
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
            this.setState({ spinner: true });
            this.setState({ imageDetails: response });
            const source = { uri: response.uri };
            this.setState({ avatarSource: source });
            this.replaceDocument('gallery');
        }
        });
    }

    // documentreplacepicker = async () => {
    //     this.setServices.postService(UPLOAD_CERTIFICATES + this.state.userId, ServiceParams.uploadCertificateParams(this.state,'drive'))
    //         .then(async (responseJson) => {
    //             if (responseJson.error == 0) {
    //                 DropDownHolder.dropDown.alertWithType('success', 'Success', responseJson.info);
    //                 this.props.navigation.state.params.pageRefresh(this);
    //                 this.props.navigation.navigate('DocumentPage');
    //             } else {
    //                 DropDownHolder.dropDown.alertWithType('error', 'Error', responseJson.info);
    //             }
    //             this.setState({ spinner: false });
    //         }, (error) => {
    //             this.setState({ spinner: false });
    //             DropDownHolder.dropDown.alertWithType('error', 'Error', ' results:' + error);
    //         })
    // }

    replaceDocument = async (place) => {

        this.setServices.postService(UPLOAD_CERTIFICATES+this.state.userId, ServiceParams.uploadCertificateParams(this.state,place))
        .then(async (responseJson) => {
            if (responseJson.error == 0) {
                DropDownHolder.dropDown.alertWithType('success', 'Success', responseJson.info);
                this.props.navigation.state.params.pageRefresh(this);
                this.props.navigation.navigate('DocumentPage');
            } else {
                DropDownHolder.dropDown.alertWithType('error', 'Error', responseJson.info);
            }
            this.setState({ spinner: false });
        }, (error) => { 
            this.setState({ spinner: false });
            DropDownHolder.dropDown.alertWithType('error', 'Error', ' results:' + error);
        })
    }

    render() {
        const { goBack } = this.props.navigation;
        const { navigation } = this.props;
        return (
        <View style={{flex: 1}}>
            <StatusBar
                backgroundColor="#ffffff"
                barStyle="dark-content"
            />
            <ScrollView  style={ profileStyles.container}>  
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Loading...'}
                    textStyle={ profileStyles.spinnerTextStyle }
                />        
{/* 
                <LinearGradient colors={['#ffffff', '#ffffff']} style={{ height: (Dimensions.get('window').height) * 0.25 }}>
                    <View style={{ flexDirection: 'row', height: (Dimensions.get('window').height) * 0.2}}>
                        <View style={{ justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => { goBack(); }}>
                                <Icon name='arrow-back' style={ profileStyles.headerArrowBackReverse } />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', }}>
                            <Text style={ profileStyles.headerTitleReverse }> { this.state.certificate }</Text>
                        </View>                    
                    </View>
                </LinearGradient>    */}
                <View style={{ paddingHorizontal: 5, height: (Dimensions.get('window').height) * 0.07}}>
                    <View style={{ flex: 1, flexDirection: 'row',}}>
                        <View style={{flexDirection: 'row',  alignContent: 'flex-start'}}>
                            <TouchableOpacity onPress={() => { goBack(); }}>
                                <Image source = { require('./images/backIcon.png') } style = {{ width: 18, height: 18, marginTop: 3 }}/>
                            </TouchableOpacity>      
                            <Text style={{ fontSize: 18, color: '#414253', fontFamily: Fonts.MontserratBold, paddingLeft: 20 }}>{this.state.certificate}</Text>
                        </View> 
                    </View>
                </View>    
                <View style={ profileStyles.mainContainer }>
                    <View style={ profileStyles.uploadInstructionSection }>
                    <Image source = { require('./images/uploadTopImage.png') } style = {{ width: (Dimensions.get('window').width) * 0.6, marginTop: 20}}/>
                    </View>
                    <View style={ profileStyles.uploadInstructionSection }>
                        <Text style={ profileStyles.uploadInstructionHeading }>Upload Instructions</Text>
                        <Text style={ profileStyles.uploadInstructionText }>
                            Click on the button below to upload photo of a document
                        </Text>
                    </View>
                    <View style={ profileStyles.switchArea }>
                        <View style={ profileStyles.switchButtonArea }>
                              <ToggleSwitch
                                isOn={this.state.toggleOn}
                                onColor='#00D3A1'
                                offColor='#AAB2BD'
                                size='small'
                                onToggle={ (isOn) => { 
                                    this.setState({showExpireDate : isOn});
                                    this.setState({toggleOn : isOn});
                                } }
                            />
                        </View>
                        <View style={ profileStyles.switchTextArea }>
                            <Text style={ profileStyles.switchText }>
                                Would you like to set an expiry date to this document? 
                            </Text>
                        </View>
                    </View>
                    { this.state.showExpireDate == true &&          
                    <View style={{ flex: 1, borderBottomColor:'#E6E9ED', borderBottomWidth:1, marginLeft: 10, marginRight: 10, marginBottom:15, marginTop:10 }}>
                        <TouchableOpacity style={{ flex: 1, flexDirection: 'row', }} onPress={() => {
                                this.setState({ showCalendar: true });
                        }}>                      
                            <View style={{ flex: 1, flexDirection: 'row', marginBottom: 10 }}>
                                <View style={{width:'10%',  alignContent:'flex-start', }}>
                                    <Image style={{ width: 20, height: 18, }} source={require('./images/calendar.png')}></Image>
                                </View>
                                <View style={{width:'90%',  alignContent:'flex-start'}}>
                                    <Text style={this.state.date != null ?  profileStyles.calendarSelectedText : profileStyles.calendarText }>{this.state.date != null ? moment(this.state.date, 'DD/MM/YYYY').format('DD MMM YYYY') : 'Set Expire Date'}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    }
                    
                    <View style={profileStyles.footerContainer}>
                        <View style={profileStyles.loginButtonArea}>
                            <TouchableOpacity style={profileStyles.scanTouchable} onPress={() => {this.launchCamera()}} >
                                <Text style={profileStyles.scanButton}>SCAN DOCUMENT</Text>
                            </TouchableOpacity>
                        </View>
                        {/* <View style={profileStyles.whiteButtonArea}>
                            <TouchableOpacity style={profileStyles.whiteTouchable} >
                                <Text style={profileStyles.whiteButton}>From Cloud</Text>
                            </TouchableOpacity>
                        </View> */}
                        <View style={profileStyles.whiteButtonArea}>
                            <TouchableOpacity style={profileStyles.whiteTouchable} onPress={() => {this.launchLibrary()}}>
                                <Text style={profileStyles.whiteButton}>FROM PHOTO GALLERY</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={profileStyles.whiteButtonArea}>
                            <TouchableOpacity style={profileStyles.whiteTouchable} onPress={this.uploadfromdriver.bind(this)}>
                              <Text style={profileStyles.whiteButton}>UPLOAD FROM DRIVE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </ScrollView>
            {/* expense Day Overlay */}
            <Overlay visible={this.state.showCalendar} 
                    onClose={() => {this.setState({showCalendar: false})}} 
                    closeOnTouchOutside 
                    containerStyle={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                    childrenWrapperStyle={{
                        width: '100%',
                        height: 220, position: 'absolute',
                        bottom: 0, right: 15, left: 20, borderTopLeftRadius: 25, borderTopRightRadius: 25,
                    }}>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%', alignSelf: 'center',
                    }}>

                        <TouchableOpacity style={{
                            backgroundColor: '#00F0B5',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderColor: '#00F0B5',
                            borderRadius: 5,
                            elevation: 0, borderWidth: 0, width: 50, height: 30, alignSelf: 'flex-end', top: 10, right: 0
                        }} onPress={() => {
                            this.setState({showCalendar: false});
                        }}>
                            <Text style={[ profileStyles.loginButton, {fontSize: 15, fontFamily: Fonts.GilroyLight }]}>OK</Text>
                        </TouchableOpacity>

                        <DatePicker
                            style={{ marginTop: 10, }}
                            mode={'date'}
                            date={this.state.currentDate}
                            onDateChange={ (date) => {
                                this.setState({calenderChanged: true});
                                this.setState({currentDate: new Date(moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD'))});
                                this.setState({date: date});}}
                        />

                    </View>
                </Overlay>
        </View>
        )
    }
}