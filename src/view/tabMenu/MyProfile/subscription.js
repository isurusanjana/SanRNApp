import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, Text, Image, 
    TouchableOpacity, BackHandler, SafeAreaView, ScrollView, ImageBackground, AsyncStorage } from 'react-native'
import { Header, Left, Body, Right, Icon, Button, Tabs, Tab, ScrollableTab  } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import LinearGradient from 'react-native-linear-gradient';

import { profileStyles } from './styles';
import { GET_ALL_DOCS } from '../../../config/shared';
import { Services } from '../../../services/services';
import CustomHeader from '../../../components/customHeader/header';
import { Fonts } from '../../../config/font';



export default class Subscription extends Component {
    
    constructor(){
        super()
        this.state = {
            spinner: false,
        }
    }

    componentDidMount = async () => {
    }


    render() {
        const { goBack } = this.props.navigation;
        return (
            <View style={{flex:1}}>
                <ScrollView  style={ profileStyles.container}>  
                    <Spinner
                        visible={this.state.spinner}
                        textContent={'Loading...'}
                        textStyle={profileStyles.spinnerTextStyle}
                    />        
                    <View style={{ flexDirection: 'row', paddingHorizontal: 5, height: (Dimensions.get('window').height) * 0.1}}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>                            
                            <TouchableOpacity onPress={() => { goBack(); }}>
                                <Icon name='arrow-back' style={{ fontSize: 30, color: 'black', width: 200, justifyContent: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start', alignSelf: 'flex-start', }} />
                            </TouchableOpacity>                                            
                        </View>
                        <View style={{ flex: 2, justifyContent: 'center', }}>
                            <Text style={{textAlign: 'center', fontSize: 14, color: '#142828',fontFamily: Fonts.Rubik, paddingRight: 15,}}>Unlock San</Text>
                        </View> 
                        <View style={{ flex: 1,}}></View>                   
                    </View>
                    <View style={ profileStyles.subscriptionImage }>
                        <LinearGradient colors={['#145d6e', '#023342']} style={profileStyles.featureGradient}>
                            <View style={ profileStyles.subscriptionArea }>
                                <Text style={ profileStyles.subscriptionImageHeading }>Features</Text>
                                <View style={ profileStyles.featureSection }>
                                    <View style={ profileStyles.featureIconSection }>
                                        <Image source={require('./images/Oval.png')} style={ profileStyles.featureIcon } />
                                    </View>
                                    <View style={ profileStyles.featureTextSection }>
                                        <Text style={ profileStyles.featureText }>Create and send invoices on the go</Text>
                                    </View>
                                </View>  
                                <View style={ profileStyles.featureSection }>
                                    <View style={ profileStyles.featureIconSection }>
                                        <Image source={require('./images/Oval.png')} style={ profileStyles.featureIcon } />
                                    </View>
                                    <View style={ profileStyles.featureTextSection }>
                                        <Text style={ profileStyles.featureText }>Add expenses and store receipts</Text>
                                    </View>
                                </View> 
                                <View style={ profileStyles.featureSection }>
                                    <View style={ profileStyles.featureIconSection }>
                                        <Image source={require('./images/Oval.png')} style={ profileStyles.featureIcon } />
                                    </View>
                                    <View style={ profileStyles.featureTextSection }>
                                        <Text style={ profileStyles.featureText }>Access financial reports from anywhere</Text>
                                    </View>
                                </View> 
                                <View style={ profileStyles.featureSection }>
                                    <View style={ profileStyles.featureIconSection }>
                                        <Image source={require('./images/Oval.png')} style={ profileStyles.featureIcon } />
                                    </View>
                                    <View style={ profileStyles.featureTextSection }>
                                        <Text style={ profileStyles.featureText }>Share data with accountant</Text>
                                    </View>
                                </View> 
                                <View style={ profileStyles.featureSection }>
                                    <View style={ profileStyles.featureIconSection }>
                                        <Image source={require('./images/Oval.png')} style={ profileStyles.featureIcon } />
                                    </View>
                                    <View style={ profileStyles.featureTextSection }>
                                        <Text style={ profileStyles.featureText }>Schedule jobs on your integrate calendar</Text>
                                    </View>
                                </View>                               
                            </View>
                        </LinearGradient>
                    </View>
                    <View style={ profileStyles.middleArea }>
                        <View style={ profileStyles.middleSection }>
                            <Text style={ profileStyles.subDays }>30 days</Text>
                            <Text style={ profileStyles.subFree }>for free</Text>
                        </View>
                        <View style={ profileStyles.middleSection }>
                            <Text style={ profileStyles.subMiddleText }></Text>
                        </View>
                        <View style={ profileStyles.middleSection }>
                            <Text style={ profileStyles.subBottomText }></Text>
                        </View>
                    </View>
                </ScrollView>
                <TouchableOpacity>
                    <View style={ profileStyles.subscriptionBottom }>
                        <View style={ profileStyles.bottomArea }>
                            <View style={ profileStyles.bottomPlan }>
                                <Text style={ profileStyles.bottomPlanText }>Get Monthly Plan</Text>
                            </View>
                            <View style={ profileStyles.bottomPrice }>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={ profileStyles.bottomSymbol }>£</Text>
                                    <Text style={ profileStyles.bottomPriceValue }>30.00</Text> 
                                    <Text style={ profileStyles.bottomPriceMonth }>/mo </Text>
                                </View>
                                <View style={ profileStyles.priceDescArea }>
                                    <Text style={ profileStyles.bottomPriceDesc }>Billed monthly</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}