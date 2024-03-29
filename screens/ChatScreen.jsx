import {
  View,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Image,
} from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import {
  Entypo,
  FontAwesome5,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { firestoreDB } from "../config/Firebase.config";
import { useSelector } from "react-redux";

const ChatScreen = ({ route }) => {
  const navigation = useNavigation();
  const { room } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(null);
  const user = useSelector((state) => state.user.user);

  const textInputRef = useRef(null);

  // functions
  const handleKeyboardOpen = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const sendMessage = async () => {
    const timeStamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      roomId: room._id,
      timeStamp: timeStamp,
      message: message,
      user: user,
    };
    setMessage("");
    await addDoc(
      collection(doc(firestoreDB, "chats", room._id), "messages"),
      _doc
    )
      .then(() => {})
      .catch((error) => alert(error));
  };

  useLayoutEffect(() => {
    const msgQuery = query(
      collection(firestoreDB, "chats", room?._id, "messages"),
      orderBy("timeStamp", "asc")
    );

    const unSubscribe = onSnapshot(msgQuery, (querySnap) => {
      const upMsg = querySnap.docs.map((doc) => doc.data());
      setMessages(upMsg);
      setIsLoading(false);
    });

    return unSubscribe;
  }, []);

  return (
    <View className="flex-1">
      <View className="w-full bg-blue-400 px-4 py-6 flex-[0.2]">
        <View className="flex-row items-center justify-between w-full px-4 py-12">
          {/* back */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={35} color={"#fbfbfb"} />
          </TouchableOpacity>

          {/* middle */}

          <View className="flex-row items-center justify-center space-x-2 mx-3">
            <View className="w-12 h-12 rounded-full border border-white flex items-center justify-center">
              <FontAwesome5 name="users" size={23} color={"#fbfbfb"} />
            </View>
            <View>
              <Text className="text-gray-50 text-base font-semibold capitalize">
                {room.chatName.length > 15
                  ? `${room.chatName.slice(0, 15)}..`
                  : room.chatName}
              </Text>
              <Text className="text-gray-100 text-sm font-semibold capitalize">
                Online
              </Text>
            </View>
          </View>

          {/* last section */}
          <View className="flex-row items-center justify-center space-x-4">
            {/* icon -> video */}
            <TouchableOpacity>
              <FontAwesome5 name="video" size={20} color={"#fbfbfb"} />
            </TouchableOpacity>

            {/* icon -> phone */}
            <TouchableOpacity>
              <FontAwesome5 name="phone" size={20} color={"#fbfbfb"} />
            </TouchableOpacity>

            {/* icon dots */}
            <TouchableOpacity>
              <Entypo name="dots-three-vertical" size={20} color={"#fbfbfb"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* bottom section */}
      <View className="w-full bg-white px-4 py-6 rounded-3xl flex-1 rounded-t-[50px] -mt-10">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={150}
        >
          <>
            <ScrollView>
              {isLoading ? (
                <>
                  <View className="w-full flex items-center justify-center">
                    <ActivityIndicator size={"large"} color={"steelblue"} />
                  </View>
                </>
              ) : (
                <>
                  {/* messages */}
                  {messages?.map((msg, i) =>
                    msg.user.providerData.email === user.providerData.email ? (
                      <View className="m-1" key={i}>
                        <View
                          style={{ alignSelf: "flex-end" }}
                          className="px-4 py-2 rounded-tl-2xl rounded-bl-2xl bg-primary w-auto relative"
                        >
                          <Text className="text-base font-semibold text-blue-400">
                            {msg.message}
                          </Text>
                        </View>
                        <View style={{ alignSelf: "flex-end" }}>
                          {msg?.timeStamp?.seconds && (
                            <Text className="text-[12px] text-black font-semibold">
                              {new Date(
                                parseInt(msg?.timeStamp?.seconds) * 1000
                              ).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              })}
                            </Text>
                          )}
                        </View>
                      </View>
                    ) : (
                      <View
                        style={{ alignSelf: "flex-start" }}
                        className="flex items-center justify-start space-x-2"
                        key={i}
                      >
                        {/* Image */}
                        <Image
                          className="w-12 h-12 rounded-full"
                          resizeMode="cover"
                          source={{ uri: msg?.user?.profilePic }}
                        />

                        {/* text */}
                        <View className="m-1">
                          <View className="px-4 py-2 rounded-tl-2xl rounded-bl-2xl bg-gray-200y w-auto relative">
                            <Text className="text-base font-semibold text-black">
                              {msg.message}
                            </Text>
                          </View>
                          <View style={{ alignSelf: "flex-start" }}>
                            {msg?.timeStamp?.seconds && (
                              <Text className="text-[12px] text-black font-semibold">
                                {new Date(
                                  parseInt(msg?.timeStamp?.seconds) * 1000
                                ).toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: true,
                                })}
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>
                    )
                  )}
                </>
              )}
            </ScrollView>

            <View className="w-full flex-row items-center justify-center px-8">
              <View className="bg-gray-200 rounded-2xl px-4 space-x-4 py-2 flex-row items-center">
                <TouchableOpacity onPress={handleKeyboardOpen}>
                  <Entypo name="emoji-happy" size={23} color={"#555"} />
                </TouchableOpacity>

                <TextInput
                  className="flex-1 h-8 text-base text-primaryText font-semibold"
                  placeholder="Type here..."
                  placeholderTextColor={"#999"}
                  value={message}
                  onChangeText={(text) => setMessage(text)}
                />

                <TouchableOpacity>
                  <Entypo name="mic" size={23} color={"#43c651"} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={sendMessage} className="pl-4">
                <FontAwesome name="send" size={23} color={"#555"} />
              </TouchableOpacity>
            </View>
          </>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default ChatScreen;
