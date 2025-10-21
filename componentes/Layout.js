import { StyleSheet, Text,StatusBar, View } from 'react-native';

import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context'

// Header
const Header = ({label}) => (
  <View style={styles.header}>
    <Text style={styles.headerText}>{label}</Text>
  </View>
);
// Body 
const Body = ({ children }) => (
  <View style={styles.body}>
    {children}
  </View>
);

// Footer
const Footer = () => (
  <View style={styles.footer}>
    <Text style={styles.footerText}></Text>
  </View>
);

// Layout
export default function Layout({header,children}) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
        <Header label={header} />
        <Body>
         {children}
        </Body>
        <Footer />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
 
  container: {
    flex: 1, 
    backgroundColor: '#f5f5f5', 
  },

  header: {
    height: 60, 
    backgroundColor: '#740073', 
    justifyContent: 'center', 
    alignItems: 'center', 
  },

  headerText: {
    color: 'white',
    fontSize: 20, 
    fontWeight: 'bold', 
  },
  
  body: {
    flex: 1,
    justifyContent: 'top', 
    alignItems: 'left', 
    padding: 5, 
  },
 
  footer: {
    height: 50, 
    backgroundColor: '#4a0045', 
    justifyContent: 'center',
    alignItems: 'center', 
  },
  footerText:{
    color: 'white',
   
  },
});
