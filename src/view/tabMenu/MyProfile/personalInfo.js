import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TextInput,
    TouchableOpacity, SafeAreaView, StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback,
    Keyboard, AsyncStorage, Dimensions, ScrollView } from 'react-native';
import validate from 'validate.js';
import Spinner from 'react-native-loading-spinner-overlay';
import { Content, Icon, Picker, Form, List, ListItem } from 'native-base';
import Overlay from 'react-native-modal-overlay';
import { profileStyles  } from './styles';
import DropDownHolder from '../../../components/dropDown/dropDownHolder';
import { P_INFO_UPDATE_URL } from '../../../config/shared';
import { ServiceParams } from '../../../services/serviceParams';
import { Services } from '../../../services/services';
import CustomMultiSelectDropDown from '../../../components/CustomDropDown/customMultiSelectDropDown';

const constraintsPersonalInfo = {
    qualification: {
        presence: {
            allowEmpty: false,
            message: "cannot be blank."
        },
    },

    smartCard: {
        presence: {
            allowEmpty: false,
            message: "cannot be blank."
        },
    },
    
    itSystem: {
        presence: {
            allowEmpty: false,
            message: "cannot be blank."
        },
    },
    
  }

  const fruits = ['Apples', 'Oranges', 'Pears'];
  const renderLabel = (label, style) => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image style={{width: 42, height: 42}} source={{uri: 'https://dummyimage.com/100x100/52c25a/fff&text=S'}} />
        <View style={{marginLeft: 10}}>
          <Text style={style}>{label}</Text>
        </View>
      </View>
    )
  }

