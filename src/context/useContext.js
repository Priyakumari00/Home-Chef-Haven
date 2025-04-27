import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { omit } from "../utils";

export const useContextData = () => {
	// Loading State
	const [isLoading, setIsLoading] = useState(false);

	// Snackbar
	const [snack, setSnack] = useState({
		text: "Snackbar Message",
		bgColor: "var(--indigo)",
		color: "var(--white)",
	});
	const [openSnackBar, setOpenSnackBar] = useState(false);

	// Authentication State
	const isLocalAuthenticated = localStorage.getItem("isAuthenticated");
	const [isAuthenticated, setIsAuthenticated] = useState(
		JSON.parse(isLocalAuthenticated) || false
	);

	// User State
	const [user, setUser] = useState(
		JSON.parse(localStorage.getItem("user")) || null
	);

	const updateUser = (newUser) => {
		localStorage.removeItem("user");
		setUser(null);
		localStorage.setItem(
			"user",
			JSON.stringify(omit({ ...user, ...newUser }, "password"))
		);
		setUser((p) => ({ ...p, ...newUser }));
	};

	const verifyUser = async () => {
		try {
			setIsLoading(true);
			const res = await axiosInstance.get("/api/auth");
			setUser(res.data.user);
			localStorage.setItem("user", JSON.stringify(res.data.user));
			setIsLoading(false);
		} catch (error) {
			handleError(error);
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			localStorage.setItem("isAuthenticated", false);
			setUser(null);
			setIsAuthenticated(false);
		}
	};

	const getUserProfile = async (username) => {
		try {
			const res = await axiosInstance.get(`/api/auth/profile/${username}`);
			return res.data.user;
		} catch (error) {
			handleError(error);
		}
	};

	// Recipes State
	const [recipes, setRecipes] = useState([]);

	const getAllRecipes = async () => {
		try {
			setIsLoading(true);
			const res = await axiosInstance.get("/api/recipe");
			setRecipes([...res.data.allRecipes]);
			setIsLoading(false);
		} catch (error) {
			handleError(error);
		}
	};

	const getSingleRecipe = async (id) => {
		try {
			const res = await axiosInstance.get(`/api/recipe/${id}`);
			return res.data;
		} catch (error) {
			handleError(error);
		}
	};

	const addNewRecipe = async (newRecipe) => {
		try {
			setIsLoading(true);
			const res = await axiosInstance.post("/api/recipe/add", newRecipe);
			if (res.status === 200) {
				showSuccess(res.data.message);
				setRecipes((prev) => [...prev, res.data.newRecipe]);
			}
			setIsLoading(false);
		} catch (error) {
			handleError(error);
		}
	};

	const updateOneRecipe = async (id, updatedRecipe) => {
		try {
			setIsLoading(true);
			const res = await axiosInstance.put(`/api/recipe/edit/${id}`, updatedRecipe);
			setRecipes((prev) =>
				prev.map((recipe) =>
					recipe._id === id ? res.data.updatedRecipe : recipe
				)
			);
			showSuccess(res.data.message);
			setIsLoading(false);
		} catch (error) {
			handleError(error);
		}
	};

	const getAllRecipesByUsername = async (username) => {
		try {
			setIsLoading(true);
			const res = await axiosInstance.get(`/api/recipe/${username}/recipes`);
			setIsLoading(false);
			return res.data.allRecipes;
		} catch (error) {
			handleError(error);
		}
	};

	const saveRecipe = async (id) => {
		try {
			setIsLoading(true);
			const res = await axiosInstance.put(`/api/recipe/save/${id}`);
			showSuccess(res.data.message);
			updateUser(res.data.user);
			setIsLoading(false);
		} catch (error) {
			handleError(error);
		}
	};

	const unSaveRecipe = async (id) => {
		try {
			setIsLoading(true);
			const res = await axiosInstance.put(`/api/recipe/unsave/${id}`);
			showSuccess(res.data.message);
			updateUser(res.data.user);
			setIsLoading(false);
		} catch (error) {
			handleError(error);
		}
	};

	const getSavedRecipes = async () => {
		try {
			setIsLoading(true);
			const res = await axiosInstance.get(`/api/recipe/saved`);
			setIsLoading(false);
			return res.data.recipes;
		} catch (error) {
			handleError(error);
		}
	};

	// Theme Management
	const [theme, setTheme] = useState(
		localStorage.getItem("theme") || "light"
	);

	const toggleTheme = () => {
		document.body.className = theme === "light" ? "dark" : "light";
		const newTheme = theme === "light" ? "dark" : "light";
		localStorage.setItem("theme", newTheme);
		setTheme(newTheme);
	};

	// Breakpoints
	const mediaQuerySm = window.matchMedia("(max-width: 672px)");
	const mediaQueryMd = window.matchMedia("(max-width: 880px)");
	const mediaQueryLg = window.matchMedia("(min-width: 880px)");

	const breakpoint = (device) => {
		if (device === "mobile") return mediaQuerySm.matches;
		else if (device === "tab") return mediaQueryMd.matches;
		else return mediaQueryLg.matches;
	};

	// Utility Functions
	const handleError = (error) => {
		setSnack({
			text: error?.response?.data?.message || "Something went wrong!",
			bgColor: "var(--red)",
			color: "var(--white)",
		});
		setOpenSnackBar(true);
		setTimeout(() => setOpenSnackBar(false), 5000);
		setIsLoading(false);
	};

	const showSuccess = (message) => {
		setSnack({
			text: message,
			bgColor: "var(--green)",
			color: "var(--white)",
		});
		setOpenSnackBar(true);
		setTimeout(() => setOpenSnackBar(false), 5000);
	};

	return {
		theme,
		toggleTheme,
		breakpoint,
		isLoading,
		setIsLoading,
		snack,
		setSnack,               // ← add this
		openSnackBar,
		setOpenSnackBar,
		isAuthenticated,
		setIsAuthenticated,
		user,
		setUser,
		updateUser,
		verifyUser,
		recipes,
		setRecipes,
		getAllRecipes,
		getSingleRecipe,
		addNewRecipe,
		updateOneRecipe,
		getUserProfile,
		getAllRecipesByUsername,
		saveRecipe,
		unSaveRecipe,
		getSavedRecipes,
	};
};
