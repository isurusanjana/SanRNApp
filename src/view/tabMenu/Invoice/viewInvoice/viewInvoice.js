import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableOpacity, ScrollView, Image, ImageBackground, Platform, NativeModules, StyleSheet, Dimensions } from 'react-native';
import CustomHeader from '../../../../components/customHeader/header';
import { Icon } from 'native-base';
import paidStyles from '../paid/styles';
import { Button } from 'native-base';
import formStyles from '../../../../components/formTextInput/styles';
import { newinvoicestyles } from '../newInvoice/styles';
import { signupstyles } from '../../../signup/styles';
import LinearGradient from 'react-native-linear-gradient';
import Overlay from 'react-native-modal-overlay';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import { Fonts } from '../../../../config/font';
import { Services } from '../../../../services/services';
import { GET_INVOICE_URL } from '../../../../config/shared';
import { NavigationActions, StackActions } from 'react-navigation';
import { ServiceParams } from '../../../../services/serviceParams';
import DropDownHolder from '../../../../components/dropDown/dropDownHolder';
// import Picker from 'react-native-wheel-picker'

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBarManager.HEIGHT;
const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[styles.statusBar, { backgroundColor }]}>
        <StatusBar translucent backgroundColor={backgroundColor} {...props}  />
    </View>
);

class ViewInvoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {
                title: false
            },
            moreOverLay: false,
            itemList: ['1', '2', '3', '4', '5', '6'],
            selectedItem: 2,
            invoiceData: [],
            invoiceDate: '',
            dueDate:'',
            myJob: [],
            displayStatus: null,
            pdfURL: null,
            ButtonStatus: 0,
            ButtonTitle: 'Save',
            confirmationDisplay: false,
            invoiceStatus: null,
            ButtonType: null,
            practiceEmail: '',
            statusBack: '#fff',
            statusFont: '#fff',
            overlayImageWidth: 0,
            overlayImageHeight: 0,
        };

        this.setServices = new Services();

        // this.invoiceData = this.props.getParams('')
    }

    async componentDidMount() { 
        const { navigation } = this.props;
        console.log('inData', navigation.getParam('invoiceData'));
        this.invoiceData = navigation.getParam('invoiceData');
        this.setState({ invoiceData: navigation.getParam('invoiceData') });
        this.setState({ pdfURL: navigation.getParam('invoiceData')['invoice_pdf'] });
        this.setState({ myJob: navigation.getParam('invoiceData')['my_job']});
        this.setState({ invoiceStatus: navigation.getParam('invoiceData')['status']});
        this.setState({ practiceEmail: navigation.getParam('invoiceData')['contact_email']});
        // console.warn("this.invoiceData ", navigation.getParam('invoiceData'));
        console.log("this.MyJobs ", navigation.getParam('invoiceData')['my_job']);
        if (this.invoiceData['invoice_date'] != "Invalid date" && this.invoiceData['invoice_date'] != "null" && this.invoiceData['invoice_date'] != null)  {
            this.setState({invoiceDate: this.invoiceData['invoice_date']});
        }
        if (this.invoiceData['due_date'] != "Invalid date" && this.invoiceData['due_date'] != "null" && this.invoiceData['due_date'] != null) {
            this.setState({dueDate: this.invoiceData['due_date']});
        }
        if (navigation.getParam('invoiceData')['status'] == "0") {
            this.setState({ displayStatus: 'Draft' });
            this.setState({statusBack : '#FFEFB8'});
            this.setState({statusFont : '#F48400'});
        }
        else if (navigation.getParam('invoiceData')['status'] == "1") {
            this.setState({ displayStatus: 'Sent' });
            this.setState({statusBack : '#FFFFFF'});
            this.setState({statusFont : '#AAB2BD'});
        }
        else if (navigation.getParam('invoiceData')['status'] == "2") {
            this.setState({ displayStatus: 'Overdue' });
            this.setState({statusBack : '#FFD7D7'});
            this.setState({statusFont : '#EB5757'});
        }
        else if (navigation.getParam('invoiceData')['status'] == "3") {
            this.setState({ displayStatus: 'Paid' });
            this.setState({statusBack : '#C7F5E8'});
            this.setState({statusFont : '#00D3A1'});
        }


        await this.getScaledHeight(345, 595) ;

        this.setState({ 'ButtonTitle': navigation.getParam('ButtonTitle') });
        this.setState({ 'ButtonStatus': navigation.getParam('ButtonStatus') });//ButtonType
        this.setState({ 'ButtonType': navigation.getParam('ButtonType') });
    }

    deleteInvoice() {
        this.setServices.deleteService(GET_INVOICE_URL + this.state.invoiceData.id, "")
            .then((responseData) => {
                console.log("Response Data deleteInvoice:", responseData);

                this.setState({ 'spinner': false });
                if (responseData.error == 0) {
                    DropDownHolder.dropDown.alertWithType('success', 'Success', "Invoice deleted");
                    this.props.navigation.state.params.pageRefresh('view_date' , true);
                    this.props.navigation.dispatch(this.props.navigation.navigate('MainNavigation', {}, NavigationActions.navigate({ routeName: 'Screen3' })));
                }


            }, (error) => {

                this.setState({ 'spinner': false });
                console.log("error Data :", error);
            })
    }


    onClose = () => {
        this.setState({ moreOverLay: false });

        console.log("State :", this.state);
    };

    onPickerSelect(index) {
        this.setState({
            selectedItem: index,
        })
    };

    updateStatus() {
        this.setServices.postService(GET_INVOICE_URL + this.state.invoiceData.id+'/update', ServiceParams.getInvoiceStatusParam(this.state.ButtonStatus))
            .then((responseData) => {
                console.log("Response Data PUT:", responseData);

                this.setState({ 'spinner': false });
                if (responseData.error == 0) {
                    this.props.navigation.state.params.pageRefresh('add_date' , true);
                    DropDownHolder.dropDown.alertWithType('success', 'Success', "Invoice updated successfully");
                    this.props.navigation.dispatch(this.props.navigation.navigate('MainNavigation', { backFrom: 'add' }, NavigationActions.navigate({ routeName: 'Screen3' })))
                }

            }, (error) => {

                this.setState({ 'spinner': false });
                console.log("error Data :", error);
            })
    }

    getScaledHeight = async (sourceWidth,sourceHeight) => {  
            let width = (Dimensions.get('window').width * 0.9);
            let ratio = width / sourceWidth;
            await this.setState({
                overlayImageWidth: sourceWidth * ratio,
                overlayImageHeight: sourceHeight * ratio
            });                 
    }


    render() {
        const { goBack } = this.props.navigation;
        const { navigation } = this.props;

        // const statusButton = <Button disabled={true} style={[paidStyles.detailsStatus, { alignSelf: 'flex-end', height: 30, width: 135, borderRadius:15, backgroundColor: '#FFD7D7' }]}>
        //     <Text style={[paidStyles.detailsStatusText, { fontSize: 13, color: '#EB5757' }]}>{this.state.displayStatus}</Text>
        // </Button>;


        const statusButton =  <View style={{ position: 'absolute', top: 195, right: 20,}}>
                                <TouchableOpacity style={{ backgroundColor: this.state.statusBack, borderRadius: 15, width: 100,}}>
                                    <Text style={{ color: this.state.statusFont, fontFamily: Fonts.MontserratBold, fontSize: 12, paddingVertical: 6, alignSelf:  'center', }}>  {this.state.displayStatus}  </Text>
                                </TouchableOpacity>
                                </View>

        // const statusButton2 = <Button disabled={true} style={[paidStyles.detailsStatus, { alignSelf: 'flex-end', height: 30,width: 135,  borderRadius:15 }]}>
        //     <Text style={[paidStyles.detailsStatusText, { fontSize: 13, }]}>{this.state.displayStatus}</Text>
        // </Button>;

        const statusButton2 =  <View style={{ position: 'absolute', top: 195, right: 20,}}>
                                <TouchableOpacity style={{ backgroundColor: this.state.statusBack, borderRadius: 15, width: 100, }}>
                                    <Text style={{ color: this.state.statusFont, fontFamily: Fonts.MontserratBold, fontSize: 12, paddingVertical: 6,alignSelf: 'center', }}>  {this.state.displayStatus}  </Text>
                                </TouchableOpacity>
                            </View>

        const displayHead = <LinearGradient colors={['#5A5EE0', '#3894E4']} style={{ height: 210, }} start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }}>
            <View>
            {
                Platform.OS === 'ios' ? <MyStatusBar backgroundColor="transparent" barStyle="light-content" /> : <StatusBar backgroundColor="#5A5EE0" translucent={true}  barStyle="light-content" />
            }
            </View> 

            <View style={{ flexDirection: 'row',  paddingHorizontal: 20, marginTop: (Platform.OS === 'ios' ? 40 : 50)}}>
                <View style={{width: '90%',justifyContent:'flex-start',}}>
                    <TouchableOpacity onPress={() => { goBack() }} style={{ flexDirection: 'row', }}>
                        <View style={{justifyContent: 'center', paddingRight: 10}}>
                            <Image source={require('./images/whiteBackIcon.png')} style={{ width: 16, height:16 }}></Image>  
                        </View>                  
                    </TouchableOpacity>
                </View>
            </View>

            { (this.state.invoiceData != '' && this.state.dueDate != '') && 
            <View style={{ paddingHorizontal: 20, paddingTop: 20}}>
                <View style={{ width: 230,height: 25, justifyContent: 'center', borderRadius: 20, backgroundColor: '#00D3A1', paddingHorizontal: 10}}>
                    <Text style={{ textAlign: 'center', color: '#fff', fontFamily: Fonts.MontserratBold, fontSize: 13}}> {moment(this.state.invoiceData['invoice_date'], "YYYY-MM-DD").format('DD MMM  Y').toUpperCase()} - {moment(this.state.invoiceData['due_date'], "YYYY-MM-DD").format('DD MMM Y').toUpperCase()} </Text>
                </View>
                {/* <View style={{ flex:5, justifyContent: 'center',}}></View> */}
            </View>
            }
            {/* <View style={{ position: 'absolute', height: 60, width: '100%', bottom: 0 }}></View> */}
            <View style={{ flexDirection: 'row', paddingHorizontal: 20,paddingTop: 10}}>
                <Text style={{ color: '#fff', fontFamily: Fonts.MontserratBold, fontSize: 28,  }}>£ {parseFloat(this.state.invoiceData['amount']).toFixed(2) }</Text>
            </View>
            <View style={{ flexDirection: 'row', paddingHorizontal: 20,  paddingTop: 5}}>
                <View style={{ justifyContent: 'center', alignContent: 'flex-start', width: '70%'}}>
                    <Text style={{paddingRight: 15, color: '#ffffff', fontSize: 15,  fontFamily: Fonts.MontserratMedium,opacity: 0.5}}>{this.state.invoiceData['invoice_no']}</Text>
                </View>
                <View style={{ justifyContent: 'center', alignContent: 'flex-end', width: '30%'}}></View>
            </View> 
        </LinearGradient>

        const displayBody = <ScrollView style={{ marginTop: 20, }}>
            <View>
                <Text style={newinvoicestyles.labelText}>Healthcare organisations</Text>
                <Text style={{ flex: 8, marginBottom: 20, marginTop: 5, color: '#414253', fontFamily: Fonts.MontserratBold, fontSize: 15, }}>{this.state.invoiceData['practice_name']}</Text>
                <View style={[formStyles.hrLine, this.state.errors.title ? formStyles.error : formStyles.input]} />
            </View>

            <View>
                <Text style={newinvoicestyles.labelText}>Session</Text>
                {
                    this.state.myJob.map((jobItem, key) => { 
                        return (
                            <View key={key} >
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ flex: 1, marginBottom: 20, marginTop: 5, color: '#414253', fontFamily: Fonts.MontserratMedium, fontSize: 12, }}>{moment(jobItem.date, "DD/MM/YYYY").format('DD MMM YY')} , {moment(jobItem.start_time, "hh:mm A").format("HH:mm")} - {moment(jobItem.end_time, "hh:mm A").format("HH:mm")}</Text>
                                    <Text style={{ marginBottom: 20, marginTop: 5, color: '#414253', fontFamily: Fonts.MontserratBold, fontSize: 15, }}>£ {parseFloat(jobItem.total).toFixed(2)}</Text>
                                </View>
                            </View>
                        )
                    })
                }
            </View>
            <View style={[formStyles.hrLine, this.state.errors.title ? formStyles.error : formStyles.input]} />


            <View>
                <Text style={newinvoicestyles.labelText}>Additional fee</Text>
                <View style={{ flexDirection: 'row', }}>
                    <Text style={{ flex: 1, marginBottom: 20, marginTop: 5, color: '#414253', fontFamily: Fonts.MontserratMedium, fontSize: 12, }}>
                        { this.state.invoiceData['additional_fee'] != 0 ? this.state.invoiceData['reason'] : 'No additional fee'}
                    </Text>
                    <Text style={{ marginBottom: 20, marginTop: 5, color: '#414253', fontFamily: Fonts.MontserratBold, fontSize: 16, }}>£ {parseFloat(this.state.invoiceData['additional_fee']).toFixed(2)}</Text>
                </View>
            </View>
            {/* <View style={[formStyles.hrLine, this.state.errors.title ? formStyles.error : formStyles.input]} /> */}

        </ScrollView>



        return (
            <View style={{ flex: 1,}}>
             

            {
                this.state.invoiceData.length != 0 ? displayHead : null
            }

            {
                this.state.invoiceData.length != 0 ? (this.state.invoiceData['status'] == "2" ? statusButton : statusButton2 ): null
            }


                <View style={{ flex: 1,paddingHorizontal: 20, marginTop: 0, }}>
                    {
                        this.state.invoiceData.length != 0 ? displayBody : null
                    }
                </View>


                <View style={{ marginBottom: 15,flexDirection:'row', marginTop: 20}}>

                    <View style={{width:'60%',marginLeft:20}}>
                        <TouchableOpacity style={[signupstyles.signUpBtnArea,{width:'100%'}]} onPress={() => {
                            console.log("Click Save");
                            if(this.state.ButtonType == 0) {
                                this.props.navigation.navigate('PreviewInvoicePage', {
                                    pdfURL: this.state.pdfURL,
                                    invoice_id: this.state.invoiceData.id,
                                    pageRefresh:this.props.navigation.state.params.pageRefresh.bind(this),
                                    toEmail: this.state.practiceEmail
                                });
                            } else {
                                this.setState({ 'spinner': true });
                                this.updateStatus();
                            }                        
                            
                        }}>
                            <Text style={[signupstyles.buttonText]}>{this.state.ButtonTitle}</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={{width:'20%', justifyContent:'flex-end',alignItems:'flex-end'}}>
                        <TouchableOpacity onPress={() => {
                    this.setState({ moreOverLay: true });
                    }} style={{width:55, height:55, borderRadius:15,borderColor:'#00D9A6',borderWidth:2, justifyContent:'center', alignItems:'center'}}>
                            <Image  source={require('./images/menu1.png')}  style={{ width: 4, height:18, tintColor: '#00D9A6'}} tintColor='#00D9A6' />
                            {/* <Image source={require('./images/menu.png')} style={{ width: 8, height:36 }} /> */}
                        </TouchableOpacity>
                    </View>

                </View>

                {/* Start - More Overlay */}
                <Overlay visible={this.state.moreOverLay} onClose={this.onClose} closeOnTouchOutside 
                animationType='bounceInUp'
                    childrenWrapperStyle={{
                        width: 'auto',
                        backgroundColor:'#3330',                        
                        maxHeight: 350, 
                        minHeight: 200,
                        position: 'absolute',
                        bottom: 0, left: 0, right: 0, padding: 0, margin: 0
                    }}>
                    <View style={{
                        flex: 1,
                        backgroundColor: '#FFF',
                        width: '100%', left: 0, right: 0,paddingHorizontal:40, margin: 0,borderTopLeftRadius:15,borderTopRightRadius:15
                    }}>
                        <View style={{marginTop:8, marginBottom:5,justifyContent:"center",alignItems:'center'}}>
                            <View style={{ width:40, height:5, backgroundColor:'#C4C4C4', borderRadius:15}}></View>
                        </View>
                        <View style={{ flexDirection: 'row-reverse', }}>
                            <TouchableOpacity style={{ flex: 1, marginLeft: 25, justifyContent: 'center', marginRight: 0, alignItems: 'flex-end', paddingTop: 10,paddingHorizontal:3  }} onPress={() => {
                                this.onClose();
                            }}>
                               <Image  source={require('./images/close1.png')}/>
                            </TouchableOpacity>
                        </View>

                        { this.state.ButtonType != 2 && 
                        <View style={{ flexDirection: 'row', width: '100%', paddingTop: 15,paddingBottom:10, marginTop:10, borderBottomWidth:1, borderBottomColor:'#efefef',paddingHorizontal:15 }}>
                            <View style={{ width: 60, marginTop:3}}>
                                <Image  source={require('./images/delete1.png')}/>
                            </View>
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity onPress={() => {
                                    this.onClose();
                                    this.setState({ confirmationDisplay: true });
                                }}>
                                    <Text style={{ color: '#AAB2BD', fontSize: 18, fontFamily: Fonts.MontserratBold, marginLeft: -10}}>DELETE</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        }

                        { this.state.ButtonType == 0 && 
                        <View style={{ flexDirection: 'row', width: '100%', paddingTop: 15,paddingBottom:10, marginTop:10, borderBottomWidth:1, borderBottomColor:'#efefef',paddingHorizontal:15 }}>
                            <View style={{ width: 60}}>
                                <Image  source={require('./images/edit.png')} style={{ width: 22, height:22 }}/>
                            </View>
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity onPress={() => {
                                    this.onClose();
                                    this.props.navigation.navigate('NewInvoicePage', {
                                        edit: true,
                                        data: this.state.invoiceData,
                                        ButtonTittle: navigation.getParam('ButtonTitle'),
                                        ButtonStatus: navigation.getParam('ButtonStatus'),
                                        pageRefresh:this.props.navigation.state.params.pageRefresh.bind(this)
                                    });
                                }}>
                                    <Text style={{ color: '#AAB2BD', fontSize: 18, fontFamily: Fonts.MontserratBold, marginLeft: -10}}>EDIT</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        }


                        { this.state.ButtonType == 1 && 
                        <View style={{ flexDirection: 'row', width: '100%', paddingTop: 15,paddingBottom:10, marginTop:10, borderBottomWidth:1, borderBottomColor:'#efefef',paddingHorizontal:15}}>
                            <View style={{ width: 60, marginTop:3}}>
                                <Image  source={require('./images/send1.png')}/>
                            </View>
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity onPress={() => {
                                    this.onClose();
                                    console.log("Navigate to preview");
                                    this.props.navigation.navigate('PreviewInvoicePage', {
                                        pdfURL: this.state.pdfURL,
                                        invoice_id: this.state.invoiceData.id,
                                        pageRefresh:this.props.navigation.state.params.pageRefresh.bind(this),
                                        toEmail: this.state.practiceEmail
                                    });
                                }}>
                                    <Text style={{ color: '#AAB2BD', fontSize: 18, fontFamily: Fonts.MontserratBold, marginLeft: -10}}>RESEND</Text></TouchableOpacity>
                            </View>
                        </View>
                        }


                        <View style={{ flexDirection: 'row', width: '100%',  paddingTop: 15,paddingBottom:10, marginTop:10, borderBottomWidth:1, borderBottomColor:'#efefef',paddingHorizontal:15 }}>
                            <View style={{ width: 60, marginTop:3}}>
                                <Image  source={require('./images/prv1.png')}/>
                            </View>
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity onPress={() => {
                                    this.onClose();
                                    console.log("Navigate to preview");
                                    this.props.navigation.navigate('PreviewInvoicePage', {
                                        pdfURL: this.state.pdfURL,
                                        invoice_id: this.state.invoiceData.id,
                                        pageRefresh:this.props.navigation.state.params.pageRefresh.bind(this),
                                        toEmail: this.state.practiceEmail
                                    });
                                }}>
                                    <Text style={{ color:(this.state.ButtonType == 1 ? '#AAB2BD' : '#AAB2BD'), fontSize: 18, fontFamily: Fonts.MontserratBold, marginLeft: -10 }}>PREVIEW</Text></TouchableOpacity>
                            </View>
                        </View>


                    </View>
                </Overlay>
                {/* End - More Overlay */}

                {/* delete confirmation Overlay */}
                <Overlay
                    visible={this.state.confirmationDisplay}
                    onClose={() => { this.setState({ confirmationDisplay: false }) }}
                    animationType='bounceInUp'
                    closeOnTouchOutside
                    containerStyle={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                    childrenWrapperStyle={{ width: '95%', height: this.state.overlayImageHeight, position: 'absolute',  bottom: 20, alignSelf: 'center', borderRadius: 5,  backgroundColor: 'transparent'  }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '95%', alignSelf: 'center', paddingHorizontal: 20, backgroundColor: 'transparent' }}>
                        {/* <Image style={{ marginTop: (Dimensions.get('window').height * 0.1), width: 80, height: 80 }} source={require('./images/Group.png')}></Image>
                        <Text style={{ color: '#414253', fontFamily: 'Rubik', fontFamily: Fonts.RubikMedium, textAlign: 'center', fontSize: 15, marginTop: (Dimensions.get('window').height * 0.05), }}>Are you sure you want to delete this invoice?</Text> */}

                        <ImageBackground source={require('./images/Delete_invoice.png')} style={{width: this.state.overlayImageWidth, height: this.state.overlayImageHeight}}>
                            <View style={{ flex: 1, flexDirection: 'row', marginTop: (Dimensions.get('window').height * 0.05), paddingBottom: 15, paddingHorizontal: 10, position: 'absolute', bottom: 15 }}>
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
                                        borderRadius: 5,
                                    }}
                                        onPress={() => {
                                            this.setState({ 'spinner': true });
                                            this.deleteInvoice();

                                        }}>
                                        <Text style={{ color: '#ffffff', fontFamily: Fonts.MontserratMedium, fontSize: 20, overflow: 'hidden', textAlign: 'center', }}>YES</Text>
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
                                        borderRadius: 5,
                                    }} onPress={() => {
                                        this.setState({ confirmationDisplay: false });
                                    }}>
                                        <Text style={{ color: '#8d97b5', fontFamily: Fonts.MontserratMedium, fontSize: 20, overflow: 'hidden', textAlign: 'center', }}>NO</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ImageBackground>  
                    </View>
                </Overlay>
                {/* delete confirmation Overlay */}
            </View>
        );
    }
}

export default ViewInvoice;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    statusBar: {
        height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    },
    appBar: {
        backgroundColor: '#79B45D',
        height: Platform.OS === 'ios' ? 44 : 56,
    },
    content: {
        flex: 1,
        backgroundColor: '#33373B',
    },
});


