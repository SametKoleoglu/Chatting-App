import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { UserTextInput } from "../components";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth, firestoreDB } from "../config/Firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import SET_USER from "../context/actions/UserAction";

const LoginScreen = () => {
  const navigation = useNavigation();
  const screenWidth = Math.round(Dimensions.get("window").width);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [getEmailValidationStatus, setGetEmailValidationStatus] =
    useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (getEmailValidationStatus && email !== "") {
      await signInWithEmailAndPassword(firebaseAuth, email, password)
        .then((userCred) => {
          if (userCred) {
            getDoc(doc(firestoreDB, "users", userCred?.user.uid)).then(
              (docSnap) => {
                if (docSnap.exists()) {
                  console.log("Used Data : ", docSnap.data());
                  dispatch(SET_USER(docSnap.data()));
                }
              }
            );
          }
        })
        .catch((err) => {
          console.log("Error : ", err.message);
          if (err.message.includes("wrong-password")) {
            setAlertMessage("Password Mismatch");
          } else if (err.message.includes("user-not-found")) {
            setAlert(true);
            setAlertMessage("User not found !!!");
          } else {
            setAlert(true);
            setAlertMessage("Invalid Email adress");
          }
          setInterval(() => {
            setAlert(false);
          }, 2000);
        });
    }
    else{
      Alert.alert("Lütfen bilgilerinizi eksiksiz bir şekilde doldurunuz !!!")
    }
  };

  return (
    <View className="flex-1 items-center justify-start">
      <Image
        source={require("./../assets/images/world.jpg")}
        resizeMode="repeat"
        className="h-96"
        style={{ width: screenWidth }}
      />

      {/* main */}
      <View className="w-full h-full bg-white rounded-tl-[90px] -mt-44 flex items-center justify-start py-6 px-6 space-y-6">
        <Image
          source={require("./../assets/images/iconCht.webp")}
          className="h-14 w-14"
          resizeMode="contain"
        />
        <Text className="py-2 text-primary text-xl font-semibold">
          Welcome Back !!!
        </Text>

        <ScrollView>
          <View className="w-full h-full flex items-center justify-center">
            {/* alert */}

            {alert && (
              <Text className="text-base text-red-600">{alertMessage}</Text>
            )}

            {/* email */}
            <UserTextInput
              placeholder="Email"
              inPass={false}
              setStateValue={setEmail}
              setGetEmailValidationStatus={setGetEmailValidationStatus}
            />

            {/* password */}
            <UserTextInput
              placeholder={"Password"}
              isPass={true}
              setStateValue={setPassword}
            />

            {/* login button */}

            <TouchableOpacity
              onPress={handleLogin}
              className="w-full px-4 py-2 rounded-xl bg-blue-400 my-3 flex items-center justify-center"
            >
              <Text className="py-2 text-white text-xl font-semibold">
                Sign In
              </Text>
            </TouchableOpacity>

            <View className="w-full py-12 flex-row items-center justify-center space-x-2">
              <Text className="text-base text-primaryText">
                Don't have account ?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("SignUpScreen")}
              >
                <Text className="text-base font-semibold text-primaryBold">
                  Create here
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
