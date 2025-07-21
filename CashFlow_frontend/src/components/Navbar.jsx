import { Button } from "@/components/ui/button";
import {
	SignInButton,
	SignUpButton,
	UserButton,
	useUser,
} from "@clerk/clerk-react";
import { Wallet } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import useRegisterUser from "../store/useRegisterUser";

export default function Navbar() {
	const { isSignedIn, user } = useUser();

	const { loading, error } = useRegisterUser({ isSignedIn, user });

	return (
		<nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
			{loading && <p className="text-sm text-slate-500">Registering user…</p>}
			{error && <p className="text-sm text-red-500">{error}</p>}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<Link
						to="/"
						className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
					>
						<div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
							<Wallet className="h-6 w-6 text-white" />
						</div>
						<span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
							CashFlow
						</span>
					</Link>

					{/* Auth buttons */}
					<div className="flex items-center space-x-4">
						{isSignedIn ? (
							<>
								<NavLink
									to="/analysisPage"
									// ✅ Add a margin-right for spacing
									className={({ isActive }) => `mr-4 ${isActive ? "font-bold" : ""}`} >

									{/* ✅ Add gradient classes for a custom blue style */}
									<Button className="mr-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow">
										Get Detailed Analysis
									</Button>
								</NavLink>

								{/* Clerk UserButton (profile & sign out) */}
								<UserButton
									appearance={{
										elements: {
											avatarBox: "h-8 w-8",
										},
									}}
								/>
							</>
						) : (
							<>
								<SignInButton mode="modal">
									<Button
										variant="ghost"
										className="text-slate-600 hover:text-slate-900"
									>
										Sign In
									</Button>
								</SignInButton>
								<SignUpButton mode="modal">
									<Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
										Get Started
									</Button>
								</SignUpButton>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}
