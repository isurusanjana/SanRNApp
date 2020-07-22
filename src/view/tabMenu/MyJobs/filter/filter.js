import React, { Component } from 'react'
import { View, StyleSheet, Text, Platform, StatusBar, NativeModules, TouchableOpacity, Image, ScrollView, 
    TextInput, Dimensions, AsyncStorage } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Fonts } from '../../../../config/font';
import { newinvoicestyles } from '../../Invoice/newInvoice/styles';
import formStyles from '../../../../components/formTextInput/styles';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { signupstyles } from '../../../signup/styles';
import moment from 'moment';
import Overlay from 'react-native-modal-overlay';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import { Services } from '../../../../services/services';
import { GET_JOBBYPRACTICE_URLPART1 } from '../../../../config/shared';
// import Slider from '@react-native-community/slider';
import { filterJobstyles } from './styles';
import { Calendar } from 'react-native-calendars';
import Slider from 'react-native-slider';

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 10 : StatusBarManager.HEIGHT;
const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[{ backgroundColor, height: STATUSBAR_HEIGHT }]}>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
);

export class JobFilter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            JobData: [],
            moreOverLay: false,
            confirmationDisplay: false,
            statusTitle: 'Applied',
            rangeValue: 5,
            selectedButton: null,
            displayDate: 'Select date',
            startDateOverly: false,
            selectedDate: null,
            postCode: null,
            sendDate: null
        };

    }

    componentDidMount() {
        console.log("Props :", this.props);
    }

    render() {

        const { goBack } = this.props.navigation;

        return (
        <View style={{ flex: 1 }}>
            {
                Platform.OS === 'ios' ? <MyStatusBar backgroundColor="#f5fbfb" barStyle="dark-content" /> : <StatusBar backgroundColor="#f5fbfb" barStyle="dark-content"  />
            }
            <ScrollView  style={ filterJobstyles.container}>  
                <View style={{  height: (Dimensions.get('window').height) * 0.07, }}>
                    <View style={{ flex: 1, flexDirection: 'row',}}>
                        {/* <View style={{flexDirection: 'row', width: '80%', alignContent: 'flex-start'}}>
                            <TouchableOpacity onPress={() => { goBack(); }}>
                                <Image source = { require('./images/backIcon.png') } style = {{ width: 18, height: 18, marginTop: 3 }}/>
                            </TouchableOpacity>      
                            <Text style={{ fontSize: 18, color: '#414253', fontFamily: Fonts.MontserratBold, paddingLeft: 20 }}>Filter Jobs</Text>
                        </View>  */}
                        <View style={{width: '80%',justifyContent:'flex-start',flexDirection:'row', }}>
                            <TouchableOpacity onPress={() => { goBack(); }} style={{ flexDirection: 'row',}}>
                                <View style={{justifyContent: 'center', paddingRight: 10}}>
                                    <Image source={require('./images/backIcon.png')} style={{ width: 16, height:16 }}></Image>  
                                </View>
                                <View  style={{justifyContent: 'center', }}>
                                    <Text style={{color: '#000000',fontFamily: Fonts.MontserratBold,fontSize: 18,}}>Filter Jobs</Text>                                    
                                </View> 
                            </TouchableOpacity>                            
                        </View>                                                              
                        <View style={{width: '20%',justifyContent:'center' , }}>
                            <TouchableOpacity onPress={() => {
                                this.setState({
                                    rangeValue: 5,
                                    selectedButton: "1",
                                    displayDate : 'Select date'
                                });

                                this.props.navigation.state.params.callBack(false, this.state);
                                this.props.navigation.goBack();
                            }}>
                                <View style={{justifyContent: 'flex-end', paddingRight: 10}}>
                                     <Text style={{ textAlign: 'center', alignItems: 'flex-end', alignContent: 'flex-end', alignSelf: 'flex-end', color: '#414253', fontSize: 13, fontFamily: Fonts.MontserratMedium }}>RESET</Text>
                                 </View>
     
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={{ flexDirection: 'column', }}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginTop: 10 }}>
                        <View style={{  width: '60%', justifyContent: 'flex-start', alignContent: 'flex-start', alignItems: 'flex-start',  }}>
                            <Text style={{fontSize: 18, color: '#414253', fontFamily: Fonts.MontserratMedium, justifyContent: 'flex-start', }}>Distance</Text>
                        </View>
                        <View style={{flexDirection: 'row', width: '40%',  justifyContent: 'center', alignContent: 'flex-end', alignItems: 'flex-end', }}>
                            <View  style={{borderBottomColor:'#E6E9ED', borderBottomWidth:1,}}>
                                <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:0, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                    <View style={{width:'80%',  justifyContent:'flex-start'}}>
                                        <TextInput
                                            placeholder={'Postcode'}
                                            placeholderTextColor="#c3c7d5"
                                            returnKeyType="next"
                                            autoCorrect={false}
                                            style={filterJobstyles.input}
                                            onChangeText={(text) => {
                                                this.setState({ postCode: text });
                                            }}
                                            // editable={false}
                                            value={this.state.postCode}
                                        />
                                    </View>
                                    <View  style={{width:'20%',  justifyContent:'flex-end'}}>
                                        <Image style={{ width: 24.5, height: 22, }} source={require('./images/postCode.png')}></Image>
                                    </View>
                                </View> 
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginTop: 20  }}>
                        <View style={{width: '80%', alignContent: 'flex-start',justifyContent: 'center',}}>
                            <Slider
                                style={{ width: '100%', height: 30,}}
                                minimumValue={5}
                                maximumValue={500}
                                step={5}
                                thumbTouchSize={{width: 50, height: 50}}
                                trackStyle={{height: 6}}
                                value={this.state.rangeValue}
                                minimumTrackTintColor="#E6E9ED"
                                maximumTrackTintColor="#E6E9ED"
                                thumbTintColor="#00D3A1"
                                onValueChange={(value) => {
                                    console.log("Change Value : ", value);
                                    this.setState({
                                        rangeValue: value
                                    })
                                }}
                            />
                        </View>
                        <View style={{width: '20%', alignContent: 'flex-end',justifyContent: 'center',}}>
                            <Text style={{ textAlign: 'right', fontSize: 15, color: '#00D3A1', fontFamily: Fonts.MontserratMedium, }}>{this.state.rangeValue} km</Text>
                        </View>
                    </View>
                </View>
    
                <View style={{flexDirection: 'column', marginTop: 35,  marginBottom:15}}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginTop: 10 }}>
                        <Text style={{ flex: 1, fontSize: 18, color: '#414253', fontFamily: Fonts.MontserratMedium, }}>Session type</Text>
                    </View>
                    <View style={{ flex: 1, marginTop: 30, }}>

                        <View style={{flexDirection: 'row'}}>
                            <View style={{width: '60%', alignContent: 'flex-end', paddingRight: 10, }}>
                                <TouchableOpacity style={filterJobstyles.defaultLeftButtonBackGroundColor} onPress={() => {
                                    this.setState({ selectedButton: '1' });
                                }}>  
                                    <View style={this.state.selectedButton == "1" ? filterJobstyles.selectedButton : filterJobstyles.defaultButton}>     
                                        {this.state.selectedButton == "1" ? 
                                            <Image style={{ width: 22, height: 22.73,marginRight: 10}} source={require('./images/selected.png')}></Image>  
                                            :
                                            <Image style={{ width: 22, height: 22.73,marginRight: 10 }} source={require('./images/notSelected.png')}></Image>  
                                        }                            
                                        <Text style={[filterJobstyles.defaultButtonText, this.state.selectedButton == "1" ? filterJobstyles.selectedButtonTextColor : filterJobstyles.defaultButtonTextColor, ]}>GP Practice</Text>
                                    </View> 
                                </TouchableOpacity>
                            </View>
                            <View style={{width: '40%', alignContent: 'flex-start', paddingLeft: 10, }}>
                                <TouchableOpacity style={filterJobstyles.defaultRightButtonBackGroundColor} onPress={() => {
                                    this.setState({ selectedButton: '2' });

                                }}>
                                    <View style={this.state.selectedButton == "2" ? filterJobstyles.selectedButton : filterJobstyles.defaultButton}>     
                                        {this.state.selectedButton == "2" ? 
                                            <Image style={{ width: 22, height: 22.73,marginRight: 10  }} source={require('./images/selected.png')}></Image>
                                            :
                                            <Image style={{ width: 22, height: 22.73,marginRight: 10  }} source={require('./images/notSelected.png')}></Image>
                                        }
                                        <Text style={[filterJobstyles.defaultButtonText, this.state.selectedButton == "2" ? filterJobstyles.selectedButtonTextColor : filterJobstyles.defaultButtonTextColor]}>OOH</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{alignContent: 'center', paddingTop: 15}}>
                            <TouchableOpacity style={filterJobstyles.defaultButtonBackGroundColor} onPress={() => {
                                this.setState({ selectedButton: '3' });

                            }}>
                                <View style={this.state.selectedButton == "2" ? filterJobstyles.selectedButton : filterJobstyles.defaultButton}>     
                                    {this.state.selectedButton == "3" ? 
                                        <Image style={{ width: 22, height: 22.73,marginRight: 10  }} source={require('./images/selected.png')}></Image>
                                        :
                                        <Image style={{ width: 22, height: 22.73,marginRight: 10 }} source={require('./images/notSelected.png')}></Image>
                                    }
                                    <Text style={[filterJobstyles.defaultButtonText, this.state.selectedButton == "3" ? filterJobstyles.selectedButtonTextColor : filterJobstyles.defaultButtonTextColor]}>Home visit service</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>


                <View style={{flexDirection: 'column', marginTop: 25,marginBottom:15}}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginTop: 10 }}>
                        <View style={{width: '60%', justifyContent: 'center', alignContent: 'flex-start', alignItems: 'flex-start', }}>
                            <Text style={{ fontSize: 18, color: '#414253', fontFamily: Fonts.MontserratMedium, justifyContent: 'flex-start', }}>Date</Text>
                        </View>
                        <View style={{  flexDirection: 'row', width: '40%',  justifyContent: 'center', alignContent: 'flex-end', alignItems: 'flex-end', }}>
                            <View  style={{flex:1,borderBottomColor:'#E6E9ED', borderBottomWidth:1,}}>
                                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => {
                                    this.setState({ startDateOverly: true });
                                }}>
                                    <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:0, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                        <View style={{width:'80%',  justifyContent:'flex-start'}}>
                                            <Text style={{fontSize: 15, color: '#AAB2BD', fontFamily: Fonts.MontserratMedium, }}>{this.state.displayDate}</Text>
                                        </View>
                                        <View  style={{width:'20%',  justifyContent:'flex-end'}}>
                                            <Image style={{ width: 24.5, height: 22.05, }} source={require('./images/calendar.png')}></Image>
                                        </View>
                                    </View> 
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{height:(Dimensions.get('window').height) * 0.23,alignItems:'center',justifyContent:'flex-end',alignSelf:'stretch',margin:5}}>
                    <TouchableOpacity style={[signupstyles.signUpBtnArea, { borderRadius: 15 }]} onPress={() => {
                        console.log("Click Save");
                        AsyncStorage.setItem('filter', 'true');
                        this.props.navigation.state.params.callBack(true, this.state);
                        this.props.navigation.goBack();  
                    }}>
                        <Text style={signupstyles.buttonText}>APPLY FILTERS</Text>
                    </TouchableOpacity>

                </View>
                <Overlay visible={this.state.startDateOverly}
                    onClose={() => { this.setState({ startDateOverly: false }); }}
                    closeOnTouchOutside
                    containerStyle={{ backgroundColor: 'rgba(0,0,0,0.4)'}}
                    childrenWrapperStyle={filterJobstyles.overDatePicker}
                >
                    <Calendar
                        current={this.state.selectedDate}
                        style={filterJobstyles.calendarStyle}
                        onDayPress={(day) => {
                            console.log("Date :", day);
                            this.setState({
                                selectedDate: day.dateString,
                                displayDate: moment(day.dateString, "YYYY-MM-DD").format('DD MMM YYYY'),
                                sendDate: moment(day.dateString, "YYYY-MM-DD").format('DD/MM/YYYY')
                            });
                        }}
                        markedDates={{ [this.state.selectedDate]: { selected: true, disableTouchEvent: true, selectedDotColor: '#00D3A1' } }}
                    />
                </Overlay>
            </ScrollView>
        </View>
        )
    }
}

export default JobFilter;