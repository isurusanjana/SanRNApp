import React, { Component, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, AsyncStorage, Image, ImageBackground, 
    Dimensions, Platform, StatusBar, KeyboardAvoidingView,TouchableWithoutFeedback, Keyboard } from 'react-native';
import RNCalendarEvents from 'react-native-calendar-events';
import { NavigationActions, StackActions } from 'react-navigation';
import { TextInputMask } from 'react-native-masked-text';
import LinearGradient from 'react-native-linear-gradient';
import validate from 'validate.js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-date-picker';
import Overlay from 'react-native-modal-overlay';
import { Icon, Button, Header } from 'native-base';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';

import CustomHeader from '../../../../components/customHeader/header';
import { newinvoicestyles } from '../../Invoice/newInvoice/styles';
import formStyles from '../../../../components/formTextInput/styles';
import { newjobstyles } from './styles';
import { loginformStyles } from '../../../login/styles';
import Spinner from 'react-native-loading-spinner-overlay';
import { GET_ALL_PRACTICES, MY_PRACTICES_PART1, MY_PRACTICES_PART2, POST_JOB_PART1, POST_JOB_PART2 } from '../../../../config/shared';
import { GlobalData } from '../../../../config/global';
import { styles } from '../../../login/styles';
import { Services } from '../../../../services/services';
import DropDownHolder from '../../../../components/dropDown/dropDownHolder';
import { Fonts } from '../../../../config/font';
import { ServiceParams } from '../../../../services/serviceParams';
import CustomDropDown from '../../../../components/CustomDropDown/customDropDown';

const constraints = {
    selectedPractice: {
        presence: {
            allowEmpty: false,
            message: "Please select practice first"
        },
    },
}

const dateTimeValidate = {
    startTime: {
        presence: {
            allowEmpty: false,
            message: "Please select start time"
        }
    },
    endTime: {
        presence: {
            allowEmpty: false,
            message: "Please select end time"
        }
    },
    rateType: {
        presence: {
            allowEmpty: false,
            message: "Please select rate type"
        },
    },
    rate: {
        presence: {
            allowEmpty: false,
            message: "Please add a Rate"
        }
    }
}

