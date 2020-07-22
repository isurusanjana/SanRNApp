import React, { Component } from 'react';
import { View, Text, TextInput, Dimensions, StatusBar, TouchableOpacity, ImageBackground, 
        ScrollView, Image, Platform, NativeModules, AsyncStorage, KeyboardAvoidingView, 
        TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import Actionsheet from 'react-native-enhanced-actionsheet';
import ImagePicker from 'react-native-image-picker';
import Overlay from 'react-native-modal-overlay';
import { Icon, List, ListItem } from 'native-base';
import DatePicker from 'react-native-date-picker';
import validate from 'validate.js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RNFetchBlob from 'rn-fetch-blob';
import { TextInputMask } from 'react-native-masked-text';

import expenseStyles from './style';
import { Services } from '../../../../services/services';
import { ServiceParams } from '../../../../services/serviceParams';
import { ADD_EXPENSES, UPDATE_EXPENSES, EXPENSES_IMAGE_PATH, DELETE_EXPENSES } from '../../../../config/shared';
import { Fonts } from '../../../../config/font';
import DropDownHolder from "../../../../components/dropDown/dropDownHolder";
import CustomDropDown from '../../../../components/CustomDropDown/customDropDown';

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;
const OPTIONS = [
    { id: 1, label: 'Camera' },
    { id: 2, label: 'Gallery' },
];

const constraintsExpense = {
    amount: {
        presence: {
            allowEmpty: false,
            message: "cannot be blank."
        },
    },
    description: {
        presence: {
            allowEmpty: false,
            message: "cannot be blank."
        },
    },
    type: {
        presence: {
            allowEmpty: false,
            message: "cannot be blank."
        },
    },    
    date: {
        presence: {
            allowEmpty: false,
            message: "cannot be blank."
        },
    },    
  }


export default class addViewExpenses extends Component { 
    constructor(props) {
        super(props);
        this.state = {
            userId: 0,
            expenseId: 0,
            iconImageWidth: 0,
            iconImageHeight: 0,
            spinner: true,
            expensesData: '',
            sourceWidth: 0,
            sourceHeight: 0,
            imageWidth: 0,
            imageHeight: 0,
            overlayImageWidth: 0,
            overlayImageHeight: 0,
            imageUri: '',
            imageDisplay: '',
            visible: false,
            amount: 0,
            description: '',
            type: '',
            currentDate: new Date(),
            date: new Date(),
            showType: false,
            arrowSource: require("./images/dropdown-arrow.png"),
            setDate: false,
            imageDetails: [],
            pageType: 0,
            pageEdited: false,
            calenderChanged: false,
            imageExists: false,
            confirmationDisplay: false,
            sortVisible: false,
            imageLoading: true,
            defaultImage: '',
            defaultImageWidth: 0,
            defaultImageHeight: 0,
            sortOption: [
                {
                    value: 'Office, property and equipment',
                    id: 1,
                    selected: false,
                    sort: 'data'
                }, {
                    value: 'Car, van and travel expenses',
                    id: 2,
                    selected: false,
                    sort: 'data'
                }, {
                    value: 'Clothing expenses',
                    id: 3,
                    selected: false,
                    sort: 'data'
                }, {
                    value: 'Marketing entertainment and subscriptions',
                    id: 4,
                    selected: false,
                    sort: 'data'
                }, {
                    value: 'Legal and financial costs',
                    id: 5,
                    selected: false,
                    sort: 'data'
                }
            ],
        };
        this.setServices = new Services();
    }

    componentDidMount = async () => {
        await AsyncStorage.multiGet(["user_id"]).then(response => {this.setState({"userId" : response[0][1]});}); 
        await this.getScaledHeight(89, 42, 'blue');
        await this.getScaledHeight(345, 595, 'overlay') ;
        if(this.props.navigation.getParam('expenseData') != undefined) {
            this.setState({pageType: 1});
            await this.setState({ expensesData: this.props.navigation.getParam('expenseData') });
            await this.splitParams();
            await this.checkImageExists();
        }

        await this.getResizedImage();
        this.setState({ 'spinner': false });
        
    }

    splitParams = async () => {
        let expenseData = this.state.expensesData;

        this.setState({type: expenseData.expense_type});
        this.setState({amount: expenseData.expense_amount});
        this.setState({date: expenseData.expense_date});
        this.setState({description: expenseData.expense_description});
        this.setState({expenseId: expenseData.id});
        if(expenseData.expense_report != null && expenseData.expense_report != '') {
            await this.setState({imageUri: expenseData.basePath + expenseData.expense_report});
        } else {
            await this.setState({imageUri: expenseData.basePath + expenseData.defaultImage});
        }
        await this.setState({defaultImage: expenseData.basePath + expenseData.defaultImage});
        let expenseDate = new Date(moment(expenseData.expense_date, "DD/MM/YYYY").format('YYYY-MM-DD'));
        this.setState({currentDate: expenseDate});
    }

     checkImageExists = async () => {
        // send http request in a new thread (using native code)
        let accessToken = await AsyncStorage.getItem('accessToken')|| 'none';
        await RNFetchBlob.fetch('GET', this.state.imageUri, {
           'Authorization' : 'Bearer ' + accessToken,
        })
        .then(async (res) => { 
          let info = res.info();
          if(info.status == 200) {
            await this.setState({imageExists: true});
          } else {
            // handle other status codes
            await this.setState({imageUri: this.state.defaultImage});
            await this.setState({imageExists: false});
          }
        })
        // Something went wrong:
        .catch((errorMessage, statusCode) => {
          // error handling
          this.setState({imageExists: false});
        })
    }

    getResizedImage = async () => {
        // console.warn('image uri',this.state.imageUri);
        if(this.state.imageExists == true ) {
            Image.getSize(this.state.imageUri, (width, height) => { this.getScaledHeight(width, height, 'none') });
        } else {
             this.getScaledHeight(2320, 1160, 'blue');
        }
        
    }

    getScaledHeight = async (sourceWidth,sourceHeight, type) => { 
        if(type == 'overlay') {
            let width = (Dimensions.get('window').width * 0.9);
            let ratio = width / sourceWidth;
            await this.setState({
                overlayImageWidth: sourceWidth * ratio,
                overlayImageHeight: sourceHeight * ratio
            });  
        } else { 
            let multiplicationValue = type == 'blue' ?  0.16 : 0.16;  
            let height = (Dimensions.get('window').height) * multiplicationValue;
            let ratio = height / sourceHeight;
            if(type == 'blue') {
                this.setState({
                    iconImageWidth: sourceWidth * ratio,
                    iconImageHeight: sourceHeight * ratio
                });
                if(((sourceHeight * ratio) > (Dimensions.get('window').height) * 0.4) || ((sourceWidth * ratio) > (Dimensions.get('window').width)*0.55) ) {
                    let width = (Dimensions.get('window').width) * 0.52; 
                    ratio = width / sourceWidth;
                    this.setState({
                        imageWidth: sourceWidth * ratio,
                        imageHeight: sourceHeight * ratio
                    }); 
                } else {
                    this.setState({
                        imageWidth: sourceWidth * ratio,
                        imageHeight: sourceHeight * ratio
                    });
                }
                
            }    
        }    
    }

    launchCamera = () => {
        console.log("Launch Camera");
        const options = {
        title: 'Select Avatar',
        customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
        };
  
        // Open Image Library:
      ImagePicker.launchCamera(options, (response) => {
        console.log('Response = ', response);
  
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        } else {
            const source = { uri: response.uri };
            this.setState({ imageDetails: response });
        }
        });
      }
  
    launchLibrary = () => {  
        const options = {
        title: 'Select Avatar',
        customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
        };
  
        ImagePicker.launchImageLibrary(options, (response) => {
        console.log('Response = ', response);
  
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        } else {
            this.setState({ imageDetails: response });
            const source = { uri: response.uri };
            this.setState({ avatarSource: source });
        }
        });
    }

    showActionSheet = () => {
        this.setState({ visible: true })
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

    expensesValidate = () => {
        var isValidInfo= validate({ amount: this.state.amount, 
                                    description: this.state.description,
                                    type: this.state.type,
                                    date: this.state.date,
                                },constraintsExpense, { format: "detailed" });

        if (isValidInfo != undefined) {
            this.setState({ 'spinner': false });
            DropDownHolder.dropDown.alertWithType('error', 'Error', (isValidInfo[0]).error);
            return false;
        } else {
            this.expenseHandler();
        }
    }

    expenseHandler = async () => {
        let apiUrl = this.state.pageType == 0 ? ADD_EXPENSES+this.state.userId : ADD_EXPENSES+this.state.expenseId+'/edit';

        this.setServices.postService(apiUrl, ServiceParams.getExpenseParams(this.state.amount,
                                                                            this.state.description,
                                                                            this.state.type,
                                                                            this.state.date,
                                                                            this.state.imageDetails,
                                                                            this.state.calenderChanged ))
        .then(async (responseJson) => { 
            if (responseJson.error == 0) { 
                if(responseJson.upload_data != undefined && responseJson.upload_data.is_image == true) {
                    await this.setState({imageUri: responseJson.base_path + responseJson.upload_data.file_name});
                    await this.checkImageExists();
                    await this.getResizedImage();
                }

                if(this.state.pageType == 0) { 
                    await this.props.navigation.state.params.updateData({
                        pageEdited : true ,
                        type : 'alert',
                        alertType: 'success',
                        displayMsg: 'Expense has been added' });
                    this.props.navigation.navigate('ExpenseListPage');
                } else {
                    this.setState({pageEdited: true});
                    DropDownHolder.dropDown.alertWithType('success', 'Success', ''); 
                } 
                
                              
            } else {
                DropDownHolder.dropDown.alertWithType('error', 'Error', responseJson.info);
            }                    
            this.setState({ 'spinner': false });
        }, (error) => {  
            this.setState({ 'spinner': false });
            DropDownHolder.dropDown.alertWithType('error', 'Error', ' results:' + error);
        })
    }

    deleteExpense = async () => { 
        this.setState({ 'confirmationDisplay': false });
        await this.setServices.deleteService(DELETE_EXPENSES+'/'+this.state.expenseId, '')
        .then(async (responseJson) => { 
            if (responseJson.error == 0) {
                this.props.navigation.state.params.updateData({
                    pageEdited : true ,
                    type : 'alert',
                    alertType: 'success',
                    displayMsg: 'Expense has been deleted' });
                this.props.navigation.navigate('ExpenseListPage');

            } else {
                DropDownHolder.dropDown.alertWithType('error', 'Error', responseJson.info);
            }
            this.setState({ 'spinner': false });
        }, (error) => { 
            DropDownHolder.dropDown.alertWithType('error', 'Error', ' results:' + error);
            this.setState({ 'spinner': false });
        })        
        
    }

    onClose  = (sortOption, value) => { 
        this.setState({ sortVisible: false });    
    };

    handleType  = (sortOption, value) => {
        this.setState({sortOption: sortOption });
        this.setState({type: value});
        this.setState({ sortVisible: false });
    }

    onError(error){
        console.warn('error');
        // this.setState({ imageDisplay: require('./images/add-epenses.png')});
    }

    render() {
        let that = this;
        let ranRef = Math.random();
        const { goBack } = this.props.navigation;
        let TypeData = [{id:1,text: 'Office, property and equipment',}, 
                            {id:2,text: 'Car, van and travel expenses',}, 
                            {id:3,text: 'Clothing expenses',},
                            {id:4,text: 'Marketing entertainment and subscriptions',},
                            {id:5,text: 'Legal and financial costs',}];
        let TypeItems = TypeData.map(function(result) {
            return (<ListItem key={result.id}  button={true} onPress={() => {
                                                                that.setState({type: result.text });
                                                                that.setState({showType: false});
                                                            }} 
                        style = {result.text == that.state.type ? expenseStyles.selectedListItem : expenseStyles.listItem}
                        selected = {result.text == that.state.type ? true : false}>
                        <Text style={ result.text == that.state.type ? expenseStyles.selectedListText : expenseStyles.listText}>{ that.textTruncate(result.text,25) }</Text>
                    </ListItem>) ;
        });
        return (
            <View style={{ flex: 1, }}>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Loading...'}
                    textStyle={expenseStyles.spinnerTextStyle}
                />

                <ScrollView>
                    <View   style={{ height: (Dimensions.get('window').height) * 0.40, backgroundColor:'#EB5757', }}>
                        <StatusBar
                            barStyle="light-content" 
                            translucent 
                            backgroundColor="transparent" 
                        />
                        <View style={{ flexDirection: 'row', height: (Dimensions.get('window').height) * 0.05, paddingHorizontal:20, marginTop: 50  }}>
                            {/* <View style={{ justifyContent: 'center',width:25 }}>
                                <TouchableOpacity onPress={() => { 
                                        if( this.state.pageEdited == true ) {
                                            this.props.navigation.state.params.updateData({pageEdited: true, type : 'none',});
                                        } 
                                        goBack();
                                }} >
                                    <Image source={require('./images/whiteBackIcon.png')} style={{ width: 16, height:16 }}></Image>  
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={ expenseStyles.reverseHeaderTitle }>{ this.state.pageType == 0 ? "Add" : "Edit"} Expense</Text>
                            </View> */}

                            <View style={{width: '90%',justifyContent:'flex-start',}}>
                                <TouchableOpacity onPress={() => { 
                                        if( this.state.pageEdited == true ) {
                                            this.props.navigation.state.params.updateData({pageEdited: true, type : 'none',});
                                        } 
                                        goBack();
                                }} style={{ flexDirection: 'row', }}>
                                    <View style={{justifyContent: 'center', paddingRight: 10}}>
                                        <Image source={require('./images/whiteBackIcon.png')} style={{ width: 16, height:16 }}></Image>  
                                    </View>
                                    <View  style={{justifyContent: 'center', paddingRight: 10}}>
                                        <Text style={{color: '#FFFFFF',fontFamily: Fonts.MontserratBold,fontSize: 18,}}>Expenses</Text>
                                    </View>                    
                                </TouchableOpacity>
                            </View>
                            
                            <View style={{ width: '10%', justifyContent: 'center',   }}>
                                <TouchableOpacity  style={{justifyContent: 'center',   }} onPress={() => { this.setState({confirmationDisplay: true}) }}>
                                    { this.state.pageType == 0 ? null : <Image source={require('./images/delete_white.png')} style={{ width: 20, height:22, marginRight: 15, padding: 0,justifyContent: 'center', alignItems: 'flex-end', alignContent: 'flex-end', alignSelf: 'flex-end', }}></Image> }
                                </TouchableOpacity>
                            </View>
                        </View>
                    
                        <View style={{ position: 'absolute', backgroundColor: '#ffffff', height: 60, width: '100%', bottom: 0 }}></View>

                        <View style={ expenseStyles.imageDisplayContainer }>
                            <TouchableOpacity onPress={() => this.setState({ visible: true })} > 
                            {(this.state.pageType == 0  || this.state.imageUri == '' ) ? 
                                <Image source={require('./images/add-epenses.png')} style={[expenseStyles.headerBottomImage, {width: this.state.iconImageWidth, height: this.state.iconImageHeight }] } />
                                :
                                // <Image source={{uri: this.state.certLink}} style={{width: (Dimensions.get('window').width) * 0.45, height: (Dimensions.get('window').height) * 0.35 }} />
                                <Image ref={ranRef}  source={{uri:  this.state.imageUri}} 
                                        style={{width: this.state.imageWidth, height: this.state.imageHeight }}
                                        onLoadEnd={() => {
                                            // this.refs[ranRef].setNativeProps({source: [{uri: this.state.imageUri}]}); 
                                            // this.refs[ranRef].setNativeProps({style: [{width: this.state.imageWidth, height: this.state.imageHeight }]});
                                        
                                            if(this.state.imageUri != null) {
                                                setTimeout(function(){
                                                if(this.refs[ranRef] != undefined) {
                                                    this.refs[ranRef].setNativeProps({source: [{uri: this.state.imageUri}]})
                                                    this.setState({spinner: false});                        
                                                }
                                                }.bind(this), 5000);
                                            }
                                        }}
                                    />
                            }
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={ expenseStyles.addExpenseBody }>
                        <View>
                            <KeyboardAvoidingView behavior='padding' >
                                <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                                    <View style={{flexDirection:'column'}}>
                                        <View style={{flexDirection:'row'}}>
                                            <View style={{flex:1,justifyContent:'flex-start', flexDirection:'row', marginTop:-25}}>
                                                <Text style={ expenseStyles.inputLabelBlack }>£ </Text>
                                                <TextInputMask
                                                    type={'money'}
                                                    options={{
                                                    precision: 2,
                                                    separator: '.',
                                                    delimiter: ',',
                                                    unit: '',
                                                    suffixUnit: ''
                                                    }}
                                                    value={this.state.amount}
                                                    onChangeText={(amount) => this.setState({ amount })}
                                                    style={expenseStyles.inputExpenseAmount}
                                                />
                                            </View>
                                            <View  style={{flex:1,borderBottomColor:'#E6E9ED', borderBottomWidth:1, marginBottom:15}}>
                                                { (this.state.date != null && this.state.date != '') &&
                                                    <Text style={{color:'#AAB2BD', fontSize:12, fontFamily:Fonts.MontserratMedium}}>Date</Text>
                                                } 
                                                <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={() => {
                                                        this.setState({ setDate: true });
                                                }}>
                                                    <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:0, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                                        <View style={{width:'80%',  justifyContent:'flex-start'}}>
                                                            <Text style={(this.state.date != null && this.state.date != '')?  expenseStyles.calendarSelectedText : expenseStyles.calendarText }>{this.state.date != null ? moment(this.state.date, 'DD/MM/YYYY').format('DD MMM YYYY') : 'Select Date'}
                                                            </Text>
                                                        </View>
                                                        <View  style={{width:'20%',  justifyContent:'flex-end'}}>
                                                            <Image style={{ width: 20, height: 18, }} source={require('./images/calendar.png')}></Image>
                                                        </View>
                                                    </View> 
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <View style={{flex:1}}>
                                            <View style={{ marginTop: 20}}> 
                                                { (this.state.description != null && this.state.description != '') &&
                                                    <Text style={ expenseStyles.inputLabel }>Description</Text>
                                                } 
                                                <View style = {{ borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                                    <View style = {{ width: '100%', alignContent: 'flex-start' , justifyContent:'center', paddingBottom: 10,}}>
                                                        <TextInput
                                                            id='Description'
                                                            onChangeText={(description) => this.setState({ description })}
                                                            placeholder="Description"
                                                            placeholderTextColor='#AAB2BD'
                                                            returnKeyType='next'
                                                            autoCorrect={false}
                                                            style={expenseStyles.input}
                                                            value={this.state.description} />
                                                        </View>
                                                </View> 
                                            </View>
                                            <View style={{ marginTop: 20}}> 
                                                { (this.state.type != null && this.state.type != '' && this.state.type != 'undefined') &&
                                                    <Text style={ expenseStyles.inputLabel }>Expenses Type</Text>
                                                } 
                                                <View style = {{ flexDirection: 'row', borderStyle: 'solid', borderBottomWidth:1, borderBottomColor:'#E6E9ED', marginBottom: 10 }}>
                                                    <View style = {{ width: '100%', alignContent: 'flex-start' , justifyContent:'center', }}>
                                                        <TouchableOpacity onPress={() => {
                                                            // this.setState({showType: true});
                                                            this.setState({sortVisible: true});
                                                        }} style={ expenseStyles.dropDownArea }>
                                                            <View style={ expenseStyles.aliasDropDown }>
                                                                <View style={ expenseStyles.dropDownValueSection }>
                                                                    <Text style={ (this.state.type != null && this.state.type != '')  ? expenseStyles.dropDownSelectedValueText : expenseStyles.dropDownValueText }>
                                                                        {((this.state.type != null && this.state.type != '') ? this.textTruncate(this.state.type, 30) : 'Select type of expense')}
                                                                    </Text>
                                                                </View>
                                                                <View style={ expenseStyles.dropDownIconSection }><Text>
                                                                    <Image resizeMode='stretch' style={ expenseStyles.dropDownImage } source={this.state.arrowSource} />
                                                                </Text></View>
                                                            </View>
                                                        </TouchableOpacity> 
                                                    </View>
                                                </View> 
                                            </View> 
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </KeyboardAvoidingView>    
                        </View>
                        <View style={expenseStyles.footerContainer}>
                            <View style={expenseStyles.loginButtonArea}>
                                <TouchableOpacity style={expenseStyles.loginTouchable} onPress={() => {
                                    this.setState({ 'spinner': true });
                                    this.expensesValidate();
                                }}>
                                    <Text style={expenseStyles.loginButton}>{this.state.pageType == 0 ? 'SAVE' : 'UPDATE'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                
                </ScrollView>
                <View>
                    <Actionsheet
                        visible={this.state.visible}
                        onRequestClose={() => this.setState({ visible: false })}
                        data={OPTIONS}
                        title={'Lets get a Picture'}
                        titleStyle={{ fontSize: 15, color: '#9a9a9a' }}
                        optionTextStyle={{ color: '#9a9a9a' }}
                        selected={this.state.selected}
                        onOptionPress={(e) => {
                        this.setState({ visible: false });
                        console.log("ID :", e.id);
                        if (e.id == 1) {
                            this.launchCamera();
                        } else {
                            this.launchLibrary();
                        }
                        }}
                        onCancelPress={() => this.setState({ visible: false })}
                    />
                </View>

                {/* type Overlay */}
                <Overlay visible={ this.state.showType } 
                        onClose={() => {this.setState({showType: false})}} 
                        closeOnTouchOutside 
                        containerStyle={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                        childrenWrapperStyle={ expenseStyles.overlayChildStyle }
                >                    
                    <List style={ expenseStyles.listDropDown }>                   
                        <ScrollView >{ TypeItems }</ScrollView>
                    </List>
                </Overlay>

                {/* expense Day Overlay */}
                <Overlay visible={this.state.setDate} 
                    onClose={() => {this.setState({setDate: false})}} 
                    closeOnTouchOutside 
                    containerStyle={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                    childrenWrapperStyle={{
                        width: '100%',
                        height: 220, position: 'absolute',
                        bottom: 0, right: 15, left: 20, borderTopLeftRadius: 25, borderTopRightRadius: 25,
                    }}>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%', alignSelf: 'center',
                    }}>

                        <TouchableOpacity style={{
                            backgroundColor: '#00F0B5',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderColor: '#00F0B5',
                            borderRadius: 5,
                            elevation: 0, borderWidth: 0, width: 50, height: 30, alignSelf: 'flex-end', top: 10, right: 0
                        }} onPress={() => {
                            this.setState({setDate: false});
                        }}>
                            <Text style={[ expenseStyles.loginButton, { fontSize: 15, fontFamily: Fonts.MontserratMedium }]}>OK</Text>
                        </TouchableOpacity>

                        <DatePicker
                            style={{ marginTop: 10, }}
                            mode={'date'}
                            date={this.state.currentDate}
                            onDateChange={ (date) => { 
                                this.setState({ currentDate: date });
                                this.setState({calenderChanged: true});
                                this.setState({currentDate: new Date(moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD'))});
                                this.setState({date: date});
                                }
                            }
                        />

                    </View>
                </Overlay>

                {/* delete confirmation Overlay */}
                <Overlay 
                    visible={this.state.confirmationDisplay} 
                    onClose={() => {this.setState({confirmationDisplay: false})}} 
                    closeOnTouchOutside 
                    containerStyle={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                    childrenWrapperStyle={{ width: '95%', height: this.state.overlayImageHeight, position: 'absolute',  bottom: 20, alignSelf: 'center',borderRadius: 5,  backgroundColor: 'transparent'  }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '95%', alignSelf: 'center', paddingHorizontal: 20, backgroundColor: 'transparent' }}>
                        {/* <Image style={{ marginTop: (Dimensions.get('window').height * 0.1), width: 80, height: 80 }} source={require('./images/Group.png')}></Image>
                        <Text style={{ color: '#142828', fontFamily: Fonts.RubikMedium, textAlign: 'center', fontSize: 15, marginTop: (Dimensions.get('window').height * 0.05),}}>Are you sure you want to delete this expense?</Text> */}
                        <ImageBackground source={require('./images/Delete_expense.png')} style={{width: this.state.overlayImageWidth, height: this.state.overlayImageHeight}}>
                            <View style={{paddingBottom: 15, flex: 1, flexDirection: 'row', marginTop: (Dimensions.get('window').height * 0.05), paddingBottom: 15, paddingHorizontal: 10, position: 'absolute', bottom: 15 }}>
                                <View style={{ flex: 1,}}>
                                    <TouchableOpacity elevation={5} style={{ 
                                                paddingHorizontal: 10,
                                                width: (Dimensions.get('window').width * 0.35),
                                                height: 55,
                                                backgroundColor: '#2ee5b5',
                                                alignItems: 'center',
                                                alignSelf: 'center', 
                                                justifyContent: 'center',
                                                borderWidth: 1,
                                                borderColor: '#00F0B5',
                                                borderRadius: 5, }} 
                                        onPress={() => {
                                        this.setState({ 'spinner': true });
                                        this.deleteExpense();
                                    }}>
                                        <Text style={{ color: '#ffffff', fontFamily: Fonts.MontserratMedium, fontSize: 20, overflow: 'hidden',textAlign:'center',}}>YES</Text>
                                    </TouchableOpacity>
                                </View>
                                <View  style={{ flex: 1,}}>
                                    <TouchableOpacity elevation={5} style={{
                                                paddingHorizontal: 10,
                                                width: (Dimensions.get('window').width * 0.35),
                                                height: 55, 
                                                backgroundColor: '#ffffff',
                                                alignItems: 'center',
                                                alignSelf: 'center', 
                                                justifyContent: 'center',
                                                borderWidth: 1,
                                                borderColor: '#8d97b5',
                                                borderRadius: 5, }} onPress={() => {
                                        this.setState({ confirmationDisplay: false});
                                    }}>
                                        <Text style={{ color: '#8d97b5', fontFamily: Fonts.MontserratMedium, fontSize: 20, overflow: 'hidden',textAlign:'center',}}>NO</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ImageBackground> 
                    </View>
                </Overlay>
                {/* delete confirmation Overlay */}
                {this.state.sortVisible == true && 
                    <CustomDropDown 
                    title={'Select type of expense'} 
                    fieldName= '' 
                    sortOption={this.state.sortOption} 
                    visible={this.state.sortVisible} 
                    onSelectItem={this.handleType} 
                    onClose={this.onClose.bind(this)}
                    selectedValue= {this.state.type} /> 
                }
                
            </View>
        );
    }
}