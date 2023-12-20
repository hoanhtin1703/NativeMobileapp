import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Button,
  Alert,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import UserProfileCard from "../../components/UserProfileCard/UserProfileCard";
import { Ionicons } from "@expo/vector-icons";
import OptionList from "../../components/OptionList/OptionList";
import { colors } from "../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../../components/CustomButton";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreaters from "../../states/actionCreaters/actionCreaters";
import { bindActionCreators } from "redux";
const UserProfileScreen = ({ navigation, route }) => {
  const [userInfo, setUserInfo] = useState({});
  const { user } = route.params;
  const dispatch = useDispatch();
  const { emptyCart } = bindActionCreators(actionCreaters, dispatch);
  const convertToJSON = (obj) => {
    try {
      setUserInfo(JSON.parse(obj));
    } catch (e) {
      setUserInfo(obj);
    }
  };

  // covert  the user to Json object on initial render
  useEffect(() => {
    convertToJSON(user);
  }, []);
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <StatusBar style="dark" backgroundColor="#ffffff" />
        {/* Rest of your app */}
      </SafeAreaView>
      <View style={styles.TopBarContainer}>
        {/* <TouchableOpacity>
          <Ionicons name="menu-sharp" size={30} color={colors.primary} />
        </TouchableOpacity> */}
        <View>
          <CustomButton
            style={styles.productButtonContainer}
            text="Log out"
            onPress={async () => {
              await AsyncStorage.removeItem("authUser");
              emptyCart("empty");
              navigation.replace("login");
            }}
            // disabled={true}
          />
        </View>
      </View>
      <View style={styles.screenNameContainer}>
        <Text style={styles.screenNameText}>Profile</Text>
      </View>
      <View style={styles.UserProfileCardContianer}>
        <UserProfileCard name={userInfo[0]?.name} email={userInfo[0]?.email} />
      </View>

      <View style={styles.OptionsContainer}>
        <OptionList
          text={"My Account"}
          Icon={Ionicons}
          iconName={"person"}
          onPress={() => navigation.navigate("myaccount", { user: userInfo })}
        />
        <OptionList
          text={"Wishlist"}
          Icon={Ionicons}
          iconName={"heart"}
          onPress={() =>
            Alert.alert("Notification", "Function under construction")
          }
        />
        <OptionList
          text={"Contact Us"}
          Icon={Ionicons}
          iconName={"mail"}
          onPress={() =>
            Alert.alert("Notification", "Function under construction")
          }
        />
        <OptionList
          text={"Setting"}
          Icon={Ionicons}
          iconName={"settings"}
          onPress={() =>
            Alert.alert("Notification", "Function under construction")
          }
        />
        <OptionList
          text={"Help & FAQ"}
          Icon={Ionicons}
          iconName={"help-circle"}
          onPress={() =>
            Alert.alert("Notification", "Function under construction")
          }
        />
      </View>
    </View>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    flex: 1,
  },

  TopBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  UserProfileCardContianer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "25%",
  },
  screenNameContainer: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.primary,
  },
  OptionsContainer: {
    marginTop: 100,
    width: "100%",
  },
});
