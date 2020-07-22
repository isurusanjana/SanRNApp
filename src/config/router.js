import { createStackNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation";
import Welcome from "../view/welcome/welcome";
import Splash from "../view/splash/splash";
import Login from "../view/login/login";
import SignUp from "../view/signup/signup";
import ForgotPassword from '../view/login/forgotPassword';

import React, { Component } from 'react';
import Invoices from "../view/tabMenu/Invoice/invoice";
import Messages from "../view/tabMenu/Messages/messages";
import MyProfile from "../view/tabMenu/MyProfile/myProfile";
import Profile from "../view/tabMenu/MyProfile/profile";
import Documents from "../view/tabMenu/MyProfile/documents";
import PaymentDetails from "../view/tabMenu/MyProfile/paymentDetails";
import FindAJob from "../view/tabMenu/FindAJob/findajob";
import MyJobs from "../view/tabMenu/MyJobs/myjobs";
// import HomePage from "../view/home/home";
import Icon from 'react-native-vector-icons/FontAwesome';

import { Image, View, Text, StyleSheet } from 'react-native';
import NewInvoice from "../view/tabMenu/Invoice/newInvoice/newInvoice";
import NewJob from "../view/tabMenu/MyJobs/newJob/newJob";
import SelectPractice from "../view/tabMenu/Invoice/newInvoice/selectPractice";
import SelectSession from "../view/tabMenu/Invoice/newInvoice/selectSession";
import Certificate from "../view/tabMenu/MyProfile/certificate";
import UploadDocument from '../view/tabMenu/MyProfile/uploadDocument';
import FinancialReport from '../view/tabMenu/MyProfile/financialReport';
import Subscription from '../view/tabMenu/MyProfile/subscription';
import ShareFinancial from '../view/tabMenu/MyProfile/shareFinancial';
import ViewInvoice from "../view/tabMenu/Invoice/viewInvoice/viewInvoice";
import PreviewInvoice from "../view/tabMenu/Invoice/viewInvoice/preview";
import expenseList from "../view/tabMenu/Invoice/expenses/expenseList";
import addViewExpenses from "../view/tabMenu/Invoice/expenses/addViewExpense";
import ViewJob from "../view/tabMenu/MyJobs/newJob/viewJob";
import DetailMessages from "../view/tabMenu/Messages/detailMessage";
import practiceDetails from "../view/tabMenu/MyJobs/practice/practiceDetails";
import myPractices from "../view/tabMenu/MyProfile/myPractices.js";

import { Fonts } from "./font";
import JobFilter from "../view/tabMenu/MyJobs/filter/filter";
import CalendarSearch from "../view/tabMenu/MyJobs/calendarSearch/calendar";

const MainNavigation = createBottomTabNavigator(
  {
    Screen1: {
      screen: FindAJob,
      navigationOptions: {
        // tabBarLabel: null,
        title: {
          headerTitle: 'Jobs'
        },
        tabBarIcon: ({ focused, tintColor }) => {
          let imgOpacity = 0.5;
          let imageUrl = require('../assets/img/find-job-gray.png');
          if (focused == true) {
            imgOpacity = 1;
            imageUrl = require('../assets/img/find-job.png');
          }
          return (<View style={menuStyles.mainMenuContainer}><Image resizeMode='contain' source={imageUrl} style={[menuStyles.mainMenuImage, { opacity: imgOpacity }]}></Image>{focused == true ? <Text style={menuStyles.mainMenuText}>Job search</Text> : null}</View>)
        }
      }
    },
    Screen2: {
      screen: MyJobs,
      navigationOptions: {
        tabBarLabel: null,
        tabBarIcon: ({ focused, tintColor }) => {
          let imgOpacity = 0.5;
          let imageUrl = require('../assets/img/session-gray.png');
          if (focused == true) {
            imgOpacity = 1;
            imageUrl = require('../assets/img/session.png');
          }
          return (<View style={menuStyles.mainMenuContainer}><Image resizeMode='contain' source={imageUrl} style={[menuStyles.mainMenuImage, { opacity: imgOpacity }]}></Image>{focused == true ? <Text style={menuStyles.mainMenuText}>My Jobs</Text> : null}</View>)
        }
      }
    },
    Screen3: {
      screen: Invoices,
      navigationOptions: {
        tabBarLabel: null,
        tabBarIcon: ({ focused, tintColor }) => {
          let imgOpacity = 0.5;
          let imageUrl = require('../assets/img/invoices-gray.png');
          if (focused == true) {
            imgOpacity = 1;
            imageUrl = require('../assets/img/invoices.png');
          }
          return (<View style={menuStyles.mainMenuContainer}><Image resizeMode='contain' source={imageUrl} style={[menuStyles.mainMenuImage, { opacity: imgOpacity }]}></Image>{focused == true ? <Text style={menuStyles.mainMenuText}>Invoices</Text> : null}</View>)
        }
      }
    },
    Screen4: {
      screen: Messages,
      navigationOptions: {
        tabBarLabel: null,
        tabBarIcon: ({ focused, tintColor }) => {
          let imgOpacity = 0.5;
          let imageUrl = require('../assets/img/message-gray.png');
          if (focused == true) {
            imgOpacity = 1;
            imageUrl = require('../assets/img/message.png');
          }
          return (<View style={menuStyles.mainMenuContainer}><Image resizeMode='contain' source={imageUrl} style={[menuStyles.mainMenuImage, { opacity: imgOpacity }]}></Image>{focused == true ? <Text style={menuStyles.mainMenuText}>Messages</Text> : null}</View>)
        }
      }
    },
    Screen5: {
      screen: MyProfile,
      navigationOptions: {
        tabBarLabel: null,
        tabBarIcon: ({ focused, tintColor }) => {
          let imgOpacity = 0.5;
          let imageUrl = require('../assets/img/user-gray.png');
          if (focused == true) {
            imgOpacity = 1;
            imageUrl = require('../assets/img/user.png');
          }
          return (<View style={menuStyles.mainMenuContainer}><Image resizeMode='contain' source={imageUrl} style={[menuStyles.mainMenuImage, { opacity: imgOpacity }]}></Image>{focused == true ? <Text style={menuStyles.mainMenuText}>More</Text> : null}</View>)
        }
      }
    },
  },
  {
    initialRouteName: "Screen1",
    order: ['Screen1', 'Screen2', 'Screen3', 'Screen4', 'Screen5',],
    navigationOptions: {
      gesturesEnabled: false,
    },
    tabBarOptions: {
      showIcon: true,
      showLabel: false,
      activeTintColor: '#F8F8F8',
      inactiveTintColor: '#e8eaef',
      style: {
        borderTopWidth: 0,
        shadowColor: 'white',
        // shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.75,
        shadowRadius: 5,
        // elevation: 15
      }
    },
    swipeEnabled: true,
    animationEnabled: true
  }
);


const LaunchNavigate = createStackNavigator(
  {
    Luncher: {
      screen: Splash,
      navigationOptions: {
        header: null
      }
    },
    WelcomeNavigate: {
      screen: Welcome,
      navigationOptions: {
        header: null,
        headerBackTitle: "Back"
      }
    },
    LoginPage: {
      screen: Login,
      navigationOptions: {
        header: null,
        // headerStyle: { backgroundColor: 'transparent' }
      }
    },
    SignUpPage: {
      screen: SignUp,
      navigationOptions: {
        // title: "Sign Up",
        // headerTintColor: 'green',
        // headerTitleStyle: { color: 'black' },
        // headerBackImage: <Image source={require('../assets/img/logo.png')} />
        header: null,
        // headerStyle: { backgroundColor: 'transparent' }
      }
    },
    ForgotPassword: {
      screen: ForgotPassword,
      navigationOptions: {
        header: null,
        // headerStyle: { backgroundColor: 'transparent' }
      }
      // title: "Forgot Password",      
    },
    MainNavigation: {
      screen: MainNavigation,
      navigationOptions: {
        header: null
      }
    },
    NewInvoicePage: {
      screen: NewInvoice,
      navigationOptions: {
        header: null
      }
    },
    NewJobPage: {
      screen: NewJob,
      navigationOptions: {
        header: null
      }
    },
    SelectPracticePage: {
      screen: SelectPractice,
      navigationOptions: {
        header: null
      }
    },
    ProfilePage: {
      screen: Profile,
      navigationOptions: {
        header: null
      }
    },
    DocumentPage: {
      screen: Documents,
      navigationOptions: {
        header: null
      }
    },
    PaymentDetailsPage: {
      screen: PaymentDetails,
      navigationOptions: {
        header: null
      }
    },
    SelectSessionPage: {
      screen: SelectSession,
      navigationOptions: {
        header: null
      }
    },
    CertificatePage: {
      screen: Certificate,
      navigationOptions: {
        header: null
      }
    },
    DocumentUploadPage: {
      screen: UploadDocument,
      navigationOptions: {
        header: null
      }
    },
    FinancialReportPage: {
      screen: FinancialReport,
      navigationOptions: {
        header: null
      }
    },
    SubscriptionPage: {
      screen: Subscription,
      navigationOptions: {
        header: null
      }
    },
    ShareFinancialPage: {
      screen: ShareFinancial,
      navigationOptions: {
        header: null
      }
    },
    ViewInvoicePage: {
      screen: ViewInvoice,
      navigationOptions: {
        header: null
      }
    },
    PreviewInvoicePage: {
      screen: PreviewInvoice,
      navigationOptions: {
        header: null
      }
    },
    ExpenseListPage: {
      screen: expenseList,
      navigationOptions: {
        header: null
      }
    },
    AddViewExpensesPage: {
      screen: addViewExpenses,
      navigationOptions: {
        header: null
      }
    },
    ViewJobPage: {
      screen: ViewJob,
      navigationOptions: {
        header: null
      }
    },
    DetailMessagesPage: {
      screen: DetailMessages,
      navigationOptions: {
        header: null
      }
    },
    practiceDetailsPage: {
      screen: practiceDetails,
      navigationOptions: {
        header: null
      }
    },
    myPracticesPage: {
      screen: myPractices,
      navigationOptions: {
        header: null
      }
    },
    jobFilterPage: {
      screen: JobFilter,
      navigationOptions: {
        header: null
      }
    },
    jobCalenderSearchPage: {
      screen: CalendarSearch,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: "Luncher",
    // headerMode: "screen",
    headerBackTitleVisible: true,
    headerLayoutPreset: 'center'
    // navigationOptions: { gesturesEnabled: false }
  }
);

export const AppNavigator = createAppContainer(LaunchNavigate);

const menuStyles = StyleSheet.create({
  mainMenuContainer: { justifyContent: 'center', alignItems: 'center', alignContent: 'center', alignSelf: 'center', borderTopColor:"transparent" },
  mainMenuImage: { width: 20, height: 20 },
  mainMenuText: { paddingTop:1, fontFamily: Fonts.MontserratSemiBold, fontSize: 10, color: '#1C7BE5',  paddingTop: 5 },
})
