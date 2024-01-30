import {
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { UserTextInput } from "../components";
import { avatars } from "../utils/Supports";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firestoreDB, firebaseAuth } from "../config/Firebase.config";
import { doc,setDoc } from "firebase/firestore";

const SignUpScreen = () => {
  const navigation = useNavigation();

  const screenWidth = Math.round(Dimensions.get("window").width);
  const screenHeight = Math.round(Dimensions.get("window").height);

  //States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [avatar, setAvatar] = useState(avatars[0]?.image.asset.url);
  const [isAvatarMenu, setIsAvatarMenu] = useState(false);
  const [getEmailValidationStatus, setGetEmailValidationStatus] =
    useState(false);

  //Functions
  const handleAvatar = (avatar) => {
    setAvatar(avatar?.image.asset.url);
    setIsAvatarMenu(false);
  };

  const handleSignUp = async () => {
    if (getEmailValidationStatus && email !== "") {
      await createUserWithEmailAndPassword(firebaseAuth, email, password).then(
        (userCred) => {
          const data = {
            _id: userCred?.user.uid,
            fullName: fullname,
            profilePic: avatar,
            providerData: userCred.user.providerData[0],
          };

          setDoc(doc(firestoreDB, 'users', userCred?.user.uid), data).then(
            () => {
              navigation.navigate("LoginScreen");
            }
          );
        }
      );
    }
  };

  return (
    <View className="flex-1 bg-white items-center justify-start">
      <ScrollView>
        <Image
          source={require("./../assets/images/world.jpg")}
          resizeMode="repeat"
          className="h-96"
          style={{ width: screenWidth }}
        />

        {isAvatarMenu && (
          <>
            {/* avatars list */}
            <View
              className="absolute inset-0 z-10"
              style={{ width: screenWidth, height: screenHeight }}
            >
              <ScrollView>
                <BlurView
                  className="w-full h-full px-4 py-16 flex-row flex-wrap items-center justify-evenly"
                  tint="light"
                  intensity={40}
                  style={{ width: screenWidth, height: screenHeight }}
                >
                  {avatars?.map((avatar) => (
                    <ScrollView style={{ marginLeft: "2%" }}>
                      <TouchableOpacity
                        onPress={() => handleAvatar(avatar)}
                        key={avatar._id}
                        className="w-20 m-2 h-20 rounded-full border-2 border-primary relative"
                      >
                        <Image
                          source={{ uri: avatar?.image.asset.url }}
                          className="w-full h-full"
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </ScrollView>
                  ))}
                </BlurView>
              </ScrollView>
            </View>
          </>
        )}

        {/* main */}
        <View className="w-full h-full bg-white rounded-tl-[90px] -mt-44 flex items-center justify-start py-6 px-6 space-y-2">
          <Image
            source={require("./../assets/images/iconCht.webp")}
            className="h-12 w-12"
            resizeMode="contain"
          />
          <Text className="py-2 text-primary text-xl font-semibold">
            Join with us!
          </Text>

          {/* avatar section */}
          <View className="w-full flex items-center justify-center relative -my-2">
            <TouchableOpacity
              onPress={() => setIsAvatarMenu(true)}
              className="w-20 h-20 p-1 rounded-full border-2 border-primary  relative"
            >
              <Image
                source={{ uri: avatar }}
                className="w-full h-full"
                resizeMode="contain"
              />
              <View className="w-6 h-6 bg-primary rounded-full absolute top-0 right-0 flex items-center justify-center">
                <MaterialIcons name="edit" size={20} color={"#FFF"} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Info Box */}
          <View className="w-full flex items-center justify-center">
            {/* fullname */}
            <UserTextInput
              placeholder="Full Name"
              inPass={false}
              
              setStateValue={setFullname}
            />

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
              onPress={handleSignUp}
              className="w-full px-4 py-2 rounded-xl bg-blue-400 my-3 flex items-center justify-center"
            >
              <Text className="py-2 text-white text-xl font-semibold">
                Sign Up
              </Text>
            </TouchableOpacity>

            <View className="w-full flex-row items-center justify-center space-x-2">
              <Text className="text-base text-primaryText">
                Have an account !
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("LoginScreen")}
              >
                <Text className="text-base font-semibold text-primaryBold">
                  Login Here
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUpScreen;
