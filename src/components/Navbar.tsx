import React, { useContext } from 'react';
import Link from 'next/link';
import { UserContext } from '../context/UserContext';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const logout = userContext?.logout;

  return (
    <nav className="sticky top-0 border-b backdrop-blur-sm bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left side navigation */}
          <NavigationMenu.Root className="flex items-center">
            <NavigationMenu.List className="flex items-center space-x-4">
              <NavigationMenu.Item>
                <NavigationMenu.Link asChild>
                    <Link 
                    href="/" 
                    className={cn(
                      "text-foreground hover:text-primary",
                      "text-2xl font-bold text-gray-800"
                    )}
                    >
                    <h1> OnTime </h1> 
                    </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              {user && (
                <>
                  <NavigationMenu.Item>
                    <NavigationMenu.Link asChild>
                      <Link 
                        href="/dashboard" 
                        className={cn(
                          "text-foreground hover:text-primary",
                          "px-3 py-2 rounded-md text-sm font-medium"
                        )}
                      >
                        Dashboard
                      </Link>
                    </NavigationMenu.Link>
                  </NavigationMenu.Item>
                  <NavigationMenu.Item>
                    <NavigationMenu.Link asChild>
                      <Link 
                        href="/divisions" 
                        className={cn(
                          "text-foreground hover:text-primary",
                          "px-3 py-2 rounded-md text-sm font-medium"
                        )}
                      >
                        Divisions
                      </Link>
                    </NavigationMenu.Link>
                  </NavigationMenu.Item>
                </>
              )}
            </NavigationMenu.List>
          </NavigationMenu.Root>

          {/* Right side navigation */}
          <NavigationMenu.Root>
            <NavigationMenu.List>
              {user ? (
                <NavigationMenu.Item>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger className={cn(
                      "text-foreground hover:text-primary",
                      "px-3 py-2 rounded-md text-sm font-medium"
                    )}>
                      {user.username}
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content className="min-w-[160px] bg-background rounded-md p-1 shadow-md" align="end">
                        <DropdownMenu.Item className="outline-none">
                            <Link 
                            href={`/professors/${user.id}`} 
                            className="text-foreground hover:text-primary px-3 py-2 text-sm block w-full"
                            >
                            Profile
                            </Link>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className="outline-none">
                          <button 
                            onClick={logout}
                            className="text-foreground hover:text-primary px-3 py-2 text-sm w-full text-left"
                          >
                            Logout
                          </button>
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </NavigationMenu.Item>
              ) : (
                <NavigationMenu.Item>
                  <NavigationMenu.Link asChild>
                    <Link 
                      href="/login" 
                      className={cn(
                        "text-foreground hover:text-primary",
                        "px-3 py-2 rounded-md text-sm font-medium"
                      )}
                    >
                      Login
                    </Link>
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
              )}
            </NavigationMenu.List>
          </NavigationMenu.Root>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;