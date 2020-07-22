import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TextInput,
    TouchableOpacity, SafeAreaView, StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback,
    Keyboard, AsyncStorage,ScrollView } from 'react-native';
import { profileStyles } from './styles';
import validate from 'validate.js';
import Spinner from 'react-native-loading-spinner-overlay';
import Overlay from 'react-native-modal-overlay';
import { Content, Icon, Picker, Form, List, ListItem } from 'native-base';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import DropDownHolder from "../../../components/dropDown/dropDownHolder";
import { API_URL, SIGNUP_UPDATE_URL } from '../../../config/shared';
import { ServiceParams } from '../../../services/serviceParams';
import { Services } from '../../../services/services';
import { Fonts } from '../../../config/font';
import CustomMultiSelectDropDown from '../../../components/CustomDropDown/customMultiSelectDropDown';

const constraintsBasicInfo = {
    firstName: {
        presence: {
            allowEmpty: false,
            message: "cannot be blank."
        },
    },
    lastName: {
        presence: {
            allowEmpty: false,
            message: "cannot be blank."
        },
    },
    gmcNumber: {
        presence: {
            allowEmpty: false,
            message: "cannot be blank."
        },
    },
    language: {
        presence: {
            allowEmpty: false,
            message: "cannot be blank."
        },
    },
  }

export class BasicInfo extends React.Component {
    constructor(){
      super()
      this.state = {
          userEmail: null,
          firstName: null,
          lastName: null,
          gmcNumber: null,
          password: null,
          spinner: true,
          userId: null,
          language: '',
          languageVisible: false,
          arrowSource: require("./images/dropdown-arrow.png"),
          languageOption: [
              {
                  value: 'Arabic',
                  id: 1,
                  selected: false,
                  sort: 'data'
              }, {
                  value: 'Bengali',
                  id: 2,
                  selected: false,
                  sort: 'data'
              }, {
                  value: 'Chinese',
                  id: 3,
                  selected: false,
                  sort: 'data'
              }, {
                  value: 'French',
                  id: 4,
                  selected: false,
                  sort: 'data'
              }, {
                  value: 'German',
                  id: 5,
                  selected: false,
                  sort: 'data'
              }, {
                value: 'Hindi',
                id: 6,
                selected: false,
                sort: 'data'
            }, {
                value: 'Punjabi',
                id: 7,
                selected: false,
                sort: 'data'
            }, {
                value: 'Polish',
                id: 8,
                selected: false,
                sort: 'data'
            }, {
                value: 'Urdu',
                id: 9,
                selected: false,
                sort: 'data'
            }, {
                value: 'English(Optional)',
                id: 10,
                selected: false,
                sort: 'data'
            }
          ],
      };
  
      this.setServices = new Services();
    }
  
    componentDidMount = async () => {
        await AsyncStorage.multiGet(["userEmail",
                            "firstName",
                            "lastName", 
                            "gmcNumber",
                            "user_id",
                            "language"
                            ]).then(response => {
                                this.setState({"userEmail" : response[0][1]});
                                this.setState({"firstName" : response[1][1]});
                                this.setState({"lastName" : response[2][1]});
                                this.setState({"gmcNumber" : response[3][1]}); 
                                this.setState({"userId" : response[4][1]}); 
                                this.setState({"language" : response[5][1]});                             
        });

        this.setState({ 'spinner': false });
    }

    selectedDropDowns = async (sortOptions, data) => {
        if(data != null && data != ""){
          const splitArray = data.split(",");

          sortOptions.forEach(element => {
              // console.warn(element);
              if (splitArray.includes(element['value']) == true) {
                  element['selected'] = true; 
              } 
          });
        }        
      this.setState({ sortOption: sortOptions });
    }

    basicInfoValidate = () => {

        var isValidInfo= validate({ firstName: this.state.firstName, 
                                            lastName: this.state.lastName,
                                            gmcNumber: this.state.gmcNumber,
                                            language: this.state.language,
                                            },
                                            constraintsBasicInfo, { format: "detailed" });

        if (isValidInfo != undefined) {
            this.setState({ 'spinner': false });
            DropDownHolder.dropDown.alertWithType('error', 'Error', (isValidInfo[0]).error);
            return false;
        } else {
            this.basicUpdateHandler();
        }
    }

