import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import logo from '../assets/logo.png';
import login from '../../shared/index';
import * as SecureStore from 'expo-secure-store';

const LoginView = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        try {
            const token = await login.login(username, password);
            if (token) {
                Alert.alert('Login Successful', 'You have successfully logged in!');
                SecureStore.setItemAsync('token', token);
            }
        } catch (error) {
            Alert.alert('Login Failed', error.message);
            console.error('Error logging in:', error);
        }
    };

    const getToken = async () => SecureStore.getItemAsync('token');

    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                keyboardType="default"
                autoCapitalize="none"
                autoCorrect={false}
                value={username}
                onChangeText={setUsername}
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    style={{ flex: 1 }}
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                >
                    <Ionicons
                        name={showPassword ? 'eye' : 'eye-off'}
                        size={24}
                        color="gray"
                    />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 40,
        color: '#AE9A64',
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        marginVertical: 10,
    },
    passwordContainer: {
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        marginVertical: 10,
    },
    eyeIcon: {
        padding: 10,
    },
    loginButton: {
        backgroundColor: '#AE9A64',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
    },
    loginButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default LoginView;
