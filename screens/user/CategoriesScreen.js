import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  StatusBar,
  Text,
  FlatList,
  RefreshControl,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";

import { Ionicons } from "@expo/vector-icons";
import cartIcon from "../../assets/icons/cart_beg.png";
import emptyBox from "../../assets/image/emptybox.png";
import { colors, network } from "../../constants";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreaters from "../../states/actionCreaters/actionCreaters";
import CustomIconButton from "../../components/CustomIconButton/CustomIconButton";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import CustomInput from "../../components/CustomInput";

const CategoriesScreen = ({ navigation }) => {
  // const { categoryID } = route.params;
  // console.log(categoryID);
  const [isLoading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [refeshing, setRefreshing] = useState(false);
  const [label, setLabel] = useState("Loading...");
  const [error, setError] = useState("");
  const [foundItems, setFoundItems] = useState([]);
  const [filterItem, setFilterItem] = useState("");

  //get the dimenssions of active window
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );
  const windowHeight = Dimensions.get("window").height;

  //initialize the cartproduct with redux data
  const cartproduct = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const { addCartItem } = bindActionCreators(actionCreaters, dispatch);

  //method to navigate to product detail screen of specific product
  const handleProductPress = (product) => {
    navigation.navigate("productdetail", { product: product });
  };

  //method to add the product to cart (redux)
  const handleAddToCat = (product) => {
    addCartItem(product);
  };

  //method call on pull refresh
  const handleOnRefresh = () => {
    setRefreshing(true);
    // fetchProduct();
    setRefreshing(false);
  };

  var headerOptions = {
    method: "GET",
    redirect: "follow",
  };
  const fetchCategories = () => {
    fetch(`${network.serverip}/categories`, headerOptions) //API call
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setCategories(result.category);
          console.log(categories);
          setError("");
        } else {
          setError(result.message);
        }
      })
      .catch((error) => {
        setError(error.message);
        console.log("error", error);
      });
  };

  //method to filter the product according to user search in selected category
  const filter = () => {
    const keyword = filterItem;
    if (keyword !== "") {
      const results = products.filter((product) => {
        return product?.[0].name.toLowerCase().includes(keyword.toLowerCase());
      });
      setFoundItems(results);
    } else {
      setFoundItems(products);
    }
  };

  //render whenever the value of filterItem change
  useEffect(() => {
    filter();
  }, [filterItem]);

  //fetch the product on initial render
  useEffect(() => {
    // fetchProduct();
    fetchCategories();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <StatusBar style="dark" backgroundColor="#ffffff" />
        {/* Rest of your app */}
      </SafeAreaView>
      <View style={styles.topBarContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.jumpTo("home");
          }}
        >
          <Ionicons
            name="arrow-back-circle-outline"
            size={30}
            color={colors.muted}
          />
        </TouchableOpacity>

        <View>
          <Text style={styles.TextCategory}>Categories</Text>
        </View>
        <TouchableOpacity
          style={styles.cartIconContainer}
          onPress={() => navigation.navigate("cart")}
        >
          {cartproduct?.length > 0 ? (
            <View style={styles.cartItemCountContainer}>
              <Text style={styles.cartItemCountText}>{cartproduct.length}</Text>
            </View>
          ) : (
            <></>
          )}
          <Image source={cartIcon} />
        </TouchableOpacity>
      </View>
      <ScrollView nestedScrollEnabled={true}>
        <View style={styles.bodyContainer}>
          <View style={{ padding: 0, paddingLeft: 20, paddingRight: 20 }}>
            <CustomInput
              radius={5}
              placeholder={"Search..."}
              value={filterItem}
              setValue={setFilterItem}
            />
          </View>
          <View style={styles.productCardContainer}>
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={refeshing}
                  onRefresh={handleOnRefresh}
                />
              }
              showsVerticalScrollIndicator={false}
              // initialNumToRender={5}
              // horizontal={true}
              numColumns={2}
              data={categories}
              keyExtractor={(item) => item._id}
              renderItem={({ item, index }) => (
                <View style={styles.listProductCardContainer} key={item._id}>
                  <CategoryCard
                    name={item.name}
                    image={`${network.serverip}/uploads/category/${item.image_url}`}
                    onPress={() =>
                      navigation.navigate("productbycategory", {
                        categoryID: item.id,
                      })
                    }
                    onPressSecondary={() => handleAddToCat(item)}
                  />
                </View>
              )}
            />
            <View style={styles.emptyView}></View>
          </View>
          {/* )} */}
        </View>
      </ScrollView>
    </View>
  );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
    paddingBottom: 0,
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
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,

    justifyContent: "flex-start",
    flex: 1,
  },
  cartIconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cartItemCountContainer: {
    position: "absolute",
    zIndex: 10,
    top: -10,
    left: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 22,
    width: 22,
    backgroundColor: colors.danger,
    borderRadius: 11,
  },
  cartItemCountText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 10,
  },
  productCartContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 5,
    padding: 5,
    paddingBottom: 0,
    paddingTop: 0,
    marginBottom: 0,
  },
  noItemContainer: {
    width: "100%",
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  emptyBoxText: {
    fontSize: 11,
    color: colors.muted,
    textAlign: "center",
  },
  emptyView: {
    height: 20,
  },
  productCardContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "white",
  },
  listProductCardContainer: {
    width: Dimensions.get("window").width / 2 - 10,
    borderRadius: 2,
    margin: 5,
    backgroundColor: colors.light,
  },
  TextCategory: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
