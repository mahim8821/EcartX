import { Redirect } from "expo-router";
export default function Index() {
  return <Redirect href="/splash" />;
}
//return <Redirect href="/(tabs)/browse" />;

// app/_layout.tsx (or your root component)
/*import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { requestPushPermissionsAndGetToken } from "../lib/notifications";

export default function RootLayout() {
  useEffect(() => {
    (async () => {
      try {
        const token = await requestPushPermissionsAndGetToken();
        // TODO: send this token to your backend user profile
        console.log("Expo push token:", token);
      } catch (e: any) {
        console.log("Push setup error:", e?.message);
      }
    })();
  }, []);

  return <Stack />;
}
 */
