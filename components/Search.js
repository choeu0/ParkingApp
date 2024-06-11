import React, { useState,useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, TouchableWithoutFeedback, Image, ImageBackground } from 'react-native';
import { getDatabase, ref, onValue } from '../firebaseConfig';

const fetchParkingData = async (path) => {
  const db = getDatabase();
  const snapshot = await ref(db, path).get();
  return snapshot.val();
};

const useFirebaseRealtime = (path) => {
  const [value, setValue] = useState(false);
  useEffect(() => {
    const db = getDatabase();
    const reference = ref(db, path);
    const unsubscribe = onValue(reference, (snapshot) => {
      setValue(snapshot.val());
    });
    return () => unsubscribe();
  }, [path]);

  return value;
};

export default function Search() {
  const reg1 = useFirebaseRealtime('parking_spot_info/A1');
  const reg2 = useFirebaseRealtime('parking_spot_info/A2');
  const reg3 = useFirebaseRealtime('parking_spot_info/A3');
  const reg4 = useFirebaseRealtime('parking_spot_info/A4');

  const [inputText, setInputText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handleTextChange = (text) => {
    setInputText(text);
  };

  const handleSearch = () => {
    if (inputText === reg1) {
      setModalContent('A1 구역에 주차되어 있습니다.');
    } else if (inputText === reg2) {
      setModalContent('A2 구역에 주차되어 있습니다.');
    } else if (inputText === reg3) {
      setModalContent('A3 구역에 주차되어 있습니다.');
    } else if (inputText === reg4) {
      setModalContent('A4 구역에 주차되어 있습니다.');
    } else {
      setModalContent('주차되어 있지 않습니다.');
    }

    setModalVisible(true); // 모달 열기
  };

  const closeModal = () => {
    setModalVisible(false); // 모달 닫기
  };

  return (
    <View style={[styles.container, { backgroundColor: 'white' }]}>
      <Text style={styles.title}>내  
      <Text style={styles.vehicleText}> 차량 </Text> 
      위치 찾기
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={handleTextChange}
        value={inputText}
        placeholder="차량 번호 입력"
        placeholderTextColor="lightblue"
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>찾기</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContent}>

          {/* 모달 내용 */}
          <View style={styles.topBoxesContainer}>
              <View style={[styles.box, styles.lightGrayBackground]}>
              {inputText === reg1 && <Image source={require('../assets/ping.png')} style={styles.image} />}
                <Text style={styles.txt}>A1</Text>
              </View>
              <View style={[styles.box, styles.lightGrayBackground]}>
              {inputText === reg2 && <Image source={require('../assets/ping.png')} style={styles.image} />}
              <Text style={styles.txt}>A2</Text>
              </View>
            </View>
            <View style={styles.topBoxesContainer}>
              <View style={[styles.box, styles.lightGrayBackground]}>
              {inputText === reg3 && <Image source={require('../assets/ping.png')} style={styles.image} />}
              <Text style={styles.txt}>A3</Text>
              </View>
              <View style={[styles.box, styles.lightGrayBackground]}>
              {inputText === reg4 && <Image source={require('../assets/ping.png')} style={styles.image} />}
              <Text style={styles.txt}>A4</Text>
              </View>
            </View>
          <Text style={styles.modalText}>{modalContent}</Text>
          {/* 닫기 버튼 */}
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
          <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
        </Modal>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 45,
    fontWeight: 'bold',
    marginBottom: 100,
    color: 'lightblue',
    fontFamily: 'BlackHanSans_400Regular'
  },
  input: {
    height: 50,
    width: 250,
    borderColor: 'lightblue',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: 'black',
    
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'BlackHanSans_400Regular'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 투명한 배경색
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center', // 상하좌우 정중앙 정렬
    width: 250 * 1.2, // 현재 가로 크기에 1.5배
    height: 250 * 1.5, // 현재 세로 크기에 3배
    position: 'absolute',
    top: '50%', // 상단에서 절반 위치
    left: '50%', // 좌측에서 절반 위치
    transform: [{ translateX: -125 * 1.2 }, { translateY: -125 * 1.5 }],
    borderColor :'lightblue',
    borderWidth: 2
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
    color: 'black',
    fontFamily: 'BlackHanSans_400Regular'
  },
  closeButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    position: 'absolute', // 절대 위치 설정
    bottom: 20, // 맨 하단에서 20 포인트 위
    left: '97%', // 좌측에서 절반 위치
    transform: [{ translateX: -125 }], 
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'BlackHanSans_400Regular'
  },
  topBoxesContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  box: {
    width: 100,
    height: 100,
    marginHorizontal: 5,
    borderColor: 'lightblue',
    borderWidth: 2
  },
  lightGrayBackground: {
    backgroundColor: 'gray',
  },
  txt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign:'center',
    marginTop: 70,
    fontFamily: 'BlackHanSans_400Regular'
  },
  image: {
    width: 90,
    height: 90,
    marginBottom: -60,
    marginTop: -30,
    left: 3
  },
  vehicleText: {
    fontSize: 55, // 차량 문자만 크게 만들기 위한 폰트 크기
  }

});
