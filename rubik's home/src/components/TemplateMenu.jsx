// src/components/TemplateMenu.jsx
import { useState, useEffect } from "react";
import { Save, Trash2, Layout, ArrowLeftFromLine } from "lucide-react";

const TemplateMenu = ({ isOpen, onClose, onLoadTemplate, scene }) => {
  const [templates, setTemplates] = useState([]);
  const [templateName, setTemplateName] = useState("");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const savedTemplates = localStorage.getItem("homeTemplates");
    if (savedTemplates) {
      try {
        setTemplates(JSON.parse(savedTemplates));
      } catch (error) {
        console.error("Error loading templates:", error);
        setTemplates([]);
      }
    }
  }, []);

  const saveTemplate = () => {
    if (!templateName.trim()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    try {
      // Save objects' data
      const savedObjects = {
        furniture: [],
        humans: [],
        walls: [],
      };

      scene.traverse((object) => {
        if (object.userData?.isFurniture) {
          savedObjects.furniture.push({
            type: object.userData.modelType,
            position: object.position.toArray(),
            rotation: object.rotation.toArray(),
            room: object.userData.room,
          });
        } else if (object.userData?.isHuman) {
          savedObjects.humans.push({
            position: object.position.toArray(),
            rotation: object.rotation.toArray(),
            room: object.userData.room,
          });
        } else if (object.userData?.isWall) {
          savedObjects.walls.push({
            position: object.position.toArray(),
            rotation: object.rotation.toArray(),
            id: object.userData.id,
          });
        }
      });

      const sceneTemplate = {
        name: templateName,
        timestamp: Date.now(),
        objects: savedObjects,
      };

      const newTemplates = [...templates, sceneTemplate];
      setTemplates(newTemplates);
      localStorage.setItem("homeTemplates", JSON.stringify(newTemplates));
      setTemplateName("");
    } catch (error) {
      console.error("Error saving template:", error);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const deleteTemplate = (index) => {
    try {
      const newTemplates = templates.filter((_, i) => i !== index);
      setTemplates(newTemplates);
      localStorage.setItem("homeTemplates", JSON.stringify(newTemplates));
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`fixed left-4 top-16 z-40 w-80 bg-black/30 backdrop-blur-2xl text-white 
                    shadow-2xl rounded-lg border border-white/10 transition-all duration-300 
                    ${
                      isOpen
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-4 opacity-0 pointer-events-none"
                    }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
            Save Scene
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeftFromLine className="w-5 h-5 text-white/70" />
          </button>
        </div>
      </div>

      {/* Save New Template */}
      <div className="p-4 border-b border-white/10">
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Scene name..."
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="flex-1 bg-white/10 rounded-lg px-3 py-2 text-sm 
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50
                       placeholder-white/30"
            />
            <button
              onClick={saveTemplate}
              disabled={!templateName.trim()}
              className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
            </button>
          </div>
          {showError && (
            <p className="text-red-400 text-sm">Please enter a scene name</p>
          )}
        </div>
      </div>

      {/* Templates List */}
      <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
        {templates.length === 0 ? (
          <div className="p-8 text-center text-white/50">
            <Layout className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No saved scenes</p>
            <p className="text-xs mt-1 text-white/30">
              Save your current scene to create a template
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {templates.map((template, index) => (
              <div
                key={template.timestamp}
                className="p-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white/90 truncate">
                      {template.name}
                    </h3>
                    <p className="text-xs text-white/50 mt-1">
                      {formatDate(template.timestamp)}
                    </p>
                    <div className="flex gap-2 mt-2 text-xs text-white/40">
                      <span>
                        {template.objects?.humans?.length || 0} humans
                      </span>
                      <span>•</span>
                      <span>
                        {template.objects?.furniture?.length || 0} furniture
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onLoadTemplate(template)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                      title="Load Scene"
                    >
                      <Layout className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                    </button>
                    <button
                      onClick={() => deleteTemplate(index)}
                      className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
                      title="Delete Scene"
                    >
                      <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateMenu;
