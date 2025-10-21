// lib/notifications.ts
import Constants from "expo-constants";
// expo-device may not be present in all environments; silence TS if types are missing
// @ts-ignore
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    // newer SDKs expect these fields as well
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Ask for permission and return an Expo push token.
 * - On simulators/emulators: returns "" and logs a note (remote push not supported).
 * - On real devices: returns "ExponentPushToken[...]" if granted.
 */
export async function requestPushPermissionsAndGetToken(): Promise<string> {
  // Simulators/emulators can't receive remote pushes
  const isDevice = Device ? Device.isDevice : true;
  if (!isDevice) {
    console.log("Push notifications require a physical device. Skipping token fetch.");
    return "";
  }

  // Ask permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    throw new Error("Push permission not granted");
  }

  // Android notification channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  // Prefer passing EAS projectId (prevents 'DeviceNotRegistered' / invalid token issues)
  const projectId =
    // from app.json -> extra.eas.projectId (dev/runtime)
    (Constants?.expoConfig as any)?.extra?.eas?.projectId ||
    // available at runtime in EAS builds
    (Constants as any)?.easConfig?.projectId;

  const tokenResponse = projectId
    ? await Notifications.getExpoPushTokenAsync({ projectId })
    : await Notifications.getExpoPushTokenAsync();

  return tokenResponse.data; // e.g., "ExponentPushToken[xxxxxxxxxxxxxxxxxxxx]"
}

/** Simple local notification test (works on simulator & device) */
export async function scheduleLocalTest() {
  return Notifications.scheduleNotificationAsync({
    content: { title: "EcartX", body: "Local test notification 🚀" },
    trigger: {
      seconds: 3,
      repeats: false,
      // include the explicit trigger type to satisfy type definitions
      type: Notifications.SchedulableTriggerInputTypes?.TIME_INTERVAL as any,
    },
  });
}
