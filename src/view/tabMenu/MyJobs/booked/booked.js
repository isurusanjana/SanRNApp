import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Button } from 'native-base';
import formStyles from '../../../../components/formTextInput/styles';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import EmptyState from '../../../../components/emptyState/emptyState';
import { Fonts } from '../../../../config/font';
import { Services } from '../../../../services/services';
import { GET_ALLJOBS, MYJOBS } from '../../../../config/shared';
import { ServiceParams } from '../../../../services/serviceParams';
import Spinner from 'react-native-loading-spinner-overlay';
import { styles } from '../../../login/styles';
import moment from 'moment';
import PTRView from 'react-native-pull-to-refresh';
import InvoiceSort from '../../../../components/invoiceSort/invoiceSort';
import { Common } from '../../../../services/common';
import AddItem from '../../../../components/addItem/addItem';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Job from '../../../../components/jobCard/job';

class BookedJobs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobBooked: [],
      MyJobData: false,
      spinner: true,
      fromFilter: false,
      showBody: false,
      sortOption: [
        {
          value: 'GP Surgery',
          id: 1,
          selected: false,
          sort: 'data'
        }, {
          value: 'Out of Hours',
          id: 2,
          selected: false,
          sort: 'data'
        }, {
          value: 'Home Visit Service',
          id: 3,
          selected: false,
          sort: 'data'
        }, {
          value: 'Remote Service',
          id: 4,
          selected: false,
          sort: 'data'
        }, {
          value: 'All',
          id: 5,
          selected: true,
          sort: 'data'
        },
      ]
    };


    this.data = this.props.data;
    this.userID = this.props.userID;

    this.setService = new Services();
    this.CommonService = new Common();
    console.log("Booked JS Data :", this.data);
    //     if(navigation.getParam('backFrom') instanceof Array) {
    //   console.warn(navigation.getParam('backFrom'));
    // }

  }

  componentDidMount = async () => {
    await this.getJobDetails();

    this.focusListener = this.props.navigationData.addListener('didFocus', () => {
      this.onFocusFunction()
    });
  }

  onFocusFunction = async () => {
    this.setState({ 'spinner': true });
    this.data = [];
    this.setState({
      MyJobData: false,
      jobBooked: []
    });

    await this.getJobDetails();
  }

  componentWillUnmount() {
    this.focusListener.remove()
  }


  getJobDetails() {
    this.setService.postService(MYJOBS + this.userID, ServiceParams.getJobParams())
      .then((responseData) => {
        if (responseData.info instanceof Array) {
          responseData.info.forEach(element => { 
            element['start_time'] = moment(element['start_time'], "hh:mm A").format("HH:mm");
            element['end_time'] = moment(element['end_time'], "hh:mm A").format("HH:mm");
            element['show_date'] = moment(element['date'], "DD/MM/YYYY").format("DD");
            element['show_month'] = moment(element['date'], "DD/MM/YYYY").format("MMM").toUpperCase();
            element['total_amount'] =  element['total'];
            this.state.jobBooked.push(element);
          });
        }

        this.setState({ 'spinner': false });
        this.setState({
          'MyJobData': true,
          fromFilter: false
        });

      }, (error) => {
        this.InvoicesData = true;
        this.setState({ 'spinner': false });
        this.setState({ 'MyJobData': true });
      })
  }

  _refresh = (resolve) => {
    let that = this;

    this.data = [];
    this.setState({
      MyJobData: false,
      jobBooked: []
    })
    this.setState({ 'spinner': true });
    return that.getJobDetails();
  }

  onClose(data, value) {

    this.setState({ sortVisible: false });

  };

  filterResponse = async (applied, data) => {
    let that = this;
    this.data = [];
    this.setState({
      MyJobData: false,
      jobBooked: []
    })

    if (applied == true) {
      this.setState({ 'spinner': true });
      let SearchData = await this.CommonService.JobSearch(this.userID, data, 2, 'booked');
      this.setState({
        MyJobData: true,
        jobBooked: SearchData,
        fromFilter: true
      });
      this.setState({ 'spinner': false });
    } else if (applied == false) {
      this.setState({ 'spinner': true });
      return that.getJobDetails();
    }

  }

  pageRefreshOnNewJob = async () => {
    this.data = [];
    this.setState({
      MyJobData: false,
      jobBooked: []
    })
    this.setState({ 'spinner': true });
    return this.getJobDetails();
  }

  render() {

    const win = Dimensions.get('window');
    const emptyState =
      <View style={{ flex: 1, width: win.width }}>
        <EmptyState
          title="No Jobs"
          vectorImage={require('./images/booked_jobs_empty.png')}
          displayMessage=''
          callBack={this._refresh}
        />
      </View>

    const dataState = <PTRView style={{ marginTop: 0 }} onRefresh={this._refresh} ><View style={{paddingHorizontal: 20}}>
      <View style={{ paddingTop: 18, flexDirection: 'row', paddingLeft: 10, marginBottom: 15, alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
        <Text style={{ fontSize: 15, fontFamily: Fonts.MontserratBold, textAlignVertical: 'bottom', color: '#414253',}}>All Jobs</Text>
        <Text style={{ color: '#CCD1D9', fontFamily: Fonts.MontserratBold, fontSize: 13, textAlignVertical: 'bottom', paddingLeft: 10, paddingBottom: 1, paddingTop: (Platform.OS === 'android' ? 0 : 3) }}>{this.state.jobBooked.length} Items</Text>
      </View>
      <ScrollView style={{ marginBottom: 50, }}>
        {/* style={{ backgroundColor:  '#'+Math.floor(Math.random()*16777215).toString(16) }} */}
        {
          this.state.jobBooked.map(data => {
            switch(data['named_status']) {
                case 'Invoiced' : 
                    data['statusBack'] = '#FFFFFF';
                    data['statusFont'] = '#AAB2BD';
                break;
                case 'Completed' : 
                    data['statusBack'] = '#C7F5E8';
                    data['statusFont'] = '#00D3A1';
                break;
                case 'Upcoming' : 
                    data['statusBack'] = '#FFEFB8';
                    data['statusFont'] = '#F48400';
                break;
            }

            
            return (<Job key={parseInt(data['date']) * Math.random()} callBack={() => {
              console.log("Job Details : ", data);
              this.props.navigationData.navigate('ViewJobPage', {
                data: data,
                jobType: 2,
                statusTitle: 'Booked',
                pageRefresh: this.pageRefreshOnNewJob.bind(this)
              });
            }} data={data} listType={2} />)
          })
        }

      </ScrollView>
    </View>
    </PTRView>

    return (
      <View style={{ flex: 1 }}>
        {this.state.MyJobData == true && this.state.jobBooked.length == 0 && this.state.fromFilter == false ? emptyState : this.state.MyJobData == true ? dataState : null}

        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        <InvoiceSort title={'Filter By'} sortOption={this.state.sortOption} visible={this.state.sortVisible} onClose={this.onClose.bind(this)} />

        <AddItem style={{ zIndex: 5 }}
          Navigation={this.props.navigationData}
          goToPage={'NewJobPage'}
          CallBack={{
            pageRefresh: this.pageRefreshOnNewJob.bind(this)
          }}
        />
      </View>
    );
  }
}

export default BookedJobs;
