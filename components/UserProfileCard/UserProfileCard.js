import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { colors } from "../../constants";
import profile from "../../assets/image/147140.png";
const UserProfileCard = ({ name, email }) => {
  return (
    <View style={styles.Container}>
      <Image style={styles.avatarContainer} source={profile} />

      <View style={styles.infoContainer}>
        <Text style={styles.usernameText}>{name}</Text>
        <Text style={styles.secondaryText}> {email}</Text>
      </View>
    </View>
  );
};

export default UserProfileCard;

const styles = StyleSheet.create({
  Container: {
    marginTop: 70,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  avatarContainer: {
    display: "flex",
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    marginTop: 10,
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: colors.light,
    // paddingLeft: 20,
  },
  usernameText: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 30,
  },
  secondaryText: {
    color: colors.muted,
    fontWeight: "bold",
    fontSize: 15,
  },
});
