/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { AppNavigator } from './config/router';
import { View , StatusBar, Linking, Platform, AsyncStorage } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import DropDownHolder from './components/dropDown/dropDownHolder';



export default class App extends Component {

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor="#FFFFFF"
          barStyle="dark-content"
        />
        <AppNavigator />
        <DropdownAlert
          closeInterval={10000}
          tapToCloseEnabled={false}
          containerStyle={{
            backgroundColor: '#ff00AA',
          }}
          showCancel={true}
          onClose={data => DropDownHolder.dropDown.close()}
          onCancel={data => DropDownHolder.dropDown.close()}
          translucent={true}
          ref={(ref) => DropDownHolder.setDropDown(ref)} 
          inactiveStatusBarStyle={'dark-content'}
          inactiveStatusBarBackgroundColor={'#FFFFFF'}
          />
      </View>
    );
  }
}


