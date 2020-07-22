import React, { Component } from 'react';
import { Text, View, NativeModules, TouchableOpacity, StatusBar, Platform, ScrollView, 
    AsyncStorage, Dimensions, Image, ImageBackground, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'native-base';
import { Fonts } from '../../../../config/font';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import { filterJobstyles } from '../filter/styles';
import AppliedJobs from '../applied/applied';
import Spinner from 'react-native-loading-spinner-overlay';
import { styles } from '../../../login/styles';
import { Common } from '../../../../services/common';
import { Services } from "../../../../services/services";
import { CALENDAR } from "../../../../config/shared";
import { ServiceParams } from "../../../../services/serviceParams";
import EmptyState from '../../../../components/emptyState/emptyState';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 10 : StatusBarManager.HEIGHT;
const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[{ backgroundColor, height: STATUSBAR_HEIGHT }]}>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
);

export class CalendarSearch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user_id: null,
            JobData: [],
            moreOverLay: false,
            // confirmationDisplay: false,
            // statusTitle: 'Applied',
            // rangeValue: 5,
            selectedButton: null,
            displayDate: moment().format('DD MMM YYYY'),
            // startDateOverly: false,
            selectedDate: moment(new Date()).format('YYYY-MM-DD'),
            // postCode: null,
            sendDate:  moment(new Date()).format('DD/MM/YYYY'),
            spinner: false,
            imageWidth: 0,
            imageHeight: 0,
        };
        this.setService = new Services();
        this.CommonService = new Common();
    }

    async componentDidMount() {

        const { navigation } = this.props;
        this.setState({
            JobTypeData: navigation.getParam('SendJobType')
        })
        await AsyncStorage.multiGet(["user_id"
        ]).then(response => {
            console.log("Response :", response);
            this.setState({ user_id: response[0][1] });
        })
        let sourceWidth = 375;
        let sourceHeight = 790;
        let width = Dimensions.get('window').width;
        let ratio = width / sourceWidth;
          await this.setState({
                  imageWidth: sourceWidth * ratio,
                  imageHeight: sourceHeight * ratio
        });
        await this.filterResponse();
    }

    filterResponse = async () => {
        this.JobData = [];
        this.data = [];
        this.setState({
            MyJobData: false,
            JobData: []
        });

        // let SearchData = await this.CommonService.JobSearch(this.state.user_id, this.state, this.state.JobTypeData, 'all');
        await this.setService.postService(CALENDAR + this.state.user_id , ServiceParams.setCalendarParams(this.state))
            .then((responseData) => {
                if (responseData.info != undefined) {
                    if (responseData.info.job_booked instanceof Array) {
                        responseData.info.job_booked.forEach(element => {
                            element['start_time'] = moment(element['start_time'], "hh:mm A").format("HH:mm");
                            element['end_time'] = moment(element['end_time'], "hh:mm A").format("HH:mm");
                            element['show_date'] = moment(element['date'], "DD/MM/YYYY").format("DD");
                            element['show_month'] = moment(element['date'], "DD/MM/YYYY").format("MMM").toUpperCase();
                            this.JobData.push(element);
                        });
                    }

                    if (responseData.info.own_job instanceof Array) {
                        responseData.info.own_job.forEach(element => {
                            element['start_time'] = moment(element['start_time'], "hh:mm A").format("HH:mm");
                            element['end_time'] = moment(element['end_time'], "hh:mm A").format("HH:mm");
                            element['show_date'] = moment(element['date'], "DD/MM/YYYY").format("DD");
                            element['show_month'] = moment(element['date'], "DD/MM/YYYY").format("MMM").toUpperCase();
                            element['town'] = element['practice_city'];
                            element['post_code'] = element['practice_post_code'];
                            element['post_hour_rate'] = element['hourly_rate'];
                            element['post_session_rate'] = element['session_rate'];
                            element['distance'] = (element['distance'] == undefined ? '0.00' : element['distance']);
                            this.JobData.push(element);
                        });
                    }
                }

                if(this.JobData.length > 0) {
                    this.setState({
                        MyJobData: true,
                        JobData: this.JobData
                    });
                }

        }, (error) => {
            console.log(error);
        })
        this.setState({ 'spinner': false });
    }

    _renderArrow = (direction) => {
        if(direction === 'left') {
            return <MaterialIcons name = 'chevron-left' size = { 30 } color = { '#414253' } />
        } else {
            return <MaterialIcons name = 'chevron-right' size = { 30 } color = { '#414253' } />
        }
    }

    render() {

        const { goBack } = this.props.navigation;
        const { navigate } = this.props.navigation;
        const win = Dimensions.get('window');
        const emptyState = <Image resizeMode='contain' style={{width: 100, height: 100, }} source={require('./images/calendar_empty_state.png')} />
        LocaleConfig.locales['en'] = {
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            dayNamesShort: ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']
        };
        LocaleConfig.defaultLocale = 'en';
        const calendar = <Calendar
                            current={this.state.selectedDate}
                            style={{ borderRadius: 10, padding: 15, paddingRight: 15, paddingLeft: 15, paddingBottom: 10 }}
                            firstDay={1}
                            renderArrow={this._renderArrow}
                            onDayPress={(day) => {
                                console.log("Date :", day);
                                this.setState({ 'spinner': true });
                                this.setState({
                                    selectedDate: day.dateString,
                                    displayDate: moment(day.dateString, "YYYY-MM-DD").format('DD/MM/YYYY'),
                                    sendDate: moment(day.dateString, "YYYY-MM-DD").format('DD/MM/YYYY')
                                });
                                let that = this;
                                setTimeout(() => {
                                    that.filterResponse();
                                }, 250);
                            }}
                            markedDates={{ [this.state.selectedDate]: { selected: true, disableTouchEvent: true, selectedColor: '#00d3a1' } }}
                            theme={{
                                textSectionTitleColor: '#000000',
                                todayTextColor: '#00d3a1',
                                textDayFontSize: 13,
                                textDayFontFamily: Fonts.MontserratMedium,
                                textDayHeaderFontSize: 13,
                                textDayHeaderFontFamily: Fonts.MontserratMedium,
                                dayHeaderTextColor: '#414253',
                                'stylesheet.calendar.header': {
                                    week: {
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginLeft: 10,
                                        marginRight: 10,
                                        paddingTop: 15,
                                        borderTopWidth: 1,         
                                        borderTopColor: '#e6e9ed'
                                    },
                                    arrow: {
                                        marginBottom: 15
                                    },
                                    monthText: {
                                        marginBottom: 15,
                                        color: '#414253',
                                        fontFamily: Fonts.MontserratMedium,
                                        fontSize: 13
                                    }
                                }
                            }}
                        />
        const calendar_header = <View style={{ flexDirection: 'row', height: 40 , marginTop: 45,paddingHorizontal: 20}}>
                                    {/* <View style={{ flex: 1, justifyContent: 'center', }}>
                                        <TouchableOpacity onPress={() => { goBack() }} style={{ marginLeft: 15, justifyContent: 'center', alignItems: 'flex-start', alignContent: 'flex-start', alignSelf: 'flex-start', }} >

                                             <Image source={require('./images/backIcon.png')} style={{ width: 16, height:16 }}></Image>  
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center', }}>
                                        <Text style={{ textAlign: 'center', color: '#414253', fontSize: 18, fontFamily: Fonts.MontserratBold }}>Calendar</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center' }}></View> */}
                                    <View style={{width: '90%',justifyContent:'flex-start',flexDirection:'row'}}>
                                        <TouchableOpacity onPress={() => { goBack(); }} style={{ flexDirection: 'row',}}>
                                            <View style={{justifyContent: 'center', paddingRight: 10}}>
                                                <Image source={require('./images/backIcon.png')} style={{ width: 16, height:16 }}></Image>  
                                            </View>
                                            <View  style={{justifyContent: 'center', }}>
                                                <Text style={{color: '#000000',fontFamily: Fonts.MontserratBold,fontSize: 18,}}>Calendar</Text>                                    
                                            </View> 
                                        </TouchableOpacity>                            
                                    </View> 
                                </View>

        const displayHead = <LinearGradient colors={['#f5fbfb', '#f5fbfb']} style={{ height: 'auto' }}>
            { calendar_header }
            <View style={{ position: 'absolute', backgroundColor: '#ffffff', height: 60, width: '100%', bottom: 0 }}></View>
            <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20, borderRadius: 10, backgroundColor: 'blue', elevation: 5 }}>
                { calendar }
            </View>
        </LinearGradient>

        const emptyImagePage = <ImageBackground source = { require('./images/empty_page.png')} style={{ width:this.state.imageWidth, height: Dimensions.get('window').height + 40 }}>
            { calendar_header }
            <View style={{ position: 'absolute', backgroundColor: '#ffffff', height: 60, width: '100%', bottom: 0 }}></View>
            <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20, borderRadius: 10, backgroundColor: 'blue', elevation: 5 }}>
                { calendar }
            </View>
        </ImageBackground>

        const displayBody = <ScrollView style={{ marginTop: 10, marginBottom: 5, flex: 1, height: '100%', flexDirection: 'column' }}>
            <View style={{ flex: 1,}}>
            {/* <Image resizeMode='contain' style={{width: win.width, height: '100%', }} source={require('./images/calendar_empty_state.png')} /> */}
                {
                    this.state.MyJobData == true ? <AppliedJobs jobType={'calendar'} data={this.state.JobData} navigationData={this.props.navigation} userID={this.state.user_id} /> : emptyState
                }
            </View>
        </ScrollView>


        return (
            <View style={{ flex: 1, }}>
                {
                    Platform.OS === 'ios' ? <MyStatusBar backgroundColor="#f5fbfb" barStyle="dark-content" /> : <StatusBar backgroundColor="#f5fbfb" barStyle="dark-content" />
                }
                { this.state.MyJobData == true ?
                    displayHead : emptyImagePage
                }

                {
                    displayBody
                }


                <Spinner
                    visible={this.state.spinner}
                    textContent={'Loading...'}
                    textStyle={styles.spinnerTextStyle}
                />
            </View>
        )
    }
}

export default CalendarSearch;
