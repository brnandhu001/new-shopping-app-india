import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { RootState, AppDispatch } from "../app/store";

import Modal from "../components/modal";
import ProductForm from "../components/ProductForm";

import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../feature/products/productApis";
import type { AppDispatch, RootState } from "../app/store";

function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();

  // read the whole product slice and derive the expected fields with fallbacks
  const productState = useSelector((state: RootState) => state.products);
  const products = (productState as any)?.products ?? (productState as any)?.items ?? [];
  const totalPages = (productState as any)?.totalPages ?? 1;

  // Sorting
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 5;

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] =
    useState<"add" | "edit" | "delete" | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Fetch products from API using Redux
  useEffect(() => {
    dispatch(fetchProducts(page, limit, sortField, sortOrder));
  }, [dispatch, page, limit, sortField, sortOrder]);

  const openAddModal = () => {
    setModalType("add");
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

const handleAddProduct = (data: any) => {
  dispatch(addProduct({ data }))
    .unwrap()
    .then(() => {
      setIsModalOpen(false); // Close modal
      dispatch(fetchProducts({ page, limit, sortField, sortOrder }));
    });
};


const handleUpdateProduct = (data: any) => {
  dispatch(updateProduct({ id: selectedProduct._id, data }))
    .unwrap()
    .then(() => {
      setIsModalOpen(false);
      dispatch(fetchProducts({ page, limit, sortField, sortOrder }));
    });
};


  const openEditModal = (product: any) => {
    setModalType("edit");
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const openDeleteModal = (product: any) => {
    setModalType("delete");
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

const handleDeleteConfirm = () => {
  dispatch(deleteProduct(selectedProduct._id))
    .unwrap()
    .then(() => {
      setIsModalOpen(false);
      dispatch(fetchProducts({ page, limit, sortField, sortOrder }));
    });
};


  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>

        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Product
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <tr>
              <th className="px-6 py-3">Image</th>

              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>

              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("price")}
              >
                Price{" "}
                {sortField === "price" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>

              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("category")}
              >
                Category{" "}
                {sortField === "category" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </th>

              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("stock")}
              >
                Stock{" "}
                {sortField === "stock" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>

              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {products?.map((item:any) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <img
                    src={item.image}
                    className="w-14 h-14 rounded-md object-cover"
                  />
                </td>

                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4 text-green-700">₹{item.price}</td>
                <td className="px-6 py-4">{item.category}</td>
                <td className="px-6 py-4">{item.stock}</td>

                <td className="px-6 py-4 flex gap-3 justify-center">
                  <button
                    onClick={() => openEditModal(item)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => openDeleteModal(item)}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2 mt-6">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        {[...Array(totalPages)]?.map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalType === "add"
            ? "Add Product"
            : modalType === "edit"
            ? "Edit Product"
            : "Delete Product"
        }
      >
        {modalType === "add" && (
          <ProductForm buttonLabel="Add Product" onSubmit={handleAddProduct} />
        )}

        {modalType === "edit" && selectedProduct && (
          <ProductForm
            initialValues={selectedProduct}
            buttonLabel="Update"
            onSubmit={handleUpdateProduct}
          />
        )}

        {modalType === "delete" && selectedProduct && (
          <div>
            <p>
              Are you sure you want to delete{" "}
              <b>{selectedProduct.name}</b>?
            </p>
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Dashboard;
