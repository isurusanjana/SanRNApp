import { Services } from "./services";
import { GET_JOBBYPRACTICE_URLPART1, JOB_SEARCH, GET_ALLJOBS } from "../config/shared";
import { ServiceParams } from "./serviceParams";
import moment from 'moment';

export class Common {

    constructor() {
        this.JobData = [];
        this.JobBooked = [];
        this.setService = new Services();
    }

    JobSearch = async (user_id, params, job_type, type) => {
        this.JobData = [];
        let url = (type == 'all') ? GET_JOBBYPRACTICE_URLPART1 + user_id + JOB_SEARCH : GET_ALLJOBS + user_id;
        return this.setService.postService(url, ServiceParams.setJobSearchParams(params))
            .then((responseData) => {
                console.log("responseData :", responseData);

                if (responseData.info != undefined) {
                    if (responseData.info.job_bid instanceof Array) {
                        responseData.info.job_bid.forEach(element => {
                            element['start_time'] = moment(element['start_time'], "hh:mm A").format("HH:mm");
                            element['end_time'] = moment(element['end_time'], "hh:mm A").format("HH:mm");
                            element['show_date'] = moment(element['date'], "DD/MM/YYYY").format("DD");
                            element['show_month'] = moment(element['date'], "DD/MM/YYYY").format("MMM").toUpperCase();
                            console.log("Job Type :", type);
                            if (type == 'all') {
                                if (element['is_applied'] == 0) {
                                    this.JobData.push(element);
                                }
                            }
                            if( type == 'applied') {
                                if (element['is_applied'] == 1 || element['is_applied'] == 2) {
                                    this.JobData.push(element);
                                } else if (element['is_applied'] == 3 || element['is_applied'] == 4) {
                                    // this.JobBooked.push(element);
                                }
                            } 

                            // if (element['is_applied'] == 1 || element['is_applied'] == 2) {
                            //     this.JobData.push(element);
                            // } else if (element['is_applied'] == 3 || element['is_applied'] == 4) {
                            //     // this.JobBooked.push(element);
                            // }
                        });
                    }

                    // if (responseData.info.own_job instanceof Array) {
                    //     responseData.info.own_job.forEach(element => {
                    //         element['start_time'] = moment(element['start_time'], "hh:mm A").format("HH:mm");
                    //         element['end_time'] = moment(element['end_time'], "hh:mm A").format("HH:mm");
                    //         element['show_date'] = moment(element['date'], "DD/MM/YYYY").format("DD");
                    //         element['show_month'] = moment(element['date'], "DD/MM/YYYY").format("MMM").toUpperCase();
                    //         this.JobBooked.push(element);
                    //     });
                    // }
                }

                if (job_type == 1) {
                    return this.JobData;
                } else {
                    return this.JobBooked;
                }


            }, (error) => {

                if (job_type == 1) {
                    return this.JobData;
                } else {
                    return this.JobBooked;
                }
            })
    }
}