import React, { Component } from 'react';
import {
  StyleSheet,         // CSS-like styles
  Text,               // Renders text
  TouchableOpacity,   // Pressable container
  View ,               // Container component
  Image,
  ImageBackground
} from 'react-native';
import { Fonts } from '../../config/font';

export default class CustomImageTab extends Component {

  // Initialize State
  state = {
    // First tab is active by default
    activeTab: 0
  }

  avatarImage = (imageName) => {
    switch (imageName) {
      case "personal":
        return require('./images/personal.png');
      case "personal-white":
        return require('./images/personal-white.png');
      case "location":
        return require('./images/location.png');
      case "location-white":
        return require('./images/location-white.png');
      case "camera":
        return require('./images/camera.png');
      case "professional":
        return require('./images/professional.png');
      case "professional-white":
        return require('./images/professional-white.png');
      case "job-description":
        return require('./images/Jobdescripion.png');
      case "job-description-white":
        return require('./images/jobdescription_selected.png');
      case "information":
        return require('./images/Information.png');
      case "information-white":
        return require('./images/Information_selected.png');
    }
  }

  // Pull children out of props passed from App component
  render({ children } = this.props) {

    return (
      <View style={styles.container}>
        {/* Tabs row */}
        <View style={styles.tabsContainer}>
          {/* Pull props out of children, and pull title out of props */}
          {children.map(({ props: { displayImage, selectedImage} }, index) =>
            <TouchableOpacity
              style={[
                // Default style for every tab
                styles.tabContainer,
              ]}
              // Change active tab
              onPress={() => {
                if(this.props.tabType != 'tooltip' && index != 1) {
                  this.setState({ activeTab: index });
                }
                this.props.callBack(index);
              }}
              // Required key prop for components generated returned by map iterator
              key={index}
            >           
              <Image source={index === this.state.activeTab ? this.avatarImage(selectedImage) : this.avatarImage(displayImage)} style={{ width: 55, height: 55,}} />
            </TouchableOpacity>
          )}
        </View>
        {/* Content */}
        <View style={styles.contentContainer}>
          {children[this.state.activeTab]}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // Component container
  container: {
    flex: 1,                            // Take up all available space
    paddingHorizontal: 20,
  },
  // Tabs row container
  tabsContainer: {
    flexDirection: 'row',               // Arrange tabs in a row
    paddingTop: 0,  
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  
  },
  // Individual tab container
  tabContainer: {
    flex: 1,                            // Take up equal amount of space for each tab
    paddingVertical: 15,                // Vertical padding
    borderBottomWidth: 3,               // Add thick border at the bottom
    borderBottomColor: 'transparent',   // Transparent border for inactive tabs    
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  
  },
  // Active tab container
  tabContainerActive: {
    borderBottomColor: '#00D3A1',       // White bottom border for active tabs
    borderBottomWidth: 1.5,
  },
  inActiveTabBorder: {
    borderBottomColor: '#E6E9ED',       // White bottom border for active tabs
    borderBottomWidth: 1.5,
  },
  // Tab text
  tabText: {
    fontFamily: Fonts.MontserratBold,
    fontSize: 13,
    textAlign: 'center',
  },
  tabTextColor: {
    color: '#AAB2BD',
  },
  activeTextColor: {
    color: '#00D3A1'
  },
  // Content container
  contentContainer: {
    flex: 1,                             // Take up all available space
    // paddingHorizontal: 20,
  }
});

export const tabHeadingStyles = StyleSheet.create({
  // App container
  container: {
    flex: 1,                            // Take up all screen
    backgroundColor: 'yellow',         // Background color
  },
  // Tab content container
  content: {
    flex: 1,  
                                // Take up all available space
    //   justifyContent: 'center',           // Center vertically
    //   alignItems: 'center',               // Center horizontally
    // backgroundColor: 'green',         // Darker background for content area
  },
  // Content header
  header: {
    margin: 10,                         // Add margin
    color: 'black',                   // White color
    fontFamily: 'Rubik',               // Change font family
    fontSize: 26,                       // Bigger font size
  },
  // Content text
  text: {
    marginHorizontal: 20,               // Add horizontal margin
    color: '#CEFDF2', // Semi-transparent text
    textAlign: 'center',                // Center
    fontFamily: 'Rubik',
    fontSize: 18,
  },
});