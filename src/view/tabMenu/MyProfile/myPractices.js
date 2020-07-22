import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, Text, Image, 
  TouchableOpacity, BackHandler, SafeAreaView, ScrollView, 
  ImageBackground, AsyncStorage, WebView, Platform, NativeModules } from 'react-native';
import { Header, Left, Body, Right, Icon, Button, Tabs, Tab, ScrollableTab, Title  } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import { myprofilestyles, profileStyles } from './styles';
import PTRView from 'react-native-pull-to-refresh';

import CustomHeader from '../../../components/customHeader/header';
import { Services } from '../../../services/services';
import { styles } from '../../login/styles';
import formStyles from '../../../components/formTextInput/styles';
import { GlobalData } from '../../../config/global';
import {Fonts} from '../../../config/font';
import { MY_PRACTICES_PART1, MY_PRACTICES_PART2,  } from '../../../config/shared';
import AddItem from '../../../components/addItem/addItem';
import DropDownHolder from "../../../components/dropDown/dropDownHolder";
import LinearGradient from 'react-native-linear-gradient';


const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBarManager.HEIGHT;
const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[statusBarStyles.statusBar, { backgroundColor }]}>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
);

class SelectPractice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: true,
      showFrom: '',
      user_id: 0,
      practiceData: []
    };
    this.data = this.props.data;
    this.setServices = new Services();
  }


  componentDidMount = async () => {
    await AsyncStorage.multiGet(["user_id"
    ]).then(response => {
        this.setState({ user_id: response[0][1] });
    });

    await this.getPracticeData();

  }

  getPracticeData = async () => {
    // console.warn('Practice func');
    await this.setServices.getService(MY_PRACTICES_PART1 + this.state.user_id + MY_PRACTICES_PART2, "")
        .then(async (responseData) => {
            if (responseData.error == 0) {
                await this.setState({ practiceData:responseData.info});
            }

            this.setState({ spinner: false });
        }, (error) => {
            this.setState({ spinner: false });
            console.warn("error Data :", error);
        })
}

  refreshPage = async (PracticeDetails) => {
    this.setState({
      practiceData: []
    })
    this.setState({ spinner: true });
    await this.getPracticeData();
  }

  _refresh = async (resolve) => {
    let that = this;

    this.data = [];
    this.setState({
      practiceData: []
    })
    // this.setState({ 'spinner': true });
    await that.getPracticeData();
  }

  render() {
    const { goBack } = this.props.navigation;
    return (
      <View style={{ flex: 1, height: 280,}}>
        <ImageBackground source={require('./images/my_practices_background.png')} style={{height: 280, }}>
          <StatusBar
              barStyle="light-content"
              translucent 
              backgroundColor="transparent"
          />
          <View style={{ flexDirection: 'row', marginTop: 50, paddingHorizontal: 20}}>
            <View style={{ flex:1, flexDirection:'row',}}>
                  <View style={{width: '80%',justifyContent:'flex-start',flexDirection:'row'}}>
                    <TouchableOpacity onPress={() => { goBack() }} style={{ flexDirection: 'row', }}>
                        <View style={{justifyContent: 'center', paddingRight: 10}}>
                            <Image source={require('./images/whiteBackIcon.png')} style={{ width: 16, height:16 }}></Image>  
                        </View>
                        <View  style={{justifyContent: 'center', paddingRight: 10}}>
                            <Text style={{ color: '#FFFFFF',fontFamily: Fonts.MontserratBold,fontSize: 16}}>Healthcare organisations</Text>
                        </View>                    
                    </TouchableOpacity>
                  </View>
                  <View style={{width: '20%', flexDirection:'row',justifyContent:'flex-end',paddingRight:15}}>
                    <TouchableOpacity style={{marginRight:20}} onPress={() => {
                    this.setState({ moreOverLay: true });
                    }}>
                        <Image  source={require('./images/Group-83.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                    this.setState({ moreOverLay: true });
                    }}>
                        <Image  source={require('./images/Group-84.png')}/>
                    </TouchableOpacity>
                  </View> 
            </View> 
          </View>  
          <View style={{flex:1,marginTop:45, paddingHorizontal: 20}}>
                <Text style={{color:'#fff', fontSize:20, fontFamily:Fonts.MontserratBold, textAlign:'left'}}>Save healthcare organisations {"\n"}details for easy {"\n"}invoicing</Text>
          </View>  
        </ImageBackground>     
        <PTRView style={{ marginTop: 0 }} onRefresh={this._refresh} >                             
          <ScrollView>
            <View style={{ paddingTop: 15,paddingHorizontal: 20 }}>
              {
                  this.state.practiceData != [] ?
                this.state.practiceData.map(data => {
                  return (
                    <TouchableOpacity key={data.id} style={{ height: 80 }} onPress={() => {
                        this.props.navigation.navigate('practiceDetailsPage', 
                        {practiceData: data, edit: true, pageRefresh: this.refreshPage.bind(this)});
                      }}>
                      <Text style={{ color: '#142828', fontFamily: Fonts.MontserratBold, fontSize: 15 }}>{data.practice_name}   </Text>
                      <Text style={{ color: '#aeb7af', fontFamily: Fonts.MontserratMedium, fontSize: 10 , paddingTop: 5, }}>{data.practice_city}</Text>

                      <View style={[formStyles.hrLine, formStyles.input, { paddingTop: 15, }]} />
                    </TouchableOpacity>
                  )
                }) 
                :
                <Text style={{ color: '#142828', fontFamily: Fonts.MontserratMedium, fontSize: 15 , }}>All completed sessions at practices have been invoiced</Text>
              }
            </View>
            <Spinner
              visible={this.state.spinner}
              textContent={'Loading...'}
              textStyle={styles.spinnerTextStyle}
            />
          </ScrollView>
        </PTRView>
        <AddItem style={{ zIndex: 5 }}
            Navigation={this.props.navigation}
            goToPage={'practiceDetailsPage'}
            CallBack={{
                pageRefresh: this.refreshPage.bind(this)
          }}
          />
      </View>
    );
  }
}

export default SelectPractice;

const statusBarStyles = StyleSheet.create({
  statusBar: {
      height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
  },
});