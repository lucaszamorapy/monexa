interface IMonexaLoaderProps {
  size?: number;
}

const Loader = ({ size = 80 }: IMonexaLoaderProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Carregando"
      className="animate-monexa-loader"
    >
      <g fill="oklch(0.508 0.118 165.612)">
        <path d="M76 390V126C76 91 116 72 143 94L248 178Q257 185 267 178L373 94C401 72 440 91 440 126V143Q440 160 423 177L272 295Q256 307 240 294L154 225V390Q154 424 120 424H110Q76 424 76 390Z" />
        <path d="M278 424V327Q278 316 288 308L330 275Q345 265 345 282V408Q345 424 329 424Z" />
        <path d="M365 424V246Q365 235 375 226L423 189Q440 179 440 198V390Q440 424 406 424Z" />
      </g>
    </svg>
  );
};

export default Loader;
