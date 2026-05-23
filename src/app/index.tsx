import * as Device from "expo-device";
import { Platform } from "react-native";

import { ThemedText } from "@/components/themed-text";

function getDevMenuHint() {
	if (Platform.OS === "web") {
		return <ThemedText type="small">use browser devtools</ThemedText>;
	}
	if (Device.isDevice) {
		return (
			<ThemedText type="small">
				shake device or press <ThemedText type="code">m</ThemedText> in terminal
			</ThemedText>
		);
	}
	const shortcut = Platform.OS === "android" ? "cmd+m (or ctrl+m)" : "cmd+d";
	return (
		<ThemedText type="small">
			press <ThemedText type="code">{shortcut}</ThemedText>
		</ThemedText>
	);
}

import MarketplaceHome from "@/components/marketplace/MarketplaceHome";

export default function HomeScreen() {
	return <MarketplaceHome />;
}
