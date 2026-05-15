function StatusAlert({ error, message }) {
  if (!error && !message) return null;
  return (
    <div className={`alert ${error ? 'alert-danger' : 'alert-success'}`}>
      {error || message}
    </div>
  );
}
export default StatusAlert;
