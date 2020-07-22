import React, { Component } from 'react'
import { Text, View, TouchableOpacity, ScrollView, Platform, Dimensions } from 'react-native'
import EmptyState from '../../../../components/emptyState/emptyState';
import formStyles from '../../../../components/formTextInput/styles';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import { Button } from 'native-base';
import { styles } from '../../../login/styles';
import { Base64 } from 'js-base64';
import paidStyles from './styles';
import { Services } from '../../../../services/services';
import { GET_INVOICE_URL } from '../../../../config/shared';
import InvoiceSort from '../../../../components/invoiceSort/invoiceSort';
import PTRView from 'react-native-pull-to-refresh';
import AddItem from '../../../../components/addItem/addItem';
import { Fonts } from '../../../../config/font';
import Invoice from '../../../../components/invoiceCard/invoice'

export class Paid extends Component {

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
      basePath: ''
    };
    const { navigation } = this.props;
    console.log("Params :", this.props.data);
    this.data = this.props.data;
    this.paidtData = [];
    this.setService = new Services();
  }

  componentDidMount() {
    console.log("Component Did Mount");
    this.setState({ 'displayData': this.props.data });
    this.setState({ 'user_id': this.props.userID });
    // setTimeout(() => {
    //   this.setState({ 'spinner': false });
    // }, 500);

    this.getPaidData("/add_date/desc");

    this.focusListener = this.props.navigationData.addListener('didFocus', () => {
      this.onFocusFunction()
    })
  }

  onFocusFunction = async () => {
    this.setState({ 'spinner': true });
    this.setState({ 'displayData': this.props.data });
    this.setState({ 'user_id': this.props.userID });

    this.getPaidData("/add_date/desc");
  }


  componentWillUnmount() {
    this.focusListener.remove()
  }

  getPaidData = async (params) => {
    this.setState({ 'dataArrived': false });
    this.setState({ 'displayData': [] });
    this.paidtData = [];
    this.setService.getService(GET_INVOICE_URL + this.props.userID + params + "/status/3", "")
      .then(async (responseData) => {
        console.log("responseData :", responseData);
        this.InvoicesData = true;
        await this.setState({ basePath: responseData['base_path'] });
        if (responseData.info instanceof Array) {
          for (let index = 0; index < responseData.info.length; index++) {
            if (responseData.info[index]['status'] == "3" && responseData.info[index]['practice_name'] != null) {
              this.paidtData.push(responseData.info[index]);
            }
          }
        }
        console.log("this.paidtData :", this.paidtData);

        this.setState({ 'spinner': false });
        this.setState({ 'displayData': this.paidtData });
        this.setState({ 'dataArrived': true });
      }, (error) => {
        this.InvoicesData = true;
        console.log("error :", error);
        this.setState({ 'spinner': false });
        this.setState({ 'displayData': this.paidtData });
        this.setState({ 'dataArrived': true });
      })
  }

  onClose(data, value) {

    this.setState({ sortVisible: false });
    if (value == true) {
      this.setState({ 'displayData': [] });
      this.setState({ 'dataArrived': false });
      this.paidtData = [];
      this.setState({ 'spinner': true });
      if (data == 'add_date') {
        this.getPaidData("/add_date/desc");
      } else {
        this.getPaidData("/doctor_name/asc");
      }

    }
  };

  _refresh = (resolve) => {
    let that = this;
    this.setState({ 'spinner': true });
    // return new Promise((resolve) => {
    return that.getPaidData("/add_date/desc");
    setTimeout(() => { resolve() }, 2000);
    console.log("Refresh");
    // });
  }

  render() {

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
    const displayData = <PTRView onRefresh={this._refresh} ><View style={paidStyles.container}>

      <View style={{ paddingTop: 0, flexDirection: 'row', paddingLeft: 10, marginBottom: 5, alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
        <Text style={{ fontSize: 15, fontFamily: Fonts.MontserratBold, textAlignVertical: 'bottom', color: '#414253', }}>Paid invoices</Text>
        <Text style={{ color: '#CCD1D9', fontFamily: Fonts.MontserratBold, fontSize: 13, textAlignVertical: 'bottom', paddingLeft: 10, paddingBottom: 1, paddingTop: (Platform.OS === 'android' ? 0 : 3) }}>{this.state.displayData.length} Items</Text>
      </View>
      <ScrollView>
        <View style={{ paddingTop: 10 }}>
          {
            this.state.displayData.map(data => {
              return (  
              <Invoice key={parseInt(data['invoice_id']) * Math.random()} data={data} callBack={() => {
                data['invoice_pdf'] = this.state.basePath + '' + data['invoice_pdf'];
                  this.props.navigationData.navigate('ViewInvoicePage', {
                    invoiceData: data,
                    ButtonTitle: 'MARK AS UNPAID',
                    ButtonStatus: 1,
                    ButtonType: 2,
                    pageRefresh: this.onClose.bind(this)
                });
              }}></Invoice>               
              )
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
          }} />
      </View>
    )
  }
}


export default Paid;