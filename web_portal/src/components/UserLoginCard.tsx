
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserRole, AuthManager } from '@/lib/models/user';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { tickets, Film, user, users } from 'lucide-react';

interface UserLoginCardProps {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const UserLoginCard: React.FC<UserLoginCardProps> = ({ role, title, description, icon }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const authManager = AuthManager.getInstance();
  
  const handleLogin = () => {
    try {
      const user = authManager.loginUser(role);
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${user.name}!`,
      });
      
      // Redirect based on user role
      switch (role) {
        case UserRole.BUYER:
          navigate('/movies');
          break;
        case UserRole.SCREEN_OWNER:
          navigate('/dashboard/owner');
          break;
        case UserRole.DIRECTOR:
          navigate('/dashboard/director');
          break;
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card className="bg-cinema-gray border-cinema-gold/20 hover:border-cinema-gold/50 transition-all flex flex-col">
      <CardHeader>
        <div className="mb-4 w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="text-sm text-muted-foreground">
          <p>Sample account will be used</p>
          <p>No password required for demo</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleLogin}
          variant="outline"
        >
          Login as {title}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserLoginCard;
