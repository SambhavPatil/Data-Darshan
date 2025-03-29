import React from 'react';
import { BarChart3} from 'lucide-react';

const Header: React.FC = () => {
  return (
    <div className="bg-gray-50">
      <div className="flex flex-row items-center justify-between p-4 bg-white shadow-sm">
        <div className="flex flex-row items-center">
          <h1 className="ml-2 text-3xl font-bold text-black"><BarChart3 className="h-8 w-8 text-black" /> Data Darshan</h1>
        </div>
        
      </div>
    </div>
  );
};

export default Header;