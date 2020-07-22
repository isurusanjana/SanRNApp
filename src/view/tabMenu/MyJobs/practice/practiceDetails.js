import React, { Component } from 'react';
import { View, Text, Dimensions, StatusBar, TouchableOpacity, ImageBackground, TextInput, 
        SafeAreaView, Image, Platform, NativeModules, AsyncStorage, KeyboardAvoidingView, TouchableWithoutFeedback,
        Keyboard,ScrollView,PermissionsAndroid, StyleSheet, PixelRatio } from 'react-native';

import { Content, Icon, Picker, Form, List, ListItem } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import Spinner from 'react-native-loading-spinner-overlay';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import PTRView from 'react-native-pull-to-refresh';
import { TextInputMask } from 'react-native-masked-text';

import practiceStyles from './styles';
import { Services } from '../../../../services/services';
import { ADD_PRACTICE, EDIT_PRACTICE, MY_PRACTICES_PART1, MY_PRACTICES_PART2, GOOGLE_API_KEY, MILEAGE_CALCULATE } from '../../../../config/shared';
import { ServiceParams } from '../../../../services/serviceParams';
import DropDownHolder from "../../../../components/dropDown/dropDownHolder";
import { Fonts } from '../../../../config/font';
import CustomDropDown from '../../../../components/CustomDropDown/customDropDown';

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 10 : (StatusBarManager.HEIGHT + 10);
const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[styles.statusBar, { backgroundColor }]}>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
);

export default class practiceDetails extends Component {
    constructor(props) {
        super(props);

        const { navigation } = this.props;
        this.state = {
            userId: 0,
            spinner: true,
            pageType: 0,
            pageEdited: false,
            practiceName: null,
            imageWidth: null,
            imageHeight: null,
            headerImageWidth: null,
            headerImageHeight: null,
            header2ImageWidth: null,
            header2ImageHeight: null,
            name : null,
            address1: null,
            address2: null,
            city: null,
            postCode: null,
            distance: null,
            firstSlide: ((navigation.getParam('edit') == '' || navigation.getParam('edit') == undefined || navigation.getParam('edit') == null) ? true : false),
            secondSlide: ((navigation.getParam('edit') == '' || navigation.getParam('edit') == undefined || navigation.getParam('edit') == null) ? false : true),
            thirdSlide: false,
            fourthSlide: false,
            contactName: null,
            email: null,
            phone: null,
            type: null,
            hourlyRate: '0',
            sessionRate: '0',
            arrowSource: require("./images/dropdown-arrow.png"),
            showTypes: false,
            sortVisible: false,
            sortOption: [
                {
                    value: 'GP Surgery',
                    id: 1,
                    selected: false,
                    sort: 'data'
                }, {
                    value: 'Out of Hours',
                    id: 2,
                    selected: false,
                    sort: 'data'
                }, {
                    value: 'Home Visit Service',
                    id: 3,
                    selected: false,
                    sort: 'data'
                }, {
                    value: 'Remote Service',
                    id: 4,
                    selected: false,
                    sort: 'data'
                }
            ],
            currentLatitude: null,
            currentLongitude: null,
            practiceId: 0,
            pointedArea: ((navigation.getParam('pointedArea') == 'new' || navigation.getParam('pointedArea') == undefined || navigation.getParam('pointedArea') == null) ? '' : navigation.getParam('pointedArea')),
            practiceData: ((navigation.getParam('practiceData') == '' || navigation.getParam('practiceData') == undefined || navigation.getParam('practiceData') == null) ? '' : navigation.getParam('practiceData')),
            edit: ((navigation.getParam('edit') == '' || navigation.getParam('edit') == undefined || navigation.getParam('edit') == null) ? false : navigation.getParam('edit'))
        };
        this.setServices = new Services();
        
    }

    componentDidMount = async () => {
        await AsyncStorage.multiGet(["currentLatitude","currentLongitude", "postCode", "user_id"]).then(response => {this.setState({"currentLatitude" : response[0][1],});
                                                                                              this.setState({"currentLongitude" : response[1][1]});
                                                                                              this.setState({"postCode" : response[2][1]});
                                                                                              this.setState({userId : response[3][1]});}); 

        if(this.state.edit == true) {
            this.setState({practiceId: this.state.practiceData['id']});
            this.setState({name: (this.state.practiceData['practice_name'] == 'null' ? '' : this.state.practiceData['practice_name'])});
            this.setState({address1: (this.state.practiceData['practice_address'] == 'null' ? '' : this.state.practiceData['practice_address'])});
            this.setState({city: (this.state.practiceData['practice_city'] == 'null' ? '' : this.state.practiceData['practice_city'])});
            this.setState({postCode: (this.state.practiceData['practice_post_code'] == 'null' ? '' : this.state.practiceData['practice_post_code'])});
            this.setState({distance: (this.state.practiceData['distance'] == 'null' ? '' : this.state.practiceData['distance'])});
            this.setState({contactName: (this.state.practiceData['contact_name'] == 'null' ? '' : this.state.practiceData['contact_name'])});
            this.setState({email: (this.state.practiceData['contact_email'] == 'null' ? '' : this.state.practiceData['contact_email'])});
            this.setState({phone: (this.state.practiceData['contact_phoeno'] == 'null' ? '' : this.state.practiceData['contact_phoeno'])});
            this.setState({type: (this.state.practiceData['practice_type'] == 'null' ? '' : this.state.practiceData['practice_type'])});
            this.setState({hourlyRate: (this.state.practiceData['hourly_rate'] == 'null' ? '' : this.state.practiceData['hourly_rate'])});
            this.setState({sessionRate: (this.state.practiceData['session_rate'] == 'null' ? '' : this.state.practiceData['session_rate'])});

        }
        await this.getScaledHeight(665, 270,1);
        await this.getScaledHeight(750, 382,2);
        if(this.state.currentLatitude == '' || this.state.currentLongitude == '' ) {
            if(Platform.OS === 'android'){
                await this.requestLocationPermission();
            }else{
               await  this.getCurrentLocation();
            }
        } else {
            this.setState({ 'spinner': false });
        }

    }

