
import React from 'react';
import Layout from '@/components/Layout';
import UserLoginCard from '@/components/UserLoginCard';
import { UserRole } from '@/lib/models/user';
import { Film, Ticket, User, Users } from 'lucide-react';

const Login = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome to CineNexus</h1>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          Please select your role to continue. For this demo, you can log in directly with sample credentials.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <UserLoginCard
            role={UserRole.BUYER}
            title="Movie Fan"
            description="Book tickets and enjoy the latest releases"
            icon={<Ticket className="h-8 w-8 text-primary" />}
          />
          
          <UserLoginCard
            role={UserRole.SCREEN_OWNER}
            title="Theater Owner"
            description="Manage your screens and movie schedules"
            icon={<Users className="h-8 w-8 text-primary" />}
          />
          
          <UserLoginCard
            role={UserRole.DIRECTOR}
            title="Director"
            description="Submit your films and track their performance"
            icon={<Film className="h-8 w-8 text-primary" />}
          />
        </div>
        
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>This is a demo application with sample data and user accounts.</p>
          <p>No real authentication is performed.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
