// import moment from 'moment';
import moment from 'moment-timezone/builds/moment-timezone-with-data';
import {Platform} from 'react-native';

export const ServiceParams = {

    getLoginDataParams(userEmail, password) {

        var bodyData = new FormData();
        bodyData.append('user_email', userEmail);
        bodyData.append('user_password', password);
        bodyData.append('devicetoken', '');
        bodyData.append('devicetype', Platform.OS);
        bodyData.append('time_zone', '');

        return bodyData;
    },
    getForgetDataParams(userEmail) {

        var bodyData = new FormData();
        bodyData.append('user_email', userEmail);

        return bodyData;
    },
    getSignUpParams(userEmail, password, firstName, lastName, gmcNumber, profession, city, postCode, profileImage) {
        var bodyData = new FormData();
        bodyData.append('user_email', userEmail);
        bodyData.append('user_password', password);
        bodyData.append('devicetoken', 'TESTYHN');
        bodyData.append('devicetype', Platform.OS);
        bodyData.append('user_type', 1);

        bodyData.append('first_name', firstName);
        bodyData.append('last_name', lastName);
        bodyData.append('gmc_number', gmcNumber);
        bodyData.append('profession', profession);
        bodyData.append('city', city);
        bodyData.append('postcode', postCode);

        //Image upload
        if (profileImage != undefined) {
            bodyData.append('file_name', profileImage.fileName);
            bodyData.append('userfile', {
                uri: profileImage.uri,
                type: profileImage.type,
                name: 'profile.jpg',
            });
        }

        return bodyData;
    },
    getEmailValidateParams(userEmail) {
        var bodyData = new FormData();
        bodyData.append('email', userEmail);

        return bodyData;
    },
    getProfileImageDataParams(profileImage) {

        var bodyData = new FormData();
        bodyData.append('file_name', profileImage.fileName);
        bodyData.append('userfile', {
            uri: profileImage.uri,
            type: profileImage.type,
            name: 'profile.jpg',
        });

        return bodyData;
    },
    getPersonalInfoParams(qualification, smartCard, itSystem, speciality) {
        var bodyData = new FormData();
        bodyData.append('qualification', qualification);
        bodyData.append('smart_card', smartCard);
        bodyData.append('it_system', itSystem);
        bodyData.append('gpwsi', speciality);

        return bodyData;
    },

    getLocationInfoParams(address1 ,address2, postCode, city) {
        var bodyData = new FormData();
         bodyData.append('address1', address1);
         bodyData.append('address2', address2);
        bodyData.append('postcode', postCode);
        bodyData.append('city', city);

        return bodyData;
    },

    getBasicInfoParams(password, firstName, lastName, gmcNumber, language ) {
        var bodyData = new FormData();
        // bodyData.append('user_email', userEmail);
        if (password != null) {
            bodyData.append('user_password', password);
        }
        bodyData.append('devicetoken', 'TESTYHN');
        bodyData.append('devicetype', 'android');
        bodyData.append('user_type', 1);

        bodyData.append('first_name', firstName);
        bodyData.append('last_name', lastName);
        bodyData.append('gmc_number', gmcNumber);
        bodyData.append('language', language);
      

        return bodyData;
    },
    getSelectSessionParams(practice_type) {
        var bodyData = new FormData();
        bodyData.append('practice_type', practice_type);

        return bodyData;
    },
    getPaymentDetails(sortCode, accountNo, accountHolderName) {
        var bodyData = new FormData();
        bodyData.append('sort_code', sortCode);
        bodyData.append('account_number', accountNo);
        bodyData.append('account_holder_name', accountHolderName);

        return bodyData;
    },
    getNewInvoiceParams(stateData, status) { 
        var bodyData = new FormData();
        bodyData.append('doctor_name', stateData.user_id);
        
        bodyData.append('practice_id', (stateData['practice_id'] != undefined ? stateData['practice_id'] : (stateData.SelectedPractice['practice_id'] != undefined ? stateData.SelectedPractice['practice_id'] : stateData.SelectedPractice['id'])));
        bodyData.append('practices_type', (stateData['practices_type'] != undefined ? stateData['practices_type'] : (stateData.SelectedPractice['practices_type'] != undefined ? stateData.SelectedPractice['practices_type'] : (stateData.SelectedPractice['invoice_practices_type'] != undefined ? stateData.SelectedPractice['invoice_practices_type'] : stateData.SelectedPractice['practice_type']))));
        // bodyData.append('invoice_date', moment(stateData.SelectedDate, 'DD MMM YYYY').format("YYYY-MM-DD"));
        bodyData.append('invoice_date',moment.tz(stateData.SelectedDate,  'Europe/London').format('YYYY-MM-DD'));
        bodyData.append('due_date', moment.tz(stateData.SelectedDueDate,  'Europe/London').format("YYYY-MM-DD"));
        bodyData.append('job_id', stateData['job_ids']);
        bodyData.append('amount', stateData.total);
        bodyData.append('additional_fee', stateData.additionalFee);
        bodyData.append('reason', stateData.additionalDescription);
        bodyData.append('status', status);
        bodyData.append('doctor_email', stateData['user_email']);

        return bodyData;
    },

    getUpdateInvoiceParams(stateData, status) {
        var data = {
            "doctor_name": stateData.user_id,
            "practices_type": stateData.SelectedPractice['practices_type'],
            "invoice_date": moment.tz(stateData.SelectedDate,  'Europe/London').format("YYYY-MM-DD"),
            "due_date": moment.tz(stateData.SelectedDueDate,  'Europe/London').format("YYYY-MM-DD"),
            "amount": stateData.total,
            "reason": stateData.additionalDescription,
            "status": status,
            "additional_fee": stateData.additionalFee
            // "doctor_email": stateData['user_email'],
        }
        if (stateData.SelectedPractice['practice_id'] != undefined) {
            data['practice_id'] = stateData.SelectedPractice['practice_id'];
        } else {
            data['practice_id'] = stateData.SelectedPractice['id'];
        }
        // if (stateData.SelectedPractice['job_ids'] != undefined) {
        //     data['job_id'] = stateData.SelectedPractice['job_ids'];
        // } else {
        //     data['job_id'] = stateData['SessionDetails'][0]['id'];
        // }

        data['job_id'] = stateData['job_ids'];
        let dataArray = JSON.stringify(data);
        console.log("Data Array :", dataArray);
        return dataArray;
    },
    getJobParams() {

        var bodyData = new FormData();
        bodyData.append('latitude', " ");
        bodyData.append('longitude', " ");

        return bodyData;
    },
    shareDocParams(type, email, startDate, endDate) {
        var bodyData = new FormData();

        bodyData.append('email', email);
        bodyData.append('start_date', moment.tz(startDate,  'Europe/London').format("YYYY-MM-DD"));
        bodyData.append('end_date', moment.tz(endDate,  'Europe/London').format("YYYY-MM-DD"));

        if (type == 'CSV') {
            bodyData.append('invoice', '1');
            bodyData.append('expense', '1');
            bodyData.append('mileage', '1');
        }
        return bodyData;
    },

    getNewJobParams(stateData) {
        var data = {
            'start_date': (stateData.post == 'copy' ? stateData.jobDate : moment.tz(stateData.jobDate,  'Europe/London').format("YYYY-MM-DD")),
            'end_date': "",
            'start_time': moment.tz(stateData.startDate,  'Europe/London').format("HH:mm:SS"),
            'end_time': moment.tz(stateData.endDate,  'Europe/London').format("HH:mm:SS"),
            'mileage_expense': 0,
            'practice_id': stateData.practice_id,
            'repeat': "",
            'charge_rate': stateData.rate,
            'total': stateData.total,
            'job_status': "",
            'ical_id': "",
            'distance': stateData.distance,
            'op_mode' : (stateData.post == 'copy' ? 'copy' : 'new')
        }

        console.log("Param State :", data);

        //per hour , type = 2 / per session , type = 1 sessionBtn
        if (stateData.sessionBtn == true) {
            data['charge_type'] = 1;
        }
        else {
            data['charge_type'] = 2;
        }

        let bodyData = JSON.stringify(data);
        return bodyData;
    },

    getInvoiceEmailParams(stateData) {

        var bodyData = new FormData();

        var tempArry = [];
        var ccEmails = '';
        for (let index = 0; index < stateData.emailAdds.length; index++) {
            if (stateData.emailAdds[index]['id'] == 1) {
                bodyData.append('to', stateData.emailAdds[index]['email']);
            } else {
                if(ccEmails == '') {
                    ccEmails = stateData.emailAdds[index]['email'];
                }else {
                    ccEmails = ccEmails+','+stateData.emailAdds[index]['email'];
                }
            }
        }

        if(ccEmails != '') {
            bodyData.append('cc', ccEmails);   
        }

        return bodyData;
    },

    getExpenseParams(amount, description, type, date, profileImage, calenderChanged) {
        var bodyData = new FormData();

        bodyData.append('expense_type', type);
        bodyData.append('expense_amount', amount);
        if (calenderChanged == true) {
            bodyData.append('expense_date', moment.tz(date,  'Europe/London').format("YYYY-MM-DD"));
        } else {
            bodyData.append('expense_date', moment.tz(date,  'Europe/London').format("YYYY-MM-DD"));
        }
        bodyData.append('expense_description', description);

        if (profileImage != undefined && profileImage.length != 0) {
            bodyData.append('file_name', profileImage.fileName);
            bodyData.append('userfile', {
                uri: profileImage.uri,
                type: profileImage.type,
                name: 'profile.jpg',
            });
        }
        return bodyData;
    },

    uploadCertificateParams(stateParams, string) {

        var bodyData = new FormData();

        bodyData.append('document', stateParams.certType);

        if (stateParams.showExpireDate == true) {
            bodyData.append('expiry', moment.tz(stateParams.date,  'Europe/London').format("YYYY-MM-DD"));
        }

        //Image upload
        if (stateParams.imageDetails != undefined) {
            var imageDetails = stateParams.imageDetails;

            bodyData.append('file_name', string == "gallery" ? imageDetails.fileName : imageDetails.name);
            bodyData.append('userfile', {
                uri: imageDetails.uri,
                type: imageDetails.type,
                name: string == "gallery" ? 'document.jpeg' : imageDetails.name,
            });
        }

        return bodyData;
    },

    getInvoiceStatusParam(status) {
        var data = {
            "status": status,
        }
        let dataArray = JSON.stringify(data);
        console.log("Data Array :", dataArray);
        return dataArray;
    },

    setSendMessageParam(stateData) {
        var bodyData = new FormData();

        bodyData.append('send_to', stateData.sendTo);
        bodyData.append('message', stateData.messageField);

        return bodyData;
    },
    setPracticeParams(stateData) {
        var bodyData = new FormData();

        bodyData.append('user_id', stateData.userId);
        bodyData.append('practice_id', stateData.practiceId);
        bodyData.append('practice_name', stateData.name);
        bodyData.append('practice_address', stateData.address1);
        bodyData.append('practice_city', stateData.city);
        bodyData.append('practice_post_code', stateData.postCode);
        bodyData.append('contact_name', stateData.contactName);
        bodyData.append('contact_email', stateData.email);
        bodyData.append('contact_phoeno', stateData.phone);
        bodyData.append('practice_type', stateData.type);
        bodyData.append('hourly_rate', stateData.hourlyRate);
        bodyData.append('session_rate', stateData.sessionRate);
        bodyData.append('distance', stateData.distance);

        return bodyData;
    },

    setJobSearchParams(params) {
        var data = {
            "latitude": " ",
            "longitude": " ",
            // "practice_type": "All"
        };

        if (params.sendDate != null) {
            data['request_date'] = params.sendDate;
        }

        if (params.postCode != null) {
            data['address'] = params.postCode;
            data['distance'] = params.rangeValue;
        }

        if (params.selectedButton == "1") {
            data['practice_type'] = "GP Surgery";
        } else if (params.selectedButton == "2") {
            data['practice_type'] = "GP Surgery";
        } else if (params.selectedButton == "3") {
            data['practice_type'] = "Home visit service";
        }

        let dataArray = JSON.stringify(data);
        console.log("Data Array :", dataArray);
        return dataArray;
    },

    setCalendarParams(stateData) {
        var bodyData = new FormData();

        bodyData.append('latitude', " ");
        bodyData.append('longitude', " ");
        bodyData.append('date', stateData.sendDate);

        return bodyData;
    },
    checkImageExists(imageName) {

        var bodyData = new FormData();
        bodyData.append('filepath', imageName);

        return bodyData;
    },

    
}