import { useState } from "react";
import Modal from "../common/Modal.jsx";
import { useEquipmentTypeStore } from "../../../store/useEquipmentTypeStore.js";

const EquipmentTypeModal = ({ isOpen, onClose }) => {
  const { addEquipmentType } = useEquipmentTypeStore();

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

      await addEquipmentType({ name });

      setSuccess("Created successfully");
      setName("");

      setTimeout(() => {
        onClose();
        setSuccess("");
      }, 800);

    } catch (err) {
      setError(err.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Equipment Type">
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Enter equipment type name"
        />

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="border px-4 py-2 rounded cursor-pointer">
            Cancel
          </button>

          <button disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
            {loading ? "Creating..." : "Create"}
          </button>
        </div>

      </form>
    </Modal>
  );
};

export default EquipmentTypeModal;