import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, Text, Image, 
    TouchableOpacity, BackHandler, SafeAreaView, ScrollView, ImageBackground, AsyncStorage, NativeModules, Platform, StatusBar } from 'react-native'
import { Header, Left, Body, Right, Icon, Button, Tabs, Tab, ScrollableTab  } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';

import { profileStyles } from './styles';
// import { GET_ALL_DOCS } from '../../../config/shared';
// import { Services } from '../../../services/services';
import CustomHeader from '../../../components/customHeader/header';
import CustomTab, { tabHeadingStyles } from '../../../components/CustomTabs/CustomTab';
import Financial  from './financial';
import Revenue from './revenue';
import { Fonts } from '../../../config/font';

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 10 : StatusBarManager.HEIGHT;
const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[{ backgroundColor, height: STATUSBAR_HEIGHT }]}>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
);

export default class FinancialReport extends Component {
    
    constructor(){
        super()
        this.state = {
            spinner: false,
            selectedIndex: 0,
        }
    }

    handleIndexChange = (selectedIndex) => {
        this.setState({selectedIndex: selectedIndex});
    }

    render() {
        const { goBack } = this.props.navigation;
        return (
            <View style={{ flex: 1, marginTop: STATUSBAR_HEIGHT, }}>
            {
                Platform.OS === 'ios' ? <MyStatusBar backgroundColor="#ffffff" barStyle="dark-content" /> : <StatusBar backgroundColor="#ffffff" barStyle="dark-content"  />
            }
                <ScrollView  style={{  paddingTop: 10}}>  
                    <Spinner
                        visible={this.state.spinner}
                        textContent={'Loading...'}
                        textStyle={profileStyles.spinnerTextStyle}
                    />        
                    <View style={{ paddingTop:15}}>
                        {/* <CustomHeader
                            goBack={goBack.bind(this)}
                            headerTitle={'Financials'}
                        /> */}
                        <View style={{ flex: 1, flexDirection: 'row',paddingHorizontal:20,}}>
                            <View style={{flexDirection: 'row', alignContent: 'flex-start'}}>
                                <TouchableOpacity onPress={() => { goBack(); }}>
                                    <Image source = { require('./images/backIcon.png') } style = {{ width: 18, height: 18, marginTop: 3 }}/>
                                </TouchableOpacity>      
                                <Text style={{ fontSize: 18, color: '#414253', fontFamily: Fonts.MontserratBold, paddingLeft: 20 }}>Financials</Text>
                            </View>   
                        </View>
                    </View>

                        <CustomTab callBack={this.handleIndexChange.bind(this)}>
                            {/* First tab */}
                            <View title="DASHBOARD" style={ tabHeadingStyles.content }>
                                <Financial navigation={this.props.navigation} />
                            </View>
                            {/* Second tab */}
                            <View title="REVENUE" style={ tabHeadingStyles.content }>
                                <Revenue navigation={this.props.navigation} />
                            </View>
                        </CustomTab>  
                </ScrollView>
            </View>
        )
    }
}