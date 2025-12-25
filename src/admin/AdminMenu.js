import { useEffect, useState } from "react";

function AdminMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [show, setShow] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Main Courses",
    image: null
  });

  // 🔥 خليه جاهز للتعديل إذا غيرت السيرفر
  const API = "https://web2-with-backend.onrender.com";
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    const res = await fetch(`${API}/api/admin/menu`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) setMenuItems(data.items);
  };

  const submit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((k) => {
      if (formData[k]) data.append(k, formData[k]);
    });

    const url = editingItem
      ? `${API}/api/admin/menu/${editingItem.id}`
      : `${API}/api/admin/menu`;

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

  const remove = async (id) => {
    if (!window.confirm("Delete item?")) return;

    await fetch(`${API}/api/admin/menu/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchMenu();
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 fw-bold text-center">🍽️ Admin Menu Panel</h2>

      <div className="text-end mb-3">
        <button className="btn btn-success" onClick={() => setShow(true)}>
          ➕ Add New Menu Item
        </button>
      </div>

      <table className="table table-striped text-center align-middle">
        <thead className="table-dark">
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th width="180px">Actions</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map((i) => (
            <tr key={i.id}>
              <td>
                <img
                  src={i.image?.startsWith("http")
                    ? i.image
                    : `${API}${i.image}`}
                  width="70"
                  height="70"
                  style={{ objectFit: "cover", borderRadius: "8px" }}
                  alt=""
                />
              </td>
              <td>{i.name}</td>
              <td>${i.price}</td>
              <td>{i.category}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => {
                    setEditingItem(i);
                    setShow(true);
                    setFormData(i);
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => remove(i.id)}
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {show && (
        <div className="card p-4 mt-4">
          <h4 className="mb-3">{editingItem ? "✏️ Edit Item" : "➕ Add Item"}</h4>

          <form onSubmit={submit}>
            <input
              className="form-control mb-2"
              placeholder="Name"
              value={formData.name || ""}
              onChange={(e)=>setFormData({...formData,name:e.target.value})}
              required
            />

            <textarea
              className="form-control mb-2"
              placeholder="Description"
              value={formData.description || ""}
              onChange={(e)=>setFormData({...formData,description:e.target.value})}
              required
            />

            <input
              className="form-control mb-2"
              type="number"
              step="0.01"
              placeholder="Price"
              value={formData.price || ""}
              onChange={(e)=>setFormData({...formData,price:e.target.value})}
              required
            />

            <select
              className="form-select mb-2"
              value={formData.category}
              onChange={(e)=>setFormData({...formData,category:e.target.value})}
            >
              <option>Main Courses</option>
              <option>Pizza</option>
              <option>Desserts</option>
              <option>Appetizers</option>
              <option>Beverages</option>
            </select>

            <input
              type="file"
              className="form-control mb-3"
              onChange={(e)=>setFormData({...formData,image:e.target.files[0]})}
              accept="image/*"
            />

            <button className="btn btn-primary w-100 mb-2">
              💾 {editingItem ? "Update" : "Save"}
            </button>
            <button className="btn btn-secondary w-100" onClick={()=>setShow(false)}>❌ Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminMenu;
