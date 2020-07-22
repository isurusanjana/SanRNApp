import { View, Text, TextInput, TouchableOpacity, Image, AsyncStorage, ScrollView, Dimensions } from 'react-native';
import Overlay from 'react-native-modal-overlay';
import Entypo from 'react-native-vector-icons/Entypo';
import React, { Component } from 'react';
import { Fonts } from '../../config/font';

class CustomMultiSelectDropDown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayTitle: null,
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
            fieldName: null,
        };
    }

    componentDidMount() {
        this.setState({
            sortOption: this.props.sortOption,
            displayTitle: this.props.title,
            selectedValue: this.props.selectedValue,
            fieldName: this.props.fieldName
        })
    }

    selectedValue = (id, value, fieldName=null) => {
        var tempSortOptions = this.state.sortOption;

        tempSortOptions.forEach(element => {
            if (element['id'] == id && element['selected'] == true) {
                element['selected'] = false;
                selectedSort = element['sort'];
            } else if (element['id'] == id && element['selected'] == false)  {
                element['selected'] = true;
            }
        });
        // console.warn('tempSortOptions ',tempSortOptions);
        this.setState({ sortOption: tempSortOptions });
        // this.props.onSelectItem(tempSortOptions, value, this.state.fieldName);
    }

    sendSelected = (fieldName=null) => {
        this.props.onSelectItem(this.state.sortOption, this.state.fieldName);
    }

    render() {
        return (
            <Overlay visible={this.props.visible} 
                onClose={this.props.onClose} 
                closeOnTouchOutside = {true}
                containerStyle={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                childrenWrapperStyle={{
                    width: '100%',
                    maxHeight: (Dimensions.get('window').height - 60), position: 'absolute',
                    bottom: 0, borderTopLeftRadius: 25, borderTopRightRadius: 25, left: 20, padding: 0, paddingTop: 5,
                }}>
                <ScrollView style={{width: '100%' }}>
                <View style={{
                    flex: 1, flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    width: '100%', alignSelf: 'flex-start', padding: 0, margin: 0,
                    paddingTop: 10
                }}>
                
                    <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center', paddingBottom: 20, width: 20 }}>
                        <Image style={{ width: 50, height: 5 }} source={require('./images/rectangle.png')}></Image>
                    </View>
                    <View  style={{ flexDirection: 'row', width: '100%',}}>
                        <View style={{ alignContent: 'flex-start', width: '80%', justifyContent: 'center',}}>
                            <Text style={{ color: '#142828', textAlign: 'left', fontFamily: Fonts.MontserratBold, fontSize: 15, marginBottom: 15, paddingLeft: 25 }}>{this.state.displayTitle}</Text>
                        </View>
                        <View  style={{ alignContent: 'flex-end',width: '20%', right:10, alignItems: 'center', marginBottom: 20, alignSelf: 'center'}}>
                            <TouchableOpacity style={{
                                    backgroundColor: '#00F0B5',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderColor: '#00F0B5',
                                    borderRadius: 5,
                                    elevation: 0, borderWidth: 0, width: 50, height: 30, alignSelf: 'flex-end', top: 10, right: 0
                                }} onPress={() => {
                                    this.sendSelected();
                                }}>
                                <Text style={{ color: '#ffffff',overflow: 'hidden',textAlign:'center', fontSize: 15, fontFamily: Fonts.MontserratBold }}>OK</Text> 
                            </TouchableOpacity>  
                        </View>
                    </View>
                    
                    {
                        this.state.sortOption.map(data => {

                            if (data.selected == true || data.value == this.state.selectedValue) { 
                                return (
                                    <View key={data.id} style={{ height: 50, justifyContent: 'center', width: '100%', paddingLeft: 25, backgroundColor: '#e3f8f2' }}>
                                        <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', }} onPress={() => {
                                            this.selectedValue(data.id, data.value);
                                        }}>
                                            <View style={{ justifyContent: 'center' }}>
                                                <Text style={{ textAlign: 'left', color: '#414253', fontSize: 13, fontFamily: Fonts.MontserratMedium, }}>{data.value}</Text>
                                            </View>
                                            <View style={{ flex: 1, justifyContent: 'center', alignContent: 'flex-end', alignItems: 'flex-end', paddingRight: 10, }}>
                                                <Entypo name='check' size={20} color='#2ee5b5'></Entypo>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            } else {
                                return (
                                    <View key={data.id} style={{ height: 50, justifyContent: 'center', width: '100%', paddingLeft: 26 }}>
                                        <TouchableOpacity onPress={() => {
                                            this.selectedValue(data.id, data.value);
                                        }}>
                                            <Text style={{ textAlign: 'left', color: '#414253', fontSize: 13, fontFamily: Fonts.MontserratMedium, }}>{data.value}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }
                        })
                    }
                </View>
                </ScrollView>
            </Overlay>
        );
    }
}

export default CustomMultiSelectDropDown;
