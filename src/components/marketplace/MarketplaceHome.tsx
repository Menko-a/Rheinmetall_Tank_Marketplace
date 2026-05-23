import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

type TankTag = "STANDARD" | "PREMIUM";

type TankClass = "LIGHT" | "MEDIUM" | "HEAVY" | "ASSAULT";

type Tank = {
	id: string;
	name: string;
	tag: TankTag;
	type: string;
	origin: string;
	categoryLabel: string;
	price: number;
	imageUri?: any;
};

type ProductCategory = {
	key: string;
	title: string;
	tanks: Tank[];
};

type CartItem = {
	tankId: string;
	name: string;
	price: number;
	qty: number;
};

const CRIMSON = "#b8261e";
const GOLD = "#f4c34a";

function formatPrice(price: number) {
	return price.toLocaleString("en-US");
}

function CartIcon({ size = 22 }: { size?: number }) {
	return (
		<ThemedView style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
			<Text style={{ color: CRIMSON, fontSize: size }}>{"🛒"}</Text>
		</ThemedView>
	);
}

function TokenIcon({ size = 18 }: { size?: number }) {
	return (
		<ThemedView style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
			<Text style={{ color: GOLD, fontSize: size }}>{"🏷️"}</Text>
		</ThemedView>
	);
}

function PhoneIcon({ size = 18 }: { size?: number }) {
	return (
		<ThemedView style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
			<Text style={{ color: CRIMSON, fontSize: size }}>{"📞"}</Text>
		</ThemedView>
	);
}

function MailIcon({ size = 18 }: { size?: number }) {
	return (
		<ThemedView style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
			<Text style={{ color: CRIMSON, fontSize: size }}>{"✉️"}</Text>
		</ThemedView>
	);
}

function XIcon({ size = 20 }: { size?: number }) {
	return (
		<ThemedView style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
			<Text style={{ color: "#ffffff", fontSize: size - 2 }}>{"✕"}</Text>
		</ThemedView>
	);
}

