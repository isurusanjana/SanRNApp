import React, { Component } from 'react';
import { View, StatusBar,Text, AsyncStorage, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Header, Body } from 'native-base';
import { myjobstyles } from './styles';
import CustomTab, { tabHeadingStyles } from '../../../components/CustomTabs/CustomTab';
import Spinner from 'react-native-loading-spinner-overlay';
import AddItem from '../../../components/addItem/addItem';
import { GET_ALLJOBS } from '../../../config/shared';
import { Services } from '../../../services/services';
import { styles } from '../../login/styles';
import AppliedJobs from './applied/applied';
import BookedJobs from './booked/booked';
import { ServiceParams } from '../../../services/serviceParams';
import moment from 'moment';
import { findajobstyles } from '../FindAJob/styles';

class MyJobs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      MyJobData: false,
      jobApplied: [],
      jobBooked: [],
      user_id: null,
      spinner: false,
      bookedTabSection: false
    };

    this.setService = new Services();

  }

  componentDidMount = async () => {
    // this.setState({ 'spinner': true });
    await AsyncStorage.multiGet(["user_id"
    ]).then(async response => {
      console.log("Response :", response);
      await this.setState({ "user_id": response[0][1] });
      await this.setState({ "MyJobData": true });
      // this.getJobDetails(response[0][1]);
      
    })

    // this.focusListener = this.props.navigation.addListener('didFocus', () => {
    //   this.setState({
    //     // MyJobData: false,
    //     jobApplied: [],
    //     jobBooked: [],
    //   });
    //   this.onFocusFunction()
    // })
  }

  // onFocusFunction = async () => {
  //   this.setState({ 'spinner': true });
  //   await AsyncStorage.multiGet(["user_id"
  //   ]).then(response => {
  //     console.log("Response :", response);
  //     this.getJobDetails(response[0][1]);
  //   })
  // }
  

  // componentWillUnmount () {
  //   this.focusListener.remove()
  // }

  // getJobDetails(user_id) {
  //   this.setState({ 'spinner': true });
  //   this.setState({ user_id: user_id });
  //   this.setService.postService(GET_ALLJOBS + user_id, ServiceParams.getJobParams())
  //     .then((responseData) => {
  //       // console.warn("responseData :", responseData);

  //       if (responseData.info.job_bid instanceof Array) {
  //         responseData.info.job_bid.forEach(element => {
  //           element['start_time'] = moment(element['start_time'], "hh:mm A").format("HH:mm");
  //           element['end_time'] = moment(element['end_time'], "hh:mm A").format("HH:mm");
  //           element['show_date'] = moment(element['date'], "DD/MM/YYYY").format("DD");
  //           element['show_month'] = moment(element['date'], "DD/MM/YYYY").format("MMM").toUpperCase();
  //           if (element['is_applied'] == 1 || element['is_applied'] == 2) {
  //             this.state.jobApplied.push(element);
  //           } else if (element['is_applied'] == 3 || element['is_applied'] == 4) {
  //             // this.state.jobBooked.push(element);
  //           }
  //         });
  //       }

  //       // if (responseData.info.own_job instanceof Array) {
  //       //   responseData.info.own_job.forEach(element => {
  //       //     element['start_time'] = moment(element['start_time'], "hh:mm A").format("HH:mm");
  //       //     element['end_time'] = moment(element['end_time'], "hh:mm A").format("HH:mm");
  //       //     element['show_date'] = moment(element['date'], "DD/MM/YYYY").format("DD");
  //       //     element['show_month'] = moment(element['date'], "DD/MM/YYYY").format("MMM").toUpperCase();
  //       //     this.state.jobBooked.push(element);
  //       //   });
  //       // }

  //       this.setState({ 'spinner': false });
  //       this.setState({ 'MyJobData': true });

  //     }, (error) => {
  //       this.InvoicesData = true;
  //       this.setState({ 'spinner': false });
  //     })
  // }


  displayID(id) {
    // if (id == 1) {
    //   this.setState({ 'bookedTabSection': true });
    // }
    // else {
    //   this.setState({ 'bookedTabSection': false });
    // }
  }

  render() {
    const { navigate } = this.props.navigation;
    const TabsComponent = <CustomTab callBack={this.displayID.bind(this)}>
      {/* First tab */}
      <View title="APPLIED" style={tabHeadingStyles.content}>
        <AppliedJobs data={this.state.jobApplied} navigationData={this.props.navigation} userID={this.state.user_id}  jobType={'applied'} />
      </View>
      {/* Second tab */}
      <View title="BOOKED" style={tabHeadingStyles.content}>
        <BookedJobs data={this.state.jobBooked} navigationData={this.props.navigation} userID={this.state.user_id} />
      </View>
    </CustomTab>
    return (
      <View style={myjobstyles.container}>
        <Header elevation={3} transparent> 

        <StatusBar
            backgroundColor="#FFFFFF"
            barStyle="dark-content"
          />

          <View style={{ flexDirection: 'row', height: (Dimensions.get('window').height) * 0.1, paddingHorizontal: 10, paddingTop: 5 }}> 
            <View style={{ width: '67%'}}>
              <Text style={myjobstyles.headerText}>My Jobs</Text>
            </View>

            <View style={{ width: '33%', alignItems: 'flex-end', justifyContent: 'center', }}>
              <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('jobCalenderSearchPage', {
                  SendJobType: this.state.bookedTabSection == true ? 2 : 1
                });
              }}>
                <Image source={require('./images/calendar.png')} style={{ width: 20, height: 22, }} />
              </TouchableOpacity>
            </View>
          </View>

        </Header>

        {this.state.MyJobData == true ? TabsComponent : null}



        {/* {
          this.state.bookedTabSection == true &&
          <AddItem style={{ zIndex: 5 }}
            Navigation={this.props.navigation}
            goToPage={'NewJobPage'}
          />

        } */}

        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
      </View>
    );
  }
}

export default MyJobs;
