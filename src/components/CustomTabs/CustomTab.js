import React, { Component } from 'react';
import {
  StyleSheet,         // CSS-like styles
  Text,               // Renders text
  TouchableOpacity,   // Pressable container
  View                // Container component
} from 'react-native';
import { Fonts } from '../../config/font';

export default class CustomTab extends Component {

  // Initialize State
  state = {
    // First tab is active by default
    activeTab: 0
  }

  // Pull children out of props passed from App component
  render({ children } = this.props) {
    return (
      <View style={styles.container}>
        {/* Tabs row */}
        <View style={styles.tabsContainer}>
          {/* Pull props out of children, and pull title out of props */}
          {children.map(({ props: { title } }, index) =>
            <TouchableOpacity
              style={[
                // Default style for every tab
                styles.tabContainer,
                // Merge default style with styles.tabContainerActive for active tab
                index === this.state.activeTab ? styles.tabContainerActive : styles.inActiveTabBorder
              ]}
              // Change active tab
              onPress={() => {
                this.setState({ activeTab: index });
                this.props.callBack(index);
              }}
              // Required key prop for components generated returned by map iterator
              key={index}
            >
              <Text style={[styles.tabText,
              index === this.state.activeTab ? styles.activeTextColor : styles.tabTextColor
              ]}>
                {title}
              </Text>
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
    // paddingHorizontal: 20
  },
  // Tabs row container
  tabsContainer: {
    flexDirection: 'row',               // Arrange tabs in a row
    paddingTop: 0,   
    paddingHorizontal: 20                  // Top padding
  },
  // Individual tab container
  tabContainer: {
    flex: 1,                            // Take up equal amount of space for each tab
    paddingVertical: 15,                // Vertical padding
    borderBottomWidth: 3,               // Add thick border at the bottom
    borderBottomColor: 'transparent',   // Transparent border for inactive tabs
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
    flex: 1                             // Take up all available space
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