    getScaledHeight = async (sourceWidth,sourceHeight, type) => {  
        let width = (Dimensions.get('window').width);
        let ratio = width / sourceWidth;
        if(type == 1) {
            await this.setState({
                headerImageWidth: sourceWidth * ratio,
                headerImageHeight: sourceHeight * ratio
            });
        } else {
            await this.setState({
                header2ImageWidth: sourceWidth * ratio,
                header2ImageHeight: sourceHeight * ratio
            }); 
        }
          
        
    }


    backToList() {
        this.props.navigation.state.params.pageRefresh(this);
        this.props.navigation.goBack();
        // this.props.navigationData.navigate('DocumentPage');
    }

    requestLocationPermission = async () => {

        try {
            const hasPermission = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
              );

            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                'title': 'Location Permission',
                'message': 'This App needs access to your location ' +
                           'so we can know where you are.'
              }
            );
            
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              this.getCurrentLocation();
            } else {
                this.setState({ 'spinner': false });
              console.log("Location permission denied")
            }
          } catch (err) {
            this.setState({ 'spinner': false });
            console.log('error ', err);
          }
    }
    
    getCurrentLocation = async () => {
        await navigator.geolocation.watchPosition(
           (position) => { 
           this.setState({
            currentLatitude: position.coords.latitude,
            currentLongitude: position.coords.longitude, 
           })
        },
        (error) => {
            if(error.code == 2 && error.message == "No location provider available."){
                DropDownHolder.dropDown.alertWithType('error', 'Error', ' Please ON the GSP location in your mobile and refresh the page');
            }
            this.setState({ error  : error.message })
        },
        { enableHighAccuracy: false, timeout: 30000, maximumAge: 10000 },
        );
        this.setState({ 'spinner': false });
    }

    separateMapDetails = async (mapDetails) => {
        await this.resetLocationDetails();
        this.setState({name: mapDetails.name});
        // await this.distanceToPractice(mapDetails.geometry.location.lat, mapDetails.geometry.location.lng);
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
            
            if(type[0] == 'route') {
                this.setState({address1: longValue});
            }
            if(type[0] == 'neighborhood') {
                this.setState({address2: longValue});
            }
        });
        this.setState({secondSlide: true});
        this.setState({firstSlide: false}); 
        // this.setState({ 'spinner': false });
        await this.distanceToPractice();
    }

    distanceToPractice = async ()  => {
        var postCode = this.state.postCode;
        this.setServices.getService(MILEAGE_CALCULATE + this.state.userId + '/' + postCode.replace(/ +/g, ""), "")
          .then((responseData) => {
            this.setState({ 'spinner': false });
            this.setState({distance: responseData.info.mileage});
          }, (error) => {    
            this.setState({ 'spinner': false });
            console.log("error Data :", error);
          })
    }

    resetLocationDetails = async () => {
        await this.setState({
            practiceName: null,
            name : null,
            address1: null,
            address2: null,
            city: null,
            postCode: null,
            distance: null,
            contactName: null,
            email: null,
            phone: null,
            type: null,
            hourlyRate: 'Default hourly rate',
            sessionRate: '0',
        });
    }


    savePractice = async () => {
        this.setServices.postService(ADD_PRACTICE+this.state.userId, ServiceParams.setPracticeParams(this.state))
            .then(async (responseJson) => { 
            if (responseJson.error == 0) {
                DropDownHolder.dropDown.alertWithType('success', 'Success', 'Practice has been added successfully');
                if(this.state.pointedArea == 'jobs') {
                    await this.getPracticeData();
                } else {
                    this.backToList();
                }
                this.props.navigation.navigate('myPracticesPage');
                
            } else {
                DropDownHolder.dropDown.alertWithType('error', 'Error', responseJson.info);
                this.setState({ 'spinner': false });
            }

            
            }, (error) => { 
                this.setState({ 'spinner': false });
                DropDownHolder.dropDown.alertWithType('error', 'Error', ' results:' + error);
            }
        )
    }

    updatePractice = async () => {
        this.setServices.postService(EDIT_PRACTICE, ServiceParams.setPracticeParams(this.state))
            .then(async (responseJson) => {               
            if (responseJson.error == 0) {
                DropDownHolder.dropDown.alertWithType('success', 'Success', 'Practice has been updated successfully');
                this.setState({ 'spinner': false });
                this.backToList();
                // if(this.state.pointedArea == 'new') {
                //     goBack();
                // } else {
                //     this.getPracticeData();
                // }
            } else {
                DropDownHolder.dropDown.alertWithType('error', 'Error', responseJson.info);
                this.setState({ 'spinner': false });
            }

            
            }, (error) => { 
                this.setState({ 'spinner': false });
                DropDownHolder.dropDown.alertWithType('error', 'Error', ' results:' + error);
            }
        )
    }

    getPracticeData = () => {

        this.setServices.getService(MY_PRACTICES_PART1 + this.state.userId + MY_PRACTICES_PART2, "")
          .then((responseData) => { 
            this.setState({ 'spinner': false });
            this.practiceData = responseData.info;
            console.log("this.practiceData :", this.practiceData);
            this.props.navigation.state.params.callBack(this.practiceData);
            this.props.navigation.navigate('SelectPracticePage', {
              PracticeDetails: this.practiceData,
              start : 'practice',
              alertType: 'success',
              displayMsg: 'Practice has been added'
            });
          }, (error) => {    
            this.setState({ 'spinner': false });
            console.log("error Data :", error);
          })
    }
    
    onClose  = (sortOption, value) => {
        this.setState({sortOption: sortOption });
        this.setState({type: value});
        this.setState({ sortVisible: false });    
    };

    handleType  = (sortOption, value) => {
        this.setState({sortOption: sortOption });
        this.setState({type: value});
        this.setState({ sortVisible: false });
    }

    _refresh = async (resolve) => {
        let that = this;

        this.setState({ 'spinner': true });
        if(this.state.currentLatitude == null || this.state.currentLongitude == null ) {
            if(Platform.OS === 'android'){ 
                await that.requestLocationPermission();
            }else{
               await  that.getCurrentLocation();
            }
        }
    }

  render() {
    const { goBack } = this.props.navigation;
    let that = this;
    let typeData = [{id:1,text: 'GP Surgery',}, {id:2,text: 'Out of Hours',},
                    {id:3,text: 'Home Visit Service',}, {id:4,text: 'Remote Services',}];

    return (
        <View style={{ flex: 1}}>
    
            {/* <StatusBar
                backgroundColor="#672BE2"
                barStyle="light-content"
            /> */}

            <Spinner
                visible={this.state.spinner}
                textContent={'Loading...'}
                textStyle={practiceStyles.spinnerTextStyle}
            />
            {/* <View style={{height: 20}}></View> */}
            { this.state.firstSlide == true ? 
                <View style={{ height: (Dimensions.get('window').height), backgroundColor:'#fff' }}>
                    <ImageBackground source={require('./images/practice-header-01.png')} style={{width: this.state.headerImageWidth, height: this.state.headerImageHeight}}>
                    {
                        Platform.OS === 'ios' ? <MyStatusBar backgroundColor="transparent" barStyle="light-content" /> : <StatusBar translucent backgroundColor="transparent"  barStyle="default"  />
                    }
                        {/* <View style={{ justifyContent:'flex-start', flexDirection: 'row', height: 50, paddingBottom: (Platform.OS === 'ios' ? 10 : 0), paddingTop: (Platform.OS === 'ios' ? 30 : 55), backgroundColor: 'yellow'}}> */}
                            <View style={{justifyContent:'flex-start', marginTop: (Platform.OS === 'ios' ? 40 : 50), height: (Dimensions.get('window').height) * 0.1, paddingHorizontal:20}}>
                                <View style={{width: '90%',justifyContent:'flex-start',}}>
                                    <TouchableOpacity onPress={() => {
                                            if (this.state.edit == true) {
                                                this.backToList();
                                            } else {
                                                goBack();
                                            }
                                        }} 
                                    style={{ flexDirection: 'row', }}>
                                        <View style={{justifyContent: 'center', paddingRight: 10}}>
                                            <Image source={require('./images/whiteBackIcon.png')} style={{ width: 16, height:16 }}></Image>  
                                        </View>
                                        <View  style={{justifyContent: 'center', paddingRight: 10}}>
                                            <Text style={{color: '#FFFFFF',fontFamily: Fonts.MontserratBold,fontSize: 17,}}>{(this.state.edit == true ? "Edit" : "Add")} healthcare organisation</Text>
                                        </View>                    
                                    </TouchableOpacity>
                                </View>
                            </View>
                        {/* </View> */}
                        {/* <View style={{ position: 'absolute', backgroundColor: 'transparent', height: (this.state.headerImageHeight - 50), width: '100%', bottom: 0, backgroundColor: 'red'}}></View> */}
                        
                    </ImageBackground>
                    <View style={ [practiceStyles.imageDisplayContainer ,{zIndex: 1000, height: (Dimensions.get('window').height - this.state.headerImageHeight) ,}]}>
                        <GooglePlacesAutocomplete
                            placeholder='  Enter medical practice name'
                            minLength={5}
                            autoFocus={false}
                            listViewDisplayed={true}
                            returnKeyType={'search'}
                            fetchDetails={true}
                            onPress={(data, details = null) => { 
                                this.separateMapDetails(details);
                            }}
                            textInputProps={{
                                onFocus: () => {DropDownHolder.dropDown.alertWithType('info', 'Info', '5 minimum characters need to search');},
                            }}
                            styles={{
                                container: {},
                                description: {
                                    // left:0,
                                    // paddingHorizontal: 15,
                                    color:'#414253',
                                    // borderBottomWidth: 1 / PixelRatio.get(),
                                    // borderBottomColor: '#E6E9ED'
                                },
                                textInputContainer: {
                                    backgroundColor: '#ffffff', 
                                    justifyContent: 'center' , 
                                    flexDirection: 'row', 
                                    alignContent: 'center',
                                    alignSelf: 'center' , 
                                    alignItems: 'center',  
                                    width: (Dimensions.get('window').width) * 0.9, 
                                    height: 70, 
                                    borderTopWidth: 0,
                                    borderBottomWidth:0,
                                    position: 'absolute',
                                    borderRadius: 30,
                                    top: -35,
                                    elevation: 1,
                                    shadowColor: '#2ee5b5',
                                    shadowOffset: { width: 5, height: 5 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 5
                                    // width: '90%'
                                },
                                textInput: {
                                    left:0,       
                                    color: '#142828',
                                    fontFamily: Fonts.MontserratMedium,
                                    fontSize: 14,
                                    borderStyle: 'solid',
                                    borderBottomWidth:0,
                                    borderBottomColor:'#f2f3f7',
                                    alignItems: 'flex-start',
                                    width: '100%',
                                },
                                row: {
                                    // padding: 0,
                                    paddingTop: 20,
                                    paddingBottom: 10,
                                    height: 60,
                                    // paddingBottom: 12,
                                    // backgroundColor: 'blue'
                                },
                                nearbyPlacesAPI:'GooglePlacesSearch',
                                predefinedPlacesDescription: {
                                    color: '#ff1ff1'
                                },
                                listView: {
                                    color: '#fff',   
                                    // backgroundColor: '#fff',                                     
                                    alignSelf: 'flex-start',
                                    width: '100%',
                                    // height: 100,
                                    top:60,
                                    position: 'absolute',
                                    paddingHorizontal: 20,
                                    elevation: 1,
                                    zIndex: 9999,
                                    borderWidth: 0,   
                                    borderBottomWidth:1,
                                    borderBottomColor: '#2ee5b5' ,                                        
                                    shadowColor: '#2ee5b5',
                                    shadowOffset: { width: 5, height: 5 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 5
                                },
                                separator: {
                                    // height:0, 
                                    backgroundColor: '#E6E9ED',
                                }
                                
                            }}
                            query={{
                                key: GOOGLE_API_KEY,
                                language: 'en', // language of the results
                                // types: 'hospital' // default: 'geocode'
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
                    </View>
                </View>
                : null                     
            }

            {/* Second slid to fill address details */}
            { this.state.secondSlide == true && 
            <View>
                <ImageBackground source={require('./images/add_practice_header2.png')} style={{width: this.state.headerImageWidth, height: this.state.header2ImageHeight, paddingHorizontal:10  }}>                    
                {
                    Platform.OS === 'ios' ? <MyStatusBar backgroundColor="transparent" barStyle="light-content" /> : <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
                }
                    <View style={{justifyContent:'flex-start',flexDirection:'row', marginTop: (Platform.OS === 'ios' ? 40 : 50), height: (Dimensions.get('window').height) * 0.1, paddingHorizontal:10}}>
                        {/* <View  style={{width:50, }}>
                            <TouchableOpacity onPress={() => {
                                if(this.state.edit == true) {
                                    this.backToList();
                                } else {
                                    this.setState({firstSlide: true}); 
                                    this.setState({secondSlide: false});
                                }
                            }}>
                                <Image source={require('./images/whiteBackIcon.png')} style={{ width: 16, height:16 }}></Image> 
                            </TouchableOpacity>
                        </View>
                        <View  style={{width:300,justifyContent:'flex-start',alignContent:'flex-start',}}>
                            <Text style={ practiceStyles.headerTitle }>{(this.state.edit == true ? "Edit" : "Add")} Practice</Text>
                        </View> */}

                        <View style={{width: '90%',justifyContent:'flex-start',}}>
                            <TouchableOpacity onPress={() => {
                                    if(this.state.edit == true) {
                                    this.backToList();
                                    } else {
                                        this.setState({firstSlide: true}); 
                                        this.setState({secondSlide: false});
                                    }
                                }} 
                            style={{ flexDirection: 'row', }}>
                                <View style={{justifyContent: 'center', paddingRight: 10}}>
                                    <Image source={require('./images/whiteBackIcon.png')} style={{ width: 16, height:16 }}></Image>  
                                </View>
                                <View  style={{justifyContent: 'center', paddingRight: 10}}>
                                    <Text style={{color: '#FFFFFF',fontFamily: Fonts.MontserratBold,fontSize: 17,}}>{(this.state.edit == true ? "Edit" : "Add")} healthcare organisation</Text>
                                </View>                    
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View  style={{justifyContent:'flex-start',alignContent:'flex-start', paddingHorizontal:15, paddingTop: 20}}>
                        <Text style={[practiceStyles.headerTitle, {fontSize: 20} ]}>{this.state.name}</Text>
                    </View>
                </ImageBackground>

                {/* <SafeAreaView>   */}
                <ScrollView>
                    <View style={{ paddingTop: 15,paddingLeft:10, paddingRight:10 }}>
                            {/* <KeyboardAvoidingView behavior='padding' >
                                <TouchableWithoutFeedback onPress={Keyboard.dismiss} > */}
                                    <View style={{paddingHorizontal: 30, paddingBottom: 10, paddingTop: 50,  height: (Dimensions.get('window').height + 200) }}>
                                        <View> 
                                            { (this.state.name != null && this.state.name != '') &&
                                                <Text style={ practiceStyles.inputLabel }>Organisations name</Text>
                                            }                                    
                                            <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                                <View style = {{ width: '10%', alignContent: 'flex-start', justifyContent:'center', marginBottom: 10 ,  }}>
                                                    { (this.state.name != null && this.state.name) ?
                                                    <Image source = { require('./images/address_sel.png') } style={{ width: 20, height: 22 }}/>
                                                    : <Image source = { require('./images/address.png') } style={{ width: 20, height: 22}}/>
                                                    }
                                                </View>
                                                <View style = {{ width: '90%', alignContent: 'flex-start', justifyContent:'flex-end', marginBottom: 10 ,   }}>
                                                <TextInput
                                                    id='name'
                                                    onChangeText={(name) => this.setState({ name })}
                                                    placeholder='Name'
                                                    placeholderTextColor='#AAB2BD'
                                                    returnKeyType='next'
                                                    autoCorrect={false}
                                                    style={ practiceStyles.input }
                                                    value={this.state.name} /> 
                                            
                                                </View>
                                            </View>
                                        </View>                                    

                                        <View style={{ marginTop: 20}}> 
                                            { (this.state.address1 != null && this.state.address1 != '') &&
                                                <Text style={ practiceStyles.inputLabel }>Address 1</Text>
                                            } 
                                            <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                                
                                                <View style = {{ width: '10%', alignContent: 'flex-start', justifyContent:'center', marginBottom: 10 , }}>
                                                    { (this.state.address1 != null && this.state.address1 != '') ?
                                                    <Image source = { require('./images/address_sel.png') } style={{ width: 20, height: 22 }}/>
                                                    : <Image source = { require('./images/address.png') } style={{ width: 20, height: 22}}/>
                                                    }
                                                </View>
                                                <View style = {{ width: '90%', alignContent: 'flex-start' , justifyContent:'center', marginBottom: 10 ,  }}>
                                                    <TextInput
                                                        id='address1'
                                                        onChangeText={(address1) => this.setState({ address1 })}
                                                        placeholder='Address 1'
                                                        placeholderTextColor='#AAB2BD'
                                                        returnKeyType='next'
                                                        autoCorrect={false}
                                                        style={practiceStyles.input}
                                                        value={this.state.address1} />
                                                </View>
                                            </View> 
                                        </View>        
                    
                                        <View style={{ marginTop: 20}}> 
                                            { (this.state.address2 != null && this.state.address2 != '') &&
                                                <Text style={ practiceStyles.inputLabel }>Address 2</Text>
                                            } 
                                            <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                                <View style = {{ width: '10%', alignContent: 'flex-start', justifyContent:'center', marginBottom: 10 , }}>
                                                    { (this.state.address2 != null && this.state.address2 != '') ?
                                                    <Image source = { require('./images/address_sel.png') } style={{ width: 20, height: 22 }}/>
                                                    : <Image source = { require('./images/address.png') } style={{ width: 20, height: 22}}/>
                                                    }
                                                </View>
                                                <View style = {{ width: '90%', alignContent: 'flex-start' , justifyContent:'center', marginBottom: 10 ,  }}>
                                                    <TextInput
                                                        id='address2'
                                                        onChangeText={(address2) => this.setState({ address2 })}
                                                        placeholder='Address 2'
                                                        placeholderTextColor='#AAB2BD'
                                                        returnKeyType='next'
                                                        autoCorrect={false}
                                                        style={practiceStyles.input}
                                                        value={this.state.address2} />
                                                </View>
                                            </View> 
                                        </View>

                                        {/* <Text style={ practiceStyles.inputLabel }>Town / City</Text> */}
                                        

                                        <View style={{ marginTop: 20}}> 
                                            { (this.state.city != null && this.state.city != '') &&
                                                <Text style={ practiceStyles.inputLabel }>Town / City</Text>
                                            } 
                                            <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                                <View style = {{ width: '10%', alignContent: 'flex-start', justifyContent:'center', marginBottom: 10 , }}>
                                                    { (this.state.city != null && this.state.city != '') ?
                                                    <Image source = { require('./images/city_sel.png') } style={{ width: 20, height: 24 }}/>
                                                    : <Image source = { require('./images/city.png') } style={{ width: 20, height: 24}}/>
                                                    }
                                                </View>
                                                <View style = {{ width: '90%', alignContent: 'flex-start' , justifyContent:'center', marginBottom: 10 ,  }}>
                                                    <TextInput
                                                        id='city'
                                                        onChangeText={(city) => this.setState({ city })}
                                                        placeholder='Town / City'
                                                        placeholderTextColor='#AAB2BD'
                                                        returnKeyType='next'
                                                        autoCorrect={false}
                                                        style={practiceStyles.input}
                                                        value={this.state.city} />
                                                </View>
                                            </View> 
                                        </View>

                                        <View style={{ marginTop: 20}}> 
                                            { (this.state.postCode != null && this.state.postCode != '') &&
                                                <Text style={ practiceStyles.inputLabel }>Postcode</Text>
                                            } 
                                            <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                                <View style = {{ width: '10%', alignContent: 'flex-start', justifyContent:'center', marginBottom: 10 , }}>
                                                    { (this.state.postCode != null && this.state.postCode != '')?
                                                    <Image source = { require('./images/postcode_sel.png') } style={{ width: 20, height: 17.14 }}/>
                                                    : <Image source = { require('./images/postcode.png') } style={{ width: 20, height: 17.14}}/>
                                                    }
                                                </View>
                                                <View style = {{ width: '90%', alignContent: 'flex-start' , justifyContent:'center', marginBottom: 10 ,  }}>
                                                    <TextInput
                                                        id='postCode'
                                                        onChangeText={(postCode) => this.setState({ postCode })}
                                                        placeholder='Postcode'
                                                        placeholderTextColor='#AAB2BD'
                                                        returnKeyType='next'
                                                        autoCorrect={false}
                                                        style={practiceStyles.input}
                                                        value={this.state.postCode} /> 
                                                </View>
                                            </View> 
                                        </View>
                                        <View style={{ marginTop: 20}}> 
                                            { (this.state.distance != null && this.state.distance != '') &&
                                                <Text style={ practiceStyles.inputLabel }>Distance from home address (in miles)</Text>
                                            } 
                                            <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                                <View style = {{ width: '10%', alignContent: 'flex-start', justifyContent:'center', marginBottom: 10 , }}>
                                                    { (this.state.distance != null && this.state.distance != '')?
                                                    <Image source = { require('./images/postcode_sel.png') } style={{ width: 20, height: 17.14 }}/>
                                                    : <Image source = { require('./images/postcode.png') } style={{ width: 20, height: 17.14}}/>
                                                    }
                                                </View>
                                                <View style = {{ width: '90%', alignContent: 'flex-start' , justifyContent:'center', marginBottom: 10 ,  }}>
                                                    <TextInput
                                                        id='distance'
                                                        onChangeText={(distance) => this.setState({ distance })}
                                                        placeholder='Distance from home address (in miles)'
                                                        placeholderTextColor='#AAB2BD'
                                                        returnKeyType='next'
                                                        autoCorrect={false}
                                                        style={practiceStyles.input}
                                                        value={this.state.distance} /> 
                                                </View>
                                            </View> 
                                        </View>
                                        <View style={[practiceStyles.loginButtonArea,{paddingBottom: 50}]}>
                                            <TouchableOpacity style={practiceStyles.loginTouchable} onPress={() => {
                                                this.setState({thirdSlide: true}); 
                                                this.setState({secondSlide: false});
                                            }}>
                                                <Text style={practiceStyles.loginButton}>NEXT</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                {/* </TouchableWithoutFeedback>
                            </KeyboardAvoidingView> */}
                        </View>
                    </ScrollView>
                {/* </SafeAreaView> */}
            </View>
            }

            {/* Third slid to fill contact info */}
            { this.state.thirdSlide == true && 
            <View>
                {/* <View style={{ flexDirection: 'row', height: (Dimensions.get('window').height) * 0.08, paddingBottom: 10, paddingTop: (Platform.OS === 'ios' ? 0 : 22)}}>
                    <View style={{justifyContent:'flex-start',flexDirection:'row'}}>
                        <View  style={{width:50, }}>
                            <TouchableOpacity onPress={() => { 
                                if(this.state.edit == true) {
                                    this.backToList();
                                } else {
                                    this.setState({firstSlide: true}); 
                                    this.setState({secondSlide: false});
                                }
                            }}>
                                <Icon name='arrow-back' style={ practiceStyles.reverseHeaderArrowBack } />
                            </TouchableOpacity>
                        </View>
                        <View  style={{width:300,justifyContent:'flex-start',alignContent:'flex-start',}}>
                            <Text style={ practiceStyles.reverseHeaderTitle }>{(this.state.edit == true ? "Edit" : "Add")} Practice</Text>
                        </View>
                    </View>                    
                </View> */}
                <ImageBackground source={require('./images/add_practice_header2.png')} style={{width: this.state.headerImageWidth, height: this.state.header2ImageHeight, paddingHorizontal:10  }}>                    
                {
                    Platform.OS === 'ios' ? <MyStatusBar backgroundColor="transparent" barStyle="light-content" /> : <StatusBar translucent backgroundColor="transparent" barStyle="light-content"  />
                }
                    <View style={{justifyContent:'flex-start',flexDirection:'row', marginTop: (Platform.OS === 'ios' ? 40 : 50), height: (Dimensions.get('window').height) * 0.1, paddingHorizontal:10}}>
                        {/* <View  style={{width:50, }}>
                            <TouchableOpacity onPress={() => {
                                // if(this.state.edit == true) {
                                //     this.backToList();
                                // } else {
                                    this.setState({secondSlide: true}); 
                                    this.setState({thirdSlide: false});
                                // }
                            }}>
                                <Image source={require('./images/whiteBackIcon.png')} style={{ width: 16, height:16 }}></Image> 
                            </TouchableOpacity>
                        </View>
                        <View  style={{width:300,justifyContent:'flex-start',alignContent:'flex-start',}}>
                            <Text style={ practiceStyles.headerTitle }>{(this.state.edit == true ? "Edit" : "Add")} Practice</Text>
                        </View> */}

                        <View style={{width: '90%',justifyContent:'flex-start',}}>
                            <TouchableOpacity onPress={() => {
                                    this.setState({secondSlide: true}); 
                                    this.setState({thirdSlide: false});
                                }} 
                            style={{ flexDirection: 'row', }}>
                                <View style={{justifyContent: 'center', paddingRight: 10}}>
                                    <Image source={require('./images/whiteBackIcon.png')} style={{ width: 16, height:16 }}></Image>  
                                </View>
                                <View  style={{justifyContent: 'center', paddingRight: 10}}>
                                    <Text style={{color: '#FFFFFF',fontFamily: Fonts.MontserratBold,fontSize: 17,}}>{(this.state.edit == true ? "Edit" : "Add")} healthcare organisation</Text>
                                </View>                    
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View  style={{justifyContent:'flex-start',alignContent:'flex-start', paddingHorizontal:15, paddingTop: 20}}>
                        <Text style={[practiceStyles.headerTitle, {fontSize: 20} ]}>{this.state.name}</Text>
                    </View>
                </ImageBackground>
                <ScrollView>
                    <View style={{ paddingTop: 15,paddingLeft:10, paddingRight:10 }}>
                        {/* <KeyboardAvoidingView behavior='padding' >
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss} > */}
                            <View style={{paddingHorizontal: 30, paddingBottom: 10, paddingTop: 50,  height: (Dimensions.get('window').height + 180) }}>
                                    <View> 
                                        { (this.state.contactName != null && this.state.contactName != '') &&
                                            <Text style={ practiceStyles.inputLabel }>Contact name</Text>
                                        } 
                                        <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                            <View style = {{ width: '10%', alignContent: 'flex-start', justifyContent:'center', marginBottom: 10 , }}>
                                                { (this.state.contactName != null && this.state.contactName != '')  ?
                                                <Image source = { require('./images/name_sel.png') } style={{ width: 20, height: 22.22 }}/>
                                                : <Image source = { require('./images/name.png') } style={{ width: 20, height: 22.22}}/>
                                                }
                                            </View>
                                            <View style = {{ width: '90%', alignContent: 'flex-start' , justifyContent:'center', marginBottom: 10 ,  }}>
                                                <TextInput
                                                    id='contactName'
                                                    onChangeText={(contactName) => this.setState({ contactName })}
                                                    placeholder='Contact name'
                                                    placeholderTextColor='#AAB2BD'
                                                    returnKeyType='next'
                                                    autoCorrect={false}
                                                    style={practiceStyles.input}
                                                    value={this.state.contactName} />
                                            </View>
                                        </View> 
                                    </View>

                                    {/* <Text style={ practiceStyles.inputLabel }>Contact mail</Text> */}
                                    
                                    <View style={{ marginTop: 20}}> 
                                        { (this.state.email != null && this.state.email != '') &&
                                            <Text style={ practiceStyles.inputLabel }>Contact mail</Text>
                                        } 
                                        <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                            <View style = {{ width: '10%', alignContent: 'flex-start', justifyContent:'center', marginBottom: 10 , }}>
                                                { (this.state.email != null && this.state.email != '')  ?
                                                <Image source = { require('./images/mail_sel.png') } style={{ width: 20, height: 20}}/>
                                                : <Image source = { require('./images/mail.png') } style={{ width: 20, height: 20}}/>
                                                }
                                            </View>
                                            <View style = {{ width: '90%', alignContent: 'flex-start' , justifyContent:'center', marginBottom: 10 ,  }}>
                                                <TextInput
                                                    id='email'
                                                    onChangeText={(email) => this.setState({ email })}
                                                    placeholder='Contact mail'
                                                    placeholderTextColor='#AAB2BD'
                                                    returnKeyType='next'
                                                    autoCorrect={false}
                                                    style={practiceStyles.input}
                                                    value={this.state.email} />
                                            </View>
                                        </View> 
                                    </View>
                                    
                                    {/* <Text style={ practiceStyles.inputLabel }>Contact phone number</Text> */}

                                    <View style={{ marginTop: 20}}> 
                                        { (this.state.phone != null && this.state.phone != '') &&
                                            <Text style={ practiceStyles.inputLabel }>Contact phone number</Text>
                                        } 
                                        <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                            <View style = {{ width: '10%', alignContent: 'flex-start', justifyContent:'center', marginBottom: 10 , }}>
                                                { (this.state.phone != null && this.state.phone != '')  ?
                                                <Image source = { require('./images/phone_sel.png') } style={{ width: 20, height: 20}}/>
                                                : <Image source = { require('./images/phone.png') } style={{ width: 20, height: 20}}/>
                                                }
                                            </View>
                                            <View style = {{ width: '90%', alignContent: 'flex-start' , justifyContent:'center', marginBottom: 10 ,  }}>
                                                <TextInput
                                                    id='phone'
                                                    onChangeText={(phone) => this.setState({ phone })}
                                                    placeholder='Contact phone number'
                                                    placeholderTextColor='#AAB2BD'
                                                    returnKeyType='next'
                                                    autoCorrect={false}
                                                    style={practiceStyles.input}
                                                    value={this.state.phone} />
                                            </View>
                                        </View> 
                                    </View>
                                    
                                    <View style={{ marginTop: 20}}> 
                                        { (this.state.type != null && this.state.type != '' && this.state.type != 'undefined') &&
                                            <Text style={ practiceStyles.inputLabel }>Organisations type</Text>
                                        } 
                                        <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                            <View style = {{ width: '10%', alignContent: 'flex-start', justifyContent:'center', marginBottom: 10 , }}>
                                                { (this.state.phone != null && this.state.phone != '')  ?
                                                <Image source = { require('./images/Practice_sel.png') } style={{ width: 20, height: 22.33}}/>
                                                : <Image source = { require('./images/Practice.png') } style={{ width: 20, height: 22.33}}/>
                                                }
                                            </View>
                                            <View style = {{ width: '90%', alignContent: 'flex-start' , justifyContent:'center', marginBottom: 20 ,  }}>
                                                <TouchableOpacity onPress={() => {
                                                    this.setState({sortVisible: true});
                                                }} style={ practiceStyles.dropDownArea }>                                        
                                                    <View style={ practiceStyles.aliasDropDown }>
                                                        <View style={ practiceStyles.dropDownValueSection }>
                                                            <Text style={ practiceStyles.dropDownValueText }>                                          
                                                                {((this.state.type != '' && this.state.type != null && this.state.type != 'undefined')? this.state.type : 'Practice type')}
                                                            </Text>
                                                        </View>
                                                        <View style={ practiceStyles.dropDownIconSection }>
                                                            <Text>
                                                                <Image resizeMode='stretch' style={ practiceStyles.dropDownImage } source={this.state.arrowSource} />
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>  
                                            </View>
                                        </View> 
                                    </View>

                                    <View style={{ marginTop: 20,flexDirection: 'row'}}>
                                        <View  style={{ width: '48%', alignContent: 'flex-start', justifyContent:'center', paddingRight: 5}}>
                                            
                                            <Text style={ practiceStyles.inputLabel }>Default hourly rate </Text>
                                            
                                            <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                                <View style = {{ width: '15%', alignContent: 'flex-start', justifyContent:'center', paddingRight: 10}}>
                                                    { (this.state.hourlyRate != null && this.state.hourlyRate != '' && this.state.hourlyRate != '0')  ?
                                                    <Image source = { require('./images/rate_sel.png') } style={{ width: 20, height: 15}}/>
                                                    : <Image source = { require('./images/rate.png') } style={{ width: 20, height: 15}}/>
                                                    }
                                                </View>
                                                <View style = {{ flexDirection: 'row', width: '80%', alignContent: 'flex-end' , justifyContent:'center',  }}>
                                                    <View style={{width: '20%', justifyContent: 'center', alignContent: 'flex-start', paddingRight: 5}}>
                                                        <Text style={ practiceStyles.inputLabelBlack }>£</Text>
                                                    </View>
                                                    <View style={{width: '70%', justifyContent: 'center', alignContent: 'flex-start', }}>
                                                        <TextInputMask
                                                            type={'money'}
                                                            options={{
                                                            precision: 2,
                                                            separator: '.',
                                                            delimiter: ',',
                                                            unit: '',
                                                            suffixUnit: ''
                                                            }}
                                                            value={this.state.hourlyRate}
                                                            onChangeText={text => {
                                                                this.setState({ hourlyRate: text })
                                                            }}
                                                            style={[practiceStyles.input,{height: 20}]}
                                                        />
                                                    </View>
                                                </View>
                                            </View> 
                                        </View>
                                        <View   style={{width: '48%', alignContent: 'flex-end', justifyContent:'center',paddingLeft: 5}}>
                                         
                                            <Text style={ practiceStyles.inputLabel }>Default session rate</Text>
                                            
                                            <View style = {{ flexDirection: 'row', alignContent: 'flex-end', borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                                <View style = {{ width: '15%', alignContent: 'flex-start', justifyContent:'center', paddingRight: 10}}>
                                                    { (this.state.sessionRate != null && this.state.sessionRate != '' && this.state.sessionRate != '0')  ?
                                                    <Image source = { require('./images/rate_sel.png') } style={{ width: 20, height: 15}}/>
                                                    : <Image source = { require('./images/rate.png') } style={{ width: 20, height: 15}}/>
                                                    }
                                                </View>
                                                <View style = {{ flexDirection: 'row', width: '80%', alignContent: 'flex-end' , justifyContent:'center',  }}>
                                                    <View style={{width: '20%', justifyContent: 'center', alignContent: 'flex-start', paddingRight: 5}}>
                                                        <Text style={ practiceStyles.inputLabelBlack }>£</Text>
                                                    </View>
                                                    <View style={{width: '70%', justifyContent: 'center', alignContent: 'flex-end', }}>
                                                        <TextInputMask
                                                            type={'money'}
                                                            options={{
                                                            precision: 2,
                                                            separator: '.',
                                                            delimiter: ',',
                                                            unit: '',
                                                            suffixUnit: ''
                                                            }}
                                                            value={this.state.sessionRate}
                                                            onChangeText={text => {
                                                                this.setState({ sessionRate: text })
                                                            }}
                                                            style={[practiceStyles.input,{height: 20}]}
                                                        />
                                                    </View>
                                                </View>
                                            </View> 
                                        </View>

                                    </View>

{/*                                     

                                    <Text style={ practiceStyles.inputLabel }>Default hourly rate</Text>
                                    <View style={{flex: 1, flexDirection: 'row'}}>
                                    <View style={{width: '5%', justifyContent: 'center', alignContent: 'flex-start'}}><Text style={ practiceStyles.inputLabelBlack }>£</Text></View>
                                    <View style={{width: '95%', justifyContent: 'flex-end', alignContent: 'flex-start'}}>
                                        <TextInputMask
                                            type={'money'}
                                            options={{
                                            precision: 2,
                                            separator: '.',
                                            delimiter: ',',
                                            unit: '',
                                            suffixUnit: ''
                                            }}
                                            value={this.state.hourlyRate}
                                            onChangeText={text => {
                                                this.setState({ hourlyRate: text })
                                            }}
                                            style={practiceStyles.input}
                                        />
                                    </View> 
                                            

                                    </View>
                                    <Text style={ practiceStyles.inputLabel }>Default session rate</Text>
                                    <View style={{flex: 1, flexDirection: 'row', }}>
                                        <View style={{width: '5%', justifyContent: 'center', alignContent: 'flex-start'}}><Text style={ practiceStyles.inputLabelBlack }>£</Text></View>
                                        <View style={{width: '95%', justifyContent: 'flex-end', alignContent: 'flex-start'}}>
                                            <TextInputMask
                                                type={'money'}
                                                options={{
                                                precision: 2,
                                                separator: '.',
                                                delimiter: ',',
                                                unit: '',
                                                suffixUnit: ''
                                                }}
                                                value={this.state.sessionRate}
                                                onChangeText={text => {
                                                    this.setState({ sessionRate: text })
                                                }}
                                                style={practiceStyles.input}
                                            />
                                                
                                        </View>
                                    </View> */}

                                    <View style={practiceStyles.loginButtonArea}>
                                        <TouchableOpacity style={practiceStyles.loginTouchable} onPress={() => {
                                            this.setState({ 'spinner': true });
                                            if(this.state.edit == true) {
                                                this.updatePractice();
                                            } else {
                                                this.savePractice();
                                            }
                                            
                                        }}>
                                            <Text style={practiceStyles.loginButton}>{this.state.edit == true ? 'UPDATE' : 'ADD'}</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            {/* </TouchableWithoutFeedback>
                        </KeyboardAvoidingView> */}
                        
                    </View>

                    
                </ScrollView>
                {this.state.sortVisible == true && 
                    <CustomDropDown 
                        title={'Select practice type'}  
                        sortOption={this.state.sortOption} 
                        visible={this.state.sortVisible} 
                        onSelectItem={this.handleType} 
                        onClose={this.onClose.bind(this)}
                        selectedValue= {this.state.type} />
                }
            </View>
            }

            {/* fourth slid to fill practice rates */}
            { this.state.fourthSlide == true && 
             <SafeAreaView>
               {/* <LinearGradient colors={['#3C69E4', '#008FDE']} style={{ height: (Dimensions.get('window').height) * 0.16, }}>
                        <View style={{ flexDirection: 'row', height: (Dimensions.get('window').height) * 0.08, paddingBottom: 10, paddingTop: (Platform.OS === 'ios' ? 0 : 22)}}>
                            <View style={{justifyContent:'flex-start',flexDirection:'row'}}>
                                <View  style={{width:50, }}>
                                    <TouchableOpacity onPress={() => { 
                                        if(this.state.edit == true) {
                                            this.backToList();
                                        } else {
                                            this.setState({firstSlide: true}); 
                                            this.setState({secondSlide: false});
                                        }
                                    }}>
                                        <Icon name='arrow-back' style={ practiceStyles.reverseHeaderArrowBack } />
                                    </TouchableOpacity>
                                </View>
                                <View  style={{width:300,justifyContent:'flex-start',alignContent:'flex-start',}}>
                                    <Text style={ practiceStyles.reverseHeaderTitle }>{(this.state.edit == true ? "Edit" : "Add")} Practice</Text>
                                </View>
                            </View>                   
                        </View>
                </LinearGradient>
                <ScrollView>
                    <View style={{paddingHorizontal: 15}}>
                        <KeyboardAvoidingView behavior='padding' >
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                                <View>
                                    <Text style={practiceStyles.textHeader}>Set practices rates</Text>
                                    <TouchableOpacity onPress={() => {
                                        this.setState({sortVisible: true});
                                    }} style={ practiceStyles.dropDownArea }>
                                    <View style={ practiceStyles.aliasDropDown }>
                                        <View style={ practiceStyles.dropDownValueSection }>
                                            <Text style={ practiceStyles.inputLabel }>Practice type</Text>
                                        </View>
                                        
                                    </View>
                                
                                    <View style={ practiceStyles.aliasDropDown }>
                                        <View style={ practiceStyles.dropDownValueSection }>
                                            <Text style={ practiceStyles.dropDownValueText }>                                          
                                                {(this.state.type != ''? this.state.type : 'Select Type')}
                                            </Text>
                                        </View>
                                        <View style={ practiceStyles.dropDownIconSection }><Text>
                                                <Image resizeMode='stretch' style={ practiceStyles.dropDownImage } source={this.state.arrowSource} />
                                            </Text></View>
                                    </View>
                                    <View style={ practiceStyles.hrLine } />
                                    </TouchableOpacity>  

                                    <Text style={ practiceStyles.inputLabel }>Default hourly rate</Text>
                                    <View style={{flex: 1, flexDirection: 'row'}}>
                                    <View style={{width: '5%', justifyContent: 'center', alignContent: 'flex-start'}}><Text style={ practiceStyles.inputLabelBlack }>£</Text></View>
                                    <View style={{width: '95%', justifyContent: 'flex-end', alignContent: 'flex-start'}}>
                                        <TextInputMask
                                            type={'money'}
                                            options={{
                                            precision: 2,
                                            separator: '.',
                                            delimiter: ',',
                                            unit: '',
                                            suffixUnit: ''
                                            }}
                                            value={this.state.hourlyRate}
                                            onChangeText={text => {
                                                this.setState({ hourlyRate: text })
                                            }}
                                            style={practiceStyles.input}
                                        />
                                    </View> 
                                            

                                    </View>
                                    <Text style={ practiceStyles.inputLabel }>Default session rate</Text>
                                    <View style={{flex: 1, flexDirection: 'row', }}>
                                        <View style={{width: '5%', justifyContent: 'center', alignContent: 'flex-start'}}><Text style={ practiceStyles.inputLabelBlack }>£</Text></View>
                                        <View style={{width: '95%', justifyContent: 'flex-end', alignContent: 'flex-start'}}>
                                            <TextInputMask
                                                type={'money'}
                                                options={{
                                                precision: 2,
                                                separator: '.',
                                                delimiter: ',',
                                                unit: '',
                                                suffixUnit: ''
                                                }}
                                                value={this.state.sessionRate}
                                                onChangeText={text => {
                                                    this.setState({ sessionRate: text })
                                                }}
                                                style={practiceStyles.input}
                                            />
                                                
                                            <View style={ practiceStyles.hrLine } />
                                        </View>
                                    </View>

                                </View>
                            </TouchableWithoutFeedback>
                        </KeyboardAvoidingView>
                    </View>

                    <View style={practiceStyles.loginButtonArea}>
                        <TouchableOpacity style={practiceStyles.loginTouchable} onPress={() => {
                            this.setState({ 'spinner': true });
                            if(this.state.edit == true) {
                                this.updatePractice();
                            } else {
                                this.savePractice();
                            }
                            
                        }}>
                            <Text style={practiceStyles.loginButton}>SAVE</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {this.state.sortVisible == true && 
                    <CustomDropDown 
                        title={'Select practice type'}  
                        sortOption={this.state.sortOption} 
                        visible={this.state.sortVisible} 
                        onSelectItem={this.handleType} 
                        onClose={this.onClose.bind(this)}
                        selectedValue= {this.state.type} />
                }*/}
            </SafeAreaView> 
            }
        </View>
    );
  }
}

const styles = StyleSheet.create({
    statusBar: {
        height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    },
});