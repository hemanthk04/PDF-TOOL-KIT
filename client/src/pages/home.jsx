import React from "react";
import { Link } from "react-router-dom";
import { FilePdf, FileZip, LockSimple, Intersect, GithubLogoIcon } from "@phosphor-icons/react";

const tools = [
  {
    name: "Image to PDF",
    path: "/image-to-pdf",
    icon: <FilePdf size={48} weight="fill" />,
  },
  {
    name: "PDF to ZIP",
    path: "/pdf-to-zip",
    icon: <FileZip size={48} weight="fill" />,
  },
  {
    name: "Lock PDF",
    path: "/lock",
    icon: <LockSimple size={48} weight="fill" />,
  },
  {
    name: "Merge PDFs",
    path: "/merge",
    icon: <Intersect size={48}  />,
  },
];

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-2">
      {/* //navigation */}
      <div className="flex w-full justify-between px-4 font-bold text-xl mb-12">
        <p className="text-green-700 ">PDF Tool Kit</p>
        <a href="https://github.com/hemanthk04/"  className="bg-green-700 rounded-full p-2 hover:scale-110 transition-all duration-300">
          <GithubLogoIcon size={28} color="white" />
        </a>
      </div>

      {/* //heading */}
      <p className="font-bold text-4xl text-center">
        Your{" "}
        <span className="bg-green-700 px-1 py-[0.5] text-white">
          PDF Essentials
        </span>
        <br /> at a single place
      </p>
      {/* //Card container */}
      <div className="mt-16 mb-8 flex flex-wrap justify-center gap-8">
        {tools.map((tool) => (
          <Link
            key={tool.name}
            to={tool.path}
            className="bg-gradient-to-br from-green-800 to-green-700 text-white w-48 h-48 rounded-xl flex flex-col justify-center items-center shadow hover:scale-110 transition-all duration-300"
          >
            {tool.icon}
            <p className="mt-3 text-sm">{tool.name}</p>
          </Link>
        ))}
      </div>

      {/* //footer button */}
      <a
        className="mt-16 text-sm bg-green-800 rounded-full font-medium px-4 py-2 text-white hover:scale-110 transition-all duration-300 "
        href="https://github.com/hemanthk04"
      >
        Made by Hemanth
      </a>
    </div>
  );
};

export default Home;
