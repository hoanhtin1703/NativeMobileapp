import {
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import BasicProductList from "../../components/BasicProductList/BasicProductList";
import { colors, network } from "../../constants";
import CustomButton from "../../components/CustomButton";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreaters from "../../states/actionCreaters/actionCreaters";
import { bindActionCreators } from "redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomInput from "../../components/CustomInput";
import ProgressDialog from "react-native-progress-dialog";

const CheckoutScreen = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const cartproduct = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const { emptyCart } = bindActionCreators(actionCreaters, dispatch);

  const [deliveryCost, setDeliveryCost] = useState(30);
  const [totalCost, setTotalCost] = useState(0);
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  // const [streetAddress, setStreetAddress] = useState("");
  const [recipName, setrecipName] = useState("");
  const [recipPhone, setrecipPhone] = useState("");
  //method to remove the authUser from aysnc storage and navigate to login
  const logout = async () => {
    await AsyncStorage.removeItem("authUser");
    emptyCart("empty");
    navigation.replace("login");
  };

  //method to handle checkout
  const handleCheckout = async () => {
    const value = await AsyncStorage.getItem("authUser");
    let user = JSON.parse(value);
    setIsloading(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var recepInfo = [];
    // fetch the cart items from redux and set the total cost
    let obj = {
      reicep_name: recipName,
      reicep_phone: recipPhone,
      city: city,
      country: country,
      address: address,
    };
    recepInfo.push(obj);

    var raw = JSON.stringify({
      user: user,
      item: cartproduct,
      info: recepInfo,
    });
    console.log("raw", raw);
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(network.serverip + "/checkout", requestOptions) //API call
      .then((response) => response.json())
      .then((result) => {
        console.log("Checkout=>", result);
        if (result.success == true) {
          setIsloading(false);
          emptyCart("empty");
          navigation.replace("orderconfirm");
        }
      })
      .catch((error) => {
        setIsloading(false);
        console.log("error", error);
      });
  };

  // set the address and total cost on initital render
  useEffect(() => {
    setTotalCost(
      cartproduct.reduce((accumulator, object) => {
        return accumulator + object.price * object.quantity;
      }, 0)
    );
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar></StatusBar>
      <ProgressDialog visible={isloading} label={"Placing Order..."} />
      <View style={styles.topBarContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons
            name="arrow-back-circle-outline"
            size={30}
            color={colors.muted}
          />
        </TouchableOpacity>
        <View></View>
        <View></View>
      </View>
      <ScrollView style={styles.bodyContainer} nestedScrollEnabled={true}>
        <Text style={styles.primaryText}>Order Summary</Text>
        <ScrollView
          style={styles.orderSummaryContainer}
          nestedScrollEnabled={true}
        >
          {cartproduct.map((product, index) => (
            <BasicProductList
              key={index}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </ScrollView>
        <Text style={styles.primaryText}>Total</Text>
        <View style={styles.totalOrderInfoContainer}>
          <View style={styles.list}>
            <Text>Order</Text>
            <Text>
              {" "}
              {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 3,
              }).format(parseFloat(totalCost))}
              đ
            </Text>
          </View>
          <View style={styles.list}>
            <Text>Delivery</Text>
            <Text>
              {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 3,
              }).format(parseFloat(deliveryCost))}
              đ
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.primaryTextSm}>Total</Text>
            <Text style={styles.secondaryTextSm}>
              {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 3,
              }).format(parseFloat(totalCost + deliveryCost))}
              đ
            </Text>
          </View>
        </View>
        <Text style={styles.primaryText}>Contact Info</Text>
        <View style={styles.listContainer}>
          <View style={styles.list}>
            <Text style={styles.secondaryTextSm}>Infomation </Text>
            <TouchableOpacity
              style={styles.list}
              onPress={() => setModalVisible(true)}
            >
              <View>
                <Text style={styles.primaryTextSm}>
                  {recipName || recipPhone || country || city || address != ""
                    ? "Edit"
                    : "Add"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {recipName || recipPhone || country || city || address != "" ? (
            <View>
              <View style={styles.list}>
                <Text style={styles.secondaryTextSm}>Recipient's name</Text>
                <Text style={styles.secondaryTextSm}>{recipName}</Text>
              </View>
              <View style={styles.list}>
                <Text style={styles.secondaryTextSm}>Recipient'sPhone</Text>
                <Text style={styles.secondaryTextSm}>{recipPhone}</Text>
              </View>
              <View style={styles.list}>
                <Text style={styles.secondaryTextSm}>Country</Text>
                <Text style={styles.secondaryTextSm}>{city}</Text>
              </View>
              <View style={styles.list}>
                <Text style={styles.secondaryTextSm}>City</Text>
                <Text style={styles.secondaryTextSm}>{country}</Text>
              </View>
              <View style={styles.list}>
                <Text style={styles.secondaryTextSm}>Address</Text>
                <Text style={styles.secondaryTextSm}>{address}</Text>
              </View>
              <View></View>
            </View>
          ) : (
            <View style={styles.emptyView}></View>
          )}
        </View>

        <Text style={styles.primaryText}>Payment</Text>
        <View style={styles.listContainer}>
          <View style={styles.list}>
            <Text style={styles.secondaryTextSm}>Method</Text>
            <Text style={styles.primaryTextSm}>Cash On Delivery</Text>
          </View>
        </View>

        <View style={styles.emptyView}></View>
      </ScrollView>
      <View style={styles.buttomContainer}>
        {country && city && address != "" ? (
          <CustomButton
            text={"Submit Order"}
            // onPress={() => navigation.replace("orderconfirm")}
            onPress={() => {
              handleCheckout();
            }}
          />
        ) : (
          <CustomButton text={"Submit Order"} disabled />
        )}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modelBody}>
          <View style={styles.modelAddressContainer}>
            <Text>Info of Order</Text>
            <CustomInput
              value={recipName}
              setValue={setrecipName}
              placeholder={"Enter the recipient's name "}
            />
            <CustomInput
              value={recipPhone}
              setValue={setrecipPhone}
              placeholder={"Enter recipient's phone number"}
            />

            <CustomInput
              value={country}
              setValue={setCountry}
              placeholder={"Enter Country"}
            />
            <CustomInput
              value={city}
              setValue={setCity}
              placeholder={"Enter City"}
            />
            <CustomInput
              value={address}
              setValue={setAddress}
              placeholder={"Enter Street Address"}
            />

            {address || city || country != "" ? (
              <CustomButton
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
                text={"save"}
              />
            ) : (
              <CustomButton
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
                text={"close"}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 0,
    flex: 1,
  },
  topBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  toBarText: {
    fontSize: 15,
    fontWeight: "600",
  },
  bodyContainer: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  orderSummaryContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    maxHeight: 220,
  },
  totalOrderInfoContainer: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: colors.white,
  },
  primaryText: {
    marginBottom: 5,
    marginTop: 5,
    fontSize: 20,
    fontWeight: "bold",
  },
  list: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    backgroundColor: colors.white,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
    padding: 10,
  },
  primaryTextSm: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.primary,
  },
  secondaryTextSm: {
    fontSize: 15,
    fontWeight: "bold",
  },
  listContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
  },
  buttomContainer: {
    width: "100%",
    padding: 20,
    paddingLeft: 30,
    paddingRight: 30,
  },
  emptyView: {
    width: "100%",
    height: 20,
  },
  modelBody: {
    flex: 1,
    display: "flex",
    flexL: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  modelAddressContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: 320,
    height: 400,
    backgroundColor: colors.white,
    borderRadius: 20,
    elevation: 3,
  },
});
