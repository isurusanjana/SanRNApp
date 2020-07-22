import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native'
import EmptyState from '../../../../components/emptyState/emptyState';
import formStyles from '../../../../components/formTextInput/styles';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import { Button } from 'native-base';
import { styles } from '../../../login/styles';
import { Base64 } from 'js-base64';
import draftStyles from './styles';
import Overlay from 'react-native-modal-overlay';
import InvoiceSort from '../../../../components/invoiceSort/invoiceSort';
import { Services } from '../../../../services/services';
import { GET_INVOICE_URL } from '../../../../config/shared';
import PTRView from 'react-native-pull-to-refresh';
import AddItem from '../../../../components/addItem/addItem';
import Invoice from '../../../../components/invoiceCard/invoice';
import { Fonts } from '../../../../config/font';


export class Draft extends Component {

  constructor(props) {
    super(props);

    this.state = {
      spinner: true,
      displayData: [],
      user_id: null,
      dataArrived: false,
      sortVisible: false,
      sortOption: [
        {
          value: 'Alphabetical',
          id: 1,
          selected: false,
          sort: 'doctor_name'
        }, {
          value: 'Most Recent',
          id: 2,
          selected: true,
          sort: 'add_date'
        },
      ],
      basePath: '',
    };

    this.draftData = [];
    this.data = this.props.data;
    this.sentData = [];
    this.setService = new Services();
  }

  componentDidMount() {

    this.setState({ 'displayData': this.props.data });
    this.setState({ 'user_id': this.props.userID });
    this.setState({ 'dataArrived': false });

    setTimeout(() => {
      this.getDraftData("/add_date/desc");
    }, 500);

    this.focusListener = this.props.navigationData.addListener('didFocus', () => {
      this.onFocusFunction()
    })
  }

  onFocusFunction = async () => {
    this.setState({ 'spinner': true });
    this.setState({ 'displayData': this.props.data });
    this.setState({ 'user_id': this.props.userID });
    this.setState({ 'dataArrived': false });

    setTimeout(() => {
      this.getDraftData("/add_date/desc");
    }, 500);
  }


  componentWillUnmount() {
    this.focusListener.remove()
  }


  onClose(data, value) {

    this.setState({ sortVisible: false });
    if (value == true) {
      this.setState({ 'displayData': [] });
      this.setState({ 'dataArrived': false });
      this.draftData = [];
      this.setState({ 'spinner': true });
      if (data == 'add_date') {
        this.getDraftData("/add_date/desc");
      } else {
        this.getDraftData("/doctor_name/asc");
      }
    }
  };

  goToView = () => {
    this.props.navigationData.navigate('ViewInvoicePage');
  }

  getDraftData = async (params) => {

    this.setState({ 'dataArrived': false });
    this.setState({ 'displayData': [] });
    this.draftData = [];
    this.setService.getService(GET_INVOICE_URL + this.state.user_id + params + "/status/0", "")
      .then(async (responseData) => {
        await this.setState({ basePath: responseData['base_path'] });
        this.InvoicesData = true;
        for (let index = 0; index < responseData.info.length; index++) {
          if (responseData.info[index]['status'] == "0") {
            this.draftData.push(responseData.info[index]);
          }
        }
        console.log("this.draftData :", this.draftData);
        this.setState({ 'displayData': this.draftData });
        this.setState({ 'spinner': false });
        this.setState({ 'dataArrived': true });
      }, (error) => {
        this.InvoicesData = true;
        console.log("error :", error);
        this.setState({ 'spinner': false });
        this.setState({ 'dataArrived': true });
      })
  }

  _refresh = (resolve) => {
    let that = this;
    this.setState({ 'spinner': true });
    // return new Promise((resolve) => {
    return that.getDraftData("/add_date/desc");
    setTimeout(() => { resolve() }, 2000);
    console.log("Refresh");
    // });
  }

  render() {

    // const emptyDisplay = <PTRView style={{ marginTop: 40 }} onRefresh={this._refresh} ><EmptyState
    //   title="No Draft Invoices"
    //   setImage={require('../../../../assets/img/box.png')}
    //   displayMessage='You have no invoices. To create an invoice, click on the button below.'
    // /></PTRView>
    const win = Dimensions.get('window');
    const emptyDisplay =
      <View style={{ flex: 1, width: win.width }}>
        <EmptyState
          title="No Jobs"
          vectorImage={require('../images/empty_state.png')}
          displayMessage=''
          callBack={this._refresh}
        />
      </View>

    const displayData = <PTRView onRefresh={this._refresh} ><View style={draftStyles.container}>
      {/* <View style={{ flexDirection: 'row' }}>
        <View style={{ height: 20, textAlignVertical: 'bottom' }}><Text style={draftStyles.heading}>Draft invoices</Text></View>
        <View style={{ height: 20, textAlignVertical: 'bottom' }}><Text style={[draftStyles.headingSub, { paddingTop: (Platform.OS === 'android' ? 0 : 5) }]}>    {this.state.displayData.length} Items</Text></View>
        <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', alignContent: 'flex-end', alignSelf: 'flex-end', }} onPress={() => {
          this.setState({ "sortVisible": true });
        }}>
          <Text style={draftStyles.headingFilterIcon}>  . . .</Text>
        </TouchableOpacity>
      </View> */}
      <View style={{ paddingTop: 0, flexDirection: 'row', paddingLeft: 10, marginBottom: 5, alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
        <Text style={{ fontSize: 15, fontFamily: Fonts.MontserratBold, textAlignVertical: 'bottom', color: '#414253', }}>Draft invoices</Text>
        <Text style={{ color: '#CCD1D9',fontFamily: Fonts.MontserratBold, fontSize: 13, textAlignVertical: 'bottom', paddingLeft: 10, paddingBottom: 1, paddingTop: (Platform.OS === 'android' ? 0 : 3) }}>{this.state.displayData.length} Items</Text>
      </View>
      <ScrollView>
        <View style={{ paddingTop: 20 }}>
          {
            this.state.displayData.map(data => { 
              if(data.my_practice != null){
                return (
                <Invoice key={parseInt(data['invoice_id']) * Math.random()} data={data} callBack={() => {
                  data['invoice_pdf'] = this.state.basePath + data['invoice_pdf'];
                  this.props.navigationData.navigate('ViewInvoicePage', {
                    invoiceData: data,
                    ButtonTitle: 'SEND',
                    ButtonStatus: 1,
                    ButtonType: 0,
                    pageRefresh: this.onClose.bind(this)
                  });
                }}></Invoice>                   
              )
              }
              
            })

          }
        </View>
      </ScrollView>
    </View>
    </PTRView>

    return (
      <View style={{ flex: 1 }}>

        {this.state.dataArrived == true ? this.state.displayData.length == 0 ? emptyDisplay : displayData : null}

        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />

        <InvoiceSort title={'Sort By'} sortOption={this.state.sortOption} visible={this.state.sortVisible} onClose={this.onClose.bind(this)} />

        <AddItem style={{ zIndex: 5 }}
          Navigation={this.props.navigationData}
          goToPage={'NewInvoicePage'}
          CallBack={{
            pageRefresh: this.onClose.bind(this)
          }}
        />
      </View>
    )
  }
}

export default Draft
