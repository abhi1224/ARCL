import { useEffect, useMemo, useState } from "react";

import {
Trash2,
Eye,
Search,
} from "lucide-react";

import { useInquiryStore }
from "../../store/useInquiryStore.js";

const InquiryPage = () => {

const {

  
inquiries = [],

loading,

error,

fetchInquiries,

updateStatus,

deleteInquiry,
  

} = useInquiryStore();

// SEARCH + FILTER STATES

const [search, setSearch] =
useState("");

const [statusFilter,
setStatusFilter] =
useState("all");

// FETCH DATA

useEffect(() => {

  
fetchInquiries();
  

}, []);

// FILTERED INQUIRIES

const filteredInquiries =
useMemo(() => {

  
return inquiries.filter((item) => {

  const matchesSearch =

    item.customerName
      ?.toLowerCase()
      .includes(
        search.toLowerCase()
      )

    ||

    item.productName
      ?.toLowerCase()
      .includes(
        search.toLowerCase()
      )

    ||

    item.email
      ?.toLowerCase()
      .includes(
        search.toLowerCase()
      );

  const matchesStatus =

    statusFilter === "all"

    ||

    item.status ===
    statusFilter;

  return (
    matchesSearch &&
    matchesStatus
  );

});
  

}, [
inquiries,
search,
statusFilter,
]);

// STATUS UPDATE

const handleStatusChange =
async (id, status) => {

  
try {

  await updateStatus(
    id,
    status
  );

  fetchInquiries();

} catch (error) {

  console.log(error);

}
  

};

// DELETE

const handleDelete =
async (id) => {

  
const confirmDelete =
  window.confirm(
    "Delete this inquiry?"
  );

if (!confirmDelete) return;

try {

  await deleteInquiry(id);

} catch (error) {

  console.log(error);

}
  

};

// LOADING

if (loading) {

  
return (

  <div
    className="
      min-h-screen
      flex
      items-center
      justify-center
      text-xl
      font-semibold
    "
  >
    Loading inquiries...
  </div>

);
  

}

// ERROR

if (error) {

  
return (

  <div
    className="
      min-h-screen
      flex
      items-center
      justify-center
      text-red-500
      text-xl
      font-semibold
    "
  >
    {error}
  </div>

);
  

}

return (

  
<div className="bg-gray-50 min-h-screen">

  <div
    className="
      max-w-[1600px]
      mx-auto
      px-4
      md:px-8
      py-10
    "
  >

    {/* HEADER */}

    <div
      className="
        flex
        flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-5
        mb-10
      "
    >

      <div>

        <h1
          className="
            text-4xl
            font-bold
            text-[#021C57]
          "
        >
          Inquiry Management
        </h1>

        <p
          className="
            text-gray-500
            mt-2
          "
        >
          Manage all customer inquiries
        </p>

      </div>


      {/* SEARCH + FILTER */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          gap-4
        "
      >

        {/* SEARCH */}

        <div className="relative">

          <Search
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              w-5
              h-5
              text-gray-400
            "
          />

          <input
            type="text"
            placeholder="
              Search inquiry...
            "
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="
              pl-12
              pr-4
              py-3
              border
              border-gray-200
              rounded-2xl
              outline-none
              bg-white
              w-full
              sm:w-[300px]
            "
          />

        </div>


        {/* STATUS FILTER */}

        <select

          value={statusFilter}

          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }

          className="
            border
            border-gray-200
            rounded-2xl
            px-5
            py-3
            outline-none
            bg-white
          "
        >

          <option value="all">
            All Status
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="contacted">
            Contacted
          </option>

          <option value="completed">
            Completed
          </option>

        </select>

      </div>

    </div>


    {/* STATS */}

    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-5
        mb-10
      "
    >

      <div
        className="
          bg-white
          rounded-3xl
          p-6
          border
          border-gray-100
        "
      >

        <h2 className="text-gray-500">
          Total
        </h2>

        <p
          className="
            text-4xl
            font-bold
            text-[#021C57]
            mt-3
          "
        >
          {inquiries.length}
        </p>

      </div>


      <div
        className="
          bg-white
          rounded-3xl
          p-6
          border
          border-gray-100
        "
      >

        <h2 className="text-gray-500">
          Pending
        </h2>

        <p
          className="
            text-4xl
            font-bold
            text-yellow-500
            mt-3
          "
        >
          {
            inquiries.filter(
              (item) =>
                item.status ===
                "pending"
            ).length
          }
        </p>

      </div>


      <div
        className="
          bg-white
          rounded-3xl
          p-6
          border
          border-gray-100
        "
      >

        <h2 className="text-gray-500">
          Contacted
        </h2>

        <p
          className="
            text-4xl
            font-bold
            text-blue-500
            mt-3
          "
        >
          {
            inquiries.filter(
              (item) =>
                item.status ===
                "contacted"
            ).length
          }
        </p>

      </div>


      <div
        className="
          bg-white
          rounded-3xl
          p-6
          border
          border-gray-100
        "
      >

        <h2 className="text-gray-500">
          Completed
        </h2>

        <p
          className="
            text-4xl
            font-bold
            text-green-500
            mt-3
          "
        >
          {
            inquiries.filter(
              (item) =>
                item.status ===
                "completed"
            ).length
          }
        </p>

      </div>

    </div>


    {/* EMPTY STATE */}

    {
      filteredInquiries.length === 0 && (

        <div
          className="
            bg-white
            rounded-3xl
            border
            border-gray-100
            py-20
            text-center
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              text-[#021C57]
            "
          >
            No inquiries found
          </h2>

          <p className="text-gray-500 mt-3">
            Try changing filters
          </p>

        </div>

      )
    }


    {/* TABLE */}

    {
      filteredInquiries.length > 0 && (

        <div
          className="
            bg-white
            rounded-3xl
            border
            border-gray-100
            overflow-hidden
          "
        >

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead
                className="
                  bg-[#021C57]
                  text-white
                "
              >

                <tr>

                  <th className="px-6 py-5 text-left">
                    Customer
                  </th>

                  <th className="px-6 py-5 text-left">
                    Product
                  </th>

                  <th className="px-6 py-5 text-left">
                    Phone
                  </th>

                  <th className="px-6 py-5 text-left">
                    Quantity
                  </th>

                  <th className="px-6 py-5 text-left">
                    Date
                  </th>

                  <th className="px-6 py-5 text-left">
                    Status
                  </th>

                  <th className="px-6 py-5 text-left">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {
                  filteredInquiries.map(
                    (item) => (

                    <tr
                      key={item._id}
                      className="
                        border-b
                        border-gray-100
                        hover:bg-gray-50
                      "
                    >

                      {/* CUSTOMER */}

                      <td className="px-6 py-5">

                        <div>

                          <h2
                            className="
                              font-semibold
                              text-[#021C57]
                            "
                          >
                            {
                              item.customerName
                            }
                          </h2>

                          <p
                            className="
                              text-sm
                              text-gray-500
                            "
                          >
                            {item.email}
                          </p>

                        </div>

                      </td>


                      {/* PRODUCT */}

                      <td className="px-6 py-5">

                        <div>

                          <h2
                            className="
                              font-medium
                            "
                          >
                            {
                              item.productName
                            }
                          </h2>

                          <p
                            className="
                              text-sm
                              text-gray-500
                            "
                          >
                            {
                              item.category
                            }
                          </p>

                        </div>

                      </td>


                      {/* PHONE */}

                      <td className="px-6 py-5">
                        {item.phone}
                      </td>


                      {/* QUANTITY */}

                      <td className="px-6 py-5">
                        {item.quantity}
                      </td>


                      {/* DATE */}

                      <td className="px-6 py-5">

                        {
                          new Date(
                            item.createdAt
                          ).toLocaleDateString()
                        }

                      </td>


                      {/* STATUS */}

                      <td className="px-6 py-5">

                        <select

                          value={item.status}

                          onChange={(e) =>
                            handleStatusChange(
                              item._id,
                              e.target.value
                            )
                          }

                          className="
                            border
                            border-gray-200
                            rounded-xl
                            px-4
                            py-2
                            outline-none
                          "
                        >

                          <option value="pending">
                            Pending
                          </option>

                          <option value="contacted">
                            Contacted
                          </option>

                          <option value="completed">
                            Completed
                          </option>

                        </select>

                      </td>


                      {/* ACTIONS */}

                      <td className="px-6 py-5">

                        <div className="flex gap-3">

                          <button
                            className="
                              h-10
                              w-10
                              rounded-xl
                              bg-blue-50
                              text-blue-600
                              flex
                              items-center
                              justify-center
                            "
                          >

                            <Eye className="w-5 h-5" />

                          </button>


                          <button

                            onClick={() =>
                              handleDelete(
                                item._id
                              )
                            }

                            className="
                              h-10
                              w-10
                              rounded-xl
                              bg-red-50
                              text-red-600
                              flex
                              items-center
                              justify-center
                            "
                          >

                            <Trash2 className="w-5 h-5" />

                          </button>

                        </div>

                      </td>

                    </tr>

                  ))
                }

              </tbody>

            </table>

          </div>

        </div>

      )
    }

  </div>

</div>
  

);
};

export default InquiryPage;
