import { View, Image, TouchableOpacity, Text, ScrollView } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { firebaseAuth } from "../config/Firebase.config";
import { SET_USER_NULL } from "../context/actions/UserAction";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await firebaseAuth.signOut().then(() => {
      dispatch(SET_USER_NULL());
      navigation.replace("LoginScreen");
    });
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-start flex-col">
        {/* icons*/}
        <View className="w-full flex-row items-center justify-between px-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={30} color={"#555"} />
          </TouchableOpacity>

          <TouchableOpacity>
            <Entypo name="dots-three-vertical" size={23} color={"#555"} />
          </TouchableOpacity>
        </View>

        {/* profile */}
        <View className="items-center justify-center py-3 ">
          <View className="relative border-2 border-primary p-1 rounded-full">
            <Image
              source={{ uri: user?.profilePic }}
              className="w-24 h-24"
              resizeMode="contain"
            />
          </View>

          <Text className="text-xl font-semibold text-primaryBold pt-3">
            {user?.fullname}
          </Text>
          <Text className="text-base font-semibold text-primaryText">
            {user?.providerData.email}
          </Text>
        </View>

        {/* medias */}
        <View className="w-full px-6 space-y-5">
          <View className="w-full flex-row items-center justify-between">
            <Text className="text-base font-semibold text-primaryText">
              Media Shared
            </Text>
            <TouchableOpacity>
              <Text className="text-base font-semibold uppercase text-primaryText">
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <View className="w-full flex-row items-center justify-between">
            <TouchableOpacity className="w-24  h-24 m-1 rounded-xl bg-gray-300 overflow-hidden">
              <Image
                source={{
                  uri: "https://cdn.pixabay.com/photo/2023/06/29/10/33/lion-8096155_1280.png",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </TouchableOpacity>

            <TouchableOpacity className="w-24  h-24 m-1 rounded-xl bg-gray-300 overflow-hidden">
              <Image
                source={{
                  uri: "https://cdn.pixabay.com/photo/2023/07/02/18/49/cup-8102791_640.jpg",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </TouchableOpacity>

            <TouchableOpacity className="w-24  h-24 m-1 rounded-xl bg-gray-300 overflow-hidden">
              <Image
                source={{
                  uri: "https://cdn.pixabay.com/photo/2023/07/07/17/47/sushi-8113165_640.jpg",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <View className="absolute w-full h-full items-center justify-center bg-[#00000068]">
                <Text className="text-base text-white font-semibold">250+</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* settings  */}
        <View className="w-full px-6 py-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <MaterialIcons name="security" size={23} color={"#555"} />
            <Text className="text-base font-semibold text-primaryText px-3">
              Privacy
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={30} color={"#555"} />
        </View>

        <View className="w-full px-6 py-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <MaterialIcons name="message" size={23} color={"#555"} />
            <Text className="text-base font-semibold text-primaryText px-3">
              Groups
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={30} color={"#555"} />
        </View>

        <View className="w-full px-6 py-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <MaterialIcons name="music-note" size={23} color={"#555"} />
            <Text className="text-base font-semibold text-primaryText px-3">
              Medias & Downloads
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={30} color={"#555"} />
        </View>

        <View className="w-full px-6 py-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <MaterialIcons name="person" size={23} color={"#555"} />
            <Text className="text-base font-semibold text-primaryText px-3">
              Account
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={30} color={"#555"} />
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          className="w-full px-6 py-4 flex-row items-center justify-center"
        >
          <Text className="text-lg font-semibold text-primaryBold px-3">
            Logout
          </Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfileScreen;
