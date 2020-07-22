import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, Text, Image, 
    TouchableOpacity, BackHandler, SafeAreaView, ScrollView, ImageBackground, AsyncStorage } from 'react-native'
import { Header, Left, Body, Right, Icon, Button, Tabs, Tab, ScrollableTab  } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';

import { myprofilestyles, profileStyles } from './styles';
import { GET_ALL_DOCS } from '../../../config/shared';
import { Services } from '../../../services/services';
import CustomHeader from '../../../components/customHeader/header';
import { Fonts } from '../../../config/font';


export default class Documents extends Component {
    
    constructor(){
        super()
        this.state = {
            userId: null,
            spinner: true,
            documentTypes: [{name: 'GMC/CCT Certificate', cert: 'gmc_cct_cert',cert_expire:'gmc_cct_cert_exp',status: 'gmc_status'}, 
                            {name: 'Performers List', cert: 'performers_list',cert_expire:'performers_list_exp',status: 'performers_status'},
                            {name: 'Medical Indemnity', cert: 'medical_indemnity',cert_expire:'medical_indemnity_exp',status: 'medical_status'},
                            {name: 'CV', cert: 'cv',cert_expire:'cv_exp',status: 'cv_status'},  
                            {name: 'Passport', cert: 'passport',cert_expire:'passport_exp',status: 'passport_status'}, 
                            {name: 'DBS', cert: 'dbs',cert_expire:'dbs_exp',status: 'dbs_status'},
                            {name: 'BLS', cert: 'bls',cert_expire:'bls_exp',status: 'bls_status'}, 
                            {name: 'Occupation Health', cert: 'occupational_health',cert_expire:'occupational_health_exp',status: 'occupational_status'},
                            {name: 'Safe Guarding level 3', cert: 'safe_guarding_level',cert_expire:'safe_guarding_level_exp',status: 'safe_guarding_status'},
                            // {cert: 'driving_licence',cert_expire:'driving_licence_exp',status: 'driving_licence_status'},
                            // {cert: 'right_to_work_UK',cert_expire:'right_to_work_UK_exp',status: 'right_to_work_status'},                            
                            ],
            gmc_cct_cert: null, gmc_cct_cert_exp:null, gmc_status: null,
            performers_list: null, performers_list_exp:null, performers_status: null,
            medical_indemnity: null, medical_indemnity_exp:null, medical_status: null,
            cv: null, cv_exp:null, cv_status: null,
            passport: null, passport_exp:null, passport_status: null,
            dbs: null, dbs_exp:null, dbs_status: null,
            bls: null, bls_exp:null, bls_status: null,
            occupational_health: null, occupational_health_exp:null, occupational_status: null,
            safe_guarding_level: null, safe_guarding_level_exp:null, safe_guarding_status: null,
            basePath: '',
            defaultFile: ''
            // driving_licence: null, driving_licence_exp:null, driving_licence_status: null,
            // right_to_work_UK: null, right_to_work_UK_exp:null, right_to_work_status: null,
        };
        this.setServices = new Services();
    }

    componentDidMount = async () => {
        this.setState({ 'spinner': true });

        await AsyncStorage.multiGet(["user_id"]).then(response => { this.setState({userId : response[0][1]}); });
        this.getDocuments();  
     
    }
    
    getDocuments = async () => {
        this.setServices.getService(GET_ALL_DOCS + this.state.userId, "")
        .then(async (responseData) => {
            if(responseData.error == 0) { 
            await this.setState({basePath: responseData.base_path});  
            await this.setState({defaultFile: responseData.default_image});              
                let newArray = await this.state.documentTypes.map((item, key) => { 

                    let dataArray = responseData.info;
                    if((item.cert in dataArray) == true) { 
                        let itemCert = item.cert;
                        let itemExpire = item.cert_expire;
                        let itemStatus = item.status;
                        this.setState({[itemCert]: dataArray[itemCert]});
                        this.setState({[itemExpire]: dataArray[itemExpire]});
                        this.setState({[itemStatus]: dataArray[itemStatus]});
                    }
                });               
            }
 
            this.setState({ 'spinner': false });
        }, (error) => {
            console.log(error);
            this.setState({ 'spinner': false });
        })
    }

    pageRefresh() {
        this.setState({ 'spinner': true });
        this.getDocuments(); 
    }
    
  render() {
    const { goBack } = this.props.navigation;
    return (
      <View>
        <ScrollView  style={[profileStyles.container]}>  
        <Spinner
            visible={this.state.spinner}
            textContent={'Loading...'}
            textStyle={profileStyles.spinnerTextStyle}
        />        
                <View style={{ flexDirection: 'row' , marginBottom:15}}>
                    <View style={{ justifyContent:'flex-start',flexDirection:'row', marginTop:5 }}>
                        <View style={{width: '90%',justifyContent:'flex-start',flexDirection:'row'}}>

                            <TouchableOpacity onPress={() => { goBack(); }} style={{ flexDirection: 'row',}}>
                                <View style={{justifyContent: 'center', paddingRight: 10}}>
                                    <Image source={require('./images/backIcon.png')} style={{ width: 16, height:16 }}></Image>  
                                </View>
                                <View  style={{justifyContent: 'center', }}>
                                    <Text style={profileStyles.blackHeaderTitle}>Documents</Text>                                    
                                </View> 
                            </TouchableOpacity>      
                                    
                        </View>
                    </View>             
                </View>
          <View style={myprofilestyles.bodyContainer}>
          {
              this.state.documentTypes.map((item, key) => {
                let itemName = item.name;
                let itemCert = item.cert;
                let itemExpire = item.cert_expire;
                let itemStatus = item.status;
                let statusType = '';
                let typeColor = '';
                let typeBgColor = '';
                switch(this.state[itemStatus]) {
                    case '0' :
                        statusType = 'Not Uploaded';
                        typeColor = '#FF0000';
                        typeBgColor = '#e3f8f2';
                    break;
                    case '1' :
                        statusType = 'Under Review';
                        typeColor = '#ffa31a';
                        typeBgColor = '#ffebcc';
                    break;
                    case '2' :
                        statusType = 'Approved';
                        typeColor = '#228B22';
                        typeBgColor = '#e3f8f2';
                    break;
                    default:
                        statusType = 'Not Uploaded';
                        typeColor = '#FF0000'; 
                        typeBgColor = '#e3f8f2';
                }
                
                return <TouchableOpacity key={key} style={ profileStyles.documentApproved } onPress={() => {
                        this.props.navigation.navigate('CertificatePage', {
                            certName: itemName,
                            certLink: this.state.basePath + this.state[itemCert],
                            certExpire: this.state[itemExpire],
                            certStatus: this.state[itemStatus],
                            certType: itemCert,
                            pageRefresh: this.pageRefresh.bind(this)
                        });
                    }}>
                        <View style={ profileStyles.documentArea }>
                            <View  style={ profileStyles.documentNameArea }>
                                <Text style={myprofilestyles.profileName}>{ itemName }</Text>
                            </View>
                            <View style={[profileStyles.documentButtonArea, {backgroundColor: typeBgColor}]}>
                                <Text style={[profileStyles.documentButton, {color: typeColor}]}> { statusType }</Text>
                            </View>
                        </View> 
                    <View style={ profileStyles.hrLine } />
                    </TouchableOpacity>    
            }
            )}
            
                 
        </View>
          </ScrollView>
      </View>
    )
  }
}