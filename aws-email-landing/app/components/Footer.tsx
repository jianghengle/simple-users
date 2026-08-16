export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Bee-Archi LLC. All rights reserved.
          </p>
          <p className="text-sm">
            AWS &amp; Robotics Solutions
          </p>
        </div>
      </div>
    </footer>
  );
}
