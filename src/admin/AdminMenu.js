import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";

function AdminMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [show, setShow] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Main Courses",
    image: null,
  });

  // 📌 جلب المنيو
  const fetchMenu = async () => {
    const res = await fetch(
      "https://web2-with-backend.onrender.com/api/admin/menu",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    if (data.success) setMenuItems(data.items);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // 📌 إرسال البيانات (إضافة/تعديل)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((field) => {
      if (formData[field]) data.append(field, formData[field]);
    });

    const url = editingItem
      ? `https://web2-with-backend.onrender.com/api/admin/menu/${editingItem.id}`
      : "https://web2-with-backend.onrender.com/api/admin/menu";

    const method = editingItem ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    });

    setShow(false);
    setEditingItem(null);
    setFormData({ name: "", description: "", price: "", category: "Main Courses", image: null });
    fetchMenu();
  };

  // ❌ حذف عنصر
  const removeItem = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    await fetch(
      `https://web2-with-backend.onrender.com/api/admin/menu/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    fetchMenu();
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">🍽️ Admin Menu Panel</h2>

      <button className="btn btn-success mb-3" onClick={() => setShow(true)}>
        ➕ Add New Menu Item
      </button>

      <table className="table table-bordered table-striped text-center">
        <thead className="table-dark">
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map((item) => (
            <tr key={item.id}>
              <td>
                <img
                  src={
                    item.image
                      ? `https://web2-with-backend.onrender.com${item.image}`
                      : "https://via.placeholder.com/50"
                  }
                  width="60"
                  height="60"
                  className="rounded"
                  style={{ objectFit: "cover" }}
                />
              </td>
              <td>{item.name}</td>
              <td>${item.price}</td>
              <td>{item.category}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => {
                    setEditingItem(item);
                    setFormData(item);
                    setShow(true);
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeItem(item.id)}
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 📌 Modal/Form */}
      {show && (
        <div className="card p-4 shadow-lg mt-4">
          <h4>{editingItem ? "✏️ Edit Item" : "➕ Add Item"}</h4>

          <form className="mt-3" onSubmit={handleSubmit}>
            <input
              className="form-control mb-2"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <textarea
              className="form-control mb-2"
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />

            <input
              type="number"
              step="0.01"
              className="form-control mb-2"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />

            <select
              className="form-control mb-2"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option>Main Courses</option>
              <option>Pizza</option>
              <option>Pasta</option>
              <option>Drinks</option>
              <option>Dessert</option>
            </select>

            <input
              type="file"
              className="form-control mb-3"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
            />

            <button className="btn btn-primary w-100">💾 Save</button>
            <button
              type="button"
              className="btn btn-secondary w-100 mt-2"
              onClick={() => {
                setShow(false);
                setEditingItem(null);
              }}
            >
              ❌ Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminMenu;
