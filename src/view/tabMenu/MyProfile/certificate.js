import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, StatusBar, Text, Image, 
    TouchableOpacity, BackHandler, SafeAreaView, ScrollView, 
    ImageBackground, AsyncStorage, WebView, Platform, NativeModules } from 'react-native'
import { Header, Left, Body, Right, Icon, Button, Tabs, Tab, ScrollableTab, Title  } from 'native-base';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import Spinner from 'react-native-loading-spinner-overlay';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';

import { myprofilestyles, profileStyles } from './styles';
import { DOCUMENT_PATH } from '../../../config/shared';
import { Services } from '../../../services/services';
import CustomHeader from '../../../components/customHeader/header';
import ViewPDF from '../../../components/viewPDF/pdf';
import { Fonts } from '../../../config/font';

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

export default class Certificate extends Component {
    constructor(){
        super()
        this.state = {
            spinner: false,
            localFile: '',
            certificate: '',
            certType: '',
            certExpire: '',
            certLink: '',
            certStatus: '',
            docType: '',
        }
    }

    componentDidMount = async () => {
        
        await this.setState({ certificate: this.props.navigation.getParam('certName') });
        await this.setState({ certType: this.props.navigation.getParam('certType') });
        let expiryDate = '';
        if(this.props.navigation.getParam('certExpire') == null || this.props.navigation.getParam('certExpire') == '') {
            expiryDate = 'not set';
        } else {
        var today = new Date();
        var currentDate = moment.utc(today).format('YYYY-MM-DD');
        var expireDate = this.props.navigation.getParam('certExpire');

        const dateIsBefore = moment(currentDate).isBefore(expireDate);

            if(dateIsBefore == true) {
                expiryDate = moment(this.props.navigation.getParam('certExpire'), 'YYYY-MM-DD').format('DD.MM.YY');
            } else {
                expiryDate = 'Document expired';
            }
        }
        await this.setState({ certExpire: expiryDate});
        await this.setState({ certLink: this.props.navigation.getParam('certLink') });
        await this.setState({ certStatus: this.props.navigation.getParam('certStatus') });
        await this.getFileExtension(this.props.navigation.getParam('certLink'));        
    }

