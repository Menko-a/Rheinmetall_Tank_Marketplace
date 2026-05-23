import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = async (e?: unknown) => {
		// Spec: prevent default browser reloading
		// (In React Native, this is effectively a no-op, but harmless.)
		try {
			// @ts-expect-error - e may not be a DOM event in RN
			e?.preventDefault?.();
		} catch {
			// ignore
		}

		setError(null);

		if (!email.trim() || !password) {
			setError("Email and password are required.");
			return;
		}

		if (!EMAIL_REGEX.test(email.trim())) {
			setError("Please enter a valid email address.");
			return;
		}

		setSubmitting(true);
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email: email.trim(), password }),
			});

			if (!res.ok) {
				throw new Error("Invalid credentials.");
			}

			// Placeholder: expect { token: string }
			const data = (await res.json().catch(() => null)) as { token?: string } | null;

			const token = data?.token ?? "mock-jwt-token";

			// Spec: save mock JWT token to localStorage (web best-effort)
			if (typeof globalThis !== "undefined" && "localStorage" in globalThis) {
				globalThis.localStorage.setItem("jwt", token);
			}

			// eslint-disable-next-line no-console
			console.log("Login success", token);

			// In a real app, you would navigate to a protected area.
			// router.replace('/');
		} catch (err) {
			const message = err instanceof Error ? err.message : "Login failed.";
			setError(message);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
			<View style={styles.center}>
				<View style={styles.card}>
					{/* Title */}
					<ThemedText type="title" style={styles.title}>
						Login
					</ThemedText>

					{/* Error */}
					{error ? (
						<ThemedView type="backgroundElement" style={styles.errorBox}>
							<ThemedText style={styles.errorText}>{error}</ThemedText>
						</ThemedView>
					) : null}

					{/* Form */}
					<View style={styles.form}>
						{/* Email */}
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

						{/* Password */}
						<ThemedText style={[styles.label, styles.labelSpacing]}>Password</ThemedText>
						<TextInput
							style={styles.input}
							value={password}
							onChangeText={setPassword}
							placeholder="Enter your password"
							placeholderTextColor="#8a8a8a"
							secureTextEntry
							returnKeyType="done"
							editable={!submitting}
							onSubmitEditing={() => handleSubmit(undefined)}
						/>

						{/* Button */}
						<Pressable
							accessibilityRole="button"
							onPress={() => handleSubmit(undefined)}
							disabled={submitting}
							style={({ pressed }) => [styles.button, pressed ? styles.buttonPressed : null, submitting ? styles.buttonDisabled : null]}>
							<ThemedText type="linkPrimary" style={styles.buttonText}>
								{submitting ? "Signing in…" : "Login"}
							</ThemedText>
						</Pressable>

						{/* Footer */}
						<View style={styles.footer}>
							<ThemedText style={styles.footerText}>Don&apos;t have an account? </ThemedText>
							<Pressable
								accessibilityRole="link"
								onPress={() => {
									// If a /register route exists, this will work.
									// Otherwise, it will still attempt navigation.
									router.push("/register" as never);
								}}>
								<ThemedText style={styles.registerLink}>Register</ThemedText>
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
		// subtle dark red/crimson outer glow drop shadow
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
