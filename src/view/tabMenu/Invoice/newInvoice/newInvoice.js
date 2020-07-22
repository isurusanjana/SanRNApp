import React, { Component } from 'react';
import { View, TextInput, Text, TouchableOpacity, ScrollView, AsyncStorage, Image,ImageBackground,Header,
  StatusBar, Platform, NativeModules, Dimensions, StyleSheet, TouchableWithoutFeedback, 
  Keyboard, SafeAreaView, KeyboardAvoidingView, KeyboardAwareScrollView} from 'react-native';
import { List, ListItem,Icon } from 'native-base';
import { newinvoicestyles } from './styles';
import CustomHeader from '../../../../components/customHeader/header';
import FormTextInput from '../../../../components/formTextInput/textinput';
import formStyles from '../../../../components/formTextInput/styles';
import CheckboxFormX from 'react-native-checkbox-form';
import { signupstyles } from '../../../signup/styles';
import { loginformStyles, styles } from '../../../login/styles';
import { Services } from '../../../../services/services';
import { GET_ALL_PRACTICES, GET_JOBBYPRACTICE_URLPART1, GET_JOBBYPRACTICE_URLPART2, GET_INVOICE_URL } from '../../../../config/shared';
import { GlobalData } from '../../../../config/global';
import Spinner from 'react-native-loading-spinner-overlay';
import validate from 'validate.js';
import { TextInputMask } from 'react-native-masked-text';

import Overlay from 'react-native-modal-overlay';
import DropDownHolder from '../../../../components/dropDown/dropDownHolder';
import { ServiceParams } from '../../../../services/serviceParams';
import moment from 'moment';
import CheckBox from 'react-native-check-box'
import { NavigationActions, StackActions } from 'react-navigation';
import { Fonts } from '../../../../config/font';
import CustomDropDown from '../../../../components/CustomDropDown/customDropDown';

const mockData = [
  {
    label: '',
    RNchecked: false
  }
];

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBarManager.HEIGHT;
const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[statusBarStyles.statusBar, { height: (Platform.OS === 'ios' ? 20 : StatusBar.currentHeight), backgroundColor }]}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

const DueDateData = [
  {
    value: '7',
    id: 7
  }, {
    value: '15',
    id: 15
  }, {
    value: '30',
    id: 30
  }, {
    value: '60',
    id: 60
  },
];


const constraints = {
  selectedPractice: {
    presence: {
      allowEmpty: false,
      message: "Please select practice first"
    },
  },
  sessionSelection: {
    presence: {
      allowEmpty: false,
      message: "Please select session first"
    }
  },
}

const practiceValidate = {
  selectedPractice: {
    presence: {
      allowEmpty: false,
      message: "Please select practice first"
    },
  }
}

const addFeeValidation = {
  additionalFee: {
    presence: {
      allowEmpty: false,
      message: "Please enter amount first"
    },
    numericality: {
      greaterThan: 0,
      message: "Please enter amount first"
    }
  },
  additionalDescription: {
    presence: {
      allowEmpty: false,
      message: "Please enter description"
    }
  },
}

class NewInvoice extends Component {

