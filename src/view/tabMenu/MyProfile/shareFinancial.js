import React, { Component } from 'react'
import { View, Text, Image, ScrollView, 
    TouchableOpacity, AsyncStorage, TextInput, Keyboard,
     KeyboardAvoidingView, TouchableWithoutFeedback, NativeModules, Platform, 
     ImageBackground, StatusBar, Dimensions, StyleSheet } from 'react-native';
import { Icon } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import Overlay from 'react-native-modal-overlay';
import { Calendar } from 'react-native-calendars';
import validate from 'validate.js';

import { profileStyles } from './styles';
import CustomHeader from '../../../components/customHeader/header';
import { FINANCIAL_SHARE_PDF, FINANCIAL_SHARE_CSV } from '../../../config/shared';
import { ServiceParams } from '../../../services/serviceParams';
import DropDownHolder from "../../../components/dropDown/dropDownHolder";
import { Services } from '../../../services/services';
import { Fonts } from '../../../config/font';

const constraints = {
    userEmail: {
        presence: {
            allowEmpty: false,
            message: "cannot be blank."
        },
        email: {
            message: 'Please enter a valid email address'
        },
        exclusion: {
            within: ["userEmail"],
            message: "^'%{value}' is not allowed"
        }
    }
}

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBarManager.HEIGHT;
const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[styles.statusBar, { backgroundColor }]}>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
);

export default class ShareFinancial extends Component {
    constructor(props){
        super(props)
        this.state = {
            userId: 0,
            spinner: false,
            selectedStartDate: this.props.navigation.state.params.selectedDate,
            type: this.props.navigation.state.params.type,
            selectedEndDate: moment().format('YYYY-MM-DD'),
            startDateOverly: false,
            endDateOverly: false,
            userEmail: null
        }

        this.setServices = new Services();
    }

    componentDidMount = async () => {
        await AsyncStorage.multiGet(["user_id"]).then(response => {this.setState({"userId" : response[0][1]});});
    }

    sendDocument = async () => {
        var isValidForm = validate({ userEmail: this.state.userEmail }, constraints, { format: "detailed" });

        if (isValidForm != undefined) {
            this.setState({ 'spinner': false });
            DropDownHolder.dropDown.alertWithType('error', 'Error', (isValidForm[0]).error);           
        } else {
            let apiUrl = null;
            let dataParams = null;
            if(this.state.type == 'PDF') {
                apiUrl = FINANCIAL_SHARE_PDF;
                dataParams = ServiceParams.shareDocParams(this.state.type, this.state.userEmail, this.state.selectedStartDate, this.state.selectedEndDate);
            } else {
                apiUrl = FINANCIAL_SHARE_CSV;
                dataParams = ServiceParams.shareDocParams(this.state.type, this.state.userEmail, this.state.selectedStartDate, this.state.selectedEndDate);
            }

            this.setServices.postService(apiUrl+'/'+this.state.userId, dataParams)
            .then(async(responseData) => { 
                    //    console.warn(responseData);          
                if(responseData.error == 0) {
                    DropDownHolder.dropDown.alertWithType('success', 'Success', responseData.info);
                } else {
                    DropDownHolder.dropDown.alertWithType('error', 'Error', responseData.info);
                }
                this.setState({ 'spinner' : false });
            }, (error) => {                  
                this.setState({ 'spinner' : false });         
                console.log("Error : ", error);    
            })      
        }
    }

