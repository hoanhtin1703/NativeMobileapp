import {
  StyleSheet,
  Text,
  StatusBar,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { colors, network } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import ProgressDialog from "react-native-progress-dialog";
import BasicProductList from "../../components/BasicProductList/BasicProductList";
import CustomButton from "../../components/CustomButton";
import DropDownPicker from "react-native-dropdown-picker";
import InternetConnectionAlert from "react-native-internet-connection-alert";
import cod from "../../assets/image/cod.png";
const ViewOrderDetailScreen = ({ navigation, route }) => {
  const { Order_Id } = route.params;
  console.log("orderDetail", Order_Id);
  const [isloading, setIsloading] = useState(false);
  const [refeshing, setRefreshing] = useState(false);
  const [label, setLabel] = useState("Loading..");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [totalCost, setTotalCost] = useState(0);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState([]);
  const [item, setItem] = useState([]);
  const [value, setValue] = useState(null);
  const [valuedefault, setValueDefault] = useState(null);
  const [statusDisable, setStatusDisable] = useState(false);
  const [items, setItems] = useState([
    { label: "Pending", value: 0 },
    { label: "Delivered", value: 1 },
    // { label: "Delivered", value: "delivered" },
  ]);
  const handleOnRefresh = () => {
    setRefreshing(true);
    fetchOrders();
    setRefreshing(false);
  };

  const fetchOrderbyID = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("x-auth-token", getToken(authUser));
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    setIsloading(true);
    fetch(`${network.serverip}/admin/orders/${Order_Id}`, requestOptions) //API call
      .then((response) => response.json())
      .then((result) => {
        if (result.success == true) {
          console.log(result.data);
          setOrder(result.data);
          setItem(result.item);
          setAlertType("success");
        } else {
          setError(result.message);
        }
        setIsloading(false);
      })
      .catch((error) => {
        setAlertType("error");
        setError(error);
        console.log("error", error);
        setIsloading(false);
      });
  };
  useEffect(() => {
    // fetchProduct();
    fetchOrderbyID();
  }, []);
  //method to update the status using API call
  const handleUpdateStatus = (id) => {
    setIsloading(true);
    setError("");
    setAlertType("error");
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("x-auth-token", getToken(authUser));
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    console.log(
      `Link:${network.serverip}/admin/order-status?orderId=${Order_Id}&status=${value}`
    );
    fetch(
      `${network.serverip}/admin/order-status?orderId=${Order_Id}&status=${value}`,
      requestOptions
    ) //API call
      .then((response) => response.json())
      .then((result) => {
        if (result.success == true) {
          setError(`Order status is successfully updated to ${result.message}`);
          setAlertType("success");
          setIsloading(false);
        }
      })
      .catch((error) => {
        setAlertType("error");
        setError(error);
        console.log("error", error);
        setIsloading(false);
      });
  };
  useEffect(() => {
    const totalCost = item.reduce((accumulator, value) => {
      if (value.status == 0) {
        setValueDefault("Pending");
      } else {
        setValueDefault("Delivered");
      }

      const itemCost = value.item.reduce((itemAccumulator, object) => {
        const price = Number(object.price); // Convert price to a number
        const quantity = Number(object.quantity); // Convert quantity to a number
        return itemAccumulator + price * quantity;
      }, 0);
      return accumulator + 30 + itemCost;
    }, 0);
    setTotalCost(totalCost);
  }, [order, item]);

  // calculate the total cost and set the all requried variables on initial render
  return (
    <InternetConnectionAlert onChange={(connectionState) => {}}>
      <View style={styles.container}>
        <ProgressDialog visible={isloading} label={label} />
        <StatusBar></StatusBar>
        <View style={styles.TopBarContainer}>
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
        </View>
        <View style={styles.screenNameContainer}>
          <View>
            <Text style={styles.screenNameText}>Order Details</Text>
          </View>
          <View>
            <Text style={styles.screenNameParagraph}>
              View all detail about order
            </Text>
          </View>
        </View>
        <CustomAlert message={error} type={alertType} />
        <ScrollView
          style={styles.bodyContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Genneral Info */}
          <View>
            <Text style={styles.containerNameText}>General Info</Text>
          </View>
          <View style={styles.ShipingInfoContainer}>
            <View style={styles.genneralTopInfoContent}>
              <Text style={styles.secondarytextMedian}>Order ID</Text>
              <Text style={styles.secondarytextSm}>{order[0]?.orderId}</Text>
            </View>
            <View style={styles.genneralTopInfoContent}>
              <Text style={styles.secondarytextMedian}>Order date</Text>
              <Text style={styles.secondarytextSm}>
                {new Date(order[0]?.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}{" "}
                {","}{" "}
                {new Date(order[0]?.createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </Text>
            </View>
            <View style={styles.genneralBottomInfoContent}>
              <Text style={styles.secondarytextMedian}>Orderer's Name</Text>
              <Text style={styles.secondarytextSm}>{order[0]?.user_name}</Text>
            </View>
          </View>
          {/* Genneral Info */}

          {/* Shipping Info */}
          <View style={styles.containerNameContainer}>
            <View>
              <Text style={styles.containerNameText}>Shipping info</Text>
            </View>
          </View>
          <View style={styles.ShipingInfoContainer}>
            <View style={styles.ShipingTopContent}>
              <Text style={styles.secondarytextMedian}>From</Text>
              <Text style={styles.secondarytextSm}>
                VietNam,DaNang,40 TranDaiNghia Str
              </Text>
            </View>

            {order.map((value, index) => {
              return value.info.map((item, index) => {
                return (
                  <View style={{ width: "100%" }}>
                    <View style={styles.ShipingTopContent}>
                      <Text style={styles.secondarytextMedian}>To</Text>
                      <Text style={styles.secondarytextSm}>
                        {item.country + "," + item.city + "," + item.address}
                      </Text>
                    </View>
                    <View style={styles.ShipingTopContent}>
                      <Text style={styles.secondarytextMedian}>
                        Receipt Name
                      </Text>
                      <Text style={styles.secondarytextSm}>
                        {item.reicep_name}
                      </Text>
                    </View>
                    <View style={styles.ShipingBottomContent}>
                      <Text style={styles.secondarytextMedian}>
                        Receipt Phone
                      </Text>
                      <Text style={styles.secondarytextSm}>
                        {item.reicep_phone}
                      </Text>
                    </View>
                  </View>
                );
              });
            })}
          </View>
          {/* Shipping Info */}

          {/* Product info */}
          <View style={styles.containerNameContainer}>
            <View>
              <Text style={styles.containerNameText}>Product Info</Text>
            </View>
          </View>
          <View style={styles.orderItemsContainer}>
            {order.map((value, index) => {
              return value.item.map((item, index) => {
                return (
                  <View style={styles.ProductContent}>
                    <View style={styles.ProductImage}>
                      <Image
                        source={{
                          uri: `${network.serverip}/uploads/product/${item.image}`,
                        }}
                        style={styles.productImage}
                      />
                    </View>
                    <View style={styles.ProductInfo}>
                      <Text style={styles.secondarytextS}>{item.name}</Text>
                      <Text style={styles.quantityItemText}>
                        {new Intl.NumberFormat("en-US", {
                          minimumFractionDigits: 3,
                        }).format(parseFloat(item?.price))}
                        {""} {"đ"} x {item.quantity}
                      </Text>
                      <Text style={styles.secondarytextS}>
                        Total :
                        {new Intl.NumberFormat("en-US", {
                          minimumFractionDigits: 3,
                        }).format(parseFloat(item?.price * item?.quantity))}
                        {""} {"đ"}{" "}
                      </Text>
                    </View>
                  </View>
                );
              });
            })}
          </View>
          {/* Product info */}

          {/* Payment Info */}
          <View>
            <Text style={styles.containerNameText}>Payment info</Text>
          </View>
          <View style={styles.PaymentInfoContainer}>
            <Image style={styles.codImage} source={cod} />
            <View style={styles.ShipingBottomContent}>
              <Text style={styles.secondarytextMedian}>Payment method</Text>
              <Text style={styles.secondarytextSm}>Cash on Delivery</Text>
            </View>
          </View>
          {/* Payment Info */}
          {/* Total */}
          <View style={styles.ShipingInfoContainer}>
            <View style={styles.genneralTopInfoContent}>
              <Text style={styles.secondarytextMedian}>Price</Text>
              <Text style={styles.secondarytextSm}>
                {new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 3,
                }).format(parseFloat(totalCost - 30))}{" "}
                đ
              </Text>
            </View>
            <View style={styles.genneralTopInfoContent}>
              <Text style={styles.secondarytextMedian}>Shipping Fee</Text>
              <Text style={styles.secondarytextSm}>+30.000 đ</Text>
            </View>
            <View style={styles.genneralBottomInfoContent}>
              <Text style={styles.secondarytextMedian}>Total</Text>
              <Text style={styles.secondarytextSm}>
                {new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 3,
                }).format(parseFloat(totalCost))}{" "}
                đ
              </Text>
            </View>
          </View>
          {/* Total */}
          <View style={styles.emptyView}></View>
        </ScrollView>
        <View style={styles.bottomContainer}>
          <View>
            <DropDownPicker
              style={{ width: 200 }}
              open={open}
              value={value}
              items={items}
              placeholder={valuedefault}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              disabled={statusDisable}
              disabledStyle={{
                backgroundColor: colors.light,
                borderColor: colors.white,
              }}
              labelStyle={{ color: colors.muted }}
            />
          </View>
          <View>
            <CustomButton text={"Update"} onPress={handleUpdateStatus} />
          </View>
        </View>
      </View>
    </InternetConnectionAlert>
  );
};

