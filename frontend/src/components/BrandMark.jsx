export default function BrandMark() {
  return (
    <span className="brand-logo-crop" aria-hidden="true">
      <svg className="brand-logo-filter" aria-hidden="true" focusable="false">
        <defs>
          <filter id="archiranine-blue-key" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -1 -1 2 0 0"
            />
          </filter>
        </defs>
      </svg>
      <img src="/Gemini_Generated_Image_ik1lhdik1lhdik1l.jpg" alt="" />
    </span>
  );
}
