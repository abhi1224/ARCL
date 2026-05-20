const ProductSidebar = ({
  categories,
  equipmentTypes,
  selectedCategory,
  setSelectedCategory,
  selectedEquipmentType,
  setSelectedEquipmentType,
}) => {
  return (
    <aside className="hidden lg:block w-[320px] shrink-0">

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-8">

        {/* EQUIPMENT TYPES */}
        <div>

            <div className="flex justify-between items-center border-b-2 py-2">
                        <h2 className="text-lg font-semibold text-[#021C57]">
                            Equipment Types
                        </h2>
                        <span className="h-6 w-6 rounded-full bg-[#021C57] text-white flex justify-center items-center">{equipmentTypes.length} </span>
            </div>
          <div className="space-y-2">
            <div className="overflow-y-auto max-h-52 my-5">
                {equipmentTypes.map((item) => (
              <button
                key={item._id}
                onClick={() =>
                  setSelectedEquipmentType(item.slug)
                }
                className={`
                  w-full
                  text-left
                  px-4
                  py-3
                  rounded-xl
                  transition
                  ${
                    selectedEquipmentType === item.slug
                      ? "bg-blue-50 text-[#021C57] border-l-4 border-[#021C57]"
                      : "hover:bg-gray-50"
                  }
                `}
              >
                {item.name}
              </button>
            ))}
            </div>
          </div>
        </div>
        
      </div>

      {/* CATEGORIES */}
        <div className="my-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-8">
            
            <div>
                <div className="flex justify-between items-center border-b-2 py-2">
                        <h2 className="text-lg font-semibold text-[#021C57]">
                            Categories
                        </h2>
                        <span className="h-6 w-6 rounded-full bg-[#021C57] text-white flex justify-center items-center">{categories.length} </span>
                </div>

            <div className="space-y-2 overflow-y-auto max-h-72 my-5">
                {categories.map((item) => (
                <button
                    key={item._id}
                    onClick={() =>
                    setSelectedCategory(item.slug)
                    }
                    className={`
                    w-full
                    text-left
                    px-4
                    py-3
                    rounded-xl
                    transition
                    ${
                        selectedCategory === item.slug
                        ? "bg-blue-50 text-[#021C57] border-l-4 border-[#021C57]"
                        : "hover:bg-gray-50"
                    }
                    `}
                >
                    {item.name}
                </button>
                ))}
            </div>

            </div>
        </div>
    </aside>
  )};
export default ProductSidebar;