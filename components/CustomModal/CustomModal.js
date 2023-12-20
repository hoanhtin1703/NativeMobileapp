import React, { useState } from "react";
import { Alert, Button, Modal } from "react-native";

const CustomModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleOpenDialog = () => {
    setIsVisible(true);
  };

  const handleCloseDialog = () => {
    setIsVisible(false);
  };

  const handleButtonPress = (buttonIndex) => {
    // Do something with the button index
    console.log(buttonIndex);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleCloseDialog}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            width: 300,
            height: 200,
            backgroundColor: "white",
            borderRadius: 10,
            padding: 20,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Alert Dialog</Text>

          <Text style={{ fontSize: 16, marginTop: 10 }}>
            This is an alert dialog with two buttons.
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginTop: 20,
            }}
          >
            <Button title="Cancel" onPress={() => handleButtonPress(0)} />
            <Button title="OK" onPress={() => handleButtonPress(1)} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
