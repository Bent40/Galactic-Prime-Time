import { useState, useCallback } from 'react';

export function useToast() {
  const [toast, setToast] = useState({ msg: '', type: 'ok', show: false });
  const show = useCallback((msg, type = 'ok') => {
    setToast({ msg, type, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2500);
  }, []);
  return [toast, show];
}

export default function Toast({ toast }) {
  return (
    <div className={`toast${toast.type === 'err' ? ' err' : ''}${toast.show ? ' show' : ''}`}>
      {toast.msg}
    </div>
  );
}