  constructor(props) {
    super(props);
    this.state = {
      'title': '',
      chosenDate: new Date(),
      errors: {
        title: false
      },
      PageTittle: 'New Invoice',
      SelectedValue: null,
      SelectedDate: moment().format("DD MMM YYYY"),
      SelectedDueDate: moment().add(15, 'days').format("DD MMM YYYY"),
      spinner: false,
      modalVisible: false,
      AddFeeModal: false,
      SessionDetails: [],
      savedSessionDetails: [],
      Subtotal: "0.00",
      additionalFee: 0,
      additionalFeeDisplay: '0',
      tempAdditonalFee: 0,
      additionalDescription: "",
      total: 0,
      checked: false,
      SelectedPractice: [],
      practice_id: null,
      practices_type: null,
      user_id: null,
      invoiceComplete: false,
      edit: false,
      sortVisible: false,
      sortOption: [
          {
              value: '7 days',
              id: 7,
              selected: false,
              sort: 'data'
          }, {
              value: '15 days',
              id: 15,
              selected: true,
              sort: 'data'
          }, {
              value: '30 days',
              id: 30,
              selected: false,
              sort: 'data'
          }, {
              value: '60 days',
              id: 60,
              selected: false,
              sort: 'data'
          }
      ],
      job_ids: null,
      selectedAdded: false,
      savedSessionDate: '',
      savedSessionStartTime: '',
      savedSessionEndTime: '',
      savedSessionTotal: '',
      practiceEmail: '',
      additionalOverlayHeight: '60%',
    };
    this.setDate = this.setDate.bind(this);
    this.setServices = new Services();

    GlobalData.SELECTED_SESSION = [];

  }
  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }


  componentDidMount = async () => {
    this.user_id = null;

    // this.setState({ 'spinner': true });
    // componentDidMount() {
    await AsyncStorage.multiGet(["user_id", "userEmail"
    ]).then(response => {
      // console.log("Response :", response);
      this.user_id = response[0][1];
      this.setState({ 'spinner': false });
      this.setState({ 'user_id': response[0][1] });
      this.setState({ 'user_email': response[1][1] });
    })

    const { navigation } = this.props;
    if (navigation.getParam('edit') == true) {
      this.setState({ 'PageTittle': 'Edit Invoice' });
      this.setState({ 'edit': navigation.getParam('edit') });
      // console.warn("Edit Data :", navigation.getParam('data'));
      GlobalData.INVOICE_SELECT_PRACTICE = [];
      GlobalData.INVOICE_SELECT_PRACTICE = navigation.getParam('data')['my_practice'];
      this.updatePractice();

      if ((navigation.getParam('data')['due_date'])!= "Invalid date" && (navigation.getParam('data')['due_date'])!= "null" && (navigation.getParam('data')['due_date'])!= null)  {
        this.setState({ 'SelectedDueDate': moment(navigation.getParam('data')['due_date']).format("DD MMM YYYY") });
      }
    //   this.setState({ 'SelectedDueDate': moment(navigation.getParam('data')['due_date']).format("DD MMM YYYY") });

      navigation.getParam('data')['my_job'].forEach(element => {
          element['checked'] = true;
      });

      await this.setState({ SessionDetails: navigation.getParam('data')['my_job']});
      await this.setState({savedSessionDetails: navigation.getParam('data')['my_job']});
      await this.setState({ Subtotal: parseFloat(navigation.getParam('data')['my_job'][0]['total']).toFixed(2) });
      await this.setState({ additionalFee: navigation.getParam('data')['additional_fee']});
      await this.setState({ tempAdditonalFee: navigation.getParam('data')['additional_fee']});
      await this.setState({ additionalDescription: navigation.getParam('data')['reason'] });
      await this.setState({
        total: parseFloat(navigation.getParam('data')['amount']).toFixed(2),
        invoice_id: navigation.getParam('data')['id']
      });

    } else if (navigation.getParam('fromJob') == true) {
      // console.warn(navigation.getParam('data'));
      GlobalData.INVOICE_SELECT_PRACTICE = navigation.getParam('data');
 
      let endDate = (navigation.getParam('data')['repeat_enddate'] == "" || navigation.getParam('data')['repeat_enddate'] == null || navigation.getParam('data')['repeat_enddate'] == undefined) ? navigation.getParam('data')['end_date'] : navigation.getParam('data')['repeat_enddate'] ;
      if (endDate!= "Invalid date" && endDate!= "null" && endDate!= null)  {
        await this.setState({ SelectedDueDate: moment(endDate, "DD/MM/YYYY").add(15, 'days').format("DD MMM YYYY") });
      }

      if ((navigation.getParam('data')['end_date'])!= "Invalid date" && (navigation.getParam('data')['end_date'])!= "null" && (navigation.getParam('data')['end_date'])!= null)  {
        await this.setState({ SelectedDate: moment(navigation.getParam('data')['end_date'], "DD/MM/YYYY").format('DD MMM YYYY') });
      }

      if ((navigation.getParam('data')['date'])!= "Invalid date" && (navigation.getParam('data')['date'])!= "null" && (navigation.getParam('data')['date'])!= null)  {
        await this.setState({savedSessionDate:navigation.getParam('data')['date'] });
      }

      if ((navigation.getParam('data')['start_time'])!= "Invalid date" && (navigation.getParam('data')['start_time'])!= "null" && (navigation.getParam('data')['start_time'])!= null)  {
        await this.setState({savedSessionStartTime:navigation.getParam('data')['start_time'] });
      }
      
      if ((navigation.getParam('data')['end_time'])!= "Invalid date" && (navigation.getParam('data')['end_time'])!= "null" && (navigation.getParam('data')['end_time'])!= null)  {
        await this.setState({savedSessionEndTime:navigation.getParam('data')['end_time'] });
      }

      await this.setState({ practice_id: navigation.getParam('data')['practice_id'] });
      await this.setState({ practices_type: navigation.getParam('data')['invoice_practice_type']});
      await this.setState({ SelectedValue: navigation.getParam('data')['practice_name'] });
      
      navigation.getParam('data')['checked'] = true;
      // navigation.getParam('data')['id'] = navigation.getParam('data')['job_id'];
      navigation.getParam('data')['checked'] = true;
      
      
      await this.setState({savedSessionTotal:navigation.getParam('data')['total'] });
      let tArry = [];
      if(navigation.getParam('data')['job_id']) {
        navigation.getParam('data')['id'] = navigation.getParam('data')['job_id'];
      }
      await tArry.push(navigation.getParam('data'));
            
      await this.setState({ 'SessionDetails': tArry });
      await this.setState({
        Subtotal: parseFloat(navigation.getParam('data')['total']).toFixed(2),
        total: parseFloat(navigation.getParam('data')['total']).toFixed(2)
      });
      // this.updatePractice();
    }
  }

  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  // _keyboardDidShow () {
  //   console.warn('Keyboard Shown');
  //   // this.setState({additionalOverlayHeight: (Dimensions.get('window').height *0.8)});
  //   // alert('Keyboard Shown');
  // }

  // _keyboardDidHide () {
  //   this.setState({additionalOverlayHeight: (Dimensions.get('window').height *0.6)});
  // }


  _keyboardDidShow = () => {
    this.setState({
      additionalOverlayHeight: '80%'
    });
  }

  _keyboardDidHide = () => {
    this.setState({
      additionalOverlayHeight: '60%'
    });
  }

  dateType  = (sortOption, value) => {
    sortOption.forEach(element => {
      if(element.value == value) {
        value = element.id;
      }
    });
    this.setState({ 'SelectedDueDate': moment().add(value, 'days').format("DD MMM YYYY") });
    this.setState({ sortVisible: false });
  }

  updatePractice() {
    this.setState({SessionDetails : []});
    // console.warn("Selected Practice :", GlobalData.INVOICE_SELECT_PRACTICE);
    this.setState({practices_type: GlobalData.INVOICE_SELECT_PRACTICE['practices_type']});
    this.setState({practice_id: GlobalData.INVOICE_SELECT_PRACTICE['practice_id']});
    this.setState({ SelectedValue: GlobalData.INVOICE_SELECT_PRACTICE['practice_name'] });
    this.setState({ practiceEmail: GlobalData.INVOICE_SELECT_PRACTICE['contact_email'] });
    this.setState({ SelectedPractice: GlobalData.INVOICE_SELECT_PRACTICE });

    // this.setState({ 'SelectedDate': moment(GlobalData.INVOICE_SELECT_PRACTICE['add_date']).format('DD MMM YYYY') });
  }

  getPracticeData() {

    this.setServices.getService(GET_ALL_PRACTICES + this.user_id, "")
      .then((responseData) => {
        this.setState({ 'spinner': false });
        // console.log("Response Data :", responseData);
        this.practiceData = responseData.info;
        // console.log("this.practiceData :", this.practiceData);
        this.props.navigation.navigate('SelectPracticePage', {
          showFrom: 'invoice',
          PracticeDetails: this.practiceData,
          onGoBack: () => this.updatePractice()
        });
      }, (error) => {

        this.setState({ 'spinner': false });
        console.log("error Data :", error);
      })
  }

  onChangeCheck() {
    this.setState({ checked: !this.state.checked });
    // console.log("State :", this.state.checked);
    setTimeout(() => {
      // console.log("State :", this.state);
    }, 250);
  }

  onClose = () => {
    this.setState({ sortVisible: false });    
    this.setState({ modalVisible: false });
    this.setState({ AddFeeModal: false });
  };

  getSessionDetails() {
    
    var previousSelectedPractice = this.state.savedSessionDetails;
    this.setServices.postService(GET_JOBBYPRACTICE_URLPART1 + this.user_id + GET_JOBBYPRACTICE_URLPART2 + GlobalData.INVOICE_SELECT_PRACTICE['id'], ServiceParams.getSelectSessionParams(GlobalData.INVOICE_SELECT_PRACTICE['practices_type']))
      .then((responseData) => {

        if (responseData.info instanceof Array) {
          for (let index = 0; index < this.state.SessionDetails.length; index++) {
            responseData.info.forEach(element => {
              if (this.state.SessionDetails[index]['id'] == element['id']) {
                if (this.state.SessionDetails[index]['checked'] != undefined) {
                  element['checked'] = this.state.SessionDetails[index]['checked'];
                }
              }
            });
          }

          if (this.state.edit == true) {
            previousSelectedPractice.forEach(element => {
              responseData.info.push(element); 
            });
            this.setState({selectedAdded: true});
          }

          this.setState({ 'SessionDetails': responseData.info });
          this.setState({ 'spinner': false });
          
          this.props.navigation.navigate('SelectSessionPage', {
            SessionDetails: responseData.info,
            onGoBack: () => this.updateState()
          });

          setTimeout(() => {
            console.log("State :", this.state);
          }, 250);
        } else {
          this.setState({ 'spinner': false });
          // DropDownHolder.dropDown.alertWithType('error', '', "Selected practice does not have any sessions");
          this.props.navigation.navigate('SelectSessionPage', {
            SessionDetails: null,
            onGoBack: () => this.updateState()
          });
        }



      }, (error) => {

        console.log("error Data :", error);
      })
  }

  updateState = async () => {
    var subTotal = 0;
    this.setState({ 'spinner': true });
    await GlobalData.SELECTED_SESSION.forEach((element, index) => {
      if(element['checked'] == true && element['total'] != "" && element['total'] != "null" && element['total'] != "NaN" && element['total'] != null && element['total'] != undefined) {
        subTotal = parseFloat(subTotal) + parseFloat(element['total']);
      }
    });

    this.setState({ 'SessionDetails': GlobalData.SELECTED_SESSION });
    
    this.setState({ "Subtotal": (parseFloat(subTotal).toFixed(2)) });
  
    // this.setState({ "total": (parseFloat(subTotal) + parseFloat(this.state.additionalFee)).toFixed(2) });
    this.setState({ "total": (subTotal + parseFloat(this.state.tempAdditonalFee)) });

    setTimeout(() => {
      console.log("State :", this.state);
    }, 250);
    this.setState({ 'spinner': false });
  }

  removeSelectedSession(id) {
    let tempArray = this.state.SessionDetails
    tempArray.forEach(element => {
      if (element['id'] == id) {
        element['checked'] = false;
      }
    });

    this.setState({ 'SessionDetails': tempArray });
    this.updateState();
  }

  async textChange(type, text) {
    this.setState({
      [type]: text
    });

    setTimeout(() => {
      console.log("State :", this.state);
    }, 250);
  }

  checkSelectedItem = (item, selectedItems) => {
    var splittedItems = selectedItems.split(',');
    return splittedItems.includes(item);
  }

  convertMultiSelectToCsv = async (selectedState) => {
    var convertedString = "";
    await selectedState.forEach(item => {
        if(item['checked'] == true) {
            convertedString = (convertedString == "" ? item['id'] : (convertedString + ","+ item['id']));
        }
    });
    return convertedString;
}

  sentNewInvoiceDetails = async (status) => {
    var jobString = await this.convertMultiSelectToCsv(this.state.SessionDetails);
    this.setState({job_ids: jobString});

    if (this.state.edit != true) {
      this.setServices.postService(GET_INVOICE_URL + this.user_id, ServiceParams.getNewInvoiceParams(this.state, status))
        .then((responseData) => {  

          this.setState({ 'spinner': false });
          if (responseData.error == 0 && status == 0) {
            DropDownHolder.dropDown.alertWithType('success', 'Success', "Invoice saved");
            // this.props.navigation.state.params.pageRefresh('add_date' , true);
            // this.props.navigation.goBack();
            this.props.navigation.dispatch(this.props.navigation.navigate('MainNavigation', {}, NavigationActions.navigate({ routeName: 'Screen3' })));
          } else if (status == 1) { 
            // this.props.navigation.state.params.pageRefresh('add_date' , true);
            var invoiceId = 0;
            if (responseData.info instanceof Array) {
              for (let index = 0; index < responseData.info.length; index++) {
                invoiceId = responseData.info[index].id;
              }
            }

            this.props.navigation.navigate('PreviewInvoicePage', {
              pdfURL: responseData.upload_data.file,
              from: 'new',
              invoice_id: invoiceId,
              toEmail: this.state.practiceEmail
            });
          }

        }, (error) => {

          this.setState({ 'spinner': false });
          console.log("error Data :", error);
        })
    } else {

      this.setServices.postService(GET_INVOICE_URL + this.state.invoice_id +'/update', ServiceParams.getUpdateInvoiceParams(this.state, status))
        .then((responseData) => {

          this.setState({ 'spinner': false });
          if (responseData.error == 0 && status == 0) {
            // this.props.navigation.state.params.pageRefresh('add_date' , true);
            // this.props.navigation.goBack();
            this.props.navigation.dispatch(this.props.navigation.navigate('MainNavigation', {}, NavigationActions.navigate({ routeName: 'Screen3' })));
          } else if (status == 1) {
            // this.props.navigation.state.params.pageRefresh('add_date' , true);
            this.props.navigation.navigate('PreviewInvoicePage', {
              pdfURL: responseData.upload_data.file,
              from: 'new',
              invoice_id: this.state.invoice_id,
              toEmail: this.state.practiceEmail
            });
          }

        }, (error) => {

          this.setState({ 'spinner': false });
          console.log("error Data :", error);
        })
    }
  }

  render() {
    const { goBack } = this.props.navigation;
    const { navigation } = this.props;
    return (
      <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : ""}
          style={{ flex: 1, }}
          enabled
        >
      <View style={{ flex: 1, }} >
        <ImageBackground source={require('./images/add_job_background.png')} style={{ height: (Dimensions.get('window').height) * 0.18, width: Dimensions.get('window').width }} >
          {/* <StatusBar backgroundColor="#5A5EF0" barStyle="light-content"  /> */}
          <View>
            {
                Platform.OS === 'ios' ? <MyStatusBar backgroundColor="transparent" barStyle="light-content" /> : <StatusBar backgroundColor="transparent" barStyle="light-content" />
            }
          </View> 
          <View style={{ paddingHorizontal: 20,  marginTop: (Platform.OS === 'ios' ? 45 : 50)}}>
              {/* <View style={{ flex: 1, flexDirection: 'row', paddingTop: '10%', marginLeft: 10,marginTop: 50,  }}>
                  <TouchableOpacity onPress={() => { goBack(); }}>
                      <Image source = { require('./images/backIcon.png') } style = {{ width: 18, height: 18, marginTop: 3, tintColor: '#fff' }}/>
                  </TouchableOpacity>      
                  <Text style={{ fontSize: 18, color: '#fff', fontFamily: Fonts.MontserratBold, paddingLeft: 20 }}>{this.state.PageTittle}</Text>                                      
              </View> */}
              <View style={{width: '90%',justifyContent:'flex-start',}}>
                  <TouchableOpacity onPress={() => { goBack() }} style={{ flexDirection: 'row', }}>
                      <View style={{justifyContent: 'center', paddingRight: 10}}>
                          <Image source={require('./images/whiteBackIcon.png')} style={{ width: 16, height:16 }}></Image>  
                      </View>
                      <View  style={{justifyContent: 'center', paddingRight: 10}}>
                          <Text style={{color: '#FFFFFF',fontFamily: Fonts.MontserratBold,fontSize: 18,}}>{this.state.PageTittle}</Text>
                      </View>                    
                  </TouchableOpacity>
              </View>
          </View>
        </ImageBackground>
        <ScrollView>
          <View style={{paddingHorizontal: 20, paddingTop: 30}}>
            <TouchableOpacity
                onPress={() => {
                  this.setState({ 'spinner': true });
                  this.getPracticeData();
                }}>
              <Text style={newinvoicestyles.labelText}>To</Text>
              
              <View style={{ paddingTop:Platform.OS === 'ios' ? 10 : 0,paddingBottom:Platform.OS === 'ios' ? 10 : 0, }}>
                <TextInput
                  placeholder={'Select healthcare organisations'}
                  pointerEvents="none"
                  placeholderTextColor="#AAB2BD"
                  keyboardType={'default'}
                  returnKeyType="next"
                  autoCorrect={false}
                  style={newinvoicestyles.textInput,{width: (Dimensions.get('window').height) - 40, color: '#414253',}}
                  // onChangeText={(text) => this.textChange('title', text)}
                  editable={false}
                  value={this.state.SelectedValue}
                />
              </View>
            </TouchableOpacity>

            {/* <View style={[formStyles.hrLine, this.state.errors.title ? formStyles.error : formStyles.input]} /> */}

            <View style={{flex:1, flexDirection:'row', paddingTop: 15}}> 
              <View style={{ width: '48%', paddingRight:15, borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10, }}>
                <Text style={newinvoicestyles.labelText}>Date</Text>
                <View style={{ paddingTop:10}}>
                  <TextInput
                    // placeholder={'Select medical practice'}
                    placeholderTextColor="#aeb7af"
                    keyboardType={'default'}
                    returnKeyType="next"
                    autoCorrect={false}
                    style={newinvoicestyles.textInput}
                    // onChangeText={(text) => this.textChange('title', text)}
                    editable={false}
                    value={this.state.SelectedDate}
                  />
                </View>
                {/* <View style={[formStyles.hrLine, this.state.errors.title ? formStyles.error : formStyles.input]} /> */}
              </View>
              <View style={{ width: '6%', alignContent:'center', alignItems: 'center', justifyContent: 'center',paddingBottom: 10, }}>
                <Text style={[newinvoicestyles.labelText, {alignSelf: 'center'}]}> : </Text>
              </View>
              <View style={{ width: '48%', paddingLeft:15,borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10, }}>
                <Text style={newinvoicestyles.labelText}>Invoice due date</Text>
                <TouchableOpacity onPress={() => {
                    var isValidForm = validate({ selectedPractice: this.state.SelectedValue }, practiceValidate, { format: "detailed" });
                    if (isValidForm != undefined) {
                      DropDownHolder.dropDown.alertWithType('error', 'Error', (isValidForm[0]).options.message);
                    } else {
                      this.setState({ sortVisible: true });
                    }
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop:10, }}>
                      <View style={{ width: '80%',  alignContent: 'center' }}>
                        <Text style={{ textAlign: 'left',color: 'black', fontSize: 16, fontFamily: Fonts.MontserratBold, }}>{this.state.SelectedDueDate}</Text>
                      </View>
                      <View style={{  width: '20%',alignItems: 'center', alignSelf: 'flex-end', }}>
                        {/* <Text style={{ paddingRight: 20, color: '#142828', fontFamily: Fonts.Rubik, }}>Edit date</Text>
                        <View style={{ borderRadius: 10, backgroundColor: '#2ee5b5', width: 30, height: 30, justifyContent: 'center', textAlign: 'center' }} >
                          <Text style={{ justifyContent: 'center', textAlign: 'center', color: '#ffffff', fontSize: 20 }}>+</Text>
                        </View> */}
                        <Image  source={require('./images/calendar.png')} style={{ width:19, height:19, marginRight:4}}/>
                      </View>
                    </View>
                  </TouchableOpacity>
                  {/* <View style={[formStyles.hrLine, this.state.errors.title ? formStyles.error : formStyles.input,]} /> */}

                </View>
            </View>


            <Text style={newinvoicestyles.labelText}>Completed session</Text>
            {
              navigation.getParam('fromJob') == true ? 
                  <View style={{ flex: 1, flexDirection: 'row', paddingTop: 10, paddingBottom: 15, }}>
                      <View style={{ flex: 1,  flexDirection: 'column', paddingLeft: 0, }}>
                        <Text style={{ color: '#142828', fontFamily: Fonts.MontserratMedium, fontSize: 14, }}>{this.state.savedSessionDate != '' ? (moment(this.state.savedSessionDate, "DD/MM/YYYY").format("DD MMM YYYY")) : ''} {this.state.savedSessionStartTime != '' ? (moment(this.state.savedSessionStartTime, "h:mm a").format("HH:mm")) : '00.00'} - {this.state.savedSessionEndTime != '' ? (moment(this.state.savedSessionEndTime, "h:mm a").format("HH:mm")) : '00.00'}</Text>
                        {/* <Text style={{ color: '#aeb7af', fontFamily: Fonts.MontserratMedium, fontSize: 14, paddingTop: 5, }}>{moment(this.state.savedSessionStartTime, "h:mm a").format("HH:mm")} - {moment(this.state.savedSessionEndTime, "h:mm a").format("HH:mm")}</Text> */}
                      </View>
                     
                      <View style={{ flexDirection: 'row', paddingRight: 5, alignContent: 'center', justifyContent: 'center' }}>
                        <Text style={{ paddingRight: 5, textAlign: 'right', color: '#000000', fontFamily: Fonts.MontserratBold, fontSize: 15, marginRight: 15 }}>£ {parseFloat(this.state.savedSessionTotal).toFixed(2)}</Text>
                      </View>
                  </View>
                :
                this.state.SessionDetails.map(data => {
                if (data.checked == true) {
                    var sessionTotal = '0.00';
                    if(data.total != "" && data.total != "null" && data.total != "NaN" && data.total != null && data.total != undefined) {
                      sessionTotal = data.total;
                    }
                  
                  return (
                    <View  key={data.id} style={{paddingTop: 10, }}>                    
                      <View style={{ flex: 1, flexDirection: 'row',paddingBottom: 15,}}>
                        <View style={{ flex: 1,  flexDirection: 'column', paddingLeft: 0, }}>
                          <Text style={{ color: '#142828', fontFamily: Fonts.MontserratMedium, fontSize: 15, }}>{moment(data.date, "DD/MM/YYYY").format("DD MMM YYYY")} {moment(data.start_time, "h:mm a").format("HH:mm")} - {moment(data.end_time, "h:mm a").format("HH:mm")}</Text>
                        </View>
                        
                        <View style={{ flexDirection: 'row', alignContent: 'flex-end', justifyContent: 'flex-end' }}>
                          <Text style={{ paddingRight: 5, textAlign: 'right', color: '#000000', fontFamily: Fonts.MontserratBold, fontSize: 15, marginRight: 15 }}>£ {parseFloat(sessionTotal).toFixed(2)}</Text>
                          {navigation.getParam('fromJob') != true &&
                            <TouchableOpacity style={{ borderRadius: 10,width: 19, height: 19, justifyContent: 'flex-end', textAlign: 'right', marginLeft:3 }} onPress={() => {
                              this.removeSelectedSession(data.id);
                            }}>
                              <Image  source={require('./images/delete.png')} style={{ width:17.27, height:19}}/>
                            </TouchableOpacity>
                          }
                        </View>
                      </View>
                      <View style={[formStyles.hrLine, this.state.errors.title ? formStyles.error : formStyles.input]} />
                    </View>
                  ) 
 
                } else {
                  return (null);
                }
              })
            }

            {navigation.getParam('fromJob') != true &&
            <TouchableOpacity onPress={() => {
                  var isValidForm = validate({ selectedPractice: this.state.SelectedValue }, practiceValidate, { format: "detailed" });
                  //console.log("Validation : ", isValidForm);
                  if (isValidForm != undefined) {
                    DropDownHolder.dropDown.alertWithType('error', 'Error', (isValidForm[0]).options.message);
                  } else {
                    this.setState({ 'spinner': true });
                    this.getSessionDetails();
                  }
                }}>
              <View style={{
                flexDirection: 'row',flex:1, alignItems: 'center', alignContent: 'center', alignSelf: 'flex-start',
                justifyContent: 'center', paddingTop:10
              }}>
                <View style={{ borderRadius: 10, width: 30, height: 30, justifyContent: 'center', textAlign: 'center' }} >
                  <Image source={require('./images/plus-circle.png')}></Image>
                </View>
                <View style={{ paddingLeft: 5, justifyContent: 'center'}}>
                  <Text style={{ color: '#00D3A1', fontFamily: Fonts.MontserratMedium, }}>Add session</Text>
                </View>
              </View>
              </TouchableOpacity>
            }
            
            <View style={{ flexDirection: 'row', paddingBottom: 30,  paddingTop: 15 }}>
              <Text style={{ flex: 1, color: '#1F89E4', fontFamily: Fonts.MontserratMedium,fontSize:18, paddingLeft: 0 }}>Subtotal</Text>
              <Text style={{ flex: 1, paddingRight: 5, textAlign: 'right', color: '#1F89E4', fontFamily: Fonts.MontserratMedium, fontSize: 18, }}>£ {this.state.Subtotal}</Text>
            </View>


            <Text style={newinvoicestyles.labelText}>Additional fee</Text>

            {
              this.state.additionalFee != 0 &&
              <TouchableOpacity onPress={() => {
                var isValidForm = validate({ selectedPractice: this.state.SelectedValue, sessionSelection: this.state.SessionDetails }, constraints, { format: "detailed" });
                if (isValidForm != undefined) {
                  DropDownHolder.dropDown.alertWithType('error', 'Error', (isValidForm[0]).options.message);
                } else {
                  this.setState({ AddFeeModal: true });
                }
              }}>
                <View style={{ flexDirection: 'column', paddingTop: 10, paddingBottom: 15 }}>
                  <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 0, }}>
                    <Text style={{ justifyContent: 'center', color: '#142828', fontFamily: Fonts.MontserratMedium, fontSize: 15, }}>{this.state.additionalDescription}</Text>
                    <Text style={{ flex: 1, textAlign: 'right', color: '#142828', fontFamily: Fonts.MontserratBold, fontSize: 15, paddingRight: 5, marginRight: 15 }}>£ {parseFloat(this.state.additionalFee).toFixed(2)}</Text>
                    {navigation.getParam('fromJob') != true &&
                          <TouchableOpacity style={{ borderRadius: 10,width: 19, height: 19, justifyContent: 'center', textAlign: 'center' }} onPress={() => {
                            this.removeSelectedSession(data.id);
                          }}>
                            <Image  source={require('./images/delete.png')} style={{ width:17.27, height:19}}/>
                          </TouchableOpacity>
                        }
                  </View>

                </View>
                <View style={[formStyles.hrLine, this.state.errors.title ? formStyles.error : formStyles.input]} />
              </TouchableOpacity>
            }

            {
              this.state.additionalFee == 0 &&
              <TouchableOpacity onPress={() => {
                    var isValidForm = validate({ selectedPractice: this.state.SelectedValue, sessionSelection: this.state.SessionDetails }, constraints, { format: "detailed" });
                    //console.log("Valid :", isValidForm);
                    if (isValidForm != undefined) {
                      DropDownHolder.dropDown.alertWithType('error', 'Error', (isValidForm[0]).options.message);
                    } else {
                      this.setState({ AddFeeModal: true })
                    }
                  }}>
                <View style={{ flexDirection: 'row',flex:1, paddingTop:10, paddingBottom:10, justifyContent: 'flex-start', paddingBottom: 10, }}>
                  <View style={{ flexDirection: 'row'}}>
                    <View style={{ borderRadius: 10, width: 30, height: 30, justifyContent: 'center' }} >
                      <Image source={require('./images/plus-circle.png')}></Image>
                    </View>
                    <View style={{ paddingLeft: 5, justifyContent: 'center'}}>
                      <Text style={{ color: '#00D3A1', fontFamily: Fonts.MontserratMedium, fontSize:15  }}>Add fee</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            }


            <View style={{ flexDirection: 'row', paddingBottom: 20,  paddingTop: 15 }}>
              <Text style={{ flex: 1, color: '#1F89E4', fontFamily: Fonts.MontserratBold, fontSize:18 }}>Total</Text>
              <Text style={{ flex: 1, paddingRight: 5, textAlign: 'right', color: '#1F89E4', fontFamily: Fonts.MontserratBold, fontSize: 18 }}>£ {parseFloat(this.state.total).toFixed(2)}</Text>
            </View>


            <View style={{ flexDirection: 'row', paddingTop: 20 }}>
              <View style={[loginformStyles.signUpButtonArea, { flex: 1,flexDirection:'row', paddingTop: 0,justifyContent:'flex-start' }]}>
                <TouchableOpacity style={{width: '90%',height:56,alignItems: 'center',alignSelf: 'center', justifyContent: 'center',borderWidth: 2,borderColor: '#00D3A1',borderRadius: 10,color:'#00D3A1', }} onPress={() => {
                  var isValidForm = validate({ selectedPractice: this.state.SelectedValue, sessionSelection: this.state.SessionDetails }, constraints, { format: "detailed" });
                  if (isValidForm != undefined) {
                    DropDownHolder.dropDown.alertWithType('error', 'Error', (isValidForm[0]).options.message);
                  } else {
                    if (navigation.getParam('edit') == true || navigation.getParam('fromJob') == true) {
                      this.setState({
                        'SelectedDate': moment(this.state.SelectedDate, 'DD MMM YYYY').format('YYYY-MM-DD'),
                        'SelectedDueDate': moment(this.state.SelectedDueDate, 'DD MMM YYYY').format('YYYY-MM-DD')
                      })
                    }

                    setTimeout(() => {
                      this.setState({ 'spinner': true });
                      this.sentNewInvoiceDetails(0);
                    }, 250);
                  }
                }}>
                  <Text style={[loginformStyles.signUpButton, { color: '#00D3A1', fontFamily: Fonts.MontserratBold, }]}>SAVE</Text>
                </TouchableOpacity>
              </View>

              <View style={[loginformStyles.loginButtonArea, { flex: 1,flexDirection:'row',justifyContent:'flex-end',alignContent:'flex-end',alignItems:'flex-end' }]}>
                <TouchableOpacity elevation={5} style={[loginformStyles.loginTouchable, { borderWidth: 0, width: '90%', }]} onPress={() => {
                  var isValidForm = validate({ selectedPractice: this.state.SelectedValue, sessionSelection: this.state.SessionDetails }, constraints, { format: "detailed" });
                  if (isValidForm != undefined) {
                    DropDownHolder.dropDown.alertWithType('error', 'Error', (isValidForm[0]).options.message);
                  } else {
                    this.setState({ 'spinner': true });
                    this.sentNewInvoiceDetails(1);
                  }
                }}>
                  <Text style={[loginformStyles.loginButton, { fontFamily: Fonts.MontserratBold, }]}>SEND</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </ScrollView>

        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />

        {/* Start - Add Due Date Overlay */}
        <Overlay visible={this.state.modalVisible} onClose={this.onClose} closeOnTouchOutside containerStyle={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          childrenWrapperStyle={{
            width: '100%',
            height: 200, position: 'absolute',
            bottom: 0, right: 15, left: 20, borderTopLeftRadius: 25, borderTopRightRadius: 25,
          }}>
          <View style={{

            // backgroundColor: '#FF9800',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%', alignSelf: 'center',
          }}>

            <List style={{ width: '100%', justifyContent: 'center', textAlign: 'center' }}>
              {
                DueDateData.map(data => {
                  return (
                    <ListItem key={data.id} style={{ justifyContent: 'center', textAlign: 'center', }} onPress={() => {
                      this.setState({ 'SelectedDueDate': moment().add(data.id, 'days').format("DD MMM YYYY") });
                      this.onClose();
                    }}>
                      <Text style={{ textAlign: 'center' }}>{data.value}</Text>
                    </ListItem>
                  )
                })
              }
            </List>
          </View>
        </Overlay>
        {/* End - Add Due Date Overlay */}

        {/* Start - Additional Fee Overlay */}
        <Overlay 
          visible={this.state.AddFeeModal} 
          onClose={this.onClose} 
          closeOnTouchOutside 
          containerStyle={{ backgroundColor: 'rgba(0,0,0,0.4)' }} 
          childrenWrapperStyle={{
            width: '100%',
            height: this.state.additionalOverlayHeight, position: 'absolute',
            bottom: 0, right: 15, left: 20, borderTopLeftRadius: 25, borderTopRightRadius: 25,
          }}
        >
        
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={{ width: '100%' }}>
            <View style={{
              width: '100%',
            }}>

              <Text style={{ fontFamily: Fonts.MontserratBold, color: '#142828', fontSize: 18, paddingBottom: 15, }}>Additional Fee</Text>
              <Text style={newinvoicestyles.labelText}>Enter the amount</Text>

              <View style={{ flexDirection: 'row', paddingTop: 5}}>
                <Text style={{ color: '#52c46e', fontFamily: Fonts.MontserratBold, fontSize: 15, justifyContent: 'center', alignItems: 'center' , paddingRight: 5 }}>£ </Text>
                <View style={{ flex: 1 }}>

                  <TextInputMask
                      type={'money'}
                      options={{
                      precision: 2,
                      separator: '.',
                      delimiter: ',',
                      unit: '',
                      suffixUnit: ''
                      }}
                      value={this.state.tempAdditonalFee}
                      onChangeText={text => {
                          this.textChange('tempAdditonalFee', text)
                      }}
                      style={newinvoicestyles.textInput}
                  />
                </View>
              </View>
              

              <Text style={[newinvoicestyles.labelText,{paddingBottom: 5}]}>Description</Text>
              {/* <Text style={{ color: '#aeb7af', fontFamily: Fonts.RubikMedium, fontSize: 12, lineHeight: 20 }}>Provide some information. Provide some information. Provide some information. Provide some information. Provide some information. Provide some information. Provide some information.</Text> */}

              <TextInput
                multiline={true}
                numberOfLines={4}
                placeholder={'Provide some information explaining why you have added an additional fee. For example, it is for a home visit.'}
                onChangeText={(text) => this.setState({ "additionalDescription": text })}
                value={this.state.additionalDescription}
                style={{ paddingTop: 0,  }}
                onSubmitEditing={Keyboard.dismiss}
              />

              <View style={[loginformStyles.loginButtonArea, { paddingTop: 25 }]}>
                <TouchableOpacity style={[loginformStyles.loginTouchable, { borderRadius: 10, width: '100%', paddingLeft: 15, paddingRight: 15, }]} onPress={() => {
                  // this.setState({ 'spinner': true });
                  // this.loginSubmitHandler();

                  var isValidForm = validate({ additionalFee: this.state.tempAdditonalFee, additionalDescription: this.state.additionalDescription }, addFeeValidation, { format: "detailed", numericality: true });
                  //console.log("Valid :", isValidForm);
                  if (isValidForm != undefined) {
                    DropDownHolder.dropDown.alertWithType('error', 'Error', (isValidForm[0]).options.message);
                  } else {
                    this.setState({ 'additionalFee': this.state.tempAdditonalFee });
                    this.setState({ "total": (parseFloat(this.state.Subtotal)+ parseFloat(this.state.tempAdditonalFee)) });
                    this.onClose();
                  }
                }}>
                  <Text style={[loginformStyles.loginButton, { fontSize: 15, }]}>ADD FEE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
      </TouchableWithoutFeedback>
        </Overlay>
        {/* End - Addditional Fee Overlay */}


        {/* Start - Add Invoice Complete Overlay */}
        <Overlay visible={this.state.invoiceComplete} onClose={this.onClose} closeOnTouchOutside containerStyle={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          childrenWrapperStyle={{
            width: '100%',
            height: 330, position: 'absolute',
            top: 100, right: 15, left: 20, borderRadius: 25
          }}>
          <View style={{

            // backgroundColor: '#FF9800',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%', alignSelf: 'center',
          }}>
            <Image style={{ marginTop: 25, width: 80, height: 80 }} source={require('./images/clap.png')}></Image>
            <Text style={{ color: '#142828', fontFamily: Fonts.RubikMedium, textAlign: 'center', fontSize: 15, marginTop: 20, }}>Congratulations !</Text>
            <Text style={{ color: '#aeb7af', fontSize: 13, fontFamily: Fonts.Rubik, textAlign: 'center', lineHeight: 20, marginTop: 15, marginLeft: 20, marginRight: 20, }}></Text>
            {/* <Button style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center', width: 75, height: 35, marginTop: 20, }}>
              <Text>OK</Text>
            </Button> */}

            <View style={[loginformStyles.loginButtonArea, { flex: 1, }]}>
              <TouchableOpacity elevation={5} style={[loginformStyles.loginTouchable, { borderWidth: 0, width: 100, height: 45, marginTop: 20 }]} onPress={() => {
                // this.setState({ 'spinner': true });
                // this.loginSubmitHandler();
                // goBack();
                // this.props.navigation.navigate('MainNavigation');
                this.props.navigation.dispatch(StackActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.navigate({ routeName: 'MainNavigation' })
                  ],
                }))
              }}>
                <Text style={[loginformStyles.loginButton, { fontFamily: Fonts.RubikMedium, }]}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Overlay>
        {/* End - Add Invoice Complete Overlay */}

        {this.state.sortVisible == true && 
              <CustomDropDown 
              title={'Select when the invoice is due'} 
              fieldName= '' 
              sortOption={this.state.sortOption} 
              visible={this.state.sortVisible} 
              onSelectItem={this.dateType} 
              onClose={this.onClose.bind(this)}
              selectedValue= {this.state.type} /> 
          }
      </View >
      </KeyboardAvoidingView>
    );
  }
}


export default NewInvoice;

const statusBarStyles = StyleSheet.create({
  statusBar: {
      height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
  },
});