import React from "react";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* Left Section: Image */}
      <div className="hidden md:flex w-full md:w-1/2 h-96 md:h-screen items-center justify-center bg-gray-100">
        <Image
          src="/VAISHNOVASTRAVIBHAGIMG.png"
          alt="Login Visual"
          className="object-cover w-full h-full"
          width={800}
          height={1200}
        />
      </div>

      {/* Right Section: Auth Form */}
      <div className="flex w-full md:w-1/2 min-h-[400px] h-screen md:h-screen items-center justify-center bg-white">
        {children}
      </div>
    </div>
  );
}
