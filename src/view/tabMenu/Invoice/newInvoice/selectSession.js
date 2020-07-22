import React, { Component } from 'react'
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, NativeModules, Platform, Dimensions, StatusBar, Image,  } from 'react-native'
import CustomHeader from '../../../../components/customHeader/header';
import CheckboxFormX from 'react-native-checkbox-form';
import formStyles from '../../../../components/formTextInput/styles';
import { Button, CheckBox } from 'native-base';
import moment from 'moment';
import { GlobalData } from '../../../../config/global';
import paidStyles from '../paid/styles';
import { Fonts } from '../../../../config/font';
import { signupstyles } from '../../../signup/styles';

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 10 : StatusBarManager.HEIGHT;
const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[{ backgroundColor, height: STATUSBAR_HEIGHT }]}>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
);


const mockData = [
    {
        label: '',
        RNchecked: false
    }
];

export class SelectSession extends Component {

    constructor(props) {
        super(props);
        this.state = {
            spinner: false,
            checked: [],
            selectedSession: null,
            title: 'You have no completed sessions for this practice'
        };

        const { navigation } = this.props;
        this.SessionData = navigation.getParam('SessionDetails');
        if(this.SessionData != null) {
            this.SessionData.forEach(element => {
                this.state.checked.push(false);
            });
        }
    }

    componentDidMount = async () => {
        // if (GlobalData.SELECTED_SESSION['length'] != 0) {
        //     this.SessionData = GlobalData.SELECTED_SESSION;
        // } 
        let tempCheck = this.state.checked;
        if(this.SessionData != null) { 
            this.setState({title: 'Completed sessions'});
            for (let index = 0; index < this.SessionData.length; index++) {
                // console.warn('Sdta: ',this.SessionData[index]);
                if (this.SessionData[index]['checked'] == true) {
                    tempCheck[index] = true;
                    setTimeout(() => {
                        // console.log("2 :", this.state.checked);
                    }, 250);
                }
            }
        }
        // console.warn('tempCheck: ',tempCheck);
        this.setState({ 'checked': tempCheck });

    }

    onClick = async (data,index) => {
        let tempCheck = this.state.checked;
            if (tempCheck[index] == true) {
                tempCheck[index] = false;
            } else {
                tempCheck[index] = true;
            }
            this.setState({ 'checked': tempCheck });

            setTimeout(() => {
                this.onChangeCheck(data.id);
            }, 100);
    }

    onChangeCheck = async (id) => {
        setTimeout(() => {
            console.log("State :", this.state);
        }, 250);

        await this.SessionData.forEach((element, index) => {
            if (element['id'] == id && element['checked'] == undefined) {
                element['checked'] = true;
            } else if (element['id'] == id && element['checked'] == false) {
                element['checked'] = true;
            } else if (element['id'] == id && element['checked'] == true) {
                element['checked'] = false;
            }
        });

        GlobalData.SELECTED_SESSION = this.SessionData;
        // const { goBack } = this.props.navigation;
        this.props.navigation.state.params.onGoBack();
        // goBack();

    }

