import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const FormModal = ({ isOpen, onClose, title, fields, onSubmit, initialData }) => {
  const [formData, setFormData] = React.useState({});

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      const emptyData = fields.reduce((acc, field) => {
        acc[field.name] = '';
        return acc;
      }, {});
      setFormData(emptyData);
    }
  }, [initialData, fields, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-md z-50 p-6 glass-card border border-primary/50 shadow-[0_0_30px_rgba(255,46,46,0.2)]"
          >
            <div className="flex justify-between items-center mb-6 border-b border-primary/20 pb-4">
              <h2 className="text-2xl font-cinematic text-white tracking-wider">{title}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-primary transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {fields.map((field) => (
                <div key={field.name} className="flex flex-col gap-1">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-cinematic">{field.label}</label>
                  {field.type === 'select' ? (
                    <select
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      required={field.required !== false}
                      className="bg-black/50 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                    >
                      <option value="">Select...</option>
                      {field.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      required={field.required !== false}
                      className="bg-black/50 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}
              
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/10">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm uppercase tracking-wider font-cinematic text-gray-400 hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit" className="btn-glow text-sm py-2 px-6">
                  {initialData ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FormModal;
