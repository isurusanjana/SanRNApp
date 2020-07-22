import { View, Text, TextInput, TouchableOpacity, Image, AsyncStorage } from 'react-native';
import Overlay from 'react-native-modal-overlay';
import Entypo from 'react-native-vector-icons/Entypo';
import React, { Component } from 'react';

var selectedSort = 'add_date';
class InvoiceSort extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            displayTitle: null
        };
    }

    componentDidMount() {
        this.setState({
            sortOption: this.props.sortOption,
            displayTitle: this.props.title
        })
    }

    selectedValue(id, value) {
        console.log("ID 2:", id);
        var tempSortOptions = this.state.sortOption;
        tempSortOptions.forEach(element => {
            if (element['id'] == id) {
                element['selected'] = true;
                selectedSort = element['sort'];
            } else {
                element['selected'] = false;
            }
        });
        this.setState({ sortOption: tempSortOptions });
        this.props.onClose(selectedSort, value);
    }

    render() {
        return (
            <Overlay visible={this.props.visible} onClose={this.props.onClose} closeOnTouchOutside containerStyle={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                childrenWrapperStyle={{
                    width: '100%',
                    height: 'auto', position: 'absolute',
                    bottom: 0, borderTopLeftRadius: 25, borderTopRightRadius: 25, left: 20, padding: 0, paddingTop: 5,
                }}>
                <View style={{
                    flex: 1, flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    width: '100%', alignSelf: 'flex-start', padding: 0, margin: 0,
                }}>
                    <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center', paddingBottom: 20, width: 20 }}>
                        <Image style={{ width: 50, height: 5 }} source={require('./images/rectangle.png')}></Image>
                    </View>
                    <Text style={{ color: '#142828', textAlign: 'left', fontFamily: 'Rubik', fontSize: 16, marginBottom: 15, paddingLeft: 25 }}>{this.state.displayTitle}</Text>
                    {
                        this.state.sortOption.map(data => {
                            if (data.selected == true) {
                                return (
                                    <View key={data.id} style={{ height: 50, justifyContent: 'center', width: '100%', paddingLeft: 25, backgroundColor: '#e3f8f2' }}>
                                        <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', }} onPress={() => {
                                            this.selectedValue(data.id, true);
                                        }}>
                                            <View style={{ justifyContent: 'center' }}>
                                                <Text style={{ textAlign: 'left', color: '#2ee5b5', fontSize: 16, fontFamily: 'Rubik', }}>{data.value}</Text>
                                            </View>
                                            <View style={{ flex: 1, justifyContent: 'center', alignContent: 'flex-end', alignItems: 'flex-end', paddingRight: 50, }}>
                                                <Entypo name='check' size={20} color='#2ee5b5'></Entypo>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            } else {
                                return (
                                    <View key={data.id} style={{ height: 50, justifyContent: 'center', width: '100%', paddingLeft: 26 }}>
                                        <TouchableOpacity onPress={() => {
                                            this.selectedValue(data.id, true);
                                        }}>
                                            <Text style={{ textAlign: 'left', color: '#142828', fontSize: 15, fontFamily: 'Rubik', }}>{data.value}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }
                        })
                    }
                </View>
            </Overlay>
        );
    }
}

export default InvoiceSort;