    render() {
        const { goBack } = this.props.navigation;
        return (
            <View style={{ flex: 1, paddingHorizontal: 20,}}>
            {
                Platform.OS === 'ios' ? <MyStatusBar backgroundColor="#ffffff" barStyle="dark-content" /> : <StatusBar backgroundColor="#ffffff" barStyle="dark-content"  />
            }
                {/* <CustomHeader
                    goBack={goBack.bind(this)}
                    headerStyle={{ color: '#142828', fontFamily: Fonts.Rubik, fontSize: 15 }}
                    headerTitle={'Add Session'}
                /> */}
                <ScrollView>
                    <View style={{  height: (Dimensions.get('window').height) * 0.1, paddingTop: 50,}}>
                        <View>
                            {/* <View style={{flexDirection: 'row', alignContent: 'flex-start'}}>
                                <TouchableOpacity onPress={() => { goBack(); }}>
                                    <Image source = { require('./images/backIcon.png') } style = {{ width: 18, height: 18, marginTop: 3 }}/>
                                </TouchableOpacity>      
                                <Text style={{ fontSize: 18, color: '#414253', fontFamily: Fonts.MontserratBold, paddingLeft: 20 }}>Add Session</Text>
                            </View>   */}
                            <View style={{width: '90%',justifyContent:'flex-start',flexDirection:'row'}}>
                                <TouchableOpacity onPress={() => { goBack(); }} style={{ flexDirection: 'row',}}>
                                    <View style={{justifyContent: 'center', paddingRight: 10}}>
                                        <Image source={require('./images/backIcon.png')} style={{ width: 16, height:16 }}></Image>  
                                    </View>
                                    <View  style={{justifyContent: 'center', }}>
                                        <Text style={{color: '#000000',fontFamily: Fonts.MontserratBold,fontSize: 18,}}>Add Session</Text>                                    
                                    </View> 
                                </TouchableOpacity>                            
                            </View>   
                        </View>
                    </View>
                    <View style={{ paddingTop: 20, }}>
                        <Text style={{ color: '#142828', fontFamily: Fonts.RubikBold, fontSize: 18, fontFamily: 'Rubik', paddingLeft: 10, }}>{this.state.title}</Text>
                    </View>
                    
                    <View style={{ paddingLeft: 3, paddingRight: 15, paddingTop: 30, }}>
                        { 
                            this.SessionData &&

                            this.SessionData.map((data, index) => {
                                return (
                                    <View key={data.id}>
                                    <TouchableOpacity onPress={() => {this.onClick(data,index);}} >
                                        <View style={{ flexDirection: 'row', }}>
                                            <View style={{ justifyContent: 'center', paddingTop: 5, paddingLeft: 0, }}>
                                                
                                                <CheckBox checked={this.state.checked[index]} color={'#2ee5b5'} onPress={() => {this.onClick(data,index);}}  />

                                            </View>
                                            <View style={{ flexDirection: 'column', paddingLeft: 20, }}>
                                                <Text style={{ color: '#142828', fontFamily: Fonts.RubikMedium, fontSize: 15, }}>{moment(data.date, "DD/MM/YYYY").format("DD MMM YYYY")}</Text>
                                                <Text style={{ color: '#aeb7af', fontFamily: Fonts.Rubik, fontSize: 12, paddingTop: 5, }}>{moment(data.start_time, "h:mm a").format("HH:mm")} - {moment(data.end_time, "h:mm a").format("HH:mm")}</Text>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                <Button disabled={true} style={{ height: 25, elevation: 0, textAlign: 'center', backgroundColor: '#e3f8f2', justifyContent: 'center', alignContent: 'center', alignSelf: 'flex-end' }}>
                                                    <Text style={{ fontSize: 11, color: '#2ee5b5', fontFamily: Fonts.Rubik, paddingLeft: 5, paddingRight: 5, }}>Completed</Text>
                                                </Button>
                                            </View>
                                        </View>
                                        <View style={[formStyles.hrLine, formStyles.input, { paddingTop: 20 }]} />
                                        </TouchableOpacity>
                                    </View>
                                )
                            })

                        }



                    </View>

                    <View >
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('NewJobPage'); }} style={{
                            flexDirection: 'row', paddingLeft: 10, alignItems: 'center', alignContent: 'center', alignSelf: 'flex-start',
                            justifyContent: 'center', paddingBottom: 50 
                        }}>
                            <Button style={{ borderRadius: (30/2), backgroundColor: '#2ee5b5', width: 30, height: 30, justifyContent: 'center', textAlign: 'center' }}>
                                <Text style={{ color: '#ffffff', fontSize: 20, position: 'absolute' }}>+</Text>
                            </Button>

                            <Text style={{ paddingLeft: 20, color: '#142828', fontFamily: Fonts.Rubik, fontSize: 15, }}>Create new session</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginBottom: 15, marginTop: 10, paddingVertical:10 }}>
                    <TouchableOpacity style={signupstyles.signUpBtnArea} onPress={() => {
                        // console.log("Go Back");  
                        goBack();
                    }}>
                        <Text style={signupstyles.buttonText}>ADD TO INVOICE</Text>
                    </TouchableOpacity>

                </View>

                </ScrollView>
            </View>
        )
    }
}

export default SelectSession
