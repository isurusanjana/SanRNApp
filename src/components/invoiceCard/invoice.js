import { StyleSheet } from 'react-native';

import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native' 
import formStyles from '../formTextInput/styles'; 
import moment from 'moment';
import { Button } from 'native-base';  
import { Fonts } from '../../config/font';



const Invoice = ({
    data, callBack
}) => (<TouchableOpacity key={data.id} style={styles.clickArea} onPress={callBack}>
    <View style={{ flexDirection: 'row', }}>
        <Text style={styles.detailsHeading}>{data.my_practice['practice_name']}</Text>
        <Text style={styles.detailsAmount}>£ {parseFloat(data.amount).toFixed(2)}</Text>
    </View>

    <View style={{ flexDirection: 'row', paddingTop: 0 }}>
        <Text style={styles.detailsDate}>{moment(data['add_date']).format("DD MMM YYYY")}</Text>
        <View style={{ flex: 1 }}>
            {
                data['status'] == 1 &&
                <Button disabled={true} style={styles.detailsStatus}>
                    <Text style={styles.detailsStatusText}>Sent</Text>
                </Button>
            }

            {
                data['status'] == 2 &&
                <Button disabled={true} style={styles.overDuedetailsStatus}>
                    <Text style={styles.overDuedetailsStatusText}>Overdue</Text>
                </Button>
            }
        </View>
    </View>

    <View style={[formStyles.hrLine, formStyles.input, { paddingTop: 20, }]} />
</TouchableOpacity>);

export default Invoice;


const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 25, paddingLeft: 15, paddingRight: 15, },
    heading: { fontSize: 18, fontFamily: Fonts.RubikMedium, color: '#142828', textAlignVertical: 'bottom', textAlign: 'left' },
    headingSub: { color: '#aeb7af', fontFamily: Fonts.Rubik, fontSize: 12, textAlignVertical: 'bottom', textAlign: 'left', paddingBottom: 2 },
    headingFilterIcon: { flex: 1, color: '#aeb7af', justifyContent: 'flex-end', textAlign: 'right', textAlignVertical: 'bottom', },
    clickArea: { height: 'auto', marginTop: 15, },
    detailsHeading: { flex: 1, color: '#414253', fontFamily: Fonts.MontserratBold, fontSize: 13, paddingRight:5 },
    detailsAmount: { justifyContent: 'flex-end', textAlign: 'right', textAlignVertical: 'bottom', color: '#414253', fontFamily: Fonts.MontserratBold, fontSize: 18, },
    detailsDate: { flex: 1, color: '#AAB2BD', fontFamily: Fonts.MontserratMedium, fontSize: 12 },
    detailsStatus: {elevation: 0, textAlign: 'center', backgroundColor: '#FFD7D7', justifyContent: 'center', alignContent: 'center', alignSelf: 'flex-end', height: 25, width: 90, borderRadius: 12, },
    detailsStatusText: { fontSize: 13, color: '#EB5757', fontFamily: Fonts.MontserratBold, justifyContent: 'center', },
    overDuedetailsStatus: {elevation: 0, textAlign: 'center', backgroundColor: '#FFD7D7', justifyContent: 'center', alignContent: 'center', alignSelf: 'flex-end', height: 25, width: 90, borderRadius: 12, },
    overDuedetailsStatusText: {fontSize: 13, color: '#EB5757', fontFamily: Fonts.MontserratBold, justifyContent: 'center' }
});