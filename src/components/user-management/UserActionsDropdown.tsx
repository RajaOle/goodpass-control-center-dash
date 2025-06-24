
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, AlertTriangle, Clock, UserX, Trash2, MessageSquare } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface UserData {
  id: string;
  name: string;
  email: string;
}

interface UserActionsDropdownProps {
  user: UserData;
  onAction: (action: string, userId: string) => void;
}

export const UserActionsDropdown: React.FC<UserActionsDropdownProps> = ({ user, onAction }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<string | null>(null);

  const actions = [
    { id: 'bad-score', label: 'Give Bad Score', icon: AlertTriangle, destructive: false },
    { id: 'suspend', label: 'Temporary Suspension', icon: Clock, destructive: true },
    { id: 'deactivate', label: 'Deactivate Account', icon: UserX, destructive: true },
    { id: 'delete', label: 'Delete Account', icon: Trash2, destructive: true },
    { id: 'warning', label: 'Send Warning', icon: MessageSquare, destructive: false },
  ];

  const handleActionClick = (actionId: string) => {
    const action = actions.find(a => a.id === actionId);
    if (action?.destructive) {
      setConfirmAction(actionId);
    } else {
      onAction(actionId, user.id);
    }
    setIsDropdownOpen(false);
  };

  const handleConfirmAction = () => {
    if (confirmAction) {
      onAction(confirmAction, user.id);
      setConfirmAction(null);
    }
  };

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="h-8 w-8 p-0"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
        
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-200 z-50">
            <div className="py-1">
              {actions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleActionClick(action.id)}
                  className={`flex items-center w-full px-4 py-2 text-sm hover:bg-slate-50 ${
                    action.destructive ? 'text-red-600 hover:text-red-700' : 'text-slate-700'
                  }`}
                >
                  <action.icon className="h-4 w-4 mr-2" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to perform this action on {user.name} ({user.email})? 
              This action may have serious consequences for the user's account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction} className="bg-red-600 hover:bg-red-700">
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
