import { useEffect, useState, useRef } from "react";
import { useApiClient } from "../lib/apiClient";
import { showErrorToast } from '../lib/toast';

/**
 * Automatically registers the signed-in user with your backend (once per session).
 */
export default function useRegisterUser({ isSignedIn, user }) {
	const apiClient = useApiClient();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const hasRegistered = useRef(false);

	useEffect(() => {
		if (!isSignedIn || !user || hasRegistered.current) return;

		const registerUser = async () => {
			setLoading(true);
			setError(null);

			try {
				await apiClient.post("/users/register", {
					email: user.primaryEmailAddress?.emailAddress,
					name: user.fullName,
					imageUrl: user.imageUrl,
				});
				hasRegistered.current = true;
			} catch (err) {
				showErrorToast(err);
				console.error("Backend registration failed", err);
				setError(err?.response?.data?.message || err.message);
			} finally {
				setLoading(false);
			}
		};

		registerUser();
	}, [isSignedIn, user]);

	return { loading, error };
}
