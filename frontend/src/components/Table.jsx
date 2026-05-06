import React from 'react';
import { motion } from 'framer-motion';

const Table = ({ headers, data, onEdit, onDelete, idKey }) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b-2 border-primary/50 text-gray-400 font-cinematic uppercase tracking-widest text-sm">
            {headers.map((h, i) => (
              <th key={i} className="py-4 px-4 font-normal">{h.label}</th>
            ))}
            {(onEdit || onDelete) && <th className="py-4 px-4 font-normal text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={headers.length + 1} className="py-8 text-center text-gray-500 italic">No data available.</td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <motion.tr 
                key={row[idKey] || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b border-white/10 hover:bg-white/5 transition-colors group"
              >
                {headers.map((h, i) => (
                  <td key={i} className={`py-4 px-4 ${i === 0 ? 'font-bold text-white' : 'text-gray-300'}`}>
                    {h.render ? h.render(row) : row[h.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="py-4 px-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex justify-end gap-3">
                      {onEdit && (
                        <button onClick={() => onEdit(row)} className="text-gray-400 hover:text-white transition-colors uppercase text-xs font-cinematic tracking-widest">
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button onClick={() => onDelete(row[idKey])} className="text-gray-400 hover:text-primary transition-colors uppercase text-xs font-cinematic tracking-widest">
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