    basicUpdateHandler = async () => {
        const languageString = await this.convertMultiSelectToCsv(this.state.languageOption);
        this.setServices.postService(SIGNUP_UPDATE_URL+'/'+this.state.userId , ServiceParams.getBasicInfoParams(this.state.password,
                                                                                                                this.state.firstName,
                                                                                                                this.state.lastName,
                                                                                                                this.state.gmcNumber,
                                                                                                                languageString))
          .then(async (responseJson) => {   
            if (responseJson.error == 0) {
              DropDownHolder.dropDown.alertWithType('success', 'Success', responseJson.info);
              
              await AsyncStorage.multiSet([
                    ['firstName', this.state.firstName != null ? this.state.firstName : ''],
                    ['lastName', this.state.lastName!= null ? this.state.lastName : ''],
                    ['gmcNumber', this.state.gmcNumber != null ? this.state.gmcNumber : ''],
                    ['language', languageString != null ? languageString : ''],
                ], 
                (err) => {console.log(err)});  
            } else {
              DropDownHolder.dropDown.alertWithType('error', 'Error', responseJson.info);
            }
                     
            this.setState({ 'spinner': false });
          }, (error) => { 
            this.setState({ 'spinner': false });
            DropDownHolder.dropDown.alertWithType('error', 'Error', ' results:' + error);
          })
      }

      convertMultiSelectToCsv = async (selectedState) => {
        var convertedString = "";
        await selectedState.map((item, key) => {
            if(item.selected == true) {
                convertedString = (convertedString == "" ? item.value : (convertedString + ","+item.value));
            }
        });
        return convertedString;
    }

      handleClick(fieldName, value){
            
        switch(fieldName) {
            case 'qualification' : 
                this.setState({qualification: value});
            break;
            case 'language' : 
                this.setState({language: value});
            break;
            case 'speciality' : 
                this.setState({speciality: value});
            break;
            case 'itSystem' : 
                this.setState({itSystem: value});
            break;
        }
    }

    onClose = (fieldName) => {            
        switch(fieldName) {
            case 'qualification' : 
                this.setState({ showQualifications: false });
            break;
            case 'language' : 
                this.setState({ showLanguage: false });
            break;
            case 'speciality' : 
                this.setState({ showSpeciality: false });
            break;
            case 'itSystem' : 
                this.setState({ showItSystem: false });
            break;
        }
    }

    handleType  = async (sortOption, fieldName) => {
        switch(fieldName) {
            case 'qualification' : 
                const qualificationString = await this.convertMultiSelectToCsv(sortOption);
                this.setState({qualification : qualificationString});
                this.setState({qualificationOption: sortOption });
                this.setState({ qualificationVisible: false });
            break;
            case 'language' :
                const languageString = await this.convertMultiSelectToCsv(sortOption); 
                this.setState({language : languageString});
                this.setState({languageOption: sortOption });
                this.setState({ languageVisible: false });
            break;
            case 'speciality' : 
                const itSystemString = await this.convertMultiSelectToCsv(sortOption);
                this.setState({speciality : itSystemString});
                this.setState({specialityOption: sortOption });
                this.setState({ specialityVisible: false });
            break;
            case 'itSystem' : 
                const specialityString = await this.convertMultiSelectToCsv(sortOption);
                this.setState({itSystem : specialityString});
                this.setState({itSystemOption: sortOption });
                this.setState({ itSystemVisible: false });
            break;
        }
    }

