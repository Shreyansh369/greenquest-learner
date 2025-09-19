import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { 
  Home, 
  ShoppingBag, 
  Wallet, 
  Trophy, 
  User,
  GraduationCap
} from 'lucide-react';

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, getPendingSubmissions, settings } = useStore();
  
  const pendingSubmissions = getPendingSubmissions();
  
  const navItems = [
    { 
      icon: Home, 
      label: 'Home', 
      path: '/home',
      active: location.pathname === '/' || location.pathname === '/home'
    },
    { 
      icon: ShoppingBag, 
      label: 'Store', 
      path: '/marketplace',
      active: location.pathname === '/marketplace'
    },
    { 
      icon: Wallet, 
      label: 'Wallet', 
      path: '/wallet',
      active: location.pathname === '/wallet'
    },
    { 
      icon: Trophy, 
      label: 'Ranks', 
      path: '/leaderboard',
      active: location.pathname === '/leaderboard'
    },
    { 
      icon: User, 
      label: 'Profile', 
      path: '/profile',
      active: location.pathname === '/profile'
    }
  ];

  // Add teacher item if user is a teacher
  if (currentUser?.type === 'teacher') {
    navItems.splice(1, 0, {
      icon: GraduationCap,
      label: 'Teacher',
      path: '/teacher',
      active: location.pathname === '/teacher'
    });
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;
            
            return (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center gap-1 h-auto py-2 px-3 relative ${
                  isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                }`}
                onClick={() => navigate(item.path)}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
                
                {/* Show badge for teacher with pending submissions */}
                {item.path === '/teacher' && pendingSubmissions.length > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {pendingSubmissions.length}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;