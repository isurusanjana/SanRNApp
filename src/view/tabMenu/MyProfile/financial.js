import React, { Component } from 'react'
import { View, Text, Image, 
    TouchableOpacity, ScrollView, AsyncStorage } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import Overlay from 'react-native-modal-overlay';
import { Calendar} from 'react-native-calendars';

import { profileStyles } from './styles';
import { GET_FINANCIAL_REPORT } from '../../../config/shared';
import { Services } from '../../../services/services';

export default class Financial extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            userId: 0,
            spinner: true,
            paid: 0,
            expense: 0,
            mileage: 0,
            outstanding: 0,
            selectedDate: null,
            arrowSource: require("./images/dropdown-arrow.png"),
            startDateOverly: false,
        }
        this.setServices = new Services();
    }

    componentDidMount = async () => {
        await AsyncStorage.multiGet(["user_id"]).then(response => {this.setState({"userId" : response[0][1]});});
        this.getFinancialSummary((moment().format('YYYY'))+'-01-01');
    }

    getFinancialSummary = async (dateSelected) => {
        this.setState({ selectedDate: dateSelected });
        this.setState({ 'startDateOverly': false });
        this.setState({ 'spinner': true });
        var bodyData = new FormData();

        bodyData.append('start_date', dateSelected);

        await this.setServices.postService(GET_FINANCIAL_REPORT + this.state.userId, bodyData)
        .then(async (responseData) => {  
            if(responseData.error == 0) {              
                if(responseData.info.hasOwnProperty('total_rev')) {
                    this.setState({paid: responseData.info.total_rev});
                }
                if(responseData.info.hasOwnProperty('total_expenses')) {
                    this.setState({expense: responseData.info.total_expenses});
                }
                if(responseData.info.hasOwnProperty('total_mileage_expense')) {
                    this.setState({mileage: responseData.info.total_mileage_expense});
                }
                if(responseData.info.hasOwnProperty('total_out')) {
                    this.setState({outstanding: responseData.info.total_out});
                }
            }

            this.setState({ 'spinner': false });
        }, (error) => {
            console.log(error);
            this.setState({ 'spinner': false });
        })
    }

    render() {
        return (
            <View style={ profileStyles.financialContainer }>
                <ScrollView >  
                    <Spinner
                        visible={this.state.spinner}
                        textContent={'Loading...'}
                        textStyle={profileStyles.spinnerTextStyle}
                    /> 
                    <View style={ profileStyles.calendarArea } >
                        <Text style={ profileStyles.selectedDate }>Financial year starts on:</Text>

                        <TouchableOpacity onPress={() => {
                            this.setState({startDateOverly: true});
                        }} >
                            <View style={ profileStyles.aliasDropDown }>
                                <View style={ profileStyles.showDateValue }>
                                    <Text style={ profileStyles.showSelectedDate }>
                                        { moment(this.state.selectedDate).format('DD MMM YYYY')}
                                    </Text>
                                </View>
                                <View style={{paddingTop:8, justifyContent: 'center',}}><Text>
                                    <Image resizeMode='stretch' style={ profileStyles.dateDropDownImage } source={this.state.arrowSource} />
                                </Text></View>
                            </View>
                        </TouchableOpacity> 

                        
                        <Overlay visible={ this.state.startDateOverly } 
                                onClose={() => {this.setState({startDateOverly: false});}} 
                                closeOnTouchOutside 
                                containerStyle={{ backgroundColor: 'rgba(0,0,0,0)' }}
                                childrenWrapperStyle={ profileStyles.overDatePicker }
                        >    
                            <Calendar
                                current={this.state.selectedDate}
                                style={ profileStyles.calendarStyle }
                                onDayPress={(day) => { 
                                                    this.setState({selectedDate: day.dateString});
                                                    this.getFinancialSummary(day.dateString);
                                            }}
                                markedDates={{[this.state.selectedDate]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}}}
                            />                                             
                        </Overlay>
                    </View>

                    <View style={ profileStyles.financialTileArea }>
                        <View style={ profileStyles.financialLeft }>
                            <View style={[profileStyles.financialTile, {backgroundColor: '#5A5EE0' , }]}>
                                <View style={ profileStyles.financialPaid }>
                                    <View style={[profileStyles.financialImage,{paddingBottom: 15 }]}>
                                        <Image source={require('./images/financial_1.png')} style={{ width: 15.79, height:20 }}></Image>  
                                    </View>
                                    <View style={{paddingBottom: 4}}><Text style={ profileStyles.paidText }>Paid</Text></View>
                                    <View><Text style={ profileStyles.tileAmount }>£ { parseFloat(this.state.paid).toFixed(2)}</Text></View>
                                </View>                                
                            </View>
                        </View>
                        <View style={ profileStyles.financialRight }>
                            <View style={[profileStyles.financialTile, {backgroundColor: '#EB5757' , }]}>
                                <View style={ profileStyles.financialDescription }>
                                    <View style={ profileStyles.financialPaid }>
                                        <View style={[profileStyles.financialImage,{paddingBottom: 11 }]}>
                                            <Image source={require('./images/financial_2.png')} style={{ width: 25, height:25 }}></Image>  
                                        </View>
                                        <View  style={{paddingBottom: 4}}><Text style={ profileStyles.paidText }>Expenses</Text></View>
                                        <View><Text style={ profileStyles.tileAmount }>£ { parseFloat(this.state.expense).toFixed(2)}</Text></View>
                                    </View>
                                </View>
                                
                            </View>
                        </View>
                    </View> 
                    <View style={ profileStyles.financialTileArea }>
                        <View style={ profileStyles.financialLeft }>
                            <View style={[profileStyles.financialTile, {backgroundColor: '#1F89E4' , }]}>
                                <View style={ profileStyles.financialDescription }>
                                    <View style={ profileStyles.financialPaid }>
                                        <View style={[profileStyles.financialImage,{paddingBottom: 13 }]}>
                                            <Image source={require('./images/financial_3.png')} style={{ width: 25, height:25 }}></Image>  
                                        </View>
                                        <View style={{paddingBottom: 4}}><Text style={ profileStyles.paidText }>Mileage</Text></View>
                                        <View><Text style={ profileStyles.tileAmount }>{parseFloat(this.state.mileage).toFixed(2)}</Text></View>
                                    </View>
                                </View>
                                
                            </View>
                        </View>
                        <View style={ profileStyles.financialRight }>
                            <View style={[profileStyles.financialTile, {backgroundColor: '#00D3A1' , }]}>
                                <View style={ profileStyles.financialDescription }>
                                    <View style={ profileStyles.financialPaid }>
                                        <View style={[profileStyles.financialImage,{paddingBottom: 13 }]}>
                                            <Image source={require('./images/financial_4.png')} style={{ width: 25, height:25 }}></Image>  
                                        </View>
                                        <View style={{paddingBottom: 4}}><Text style={ profileStyles.paidText }>Outstanding</Text></View>
                                        <View><Text style={ profileStyles.tileAmount }>£ {this.state.outstanding}</Text></View>
                                    </View>
                                </View>
                                
                            </View>
                        </View>
                    </View> 
                    <View style={ profileStyles.financialBottomArea }>
                        {/* <View style={ profileStyles.pdfButtonArea }>
                            <TouchableOpacity style={ profileStyles.pdfButton } onPress={() => {
                                            this.props.navigation.navigate('ShareFinancialPage', {
                                                                    type: 'PDF',
                                                                    selectedDate: this.state.selectedDate
                                                                });
                                        }}>
                                <Text style={ profileStyles.pdfButtonText }>Share PDF Receipts</Text>
                            </TouchableOpacity>
                        </View> */}
                        <View style={ profileStyles.pdfButtonArea }>
                            <TouchableOpacity style={ profileStyles.csvButton } onPress={() => {
                                this.props.navigation.navigate('ShareFinancialPage', {
                                                                    type: 'CSV',
                                                                    selectedDate: this.state.selectedDate
                                                                });
                            }}>
                                <Text style={ profileStyles.csvButtonText }>SHARE CSV DATA</Text>
                            </TouchableOpacity>
                        </View>
                    </View> 
                </ScrollView>
            </View>
        )
    }
}