export class PersonalInfo extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            selectedItems: [],
          qualification: '',
          smartCard: '',
          itSystem: '',
          speciality:'',
          isVisible: false,
          spinner: true,
          userId: null,
          modalVisible: false, 
          width:  (Dimensions.get('window').width),
          height:  (Dimensions.get('window').height),
          showQualifications: false,
          arrowSource: require("./images/dropdown-arrow.png"),
          showLanguage: false,
          showSpeciality: false,
          showItSystem: false,
          selectedFruits: [],
          qualificationVisible: false,
          qualificationOption: [
              {
                  value: 'MBBS',
                  id: 1,
                  selected: false,
                  sort: 'data'
              }, {
                  value: 'MBChB',
                  id: 2,
                  selected: false,
                  sort: 'data'
              }, {
                  value: 'CCT in GP',
                  id: 3,
                  selected: false,
                  sort: 'data'
              }, {
                  value: 'DCH',
                  id: 4,
                  selected: false,
                  sort: 'data'
              }, {
                  value: 'DFRSH',
                  id: 5,
                  selected: false,
                  sort: 'data'
              }, {
                value: 'DRCOG',
                id: 6,
                selected: false,
                sort: 'data'
            }, {
                value: 'MRCGP',
                id: 7,
                selected: false,
                sort: 'data'
            }, {
                value: 'DGM',
                id: 8,
                selected: false,
                sort: 'data'
            }, {
                value: 'MRCGP(INT)',
                id: 9,
                selected: false,
                sort: 'data'
            }
          ],
          specialityVisible: false,
          specialityOption: [
              {
                  value: 'Care for older People',
                  id: 1,
                  selected: false,
                  sort: 'data'
              }, {
                  value: 'Child Protection',
                  id: 2,
                  selected: false,
                  sort: 'data'
              }, {
                  value: 'Coronary Heart disease',
                  id: 3,
                  selected: false,
                  sort: 'data'
              }, {
                  value: 'Dermatology',
                  id: 4,
                  selected: false,
                  sort: 'data'
              }, {
                  value: 'Diabetes',
                  id: 5,
                  selected: false,
                  sort: 'data'
              }, {
                value: 'Drug Misuse',
                id: 6,
                selected: false,
                sort: 'data'
            }, {
                value: 'Echocardiography',
                id: 7,
                selected: false,
                sort: 'data'
            }, {
                value: 'Emergency Care',
                id: 8,
                selected: false,
                sort: 'data'
            }, {
                value: 'Ear nose and throat',
                id: 9,
                selected: false,
                sort: 'data'
            }, {
                value: 'Epilepsy',
                id: 10,
                selected: false,
                sort: 'data'
            }, {
                value: 'Headaches',
                id: 11,
                selected: false,
                sort: 'data'
            }, {
                value: 'Mental health',
                id: 12,
                selected: false,
                sort: 'data'
            }, {
                value: 'Musculoskeletal conditions',
                id: 13,
                selected: false,
                sort: 'data'
            }, {
                value: 'Palliative care',
                id: 14,
                selected: false,
                sort: 'data'
            }, {
                value: 'Respiratory medicine',
                id: 15,
                selected: false,
                sort: 'data'
            }, {
                value: 'Sexual Health',
                id: 16,
                selected: false,
                sort: 'data'
            }, {
                value: 'Other',
                id: 17,
                selected: false,
                sort: 'data'
            }
          ],
          itSystemVisible: false,
          itSystemOption: [
                {
                    value: 'EMIS LV',
                    id: 1,
                    selected: false,
                    sort: 'data'
                }, {
                    value: 'EMIS PCS',
                    id: 2,
                    selected: false,
                    sort: 'data'
                }, {
                    value: 'EMIS WEB',
                    id: 3,
                    selected: false,
                    sort: 'data'
                }, {
                    value: 'SYNERGY',
                    id: 4,
                    selected: false,
                    sort: 'data'
                }, {
                    value: 'TOREX',
                    id: 5,
                    selected: false,
                    sort: 'data'
                }, {
                  value: 'VISION',
                  id: 6,
                  selected: false,
                  sort: 'data'
              }, {
                  value: 'ADASTRA',
                  id: 7,
                  selected: false,
                  sort: 'data'
              }, {
                  value: 'MICROTEST',
                  id: 8,
                  selected: false,
                  sort: 'data'
              }, {
                  value: 'CROSSCARE',
                  id: 9,
                  selected: false,
                  sort: 'data'
              }, {
                  value: 'SYSTEM ONE',
                  id: 10,
                  selected: false,
                  sort: 'data'
              }
            ],
            saveQualification : null,
            saveLanguage : null,
            saveItSystem : null,
            saveSpeciality : null,
        };      
    
        this.setServices = new Services();

      }
    
      componentDidMount() {
          AsyncStorage.multiGet([ "qualification",
                                  "smartCard",
                                  "itSystem",
                                  "speciality",
                                  "user_id"
                              ]).then(response => {
                                      response.forEach((element, index, array) => {
                                          {this.selectedDropDowns(this.state.qualificationOption , response[0][1]);this.setState({"qualification" : response[0][1]});}
                                          this.setState({"smartCard" : response[1][1]});
                                          {this.selectedDropDowns(this.state.itSystemOption , response[2][1]);this.setState({"itSystem" : response[2][1]});}
                                          {this.selectedDropDowns(this.state.specialityOption , response[3][1]);this.setState({"speciality": response[3][1]});}
                                          this.setState({"userId" : response[4][1]});
                                      });
            
            this.setState({ 'spinner': false });
  
          })
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
  
      personalInfoValidate = () => {
  
          var isValidInfo= validate({ qualification: this.state.qualification, 
                                      smartCard: this.state.smartCard,
                                      itSystem: this.state.itSystem,
                                      speciality: this.state.speciality},
                                      constraintsPersonalInfo, { format: "detailed" });

          if (isValidInfo != undefined) {
              this.setState({ 'spinner': false });
              DropDownHolder.dropDown.alertWithType('error', 'Error', (isValidInfo[0]).error);
              return false;
          } else {
            //   this.setState({ 'spinner': false });
              this.personalUpdateHandler();
          }
      }
  
      personalUpdateHandler = async () => {
          const qualificationString = await this.convertMultiSelectToCsv(this.state.qualificationOption);
          const itSystemString = await this.convertMultiSelectToCsv(this.state.itSystemOption);
          const specialityString = await this.convertMultiSelectToCsv(this.state.specialityOption);

          this.setServices.postService(P_INFO_UPDATE_URL+'/'+this.state.userId, ServiceParams.getPersonalInfoParams(qualificationString,
                                                                                                                    this.state.smartCard,
                                                                                                                    itSystemString,
                                                                                                                    specialityString))
            .then(async (responseJson) => {     
                if (responseJson.error == 0) {
                    DropDownHolder.dropDown.alertWithType('success', 'Success', "Personal Info successfully saved");
                
                    await AsyncStorage.multiSet([
                        ['qualification', qualificationString != null ? qualificationString : ''],
                        ['smartCard', this.state.smartCard!= null ? this.state.smartCard : ''],
                        ['itSystem', itSystemString != null ? itSystemString: ''],
                        ['speciality', specialityString != null ? specialityString : ''],
                    ], 
                    (err) => {console.log(err)});  
                    
                } else {
                    DropDownHolder.dropDown.alertWithType('error', 'Error', responseJson.info);
                }

                this.setState({ 'spinner': false });
            }, (error) => { console.log(error);
              this.setState({ 'spinner': false });
              DropDownHolder.dropDown.alertWithType('error', 'Error', ' results:' + error);
            });
                 
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
                case 'speciality' : 
                    this.setState({ showSpeciality: false });
                break;
                case 'itSystem' : 
                    this.setState({ showItSystem: false });
                break;
            }
        }

        checkSelectedItem = (item, selectedItems) => {
            var splittedItems = selectedItems.split(',');
            return splittedItems.includes(item);
        }
    
        handleType  = async (sortOption, fieldName) => {
            switch(fieldName) {
                case 'qualification' : 
                    const qualificationString = await this.convertMultiSelectToCsv(sortOption);
                    this.setState({qualification : qualificationString});
                    this.setState({qualificationOption: sortOption });
                    this.setState({ qualificationVisible: false });
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
        let qualificationData = [{id:1,text: 'MBBS',}, {id:2,text: 'MBChB',}, {id:3,text: 'CCT in GP',},
                                 {id:4,text: 'DCH',}, {id:5,text: 'DFRSH',}, {id:6,text: 'DGM',},
                                 {id:7,text: 'DRCOG',}, {id:8,text: 'MRCGP',}, {id:9,text: 'MRCGP(INT)',}];
        let qualificationItems = qualificationData.map(function(result) {
                return (<ListItem key={result.id}  button={true} onPress={() => {
                            that.handleClick('qualification', result.text); 
                            that.onClose('qualification');
                            }} style={ profileStyles.listItem }
                            selected= {result.text == that.state.qualification ? true : false}>
                            <Text>{result.text}</Text>
                        </ListItem>) ;
        });

        let specialityData =  [{id:1,text: 'Care for older People',}, {id:2,text: 'Child Protection',}, 
                                {id:3,text: 'Coronary Heart disease',},{id:4,text: 'Dermatology',},
                                {id:5,text: 'Diabetes',}, {id:6,text: 'Drug Misuse',},
                                {id:7,text: 'Echocardiography',},{id:8,text: 'Emergency Care',},
                                {id:9,text: 'Ear nose and throat',}, {id:10,text: 'Epilepsy',},
                                {id:11,text: 'Headaches',}, {id:12,text: 'Mental health',},
                                {id:13,text: 'Musculoskeletal conditions',}, {id:14,text: 'Palliative care',},
                                {id:15,text: 'Respiratory medicine',}, {id:16,text: 'Sexual Health',}, 
                                {id:17,text: 'Other',}];
                            
        let specialityItems = specialityData.map(function(result) {
            return (<ListItem key={result.id}  button={true} onPress={() => {
                        that.handleClick('speciality', result.text); 
                        that.onClose('speciality');
                        }} style={ profileStyles.listItem }
                        selected= {result.text == that.state.speciality ? true : false}>
                        <Text>{result.text}</Text>
                    </ListItem>) ;
        });

        let itSystemData =  [{id:1,text: 'EMIS LV',}, {id:2,text: 'EMIS PCS',}, {id:3,text: 'EMIS WEB',},
                                {id:4,text: 'SYNERGY',}, {id:5,text: 'TOREX',}, {id:6,text: 'VISION',},
                                {id:7,text: 'ADASTRA',}, {id:8,text: 'MICROTEST',}, {id:9,text: 'CROSSCARE',}, 
                                {id:10,text: 'SYSTEM ONE',}];
        
        let itSystemItems = itSystemData.map(function(result) {
            return (<ListItem key={result.id}  button={true} onPress={() => {
                        that.handleClick('itSystem', result.text); 
                        that.onClose('itSystem');
                        }} style={ profileStyles.listItem }
                        selected= {result.text == that.state.itSystem ? true : false}>
                        <Text>{result.text}</Text>
                    </ListItem>) ;
        });

          const { selectedItems } = this.state;
        return (
            
            <SafeAreaView>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Loading...'}
                    textStyle={profileStyles.spinnerTextStyle}
                />
                <View>
                    <View style={{ paddingBottom: 20}}>
                        <KeyboardAvoidingView behavior='padding' >
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss} >                                
                                    <View style={ profileStyles.formView }>  
                                        <View style={{ marginTop: 20}}> 
                                            { (this.state.qualification != null && this.state.qualification != '') &&                                  
                                                <Text style={[profileStyles.inputLabel]}>Qualification </Text>
                                            }
                                            <View style = {{ borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                                <View style = {{ width: '100%', alignContent: 'flex-start' , justifyContent:'center', }}>
                                                    <TouchableOpacity onPress={() => {
                                                        this.setState({qualificationVisible: true});
                                                    }} style={  [profileStyles.dropDownArea,{height: 30}]  }>
                                                    <View style={ profileStyles.aliasDropDown }>
                                                        <View style={ profileStyles.dropDownValueSection }>
                                                            <Text style={ ((this.state.qualification != null && this.state.qualification != '')? profileStyles.dropDownValueText : profileStyles.dropDownValueTextToSelect ) }>
                                                                {((this.state.qualification != null && this.state.qualification != '')? this.state.qualification : 'Select Qualification')}
                                                            </Text>
                                                        </View>
                                                        <View style={ profileStyles.dropDownIconSection }><Text>
                                                            <Image resizeMode='stretch' style={ profileStyles.dropDownImage } source={this.state.arrowSource} />
                                                        </Text></View>
                                                    </View>
                                                    {/* <View style={ profileStyles.hrLine } /> */}
                                                    </TouchableOpacity>  
                                                </View>
                                            </View>
                                        </View>

                                        <View style={{ marginTop: 20}}> 
                                            { (this.state.speciality != null && this.state.speciality != '') &&     
                                                <Text style={[profileStyles.inputLabel]}>Speciality</Text>
                                            }
                                            <View style = {{ borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                                <View style = {{ width: '100%', alignContent: 'flex-start' , justifyContent:'center', }}>
                                                    <TouchableOpacity onPress={() => {
                                                        this.setState({specialityVisible: true});
                                                    }} style={  [profileStyles.dropDownArea,{height: 30}]  }>
                                                    <View style={ profileStyles.aliasDropDown }>
                                                        <View style={ profileStyles.dropDownValueSection }>
                                                            <Text style={ ((this.state.speciality != null && this.state.speciality != '')? profileStyles.dropDownValueText : profileStyles.dropDownValueTextToSelect )}>
                                                                {((this.state.speciality != null && this.state.speciality != '')? this.state.speciality : 'Add Speciality')}
                                                            </Text>
                                                        </View>
                                                        <View style={ profileStyles.dropDownIconSection }><Text>
                                                            <Image resizeMode='stretch' style={ profileStyles.dropDownImage } source={this.state.arrowSource} />
                                                        </Text></View>
                                                    </View>
                                                    {/* <View style={ profileStyles.hrLine } /> */}
                                                    </TouchableOpacity> 
                                                </View>
                                            </View>
                                        </View>

                                        <View style={{ marginTop: 20}}> 
                                            { (this.state.itSystem != null && this.state.itSystem != '') &&  
                                                <Text style={[profileStyles.inputLabel]}>IT System</Text>
                                            }
                                            <View style = {{ borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                                <View style = {{ width: '100%', alignContent: 'flex-start' , justifyContent:'center', }}>
                                                    <TouchableOpacity onPress={() => {
                                                        this.setState({itSystemVisible: true});
                                                    }} style={  [profileStyles.dropDownArea,{height: 30}]  }>
                                                    <View style={ profileStyles.aliasDropDown }>
                                                        <View style={ profileStyles.dropDownValueSection }>
                                                            <Text style={ ((this.state.itSystem != null && this.state.itSystem != '')? profileStyles.dropDownValueText : profileStyles.dropDownValueTextToSelect ) }>
                                                                {((this.state.itSystem != null && this.state.itSystem != '')? this.state.itSystem : 'Add IT systems')}
                                                            </Text>
                                                        </View>
                                                        <View style={ profileStyles.dropDownIconSection }><Text>
                                                            <Image resizeMode='stretch' style={ profileStyles.dropDownImage } source={this.state.arrowSource} />
                                                        </Text></View>
                                                    </View>
                                                    {/* <View style={ profileStyles.hrLine } /> */}
                                                    </TouchableOpacity> 
                                                </View>
                                            </View>
                                        </View>

                                        <View style={{ marginTop: 20}}> 
                                            { (this.state.smartCard != null && this.state.smartCard != '') &&                                          
                                                <Text style={[profileStyles.inputLabel]}>Smart card number</Text>
                                            }
                                            <View style = {{ borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                                <View style = {{ width: '100%', alignContent: 'flex-start' , justifyContent:'center', }}>
                                                    <TextInput
                                                        id='smartCard'
                                                        onChangeText={(smartCard) => this.setState({ smartCard })}
                                                        placeholder="Smart Card Number"
                                                        placeholderTextColor='#AAB2BD'
                                                        returnKeyType='next'
                                                        autoCorrect={false}
                                                        style={profileStyles.inputLabelHide}
                                                        value={this.state.smartCard} />
                                                </View>
                                            </View>
                                        </View>

                                    </View>
                                    
                            </TouchableWithoutFeedback>
                        </KeyboardAvoidingView>
                    </View>
                    <View style={profileStyles.footerContainer}>
                        <View style={profileStyles.loginButtonArea}>
                            <TouchableOpacity style={profileStyles.loginTouchable} onPress={() => {
                                if (this.personalInfoValidate()) {
                                    this.setState({ 'spinner': true });
                                    this.personalUpdateHandler();
                                }
                            }}>
                                <Text style={profileStyles.loginButton}>SAVE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}></View>
                </View>
                <Overlay visible={ this.state.showQualifications} 
                        onClose={() => this.onClose('qualification')} 
                        closeOnTouchOutside 
                        containerStyle={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                        childrenWrapperStyle={ profileStyles.overlayChildStyle }
                >                    
                    <List style={ profileStyles.listDropDown }>                   
                    <ScrollView>{ qualificationItems }</ScrollView>
                    </List>                    
                </Overlay>
                <Overlay visible={ this.state.showSpeciality} 
                        onClose={() => this.onClose('speciality')} 
                        closeOnTouchOutside = {true}
                        containerStyle={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                        childrenWrapperStyle={ profileStyles.overlayChildStyle }
                >
                    <List style={ profileStyles.listDropDown }>  
                        <ScrollView>{ specialityItems }</ScrollView>                                     
                    </List>
                </Overlay>
                <Overlay visible={ this.state.showItSystem} 
                        onClose={() => this.onClose('itSystem')} 
                        closeOnTouchOutside 
                        containerStyle={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                        childrenWrapperStyle={ profileStyles.overlayChildStyle }
                >
                    <List style={ profileStyles.listDropDown }>  
                        <ScrollView>{ itSystemItems }</ScrollView>                                     
                    </List>    
                </Overlay>


                {this.state.qualificationVisible == true && 
                    <CustomMultiSelectDropDown 
                    title={'Select Qualifications'} 
                    fieldName= 'qualification'  
                    sortOption={this.state.qualificationOption} 
                    visible={this.state.qualificationVisible} 
                    onSelectItem={this.handleType} 
                    // onClose={() => this.onClose('qualification')}
                    selectedValue= {this.state.qualification} /> 
                }

                {this.state.specialityVisible == true && 
                    <CustomMultiSelectDropDown 
                    title={'Add Speciality'}  
                    fieldName= 'speciality' 
                    sortOption={this.state.specialityOption} 
                    visible={this.state.specialityVisible} 
                    onSelectItem={this.handleType} 
                    // onClose={() => this.onClose('speciality')}
                    selectedValue= {this.state.speciality} /> 
                }

                {this.state.itSystemVisible == true && 
                    <CustomMultiSelectDropDown 
                    title={'Add IT systems'} 
                    fieldName= 'itSystem'  
                    sortOption={this.state.itSystemOption} 
                    visible={this.state.itSystemVisible} 
                    onSelectItem={this.handleType} 
                    // onClose={() => this.onClose('itSystem')}
                    // selectedValue= {this.state.itSystem}
                     /> 
                }

                
            </SafeAreaView>
        );
    }
}