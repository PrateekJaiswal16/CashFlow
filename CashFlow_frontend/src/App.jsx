import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Toaster } from "@/components/ui/sonner"; 
import Navbar from "./components/Navbar";
import LandingPage from "./pages/Landing";
import HomePage from "./pages/Home";
import AnalysisPage from "./pages/AnalysisPage";


const App = () => {
	const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="text-center mt-8">Loading...</div>;
  }

	return (
		<BrowserRouter>
			<div className="min-h-screen flex flex-col">
				<Navbar />

				<main className="flex-1">
					<Routes>
						<Route
							path="/"
							element={
								!isSignedIn ? <LandingPage /> : <Navigate to="/home" replace />
							}
						/>
						<Route
							path="/home"
							element={isSignedIn ? <HomePage /> : <Navigate to="/" replace />}
						/>
						<Route
							path="/analysisPage"
							element={isSignedIn ? <AnalysisPage /> : <Navigate to="/" replace />}
						/>
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</main>
				<Toaster 
					richColors 
					position="top-right"
					toastOptions={{
					classNames: {
						toast: 'bg-blue-50 border-blue-200 text-slate-900',
						title: 'text-blue-900 font-semibold',
						description: 'text-blue-800',
						loading: 'border-blue-500', 
					},
					}}
				/>
			</div>
		</BrowserRouter>
	);
};

export default App;
