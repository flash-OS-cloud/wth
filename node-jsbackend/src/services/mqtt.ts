import mqtt from "mqtt";

const MQTT_URL = "mqtt://localhost:1883"; 
const client = mqtt.connect(MQTT_URL);

export const initMQTT = () => {
  client.on("connect", () => {
    console.log("MQTT connected");

    client.subscribe("relay/demo", (err) => {
      if (!err) {
        console.log("Subscribed to relay/demo");
      }
    });
  });

  client.on("message", (topic, message) => {
    const msg = message.toString();

    console.log(`${topic}:`, msg);
  });
};

export const publishMessage = (topic: string, message: string) => {
  client.publish(topic, message);
};
