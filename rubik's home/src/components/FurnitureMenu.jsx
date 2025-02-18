import { useState, useCallback } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  X,
  ArrowLeftFromLine,
} from "lucide-react";

const FURNITURE_CATEGORIES = {
  "Living Room": {
    items: [
      {
        id: "Sofa_Leather",
        name: "Leather Sofa",
        preview: "/src/assets/models/furniture/Sofa_Leather.png",
      },
      {
        id: "Sofa_Modern",
        name: "Modern Sofa",
        preview: "/src/assets/models/furniture/Sofa_Modern.png",
      },
      {
        id: "Sofa_Simple",
        name: "Simple Sofa",
        preview: null,
      },
      {
        id: "Sofa_Small",
        name: "Small Sofa",
        preview: null,
      },
      {
        id: "Chair_Leather",
        name: "Leather Chair",
        preview: null,
      },
      {
        id: "Chair_Modern",
        name: "Modern Chair",
        preview: null,
      },
      {
        id: "Armchair",
        name: "Armchair",
        preview: null,
      },
      {
        id: "ArmChair_Leather",
        name: "Leather Armchair",
        preview: null,
      },
      {
        id: "Table_Modern",
        name: "Modern Coffee Table",
        preview: null,
      },
      {
        id: "Table_Modern2",
        name: "Modern Side Table",
        preview: null,
      },
      {
        id: "Table_Simple",
        name: "Simple Table",
        preview: null,
      },
      {
        id: "Table_Small",
        name: "Small Table",
        preview: null,
      },
      {
        id: "Table_Office",
        name: "Office Table",
        preview: null,
      },
      {
        id: "Lamp",
        name: "Floor Lamp",
        preview: null,
      },
      {
        id: "tv_wall",
        name: "Wall TV",
        preview: null,
      },
      {
        id: "beanBag",
        name: "Bean Bag",
        preview: null,
      },
    ],
    icon: "🛋️",
  },
  Bedroom: {
    items: [
      {
        id: "Bed_Modern",
        name: "Modern Bed",
        preview: null,
      },
      {
        id: "bed_Small",
        name: "Small Bed",
        preview: null,
      },
      {
        id: "Drawer",
        name: "Drawer",
        preview: null,
      },
      {
        id: "Drawer_Modern",
        name: "Modern Drawer",
        preview: null,
      },
      {
        id: "Drawer_With_Lamp",
        name: "Drawer with Lamp",
        preview: null,
      },
      {
        id: "dresser",
        name: "Dresser",
        preview: null,
      },
      {
        id: "closet",
        name: "Wardrobe",
        preview: null,
      },
    ],
    icon: "🛏️",
  },
  Kitchen: {
    items: [
      {
        id: "Kitchen_table",
        name: "Dining Table",
        preview: null,
      },
      {
        id: "chair_Kitchen",
        name: "Dining Chair",
        preview: null,
      },
      {
        id: "Cabinet",
        name: "Cabinet",
        preview: null,
      },
      {
        id: "Sink_Kitchen",
        name: "Kitchen Sink",
        preview: null,
      },
      {
        id: "Oven",
        name: "Oven",
        preview: null,
      },
      {
        id: "fridge",
        name: "Refrigerator",
        preview: null,
      },
      {
        id: "washing_machine",
        name: "Washing Machine",
        preview: null,
      },
    ],
    icon: "🍳",
  },
  Bathroom: {
    items: [
      {
        id: "Toilet",
        name: "Toilet",
        preview: null,
      },
    ],
    icon: "🚽",
  },
};

const FurnitureItem = ({ item, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative z-20 p-4 bg-white/10 rounded-xl backdrop-blur-md border border-white/20 
                 hover:bg-white/20 transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(item.id)}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("furniture", item.id);
        onSelect(item.id);
      }}
    >
      <div className="h-40 w-full rounded-lg overflow-hidden mb-3 bg-gradient-to-b from-white/5 to-white/10">
        <div
          className={`w-full h-full transition-transform duration-300 ${
            isHovered ? "scale-105" : ""
          }`}
        >
          {item.preview ? (
            <img
              src={item.preview}
              alt={item.name}
              className="w-full h-full object-contain "
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-white/30 text-sm">No preview available</div>
            </div>
          )}
        </div>
      </div>
      <h3 className="text-white/90 font-medium">{item.name}</h3>
      <div
        className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 
                    transition-opacity rounded-xl pointer-events-none"
      />
    </div>
  );
};

const FurnitureCategory = ({
  name,
  items,
  icon,
  isExpanded,
  onToggle,
  onSelect,
}) => {
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        className="w-full px-6 py-4 flex items-center justify-between text-white/90 
                   hover:bg-white/5 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <span className="font-medium">{name}</span>
          <span className="text-sm text-white/50">({items.length})</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-white/50" />
        ) : (
          <ChevronRight className="w-5 h-5 text-white/50" />
        )}
      </button>
      {isExpanded && (
        <div className="p-4 grid grid-cols-2 gap-4">
          {items.map((item) => (
            <FurnitureItem key={item.id} item={item} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

const FurnitureMenu = ({ onFurnitureSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState("Living Room");
  const [searchQuery, setSearchQuery] = useState("");

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return (
    <>
      {/* Add Furniture Button */}
      <button
        onClick={() => setIsExpanded(true)}
        className={`fixed left-4 top-4 z-20 bg-gradient-to-r from-blue-500 to-cyan-500 
                   text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl 
                   transition-all duration-300 hover:scale-105 active:scale-95
                   ${
                     isExpanded
                       ? "opacity-0 pointer-events-none"
                       : "opacity-100"
                   }`}
      >
        Add Furniture
      </button>

      {/* Menu Panel */}
      <div
        className={`fixed left-0 top-0 z-50 h-screen w-96 bg-black/30 backdrop-blur-2xl 
                   text-white shadow-2xl flex flex-col border-r border-white/10
                   transition-all duration-300 ease-in-out
                   ${isExpanded ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
              Furniture Library
            </h2>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeftFromLine className="w-5 h-5 text-white/70" />
            </button>
          </div>
          <div className="relative mt-4">
            <input
              type="text"
              placeholder="Search furniture..."
              className="w-full bg-white/10 rounded-xl px-4 py-2 pl-10 pr-10 text-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50
                     placeholder-white/30 backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/30" />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-2.5 text-white/30 hover:text-white/50"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {Object.entries(FURNITURE_CATEGORIES).map(([name, category]) => (
            <FurnitureCategory
              key={name}
              name={name}
              items={category.items.filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
              )}
              icon={category.icon}
              isExpanded={expandedCategory === name}
              onToggle={() =>
                setExpandedCategory(expandedCategory === name ? null : name)
              }
              onSelect={onFurnitureSelect}
            />
          ))}
        </div>
        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          <p className="text-sm text-white/50 text-center">
            Drag and drop furniture into the scene
          </p>
        </div>
      </div>
    </>
  );
};

export default FurnitureMenu;
