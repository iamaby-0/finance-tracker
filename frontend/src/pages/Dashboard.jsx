import useAuth from "../hooks/useAuth";

export function Dashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-black text-white font-bold flex items-center justify-center text-sm">
                            ₹
                        </div>
                        <span className="font-semibold text-lg text-gray-900 tracking-tight">Finance Tracker</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {user?.profilePicture ? (
                            <img
                                src={user.profilePicture}
                                alt={user.name || "User"}
                                className="w-9 h-9 rounded-full object-cover border border-gray-200"
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-700 font-semibold flex items-center justify-center text-sm">
                                {user?.name ? user.name[0].toUpperCase() : "U"}
                            </div>
                        )}
                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-medium text-gray-900">{user?.name || "Welcome"}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="ml-2 px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 border border-gray-200 rounded-lg transition"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-xs">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Welcome back, {user?.name || "Friend"}! 👋
                    </h1>
                    <p className="text-sm text-gray-600 mb-6">
                        You have successfully signed in with <span className="font-semibold text-gray-800">{user?.authProvider === "google" ? "Google" : "Email"}</span> ({user?.email}).
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                        <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                            <span className="text-xs font-medium text-gray-500">Account Type</span>
                            <p className="text-base font-semibold text-gray-900 capitalize mt-1">
                                {user?.authProvider || "Local"}
                            </p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                            <span className="text-xs font-medium text-gray-500">Occupation</span>
                            <p className="text-base font-semibold text-gray-900 capitalize mt-1">
                                {user?.occupation || "Not set"}
                            </p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                            <span className="text-xs font-medium text-gray-500">Currency</span>
                            <p className="text-base font-semibold text-gray-900 mt-1">
                                {user?.currency || "INR"}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;