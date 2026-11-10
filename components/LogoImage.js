"use client";

import { useState } from "react";

export default function LogoImage({
  src = "/logo.png",
  alt = "المپیار",
  className = "",
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center font-bold text-[#002760] ${className}`}
      >
        المپیار
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
    />
  );
}