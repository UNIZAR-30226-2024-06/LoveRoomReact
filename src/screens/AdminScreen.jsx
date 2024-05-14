import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import AuthContext from '../components/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import { BarChart, PieChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';


const getOrientation = () => {
  const { width, height } = Dimensions.get('window');
  return width > height ? 'landscape' : 'portrait';
};


const provinciasDeEspana = [
    'Álava',
    'Albacete',
    'Alicante',
    'Almería',
    'Asturias',
    'Ávila',
    'Badajoz',
    'Baleares',
    'Barcelona',
    'Burgos',
    'Cáceres',
    'Cádiz',
    'Cantabria',
    'Castellón',
    'Ceuta',
    'Ciudad Real',
    'Córdoba',
    'Cuenca',
    'Gerona',
    'Granada',
    'Guadalajara',
    'Guipúzcoa',
    'Huelva',
    'Huesca',
    'Jaén',
    'La Coruña',
    'La Rioja',
    'Las Palmas',
    'León',
    'Lérida',
    'Lugo',
    'Madrid',
    'Málaga',
    'Melilla',
    'Murcia',
    'Navarra',
    'Orense',
    'Palencia',
    'Pontevedra',
    'Salamanca',
    'Santa Cruz de Tenerife',
    'Segovia',
    'Sevilla',
    'Soria',
    'Tarragona',
    'Teruel',
    'Toledo',
    'Valencia',
    'Valladolid',
    'Vizcaya',
    'Zamora',
    'Zaragoza'
  ];

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


