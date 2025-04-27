import axiosInstance from "../utils/axiosInstance";


import { createContext } from "react";

const GlobalContext = createContext({
	theme: "",
	setTheme: () => {},
	toggleTheme: () => {},
	breakpoint: () => {},
	isLoading: "",
	setIsLoading: () => {},
	snack: {},
	setSnack: () => {},
	openSnackBar: false,
	setOpenSnackBar: () => {},
	isAuthenticated: "",
	setIsAuthenticated: () => {},
	user: undefined,
	setUser: () => {},
	updateUser: () => {},
	verifyUser: () => {},
	axiosInstance: axiosInstance, // ✅ use the imported instance here
	recipes: [],
	setRecipes: () => {},
	getAllRecipes: () => {},
	getSingleRecipe: () => {},
	addNewRecipe: () => {},
	updateOneRecipe: () => {},
	getUserProfile: () => {},
	getAllRecipesByUsername: () => {},
	saveRecipe: () => {},
	unSaveRecipe: () => {},
	getSavedRecipes: () => {},
});

export default GlobalContext;
