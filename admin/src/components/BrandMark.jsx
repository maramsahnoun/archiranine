export default function BrandMark() {
  return (
    <span className="brand-logo-crop" aria-hidden="true">
      <img
        src={`${import.meta.env.BASE_URL}logo.png`}
        alt="ArchiRanin Logo"
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
    </span>
  );
}
