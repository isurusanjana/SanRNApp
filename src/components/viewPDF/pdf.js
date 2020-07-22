import React from 'react';
import { StyleSheet, Dimensions, View, ScrollView } from 'react-native';

import Pdf from 'react-native-pdf';

const source = { uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf', cache: true };
const ViewPDF = ({
    resources, resourceType, width , height
}) => (
        // <View style={styles.container}>
        <Pdf
            source={resources}
            onLoadComplete={(numberOfPages, filePath) => {
                console.log(`number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
                console.log(`current page: ${page}`);
            }}
            onError={(error) => {
                console.log(error);
            }}
            style={{ flex: 1, width: width, height: height , backgroundColor: '#ffffff'}} />
        // </View>
    );

export default ViewPDF;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex: 1,
        width: 'auto',
    }
});
