import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { auth, db } from "@/firebase/firebaseConfig";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [imageName, setImageName] = useState("");

	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	const canSubmit = useMemo(() => {
		return !submitting;
	}, [submitting]);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				router.replace("/");
			}
		});

		return unsubscribe;
	}, [router]);

	const handleSubmit = async (e?: unknown) => {
		try {
			// @ts-expect-error - e may not be a DOM event in RN
			e?.preventDefault?.();
		} catch {
			// ignore
		}

		setError(null);

		if (!email.trim() || !password || !confirmPassword) {
			setError("Email and password are required.");
			return;
		}

		if (!EMAIL_REGEX.test(email.trim())) {
			setError("Please enter a valid email address.");
			return;
		}

		if (password.length < 6) {
			setError("Password must be at least 6 characters.");
			return;
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		setSubmitting(true);
		try {
			const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
			const currentUser = credential.user;

			await setDoc(doc(db, "users", currentUser.uid), {
				uid: currentUser.uid,
				email: currentUser.email ?? "",
				firstName: "",
				lastName: "",
				profileImageUrl: imageName.trim() || "",
				createdAt: serverTimestamp(),
			});

			router.replace("/");
		} catch (err) {
			const message = err instanceof Error ? err.message : "Registration failed.";
			setError(message);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
			<View style={styles.center}>
				<View style={styles.card}>
					<ThemedText type="title" style={styles.title}>
						Register
					</ThemedText>

					{error ? (
						<ThemedView type="backgroundElement" style={styles.errorBox}>
							<ThemedText style={styles.errorText}>{error}</ThemedText>
						</ThemedView>
					) : null}

					<View style={styles.form}>
						<ThemedText style={styles.label}>Email</ThemedText>
						<TextInput
							style={styles.input}
							value={email}
							onChangeText={setEmail}
							placeholder="Enter your email"
							placeholderTextColor="#8a8a8a"
							autoCapitalize="none"
							keyboardType="email-address"
							returnKeyType="next"
							editable={!submitting}
						/>

						<ThemedText style={[styles.label, styles.labelSpacing]}>Password</ThemedText>
						<TextInput
							style={styles.input}
							value={password}
							onChangeText={setPassword}
							placeholder="Enter your password"
							placeholderTextColor="#8a8a8a"
							secureTextEntry
							returnKeyType="next"
							editable={!submitting}
						/>

						<ThemedText style={[styles.label, styles.labelSpacing]}>Confirm Password</ThemedText>
						<TextInput
							style={styles.input}
							value={confirmPassword}
							onChangeText={setConfirmPassword}
							placeholder="Re-enter your password"
							placeholderTextColor="#8a8a8a"
							secureTextEntry
							returnKeyType="done"
							editable={!submitting}
							onSubmitEditing={() => handleSubmit(undefined)}
						/>

						{/* Image upload (web-friendly placeholder) */}
						<ThemedText style={[styles.label, styles.labelSpacing]}>Profile Image</ThemedText>
						<TextInput
							style={styles.input}
							value={imageName}
							onChangeText={setImageName}
							placeholder="Attach image name (web placeholder)"
							placeholderTextColor="#8a8a8a"
							editable={!submitting}
						/>

						<Pressable
							accessibilityRole="button"
							onPress={() => handleSubmit(undefined)}
							disabled={!canSubmit}
							style={({ pressed }) => [styles.button, pressed ? styles.buttonPressed : null, submitting ? styles.buttonDisabled : null]}>
							<ThemedText type="linkPrimary" style={styles.buttonText}>
								{submitting ? "Creating…" : "Create account"}
							</ThemedText>
						</Pressable>

						<View style={styles.footer}>
							<ThemedText style={styles.footerText}>Already have an account? </ThemedText>
							<Pressable accessibilityRole="link" onPress={() => router.push("/login")}>
								<ThemedText style={styles.registerLink}>Login</ThemedText>
							</Pressable>
						</View>
					</View>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
}

const CRIMSON = "#b8261e";

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		minHeight: "100%",
		backgroundColor: "#0b0b0b",
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	card: {
		width: "100%",
		maxWidth: 440,
		backgroundColor: "#1a1a1a",
		borderRadius: 16,
		padding: 22,
		shadowColor: CRIMSON,
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.25,
		shadowRadius: 18,
		elevation: 8,
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.04)",
	},
	title: {
		textAlign: "center",
		marginBottom: 16,
		color: "#ffffff",
		fontWeight: "700",
	},
	form: {
		width: "100%",
	},
	label: {
		color: "#8f8f8f",
		fontSize: 13,
		marginBottom: 8,
		fontWeight: "600",
	},
	labelSpacing: {
		marginTop: 14,
	},
	input: {
		width: "100%",
		backgroundColor: "#242424",
		borderColor: "rgba(255,255,255,0.10)",
		borderWidth: 1,
		borderRadius: 12,
		paddingHorizontal: 14,
		paddingVertical: 12,
		color: "#ffffff",
		marginBottom: 2,
	},
	button: {
		marginTop: 20,
		backgroundColor: CRIMSON,
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: "center",
	},
	buttonPressed: {
		backgroundColor: "#a41e18",
	},
	buttonDisabled: {
		opacity: 0.7,
	},
	buttonText: {
		color: "#ffffff",
		fontWeight: "800",
		fontSize: 16,
	},
	errorBox: {
		backgroundColor: "#2b0b0b",
		borderRadius: 12,
		padding: 12,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "rgba(184,38,30,0.35)",
	},
	errorText: {
		color: "#ffb3b3",
		fontSize: 13,
	},
	footer: {
		marginTop: 18,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		flexWrap: "wrap",
	},
	footerText: {
		color: "#9a9a9a",
		fontSize: 13,
		textAlign: "center",
	},
	registerLink: {
		color: CRIMSON,
		fontSize: 13,
		fontWeight: "800",
	},
});
