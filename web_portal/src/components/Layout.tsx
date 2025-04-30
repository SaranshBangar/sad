
import React, { ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AuthManager } from '@/lib/models/user';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const authManager = AuthManager.getInstance();
  const user = authManager.getCurrentUser();
  
  const handleLogout = () => {
    authManager.logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-cinema-dark">
      {/* Header */}
      <header className="bg-cinema-gray border-b border-cinema-gold/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-cinema-gold">
                CineNexus
              </span>
            </a>
            
            <div className="flex items-center space-x-6">
              <nav>
                <ul className="hidden md:flex items-center space-x-6">
                  <li>
                    <a href="/" className="text-cinema-light hover:text-cinema-gold transition-colors">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="/movies" className="text-cinema-light hover:text-cinema-gold transition-colors">
                      Movies
                    </a>
                  </li>
                  <li>
                    <a href="/theaters" className="text-cinema-light hover:text-cinema-gold transition-colors">
                      Theaters
                    </a>
                  </li>
                </ul>
              </nav>
              
              <div className="flex items-center space-x-3">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <div className="hidden md:block">
                      <span className="text-sm text-cinema-gold font-medium">
                        {user.name} ({user.role})
                      </span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="cinema-button-outline"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <a href="/login" className="cinema-button">
                    Login
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-cinema-gray border-t border-cinema-gold/20 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold text-cinema-gold">CineNexus</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 CineNexus. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
