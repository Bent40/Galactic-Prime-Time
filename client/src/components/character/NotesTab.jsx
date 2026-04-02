export default function NotesTab({ state, update }) {
  return (
    <div className="panel" style={{ flex: 1 }}>
      <div className="panel-title">Notes & Logs</div>
      <div className="field-group" style={{ marginBottom: 14 }}>
        <label className="field-label">Character Notes</label>
        <textarea
          className="notes-ta"
          value={state.notes || ''}
          onChange={e => update(s => ({ ...s, notes: e.target.value }))}
          placeholder="Write anything here..."
        />
      </div>
      <div className="field-group">
        <label className="field-label">Condition Log</label>
        <textarea
          className="notes-ta"
          style={{ minHeight: 200 }}
          value={state.conditionLog || ''}
          onChange={e => update(s => ({ ...s, conditionLog: e.target.value }))}
          placeholder="Track conditions, damage events, story notes..."
        />
      </div>
    </div>
  );
}
