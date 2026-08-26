export default function PageContainer({ children, style }) {
  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 40, ...style }}>
        {children}
      </div>
    </div>
  );
}
