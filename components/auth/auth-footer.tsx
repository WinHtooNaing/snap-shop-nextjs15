import Link from "next/link";
import { Button } from "../ui/button";

type AuthFooterProps = {
  footerHref: string;
  footerLabel: string;
};
const AuthFooter = ({ footerHref, footerLabel }: AuthFooterProps) => {
  return (
    <Button asChild variant={"link"} className="w-full">
      <Link href={footerHref}>{footerLabel}</Link>
    </Button>
  );
};

export default AuthFooter;