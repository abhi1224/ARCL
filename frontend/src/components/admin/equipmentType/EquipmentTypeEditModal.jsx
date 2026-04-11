import { useState, useEffect } from "react";
import Modal from "../common/Modal.jsx";
import { useEquipmentTypeStore } from "../../../store/useEquipmentTypeStore.js";

const EquipmentTypeEditModal = ({ isOpen, onClose, selected }) => {
  const { editEquipmentType } = useEquipmentTypeStore();

  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (selected) {
      setName(selected.name);
      setIsActive(selected.isActive);
    }
  }, [selected]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await editEquipmentType(selected._id, { name, isActive });

      setSuccess("Updated successfully");

      setTimeout(() => {
        onClose();
        setSuccess("");
      }, 800);

    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Equipment Type">

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <div className="flex gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <label>Active</label>
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="border px-3 py-1 rounded cursor-pointer">
            Cancel
          </button>

          <button disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
            {loading ? "Updating..." : "Update"}
          </button>
        </div>

      </form>
    </Modal>
  );
};

export default EquipmentTypeEditModal;