    render() {
        const { goBack } = this.props.navigation;
        const { navigation } = this.props;
        return (
            <View style={{ flex: 1,}} >

            <Spinner
                visible={this.state.spinner}
                textContent={'Loading...'}
                textStyle={profileStyles.spinnerTextStyle}
            /> 

            <ImageBackground source={require('./images/Slice_8.png')} style={{width: '100%', height: 220}}>

            {
                Platform.OS === 'ios' ? <MyStatusBar backgroundColor="transparent" barStyle="light-content" /> : <StatusBar translucent backgroundColor="transparent"  barStyle="light-content"  />
            }


                <View style={{ paddingHorizontal: 20, height: (Dimensions.get('window').height) * 0.1}}>
                    <View style={{ marginTop:50, }}>
                        <TouchableOpacity onPress={() => { goBack(); }} style={{ flexDirection: 'row',}}>
                            {/* <Image source={require('./images/whiteBackIcon.png')} style={{ width: 16, height:16 }}></Image>   */}
                            <View style={{justifyContent: 'center', paddingRight: 10}}>
                                <Image source={require('./images/whiteBackIcon.png')} style={{ width: 16, height:16 }}></Image>  
                            </View>
                            <View  style={{justifyContent: 'center', }}>
                                <Text style={profileStyles.infoHeaderTitle}>{'Share '+ this.state.type}</Text>
                                {/* <Text style={{ fontSize: 18, color: '#fff', fontFamily: Fonts.MontserratBold, paddingLeft: 15 }}>{'Share '+ this.state.type}</Text>                                       */}
                            </View> 
                        </TouchableOpacity>      
                        
                    </View>
                </View>

            </ImageBackground>

            <View style={[ profileStyles.shareCSVBody] }>
                <ScrollView>
                    <View style={{flexDirection: 'row', marginTop: 10, marginBottom: 10}}>
                        <View style={[profileStyles.calendarArea ,{width: '45%', alignContent: 'flex-start', }]} >
                            <Text style={ profileStyles.selectedDate }>Financial year start on:</Text>

                            <TouchableOpacity onPress={() => {
                                this.setState({startDateOverly: true});
                            }} style={ profileStyles.dropDownArea }>
                                <View style={ profileStyles.aliasDropDown }>
                                    <View style={ profileStyles.showDateValue }>
                                        <Text style={ profileStyles.showSelectedDate }>
                                            {moment(this.state.selectedStartDate).format('DD MMM YYYY')}
                                        </Text>
                                    </View>
                                    {/* <View style={ profileStyles.showDropDownIcon }><Text>
                                        <Image resizeMode='stretch' style={ profileStyles.dateDropDownImage } source={this.state.arrowSource} />
                                    </Text></View> */}
                                </View>
                            </TouchableOpacity> 

                            
                            <Overlay visible={this.state.startDateOverly } 
                                    onClose={() => {this.setState({startDateOverly: false});}} 
                                    closeOnTouchOutside 
                                    containerStyle={{ backgroundColor: 'rgba(0,0,0,0)' }}
                                    childrenWrapperStyle={ profileStyles.overDatePicker }
                            >    
                                <Calendar
                                    current={this.state.selectedStartDate}
                                    style={ profileStyles.calendarStyle }
                                    onDayPress={(day) => { this.setState({selectedStartDate: day.dateString});
                                                        this.setState({ 'startDateOverly': false });}}
                                    markedDates={{[this.state.selectedStartDate]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}}}
                                />                                             
                            </Overlay>
                        </View>
                        <View style={[profileStyles.calendarArea ,{width: '10%', alignContent: 'flex-start', }]} ></View>

                        <View style={[ profileStyles.calendarArea ,{width: '45%', alignContent: 'flex-end',}]} >
                            <Text style={ profileStyles.selectedDate }>Financial year end on:</Text>

                            <TouchableOpacity onPress={() => {
                                this.setState({endDateOverly: true});
                            }} style={ profileStyles.dropDownArea }>
                                <View style={ profileStyles.aliasDropDown }>
                                    <View style={ profileStyles.showDateValue }>
                                        <Text style={ profileStyles.showSelectedDate }>
                                            {moment(this.state.selectedEndDate).format('DD MMM YYYY')}
                                        </Text>
                                    </View>
                                    {/* <View style={ profileStyles.showDropDownIcon }><Text>
                                        <Image resizeMode='stretch' style={ profileStyles.dateDropDownImage } source={this.state.arrowSource} />
                                    </Text></View> */}
                                </View>
                            </TouchableOpacity> 

                            
                            <Overlay visible={ this.state.endDateOverly } 
                                    onClose={() => {this.setState({startDateOverly: false});}} 
                                    closeOnTouchOutside 
                                    containerStyle={{ backgroundColor: 'rgba(0,0,0,0)' }}
                                    childrenWrapperStyle={ profileStyles.overDatePicker }
                            >    
                                <Calendar
                                    current={this.state.selectedEndDate}
                                    style={ profileStyles.calendarStyle }
                                    onDayPress={(day) => {this.setState({selectedEndDate: day.dateString});
                                                            this.setState({ 'endDateOverly': false }); }}
                                    markedDates={{[this.state.selectedEndDate]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}}}
                                />                                             
                            </Overlay>
                        </View>
                    </View>                    


                    <View style={{ marginTop: 40}}> 
                        { (this.state.userEmail != null && this.state.userEmail != '') &&
                            <Text style={ profileStyles.inputLabel }>Send file to this email address</Text>
                        } 
                        <View style = {{ borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                            <View style = {{ width: '100%', alignContent: 'flex-start' , justifyContent:'center', paddingBottom: 10,}}>
                                <TextInput
                                        id='userEmail'
                                        onChangeText={(userEmail) => this.setState({ userEmail })}
                                        placeholder='Send file to this email address'
                                        placeholderTextColor='#AAB2BD'
                                        keyboardType='email-address'
                                        returnKeyType='next'
                                        autoCorrect={false}
                                        style={ profileStyles.inputLabelHide }
                                        value={this.state.userEmail} />
                                </View>
                        </View> 
                    </View>
                    <View style={ profileStyles.financialBottomArea }>
                        <View style={ profileStyles.pdfButtonArea }>
                            <TouchableOpacity style={ profileStyles.csvButton } onPress={() => { this.sendDocument(); }}>
                                <Text style={ profileStyles.csvButtonText }>SHARE CSV DATA</Text>
                            </TouchableOpacity>
                        </View>
                    </View> 
                </ScrollView>
            </View>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    statusBar: {
        height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    },
});