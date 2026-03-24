"use client";

export default function Sidebar() {
    return (
        <div className="w-64 h-screen bg-black text-white p-5">
            <h1 className="text-xl font-bold mb-10">🏋️ Gym Admin</h1>

            <ul className="space-y-4">
                <li className="hover:text-gray-300 cursor-pointer">
                    Dashboard
                </li>
                <li className="hover:text-gray-300 cursor-pointer">
                    Members
                </li>
                <li className="hover:text-gray-300 cursor-pointer">
                    Payments
                </li>
            </ul>
        </div>
    );
}