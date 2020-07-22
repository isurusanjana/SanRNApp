import React, { Component } from 'react';
import { View, AsyncStorage, Text, TouchableOpacity, ScrollView, Platform,NativeModules, Dimensions, StatusBar, Image, } from 'react-native';
import CustomHeader from '../../../../components/customHeader/header';
import { Button } from 'native-base';

import Spinner from 'react-native-loading-spinner-overlay';
import { Services } from '../../../../services/services';
import { styles } from '../../../login/styles';
import formStyles from '../../../../components/formTextInput/styles';
import { GlobalData } from '../../../../config/global';
import {Fonts} from '../../../../config/font';
import DropDownHolder from "../../../../components/dropDown/dropDownHolder";

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 10 : StatusBarManager.HEIGHT;
const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[{ backgroundColor, height: STATUSBAR_HEIGHT }]}>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
);

class SelectPractice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      showFrom: '',
    };
    this.practiceData = [];
    this.noPractice = false;
    this.setServices = new Services();
    const { navigation } = this.props;
    if (navigation.getParam('PracticeDetails')  && navigation.getParam('PracticeDetails') .constructor === Array && navigation.getParam('PracticeDetails') .length === 0) { 
      this.noPractice = true;
    }
    if(navigation.getParam('PracticeDetails') instanceof Array) {
      this.practiceData = navigation.getParam('PracticeDetails');
    }
  }


  componentDidMount = async () => {
    const { navigation } = this.props;
    const start = navigation.getParam('start');
    this.setState({showFrom: navigation.getParam('showFrom')});
    if (start == 'practice') {
        setTimeout(() => {
            DropDownHolder.dropDown.alertWithType(navigation.getParam('alertType'), '', navigation.getParam('displayMsg'));
        }, 250);
    }
    await AsyncStorage.multiGet(["user_id"
    ]).then(response => {
      console.log("Response :", response);
    })
  }

  refreshPage = async (PracticeDetails) => {
    this.practiceData = PracticeDetails;
  }

  render() {
    const { goBack } = this.props.navigation;
    return (
      <View style={{ flex: 1, paddingHorizontal: 20,}}>
      {
          Platform.OS === 'ios' ? <MyStatusBar backgroundColor="#ffffff" barStyle="dark-content" /> : <StatusBar backgroundColor="#ffffff" barStyle="dark-content"  />
      }
        <ScrollView>
          <View style={{  height: (Dimensions.get('window').height) * 0.1, marginTop: 50}}>
              <View>
                  <View style={{width: '90%',justifyContent:'flex-start',flexDirection:'row'}}>
                      <TouchableOpacity onPress={() => { goBack(); }} style={{ flexDirection: 'row',}}>
                          <View style={{justifyContent: 'center', paddingRight: 10}}>
                              <Image source={require('./images/backIcon.png')} style={{ width: 16, height:16 }}></Image>  
                          </View>
                          <View  style={{justifyContent: 'center', }}>
                              <Text style={{color: '#000000',fontFamily: Fonts.MontserratBold,fontSize: 18,}}>Select healthcare organisation</Text>                                    
                          </View> 
                      </TouchableOpacity>                            
                  </View>  
              </View>
          </View>
          <View style={{ paddingTop: 15 }}>
            {
               this.noPractice == false ?
              this.practiceData.map(data => {
                return (
                  <TouchableOpacity key={data.id} style={{ paddingLeft: 15, paddingRight: 15, height: 80 }} onPress={() => {
                    GlobalData.INVOICE_SELECT_PRACTICE = [];
                    console.log("Data :", data);
                    console.log("Type :", typeof INVOICE_SELECT_PRACTICE);
                    console.log("INVOICE_SELECT_PRACTICE :", GlobalData.INVOICE_SELECT_PRACTICE);
                    GlobalData.INVOICE_SELECT_PRACTICE = data;
                    this.props.navigation.state.params.onGoBack();
                    goBack();
                  }}>
                    <Text style={{ color: '#142828', fontFamily: Fonts.RubikMedium, fontSize: 15 }}>{data.practice_name}   </Text>
                    <Text style={{ color: '#aeb7af', fontFamily: Fonts.Rubik, fontSize: 10 , paddingTop: 5, }}>{data.practice_city}</Text>

                    <View style={[formStyles.hrLine, formStyles.input, { paddingTop: 15, }]} />
                  </TouchableOpacity>
                )
              }) 
              :
              <Text style={{ color: '#142828', fontFamily: Fonts.RubikMedium, fontSize: 15 , paddingLeft:15, paddingRight:10 }}>All completed sessions at practices have been invoiced</Text>
            }
          </View>

          { this.state.showFrom == 'jobs' && 
            <TouchableOpacity onPress={() => {this.props.navigation.navigate('practiceDetailsPage', {callBack: this.refreshPage.bind(this), pointedArea: 'jobs'});}}>
              <View style={{
                flexDirection: 'row', paddingLeft: 15, alignItems: 'center', alignContent: 'center', alignSelf: 'flex-start',
                justifyContent: 'center', paddingBottom: 50,
              }}>
                  <Button style={{ borderRadius: 10, backgroundColor: '#2ee5b5', width: 30, height: 30, justifyContent: 'center', textAlign: 'center'}}>
                    <Text style={{ color: '#ffffff', fontSize: 20, position: 'absolute' }}>+</Text>
                  </Button>
                  <Text style={{ paddingLeft: 20, color: '#142828', fontFamily: Fonts.Rubik, fontSize: 15, }}>Add organisation</Text>
              </View>
            </TouchableOpacity>
          }

          <Spinner
            visible={this.state.spinner}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
        </ScrollView>
      </View>
    );
  }
}

export default SelectPractice;
