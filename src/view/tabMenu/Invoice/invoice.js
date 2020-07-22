import React, { Component } from 'react';
import { View, Text, StatusBar, AsyncStorage, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Header, Body, Right, Left } from 'native-base';
import { Icon } from 'native-base';
import { invoicestyles } from './styles';
import Draft from './draft/draft';
import Paid from './paid/paid';
import Sent from './sent/sent';
import { Services } from '../../../services/services';
import { GET_INVOICE_URL } from '../../../config/shared';
import CustomTab, { tabHeadingStyles } from '../../../components/CustomTabs/CustomTab';
import AddItem from '../../../components/addItem/addItem';
import Spinner from 'react-native-loading-spinner-overlay';
import { styles } from '../../login/styles';

class Invoices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      user_id: null
    };

    this.setService = new Services();
    this.InvoicesData = false;
    this.draftData = [];
    this.sentData = [];
    this.overDueData = [];
    this.paidtData = [];

  }

  // componentDidMount() {
  //   this.getInvoicesData();
  // }

  componentDidMount = async () => {

    // this.setState({ 'spinner': true });
    await AsyncStorage.multiGet(["user_id"
    ]).then(response => {
      console.log("Response :", response);
      this.setState({ "user_id": response[0][1] });
      // this.getInvoicesData(response[0][1]);
      this.InvoicesData = true;
      console.log("Respthis.InvoicesData :", this.InvoicesData);

      this.setState({ 'spinner': false });
    })
  }

  // getInvoicesData(user_id) {
  //   this.setService.getService(GET_INVOICE_URL + user_id + "/add_date/desc/status/0", "")
  //     .then((responseData) => {
  //       console.log("responseData :", responseData);
  //       this.InvoicesData = true;
  //       for (let index = 0; index < responseData.info.length; index++) {
  //         if (responseData.info[index]['status'] == "0") {
  //           this.draftData.push(responseData.info[index]);
  //         }
  //       }
  //       console.log("this.draftData :", this.draftData);
  //       this.setState({ 'spinner': false });
  //     }, (error) => {
  //       this.InvoicesData = true;
  //       console.log("error :", error);
  //       this.setState({ 'spinner': false });
  //     })
  // }

  displayID(id) {
    // alert(id);
  }

  render() {

    const { navigate } = this.props.navigation;
    const TabsComponent = <CustomTab callBack={this.displayID.bind(this)}>
      {/* First tab */}
      <View title="DRAFT" style={tabHeadingStyles.content}>
        <Draft data={this.draftData} navigationData={this.props.navigation} userID={this.state.user_id} />
      </View>
      {/* Second tab */}
      <View title="SENT" style={tabHeadingStyles.content}>
        <Sent data={this.sentData} navigationData={this.props.navigation} userID={this.state.user_id} />
      </View>
      {/* Third tab */}
      <View title="PAID" style={tabHeadingStyles.content}>
        <Paid data={this.paidtData} navigationData={this.props.navigation} userID={this.state.user_id} />
      </View>
    </CustomTab>

    return (
      <View style={invoicestyles.container}>
        <Header elevation={3} transparent>
          <StatusBar
            backgroundColor="#FFFFFF"
            barStyle="dark-content" 
          />
          {/* <View style={{ flexDirection: 'row', height: (Dimensions.get('window').height) * 0.1, paddingHorizontal: 10, paddingTop: 5 }}>
            <View style={{ width: '33%', justifyContent: 'center', }}></View>
            <View style={{ width: '33%', justifyContent: 'center', }}>
              <Text style={invoicestyles.reverseHeaderTitle}>Invoices</Text>
            </View>

            <View style={{ width: '33%', alignItems: 'flex-end', justifyContent: 'center', }}>
              <TouchableOpacity onPress={() => { this.props.navigation.navigate('ExpenseListPage'); }}>
                <Image source={require('./expenses/images/expense.png')} style={{ width: 30, height: 30, }} />
              </TouchableOpacity>
            </View>
          </View> */}

          <View style={{ flexDirection: 'row', height: (Dimensions.get('window').height) * 0.1, paddingHorizontal: 10, paddingTop: 5 }}>
            <View style={{ width: '67%' }}>
              <Text style={invoicestyles.reverseHeaderTitle}>Invoices</Text>
            </View>

            <View style={{ width: '33%', alignItems: 'flex-end', justifyContent: 'center', }}>
              <TouchableOpacity style={{ backgroundColor: '#fff', borderRadius: 10 }} onPress={() => {
                this.props.navigation.navigate('ExpenseListPage');
              }}>
                <Image resizeMode='contain' source={require('./expenses/images/expense.png')} style={{ width: 20, height: 20, }} />
              </TouchableOpacity>
            </View>
          </View>
        </Header>
        {this.InvoicesData == true ? TabsComponent : null}

        {/* <AddItem style={{ zIndex: 5 }}
          Navigation={this.props.navigation}
          goToPage={'NewInvoicePage'}
        /> */}


        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
      </View>
    );
  }
}

export default Invoices;
