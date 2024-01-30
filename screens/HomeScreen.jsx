import {
  TouchableOpacity,
  Image,
  View,
  ScrollView,
  Text,
  ActivityIndicator,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestoreDB } from "../config/Firebase.config";
import { StatusBar } from "expo-status-bar";

const HomeScreen = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState(null);

  useLayoutEffect(() => {
    const chatQuery = query(
      collection(firestoreDB, "chats"),
      orderBy("_id", "desc")
    );

    const unSubscribe = onSnapshot(chatQuery, (querySnapShot) => {
      const chatRooms = querySnapShot.docs.map((doc) => doc.data());
      setChats(chatRooms);
      setIsLoading(false);
    });

    // return the unSubscribe func to stop listening to the updates
    return unSubscribe;
  }, []);

  return (
    <View className="flex-1">
      <StatusBar style="auto" />
      <SafeAreaView className="flex-1">
        <View className="w-full flex-row items-center justify-between px-4 py-2">
          <Image
            source={require("../assets/images/iconCht.webp")}
            className="w-12 h-12"
            resizeMode="contain"
          />

          <TouchableOpacity
            onPress={() => navigation.navigate("ProfileScreen")}
            className="w-10 h-10 rounded-full border border-primary flex items-center justify-center"
          >
            <Image
              source={{ uri: user?.profilePic }}
              className="w-12 h-12"
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        <ScrollView className="w-full px-4 pt-4">
          <View className="w-full">
            {/* message & title */}
            <View className="w-full flex-row items-center justify-between px-2">
              <Text className="text-primaryText text-base font-extrabold pb-4">
                Messages
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate("NewChatScreen")}
              >
                <Ionicons name="chatbox" size={30} color={"steelblue"} />
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <>
                <View className="w-full flex items-center justify-center">
                  <ActivityIndicator size={"large"} color={"steelblue"} />
                </View>
              </>
            ) : (
              <>
                {chats && chats?.length > 0 ? (
                  <>
                    {chats?.map((room) => (
                      <MessageCard key={room._id} room={room} />
                    ))}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const MessageCard = ({ room }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("ChatScreen", { room: room });
      }}
      className="w-full flex-row items-center justify-start py-2"
    >
      {/* images */}
      <View className="w-16 h-16 rounded-full flex items-center border-2 border-primary p-1 justify-center">
        <FontAwesome5 name="users" size={23} color={"steelblue"} />
      </View>

      {/* content */}
      <View className="flex-1 flex items-start justify-center ml-4">
        <Text className="text-[#333] text-base font-semibold capitalize">
          {room.chatName}
        </Text>
        <Text className="text-primaryText text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </Text>
      </View>

      {/* time text */}
      <Text className="text-primary px-4 text-base font-semibold">
        23 Min..
      </Text>
    </TouchableOpacity>
  );
};

export default HomeScreen;
