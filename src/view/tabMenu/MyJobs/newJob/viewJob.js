import React, { Component } from 'react';
import { View, Text, Platform, StatusBar, NativeModules, TouchableOpacity, Image, 
    ScrollView, ImageBackground, Dimensions, AsyncStorage, Linking, Clipboard, StyleSheet } from 'react-native';
import { Button } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { Icon } from 'native-base';
import { NavigationActions, StackActions } from 'react-navigation';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import moment from 'moment';
import Overlay from 'react-native-modal-overlay';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Spinner from 'react-native-loading-spinner-overlay';
import getDirections from 'react-native-google-maps-directions';
import { Calendar } from 'react-native-calendars';

import { Fonts } from '../../../../config/font';
import { newinvoicestyles } from '../../Invoice/newInvoice/styles';
import formStyles from '../../../../components/formTextInput/styles';
import { newjobstyles } from './styles';
import { signupstyles } from '../../../signup/styles';
import { Services } from '../../../../services/services';
import { GET_JOBBYPRACTICE_URLPART1, APPLY_FOR_JOB_PART_1, APPLY_FOR_JOB_PART_2, MP_JOBS, CANCEL_JOB, PRACTICE_DETAILS  } from '../../../../config/shared';
import { loginformStyles, styles } from '../../../login/styles';
import DropDownHolder from '../../../../components/dropDown/dropDownHolder';
import CustomImageTab, { tabHeadingStyles } from '../../../../components/CustomTabs/CustomImageTab';

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBarManager.HEIGHT;
// const STATUSBAR_HEIGHT = StatusBarManager.HEIGHT;
const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[statusBarStyles.statusBar, { backgroundColor , paddingTop: 20}]}>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
);
class ViewJob extends Component {
    constructor(props) {
        super(props);
        this.state = {
            JobData: [],
            moreOverLay: false,
            confirmationDisplay: false,
            jobApplied: false,
            spinner: false,
            deepLink: false,
            inFuture: false,
            userId: 0,
            backFromUpdate:false,
            editJobDate: [],
            defaultProfImage: '', 
            latitude: '0.00',
            longitude: '0.00' , 
            imageWidth: 0,
            imageHeight: 0,
            overlayImageWidth: 0,
            overlayImageHeight: 0,
            statusBack: '#fff',
            statusFont: '#fff',
            headerImageUri: require('./images/jobHeaderImage.png'),  
            tabItemsOverLay: false,  
            selectedIndex: null,  
            postedByDefaultImage: require('./images/default.png'),  
            postedByPhone: '',
            practiceCount: null,
            mapStyle:  [
                { //land
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#ffffff"
                    }
                  ]
                },
                {
                  "elementType": "labels.icon",
                  "stylers": [
                    {
                      "visibility": "off"
                    }
                  ]
                },
                {
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#BCBEBF"
                    }
                  ]
                },
                {
                  "elementType": "labels.text.stroke",
                  "stylers": [
                    {
                      "color": "#ffffff"
                    }
                  ]
                },
                {
                  "featureType": "administrative",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#ffffff"
                    }
                  ]
                },
                {
                  "featureType": "administrative.country",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#BCBEBF"
                    }
                  ]
                },
                {
                  "featureType": "administrative.land_parcel",
                  "stylers": [
                    {
                      "visibility": "off"
                    }
                  ]
                },
                {
                  "featureType": "administrative.locality",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#BCBEBF"
                    }
                  ]
                },
                {
                  "featureType": "poi",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#BCBEBF"
                    }
                  ]
                },
                {
                  "featureType": "poi.park",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#ffffff"
                    }
                  ]
                },
                {
                  "featureType": "poi.park",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#BCBEBF"
                    }
                  ]
                },
                {
                  "featureType": "poi.park",
                  "elementType": "labels.text.stroke",
                  "stylers": [
                    {
                      "color": "#ffffff"
                    }
                  ]
                },
                {
                  "featureType": "road",
                  "elementType": "geometry.fill",
                  "stylers": [
                    {
                      "color": "#F5F6F6"
                    }
                  ]
                },
                {
                  "featureType": "road",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#BCBEBF"
                    }
                  ]
                },
                {
                  "featureType": "road.arterial",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#F5F6F6"
                    }
                  ]
                },
                {
                  "featureType": "road.highway",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#F5F6F6"
                    }
                  ]
                },
                {
                  "featureType": "road.highway.controlled_access",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#F5F6F6"
                    }
                  ]
                },
                {
                  "featureType": "road.local",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#BCBEBF"
                    }
                  ]
                },
                {
                  "featureType": "transit",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#BCBEBF"
                    }
                  ]
                },
                {
                  "featureType": "water",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#ffffff"
                    }
                  ]
                },
                {
                  "featureType": "water",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#BCBEBF"
                    }
                  ]
                }
              ],
            currentLatitude: null,
            currentLongitude: null,
            selectedDays: [], 
            setMultiJobDate: false,
            _selectedDates: {},
            jobDate: new Date(),
            displayCollection: {},
        };

        this.setServices = new Services();
    }

    async componentDidMount() {
        // console.warn(STATUSBAR_HEIGHT);
        const { navigation } = this.props;

        await AsyncStorage.multiGet(["user_id", "defaultProfImage", "basePath", "currentLatitude","currentLongitude"]).then(response => { this.setState({userId : response[0][1]});
                                                                                        this.setState({"defaultProfImage" :  response[2][1] + response[1][1]}); 
                                                                                        this.setState({"currentLatitude" : response[3][1],});
                                                                                        this.setState({"currentLongitude" : response[4][1]});
                                                                                    });

        if(this.props.navigation.getParam('jobId') != undefined) {
            this.setState({ 'spinner': true });
            this.setState({ 'statusTitle': 'Show Job'});
            let params = this.props.navigation.getParam('jobId');
            // this.getMpJobs(381);
            this.getMpJobs(params[0]);
        } else { 
           await this.setState({
                JobData: navigation.getParam('data'),
                latitude: navigation.getParam('data')['latitude'],
                longitude: navigation.getParam('data')['longitude'],
                statusTitle: navigation.getParam('statusTitle'),
                jobType: navigation.getParam('jobType'),
                jobAddress: (navigation.getParam('data').town == undefined ? navigation.getParam('data').practice_city : navigation.getParam('data').town) + " . " + (navigation.getParam('data').post_code == undefined ? navigation.getParam('data').practice_post_code : navigation.getParam('data').post_code),
            });            
        } 
        await this.getScaledHeight(1125, 714, '') ;
        await this.getScaledHeight(345, 595, 'overlay') ;
        await this.statusColor();
        await this.compareDates();
        await this.getPracticeDetails();
        await this.setState({ postedByPhone :(this.state.JobData['phone_no'] == '' || this.state.JobData['phone_no'] == null) ? this.state.JobData['mobile_no'] : this.state.JobData['phone_no']});
        // console.warn(this.state.JobData);
    }

    compareDates = async () => {
        var today = new Date();
        var currentDate = moment.utc(today);
        var currentYear = currentDate.format('YYYY');
        var currentMonth = currentDate.format('MM');
        var currentDay = currentDate.format('DD');
        var currentHour = currentDate.format('HH');
        var currentMinute = currentDate.format('mm');

        var beforeConvert = this.state.JobData['date'];
        var beforeYear = moment(beforeConvert, 'DD/MM/YYYY').format('YYYY');
        var beforeMonth = moment(beforeConvert, 'DD/MM/YYYY').format('MM');
        var beforeDate = moment(beforeConvert, 'DD/MM/YYYY').format('DD');

    
        var checkDate = moment.utc(new Date(beforeMonth+'/'+beforeDate+'/'+beforeYear+' '+this.state.JobData['start_time'])); 

        var checkYear = checkDate.format('YYYY');
        var checkMonth = checkDate.format('MM');
        var checkDay = checkDate.format('DD');
        var checkHour = checkDate.format('HH');
        var checkMinute = checkDate.format('mm');

        const dateIsBefore = moment(new Date(currentMonth+'/'+currentDay+'/'+currentYear+' '+currentHour+':'+currentMinute)).isBefore(moment(new Date(checkMonth+'/'+checkDay+'/'+checkYear+' '+checkHour+':'+checkMinute)));


        this.setState({inFuture: dateIsBefore});
    }

    getPracticeDetails = async () => {
        this.setServices.getService(PRACTICE_DETAILS + this.state.JobData['practice_id'], "")
        .then(async(responseData) => {
            if(responseData.error== 0  ) {
                await this.setState({ practiceCount: responseData.info.jobs_posted})
            }            
            this.setState({ 'spinner': false });
        }, (error) => {
            this.setState({ 'spinner': false });
        })
    }

    onClose = () => {
        this.setState({ moreOverLay: false });
        this.setState({ tabItemsOverLay: false });
    };

    getScaledHeight = async (sourceWidth,sourceHeight, type) => {  
        
        if(type == 'overlay') {
            let width = (Dimensions.get('window').width * 0.9);
            let ratio = width / sourceWidth;
            await this.setState({
                overlayImageWidth: sourceWidth * ratio,
                overlayImageHeight: sourceHeight * ratio
            });  
        } else {
            let width = Dimensions.get('window').width;
            let ratio = width / sourceWidth;
            await this.setState({
                imageWidth: sourceWidth * ratio,
                imageHeight: sourceHeight * ratio
            });  
        }                
    }

    getUpdate = async (value, job_id) =>{
        if (value == true) {
            this.setState({ 'spinner': true });
            console.log("Updated");
            this.setServices.getService(GET_JOBBYPRACTICE_URLPART1 + job_id, "")
                .then(async(responseData) => {
                    await this.setState({
                        backFromUpdate: true,
                        JobData: responseData.info,
                        editJobDate: responseData.info.practice[0],
                        jobAddress: (responseData.info.practice[0].town == undefined ? responseData.info.practice[0].practice_city : responseData.info.practice[0].town) + " . " + (responseData.info.practice[0].post_code == undefined ? responseData.info.practice[0].practice_post_code : responseData.info.practice[0].post_code),
                    })
                    this.setState({ 'spinner': false });
                    await this.compareDates();
                }, (error) => {
                    this.InvoicesData = true;
                    this.setState({ 'spinner': false });
                })

        } else {
            console.log("Not Updated");
        }
    }

    getMpJobs = async (job_id) => {
        this.setServices.getService(MP_JOBS + job_id, "")
        .then(async (responseData) => {
            let practiceObj = responseData.info.practice;
            await Object.keys(practiceObj).map(function (key) {
                var value = practiceObj[key];
                if(key == 'start_time' ||  key == 'end_time') {
                    value = moment(value, "HH:MM a").format("HH:MM");
                }
                responseData.info[key] = value;
            });

            await this.setState({
                deepLink: true,
                JobData: responseData.info,             
                latitude: responseData.info['latitude'],
                longitude: responseData.info['longitude'],
            })

            this.setState({ 'spinner': false });

        }, (error) => {
            this.InvoicesData = true;
            this.setState({ 'spinner': false });
        })
    }

    applyForTheJob() {
        this.setServices.postService(APPLY_FOR_JOB_PART_1 + this.state.JobData['job_id'] + APPLY_FOR_JOB_PART_2 + this.state.userId, "")
            .then((responseData) => {
                // console.warn("Response Data :", responseData);

                this.setState({
                    'spinner': false,
                });
                if (responseData.error == 0) {
                    // this.props.navigation.state.params.pageRefresh(this);
                    DropDownHolder.dropDown.alertWithType('success', 'Success', "Job successfully applied");
                    this.props.navigation.dispatch(this.props.navigation.navigate('MainNavigation', {}, NavigationActions.navigate({ routeName: 'Screen2' })))
                }

                if(responseData.error == 1) {
                    DropDownHolder.dropDown.alertWithType('error', 'Error', responseData.info)
                }

            }, (error) => {

                this.setState({ 'spinner': false });
                console.log("error Data :", error);
            })
    }

    deleteJob() {
        this.setServices.deleteService2(GET_JOBBYPRACTICE_URLPART1 + this.state.JobData['id'], "")
            .then((responseData) => {
                // console.warn("Response Data deleteInvoice:", responseData);

                this.setState({ 'spinner': false });
                if (responseData.error == 0) {
                    DropDownHolder.dropDown.alertWithType('success', 'Success', "Job deleted");
                    this.props.navigation.state.params.pageRefresh('view_date' , true);
                    this.props.navigation.dispatch(this.props.navigation.navigate('MainNavigation', {}, NavigationActions.navigate({ routeName: 'Screen2' })));
                }
            }, (error) => {

                this.setState({ 'spinner': false });
                console.log("error Data :", error);
            })
    }

    cancelJob = async () => {    
        this.setServices.deleteService(CANCEL_JOB +  this.state.userId + "/"+ this.state.JobData['job_id'], "")
            .then((responseData) => {
                console.log("Response Data :", responseData);

                this.setState({
                    'spinner': false,
                });
                
                if (responseData.error == 0) {
                    DropDownHolder.dropDown.alertWithType('success', 'Success', "Application canceled successfully");

                    // this.props.navigation.state.params.pageRefresh(false, this.state);
                    this.props.navigation.goBack();
                } else {
                    DropDownHolder.dropDown.alertWithType('error', 'Error', 'Cannot cancel the bid');
                }

            }, (error) => {

                this.setState({ 'spinner': false });
                console.log("error Data :", error);
            })
    }

    handleIndexChange = (selectedIndex) => {
        if(selectedIndex != 0) {
            this.setState({selectedIndex: selectedIndex});
            this.setState({ tabItemsOverLay: true });
        }  
    }

    statusColor = () => {
        if(this.state.statusTitle == 'Applied' && this.state.jobType == 1) {
            this.setState({statusBack : '#FFEFB8'});
            this.setState({statusFont : '#F48400'});
        } else {
            switch(this.state.JobData['named_status']) {
                case 'Invoiced' : 
                    this.setState({statusBack : '#FFFFFF'});
                    this.setState({statusFont : '#AAB2BD'});
                break;
                case 'Completed' : 
                    this.setState({statusBack : '#C7F5E8'});
                    this.setState({statusFont : '#00D3A1'});
                break;
                case 'Upcoming' : 
                    this.setState({statusBack : '#FFEFB8'});
                    this.setState({statusFont : '#F48400'});
                break;
            }
        }
        
    }

    handleGetDirections = (latitude, longitude) => {
        const data = {
           source: {
            latitude: this.state.currentLatitude,
            longitude: this.state.currentLongitude
          },
          destination: {
            latitude: latitude,
            longitude: longitude
          },
          params: [
            {
              key: "travelmode",
              value: "driving"        // may be "walking", "bicycling" or "transit" as well
            },
            {
              key: "dir_action",
              value: "navigate"       // this instantly initializes navigation using the given travel mode
            }
          ],
          waypoints: [
            {
              latitude: -33.8600025,
              longitude: 18.697452
            },
            {
              latitude: -33.8600026,
              longitude: 18.697453
            },
               {
              latitude: -33.8600036,
              longitude: 18.697493
            }
          ]
        }

        getDirections(data);
      }

      markingMultipleDays = async(day) => {
        let date = day.dateString;
        let displayDate =  moment(date, 'YYYY-MM-DD').format('DD MMM YY');
        let currentSelectedDates = this.state._selectedDates;
        let displayCollection = this.state.displayCollection; 

        if( Object.keys(currentSelectedDates).length  != 0 && currentSelectedDates.hasOwnProperty(date)) {
            await delete currentSelectedDates[date];
            await delete displayCollection[displayDate];
        } else {
            currentSelectedDates[date] = {selected: true, marked: true, selectedColor: '#3894e4'};
            displayCollection[displayDate] = '';
        }

        if( Object.keys(currentSelectedDates).length  != 0) {
            let datesKeys = Object.keys(currentSelectedDates);
            let datesDisplayKeys = Object.keys(displayCollection);
            await this.setState({jobDate: datesKeys.toString()});
            await this.setState({displayJobDate: datesDisplayKeys.toString()});
        } 
        
        await this.setState({_selectedDates: currentSelectedDates});

    }
   

    render() {
        const { goBack } = this.props.navigation;
        let ranRef = Math.random();
        const displayHead = <LinearGradient colors={['#5961e0', '#3894e4']} style={{ height: 215, }} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
                    <View style={{ marginTop: 15}}>
                   { Platform.OS === 'ios' ? <MyStatusBar backgroundColor="transparent" barStyle="light-content" /> : <StatusBar backgroundColor="#5961e0" barStyle="light-content" /> }
                    </View>
 
                <View style={{ flexDirection: 'row', height: 50, paddingHorizontal: 20 }}>
                    <View style={{ flex: 1,justifyContent: 'center',}}>
                        <TouchableOpacity onPress={() => { (this.state.deepLink == true ? this.props.navigation.navigate('MainNavigation') :  goBack() ) }}>
                            <Image source={require('./images/whiteBackIcon.png')} style={{ width: 16, height:16 }}></Image>  
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center',}}>
                        
                        {
                            this.state.userId == this.state.JobData['user_id'] ? <Text style={{fontFamily: Fonts.MontserratBold, color: '#fff',fontSize: 13, paddingRight: 10}}>ADDED BY ME</Text> : <Image source={require('./images/sideStar.png')} style={{ width: 22, height:22 }}></Image> 
                        // this.state.JobData['is_applied'] == 4 ? <Ionicons name='ios-checkmark-circle' size={30} color='white'></Ionicons> : null
                        }
                        
                    </View>
                </View>

                <View style={{ flexDirection: 'row', paddingHorizontal: 20, height: 50, paddingTop: 15}}>   
                    <View style={{ width: '80%', flexDirection:'row'  }} >
                        <View style={{ justifyContent: 'center', alignContent: 'flex-start', width: '50%'}}>
                            <View style={{ height:25, justifyContent: 'center', borderRadius: 20, backgroundColor: (this.state.userId == this.state.JobData['user_id'] ? '#C7F5E8' : '#00D3A1'), }}>
                                <Text style={{  textAlign: 'center', color: (this.state.userId == this.state.JobData['user_id'] ? '#00D3A1' : '#fff'), fontSize: 13, fontFamily: Fonts.MontserratBold, }}>{moment(this.state.JobData['date'], (this.state.backFromUpdate == true ? "YYYY-MM-DD" : "DD/MM/YYYY")).format("DD MMM YYYY").toUpperCase()}</Text>
                            </View>
                        </View>
                        <View style={{ justifyContent: 'center', alignContent: 'flex-end', width: '49%', paddingLeft: 10 }}>
                            { this.state.JobData['session'] == 1 &&
                            <View style={{ height:25, justifyContent: 'center', borderRadius: 20, backgroundColor: '#FFD7D7', }}>
                                <Text style={{  textAlign: 'center', color: '#EB5757', fontSize: 13, fontFamily: Fonts.MontserratBold, }}>COVID-19</Text>
                            </View>
                            }
                        </View>                     
                    </View>   
                    
                    <View style={{ width: '20%', justifyContent: 'center', }}></View>
                </View>
                <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingTop: 5, paddingBottom:5 }}>
                    <Text style={{ color: '#fff', fontFamily: Fonts.MontserratBold, fontSize: 18,}}>{(this.state.backFromUpdate == true ? this.state.editJobDate.practice_name : this.state.JobData.practice_name)}</Text>
                </View>
                <View style={{ flexDirection: 'row', paddingHorizontal: 20, height: 45, paddingBottom: 15}}>
                    <View style={{ justifyContent: 'center', alignContent: 'flex-start', width: '70%'}}>
                        <Text style={{ color: '#fff', fontFamily: Fonts.MontserratMedium, fontSize: 15,}}>{this.state.jobAddress}</Text>
                    </View>
                    <View style={{ justifyContent: 'center', alignContent: 'flex-end', width: '30%'}}>    
                            <View style={{ flex: 1,flexDirection: 'row', justifyContent: 'center', alignContent: 'flex-end', alignItems: 'center',  }}>
                                <Image style={{
                                    width: 10, height: 11, justifyContent: 'center',
                                }} source={require('./images/navigationIcon.png')} ></Image>
                                <Text style={{ color: '#fff', fontFamily: Fonts.MontserratMedium, fontSize: 13, paddingLeft: 5 }}>{parseFloat(this.state.JobData['distance']).toFixed(2)} miles</Text>
                            </View> 
                    </View>
                </View>            
            </LinearGradient>
        {/* </ImageBackground> */}

        const displayTab = <View>
                                <CustomImageTab callBack={this.handleIndexChange.bind(this)} tabType='tooltip'>
                                    {/* First tab */}
                                    <View displayImage='job-description' selectedImage='job-description-white' style={tabHeadingStyles.content}></View>
                                    {/* Second tab */}
                                    <View displayImage='information' selectedImage='information-white' style={tabHeadingStyles.content}></View>
                                    {/* Third tab */}
                                    <View displayImage='location' selectedImage='location-white' style={tabHeadingStyles.content}></View>
                                    {/* Fourth tab */}
                                    <View displayImage='personal' selectedImage='personal-white' style={tabHeadingStyles.content}></View>
                                </CustomImageTab> 
                            </View>
        
        const nameStatus = <View style={{ position: 'absolute', top: 202, right: 20, }}>
                            <TouchableOpacity style={{ backgroundColor: this.state.statusBack, width: 130 , borderRadius: 15  }}>
                                <Text style={{ color: this.state.statusFont, fontFamily: Fonts.MontserratBold, fontSize: 12, paddingVertical: 6, alignSelf:  'center',}}>  {((this.state.statusTitle == 'Applied' && this.state.jobType == 1) ? 'Applied' : this.state.JobData['named_status'])}  </Text>
                            </TouchableOpacity>
                        </View>

        const displayBody = <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 10,  }}>

            <View style={{ flexDirection: 'row',}}>
                <View style={newjobstyles.viewArea}>
                    <View style={newjobstyles.viewSubArea}>
                        <Text style={newjobstyles.labelText}>Start time</Text>
                        <Text style={newjobstyles.detailText}>
                            {(this.state.deepLink == true ? this.state.JobData['start_time'] : moment(this.state.JobData['start_time'], "HH:mm").format("HH:mm"))}
                        </Text>
                    </View>
                </View>
                <View style={newjobstyles.viewArea}>
                    <View style={newjobstyles.viewSubArea}>
                        <Text style={newjobstyles.labelText}>End time</Text>
                        <Text style={newjobstyles.detailText}>
                            {(this.state.deepLink == true ? this.state.JobData['end_time'] : moment(this.state.JobData['end_time'], "HH:mm").format("HH:mm"))}
                        </Text>
                    </View>
                </View>
                <View style={newjobstyles.viewAreaWide}>
                    <View style={newjobstyles.viewSubArea2}>
                        <Text style={newjobstyles.labelText}>Rate {this.state.JobData['charge_by_hour'] == '1' || this.state.JobData['charge_type'] == '2' ? 'per hour' : 'per session'}</Text>

                            <Text style={newjobstyles.detailText}>
                                £ {this.state.JobData['charge_by_hour'] == '1' || this.state.JobData['charge_type'] == '2' ?
                                    this.state.JobData['charge_type'] != undefined ? ((this.state.JobData['charge_rate'] != "NaN" && this.state.JobData['charge_rate'] != null && this.state.JobData['charge_rate']  && this.state.JobData['charge_rate'] != "") ?this.state.JobData['charge_rate'] : "0.00") : parseFloat((this.state.deepLink == true ? ((this.state.JobData['hour_rate']!= "NaN" && this.state.JobData['hour_rate'] != null && this.state.JobData['hour_rate']  && this.state.JobData['hour_rate'] != "") ?this.state.JobData['charge_rate'] : "0.00") : ((this.state.JobData['post_hour_rate']!= "NaN" && this.state.JobData['post_hour_rate'] != null && this.state.JobData['post_hour_rate']  && this.state.JobData['post_hour_rate'] != "") ?this.state.JobData['post_hour_rate'] : "0.00"))).toFixed(2) :
                                    this.state.JobData['charge_type'] != undefined ? ((this.state.JobData['charge_rate'] != "NaN" && this.state.JobData['charge_rate'] != null && this.state.JobData['charge_rate']  && this.state.JobData['charge_rate'] != "") ?this.state.JobData['charge_rate'] : "0.00") : parseFloat((this.state.deepLink == true ? ((this.state.JobData['session_rate']!= "NaN" && this.state.JobData['session_rate'] != null && this.state.JobData['session_rate']  && this.state.JobData['session_rate'] != "") ?this.state.JobData['session_rate'] : "0.00"): ((this.state.JobData['post_session_rate']!= "NaN" && this.state.JobData['post_session_rate'] != null && this.state.JobData['post_session_rate']  && this.state.JobData['post_session_rate'] != "") ?this.state.JobData['post_session_rate'] : "0.00"))).toFixed(2)
                                }

                            </Text>
                    </View>
                </View>
            </View>  

            {this.state.userId != this.state.JobData['user_id'] &&  
            <View style={{ flexDirection: 'row', marginTop: 20,}}>
                <View style={newjobstyles.viewArea}>
                    <View style={newjobstyles.viewSubArea}>
                        <Text style={newjobstyles.labelText}>Home visits</Text>
                        <Text style={newjobstyles.detailText}>
                            {(this.state.JobData['home_visit'] != null && this.state.JobData['home_visit'] != '' ? this.state.JobData['home_visit'] : 'No')}
                        </Text>
                    </View>
                </View>
                <View style={newjobstyles.viewAreaWide}>
                    <View style={newjobstyles.viewSubArea2}>
                        <Text style={newjobstyles.labelText}>Home visit rate</Text>
                        <Text style={newjobstyles.detailText}>
                            £ {parseFloat((this.state.JobData['home_rate']!= "NaN" && this.state.JobData['home_rate'] != null && this.state.JobData['home_rate']  && this.state.JobData['home_rate'] != "") ? this.state.JobData['home_rate'] : '0.00').toFixed(2)}
                        </Text>
                    </View>
                </View>
            </View>  

            }

            {/* <View style={[formStyles.hrLine, formStyles.input]} /> */}

            {this.state.jobType != 'all' &&     
                <View style={{ paddingTop: 30}}>                
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', alignContent: 'flex-start', alignSelf: 'flex-start'}}>
                        <Text style={newjobstyles.totalLabel}>Total: </Text>
                        <Text style={newjobstyles.totalValue}>£ {parseFloat(((this.state.JobData['total_amount'] != "NaN" && this.state.JobData['total_amount'] != null && this.state.JobData['total_amount']  && this.state.JobData['total_amount'] != "") ?this.state.JobData['total_amount'] : "0.00")).toFixed(2)}</Text>
                    </View>
                </View>
            }
            {/* <View style={[formStyles.hrLine, formStyles.input]} /> */} 
        </View>

        const displayMap = <View style={{ flex: 1, marginTop: 0, }}>
            {
                this.state.JobData['latitude'] != "" && this.state.JobData['longitude'] != "" && this.state.JobData['latitude'] != undefined && this.state.JobData['longitude'] != undefined ? <View><View>
      
                    <View style={{ flexDirection: 'column', marginTop: 15, }}>
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center', alignContent: 'center', alignSelf: 'center'
                        }}>
                            <MapView
                                provider={PROVIDER_GOOGLE}
                                style={{
                                    width: (Dimensions.get('window').width - 12), height: 250, justifyContent: 'center',
                                    alignItems: 'center', alignContent: 'center', alignSelf: 'center'
                                }}
                                customMapStyle={this.state.mapStyle}
                                initialRegion={{
                                    latitude: parseFloat(this.state.JobData['latitude']),
                                    longitude: parseFloat(this.state.JobData['longitude']),
                                    latitudeDelta: 0.0020,
                                    longitudeDelta: 0.0020,
                                }}


                            >
                                <Marker coordinate={{
                                    latitude: parseFloat(this.state.JobData['latitude']),
                                    longitude: parseFloat(this.state.JobData['longitude'])
                                }} >
                                    <Image source={require('./images/map_marker.png')} style={{height: 50, width:40.91 }} />
                                </Marker>
                            </MapView>
                        </View>

                        <Text style={{ color: '#142828', fontFamily: Fonts.MontserratMedium, fontSize: 15, marginTop: 15, marginBottom: 15, marginLeft: 40 }}><Image style={{
                            width: 30, height: 30, justifyContent: 'center',
                        }} source={require('./images/place-holder.png')} ></Image>{this.state.JobData['address_1'] +" "+ this.state.JobData['town'] + " " + this.state.JobData['post_code']}
                        </Text>
                    </View>
                </View>
                    <View style={[formStyles.hrLine, formStyles.input]} />
                </View> : null

            }
        </View>

        const displayBodyRemain = <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 20,}}>
            {
                this.state.userId != this.state.JobData['user_id'] ? <View>
                    <View style={newjobstyles.viewArea2}>
                        <View>
                            <Text style={newjobstyles.labelText}>Job Description</Text>
                            <View>
                                <Text style={{ marginBottom: 20, marginTop: 5, color: '#414253', fontSize: 15, fontFamily: Fonts.MontserratMedium }}>{(this.state.JobData['description'] == null ? '': this.state.JobData['description'])}</Text>
                            </View>
                        </View>
                    </View>
                </View> : null
            }


        </View>

        const tabItemDisplay = <View style={{
            flex: 1,
            justifyContent: 'center', 
            alignItems: 'center', backgroundColor: '#ffffff',
            width: '100%', alignSelf: 'center', left: 0, right: 0, padding: 0, margin: 0,
        }}>

        <ScrollView style={{ width: '100%', paddingHorizontal: 10, paddingTop: 20}}>
        { this.state.selectedIndex == 1 && 
            <View>
                <View>                    
                    <View style={{ flexDirection: 'row', }}>
                        <View style={{ width: '80%'}}>
                            <Text style={newjobstyles.overlayHeading}>Healthcare organisation</Text> 
                        </View>
                        <View style={{ width: '20%', justifyContent: 'center', alignContent: 'flex-end', alignItems: 'flex-end',}}>
                            <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignContent: 'flex-end', alignItems: 'flex-end',  }} onPress={() => {
                                this.onClose();
                            }}>
                                <Image source={require('./images/closeOverlay.png')} style={{ width: 16, height:16 }}></Image> 
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={{ flex: 8, marginBottom: 20, marginTop: 10, color: '#414253', fontSize: 15, fontFamily: Fonts.MontserratMedium }}>{(this.state.JobData['lb_description'] == null ? '': this.state.JobData['lb_description'])}</Text>
                </View>

                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <View style={{ flex: 3, flexDirection: 'row', alignItems: 'flex-start', alignContent: 'flex-start', alignSelf: 'flex-start',textAlignVertical: 'center',}}>
                        <Text style={newjobstyles.practiceOptionHead}>IT System</Text>
                    </View>
                    <View style={{ flex: 2, flexDirection: 'row', alignItems: 'flex-end', alignContent: 'flex-end', alignSelf: 'flex-end', textAlignVertical: 'center',}}>
                        <Text style={[newjobstyles.practiceOptionHead, {alignItems: 'flex-end', alignContent: 'flex-end', alignSelf: 'flex-end'}]}>Parking</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                    <View style={{ flex: 3, flexDirection: 'row', alignItems: 'flex-start', alignContent: 'flex-start', alignSelf: 'flex-start',textAlignVertical: 'center',}}>
                        <Image style={{
                            width: 22, height: 20, marginRight: 10
                        }} source={require('./images/IT-systems.png')}></Image>
                        <Text style={newjobstyles.practiceOptionLabel}>{(this.state.JobData['it_system'] == undefined || this.state.JobData['it_system'] == null ? "" : this.state.JobData['it_system'])}</Text>
                    </View>
                    <View style={{ flex: 2, flexDirection: 'row', alignItems: 'flex-end', alignContent: 'flex-end', alignSelf: 'flex-end', textAlignVertical: 'center',}}>
                        <Image style={{
                            width: 23, height: 20, marginRight: 10, alignItems: 'flex-end', alignContent: 'flex-end', alignSelf: 'flex-end'
                        }} source={require('./images/parking.png')}></Image>
                        <Text style={[newjobstyles.practiceOptionLabel, {alignItems: 'flex-end', alignContent: 'flex-end', alignSelf: 'flex-end'}]}>{(this.state.JobData['parking'] == undefined || this.state.JobData['parking'] == null ? "" : this.state.JobData['parking'])}</Text>
                    </View>
                </View>
            </View>
        }

        { this.state.selectedIndex == 2 && 
            <View style={{ flex: 1, marginTop: 0, }}>
            
                <View style={{ flexDirection: 'row'}}>
                    <View style={{ width: '80%'}}>
                        <Text style={newjobstyles.overlayHeading}></Text> 
                    </View>
                    <View style={{ width: '20%', justifyContent: 'center', alignContent: 'flex-end', alignItems: 'flex-end',}}>
                        <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignContent: 'flex-end', alignItems: 'flex-end',  }} onPress={() => {
                            this.onClose();
                        }}>
                            <Image source={require('./images/closeOverlay.png')} style={{ width: 16, height:16 }}></Image> 
                        </TouchableOpacity>
                    </View>
                </View>
                {this.state.JobData['latitude'] != "" && this.state.JobData['longitude'] != "" && this.state.JobData['latitude'] != undefined && this.state.JobData['longitude'] != undefined ? <View>
                    <View style={{ flexDirection: 'column',  }}>
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center', alignContent: 'center', alignSelf: 'center',
                            paddingBottom:10 
                        }}>
                            
                            <MapView
                                provider={PROVIDER_GOOGLE}
                                style={{
                                    width: (Dimensions.get('window').width), height: 250, justifyContent: 'center',
                                    alignItems: 'center', alignContent: 'center', alignSelf: 'center'
                                }}
                                customMapStyle={this.state.mapStyle}
                                initialRegion={{
                                    latitude: parseFloat(this.state.JobData['latitude']),
                                    longitude: parseFloat(this.state.JobData['longitude']),
                                    latitudeDelta: 0.0015,
                                    longitudeDelta: 0.0015,
                                }}
                            >
                                <Marker coordinate={{
                                    latitude: parseFloat(this.state.JobData['latitude']),
                                    longitude: parseFloat(this.state.JobData['longitude'])
                                }}>
                                <Image source={require('./images/map_marker.png')} style={{height: 50, width:40.91 }} />
                                </Marker>
                            </MapView>
                        </View>
                        <View  style={{paddingVertical:10 }}>
                            <Text style={newjobstyles.practiceOptionHead}>Location</Text>   
                            <Text style={{ color: '#414253', fontFamily: Fonts.MontserratMedium, fontSize: 15, paddingVertical:5 }}><Image style={{
                                width: 20, height: 24, justifyContent: 'center',
                            }} source={require('./images/place-holder.png')} ></Image>  {this.state.JobData['address_1'] +" "+ this.state.JobData['town'] + " " + this.state.JobData['post_code']}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row',paddingTop: 10 }}>
                        <View style={{ flex: 1, alignItems: 'flex-start', alignContent: 'flex-start', alignSelf: 'flex-start', }}>
                            <TouchableOpacity style={newjobstyles.postedByBtnArea} onPress={() => { Clipboard.setString(this.state.JobData['address_1'] +" "+ this.state.JobData['town'] + " " + this.state.JobData['post_code'])}}>
                                <Text style={newjobstyles.postedByButtonText}>COPY ADDRESS</Text>
                            </TouchableOpacity> 
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end', alignContent: 'flex-end', alignSelf: 'flex-end', }}>
                            <TouchableOpacity style={newjobstyles.postedByBtnArea} onPress={() => {this.handleGetDirections(this.state.JobData['latitude'], this.state.JobData['longitude'])}}>
                                <Text style={newjobstyles.postedByButtonText}>GET DIRECTIONS</Text>
                            </TouchableOpacity> 
                        </View>
                    </View>
                </View>
                : 
                <Text style={newjobstyles.practiceOptionLabel}>Location not found</Text>
            }
        </View>
        }

        { this.state.selectedIndex == 3 && 
            <View>
                <View>
                    <View style={{ flexDirection: 'row', }}>
                        <View style={{ width: '80%'}}>
                            <Text style={newjobstyles.overlayHeading}>Posted By</Text> 
                        </View>
                        <View style={{ width: '20%', justifyContent: 'center', alignContent: 'flex-end', alignItems: 'flex-end',}}>
                            <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignContent: 'flex-end', alignItems: 'flex-end',  }} onPress={() => {
                                this.onClose();
                            }}>
                                <Image source={require('./images/closeOverlay.png')} style={{ width: 16, height:16 }}></Image> 
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row',paddingTop: 30 }}>
                        <View style={{ flex: 1, alignItems: 'flex-start', alignContent: 'flex-start', alignSelf: 'flex-start', paddingRight: 10}}>  
                            <Image ref={ranRef}  source={this.state.postedByDefaultImage} style={{width: 80, height: 80, borderRadius: (80/2) }} />
                        </View>
                        <View style={{ flex: 3, alignItems: 'flex-start', alignContent: 'flex-start', alignSelf: 'flex-start', paddingLeft: 5}}>
                            <Text style={newjobstyles.postedByName}>{(this.state.JobData['first_name'] == null ? '': this.state.JobData['first_name'])+ " " + (this.state.JobData['last_name'] == null ? '': this.state.JobData['last_name'])}</Text>
                            <Text style={newjobstyles.postedByEmail}>{(this.state.JobData['email'] == null ? '': this.state.JobData['email'])}</Text>
                            <Text style={newjobstyles.postedByCount}>{(this.state.JobData['practiceCount'] != null && this.state.JobData['practiceCount'] != '' ? this.state.JobData['practiceCount'] : 0)} Jobs posted</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row',paddingTop: 30 }}>
                    <View style={{ flex: 1, alignItems: 'flex-start', alignContent: 'flex-start', alignSelf: 'flex-start', }}>
                        <TouchableOpacity style={newjobstyles.postedByBtnArea} onPress={() => {
                            if(this.state.postedByPhone != '') {
                                Linking.openURL('tel:'+ this.state.postedByPhone);
                            }
                        //   console.warn((this.state.JobData['phone_no'] == '' || this.state.JobData['phone_no'] == null) ? this.state.JobData['mobile_no'] : this.state.JobData['phone_no']);
                        }}>
                            <Text style={newjobstyles.postedByButtonText}>CALL</Text>
                        </TouchableOpacity> 
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end', alignContent: 'flex-end', alignSelf: 'flex-end', }}>
                        <TouchableOpacity style={newjobstyles.postedByBtnArea} onPress={() => {
                            this.onClose();
                            this.props.navigation.navigate('DetailMessagesPage', {
                                    sendTo: (this.state.JobData['practice_id'] == null ? '': this.state.JobData['practice_id']),
                                    msgName: (this.state.JobData['first_name'] == null ? '': this.state.JobData['first_name']) + " " + (this.state.JobData['last_name'] == null ? '': this.state.JobData['last_name']),
                                    profileImage: (this.state.JobData['photo'] == null ? '': this.state.JobData['photo']) 
                                });
                        }}>
                            <Text style={newjobstyles.postedByButtonText}>MESSAGE</Text>
                        </TouchableOpacity> 
                    </View>
                </View>
            </View>
        }

        <View style={{ marginBottom: 15, marginTop: 20, paddingBottom: 20}}>
        {
            (this.state.JobData['invoice_practice_type'] != 'doctor' && this.state.JobData['is_applied'] == 4 && this.state.inFuture == false) ?
                <TouchableOpacity style={[newjobstyles.signUpBtnArea, { borderRadius: 12 }, this.state.JobData['is_invoice'] != 0 ? { opacity: 0.7 } : null]} onPress={() => {
                    this.props.navigation.navigate('NewInvoicePage', {
                        fromJob : true,
                        data: this.state.JobData,
                    });
                }}>
                    <Text style={newjobstyles.buttonText}>CREATE INVOICES</Text>
                </TouchableOpacity> 
                :
                (this.state.JobData['is_applied'] == 4 && this.state.inFuture == true) ?
                <TouchableOpacity disabled={this.state.JobData['is_invoice'] != 0 ? true : false} style={[newjobstyles.overlayBtnArea, { borderRadius: 12 }, this.state.JobData['is_invoice'] != 0 ? { opacity: 0.7 } : null]} onPress={() => {
                    this.props.navigation.navigate('DetailMessagesPage', {
                            sendTo: this.state.JobData['practice_id'],
                            msgName: this.state.JobData['first_name'] + " " + this.state.JobData['last_name'],
                            profileImage: this.state.JobData['photo']
                        });
                }}>
                <Text style={newjobstyles.buttonText}>ASK A QUESTION</Text>
                </TouchableOpacity> 
                : 
                (this.state.JobData['invoice_practice_type'] != 'doctor' && (this.state.statusTitle != 'Applied' && this.state.jobType == 'all') ) ?
                <TouchableOpacity disabled={this.state.JobData['is_applied'] != 0 ? true : false} style={[newjobstyles.overlayBtnArea, { borderRadius: 12, flexDirection: 'row' }, this.state.JobData['is_applied'] != 0 ? { opacity: 0.7 } : null]} onPress={() => {
                    this.setState({
                        'spinner': true
                    });
                    setTimeout(() => {
                        this.applyForTheJob();
                    }, 1000);
                }}>
                    <View style={{width:'60%', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                        <Text style={newjobstyles.buttonText}>APPLY</Text>
                    </View>
                    <View style={{width:'40%', height: 32, borderLeftColor: '#fff', borderLeftWidth:0.5, justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center'}}>
                        <Text style={newjobstyles.buttonText}>£ {parseFloat(((this.state.JobData['total_amount'] != "NaN" && this.state.JobData['total_amount'] != null && this.state.JobData['total_amount']  && this.state.JobData['total_amount'] != "") ?this.state.JobData['total_amount'] : "0.00")).toFixed(2)}</Text>  
                        <Text style={newjobstyles.buttonSmallText}>Total shift</Text>
                    </View>                                
                </TouchableOpacity> 
                : 
                (this.state.JobData['invoice_practice_type'] == 'doctor' && this.state.statusTitle != 'Applied' && this.state.jobType != 1  && this.state.inFuture == true)?
                <TouchableOpacity style={[newjobstyles.overlayBtnArea, { borderRadius: 12 }, this.state.JobData['is_applied'] != 0 ? { opacity: 0.7 } : null]} onPress={() => {
                        this.props.navigation.navigate('NewJobPage', {
                            edit: true,
                            jobDates: this.state.jobDate,
                            data: this.state.JobData,
                            PageTittle: 'Edit Job',
                            ButtonTitle: 'Update',
                            callBack: this.getUpdate.bind(this)
                        });
                    }}>
                    <Text style={newjobstyles.buttonText}>EDIT</Text>
                </TouchableOpacity> 
                : 
                (((this.state.statusTitle != 'Applied' && this.state.jobType != 1  && this.state.inFuture == false) || this.state.statusTitle == 'Calendar') && (this.state.JobData['named_status'] == 'Invoiced' || this.state.JobData['invoice_practice_type'] == 'doctor')) ?
                <TouchableOpacity style={[newjobstyles.overlayBtnArea, { borderRadius: 12 }, this.state.JobData['is_applied'] != 0 ? { opacity: 0.7 } : null]} onPress={() => {

                    this.onClose();
                    this.setState({ setMultiJobDate: true });
                    // this.props.navigation.navigate('NewJobPage', {
                    //     edit: true,
                    //     data: this.state.JobData,
                    //     PageTittle: 'Copy Job',
                    //     ButtonTitle: 'SAVE AND ADD JOB',
                    //     callBack: this.props.navigation.goBack.bind(this),
                    //     post: 'copy'
                    // });
                }}>
                    <Text style={newjobstyles.buttonText}>COPY THIS JOB</Text>
                </TouchableOpacity> 
                :

                (this.state.JobData['invoice_practice_type'] != 'doctor' && this.state.statusTitle != 'Applied' && this.state.jobType != 1  && this.state.inFuture == false) ?
                <TouchableOpacity style={[newjobstyles.overlayBtnArea, { borderRadius: 12 }, ]} onPress={() => {
                        this.props.navigation.navigate('NewInvoicePage', {
                        fromJob : true,
                        data: this.state.JobData
                    });
                    }}>
                    <Text style={newjobstyles.buttonText}>CREATE INVOICE</Text>
                </TouchableOpacity> 
                :
                (this.state.jobType == 2  && this.state.JobData['type'] == 1 && this.state.JobData['is_applied'] != 3 && this.state.JobData['named_status'] != 'Invoiced') ?
                <TouchableOpacity style={[newjobstyles.overlayBtnArea, { borderRadius: 12 }, ]} onPress={() => {
                    this.props.navigation.navigate('DetailMessagesPage', {
                        sendTo: (this.state.JobData['practice_id'] == null ? '': this.state.JobData['practice_id']),
                        msgName: (this.state.JobData['first_name'] == null ? '': this.state.JobData['first_name']) + " " + (this.state.JobData['last_name'] == null ? '': this.state.JobData['last_name']),
                        profileImage: (this.state.JobData['photo'] == null ? '': this.state.JobData['photo']) 
                    });
                }}>
                    <Text style={newjobstyles.buttonText}>MESSAGE</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity style={[newjobstyles.overlayBtnArea, { borderRadius: 12, backgroundColor: '#00D9A6', }, ]} onPress={() => {
                    // this.props.navigation.goBack();
                    this.setState({'spinner': true});
                    this.cancelJob();
                }}>
                    <Text style={newjobstyles.buttonText}>CANCEL APPLICATION</Text>
                </TouchableOpacity>
        }


    </View>

        </ScrollView>   
        </View>
        
        const buttonArea = <View style={{ marginBottom: 15, marginTop: 20, }}>
        {
                (this.state.JobData['is_applied'] == 4 && this.state.inFuture == true) ?
                <TouchableOpacity disabled={this.state.JobData['is_invoice'] != 0 ? true : false} style={[newjobstyles.signUpBtnArea, { borderRadius: 12 }, this.state.JobData['is_invoice'] != 0 ? { opacity: 0.7 } : null]} onPress={() => {
                    this.props.navigation.navigate('DetailMessagesPage', {
                            sendTo: this.state.JobData['practice_id'],
                            msgName: this.state.JobData['first_name'] + " " + this.state.JobData['last_name'],
                            profileImage: this.state.JobData['photo']
                        });
                }}>
                <Text style={newjobstyles.buttonText}>Ask a question</Text>
                </TouchableOpacity> 
                : null
        }
        {
                (this.state.JobData['invoice_practice_type'] != 'doctor' && (this.state.statusTitle != 'Applied' && this.state.jobType == 'all') ) ?
                <TouchableOpacity disabled={this.state.JobData['is_applied'] != 0 ? true : false} style={[signupstyles.signUpBtnArea, { borderRadius: 12, flexDirection: 'row' }, this.state.JobData['is_applied'] != 0 ? { opacity: 0.7 } : null]} onPress={() => {
                    this.setState({
                        'spinner': true
                    });
                    setTimeout(() => {
                        this.applyForTheJob();
                    }, 1000);
                }}>
                    <View style={{width:'60%', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                        <Text style={newjobstyles.buttonText}>APPLY</Text>
                    </View>
                    <View style={{width:'40%', height: 32, borderLeftColor: '#fff', borderLeftWidth:0.5, justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center'}}>
                        <Text style={newjobstyles.buttonText}>£ {parseFloat(((this.state.JobData['total_amount'] != "NaN" && this.state.JobData['total_amount'] != null && this.state.JobData['total_amount']  && this.state.JobData['total_amount'] != "") ?this.state.JobData['total_amount'] : "0.00")).toFixed(2)}</Text>  
                        <Text style={newjobstyles.buttonSmallText}>Total shift</Text>
                    </View>                                
                </TouchableOpacity> 
                : null
        }
        {
                (this.state.userId == this.state.JobData['user_id'] && this.state.JobData['named_status']== 'Upcoming')?
                <View style={{flexDirection: 'row', paddingHorizontal:10}}>
                    <View style={{width: '75%',  paddingLeft:(this.state.userId == this.state.JobData['user_id'] ? 10 : 0) }}>
                    <TouchableOpacity style={[(this.state.userId != this.state.JobData['user_id'] ? newjobstyles.signUpBtnArea : newjobstyles.shortBtnArea), { borderRadius: 12, alignSelf:(this.state.userId == this.state.JobData['user_id'] ? 'flex-start' : 'center') }, ]} onPress={() => {
                            this.props.navigation.navigate('NewJobPage', {
                                edit: true,
                                jobDates: this.state.jobDate,
                                data: this.state.JobData,
                                PageTittle: 'Edit Job',
                                ButtonTitle: 'UPDATE',
                                callBack: this.getUpdate.bind(this)
                            });
                        }}>
                        <Text style={newjobstyles.buttonText}>EDIT</Text>
                    </TouchableOpacity> 
                    </View>
                    <View style={{width: '25%',}}>
                        <TouchableOpacity onPress={() => {
                                // console.warn("Click More");
                                if(this.state.JobData['named_status']== 'Invoiced' ) {
                                    this.onClose();
                                    this.props.navigation.navigate('NewJobPage', {
                                        edit: true,
                                        data: this.state.JobData,
                                        PageTittle: 'Copy Job',
                                        ButtonTitle: 'SAVE AND ADD JOB',
                                        callBack: this.props.navigation.goBack.bind(this),
                                        post: 'copy'
                                    });
                                } else {
                                    this.setState({ moreOverLay: true });
                                }
                                
                            }}>
                            <View style={{width:55, height:55, borderRadius:15,borderColor:'#00D9A6',borderWidth:2, justifyContent:'center', alignItems:'center'}}>                        
                                <Image  source={require('./images/menu1.png')} style={{ width: 4, height:18, tintColor: '#00D9A6'}} tintColor='#00D9A6'/>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                : null
        }
        {
                (((this.state.statusTitle != 'Applied' && this.state.jobType != 1  && this.state.inFuture == false) || this.state.statusTitle == 'Calendar') && this.state.JobData['named_status'] == 'Invoiced') ?
                <View style={{flexDirection: 'row', paddingHorizontal:10}}>
                    <View style={{width: '100%' }}>
                        <TouchableOpacity style={[newjobstyles.signUpBtnArea , { borderRadius: 12 }, ]} onPress={() => {
                            this.onClose();
                            this.setState({ setMultiJobDate: true });
                            // this.props.navigation.navigate('NewJobPage', {
                            //     edit: true,
                            //     data: this.state.JobData,
                            //     PageTittle: 'Copy Job',
                            //     ButtonTitle: 'SAVE AND ADD JOB',
                            //     callBack: this.props.navigation.goBack.bind(this),
                            //     post: 'copy'
                            // });
                        }}>
                            <Text style={newjobstyles.buttonText}>COPY THIS JOB</Text>
                        </TouchableOpacity> 
                    </View>
                </View>
                : null
        }
        {

                ((this.state.JobData['is_applied'] == 3 && this.state.jobType != 1 && this.state.inFuture == false) || (this.state.userId == this.state.JobData['user_id'] && this.state.JobData['named_status'] == 'Completed')) ?

                <View style={{flexDirection: 'row', paddingHorizontal:10}}>
                    <View style={{width: (this.state.userId != this.state.JobData['user_id'] ? '100%' : '75%'), paddingLeft:(this.state.userId == this.state.JobData['user_id'] ? 10 : 0)  }}>
                        <TouchableOpacity style={[(this.state.userId != this.state.JobData['user_id'] ? newjobstyles.signUpBtnArea : newjobstyles.shortBtnArea), { borderRadius: 12, alignSelf:(this.state.userId == this.state.JobData['user_id'] ? 'flex-start' : 'center') }, ]} onPress={() => {
                                this.props.navigation.navigate('NewInvoicePage', {
                                fromJob : true,
                                data: this.state.JobData
                            });
                            }}>
                            <Text style={newjobstyles.buttonText}>CREATE INVOICE</Text>
                        </TouchableOpacity>
                    </View>
                    {this.state.userId == this.state.JobData['user_id'] &&
                        <TouchableOpacity onPress={() => {
                            // console.warn("Click More");
                            if(this.state.JobData['named_status']== 'Invoiced' ) {
                                this.onClose();
                                this.props.navigation.navigate('NewJobPage', {
                                    edit: true,
                                    data: this.state.JobData,
                                    PageTittle: 'Copy Job',
                                    ButtonTitle: 'SAVE AND ADD JOB',
                                    callBack: this.props.navigation.goBack.bind(this),
                                    post: 'copy'
                                });
                            } else {
                                this.setState({ moreOverLay: true });
                            }
                            }}>
                                <View style={{width: '25%', width:55, height:55, borderRadius:15,borderColor:'#00D9A6',borderWidth:2, justifyContent:'center', alignItems:'center'}}>                            
                                    <Image  source={require('./images/menu1.png')} style={{ width: 4, height:18, tintColor: '#00D9A6'}} tintColor='#00D9A6'/>
                                </View>
                        </TouchableOpacity>
                    }
                </View>
                
                : null
        }
        {
                (this.state.jobType == 2  && this.state.JobData['type'] == 1 && this.state.JobData['is_applied'] != 3 ) ?
                <View style={{flexDirection: 'row', paddingHorizontal:10}}>
                    <View style={{width: (this.state.userId != this.state.JobData['user_id'] ? '100%' : '75%'),  paddingLeft:(this.state.userId == this.state.JobData['user_id'] ? 10 : 0) }}>
                        <TouchableOpacity style={[(this.state.userId != this.state.JobData['user_id'] ? newjobstyles.signUpBtnArea : newjobstyles.shortBtnArea), { borderRadius: 12 , alignSelf:(this.state.userId == this.state.JobData['user_id'] ? 'flex-start' : 'center') }, ]} onPress={() => {
                            this.props.navigation.navigate('DetailMessagesPage', {
                                sendTo: (this.state.JobData['practice_id'] == null ? '': this.state.JobData['practice_id']),
                                msgName: (this.state.JobData['first_name'] == null ? '': this.state.JobData['first_name']) + " " + (this.state.JobData['last_name'] == null ? '': this.state.JobData['last_name']),
                                profileImage: (this.state.JobData['photo'] == null ? '': this.state.JobData['photo']) 
                            });
                        }}>
                            <Text style={newjobstyles.buttonText}>MESSAGE</Text>
                        </TouchableOpacity>
                    </View>
                    {this.state.userId == this.state.JobData['user_id'] &&
                        <View style={{width: '25%', width:55, height:55, borderRadius:15,borderColor:'#00D9A6',borderWidth:2, justifyContent:'center', alignItems:'center'}}>
                            <TouchableOpacity onPress={() => {                                
                                if(this.state.JobData['named_status']== 'Invoiced' ) {
                                    this.onClose();
                                    this.props.navigation.navigate('NewJobPage', {
                                        edit: true,
                                        data: this.state.JobData,
                                        PageTittle: 'Copy Job',
                                        ButtonTitle: 'SAVE AND ADD JOB',
                                        callBack: this.props.navigation.goBack.bind(this),
                                        post: 'copy'
                                    });
                                } else {
                                    this.setState({ moreOverLay: true });
                                }
                            }}>
                                <Image  source={require('./images/menu1.png')} style={{ width: 4, height:18, tintColor: '#00D9A6'}} tintColor='#00D9A6'/>
                                {/* <Image source={require('./images/menu.png')} style={{ width: 8, height:36 }}></Image> */}
                            </TouchableOpacity>
                        </View>
                    }
                </View>
                : null
        }
        {
            (this.state.statusTitle == 'Applied' && this.state.JobData['is_applied'] != 3) ?
                <View style={{flexDirection: 'row', paddingHorizontal:10}}>
                    <View style={{width: (this.state.userId != this.state.JobData['user_id'] ? '100%' : '75%'),  paddingLeft:(this.state.userId == this.state.JobData['user_id'] ? 10 : 0) }}>
                    <TouchableOpacity style={[(this.state.userId != this.state.JobData['user_id'] ? newjobstyles.signUpBtnArea : newjobstyles.shortBtnArea), { borderRadius: 12,alignSelf:(this.state.userId == this.state.JobData['user_id'] ? 'flex-start' : 'center')  }, ]} onPress={() => {
                        // this.props.navigation.goBack();
                        this.setState({'spinner': true});
                        this.cancelJob();
                    }}>
                        <Text style={newjobstyles.buttonText}>CANCEL APPLICATION</Text>
                    </TouchableOpacity>
                    </View>
                        {this.state.userId == this.state.JobData['user_id'] &&
                        <TouchableOpacity onPress={() => {
                                    console.log("Click More");
                                    this.setState({ moreOverLay: true });
                                }}>
                            <View style={{width: '25%', width:55, height:55, borderRadius:15,borderColor:'#00D9A6',borderWidth:2, justifyContent:'center', alignItems:'center'}}>                                
                                <Image  source={require('./images/menu1.png')} style={{ width: 4, height:18, tintColor: '#00D9A6'}} tintColor='#00D9A6'/>   
                            </View>                        
                        </TouchableOpacity>
                        }
                </View>
                : null
        }


    </View>

        return (

            <View style={{ flex: 1, marginTop: STATUSBAR_HEIGHT, }}>
               

                {
                    this.state.JobData.length != 0 ? displayHead : null
                }

                {
                    (this.state.JobData.length != 0 && this.state.jobType != 'all') ? nameStatus : null
                }

                <ScrollView style={{ marginTop: 20, marginBottom: 5 }}>
                    {
                        (this.state.JobData.length != 0 && this.state.userId != this.state.JobData['user_id']) ? displayTab : null
                    }

                    {
                        this.state.JobData.length != 0 ? displayBody : null
                    }   

                    {
                        this.state.JobData.length != 0 ? displayBodyRemain : null
                    }  
                </ScrollView>


                {buttonArea}

                {/* Start - More Overlay */}
                <Overlay visible={this.state.moreOverLay} onClose={this.onClose} 
                        closeOnTouchOutside 
                        animationType='bounceInUp'
                        containerStyle={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                    childrenWrapperStyle={{
                        width: 'auto',
                        maxHeight: 350, 
                        minHeight: 200,
                        position: 'absolute',
                        bottom: 0, left: 0, right: 0, padding: 0, margin: 0, backgroundColor: '#ffffff',
                        borderTopLeftRadius: 20,borderTopRightRadius: 20
                    }}>
                    <View style={{
                        flex: 1,
                        backgroundColor: '#FFF',
                        width: '100%', left: 0, right: 0, paddingLeft: 25, paddingRight:25, margin: 0,borderTopLeftRadius:20,borderTopRightRadius:20
                    }}>
                        <View style={{marginTop:8, marginBottom:5,justifyContent:"center",alignItems:'center'}}>
                            <View style={{ width:40, height:5, backgroundColor:'#C4C4C4', borderRadius:15}}></View>
                        </View>                        
                      
                        <View style={{ flexDirection: 'row-reverse', }}>
                            <TouchableOpacity style={{ flex: 1, justifyContent: 'center', marginRight: 20, alignItems: 'flex-end', paddingTop: 10  }} onPress={() => {
                                this.onClose();
                            }}>
                               <Image  source={require('./images/closeOverlay.png')} style={{ width: 16, height:16 }} />
                            </TouchableOpacity>
                        </View>

                        <View style={newjobstyles.optionOverlayRow}>
                            <View style={{ width: 40, justifyContent: 'center', alignItems: 'center' }}>
                                <Image  source={require('./images/copy.png')} style={{ width: 22, height:22 }}/>
                            </View>
                            <View style={{justifyContent: 'center',}}>
                                <TouchableOpacity onPress={() => {
                                    this.setState({ setMultiJobDate: true });
                                    this.onClose();
                                    // this.props.navigation.navigate('NewJobPage', {
                                    //     edit: true,
                                    //     data: this.state.JobData,
                                    //     PageTittle: 'Copy Job',
                                    //     ButtonTitle: 'SAVE AND ADD JOB',
                                    //     callBack: this.props.navigation.goBack.bind(this),
                                    //     post: 'copy'
                                    // });
                                }}>
                                    <Text style={newjobstyles.optionOverlayText}>COPY</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        { (this.state.JobData['invoice_practice_type'] == 'doctor' && this.state.JobData['named_status'] != 'Invoiced') &&

                        <View style={newjobstyles.optionOverlayRow}>
                            <View style={{ width: 40, justifyContent: 'center', alignItems: 'center' }}>
                                <Image  source={require('./images/delete.png')} style={{ width: 20, height:22 }}/>
                            </View>
                            <View style={{justifyContent: 'center',}}>
                                <TouchableOpacity onPress={() => {
                                    this.setState({ moreOverLay: false });
                                    this.setState({ confirmationDisplay: true });
                                    
                                }}>
                                    <Text style={newjobstyles.optionOverlayText}>DELETE</Text>
                                </TouchableOpacity>
                            </View>
                        </View>                              
                        }

                        { (this.state.JobData['invoice_practice_type'] == 'doctor' && this.state.jobType != 1  && this.state.inFuture == false && this.state.JobData['named_status'] != 'Completed') && 
                        <View style={newjobstyles.optionOverlayRow}>
                            <View style={{ width: 40, justifyContent: 'center', alignItems: 'center' }}>
                                <Image  source={require('./images/edit.png')} style={{ width: 22, height:22 }}/>
                            </View>                            
                            <View style={{justifyContent: 'center',}}>
                                <TouchableOpacity onPress={() => {
                                    this.onClose();
                                    this.setState({ moreOverLay: false });
                                    this.props.navigation.navigate('NewJobPage', {
                                        edit: true,
                                        jobDates: this.state.jobDate,
                                        data: this.state.JobData,
                                        PageTittle: 'Edit Job',
                                        ButtonTitle: 'Update',
                                        callBack: this.getUpdate.bind(this)
                                    });
                                }}>
                                    <Text style={newjobstyles.optionOverlayText}>EDIT</Text>
                                </TouchableOpacity>
                            </View>
                        </View> 
                        }
                        

                        { this.state.JobData['invoice_practice_type'] != 'doctor' &&
                        {/* <View style={{ flexDirection: 'row', width: '100%', paddingTop: 15,paddingBottom:10, marginTop:10}}>
                            <View style={{ width: 60, marginLeft: 25, justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesome name='edit' size={35} color='#ffffff'></FontAwesome>
                            </View>                            
                                <View style={{ flex: 1 }}>
                                    <TouchableOpacity onPress={() => {

                                        this.setState({ moreOverLay: false });
                                        this.props.navigation.navigate('DetailMessagesPage', {
                                            sendTo: this.state.JobData['practice_id'],
                                            msgName: this.state.JobData['first_name'] + " " + this.state.JobData['last_name'],
                                            profileImage: this.state.JobData['photo']
                                        });

                                    }}>
                                        <Text style={newjobstyles.optionOverlayText}>Ask a question</Text>
                                    </TouchableOpacity>
                                </View>
                        </View> */}
                        }
                    </View>
                </Overlay>
                {/* End - More Overlay */}

                {/* delete confirmation Overlay */}
                <Overlay
                    visible={this.state.confirmationDisplay}
                    onClose={() => { this.setState({ confirmationDisplay: false }) }}
                    closeOnTouchOutside
                    animationType='bounceInUp'
                    containerStyle={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                    childrenWrapperStyle={{width: '95%', height: this.state.overlayImageHeight, position: 'absolute', bottom: 20, alignSelf: 'center', borderRadius: 5,  backgroundColor: 'transparent'  }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '95%', alignSelf: 'center', paddingHorizontal: 20, backgroundColor: 'transparent' }}>
                        {/* <Image style={{ marginTop: (Dimensions.get('window').height * 0.1), width: 80, height: 80 }} source={require('./images/Group.png')}></Image>
                        <Text style={{ color: '#142828', fontFamily: Fonts.RubikMedium, textAlign: 'center', fontSize: 15, marginTop: (Dimensions.get('window').height * 0.05), }}>Are you sure you want to delete this job?</Text> */}

                        <ImageBackground source={require('./images/Delete_job.png')} style={{width: this.state.overlayImageWidth, height: this.state.overlayImageHeight}}>
                            <View style={{ flex: 1, flexDirection: 'row', marginTop: (Dimensions.get('window').height * 0.05), paddingBottom: 15, paddingHorizontal: 10, position: 'absolute', bottom: 15}}>
                                <View style={{ flex: 1,}}>
                                    <TouchableOpacity elevation={5} style={{
                                        paddingHorizontal: 10,
                                        width: (Dimensions.get('window').width * 0.35),
                                        height: 55,
                                        backgroundColor: '#2ee5b5',
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                        borderWidth: 1,
                                        borderColor: '#00F0B5',
                                        borderRadius: 5,
                                    }}
                                        onPress={() => {
                                            this.setState({ 'spinner': true });
                                            this.deleteJob();

                                        }}>
                                        <Text style={{ color: '#ffffff', fontFamily: Fonts.MontserratMedium, fontSize: 20, overflow: 'hidden', textAlign: 'center', }}>YES</Text>
                                    </TouchableOpacity>
                                </View>
                                <View  style={{ flex: 1,}}>
                                    <TouchableOpacity elevation={5} style={{
                                        paddingHorizontal: 10,
                                        width: (Dimensions.get('window').width * 0.35),
                                        height: 55,
                                        backgroundColor: '#ffffff',
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                        borderWidth: 1,
                                        borderColor: '#8d97b5',
                                        borderRadius: 5,
                                    }} onPress={() => {
                                        this.setState({ confirmationDisplay: false });
                                    }}>
                                        <Text style={{ color: '#8d97b5', fontFamily: Fonts.MontserratMedium, fontSize: 20, overflow: 'hidden', textAlign: 'center', }}>NO</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ImageBackground>                        
                    </View>
                </Overlay>
                {/* delete confirmation Overlay */}


                {/* Start - Add Job Complete Overlay */}
                <Overlay visible={this.state.jobApplied} onClose={this.onClose} 
                        closeOnTouchOutside 
                        animationType='bounceInUp'
                        containerStyle={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                    childrenWrapperStyle={{
                        width: '100%',
                        height: 330, position: 'absolute',
                        top: 100, right: 15, left: 20, borderRadius: 25
                    }}>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%', alignSelf: 'center',
                    }}>
                        <Image style={{ marginTop: 25, width: 80, height: 80 }} source={require('./images/shape.png')}></Image>
                        <Text style={{ color: '#142828', fontFamily: Fonts.MontserratMedium, textAlign: 'center', fontSize: 15, marginTop: 20, }}>Congratulations !</Text>
                        <Text style={{ color: '#aeb7af', fontSize: 13, fontFamily: Fonts.MontserratMedium, textAlign: 'center', lineHeight: 20, marginTop: 15, marginLeft: 20, marginRight: 20, }}></Text>


                        <View style={[loginformStyles.loginButtonArea, { flex: 1, }]}>
                            <TouchableOpacity elevation={5} style={[loginformStyles.loginTouchable, { borderWidth: 0, width: 100, height: 45, marginTop: 20 }]} onPress={() => {
                                this.props.navigation.state.params.callBack(false, '');
                                this.props.navigation.goBack();
                            }}>
                                <Text style={[loginformStyles.loginButton, { fontFamily: Fonts.MontserratMedium }]}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Overlay>
                {/* End - Add Job Complete Overlay */}

                {/* Start - Tab Item Overlay */}
                <Overlay visible={this.state.tabItemsOverLay} onClose={this.onClose} 
                        closeOnTouchOutside 
                        animationType='bounceInUp'
                        containerStyle={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                    childrenWrapperStyle={{
                        width: 'auto',
                        maxHeight: 550, position: 'absolute',
                        bottom: 0, left: 0, right: 0, padding: 0, margin: 0, backgroundColor: '#ffffff',
                        borderTopLeftRadius: 20,borderTopRightRadius: 20
                    }}>                    
                    <View style={{
                        flex: 1,
                        backgroundColor: '#FFF',
                        width: '100%', left: 0, right: 0, paddingLeft: 25, paddingRight:25, margin: 0,borderTopLeftRadius:20,borderTopRightRadius:20
                    }}>
                    <View style={{marginTop:8, marginBottom:5,justifyContent:"center",alignItems:'center'}}>
                            <View style={{ width:40, height:5, backgroundColor:'#C4C4C4', borderRadius:15}}></View>
                        </View>
                    
                        {tabItemDisplay}
                    </View>                    
                </Overlay>
                {/* End - Description Overlay */}

                {/* Start - select date Overlay */}
                <Overlay visible={this.state.setMultiJobDate} 
                        onClose={() => {this.setState({setMultiJobDate: false})}} 
                        closeOnTouchOutside 
                        containerStyle={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                        childrenWrapperStyle={{
                            width: '100%',
                            position: 'absolute',
                            right: 15, left: 20,
                            // borderRadius: 15, 
                            shadowColor: '#CEFDF2',
                            shadowOpacity: 0.36,
                            // elevation: 10,s
                            shadowRadius: 20 ,
                            padding: 0,
                            shadowOffset : { width: 0, height: 5},
                            backgroundColor: 'transparent'
                        }}>
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%', alignSelf: 'center',
                            backgroundColor: '#ffffff',
                            borderRadius: 15, 
                            paddingBottom: 20,
                            paddingTop: 10
                        }}>

                            <Calendar
                                minDate={Date()}
                                current={this.state._selectedDate}
                                style={{height: 350,}}
                                markingType={'multi-dot'}
                                markedDates={this.state._selectedDates}
                                onDayPress={(day) => {
                                    this.markingMultipleDays(day);
                                }}
                                
                            />

                        </View>
        

                        <View style={{backgroundColor:'transparent', flex: 1, flexDirection: 'column', marginTop: 20, paddingBottom: 15, paddingHorizontal: 10,  bottom: 15}}>
                            <View>
                                <Text style={{ color: '#ffffff', fontFamily: Fonts.MontserratBold, fontSize: 16, overflow: 'hidden', alignSelf: 'center',}} >Select dates you want to copy and apply the session (you can select multiple dates)</Text>
                            </View>
                            <View  style={{ flex: 1, paddingTop: 55}}>
                                <TouchableOpacity elevation={5} style={{
                                    paddingHorizontal: 10,
                                    width: (Dimensions.get('window').width - 45),
                                    height: 55,
                                    backgroundColor: '#ffffff',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    borderWidth: 1,
                                    borderColor: '#8d97b5',
                                    borderRadius: 10,
                                }} onPress={() => {
                                    this.setState({_selectedDates:{}});
                                    this.setState({setMultiJobDate: false});
                                }}>
                                    <Text style={{ color: '#000000', fontFamily: Fonts.MontserratBold, fontSize: 20, overflow: 'hidden', textAlign: 'center', }}>CANCEL</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1,paddingTop: 10}}>
                                <TouchableOpacity elevation={5} style={{
                                    paddingHorizontal: 10,
                                    width: (Dimensions.get('window').width - 45),
                                    height: 55,
                                    backgroundColor: '#2ee5b5',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    borderWidth: 1,
                                    borderColor: '#00F0B5',
                                    borderRadius: 10,
                                }}
                                    onPress={() => {
                                        this.setState({setMultiJobDate: false});
                                        this.props.navigation.navigate('NewJobPage', {
                                            edit: true,
                                            displayJobDate: this.state.displayJobDate,
                                            selectedDates: this.state._selectedDates,
                                            jobDates: this.state.jobDate,
                                            data: this.state.JobData,
                                            PageTittle: 'Copy Job',
                                            ButtonTitle: 'SAVE AND ADD JOB',
                                            callBack: this.props.navigation.goBack.bind(this),
                                            post: 'copy'
                                        });

                                    }}>
                                    <Text style={{ color: '#ffffff', fontFamily: Fonts.MontserratBold, fontSize: 20, overflow: 'hidden', textAlign: 'center', }}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Overlay>
                    {/* End - select date Overlay */}

                <Spinner
                    visible={this.state.spinner}
                    textContent={'Loading...'}
                    textStyle={styles.spinnerTextStyle}
                />
            </View>
        );
    }
}

export default ViewJob;


const statusBarStyles = StyleSheet.create({
    statusBar: {
        height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    },
  });