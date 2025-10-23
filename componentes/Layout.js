import { StyleSheet, Text,StatusBar, View, TouchableOpacity  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context'

import { Feather as Icon } from '@expo/vector-icons';
import { Ionicons as Icons } from '@expo/vector-icons';

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
const FooterButton = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.footerButton} onPress={onPress}>
    <Icon name={icon} size={24} color="#FFA500" />
    
    <Text style={styles.footerLabel}>{label}</Text>
  </TouchableOpacity>
);
const FooterButtonGame = ({ icons, label, onPress }) => (
  <TouchableOpacity style={styles.footerButton} onPress={onPress}>
    <Icons name={icons} size={24} color="#FFA500" />
    <Text style={styles.footerLabel}>{label}</Text>
  </TouchableOpacity>
);

// Footer
const Footer = () => {
  const navigation = useNavigation(); 
  return (
    <View style={styles.footer}>
      <FooterButton icon="home" label="Inicio" onPress={() => navigation.navigate('Inicio')} />
      <FooterButton icon="search" label="Buscar" />
      <FooterButton icon="heart" label="Favoritos" />
      <FooterButtonGame icons="game-controller-outline" label="MiniGame"/>
     
    </View>
  );
};


// Layout
export default function Layout({header,children}) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="auto"  />
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
  },

  header: {
    height: 35,
    justifyContent: 'center', 
    alignItems: 'center',   
  },

  headerText: {
    color: 'black',
    fontSize: 24, 
  },
  
  body: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 5, 
  },

  footer: {
    height: 80, 
    backgroundColor: '#3384cc', 
    alignItems: 'center', 
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  footerButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
footerLabel: {
  color: 'white',
  fontSize: 14,
  marginTop: 4,
},

});
