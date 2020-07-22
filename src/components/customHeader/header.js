import React from 'react';
import { View, StyleSheet, StatusBar, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Header, Left, Body, Right, Icon, Button, Tabs, Tab, ScrollableTab } from 'native-base';
import { Fonts } from '../../config/font';
import { myprofilestyles, profileStyles } from './../../view/tabMenu/MyProfile/styles';


const CustomHeader = ({
    children, goBack, headerTitle, headerStyle, titleFontSize
}) => (
        <View>
            <Header elevation={1} transparent >
                <StatusBar
                    backgroundColor="#FFFFFF"
                    barStyle="dark-content"
                />

                <View style={{ flexDirection: 'row', height: (Dimensions.get('window').height) * 0.1, paddingTop: 5,paddingHorizontal: 10 }}> 
                    <View style={{ width: '67%',}}>
                        <TouchableOpacity onPress={() => { goBack() }} style={{ flexDirection: 'row',  }}>
                            <View style={{justifyContent: 'center', paddingRight: 10}}>
                                <View  style={{width:50}}>
                                    <TouchableOpacity onPress={() => { goBack(); }}>
                                    <Icon name='arrow-back' style={ profileStyles.headerArrowBackReverse } />

                                </TouchableOpacity>
                                </View>
                            </View>
                            <View>
                                <Text style={[headerStyle != undefined ? headerStyle : style.headerBodyText, { fontSize : titleFontSize != undefined ? titleFontSize : 18}]}>{headerTitle}</Text>
                            </View>
                            {/* <Icon name='arrow-back' style={{ fontSize: 30, color: 'black', justifyContent: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start', alignSelf: 'flex-start', }} /> */}
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: '33%', alignItems: 'flex-end', }}></View>
                </View>
            </Header>
        </View>
    );

export default CustomHeader;


const style = StyleSheet.create({
    headerLeft: { alignItems: 'flex-start', flex: 1 },
    headerBody: {
        flex: 1,
        alignItems: 'center',
    },
    headerBodyText: {
        color: '#414253',
        fontFamily: Fonts.MontserratBold,
    },
})