export default ViewOrderDetailScreen;

const styles = StyleSheet.create({
  container: {
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingBottom: 0,
    flex: 1,
  },
  TopBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  screenNameContainer: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.muted,
  },
  screenNameParagraph: {
    marginTop: 10,
    fontSize: 15,
  },
  bodyContainer: { flex: 1, width: "100%", padding: 5 },
  ShipingInfoContainer: {
    marginTop: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,
    borderColor: colors.muted,
    elevation: 5,
    marginBottom: 10,
  },
  containerNameContainer: {
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  containerNameText: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.muted,
  },
  secondarytextSm: {
    color: colors.black,
    fontSize: 15,
    fontWeight: "800",
    justifyContent: "flex-end",
  },
  secondarytextS: {
    color: colors.black,
    fontSize: 12,
    marginRight: 10,
    fontWeight: "800",
    justifyContent: "flex-end",
  },
  orderItemsContainer: {
    marginTop: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,

    borderColor: colors.muted,
    elevation: 3,
    marginBottom: 10,
  },
  orderItemContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderItemText: {
    fontSize: 13,
    color: colors.muted,
  },
  orderSummaryContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    maxHeight: 220,
    width: "100%",
    marginBottom: 5,
  },
  bottomContainer: {
    backgroundColor: colors.white,
    width: "110%",
    height: 70,
    borderTopLeftRadius: 10,
    borderTopEndRadius: 10,
    elevation: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingLeft: 10,
    paddingRight: 10,
  },
  orderInfoContainer: {
    marginTop: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,

    borderColor: colors.muted,
    elevation: 1,
    marginBottom: 10,
  },
  primarytextMedian: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "bold",
  },
  secondarytextMedian: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: "bold",
  },
  emptyView: {
    height: 20,
  },
  genneralTopInfoContent: {
    padding: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.2,
    borderBottomColor: colors.muted,
  },
  genneralBottomInfoContent: {
    padding: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ShipingTopContent: {
    padding: 10,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    display: "flex",
    borderBottomWidth: 0.2,
    borderBottomColor: colors.muted,
  },
  ShipingBottomContent: {
    padding: 10,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    display: "flex",
  },
  productImage: {
    height: 120,
    width: 120,
    borderRadius: 20,
  },
  ProductContent: {
    padding: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderBottomWidth: 0.2,
    borderBottomColor: colors.muted,
  },
  ProductImage: {},
  ProductInfo: {
    padding: 20,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  quantityItemText: {
    marginTop: 10,
    fontSize: 13,
    color: colors.muted,
  },
  PaymentInfoContainer: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,
    borderColor: colors.muted,
    marginBottom: 10,
  },
  codImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    resizeMode: "stretch",
  },
});
