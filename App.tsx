/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
	Alert,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	useColorScheme,
	View,
} from 'react-native';

import {
	Colors,
	DebugInstructions,
	Header,
	LearnMoreLinks,
	ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { decryptRSA, encryptRSA, generateRSAKeys } from './NewRSA/NewRSA';

type SectionProps = PropsWithChildren<{
	title: string;
}>;

function App(): React.JSX.Element {
	const isDarkMode = useColorScheme() === 'dark';

	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
	};

	const [plainText, setPlainText] = useState('');
	const [publicKey, setPublicKey] = useState('');
	const [privateKey, setPrivateKey] = useState('');
	const [encryptText, setEncryptText] = useState('');
	const [decryptText, setDecryptText] = useState('');

	return (
		<ScrollView style={styles.container}>
			<View style={styles.subContainer}>
			<View>
				<Text style={{fontSize: 18, color: 'black'}}>Nhập chuỗi cần mã hoá:</Text>
				<TextInput style={{borderWidth: 1, color: 'black', padding: 3, borderRadius: 5,}} value={plainText} onChangeText={(text) => {
					setPlainText(text)
				}}></TextInput>
			</View>
			<TouchableOpacity style={styles.button} onPress={() => {
				if (plainText === '') {
					Alert.alert('Vui lòng nhập chuỗi cần mã hoá')
					return;
				}
				const { publicKey, privateKey } = generateRSAKeys();
				setPublicKey(publicKey);
				setPrivateKey(privateKey);
				setEncryptText(encryptRSA(plainText, publicKey));
			}}>
				<Text style={{color: 'white'}}>Tạo khoá và mã hoá</Text>
			</TouchableOpacity>
			<View>
				<Text style={styles.text}>Public key:</Text>
				<Text style={styles.text2}>{publicKey}</Text>
			</View>
			<View>
				<Text style={styles.text}>Private key:</Text>
				<Text style={styles.text2}>{privateKey}</Text>
			</View>
			<View>
				<Text style={styles.text}>Văn bản mã hoá:</Text>
				<Text style={styles.text2}>{encryptText}</Text>
			</View>
			</View>
			<View style={styles.subContainer}>
			<View>
				<Text style={styles.text}>Từ văn bản đã mã hoá và private key</Text>
				<TouchableOpacity style={styles.button} onPress={() => {
					setDecryptText(decryptRSA(encryptText, privateKey));
				}}>
					<Text style={{color: 'white'}}>Giải mã</Text>
				</TouchableOpacity>
			</View>
			<View>
				<Text style={styles.text}>Văn bản được giải mã:</Text>
				<TextInput style={{borderWidth: 1, color: 'black', padding: 3, borderRadius: 5,}} value={decryptText}></TextInput>
			</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		margin: 10,
	},

	subContainer: {
		marginVertical: 10,
	},

	button: {
		borderRadius: 10,
		backgroundColor: 'red',
		width: 150,
		height: 50,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		marginVertical: 10,
	},

	text: {
		color: 'black',
		fontSize: 18,
	},

	text2: {
		color: 'red',
		fontSize: 18,
	}
});

export default App;
