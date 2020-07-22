import React, { Component } from 'react'
import {
    View, StyleSheet, Dimensions, Text, Image,
    TouchableOpacity, BackHandler, SafeAreaView, ScrollView, ImageBackground, AsyncStorage
} from 'react-native'
import { Header, Left, Body, Right, Icon, Button, Tabs, Tab, ScrollableTab } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';

import { profileStyles } from './styles';
import { REVENUE_SUMMARY, REVENUE_DETAILS } from '../../../config/shared';
import { Services } from '../../../services/services';
import { Fonts } from '../../../config/font';


export default class Revenue extends Component {

    constructor() {
        super()
        this.state = {
            spinner: true,
            currentYearStart: (moment().format('YYYY')) + '-01-01',
            currentYearEnd: (moment().format('YYYY-MM')) + '-31',
            selectedDateStart: (moment().format('YYYY-MM')) + '-01',
            selectedDateEnd: (moment().format('YYYY-MM')) + '-31',
            currentMonth: parseInt(moment().format('M')),
            revenueSummary: null,
            totalBill: 0,
            chartRowWidth: (Dimensions.get('window').width - 50) / 6,
            barWidth: (Dimensions.get('window').width - 50) / 36,
            selectedBarKey: parseInt(moment().format('M')),
            revenueDetails: null,
            detailMessage: null
        }
    }

    componentDidMount = async () => {
        this.setServices = new Services();
        await AsyncStorage.multiGet(["user_id"]).then(response => { this.setState({ userId: response[0][1] }); });
        await this.getRevenueSummary();
    }

    getRevenueSummary = async () => {
        this.setServices.getService(REVENUE_SUMMARY + this.state.userId + '/' + this.state.currentYearStart + '/' + this.state.currentYearEnd, "")
            .then(async (responseData) => {
                if (responseData.error == 0) {
                    if(responseData.info.revenue != "No revenue returned.") {                    
                        let summaryArray = [];
                        var summary = null;
                        let totalBill = 0;

                        for (var i = 1; i <= 12; i++) {
                            summary = responseData.info.revenue.filter(function (item) {
                                return item.month == i;
                            }).map(function ({ month_name, month, billed }) {
                                summaryArray.push({ "month_name": moment.monthsShort(i - 1), "month": i, "billed": parseFloat(billed) });
                                totalBill += parseFloat(billed);
                            });

                            if (summary.length == 0) {
                                summaryArray.push({ "month_name": moment.monthsShort(i - 1), "month": i, "billed": 0 });
                            }
                        }

                        await this.setState({ revenueSummary: summaryArray });
                        await this.setState({ totalBill: totalBill });
                        await this.getSelectedMonthRevenue(this.state.selectedDateStart, this.state.selectedDateEnd);
                    }
                }
                this.setState({ 'spinner': false });
            }, (error) => {
                console.log(error);
                this.setState({ 'spinner': false });
            })
    }

    getSelectedMonthRevenue = async (startDate, endDate) => {
        this.setServices.getService(REVENUE_DETAILS + this.state.userId + '/from/' + startDate + '/to/' + endDate + '/daily', "")
            .then(async (responseData) => {
                if (responseData.error == 0) {
                    if (responseData.info.revenue != "No revenue returned.") {
                        this.setState({ detailMessage: null });
                        await this.setState({ revenueDetails: responseData.info.revenue });
                    } else {
                        this.setState({ revenueDetails: null });
                        await this.setState({ detailMessage: responseData.info.revenue });
                    }
                }

                this.setState({ 'spinner': false });
            }, (error) => {
                console.log(error);
                this.setState({ 'spinner': false });
            })
    }

    onSelectBar = async (key) => {
        this.setState({ 'spinner': true });
        this.setState({ selectedBarKey: key });
        let startDate = (moment().format('YYYY')) + '-' + (moment().month(key - 1).format('MM')) + '-01';
        let endDate = (moment().format('YYYY')) + '-' + (moment().month(key - 1).format('MM')) + '-31';
        await this.getSelectedMonthRevenue(startDate, endDate);
    }

