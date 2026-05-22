import {
useEffect,
useMemo,
useState,
} from "react";

import {
Search,
Trash2,
Eye,
Mail,
} from "lucide-react";

import { useContactStore }
from "../../store/useContactStore.js";

import ContactDetailsModal
from "../../components/admin/contact/ContactDetailsModal.jsx";

const ContactPage = () => {

const {

  
contacts = [],

loading,

error,

fetchContacts,

deleteContact,

updateStatus,
  

} = useContactStore();

// STATES

const [search, setSearch] =
useState("");

const [statusFilter,
setStatusFilter] =
useState("all");

const [
selectedContact,
setSelectedContact,
] = useState(null);

// FETCH

useEffect(() => {

  
fetchContacts();
  

}, []);

// FILTERED CONTACTS

const filteredContacts =
useMemo(() => {

  
return contacts.filter((item) => {

  const matchesSearch =

    item.name
      ?.toLowerCase()
      .includes(
        search.toLowerCase()
      )

    ||

    item.email
      ?.toLowerCase()
      .includes(
        search.toLowerCase()
      )

    ||

    item.subject
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
contacts,
search,
statusFilter,
]);

// DELETE

const handleDelete =
async (id) => {

  
const confirmDelete =
  window.confirm(
    "Delete this message?"
  );

if (!confirmDelete) return;

try {

  await deleteContact(id);

} catch (error) {

  console.log(error);

}
  

};

// UPDATE STATUS

const handleStatus =
async (id, status) => {

  
try {

  await updateStatus(
    id,
    status
  );

  fetchContacts();

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
    Loading messages...
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
          Contact Messages
        </h1>

        <p
          className="
            text-gray-500
            mt-2
          "
        >
          Manage all customer messages
        </p>

      </div>


      {/* SEARCH */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          gap-4
        "
      >

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
              Search message...
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
              sm:w-[320px]
            "
          />

        </div>


        {/* FILTER */}

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

          <option value="unread">
            Unread
          </option>

          <option value="read">
            Read
          </option>

          <option value="replied">
            Replied
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
          Total Messages
        </h2>

        <p
          className="
            text-4xl
            font-bold
            text-[#021C57]
            mt-3
          "
        >
          {contacts.length}
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
          Unread
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
            contacts.filter(
              (item) =>
                item.status ===
                "unread"
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
          Read
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
            contacts.filter(
              (item) =>
                item.status ===
                "read"
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
          Replied
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
            contacts.filter(
              (item) =>
                item.status ===
                "replied"
            ).length
          }
        </p>

      </div>

    </div>


    {/* TABLE */}

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
                Subject
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
              filteredContacts.map(
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
                        {item.name}
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


                  {/* SUBJECT */}

                  <td className="px-6 py-5">

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >

                      <Mail
                        className="
                          w-5
                          h-5
                          text-gray-400
                        "
                      />

                      <span>
                        {item.subject}
                      </span>

                    </div>

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
                        handleStatus(
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

                      <option value="unread">
                        Unread
                      </option>

                      <option value="read">
                        Read
                      </option>

                      <option value="replied">
                        Replied
                      </option>

                    </select>

                  </td>


                  {/* ACTIONS */}

                  <td className="px-6 py-5">

                    <div className="flex gap-3">

                      {/* VIEW */}

                      <button

                        onClick={() =>
                          setSelectedContact(
                            item
                          )
                        }

                        className="
                          h-10
                          w-10
                          rounded-xl
                          bg-blue-50
                          hover:bg-blue-100
                          text-blue-600
                          flex
                          items-center
                          justify-center
                        "
                      >

                        <Eye className="w-5 h-5" />

                      </button>


                      {/* DELETE */}

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
                          hover:bg-red-100
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


    {/* DETAILS MODAL */}

    {
      selectedContact && (

        <ContactDetailsModal

          contact={selectedContact}

          onClose={() =>
            setSelectedContact(null)
          }

        />

      )
    }

  </div>

</div>
  

);
};

export default ContactPage;
