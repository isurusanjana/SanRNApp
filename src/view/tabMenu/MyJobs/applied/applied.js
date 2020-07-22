import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Platform, RefreshControl, Dimensions, AsyncStorage } from 'react-native';
import { Button } from 'native-base';
import formStyles from '../../../../components/formTextInput/styles';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import EmptyState from '../../../../components/emptyState/emptyState';
import { Fonts } from '../../../../config/font';
import { Services } from '../../../../services/services';
import { GET_ALLJOBS, GET_JOBBYPRACTICE_URLPART1, JOB_SEARCH } from '../../../../config/shared';
import { ServiceParams } from '../../../../services/serviceParams';
import Spinner from 'react-native-loading-spinner-overlay';
import { styles } from '../../../login/styles';
import moment from 'moment';
import PTRView from 'react-native-pull-to-refresh';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import InvoiceSort from '../../../../components/invoiceSort/invoiceSort';
import { Common } from '../../../../services/common';
import Job from '../../../../components/jobCard/job';

class AppliedJobs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobApplied: [],
            MyJobData: false,
            spinner: false,
            sortVisible: false,
            fromFilter: false,
            applied: false,
            filterData: null,
            emptyImage: null,
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
                    // this.setState({ jobApplied: [] });
                }, {
                    value: 'All',
                    id: 5,
                    selected: true,
                    sort: 'data'
                },
            ],
            refreshDefault: null,
            isJobAppliedOn: false
        };

        this.data = this.props.data;
        this.userID = this.props.userID;
        this.JobType = this.props.jobType;

        this.setService = new Services();
        this.CommonService = new Common();
        // console.warn("Applied JS Data :", this.data);
    }

    componentDidMount = async () => {
        this.setState({refreshDefault: await AsyncStorage.getItem('refreshDefault')});

        if (this.JobType != 'calendar') {
            await this.getJobDetails();
        } else {
            var applicationOn = this.data.length == 0 ? false: true;
            await this.setState({
                 'jobApplied': this.data,
                 'MyJobData': true,
                 'isJobAppliedOn': applicationOn
             });
             this.setState({ spinner: false });
        }

        // if (this.state.fromFilter == false || this.JobType == 'calendar' ) {
            
        // }

        // if(this.state.fromFilter == false) {
             this.focusListener = await this.props.navigationData.addListener('didFocus', async () => {
                 let filteredItem = await AsyncStorage.getItem('filter');
                if(filteredItem != 'true') {
                    if (this.JobType != 'calendar') {
                        await this.getJobDetails();
                    } else {
                        var applicationOn = this.data.length == 0 ? false: true;
                        await this.setState({
                             'jobApplied': this.data,
                             'MyJobData': true,
                             'isJobAppliedOn': applicationOn
                         });
                         this.setState({ spinner: false });
                    }
                }
                
                // AsyncStorage.setItem('refreshDefault', '0');
            })
        // }


        await this.setState({emptyImage: (this.JobType == 'all') ? require('./images/search_jobs_empty.png') : require('./images/applied_jobs_empty.png')});
    }

    refreshPage = async () => {
        this.setState({ jobApplied: [] });
        this.setState({ MyJobData: false });
        this.setState({ spinner: true });
        // if (this.state.fromFilter == true) {
            if (this.state.applied == true) {
                this.setState({ spinner: true });
                await this.setState({ fromFilter: true });
                let SearchData = await this.CommonService.JobSearch(this.userID, this.state.filterData, 1, this.JobType);
                await this.setState({
                    MyJobData: true,
                    jobApplied: SearchData,
                });
                this.setState({ spinner: false });
            } else {
                this.setState({ spinner: true });
                return this.getJobDetails();
            }
        //     this.setState({ jobApplied: [] });
        // } else {
        //     this.getJobDetails();
        // }
        AsyncStorage.setItem('filter', 'false');
    }

    componentWillUnmount() {
        if(this.state.fromFilter == false) {
            this.focusListener.remove()
        }
    }

    getJobDetails = async () => {
        this.setState({ spinner: true });
        let url = (this.JobType == 'all') ? GET_JOBBYPRACTICE_URLPART1 + this.userID + JOB_SEARCH : GET_ALLJOBS + this.userID;
        await this.setService.postService(url, ServiceParams.getJobParams())
            .then(async (responseData) => {
                console.log("responseData :", responseData);

                if (responseData.info.job_bid instanceof Array) {
                    this.setState({ jobApplied: [] });
                    await responseData.info.job_bid.forEach(element => {
                        element['start_time'] = moment(element['start_time'], "hh:mm A").format("HH:mm");
                        element['end_time'] = moment(element['end_time'], "hh:mm A").format("HH:mm");
                        element['show_date'] = moment(element['date'], "DD/MM/YYYY").format("DD");
                        element['show_month'] = moment(element['date'], "DD/MM/YYYY").format("MMM").toUpperCase();
                        element['invoice_practice_type'] = 'applied';
                        element['total_amount'] = (this.JobType == 'all' ? element['total_amount'] : element['total']);
                        if (this.JobType == 'all' || this.JobType == 'calendar') {
                            if (element['is_applied'] == 0) {
                                this.state.jobApplied.push(element);
                            }
                        }
                        if (element['is_applied'] == 1 || element['is_applied'] == 2) {
                            this.state.jobApplied.push(element);
                        } else if (element['is_applied'] == 3 || element['is_applied'] == 4) {
                            // this.state.jobBooked.push(element);
                        }
                    });
                }

                var applicationOn = this.state.jobApplied.length == 0 ? false: true;
                // this.setState({ jobApplied: [] });
                await this.setState({
                    'MyJobData': true,
                    fromFilter: false,
                    isJobAppliedOn: applicationOn
                });


                this.setState({ spinner: false });
            }, (error) => {
                this.InvoicesData = true;
                this.setState({ spinner: false });
                this.setState({ 'MyJobData': false });
                this.setState({ isJobAppliedOn: false });
            })
    }

    _refresh = (resolve) => {
        let that = this;
        this.data = [];
        this.setState({
            MyJobData: false,
            jobApplied: [],
            isJobAppliedOn: false 
        })
        this.setState({ spinner: true });
        return that.getJobDetails();
    }

    onClose(data, value) {
        this.setState({ sortVisible: false });
    };

    filterResponse = async (applied, data) => {
        // // console.warn('dddd')
        // this.focusListener.remove();
        await this.setState({ fromFilter: true });
        await this.setState({ applied: applied });
        await this.setState({ filterData: data });
        this.refreshPage();
    }

    render() {
        const win = Dimensions.get('window');
        const emptyState =
            <View style={{ flex: 1, width: win.width }}>
                <EmptyState
                    title="No Jobs" 
                    vectorImage={this.state.emptyImage} 
                    displayMessage=''
                    callBack={this._refresh}
                />
            </View>

        // const emptyState = <PTRView  onRefresh={this._refresh} ><EmptyState
        //     title="No Jobs"
        //     vectorImage={require('./images/applied_jobs_empty.png')} 
        //     displayMessage=''
        // /></PTRView>

        const dataState = <PTRView onRefresh={this._refresh} ><View style={{paddingHorizontal: 20}}>
            <View style={{ paddingTop: (Platform.OS === 'android' ? 20 : 35), flexDirection: 'row', paddingLeft: 10, marginBottom: 15, alignContent: 'center', alignItems: 'center', alignSelf: 'center'}}>
            <View style={{ width: '33%'}}></View>
            <View style={{ width: '33%', alignContent: 'center', alignItems: 'center', alignSelf: 'center', flexDirection: 'row'}}>
                <Text style={{ fontSize: 15, fontFamily: Fonts.MontserratBold, textAlignVertical: 'bottom', color: '#142828', alignContent: 'center', alignItems: 'center', alignSelf: 'center', }}>All Jobs</Text>
                <Text style={{ color: '#CCD1D9', fontFamily: Fonts.MontserratBold, fontSize: 13, textAlignVertical: 'bottom', paddingBottom: 1, paddingTop: (Platform.OS === 'android' ? 0 : 3) }}>   {this.state.jobApplied.length} Items</Text>
            </View>
            <View style={{ width: '33%'}}>{this.JobType == 'all' &&
                    <View style={{ flex: 1, justifyContent: 'flex-end', alignContent: 'flex-end', alignItems: 'flex-end', alignSelf: 'flex-end' }}>
                        <TouchableOpacity onPress={() => {
                            // this.setState({ "sortVisible": true });
                            this.props.navigationData.navigate('jobFilterPage',
                                {
                                    callBack: this.filterResponse.bind(this)
                                });
                        }}>
                            <Image style={{ width: 20, height: 20 }} source={require('./images/filter.png')}></Image>
                        </TouchableOpacity>
                    </View>
                }</View>
                
                {/* <Text style={{ flex: 1, color: '#aeb7af', justifyContent: 'flex-end', textAlign: 'right', textAlignVertical: 'bottom', }}>  . . .</Text> */}
                
            </View>
            <ScrollView style={{ marginBottom: 50, }}>
                {/* style={{ backgroundColor:  '#'+Math.floor(Math.random()*16777215).toString(16) }} */}

                {
                    this.state.jobApplied.map(data => {
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
                        if(data['charge_by_hour'] == "1" || data['charge_type'] == "1") {
                            data['charge_rate'] = ((data['post_hour_rate'] == null || data['post_hour_rate'] == '' ) ? data['hourly_rate'] : ((data['post_hour_rate'] == null || data['post_hour_rate'] == '' ) ? data['charge_rate'] : data['post_hour_rate']));
                        } else {
                            data['charge_rate'] = (this.JobType == 'calendar' && data['charge_rate'] != undefined ? data['charge_rate'] : ((data['post_session_rate'] == null || data['post_session_rate'] == '' ) ? data['session_rate'] : ((data['post_session_rate'] == null || data['post_session_rate'] == '' ) ? data['charge_rate'] : data['post_session_rate']))) ;
                        }
                        return (<Job key={parseInt(data['job_id']) * Math.random()}  callBack={() => {
                        console.warn("Job Details : ", data);
                        this.props.navigationData.navigate('ViewJobPage', {
                            data: data,
                            jobType: this.JobType == 'all' ? 'all' : (this.JobType == 'calendar' ? 'calendar' : 1),
                            statusTitle: this.JobType == 'all' ? 'Search' : (this.JobType == 'calendar' ? 'Calendar' : 'Applied'),
                            pageRefresh: this.refreshPage.bind(this)
                        });
                        }} data={data} listType={this.JobType == 'all' ? 'all' : (this.JobType == 'calendar' ? 'calendar' : 1)} />)
                    })
                }
                

            </ScrollView>
        </View>
        </PTRView>

        return (
            <View style={{ flex: 1, }}>
                {
                    (this.state.MyJobData == true && this.state.fromFilter == false && this.state.isJobAppliedOn == false ) ? emptyState : dataState 
                }

                <Spinner
                    visible={this.state.spinner}
                    textContent={'Loading...'}
                    textStyle={styles.spinnerTextStyle}
                />

                <InvoiceSort title={'Filter By'} sortOption={this.state.sortOption} visible={this.state.sortVisible} onClose={this.onClose.bind(this)} />
            </View>
        );
    }
}

export default AppliedJobs;