    render() {
        return (
            <View>
                <ScrollView style={[profileStyles.revenueContainer,{flex:1}]}>
                    <Spinner
                        visible={this.state.spinner}
                        textContent={'Loading...'}
                        textStyle={profileStyles.spinnerTextStyle}
                    />
                    <View style={{paddingHorizontal: 20, paddingVertical: 20,flex: 1, flexDirection: 'row',}}>
                        <View style={{width: '70%',}}>
                            <Text style={profileStyles.heading}>Forecast revenue</Text>
                            <Text style={profileStyles.subHeading}>Based on value of booked jobs</Text>
                        </View>
                        <View  style={{width: '30%', }}>
                            <Text style={{color: '#000000', fontFamily: Fonts.RubikMedium, fontSize: 18, justifyContent: 'flex-end',textAlign: 'right', textAlignVertical: 'center', paddingTop: 5}}>£ {this.state.totalBill}</Text>
                        </View>
                    </View>
                    <View style={profileStyles.revenueImage}>
                        
                        <LinearGradient  colors={['#5A5EE0', '#3894E4']} style={profileStyles.revenueGradient}>
                            <View style={profileStyles.revenueArea}>
                                <Text style={profileStyles.revenueImageHeading}>{moment().format('YYYY')}</Text>
                            </View>
                            <View style={profileStyles.chartArea}>
                                {this.state.revenueSummary != null &&
                                    <View style={profileStyles.barArea}>

                                        <ScrollView horizontal={true}>
                                            {
                                                this.state.revenueSummary.map((revenue, key) => { 
                                                    var height = (((Dimensions.get('window').height) * 0.30) * (revenue.billed / this.state.totalBill));
                                                    
                                                    var barHeight = (height == null || height ==  'Infinity' ? 1 : parseFloat(height));
                                                    
                                                    if(barHeight == null || barHeight == NaN || barHeight == 'NaN') {
                                                        barHeight = 1;
                                                    }
                                                    
                                                    return <View key={key} style={{ flexDirection: 'row' }}>
                                                        {revenue.month == this.state.selectedBarKey ?
                                                            <View style={{ flexDirection: 'column-reverse', }}>
                                                                <LinearGradient opacity={0.8}  colors={['#ffffff45', '#ffffff00']} start={{ x: 1, y: 1 }} end={{ x: 1, y: 0 }} style={[profileStyles.bar, { width: this.state.chartRowWidth}]}>
                                                                    <Text style={{ color: '#ffffff', paddingBottom: 10, fontSize:10 }}>£ {parseFloat(revenue.billed).toFixed(2)}</Text>
                                                                    <View style={{ width: this.state.barWidth, height: (isNaN(barHeight) ? 1 : barHeight), backgroundColor: '#2ee5b5', borderRadius: 55 }}></View>
                                                                    <Text style={{ color: '#ffffff', paddingTop: 10,fontSize:10 }}>{revenue.month_name}</Text>
                                                                </LinearGradient>
                                                            </View>
                                                            :
                                                            <View style={{ flexDirection: 'column-reverse' }}>
                                                                <TouchableOpacity style={[profileStyles.bar, { width: this.state.chartRowWidth }]} onPress={() => { this.onSelectBar(revenue.month); }}>
                                                                    <Text style={{ color: '#ffffff', paddingBottom: 10, fontSize:10 }}>£ {parseFloat(revenue.billed).toFixed(2)}</Text>
                                                                    <View style={{ width: this.state.barWidth, height: (isNaN(barHeight) ? 1 : barHeight), backgroundColor: '#2ee5b5', borderRadius: 55 }}></View>
                                                                    <Text style={{ color: '#ffffff', paddingTop: 10,fontSize:10 }}>{revenue.month_name}</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        }
                                                    </View>
                                                })
                                            }

                                        </ScrollView>
                                    </View>
                                }
                            </View>
                        </LinearGradient>
                    </View>
                    <View style={profileStyles.revenueBody}>
                        <ScrollView>
                            <View>
                                <Text style={profileStyles.heading}>{moment().month(this.state.selectedBarKey - 1).format('MMMM')}</Text>
                            </View>
                            <View style={profileStyles.revenueDisplayArea}>
                                {
                                    this.state.revenueDetails != null ?
                                        this.state.revenueDetails.map((item, key) => {
                                            return (
                                                <View key={key} >
                                                    <View style={{ flexDirection: 'row', paddingVertical:15 }}>
                                                        <View style={profileStyles.listItemLeft}>
                                                            <Text style={profileStyles.textDate}>{moment(item.day).format('DD MMM YYYY')}</Text>
                                                        </View>
                                                        <View style={profileStyles.listItemRight}>
                                                            <Text style={profileStyles.itemPrice}>£ {parseFloat(item.billed).toFixed(2)}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={profileStyles.hrLineRevenue} />
                                                </View>
                                            )
                                        })
                                        :
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={profileStyles.textDate}>{this.state.detailMessage}</Text>
                                        </View>
                                }

                            </View>
                        </ScrollView>
                    </View>

                </ScrollView>
            </View>
        )
    }
}