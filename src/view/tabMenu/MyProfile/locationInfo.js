import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TextInput,
    TouchableOpacity, SafeAreaView, StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback,
    Keyboard, AsyncStorage } from 'react-native';
import { profileStyles } from './styles';
import validate from 'validate.js';
import Spinner from 'react-native-loading-spinner-overlay';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import DropDownHolder from "../../../components/dropDown/dropDownHolder";
import { API_URL, SIGNUP_UPDATE_URL } from '../../../config/shared';
import { ServiceParams } from '../../../services/serviceParams';
import { Services } from '../../../services/services';
import { Fonts } from '../../../config/font';

const constraintsBasicInfo = {
    address1: {
        presence: {
            allowEmpty: false,
            message: "cannot be blank."
        },
    },
    city: {
        presence: {
            allowEmpty: false,
            message: "cannot be blank."
        },
    },
    postCode: {
        presence: {
            allowEmpty: false,
            message: "cannot be blank."
        },
    },
  }

export class LocationInfo extends React.Component {
    constructor(){
      super()
      this.state = {
          address1: null,
          address2: null,
          postCode: null,
          city: null,
          password: null,
          spinner: true,
          userId: null
      };
  
      this.setServices = new Services();
    }
  
    componentDidMount = async () => {
        await AsyncStorage.multiGet([
                            "address1",
                            "postCode",
                            "city",
                            "user_id",
                            "address2",
                            ]).then(response => { 
                                this.setState({"address1" : response[0][1]});
                                this.setState({"postCode" : response[1][1]});
                                this.setState({"city" : response[2][1]});  
                                this.setState({"userId" : response[3][1]}); 
                                this.setState({"address2" : response[4][1]});                
        });

        this.setState({ 'spinner': false });
    }

