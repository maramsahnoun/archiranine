export default function BrandMark() {
  return (
    <span className="brand-logo-crop" aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <img
        src="/logo.png"
        alt="ArchiRanin Logo"
        style={{ maxHeight: '36px', width: 'auto', objectFit: 'contain' }}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    </span>
  );
}
