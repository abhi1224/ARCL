import { useEffect } from "react";

const CompanyProfile = () => {
  useEffect(() => {
    // Redirect directly to the separate standalone PDF file
    window.location.replace("/arclcompany.pdf");
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center">
      <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-lg font-bold">Opening ARCL Company Profile PDF...</p>
      <p className="text-sm text-slate-400 mt-2">
        If the PDF doesn't open automatically,{" "}
        <a
          href="/arclcompany.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 underline font-semibold"
        >
          click here to view PDF
        </a>.
      </p>
    </div>
  );
};

export default CompanyProfile;

