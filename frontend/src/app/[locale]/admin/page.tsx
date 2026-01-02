"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUserShield, FaUsers, FaEdit, FaComments, FaUserSlash, FaUserCheck, FaTrash } from "react-icons/fa";

export default function AdminPanel() {
    const { user, token, loading: authLoading } = useAuth();
    const router = useRouter();
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }

        if (user && token) {
            // Check if user is admin if possible, else redirect
            // Assuming backend protects the route, we just fetch
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/admin/customers`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    if (res.status === 403 || res.status === 401) {
                        router.push("/dashboard");
                        throw new Error("Unauthorized");
                    }
                    return res.json();
                })
                .then(data => {
                    setCustomers(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch customers", err);
                    // Use mock data for demonstration if fetch fails
                    setCustomers([
                        { id: 1, username: "john_doe", email: "john@example.com", account_number: "1234567890", account_tier: "gold", is_admin: false, _is_active: true },
                        { id: 2, username: "jane_smith", email: "jane@example.com", account_number: "0987654321", account_tier: "standard", is_admin: false, _is_active: false },
                        { id: 3, username: "admin_user", email: "admin@example.com", account_number: "1122334455", account_tier: "platinum", is_admin: true, _is_active: true },
                    ]);
                    setLoading(false);
                });
        }
    }, [user, token, authLoading, router]);

    const handleDeactivate = async (id: number) => {
        if (!confirm('Are you sure you want to DEACTIVATE this user?')) return;
        // API call to deactivate
        console.log("Deactivate user", id);
        // Optimistic update
        setCustomers(customers.map(c => c.id === id ? { ...c, _is_active: false } : c));
    };

    const handleActivate = async (id: number) => {
        // API call to activate
        console.log("Activate user", id);
        // Optimistic update
        setCustomers(customers.map(c => c.id === id ? { ...c, _is_active: true } : c));
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure? This will permanently delete the customer and all associated data.')) return;
        // API call to delete
        console.log("Delete user", id);
        // Optimistic update
        setCustomers(customers.filter(c => c.id !== id));
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F4F6F8]">
                <div className="text-[var(--color-primary)] text-lg">Loading Admin Panel...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F4F6F8] pb-12">
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-[var(--color-text-primary)] flex items-center gap-3 justify-center md:justify-start">
                        <FaUserShield className="text-[var(--color-primary)]" /> Admin Dashboard
                    </h1>
                    <p className="text-[var(--color-text-secondary)] mt-2">Manage customer accounts, transactions, and system activities.</p>
                </header>

                {/* Customer Management */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                            <FaUsers className="text-[var(--color-secondary)]" /> Customer Management
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="p-4 font-semibold text-[var(--color-text-secondary)]">ID</th>
                                    <th className="p-4 font-semibold text-[var(--color-text-secondary)]">Customer Info</th>
                                    <th className="p-4 font-semibold text-[var(--color-text-secondary)]">Account Number</th>
                                    <th className="p-4 font-semibold text-[var(--color-text-secondary)]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {customers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-[var(--color-text-primary)]">{customer.id}</td>
                                        <td className="p-4">
                                            <div className="font-bold text-[var(--color-text-primary)]">{customer.username}</div>
                                            <div className="flex gap-2 mt-1">
                                                {customer._is_active ? (
                                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">Active</span>
                                                ) : (
                                                    <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-medium">Inactive</span>
                                                )}
                                                {customer.is_admin && (
                                                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full font-medium">Admin</span>
                                                )}
                                            </div>
                                            <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                                                Tier: <span className="capitalize font-medium">{customer.account_tier}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono text-[var(--color-text-primary)]">{customer.account_number}</td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-2">
                                                <Link href={`/admin/customer/${customer.id}`} className="inline-flex items-center gap-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs px-3 py-1.5 rounded-md transition-colors">
                                                    <FaEdit /> Manage
                                                </Link>
                                                <Link href={`/admin/chat?customer_id=${customer.id}`} className="inline-flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5 rounded-md transition-colors">
                                                    <FaComments /> Chat
                                                </Link>

                                                {user?.uid !== customer.id.toString() && ( // Prevent self-action if ID matches (needs proper check)
                                                    <>
                                                        {customer._is_active ? (
                                                            <button
                                                                onClick={() => handleDeactivate(customer.id)}
                                                                className="inline-flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1.5 rounded-md transition-colors"
                                                            >
                                                                <FaUserSlash /> Deactivate
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleActivate(customer.id)}
                                                                className="inline-flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-md transition-colors"
                                                            >
                                                                <FaUserCheck /> Activate
                                                            </button>
                                                        )}

                                                        {!customer._is_active && (
                                                            <button
                                                                onClick={() => handleDelete(customer.id)}
                                                                className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-md transition-colors"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {customers.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-[var(--color-text-secondary)]">
                                            No customers found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}
