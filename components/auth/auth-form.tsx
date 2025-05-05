import React from "react";
import AuthFooter from "./auth-footer";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import ProviderLogin from "./provider-login";

type AuthFormProps = {
  children: React.ReactNode;
  formTitle: string;
  showProvider: boolean;
  footerLabel: string;
  footerHref: string;
};
const AuthForm = ({
  children,
  formTitle,
  showProvider,
  footerHref,
  footerLabel,
}: AuthFormProps) => {
  return (
    <div className="mb-10">
      <Card>
        <CardHeader>
          <CardTitle>{formTitle}</CardTitle>
        </CardHeader>

        <CardContent>
          {children}
          {showProvider && <ProviderLogin />}
        </CardContent>
        <CardFooter>
          <AuthFooter footerHref={footerHref} footerLabel={footerLabel} />
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthForm;
