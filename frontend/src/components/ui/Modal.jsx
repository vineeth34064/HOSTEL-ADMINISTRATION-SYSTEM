import React from 'react';
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <div className="hms-modal w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="hms-modal-header">
          <h2 className="hms-modal-title">{title}</h2>
          <button onClick={onClose} className="hms-modal-close">&times;</button>
        </div>
        <div className="hms-modal-body">{children}</div>
      </div>
    </div>);
};
export default Modal;