    render() {
        let that = this;
        let languageData = [{id:1,text: 'Arabic',}, {id:2,text: 'Bengali',}, {id:3,text: 'Chinese',},
                            {id:4,text: 'French',}, {id:5,text: 'German',}, {id:6,text: 'Hindi',},
                            {id:7,text: 'Punjabi',}, {id:8,text: 'Polish',}, {id:9,text: 'Urdu',}, {id:10,text: 'English(Optional)',}];

        let languageItems = languageData.map(function(result) {
            return (<ListItem key={result.id}  button={true} onPress={() => {
                        that.handleClick('language', result.text); 
                        that.onClose('language');
                        }} style={ profileStyles.listItem }
                        selected= {result.text == that.state.language ? true : false}>
                        <Text>{result.text}</Text>
                    </ListItem>) ;
        });
        return (
            <SafeAreaView>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Loading...'}
                    textStyle={profileStyles.spinnerTextStyle}
                />
                <KeyboardAvoidingView behavior='padding' >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                        <View style={{ paddingBottom: 10}}>
                            <View style={{ paddingBottom: 20}}>
                                <View>
                                    <View style={{ marginTop: 20}}> 
                                        { (this.state.firstName != null && this.state.firstName != '') &&
                                            <Text style={ profileStyles.inputLabel }>First name</Text>
                                        }
                                        <View style = {{ borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                            <View style = {{ width: '100%', alignContent: 'flex-start' , justifyContent:'center', }}>
                                                <TextInput
                                                    id='firstName'
                                                    onChangeText={(firstName) => this.setState({ firstName })}
                                                    placeholder='First Name'
                                                    placeholderTextColor='#AAB2BD'
                                                    keyboardType='email-address'
                                                    returnKeyType='next'
                                                    autoCorrect={false}
                                                    style={profileStyles.inputLabelHide}
                                                    value={this.state.firstName} />
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ marginTop: 20}}> 
                                        { (this.state.lastName != null && this.state.lastName != '') &&
                                            <Text style={ profileStyles.inputLabel }>Last name</Text>   
                                        }
                                        <View style = {{ borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                            <View style = {{ width: '100%', alignContent: 'flex-start' , justifyContent:'center', }}>
                                                <TextInput
                                                    id='lastName'
                                                    onChangeText={(lastName) => this.setState({ lastName })}
                                                    placeholder="Last Name"
                                                    placeholderTextColor='#AAB2BD'
                                                    returnKeyType='next'
                                                    autoCorrect={false}
                                                    style={profileStyles.inputLabelHide}
                                                    value={this.state.lastName} />
                                            </View>
                                        </View>
                                    </View>    
                                    
                                    <View style={{ marginTop: 20}}> 
                                        { (this.state.gmcNumber != null && this.state.gmcNumber != '') &&
                                            <Text style={ profileStyles.inputLabel }>Registration number</Text>
                                        }
                                        <View style = {{ borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                            <View style = {{ width: '100%', alignContent: 'flex-start' , justifyContent:'center', }}>
                                                <TextInput
                                                    id='gmcNumber'
                                                    onChangeText={(gmcNumber) => this.setState({ gmcNumber })}
                                                    placeholder="GMC Number"
                                                    placeholderTextColor='#AAB2BD'
                                                    returnKeyType='next'
                                                    autoCorrect={false}
                                                    style={profileStyles.inputLabelHide}
                                                    value={this.state.gmcNumber} />
                                            </View>
                                        </View>
                                    </View>    
                                    
                                    <View style={{ marginTop: 20}}> 
                                        { (this.state.language != null && this.state.language != '') &&
                                            <Text style={ profileStyles.inputLabel }>Languages</Text>
                                        }

                                        <View style = {{ borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                            <View style = {{ width: '100%', alignContent: 'flex-start' , justifyContent:'center', }}>
                                                <TouchableOpacity onPress={() => {
                                                    this.setState({languageVisible: true});
                                                }} style={ [profileStyles.dropDownArea,{height: 30}] }>
                                                <View style={ profileStyles.aliasDropDown }>
                                                    <View style={ profileStyles.dropDownValueSection }>
                                                        <Text style={ ((this.state.language != null && this.state.language != '')? profileStyles.dropDownValueText : profileStyles.dropDownValueTextToSelect ) }>
                                                            {((this.state.language != null && this.state.language != '')? this.state.language : 'Add Language')}
                                                        </Text>
                                                    </View>
                                                    <View style={{paddingTop:8, justifyContent: 'center',}}><Text>
                                                        <Image resizeMode='stretch' style={ profileStyles.dropDownImage } source={this.state.arrowSource} />
                                                    </Text></View>
                                                </View>
                                                {/* <View style={ profileStyles.hrLine } /> */}
                                                </TouchableOpacity> 
                                            </View>
                                        </View>
                                    </View>    
                                </View>
                            </View>
                            <View style={profileStyles.footerContainer}>
                                <View style={profileStyles.loginButtonArea}>
                                    <TouchableOpacity style={profileStyles.loginTouchable} onPress={() => {
                                        this.setState({ 'spinner': true });
                                        this.basicInfoValidate();
                                    }}>
                                        <Text style={profileStyles.loginButton}>SAVE</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ flex: 1 }}></View>
                            <Overlay visible={ this.state.showLanguage} 
                                    onClose={() => this.onClose('language')} 
                                    closeOnTouchOutside 
                                    containerStyle={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                                    childrenWrapperStyle={ profileStyles.overlayChildStyle }
                            >                    
                                <List style={ profileStyles.listDropDown }>                   
                                    <ScrollView>{ languageItems }</ScrollView>
                                </List>
                            </Overlay>

                            {this.state.languageVisible == true && 
                                <CustomMultiSelectDropDown 
                                title={'Add Language'} 
                                fieldName= 'language'  
                                sortOption={this.state.languageOption} 
                                visible={this.state.languageVisible} 
                                onSelectItem={this.handleType} 
                                // onClose={() => this.onClose('language')}
                                selectedValue= {this.state.language} /> 
                            }
                        </View>

                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}