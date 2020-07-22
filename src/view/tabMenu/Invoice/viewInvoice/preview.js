import React, { Component } from 'react';
import { View, Dimensions, ScrollView, TextInput, Text, TouchableOpacity, AsyncStorage, 
    KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard , NativeModules, Platform, 
    ImageBackground, StatusBar, Image, StyleSheet} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { NavigationActions, StackActions } from 'react-navigation';

import { styles } from '../../../login/styles';
import { API_URL, INVOICE_EMAIL, GET_INVOICE_URL } from '../../../../config/shared';
import { newinvoicestyles } from '../newInvoice/styles';
import formStyles from '../../../../components/formTextInput/styles';
import { signupstyles } from '../../../signup/styles';
import ViewPDF from '../../../../components/viewPDF/pdf';
import { Services } from '../../../../services/services';
import { ServiceParams } from '../../../../services/serviceParams';
import DropDownHolder from '../../../../components/dropDown/dropDownHolder';
import CustomHeader from '../../../../components/customHeader/header';
import { Fonts } from '../../../../config/font';

const resources = {
    // file: Platform.OS === 'ios' ? 'downloadedDocument.pdf' : '/sdcard/Download/downloadedDocument.pdf',
    uri: "https://www.ets.org/Media/Tests/TOEFL/pdf/SampleQuestions.pdf", cache: true
    // base64: 'JVBERi0xLjMKJcfs...',
};
// const navigation;
const paramValues = {
    from: null,
    pdfURL: null,
    invoice_id: null
}

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBarManager.HEIGHT;
const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[statusBarStyles.statusBar, { backgroundColor }]}>
        <StatusBar translucent backgroundColor={backgroundColor} {...props}  />
    </View>
);

class PreviewInvoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinner: false,
            resources: {
                uri: null, cache: true
            },
            setData: false,
            sentMail: false,
            emailAdds: [
                { id: 1, email: '' }
            ]
        };
        console.log("Props :", this.props); 
        const { navigation } = this.props;
        paramValues.from = navigation.getParam('from');
        paramValues.pdfURL = navigation.getParam('pdfURL');
        paramValues.invoice_id = navigation.getParam('invoice_id');


        console.log("from :", paramValues.from);
        console.log("pdfURL :", paramValues.pdfURL);
        
        // console.warn("State emailAdds:", this.state.emailAdds);
        this.setServices = new Services();
    }

    componentDidMount = async () => {
        // componentDidMount() {

        const { navigation } = this.props;
        if (navigation.getParam('from') == ' new') {
            this.setState({ 'sentMail': true });
        }
        var res = { uri: paramValues.pdfURL, cache: true };
        // var res = { url : "https://www.ets.org/Media/Tests/TOEFL/pdf/SampleQuestions.pdf" };
        this.setState({ 'resources': res });

        setTimeout(() => {
            console.log("State :", this.state);
            // console.log("url :", this.state.resources[resourceType]);
            this.setState({ 'setData': true });
        }, 1400);

        setTimeout(() => {
            this.setState({ 'spinner': false });
            this.reloadPDF();
        }, 1600);

        var tempArry = this.state.emailAdds;
        if(navigation.getParam('toEmail') != undefined && navigation.getParam('toEmail') != null && navigation.getParam('toEmail') != '') {
            for (let index = 0; index < tempArry.length; index++) {
                    if (tempArry[index]['id'] == 1) {
                        tempArry[index]['email'] = navigation.getParam('toEmail');
                        break;
                    }
                }
            this.setState({ 'emailAdds': tempArry });
        } else {
            await AsyncStorage.multiGet(["userEmail"
            ]).then(response => {
                console.log("Response :", response);
                for (let index = 0; index < tempArry.length; index++) {
                    if (tempArry[index]['id'] == 1) {
                        tempArry[index]['email'] = response[0][1];
                        break;
                    }
                }
                this.setState({ 'emailAdds': tempArry });
            });
        }
    }

    reloadPDF = async () => {
        const pdfRef = this._pdfRef;
        console.log("Reload : ", pdfRef);
        if (!pdfRef) {
            return;
        }

        try {
            await pdfRef.reload();
        } catch (err) {
            console.err(err.message);
        }
    }

    sendInvoice() {
        this.setState({ 'spinner': true });
        this.setServices.postService2(GET_INVOICE_URL + paramValues.invoice_id + INVOICE_EMAIL, ServiceParams.getInvoiceEmailParams(this.state))
            .then((responseData) => {
                this.setState({ 'spinner': false });
                if (responseData.error == 0) {
                    DropDownHolder.dropDown.alertWithType('success', 'Success', responseData.info);
                    // this.props.navigation.goBack();
                    this.goBackFunction();
                    // this.props.navigation.dispatch(this.props.navigation.navigate('MainNavigation', {}, NavigationActions.navigate({ routeName: 'Screen3' })));
                }

            }, (error) => {

                console.log("error Data :", error);
                this.setState({ 'spinner': false });
            })
    }

    goBackFunction() {
        this.props.navigation.dispatch(
            NavigationActions.reset({
                index: 1,
                actions: [this.props.navigation.navigate('MainNavigation', { backFrom: 'add' }, NavigationActions.navigate({ routeName: 'Screen3' }))]
            })
        );
    }

    render() {
        const { goBack } = this.props.navigation;
        console.log("from :", paramValues.from);
        const resourceType = 'url';

        return (
        <View style={{ flex: 1 }}>
            <Spinner
                visible={this.state.spinner}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
            />
            <ScrollView>
                <ImageBackground source={require('./images/Slice_9.png')} style={{width: '100%', height: 250, marginBottom: (Dimensions.get('window').height) * 0.37 }}>

                {
                    Platform.OS === 'ios' ? <MyStatusBar backgroundColor="transparent" barStyle="light-content" /> : <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
                }


                    <View style={{ paddingHorizontal: 20, marginTop: (Platform.OS === 'ios' ? 40 : 50), height: (Dimensions.get('window').height) * 0.1}}>
                        {/* <View style={{ flex: 1, flexDirection: 'row', paddingTop: '10%', marginLeft: 10 }}>
                            <TouchableOpacity onPress={() => { goBack(); }}>
                                <Image source = { require('./images/backIcon.png') } style = {{ width: 18, height: 18, marginTop: 3, tintColor: '#fff' }}/>
                            </TouchableOpacity>      
                            <Text style={{ fontSize: 18, color: '#fff', fontFamily: Fonts.MontserratBold, paddingLeft: 20 }}>Preview & Send</Text>                                      
                        </View> */}

                        <View style={{width: '90%',justifyContent:'flex-start',}}>
                            <TouchableOpacity onPress={() => { goBack() }} style={{ flexDirection: 'row', }}>
                                <View style={{justifyContent: 'center', paddingRight: 10}}>
                                    <Image source={require('./images/whiteBackIcon.png')} style={{ width: 16, height:16 }}></Image>  
                                </View>
                                <View  style={{justifyContent: 'center', paddingRight: 10}}>
                                    <Text style={{color: '#FFFFFF',fontFamily: Fonts.MontserratBold,fontSize: 18,}}>Preview & Send</Text>
                                </View>                    
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* <View style={{ position: 'absolute', backgroundColor: '#ffffff', height: 200, width: '100%', bottom: 0 }}></View> */}
                    <View style={{
                        backgroundColor: '#ffffff',
                        width: ((Dimensions.get('window').width) * 0.75), 
                        height: (Dimensions.get('window').height + 120) * 0.45,
                        elevation: 11,
                        marginBottom:10,
                        marginTop: 20,
                        justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center',
                        borderRadius: 10,
                        shadowColor: 'black',
                        shadowOffset: { width: 5, height: 5 },
                        shadowOpacity: 0.4,
                        shadowRadius: 5
                    }}>

                        {
                            this.state.setData != false ? <ViewPDF resources={this.state.resources} resourceType={resourceType} width={(Dimensions.get('window').width) * 0.7} height={(Dimensions.get('window').height) * 0.5} /> : null

                        }

                    </View>

                </ImageBackground>
                {/* <CustomHeader
                    goBack={goBack.bind(this)}
                    headerTitle={'Preview & Send'}
                    titleFontSize={16}
                /> */}

                {/* Some Controls to change PDF resource */}
                {/* <ScrollView>
                    
                </ScrollView> */}

                {/* <KeyboardAvoidingView behavior='position' >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss} > */}
                        
                            {/* <View style={{
                                backgroundColor: '#ffffff',
                                // flex: 1,
                                width: Dimensions.get('window').width - 50, height: Dimensions.get('window').height - (Dimensions.get('window').height / 4) - 50,
                                elevation: 11, margin: 15,
                                justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center',
                            }}>

                                {
                                    this.state.setData != false ? <ViewPDF resources={this.state.resources} resourceType={resourceType} width={Dimensions.get('window').width - 75} height={Dimensions.get('window').height - (Dimensions.get('window').height / 4)} /> : null

                                }

                            </View> */}
                            <View style={{ paddingHorizontal: 20,marginTop: 20, marginBottom: 30, }}>

                                {
                                    this.state.emailAdds.map(data => {
                                        return (
                                            <View key={data['id']}>
                                                <View style={{ flexDirection: 'row', }}>
                                                    <Text style={newinvoicestyles.labelText}>To:</Text>
                                                    {
                                                        data['id'] != 1 ? <View style={{ flex: 1, paddingRight: 5, alignContent: 'center', justifyContent: 'center', }}>
                                                            <TouchableOpacity style={{ borderRadius: 10, backgroundColor: 'red', width: 20, height: 20, alignSelf: 'flex-end', justifyContent: 'center', textAlign: 'center' }} onPress={() => {
                                                                var tempArry = this.state.emailAdds;
                                                                for (let index = 0; index < tempArry.length; index++) {
                                                                    if (tempArry[index]['id'] == data['id']) {
                                                                        tempArry.splice(index, 1);
                                                                        break;
                                                                    }
                                                                }

                                                                this.setState({ 'emailAdds': tempArry });
                                                            }}>
                                                                <Text style={{ justifyContent: 'center', textAlign: 'center', color: 'white', fontSize: 12, }}>-</Text>
                                                            </TouchableOpacity>
                                                        </View> : null
                                                    }
                                                </View>

                                                <TextInput
                                                    keyboardType={'default'}
                                                    returnKeyType="next"
                                                    autoCorrect={false}
                                                    style={[newinvoicestyles.textInput,{marginBottom: 10}]}
                                                    onChangeText={(text) => {
                                                        var tempArry = this.state.emailAdds;
                                                        for (let index = 0; index < tempArry.length; index++) {
                                                            if (tempArry[index]['id'] == data['id']) {
                                                                tempArry[index]['email'] = text;
                                                                break;
                                                            }
                                                        }

                                                        this.setState({ 'emailAdds': tempArry });
                                                    }}
                                                    value={data['email']}
                                                />

                                                {/* <View style={[formStyles.hrLine, formStyles.input]} /> */}
                                            </View>
                                        )
                                    })
                                }


                                <View style={{ alignSelf: 'flex-start', marginBottom: 20}}>
                                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center',  }} onPress={() => {
                                        this.setState({ modalVisible: true })
                                        var tempArry = this.state.emailAdds;
                                        var tempID = tempArry[tempArry.length - 1]['id'] + 1;
                                        var arry = { id: tempID, email: '' };
                                        tempArry.push(arry);
                                        this.setState({ 'emailAdds': tempArry });
                                        console.log("State :", this.state);
                                    }}>
                                        <Image source = { require('./images/plus-circle.png') } style = {{ width: 22, height: 22, }}/>
                                        <Text style={{ paddingLeft: 20, color: '#00D3A1', fontFamily: Fonts.MontserratMedium,fontSize: 15, }}>Add e-mail</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ marginBottom: 15, marginTop: 20, }}>
                                    <TouchableOpacity style={[signupstyles.signUpBtnArea, { borderRadius: 10 }]} onPress={() => {
                                        console.log("Click Save ", ServiceParams.getInvoiceEmailParams(this.state));
                                        this.sendInvoice();
                                    }}>
                                        <Text style={signupstyles.buttonText}>SEND</Text>
                                    </TouchableOpacity>

                                </View>

                            </View>
                        </ScrollView>
                    {/* </TouchableWithoutFeedback>
                </KeyboardAvoidingView> */}

                
            </View>
        );
    }
}

export default PreviewInvoice;

const statusBarStyles = StyleSheet.create({
    statusBar: {
        height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    },
  });