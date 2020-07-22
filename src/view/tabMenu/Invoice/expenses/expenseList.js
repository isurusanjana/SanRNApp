import React, { Component } from 'react';
import { View, Text, Dimensions, StatusBar, TouchableOpacity, ImageBackground, 
        ScrollView, Image, Platform, NativeModules, AsyncStorage, StyleSheet } from 'react-native';
import { Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';

import expenseStyles from './style';
import { Services } from '../../../../services/services';
import { GET_EXPENSES } from '../../../../config/shared';
import AddItem from '../../../../components/addItem/addItem';
import DropDownHolder from "../../../../components/dropDown/dropDownHolder";
import { Fonts } from '../../../../config/font';

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 10 : (StatusBarManager.HEIGHT + 10);
const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[styles.statusBar, { backgroundColor }]}>
        <StatusBar translucent backgroundColor={backgroundColor} {...props}  />
    </View>
);

export default class expenseList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: 0,
            imageWidth: 0,
            imageHeight: 0,
            iconImageWidth: 0,
            iconImageHeight: 0,
            spinner: true,
            totalExpensesItems: 0,
            totalExpensesPrice: 0,
            expensesList: [],
            defaultImage:'',
            basePath:''
        };
        this.setServices = new Services();
        
    }

    componentDidMount = async () => {
        await AsyncStorage.multiGet(["user_id"]).then(response => {this.setState({"userId" : response[0][1]});}); 
        this.getScaledHeight(66, 51, 'back');
        this.getScaledHeight(50, 24, 'white');
        this.getMyExpenses();
    }

    updateData = data => {
        if(data.pageEdited == true) {
            this.setState({totalExpensesPrice: 0});
            this.getMyExpenses();
            if(data.type == 'alert') {
                setTimeout(() => {
                    DropDownHolder.dropDown.alertWithType(data.alertType, '', data.displayMsg);
                }, 250);
            }
        }
    }

    getScaledHeight = (sourceWidth,sourceHeight, type) => { 
        let multiplicationValue = type == 'white' ?  0.30 : 0.35;  
        let width = (Dimensions.get('window').width) * multiplicationValue;
        let ratio = width / sourceWidth;
        if(type == 'white') {
            this.setState({
                iconImageWidth: sourceWidth * ratio,
                iconImageHeight: sourceHeight * ratio
            });
        } else {
            this.setState({
                imageWidth: sourceWidth * ratio,
                imageHeight: sourceHeight * ratio
            });
        }        
    }

    getMyExpenses = async () => {
        this.setServices.postService(GET_EXPENSES + this.state.userId, "")
        .then(async (responseData) => {
            if(responseData.error == 0) {
                await this.setState({basePath: responseData.base_path});
                await this.setState({defaultImage: responseData.default_image});                
                let arrayCount = Object.keys(responseData.info).length;
                this.setState({ totalExpensesItems: arrayCount });

                var totalPrice = this.state.totalExpensesPrice;

                let newArray = await responseData.info.map((item, key) => {
                    totalPrice = totalPrice + parseFloat(item.expense_amount);
                });

                this.setState({totalExpensesPrice: totalPrice});
                await this.setState({ expensesList: responseData.info});
            }
 
            this.setState({ 'spinner': false });
        }, (error) => {
            console.log(error);
            this.setState({ 'spinner': false });
        })
    }

    textTruncate = (str, length, ending) => {
        if (length == null) {
            length = 100;
          }
          if (ending == null) {
            ending = ' ...';
          }
          if (str.length > length) {
            return str.substring(0, length - ending.length) + ending;
          } else {
            return str;
          }
    }

  render() {
    const { goBack } = this.props.navigation;
    return (
        <View style={{ flex: 1}} >

            {/* <StatusBar
                backgroundColor="#6630E2"
                barStyle="light-content"
            /> */}
            <Spinner
                visible={this.state.spinner}
                textContent={'Loading...'}
                textStyle={expenseStyles.spinnerTextStyle}
            />

            <ImageBackground source={require('./images/Slice_10.png')} style={{width: '100%', height: 200}}>

            {
                Platform.OS === 'ios' ? <MyStatusBar backgroundColor="transparent" barStyle="light-content" /> : <StatusBar backgroundColor="transparent" barStyle="light-content" />
            }
                <View style={{ height: (Dimensions.get('window').height) * 0.08, paddingHorizontal:20, marginTop: (Platform.OS === 'ios' ? 40 : 50)}}>
                    {/* <View style={{width:25, }}>
                        <TouchableOpacity onPress={() => { goBack() }}  
                        style={{ paddingTop:25,justifyContent: 'center', alignContent: 'flex-start', alignItems: 'flex-start' }}>
                            <Image source={require('./images/whiteBackIcon.png')} style={{ width: 16, height:16, }}></Image>  
                        </TouchableOpacity>
                    </View>
                    <View >
                        <Text style={[expenseStyles.headerTitle,{justifyContent: 'center',}] }>Expenses</Text>
                    </View> */}
                    <View style={{width: '90%',justifyContent:'flex-start',}}>
                        <TouchableOpacity onPress={() => { goBack() }} style={{ flexDirection: 'row', }}>
                            <View style={{justifyContent: 'center', paddingRight: 10}}>
                                <Image source={require('./images/whiteBackIcon.png')} style={{ width: 16, height:16 }}></Image>  
                            </View>
                            <View  style={{justifyContent: 'center', paddingRight: 10}}>
                                <Text style={{color: '#FFFFFF',fontFamily: Fonts.MontserratBold,fontSize: 18,}}>Expenses</Text>
                            </View>                    
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', height: (Dimensions.get('window').height) * 0.16, paddingHorizontal:20,  }}>
                    <View style={ expenseStyles.headerBottomRightArea }>
                        <View style={ expenseStyles.headerBottomRight }>
                            <View style={{paddingBottom:8}}><Text style={ expenseStyles.totalText }>Total Expenses:</Text></View>
                            <View style={{ flexDirection: 'row', }}>
                                <Text style={ expenseStyles.topSymbol }>£</Text>
                                <Text style={ expenseStyles.topPrice }>{ this.state.totalExpensesPrice.toFixed(2)}</Text>
                            </View>
                        </View>
                        
                    </View>
                </View>

            </ImageBackground>

            <View style={[ expenseStyles.expenseBody,{paddingHorizontal:20}] }>
                <ScrollView>
                    {/* <View style={ expenseStyles.bodyItemArea }>
                        <Text style={ expenseStyles.heading }>Latest expenses</Text>
                        <Text style={[expenseStyles.headingSub, {paddingTop : (Platform.OS === 'android' ? 0 : 3)}]}> {this.state.totalExpensesItems} Items</Text>
                    </View> */}
                    <View style={ expenseStyles.itemDisplayArea }>
                        {
                            this.state.expensesList != null && this.state.expensesList.map((item, key) => {
                                item.basePath = this.state.basePath;
                                item.defaultImage = this.state.defaultImage;
                            return (
                                <TouchableOpacity key={key} style={expenseStyles.clickArea} onPress={() => {
                                    this.props.navigation.navigate('AddViewExpensesPage', {
                                        expenseData: item,
                                        updateData: this.updateData
                                    });
                                }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={ expenseStyles.listItemLeft }>
                                        <Text style={ expenseStyles.textType }>{ this.textTruncate(item.expense_type,28) }</Text>
                                        <Text style={ expenseStyles.textDescription }>{ this.textTruncate(item.expense_description,28) }</Text>
                                    </View>
                                    <View  style={ expenseStyles.listItemRight }>
                                        <Text style={ expenseStyles.itemPrice }>£ {parseFloat(item.expense_amount).toFixed(2) }</Text>
                                        <Text style={ expenseStyles.textDate }>{ moment(item.expense_date, 'DD/MM/YYYY').format('DD MMM YYYY') }</Text>

                                    </View>
                                </View>
                                <View style={ expenseStyles.hrLine } />
                                
                                </TouchableOpacity>
                            )
                            })
                        }
                    </View>
                </ScrollView>
            </View>

            <AddItem style={{ zIndex: 5 }}
                Navigation={this.props.navigation}
                goToPage={'AddViewExpensesPage'}
                CallBack={{
                    updateData: this.updateData
                }}
            />
        </View>
    );
  }
}

const styles = StyleSheet.create({
    statusBar: {
        height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    },
});
