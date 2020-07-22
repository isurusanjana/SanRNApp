import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native'
import EmptyState from '../../../../components/emptyState/emptyState';
import formStyles from '../../../../components/formTextInput/styles';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import { Button } from 'native-base';
import { styles } from '../../../login/styles';
import { Base64 } from 'js-base64';
import sentStyles from './styles';
import { Services } from '../../../../services/services';
import { GET_INVOICE_URL } from '../../../../config/shared';
import InvoiceSort from '../../../../components/invoiceSort/invoiceSort';
import PTRView from 'react-native-pull-to-refresh';
import AddItem from '../../../../components/addItem/addItem';
import { Fonts } from '../../../../config/font';
import Invoice from '../../../../components/invoiceCard/invoice';

class Sent extends Component {
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
    this.data = this.props.data;
    this.sentData = [];
    this.setService = new Services();
  }

  componentDidMount() {

    this.setState({ 'displayData': this.props.data });
    this.setState({ 'user_id': this.props.userID });
    console.log("Component Did Mount Sent");
    // setTimeout(() => {
    //   this.setState({ 'spinner': false });
    // }, 500);
    this.sentData = [];
    this.getOverDueData();

    this.focusListener = this.props.navigationData.addListener('didFocus', () => {
      this.onFocusFunction()
    })
  }

  onFocusFunction = async () => {
    this.setState({ 'spinner': true });
    this.setState({ 'displayData': this.props.data });
    this.setState({ 'user_id': this.props.userID });

    this.sentData = [];
    this.getOverDueData();
  }
  

  componentWillUnmount () {
    this.focusListener.remove()
  }

  getSentData = async () => {
    this.setService.getService(GET_INVOICE_URL + this.props.userID  + "/status/1", "")
      .then(async(responseData) => { 
        this.InvoicesData = true;
        await this.setState({basePath: responseData['base_path']});
        if (responseData.info instanceof Array) {
          for (let index = 0; index < responseData.info.length; index++) {
            if (responseData.info[index]['status'] == "1") {
              this.sentData.push(responseData.info[index]);
            }

          }
        }
        this.setState({ 'displayData': this.sentData });
        this.setState({ 'spinner': false });
        this.setState({ 'dataArrived': true });

        // this.getOverDueData();
      }, (error) => {
        this.InvoicesData = true;
        console.log("error :", error);
        this.setState({ 'spinner': false });
        this.setState({ 'dataArrived': true });
        this.setState({ 'displayData': this.sentData });
      })
  }

  getOverDueData() {
    this.setState({ 'dataArrived': false });
    this.setState({ 'displayData': [] });
    this.sentData = [];
    this.setService.getService(GET_INVOICE_URL + this.props.userID  + "/status/2", "")
      .then((responseData) => {
        this.InvoicesData = true;
        if (responseData.info instanceof Array) {
          for (let index = 0; index < responseData.info.length; index++) {
            if (responseData.info[index]['status'] == "2") {
              this.sentData.push(responseData.info[index]);
            }
          }
        }
        

      this.getSentData();
        
      }, (error) => {
        this.InvoicesData = true;
        console.log("error :", error);
        this.setState({ 'spinner': false });
        this.setState({ 'displayData': this.sentData });
        this.setState({ 'dataArrived': true });
      })
  }
  onClose(data, value) {

    this.setState({ sortVisible: false });
    if (value == true) {
      this.setState({ 'displayData': [] });
      this.setState({ 'dataArrived': false });
      this.sentData = [];
      this.setState({ 'spinner': true });
      if (data == 'add_date') {
        this.getOverDueData();
      } else {
        this.getOverDueData();
      }

    }
  };

  _refresh = (resolve) => {
    let that = this;
    this.setState({ 'spinner': true });
    // return new Promise((resolve) => {
    return that.getOverDueData();
    setTimeout(() => { resolve() }, 2000);
    console.log("Refresh");
    // });
  }

  render() {

    // const emptyDisplay = <PTRView style={{ marginTop: 25 }} onRefresh={this._refresh} ><EmptyState
    //   title="No Sent Invoices"
    //   setImage={require('../../../../assets/img/box.png')}
    //   displayMessage=''
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



    const displayData = <PTRView onRefresh={this._refresh} ><View style={sentStyles.container}>
      {/* <View style={{ flexDirection: 'row' }}>
        <Text style={sentStyles.heading}>Sent invoices</Text>
        <Text style={[sentStyles.headingSub, {paddingTop: (Platform.OS === 'android' ? 0 : 5)}]}>    {this.state.displayData.length} Items</Text>
        <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', alignContent: 'flex-end', alignSelf: 'flex-end', }} onPress={() => {
          this.setState({ "sortVisible": true });
        }}>
          <Text style={sentStyles.headingFilterIcon}>  . . .</Text>
        </TouchableOpacity>
      </View> */}

      <View style={{ paddingTop: 0, flexDirection: 'row', paddingLeft: 10, marginBottom: 5, alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
        <Text style={{ fontSize: 15, fontFamily: Fonts.MontserratBold, textAlignVertical: 'bottom', color: '#414253', }}>Sent invoices</Text>
        <Text style={{ color: '#CCD1D9',fontFamily: Fonts.MontserratBold, fontSize: 13, textAlignVertical: 'bottom', paddingLeft: 10, paddingBottom: 1, paddingTop: (Platform.OS === 'android' ? 0 : 3) }}>{this.state.displayData.length} Items</Text>
      </View>

      <ScrollView>
        <View style={{ paddingTop: 10  }}>
          {
            this.state.displayData.map(data => {
              {/* console.warn(data); */}
              if (data.my_practice != null)
                return (
                  <Invoice key={parseInt(data['invoice_id']) * Math.random()} data={data} callBack={() => {
                    data['invoice_pdf'] = this.state.basePath +''+ data['invoice_pdf'];
                    this.props.navigationData.navigate('ViewInvoicePage', {
                      invoiceData: data,
                      ButtonTitle: 'MARK AS PAID',
                      ButtonStatus: 3,
                      ButtonType: 1,
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

export default Sent;
