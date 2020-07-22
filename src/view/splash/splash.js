import React, { Component } from 'react';
import { View, ImageBackground, Linking, Image, Platform, Text, AsyncStorage, useEffect, StatusBar, NativeModules } from 'react-native';
import styles from './styles';
import { NavigationActions, StackActions, withNavigationFocus } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient'; 
import packageJson from '../../../package.json';

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

export default class Splash extends Component {

    constructor(props) {
        super(props)
        this.state = {
            userId: 0,
            isLoading: true,
            alreadyIn: false,
        };

        this.didFocusListener = this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                console.log(Platform.OS);
                if (Platform.OS === 'android') {
                    Linking.getInitialURL().then(async (url) => {
                        this.handleNavigation(url);
                    });
                } else {

                    Linking.addEventListener('url', this.redirectNavigation);
                    Linking.getInitialURL().then((url) => {
                        if (url) {
                            this.handleNavigation(url);
                        }
                    })
                        .catch((e) => {
                            this.props.navigation.dispatch(StackActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({ routeName: 'LoginPage' })
                                ],
                            }))
                        })
                }
            }
        );
        this.didBlurListener = this.props.navigation.addListener(
            'didBlur',
            (obj) => {
                console.log(Platform.OS);
                if (Platform.OS === 'android') {
                    Linking.getInitialURL().then(async (url) => {
                        this.handleNavigation(url);
                    });
                } else {

                    Linking.addEventListener('url', this.redirectNavigation);
                    Linking.getInitialURL().then((url) => {
                        if (url) {
                            this.handleNavigation(url);
                        }
                    })
                        .catch((e) => {
                            this.props.navigation.dispatch(StackActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({ routeName: 'LoginPage' })
                                ],
                            }))
                        })
                }
            }
        );

    }

    componentDidMount = async () => {

        this.setState({ isLoading: false });

        await AsyncStorage.getItem('user_id', async (err, result) => {
            if (!err && result != null) {
                await this.setState({ "userId": result });
            }
        });

        if (Platform.OS === 'android') {
            await Linking.getInitialURL().then(async (url) => { 
                this.handleNavigation(url);
            });
        } else {
            Linking.addEventListener('url', this.redirectNavigation);
            Linking.getInitialURL().then((url) => { 
                if (url != null) {
                    this.handleNavigation(url);
                } else {
                    setTimeout(async () => {
                        if (this.state.userId == 0 || this.state.userId == null || this.state.userId == undefined) {
                            this.props.navigation.dispatch(StackActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({ routeName: 'LoginPage' })
                                ],
                            }))
                        } else {
                            this.props.navigation.dispatch(StackActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({ routeName: 'MainNavigation' })
                                ],
                            }))
                        }
                    }, 4000);    
                }
            })
                .catch((e) => {
                    this.props.navigation.dispatch(StackActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName: 'LoginPage' })
                        ],
                    }))
                })
            // await Linking.addEventListener('url', this.redirectNavigation);
            // this.props.navigation.dispatch(StackActions.reset({
            //     index: 0,
            //     actions: [
            //         NavigationActions.navigate({ routeName: 'LoginPage' })
            //     ],
            // }))
        }

    }

    redirectNavigation = async (e) => {
        var url = await (e != undefined ? e.url : null);

        if(this.state.alreadyIn == false) {

            // await AsyncStorage.multiGet(["user_id"]).then(response => {console.warn('hhhh:', response);this.setState({"userId" : response[0][1]});});
            setTimeout(async () => {

                var regexpJobView = /^((app):\/\/(hyreapp)\/(job)\/\d+)?$/;
                var regexpSignIn = /^((app):\/\/(hyreapp)\/(signin))?$/;
                var regexpJobSearch = /^((app):\/\/(hyreapp)\/(search))?$/;
                var regexpMessage = /^((app):\/\/(hyreapp)\/(message))?$/;

                this.setState({alreadyIn: true});
                if (url == null || url == undefined) {
                    if (this.state.userId != 0) {
                        this.props.navigation.dispatch(StackActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ routeName: 'MainNavigation' })
                            ],
                        }))
                    } else {
                        this.props.navigation.dispatch(StackActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ routeName: 'LoginPage' })
                            ],
                        }))
                    }
                } else {
                    // console.warn('user Id: ',this.state.userId);
                    if (this.state.userId == 0 || this.state.userId == null || this.state.userId == undefined) {
                        this.props.navigation.dispatch(StackActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ routeName: 'LoginPage' })
                            ],
                        }))
                    } else {
                        if (regexpJobView.test(url)) {
                            var jobId = url.match(/\d+/);
                            this.props.navigation.dispatch(StackActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({
                                        routeName: 'ViewJobPage',
                                        params: { jobId: jobId }
                                    })
                                ],
                            }))

                        } else {
                            if (regexpSignIn.test(url)) {
                                this.props.navigation.dispatch(StackActions.reset({
                                    index: 0,
                                    actions: [
                                        NavigationActions.navigate({ routeName: 'LoginPage' })
                                    ],
                                }));

                            } else {
                                if (regexpJobSearch.test(url)) {
                                    this.props.navigation.dispatch(StackActions.reset({
                                        index: 0,
                                        actions: [
                                            NavigationActions.navigate({ routeName: 'MainNavigation' })
                                        ],
                                    }))

                                } else {
                                    if (regexpMessage.test(url)) {
                                        this.props.navigation.dispatch(this.props.navigation.navigate('MainNavigation', {}, NavigationActions.navigate({ routeName: 'Screen4' })));

                                    } else {
                                        if (this.state.userId != 0) {
                                            this.props.navigation.dispatch(StackActions.reset({
                                                index: 0,
                                                actions: [
                                                    NavigationActions.navigate({ routeName: 'MainNavigation' })
                                                ],
                                            }))
                                        } else {
                                            this.props.navigation.dispatch(StackActions.reset({
                                                index: 0,
                                                actions: [
                                                    NavigationActions.navigate({ routeName: 'LoginPage' })
                                                ],
                                            }))
                                        }
                                    }
                                }
                            }
                        }
                    }

                }

            }, 4000);
        }
    }

    handleNavigation = async (url) => {
        // if(Platform.OS === 'android'){
        //     await this.requestLocationPermission();
        // }else{
        //    await  this.getCurrentLocation();
        // }

        // await AsyncStorage.setItem('accessToken', '0');
        if(this.state.alreadyIn == false) {
        
            var regexpJobView = /^((app):\/\/(hyreapp)\/(job)\/\d+)?$/;
            var regexpSignIn = /^((app):\/\/(hyreapp)\/(signin))?$/;
            var regexpJobSearch = /^((app):\/\/(hyreapp)\/(search))?$/;
            var regexpMessage = /^((app):\/\/(hyreapp)\/(message))?$/;

            this.setState({alreadyIn: true});
            if (this.state.userId == 0 || this.state.userId == null || this.state.userId == undefined) {
                this.props.navigation.dispatch(StackActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'LoginPage' })
                    ],
                }))
            } else {

                setTimeout(async () => {
                    if (regexpJobView.test(url)) {
                        var jobId = url.match(/\d+/);
                        this.props.navigation.dispatch(StackActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({
                                    routeName: 'ViewJobPage',
                                    params: { jobId: jobId }
                                })
                            ],
                        }))

                    } else {
                        if (regexpSignIn.test(url)) {
                            this.props.navigation.dispatch(StackActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({ routeName: 'LoginPage' })
                                ],
                            }))

                        } else {
                            if (regexpJobSearch.test(url)) {
                                this.props.navigation.dispatch(StackActions.reset({
                                    index: 0,
                                    actions: [
                                        NavigationActions.navigate({ routeName: 'MainNavigation' })
                                    ],
                                }))

                            } else { 
                                if (regexpMessage.test(url)) {
                                    this.props.navigation.dispatch(this.props.navigation.navigate('MainNavigation', {}, NavigationActions.navigate({ routeName: 'Screen4' })));

                                } else {
                                    if (this.state.userId != 0) {
                                        this.props.navigation.dispatch(StackActions.reset({
                                            index: 0,
                                            actions: [
                                                NavigationActions.navigate({ routeName: 'MainNavigation' })
                                            ],
                                        }))
                                    } else {
                                        this.props.navigation.dispatch(StackActions.reset({
                                            index: 0,
                                            actions: [
                                                NavigationActions.navigate({ routeName: 'LoginPage' })
                                            ],
                                        }))
                                    }
                                }
                            }
                        }

                    }
                }, 4000);

            }

            
        }
    }

    getCurrentLocation = async () => {
        await navigator.geolocation.getCurrentPosition(
            async (position) => { 
                await AsyncStorage.multiSet([
                    ['currentLatitude', JSON.stringify(position.coords.latitude)],
                    ['currentLongitude', JSON.stringify(position.coords.longitude)]
                ], 
                (err) => {console.log(err)});
            },
            async (error) => { 
                if(error.code == 2 && error.message == "No location provider available."){
                    DropDownHolder.dropDown.alertWithType('error', 'Error', ' Please ON the GSP location in your mobile');
                }
                await AsyncStorage.multiSet([
                    ['currentLatitude', ''],
                    ['currentLongitude', '']
                ], 
                (err) => {console.log(err)});

                this.setState({ error  : error.message })
            },
            { enableHighAccuracy: false, timeout: 30000, maximumAge: 10000 },
        );
        
        this.setState({ 'spinner': false });
    }

    requestLocationPermission = async () => {
        try {
            const hasPermission = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
              );

            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                'title': 'Location Permission',
                'message': 'This App needs access to your location ' +
                           'so we can know where you are.'
              }
            );
            
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              this.getCurrentLocation();
            } else {
              console.log("Location permission denied")
            }
          } catch (err) {
            console.log('error ', err)
          }
    }

    render() {
        const StatusBarHeight = StatusBar.currentHeight
        const loadPage =
            <View style={{ flex: 1,  }}>
                <StatusBar
                    hidden={true} 
                /> 
                <ImageBackground source={require('./images/background.png')} style={{ width: '100%', height: '100%' }}>
                
                    <Image source={require('./images/ManRun.png')} style={{ width: '100%', height: '100%' }}></Image>

                    {/* <Image resizeMode='contain' source={require('./images/Vector.png')} style={{
                        width: 479, height: 469, position: 'absolute',
                        top: 462 - STATUSBAR_HEIGHT, left: 23,
                    }}></Image>


                    <Image resizeMode='contain' source={require('./images/Frame.png')} style={{
                        width: 220, height: 301, position: 'absolute',
                        top: 396 - STATUSBAR_HEIGHT, left: 68,
                    }}></Image> */}

                    <Text style={styles.appVersion}>V.{packageJson.version}</Text>
                </ImageBackground>
            </View> 

        return (
            this.state.isLoading ? loadPage : loadPage
        );
    }

}
 

