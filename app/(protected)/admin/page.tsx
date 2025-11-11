"use client";

import { admin } from "@/actions/admin";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";
import { FormError } from "@/components/form-error";
import { useState } from "react";

 const AdminPage = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const onServerActionClick = () => {
        admin().then((data) => {
            if (data.error) {
            setError(data.error)
            } 
            if (data.success) {
                setSuccess(data.success);
            }
        })
    }
    const onApiRouteClick = () => {
        fetch("/api/admin").then((response) => {
           if(response.ok) {
            toast.success("Allowed API Route!");
           } else{
            toast.error("Forbidden API Route!");
           }
        })
    }
    return (
        <Card className="w-[500px]">
           <CardHeader>
             <p className="text-2xl font-semibold text-center ">Admin</p>
           </CardHeader>
           <CardContent className="space-y-4 ">
             <RoleGate allowedRole={UserRole.ADMIN}>
                <FormSuccess message="You are allowed to see this content"/>
             </RoleGate>
             <div className="flex flex-row items-center justify-between rounded-lg 
             border-lg border p-3 shadow-md">
              <p className="text-sm font-medium">
               Admin-only API Route
              </p>
              
              <Button onClick={onApiRouteClick}>
                Click to test
              </Button>
             </div>
             <div className="flex flex-row items-center justify-between rounded-lg 
             border-lg border p-3 shadow-md">
              <p className="text-sm font-medium">
               Admin-only Server Action
              </p>
              <Button onClick={onServerActionClick}>
                Click to test
              </Button>
             </div>
             <div className="flex flex-row items-center justify-between rounded-lg 
             border-lg border p-3 shadow-md">
                
                <FormError message={error }/>
                <FormSuccess message={success}/>

             </div>
           </CardContent>
        </Card>
    )
}
export default AdminPage;