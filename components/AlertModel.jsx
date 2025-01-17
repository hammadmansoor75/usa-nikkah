export default function AlertModel({ isOpen, message, onClose }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white shadow-lg p-6 w-[300px] h-auto rounded-2xl">
            <h1 className="text-us_blue text-lg font-semibold" >USA Nikkah Message</h1>
          <p className="text-gray-800 text-md mt-2">{message}</p>
          <div className="flex items-center justify-end" >
          <button
            className="mt-4 px-4 py-2 bg-us_blue text-white rounded-full cursor-pointer focus:outline-none"
            onClick={onClose}
          >
            OK
          </button>
          </div>
        </div>
      </div>
    );
  }
  