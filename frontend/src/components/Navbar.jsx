import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, MessageCircle } from "lucide-react";
import useLogout from "../hooks/useLogout";
import { useState } from "react";

const Navbar = () => {
    const { authUser } = useAuthUser();
    const location = useLocation();
    const isChatPage = location.pathname?.startsWith("/chat");

    const { logoutMutation } = useLogout();


    const [showLogoutModal, setShowLogoutModal] = useState(false);

    return (
        <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-end w-full">
                    {/* LOGO - ONLY IN THE CHAT PAGE */}
                    {isChatPage && (
                        <div className="pl-5">
                            <Link to="/" className="flex items-center gap-2.5">
                                <MessageCircle className="size-6 text-primary" />
                                <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary  tracking-wider">
                                    Connectly
                                </span>
                            </Link>
                        </div>
                    )}

                    <div className="flex items-center gap-3 sm:gap-4 ml-auto">
                        <Link to="/notifications" className="btn btn-ghost btn-circle hover:bg-gray-700/60">
                            <BellIcon className="size-5 text-base-content opacity-70" />
                        </Link>
                    </div>

                    <Link to="/profile" className="avatar cursor-pointer btn btn-ghost btn-circle hover:bg-gray-700/60">
                        <div className="w-9 rounded-full">
                            <img
                                src={authUser?.profilePic}
                                alt="User Avatar"
                            />
                        </div>
                    </Link>

                    {/* Logout button */}
                    <button className="btn btn-ghost btn-circle hover:bg-gray-700/60" onClick={() => setShowLogoutModal(true)}>
                        <LogOutIcon className="size-5 text-base-content opacity-70" />
                    </button>
                </div>
            </div>

            {showLogoutModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">
                            Are you sure you want to logout?
                        </h3>

                        <p className="py-4 opacity-70">
                            You will need to login again to access your account.
                        </p>

                        <div className="modal-action">
                            <button
                                className="btn btn-ghost"
                                onClick={() => setShowLogoutModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="btn btn-error"
                                onClick={() => {
                                    logoutMutation();
                                    setShowLogoutModal(false);
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};
export default Navbar;