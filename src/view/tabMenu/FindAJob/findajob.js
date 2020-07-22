import React, { Component } from 'react';
import { View, Text, StatusBar, AsyncStorage, Dimensions, TouchableOpacity, Image } from 'react-native';
import { findajobstyles } from './styles';
import { Header, Body } from 'native-base';
import DropDownHolder from '../../../components/dropDown/dropDownHolder';
import AddItem from '../../../components/addItem/addItem';
import { SearchBar } from 'react-native-elements';
import AppliedJobs from '../MyJobs/applied/applied';

import Spinner from 'react-native-loading-spinner-overlay';
import { GET_ALLJOBS, GET_JOBBYPRACTICE_URLPART1, JOB_SEARCH } from '../../../config/shared';
import { ServiceParams } from '../../../services/serviceParams';
import moment from 'moment';
import { styles } from '../../login/styles';
import { Services } from '../../../services/services';


class FindAJob extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobdata: [],
      user_id: null,
      spinner: false,
      MyJobData: false,
    };

    this.setService = new Services();
    // this.dropdown = new DropDownHolder();
  }

  async componentDidMount() {
    const { navigation } = this.props;
    AsyncStorage.setItem('filter', 'false');
    const start = navigation.getParam('start');
    if (start == 'login') { 
      setTimeout(() => {
        DropDownHolder.dropDown.alertWithType(navigation.getParam('alertType'), '', navigation.getParam('displayMsg'));
      }, 250);
    }

    await AsyncStorage.multiGet(["user_id"
    ]).then(async response => {
      console.log("Response :", response);
      await this.setState({ "user_id": response[0][1] });
      await this.setState({ "MyJobData": true });
      // this.setState({ 'spinner': true });
      // this.getJobDetails(response[0][1]);
    })

    // this.focusListener = this.props.navigation.addListener('didFocus', () => {
    //   if (AsyncStorage.getItem('filter') == 'false') {
    //     this.setState({
    //       MyJobData: false,
    //       jobdata: [],
    //     });
    //     this.onFocusFunction()
    //   }

    // })
  }

  // onFocusFunction = async () => {
  //   await AsyncStorage.multiGet(["user_id"
  //   ]).then(response => {
  //     // this.setState({ 'spinner': true });
  //     this.getJobDetails(response[0][1]);
  //   })
  // }
  

  // componentWillUnmount () {
  //   this.focusListener.remove()
  // }

  // getJobDetails(user_id) { 
  //   // this.setState({ 'spinner': true });
  //   this.setState({ user_id: user_id });
  //   this.setService.postService(GET_JOBBYPRACTICE_URLPART1 + user_id + JOB_SEARCH, ServiceParams.getJobParams())
  //     .then((responseData) => {
  //         this.setState({ 'spinner': false });
  //       if (responseData.info.job_bid instanceof Array) {
  //         responseData.info.job_bid.forEach(element => {
  //           element['start_time'] = moment(element['start_time'], "hh:mm A").format("HH:mm");
  //           element['end_time'] = moment(element['end_time'], "hh:mm A").format("HH:mm");
  //           element['show_date'] = moment(element['date'], "DD/MM/YYYY").format("DD");
  //           element['show_month'] = moment(element['date'], "DD/MM/YYYY").format("MMM").toUpperCase();
  //           element['invoice_practice_type'] = 'applied';
  //           if (element['is_applied'] == 0 || element['is_applied'] == 1 || element['is_applied'] == 2) {
  //             this.state.jobdata.push(element);
  //           } else if (element['is_applied'] == 3 || element['is_applied'] == 4) {
  //             // this.state.jobBooked.push(element);
  //           }
  //         });
  //       }

  //       this.setState({ 'MyJobData': true });

  //     }, (error) => {
  //       this.InvoicesData = true;
  //       this.setState({ 'spinner': false });
  //     })
  // }
 

  forceClose() {
    this.dropdown.close();
  }


  render() {

    const { navigate } = this.props.navigation;
    const win = Dimensions.get('window');
    return (
      <View style={findajobstyles.container}>
        <Header elevation={3} transparent>
          <StatusBar
            backgroundColor="#FFFFFF"
            barStyle="dark-content"
          />
          {/* <Body>
            <Text style={findajobstyles.headerText}> Find a Job </Text>
          </Body> */}

          <View style={{ flexDirection: 'row', height: (Dimensions.get('window').height) * 0.1, paddingHorizontal: 10, paddingTop: 5 }}>
  
            <View style={{ width: '67%', textAlign: 'left'  }}>
              <Text style={findajobstyles.headerText}>Available sessions</Text></View>

            <View style={{ width: '33%', alignItems: 'flex-end', justifyContent: 'center', }}>
              {/* <TouchableOpacity style={{ backgroundColor: '#2ee5b5', borderRadius: 10 }} onPress={() => { this.props.navigation.navigate('jobCalenderSearchPage'); }}>
                <Image source={require('./images/calendar.png')} style={{ width: 25, height: 25, }} />
              </TouchableOpacity> */}
            </View>
          </View>


        </Header>

        <View style={{ flex: 1 , width : win.width }}> 

          {
            this.state.MyJobData == true ? <AppliedJobs jobType={'all'} data={this.state.jobdata} navigationData={this.props.navigation} userID={this.state.user_id} /> : null
          }


        </View> 


        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />

      </View>
    );
  }
}

export default FindAJob;