function Admin({ navigation }) {
  const { authState, setAuthState } = React.useContext(AuthContext);
  const [users, setUsers] = React.useState([]);
  const [reports, setReports] = React.useState([]);
  const [modalEstadisticasVisible, setModalEstadisticasVisible] = React.useState(false);
  const [modalUsuariosVisible, setModalUsuariosVisible] = React.useState(false);
  const [modalReportsVisible, setModalReportsVisible] = React.useState(false);
  const LogOutButton = React.useRef(false);
  const [orientation, setOrientation] = useState(getOrientation());

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(getOrientation());
      console.log(getOrientation());
    };

    const dimens = Dimensions.addEventListener('change', updateOrientation);

    return () => {
      dimens?.remove();
    };
  }, []);

  const [refresh, setRefresh] = useState(false);
  const [refreshReports, setRefreshReports] = useState(false);

  const updateType = async (user, userType) => {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/update/type/${userType}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${authState.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: user.id })
    });
  
    const data = await response.json();
    console.log(data);
    if (data.error==null) {
        Toast.show({
            type: 'success',
            position: 'bottom',
            text1: 'Usuario actualizado correctamente',
            text2: `El usuario ${user.nombre} ahora es ${userType}`,
            visibilityTime: 2500,
        });
        user.tipousuario = userType;
        setRefresh(!refresh);
    }
  };

  const updateBan = async (user, ban) => {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/${ban}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${authState.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: user.id })
    });
    const data = await response.json();
    console.log(data);
    if (data.error == null) {
        Toast.show({
            type: 'success',
            position: 'bottom',
            text1: 'Usuario actualizado correctamente',
            text2: `El usuario ${user.nombre} ha sido ${user.baneado ? 'desbaneado' : 'baneado'}`,
            visibilityTime: 2500,
        });
        user.baneado = !user.baneado;
        setRefresh(!refresh);
    }
    };



    React.useEffect(() => {
        fetchUserData();
        fetchReports();
    }, []);


    React.useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
          // Prevent the back action
        });
    
        return unsubscribe;
      }, [navigation]);

    const [genderData, setGenderData] = React.useState([]);
    const [ageData, setAgeData] = React.useState([]);
    const [localData, setLocalData] = React.useState([]);

    useEffect(() => {
        const genderData = [
            { name: 'Hombres', population: users.filter(user => user.sexo === 'H').length, color: 'rgba(5, 49, 242, 0.8)', legendFontColor: '#7F7F7F', legendFontSize: 15 },
            { name: 'Mujeres', population: users.filter(user => user.sexo === 'M').length, color: 'rgba(220, 89, 157, 0.8)', legendFontColor: '#7F7F7F', legendFontSize: 15 },
            { name: 'Otro', population: users.filter(user => user.sexo === 'O').length, color: 'rgba(94, 217, 102, 1)', legendFontColor: '#7F7F7F', legendFontSize: 15 },
          ];
        const ageData = [
        { name: '18-25', population: users.filter(user => user.edad >= 18 && user.edad <= 25).length, color: 'rgba(255, 0, 0, 1)', legendFontColor: '#7F7F7F', legendFontSize: 15 },
        { name: '26-35', population: users.filter(user => user.edad >= 26 && user.edad <= 35).length, color: 'rgba(0, 255, 0, 1)', legendFontColor: '#7F7F7F', legendFontSize: 15 },
        { name: '36-55', population: users.filter(user => user.edad >= 36 && user.edad <= 55).length, color: 'rgba(0, 0, 255, 1)', legendFontColor: '#7F7F7F', legendFontSize: 15 },
        { name: '56-65', population: users.filter(user => user.edad >= 56 && user.edad <= 65).length, color: 'rgba(0, 255, 255, 1)', legendFontColor: '#7F7F7F', legendFontSize: 15 },
        { name: '66+', population: users.filter(user => user.edad >= 66).length, color: 'rgba(255, 0, 255, 1)', legendFontColor: '#7F7F7F', legendFontSize: 15 },
        ];

        const localData = provinciasDeEspana.map((provincia, index) => {
            const usersInProvincia = users.filter(user => user.idlocalidad === index+1);
            return {
                name: provinciasDeEspana[index],
                population: usersInProvincia.length,
            };
        }).filter(data => data.population > 0);

        setLocalData(localData);


        setAgeData(ageData);

        setGenderData(genderData);
    }, [users]);

    const [search, setSearch] = React.useState('');

    const filteredUsers = users.filter(user => {
    return user.nombre.toLowerCase().includes(search.toLowerCase());
    });

    const filteredReports = reports.filter(report => {
      return report.texto.toLowerCase().includes(search.toLowerCase());
      });

      const resolveReport = async (item, banear) => {
        const user = users.find(user => user.id === item.idusuario);
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/${item.id}/resolve`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authState.token}`,
            },
            body: JSON.stringify({ banUser : banear }),
          });
            const data = await response.json();
            console.log(data);
            if (data.error == null) {
                Toast.show({
                    type: 'success',
                    position: 'bottom',
                    text1: 'Reporte resuelto',
                    text2: `El reporte ha sido resuelto correctamente`,
                    visibilityTime: 2500,
                });
                setReports(reports.filter(report => report.id !== item.id));
                setRefreshReports(!refreshReports);
                if(banear){
                    user.baneado = true;
                    setRefresh(!refresh);
                }
            } else {
                Toast.show({
                    type: 'error',
                    position: 'bottom',
                    text1: 'Error',
                    text2: 'No se ha podido resolver el reporte',
                    visibilityTime: 2500,
                });
            }
      }

  const fetchUserData = async () => {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authState.token}`,
      },
    });
    const data = await response.json();
    console.log(data);
    setUsers(data);
  }

  const fetchReports = async () => {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/reports`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authState.token}`,
      },
      body: JSON.stringify({ showResolved: false}),
    });
    const data = await response.json();
    console.log(data);
    if (data.error != null) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error',
        text2: 'No se han podido cargar los reportes',
        visibilityTime: 2500,
        });
    } else setReports(data);
  }

  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
            <Text style={styles.title}>Número de usuarios: {users.length}</Text>
            { orientation=== 'portrait' && <View style={{ height: 220, width: 400 }}>
                 <PieChart
                    data={genderData}
                    width={400}
                    height={220}
                    chartConfig={{
                    backgroundColor: '#1cc910',
                    backgroundGradientFrom: '#eff3ff',
                    backgroundGradientTo: '#efefef',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalEstadisticasVisible}
                    onRequestClose={() => {
                        setModalEstadisticasVisible(!modalEstadisticasVisible);
                    }}
                >
                        <View style={[styles.centeredView]}>
                            <View style={styles.modalView}>
                            <ScrollView contentContainerStyle={styles.modalScrollView}>
                                <Text style={styles.modalText}>Usuarios según sexo</Text>
                                <PieChart
                                    data={genderData}
                                    width={350}
                                    height={250}
                                    chartConfig={{
                                    backgroundColor: '#1cc910',
                                    backgroundGradientFrom: '#eff3ff',
                                    backgroundGradientTo: '#efefef',
                                    decimalPlaces: 2,
                                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    style: {
                                        borderRadius: 16,
                                    },
                                    }}
                                    accessor="population"
                                    backgroundColor="transparent"
                                    paddingLeft="15"
                                    absolute
                                />
                                <Text style={styles.modalText}>Usuarios según edad</Text>
                                <BarChart
                                    data={{
                                        labels: ageData.map(d => d.name),
                                        datasets: [{
                                            data: ageData.map(d => d.population)
                                        }]
                                    }}
                                    width={360}
                                    height={300}
                                    chartConfig={{
                                        backgroundColor: 'white',
                                        backgroundGradientFrom: 'white',
                                        backgroundGradientTo: 'white',
                                        decimalPlaces: 2,
                                        color: () => `#F98F9F`,
                                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        style: {
                                            borderRadius: 16,
                                        },
                                    }}
                                    accessor="population"
                                    backgroundColor="transparent"
                                    paddingLeft="15"
                                    absolute
                                    showValuesOnTopOfBars
                                />
                                <Text style={styles.modalText}>Usuarios según localidad</Text>
                                <PieChart
                                    data={localData.map(d => ({
                                        name: d.name,
                                        population: d.population,
                                        color: getRandomColor(), // Genera un color aleatorio
                                        legendFontColor: '#7F7F7F',
                                        legendFontSize: 15,
                                    }))}
                                    width={350}
                                    height={250}
                                    chartConfig={{
                                        backgroundColor: 'white',
                                        backgroundGradientFrom: 'white',
                                        backgroundGradientTo: 'white',
                                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        style: {
                                            borderRadius: 16,
                                        },
                                    }}
                                    accessor="population"
                                    backgroundColor="transparent"
                                    paddingLeft="15"
                                    absolute
                                />
                                </ScrollView>

                                <TouchableOpacity
                                    style={{ ...styles.openButton, backgroundColor: "#F98F9F" }}
                                    onPress={() => {
                                        setModalEstadisticasVisible(!modalEstadisticasVisible);
                                    }}
                                >
                                    <Icon name="times" size={20} color="white" />
                                </TouchableOpacity>

                            </View>
                        </View>
                    </Modal>
                </View>}
                {orientation==='portrait'? (<View style={{flexDirection:'row', justifyContent: 'space-between', width: '100%', flex: 1, alignItems: 'center'}}>
                    <Icon name="refresh" size={20} color="black" 
                        onPress={() => { fetchUserData();fetchReports();}}
                    />
                    <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
                        onPress={() => setModalEstadisticasVisible(true)}
                    >
                        <Text style={{ padding: 5, color: 'black' }}>Ver más</Text>
                        <Icon name="chevron-right" size={10} color="black" style={{marginLeft: 5, padding: 5}} />
                    </TouchableOpacity>
                </View>):
                (
                    <Text style={{padding: 5, color: 'black', textAlign: 'center'}}>
                        Gire la pantalla para ver las estadísticas
                    </Text>
                )}
            </View>
        </View>
        <View style={styles.cardContainer}>
            <View style={styles.card}>
                <Text style={styles.title}>Usuarios</Text>
                <FlatList
                    data={users}
                    renderItem={({ item }) => (
                        <View style={{padding: 5}}>
                            <Text>{item.nombre}</Text>
                            <View style={{ borderBottomWidth: 1, borderBottomColor: 'black' }} />
                        </View>
                    )}
                    keyExtractor={item => item.id.toString()}
                />
                <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
                        onPress={() => setModalUsuariosVisible(true)}
                    >
                        <Text style={{ padding: 5, color: 'black' }}>Gestionar usuarios</Text>
                        <Icon name="chevron-right" size={10} color="black" style={{marginLeft: 5, padding: 5}} />
                    </TouchableOpacity>
            </View>
            <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalUsuariosVisible}
                    onRequestClose={() => {
                        setModalEstadisticasVisible(!modalUsuariosVisible);
                        setSearch('');
                    }}
                >
                        <View style={[styles.centeredView]}>
                            <View style={styles.modalView}>
                            <View
                                style={{
                                flexDirection: 'row',
                                padding: 10,
                                width: '95%',
                                backgroundColor: '#d9dbda',
                                borderRadius: 10,
                                alignItems: 'center',
                                marginBottom: 10
                                }}
                            >
                                
                                <Feather
                                    name="search"
                                    size={20}
                                    color="black"
                                    style={{ marginRight: 4, marginLeft: 1 }}
                                />
                                <TextInput
                                value={search}
                                onChangeText={(text) => setSearch(text)}
                                placeholder="Buscar usuario..."
                                style={{ fontSize: 15, width: '100%', padding: 0 }}
                                maxLength={50}
                                />
                            </View>
                            <FlatList
                            style={{alignSelf: 'stretch'}}
                                data={filteredUsers}
                                extraData={refresh}
                                renderItem={({ item }) => (
                                    <View style={{padding: 5, flexDirection: 'row', flex: 1}}>
                                        <View style={{padding: 10, borderColor: 'gray', flex: 1, borderWidth: 2, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                            <View style={{flexDirection: 'column', flex: 2}}>
                                                <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                                                    {item.nombre.length > 20 ? item.nombre.substring(0, 20) + '...' : item.nombre}
                                                </Text>
                                                <Text>{item.correo}</Text>
                                            </View>
                                            <View style={{flexDirection: 'column', padding: 5, flex: 2}}>
                                                <TouchableOpacity style={{borderColor: 'gray', padding: 5, borderRadius: 10, borderWidth: 2, marginLeft: 5, justifyContent: 'center', marginBottom: 5}}
                                                onPress={()=>{updateType(item, item.tipousuario === 'administrador'?'normal':'administrador')}}>
                                                    
                                                    {item.tipousuario === 'administrador' ? <Text style={{color: 'black'}}>Quitar admin</Text> : <Text style={{color: 'black'}}>Hacer admin</Text>}
                                                </TouchableOpacity>
                                                {item.tipousuario!=='administrador' && <TouchableOpacity style={{borderColor: 'gray', padding: 5, borderRadius: 10, borderWidth: 2, marginLeft: 5, justifyContent: 'center', marginBottom: 5}}
                                                onPress={()=>{updateType(item, item.tipousuario==='normal'?'premium':'normal')}}>
                                                    
                                                 {item.tipousuario==='normal' ? <Text style={{color: 'black'}}>Cambiar a premium</Text> : <Text style={{color: 'black'}}>Cambiar a normal</Text>}
                                                </TouchableOpacity>}
                                                {item.tipousuario!=='administrador' && <TouchableOpacity style={{borderColor: 'gray', padding: 5, borderRadius: 10, borderWidth: 2, marginLeft: 5, justifyContent: 'center', marginBottom: 5}}
                                                onPress={()=>{updateBan(item, item.baneado?'unban':'ban')}}>
                                                 {item.baneado ? <Text style={{color: 'black'}}>Desbanear</Text> : <Text style={{color: 'black'}}>Banear</Text>}
                                                </TouchableOpacity>}
                                            </View>
                                        </View>
                                    </View>
                                )}
                                keyExtractor={item => item.id.toString()}
                            />
                                <TouchableOpacity
                                    style={{ ...styles.openButton, backgroundColor: "#F98F9F" }}
                                    onPress={() => {
                                        setModalUsuariosVisible(!modalUsuariosVisible);
                                        setSearch('');
                                    }}
                                >
                                    <Icon name="times" size={20} color="white" />
                                </TouchableOpacity>

                            </View>
                        </View>
                    </Modal>
            <View style={styles.card}>
            <Text style={styles.title}>Reportes</Text>
                <FlatList
                    data={reports}
                    renderItem={({ item }) => (
                        <View style={{padding: 5}}>
                            <Text>Mensaje: {item.texto}</Text>
                            <Text>Motivo: {item.motivo?item.motivo:'Ninguno'}</Text>
                            <View style={{ borderBottomWidth: 1, borderBottomColor: 'black' }} />
                        </View>
                    )}
                    keyExtractor={item => item.id.toString()}
                />
                <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
                        onPress={() => setModalReportsVisible(true)}
                    >
                        <Text style={{ padding: 5, color: 'black' }}>Gestionar reportes</Text>
                        <Icon name="chevron-right" size={10} color="black" style={{marginLeft: 5, padding: 5}} />
                    </TouchableOpacity>
            </View>
            <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalReportsVisible}
                    onRequestClose={() => {
                        setModalReportsVisible(!modalReportsVisible);
                        setSearch('');
                    }}
                >
                        <View style={[styles.centeredView]}>
                            <View style={styles.modalView}>
                            <View
                                style={{
                                flexDirection: 'row',
                                padding: 10,
                                width: '95%',
                                backgroundColor: '#d9dbda',
                                borderRadius: 10,
                                alignItems: 'center'
                                }}
                            >
                                
                                <Feather
                                    name="search"
                                    size={20}
                                    color="black"
                                    style={{ marginRight: 4, marginLeft: 1 }}
                                />
                                <TextInput
                                value={search}
                                onChangeText={(text) => setSearch(text)}
                                placeholder="Buscar reporte..."
                                style={{ fontSize: 15, width: '100%', padding: 0 }}
                                maxLength={50}
                                />
                            </View>
                            <FlatList
                            style={{alignSelf: 'stretch'}}
                                data={filteredReports}
                                extraData={refreshReports}
                                renderItem={({ item }) => (
                                    <View style={{ padding: 5, flexDirection: 'row', flex: 1 }}>
                                   <View style={{ padding: 10, borderColor: 'gray', flex: 1, borderWidth: 2, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'column', flex: 2 }}>
                                        <View style={{ marginBottom: 5 }}>
                                            <Text style={{ fontWeight: 'bold', marginTop: 5 }}>Mensaje:</Text>
                                        </View>
                                        <Text style={{ marginBottom: 5 }}>{item.texto}</Text>
                                        <View style={{ marginBottom: 5 }}>
                                            <Text style={{ fontWeight: 'bold' }}>Motivo:</Text>
                                        </View>
                                        <Text>{item.motivo ? item.motivo : 'Ninguno'}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'column', padding: 5, flex: 2 }}>
                                        <TouchableOpacity style={{ borderColor: 'gray', padding: 5, borderRadius: 10, borderWidth: 2, marginLeft: 5, justifyContent: 'center', marginBottom: 5 }}
                                            onPress={() => { resolveReport(item, true) }}>
                                            <Text style={{ color: 'black' }}>Banear usuario</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ borderColor: 'gray', padding: 5, borderRadius: 10, borderWidth: 2, marginLeft: 5, justifyContent: 'center', marginBottom: 5 }}
                                            onPress={() => { resolveReport(item, false) }}>
                                            <Text style={{ color: 'black' }}>Quitar reporte</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                </View>
                                
                                )}
                                keyExtractor={item => item.id.toString()}
                            />
                                <TouchableOpacity
                                    style={{ ...styles.openButton, backgroundColor: "#F98F9F" }}
                                    onPress={() => {
                                        setModalReportsVisible(!modalReportsVisible);
                                        setSearch('');
                                    }}
                                >
                                    <Icon name="times" size={20} color="white" />
                                </TouchableOpacity>

                            </View>
                        </View>
                    </Modal>
        </View>
    </ScrollView>
  );
};

export default function AdminScreen({ navigation }) {
    return (
            <Admin navigation={navigation} />
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch'
  },
  card: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#F98F9F',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    
  },
  modalScrollView: {
    flexGrow: 1,
    justifyContent: 'center',
},
  modalView: {
    margin: 20,
    width: '90%',
    height: '80%',
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden'
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: 'bold',
    fontSize: 15
  }
});
