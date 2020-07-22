import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Platform, Image, StyleSheet } from 'react-native';
import { Button } from 'native-base';
import formStyles from '../formTextInput/styles';
import LinearGradient from 'react-native-linear-gradient';
import { Fonts } from '../../config/font';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Job = ({
    data, callBack, listType
}) => (
        <TouchableOpacity key={parseInt(data['job_id']) * Math.random()} onPress={callBack}>
        <View style={data['session'] == 1 ? styles.sessionBorder : styles.normalBorder}>
            <View style={{ flexDirection: 'row', backgroundColor: '#F2F9FF' , borderTopRightRadius: 8 }}>

                <View style={{ flexDirection: 'column' }}>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#5A5EE0', '#3894E4']} style={{
                        flex: 1,
                        borderTopLeftRadius: 8,
                        flexDirection: 'column',
                        width: 60,
                        // height: 45,
                        justifyContent: 'center',

                    }}>
                        <Text style={{ textAlign: 'center', color: '#ffffff', fontFamily: Fonts.MontserratBold, fontSize: 18, marginTop: 5, }}>{data['show_date']}</Text>
                        <Text style={{ textAlign: 'center', color: '#ffffff', fontFamily: Fonts.MontserratBold, fontSize: 13, marginBottom: 10 }}>{data['show_month']}</Text>
                    </LinearGradient>
                </View>
                <View style={{ flex: 2, paddingLeft: 20, top: 0, paddingBottom: 10 }}>
                    <View style={{ flexDirection: 'column', paddingTop: 10, }}>
                        <Text style={{ color: '#414253', fontFamily: Fonts.MontserratBold, fontSize: 13, }}>{data['practice_name']}</Text>
                        {    
                            ( data['session'] == 1) &&
                            <View style={{justifyContent: 'center', paddingTop: 5 }}>
                                <View style={{ flexDirection: 'column', justifyContent: 'center', width: 75 }}>
                                    <TouchableOpacity style={{ backgroundColor: '#FFD7D7', borderRadius: 15, alignContent: 'center', alignItems: 'center'  }}>
                                        <Text style={{ color: '#EB5757', fontFamily: Fonts.MontserratBold, fontSize: 10, padding: 2, }}>COVID-19</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    </View>
                </View>
                <View style={{ flex: 1, marginRight: 10, top: 0 }}>
                    <View style={{ flexDirection: 'column', paddingTop: 10, textAlign: 'right', alignContent: 'flex-end', alignItems: 'flex-end', }}>
                        <Text style={{ textAlign: 'right', fontFamily: Fonts.MontserratBold, color: (data['named_status'] == 'INVOICED' ? '#414253' : '#414253'), fontSize: 18, }}>£ {(data['charge_rate'] != undefined ? data['charge_rate'] : (data['type'] == "1" ? data['post_hour_rate'] : data['post_session_rate']))}</Text>
                        <Text style={{ textAlign: 'right', fontFamily: Fonts.MontserratMedium, color: (data['named_status'] == 'INVOICED' ? '#000000' : '#000000'), fontSize: 10, }}>{data['charge_type'] == "1" ? "per session" : "per hour"}</Text>
                    </View>
                </View>
            </View>

            <View style={{ flexDirection: 'row', backgroundColor: '#F2F9FF' , borderBottomRightRadius: 8, borderTopColor: '#D6ECFF', borderTopWidth: 0.8 }}>
                <View style={{ flexDirection: 'column' }}>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#5A5EE0', '#3894E4']} style={{
                        flex: 1,
                        flexDirection: 'column',
                        width: 60,
                        height: 45,
                        justifyContent: 'center',
                        borderBottomLeftRadius: 8,
                    }}>
                        <Text style={{ textAlign: 'center', color: '#ffffff', fontFamily: Fonts.MontserratBold, fontSize: 10 }}>{(data['start_time'] != 'Invalid date' ? data['start_time'] : '' )}</Text>
                        <Text style={{ textAlign: 'center', color: '#ffffff', fontFamily: Fonts.MontserratBold, fontSize: 10, }}>{(data['end_time'] != 'Invalid date' ? data['end_time'] : '' )}</Text>
                    </LinearGradient>
                </View>
                <View style={{ flex: 2, paddingLeft: 20, }}>
                    <View style={{ flexDirection: 'column', paddingTop: 10, }}>
                        <Text style={{ color: '#AAB2BD', fontFamily: Fonts.MontserratMedium, fontSize: 12, paddingTop: 5, }}>{(data['practice_city'] != undefined ? data['practice_city'] : data['town']) + ', ' + (data['practice_post_code'] != undefined ? data['practice_post_code'] : data['post_code'])}</Text>
                    </View>
                </View>
                {
                    listType == 'all' &&  
                    <View style={{ marginRight: 10, paddingLeft: 20, justifyContent: 'center', }}>
                        <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                            <TouchableOpacity style={{ flexDirection: 'row', borderRadius: 10  }}>
                            <Text style={{ color: '#00D3A1', fontFamily: Fonts.MontserratMedium, fontSize: 12,  }}><Image style={{ width: 12, height: 12, paddingRight:15 }} source={require('./images/locationIcon.png')}></Image> {((data['distance'] == undefined || data['distance'] == NaN || data['distance'] == 'NaN') ? "0.00" : parseFloat(data['distance']).toFixed(2)) + " Mi"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                {    
                    ( data['named_status'] != null && data['named_status'] != '') &&
                    <View style={{ marginRight: 10, paddingLeft: 20, justifyContent: 'center', }}>
                        <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                            <TouchableOpacity style={{ backgroundColor: data['statusBack'], flexDirection: 'row', borderRadius: 10  }}>
                                <Text style={{ color: data['statusFont'], fontFamily: Fonts.MontserratBold, fontSize: 12, padding: 5, }}>  {data['named_status']}  </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }

            </View>
            </View>
            {/* <View style={[formStyles.hrLine, formStyles.input]} /> */}
        </TouchableOpacity>
    );

export default Job;

const styles = StyleSheet.create({
    sessionBorder: {
        marginTop: 10, 
        marginBottom:10, 
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8, 
        borderBottomLeftRadius: 8, 
        borderBottomRightRadius: 8, 
        borderWidth:1, 
        borderColor: '#EB5757', 
        borderStyle: 'solid',
    },
    normalBorder: {
        marginTop: 10, 
        marginBottom:10, 
    }
});