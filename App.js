import { Buffer } from 'buffer';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Switch, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import BluetoothSerial from 'react-native-bluetooth-serial';
global.Buffer = Buffer
const App = () => {

  const [device, setDevice] = useState(null);
  const [isEnabled, setBluetoothEnabled] = useState(null);
  const [connectedDevice, setConnectedDevice] = useState(null);



  function bluetooth() {
    Promise.all([
      BluetoothSerial.isEnabled(),
      BluetoothSerial.list()
    ]).then(([enabled, devices]) => {
      console.log(enabled, devices);
      setDevice(devices);
      setBluetoothEnabled(enabled);
    }
    )
  }
  console.log('App Rerender');
  useEffect(() => {
    bluetooth();
  }, [])

  useEffect(() => {
    bluetooth();
  }, [isEnabled])

  const handleSwitch = (value) => {
    if (value) {
      BluetoothSerial.enable().then(() => {
        setBluetoothEnabled(true);
      }).catch(() => {
        setBluetoothEnabled(false);
      })
    } else {
      BluetoothSerial.disable().then(() => {
        setBluetoothEnabled(false);
      }).catch(() => {
        setBluetoothEnabled(true);
      })
    }
  }

  const relayOn = () =>{
    let relayOnString = "A00101A2";
    let buffer = Buffer.from(relayOnString, "hex");
    BluetoothSerial.write(buffer)
      .then((res) => {
        console.log(res);
        ToastAndroid.showWithGravity(
          'Successfully write to device',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM
        );
      })
      .catch((err) => {
        ToastAndroid.showWithGravity(
          err.message,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM
        );
      })
  } 

  const relayOff = () => {
    let relayOnString = "A00100A1";
    let buffer = Buffer.from(relayOnString, "hex");
    BluetoothSerial.write(buffer)
      .then((res) => {
        console.log(res);
        ToastAndroid.showWithGravity(
          'Successfully write to device',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM
        );
      })
      .catch((err) => {
        ToastAndroid.showWithGravity(
          err.message,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM
        );
      })
  } 

  function header() {
    return (
      <View style={styles.header}>
        <Text style={styles.logoText}> Core BluetoothSerial</Text>
        <View>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "lightgreen" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={handleSwitch}
            value={isEnabled}
          />
        </View>
      </View>
    )
  }

  function handleConnectDevice(device){
    BluetoothSerial.connect(device)
      .then((res) => {
        setConnectedDevice(device)
        ToastAndroid.showWithGravity(
          res.message,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM
        );
      })
      .catch((err) => {
        setConnectedDevice(null)
        ToastAndroid.showWithGravity(
          err.message,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM
        );
      })
  
  }

  const renderDevice = ({ item }) => (
    <TouchableOpacity style={{
        backgroundColor: 'white',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1,
        flex:1,
        flexDirection:'row',
        justifyContent:'space-evenly',
        alignItems:'center',
        paddingHorizontal:30,
        marginRight:10,
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1,
    }} onPress={() => handleConnectDevice(item.id)}>
      <View style={[styles.header, {
        backgroundColor: 'white',
        flexDirection:'column',
        alignItems:'flex-start',
        justifyContent:'center',
        height: 120,
      }]}>
        <Text style={[styles.listText,{fontSize:20}]}>Name : {item.name}</Text>
        <Text style={[styles.listText,{color:'grey'}]}>Address: {item.address}</Text>
        <Text style={[styles.listText,{color:'grey'}]}>Class: {item.class}</Text>
      </View>
      
      <View style={{ 
        backgroundColor: (connectedDevice == item.id) ? 'green': 'gray' ,
        padding:10,
        borderRadius:20,
      }}>
        <Text>{(connectedDevice == item.id) ? 'Connected' : 'Disconnected'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {header()}

      {
        isEnabled ?
        <>
          <FlatList
            ListHeaderComponent={() => {
              return (
                <View style={[styles.header, {
                  backgroundColor: '#444444'
                }]}>
                  <Text style={{
                    color: 'whitesmoke',
                    fontSize: 15
                  }}>Paired devices</Text>
                </View>
              )
            }}
            data={device}
            renderItem={renderDevice}
            keyExtractor={(item, index) => index.toString()}

          />
        </>
          :
          <View style={{
            flex: 1,
            backgroundColor: 'whitesmoke',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{
              fontWeight: 'bold',
              fontSize: 35,
              color: 'red'
            }}>Bluetooth is disabled</Text>
          </View>
      }

      <View style={{
        backgroundColor:'whitesmoke',
        height:100,
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
      }}>
        <Button title="Relay ON" color="green" onPress={() => relayOn()}/>
        <Button title="Relay OFF" color="red" onPress={() => relayOff()}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    color: 'black',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: 'dodgerblue',
    height: 60,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  logoText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'white'
  },
  listText:{
    color: 'black',
    fontWeight:'600',
    padding:4
  }
})

export default App;
