import {
X,
Mail,
Phone,
Building2,
Package,
Calendar,
MessageSquare,
} from "lucide-react";

const InquiryDetailsModal = ({
inquiry,
onClose,
}) => {

if (!inquiry) return null;

return (

  
<div
  className="
    fixed
    inset-0
    z-50
    bg-black/60
    backdrop-blur-sm
    flex
    items-center
    justify-center
    p-4
  "
>

  {/* MODAL */}

  <div
    className="
      relative
      bg-white
      rounded-3xl
      w-full
      max-w-3xl
      max-h-[90vh]
      overflow-y-auto
      shadow-2xl
    "
  >

    {/* CLOSE BUTTON */}

    <button

      onClick={onClose}

      className="
        absolute
        top-5
        right-5
        h-10
        w-10
        rounded-full
        bg-gray-100
        hover:bg-red-100
        flex
        items-center
        justify-center
        transition
      "
    >

      <X className="w-5 h-5" />

    </button>


    {/* HEADER */}

    <div
      className="
        p-8
        border-b
        border-gray-100
      "
    >

      <h2
        className="
          text-3xl
          font-bold
          text-[#021C57]
        "
      >
        Inquiry Details
      </h2>

      <p className="text-gray-500 mt-2">
        Complete customer inquiry information
      </p>

    </div>


    {/* CONTENT */}

    <div className="p-8 space-y-8">

      {/* CUSTOMER INFO */}

      <div>

        <h3
          className="
            text-xl
            font-semibold
            text-[#021C57]
            mb-5
          "
        >
          Customer Information
        </h3>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-5
          "
        >

          {/* NAME */}

          <div
            className="
              border
              border-gray-100
              rounded-2xl
              p-5
            "
          >

            <p className="text-sm text-gray-500">
              Customer Name
            </p>

            <h4
              className="
                mt-2
                font-semibold
                text-[#021C57]
              "
            >
              {inquiry.customerName}
            </h4>

          </div>


          {/* EMAIL */}

          <div
            className="
              border
              border-gray-100
              rounded-2xl
              p-5
            "
          >

            <div className="flex items-center gap-2">

              <Mail
                className="
                  w-4
                  h-4
                  text-gray-400
                "
              />

              <p className="text-sm text-gray-500">
                Email
              </p>

            </div>

            <h4
              className="
                mt-2
                font-semibold
                text-[#021C57]
              "
            >
              {inquiry.email}
            </h4>

          </div>


          {/* PHONE */}

          <div
            className="
              border
              border-gray-100
              rounded-2xl
              p-5
            "
          >

            <div className="flex items-center gap-2">

              <Phone
                className="
                  w-4
                  h-4
                  text-gray-400
                "
              />

              <p className="text-sm text-gray-500">
                Phone
              </p>

            </div>

            <h4
              className="
                mt-2
                font-semibold
                text-[#021C57]
              "
            >
              {inquiry.phone}
            </h4>

          </div>


          {/* COMPANY */}

          <div
            className="
              border
              border-gray-100
              rounded-2xl
              p-5
            "
          >

            <div className="flex items-center gap-2">

              <Building2
                className="
                  w-4
                  h-4
                  text-gray-400
                "
              />

              <p className="text-sm text-gray-500">
                Company
              </p>

            </div>

            <h4
              className="
                mt-2
                font-semibold
                text-[#021C57]
              "
            >
              {
                inquiry.company ||
                "N/A"
              }
            </h4>

          </div>

        </div>

      </div>


      {/* PRODUCT INFO */}

      <div>

        <h3
          className="
            text-xl
            font-semibold
            text-[#021C57]
            mb-5
          "
        >
          Product Information
        </h3>

        <div
          className="
            border
            border-gray-100
            rounded-3xl
            p-6
          "
        >

          <div className="flex items-start gap-4">

            <div
              className="
                h-14
                w-14
                rounded-2xl
                bg-blue-50
                flex
                items-center
                justify-center
              "
            >

              <Package
                className="
                  w-7
                  h-7
                  text-[#021C57]
                "
              />

            </div>


            <div className="flex-1">

              <h4
                className="
                  text-2xl
                  font-bold
                  text-[#021C57]
                "
              >
                {inquiry.productName}
              </h4>

              <p className="text-gray-500 mt-2">
                {inquiry.category}
              </p>


              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  gap-4
                "
              >

                <div
                  className="
                    px-4
                    py-2
                    rounded-full
                    bg-gray-100
                    text-sm
                  "
                >
                  Quantity:
                  {" "}
                  {inquiry.quantity}
                </div>


                <div
                  className="
                    px-4
                    py-2
                    rounded-full
                    bg-yellow-100
                    text-yellow-700
                    text-sm
                    capitalize
                  "
                >
                  {inquiry.status}
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* MESSAGE */}

      <div>

        <h3
          className="
            text-xl
            font-semibold
            text-[#021C57]
            mb-5
          "
        >
          Customer Message
        </h3>

        <div
          className="
            border
            border-gray-100
            rounded-3xl
            p-6
            bg-gray-50
          "
        >

          <div className="flex gap-3">

            <MessageSquare
              className="
                w-5
                h-5
                text-gray-400
                mt-1
              "
            />

            <p
              className="
                text-gray-700
                leading-relaxed
              "
            >
              {
                inquiry.message ||
                "No message provided"
              }
            </p>

          </div>

        </div>

      </div>


      {/* META */}

      <div>

        <h3
          className="
            text-xl
            font-semibold
            text-[#021C57]
            mb-5
          "
        >
          Inquiry Metadata
        </h3>

        <div
          className="
            border
            border-gray-100
            rounded-3xl
            p-6
          "
        >

          <div className="flex items-center gap-3">

            <Calendar
              className="
                w-5
                h-5
                text-gray-400
              "
            />

            <div>

              <p className="text-sm text-gray-500">
                Submitted On
              </p>

              <h4
                className="
                  font-semibold
                  text-[#021C57]
                  mt-1
                "
              >
                {
                  new Date(
                    inquiry.createdAt
                  ).toLocaleString()
                }
              </h4>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

</div>
  

);
};

export default InquiryDetailsModal;
