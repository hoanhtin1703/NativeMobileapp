import {
  StyleSheet,
  Text,
  StatusBar,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Dimensions,
  Image,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { colors, network } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import ProductCard from "../../components/ProductCard/ProductCard";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import ProgressDialog from "react-native-progress-dialog";
import OrderList from "../../components/OrderList/OrderList";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MyOrderScreen = ({ navigation, route }) => {
  const { user } = route.params;
  const [isloading, setIsloading] = useState(false);
  const [label, setLabel] = useState("Please wait...");
  const [refeshing, setRefreshing] = useState(false);
  const [alertType, setAlertType] = useState("error");
  const [error, setError] = useState("");
  const [orders, setOrder] = useState([]);
  const [UserInfo, setUserInfo] = useState("");

  //method to remove the authUser from aysnc storage and navigate to login
  const logout = async () => {
    await AsyncStorage.removeItem("authUser");
    navigation.replace("login");
  };
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  const fetchOrder = () => {
    fetch(`${network.serverip}/orders/8wIadF0p26S0banOBb1K`, requestOptions) //API call
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          console.log(result.item);
          setOrder(result.item);
          setError("");
        } else {
          setError(result.message);
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  //method call on pull refresh
  const handleOnRefresh = () => {
    setRefreshing(true);
    fetchOrder();
    setRefreshing(false);
  };
  useEffect(() => {
    // fetchProduct();
    fetchOrder();
  }, []);

  const transertime = (second, nano) => {
    const createdAtDate = new Date(second * 1000); // Multiply by 1000 to convert seconds to milliseconds
    // Format the date and time
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDateTime = createdAtDate.toLocaleString(undefined, options); // Adjust the formatting based on your requirements
    const formattedTimestamp = `${formattedDateTime}`;
    return formattedTimestamp;
  };
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <StatusBar style="dark" backgroundColor="#ffffff" />
        {/* Rest of your app */}
      </SafeAreaView>
      <ProgressDialog visible={isloading} label={label} />
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
        <TouchableOpacity onPress={() => handleOnRefresh()}>
          <Ionicons name="cart-outline" size={30} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.screenNameContainer}>
        <View>
          <Text style={styles.screenNameText}>My Orders</Text>
        </View>
        <View>
          <Text style={styles.screenNameParagraph}>
            Your order and your order status
          </Text>
        </View>
      </View>
      <CustomAlert message={error} type={alertType} />
      {orders.length == 0 ? (
        <View style={styles.ListContiainerEmpty}>
          <Text style={styles.secondaryTextSmItalic}>
            "There are no orders placed yet."
          </Text>
        </View>
      ) : (
        <View style={styles.OderContainer}>
          <ScrollView
            style={{ flex: 1, width: "100%", padding: 20 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refeshing}
                onRefresh={handleOnRefresh}
              />
            }
          >
            {orders.map((order, index) => {
              return order.item.map((item, index) => {
                return (
                  <View style={styles.productCardContainer}>
                    <TouchableOpacity>
                      <View style={styles.OderCard}>
                        <View style={styles.infortop}>
                          <View style={styles.imageContainer}>
                            <Image
                              source={{
                                uri: `${network.serverip}/uploads/product/${item.image}`,
                              }}
                              style={styles.productImage}
                            />
                            <View style={styles.TextTop}>
                              <Text style={styles.TextProduct}>
                                {item.name}
                              </Text>
                              <Text>
                                {new Intl.NumberFormat("en-US", {
                                  minimumFractionDigits: 3,
                                }).format(parseFloat(item.price))}
                                đ x{item.quantity}
                              </Text>
                              <Text style={styles.TextTotal}>
                                Total:
                                {new Intl.NumberFormat("en-US", {
                                  minimumFractionDigits: 3,
                                }).format(
                                  parseFloat(item.price * item.quantity)
                                )}
                                đ
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.inforBottom}>
                          <Text style={styles.TextDatetime}>
                            Order date:
                            {transertime(
                              order.createdAt.seconds,
                              order.createdAt.nanoseconds
                            )}
                          </Text>
                          {order.status == 0 ? (
                            <Text style={styles.TextStatusProcessing}>
                              Processing
                            </Text>
                          ) : (
                            <Text style={styles.TextStatusSuccess}>
                              Success
                            </Text>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                    {/* <Text>{order._id}</Text>
                <Text>{order.name}</Text> */}
                  </View>
                );
              });
            })}
            <View style={styles.emptyView}></View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default MyOrderScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
  },
  OderContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    flexDirecion: "column",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
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
  screenNameContainer: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 0,
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
  bodyContainer: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
  },
  emptyView: {
    height: 20,
  },
  ListContiainerEmpty: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  secondaryTextSmItalic: {
    fontStyle: "italic",
    fontSize: 15,
    color: colors.muted,
  },
  productCardContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "white",
  },
  infortop: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
  },

  imageContainer: {
    backgroundColor: colors.light,
    width: "100%",
    padding: 20,
    borderRadius: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 0,
  },
  productImage: {
    height: 120,
    width: 120,
  },
  OderCard: {
    padding: 5,
    borderWidth: 0.2,
    borderTopColor: colors.muted,
    borderBottomColor: colors.muted,
    width: "100%",
    display: "flex",
    flexDirecion: "column",
    backgroundColor: colors.light,
    borderColor: colors.light,
  },
  TextTop: {
    width: "100%",
    padding: 20,
  },
  TextProduct: {
    marginBottom: 10,
    fontSize: 20,
    color: colors.muted,
  },
  TextTotal: {
    paddingTop: 10,
    color: colors.primary,
  },
  inforBottom: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  TextDatetime: {
    fontSize: 15,
    margin: 10,
    color: colors.primary,
  },
  TextStatusProcessing: {
    fontSize: 15,
    padding: 15,
    borderRadius: 15,
    color: colors.dark,
    backgroundColor: colors.tertiary,
  },
  TextStatusSuccess: {
    fontSize: 15,
    padding: 15,
    borderRadius: 15,
    color: colors.light,
    backgroundColor: colors.success,
  },
});
