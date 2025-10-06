export default function Header() {
    return (
      <header className="sticky top-0 z-50 bg-[#f7f6f8]/80 dark:bg-[#171121]/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <a href="#" className="text-2xl font-bold text-[#47159d] dark:text-white">
                Open Mats
              </a>
            </div>
            <p className="hidden md:block text-sm text-gray-500 dark:text-gray-400">
              Austin's BJJ Open Mat Hub
            </p>
          </div>
        </div>
      </header>
    );
  }