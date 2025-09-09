import { FaGithub, FaLinkedin, FaEnvelope, FaPhoneAlt, FaCode } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-white/30 backdrop-blur-lg border-t border-purple-200 shadow-[0_-6px_24px_0_rgba(80,0,200,0.08)] py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left: Developer Identity */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <span className="font-extrabold text-2xl text-purple-900 tracking-wide">Vedant Dhepe</span>
          <span className="text-lg text-gray-800 font-semibold">Full Stack Web Developer</span>
        </div>
        {/* Middle: Contact Links */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-8">
            <a
              href="https://github.com/VedantDhepe"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Github"
              className="text-gray-700 hover:text-black transition"
            >
              <FaGithub size={32} />
            </a>
            <a
              href="https://www.linkedin.com/in/vedant-dhepe-460985252/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-[#0077b5] hover:text-blue-900 transition"
            >
              <FaLinkedin size={32} />
            </a>
            <a
              href="mailto:vedantdhepe101@gmail.com"
              aria-label="Email"
              className="text-red-500 hover:text-red-700 transition"
            >
              <FaEnvelope size={32} />
            </a>
            <a
              href="tel:+917972261841"
              aria-label="Phone"
              className="text-green-700 hover:text-green-900 transition"
            >
              <FaPhoneAlt size={30} />
            </a>
          </div>
          <div className="text-base text-gray-700 mt-2">
            vedantdhepe101@gmail.com &bull; +91-7972261841
          </div>
        </div>
        {/* Right: Dev Signature */}
        <div className="flex flex-col items-center md:items-end space-y-2 text-base text-gray-700">
          <span className="flex items-center gap-2">
            <FaCode className="mr-1" size={22} />
            <span className="font-bold">Coded to learn, built to grow</span>
          </span>
          <span className="text-gray-500 font-semibold">
            &copy; {new Date().getFullYear()} Vedant Dhepe
          </span>
        </div>
      </div>
    </footer>
  );
}
