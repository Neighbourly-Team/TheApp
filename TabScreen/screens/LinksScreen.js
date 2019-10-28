import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, Alert, Button, TextInput, View, KeyboardAvoidingView  } from 'react-native';
import { ExpoLinksView } from '@expo/samples';


//export default function LinksScreen() {
//  return (
//    <ScrollView style={styles.container}>
//      {/**
//       * Go ahead and delete ExpoLinksView and replace it with your content;
//       * we just wanted to provide you with some helpful links.
//       */}
//      <ExpoLinksView />
//    </ScrollView>
//  );
//}
//
//LinksScreen.navigationOptions = {
//  title: 'Links',
//};

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
            
        badEmail: false,
        badEmailEdu: false,
        badFirstName: false,
        badLastName: false,
        badPassword: false,
        badPasswordMatch: false,
        };
    }
    
    
    validData() {
        return !(this.state.badEmail || this.state.badEmailEdu || this.state.badFirstName || this.state.badLastName || this.state.badPassword || this.state.badPasswordMatch);
    }
    
    
    validateEmail() {
        var bad = false;
        if (this.state.email == '') {
            bad = true;
        }
        
        if (bad) {
            this.state.badEmail = true;
        }
        else {
            this.state.badEmail = false;
        }
        this.forceUpdate();
        
        if (bad)
            return false;
        return true;
    }
    
    validateFirstName() {
        var bad = false;
        if (this.state.nameFirst == '') {
            bad = true;
        }
        
        if (bad) {
            this.state.badFirstName = true;
        }
        else {
            this.state.badFirstName = false;
        }
        this.forceUpdate();
        
        if (bad)
            return false;
        return true;
    }
    
    validateLastName() {
        var bad = false;
        if (this.state.nameLast == '') {
            bad = true;
        }
        
        if (bad) {
            this.state.badLastName = true;
        }
        else {
            this.state.badLastName = false;
        }
        this.forceUpdate();
        
        if (bad)
            return false;
        return true;
    }
    
    validatePassword() {
        var bad = false;
        var misMatch = false;
        if (this.state.password == '' || this.state.password.length < 8) {
            bad = true;
        }
        if ((this.state.password != this.state.password2) && this.state.loginState == 2)
            misMatch = true;
        
        if (bad) {
            this.state.badPassword = true;
        }
        else {
            this.state.badPassword = false;
        }
        if (misMatch) {
            this.state.badPasswordMatch = true;
        }
        else {
            this.state.badPasswordMatch = false;
        }
        this.forceUpdate();
        
        if (bad || misMatch)
            return false;
        return true;
    }
    
    
    resetInvalids() {
        this.state.badEmail = false;
        this.state.badEmailEdu = false;
        this.state.badFirstName = false;
        this.state.badLastName = false;
        this.state.badPassword = false;
        this.state.badPasswordMatch = false;
    }
    
    
    // Function called once backend replies from login
    doneLogin() {
        let response = this.state.reply;
        console.log(response);
        
        var failed = false;
        if (response.code != null) {
            if (response.code == 3003) {
                //Alert.alert('Username or password was wrong, ya dingus');
                this.state.badPasswordMatch = true;
                this.forceUpdate();
                failed = true;
            }
            else {
                Alert.alert('Login error');
            }
            failed = true;
        }
        if (failed)
            return;
        
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
        
        var failed = true;
        
        this.resetInvalids();
        
        if (this.validateEmail() && this.validatePassword()) {
            failed = false;
        }
        this.validatePassword();
        if (failed)
            return;
        
        
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
        
        this.resetInvalids();
        
        var failed = false;
        
        this.validateFirstName();
        this.validateLastName();
        this.validatePassword();
        this.validateEmail();
        
        if (!this.validData())
            failed = true;
        
        if (failed)
            return;
        
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
        this.resetInvalids();
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
        this.resetInvalids();
        this.state.loginState = 1;
        this.forceUpdate();
    }
    
    // Function called when logout button pressed
    logOut() {
        this.resetInvalids();
        this.state.email = '',
        this.state.nameFirst = '',
        this.state.nameLast = '',
        this.state.password = '',
        this.state.password2 = '',
        this.state.userToken = '',
        this.state.loginState = 1,
        this.forceUpdate();
    }
    
    
    // Render function for screen
    render() {
        switch (this.state.loginState) {
            case 1:     // Login Screen
                return (
                        <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                        <View>
                        <TextInput
                        value={this.state.email}
                        onChangeText={(email) => this.setState({ email })}
                        onBlur = {() => this.validateEmail()}
                        placeholder={'Email'}
                        style={styles.input}
                        />
                        {this.state.badEmail ? <Text style={styles.errorMsg}>Invalid email</Text> : null}
                        </View>
                        <View>
                        <TextInput
                        value={this.state.password}
                        onChangeText={(password) => this.setState({ password })}
                        onBlur = {() => this.validatePassword()}
                        placeholder={'Password'}
                        secureTextEntry={true}
                        style={styles.input}
                        />
                        {this.state.badPassword ? <Text style={styles.errorMsg}>Password cannot be blank</Text> : null}
                        {this.state.badPasswordMatch ? <Text style={styles.errorMsg}>Username and password do not match </Text> : null}
                        </View>
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
                        <View>
                        <TextInput
                        value={this.state.nameFirst}
                        onChangeText={(nameFirst) => this.setState({ nameFirst })}
                        onBlur = {() => this.validateFirstName()}
                        placeholder={'First Name'}
                        style={styles.input}
                        />
                        {this.state.badFirstName ? <Text style={styles.errorMsg}>First name cannot be blank</Text> : null}
                        </View>
                        <View>
                        <TextInput
                        value={this.state.nameLast}
                        onChangeText={(nameLast) => this.setState({ nameLast })}
                        onBlur = {() => this.validateLastName()}
                        placeholder={'Last Name'}
                        style={styles.input}
                        />
                        {this.state.badLastName ? <Text style={styles.errorMsg}>Last name cannot be blank</Text> : null}
                        </View>
                        <View>
                        <TextInput
                        value={this.state.email}
                        onChangeText={(email) => this.setState({ email })}
                        onBlur = {() => this.validateEmail()}
                        placeholder={'Email'}
                        style={styles.input}
                        />
                        {this.state.badEmail ? <Text style={styles.errorMsg}>Invalid email </Text> : null}
                        {this.state.badEmailEdu ? <Text style={styles.errorMsg}>Must use .edu email</Text> : null}
                        </View>
                        <View>
                        <TextInput
                        value={this.state.password}
                        onChangeText={(password) => this.setState({ password })}
                        onBlur = {() => this.validatePassword()}
                        placeholder={'Password'}
                        secureTextEntry={true}
                        style={styles.input}
                        />
                        {this.state.badPassword ? <Text style={styles.errorMsg}>Password must be 8 characters</Text> : null}
                        </View>
                        <View>
                        <TextInput
                        value={this.state.password2}
                        onChangeText={(password2) => this.setState({ password2 })}
                        onBlur = {() => this.validatePassword()}
                        placeholder={'Confirm Password'}
                        secureTextEntry={true}
                        style={styles.input}
                        />
                        {this.state.badPasswordMatch ? <Text style={styles.errorMsg}>Passwords do not match</Text> : null}
                        </View>
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
                                 borderRadius: 5,
                                 borderColor: 'black',
                                 marginBottom: 10,
                                 },
                                 errorMsg: {
                                 color: 'red',
                                 width: 200,
                                 padding: 2,
                                 borderWidth: 0,
                                 marginBottom: 10,
                                 }
                                 });