class NewJob extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinner: false,
            errors: {
                title: false
            },
            selectedPractice: '',
            practice_id: null,
            sessionBtn: false,
            hourBtn: false,
            startDate: new Date(),
            endDate: new Date(),
            setStartDate: false,
            setEndDate: false,
            displayStartDate: null,
            displayEndDate: null,
            rateType: null,
            rate: '0',
            total: '0.00',
            PageTittle: 'Add Job',
            ButtonTitle: 'ADD JOB',
            edit: false,
            edit_id: null,
            post: null,
            jobComplete: false,
            distance: null,
            buttonDisable: true,
            isHourActive: false,
            isSessionActive: false,
            jobDate: new Date(),
            setJobDate: false,
            displayJobDate: null,
            selectedDays: [], 
            setMultiJobDate: false,
            _selectedDates: {},
            sessionTypeVisible: false,
            sessionType:null,
            sessionTypeOption: [
                {
                    value: 'Face to face in practice',
                    id: 0,
                    selected: false,
                    sort: 'data'
                }, {
                    value: 'Remote consultation',
                    id: 1,
                    selected: false,
                    sort: 'data'
                }, {
                    value: 'Urgent Care Centre',
                    id: 2,
                    selected: false,
                    sort: 'data'
                }, {
                    value: '111/CCAS',
                    id: 3,
                    selected: false,
                    sort: 'data'
                }, {
                    value: 'Telephone / video appointments',
                    id: 4,
                    selected: false,
                    sort: 'data'
                }, {
                    value: 'Hot-Hub',
                    id: 5,
                    selected: false,
                    sort: 'data'
                }, {
                  value: 'Acute',
                  id: 6,
                  selected: false,
                  sort: 'data'
              }
            ],
        };
        this.setServices = new Services();
        // console.log("Job Data :", this.props.navigate.getParam('data'));
        RNCalendarEvents.authorizeEventStore()
            .then(status => {
                console.log(status);
            })
            .catch(error => {
                console.log(error);
            })

    }

    componentDidMount = async () => {
        // console.warn(this.state.startDate);
        this.user_id = null;

        GlobalData.INVOICE_SELECT_PRACTICE = [];
        // this.setState({ spinner: true });
        // componentDidMount() {
        await AsyncStorage.multiGet(["user_id"
        ]).then(response => {
            console.log("Response :", response);
            this.user_id = response[0][1];
            this.setState({ user_id: response[0][1] });
        });
        let today = new Date();
        await this.setState({"displayJobDate": moment(today, 'DD/MM/YYYY').format('DD MMM YY')});

        console.log("Props :", this.props);
        const { navigation } = this.props;

        // console.warn("Edit :", navigation.getParam('data'));
        if (navigation.getParam('edit') == true) { 
            let displayStartDate = moment(navigation.getParam('data')['start_time'], "HH:mm").format("HH:mm");
            let displayEndDate = moment(navigation.getParam('data')['end_time'], "HH:mm").format("HH:mm");

            await this.setState({
                'selectedPractice': navigation.getParam('data')['practice_name'],
                'edit_id': navigation.getParam('data')['id'],
                'practice_id': navigation.getParam('data')['practice_id'],
                // "rate": (navigation.getParam('post') == 'copy' ? GlobalData.INVOICE_SELECT_PRACTICE['hourly_rate'] : navigation.getParam('data')['charge_rate']) ,
                "rate": navigation.getParam('data')['charge_rate'] ,
                'displayStartDate': displayStartDate,
                'displayEndDate': displayEndDate,
                "total": navigation.getParam('data')['total'],
                "PageTittle": navigation.getParam('PageTittle'),
                "ButtonTitle": navigation.getParam('ButtonTitle'),
                "edit": true,
                "post": navigation.getParam('post'),
                "startDate": (new Date(parseFloat(navigation.getParam('data')['start_timestamp'] * 1000))),
                "endDate": (new Date(parseFloat(navigation.getParam('data')['end_timestamp'] * 1000))),
                "start_time" : navigation.getParam('data')['start_time'],
                "end_time" : navigation.getParam('data')['end_time'],
                "displayJobDate": (navigation.getParam('post') == 'copy' ? navigation.getParam('displayJobDate') : moment(navigation.getParam('data')['date'], 'DD/MM/YYYY').format('DD MMM YY')) , 
                // "distance": (navigation.getParam('data')['distance'] * 2).toFixed(),
                "distance": parseFloat(navigation.getParam('data')['distance']).toFixed(2),
                "buttonDisable" : false,
                "jobDate": navigation.getParam('jobDates'),
                // "displayJobDate": navigation.getParam('displayJobDate'),
                "_selectedDates": navigation.getParam('selectedDates'),
                "sessionType": navigation.getParam('data')['session'] 
            });

            if (navigation.getParam('data')['charge_type'] == '1') {
                this.setState({
                    isSessionActive: true,
                    isHourActive: false,
                    rateType: 'session'
                });
            } else {
                this.setState({
                    isSessionActive: false,
                    isHourActive: true,
                    rateType: 'hour'
                });
            }

            this.setState({ spinner: false });

            GlobalData.INVOICE_SELECT_PRACTICE['hourly_rate'] = navigation.getParam('data')['hourly_rate'];
            GlobalData.INVOICE_SELECT_PRACTICE['session_rate'] = navigation.getParam('data')['session_rate'];
                
        }
        this.setState({ spinner: false });
        // this.getPracticeData();
    }

    rateTypeSelect(type) {
        this.setState({ rateType: type });
        console.log("State :", this.state);
        var isValidForm = validate({ selectedPractice: this.state.selectedPractice }, constraints, { format: "detailed" });
        if (isValidForm != undefined) {
            DropDownHolder.dropDown.alertWithType('error', 'Error', (isValidForm[0]).options.message);
        } else {
            if (type == 'session') {
                this.setState({ isSessionActive: true });
                this.setState({ isHourActive: false });
                this.setState({ sessionBtn: true });
                this.setState({ hourBtn: false });
                if (GlobalData.INVOICE_SELECT_PRACTICE['session_rate'] != "" || GlobalData.INVOICE_SELECT_PRACTICE['session_rate'] != undefined || GlobalData.INVOICE_SELECT_PRACTICE['session_rate'] != null) {
                    this.setState({ rate: parseFloat(GlobalData.INVOICE_SELECT_PRACTICE['session_rate']).toFixed(2)  });
                    this.setState({ total: parseFloat(GlobalData.INVOICE_SELECT_PRACTICE['session_rate']).toFixed(2) });
                } else {
                    this.setState({ rate: "0" });
                    this.setState({ total: parseFloat("0").toFixed(2) });
                }
            } else {
                this.setState({ isHourActive: true });
                this.setState({ isSessionActive: false });
                this.setState({ sessionBtn: false });
                this.setState({ hourBtn: true });
                // console.warn('type of', typeof GlobalData.INVOICE_SELECT_PRACTICE['hourly_rate']);
                if (GlobalData.INVOICE_SELECT_PRACTICE['hourly_rate'] != NaN && GlobalData.INVOICE_SELECT_PRACTICE['hourly_rate'] != "NaN" && GlobalData.INVOICE_SELECT_PRACTICE['hourly_rate'] != "" && GlobalData.INVOICE_SELECT_PRACTICE['hourly_rate'] != undefined && GlobalData.INVOICE_SELECT_PRACTICE['hourly_rate'] != null) {

                    this.setState({ rate: GlobalData.INVOICE_SELECT_PRACTICE['hourly_rate'] });
                    if (this.state.displayEndDate == null) {
                        this.setState({ total: parseFloat(GlobalData.INVOICE_SELECT_PRACTICE['hourly_rate']).toFixed(2) });
                    } else {   
                        let today = moment().format("DD-MMM-YYYY"); 
                        // console.warn(today);
                        // console.warn('endDate: ',moment(today+' '+this.state.end_time).format("DD-MMM-YYYY HH:mm"));       
                        // console.warn('startDate: ',moment(this.state.start_time).format("DD-MMM-YYYY HH:mm"));       
                        // console.warn('Diff: ',moment(new Date(moment(today+' '+this.state.end_time).format("DD-MMM-YYYY HH:mm"))).diff(moment(new Date(moment(today+' '+this.state.start_time).format("DD-MMM-YYYY HH:mm"))), 'minute', true));       
                        // console.warn('rate: ',GlobalData.INVOICE_SELECT_PRACTICE['hourly_rate']);                   
                        var totalRate = (parseFloat(Math.round(moment(new Date(moment(today+' '+this.state.end_time).format("DD-MMM-YYYY HH:mm"))).diff(moment(new Date(moment(today+' '+this.state.start_time).format("DD-MMM-YYYY HH:mm"))), 'minute', true)) / 60) * (parseFloat(GlobalData.INVOICE_SELECT_PRACTICE['hourly_rate'])).toFixed(2));
                        // console.warn("totalRate :", totalRate);
                        this.setState({ total: totalRate });
                    }

                } else {
                    this.setState({ rate: "0" });
                    this.setState({ total: parseFloat("0").toFixed(2) });
                }
            }
        }
    }

    changeRate = (rate) => {
        this.setState({ rate: rate });
        if(rate != '' && rate != null && rate != undefined) {
            if(this.state.rateType == 'session') {
                this.setState({ total: parseFloat(rate).toFixed(2) }); 
            } else {
            var total = (parseFloat(Math.round(moment(new Date(moment(this.state.endDate).format("DD-MMM-YYYY HH:mm"))).diff(moment(new Date(moment(this.state.startDate).format("DD-MMM-YYYY HH:mm"))), 'minute', true)) / 60) * parseFloat(rate).toFixed(2))
                        
            this.setState({ total: total });  
                
            }     
        } else {
            this.setState({ total: '0.00' });  
        }
    }

    onGoBack = () => {
        console.warn('yest');
    }


    updatePractice() {;
        this.setState({ 'selectedPractice': GlobalData.INVOICE_SELECT_PRACTICE['practice_name'] });
        this.setState({ 'practice_id': GlobalData.INVOICE_SELECT_PRACTICE['id'] });
        if (GlobalData.INVOICE_SELECT_PRACTICE['distance'] != null && GlobalData.INVOICE_SELECT_PRACTICE['distance'] != 'null' 
            && GlobalData.INVOICE_SELECT_PRACTICE['distance'] != '' && 
            GlobalData.INVOICE_SELECT_PRACTICE['distance'] != undefined && GlobalData.INVOICE_SELECT_PRACTICE['distance'] != 'undefined' &&
            GlobalData.INVOICE_SELECT_PRACTICE['distance'] != NaN && GlobalData.INVOICE_SELECT_PRACTICE['distance'] != "NaN") {
            this.setState({ distance: (GlobalData.INVOICE_SELECT_PRACTICE['distance'] * 2).toFixed() });
        } else {
            this.setState({ distance: '' });
        }
    }

    getPracticeData() {
        // console.warn('Practice func');
        this.setServices.getService(MY_PRACTICES_PART1 + this.user_id + MY_PRACTICES_PART2, "")
            .then((responseData) => {
                // console.warn('practiced: ',responseData);
                this.setState({ 'spinner': false });
                console.log("Response Data :", responseData);
                this.practiceData = responseData.info;
                console.log("this.practiceData :", this.practiceData);
                if (this.state.edit == false) {
                    this.props.navigation.navigate('SelectPracticePage', {
                        showFrom: 'jobs',
                        PracticeDetails: this.practiceData,
                        onGoBack: () => this.updatePractice()
                    });
                }
            }, (error) => {

                this.setState({ 'spinner': false });
                console.warn("error Data :", error);
            })
    }

    onClose = () => {
        this.setState({
            setStartDate: false,
            setEndDate: false,
            jobComplete: false,
            sessionTypeVisible: false
        });

        console.log("State :", this.state);
    };

    postNewJob(type) {

        if ((this.state.edit == true && this.state.post == 'copy') || this.state.edit == false) {
            this.setServices.postService(POST_JOB_PART1 + this.user_id + POST_JOB_PART2, ServiceParams.getNewJobParams(this.state))
                .then(async (responseData) => {

                    // this.props.navigation.state.params.pageRefresh();
                    console.log("Response Data :", responseData);

                    this.setState({ 'spinner': false });
                    if (responseData.error == 0) {
                        // if(this.state.post != 'copy') {
                        //     await RNCalendarEvents.authorizationStatus()
                        //     .then(async (status) => {
                        //         console.log(status);
                        //         if (status == 'authorized') {
                        //             await RNCalendarEvents.saveEvent('Job added to MP: ' + this.state.selectedPractice, {
                        //                 startDate: this.state.startDate,
                        //                 endDate: this.state.endDate,
                        //                 notes: 'Practice is, ' + this.state.selectedPractice + '. mileage (return journey) is' + this.state.distance,
                        //                 alarms: [{
                        //                     date: this.state.startDate
                        //                 }]
                        //             }).then(status => {
                        //                 console.log('status:', status);
                        //                 this.newJobDone(type);
                        //             })
                        //             .catch(error => {
                        //                 console.log('error:', error);
                        //                 this.newJobDone(type);
                        //             });
                        //         } else {
                        //             this.newJobDone(type);
                        //         }
                        //     })
                        //     .catch(error => {
                        //         this.newJobDone(type);
                        //     })
                        // } else {
                            this.newJobDone(type);
                        // }
                        

                        // this.setState({ invoiceComplete : true });
                    } else {
                        DropDownHolder.dropDown.alertWithType('error', 'Error', responseData.info);
                    }
                    // this.newJobDone(type);
                }, (error) => {

                    this.setState({ 'spinner': false });
                    console.log("error Data :", error);
                })
        } else {

            this.setServices.putService("job/" + this.state.edit_id, ServiceParams.getNewJobParams(this.state))
                .then((responseData) => {
                    console.log("Response Data Edit:", responseData);

                    this.setState({
                        'spinner': false
                    });
                    if (responseData.error == 0) {
                        // this.setState({ invoiceComplete : true });
                        // this.props.navigation.state.params.pageRefresh();
                        this.newJobDone(type);
                    }

                    // this.props.navigation.state.params.pageRefresh();
                    // this.newJobDone(type);
                }, (error) => {

                    this.setState({ 'spinner': false });
                    console.log("error Data :", error);
                })
        }
    }

    newJobDone(type) {
        if (type == 'blank') {
            DropDownHolder.dropDown.alertWithType('success', 'Success', "Job saved successfully");
            if (this.state.edit == true) {
                if (this.state.edit_id != null) {
                    this.props.navigation.state.params.callBack(true, this.state.edit_id);
                }
                this.props.navigation.goBack();
            } else {
                this.setState(initialState);
            }
            // this.state.edit == true ? this.setState({ jobComplete: true }) : this.setState(initialState);
        } else {
            DropDownHolder.dropDown.alertWithType('success', 'Success', "Job saved successfully");
            if (this.state.edit_id != null) {
                this.props.navigation.state.params.callBack(true, this.state.edit_id);
            }
            if (this.state.edit != true && this.state.post != 'copy') {
                // this.props.navigation.state.params.pageRefresh(this);
                this.props.navigation.dispatch(this.props.navigation.navigate('MainNavigation', { backFrom: 'add' }, NavigationActions.navigate({ routeName: 'Screen2' })))
            } else {
                this.props.navigation.goBack();
            }

        }
    }

    markingMultipleDays = async(day) => {
        let date = day.dateString;
        let currentSelectedDates = this.state._selectedDates;

        if( Object.keys(currentSelectedDates).length  != 0 && currentSelectedDates.hasOwnProperty(date)) {
            await delete currentSelectedDates[date];
        } else {
            currentSelectedDates[date] = {selected: true, marked: true, selectedColor: '#3894e4'};
        }

        if( Object.keys(currentSelectedDates).length  != 0) {
            let datesKeys = Object.keys(currentSelectedDates);
            await this.setState({jobDate: datesKeys.toString()});
            await this.setState({displayJobDate: datesKeys.toString()});
        } else {
            await this.setState({displayJobDate: datesKeys.toString()});
        }
        
        await this.setState({_selectedDates: currentSelectedDates});
    }

    handleType  = async (sortOption, value) => {
        this.setState({sortOption: sortOption });
        this.setState({sessionType: value});
        this.setState({ sessionTypeVisible: false });
    }

    textTruncate = (str, length, ending) => {
        if (length == null) {
            length = 100;
        }
        if (ending == null) {
            ending = ' ...';
        }
        if (str.length > length) {
            return str.substring(0, length - ending.length) + ending;
        } else {
            return str;
        }
    }

    render() {
        
        const { goBack } = this.props.navigation;
        return (
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : ""}
            style={{ flex: 1, }}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
                <ImageBackground source={require('./images/header.png')} style={{ height: (Dimensions.get('window').height) * 0.18, width: Dimensions.get('window').width }} >
                    <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
                    <View style={{ paddingHorizontal: 20, marginTop: 50, height: (Dimensions.get('window').height) * 0.1}}>
                        <View style={{width: '90%',justifyContent:'flex-start',flexDirection:'row'}}>
                            <TouchableOpacity onPress={() => { goBack(); }} style={{ flexDirection: 'row',}}>
                                <View style={{justifyContent: 'center', paddingRight: 10}}>
                                    <Image source={require('./images/whiteBackIcon.png')} style={{ width: 16, height:16 }}></Image>  
                                </View>
                                <View  style={{justifyContent: 'center', }}>
                                    <Text style={{color: '#fff',fontFamily: Fonts.MontserratBold,fontSize: 18,}}>{this.state.PageTittle }</Text>                                    
                                </View> 
                            </TouchableOpacity>                            
                        </View>
                    </View>
                </ImageBackground>
                <ScrollView style={{ flex: 1, padding: 10 }}>
                    <View style={{ flex: 1, paddingLeft: 10, paddingRight: 10, paddingTop: 20, height: '100%' }}>

                        <View style={{ marginTop: 20}}> 
                            { (this.state.selectedPractice != null && this.state.selectedPractice != '') &&
                                <Text style={newinvoicestyles.labelText}>Healthcare organisations</Text>
                            } 
                            <View style = {{  borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                <View style={{ flexDirection: 'row', textAlign: 'center', alignContent: 'flex-start', justifyContent:'flex-end', marginBottom: 10 , }}>
                                    <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={() => {
                                        this.setState({ 'spinner': true });
                                        this.getPracticeData();
                                    }}>
                                        <View style={{width:'80%',  alignContent:'flex-start',}}>
                                            { this.state.selectedPractice ?
                                                <Text style={{ flex: 8,height:30, marginBottom: 5, paddingTop: 7, color: '#414253', fontSize: 15, fontFamily: Fonts.MontserratMedium }}>{this.state.selectedPractice}</Text>
                                                :   
                                                <Text style={{ flex: 8,height:30, marginBottom: 5, paddingTop: 7, color: '#AAB2BD', fontSize: 15, fontFamily: Fonts.MontserratMedium }}>Healthcare organisations</Text>
                                            }
                                        </View>
                                        <View  style={{width:'20%', alignContent: 'flex-end', alignItems: 'flex-end', marginRight: 20, }}>
                                            <Image source = { require('./images/arrow_down.png') } style = {{ width: 14, height: 8, paddingTop: 7, marginTop: 10 }} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {/* <View style={[formStyles.hrLine, this.state.errors.title ? formStyles.error : formStyles.input]} /> */}
                            </View> 
                        </View>  
            
                        <View style={{ marginTop: 20}}> 
                            { (this.state.displayJobDate != null && this.state.displayJobDate != '') &&
                                <Text style={newinvoicestyles.labelText}>Date</Text>
                            } 
                            <View style = {{borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                <TouchableOpacity style={{ flex: 1, flexDirection: 'row' , marginBottom: 10 ,height:30,}} onPress={() => {
                                    var isValidForm = validate({ selectedPractice: this.state.selectedPractice }, constraints, { format: "detailed" });
                                    if (isValidForm != undefined) {
                                        DropDownHolder.dropDown.alertWithType('error', 'Error', (isValidForm[0]).options.message);
                                    } else {
                                        // 
                                        if(this.state.post == 'copy') {
                                            // this.setState({ setMultiJobDate: true });
                                        } else {
                                            this.setState({ setJobDate: true });
                                        }
                                        
                                    }
                                }}>                                    
                                    <View style={{width:'80%',  alignContent:'flex-start',}}>
                                        <Text style={(this.state.displayJobDate != null && this.state.displayJobDate != '') ?  newjobstyles.calendarSelectedText : newjobstyles.calendarText }>{(this.state.displayJobDate != null && this.state.displayJobDate != '') ? this.state.displayJobDate.toString() : 'Select Date'}
                                        </Text>
                                    </View>
                                    <View  style={{width:'20%', alignContent: 'flex-end', alignItems: 'flex-end', marginRight: 20, }}>
                                        <Image style={{ width: 20, height: 18, }} source={require('./images/calendar.png')}></Image>
                                    </View> 
                                </TouchableOpacity>
                            </View>
                        </View> 

                        <View style = {{ flexDirection: 'row', paddingTop: 10 }}>
                            <View style = {{ alignContent: 'flex-start', width: '45%' }}>
                               
                                <View style={{ marginTop: 20}}> 
                                    { (this.state.displayStartDate != null && this.state.displayStartDate != '') &&
                                        <Text style={newinvoicestyles.labelText}>Start time</Text>
                                    } 
                                    <View style = {{ borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                        <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={() => {
                                            var isValidForm = validate({ selectedPractice: this.state.selectedPractice }, constraints, { format: "detailed" });
                                            if (isValidForm != undefined) {
                                                DropDownHolder.dropDown.alertWithType('error', 'Error', (isValidForm[0]).options.message);
                                            } else {
                                                this.setState({ setStartDate: true });
                                            }
                                        }}>                                            
                                            <View style={{ flex: 1, flexDirection: 'row', alignContent: 'flex-start', justifyContent:'flex-end', marginBottom: 10 , }}>
                                                <Text style={{ flex: 1,height:30, justifyContent: 'center', marginBottom: 5, paddingTop: 7, color: ((this.state.displayStartDate != null && this.state.displayStartDate != '') ? '#414253' : '#AAB2BD'), fontFamily: Fonts.MontserratMedium, fontSize: 15 }}>{((this.state.displayStartDate != null && this.state.displayStartDate != '') ? this.state.displayStartDate: 'Start time')}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View> 
                                </View>
                            </View>
                            <View style = {{ alignContent: 'center', width: '10%'}}>
                                <Text style={newinvoicestyles.labelText}> </Text>
                                <View style={{ flexDirection: 'row', alignContent: 'flex-start', justifyContent:'flex-end', marginBottom: 10 , }}>
                                    <Text style = {{ flex: 1, justifyContent: 'center', marginBottom: 5, paddingTop: 7, fontSize: 13, fontFamily: Fonts.MontserratMedium, color: '#aab2bd', textAlign: 'center' }}>:</Text>
                                </View>
                            </View>
                            <View style = {{ alignContent: 'flex-end', width: '45%' }}>
           
                                <View style={{ marginTop: 20}}> 
                                    { (this.state.displayEndDate != null && this.state.displayEndDate != '') &&
                                        <Text style={newinvoicestyles.labelText}>End time</Text>
                                    } 
                                    <View style = {{ borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                    <TouchableOpacity style={{ flex: 1, flexDirection: 'row', }} onPress={() => {
                                        var isValidForm = validate({ selectedPractice: this.state.selectedPractice }, constraints, { format: "detailed" });
                                        if (isValidForm != undefined) {
                                            DropDownHolder.dropDown.alertWithType('error', 'Error', (isValidForm[0]).options.message);
                                        } else {
                                            this.setState({ setEndDate: true });
                                        }
                                    }}>
                                    
                                        <View style={{ flex: 1, flexDirection: 'row', alignContent: 'flex-start', justifyContent:'flex-end', marginBottom: 10 , }}>
                                            <Text style={{ flex: 1,height:30, justifyContent: 'center', marginBottom: 5, paddingTop: 7, color: ((this.state.displayEndDate != null && this.state.displayEndDate != '') ? '#414253' : '#AAB2BD'), fontFamily: Fonts.MontserratMedium, fontSize: 15 }}>{((this.state.displayEndDate != null && this.state.displayEndDate != '') ? this.state.displayEndDate: 'End time')}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    </View> 
                                </View>
                            </View>
                        </View>

                        <View style={{ marginTop: 20}}> 
                            <Text style={[newinvoicestyles.labelText, {paddingTop: 10}]}>Rate type</Text>
                            <View style={{ flexDirection: 'row', textAlign: 'center', marginBottom: 30, marginTop: 10, width: '75%' }}>
                                <TouchableOpacity onPress = { () => { this.rateTypeSelect('hour') }} style = {{ width: 20, height: 20, borderRadius: 20/2, borderColor: '#ccd1d9', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    { this.state.isHourActive ?
                                        <View style = {{ width: 12, height: 12, borderRadius: 12/2, backgroundColor: '#00d3a1' }}></View>
                                        : <View></View>
                                    }
                                </TouchableOpacity>
                                <Text style={{ flex: 1, color: '#414253', fontFamily: Fonts.MontserratBold, fontSize: 15, marginLeft: 15 }}>Hourly</Text>
                                <TouchableOpacity onPress = { () => { this.rateTypeSelect('session') }} style = {{ width: 20, height: 20, borderRadius: 20/2, borderColor: '#ccd1d9', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    { this.state.isSessionActive ?
                                        <View style = {{ width: 12, height: 12, borderRadius: 12/2, backgroundColor: '#00d3a1' }}></View>
                                        : <View></View>
                                    }
                                </TouchableOpacity>
                                <Text style={{ flex: 1, color: '#414253', fontFamily: Fonts.MontserratBold, fontSize: 15, marginLeft: 15 }}>Session</Text>

                            </View>
                        </View>

                        <View style={{ marginTop: 10}}> 
                            <View style={{width:'100%', flexDirection: 'row', backgroundColor: '#FFD7D7', borderRadius: 10,}}>
                                <View style={{justifyContent: 'center', alignItems: 'center',padding: 20}}>
                                    <TouchableOpacity style = {{ width: 20, height: 20, borderRadius: 2, borderColor: '#CCD1D9', borderWidth: 1, justifyContent: 'center', alignItems: 'center', }}>
                                        <View style = {{ width: 18, height: 18, borderRadius: 2, backgroundColor: '#ffffff' }}></View>
                                    </TouchableOpacity>
                                </View>        
                                
                                <Text style={{ color: '#EB5757', fontFamily: Fonts.MontserratBold, fontSize: 15, paddingVertical: 20}}>This a COVID-19 session</Text>
                            </View>
                        </View>

                        <View style={{ marginTop: 20}}>                            
                            <View style = {{  borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                <View style={{ flexDirection: 'row', textAlign: 'center', alignContent: 'flex-start', justifyContent:'flex-end', marginBottom: 10 , }}>
                                    <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={() => {
                                        this.setState({sessionTypeVisible: true});
                                    }}>
                                        <View style={{width:'80%',  alignContent:'flex-start',}}>                        
                                            <Text style={{ flex: 8,height:30, marginBottom: 5, paddingTop: 7, color: '#414253', fontSize: 15, fontFamily: Fonts.MontserratBold }}>
                                            {((this.state.sessionType != null && this.state.sessionType != '') ? this.textTruncate(this.state.sessionType, 30) : 'Type of session')}</Text>                                    
                                        </View>
                                        <View  style={{width:'20%', alignContent: 'flex-end', alignItems: 'flex-end', marginRight: 20, }}>
                                            <Image source = { require('./images/arrow_down.png') } style = {{ width: 14, height: 8, paddingTop: 7, marginTop: 10 }} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {/* <View style={[formStyles.hrLine, this.state.errors.title ? formStyles.error : formStyles.input]} /> */}
                            </View> 
                        </View>

                        <View style={{ marginTop: 20}}> 
                            <Text style={newinvoicestyles.labelText}>Rate</Text>
                            <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                <View style = {{ width: '4%',   }}><Text style={{ color: "#414253", fontFamily: Fonts.MontserratBold, fontSize: 15, paddingTop:4, }}>£</Text></View>
                                <View style = {{ width: '96%',  alignContent: 'flex-start', justifyContent:'flex-end', marginBottom: 10 , }}>
                                    <TextInputMask
                                        type={'money'}
                                        options={{
                                        precision: 2,
                                        separator: '.',
                                        delimiter: ',',
                                        unit: '',
                                        suffixUnit: ''
                                        }}
                                        value={this.state.rate}
                                        onChangeText={text => {
                                            this.changeRate(text);
                                        }}
                                        style={{ color: "#414253",height:30,justifyContent:'center',paddingBottom:1, fontFamily: Fonts.MontserratBold, fontSize: 15, paddingTop:0,  paddingLeft: 0,}}
                                    />
                                </View>
                            </View> 
                        </View>

                        <View style={{ flexDirection: 'row', textAlign: 'center', paddingTop: 20, paddingBottom: 30, }}>
                            <Text style={{ color: '#1f89e4', fontSize: 18, fontFamily: Fonts.MontserratBold}}>Total rate</Text>
                            <Text style={{ flex: 1, color: '#1f89e4', fontSize: 18, textAlign: 'right',paddingBottom: 10, marginRight: 10, fontFamily: Fonts.MontserratBold }}> £ {((this.state.total != NaN && this.state.total != "NaN" && this.state.total != null && this.state.total != "null" && this.state.total != "") ? parseFloat(this.state.total).toFixed(2) : "0.00")} </Text>
                        </View>

                        <View style={{ marginTop: 20}}> 
                            { (this.state.distance != null && this.state.distance != '') &&
                                <Text style={newinvoicestyles.labelText}>Mileage (return journey)</Text>
                            } 
                            <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                <View style = {{ width: '100%', alignContent: 'flex-start' , justifyContent:'center', marginBottom: 10 ,  }}>
                                <TextInput
                                    id='distance'
                                    placeholder={'Mileage (return journey)'}
                                    placeholderTextColor="#AAB2BD"
                                    keyboardType={'numeric'}
                                    returnKeyType="next"
                                    autoCorrect={false}
                                    style={{color: "#414253",height:30,justifyContent:'center',paddingBottom:1, fontFamily: Fonts.MontserratMedium, fontSize: 15, paddingTop:0,  paddingLeft: 0,}}
                                    onChangeText={(text) => { this.setState({ distance: text }); }}
                                    // editable={false}
                                    value={this.state.distance}
                                />
                                </View>
                            </View> 
                        </View>
                        {/* <View style={[formStyles.hrLine, this.state.errors.title ? formStyles.error : formStyles.input]} /> */}

                        <View style={{ flexDirection: 'row', marginTop: 25, paddingBottom: 0 }}>
                            {
                                this.state.post != 'copy' &&
                                <View style={[loginformStyles.signUpButtonArea, { flex: 1, paddingTop: 0 }]}>
                                    <TouchableOpacity style={{ width: (Dimensions.get('window').width - 40), height: 55, backgroundColor: '#ffffff', alignItems: 'center', alignSelf: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#00d3a1', borderRadius: 10, width: '90%', alignSelf: 'flex-start' }} onPress={() => {

                                        let isValidForm = validate({ selectedPractice: this.state.selectedPractice }, constraints, { format: "detailed" });
                                        if (isValidForm != undefined) {
                                            DropDownHolder.dropDown.alertWithType('error', 'Error', (isValidForm[0]).options.message);
                                        } else {
                                            let isValidForm = validate({ startTime: this.state.displayStartDate, endTime: this.state.displayEndDate, rateType: this.state.rateType, rate: (this.state.rate == "0.00" ? "" : (this.state.rate == NaN ? "" : (this.state.rate == 0 ? "" : (this.state.rate == "0" ? "" : this.state.rate)))) }, dateTimeValidate, { format: "detailed" });
                                            if (isValidForm != undefined) {
                                                DropDownHolder.dropDown.alertWithType('error', 'Error', (isValidForm[0]).options.message);
                                            } else {
                                                this.setState({ 'spinner': true });
                                                this.postNewJob('blank');
                                                console.log("Data :", ServiceParams.getNewJobParams(this.state));
                                            }
                                        }
                                    }}>
                                        <Text style={{ color: '#00d3a1', fontFamily: Fonts.MontserratBold, fontSize: 18 }}>{this.state.ButtonTitle}</Text>
                                    </TouchableOpacity>
                                </View>
                            }

                            {
                                this.state.edit == true && this.state.post != 'copy' ? null :
                                    <View style={[loginformStyles.loginButtonArea, { flex: 1, }]}>
                                        <TouchableOpacity style={{ width: (Dimensions.get('window').width - 40), height: 55, backgroundColor: '#00d3a1', alignItems: 'center', alignSelf: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#00d3a1', borderRadius: 10, borderWidth: 0, width: '100%', alignSelf: 'flex-end', }} onPress={() => {
                                            let isValidForm = validate({ selectedPractice: this.state.selectedPractice }, constraints, { format: "detailed" });
                                            if (isValidForm != undefined) {
                                                DropDownHolder.dropDown.alertWithType('error', 'Error', (isValidForm[0]).options.message);
                                            } else {
                                                let isValidForm = validate({ startTime: this.state.displayStartDate, endTime: this.state.displayEndDate, rateType: this.state.rateType, rate: (this.state.rate == "0.00" ? "" : (this.state.rate == NaN ? "" : (this.state.rate == 0 ? "" : (this.state.rate == "0" ? "" : this.state.rate)))) }, dateTimeValidate, { format: "detailed" });
                                                if (isValidForm != undefined) {
                                                    DropDownHolder.dropDown.alertWithType('error', 'Error', (isValidForm[0]).options.message);
                                                } else {
                                                    this.setState({ 'spinner': true });
                                                    this.postNewJob('next');
                                                    console.log("Data :", ServiceParams.getNewJobParams(this.state));
                                                }
                                            }
                                        }}>
                                            <Text style={{ color: '#ffffff', fontFamily: Fonts.MontserratBold, fontSize: (this.state.edit == true ? 18 : 18 ) }}>SAVE</Text>
                                        </TouchableOpacity>
                                    </View>
                            }
                        </View>


                        <Spinner
                            visible={this.state.spinner}
                            textContent={'Loading...'}
                            textStyle={styles.spinnerTextStyle}
                        />

                        {/* Start - Start Day Overlay */}
                        <Overlay visible={this.state.setStartDate} onClose={this.onClose} closeOnTouchOutside containerStyle={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
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
                                    this.setState({ displayStartDate: moment(this.state.startDate).format("HH:mm") });
                                    this.setState({ displayEndDate: null })
                                    this.onClose();
                                }}>
                                    <Text style={[loginformStyles.loginButton, { fontSize: 15, fontFamily: Fonts.GilroyLight }]}>OK</Text>
                                </TouchableOpacity>

                                <DatePicker
                                    style={{ marginTop: 10, }}
                                    mode={'time'}
                                    date={this.state.startDate}
                                    onDateChange={date => this.setState({ startDate: date })}
                                />

                            </View>
                        </Overlay>
                        {/* End - Start Day Overlay */}


                        {/* Start - End Day Overlay */}
                        <Overlay visible={this.state.setEndDate} onClose={this.onClose} closeOnTouchOutside containerStyle={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
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
                                    if (this.state.displayStartDate == null) {
                                        DropDownHolder.dropDown.alertWithType('error', 'Error', "Please select the start date/time first");
                                    } else if (moment(this.state.endDate).diff(moment(this.state.startDate), 'hours', true) < 0) {
                                        DropDownHolder.dropDown.alertWithType('error', 'Error', "End date/time are invalid");
                                    } else if (moment(this.state.endDate).isSame(moment(this.state.startDate), 'minutes') == true) {
                                        DropDownHolder.dropDown.alertWithType('error', 'Error', "End time must be after the start time");
                                    } else {
                                        this.setState({ displayEndDate: moment(this.state.endDate).format("HH:mm") });
                                        if (this.state.hourBtn == true) {
                                            this.setState({ total: parseFloat(Math.round(moment(this.state.endDate).diff(moment(this.state.startDate), 'hours', true)) * this.state.rate).toFixed(2) });
                                        } else {
                                            this.setState({ total: parseFloat(this.state.rate).toFixed(2) });
                                        }
                                        this.setState({ buttonDisable: false });
                                        this.onClose();
                                    }

                                }}>
                                    <Text style={[loginformStyles.loginButton, { fontSize: 15, fontFamily: Fonts.GilroyLight }]}>OK</Text>
                                </TouchableOpacity>

                                <DatePicker
                                    style={{ marginTop: 10, }}
                                    mode={'time'}
                                    date={this.state.endDate}
                                    minimumDate={this.state.startDate}
                                    onDateChange={date => this.setState({ endDate: date })}
                                />

                            </View>
                        </Overlay>
                        {/* End - Start End Overlay */}

                        {/* Start - Add Job Complete Overlay */}
                        <Overlay visible={this.state.jobComplete} onClose={this.onClose} containerStyle={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
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
                                <Text style={{ color: '#142828', fontFamily: 'Rubik', textAlign: 'center', fontSize: 15, marginTop: 20, }}>Congratulations !</Text>
                                <Text style={{ color: '#aeb7af', fontSize: 13,  fontFamily: 'Rubik', textAlign: 'center', lineHeight: 20, marginTop: 15, marginLeft: 20, marginRight: 20, }}></Text>

                                <View style={[loginformStyles.loginButtonArea, { flex: 1, }]}>
                                    <TouchableOpacity elevation={5} style={[loginformStyles.loginTouchable, { borderWidth: 0, width: 100, height: 45, marginTop: 20 }]} onPress={() => {
                                        if (this.state.edit_id != null) {
                                            this.props.navigation.state.params.callBack(true, this.state.edit_id);
                                        }
                                        this.props.navigation.goBack();
                                    }}>
                                        <Text style={[loginformStyles.loginButton, {  }]}>OK</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Overlay>
                        {/* End - Add Job Complete Overlay */}
                        
                        {/* Start - select date Overlay */}
                        <Overlay visible={this.state.setJobDate} 
                            onClose={() => {this.setState({setJobDate: false})}} 
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
                                    this.setState({setJobDate: false});
                                }}>
                                    <Text style={[ loginformStyles.loginButton, { fontSize: 15, fontFamily: Fonts.MontserratMedium }]}>OK</Text>
                                </TouchableOpacity>

                                <DatePicker
                                    style={{ marginTop: 10, }}
                                    mode={'date'}
                                    date={this.state.jobDate}  
                                    onDateChange={ (date) => { 
                                        this.setState({ jobDate: date });
                                        // this.setState({displayJobDate: new Date(moment(date, 'YYYY-MM-DD').format('DD MMM YYYY'))});
                                        this.setState({displayJobDate:moment(date, 'YYYY-MM-DD').format('DD MMM YY')});
                                        }
                                    }                                
                                />

                            </View>
                        </Overlay>
                        {/* End - select date Overlay */}


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
                                paddingBottom: 20
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
                                    <Text style={{ color: '#ffffff', fontFamily: Fonts.MontserratBold, fontSize: 16, overflow: 'hidden', alignSelf: 'center',}} >Select date to copy and apply the session</Text>
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

                                        }}>
                                        <Text style={{ color: '#ffffff', fontFamily: Fonts.MontserratBold, fontSize: 20, overflow: 'hidden', textAlign: 'center', }}>OK</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Overlay>
                        {/* End - select date Overlay */}

                        {this.state.sessionTypeVisible == true && 
                            <CustomDropDown 
                            title={'Type of session'} 
                            fieldName= 'sessionType'  
                            sortOption={this.state.sessionTypeOption} 
                            visible={this.state.sessionTypeVisible} 
                            onSelectItem={this.handleType}                             
                            onClose={this.onClose.bind(this)}
                            selectedValue= {this.state.sessionType} /> 
                        }
                    </View>
                </ScrollView>
            </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        );
    }
}

export default NewJob;
