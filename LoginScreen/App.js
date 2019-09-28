import React, { Component } from 'react';
import { Text, Alert, Button, TextInput, View, StyleSheet, KeyboardAvoidingView } from 'react-native';




export default class App extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
        loginState: 1,
        email: '',
        nameFirst: '',
        nameLast: '',
        password: '',
        password2: '',
        reply:[],
        userToken: '',
        };
    }
    
 
    // Function called once backend replies from login
    doneLogin() {
        let response = this.state.reply;
        console.log(response);
        if (response.code != null) {
            if (response.code == 3003) {
                Alert.alert('Username or password was wrong, ya dingus');
                return;
            }
            Alert.alert('Login error');
            return;
        }
        
        
        // Code to enter actual app interface should go here
        this.state.loginState = 4;
        this.state.nameFirst = response.nameFirst;
        this.state.nameLast = response.nameLast;
        this.state.userToken = response['user-token'];
        this.forceUpdate();
    }
    
    
    // Function called once backend replies from registration
    doneRegister() {
        let response = this.state.reply;
        console.log(response);
        if (response.code != null) {
            if (response.code == 3033) {
                Alert.alert('Ya dingus! You already registered');
                return;
            }
            if (response.code == 3040) {
                Alert.alert('Please format email correctly');
                return;
            }
            Alert.alert('Registration Error');
            return;
        }
        
        this.state.loginState = 3;
        this.forceUpdate();
    }
    
    // Function called when login button pressed
    onLogin() {
        
        const { loginState, email, firstName, lastName, password, password2 } = this.state;
        
        if (email == '') {
            Alert.alert('Please enter email');
            return;
        }
        if (password == '') {
            Alert.alert('Please enter password');
            return;
        }
        
        
        fetch('https://api.backendless.com/C419EB67-D61C-013B-FF76-5EF8E90D6B00/E9273326-1DFD-8E37-FF7F-7EDDF2D19700/users/login', {
              method: 'POST',
              headers: {
              'Content-Type' : 'application/json'
              },
              body: JSON.stringify({
                   "login" : email,
                   "password" : password,
                   }),
              }).then((response) => response.json())
            .then((responseJson) => {
                  this.setState({
                  reply: responseJson,
                                });
                  this.doneLogin();
              });
    
    }
        
    
    // Function called when register button pressed
    onRegister() {
        const { loginState, email, nameFirst, nameLast, password, password2 } = this.state;
        
        if (password != password2) {
            Alert.alert('Passwords must match');
            return;
        }
        if (email == '') {
            Alert.alert('Please enter email');
            return;
        }
        if (password == '') {
            Alert.alert('Please enter password');
            return;
        }
        if (nameFirst == '') {
            Alert.alert('Please enter your first name');
            return;
        }
        if (nameLast == '') {
            Alert.alert('Please enter your last name');
            return;
        }
        
        fetch('https://api.backendless.com/C419EB67-D61C-013B-FF76-5EF8E90D6B00/E9273326-1DFD-8E37-FF7F-7EDDF2D19700/data/Users', {
              method: 'POST',
              headers: {
              'Content-Type' : 'application/json'
              },
              body: JSON.stringify({
                                   "email" : email,
                                   "password" : password,
                                   "nameFirst" : nameFirst,
                                   "nameLast" : nameLast,
                                   }),
              }).then((response) => response.json())
        .then((responseJson) => {
              this.setState({
                            reply: responseJson,
                            });
              this.doneRegister();
              });
        
    }
    
    // Function called when dont have account button pressed
    switchRegister() {
        this.state.password = '';
        this.state.password2 = '';
        this.state.email = '';
        this.state.nameFirst = '';
        this.state.nameLast = '';
        this.state.loginState = 2;
        this.forceUpdate();
    }
    
    // Function called when already have account button pressed
    switchLogin() {
        this.state.loginState = 1;
        this.forceUpdate();
    }
    
    // Function called when logout button pressed
    logOut() {
        this.setState({
        loginState: 1,
        email: '',
        nameFirst: '',
        nameLast: '',
        password: '',
        password2: '',
        reply:[],
        userToken: '',
        });
        this.forceUpdate();
    }
    
    
    // Render function for screen
    render() {
        switch (this.state.loginState) {
            case 1:     // Login Screen
                return (
                    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                    <TextInput
                    value={this.state.email}
                    onChangeText={(email) => this.setState({ email })}
                    placeholder={'Email'}
                    style={styles.input}
                    />
                    <TextInput
                    value={this.state.password}
                    onChangeText={(password) => this.setState({ password })}
                    placeholder={'Password'}
                    secureTextEntry={true}
                    style={styles.input}
                    />
                    <Button
                    title={'Login'}
                    style={styles.input}
                    onPress={this.onLogin.bind(this)}
                    />
                    <Button
                    title={'I don\'t have an account'}
                    style={styles.input}
                    onPress={this.switchRegister.bind(this)}
                    />
                    </KeyboardAvoidingView>
                    );
                break;
            case 2:     // Register Screen
                return (
                    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                    <TextInput
                    value={this.state.nameFirst}
                    onChangeText={(nameFirst) => this.setState({ nameFirst })}
                    placeholder={'First Name'}
                    style={styles.input}
                    />
                    <TextInput
                    value={this.state.nameLast}
                    onChangeText={(nameLast) => this.setState({ nameLast })}
                    placeholder={'Last Name'}
                    style={styles.input}
                    />
                    <TextInput
                    value={this.state.email}
                    onChangeText={(email) => this.setState({ email })}
                    placeholder={'Email'}
                    style={styles.input}
                    />
                    <TextInput
                    value={this.state.password}
                    onChangeText={(password) => this.setState({ password })}
                    placeholder={'Password'}
                    secureTextEntry={true}
                    style={styles.input}
                    />
                    <TextInput
                    value={this.state.password2}
                    onChangeText={(password2) => this.setState({ password2 })}
                    placeholder={'Confirm Password'}
                    secureTextEntry={true}
                    style={styles.input}
                    />
                    <Button
                    title={'Create Account'}
                    style={styles.input}
                    onPress={this.onRegister.bind(this)}
                    />
                    <Button
                    title={'I already have an account'}
                    style={styles.input}
                    onPress={this.switchLogin.bind(this)}
                    />
                    </KeyboardAvoidingView>
                    );
                break;
            case 3:     // Check email screen
                return(
                    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                    <Text>Follow the link sent to your email</Text>
                    <Text>Press continue when done</Text>
                    <Button
                    title={'Continue'}
                    style={styles.input}
                    onPress={this.switchLogin.bind(this)}
                    />
                    </KeyboardAvoidingView>
                   );
                break;
            case 4:     // Logged in screen
                return(
                    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                    <Text>Logged in as {this.state.nameFirst} {this.state.nameLast}</Text>
                       <Text>{this.state.userToken}</Text>
                   <Button
                   title={'Log Out'}
                   style={styles.input}
                   onPress={this.logOut.bind(this)}
                   />
                    </KeyboardAvoidingView>
                );
                break;
        }
    }
}


// Styles
const styles = StyleSheet.create({
     container: {
     flex: 1,
     alignItems: 'center',
     justifyContent: 'center',
     backgroundColor: '#ecf0f1',
     },
     input: {
     width: 200,
     height: 44,
     padding: 10,
     borderWidth: 1,
     borderColor: 'black',
     marginBottom: 10,
     },
     });
