// src/lib/apiClient.js
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useMemo } from "react";

// Use a named export for the hook
export const useApiClient = () => {
	const { getToken } = useAuth(); // Memoize the client to prevent re-creating it on every render

	const client = useMemo(() => {
		const axiosInstance = axios.create({
			baseURL: "http://localhost:4000/api",
		}); // The interceptor runs on every request to attach a fresh token

		axiosInstance.interceptors.request.use(async (config) => {
			const token = await getToken();
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		});

		return axiosInstance;
	}, [getToken]);

	return client;
};