export default function MarketplaceHome() {
	const router = useRouter();
	const [selectedTankId, setSelectedTankId] = useState<string | null>(null);
	const [cart, setCart] = useState<CartItem[]>([]);
	const [showCart, setShowCart] = useState(false);
	const [themeMode, setThemeMode] = useState<"light" | "dark">("dark");
	const cartCount = useMemo(() => cart.reduce((sum, it) => sum + it.qty, 0), [cart]);
	const cartTotal = useMemo(() => cart.reduce((sum, it) => sum + it.price * it.qty, 0), [cart]);

	const data = useMemo<ProductCategory[]>(() => {
		return [
			{
				key: "light",
				title: "LIGHT TANKS",
				tanks: [
					{
						id: "puma-ifv",
						name: "Puma IFV",
						tag: "STANDARD",
						type: "Light Tank - Modern",
						origin: "Modern Era",
						categoryLabel: "Light Tanks - Modern",
						price: 55000,
						imageUri: require("@/assets/images/puma-ifv.webp"),
					},
					{
						id: "begleitpanzer-57",
						name: "Begleitpanzer 57",
						tag: "STANDARD",
						type: "Light Tank - Cold War",
						origin: "Cold War",
						categoryLabel: "Light Tanks - Cold War",
						price: 38000,
						imageUri: require("@/assets/images/Begleitpanzer 57.jpg"),
					},
				],
			},
			{
				key: "medium",
				title: "MEDIUM TANKS",
				tanks: [
					{
						id: "pzkpfw-iv-h",
						name: "Panzerkampfwagen IV H",
						tag: "STANDARD",
						type: "Medium Tank - World War 2",
						origin: "World War 2",
						categoryLabel: "Medium Tanks - World War 2",
						price: 25000,
					},
					{
						id: "panzerkampfwagen-iv-j",
						name: "Panzerkampfwagen IV J",
						tag: "STANDARD",
						type: "Medium Tank - World War 2",
						origin: "World War 2",
						categoryLabel: "Medium Tanks - World War 2",
						price: 29500,
						imageUri: require("@/assets/images/Panzer-IV-J.webp"),
					},
				],
			},
			{
				key: "td",
				title: "TANK DESTROYERS",
				tanks: [
					{
						id: "sturmtiger",
						name: "Sturmmörserwagen 606/4 mit 38 cm RW 61",
						tag: "PREMIUM",
						type: "Assault Gun - World War 2",
						origin: "World War 2",
						categoryLabel: "Assault Gun - World War 2",
						price: 75000,
						imageUri: require("@/assets/images/Sturmtiger.jpg"),
					},
				],
			},
			{
				key: "heavy",
				title: "HEAVY TANKS",
				tanks: [
					{
						id: "panzerkampfwagen-ausf-b-heavy",
						name: "Panzerkampfwagen ausf. B",
						tag: "STANDARD",
						type: "Heavy Tank - World War 2",
						origin: "World War 2",
						categoryLabel: "Heavy Tanks - World War 2",
						price: 45000,
						imageUri: require("@/assets/images/panzerkampfwagen ausf. B.png"),
					},
				],
			},
			{
				key: "modern",
				title: "MODERN TANKS",
				tanks: [
					{
						id: "leopard-2a4",
						name: "Leopard 2A4",
						tag: "STANDARD",
						type: "Medium Tank - World War 2",
						origin: "World War 2",
						categoryLabel: "Medium Tanks - World War 2",
						price: 110000,
						imageUri: require("@/assets/images/Leopard 2A4.jpg"),
					},
				],
			},
		];
	}, []);

	const selectedTank = useMemo(() => {
		if (!selectedTankId) return null;
		for (const cat of data) {
			const found = cat.tanks.find((t) => t.id === selectedTankId);
			if (found) return found;
		}
		return null;
	}, [data, selectedTankId]);

	function addToCart(tank: Tank) {
		setCart((prev) => {
			const idx = prev.findIndex((it) => it.tankId === tank.id);
			if (idx >= 0) {
				const next = [...prev];
				next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
				return next;
			}
			return [...prev, { tankId: tank.id, name: tank.name, price: tank.price, qty: 1 }];
		});
	}

	function dismissModal() {
		setSelectedTankId(null);
	}

	function handleCartPress() {
		console.log("Cart pressed");
		setShowCart(true);
	}

	function handleThemePress() {
		console.log("Theme pressed");
		setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));
	}

	function handleLogout() {
		console.log("Logout pressed");
		if (router?.push) {
			router.push("/login");
		} else {
			Alert.alert("Logged out");
		}
	}

	function removeFromCart(tankId: string) {
		setCart((prev) => prev.filter((it) => it.tankId !== tankId));
	}

	return (
		<View style={styles.screen}>
			{/* NAVBAR */}
			<View style={styles.navWrap}>
				<View style={styles.nav}>
					<ThemedText type="smallBold" style={styles.brand}>
						DE RHEINMETALL
					</ThemedText>

					<View style={styles.navRight}>
						<ThemedText style={styles.email}>test@example.com</ThemedText>

						{/* CART BUTTON (alive) */}
						<Pressable accessibilityRole="button" style={({ pressed }) => [styles.cartBtn, pressed && { opacity: 0.9 }]} onPress={handleCartPress}>
							<View style={styles.cartBtnInner}>
								<CartIcon />
								<ThemedText style={styles.cartBtnText}>Cart</ThemedText>
							</View>
							{cartCount > 0 ? (
								<View style={styles.badge}>
									<ThemedText style={styles.badgeText}>{cartCount > 99 ? "99+" : cartCount}</ThemedText>
								</View>
							) : null}
						</Pressable>

						{/* SWITCH THEME BUTTON */}
						<Pressable
							accessibilityRole="button"
							style={({ pressed }) => [styles.switchThemeBtn, pressed && { opacity: 0.9 }]}
							onPress={() => {
								// TODO: connect to a real theme toggle. For now it's an interactive button.
								console.log("Switch to light and dark mode");
							}}>
							<ThemedText style={styles.switchThemeText}>Switch to light and dark mode</ThemedText>
						</Pressable>

						<Pressable accessibilityRole="button" style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.85 }]}>
							<ThemedText style={styles.logoutText}>Logout</ThemedText>
						</Pressable>
					</View>
				</View>

				{/* SUB TOOLBAR */}
				<View style={styles.toolbar}>
					<View style={styles.searchPill}>
						<ThemedText style={styles.searchPlaceholder}>Search tanks...</ThemedText>
					</View>
					<Pressable accessibilityRole="button" style={({ pressed }) => [styles.filterBtn, pressed && { opacity: 0.85 }]}>
						<ThemedText style={styles.filterText}>Show Filters</ThemedText>
					</Pressable>
				</View>
			</View>

			{/* MAIN */}
			<ScrollView contentContainerStyle={styles.mainScrollContent}>
				<View style={styles.mainGrid}>
					{/* LEFT */}
					<View style={styles.leftColumn}>
						{data.map((cat) => (
							<View key={cat.key}>
								<ThemedText type="smallBold" style={styles.categoryTitle}>
									{cat.title}
								</ThemedText>
								<View style={styles.rule} />

								<View style={styles.cardsGrid}>
									{cat.tanks.map((tank) => (
										<Pressable
											key={tank.id}
											accessibilityRole="button"
											onPress={() => setSelectedTankId(tank.id)}
											style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}>
											<View style={styles.cardInner}>
												<View style={styles.imagePlaceholder}>
													{tank.imageUri ? <Image source={tank.imageUri as any} style={{ width: "100%", height: "100%" }} /> : null}
												</View>

												<View style={styles.cardBody}>
													<ThemedText type="smallBold" style={styles.tankName}>
														{tank.name}
													</ThemedText>
													<ThemedText style={styles.tagText}>{tank.tag}</ThemedText>

													<View style={styles.priceRow}>
														<TokenIcon />
														<ThemedText style={styles.priceText}>${formatPrice(tank.price)}</ThemedText>
													</View>

													<Pressable
														style={({ pressed }) => [styles.addBtn, pressed && { backgroundColor: "#a41e18" }]}
														onPress={(e) => {
															e.stopPropagation?.();
															addToCart(tank);
														}}>
														<ThemedText style={styles.addBtnText}>ADD TO CART</ThemedText>
													</Pressable>
												</View>
											</View>
										</Pressable>
									))}
								</View>
							</View>
						))}
					</View>

					{/* RIGHT (Sticky Cart) */}
					<View style={styles.rightColumn}>
						<View style={styles.cartWidget}>
							<ThemedText type="smallBold" style={styles.cartTitle}>
								YOUR CART 🛒
							</ThemedText>
							<View style={styles.cartGlow} />

							<View style={styles.cartContent}>
								{cart.length === 0 ? (
									<ThemedText style={styles.emptyCart}>Your cart is empty</ThemedText>
								) : (
									<View style={styles.cartItems}>
										{cart.map((it) => (
											<View key={it.tankId} style={styles.cartItemRow}>
												<ThemedText numberOfLines={1} style={styles.cartItemName}>
													{it.name}
												</ThemedText>
												<ThemedText style={styles.cartItemQty}>x{it.qty}</ThemedText>
												<ThemedText style={styles.cartItemPrice}>${formatPrice(it.price * it.qty)}</ThemedText>
											</View>
										))}
									</View>
								)}
							</View>
						</View>
					</View>
				</View>

				{/* FOOTER */}
				<View style={styles.footerWrap}>
					<View style={styles.footerRule} />
					<View style={styles.footerGrid}>
						<View style={styles.footerCol}>
							<ThemedText type="smallBold" style={styles.footerTitle}>
								About
							</ThemedText>
							<ThemedText style={styles.footerText}>Created by Thrian Gello440 A. Razonable</ThemedText>
						</View>

						<View style={styles.footerCol}>
							<ThemedText type="smallBold" style={styles.footerTitle}>
								Products
							</ThemedText>
							<ThemedText style={styles.footerLink}>WW2 Tanks</ThemedText>
							<ThemedText style={styles.footerLink}>Modern Tanks</ThemedText>
						</View>

						<View style={styles.footerCol}>
							<ThemedText type="smallBold" style={styles.footerTitle}>
								Useful Links
							</ThemedText>
							<ThemedText style={styles.footerLink}>Home</ThemedText>
							<ThemedText style={styles.footerLink}>About</ThemedText>
						</View>

						<View style={styles.footerCol}>
							<ThemedText type="smallBold" style={styles.footerTitle}>
								Contact
							</ThemedText>
							<View style={styles.contactRow}>
								<PhoneIcon size={16} />
								<ThemedText style={styles.footerText}>Phone: 09481511874</ThemedText>
							</View>
							<View style={styles.contactRow}>
								<MailIcon size={16} />
								<ThemedText style={styles.footerText}>Email: gello4405@gmail.com</ThemedText>
							</View>
						</View>
					</View>

					<ThemedText style={styles.copyright}>© 2026 German Tank Marketplace. All rights reserved.</ThemedText>
				</View>
			</ScrollView>

			{/* MODAL */}
			<Modal transparent visible={!!selectedTank} animationType="fade" onRequestClose={dismissModal}>
				<View style={styles.modalOverlay} onStartShouldSetResponder={() => true} onResponderRelease={dismissModal}>
					<Pressable
						style={({ pressed }) => [styles.modalCard, pressed && { opacity: 0.98 }]}
						onPress={(e) => {
							e.stopPropagation?.();
						}}>
						{selectedTank ? (
							<View>
								<View style={styles.modalHeaderRow}>
									<View>
										<ThemedText type="smallBold" style={styles.modalTitle}>
											{selectedTank.name}
										</ThemedText>
										<ThemedText style={styles.modalMeta}>Type: {selectedTank.type}</ThemedText>
										<ThemedText style={styles.modalMeta}>Origin: {selectedTank.origin}</ThemedText>
									</View>
									<Pressable accessibilityRole="button" style={({ pressed }) => [styles.modalClose, pressed && { opacity: 0.8 }]} onPress={dismissModal}>
										<XIcon />
									</Pressable>
								</View>

								<View style={styles.modalPreview}>
									<View style={styles.modalPreviewPlaceholder}>
										{selectedTank.imageUri ? <Image source={selectedTank.imageUri as any} style={{ width: "100%", height: "100%" }} /> : null}
									</View>
								</View>

								<View style={styles.modalBottomButtons}>
									<Pressable
										accessibilityRole="button"
										style={({ pressed }) => [styles.buyNowBtn, pressed && { backgroundColor: "#a41e18" }]}
										onPress={() => dismissModal()}>
										<ThemedText style={styles.buyNowBtnText}>BUY NOW</ThemedText>
									</Pressable>

									<Pressable
										accessibilityRole="button"
										style={({ pressed }) => [styles.addModalBtn, pressed && { backgroundColor: "#a41e18" }]}
										onPress={() => {
											addToCart(selectedTank);
											dismissModal();
										}}>
										<ThemedText style={styles.addModalBtnText}>ADD TO CART</ThemedText>
									</Pressable>
								</View>
							</View>
						) : null}
					</Pressable>
				</View>
			</Modal>

			{/* CART MODAL */}
			<Modal transparent visible={showCart} animationType="slide" onRequestClose={() => setShowCart(false)}>
				<View style={styles.cartModalOverlay}>
					<View style={styles.cartModalContent}>
						<View style={styles.cartModalHeader}>
							<ThemedText type="smallBold" style={styles.cartModalTitle}>
								YOUR CART 🛒
							</ThemedText>
							<Pressable
								accessibilityRole="button"
								style={({ pressed }) => [styles.cartModalClose, pressed && { opacity: 0.8 }]}
								onPress={() => setShowCart(false)}>
								<XIcon />
							</Pressable>
						</View>

						<View style={styles.cartModalDivider} />

						<ScrollView style={styles.cartModalScroll}>
							{cart.length === 0 ? (
								<View style={styles.cartModalEmpty}>
									<ThemedText style={styles.cartModalEmptyText}>Your cart is empty</ThemedText>
								</View>
							) : (
								<View style={styles.cartModalItems}>
									{cart.map((item) => (
										<View key={item.tankId} style={styles.cartModalItem}>
											<View style={styles.cartModalItemInfo}>
												<ThemedText style={styles.cartModalItemName}>{item.name}</ThemedText>
												<View style={styles.cartModalItemPriceRow}>
													<TokenIcon size={16} />
													<ThemedText style={styles.cartModalItemPrice}>{formatPrice(item.price)}</ThemedText>
												</View>
											</View>
											<View style={styles.cartModalItemActions}>
												<ThemedText style={styles.cartModalItemQty}>x{item.qty}</ThemedText>
												<Pressable
													accessibilityRole="button"
													style={({ pressed }) => [styles.cartModalRemoveBtn, pressed && { opacity: 0.6 }]}
													onPress={() => removeFromCart(item.tankId)}>
													<XIcon size={16} />
												</Pressable>
											</View>
										</View>
									))}
								</View>
							)}
						</ScrollView>

						{cart.length > 0 && (
							<>
								<View style={styles.cartModalDivider} />

								<View style={styles.cartModalTotal}>
									<ThemedText type="smallBold" style={styles.cartModalTotalLabel}>
										Total:
									</ThemedText>
									<View style={styles.cartModalTotalPriceRow}>
										<TokenIcon size={18} />
										<ThemedText style={styles.cartModalTotalPrice}>{formatPrice(cartTotal)}</ThemedText>
									</View>
								</View>

								<Pressable
									accessibilityRole="button"
									style={({ pressed }) => [styles.checkoutBtn, pressed && { backgroundColor: "#a41e18" }]}
									onPress={() => {
										setShowCart(false);
										// Handle checkout here
									}}>
									<ThemedText style={styles.checkoutBtnText}>CHECKOUT</ThemedText>
								</Pressable>
							</>
						)}
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: "#0b0b0b",
	},

	navWrap: {
		borderBottomWidth: 1,
		borderBottomColor: "rgba(184,38,30,0.9)",
		position: "relative",
		zIndex: 10020,
		elevation: 10020,
		pointerEvents: "auto",
	},
	nav: {
		paddingHorizontal: 18,
		paddingTop: 14,
		paddingBottom: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderTopWidth: 1,
		borderTopColor: "rgba(184,38,30,0.8)",
		pointerEvents: "auto",
		zIndex: 10021,
		elevation: 10021,
	},
	navRight: {
		flexDirection: "row",
		alignItems: "center",
		gap: 14,
		position: "relative",
		zIndex: 10022,
		elevation: 10022,
		pointerEvents: "auto",
	},
	brand: {
		color: CRIMSON,
		fontSize: 16,
		fontWeight: "900",
		letterSpacing: 0.5,
	},
	email: {
		color: "#ffffff",
		fontSize: 13,
		opacity: 0.9,
		marginRight: 4,
	},
	cartBtn: {
		width: 140,
		height: 40,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#121212",
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.06)",
		pointerEvents: "auto",
		zIndex: 10023,
		elevation: 10023,
	},
	cartBtnInner: {
		flexDirection: "row",
		gap: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	cartBtnText: {
		color: "#ffffff",
		fontWeight: "900",
		fontSize: 13,
	},

	badge: {
		position: "absolute",
		top: 3,
		right: 3,
		width: 20,
		height: 20,
		borderRadius: 10,
		backgroundColor: CRIMSON,
		justifyContent: "center",
		alignItems: "center",
		shadowColor: CRIMSON,
		shadowOpacity: 0.5,
		shadowRadius: 10,
		elevation: 6,
	},
	badgeText: {
		color: "#ffffff",
		fontSize: 11,
		fontWeight: "900",
		lineHeight: 11,
	},
	iconBtn: {
		width: 40,
		height: 40,
		borderRadius: 12,
		backgroundColor: "#121212",
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.05)",
	},
	logoutBtn: {
		backgroundColor: "#101010",
		borderRadius: 12,
		paddingHorizontal: 14,
		paddingVertical: 10,
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.06)",
		pointerEvents: "auto",
		zIndex: 10023,
		elevation: 10023,
	},
	logoutText: {
		color: "#ffffff",
		fontWeight: "900",
		fontSize: 13,
	},

	switchThemeBtn: {
		height: 40,
		paddingHorizontal: 14,
		borderRadius: 12,
		backgroundColor: "#101010",
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.06)",
		justifyContent: "center",
		alignItems: "center",
		pointerEvents: "auto",
		zIndex: 10023,
		elevation: 10023,
	},
	switchThemeText: {
		color: "#ffffff",
		fontWeight: "900",
		fontSize: 12,
		textAlign: "center",
	},

	toolbar: {
		paddingHorizontal: 18,
		paddingBottom: 16,
		paddingTop: 10,
		flexDirection: "row",
		gap: 12,
		alignItems: "center",
	},
	searchPill: {
		flex: 1,
		height: 44,
		backgroundColor: "#101010",
		borderRadius: 999,
		borderWidth: 1,
		borderColor: "rgba(184,38,30,0.45)",
		justifyContent: "center",
		paddingHorizontal: 16,
	},
	searchPlaceholder: {
		color: "#8a8a8a",
		fontWeight: "700",
		fontSize: 13,
	},
	filterBtn: {
		height: 44,
		paddingHorizontal: 14,
		borderRadius: 999,
		backgroundColor: "#101010",
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.08)",
		justifyContent: "center",
		alignItems: "center",
	},
	filterText: {
		color: "#ffffff",
		fontWeight: "900",
		fontSize: 13,
	},

	mainScrollContent: {
		paddingBottom: 18,
	},
	mainGrid: {
		flexDirection: "row",
		paddingHorizontal: 18,
		paddingTop: 16,
		alignItems: "flex-start",
		gap: 18,
	},
	leftColumn: {
		flex: 1,
		minWidth: 0,
	},
	rightColumn: {
		width: 320,
		maxWidth: "35%",
	},

	categoryTitle: {
		color: CRIMSON,
		fontSize: 15,
		fontWeight: "900",
		letterSpacing: 0.3,
		marginTop: 12,
	},
	rule: {
		height: 1,
		backgroundColor: CRIMSON,
		opacity: 0.95,
		marginTop: 10,
		marginBottom: 14,
	},

	cardsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 14,
	},

	card: {
		width: 300,
		backgroundColor: "#141414",
		borderRadius: 16,
		padding: 14,
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.06)",
		shadowColor: CRIMSON,
		shadowOpacity: 0.12,
		shadowRadius: 20,
		elevation: 2,
	},
	cardInner: {
		flexDirection: "row",
		gap: 12,
		alignItems: "stretch",
	},
	imagePlaceholder: {
		width: 100,
		height: 100,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.14)",
		backgroundColor: "#0d0d0d",
		overflow: "hidden",
	},
	cardBody: {
		flex: 1,
		minWidth: 0,
		justifyContent: "space-between",
	},
	tankName: {
		color: "#ffffff",
		fontSize: 14,
		fontWeight: "900",
		marginBottom: 6,
	},
	tagText: {
		color: "#bdbdbd",
		fontWeight: "800",
		fontSize: 12,
		marginBottom: 8,
	},
	priceRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginBottom: 10,
	},
	priceText: {
		color: GOLD,
		fontWeight: "900",
		fontSize: 14,
	},
	addBtn: {
		backgroundColor: CRIMSON,
		borderRadius: 12,
		paddingVertical: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	addBtnText: {
		color: "#ffffff",
		fontWeight: "900",
		fontSize: 13,
	},

	cartWidget: {
		backgroundColor: "#121212",
		borderRadius: 16,
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.06)",
		padding: 16,
		position: "relative",
	},
	cartGlow: {
		position: "absolute",
		top: -8,
		left: -8,
		right: -8,
		bottom: -8,
		borderRadius: 22,
		shadowColor: CRIMSON,
		shadowOpacity: 0.55,
		shadowRadius: 22,
		elevation: 8,
		pointerEvents: "none",
	},
	cartTitle: {
		color: "#ffffff",
		fontWeight: "900",
		fontSize: 14,
		letterSpacing: 0.2,
		marginBottom: 14,
	},
	cartContent: {
		marginTop: 6,
	},
	emptyCart: {
		color: "#bdbdbd",
		fontWeight: "800",
		fontSize: 13,
	},
	cartItems: {
		gap: 10,
	},
	cartItemRow: {
		flexDirection: "row",
		gap: 10,
		alignItems: "center",
		justifyContent: "space-between",
	},
	cartItemName: {
		color: "#ffffff",
		fontWeight: "900",
		flex: 1,
		fontSize: 12,
	},
	cartItemQty: {
		color: "#bdbdbd",
		fontWeight: "900",
		fontSize: 12,
		marginRight: 6,
	},
	cartItemPrice: {
		color: GOLD,
		fontWeight: "900",
		fontSize: 12,
	},

	footerWrap: {
		marginTop: 26,
		paddingHorizontal: 18,
	},
	footerRule: {
		height: 1,
		backgroundColor: CRIMSON,
		opacity: 0.9,
		marginBottom: 14,
	},
	footerGrid: {
		flexDirection: "row",
		borderTopWidth: 1,
		borderTopColor: "rgba(184,38,30,0.3)",
	},
	footerCol: {
		flex: 1,
		padding: 14,
		borderRightWidth: 1,
		borderRightColor: "rgba(184,38,30,0.3)",
	},
	footerTitle: {
		color: CRIMSON,
		fontWeight: "900",
		marginBottom: 10,
	},
	footerText: {
		color: "#bdbdbd",
		fontWeight: "700",
		fontSize: 12,
	},
	footerLink: {
		color: "#b8261e",
		fontWeight: "900",
		fontSize: 12,
		marginBottom: 10,
	},
	contactRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		marginBottom: 8,
	},
	copyright: {
		marginTop: 18,
		textAlign: "center",
		color: "#6b6b6b",
		fontSize: 12,
		fontWeight: "700",
	},

	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.65)",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 22,
	},
	modalCard: {
		width: "100%",
		maxWidth: 620,
		backgroundColor: "#151515",
		borderRadius: 18,
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.06)",
		padding: 18,
		shadowColor: CRIMSON,
		shadowOpacity: 0.55,
		shadowRadius: 28,
		elevation: 16,
	},
	modalHeaderRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 12,
		alignItems: "flex-start",
	},
	modalTitle: {
		color: "#ffffff",
		fontSize: 18,
		fontWeight: "900",
		marginBottom: 8,
	},
	modalMeta: {
		color: "#bdbdbd",
		fontWeight: "800",
		fontSize: 13,
		marginBottom: 4,
	},
	modalClose: {
		width: 44,
		height: 44,
		borderRadius: 14,
		backgroundColor: "#0f0f0f",
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.06)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalPreview: {
		marginTop: 18,
		alignItems: "center",
	},
	modalPreviewPlaceholder: {
		width: 140,
		height: 140,
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.14)",
		backgroundColor: "#0d0d0d",
		borderRadius: 16,
		overflow: "hidden",
	},
	modalBottomButtons: {
		flexDirection: "row",
		gap: 14,
		marginTop: 20,
	},
	buyNowBtn: {
		flex: 1,
		backgroundColor: CRIMSON,
		borderRadius: 14,
		paddingVertical: 12,
		alignItems: "center",
		justifyContent: "center",
	},
	buyNowBtnText: {
		color: "#ffffff",
		fontWeight: "900",
		fontSize: 13,
	},
	addModalBtn: {
		flex: 1,
		backgroundColor: "#0f0f0f",
		borderRadius: 14,
		paddingVertical: 12,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: "rgba(184,38,30,0.8)",
	},
	addModalBtnText: {
		color: CRIMSON,
		fontWeight: "900",
		fontSize: 13,
	},

	// Cart Modal Styles
	cartModalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.75)",
		justifyContent: "flex-end",
	},
	cartModalContent: {
		backgroundColor: "#0b0b0b",
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		borderTopWidth: 1,
		borderLeftWidth: 1,
		borderRightWidth: 1,
		borderTopColor: "rgba(184,38,30,0.7)",
		borderLeftColor: "rgba(184,38,30,0.5)",
		borderRightColor: "rgba(184,38,30,0.5)",
		maxHeight: "90%",
		paddingTop: 18,
		paddingHorizontal: 18,
		paddingBottom: 18,
	},
	cartModalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	cartModalTitle: {
		color: CRIMSON,
		fontSize: 18,
		fontWeight: "900",
		letterSpacing: 0.4,
	},
	cartModalClose: {
		width: 40,
		height: 40,
		borderRadius: 10,
		backgroundColor: "#1a1a1a",
		borderWidth: 1,
		borderColor: "rgba(184,38,30,0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	cartModalDivider: {
		height: 1,
		backgroundColor: CRIMSON,
		opacity: 0.7,
		marginBottom: 16,
	},
	cartModalScroll: {
		maxHeight: 380,
	},
	cartModalEmpty: {
		paddingVertical: 40,
		justifyContent: "center",
		alignItems: "center",
	},
	cartModalEmptyText: {
		color: "#8a8a8a",
		fontWeight: "800",
		fontSize: 14,
	},
	cartModalItems: {
		gap: 12,
	},
	cartModalItem: {
		backgroundColor: "#1a1a1a",
		borderRadius: 14,
		borderWidth: 1,
		borderColor: "rgba(184,38,30,0.4)",
		padding: 14,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	cartModalItemInfo: {
		flex: 1,
		minWidth: 0,
	},
	cartModalItemName: {
		color: "#ffffff",
		fontWeight: "900",
		fontSize: 13,
		marginBottom: 8,
	},
	cartModalItemPriceRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	cartModalItemPrice: {
		color: GOLD,
		fontWeight: "900",
		fontSize: 12,
	},
	cartModalItemActions: {
		flexDirection: "row",
		alignItems: "center",
		gap: 14,
		marginLeft: 12,
	},
	cartModalItemQty: {
		color: "#bdbdbd",
		fontWeight: "900",
		fontSize: 13,
		minWidth: 40,
		textAlign: "right",
	},
	cartModalRemoveBtn: {
		width: 32,
		height: 32,
		borderRadius: 8,
		backgroundColor: "#2a2a2a",
		borderWidth: 1,
		borderColor: "rgba(184,38,30,0.6)",
		justifyContent: "center",
		alignItems: "center",
	},
	cartModalTotal: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 16,
		paddingHorizontal: 2,
	},
	cartModalTotalLabel: {
		color: "#ffffff",
		fontSize: 14,
		fontWeight: "900",
	},
	cartModalTotalPriceRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	cartModalTotalPrice: {
		color: GOLD,
		fontWeight: "900",
		fontSize: 16,
	},
	checkoutBtn: {
		backgroundColor: CRIMSON,
		borderRadius: 14,
		paddingVertical: 14,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 8,
	},
	checkoutBtnText: {
		color: "#ffffff",
		fontWeight: "900",
		fontSize: 14,
	},
});
