import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PaymentSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    accountName: "",
    accountNumber: "",
    network: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['payment-settings'],
    queryFn: async () => {
      console.log('Fetching payment settings...');
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching payment settings:', error);
        throw error;
      }
      console.log('Fetched payment settings:', data);
      return data;
    },
  });

  const addSettingMutation = useMutation({
    mutationFn: async () => {
      setIsSubmitting(true);
      console.log('Adding new payment setting:', formData);
      const { error } = await supabase
        .from('payment_settings')
        .insert({
          account_name: formData.accountName,
          account_number: formData.accountNumber,
          network: formData.network,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      console.log('Successfully added payment setting');
      queryClient.invalidateQueries({ queryKey: ['payment-settings'] });
      setFormData({ accountName: "", accountNumber: "", network: "" });
      toast({
        title: "Success",
        description: "Payment setting added successfully",
      });
    },
    onError: (error) => {
      console.error('Error adding payment setting:', error);
      toast({
        title: "Error",
        description: "Failed to add payment setting",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const deleteSettingMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting payment setting:', id);
      const { error } = await supabase
        .from('payment_settings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      console.log('Successfully deleted payment setting');
      queryClient.invalidateQueries({ queryKey: ['payment-settings'] });
      toast({
        title: "Success",
        description: "Payment setting deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting payment setting:', error);
      toast({
        title: "Error",
        description: "Failed to delete payment setting",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.accountName || !formData.accountNumber || !formData.network) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    addSettingMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Add Payment Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Account Name</label>
              <Input
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                placeholder="Account holder name"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Account Number</label>
              <Input
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                placeholder="Account number"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Network</label>
              <Input
                value={formData.network}
                onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                placeholder="e.g., MTN Mobile Money"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Account"
            )}
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Accounts</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Network</TableHead>
              <TableHead>Account Name</TableHead>
              <TableHead>Account Number</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {settings?.map((setting) => (
              <TableRow key={setting.id}>
                <TableCell className="font-medium">{setting.network}</TableCell>
                <TableCell>{setting.account_name}</TableCell>
                <TableCell>{setting.account_number}</TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Payment Account</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this payment account? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteSettingMutation.mutate(setting.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
            {(!settings || settings.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                  No payment accounts configured
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default PaymentSettings;