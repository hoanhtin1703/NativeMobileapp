import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
import { colors } from "../../constants";
import { RectButton } from "react-native-gesture-handler";
const caculateDayoff = (createdAt) => {
  // Calculate the timestamp as a Date object
  const timestampDate = new Date(createdAt);

  // Calculate the current date
  const currentDate = new Date();

  // Calculate the time difference in milliseconds
  const timeDifferenceMilliseconds =
    currentDate.getTime() - timestampDate.getTime();

  // Convert milliseconds to days
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const daysAgo = Math.round(timeDifferenceMilliseconds / millisecondsPerDay);

  console.log("Days ago:", daysAgo);
  return daysAgo;
};
const OrderList = ({ item, createdAt, status, onPress, key }) => {
  const [totalCost, setTotalCost] = useState(0);
  const [quantity, setQuantity] = useState(0);
  useEffect(() => {
    const totalCost = item.reduce((accumulator, object) => {
      return accumulator + object.price * object.quantity;
    }, 0);
    console.log(totalCost);
    setTotalCost(totalCost);
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.innerRow}>
        <View style={styles.OrderHeadContent}>
          <Text style={styles.textDayoff}>
            {caculateDayoff(createdAt) == 0
              ? "Today"
              : caculateDayoff(createdAt) + "Days ago"}
          </Text>
          {status == 0 ? (
            <Text style={styles.textStatus}>No Process</Text>
          ) : (
            <Text style={styles.textStatusSuccess}>Processed</Text>
          )}
        </View>
        {item.map((value, index) => {
          return (
            <View style={styles.OrderContainer}>
              <View>
                <Image
                  source={{
                    uri: `${network.serverip}/uploads/product/${value.image}`,
                  }}
                  style={styles.productImage}
                />
              </View>
              <View style={styles.OrderContent}>
                <Text style={styles.primaryText}>#Order_Id :{value?._id}</Text>

                <View style={styles.innerRow}>
                  <Text style={styles.secondaryText}>
                    Product Name :{value?.name}{" "}
                  </Text>
                  <Text style={styles.secondaryText}>
                    Quantity : {value?.quantity}
                  </Text>
                  <Text style={styles.secondaryText}>
                    Price :{" "}
                    {new Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 3,
                    }).format(parseFloat(value?.price))}{" "}
                    đ
                  </Text>
                  <Text style={styles.secondaryText}>
                    Total Amount :{" "}
                    {new Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 3,
                    }).format(parseFloat(value.price * value.quantity))}{" "}
                    đ
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
        <View style={styles.OrderFooterContent}>
          <TouchableOpacity onPress={onPress} style={styles.ButtonDetail}>
            <Text style={{ color: colors.white }}>Details</Text>
          </TouchableOpacity>
          <View style={styles.TotalText}>
            <Text style={styles.secondaryText}>
              Total{" "}
              {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 3,
              }).format(parseFloat(totalCost))}{" "}
              đ
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default OrderList;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "auto",
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 1,
  },
  innerRow: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    // alignItems: "center",
    width: "100%",
  },
  primaryText: {
    fontSize: 15,
    color: colors.dark,
    fontWeight: "bold",
  },
  secondaryTextSm: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: "bold",
  },
  secondaryText: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: "bold",
  },
  timeDateContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  detailButton: {
    marginTop: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    padding: 5,
    borderColor: colors.muted,
    color: colors.muted,
    width: 100,
  },
  productImage: {
    borderRadius: 10,
    height: 120,
    width: 120,
  },
  textDayoff: {
    width: "30%",
    fontSize: 13,
    padding: 10,
    alignContent: "center",
    borderRadius: 10,
    color: colors.secondary,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  textStatus: {
    // alignContent: "center",
    width: "25%",
    fontSize: 12,
    padding: 12,
    borderRadius: 10,
    color: colors.white,
    backgroundColor: colors.danger,
    borderColor: colors.white,
  },
  textStatusSuccess: {
    width: "25%",
    fontSize: 12,
    padding: 12,
    borderRadius: 10,
    color: colors.white,
    backgroundColor: colors.success,
    borderColor: colors.white,
  },
  OrderContainer: {
    padding: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  OrderContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  TotalText: {
    padding: 10,
    // alignItems: "center",
    flexDirection: "row",
    display: "flex",
    justifyContent: "flex-end",
  },
  OrderHeadContent: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  OrderFooterContent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ButtonDetail: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: colors.secondary,
    width: "28%",
  },
});