    getFileExtension(filename) {
        this.setState({docType: (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : null});
    }
    
    backToList() {
        this.props.navigation.state.params.pageRefresh(this);
        this.props.navigation.goBack();
        // this.props.navigationData.navigate('DocumentPage');
    }

    render() {
        const { goBack } = this.props.navigation;
        const { navigation } = this.props;

        let statusDiv = '' ;
        let expiredateStatusDiv = '';

        let statusType = '';

        switch(this.state.certExpire)
        {
            default:
                expiredateStatusDiv =  <View style={profileStyles.expiredStatus} ><Text style={profileStyles.expiredText} >{ this.state.certExpire }</Text></View>;

        }
        switch(this.state.certStatus) {
            case '0' :
                statusType = 'Not Uploaded'
                statusDiv = <View style={profileStyles.viewDisplayNotUploaded} ><Text style={profileStyles.textDisplayNotUploaded} >{ statusType }</Text></View> ;
            break;
            case '1' :
                statusType = 'Under Review'
                statusDiv = <View style={profileStyles.viewDisplayUnderReview} ><Text style={profileStyles.textDisplayUnderReview} >{ statusType }</Text></View> ;
            break;
            case '2' :
                statusType = 'Approved'
                statusDiv = <View style={profileStyles.viewDisplayApproved} ><Text style={profileStyles.textDisplay} >{ statusType }</Text></View> ;
            break;
            default:
                statusType = 'Not Uploaded' 
                statusDiv = <View style={profileStyles.viewDisplayNotUploaded} ><Text style={profileStyles.textDisplayNotUploaded} >{ statusType }</Text></View> ;
        }
        const resourceType = 'url';
    return (
        <View>
            <StatusBar
                translucent={true}
                backgroundColor={'transparent'}
                barStyle="light-content"
            />
            <Spinner
                visible={this.state.spinner}
                textContent={'Loading...'}
                textStyle={profileStyles.spinnerTextStyle}
            />

            <LinearGradient colors={['#5A5EE0', '#3894E4']} style={{ height: (Dimensions.get('window').height + 80) * 0.62 }}  start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }}>
                <View style={{ flexDirection: 'row', height: (Dimensions.get('window').height) * 0.2 , paddingHorizontal:20}}>
                    <View style={{ justifyContent:'flex-start',flexDirection:'row', marginTop:50 }}>
                        <View style={{width: '90%',justifyContent:'flex-start',}}>
                            <TouchableOpacity onPress={() => { goBack() }} style={{ flexDirection: 'row', }}>
                                <View style={{justifyContent: 'center', paddingRight: 10}}>
                                    <Image source={require('./images/whiteBackIcon.png')} style={{ width: 16, height:16 }}></Image>  
                                </View>
                                <View  style={{justifyContent: 'center', paddingRight: 10}}>
                                    <Text style={profileStyles.infoHeaderTitle}>{this.state.certificate}</Text>
                                </View>                    
                            </TouchableOpacity>
                        </View>
                    </View>             
                </View>
                <View style={{ position: 'absolute', backgroundColor: '#ffffff', height: 200, width: '100%', bottom: 0 }}></View>
            
                <View style={ profileStyles.certDisplayContainer }>

                    { this.state.docType == 'pdf' ?
                        <ViewPDF resources={{uri: this.state.certLink}} resourceType={resourceType} width={(Dimensions.get('window').width) * 0.45} height={(Dimensions.get('window').height) * 0.35} />  
                        :
                        <Image source={{uri: this.state.certLink}} style={{width: (Dimensions.get('window').width) * 0.45, height: (Dimensions.get('window').height) * 0.35 }} />           
                    }

                </View>
            </LinearGradient>
            <ScrollView  style={ profileStyles.container}> 
                <View style={{height: (Dimensions.get('window').height + 50 * 0.8), marginTop: 10, bottom: 0,}}>
                    <View style={{height:60,flexDirection:'row',paddingHorizontal:5}}>
                        <View style={{ width:100,justifyContent:'flex-start',alignContent:'flex-start'}}>
                            <Text style={ profileStyles.inputLabel }>Status</Text>
                        </View>
                        <View style={{ width:200,flexDirection:'row',justifyContent:'flex-end',alignContent:'flex-end', marginLeft:45}}>
                            { statusDiv }
                        </View>
                    </View>
                    <View style={ profileStyles.hrLine } />

                    <View style={{height:60,flexDirection:'row',paddingHorizontal:5}}>
                        <View style={{ width:100,justifyContent:'flex-start',alignContent:'flex-start',}}>
                            <Text style={ profileStyles.expireLavel }>Expiry date </Text>
                        </View>
                        <View style={{ width:200,flexDirection:'row',justifyContent:'flex-end',alignContent:'flex-end', marginLeft:45}}>
                            { expiredateStatusDiv }
                        </View>
                    </View>

                    {/* <View style={{ paddingHorizontal: 10, }}>
                        <Text style={ profileStyles.expireLavel }>Expiry date : { this.state.certExpire }</Text>
                        <View style={ profileStyles.hrLine } />
                    </View> */}
                    <View style={profileStyles.footerContainer}>
                        <View style={profileStyles.loginButtonArea}>
                            <TouchableOpacity style={profileStyles.loginTouchable} onPress={() => {
                                this.props.navigation.navigate('DocumentUploadPage', {
                                    certName: this.state.certificate,
                                    certLink: this.state.certLink,
                                    certExpire: this.state.certExpire,
                                    certStatus: this.state.certStatus,
                                    certType: this.state.certType,
                                    pageRefresh: this.backToList.bind(this)
                                });
                            }}>
                                <Text style={profileStyles.loginButton}>{ (this.state.certStatus == '0' ? 'ADD DOCUMENT' : 'REPLACE') }</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
        )
    }
}

