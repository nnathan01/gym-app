"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

// 🔥 STATUS + COUNTDOWN
const getMemberStatus = (startDate: string) => {
  const start = new Date(startDate);
  const now = new Date();

  const expiredDate = new Date(start);
  expiredDate.setDate(expiredDate.getDate() + 30);

  const diff = expiredDate.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days <= 0) return { status: "expired", days };
  if (days <= 3) return { status: "warning", days };
  return { status: "active", days };
};

export default function Home() {
  const [members, setMembers] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [packageType, setPackageType] = useState("Paket 1 - 250k");
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchMembers = async () => {
    const res = await fetch("/api/members");
    const data = await res.json();
    setMembers(data);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // =====================
  // 🔥 NOTIFIKASI
  // =====================
  const expiringSoon = members.filter((m) => {
    const result = getMemberStatus(m.startDate);
    return result.status === "warning";
  });

  // =====================
  // 🔥 STATISTIK
  // =====================
  const totalMember = members.length;
  const paidMember = members.filter((m) => m.isPaid).length;
  const unpaidMember = members.filter((m) => !m.isPaid).length;

  // =====================
  // CRUD
  // =====================
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        package: packageType,
      }),
    });

    setName("");
    setEmail("");
    fetchMembers();
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/members", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchMembers();
  };

  const startEdit = (m: any) => {
    setEditingId(m.id);
    setName(m.name);
    setEmail(m.email);
    setPackageType(m.package);
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();

    await fetch("/api/members", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingId,
        name,
        email,
        package: packageType,
        isPaid: false,
      }),
    });

    setEditingId(null);
    setName("");
    setEmail("");
    fetchMembers();
  };

  const markAsPaid = async (m: any) => {
    await fetch("/api/members", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...m,
        isPaid: true,
      }),
    });

    fetchMembers();
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-10 bg-gray-100 min-h-screen">
        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>

          <div className="space-x-2">
            {/* 🔥 EXPORT BUTTON */}
            <button
              onClick={() => {
                window.open("/api/export");
              }}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Export Excel
            </button>

            <button
              onClick={handleLogout}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {/* ===================== */}
        {/* 🚨 NOTIFIKASI ALERT */}
        {/* ===================== */}
        {expiringSoon.length > 0 && (
          <div className="bg-red-500 text-white p-4 rounded mb-6">
            ⚠️ {expiringSoon.length} member akan expired dalam 3 hari!
          </div>
        )}

        {/* ===================== */}
        {/* 🔥 LIST WARNING */}
        {/* ===================== */}
        {expiringSoon.length > 0 && (
          <div className="bg-white p-4 rounded shadow mb-8">
            <h2 className="font-semibold mb-3">
              Member Hampir Expired
            </h2>

            <ul className="space-y-2">
              {expiringSoon.map((m) => {
                const result = getMemberStatus(m.startDate);

                return (
                  <li
                    key={m.id}
                    className="flex justify-between border p-2 rounded"
                  >
                    <span>
                      {m.name} - {result.days} hari lagi
                    </span>

                    {!m.isPaid && (
                      <button
                        onClick={() => markAsPaid(m)}
                        className="bg-green-600 text-white px-2 py-1 rounded"
                      >
                        Bayar
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* ===================== */}
        {/* 🔥 STATISTIK */}
        {/* ===================== */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded shadow">
            <h3>Total Member</h3>
            <p className="text-3xl font-bold">{totalMember}</p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-green-500">Sudah Bayar</h3>
            <p className="text-3xl font-bold">{paidMember}</p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-red-500">Belum Bayar</h3>
            <p className="text-3xl font-bold">{unpaidMember}</p>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white p-6 rounded shadow mb-8">
          <form
            onSubmit={editingId ? handleUpdate : handleSubmit}
            className="grid grid-cols-3 gap-4"
          >
            <input
              type="text"
              placeholder="Nama"
              className="border p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              className="border p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <select
              className="border p-2"
              value={packageType}
              onChange={(e) => setPackageType(e.target.value)}
            >
              <option>Paket 1 - 250k</option>
              <option>Paket 2 - 300k + Treadmill</option>
            </select>

            <button className="bg-blue-500 text-white px-4 py-2 col-span-3">
              {editingId ? "Update" : "Tambah"}
            </button>
          </form>
        </div>

        {/* TABLE */}
        <div className="bg-white p-6 rounded shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th>Nama</th>
                <th>Email</th>
                <th>Paket</th>
                <th>Status</th>
                <th>Pembayaran</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {members.map((m) => {
                const result = getMemberStatus(m.startDate);

                return (
                  <tr key={m.id} className="border-b">
                    <td>{m.name}</td>
                    <td>{m.email}</td>
                    <td>{m.package}</td>

                    <td>
                      {result.status === "active" && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded">
                          Aktif
                        </span>
                      )}
                      {result.status === "warning" && (
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded">
                          {result.days} hari lagi
                        </span>
                      )}
                      {result.status === "expired" && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded">
                          Expired
                        </span>
                      )}
                    </td>

                    <td>
                      {m.isPaid ? (
                        <span className="bg-green-500 text-white px-2 py-1 rounded">
                          Lunas
                        </span>
                      ) : (
                        <span className="bg-red-500 text-white px-2 py-1 rounded">
                          Belum
                        </span>
                      )}
                    </td>

                    <td className="space-x-2">
                      {!m.isPaid && (
                        <button
                          onClick={() => markAsPaid(m)}
                          className="bg-green-600 text-white px-2 py-1 rounded"
                        >
                          Bayar
                        </button>
                      )}

                      <button
                        onClick={() => startEdit(m)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(m.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}