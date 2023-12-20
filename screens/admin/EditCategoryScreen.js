import {
  StyleSheet,
  Text,
  Image,
  StatusBar,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
import { colors, network } from "../../constants";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import * as ImagePicker from "expo-image-picker";
import ProgressDialog from "react-native-progress-dialog";
import { AntDesign } from "@expo/vector-icons";

const EditCategoryScreen = ({ navigation, route }) => {
  const { category } = route.params;
  console.log(category);

  const [isloading, setIsloading] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState(
    `${network.serverip}/uploads/category/${category.image_url}`
  );
  // const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [user, setUser] = useState({});
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
  };
  const choseImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
      setImage(result.assets[0].uri);
      console.log(image);
    } else {
      alert("You did not select any image.");
    }
  };
  const choseImageFromCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
      setImage(result.assets[0].uri);
      console.log(image);
    } else {
      alert("You did not select any image.");
    }
  };
  //Method to post the data to server to edit the category using API call
  const editCategoryHandle = (id) => {
    var myHeaders = new Headers();
    // myHeaders.append("x-auth-token", authUser.token);
    // myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Content-Type", "multipart/form-data");
    var formdata = new FormData();
    formdata.append("file", {
      uri: image,
      type: "image/jpeg",
      name: "image.jpg",
    });
    formdata.append("name", name);
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
    setIsloading(true);
    //[check validations] -- Start
    if (name == "") {
      setError("Please enter the product title");
      setIsloading(false);
    } else if (image == null) {
      setError("Please upload the Catergory image");
      setIsloading(false);
    } else {
      // TODO  Đẩy lên serve
      //[check validations] -- End
      fetch(
        `${network.serverip}/update-category/${category.id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.success == true) {
            setIsloading(false);
            setAlertType("success");
            setError(result.message);
            setAlertType("success");
            setError(result.message);
            setTimeout(() => {
              navigation.goBack();
            }, 2000);
          }
        })
        .catch((error) => {
          setIsloading(false);
          setError(error.message);
          setAlertType("error");
          console.log("error", error);
        });
    }
  };

  //inilize the title and description input fields on initial render
  useEffect(() => {
    setName(category?.name);
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar></StatusBar>
      <ProgressDialog visible={isloading} label={"Adding ..."} />
      <View style={styles.TopBarContainer}>
        <TouchableOpacity
          onPress={() => {
            // navigation.replace("viewproduct", { authUser: authUser });
            navigation.goBack();
          }}
        >
          <Ionicons
            name="arrow-back-circle-outline"
            size={30}
            color={colors.muted}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.screenNameContainer}>
        <View>
          <Text style={styles.screenNameText}>Edit Category</Text>
        </View>
        <View style={styles.imageContainer}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
            />
          ) : (
            <AntDesign name="camera" size={50} color={colors.muted} />
          )}
        </View>
        <View style={styles.buttonchoseImageContainer}>
          <TouchableOpacity style={styles.buttonAction}>
            <Button
              title="Chose from Deviece"
              onPress={choseImageFromGallery}
            ></Button>
          </TouchableOpacity>
          <TouchableOpacity>
            <Button title="Open Camera" onPress={choseImageFromCamera}></Button>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.screenNameParagraph}>Add Edit details</Text>
        </View>
      </View>
      <CustomAlert message={error} type={alertType} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, width: "100%" }}
      >
        <View style={styles.formContainer}>
          <CustomInput
            value={name}
            setValue={setName}
            placeholder={"Title"}
            placeholderTextColor={colors.muted}
            radius={5}
          />
        </View>
      </ScrollView>

      <View style={styles.buttomContainer}>
        <CustomButton
          text={"Edit Category"}
          onPress={() => {
            editCategoryHandle(category?._id);
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditCategoryScreen;

const styles = StyleSheet.create({
  container: {
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    flex: 1,
  },
  TopBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  formContainer: {
    flex: 2,
    justifyContent: "flex-start",
    alignItems: "center",
    display: "flex",
    width: "100%",
    flexDirecion: "row",
    padding: 5,
  },

  buttomContainer: {
    marginTop: 10,
    width: "100%",
  },
  bottomContainer: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  screenNameContainer: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.muted,
  },
  screenNameParagraph: {
    marginTop: 5,
    fontSize: 15,
  },
  imageContainer: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    height: 250,
    backgroundColor: colors.white,
    borderRadius: 10,
    elevation: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },
  imageHolder: {
    height: 200,
    width: 200,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light,
    borderRadius: 10,
    elevation: 5,
  },
  buttonchoseImageContainer: {
    marginTop: 10,
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonAction: {
    alignItems: "center",
    backgroundColor: colors.primary,
  },
});
