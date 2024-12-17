import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogoScreen from './components/LogoScreen';
import UserPanel from './components/ClientDashboard';
import PayPartial from './components/PayPartial';
import Notifications from './components/Notifications';
import ChangePassword from './components/ChangePassword';
import Dashboard from './components/Dashboard';
import AddClients from './components/AddClients';
import ClientsList from './components/ClientsList';
import ClientDetails from './components/ClientDetails';
import Payments from './components/Payments';
import Clientd from './components/Clientd';
import NotificationsA from './components/admin/AdminNotify';
import UserModalA from './components/admin/AdminUModal';
import ChangeOldPassword from './components/admin/AdminPassword';
import Statement from './components/Statement';
import RecentPaymentList from "./components/RecentPaymentList";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LogoScreen" // Start the app from LogoScreen
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="LogoScreen" component={LogoScreen} />
        <Stack.Screen name="UserPanel" component={UserPanel} />
        <Stack.Screen name="Notification" component={Notifications} />
        <Stack.Screen name="RecentPaymentList" component={RecentPaymentList} options={{ headerShown: true }} />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="PayPartial"
          component={PayPartial}
          options={({ navigation }) => ({
            headerShown: true,
            headerStyle: { backgroundColor: '#E0F0FF' },
            headerTitle: () => (
              <Image
                source={require('./assets/Capture.png')}
                style={{ width: 150, height: 70, left: -25 }}
              />
            ),
          })}
        />
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
        <Stack.Screen
          name="Add Clients"
          component={AddClients}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="ClientList"
          component={ClientsList}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="ClientDetails"
          component={ClientDetails}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Payments"
          component={Payments}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Client"
          component={Clientd}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="NotificationsA"
          component={NotificationsA}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="UserModalA"
          component={UserModalA}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="ChangeOldPassword"
          component={ChangeOldPassword}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Statement"
          component={Statement}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
