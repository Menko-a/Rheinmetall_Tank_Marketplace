import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import MarketplaceHome from "@/components/marketplace/MarketplaceHome";
import { auth } from "@/firebase/firebaseConfig";

export default function HomeScreen() {
	const router = useRouter();
	const [initializing, setInitializing] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (!user) {
				router.replace("/login");
			}
			if (initializing) {
				setInitializing(false);
			}
		});

		return unsubscribe;
	}, [initializing, router]);

	if (initializing) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0b0b0b" }}>
				<ActivityIndicator size="large" color="#b8261e" />
			</View>
		);
	}

	return <MarketplaceHome />;
}