    basicInfoValidate = () => {

        var isValidInfo= validate({ address1: this.state.address1,
                                            postCode: this.state.postCode,
                                            city: this.state.city,
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
        this.setServices.postService(SIGNUP_UPDATE_URL+'/'+this.state.userId, ServiceParams.getLocationInfoParams(this.state.address1,
                                                                                                                this.state.address2,
                                                                                                                this.state.postCode,
                                                                                                                this.state.city))
          .then(async (responseJson) => {       
            if (responseJson.error == 0) {
              DropDownHolder.dropDown.alertWithType('success', 'Success', responseJson.info);
              
              await AsyncStorage.multiSet([
                    ['address1', this.state.address1 != null ? this.state.address1 : ''],
                    ['address2', this.state.address2 != null ? this.state.address2 : ''],
                    ['postCode', this.state.postCode != null ? this.state.postCode : ''],
                    ['city', this.state.city!= null ? this.state.city : ''],
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

      separateMapDetails = async (mapDetails) => {
        this.setState({address1: mapDetails.name});
        await mapDetails.address_components.map((item, key) => {
            let type = item.types;
            let longValue = item.long_name;
            if(type[0] == 'postal_code') {
                this.setState({postCode: longValue});
            }

            if(type[0] == 'locality') {
                this.setState({city: longValue});
            } else { 
                if(type[0] == 'administrative_area_level_1') {
                    this.setState({city: longValue});
                }else{
                    if(type[0] == 'postal_town') {
                        this.setState({city: longValue});
                    }
                }
            }
        });
        this.setState({ 'spinner': false });
      }

    render() {
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
                            <View  style={{ paddingBottom: 20}}>
                                <View> 
                                    <GooglePlacesAutocomplete
                                            placeholder='Enter your home address here'
                                            minLength={5}
                                            autoFocus={false}
                                            listViewDisplayed={false}
                                            returnKeyType='next'
                                            fetchDetails={true}
                                            onPress={(data, details = null) => { 
                                                this.setState({ 'spinner': true });
                                                this.separateMapDetails(details);
                                            }}
                                            styles={{
                                                container: {
                                                    left:0
                                                },
                                                description: {
                                                    left:0
                                                },
                                                textInputContainer: {
                                                    left:0,
                                                    backgroundColor: 'rgba(0,0,0,0)',
                                                    borderTopWidth: 0,
                                                    borderBottomWidth:0,
                                                    width: '100%'
                                                },
                                                textInput: {
                                                    height:50,     
                                                    color: '#414253',
                                                    fontFamily: Fonts.MontserratBold,
                                                    fontSize: 15,
                                                    borderStyle: 'solid',
                                                    alignItems: 'flex-start',
                                                    paddingLeft:0,
                                                    marginLeft: 0
                                                },
                                                row: {
                                                    padding: 0,
                                                    paddingTop: 12,
                                                    paddingBottom: 12,
                                                },
                                                predefinedPlacesDescription: {
                                                    color: '#ff1ff1'
                                                },
                                                listView: {
                                                    color: '#fff',
                                                }
                                            }}
                                            query={{
                                                key: 'AIzaSyD7g4ML20UX9ijACWAvTSpIm_wZTMCGhNU',
                                                language: 'en', // language of the results
                                                //types: '(cities)' // default: 'geocode'
                                            }}
                                            filterReverseGeocodingByTypes={[
                                                'locality',
                                                'geocode',
                                                'postal_code',
                                                'administrative_area_level_1',
                                                'administrative_area_level_2',
                                                'administrative_area_level_3'
                                            ]}
                                            currentLocation={false}
                                        />                                   
                                        <View style={{ marginTop: 20}}> 
                                            { (this.state.address1 != null && this.state.address1 != '') &&                                    
                                                <Text style={ profileStyles.inputLabel }>Address 1</Text>
                                            }
                                            <View style = {{ borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                                <View style = {{ width: '100%', alignContent: 'flex-start' , justifyContent:'center', }}>
                                                    <TextInput
                                                        id='address1'
                                                        onChangeText={(address1) => this.setState({ address1 })}
                                                        placeholder='Address 1'
                                                        placeholderTextColor='#AAB2BD'
                                                        keyboardType='email-address'
                                                        returnKeyType='next'
                                                        autoCorrect={false}
                                                        style={profileStyles.inputLabelHide}
                                                        value={this.state.address1} />
                                                </View>
                                        </View>
                                    </View>

                                    <View style={{ marginTop: 20}}> 
                                        { (this.state.address2 != null && this.state.address2 != '') &&
                                            <Text style={ profileStyles.inputLabel }>Address 2</Text>
                                        }
                                        <View style = {{ borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                            <View style = {{ width: '100%', alignContent: 'flex-start' , justifyContent:'center', }}>
                                                <TextInput
                                                    id='address2'
                                                    onChangeText={(address2) => this.setState({ address2 })}
                                                    placeholder='Address 2'
                                                    placeholderTextColor='#AAB2BD'
                                                    keyboardType='email-address'
                                                    returnKeyType='next'
                                                    autoCorrect={false}
                                                    style={profileStyles.inputLabelHide}
                                                    value={this.state.address2} />
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ marginTop: 20}}> 
                                        { (this.state.city != null && this.state.city != '') &&                                        
                                            <Text style={ profileStyles.inputLabel }>Town / City</Text>
                                        }
                                        <View style = {{ borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                            <View style = {{ width: '100%', alignContent: 'flex-start' , justifyContent:'center', }}>
                                                <TextInput
                                                    id='city'
                                                    onChangeText={(city) => this.setState({ city })}
                                                    placeholder="Town / City"
                                                    placeholderTextColor='#AAB2BD'
                                                    returnKeyType='next'
                                                    autoCorrect={false}
                                                    style={profileStyles.inputLabelHide}
                                                    value={this.state.city} />
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ marginTop: 20}}> 
                                        { (this.state.postCode != null && this.state.postCode != '') &&
                                            <Text style={ profileStyles.inputLabel }>Postcode</Text>
                                        }
                                        <View style = {{ borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                            <View style = {{ width: '100%', alignContent: 'flex-start' , justifyContent:'center', }}>
                                                <TextInput
                                                    id='postCode'
                                                    onChangeText={(postCode) => this.setState({ postCode })}
                                                    placeholder="Postcode"
                                                    placeholderTextColor='#AAB2BD'
                                                    returnKeyType='next'
                                                    autoCorrect={false}
                                                    style={profileStyles.inputLabelHide}
                                                    value={this.state.postCode} />
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

                        </View>

                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}