export default function Footer() {
    return (
      <footer className="bg-[#f7f6f8] border-t border-gray-100">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <a 
            href="mailto:contact@openmats.studio" 
            className="mt-2 inline-block text-[#47159d] hover:underline"
          >
            Submit Correction
          </a>
          <p className="mt-4">© 2025 Open Mats • openmats.studio</p>
        </div>
      </footer>
    );
  }