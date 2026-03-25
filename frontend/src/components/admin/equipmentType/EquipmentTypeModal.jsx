import { useState } from "react";
import Modal from "../common/Modal.jsx";
import { createEquipmentType } from "../../../api/equipmentTypeApi.js";

const EquipmentTypeModal = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await createEquipmentType({ name });

      setSuccess("Equipment Type created successfully.");
      setName("");

      // refresh parent list
      onSuccess();

      // auto close after 1 sec
      setTimeout(() => {
        onClose();
        setSuccess("");
      }, 1000);

    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Equipment Type">

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Input */}
        <input
          type="text"
          placeholder="Enter equipment type name"
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {/* Success */}
        {success && (
          <p className="text-green-600 text-sm">{success}</p>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3">

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {loading ? "Creating..." : "Create"}
          </button>

        </div>
      </form>
    </Modal>
  );
};

export default EquipmentTypeModal;