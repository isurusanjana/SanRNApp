import React from 'react';
import { View, StyleSheet , Platform } from 'react-native';
import { FloatingAction } from 'react-native-floating-action';

const actions = [{
    text: 'Invoices',
    // icon: require('./images/plus.png') ,
    icon: { uri: 'https://ya-webdesign.com/images250_/white-plus-png-1.png' },
    name: 'invoice',
    position: 1,
    color: '#2ee5b5'
},];

const AddItem = ({
    Navigation, goToPage, CallBack = null
}) => (
        <View style={{
            flex: 1,
            position: 'absolute', width: '100%',
            height: Platform.OS === 'ios' ? 0 : '100%',
            bottom: 0,
            right: 0,
        }}>
            <FloatingAction
                overrideWithAction={true}
                actions={actions}
                onPressItem={
                    (name) => {
                        Navigation.navigate(goToPage, CallBack);
                    }
                }
                onPressMain={() => {
                    Navigation.navigate(goToPage, CallBack );
                }}
                overlayColor={'transparent'}
                color={'#2ee5b5'}
                showBackground={false}
                textElevation={0}
            />
        </View>
    );

export default AddItem;


const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
      },
});
