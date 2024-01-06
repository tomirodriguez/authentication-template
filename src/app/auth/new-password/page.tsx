import { CardWrapper } from "@/components/auth/card-wrapper";
import { NewPasswordForm } from "@/components/auth/new-password-form";
import { FormError } from "@/components/form-error";
import { Suspense } from "react";
import { BeatLoader } from "react-spinners";

const TokenVerificationLoader = async ({ token }: { token?: string }) => {
  if (!token) return <FormError message="No token provided." />;

  // const { error, success } = await newVerification(token);

  // if (error) return <FormError message={error} />;

  return (
    <div className="w-full">
      <NewPasswordForm token={token} />
    </div>
  );
};

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  return (
    <CardWrapper
      headerLabel="Enter a new password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex w-full items-center justify-center">
        <Suspense fallback={<BeatLoader />}>
          <TokenVerificationLoader token={searchParams.token} />
        </Suspense>
      </div>
    </CardWrapper>
  );
}
