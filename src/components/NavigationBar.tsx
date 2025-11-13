/**
 * סרגל ניווט עליון משותף להודעות וליומן
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserMenu from './UserMenu';

export default function NavigationBar() {
  const pathname = usePathname();
  
  const isCalendar = pathname?.startsWith('/calendar');
  const isMessages = pathname === '/' || pathname?.startsWith('/conversation');

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0 z-30" dir="rtl">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* טאבים - צד ימין */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm
                transition-all duration-200
                ${isMessages 
                  ? 'bg-indigo-100 text-indigo-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <span className="text-lg">💬</span>
              <span>הודעות</span>
            </Link>

            <Link
              href="/calendar"
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm
                transition-all duration-200
                ${isCalendar 
                  ? 'bg-indigo-100 text-indigo-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <span className="text-lg">📅</span>
              <span>יומן שבועי</span>
            </Link>
          </div>

          {/* תפריט משתמש - צד שמאל */}
          <div>
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}

