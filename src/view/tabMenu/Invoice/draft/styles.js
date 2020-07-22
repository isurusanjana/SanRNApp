import { StyleSheet } from 'react-native';
import { Fonts } from '../../../../config/font';

const draftStyles = StyleSheet.create({
    container: { flex: 1, paddingTop: 25, paddingHorizontal: 20 },
    heading: { fontSize: 18, color: '#414253', fontFamily: Fonts.MontserratBold, textAlign: 'left', height: 20, },
    headingSub: { color: '#CCD1D9', fontFamily: Fonts.MontserratBold, fontSize: 12, textAlign: 'left', height: 20, paddingTop: 6 },
    headingFilterIcon: { flex: 1, color: '#aeb7af', justifyContent: 'flex-end', textAlign: 'right', textAlignVertical: 'bottom', },
    clickArea: { height: 'auto', marginTop: 15, },
    // detailsHeading: { flex: 1, color: '#142828', fontFamily: Fonts.Rubik, fontFamily: Fonts.RubikMedium, fontSize: 18 },
    detailsHeading: { flex: 1, color: '#142828', fontFamily: Fonts.RubikMedium, fontSize: 14 },
    detailsAmount: { justifyContent: 'flex-end', textAlign: 'right', textAlignVertical: 'bottom', color: '#142828', fontFamily: Fonts.RubikMedium, fontSize: 15, },
    detailsDate: { flex: 1, color: '#aeb7af', fontFamily: Fonts.Rubik,  fontSize: 12 },
    detailsStatus: { elevation: 0, textAlign: 'center', backgroundColor: '#e3f8f2', justifyContent: 'center', alignContent: 'center', alignSelf: 'flex-end', height: 25, width: 35 },
    detailsStatusText: { fontSize: 11, color: '#2ee5b5', fontFamily: Fonts.Rubik, justifyContent: 'center' },

});

export default draftStyles;