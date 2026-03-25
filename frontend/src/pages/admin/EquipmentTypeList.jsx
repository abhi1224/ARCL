import { useEffect, useState } from "react";
import { getEquipmentTypes } from "../../api/equipmentTypeApi.js";

const EquipmentTypeList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getEquipmentTypes();
    setData(res.data);
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Equipment Types</h1>

      <table className="w-full bg-white shadow">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.isActive ? "Active" : "Inactive"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EquipmentTypeList;